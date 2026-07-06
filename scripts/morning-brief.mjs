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
  // 같은 종류는 묶고, 행동 제안은 묶음당 한 번만 (사용자 피드백 2026-07-06)
  const G = (h, act, rows) => rows.length ? { h: h + ' ' + rows.length + '건' + (act ? ' — ' + act : ''), rows } : null;
  const sum = (gs) => gs.reduce((s, g) => s + g.rows.length, 0);

  // --- 급한 것 (종류별 묶음) ---
  const uG = [];
  uG.push(G('출고 지연', '공장에 진행 확인 전화',
    (brief.lateShip || []).map(x => x.o + ' (예정 ' + mmdd(x.d) + ', ' + Math.abs(dayDiff(x.d, today)) + '일째)')));
  uG.push(G('입고 지연', '업체에 독촉 전화',
    (brief.arrive || []).filter(x => x.d && x.d < today).map(x => (x.sup ? x.sup + ' / ' : '') + x.o + ' (D+' + Math.abs(dayDiff(x.d, today)) + ')')));
  const ACT = { '원단 출고일 미입력': '미입력된 출고일 입력하기', '재단수량 미입력': '공장 확인 후 재단수량 입력하기', '입고 후 재단 미확인': '공장에 재단 투입 확인' };
  const byT = {};
  (brief.alerts || []).forEach(a => {
    const t = a.t || '알림';
    const vendor = a.w || (a.d || '').split(' — ')[0] || '';
    const row = ((a.o ? a.o + ' / ' : '') + vendor).trim() || (a.d || '');
    (byT[t] = byT[t] || []).push(row);
  });
  Object.keys(byT).forEach(t => uG.push(G(t, ACT[t] || '앱 알림센터에서 확인', byT[t])));
  const urgentGroups = uG.filter(Boolean);

  // --- 오늘 (종류별 묶음) ---
  const tG = [];
  tG.push(G('검사 오늘', '작지·검사서류 챙기기', (brief.insp || []).filter(x => x.d === today).map(x => x.o + (x.fc ? ' (' + x.fc + ')' : ''))));
  tG.push(G('출고 오늘', '출고 전 장수 확인 문자 받기', (brief.ship || []).filter(x => x.d === today).map(x => x.o)));
  tG.push(G('입고 오늘', '도착 확인되면 공장에 재단 투입', (brief.arrive || []).filter(x => x.d === today).map(x => (x.sup ? x.sup + ' / ' : '') + x.o)));
  tG.push(G('픽업 오늘', '', (brief.pickups || []).filter(p => p.w === '오늘').map(p => [p.sup, p.ty, p.it].filter(Boolean).join(' / '))));
  tG.push(G('할일', '', (brief.tasks || []).map(t => t.n)));
  tG.push(G('꾸러미 발송 준비 완료', '오늘 발송하면 끝', (brief.pkg || []).map(p => p.n)));
  const todayGroups = tG.filter(Boolean);

  // --- 미리 준비 (1~3일 내, 묶음) ---
  const pG = [];
  pG.push(G('검사 예정', '공장에 진행 상황 확인 연락', (brief.insp || []).filter(x => { const d = dayDiff(x.d, today); return d >= 1 && d <= 3; }).map(x => 'D-' + dayDiff(x.d, today) + ' ' + x.o + (x.fc ? ' (' + x.fc + ')' : ''))));
  pG.push(G('출고 예정', '장수·일정 미리 확인', (brief.ship || []).filter(x => { const d = dayDiff(x.d, today); return d >= 1 && d <= 3; }).map(x => 'D-' + dayDiff(x.d, today) + ' ' + x.o)));
  pG.push(G('픽업 내일', '', (brief.pickups || []).filter(p => p.w === '내일').map(p => [p.sup, p.ty].filter(Boolean).join(' / '))));
  const prepGroups = pG.filter(Boolean);

  // --- 헤더 ---
  L.push('FPF 아침 브리핑 · ' + mmdd(today) + ' (' + yoil + ')' + (brief.co ? ' · ' + brief.co : ''));
  const payN = brief.payPendingCharges || 0;
  L.push('급한 것 ' + sum(urgentGroups) + ' · 오늘 ' + sum(todayGroups) + ' · 미리 ' + sum(prepGroups) + ' · 미결제 ' + payN + '건');

  const gemit = (title, groups) => {
    if (!groups.length) return;
    L.push('');
    L.push('[' + title + ']');
    groups.forEach(g => {
      L.push(g.h);
      const c = cap(g.rows, 6);
      c.show.forEach(r => L.push('- ' + r));
      if (c.more) L.push('- 외 ' + c.more + '건 (앱에서)');
    });
  };
  gemit('급한 것부터', urgentGroups);
  gemit('오늘', todayGroups);
  gemit('미리 준비 (3일 내)', prepGroups);

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

  if (sum(urgentGroups) + sum(todayGroups) + sum(prepGroups) === 0 && payN === 0) {
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
