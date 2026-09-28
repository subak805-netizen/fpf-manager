#!/bin/bash
# 동기화 검사 (2026-09-28, 동기화 3번 「두 기기 흉내 검사」)
# 가짜 기기 두 대(맥 A · 폰 B)로 동기화 장면을 돌려 본다. 크롬(헤드리스)과 파이썬만 쓴다 — 설치할 것 없음.
#   ./sync-check.sh              전체 장면
#   ONLY=S1,S4 ./sync-check.sh   골라서
# 결과: ✅ 통과 · ⚠️ 알려진 약한 곳(실패해도 막지 않음) · ❌ 실패(종료 코드 1)
cd "$(dirname "$0")" || exit 2
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME" ]; then echo "⚠️ 동기화 검사: 크롬이 없어 건너뜀"; exit 0; fi
PORT=$(python3 -c 'import socket;s=socket.socket();s.bind(("127.0.0.1",0));print(s.getsockname()[1]);s.close()')
OUT="$(mktemp -t fpfsync).json"; rm -f "$OUT"
PROFILE="$(mktemp -d -t fpfsyncchrome)"
python3 synctest/serve.py "$PORT" "$OUT" & SRV=$!
sleep 0.5
"$CHROME" --headless=new --disable-gpu --no-first-run --no-default-browser-check --user-data-dir="$PROFILE" \
  --window-size=1200,900 "http://localhost:$PORT/synctest/runner.html${ONLY:+?only=$ONLY}" >/dev/null 2>&1 & CHR=$!
T=0; LIMIT=${SYNC_TIMEOUT:-300}
while [ ! -s "$OUT" ] && [ $T -lt $LIMIT ]; do sleep 1; T=$((T+1)); done
kill $CHR 2>/dev/null; kill $SRV 2>/dev/null; wait $CHR 2>/dev/null; wait $SRV 2>/dev/null
rm -rf "$PROFILE"
if [ ! -s "$OUT" ]; then echo "❌ 동기화 검사: ${LIMIT}초 안에 결과가 안 옴"; exit 2; fi
python3 - "$OUT" <<'PYEOF'
import json, sys
d = json.load(open(sys.argv[1]))
bad = 0
for r in d['results']:
    mark = '✅' if r['pass'] else ('⚠️ ' if r['weak'] else '❌')
    print(f"{mark} {r['id']} {r['name']} — {r['detail']} ({r['ms']/1000:.1f}초)")
    if not r['pass']:
        if r.get('logsA'): print('     A 기록:', r['logsA'][:600])
        if r.get('logsB'): print('     B 기록:', r['logsB'][:600])
    if not r['pass'] and not r['weak']:
        bad += 1
ok = sum(1 for r in d['results'] if r['pass'])
print(f"동기화 검사: {ok}/{len(d['results'])} 통과 · {d['ms']/1000:.0f}초")
sys.exit(1 if bad else 0)
PYEOF
