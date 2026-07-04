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

function kstNow() { return new Date(Date.now() + 9 * 3600000); }
function kstToday() { return kstNow().toISOString().slice(0, 10); }
const mmdd = (iso) => { const p = (iso || '').split('-'); return p.length === 3 ? (+p[1] + '/' + +p[2]) : iso; };
const daysLate = (iso, today) => Math.round((new Date(today + 'T00:00:00Z') - new Date(iso + 'T00:00:00Z')) / 86400000);

function buildMessage(brief) {
  const today = kstToday();
  const L = [];
  const yoil = '일월화수목금토'[new Date(today + 'T00:00:00Z').getUTCDay()];
  L.push('FPF 아침 브리핑 · ' + mmdd(today) + ' (' + yoil + ')' + (brief.co ? ' · ' + brief.co : ''));
  L.push('');

  const inspToday = (brief.insp || []).filter(x => x.d === today);
  L.push('[검사 오늘] ' + (inspToday.length ? inspToday.length + '건' : '없음'));
  inspToday.forEach(x => L.push('- ' + x.o + (x.fc ? ' · ' + x.fc : '')));

  const shipToday = (brief.ship || []).filter(x => x.d === today);
  L.push('[출고 오늘] ' + (shipToday.length ? shipToday.length + '건' : '없음'));
  shipToday.forEach(x => L.push('- ' + x.o));

  const arrToday = (brief.arrive || []).filter(x => x.d === today);
  const arrLate = (brief.arrive || []).filter(x => x.d && x.d < today);
  L.push('[입고 예정 오늘] ' + (arrToday.length ? arrToday.length + '건' : '없음'));
  arrToday.forEach(x => L.push('- ' + x.sup + ' · ' + x.o));
  if (arrLate.length) {
    L.push('[입고 지연] ' + arrLate.length + '건');
    arrLate.slice(0, 8).forEach(x => L.push('- ' + x.sup + ' · ' + x.o + ' (D+' + daysLate(x.d, today) + ')'));
    if (arrLate.length > 8) L.push('- 외 ' + (arrLate.length - 8) + '건');
  }

  L.push('[결제] 미결제 청구 ' + (brief.payPendingCharges || 0) + '건 (아이템 ' + (brief.payPendingItems || 0) + '개)');

  const genMs = Date.parse(brief.generatedAt || '') || 0;
  if (genMs && Date.now() - genMs > 48 * 3600000) {
    const g = new Date(genMs + 9 * 3600000).toISOString();
    L.push('');
    L.push('* 데이터 기준: ' + mmdd(g.slice(0, 10)) + ' 저장분 (앱을 열면 갱신돼요)');
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
