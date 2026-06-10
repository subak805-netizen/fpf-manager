# FPF 생산앱 — 인수인계 (2026-06-10)

> 새 채팅에서 이 파일 + `CLAUDE.md` + `DESIGN_GUIDE.md`를 같이 읽고 이어서 작업. 작업본 저장소: `~/Documents/fpf-manager/` (맥미니/subin, 직접 편집→commit→push, GitHub Pages 배포 `subak805-netizen.github.io/fpf-manager`).

---

## 🛡️ 반드시 지킬 것 (사용자 확정 규칙)

### FPF 생산앱 3대 절대 원칙
1. **데이터 절대 안전·무손실**: 텍스트·사진 모두 클라우드/스토리지에 파일 단위로 영구 저장, 유실 없이 백업/복원. 로컬에만 갇히거나 증발 금지.
2. **크로스 디바이스 완벽 동기화**: 어느 기기서든 같은 데이터·이미지가 X박스·지연 없이 100% 동기화. 용량 핑계로 누락 금지.
3. **시각적 완성도(Web→Print/Export)**: 웹에서 잡은 UI(정렬·패딩·선·색)가 인쇄(A4)·이미지 내보내기서도 그대로.

### 4단계 보고 체계 (코드 전 필수 — "진행해" 승인 후에만 코드 출력)
1. **[목표 파악]** 핵심 원인 요약
2. **[작업 계획]** 정석 원리로. 꼼수·임시방편 절대 금지
3. **[자체 시뮬레이션]** 기존 데이터·다른 화면(인쇄)·모바일 충돌 검증
4. **[리스크 보고]** 에러·디자인 틀어짐·과부하 솔직히. "완벽" 단언 금지

### 설명 형식 (사용자는 비개발자)
항상 ①질문 이해 ②어떻게 고침 ③오류 검사함 ④오류 있었나 — 쉬운 말+비유. 존댓말.

---

## ✅ 이번 세션 완료 (커밋 순, 최신이 위)

### ▶ 2026-06-10 추가 세션 (저장소 근본수정 + 작지/아이템 리스트)
- **★백업 IndexedDB 이전** (`1664d1d`): 백업(`fpm_abk`+`fpm_hbk` 약 4.4MB = localStorage 96%의 주범)을 **localStorage→IndexedDB**(`fpmBackups`/store `kv`)로 분리. 읽기=메모리캐시(`window._abkCache`/`_hbkCache`)에서 동기, 쓰기=비동기(`idbBkSet`). 회사 로드 시 `idbBkEnsureLoaded()`가 IDB로딩+localStorage→IDB **1회 이사 후 삭제**(유실0). → **localStorage 96%→약 12%**. **실데이터(`fpm_co`)는 아직 localStorage 유지**(약 568KB, 여유). 복구도구/되돌리기 읽기도 캐시 사용.
- **백업 개수 축소** (`79a9eec`): `autoLocalBackup` 12→5(`ABK_MAX`), `autoHourlyBackup` 40→12(`HBK_MAX`) + 기존분 즉시 정리.
- **지시서 탭 치수표 버튼 통일** (`8e7e5d0`): 일반아이템 '지시서'=`sew` 패널(@`tpRender` `isPromo?cs:sew`)에도 상의/팬츠/스커트/＋부위 버튼(`tpSpecSecHTML`). 이전엔 sew만 버튼 없는 plain이었음.
- **치수표 프리셋** (`1714ce8`): 새 작지 기본표=**상의**(`tpInitDefaults`가 `TP_SPEC_TOP`). 상의 순서 변경. **레글런·셔츠** 프리셋+버튼 추가(`tpSpecPreset` raglan/shirt).
- **리스트 가공 단가 편집** (`cea6940`→`fb29257`): 연결된 가공(워싱·완성 등)도 공임처럼 리스트에서 바로 입력(`setItemCost`). 공장 연결+단가0=빨강'미입력', 공장 없으면 숨김. (itemRowHTML COST_DEFS 루프)
- **작지 헤더** (`8b690ee`): 담당자 기본값 **'박수빈'**(`tpInitDefaults`가 `d.head.manager`), 담당자·전달일 폰트 +2pt(`.who` CSS).
- **아이템 행 버튼 정리** (`e09e5d0`): 작지/원가/그래이딩에 **'미전달' 형태 상태토글**(대기↔완료) 페어(`itemStatToggle`/`toggleItemStat`). **그래이딩=신규 상태**(`gradingDone`, saveItemForm 보존 추가). KC는 컬러별 모달(`itemKcHTML`) 유지. 복제/삭제 하단 작게(`.im-mini`/`.im-mini-b`). **기존 레트로 디자인 그대로**(기존 클래스 재사용).

