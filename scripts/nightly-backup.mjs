// FPF 밤마다 서버 백업 (동기화 2번, 2026-09-28) — GitHub Actions 에서 매일 새벽 실행
// 파이어스토어 문서 전부(앱 7개 자료)를 통째로 읽어 → gzip → 스토리지 backups/firestore/날짜.json.gz 에 둔다.
// · 올린 뒤 다시 내려받아 풀어 보고 문서 수가 같은지 확인한다(검증 안 된 백업은 백업이 아님).
// · 30일 지난 것만 지운다. 오늘 백업이 검증됐고 크기가 어제의 70% 이상일 때만 — 자료가 갑자기 줄었으면
//   (사고일 수 있으니) 옛 백업을 하나도 안 지운다. 최근 7개는 무조건 남긴다.
// · 저장소가 공개라 실행 기록도 공개다 → 로그엔 개수·크기만. 문서 내용·계정 번호는 절대 찍지 않는다.
// · 의존성 없음(morning-brief.mjs 와 같은 방식: 서비스계정 JWT → REST).
// 되살리기: 백업 파일의 root.users[uid].sub.data[key].fields 가 파이어스토어 REST 형식 그대로라
//   PATCH .../documents/users/{uid}/data/{key} 에 {fields} 로 다시 넣으면 된다.
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import fs from 'node:fs';

const SA = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!SA) { console.error('FIREBASE_SERVICE_ACCOUNT 가 없어 백업을 못 했어요'); process.exit(1); }
const sa = JSON.parse(SA);
const PROJECT = sa.project_id;
const BUCKET = process.env.BACKUP_BUCKET || `${PROJECT}.firebasestorage.app`;
const PREFIX = 'backups/firestore/';
const KEEP_DAYS = 30, KEEP_MIN = 7, SHRINK_GUARD = 0.7, MAX_DEPTH = 4;

const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const hdr = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const scope = 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/devstorage.read_write';
  const clm = b64url(JSON.stringify({ iss: sa.client_email, scope, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const sig = crypto.createSign('RSA-SHA256').update(hdr + '.' + clm).sign(sa.private_key);
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + hdr + '.' + clm + '.' + b64url(sig) });
  const j = await r.json();
  if (!j.access_token) throw new Error('구글 토큰 발급 실패 (' + r.status + ')');
  return j.access_token;
}

const FS = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const enc = (segs) => segs.map(encodeURIComponent).join('/');
const where = (segs) => segs.map((s, i) => (i % 2 === 1 ? '*' : s)).join('/'); // 로그용: 문서 이름은 가림
let TOK = '';
const H = () => ({ Authorization: 'Bearer ' + TOK });

async function listDocs(collSegs) {
  const out = []; let pageToken = '';
  do {
    const u = `${FS}/${enc(collSegs)}?pageSize=300&showMissing=true` + (pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : '');
    const r = await fetch(u, { headers: H() });
    if (!r.ok) throw new Error(`문서 목록 실패 ${r.status} (${where(collSegs)})`);
    const j = await r.json();
    (j.documents || []).forEach((d) => out.push(d));
    pageToken = j.nextPageToken || '';
  } while (pageToken);
  return out;
}
async function listSubIds(docSegs) {
  const ids = []; let pageToken = '';
  do {
    const u = docSegs.length ? `${FS}/${enc(docSegs)}:listCollectionIds` : `${FS}:listCollectionIds`;
    const r = await fetch(u, { method: 'POST', headers: { ...H(), 'Content-Type': 'application/json' }, body: JSON.stringify(pageToken ? { pageSize: 100, pageToken } : { pageSize: 100 }) });
    if (!r.ok) throw new Error(`하위 묶음 목록 실패 ${r.status} (${where(docSegs)})`);
    const j = await r.json();
    (j.collectionIds || []).forEach((x) => ids.push(x));
    pageToken = j.nextPageToken || '';
  } while (pageToken);
  return ids;
}

let nDocs = 0, nUsers = 0;
async function dumpColl(collSegs, depth) {
  const out = {};
  for (const d of await listDocs(collSegs)) {
    const id = d.name.split('/').pop();
    const e = {};
    if (d.fields) { e.fields = d.fields; e.updateTime = d.updateTime; nDocs++; }
    if (depth < MAX_DEPTH) {
      const subs = await listSubIds(collSegs.concat(id));
      if (subs.length) { e.sub = {}; for (const s of subs) e.sub[s] = await dumpColl(collSegs.concat(id, s), depth + 1); }
    }
    out[id] = e;
  }
  return out;
}

