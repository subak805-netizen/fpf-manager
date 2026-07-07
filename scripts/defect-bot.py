#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# FPF 불량 비서봇 v1 (테스트판) — 텔레그램으로 불량 사진을 받으면 AI로 정리해 버튼을 주고,
# 사장님이 버튼을 누르면 처리 확정 + 검품소 회신 문구 생성 + 로컬 기록(~/.fpf/defects.jsonl).
# 표준 라이브러리만 사용(설치 불필요). 설정: ~/.fpf/bot.env
#   TELEGRAM_BOT_TOKEN=...   (필수)
#   OWNER_CHAT_ID=...        (필수 — 사장님 개인 chat id)
#   ANTHROPIC_API_KEY=...    (선택 — 있으면 사진 AI 파싱, 없으면 캡션 텍스트만 사용)
#   INSPECT_CHAT_ID=...      (선택 — 검품소 그룹방 id. 지정하면 그 방 메시지를 접수하고 회신도 그 방으로)
import json, os, sys, time, urllib.request, urllib.parse, base64, uuid

CFG_DIR = os.path.expanduser('~/.fpf')
ENV_PATH = os.path.join(CFG_DIR, 'bot.env')
OFFSET_PATH = os.path.join(CFG_DIR, 'bot.offset')
PENDING_PATH = os.path.join(CFG_DIR, 'pending.json')
LOG_PATH = os.path.join(CFG_DIR, 'defects.jsonl')

def load_env():
    env = {}
    if os.path.exists(ENV_PATH):
        for line in open(ENV_PATH, encoding='utf-8'):
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip()
    return env

ENV = load_env()
TOKEN = ENV.get('TELEGRAM_BOT_TOKEN', '')
OWNER = ENV.get('OWNER_CHAT_ID', '')
AKEY = ENV.get('ANTHROPIC_API_KEY', '')
INSPECT = ENV.get('INSPECT_CHAT_ID', '')
if not TOKEN or not OWNER:
    print('설정 없음: ~/.fpf/bot.env 에 TELEGRAM_BOT_TOKEN / OWNER_CHAT_ID 필요'); sys.exit(1)
API = 'https://api.telegram.org/bot' + TOKEN + '/'