### ▶ 미해결/결정 대기 (다음 작업)
- **#7 단계 체계 자동화**: 단계를 수동클릭→실제이벤트 연동. 샘플=수동, 메인발주준비→(체크+발주서생성)→생산중 자동, 출고완료→자동(대시보드). 입고중/출고중/미발주 제거. 발주서=리오더 차수 자동. `deriveItemBadge`/`ITEM_STAGE_MAP`(@~5183). **결정 대기**: 샘플→메인 전환방식 / 생산중 게이트 조건 / 리오더 차수 기준(메인첫발주가 1차인지).
- **#8 오더관리 정리**: 오더상세에서 불량체크·입고·공장진행 제거(불량관리 탭·대시보드는 유지). 결제서의 택배비/박스비/운임(`addPayFee`/`payFees`@~10980)을 **결제관리로 이동**(이동 먼저→제거). 거래처확인을 발주서에 **토글(아코디언)** 로 합쳐 탭전환 제거.
- **C 버튼 정리(아이디어 단계)**: 상단 덜쓰는 버튼 `⋯`로, 필터칩 접기, 모바일 버튼 축소. 사용자: 지금 익숙하나 모바일 버튼 큼.
- **#6 날짜 위치**: 사용자는 왼쪽상단 희망했으나 보수적으로 일단 **현 위치(A) 유지** — 옮길지 결정 대기.

### ▶ 이전 세션
- **결제완료 판정 some→every** (`9ce4402`): 공장 한 곳만 결제돼도 오더 전체가 '결제완료=완료'로 숨던 사각지대 버그 수정. 결제대상 공장 전부 결제돼야 결제완료. 부분결제→'출고완료'로 표기돼 미결제 결제관리에 뜸.
- **사진 자동 URL 아키텍처** (`18d6be4`,`f77d410`): 첨부 즉시 Firebase Storage 업로드→URL만 DB저장. 실패 시 자동 재시도 큐(30초 타이머+online+저장시). 우하단 "⏳ 사진 N장 업로드 대기" 배지. html2canvas 캡처 전 `tpWaitImages`가 load+`img.decode()`+8초+80ms로 완전 로드 보장.
- **정직한 저장 + 용량 진단** (`390416e`): `lsSet`이 성공/실패 반환. 저장 실패 시 거짓 '저장됨' 대신 빨강 "⚠ 저장 실패!"+백업파일 자동 다운로드(`_onSaveFailed`). 🚑 데이터 관리에 브라우저 저장소 사용량 막대(`_lsUsageInfo`, 60%주의/80%위험).
- **데이터 손실 방지(덮어쓰기 차단)** (`a40d406`,`c0807c8`): 자동 로드(`cloudSyncLoad`) 때 **로컬에 데이터 있으면 클라우드로 안 덮어씀**(force=명시적 ☁새로고침만 덮어씀). 복구도구(`recoverFromAutoBackup`/`Hourly`)는 saveData/render 각각 try로 감싸 하나 터져도 복구 완료.
- **부자재 단가 자동입력 교차검색** (`dddc64a`): `autofillTrim`이 현재 거래처에 없으면 전체 거래처에서 같은 이름 trim 검색해 단가/규격 로드.
- **요척·계산(발주) 다수 개선** (`2b5de13`~`c259630`): "장수 × 요척" 표기(장수=저장된 실제 의뢰수량, 사이즈별 요척 정정), 컬러별 분리, 부속원단도 보정수량(몸판=actualOrderedQty 있는 원단만 원래수량), effective=사이즈별 반올림합(분배표 일치), finishSel 발주서 반영.
- **작업지시서 UI** (`5048ce8`~`d1415c7`): 재단+봉제 단일 통합, 입력칸 수직정렬(html2canvas onclone 중앙), 인쇄 빈페이지·테두리 수정, 도식화 이미지 absolute(칸 안 밀림)·확대, 라벨표 제거, 완성탭 택SET=완성부자재만+포장방법 칸 추가.
- **아이템 상단 핀** (`4da647d`~`97b31c8`): 메인인데 원가/KC/지시서 미완은 상단 고정(시즌그룹서 빼서 진짜 이동), 다 안된 것 위·원가만 미전달 맨 아래 정렬.

*(상세는 DESIGN_GUIDE.md 2026-06-10 항목 16개 참조)*

---

## 🔴 다음 과제 (우선순위)