const GCS = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(BUCKET)}/o`;
async function listBackups() {
  const items = []; let pageToken = '';
  do {
    const r = await fetch(`${GCS}?prefix=${encodeURIComponent(PREFIX)}&fields=items(name,size),nextPageToken` + (pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : ''), { headers: H() });
    if (!r.ok) throw new Error('백업 목록 실패 ' + r.status);
    const j = await r.json();
    (j.items || []).forEach((x) => items.push(x));
    pageToken = j.nextPageToken || '';
  } while (pageToken);
  return items.map((x) => { const m = /^backups\/firestore\/(\d{4}-\d{2}-\d{2})\.json\.gz$/.exec(x.name); return m ? { name: x.name, date: m[1], size: +x.size || 0 } : null; })
    .filter(Boolean).sort((a, b) => (a.date < b.date ? 1 : -1));
}

const log = []; const say = (s) => { console.log(s); log.push(s); };
const kb = (n) => (n / 1024).toFixed(0) + 'KB';

async function main() {
  TOK = await accessToken();
  const today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10); // 한국 날짜
  const root = {};
  for (const c of await listSubIds([])) root[c] = await dumpColl([c], 1);
  nUsers = Object.keys(root.users || {}).length;
  if (!nDocs) throw new Error('읽은 문서가 0개 — 백업을 올리지 않아요');
  const raw = Buffer.from(JSON.stringify({ kind: 'fpf-firestore-backup', v: 1, project: PROJECT, at: new Date().toISOString(), docs: nDocs, root }));
  const gz = zlib.gzipSync(raw, { level: 9 });
  say(`읽음: 계정 ${nUsers}개 · 문서 ${nDocs}개 · 원본 ${kb(raw.length)} → 압축 ${kb(gz.length)}`);

  const before = await listBackups();
  const name = PREFIX + today + '.json.gz';
  const up = await fetch(`https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(BUCKET)}/o?uploadType=media&name=${encodeURIComponent(name)}`, { method: 'POST', headers: { ...H(), 'Content-Type': 'application/gzip' }, body: gz });
  if (!up.ok) throw new Error('올리기 실패 ' + up.status + ' ' + (await up.text()).slice(0, 200));

  // 다시 내려받아 풀어서 문서 수 확인
  const back = await fetch(`${GCS}/${encodeURIComponent(name)}?alt=media`, { headers: H() });
  if (!back.ok) throw new Error('확인용 내려받기 실패 ' + back.status);
  const chk = JSON.parse(zlib.gunzipSync(Buffer.from(await back.arrayBuffer())).toString('utf8'));
  if (chk.docs !== nDocs || chk.kind !== 'fpf-firestore-backup') throw new Error('올린 백업을 다시 읽어 보니 문서 수가 달라요');
  say(`올림·확인: ${name} (문서 ${chk.docs}개 그대로)`);

  // 30일 지난 것 정리 — 안전장치 통과할 때만
  const prev = before.find((b) => b.date < today);
  const shrunk = prev && gz.length < prev.size * SHRINK_GUARD;
  if (shrunk) {
    say(`⚠️ 오늘 백업이 지난번(${prev.date})보다 많이 작아요 (${kb(prev.size)} → ${kb(gz.length)}) — 옛 백업은 하나도 안 지워요`);
  } else {
    const cutoff = new Date(Date.parse(today + 'T00:00:00Z') - KEEP_DAYS * 86400e3).toISOString().slice(0, 10);
    const all = await listBackups();
    const old = all.slice(KEEP_MIN).filter((b) => b.date < cutoff);
    for (const b of old) {
      const r = await fetch(`${GCS}/${encodeURIComponent(b.name)}`, { method: 'DELETE', headers: H() });
      if (!r.ok && r.status !== 404) throw new Error('옛 백업 정리 실패 ' + r.status);
    }
    say(`보관: ${all.length - old.length}개 (${KEEP_DAYS}일 지난 ${old.length}개 정리)`);
  }
}

main().then(() => {
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### FPF 서버 백업\n\n' + log.map((s) => '- ' + s).join('\n') + '\n');
}).catch((e) => {
  console.error('❌ 백업 실패: ' + (e && e.message ? e.message : e));
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### FPF 서버 백업 실패\n\n' + (e && e.message ? e.message : e) + '\n');
  process.exit(1);
});
