# 패션 생산관리 PRO (커먼웍스) — 인수인계 / 작업 이어가기

> 새 채팅에서 이 문서를 붙여넣고 `index.html`(또는 프로젝트의 파일)을 올리면 바로 이어서 작업 가능.

---

## 0. 프로젝트 한 줄 요약
- **단일 파일 `index.html`** (~16,300줄, 임베디드 JS, localStorage + Firebase 동기화). 모바일(아이폰) 사용.
- 회사: **커먼웍스** / 브랜드: 아루드(AR)·더프루토(TF)·리틀그로브(LB).
- 배포: GitHub Pages `subak805-netizen.github.io/fpf-manager` (수동 업로드 → 1~2분 빌드 → 강력 새로고침 필요).
- 공장: 엄지·아이케이·넘버파이브·블루베리·금풍·다산사·블루패킹·다산사완성집·INS검품·황금검품소 등 (타입: 봉제공임/워싱/자수/나염/완성/검품).

## 1. 작업 워크플로 (매 턴 반드시)
1. `index.html` 편집 (str_replace/view, 라인번호는 편집마다 밀리니 **편집 전 항상 재-grep**).
2. **검증**: 아래 스크립트로 `<script>` 추출 → `node --check` → "SYNTAX OK" 확인.
   ```bash
   python3 - <<'PY'
   import re
   html=open('index.html',encoding='utf-8').read()
   scripts=re.findall(r'<script\b[^>]*>(.*?)</script>',html,re.S|re.I)
   open('/tmp/chk.js','w',encoding='utf-8').write("\n;\n".join(s for s in scripts if s.strip()))
   PY
   node --check /tmp/chk.js && echo "SYNTAX OK"
   ```
3. `cp index.html /mnt/user-data/outputs/index.html` 후 **present_files로 index.html(미리보기) + index.zip 둘 다** 전달.
4. **bash 네트워크 비활성** — 정적 검사(node --check, grep, node 시뮬)만. 라이브 Firebase/브라우저 테스트 불가.
5. **돈/원가/결제 변경**은 먼저 설명+확인(모바일 선택은 ask_user_input_v0) 후 코딩.
6. "안 보여요/안 바뀌어요" = 대부분 **캐시** → GitHub 재업로드 + 강력 새로고침 안내.
7. **톤**: 한국어 존댓말(~해요/~예요), 따뜻하게, 가끔 😊. 끝에 항상 "올리고 강력 새로고침" 안내.
8. **사용자 선호**: 파일은 **zip 말고 index.html 직접**(미리보기). 안 뜨면 zip 병행.
9. **중요 교훈**: "이 화면만" 고치지 말고 **같은 종류 전부**를 기본으로 고칠 것 (사용자가 하나하나 지적 안 하게).

## 2. 데이터 스키마 (핵심)
- `S = {items:{}, orders:{}, factories:{}, priceBook:{}, ...}`. **priceBook은 공유**(회사 간), items/orders는 회사별.
- `S.items[id]` = {id,name,code,client,season,notes,brandId, **sewingFcId**, colors:[],sizes:[], fabrics:[], trims:[], trimCosts:[], finishCosts:[], laborCost/washingCost/embroideryCost/printingCost/**finishingCost**/inspectionCost, patternCost,sampleCost,onceCost, **csQtyOvr:{}, csPriceOvr:{}** (CS 사용량/단가 수정 저장)}.
- **COST_DEFS** = [['laborCost','공임','sewingFcId',...],['washingCost','워싱','washingFcId',...],['embroideryCost','자수','embroideryFcId',...],['printingCost','나염비','printingFcId',...],['finishingCost','완성비','finishingFcId',...],['inspectionCost','검품비','inspectionFcId',...]]. 각=[costKey,label,fkKey,fkLabel].
- **Trim 객체**: {id,supplier,name,color,**orderType**('count'/'yard'/'roll'/'zipper'/'button'/'thread'/'careLabel'/'mainLabel'/'buttonloop'/'bias'/'care'...),unitPrice,buffer(로스%),qtyPerPiece,consumptionPerPiece,yardsPerRoll, **rollUnit**('롤'/'절'/'박스'/'봉'), **useMinSplit,minSplitQty**(÷N 분배), sizeRates:[{size,price}], sizeMode('bySize'),sizeBySize:{},qtyBySize:{}, colorLinks:[], part(용도), isLace ...}.
  - `rollUnit`: 롤 타입의 단위 라벨 (심지=절, 밴드=롤 등). 계산은 동일, 라벨만.
  - 사이즈별 단가: `mkTrimSizeSec(i,t,withPrice)` 표에 단가 칼럼 → 규격 기준 sizeRates에 저장.
- **Fabric 객체**: {id,supplier,name,composition,width,consumption,unitPrice,pricePerKg,yardsPerKg,pricingUnit,buffer...}.
- **Order**: {id,name,createdAt,orderItems:[{itemId,qtyGrid:{color:{size:qty}},grandTotal}], **factorySchedules**:{fcId:sch}, reorderOverride,skipBilling...}. sch={shippingDate,shippingGrid:{itemId:{color:{size:qty}}},shipments:[{date,color,size,qty,itemId}],shipDoneDate,vatRate:10,...}.
- **priceBook[supplierName]** = {email,phone,kakaoId,bank,market,materials:{key:entry}}. key=pbKey(name,color). trim/fabric entry에 size·sizeRates·width·composition 포함.

