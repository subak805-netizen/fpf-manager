// FPF 아침 브리핑 발송 로봇 (GitHub Actions에서 매일 09:00 KST 실행)
// 앱이 저장할 때마다 Firestore에 올려두는 요약 문서(users/{uid}/data/fpm_brief)를 읽어
// "오늘/지연" 필터만 해서 텔레그램으로 보낸다. 앱·계산에는 아무 영향 없음.
import crypto from 'node:crypto';

const SA = process.env.FIREBASE_SERVICE_ACCOUNT;
const TG = process.env.TELEGRAM_BOT_TOKEN;
const CHAT = process.env.TELEGRAM_CHAT_ID;
if (!SA || !TG || !CHAT) {
  console.log('Secrets 미설정(FIREBASE_SERVICE_ACCOUNT / TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID) — 발송 건너뜀');
  process.exit(0);
}
const sa = JSON.parse(SA);

const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const hdr = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const clm = b64url(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const sig = crypto.createSign('RSA-SHA256').update(hdr + '.' + clm).sign(sa.private_key);
  const jwt = hdr + '.' + clm + '.' + b64url(sig);
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt });
  const j = await r.json();
  if (!j.access_token) throw new Error('구글 토큰 발급 실패: ' + JSON.stringify(j));
  return j.access_token;
}