def http_json(url, payload=None, headers=None, timeout=90):
    data = json.dumps(payload).encode('utf-8') if payload is not None else None
    req = urllib.request.Request(url, data=data, headers=headers or {'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode('utf-8'))

def tg(method, payload):
    try:
        return http_json(API + method, payload)
    except Exception as e:
        print('[tg]', method, 'fail:', e); return {}

def send(chat_id, text, reply_to=None, keyboard=None):
    p = {'chat_id': chat_id, 'text': text, 'disable_web_page_preview': True}
    if reply_to: p['reply_to_message_id'] = reply_to
    if keyboard: p['reply_markup'] = {'inline_keyboard': keyboard}
    return tg('sendMessage', p)

def dl_photo(file_id):
    info = tg('getFile', {'file_id': file_id})
    path = (info.get('result') or {}).get('file_path')
    if not path: return None
    with urllib.request.urlopen('https://api.telegram.org/file/bot' + TOKEN + '/' + path, timeout=60) as r:
        return base64.b64encode(r.read()).decode('ascii')

def parse_with_ai(b64, caption):
    if not AKEY: return None
    content = []
    if b64: content.append({'type': 'image', 'source': {'type': 'base64', 'media_type': 'image/jpeg', 'data': b64}})
    content.append({'type': 'text', 'text': '아동복 검품 불량 접수 사진/메모입니다. 다음을 추출해 JSON만 응답하세요(설명 금지): '
        '{"name":"품명(모르면 빈칸)","color":"컬러(예: 핑크)","size":"사이즈(예: 3)","qty":숫자(모르면 1),"defect":"불량 내용 요약(예: 오염, 원단 주름, 스냅 불량)"} '
        '참고 메모: ' + (caption or '(없음)')})
    try:
        r = http_json('https://api.anthropic.com/v1/messages', {
            'model': 'claude-sonnet-4-6', 'max_tokens': 300,
            'messages': [{'role': 'user', 'content': content}]},
            {'Content-Type': 'application/json', 'x-api-key': AKEY, 'anthropic-version': '2023-06-01'}, timeout=60)
        txt = ''.join(c.get('text', '') for c in r.get('content', []))
        s, e = txt.find('{'), txt.rfind('}')
        return json.loads(txt[s:e+1]) if s >= 0 else None
    except Exception as e:
        print('[ai] fail:', e); return None

def load_json(path, default):
    try: return json.load(open(path, encoding='utf-8'))
    except Exception: return default

def save_json(path, obj):
    os.makedirs(CFG_DIR, exist_ok=True)
    json.dump(obj, open(path, 'w', encoding='utf-8'), ensure_ascii=False)

PENDING = load_json(PENDING_PATH, {})

ACTIONS = [('fix', '엄지 수선'), ('ded', '원단공제'), ('dead', '완불 처리'), ('hold', '보류')]
ACT_LABEL = dict(ACTIONS)
ACT_REPLY = {
    'fix': '수선분은 엄지로 보내주세요~',
    'ded': '이건 원단 하자라 공제 처리할게요. 보내지 않으셔도 돼요.',
    'dead': '완불 처리할게요. 폐기(보관)해주세요.',
    'hold': '이건 확인 후 다시 알려드릴게요.',
}

def card_text(d):
    line = ' / '.join(x for x in [d.get('name') or '(품명 미상)', (d.get('color') or '') + ' ' + str(d.get('size') or '')] if x.strip())
    return '불량 접수\n' + line + ' · ' + str(d.get('qty') or 1) + '장\n불량: ' + (d.get('defect') or '(내용 없음)') + ('\n(AI 파싱 꺼짐 — 메모만 기록)' if not d.get('_ai') else '')

def handle_defect(msg):
    chat_id = msg['chat']['id']
    caption = msg.get('caption') or msg.get('text') or ''
    b64 = None
    if msg.get('photo'):
        b64 = dl_photo(msg['photo'][-1]['file_id'])
    parsed = parse_with_ai(b64, caption) if (b64 or caption) else None
    d = parsed or {}
    d.setdefault('name', ''); d.setdefault('color', ''); d.setdefault('size', ''); d.setdefault('qty', 1)
    if not d.get('defect'): d['defect'] = caption[:120] or '사진 참조'
    d['_ai'] = bool(parsed)
    did = uuid.uuid4().hex[:10]
    d['id'] = did; d['src_chat'] = chat_id; d['src_msg'] = msg.get('message_id'); d['ts'] = time.strftime('%Y-%m-%d %H:%M')
    PENDING[did] = d; save_json(PENDING_PATH, PENDING)
    kb = [[{'text': lbl, 'callback_data': act + '|' + did} for act, lbl in ACTIONS[:2]],
          [{'text': lbl, 'callback_data': act + '|' + did} for act, lbl in ACTIONS[2:]]]
    send(OWNER, card_text(d) + '\n\n어떻게 처리할까요?', None, kb)
    if str(chat_id) != str(OWNER):
        send(chat_id, '접수했습니다. 확인 후 안내드릴게요.', msg.get('message_id'))

def handle_callback(cb):
    data = cb.get('data') or ''
    act, _, did = data.partition('|')
    d = PENDING.get(did)
    tg('answerCallbackQuery', {'callback_query_id': cb['id']})
    if not d:
        send(OWNER, '이미 처리됐거나 만료된 건이에요.'); return
    d['decision'] = act; d['decided'] = time.strftime('%Y-%m-%d %H:%M')
    with open(LOG_PATH, 'a', encoding='utf-8') as f:
        f.write(json.dumps(d, ensure_ascii=False) + '\n')
    del PENDING[did]; save_json(PENDING_PATH, PENDING)
    # 버튼 제거 + 결정 표시
    try:
        tg('editMessageText', {'chat_id': cb['message']['chat']['id'], 'message_id': cb['message']['message_id'],
            'text': card_text(d) + '\n\n결정: ' + ACT_LABEL.get(act, act) + ' (' + d['decided'] + ')'})
    except Exception: pass
    # 검품소 회신 (그룹방 접수면 그 방으로, 테스트면 같은 방으로)
    item = ' '.join(x for x in [d.get('name'), d.get('color'), str(d.get('size') or '')] if x).strip() or '해당 건'
    reply = item + ' ' + str(d.get('qty') or 1) + '장 — ' + ACT_REPLY.get(act, '')
    send(d.get('src_chat') or OWNER, reply, d.get('src_msg'))
    send(OWNER, '기록 완료. 회신 문구:\n"' + reply + '"\n(검품소 방 연결 전엔 복붙해서 쓰세요)')

def main():
    print('불량 비서봇 시작 — owner', OWNER, '| AI', '켜짐' if AKEY else '꺼짐')
    offset = 0
    try: offset = int(open(OFFSET_PATH).read().strip())
    except Exception: pass
    while True:
        try:
            r = http_json(API + 'getUpdates?timeout=50&offset=' + str(offset), None, {}, 70)
            for u in r.get('result', []):
                offset = u['update_id'] + 1
                open(OFFSET_PATH, 'w').write(str(offset))
                if 'callback_query' in u:
                    handle_callback(u['callback_query']); continue
                msg = u.get('message')
                if not msg: continue
                txt = (msg.get('text') or '').strip()
                if txt == '/start':
                    send(msg['chat']['id'], 'FPF 불량 비서봇이에요. 불량 사진(+설명)을 보내면 정리해서 처리 버튼을 드려요.'); continue
                if txt.startswith('/'): continue
                if msg.get('photo') or txt:
                    if INSPECT and str(msg['chat']['id']) not in (str(OWNER), str(INSPECT)):
                        continue  # 지정된 방 외 무시
                    handle_defect(msg)
        except KeyboardInterrupt:
            break
        except Exception as e:
            print('[loop]', e); time.sleep(5)

if __name__ == '__main__':
    main()