## 3. 핵심 함수 위치 (편집 전 재-grep 필수, 라인 근사치)
- 유틸: esc,num,uid,today(),todayISO(),**fmtKoDate**(ISO→"2026. 05. 22."),createdToISO,**cmpDate**(어떤 날짜형식→YYYYMMDD 비교용),**_cmpDateFn**(정렬용),**toISO**(어떤형식→YYYY-MM-DD),pbKey,getPB.
- **날짜 형식 통일 (중요)**: 앱에 ISO("2026-05-13")와 한글식("2026. 05. 24.")이 섞임. 날짜 정렬은 반드시 `.sort(_cmpDateFn)`, 비교는 `cmpDate()`, 표시 정규화는 `toISO()` 사용.
- 아이템: `renderItemsList`(@~3326, 빈상태=온보딩 가이드+공장등록 버튼), `saveItemForm`(이름검증/품번중복경고/음수가드/csQtyOvr·csPriceOvr 보존), `delItem`(사용 오더 경고).
- 트림 폼: `trimRowHTML(t,i)`(분기: bias/care/main/zipper/button/일반). 일반카드는 **2줄**(1줄:부자재처·명·크기·색상 / 2줄:요척·단가·단위·로스). `renderTrimRows`(라벨류=careLabel/mainLabel는 **하단 #label-trim-rows** 별도 렌더). `addTrimRow(t)`(프리셋, **'jeol'**=롤+절+÷30, 'yard'=야드심지). `moveTrim(i,dir)`+`trimMoveBtns(i)`(▲▼). `colTR()`(수집, rollUnit/사이즈별단가 포함).
- 트림 추가 버튼: **"+ 심지(절)"**=addTrimRow('jeol'). **🔧 타입변환** 도구: `openJijiConvert`/`scanJijiTargets`/`applyJijiConvert`(검색어로 부자재 찾아 롤+단위+÷N 일괄 변환, 미리보기 후 적용).
- 단가장(book): `renderBookList`(@~2754, 카드 펼침상태=`window._bookOpen[s]` 유지, 품목 이름순 정렬, 🔍`showPBUsage`=사용 아이템 목록), `renamePBMaterial`(이름→전 아이템 전파), `updatePBPrice`→`propagatePriceToItems`(단가→아이템 전파, 옛 발주 보호), `autofillTrim`(단가·지퍼/단추·**size** 자동채움).
- 원가계산서(CS, pane-costs): `renderCS`/`renderCSSummary`. 검색칸 아이템탭과 동일 디자인. 트림 detail: 계산식=`요척×단가`표시, **로스포함** 칼럼(=base×(1+로스%), `trimLoss`=전역 cs-trim-loss). 원단도 로스 동일(override해도 적용). **실(thread)도 로스 적용**. 소계=`로스 미포함 X · 로스포함 Y` 둘 다 표시. `csGetOverride`/`csSetOverride`/`csGetPriceOverride`/`csSetPriceOverride`(아이템 csQtyOvr/csPriceOvr에 저장→동기화).
- 대시보드: `renderDash`/`renderDashFactory`. 출고일 표시 형식안전 정렬.
- 결제관리: `renderFcPay`(@~10740 byFc 루프), `renderSpPay`, `buildPayReceiptHTML`(@8709, **거래명세서 단일 함수=모든 공장 공통**).
  - **byFc 루프(@~10753)**: 결제 대상 공장 = `factorySchedules ∪ 아이템 원가공장(비용>0)` (스케줄 없어도 누락 안 됨). shipDate=`fcLastShipDate(sch)` → 없으면 봉제출고일 → 발주일 폴백. `isInPayPeriod`로 기간필터(전체면 null→통과).
  - **그룹/행 정렬**: `cmpDate`로 출고일 빠른 순 (그룹·그룹내 오더 모두). 행에 **🚚 출고일 배지** 표시(정렬 이유 보이게).
  - **거래명세서 수량(buildPayReceiptHTML)**: 우선순위 **① 회차별 출고 → ② 출고그리드(shippingGrid) → ③ 오더수량(최후)**. 날짜=출고일(없으면 발주일). 출고일은 `toISO`로 정규화 후 정렬.
- 날짜헬퍼: `fcLastShipDate(sch)`(@6152, shipDoneDate→마지막 shipment→shippingDate), `fcShipped`,`fcShippedQty`.

## 4. 이번 세션 완료 작업 (최신)
1. 부자재 **사이즈별 단가** 입력(합친 표에 단가 칼럼, 규격 기준 sizeRates 저장).
2. 부자재 **▲▼ 순서 이동**(6개 카드 전부).
3. 단가장: **펼침상태 유지**+품목 이름순 정렬+**🔍 사용처 보기**+부자재 **크기(size) 저장/자동완성**.
4. 결제 **체크박스↔거래명세서 일치**: byFc에 아이템 원가공장 포함(스케줄 없어도), 출고일 폴백.
5. CS 검색칸 아이템탭과 동일 디자인.
6. **로스**: 부자재비×로스% 정상(설명), 원단 로스 override해도 적용, **로스포함 금액** 칼럼, **실(thread)도 로스**, 소계 미포함/포함 둘 다.
7. 부자재 입력칸 **2줄**로.
8. CS 사용량/단가 수정값 **아이템에 저장**(csQtyOvr/csPriceOvr) → 동기화, saveItemForm 보존.
9. **심지=절 타입**: rollUnit(절/롤/박스/봉) 선택, "+ 심지(절)" 버튼, **🔧 타입변환** 일괄도구.
10. **완성 부자재(라벨) 하단 분리**(#label-trim-rows).
11. **QA 수정**: 아이템/공장 삭제 사용처 경고, 음수 입력 0 클램프, 품번 중복 경고, 회사 빈이름 안내, 온보딩 가이드(+공장등록 버튼), 야드 고단가 "롤/절?" 경고.
12. **UI**: 활성 탭 강조 강화, number 입력 모바일 숫자패드(inputmode), 저장 토스트(기존 확인).
13. **날짜 형식 통일**(cmpDate/_cmpDateFn/toISO) → 결제·대시보드·명세서 등 모든 날짜 정렬 형식안전.

## 5. 미해결 / 다음 후보
- (제안만 함) **모바일 표→카드 전환**(거래명세서·원가표 가로스크롤 해소) — 위험도 높아 화면별 신중 작업 필요.
- (제안만 함) **삭제 Undo(되돌리기)**.
- 같은 규격 공유 사이즈는 단가 공유(엣지케이스).
- 사용자가 "또 안 뜨면" 우려한 결제 누락: 대부분 ①옛 파일 미반영 ②동명 공장 중복 등록. 진단 시 공장관리 중복 확인.

## 6. 자주 쓰는 JSON 양식
- **작지**: {name,code,brand,season,client,sewingFactory,colors:[],sizes:[],notes,fabrics:[{part,supplier,name,composition,width}],trims:[{part,supplier,name,orderType,spec}]}.
- **단가장**: {supplier,items:[{name,color,orderType:"roll"/"yard"/"count",yardsPerRoll,unitPrice}]}.

---

## 7. 마지막 세션 추가 수정 (거래명세서 핵심)
- **거래명세서(buildPayReceiptHTML) = 단일 함수, 모든 공장 공통**. 아래는 전 공장 자동 적용:
  - **출고날짜**: ① 이 공장 출고일 → ② 없으면 **봉제공장 출고일** → ③ 그래도 없으면 **빈칸**(발주일로 대체 안 함). 헤더도 "날짜"→**"출고날짜"**.
  - **출고수량**: ① 이 공장 회차/출고그리드 → ② 없으면 **봉제공장 실제 출고수량(=생산수량)** → ③ 없으면 오더수량. → 완성/검품 공장도 봉제(아이케이)와 **같은 장수·같은 날짜**로 뜸.
  - 정렬·날짜 모두 `cmpDate`/`toISO`로 형식안전.
- 결제 체크리스트 각 줄에 **🚚 출고날짜 배지** (정렬 이유 보이게). 정렬=출고일 빠른 순.
- **단추(button) 부자재에 "🔵 로고 인쇄" 옵션** 추가: 체크 시 "로고 내용" 입력칸, 미리보기 표시, 단가장 저장/자동완성(hasButtonLogo/buttonLogoText). colTR 수집 + 프리셋 포함.
  - ⚠️ TODO: 단추 로고를 **발주서(PO) 텍스트**에도 출력 연결 (현재는 폼·미리보기·단가장까지. 지퍼 sliderLogoText와 동일 패턴으로 calcSups/genPoText에 추가 필요).

## 8. 옛 인수인계(이전 세션) 미해결 — 새 채팅에서 이어갈 것
1. **실시간 동기화(폰↔맥)**: Firestore onSnapshot 미적용, 수동 새로고침. (사용자 "나중에")
2. **부자재 단가 3종(매장가/협상가/원가용)**: 현재 원단만 3종. 부자재(단추·지퍼·심지)는 단가 1개(+컬러별). 부자재도 3종 적용 요청 시. 우선순위 낮음.
   - 매장가=정가(견적) / 협상가=네고가(발주서에 나감) / 원가용=원가계산서 마진 기준(비우면 매장가).
3. 원가계산서 소계 회색배경 토막남(아이폰)은 이번 세션 소계 div화로 거의 해결됐을 것. 재발 시 5개 소계 전부 표 밖 div로.

---

## 9. 마지막 세션 추가 (거래명세서·부자재 불러오기)

### 거래명세서(buildPayReceiptHTML) — 모든 공장 공통
- **출고날짜**: ① 이 공장 출고일 → ② 없으면 **봉제공장 출고일** → ③ 그래도 없으면 **빈칸**(발주일 대체 안 함). 헤더 "날짜"→**"출고날짜"**.
- **출고수량**: ① 이 공장 회차/출고그리드 → ② 없으면 **봉제공장 실제 출고수량(=생산수량)** → ③ 없으면 오더수량. → 완성/검품 공장이 봉제(예: 아이케이)와 **같은 장수·같은 날짜**로 뜸.
- 헬퍼 `_gt`(grid 합), `_rf`(itemId별 출고기록 필터), `_sewSch`(봉제공장 스케줄) 사용.
- 결제 체크리스트 각 줄에 **🚚 출고날짜 배지** (정렬=출고일 빠른 순, cmpDate).

### 단추 로고인쇄
- 단추(button) 폼에 **🔵 로고 인쇄** 체크박스 + "로고 내용" 입력(hasButtonLogo/buttonLogoText). 미리보기 표시, 단가장 저장/자동완성, colTR 수집, 프리셋 포함.
- ⚠️ TODO: 발주서(PO) 텍스트 출력 연결은 미완 (지퍼 sliderLogoText 패턴 참고).

### 부자재 불러오기 (원단 패턴을 부자재에 이식)
- **`updTnmDL(el)`** 신규(updFnmDL의 부자재판): 부자재처 선택 시 **그 거래처의 부자재명 목록**을 #dl-tnm에 채움(거래처 없으면 전체). 부자재처 입력 `oninput="updTnmDL(this)"`, 부자재명 입력 `onfocus="updTnmDL(this)"`, renderTrimRows에서 초기 채움. (이전엔 #dl-tnm이 비어 있어 이름 추천이 아예 안 떴음)
- **`autofillTrim` 강화**: 
  - 색상 정확히 안 맞아도 **같은 이름**의 부자재 있으면 불러오기(이름 폴백).
  - 단가뿐 아니라 **폭(width)·크기(size)·요척(yardsPerRoll)·벌당개수(qtyPerPiece)·요척개수(consumptionPerPiece)·미니멈분배(useMinSplit/minSplitQty)·롤단위(rollUnit)·혼용률(composition)** 까지 **빈 칸만** 자동 채움 (필요 시 renderTrimRows 재호출).
- **`saveToPB` 강화**: 부자재 저장 시 위 고정값(consumptionPerPiece/qtyPerPiece/useMinSplit/minSplitQty/rollUnit/width/composition)도 단가장에 저장 → 다음에 그대로 불러옴.

## 10. Claude Code로 이어가기 (맥북↔맥미니)
- 이 **인수인계.md를 프로젝트 폴더에 `CLAUDE.md`로 두면** Claude Code가 자동으로 읽어 맥락 파악.
- 파일은 GitHub(이미 사용 중) push/pull 또는 iCloud 공유 폴더로 두 맥 간 이동.
- Claude Code 세션 히스토리는 기기별 로컬이라 자동으로 안 넘어감 → CLAUDE.md로 맥락 재구성하는 방식 권장. (또는 Remote Control로 맥북 세션을 원격 조작 — 맥북 켜져 있어야 함)
- 로컬 작업 경로: 작업본 `~/Downloads/files/index.html` · 깃 저장소 `~/Documents/fpf-manager/` (이쪽에서 commit/push). 보통 작업본 수정 후 `cp`로 저장소에 복사 → commit → push.

---

## 11. 이번 세션 작업 전체 (2026-05-27~28) ★최신★

> **새 채팅 시작법**: 새 대화 열고 이 `CLAUDE.md` + `index.html` 올린 뒤 "동선 퀘스트 탭 이어서 작업하자" 등으로 시작. (대화방 "fork"는 갈래치기 기능 — 모르고 누르면 방이 나뉨. 본 흐름은 이 문서로 이어가면 됨.)

### A. 탭 구조 재편
- **오더 관리 안에 서브탭**: 공장관리·거래처단가장·잔량관리를 오더관리 하위 서브탭으로 통합. 원가계산서 탭은 제거(아이템 카드의 **💰 원가** 버튼으로 진입). `switchTab`에서 4개 서브탭(orders/factories/book/leftover)일 때 nt-orders 강조 + `#orders-subtabs` 표시.
- **탭 순서**: 오더 관리 → **결제 관리** → 샘플 진행보드 → 샘플 발주 → 불량 관리.
- **가로 휠 차단**: 문서레벨 위임(`#dragWheelInit`). `.pd-table-wrap`/`.prod-wrap`에서 **마우스 휠=가로 차단(세로만 부모 패널로)**, **트랙패드 두 손가락=가로 허용**. 판별: `deltaMode!==0` 또는 큰 정수 점프(≥50)=마우스.

### B. 할 일 탭 (Pretendard 담백 데이터그리드)
- **자동 생성 끔**: `generateAutoTasks()`는 `[]` 반환(옛 로직 `_generateAutoTasks_disabled`로 보존). 수동 입력만 표시. ⚙자동 버튼·설정패널 제거.
- **필드 라벨**: "위치"→ 한때 "업체"로 바꿨다가 → 최종 **"픽업"(loc: 시장/사무실/전화/기타) + "업체"(supplierName: 단가장 datalist) 분리**.
- **UI**: 빠른추가 카드 2층(1줄 인풋 + 2줄 select들+추가버튼), 브랜드별 **2컬럼 그리드**(`.tk-brand-grid` auto-fit minmax 360px), 행 가로구분선+여유패딩, 품번 회색 태그, 슬래시(/) 줄글, 이모지 제거, `getTaskStylesHTML`에 `.tk-*` 클래스. **renderTaskRow**가 한 줄 포맷.
- **다음 할 일 잇기 모달**(`openTaskNext`): 아이템/업체/픽업/언제(우선순위) 선택칸 추가, 기존 값 자동 이어받기. `taskNextContinue`가 4개 필드 반영.

### C. 생산 대시보드 (`renderProdDashRow`)
- **사이즈별 수량 서브라인**: 오더일/출고일 줄 아래 `아이 S5·M10·L15` 컬러별 사이즈 분해(`.subline`, `orderSizeGrid`/`shipSizeGrid`).
- **셀별 컬러×사이즈 미니**: 재단/외주/봉제/완성/검품/출고 셀에 `pdMiniGridHTML`(`pdCutSizeGrid`/`pdShipSizeGrid`).
- **출고 셀**: 공장명·📞공장 버튼 제거(봉제와 같은 공장이라). 📣브랜드만.
- **출고 그리드 입력**: `pdOpenQtyModal`이 모든 역할 grid 모드. 재단=replace, 출고/봉제/완성/검품/외주=**append**(saveMode). `pdGridSave` 분기. 숫자 스피너 전역 제거, bulkShip 입력칸 80px.
- 상단 📅전체일정표·💬브랜드일정안내 버튼 제거. 오더 사이드바 📅일정 버튼 제거.

### D. 샘플 진행보드 (`renderBoardPane`)
- 칸반 카드 → **생산대시보드 스타일 테이블**. 상단 통계 strip, 브랜드 필터 pill, 브랜드별 pd-table. 컬럼: 샘플감/부자재/제작지시/패턴/패턴지시(체크리스트) + 공장전달/도착/컨펌(status). 32px 동그란 토글 버튼(`sbToggleCheck`/`sbSetStatus`), D-day 정렬.

### E. 아이템/기타
- 아이템 카드 버튼 순서: **수정 → 원가 → 복제 → 삭제**.
- 공임 입력칸 너비 84px + tabular-nums(숫자 안 잘리게).
- **혼용률 Row 빌더**(원단 폼): 단일 텍스트 → `[성분명][비율%][×]` 행 그리드 + `＋혼용성분 추가`. `parseComp`(기존 문자열→행, '40% rayon'/'C100' 등 인식)/`buildComp`(행→`\n` 문자열)/`renderCompBuilder`/`addCompRow`/`removeCompRow`/`setCompFromString`(autofill용). composition 필드는 **줄바꿈 문자열** 저장. 출력: 케어라벨 split에 `\n` 추가(한 줄 하나씩), 발주서 품명줄은 `\n→공백`.

### F. ★카톡 메시지 포맷 전면 개편 (`pdBuildFactoryMsg`/`pdBuildBrandMsg`)
- 새 양식: `아이템명 (M/D)` 헤더 + `아이30 블랙40 총70장 (오더장수)` 컬러합계 한 줄(사이즈 합). 라벨: 오더장수/재단장수/출고장수.
- 헬퍼: `pdShortDate`(M/D), `pdOrderColorQtys`/`pdCutColorQtys`/`pdShipColorQtys`, `pdQtyLine`. 공장용/브랜드용 역할별 분기.

### G. ★★동선(픽업/전달) 탭 = 게임형 "QUEST BOARD" (대규모 신규)
- **탭**: `pane-route` → `renderRoutePane()` → `qbStylesHTML()` + `buildQuestBoardHTML()`. 모든 함수 `qb*` 접두사.
- **데이터 흐름 뒤집기**: 좌측 공장에 **＋ADD PACKAGE**로 "어느 공장에 무슨 아이템" 큰그림 먼저 → 4슬롯 밑그림 생성 → 우측 수집처에서 PICK → 슬롯 점등 → 발송.
- **신규 상태 `S.packages[]`**: `{id,name,itemId,brandId,destFactoryId/destSupplierName/destBrandId,expectedShipDate,shipMethod,sentAt,memo,slots:[{id,type('fabric'/'trim'/'pattern'/'instruction'/'custom'),customLabel,sourceSupplier,materialName,picked,pickedAt}]}`. 옛 `S.pickups`도 병행(implicit quest로 표시).
- **레이아웃**: 좌 DEST(공장 윈도우=Mac 타이틀바 아코디언, `qbToggleFc` 한번에 하나 펼침, 📁/📂) / 우 SOURCE(자재종류별 폴더). 모바일(≤980px) **탭 스위치**(`qbSwitchMobileTab` 'dest'/'src', `#qb-board[data-tab]`).
- **3단계 시각화**: ①준비전(슬롯 회색점선+disabled 사선버튼) ②준비완료(.complete: 슬롯 네온그린+버튼 네온블루 pulse+`★READY TO SHIP★`) ③발송끝(.sent: opacity .4+grayscale, SENT 도장).
- **완료 보관함(접이식, 기본 닫힘)**: 좌 `📁 CLEAR PACKAGES`(발송끝 패키지, `renderDoneQuestsSection`), 우 `📁 TRASH / CLEAR`(픽업완료, `renderDonePickupsSection`). 각 카드에 **🔄 되살리기**(`qbRestorePackage`/`qbRestoreQuest`: 슬롯 리셋+메인 복귀).
- **디자인 = 레트로 8bit 팩맨 + 갈무리(Galmuri11)**: 2컬러만 — `--neon-green #A5E6BA`(완료/DONE/슬롯ON), `--neon-blue #B0DBF0`(PICK/QUICK/ADD 액션). 나머지 흑백/연회색. 2.5px 검정보더 + 오프셋 그림자, Press Start 2P(라벨·숫자)+Galmuri11(제목)+Pretendard(본문). 배경 도트 없음.
- **모달(`qbOpenPackageModal`)**: 백드롭 rgba(0,0,0,.78)+blur, 솔리드 #fff, z-index 99990. **검색형 목적지**(공장+협력처+**브랜드** datalist, `qbResolveDest`), **검색형 아이템**(`qbResolveItem`) + **직접입력 전용칸**(자유 미션). **하이브리드 슬롯**: 기본4개 토글 온오프 + `＋슬롯추가`(프리셋칩 스와치/견본/전달건 + 자유입력, `qbAddCustomSlot`/`qbRefreshSlotBuilder`/`_qbCustomSlots`).
- **패키지 삭제**: 카드 우상단 `X`(`del-btn`, `qbDeletePackage`) → 커스텀 확인모달(`qbConfirmModal`/`qbRunConfirm`) → 연결된 미완료 픽업 cascade 삭제.
- **발송 효과**: `qbDotBurst`(도트 폭발) + `qbBigToast`(맥 다이얼로그 풍).
- ⚠️ **확인**: 하이브리드 슬롯·삭제버튼·혼용률빌더 모두 **코드에 반영 완료**(grep 확인). "안 보인다"=강력 새로고침/포크된 방 문제일 가능성.

### 미해결/다음 후보
- 단추 로고 PO 텍스트 출력 연결(기존 TODO, 지퍼 sliderLogoText 패턴).
- 실시간 동기화(Firestore onSnapshot) — 사용자 "나중에".
- 동선 패키지 슬롯의 우측 PICK 연동은 `sourceSupplier` 있는 슬롯만 노출(없으면 좌측 직접클릭).

---

## 12. 이번 세션 작업 전체 (2026-05-29) ★★최신 — 맥미니 이어가기 핵심★★

> QUEST BOARD(동선 탭)를 "자유도 높은 레트로 게임 대시보드"로 대규모 재빌드. 커밋 `c8a9ab9`→`f69736a`. 모두 `qb*` 함수, `pane-route`/`renderRoutePane()`/`qbStylesHTML()`/`buildQuestBoardHTML()`.

### ⚠️ 0. 절대 잊지 말 것 (반복 실패했던 함정 2개)
1. **카드 렌더러가 2개다 → 항상 둘 다 고쳐라.**
   - `renderPackageCard(p,brands)` = `S.packages`(NEW QUEST로 만든 패키지) 기반.
   - `renderQuestCard(q,destKey,brands)` = `S.pickups`(샘플발주/PO에서 자동생성) 기반.
   - "내 화면엔 그 기능이 없다" = 십중팔구 한쪽 렌더러에만 넣은 것. **둘 다 grep해서 둘 다 적용**.
2. **생산 대시보드 마우스 휠 = 세로만.** `pdAttachDragScroll()`(@~9794)에 있던 `wheel→가로 변환`(`wrap.scrollLeft+=e.deltaY`) 블록을 **삭제함**. 절대 되살리지 말 것. 가로 이동은 클릭드래그/트랙패드/스크롤바로만. (문서레벨 `_dragWheelInit`@~2689는 가로 차단 역할 — 유지).

### 1. 데이터 모델 (S.*)
- **`S.packages[]`** = `{id:'pkg_*',name,itemId,brandId, destGoalId, destFactoryId,destSupplierName,destBrandId, expectedShipDate,plannedShipMethod, shipMethod,sentAt, archived, memo, slots:[]}`. 발송=shipMethod+sentAt 세팅(자동삭제 안 함). 보관=archived=true.
  - **slot** = `{id:'sl_*', type('fabric'/'trim'/'pattern'/'instruction'/'custom'), customLabel, sourceSupplier, materialName, picked, pickedAt, madeStatus, srcArchived}`.
- **`S.pickups[]`** = 레거시/자동 픽업. `{id,type(PICKUP_TYPES),supplierName,itemId,brandId,subitemName, directSup,directLoc, deliveryTo:{type,factoryId,factoryName}, expectedDate,expectedTime,status('waiting'/'expected'/'ready'/'pickedUp'/'made'/'delivered'),notes, shipMethod,archived, _sampleId/_fromOrderId}`.
- **`S.goals[]`** (★신규) = NEW GOAL "보낼 곳" = `{id:'goal_*',name,type('공장'/'브랜드'/'사무실'/'협력처'/'기타'),address,phone}`. dest key = `'goal:'+id`.
- **`S.pickupSupOrder`** = 수집처 거래처 카드 드래그 순서 `{zone:[supName...]}`.

### 2. 3대 모달 (★전부 배경/Esc 클릭으로 안 닫힘 — X/취소 버튼만. 안전장치)
- **＋ NEW GOAL** (`qbOpenGoalModal`/`qbGoalModalHTML`/`qbAddGoal`/`qbDeleteGoal`/`qbCloseGoalModal`): 독립 모달. 보낼 곳 등록·목록·삭제. 대시보드 헤더 `📍 ＋ NEW GOAL` 버튼(`.qb-add-goal`). 등록분은 좌측 보드에 **빈 존으로도** 생성(`buildQuestBoardHTML`에서 `S.goals` 병합, goal: 존은 빈 채로 유지).
- **＋ NEW QUEST** (`qbOpenPackageModal`@~17234): **목적지 입력칸 제거** → 진입한 GOAL 존으로 자동지정 배너(`.qb-dest-banner`). `window._qbForcedDest`에 dest key 고정(`qbOpenPackageModalForDest`/`qbEditPackage`가 세팅). hidden `#qb-pkg-dest`. 슬롯 토글 4개(`qbRefreshSlotBuilder`→`#qb-slot-builder`)+커스텀(`#qb-custom-builder`,`qbAddCustomSlot`/`_qbCustomSlots`). 저장 `qbSavePackage`가 `goal:/fc:/sp:/brand:` 파싱→destGoalId 등.
- **＋ NEW PICK UP** (`showPickupForm(pid,opts)`@~19586): 대형 Pretendard 타이틀. 섹션마다 헤더바+도트아이콘(🎯 아이템&브랜드 청록 / 🏪 거래처&종류 검정 / ★ 세부내용 3px검정+노랑 / 📦 배송지 점선 / 📝 메모). **스마트검색**: 아이템(`pk-item-input`+hidden `pk-item`, `onPickupItemResolve` 이름→id)·거래처(`pk-supplier` datalist). **직접입력 노란박스**: `pk-sup-direct`(🏢)+`pk-loc-direct`(📍 동/호수). 저장 `savePickupForm`.
  - **슬롯모드**(`opts.slot`=`{pkgId,slotId,addNew?,pkgName,slotLabel}`+`opts.prefill`): `window._qbSlotPickupCtx`. 저장 시 새 픽업 안 만들고 **슬롯에 거래처·자재명 기록**(addNew면 새 커스텀 슬롯 push). → 우측 SOURCE 존 자동 등장.

### 3. 카드 UI (renderPackageCard + renderQuestCard 둘 다)
- 헤더: 브랜드 옆 **하늘색 ✏ 미니박스 삭제**. 대신 **`＋ 새 픽업`** 버튼(`.addpk-btn` 네온블루) — pkg=`qbAddPkgPickup`(새 커스텀슬롯), quest=`qbAddQuestPickup`(같은 목적지·아이템 새 픽업). 패키지카드는 이름 클릭=수정(`qbEditPackage`, ✎힌트). `X`=삭제.
- 슬롯 F/T/P/I+커스텀: 우측 **`✏ 수정`** 버튼(`.slot-pk`, Galmuri11) — pkg=`qbOpenSlotPickup`(슬롯 픽업정보 수정창), quest=`showPickupForm(firstPickupId)`(그 칸 첫 픽업 수정). (옛 이름 ＋PICKUP에서 변경). 발송완료(sent)면 ＋새픽업·✏수정 숨김.

### 4. 우측 SOURCE(수집처) — PICK/MADE → 취소/보관 오버레이
- `renderMatZone(typ,label,supsObj)`@~18185. 아이템/슬롯 행=`.sup-item`. 평상시: 세로 `[PICK]`(파랑)+`[MADE]`(앰버, `.btn-col`).
- PICK/MADE 누르면 행이 어둡게(`.sup-item.pending` grayscale)+`.sup-item-overlay`에 **[취소]/[보관]** 대형 라운드초록 버튼.
  - 픽업: `qbPickup`(→pickedUp)/`qbSetPickupMade`(→made) / 취소 `qbUnPickup`(→waiting,archived=false) / 보관 `qbArchivePickup`(archived=true).
  - 슬롯: `qbPickSlot`/`qbSetSlotMade` / 취소 `qbCancelSlot` / 보관 `qbArchiveSlot`(srcArchived=true).
- **MADE 매핑**: slotId 기준이라 원단(F)↔부자재(T) 안 꼬임. madeStatus=true→좌측 패키지 해당 슬롯 `🏠 메이드 확인 필요`(앰버). 그 슬롯 클릭=`qbConfirmMade`→picked(연한 네온그린 DONE).
- 마이그레이션: 기존 picked 슬롯(srcArchived 미설정)은 자동 보관처리(`buildQuestBoardHTML` 상단).

### 5. 수동 아카이브 (좌/우 대칭)
- **발송**(`qbSendPackage`/`qbSendQuest`/`qbSend`): shipMethod만 세팅, **status를 delivered로 자동전환 금지**(예전 setTimeout 삭제). 카드는 `.q-card.sent-pending`(opacity .38+grayscale+pointer-events:none, `📦 보관함으로 보내기`(`.qb-archive-btn` 네온그린)+`🔄 되살리기`만 또렷).
- 보관(`qbArchivePackage`/`qbArchivePickupQuest`)→하단 폴더. 좌 `📁 CLEAR PACKAGES`(`renderDoneQuestsSection`), 우 `📁 TRASH/CLEAR`(`renderDonePickupsSection`). 되살리기 `qbRestorePackage`/`qbRestoreQuest`(shipMethod·archived·슬롯 리셋).
- 토스트 `qbBigToast`: "발송 시작!" → **`📦 DELIVERY QUEST STARTED!`** / **`🛵 QUICK 발송 퀘스트 장전 완료!`**.

### 6. 주요 CSS 클래스 (qbStylesHTML)
`.qb-modal`/`.qb-modal-bar`/`.qb-modal-body`/`.qb-modal-acts`, `.qb-goal-box`(.goal-hd 청록헤더), `.qb-dest-banner`, `.qb-layer-row`/`.qb-layer-box(.mission)`, `.qb-slot-box`/`.qb-custom-box`, `.qb-add-goal`/`.qb-add`/`.qb-add-pkg-card`(존 ＋카드), `.fc-zone`(아코디언), `.q-card(.complete/.sent/.sent-pending)`, `.slot(.pending/.on/.made/.excluded + .fabric/.trim/.pattern/.instruction)`, `.slot .slot-pk`(✏수정), `.q-card-hd .addpk-btn`/`.del-btn`/`.nm-edit`, `.sup-item(.pending/.picked/.made-pending)`/`.sup-item-overlay .si-cancel/.si-archive`/`.btn-col .pk/.made-btn`, `.qb-done`(보관함), `.pk-direct`(픽업 직접입력).
- 색: `--ink #0B0A05` / `--neon-green #A5E6BA` / `--neon-blue #B0DBF0` / 청록 `#2EC4B6`(GOAL/teal) / 노랑 `#FFF6B8`(자유미션/세부내용). 폰트: Press Start 2P(영문라벨)+Galmuri11(제목·버튼)+Pretendard(본문).

### 7. 미해결/다음 후보
- 단추 로고 PO 텍스트 출력 연결(기존 TODO).
- 실시간 동기화(Firestore onSnapshot) — "나중에".
- NEW GOAL과 기존 공장/브랜드 zone이 별개로 뜸(goal: vs fc:/brand:) — 통합 원하면 작업 필요.
- 미리보기 시안 파일: `~/Downloads/files/mockup-quest-pickup.html`, `mockup-v4.html`(로컬 `python3 -m http.server`로 봄, 깃 미추적).

---

## 13. 맥미니에서 이어가기 (이 문서 + git)
1. 맥미니에 저장소 클론/풀: `cd ~/Documents && git clone https://github.com/subak805-netizen/fpf-manager.git`(처음) 또는 `cd ~/Documents/fpf-manager && git pull`(이후). → 최신 `index.html` + `CLAUDE.md` 받음.
2. 작업본 경로: 맥북은 작업본 `~/Downloads/files/index.html`, 깃 저장소 `~/Documents/fpf-manager/`. 맥미니도 동일 구조 권장(또는 저장소에서 바로 작업). **수정→문법검사→`cp`로 저장소 복사→commit→push** 흐름.
3. Claude Code 새 세션: 저장소 폴더에서 시작하면 `CLAUDE.md` 자동 로드(맥락 복구). 세션 히스토리는 기기별 로컬이라 안 넘어감 → 이 문서로 재구성.
4. **검증**(네트워크 없이 정적검사). node 없으면 macOS JavaScriptCore:
   ```bash
   python3 - <<'PY'
   import re;h=open('index.html',encoding='utf-8').read()
   s=re.findall(r'<script\b[^>]*>(.*?)</script>',h,re.S|re.I)
   open('/tmp/chk.js','w',encoding='utf-8').write("\n;\n".join(x for x in s if x.strip()))
   PY
   JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
   "$JSC" -e 'try{new Function(readFile("/tmp/chk.js"));print("SYNTAX OK")}catch(e){print(e instanceof SyntaxError?"ERR:"+e.message:"OK")}'
   ```
5. 배포: GitHub Pages `subak805-netizen.github.io/fpf-manager` (push → 1~2분 빌드 → 강력 새로고침).
6. 깃 인증: 맥미니 첫 push 시 GitHub 토큰/SSH 필요할 수 있음(사용자 직접 로그인).

---

## 14. 이번 세션 (2026-05-30~31) ★★★ 새 세션 이어가기 핵심 ★★★

> 맥미니에서 진행. 커밋 흐름: `94b6b61 → 8bd6ec7 → f10ac69 → dc902c0 → 5e86e1c → 03d1c08 → bd5a356 → (이번 폼 정리)`. 모든 작업은 **미리보기 먼저**(`/tmp/fpf-preview/_live.html`, `python3 -m http.server 8754 --directory /tmp/fpf-preview`, `.claude/launch.json`의 `fpf-preview`) → 검증 → index.html 이식 → push. **DESIGN_GUIDE.md** 변경 이력(15~) 참고.

### 0. 테마/검증 (이 세션 확정)
- 부팅 기본 테마 = **retro**. localStorage 키 `fpm_theme`·`fpfTheme`. `applyTheme('retro'|'minimal')`. retro 토큰: `--ink #0B0A05`, `--neon-green #A5E6BA`, `--neon-blue #B0DBF0`, `--paper`, `--font-display`(Galmuri11), `--font-pixel`(Press Start 2P).
- 검증 = `<script>` 추출 후 JSC `new Function()` SYNTAX OK (§1·§13 스크립트).
- 미리보기 링크 규칙: 폰 `http://localhost:8754/phone.html`(390 iframe) + 데스크탑 `_live.html` **둘 다** 제시. (메모리 feedback_preview_first.md)

### A. 탭 구조 전면 개편 (03d1c08)
- **알림 탭 삭제**. nav(`<div class="nav">`@~798) = 할일·동선·아이템·**진행**·불량관리·분석·🏢업체관리.
- **「진행」 묶음 탭**(`nt-progress`, `switchTab('dash')`): `#progress-subtabs` 서브탭바 = 생산 대시보드(dash)·오더 관리(orders)·샘플 대시보드(board)·샘플 발주(sample)·결제 관리(pay)·**단가장(book)·잔량(leftover)**. `switchTab`(@~2897)에 `progressGroup=['dash','orders','book','leftover','board','sample','pay']` + `pt-*` 버튼 하이라이트. **단가장/잔량은 오더관리에서 빼서 결제 뒤로 이동**.
- **샘플 진행보드 → 샘플 대시보드** 개명(renderBoardPane @~16725 헤더 텍스트).
- **모든 서브탭 이모티콘 제거**.
- **오더 완료탭**: `#orders-subtabs` = 오더 목록 / 완료 (t==='orders'일 때만 표시). `window._orderView`('active'|'done'), `showOrderList(view)`, `isOrderDone(o)`(=oLabel 출고완료/결제완료). renderOrderPane(@~7287)에서 view 필터.
- **결제 탭**(pane-pay @~927): 서브탭 **「브랜드별 보기」(t-pay-all)+「결제 완료」(t-pay-done)만**. switchPayTab(@~12364) 단순화. renderItemPay(@~12794)가 `opts{onlyDone,groupByMonth}` 받음 — 기본=미결제만(allPaid 숨김), 완료탭=allPaid만 **월별 그룹**(`.pay-month-hdr`). 공장선택pills·결제완료체크박스·영수증AI·일괄결제·전체/공장처/거래처/차트 **삭제**.
- **생산 대시보드 2줄**(renderProdDash @~10167 / renderProdDashRow @~10446): thead **제거**(각 셀 `.pd-stage-lbl` 자체 라벨). 통계 박스=클릭 필터(`pdSetView`). **샘플 대시보드 통계도 클릭 필터**(`sbSetView`, `window._sbView`).
- **할 일 빠른추가 재배치**(renderTasksPaneByBrand @~17316): 1줄=버튼(브랜드·어디서 시장/사무실/연락만·오늘/내일 — `qaSetBtn(btn,group,val)`+hidden `new-task-brand`/`new-task-loc`/`new-task-pri`), 2줄=아이템(검색 datalist `dl-task-item`+hidden `new-task-item`, `onQuickTaskItemPick`)+내용+추가, 3줄=업체+픽업위치+샘플생산. `.qa-btn`/`.qa-grp`/`.qa-sep` CSS.

### B. 모바일 (03d1c08)
- 통계 박스 한 줄(`@media(max-width:720px) .pd-topbar{flex-wrap:nowrap}` 숫자↑·라벨↓). 
- **「≡ 메뉴 접기/펼치기」**(`#mobile-nav-toggle`, `body.nav-collapsed`) → .nav+#progress-subtabs+#orders-subtabs 동시 접힘.
- 오더/샘플 목록 **전체폭**: `.split{width:100%!important}`(모바일), `#pane-orders/.sl`·`#pane-sample .sl{width:360px}`은 `@media(min-width:769px)` 데스크탑 한정.
- 가로스크롤 sticky 떨림 제거(.pd-topbar position:static).

### C. 생산 대시보드 D-day + 원/부자재 동기화 (bd5a356)
- **D-day 버그**: orderShipETA(전 공정 최소날짜) → "6/5인데 지연" 오판. renderProdDash(@~10236) eta를 `(sewSch&&(sewSch.shippingDate||sewSch.shipExpectedDate))||o.shippingDate` 로 교정(행 표시 출고일과 일치).
- **원/부자재 입고예정일 동기화**: 생산대시보드 원자재/부자재 칸 ↔ 오더상세 ③입고탭 원단처/부자재처 출고예정일(`o.suppliers[sn].expectedShipDate`). `orderPrepShipDate(o,kind)`/`setOrderPrepShipDate(o,kind,val)`(@~pdSavePrep). prepCell이 fab/trim은 supplier date 읽고 `data-prepkind`로 양방향 저장.
- **임박 알람**: prepCell에 입고예정일 D-3 이내=노랑 `D-N`, 지남=빨강 `지연 N일` 배지(`.pd-prep-dday`).

### D. 아이템 수정 폼 (원단·부자재 카드) 대정비 (이번 세션 막바지, push 직전/직후)
- **부자재 사라짐 치명버그 수정**: `colTR()`@~5372·`colFR()`@~5337 — 행을 순서(index) 대신 **행 id 기준**(`+r.id.replace('tr-','')`)으로 수집(라벨류가 #label-trim-rows로 빠져 인덱스 어긋나던 문제). `autofillTrim`@~3325 첫머리 `colTR()` 추가.
- **trimRowHTML**(@~4973): 특수 타입 조기 return — bias(@~4981)·careLabel(@~5028)·mainLabel(@~5065)·zipper(@~5120)·button(@~5158), 나머지(개수/롤/절/야드/실/레이스/단추고리)는 일반 경로(@~5190).
- **일반 카드 레이아웃**(사용자 확정): 헤더=타입뱃지+**단위**(롤=rollUnit select/개수=unit, 헤더로 올림)+용도+🗑. 그 아래 ①부자재처/동/호수 ②**부자재명+크기/규격+색상** ③**[불러오는 값] 고정yard(절당/컷당/야드당개수/1절당)+단가** ④점선 구분 ⑤**[직접 입력] 요척+로스**. (벌당수량→**요척** 통일).
- **원단 카드**(fabRowHTML @~4644): 헤더=타입(야드/KG단가)+용도+🗑. ①원단처/동/호수 ②**원단명+폭+야드단가** ③요척+로스 ④비고 ⑤적용컬러+혼용률.
- **＋가공비 버튼 = 모든 부자재 카드 하단(우측)**: trimRowHTML 래퍼 IIFE(@~5216 직후)가 결과 끝 `</div>` 앞에 footer 주입. 헤더의 가공비 전부 제거.
- **특수 타입 공통 통일**(사용자: "공통 부분만"): bias·careLabel·mainLabel·zipper 헤더에 **용도(part)** 추가(이미 있던 일반·단추 포함 전 타입 용도 보유). 타입별 전용칸(지퍼 슬라이더·바이어스 가공처/원단출처·라벨 라벨명 등)은 그대로.
- **레트로 컬러 보정**: `#pane-items .fab-row`(2.5px ink+그림자), `.tx-extras`(추가옵션 박스 크림+ink), `.trim-add-grid .btn`·가공비 버튼 각진 ink — `html[data-theme="retro"]` 스코프(@~285 부근 CSS).
- **부자재 추가 버튼줄에서 케어라벨·메인라벨 제거**(완성 부자재 섹션에만). 아이템 탭 **타입변환** 버튼 제거(이전).

### E. 그 외 이번 세션
- 아이템 리스트(renderItemsList @~4061): **준비 시작일**(`itemStartDateHTML`/`setItemStartDate`, it.startDate||createdAt, `itemStartISO`) + **KC 인증완료 토글칩**(`itemKcHTML`/`toggleItemKc`, it.kcCert/kcCertAt) — 행 오른쪽 `.im-meta`. **정렬 오름/내림 토글**(`toggleItemSort`, window._itemSortDir). 액션칸 고정폭 300px(`.im-row` grid `160px minmax(0,1fr) 300px`)로 정보칸 줄바꿈/ KC토글 reflow 해결. 배지 첫칸(.ib-phase) 검정→흰색.
- `saveItemForm`(@~5652): 폼 저장 시 리스트 전용 메타(statusManual/hold/qc/costSent/costSentAt/createdAt/startDate/kcCert/kcCertAt) **보존**(oldItem에서 복사) — 안 그러면 초기화되던 버그.
- 아이템/오더/결제 탭 + 오더상세패널(#o-sr) retro 스킨(dc902c0). 결제 명세서(buildPayReceiptHTML, html2canvas)는 **불변**(업체 전달용).

### F. 미해결/다음 후보
- 결제 적용컬러 박스 노랑은 의도(레트로 강조색)로 유지 — 톤 변경 요청 시.
- 특수 타입(지퍼/단추/라벨/바이어스)에 일반 카드의 "상단=불러옴/하단=요척·로스" 분리는 미적용(필드가 달라서). 요청 시 개별 작업.
- 실시간 동기화(Firestore onSnapshot) — "나중에".