const BASE = `https://firestore.googleapis.com/v1/projects/${sa.project_id}/databases/(default)/documents`;
async function fsGet(tok, path) {
  const r = await fetch(BASE + path, { headers: { Authorization: 'Bearer ' + tok } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('Firestore ' + r.status + ' ' + path);
  return r.json();
}

function kstToday(now) { return new Date((now ?? Date.now()) + 9 * 3600000).toISOString().slice(0, 10); }
function kstYoilIdx(now) { return new Date(kstToday(now) + 'T00:00:00Z').getUTCDay(); } // 0=일 1=월 4=목
const mmdd = (iso) => { const p = (iso || '').split('-'); return p.length === 3 ? (+p[1] + '/' + +p[2]) : iso; };
const dayDiff = (iso, today) => Math.round((new Date(iso + 'T00:00:00Z') - new Date(today + 'T00:00:00Z')) / 86400000);
const won = (n) => (Math.round(+n || 0)).toLocaleString('ko-KR') + '원';

// 비서형: 급한 것(행동 제안) → 오늘 → 미리 준비(3일 내) → 결제 → 주간 점검(월·목)
function buildMessage(brief, now) {
  const today = kstToday(now);
  const yoil = '일월화수목금토'[kstYoilIdx(now)];
  const weekly = [1, 4].includes(kstYoilIdx(now)); // 월·목 주간 점검
  const L = [];
  const cap = (arr, n) => ({ show: arr.slice(0, n), more: Math.max(0, arr.length - n) });

  // --- 급한 것 (지연·독촉) ---
  const urgent = [];
  (brief.lateShip || []).forEach(x => urgent.push({ txt: '출고 지연 · ' + x.o + ' (예정 ' + mmdd(x.d) + ', ' + Math.abs(dayDiff(x.d, today)) + '일째)', act: '공장에 진행 확인 전화' }));
  (brief.arrive || []).filter(x => x.d && x.d < today).forEach(x => urgent.push({ txt: '입고 지연 · ' + x.sup + ' / ' + x.o + ' (D+' + Math.abs(dayDiff(x.d, today)) + ')', act: x.sup + '에 독촉 전화' }));
  (brief.alerts || []).forEach(a => {
    let act = '앱 알림센터에서 확인';
    if ((a.t || '').includes('출고일')) act = '거래처에 출고일 확인';
    else if ((a.t || '').includes('재단수량')) act = '공장에 재단 시작 확인';
    else if ((a.t || '').includes('재단 미확인') || (a.t || '').includes('입고 후')) act = '공장에 재단 투입 요청';
    urgent.push({ txt: a.t + ' · ' + (a.d || ''), act });
  });

  // --- 오늘 ---
  const todayRows = [];
  (brief.insp || []).filter(x => x.d === today).forEach(x => todayRows.push({ txt: '검사 · ' + x.o + (x.fc ? ' (' + x.fc + ')' : ''), act: '작지·검사서류 챙기기' }));
  (brief.ship || []).filter(x => x.d === today).forEach(x => todayRows.push({ txt: '출고 · ' + x.o, act: '출고 전 장수 확인 문자 받기' }));
  (brief.arrive || []).filter(x => x.d === today).forEach(x => todayRows.push({ txt: '입고 · ' + x.sup + ' / ' + x.o, act: '도착 확인되면 공장에 재단 투입' }));
  (brief.pickups || []).filter(p => p.w === '오늘').forEach(p => todayRows.push({ txt: '픽업 · ' + [p.sup, p.ty, p.it].filter(Boolean).join(' / '), act: null }));
  (brief.tasks || []).forEach(t => todayRows.push({ txt: '할일 · ' + t.n, act: null }));
  (brief.pkg || []).forEach(p => todayRows.push({ txt: '꾸러미 발송 준비 완료 · ' + p.n, act: '오늘 발송하면 끝' }));

  // --- 미리 준비 (1~3일 내) ---
  const prep = [];
  (brief.insp || []).filter(x => { const d = dayDiff(x.d, today); return d >= 1 && d <= 3; })
    .forEach(x => prep.push({ txt: '검사 D-' + dayDiff(x.d, today) + ' · ' + x.o + (x.fc ? ' (' + x.fc + ')' : ''), act: '공장에 진행 상황 확인 연락' }));
  (brief.ship || []).filter(x => { const d = dayDiff(x.d, today); return d >= 1 && d <= 3; })
    .forEach(x => prep.push({ txt: '출고 D-' + dayDiff(x.d, today) + ' · ' + x.o, act: '장수·일정 미리 확인' }));
  (brief.pickups || []).filter(p => p.w === '내일').forEach(p => prep.push({ txt: '픽업 내일 · ' + [p.sup, p.ty].filter(Boolean).join(' / '), act: null }));

  // --- 헤더 ---
  L.push('FPF 아침 브리핑 · ' + mmdd(today) + ' (' + yoil + ')' + (brief.co ? ' · ' + brief.co : ''));
  const payN = brief.payPendingCharges || 0;
  L.push('급한 것 ' + urgent.length + ' · 오늘 ' + todayRows.length + ' · 미리 ' + prep.length + ' · 미결제 ' + payN + '건');

  const emit = (title, rows, maxRows, maxActs) => {
    if (!rows.length) return;
    L.push('');
    L.push('[' + title + ']');
    const c = cap(rows, maxRows);
    c.show.forEach((r, i) => { L.push('- ' + r.txt); if (r.act && i < maxActs) L.push('  -> ' + r.act); });
    if (c.more) L.push('- 외 ' + c.more + '건 (앱에서)');
  };
  emit('급한 것부터', urgent, 6, 5);
  emit('오늘', todayRows, 8, 4);
  emit('미리 준비 (3일 내)', prep, 6, 3);

  if (payN > 0) {
    L.push('');
    L.push('[결제] 미결제 청구 ' + payN + '건 (아이템 ' + (brief.payPendingItems || 0) + '개)');
    L.push('  -> 결제 탭에서 확인, 출고 확인된 건부터 이체');
  }

  // --- 주간 점검 (월·목) ---
  const wk = brief.wk || null;
  if (weekly && wk) {
    const W = [];
    if ((wk.kc || []).length) W.push('- KC 대기 ' + wk.kc.length + ': ' + wk.kc.slice(0, 4).join(', ') + (wk.kc.length > 4 ? ' 외' : ''));
    if (wk.instr) W.push('- 지시서 미완 ' + wk.instr + '개');
    if (wk.cost) W.push('- 원가 미전달 ' + wk.cost + '개');
    if ((wk.draft || []).length) W.push('- 안 보낸 발주서 ' + wk.draft.length + ': ' + wk.draft.slice(0, 3).map(x => x.sn).join(', ') + (wk.draft.length > 3 ? ' 외' : ''));
    if ((wk.conf || []).length) W.push('- 원단 컨펌 임박 ' + wk.conf.length + ': ' + wk.conf.slice(0, 3).map(x => x.sn + '(' + mmdd(x.d) + ')').join(', '));
    if ((wk.smp || []).length) W.push('- 샘플 지연 ' + wk.smp.length + ': ' + wk.smp.slice(0, 3).map(x => x.n).join(', ') + (wk.smp.length > 3 ? ' 외' : ''));
    if (wk.dfx) W.push('- 불량 미해결 ' + wk.dfx + '건');
    if (wk.ded && wk.ded.n) W.push('- 공제 미처리 ' + wk.ded.n + '건 ' + won(wk.ded.amt));
    if (wk.cour && wk.cour.n) W.push('- 택배 시재 미정산 ' + wk.cour.n + '건 ' + won(wk.cour.amt));
    if (W.length) { L.push(''); L.push('[주간 점검 — ' + (kstYoilIdx(now) === 1 ? '월' : '목') + '요판]'); W.forEach(w => L.push(w)); }
  }

  if (urgent.length + todayRows.length + prep.length === 0 && payN === 0) {
    L.push('');
    L.push('오늘은 잡힌 일정·밀린 것 없이 깨끗해요.');
  }

  const genMs = Date.parse(brief.generatedAt || '') || 0;
  if (genMs && (now ?? Date.now()) - genMs > 48 * 3600000) {
    L.push('');
    L.push('* 데이터 기준: ' + mmdd(new Date(genMs + 9 * 3600000).toISOString().slice(0, 10)) + ' 저장분 (앱을 열면 갱신돼요)');
  }
  return L.join('\n');
}

async function main() {
  const tok = await accessToken();
  // 사용자 uid 자동 탐색(1명) → fpm_brief 문서
  const ul = await fsGet(tok, '/users?showMissing=true&pageSize=100');
  const uids = ((ul && ul.documents) || []).map(d => d.name.split('/').pop());
  let brief = null;
  for (const uid of uids) {
    const doc = await fsGet(tok, `/users/${uid}/data/fpm_brief`);
    const raw = doc && doc.fields && doc.fields.value && doc.fields.value.stringValue;
    if (raw) { try { brief = JSON.parse(raw); break; } catch (e) { /* 다음 사용자 */ } }
  }
  if (!brief) { console.log('fpm_brief 문서 없음 — 앱을 한 번 열어 저장하면 생성됩니다. 발송 건너뜀'); return; }
  const msg = buildMessage(brief);
  const r = await fetch(`https://api.telegram.org/bot${TG}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT, text: msg, disable_web_page_preview: true })
  });
  const j = await r.json();
  if (!j.ok) throw new Error('텔레그램 발송 실패: ' + JSON.stringify(j));
  console.log('발송 완료:\n' + msg);
}
main().catch(e => { console.error(e); process.exit(1); });