### 1순위 — 저장 아키텍처 (★백업 IndexedDB 이전 완료 2026-06-10, 남은 천장 2개)
**진행됨**: 백업(`fpm_abk`/`fpm_hbk` 4.4MB=localStorage 범인)을 **IndexedDB로 이전 완료** → 96%→약 12%. 사진 base64도 Storage URL화 완료(규칙=전 경로 허용으로 고침). 백업 개수도 5/12개로 축소.
**남은 천장 2개** (사용자 계획: 발주 200·작지 100 추가 예정이라 곧 닿음):
- **로컬 5MB**: 실데이터(`fpm_co`)는 아직 localStorage. 지금 568KB라 여유. 닿으면 → **localForage**(IndexedDB 래퍼)로 `lsSet/lsGet`(`~1417`/`loadCoData`) 교체. 비동기-안전 래퍼+메모리캐시(S)+병행저장. 백업은 이미 IDB라 패턴 참고 가능(`idbBk*`).
- **클라우드 1MB/문서**: 회사 데이터를 1문서 통째 JSON(`d.value`) 저장 → 발주 늘면 초과(사진 빠진 텍스트도 ~550KB). → **발주/아이템을 여러 Firestore 문서로 쪼개기**. **실시간 동기화는 이미 구현됨**(`startRealtimeSync`/onSnapshot @~1845; 옛 '실시간 미적용' 메모는 stale) → 쪼갤 때 onSnapshot도 문서별로.
- (궁극형: Firestore 오프라인 지속 전면개편 — 여러 명 동시 사용 때. 혼자 쓰는 지금은 과함.)
- ⚠️ **사진 안 올라가/동기화 실패 재발 시**: Firebase Storage 보안규칙이 **`match /{allPaths=**}`(전 경로 허용)** 인지부터 확인. `/techpack/`만 허용하면 브랜드 라벨(`brandlabels/` 등) 업로드 거부→base64로 쌓여 다시 깨짐.

### 2순위 — (다른 채팅서 해결됨) 사진 Storage 업로드
- **Firebase Storage 보안규칙 쓰기 허용** + **CORS 업로드 메서드(PUT/POST)** 가 원인이었음. 사용자가 다른 방에서 해결 완료. → `migrateImagesToCloud`/`tpOnFile` 자동 업로드 정상 작동할 것. (firebase-storage-cors.json에 GET/PUT/POST/HEAD/OPTIONS 반영돼 있음.)

### 3순위 — 결제완료/대시보드 후속(선택)
- 부분결제(출고완료지만 결제 안 끝남) 오더를 **진행 대시보드에 더 눈에 띄게** 띄울지 사용자 결정 대기. 현재는 '출고완료' 필터 + 미결제 결제관리에 뜸.

### 기타 미해결(이전부터)
- 단추 로고 PO 텍스트 출력 연결.
- 모바일 표→카드 전환(거래명세서 가로스크롤).

---

## 핵심 컨텍스트
- **단일 파일** `index.html`(~23k줄, 임베디드 JS). 모든 `tp*`=작업지시서(`#tp-modal` 스코프), `qb*`=동선탭.
- **검증**: `<script>` 추출 후 JSC `new Function()` SYNTAX OK (CLAUDE.md §1/§13 스크립트). 미리보기 MCP(serverId `14324b62-...8754`, `/tmp/fpf-preview/_apptest.html`, `_multi.json`=AR29/TF19 백업: 아이템 `56wr0s`=린넨셔츠, `rdqton`=F로고니트).
- **데이터**: `S={items,orders,factories,priceBook,brands,...}`. priceBook 공유(fpm_shared), items/orders 회사별(fpm_<coId>). 클라우드=Firebase(Firestore=텍스트, Storage=이미지). Firestore 문서 1MB 한도 → 이미지는 URL만.
- **결제 판정**: `oLabel`(결제완료=결제대상 공장 every paid), `isOrderDone`. 결제탭 `renderItemPay`(allPaid=fcs.every(f.paid)).
- **이미지 흐름**: `tpOnFile`→`tpCompress`→`tpUpload`(Storage)→URL `it.techpack.images[slot]`. 대기 dataURL은 `migrateImagesToCloud`/auto-retry로 URL화. `_collectInlineImages`가 techpack+브랜드(logo/labels/refImages) 스캔.
- **결제명세서**(`buildPayReceiptHTML`)는 업체전달용 — 불변.
- DESIGN_GUIDE.md 변경 시 갱신+commit. 커밋 트레일러 `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
