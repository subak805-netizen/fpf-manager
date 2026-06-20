# fpf-manager 디자인 지침서 (DESIGN GUIDE)

> **⚠️ 무조건 규칙 (사용자 명시):** UI/디자인 작업을 할 때는 **항상 이 문서를 먼저 읽고** 그대로 따른다.
> 디자인 결정이 바뀌거나 새 규칙이 생기면 **반드시 이 문서를 그 자리에서 업데이트**한다. (예외 없음)
> 작업 순서는 항상 **독립 mockup 미리보기(핸드폰용 + 사이트용 링크 둘 다) → 사용자 승인 → index.html 반영**. (feedback_preview_first 규칙)
>
> **⚠️⚠️ 두 테마 모두 적용 규칙 (사용자 강력 명시 · 예외 없음):**
> 사용자가 요청한 변경이 **"레트로 전용 디자인"**(레트로 색/선/그림자/픽셀아이콘/레트로 체크박스/Galmuri·Press Start 폰트 등 레트로 룩 그 자체)이 **아닌 한**, 그 변경은 **기본(minimal)·레트로(retro) 두 테마 모두에 적용**돼야 한다. 칸 구조·필드 추가·칸 크기/정렬·여백·스피너 제거·줄바꿈 묶음·버튼 위치 같은 **레이아웃/구조/UX 변경은 전부 "테마 무관"** → 두 테마 다 바뀌어야 한다.
> 1. **매 요청마다 먼저 분류한다:** 이 변경이 "테마 무관(공통)"인가, "특정 테마 전용 룩"인가?
> 2. **테마 무관이면 공용 HTML / base CSS에 넣어** 두 테마에 자동 적용되게 한다. **절대 `[data-theme="..."]`로 가두지 않는다.**
> 3. **반영 후 반드시 두 테마 모두에서 검증**하고(미리보기에서 `minimal`·`retro` 둘 다 전환·측정/스크린샷), "양쪽 다 적용됨"을 사용자에게 보고한다.
> 4. 애매하면(예: 체크박스 모양처럼 룩이자 구조인 것) **사용자에게 어느 테마에 적용할지 물어본다.**

이 문서는 사용자 요청에 따라 **3개 부분**으로 나뉜다.
- **① 포괄디자인 적용법** — 테마와 무관하게 모든 화면에 공통으로 적용되는 구조·레이아웃·UX·안전장치 규칙. (테마 아키텍처, 폼/레이아웃 확정안, 공통 UX, iOS 인풋 정규화)
- **② 기본디자인 적용법** — `기본(minimal)` 테마 전용. 둥근 모서리·연한 회색선·옐로우 포인트의 깔끔한 기본 핏.
- **③ 레트로디자인 적용법** — `레트로(retro)` 테마 전용. "동선탭(QUEST BOARD)"과 한 몸처럼 보이는 레트로 게임 핏. 다른 탭을 레트로로 만들 때도 이 토큰/컴포넌트를 그대로 쓴다.

---

# ① 포괄디자인 적용법 (테마 무관 · 모든 화면 공통)

## 0. 테마 아키텍처 (가장 중요)
- `<html data-theme="minimal|retro">` + **CSS 변수(커스텀 프로퍼티)로만** 디자인을 갈아끼운다. **HTML 구조와 JS는 건드리지 않는다** → 기능 변경이 두 테마에 자동 반영, 오류 없음.
- 기본 테마 이름 = **"기본"**(minimal, 디폴트), 두 번째 = **"레트로"**(retro). localStorage 키 `fpfTheme`, 전환 함수 `setTheme(t)`.
- 테마별로 바꾸는 건 **토큰(`--*` 변수)뿐**. 토큰으로 안 잡히는 디테일만 `[data-theme="retro"] ...` 같은 오버라이드 블록에 추가한다.
- **🔴 테마 무관 변경 = 두 테마 모두 적용 (최상단 강력규칙 참조).** 레이아웃·필드·칸크기·여백·스피너·버튼 위치 등 "룩이 아닌" 변경은 base CSS/공용 HTML에 넣어 `minimal`·`retro` 둘 다 자동 반영되게 하고, 반영 후 **두 테마 모두에서 검증**한다. `[data-theme="retro"]` 블록에는 **레트로 고유 룩만** 넣는다.
- **공통 토큰 목록(두 테마가 같은 이름으로 정의):** `--page-bg --font --text --t2 --t3 --h1 --card-bg --card-bd --card-bdw --card-radius --card-shadow --head-bg --head-bd --typ --use-bg --use-bd --input-bg --input-bd --input-radius --accent --accent-bg --accent-bd --accent-text --soft-bg --soft-bd --colors-bg --colors-bd --colors-text --btn-bg --btn-bd --red`. 새 컴포넌트는 색·선·반경을 하드코딩하지 말고 이 토큰을 쓴다.

## 1. 폼/레이아웃 디자인 결정 (확정됨 · 원단/부자재 폼)
- **용도**를 카드 맨 위(헤더)로 이동. 헤더 한 줄 = `[타입] [단위 드롭다운] [용도 입력] ……… [🗑 삭제]`. 삭제는 `margin-left:auto`로 항상 우상단.
- **`＋가공비`(부자재) 버튼은 헤더에서 빼고 카드 맨 하단 오른쪽 모서리에 고정**(`.card-foot{display:flex;justify-content:flex-end}`). 헤더에 같이 두면 모바일에서 삭제가 아래로 밀려 내려감 → 분리해서 해결.
- **헤더 컨트롤 전부 동일 높이·동일 폰트·세로 중앙·간격 8px 통일.** 높이는 변수 `--hc:34px`로 묶고 모든 헤더 컨트롤(`.typ`/`select`/`.btn`/`.use-box`/`.head-del`)에 `height:var(--hc)` 적용, 폰트는 전부 `13px`. (사용자 명시: "보더·버튼보더 높이랑 안에 폰트 크기 동일하게")
- **삭제(🗑)는 우상단 정렬 — 단, `position:absolute` 금지.** `margin-left:auto`로 밀어서 다른 컨트롤과 같은 flex 라인에 두어야 높이·세로중앙이 100% 보장된다. (absolute로 띄우면 iOS에서 "납작/위로 치우침" 발생 → 사용자 반복 지적의 원인이었음)
- **원단명 입력칸 넓힘**(flex 크게). 길어도 넉넉히.
- **거래처 행은 `[거래처][동][호수]` 3칸** — 원단·부자재 **둘 다 동일**(부자재처도 동/호수 가짐). 거래처명 own row가 아니라, 원단명/부자재명은 다음 줄에 넓게 단독 배치(flex:2).
- **칸 폭은 위·아래 행 컬럼이 시각적으로 정렬되게 flex 비율을 맞춘다.** 예: 원단 `요척(yard)`은 윗행 `폭+야드단가` 폭에 맞춰 넓히고(flex≈1.3), `로스%`는 윗행 `단위` 폭에 맞춤(flex≈.5). (사용자: 선으로 칸 정렬 표시)
- **적용 컬러 행의 `단가` 입력칸은 데스크탑에서 넉넉히(96px)**, 단 모바일(≤540px)에선 가로 넘침 방지로 60px·체크칸 min 62px·gap 5px로 축소(미디어쿼리). 단가+원은 `.prw`(nowrap)로 묶어 '원' 안 떨어지게.
- **단위 드롭다운**(표시용 라벨, 계산엔 영향 없음): 원단 = y/kg, 부자재 = 개/롤/절/봉/컷. 처음엔 직접 선택, 저장 후 자동 호출.
- **혼용률**은 오른쪽 분할 영역에 고정(`.fab-split` `6fr 4fr`, `border-left`). 모바일(≤540px)에선 아래로 쌓임(점선 구분).
- **혼용률 Row 빌더**: `[성분명][비율%][×]` 행 + `＋혼용성분 추가`. composition은 줄바꿈 문자열로 저장.
- **저장 후 자동 호출**: 거래처+이름으로 단가·단위·폭·혼용률 자동 채움(처음만 직접 입력). `updTnmDL`/`autofillTrim`/`saveToPB` 패턴.

### 적용 컬러 & 단가 (보수적 원가)
- 원단·부자재 모두 **적용 컬러 칸**(체크=발주 / 미체크=제외) + **컬러별 단가 입력 신설**.
- 색상명 비우면 우리 컬러명 그대로 발주. 컬러 단가 비우면 기본 단가 적용.
- **원가는 보수적으로 = 적용된 컬러 단가들 중 MAX.** 발주서(PO)엔 컬러별 실단가 표시, 원가/마진 계산에만 MAX 사용.

### 공통 사용 / 부자재 per-order
- 원단·부자재 **둘 다 "공통 사용" 체크박스**. 뒤에 안내 문구는 붙이지 않음(뱃지 NEW만).
- 부자재 **벌당수량**은 원단의 요척과 같은 개념 → per-order(발주) 영역에 2층으로 배치.

## 2. ⚠️ 인풋/셀렉트 정규화 (iOS Safari 필수 — 안 하면 둥글게/납작하게 나옴)
> 레트로에서 특히 두드러지지만 **원리는 테마 무관**이라 포괄 규칙에 둔다.
- **아이폰 Safari는 `<input type=number>`·`<select>`를 네이티브(menulist)로 강제 렌더** → `border-radius`·높이 지정을 무시하고 둥근 모서리 + 제멋대로 높이가 나온다. 데스크탑 Chrome에선 멀쩡해 보여서 놓치기 쉬움(실제 사용자는 폰).
- **반드시 `-webkit-appearance:none; appearance:none;`** 를 모든 인풋·셀렉트에 적용 → 모서리·높이 내가 지정한 대로 + 숫자칸 스피너(↕) 제거.
- `appearance:none` 하면 select 네이티브 화살표가 사라지므로 **커스텀 화살표**를 background SVG로 넣고 `padding-right` 확보.
- **같은 영역의 모든 보더 높이는 동일하게** 명시(예: 본문 인풋·헤더 컨트롤 모두 34px)해 select가 input보다 커지거나(Chrome) 납작해지는(iOS) 것 방지.

## 3. 공통 UX 원칙 (전 화면 · 절대 깨면 안 됨)

### 🔴🔴 정렬 & 줄바꿈 자가검수 (사용자 여러 번 반복 지적 · 매 디자인 무조건 확인)
> 사용자가 여러 번에 걸쳐 같은 걸 지적함 → **디자인할 때마다 항상 아래를 체크하고 "정렬 확인함"이라고 보고할 것.** (예외 없음)
1. **칸 안 글씨 한 글자만 줄바꿈 금지.** 표/칩/버튼/라벨에서 마지막 한 글자가 다음 줄로 떨어지는 것(예: "한빛봉제"→"한빛봉/제", "완료처리"→"완료처/리") 절대 금지. → 해결: 해당 요소에 `white-space:nowrap` + 필요하면 폰트 살짝 축소 또는 칸 폭 재배분. 줄바꿈으로 우그러뜨리지 말 것.
2. **나란히 놓인 통계/스탯 박스의 글자 세로정렬 일치.** 박스 안 숫자 폰트 크기가 달라도(예: 금액칸만 작게) 라벨 baseline이 어긋나면 안 됨 → 숫자 영역을 `min-height` 고정 + flex center로 묶어 라벨 Y를 통일.
3. **표 컬럼 폭 재배분:** 내용이 짧은 칸(날짜 등)은 좁히고, 줄바꿈 위험 있는 칸(공장명·오더명·상태)에 폭을 양보. 칸이 "널널"하면 좁혀서 다른 칸 살리기.
4. **반영 후 실제 폭(특히 390px 모바일)에서 줄바꿈/정렬 눈으로 확인.** 데스크탑만 보고 넘기지 말 것.

- **🔴 좌우 무한확장 금지 (max-width로 가둠).** 입력바·검색창·셀렉트·카드·명세서 등 콘텐츠 영역은 와이드 데스크탑에서 화면 끝까지 늘어나면 안 됨 → 컨테이너에 `max-width`(보통 **760px 안팎**)를 주고, flex 자식 입력은 `min-width:0`, 기간/짧은 select는 `flex:0 0 auto;max-width`로 폭 고정. (사용자 지적: 택배시재 빠른입력/입금계좌/기간 셀렉트가 좌우로 마구 늘어남 → `.cl-root{max-width:760px}` 등으로 해결, 2026-06-15)
- number 입력칸 모바일 숫자패드(`inputmode`), 숫자 스피너 제거, `tabular-nums`로 숫자 안 잘리게.
- **숫자 스피너(↕) 전역 제거** — 테마 무관·모든 탭 공통으로 base CSS에 박는다: `input[type=number]{-moz-appearance:textfield;appearance:textfield}` + `input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}`. (사용자: "숫자 보더 안 화살표 모든 탭에서 다 없애줘".)
- **`단가`+`원` 같은 값+단위 묶음은 `display:inline-flex;white-space:nowrap`로 한 덩어리**(`.prw`)로 감싼다 → 좁은 모바일 폭에서 단위(원)가 줄바꿈돼 혼자 떨어지는 것 방지.
- Enter 키로 폼 submit 막기 + 다음 칸 포커스 이동. 단위 누락 시 팝업.
- 모달 배경/Esc 클릭으로 안 닫힘(X·취소 버튼만) — 입력 중 실수 방지.
- CS 사용량/단가 수정값은 아이템(csQtyOvr/csPriceOvr)에 저장·동기화.
- 활성 탭 강조, 저장 토스트.
- **"이 화면만" 고치지 말고 같은 종류 전부** 고친다(카드 렌더러가 2개면 둘 다).
- 사용자는 **아이폰**에서 확인 → 항상 핸드폰 프레임으로도 검수. 미리보기 링크는 **핸드폰용 + 사이트용 둘 다** 제공.

---

# ② 기본디자인 적용법 (minimal "기본" 테마)

깔끔·중립·가독성 위주. 둥근 모서리 + 연한 회색선 + 화이트 카드 + 블루 액센트 + 옐로우 포인트.

### 토큰 (`:root` 기본값)
| 토큰 | 값 | 비고 |
|---|---|---|
| --page-bg | `#f0eee9` | 연한 웜그레이 배경 |
| --font | 시스템 폰트(`-apple-system, …, "Apple SD Gothic Neo"`) | 본문 가독성 |
| --text / --t2 / --t3 / --h1 | `#222` / `#666` / `#999` / `#222` | 무채색 글자 단계 |
| --card-bg / --card-bd / --card-bdw / --card-radius / --card-shadow | `#fff` / `#e0ddd8` / `1px` / `8px` / `none` | 둥근 화이트 카드, 그림자 없음 |
| --head-bg / --head-bd / --typ | `#f8f7f5` / `#e0ddd8` / `#475569` | 연한 헤더 |
| --use-bg / --use-bd | `#fff` / `#cbd5e1` | 용도 박스 |
| --input-bg / --input-bd / --input-radius | `#fff` / `#e0ddd8` / `6px` | 둥근 인풋 |
| --accent / --accent-bg / --accent-bd / --accent-text | `#185FA5` / `#eff6ff` / `#bfdbfe` / `#1e40af` | 블루 액센트·정보 박스 |
| --soft-bg / --soft-bd | `#f8f7f5` / `#c5c0ba` | 보조 박스 |
| --colors-bg / --colors-bd / --colors-text | `#fef9c3` / `#fde68a` / `#854f0b` | **적용 컬러 박스 = 옐로우**(기본 테마는 노랑 유지) |
| --btn-bg / --btn-bd / --red | `#fff` / `#c5c0ba` / `#A32D2D` | |

### 적용 원칙
- 둥근 모서리(radius 6~8px) 유지, 그림자는 쓰지 않거나 아주 약하게.
- 이모지 아이콘은 **플랫 이모지 그대로**(🧶 📌 🔗 🔄 💡 🗑 등) — 레트로처럼 픽셀화하지 않는다.
- 체크박스는 OS 기본 `accent-color` 스타일.
- 폰트는 시스템 폰트(픽셀 폰트 안 씀).

---

# ③ 레트로디자인 적용법 (retro 테마 · = 동선탭 QUEST BOARD)

### 토큰 (`[data-theme="retro"]`)
| 토큰 | 값 | 용도 |
|---|---|---|
| --page-bg | `#EFE8D4` | cream 배경 |
| --font | `'Galmuri11','Pretendard Variable',…` | 픽셀 우선 |
| --text / --t2 / --t3 / --h1 | `#0B0A05` / `#3a3528` / `#6b6555` / `#0B0A05` | ink + 톤다운 브라운 |
| --card-bg / --card-bd / --card-bdw / --card-radius / --card-shadow | `#fff` / `#0B0A05` / `2.5px` / `3px` / `4px 4px 0 #0B0A05` | 각진 카드 + 하드 그림자 |
| --head-bg / --head-bd / --typ | `#B0DBF0` / `#0B0A05` / `#0B0A05` | neon-blue 헤더 |
| --use-bg / --use-bd | `#fff` / `#0B0A05` | |
| --input-bg / --input-bd / --input-radius | `#fff` / `#0B0A05` / `0` | 각진 인풋 |
| --accent / --accent-bg / --accent-bd / --accent-text | `#0B0A05` / `#EAF3F8` / `#0B0A05` / `#0B0A05` | neon-blue-tint 안내 |
| --soft-bg / --soft-bd | `#F5F1E8` / `#0B0A05` | paper2 |
| --colors-bg / --colors-bd / --colors-text | `#E8F6EE` / `#0B0A05` / `#0B0A05` | **적용 컬러 박스 = 연두**(빛바랜 네온그린 틴트) |
| --btn-bg / --btn-bd / --red | `#fff` / `#0B0A05` / `#c0392b` | 삭제 버튼 보더만 빨강 |

### 1. 👾 각진 픽셀화 (No Rounding)
- 모달·카드·인풋·버튼·셀렉트·뱃지 등 **모든 요소의 둥근 모서리 전면 제거**(`border-radius:0`). 오락실 UI처럼 칼같이 각진 사각형.
- 스크롤바도 둥근 기본 스타일 지양 → 두껍고 각진 무채색 커스텀 스크롤바(적용 시).
- **체크박스/라디오는 "약간 둥글린 네모"(rounded square, `border-radius:3px` + ink 센터 닷)** — 사용자 지정. 동그라미(원형) 아님. 각진 규칙과 일관되게 살짝만 라운드. (§5 컴포넌트 패턴 참고)

### 2. 🎨 저채도 파스텔 & 크림톤 (Color Palette)
- **쨍한 원색·형광색 금지.** 빛바랜 레트로 톤만.
- **연두(네온그린) 비율을 노랑보다 높게 유지**(사용자 명시). 노랑은 소수 포인트로만.
- **🎮 "NEW QUEST 모달 톤앤매너"가 레트로 폼의 정답지 (사용자 가장 만족하는 화면):**
  - **메인 = 상큼한 민트 그린.** 섹션 헤더(`.sec-h`)·공통사용 토글(`.common`)·적용컬러 박스(`.colors`)는 민트 틴트 `#E8F6EE`, 메인 추가/등록 CTA 버튼은 솔리드 민트 `#A5E6BA`.
  - **서브 = 파스텔 옐로우 `#FFF6B8`** (점선 ink 보더). 자유입력/안내/팁 같은 보조 박스에만. (예: 자동호출 안내 박스 — 기존 블루를 옐로우로 교체)
  - **입력칸 = 화이트.** 칙칙한 회색·빛바랜 블루·탁한 베이지(`#F5F1E8` 등)는 폼에서 빼고 민트/옐로우/화이트로 응집.
  - 블루(`#B0DBF0`)는 모달 타이틀바 정도의 최소 포인트로만.
- 동선탭에서 추출한 정확한 팔레트:

| 이름 | 값 | 용도 |
|---|---|---|
| ink | `#0B0A05` | 모든 외곽선·하드그림자·near-black 글자 |
| cream | `#EFE8D4` | body 배경 |
| paper / paper2 | `#FFFCF7` / `#F5F1E8` | 카드 안 / 연한 박스 |
| neon-green | `#A5E6BA` | 완료·체크ON·강조 (메인 포인트) |
| neon-green-tint | `#E8F6EE` | 연두 박스 배경(적용컬러 등) |
| neon-blue | `#B0DBF0` | 헤더·액션 버튼 |
| neon-blue-tint | `#EAF3F8` | 정보/자동안내 박스 |
| teal (GOAL) | `#2EC4B6` | NEW GOAL 등 청록 헤더 |
| amber/cream-yellow | `#FFF6B8` | 자유미션/특수 강조 (소수만) |
| 보조글자 | `#3a3528` / `#6b6555` | t2 / t3·placeholder |
| red(삭제) | `#c0392b` | 삭제 버튼 보더만 |

### 3. 🖤 2px ink 외곽선 & 하드 드롭 섀도우 (Line & Shadow)
- 카드·박스·강조버튼 테두리 = **2px(카드/타이틀은 2.5px) 진한 ink `#0B0A05`** 라인. 얇은 회색선 금지.
- 그림자 = 흐린 그라데이션이 아니라 **오프셋이 딱 떨어지는 하드 드롭 섀도우**: 카드 `4~5px 4~5px 0 #0B0A05`, 작은 박스 `2~3px 2~3px 0`. 포스트잇 칩 감성.
- 버튼/체크박스 `:active` 시 `box-shadow:none; transform:translate(2px,2px)` (눌리는 픽셀 느낌).
- 내부 인풋 격자선·자재 경계선도 2px ink로 통일해 선 밀도 일치.

### 4. 🔤 고밀도 폰트 & 도트 아이콘 (Font & Icon)
- **폰트 역할 분리(동선탭과 동일):**
  - 큰 타이틀·헤더·버튼·뱃지 = **Galmuri11**(픽셀 폰트). 폴더명/버튼 감성.
  - 입력 라벨(보더 바깥) = **Pretendard 극태(font-weight 800, extrabold)**. 글자색 `#0B0A05`.
  - 입력 값(보더 안) = **Pretendard 500** (라벨보다 살짝 얇게 — 사용자 명시 대비 규칙).
  - **데이터 값/명세(컬러명 등 읽어야 하는 텍스트) = Pretendard** (Galmuri11 금지). 픽셀폰트로 두껍게 뭉치면 명세 가독성이 막힘 → 슬롯/버튼 라벨만 Galmuri11, "데이터"는 Pretendard로. (예: 적용컬러의 아이보리/차콜/베이지 = Pretendard 700)
  - 긴 안내문·본문 = Pretendard (픽셀폰트 가독성 회피).
- **여백(Padding):** 2px ink 보더는 유지하되 **글자가 선에 들러붙지 않게 안쪽 패딩을 넉넉히**(박스 ≥ `12~15px`, 인풋 좌우 `12px`). 답답함 해소가 핵심(사용자 명시).
  - 영문 라벨/숫자 전광판(PICK/DEST 등) = **Press Start 2P**.
- 글자색은 흐린 회색 배제, **선명한 near-black `#0B0A05`**. placeholder도 흐리지 않게(`#6b6555`, opacity:1, weight 500).
- **폰트 로딩 URL (반드시 작동 확인된 것 사용):**
  ```css
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/galmuri@2.40.3/dist/galmuri.css');  /* Galmuri11 포함 */
  ```
  - ⚠️ **함정:** 예전 `projectnoonnu/noonfonts_2206-02@1.0/Galmuri11.css` 는 **404** → Galmuri11이 조용히 Pretendard로 폴백됨. 위 `galmuri@2.40.3/dist/galmuri.css` 가 정상.
  - 🔧 **index.html 동선탭(line ~16927)도 이 깨진 URL을 쓰고 있음** → 레트로 반영 시 거기도 같이 고쳐야 동선탭 Galmuri11이 진짜로 뜬다.
  - `document.fonts.check('14px Galmuri11')` 는 **없는 폰트도 true 반환**(신뢰 금지). 실제 로딩 확인은 `document.fonts.forEach`로 `Galmuri11:loaded` 가 뜨는지 본다.

#### 4-1. 🟩 도트 픽셀 아이콘 (플랫 이모지 금지)
- 실사형 플랫 이모지(🧶 📍 ★ 📦 🏠 ✉️ 🔗 📌 🔄 💡 🗑 등)는 레트로 그리드와 안 어울림 → **8×8 도트 그리드 인라인 SVG 픽셀 아이콘**으로 교체(사용자 명시).
- 구현 패턴: `<svg>` 스프라이트(`<symbol id="px-*" viewBox="0 0 8 8">`)를 body 상단에 한 번 정의 → 각 자리에서 `<svg class="px"><use href="#px-*"/></svg>` 참조. 픽셀은 `<path>`의 사각형 런으로 그림.
- **테마 토글:** 같은 자리에 `<i class="hemoji">🧶</i><svg class="px"><use .../></svg>` 둘 다 두고, 기본=이모지/레트로=SVG로 전환.
  ```css
  .px{display:none;width:14px;height:14px}            /* 기본: 픽셀 숨김 */
  [data-theme="retro"] .hemoji{display:none}          /* 레트로: 이모지 숨김 */
  [data-theme="retro"] .px{display:inline-block}
  [data-theme="retro"] .px path{fill:#0B0A05}
  ```
- 현재 정의된 도트 아이콘: `px-fabric`(실패/보빈=원단), `px-button`(4구 단추=부자재), `px-count`(#=개수), `px-trash`(휴지통 ridge=삭제), `px-link`(고리 두 개=공통사용), `px-star`(별=적용컬러), `px-refresh`(순환 화살표=자동호출), `px-bulb`(전구=팁).
- **레퍼런스(처음 개발 때 사용자 제공):** 클래식 Mac System/Finder(1-bit 흑백, 두꺼운 검정선), Xerox Star 아이콘(Employee Expense Form·folder·in-basket 픽셀 라인 아이콘), 8bit 메뉴(SET FLAG/UP·DOWN), 도트풍 게임 UI. → 모노크롬·하드엣지·픽셀 아이콘·각진 박스가 핵심.

### 5. 컴포넌트 패턴 (복붙용)
```css
/* 둥글림 제거 + ink 2px (use-box 내부 input은 borderless 유지) */
[data-theme="retro"] input,[data-theme="retro"] select,[data-theme="retro"] .btn,
[data-theme="retro"] .colors,[data-theme="retro"] .common{border:2px solid #0B0A05;border-radius:0}
/* iOS 정규화 + 보더 높이 통일 (포괄 §2 참고) */
[data-theme="retro"] input,[data-theme="retro"] select{
  -webkit-appearance:none;appearance:none;height:34px;padding:0 9px;line-height:1.2;
  font-family:'Pretendard Variable','Pretendard';font-weight:500;color:#0B0A05;
}
[data-theme="retro"] select{padding-right:26px;background-repeat:no-repeat;background-position:right 9px center;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 1h12L6 8z' fill='%230B0A05'/%3E%3C/svg%3E");}
/* 카드 / 타이틀 박스(DEST·SOURCE 태그 느낌) */
.q-card{background:#fff;border:2.5px solid #0B0A05;border-radius:0;box-shadow:4px 4px 0 #0B0A05;padding:10px 11px 11px}
[data-theme="retro"] h1,.sec-h{display:inline-block;background:#fff;border:2.5px solid #0B0A05;box-shadow:4px 4px 0 #0B0A05;border-radius:0;padding:8px 15px;font-family:'Galmuri11';font-weight:900}
/* 레트로 체크박스 = 약간 둥글린 네모 (rounded square, border-radius:3px + ink 센터 닷) — 사용자 지정.
   동그라미(원형) 아님. §1 각진 규칙과 일관 — 살짝만 라운드된 정사각.
   ⚠️ 일반 인풋용 padding:0 12px 가 체크박스에도 상속되면 가로로 늘어나 타원이 됨 → 반드시 padding:0 */
[data-theme="retro"] input[type=checkbox]{-webkit-appearance:none;appearance:none;width:16px;height:16px;padding:0;
  border:2px solid #0B0A05;border-radius:3px;background:#fff;box-shadow:none;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;line-height:1}
[data-theme="retro"] input[type=checkbox]:checked::after{content:"";width:8px;height:8px;border-radius:2px;background:#0B0A05}
[data-theme="retro"] input[type=checkbox]:active{transform:translateY(.5px)}
/* 컨텍스트별 작은 크기(.crow2/.common 14px 등)를 이기고 정사각 통일 */
[data-theme="retro"] .crow2 .chk input,[data-theme="retro"] .common input{width:16px;height:16px;padding:0}
/* NEW 뱃지 */
[data-theme="retro"] .new-badge{background:#A5E6BA;color:#0B0A05;border:1.5px solid #0B0A05;border-radius:0;font-family:'Galmuri11';font-weight:800}
```
- 참고 원본: index.html `qbStylesHTML()` (line ~16922~17271). `.q-card`, `.qb-col-hd`(Press Start 2P 9px), `.slot(.on/.made/.excluded)`, `.qb-modal`, `.qb-slot-toggle .check`(체크박스의 원형) 등.

### 5-1. 📋 동선탭 NEW QUEST 모달 폰트 (참고값, index.html 17151~)
- **보더 안 입력값**(input/select/textarea): `font-family:'Pretendard',sans-serif; font-size:13px; font-weight:500; color:var(--ink)`(=`#0B0A05`).
- **라벨**(`.fg label`): `font-family:'Galmuri11',monospace; font-size:12px; font-weight:700; color:#0B0A05; letter-spacing:.3px`.
- **힌트**(`.fg .hint`): `Pretendard 11px; color:#6b6555`.
- (NEW PICKUP 모달은 추후 개편 예정 — 사용자가 "바꿀 게 많다"고 함, 구체안 받기 전 대기.)

### 6. 레트로 탭 만들 때 체크리스트
1. 둥근 모서리 0인가?(체크박스/라디오 제외) 2. 모든 선 ink 2px인가? 3. 하드 그림자 오프셋 들어갔나? 4. 타이틀=Galmuri11 / 라벨=Pretendard 800 / 값·데이터=Pretendard 500~700 / 영문전광판=Press Start 2P 인가? 5. 메인=민트, 서브=옐로우, 입력=화이트(블루·베이지 제거)인가? 6. placeholder·보조글자 선명한가? 7. 플랫 이모지를 도트 SVG로 바꿨나? 8. 체크박스 = 약간 둥글린 네모(border-radius:3px + ink 센터 닷, padding:0)인가? 9. 헤더 컨트롤 높이·폰트 동일(삭제 absolute 금지, 우상단 고정)한가? 10. 박스 패딩 넉넉(12~15px)한가? 11. 숫자칸 스피너(↕) 전 테마·전 탭에서 제거됐나? 12. 단가+원은 nowrap 묶음(모바일 '원' 안 떨어짐)인가? 13. 기능 코드(JS/HTML) 안 건드렸나? **14. 🔴 칸 안 글씨 한 글자만 줄바꿈되는 곳 없나(nowrap)? 15. 🔴 나란한 스탯/칸 글자 세로정렬 일치하나? 16. 🔴 표 날짜처럼 널널한 칸 좁혀 다른 칸에 양보했나? (§3 정렬 자가검수 — 매번 확인·보고)**

---

## 변경 이력
- 2026-06-15(28): **거래처 원장에 브랜드 필터 + 줄별 아이템 표시 추가.** 사용자 "브랜드별로 나눠주고, 어떤 아이템인지도 나와야". ①**줄별 브랜드·아이템**: `_tlLine`이 자재 itemId→`S.items[id].brandId`→`_tlBrandName()`로 브랜드명 도출(없으면 자재 brandId 폴백), 품명 셀 아래 `<div.tl-sub>[브랜드뱃지]+itemName</div>` 서브라인. ②**상단 브랜드 필터 칩**(`.tl-brandrow`, `window._tlBrand`): 그 거래처에 실제 있는 브랜드만(2개 이상일 때만 노출) `전체/브랜드…`, 클릭→재렌더. ③**필터 동작**: 전체=모든 행+실제 미수, 특정 브랜드=그 브랜드 행만(공통 수동·입금 제외)+푸터를 `브랜드 공급가/부가세/브랜드 합계`로+안내노트(`.tl-brandnote` "입금·미수는 전체에서 확인") — 브랜드별 **매입 몫 분리**용. ④**수동폼 브랜드 select**(`#tl-m-brand`, 공통 기본, 현재 필터 브랜드 자동선택)→`tlAddManual`이 `brand` 저장. ⑤거래처 셀렉터+브랜드칩을 `.tl-topcard`로 묶음(레트로 ink카드 topcard로 이동), 모바일=서브라인 `flex-basis:100%`. ⑥레트로: 칩 각진ink·활성 neon-blue, 뱃지/노트 노랑 각진. 검증: 실앱 DOM(칩 전체/더프루토/아루드·뱃지4·서브라인 아이템명·아루드필터 5→3행·합계157,960·안내노트·수동 brand select)+JSC SYNTAX OK. ⚠️미리보기가 동시작업 세션 mockup으로 리다이렉트돼 스크린샷 대신 DOM eval 검증.
- 2026-06-15(27): **★ 부자재집 거래처 원장 신규 — 결제 탭 세 번째 서브탭(자동집계+수동추가).** 결제 관리에 `거래처 원장`(`t-pay-ledger`) 추가 → `switchPayTab('ledger')`→`renderPayContent`→**`renderTrimLedger()`**. **자동집계**: 전체 오더(`S.orders`) 순회 → **기존 발주엔진 `calcSups(o.orderItems)` 재사용** → `type==='trim'` 자재만 거래처별로 모음(원단 제외). 날짜=**발주일**(`createdToISO(o.createdAt)`, 사용자 확정). 한 줄=`_tlLine(m)`(품명=displayName, 규격=size, 수량=calc.rolls/qty+단위, 단가=unitPrice, 금액=calc.cost) → 로스·롤분배·컬러 MAX단가 전부 calcSups가 처리(=발주서/PO와 동일 숫자). **수동추가**: `S.trimLedger[거래처]=[{date,name,spec,qty,unit,price,inout('out'매입/'in'입금)}]` — 택배·샘플·염색 등. `tlAddManual`/`tlDelManual`(돈 데이터라 confirm 후 삭제). **누적잔액**=날짜순 매입(+)−입금(−), 공급가액 기준. 푸터=공급가액·부가세(`TL_VAT=10%`)·합계·입금·미수. `tlPrint`=새창 명세서 인쇄. **영속(돈 유실 방지) 12곳**에 `trimLedger` 추가: saveData·loadCoData·migrate가드·applyRemoteCoData(실시간)·cloud coData저장/병합/캐시·abk/hbk백업·복구(파일/auto/hourly)·exportData(현재/타사). **두 테마**: 기본=토큰 그대로, **레트로=`html[data-theme="retro"] .tl-*` 오버라이드**(2.5px ink 보더+3px 하드섀도우+neon-blue 헤더+neon-green CTA+Galmuri). **모바일(≤560px)=표→카드 전환**(thead 숨김, tr=카드, td `::before`=라벨, 수동행 삭제 ✕ 유지=아이폰 대응). ⚠️**교훈: 재렌더되는 컨테이너(innerHTML 교체) 안에 `<style>` 넣지 말 것** — 초기엔 됐다가 재렌더 때 같이 지워짐. `_tlEnsureStyle()`로 `<head>`에 `#tl-css` 1회 주입. 검증: 라이브 프리뷰(기본/레트로/390px)·calcSups 시뮬(지퍼179개·단추1051개·심지2롤 로스반영)·재렌더 스타일 유지·수동입금 누적·JSC SYNTAX OK. 미리보기 시안=`mockup-trim-ledger.html`.
- 2026-06-03(20): **★ 작업지시서(Tech Pack) 기능 신규 — 공정별 탭 + 자동연동 + 이미지 업로드 + A4 인쇄 (라이브 이식·푸시).** 아이템 리스트 행 액션에 **`📋 작지`** 버튼(`tpOpen(itemId)`) → 풀스크린 모달 `#tp-modal`. **⚠️ 디자인 예외: 이 화면만 레트로 아님(사용자 명시 "깔끔하게").** 전용 팔레트(흰 카드·#3a3a3a 격자선·둥근모서리 X·엑셀 느낌·강조는 합계수량 21px/골방향경고 빨강/자동=초록알약·직접입력=회색알약)는 모두 `#tp-modal` 스코프라 앱 retro/minimal 영향 0. **구조**: 제목+메타표 → 탭 `✂️재단 🪡봉제 📦포장`(항상)+`🧵자수`(embroideryFcId)·`🎨나염`(printingFcId 있을 때만). **공통 상단 바**(`tpCbarHTML`): 컬러 스와치(`tpColorHex`)+컬러×사이즈×수량(전 오더 qtyGrid 합산 `tpQtyBreakdown`) — 모든 시트에 표시. **도식화**=봉제 크게(`big`)·나머지 탭 작은 썸네일(`cutSketch` 공유). **자동(초록)**: 원단(혼용/폭/요척)·부자재 부착·택SET·수량·공장명, 코듀로이/골덴/벨벳이면 골방향 경고 자동. **직접입력(회색)**: 봉제범례·Size Spec(편차)·메모·워싱. **자수/나염 사양 = ①사이즈별 위치·크기 ②컬러별 자수실/나염컬러(도수) ③공통** 분리. **이미지**: `tpPickImage`→canvas 압축(1600px JPEG0.82)→Firebase Storage(`firebase-storage-compat.js`+`window.fbStorage`, `techpack/{coId}/{itemId}/{slot}_{ts}.jpg`)→**URL만 `it.techpack.images[slot]` 저장**, 실패 시 1100px dataURL 폴백+경고. **A4 인쇄**: `세로/가로` 토글(`tpOrient` 동적 `@page`+가로 2단), `🖨`=`body.tp-printing`로 앱 숨기고 공정별 `page-break` A4 1장씩. **영속**: `it.techpack`(saveData), `saveItemForm`에 `item.techpack=oldItem.techpack` 보존. 검증: 라이브 프리뷰 스크린샷(재단/봉제/자수·세로/가로·자동수량230·골경고·범례·실물칸·자수 사이즈/컬러분리) + JSC SYNTAX OK.
- 2026-05-31(18): **★ 대규모 탭/구조 개편 + 폼 버그수정 + 모바일 정리 (한 번에 반영).** **[탭 구조]** ① **알림 탭 삭제**. ② **「진행」 묶음 탭 신설** — 서브탭으로 `생산 대시보드·오더 관리·샘플 대시보드·샘플 발주·결제 관리·단가장·잔량`(단가장/잔량을 오더관리에서 빼 결제 뒤로 이동). `switchTab` progressGroup·`#progress-subtabs`. ③ **샘플 진행보드→샘플 대시보드** 개명. ④ **모든 서브탭 이모티콘 제거**. ⑤ 서브탭 앞 "📂 오더 관리" 라벨 삭제. **[오더]** 오더목록에서 **완료(출고완료·결제완료) 숨김** + **「완료」 서브탭**(`window._orderView`, `showOrderList`, `isOrderDone`). **[결제]** 서브탭을 **「브랜드별 보기」+「결제 완료」만** 남기고 전체/공장처/거래처/차트/일괄결제·공장선택pills·결제완료체크박스·영수증AI 삭제. 완료건 기본 숨김, **「결제 완료」=월별 그룹**(`renderItemPay(opts{onlyDone,groupByMonth})`, `.pay-month-hdr`). **[샘플 발주]** 목록 폭 360px(오더와 동일, `@media min-width:769px`), **진행/완료 토글**(`setSampleView`, confirmed 숨김/모음). **[할 일 빠른추가 재배치]** 1줄=버튼(브랜드·어디서 시장/사무실/연락만·오늘/내일, `qaSetBtn`+hidden input) / 2줄=아이템(검색 datalist)+내용+추가 / 3줄=업체+픽업위치+샘플생산. **[생산 대시보드]** 2줄 분할 유지 + **헤더(thead) 제거**(각 셀 자체 라벨 `.pd-stage-lbl`로 중복 → 두꺼운 윗줄 문제 동시 해결), 통계 박스=클릭 필터(`pdSetView`). **[샘플 대시보드]** 통계 박스도 클릭 필터화(`sbSetView`). **[부자재/원단 폼]** `colTR`/`colFR`를 **행 id 기준 인덱싱**으로 고쳐 *부자재명 입력 시 행 사라지던 치명 버그* 해결(+`autofillTrim` 첫머리 `colTR()`). 부자재명·원단명 **자기 줄에 넓게**, 용도 상단바로. **[아이템 리스트]** 액션칸 고정폭(300px)으로 정보칸 줄바꿈/‑KC토글 시 reflow 해결. **[모바일]** ① 통계 박스 **한 줄**(숫자↑·라벨↓ 압축) ② **「≡ 메뉴 접기/펼치기」** 토글(메인탭+진행서브탭+오더서브탭 3바 동시 접힘, `body.nav-collapsed`) ③ 오더/샘플 목록 **전체폭**(`.split{width:100%}`, 360px 룰 desktop 한정) ④ 가로스크롤 sticky 떨림 제거(렉 완화). **검증**: 라이브 프리뷰 retro·minimal·데스크탑(1280)·모바일(390) — 탭 라우팅·완료탭·월별그룹·트림 사라짐버그·할일 버튼·모바일 한줄/접기/폭 모두 확인. JSC SYNTAX OK.
- 2026-06-02(19): **생산 대시보드 원/부자재 거래처별 미니줄 줄맞춤 교정 (두 테마 공통).** 거래처마다 `[이름][☐완료]`(상단 1줄) + `컨 [날짜]`/`입 [날짜]`(아래 2줄). 라벨(컨/입) **고정폭 15px**로 날짜 input **세로 정렬**, `완료`를 우측 부유(`margin-left:auto`)에서 **이름 옆 상단**으로 이동(사용자: "완료 왼쪽으로 가서 날짜 나란하게"). §3 정렬 자가검수(나란한 칸 세로정렬) 교정 사례.
- 2026-05-31(17): **아이템 리스트에 ① 준비 시작일(날짜) + ② KC 인증완료 칩 추가 (두 테마 공통 기능, 폰트만 테마별).** 위치 = 아이템 행 **오른쪽 액션 영역**(`원단·부자재` 통계줄 아래 `.im-meta` 한 줄: `[날짜입력][KC칩]`, 그 아래 수정/원가/… 버튼). 데스크탑=우측 정렬, 모바일(≤720px)=좌측 정렬(`.im-meta{justify-content:flex-start}`). ① **준비 시작일** `itemStartDateHTML`/`setItemStartDate` — `it.startDate`(직접 선택) 우선, 없으면 `it.createdAt`(생성일) 자동 폴백(`itemStartISO`). 신규 아이템 저장 시 `createdAt` 자동 기록. **이모티콘·"자동" 표시 없음**(사용자 요청으로 제거). 날짜칸 폰트=Pretendard(데이터 값), retro=각진 ink 1.5px+하드그림자 / minimal=둥근 1px. ② **KC 인증완료** `itemKcHTML`/`toggleItemKc` — `it.kcCert` 토글(+`it.kcCertAt` 날짜 기록). `KC 미인증`(회색)↔`KC 인증완료`(retro 네온그린#A5E6BA / minimal #dcfce7). 칩 글자 폰트=retro Galmuri11 / minimal Pretendard(테마 규칙대로). ③ **잠재 버그 보강**: `saveItemForm`이 폼 저장 때 `item` 객체를 새로 만들어 덮어쓰며 리스트 전용 메타(statusManual/hold/qc/costSent/costSentAt)를 날리던 문제 → 신규 startDate·kcCert·kcCertAt·createdAt 포함해 **수정 저장해도 보존**되도록 oldItem에서 복사. **검증**: 라이브 프리뷰 retro·minimal + 데스크탑(1280)·모바일(390) 양쪽 레이아웃, KC 토글·날짜 수동지정·자동복귀 동작 확인(§3 정렬자가검수: 1글자 줄바꿈 없음). JSC SYNTAX OK.
- 2026-05-30(16): **★ 아이템 상태 배지 샘플칸 흰색 + 아이템/오더/결제 탭 레트로 스킨 (배지=두 테마 공통, 나머지=retro 전용).** ① **아이템 상태 배지 첫칸(`.ib-phase`=샘플/메인 구분칸)을 검정→흰색**: `background:#0B0A05→#fff;color:#fff→#0B0A05;border-right:2px solid #0B0A05`(minimal도 `#374151`글씨+1px 보더로 동일 처리) — 사용자 "샘플 버튼 안을 흰색으로". 두 테마 공통. ② **아이템 탭 필터 헤더 / 아이템 수정 폼 / 오더 관리(목록+상세) / 결제 관리에 retro 스킨 일괄 적용**(모두 `html[data-theme="retro"]` 스코프 → minimal 영향 0, 측정 확인: minimal 인풋 1px·radius 8px 유지): `#pane-items`/`#pane-orders`/`#pane-pay`의 input·select·textarea(2px ink 각진 흰배경+focus 하드그림자), `.btn`(각진 ink+Galmuri+1.5px 오프셋; `.p`/`.ok`=네온그린·`.em`=네온블루·`.d`=레드), `.card`(2.5px ink+4px 그림자), `.fg label`/제목 Galmuri, `.brand-pill`(인라인 오버라이드 `!important`로 각지게), `#pane-orders .sl`(목록 사이드바 크림+ink 구분선)/`.o-card`(각진 ink, active=네온블루), `#pane-pay .stat`(각진 ink+Press Start 2P 숫자)/`.dtabs`·`.dtab.on`(네온그린). ③ **오더 상세 패널(`#o-sr`) 안쪽까지 레트로**(사용자 "상세 패널까지 전부"): 발주서~메모 탭 strip(크림 ink, active=네온블루), 수량 통계 strip(`.cost-strip` 80장=Press Start 2P), 수량 그리드(`.qty-grid` 각진 ink, 합계칸 네온그린), 발주서/거래처 카드(`.sc`/`.sc-h` 각진 ink+크림 헤더), 상태 배지(`.badge` 각짐). **🚫 결제 명세서(buildPayReceiptHTML, html2canvas 이미지 export) 불변** — 업체 전달용. 명세서는 인라인스타일 `#fff/#000` 테이블 + 모달/별도 컨테이너라 `#pane-pay` 스코프 밖이고 input 없음 → 스킨 영향 없음 확인. ④ **함정 회피**: 초기 시안의 `#pane-pay input:not(.stmt input)`는 `:not()`에 자손결합자 불가(전체 룰 무효화) → 평범한 `#pane-pay input`으로 교정(measure로 2px 적용 확인). **검증**: 라이브 프리뷰 retro에서 오더 상세(준비 배지 각짐·80장 픽셀폰트·발주서 탭 네온블루·각진 버튼) + 입력칸 2px, minimal 무영향 확인. JSC SYNTAX OK.
- 2026-05-30(15): **생산 대시보드 상태 박스 = 필터 탭화 + 출고완료 비숨김 + 상단 띠 흰색 (두 테마 공통).** ① **상단 띠(`.pd-topbar`) 레트로 배경 `#EFE8D4`(크림)→`#fff`(흰색)** — 사용자 "첫칸 보더 안 색상 흰색으로". ② **상태 박스 3개를 클릭형 필터 탭으로**: 진행 아이템/긴급(D-3 이내)/출고 완료. `window._pdViewMode`('active'|'urgent'|'shipped'), `pdSetView(mode)`로 전환(같은 박스 재클릭→active 복귀). 활성칸 `.pd-stat.on`(minimal=ink#1f2937 채움/흰글씨, retro=`var(--ink)` 채움+눌린 그림자). ③ **출고완료 항목이 자동으로 사라지던 것 제거** — `renderProdDash` 행 수집 루프의 `if(isFullyShipped)continue;` 삭제, 행에 `shipDone` 태그만 달고 보기 모드로 분리. '출고 완료' 박스 누르면 노출(행 디데이 자리에 `✅ 출고완료` 초록 배지). 통계(진행=활성 수, 긴급=활성 중 D-3↓, 출고완료=shipDone 수)는 보기 모드와 무관하게 항상 전체 기준. 빈 보기는 모드별 안내문. **검증**: 라이브 프리뷰 retro·minimal 둘 다 — 진행 3/긴급 2/출고완료 1 카운트·필터·활성 스타일·흰 띠 확인. JSC SYNTAX OK.
- 2026-05-30(14): **아이템 상태 배지 위치 이동 + 2칸 고정 (두 테마 공통).** ① 배지를 아이템 **이름 아래(가운데) → 시즌·품번 아래(왼쪽 head 칼럼)**로 이동. `.im-row` 첫 칼럼 92px→**160px**(모바일 78→142px), `.im-head{align-items:flex-start}` + `.im-head .im-badge-row{margin:9px 0 0}`. ② **배지는 항상 최대 2칸**(`[구분][상태]`): 보류/QC는 별도 칩을 덧붙이지 않고 **단계칸을 대체**(우선순위 보류>QC>단계). `itemBadgeHTML`에서 statusCls/statusTxt 분기 + `.ib-stage.f-hold/.f-qc` 색 추가. (사용자: 입고중·보류·QC가 한꺼번에 오는 일은 없음 → 2칸 초과 금지.) 시안 B 라이브 프리뷰로 retro·minimal 양쪽 확인. JSC SYNTAX OK.
- 2026-05-30(13): **★ 웹 레이아웃 3건 + 아이템 상태 배지/인라인 편집 라이브 이식 (두 테마 공통, 시안 둘 다 반영).** **A. 웹 레이아웃**(테마 무관 구조 → 기본·레트로 둘 다, `[data-theme]`로 안 가둠): ① 아이템 탭 콘텐츠 `#pane-items #ipl{max-width:920px;margin:0 auto}` — 와이드 화면에서 버튼 좌우로 너무 벌어지던 문제 해소 ② 샘플 진행보드 압축 `#board-body .pd-table{width:830px;table-layout:fixed;min-width:0;max-width:none}` + step칼럼 66px·첫칸 236px·`.pd-table-wrap{display:inline-block;max-width:100%}` → 죽은 여백/끊김 제거(생산 대시보드의 min-width:1900은 그대로, board만 스코프) ③ 오더 관리 목록 `#pane-orders .sl{width:360px}`(270→360, 샘플발주 .sl는 270 유지하도록 오더 전용 스코프). **B. 아이템 상태 배지**: 리스트 각 행에 `[구분][단계]` 2단 배지 — 구분=샘플/메인/리오더(+N차, 검정칩), 단계=미발주/발주준비/생산중/입고중/출고됨(메인계열)·진행/컨펌(샘플계열) 색칩, 보류·QC 플래그칩. `deriveItemBadge(it)`가 오더(`getItemReorderNum`+`computeItemStatus`)·샘플(`getSampleOrders`) 데이터에서 자동 산출, 배지 클릭→인라인 편집기(`⟳자동` 토글·구분/차수/단계 select·보류/QC 토글). 수동값은 `it.statusManual`(auto:false 시 우선), 플래그는 `it.hold/it.qc`. 배지/편집기 CSS는 base=레트로룩(각진·하드그림자·Press Start 2P 차수칩)+`html[data-theme="minimal"]` 담백 오버라이드 둘 다. **검증**: 라이브 프리뷰로 retro·minimal 양쪽 + A1(920)·A2(830/66px)·A3(360 vs 샘플 270) 모두 확인. JSC SYNTAX OK.
- 2026-05-30(12): **DESIGN_GUIDE.md 변경 시 항상 자동 commit+push 규칙 추가**(사용자 명시 — 따로 "푸시해줘" 안 해도 됨). 그리고 **시안→앱 이식 누락 방지 규칙**: 구조/필드뿐 아니라 레트로 비주얼 스킨까지 둘 다 반영해야 완료(아래 (11) 누락 사례 재발 방지).
- 2026-05-30(11): **★ 4종 시안 라이브 이식 + 할 일 탭 레트로 스킨 보강.** ① 시즌 입력=드롭다운(연도·SS/FW·세부+직접입력, 숨김 `#f-ss`로 기존 로직 유지) ② 할 일 새 업무 입력 3줄 폼(브랜드·아이템·어디서 / 업체·픽업위치·언제 / 샘플·생산·내용·추가), 다 안 채워도 추가 가능, 카테고리별·필터줄 삭제 ③ 탭바·서브탭 retro 스킨 ④ 생산 대시보드 retro 스킨. **⚠️ 누락→보강:** 1차 푸시(dc710ea) 때 할 일 탭은 폼 구조만 옮기고 레트로 비주얼(테두리·그림자·각진·Galmuri·네온 체크·square code뱃지·액션버튼)을 빠뜨림 → `html[data-theme="retro"]` 스코프로 `.tk-qadd/.tk-tools/.tk-sec/.tk-sec-hd/.tk-sec-sub/.tk-row/.tk-chk/.tk-line .code/.tk-acts` 전부 보강. 전부 retro 스코프라 minimal 영향 0.
- 2026-05-30(10): **🔴 정렬 & 줄바꿈 자가검수 규칙을 §3 최상단 + 체크리스트(14·15·16)에 추가**(사용자 여러 번 반복 지적). 매 디자인마다 ① 칸 안 한 글자 줄바꿈 금지(nowrap+폰트/폭 조정) ② 나란한 스탯 박스 글자 세로정렬 일치(숫자영역 min-height+flex center) ③ 짧은 칸(날짜) 좁혀 줄바꿈 위험 칸에 폭 양보 ④ 390px 실폭 확인 — 을 체크하고 "정렬 확인함" 보고 의무화. 생산 대시보드 mockup(dash-retro)에 즉시 적용: 스탯 미결제칸 세로정렬 보정, 공장/오더/출고/결제 칩·버튼 nowrap, 날짜 input 120→104px 축소.
- 2026-05-30: 최초 작성. 레트로=동선탭 팔레트/폰트 확정, Galmuri11 URL 404→`galmuri@2.40.3` 교체, 적용컬러 박스 노랑→연두(#E8F6EE), 레트로 체크박스 신설, 폰트 역할 분리(타이틀 Galmuri11 / 라벨 Pretendard 800).
- 2026-05-30(2): 남은 노랑(안내 박스) 전부 연두로, mockup no-cache 메타+phone.html 캐시버스터 추가. iOS Safari 인풋/셀렉트 둥글림·납작 문제 해결(`appearance:none`+커스텀 화살표+높이 34px 통일), 보더 안 값 글씨 500(밖 라벨 800보다 얇게). 처음 개발 레퍼런스(클래식 Mac/Xerox Star/8bit) 기록.
- 2026-05-30(3): **문서 구조를 사용자 요청대로 3분할(① 포괄 / ② 기본 / ③ 레트로)로 재편.** 헤더 삭제 버튼 `position:absolute` → `margin-left:auto`로 변경(높이·세로중앙 통일, iOS 납작/치우침 해결), 헤더 컨트롤 높이 변수 `--hc:34px`로 통일. 레트로 체크박스를 QUEST BOARD 슬롯 토글과 동일하게 재설계(ink 채움 + 네온그린 ✓ Press Start 2P). 플랫 이모지(🧶📌🔗🔄💡🗑#)를 8×8 도트 픽셀 SVG 아이콘으로 교체(`px-*` 심볼 스프라이트 + 테마 토글). NEW QUEST 모달 폰트 스펙 기록.
- 2026-05-30(5): **체크박스를 클래식 Mac 라운드 라디오(원형 ring + ink 센터 닷, `○`/`◉`)로 변경**(사용자 지정 — 이전 ink채움+네온그린✓ 폐기). 둥근모서리 금지 규칙의 명시적 예외로 등록. 일반 인풋 `padding:0 12px`가 상속돼 타원이 되던 버그 → 체크박스 `padding:0` + 컨텍스트 크기 16px 통일로 정원 확보.
- 2026-05-30(6): 사용자 6종 피드백 반영. ① **체크박스를 원형 라디오 → "약간 둥글린 네모"(border-radius:3px + ink 센터 닷)로 변경**(원형 폐기, 각진 규칙과 일관). ② 도트 아이콘 개선: `px-fabric` 직조체커→실패/보빈, `px-trash` 휴지통에 ridge 추가, **`px-button`(4구 단추) 신설**. 섹션 헤더 이모지(🧶 원단·🔘 부자재)도 hemoji/px 패턴으로 래핑. ③ **`＋가공비` 버튼을 헤더에서 빼 카드 맨 하단 우측 모서리(`.card-foot`)로 이동** → 모바일에서 삭제가 아래로 밀리던 문제 해결, 삭제는 헤더 우상단 단독 고정. ④ **모바일 '원' 떨어짐 해결**: 단가+원을 `.prw`(inline-flex·nowrap)로 묶음. ⑤ **숫자 스피너(↕) 전역 제거** CSS를 base에 추가(전 테마·전 탭). → index.html 적용 시 모든 탭 number 인풋에 동일 적용 필요.
- 2026-05-30(7): 사용자 칸크기/정렬 피드백 반영(선 그림 기반). ① **부자재처에도 동/호수 추가**(`[부자재처][동][호수]` 3칸, 부자재명은 다음 줄 단독 넓게) — 원단처와 동일 구조. ② **원단 `요척(yard)` 칸을 윗행 `폭+야드단가` 폭에 맞춰 넓힘**(flex .7→1.3), `로스%`는 윗행 `단위` 폭에 정렬(flex .45→.5). ③ **적용컬러 `단가` 입력칸 데스크탑 폭 확대**(62→96px, 원단·부자재 공통). 모바일(≤540px)에선 단가 60px·체크칸 min 62px·gap 5px로 축소하는 미디어쿼리 추가(390px 가로 넘침 방지).
- 2026-05-30(8): **"테마 무관 변경 = 두 테마 모두 적용 + 검증" 강력규칙을 문서 최상단·§0에 추가**(사용자 강력 명시). 매 요청마다 변경을 "공통 vs 레트로 전용 룩"으로 먼저 분류 → 공통은 base CSS/공용 HTML에 넣고 `[data-theme]`로 가두지 않으며 두 테마 모두에서 검증·보고. 검증 결과: (6)·(7)의 모든 변경(동/호수, 요척 정렬, 단가 폭, 스피너 제거, 원 묶음, 가공비 footer)은 이미 공용 영역에 들어가 `minimal`·`retro` 둘 다 적용됨을 측정 확인. **결정:** 레트로 체크박스(약간 둥글린 네모)는 **retro 전용 유지**, 기본 테마는 OS 기본 체크박스(`accent-color`) 사용 — 사용자 확정(레트로만 유지). 체크박스 룩은 "레트로 전용 룩"으로 분류 → 두 테마 통일 대상 아님.
- 2026-05-30(9): **★ 목업 → 라이브 `index.html` 실제 이식 + 기본(minimal) 테마 정의 (커밋·푸시 진행).** ① **부자재 일반행에 동/호수 추가** — `trimRowHTML`에 `[부자재처][동][호수][부자재명][크기][색상]` 칸 신설, `colTR()`가 `building`/`floorRoom` 저장하도록 배선(원단행과 동일). ② **동선탭 Galmuri11 URL 수정** — `qbStylesHTML()`의 깨진 noonfonts(404) → `galmuri@2.40.3`. ③ **기본(minimal) 테마 정의** — 라이브 앱은 `THEMES.minimal`이 빈 스텁이고 `<html data-theme="retro">`가 하드코딩돼 retro만 동작했음. 사용자 확인: **"기본 테마 = 알림·할일·생산대시보드·오더관리·결제관리·샘플진행보드·샘플발주·불량관리·분석·업체관리 탭에 이미 적용된 담백한 Pretendard 룩"**(신규 디자인 아님). 그래서 `THEMES.minimal.tokens`를 현재 `:root` 기본값(`--ink #1a1a1a`, paper #fff, `1px solid #e0ddd8` 보더, `0 1px 3px` 그림자, radius 8px, Pretendard 폰트, 픽셀폰트 없음)으로 채우고 labels도 담백한 한글로 정의. 부팅 기본은 retro 유지 → 기존 화면 변화 0. **⚠️ 라이브 현실 = 문서 §0과 다름:** 실제 localStorage 키는 `fpfTheme`가 아니라 **`fpm_theme`**, 토큰 이름도 `--page-bg` 류가 아니라 **`--ink/--neon-green/--neon-blue/--teal/--paper/--surface/--card-border/--card-shadow/--radius-skin/--font-display/--font-pixel/--font-body`**(JS `THEMES` 객체가 `:root`에 주입). 전환 함수 `setTheme('minimal'|'retro')`. 아직 테마 전환 UI(버튼)는 없음 — 정의/저장만 완료, 스위처는 추후 별건. ④ 검증: `<script>` 추출 후 JSC `node --check` 동급 SYNTAX OK.
- 2026-05-30(4): **레트로 폼을 사용자 최애 화면(NEW QUEST 모달) 톤앤매너로 동기화.** (1) 컬러: 메인 민트 그린(`.sec-h`/`.common`/`.colors`=`#E8F6EE`, 추가 CTA=`#A5E6BA`) + 서브 파스텔 옐로우(자동호출 안내 `#EAF3F8`블루→`#FFF6B8`옐로우 점선) + 화이트 입력, 칙칙한 블루·베이지 제거. (2) 폰트 이원화: 데이터 값(컬러명 아이보리/차콜/베이지)을 Galmuri11→**Pretendard 700**으로 바꿔 명세 가독성 확보(타이틀/헤더/버튼만 Galmuri11 유지). (3) 여백: 2px ink 보더 유지하되 박스 패딩 12~15px·인풋 좌우 12px로 넉넉히. (4) 기능 로직 무수정.

---

## ★ 작업지시서(Tech Pack) 규격 — 무조건 준수 (2026-06)

> 작업지시서 화면/인쇄 수정 시 이 규격을 항상 먼저 참고할 것. 사용자: "규격이 제일 중요".

1. **A4 인쇄 + 사방 5mm 여백 고정**: `@page{ size:A4 landscape; margin:0.5cm; }` (= 사방 5mm). 가로/세로 비율 유지(콘텐츠를 페이지 폭에 맞춰 렌더).
2. **도식화(flat sketch)가 작업지시서의 40% 이상 차지**: 재단·봉제 탭에서 도식화 칸을 최우선으로 크게(좌측 큰 칼럼, 페이지 높이 대부분). 데이터 표는 그 옆/아래.
3. **엑셀핏(1px)**: 모든 테두리 1px 짙은회색(#9ca3af). 굵은 테두리·하드섀도우·라운드 전면 금지. 표는 border-collapse, 셀 여백 타이트(3px 6px).
4. **헤더만 옅은 회색(#f3f4f6), 본문 흰색**.
5. **폰트 = IBM Plex Sans KR** (구글폰트)로 통일.
6. **공정탭마다 A4 1장**(page-break). 봉제는 1장에 압축(범례 등 군더더기 빼서).
7. 상단 공통: 작업경로(거쳐가는 업체 전부), 컬러웨이×부위 원단매칭 표(세트번호 대신 컬러명), 컬러웨이 카테고리별 실물 스와치 부착칸, 모든 탭 메모칸.
8. 자수 = 시안/도안/위치 3슬롯 + 자수 방법(직자수·러닝자수 등). 라벨·부자재·자수 사진은 이름 키로 저장→자동 불러오기.
9. **A4 박스 고정 + 내용 늘어도 절대 안 넘침(자동 축소)**: `.tp-wrap`을 세로 `200mm×287mm`(가로 `287mm×200mm`)로 **height 고정 + overflow:hidden**. 내부는 `.tp-fit` 래퍼로 감싸고, 렌더/탭전환/방향전환 때 `tpFit()`이 자연 높이를 재서 A4 높이를 넘으면 `transform:scale(k)`로 비율 유지하며 자동 축소(폭은 `100/k%`로 보정해 좌우 꽉 채움). → 어떤 내용이 들어와도 한 장에 들어감.
10. **🔴 칸 정렬·줄바꿈(작업지시서 전용 재확인)**: ① 스와치·실물사진 칸은 **무조건 폭 균등**(`table.tpeq{table-layout:fixed}`) — 제각각 금지. ② 원자재표(`table.mat`)는 **nowrap + 10px**로 한 칸 2줄 금지(행 높이 안 늘어나게). ③ 헤더(브랜드/품명/품번/봉제/작업경로)는 한 줄 유지.
11. **데이터 자동 로드**: ① **혼용률 함축** `tpComp` — `60% tencel 40% linen` → `T60 L40`(섬유 첫글자 약어 + 숫자 뒤, % 제거). ② **원자재 컬러 = 이 아이템 실제 컬러웨이(it.colors)만** — colorLinks 옛 컬러웨이 잔여분 필터(예: 7→4). ③ **부자재 컬러/실 개수** = colorLinks colorName(아이템 컬러웨이 우선) + thread는 규격 `N수`·요척 `threadQty`. ④ **컬러·사이즈·수량 = 메인 오더 qtyGrid 연동**, 사이즈 키 **대소문자 무시**(오더 `free` ↔ 표시 `FREE`). ⑤ **봉제 탭에도 컬러·사이즈·수량 표**.
12. **라벨/네이밍**: ① 라벨표 **이름 중복 제거**(mainLabel은 `메인라벨`로 표기 — `중간라벨`(midSize) placeholder 중복 정리). ② 컬럼 헤더 `위치 / 개수` → **`위치`**. ③ 공정 탭 `포장` → **`완성`**. ④ 완성부자재 실물사진 = **선택된 항목만**(라벨 trims의 includeTag/TagLoop/Hanger/Poly 플래그).
13. **★작업지시서 테두리 = 2px 위계 정식 채택 (2026-06-09 사용자 "목업과 완전 동일" 요청 → 점3 예외).** 뼈대 굵은선 **2px `#6b7280`**(외곽 `.tp-wrap`, 헤더↔본문 `.htop` 1.5px, 도식화↔데이터 `.colL` border-right, 각 섹션 `.sec` border-top, `.topnote` border-bottom), 내부 셀 **1px `#d1d5db`**(연한 회색), 이미지 드롭존 **1px dashed `#9ca3af`**. 셀 배경: 헤더 `#f3f4f6`, 요척 `.yc #2563eb`. 폰트 IBM Plex Sans KR, th 700. ~~컬러웨이 그룹 배경 파스텔 색칠~~ **→ 2026-06-09 사용자 요청으로 색칠 전면 제거**(점14 참조). → 목업 `mockups/techpack-fruto-landscape.html`과 동일. (점3의 "1px 전용"은 작업지시서에 한해 무효.)
14. **★작업지시서 = 좌우 2단(Two-Column) 분할 — 세로·가로 공통 (2026-06-09 사용자 요청 "프로페셔널 분할 지시서").** `.tp-wrap .row{display:grid}` — **세로 `1.5fr 1fr`(좌60·우40), 가로 `1.35fr 1fr`**. 좌우 **중앙 2px `#6b7280` 구분선**(`.colL{border-right:2px}`, 세로·가로 둘 다). **좌측(Visual)**: 도식화(`flex:1` 최대 면적) → **지시사항**(`tpMemo`, 큰 텍스트 박스) → **스와치 실물 부착**. **우측(Data)**: **원·부자재 BOM** → 컬러·사이즈·수량 → **사이즈 스펙**(`tp-spec` 타이트 1px 그리드 유지). **원·부자재 = 발주서형 리스트(`.tp-bom`)** — 가로로 길고 뚱뚱한 표 폐기. 행마다 `[부위 chip][품목명]`(굵게) + `업체·혼용률·규격·요척`(메타 1줄, 요척 파랑) + `적용컬러`(스와치+컬러명, 필요시 소재넘버 회색) 묶음. 색칠/배경 없음, 억지 다열(column) 금지. 한 컬럼 내용이 짧아 하단 여백이 남는 건 정상(구분선은 full-height 유지). **방향별 콜럼 이동(2026-06-09, `var isPort=(_tpOrient!=='landscape')` 분기, 토글 시 `tpOrient`가 `tpRender` 재호출)**: ①세로형 = 봉제 **라벨·견본/워싱**·지시서(cs) **라벨**을 좌측 지시사항 아래로(가로형은 우측 유지). ②**지시사항(memo)** = 세로형은 좌측(넓게)·**가로형은 우측 컬럼(좁게)**. **모바일 대응**: `tpScreenFit` 축소를 `transform-origin:top center`→**`top left` + 레이아웃 폭/높이 보정**(`marginLeft=(clientWidth-축소폭)/2`, `marginRight=축소폭-원폭`(음수), `marginBottom=원높이*(s-1)`) → 시트(756px)가 뷰포트(375px)보다 넓어도 가로스크롤·잘림 없이 좌측 기준 축소, 데스크탑은 중앙정렬 유지.

- 2026-06-10(15): **발주 탭 요척·계산(참고용)에 "장수 × 요척" 표기 + 로직 검증.** 사용자 "몇 장 × 요척인지 같이 표기, 100장 오더가 몸판원단 로스로 120장 되는데 그게 맞게 나오는지 체크". **원단**: `요척·계산` 태그에 `장수 = round(yd ÷ 요척)` 추가 표시(예 `블랑 442yd 201장 × 요척 2.2y`). 원단 yd=의뢰장수×요척×(1+로스)라 **yd÷요척 = 로스 포함 환산 장수**(사용자의 100→120 = 100×(1+20%로스)와 정확히 일치). **부자재**: `calcTrimNeed`를 래퍼화해 `needPcs=qty×(1+buffer)`(로스포함 환산장수, effTotalQty=도미노 유효pcs 기반) 반환 → tMap에 `pcs` 합산 → `${round(pcs)}장 × 요척` 표시(롤/절/개수 모두). **라벨류(careLabel·mainLabel)는 발주개수가 컬러당수량+버퍼 방식이라 장수×요척과 불일치 → `isLabel`로 장수 표기 제외**. **로직 검증 결과 버그 없음**: 원단 로스(buffer)와 부자재 effective pcs(도미노)는 각각 정상 적용, 100→120은 ①원단 로스 ②actualOrderedQty 오버라이드→`getEffectivePcsByColor` 도미노로 부자재 전파 두 경로 일관. (참고: 요척·계산 원단 yd는 의뢰수량 기준 계산값 — 실제발주 오버라이드는 PO 텍스트에 `※실제발주`로 별도 표기.) 검증: 린넨셔츠 발주 원단 201장×2.2y=442yd·심지 204장×0.38·라벨 장수미표기, JSC SYNTAX OK.
- 2026-06-10(26): **부자재 단가 자동입력 안 됨 → 거래처 교차검색 폴백 추가.** 증상: 부자재명 골라도 단가가 0으로 안 따라옴. 원인: datalist(`updTnmDL`)는 현재 거래처에 자재 없으면 **전체 거래처** 이름을 보여주는데, `autofillTrim`은 `S.priceBook[현재거래처]`만 뒤져서 — 그 자재가 다른 거래처(또는 빈 거래처)에 저장돼 있으면 못 찾음(`if(!mats)return`). 수정: 현재 거래처에서 못 찾으면 **모든 거래처에서 같은 이름의 trim 검색**해서 단가/규격 불러옴(datalist와 동작 일치). 검증: 코메즈밴드를 '다른집'에 저장+폼 거래처 '메이드'(빈)로 autofillTrim→단가9000·크기30·롤당yard50 자동입력. **autofill 전체 항목**(부자재처+부자재명 필요): 단가·크기/규격·폭·혼용률·롤당yard·절당yard·실개수/미니멈·야드당개수·바이어스규격·원단출처·라벨명·제조년월·용도·요척·벌당개수·미니멈분배·롤단위·packUnit·사이즈별단가표·지퍼정보+거래처 동/호수(고정값은 이름변경 시 덮어씀, 요척 등 직접입력값은 빈칸만).
- 2026-06-10(25): **동기화 실패(데이터 너무 큼) 해결 — 인라인 사진 클라우드 정리 도구.** 증상: "⚠ 동기화 실패 — 데이터가 너무 큼(1006KB)·사진 많음"(`cloudSyncSave` coData>~1MB Firestore 한도). 원인: `tpOnFile`이 **비로그인/Storage 실패 시 사진을 dataURL(base64)로 본문 JSON에 인라인 저장**(폴백) → 누적되면 1MB 초과. 데이터는 로컬엔 안전, 클라우드 sync만 막힘. 해결: 신규 `migrateImagesToCloud()`(+`_collectInlineImages`/`countInlineImages`/`_dataUrlToBlob`) — S.items[*].techpack.images·S.brands[*](mainLabels/careLabels/finishMaterials.img·logo·refImages)의 `data:image` 값을 스캔→Storage 업로드→URL로 교체→saveData+cloudSyncSave. `🚑 데이터 관리`(openRecoveryTool)에 인라인사진 수/용량 표시 + (로그인 시)"🖼 사진 N장 클라우드로 정리하기" 버튼, 비로그인 시 ☁연동 로그인 안내. 검증: 인라인 4장(techpack2+브랜드라벨/로고2) 탐지·URL사진 제외·apply 교체 정상, JSC SYNTAX OK. **예방**: 사진 추가는 로그인 상태에서(그래야 바로 Storage URL 저장).
- 2026-06-10(24): **지시서 라벨 표(라벨|위치) 제거 → 도식화 자동 확대.** 사용자 "이 셀 없어도 될 듯, 도식화 위아래로 더 키우자". 합친 지시서(sew)·프로모(cs) 패널 colL에서 `labelBlock`(`tpLabelTableHTML` 라벨/위치 표) 삭제 → `.sketch{flex:1}`가 그 자리를 흡수해 자동 확대(린넨 세로 sketch ~675px). 라벨 실물 사진(colR 메인/케어)은 유지. 검증: colL 섹션=도식화→지시사항→견본/워싱→스와치(라벨표 없음), A4 한장 fit.
- 2026-06-10(23): **완성 탭에 "포장 방법"(사진+설명) 추가.** 완성 부자재 실물 사진 아래에 신규 섹션: `tpeq` 2칸 표 — 포장 사진(`_iz('packMethod')` 업로드, images.packMethod 저장) + 포장 설명(`tpMemo('pack.packMethodMemo')`). 검증: 완성 탭 섹션 순서 …실물사진→포장방법→출고분류수량, 사진칸/설명칸 존재.
- 2026-06-10(22): **완성 탭 "택 SET 구성" = 라벨 빼고 완성부자재만.** 사용자 "완성 지시서 택세트 구성에 케어/메인라벨 빼고 완성부자재 적히게". `tpTagChips`가 it.trims의 careLabel/mainLabel/라벨명까지 칩으로 넣던 것 → **`tpFinishItems(it)`(=완성부자재 실물사진과 동일 소스, finishSel)**만 사용하도록 교체. 검증: 린넨 택SET=메인택·행택끈·행거·폴리백(라벨명 가로30무광·흰검라벨 제거). 빈 경우 "완성부자재 없음 — 메인라벨 포함항목에서 선택" 안내.
- 2026-06-10(21): **가로형 도식화 칸 확대(아래로) — 지시사항·스와치 칸 축소.** 사용자 "가로 지시서 도식화 조금만 더 키우고 밑 칸들 조금 줄여줘". 가로(`.tp-doc.land`) 전용 CSS: `.colL .tp-memo{min-height:34px}`(지시사항 54→34)·`.tp-swrow{height:78px!important}`(스와치 이미지행 115→78, 인라인 override 위해 !important)·`.tp-swrow img{max-height:72px!important}`. 스와치 행/이미지에 `tp-swrow`/클래스 부여(`tpSwatchAttachHTML`). `.sketch{flex:1}`라 아래 칸 줄이면 도식화가 그만큼 자동 확장 → 가로 도식화 ~320→376px. 세로형은 무변경. 검증: 린넨 가로 sketch 376·memo 45·swrow 78·A4 한장 fit(스크린샷).
- 2026-06-10(20): **작업지시서 도식화 이미지가 칸을 키워 하단 셀 밀림 → 이미지 absolute로 레이아웃에서 분리.** 증상: 도식화(`.sketch`)에 세로 긴 사진 넣으면 칸이 사진 크기로 커져 지시사항·라벨·스와치가 아래로 밀리고 A4 넘침. 원인: `.sketch{flex:1}`의 in-flow `<img>`(max-height:100% 있어도) 콘텐츠 크기가 flex 레이아웃 높이에 반영됨. 수정: `.sketch img`를 `position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain`로 → 이미지가 레이아웃 높이에 기여 안 함, 칸은 flex 배정 크기만 유지(`.sketch`는 position:relative라 이미지가 그 안을 채움). 검증: 300×1200 세로이미지 넣어도 sketch=254px(이미지 안 끌려감)·colL 오버플로 0·A4 fit(752≤752)·스크린샷에서 하단 셀 안 밀림. (`.iz img`는 표 셀이라 미변경, 동일증상 시 같은 처리.)
- 2026-06-10(19): **부자재 effective 수량 = 사이즈별 반올림 합(분배표와 일치) + 라벨도 장수 표시.** ①사용자 "N71이 왜 198장? 200인데": calcSups가 effColorQtys를 **컬러단위 반올림**(round(80×1.05)=84)했는데 분배표(getEffectivePcsBreakdown)는 **사이즈별 반올림 합**(11+32+32+11=86)이라 ±몇 장 어긋남 → 합 198. 수정=`effColorQtys[c]=Σ effColorSizeQtys[c][sz]`(사이즈별 반올림의 합)으로 통일 → 트림·부속원단 모두 분배표와 동일(검증: 2색2사이즈 B+5% → 버튼 B=43=32+11, 컬러단위면 42). ②사용자 "라벨들은 수량 적용 안됨": 요척·계산 장수 표시에서 `!m.isLabel` 제외 삭제 → 케어/메인라벨도 `${needPcs}장` 표시(예 가로30무광 210개 200장×요척1). 검증: 린넨 라벨 200장 노출, JSC SYNTAX OK.
- 2026-06-10(18): **부속원단(카라·에리)도 보정수량으로 발주 + 요척·계산 부자재 컬러별 분리 (사용자 요청, 발주수량 변경=확인 후).** **Part A(표시)**: 요척·계산 트림을 컬러별로 분리(tMap 키에 `itemColorName` 추가, 라벨류 제외) → `(백색,연그레이) 110장 / (민트,블루) 90장`처럼 예측 쉽게. **Part B(발주수량, 돈 영향—사용자 확인)**: 기존엔 부자재만 effective(도미노) 수량으로 나가고 **부속원단은 원래수량 그대로** 나가던 갭. 수정=`calcSups` 원단 루프에서 **`actualOrderedQty`(발주량 직접 수정)가 있는 원단=몸판→원래 `colorQtys` 유지, 없는 원단=부속→`effColorQtys`(effective)** 사용(사이즈도 effColorSizeQtys). 몸판 식별=용도라벨 아닌 **'직접 수정한 원단'(override source)** 기준(사용자 "이해 안됨"→자동/부자재와 동일방식 채택). 양방향(↓↑, getEffectivePcsByColor ratio<1 floor/>1 round). override 없으면 effColorQtys===colorQtys라 무변화(안전). 검증: 블랑 백색 오버라이드(132→66) 시 블랑 백색=132 유지·카라원단 백색=18→9(60→30장) 보정, JSC SYNTAX OK.
- 2026-06-10(17): **★요척·계산 장수 = 저장된 실제 의뢰수량(yd÷요척 역산 폐기) — 사이즈별 요척 오류 정정.** 점16에서 "116 vs 114 차이=2% 로스"라 한 건 **오진**(해당 원단 로스 0%). 진짜 원인=원단이 **사이즈별 요척**(size2·3=0.75/4·5=0.8)인데 장수를 `yd÷단일요척(0.8)`로 역산해 93÷0.8=116이 나온 것(실제는 120장: 0.75×20+0.75×40+0.8×40+0.8×20=93yd). **수정**: `calcSups` 원단 push에 `garmentPcs:qty`(계산에 쓴 실제 의뢰장수) 저장 → fMap에 `pcs` 합산 → 장수=`round(pcs)` 직접 표시(역산·로스나눗셈 폐기). 사이즈별 요척이면 `${장수}장 · 사이즈별 요척`(단일곱 숨김). 검증: 린넨 단일 200장×2.2y / 사이즈별 200장·사이즈별요척, A-359 연두는 120장. **주의(단계 차이)**: 요척·계산 = **원래 의뢰수량 기준**(원단은 `colorQtys` 원본), 컬러별 분배표는 **보정(override) 후 effective** — 둘이 다르면 로스가 아니라 보정 때문(예 연두 120→114는 발주량 89y로 줄인 결과). 부자재는 `needPcs=qty`(effective)라 분배와 일치. JSC SYNTAX OK.
- 2026-06-10(16): **발주서 완성부자재 finishSel 미반영 버그 수정 + 요척·계산 장수=로스제외(분배수량 일치).** 〔장수 부분은 점17로 정정 — yd÷요척 역산은 사이즈별 요척에서 틀려서 garmentPcs 저장방식으로 교체〕 ①**버그**: 아이템 메인라벨에서 완성부자재 '텍'만 선택해도 발주서엔 텍·텍고리·접는포리 다 나옴. 원인=`calcSups`가 자재 push에 **`finishSel`을 안 넘겨서** `genPoText`의 `ml.finishSel` 폴백(구 include 플래그)이 항상 작동. 수정=두 trim push에 `finishSel:(Array.isArray(t.finishSel)?t.finishSel.slice():undefined)` 추가 → finishSel 있으면 그것만, 없으면(옛아이템) include 폴백. 검증: finishSel=['텍']+include 다 켜도 PO 출력 `[텍]`만. ②**장수=로스 제외로 변경(점15 개정)**: 사용자 "분배 수량(114)이랑 요척 장수(116)가 왜 다르냐". 차이=원단 버퍼(로스). 점15는 `round(yd/요척)`=로스포함이라 분배표와 어긋남 → **원단 `round(yd / (요척×(1+buffer/100)))`**(fMap에 `buf=fc.buffer??FAB_LOSS_PCT` 저장), **부자재 `needPcs=qty`**(로스 제외, 기존 ×(1+buffer) 제거) → 장수 = **순수 의뢰장수 = 분배표 수량과 일치**(워싱블루종 연두 93/(0.8×1.02)=114=분배 114). 로스는 발주 yd/개수에만 포함. 검증: 린넨 블랑 buffer2%→451yd 201장(분배 200)·심지 200장·라벨 장수미표기, JSC SYNTAX OK.
- 2026-06-10(15b): **요척·계산 장수 — 컬러별 수량차/사이즈별 모드 검증·보완.** 사용자 "부자재는 컬러·사이즈별 수량 다를 수 있으니 확인". **①컬러별 수량 다름 = ✅정상**: `calcSups`가 colorLinks 그룹별로 effColorQtys 합산해 따로 계산 → 요척·계산은 trim 이름으로 합산. 검증(린넨셔츠 8030심지: 백색60+연그레이50=110장→needPcs 112.2, 민트40+블루50=90장→91.8, 합 204장 = 표시값 일치). genPoText는 컬러별 분리 출력. **②사이즈별 모드(`sizeMode='bySize'`/원단 `consumptionBySize`) = 실제 발주서(genPoText)는 사이즈별 정확 계산**(각 사이즈: 해당수량×사이즈별개수×버퍼·사이즈별 규격), 단 요척·계산 **요약**의 단일 요척은 근사 → **요약에서 bySize면 `${장수}장 · 사이즈별 요척`으로 표시**(단일값 곱 숨김, 장수=총합은 유지). 원단·부자재 둘 다 `bySize` 플래그(fMap=`fc.consumptionBySize`, tMap=`t.sizeMode`). **로직 버그 없음**(요약은 참고용·근사, 실발주는 genPoText가 컬러·사이즈별 정확). JSC SYNTAX OK.
- 2026-06-10(14): **아이템 상단 핀 정렬 — 다 안된 것 위 / 원가만 미전달 맨 아래 별도 그룹.** 사용자 "다안된거 맨위, 원가만안된거 맨하단". `_pinFlags(it)`={kc,ins,cost} 헬퍼로 통일. kcPend를 두 그룹으로 분리: `pinCostOnly`(cost && !kc && !ins = 원가만 미전달) / `pinReady`(그 외 = KC·지시서가 남은 것). `pinReady`는 미완 개수(kc+ins+cost) **내림차순**(다 안될수록 위), `pinCostOnly`는 하단에 `💰 원가만 미전달 (N)` 서브헤더(`.il-pin-sub` 앰버 점선 구분) 아래 모음. 검증: 합성 4건(다안된3·F로고니트2·지시서만1·원가만) 렌더 순서 = 3→2→1→[💰]→원가만, JSC SYNTAX OK.
- 2026-06-10(13): **아이템 상단 핀 = 시즌 그룹에서 빼서 "진짜 위로 이동"(중복 제거) + 원가 미전달 포함.** 증상: 메인+KC대기/원가미전달 아이템이 "위로 안 올라간다" — 실제론 상단 🛡핀 박스에 **복사본**이 올라가지만 **원본이 시즌 그룹에 그대로 남아** 헷갈림(스크린샷은 시즌 그룹 인스턴스). 수정: `renderItemsList` 핀(kcPend) 대상 id를 `pinIds`로 모아 **bySeason 그룹 빌드에서 제외**(`if(pinIds[x.it.id])return`) → 핀 아이템은 최상단에만 1회 표시, 시즌 그룹에선 사라짐(그 시즌 전부 핀이면 빈 그룹은 자동 누락). 핀 조건은 메인/리오더 + (KC미완(프루토만) OR 지시서미완 OR **원가미전달 `!costSent`**), 헤더 `🛡 메인 준비 — KC·지시서·원가 대기 (N)`. 검증: 더프루토 메인(F로고니트) 핀 1회만 노출(중복 0)·해당 시즌 그룹 소멸, JSC SYNTAX OK.
- 2026-06-10(12): **PDF/이미지(html2canvas) 글씨 하단쏠림 = html2canvas 1.4.1의 input·td 수직정렬 버그 → `onclone`으로 중앙 강제.** 증상: 화면(브라우저)은 담당자·치수·라벨·견본/워싱 글씨가 중앙인데 **PDF/이미지만 셀 하단(baseline)에 붙음**. 원인: html2canvas 1.4.1이 `<input>`·`<td>`의 `vertical-align:middle`·line-height 중앙정렬을 무시하고 baseline(하단)에 텍스트를 그림(화면 CSS 문제 아님). 수정: 신규 `tpCaptureFixVAlign(clonedDoc)`를 **두 html2canvas 호출(`tpSaveImg`/`tpSavePDF`)의 `onclone`** 으로 전달 — 캡처 복제본의 `#tp-modal .tp-wrap td/th/input`+`.htop .who input`만 라이브 `clientHeight` 읽어 **line-height=칸높이·상하패딩 0·vertical-align middle**(input은 height도) 강제 → 단일행 텍스트가 line-height로 정확히 수직중앙. **자식요소 있는 셀(스와치·칩·중첩표)은 제외**(children>0 skip)해 깨짐 방지. 화면 DOM·자동축소·A4맞춤은 안 건드림(복제본만). 검증: 실제 html2canvas 캡처(onclone) 캔버스(1512×2170)를 화면 오버레이→스크린샷, 컬러/수량·치수헤더/측정부위·라벨/위치·메타행 전부 수직중앙 확인, JSC SYNTAX OK. **교훈: html2canvas는 input/td 수직정렬을 화면처럼 못 그림 → 캡처계열 정렬 이슈는 CSS가 아니라 onclone에서 잡는다.**
- 2026-06-09(11): **인쇄(`tpPrint`) 빈 페이지·2페이지 분리 버그 수정 — 이미지/PDF처럼 A4 고정+맞춤축소.** 증상: 🖨인쇄 누르면 머리글만 있는 빈 A4 + 내용이 작게 축소돼 다음 장으로 밀림. 원인: `@media print`가 `.tp-wrap`을 `height:auto;overflow:visible`로 풀어버리는데, 화면 콘텐츠맞춤용으로 `.tp-fit`에 걸린 `transform:scale()`(+`width:142%`)은 **인쇄에서 리셋 안 됨** → 시각적으론 축소되지만 레이아웃은 축소 전 높이를 점유 → 빈 공간+페이지 분리. 수정: 인쇄 `.tp-wrap` 규칙에서 `width:100%/height:auto/min-height:auto/overflow:visible` 제거 → **베이스 A4 고정(200×287mm·가로 287×200mm)+overflow:hidden 유지**, `transform:none`(화면축소만 해제). `.tp-fit` transform은 **그대로 유지**(=A4 맞춤축소). `tpPrint`가 `tp-printing` 클래스 추가 직후 `tpFit()` 호출(인쇄 직전 A4 맞춤 갱신, tpScreenFit은 tp-printing이면 wrap 화면축소 skip)·`afterprint`에도 tpFit 복원. 검증: 인쇄 시뮬(tp-printing+tpFit) wrap 756×1085px(정확히 A4)·transform none·fit이 A4 안에 fit(scrollH 1081≤clientH 1085)=한 장, JSC SYNTAX OK. ⚠️**연한 회색 배경(`.sec` `#f3f4f6`)은 원인 아님**(print-color-adjust:exact로 그대로 인쇄).
- 2026-06-09(10): **재단+봉제 지시서 → 단일 "작업지시서" 통합 + 모든 입력칸 수직 옵티컬센터 + 프린트 X 숨김 (사용자 3건).** ①**탭 통합**: 비프로모 탭 `재단/봉제/완성` → **`지시서/완성`**(`재단`·`봉제` 표기 삭제). 합친 `지시서`=**봉제(sew) 패널 기반**(좌: 도식화→지시사항→라벨→견본/워싱→스와치 / 우: 수량→원·부자재→완성치수→라벨실물사진) + **재단 주의사항(`noteCut`)을 봉제 주의사항(`noteSew`) 위에 추가**. cut 패널 미렌더(`isPromo?cs:sew`), 기본탭·active 가드·tpOpen 모두 `cut`→`sew`(옛 저장 `cut`/`cs`도 sew로 흡수), 제목 prefix는 sew일 때 `(봉제)` 빼고 **`작업지시서`**(tpRender·tpTab 둘 다). **도식화 축소**(`.sketch min-height 32→26mm`). 가로·세로 공통. 프로모(`cs`)·완성(`pack`)·자수·나염 탭 불변. ②**모든 `<input>` 수직 옵티컬센터**(영역별 따로 X, 일괄): 헤더 담당자/전달일(`.htop .who input` **padding:0→4px 4px 2px+line-height 1.5+vertical-align middle**, 바닥붙음 해소)·치수표(`tp-spec td/input`)·전체 입력(`tp-wrap .tp-cell/input`) 전부 **상단 패딩↑·하단↓(5/3px)**로 한글 베이스라인 보정. ③**프린트도 X(`.izdel`)·브랜드 배지(`.iz-brand`) 숨김**(`@media print`에 추가, 기존 캡처숨김과 동일). 검증: 프리뷰 비프로모 가로/세로 탭=`지시서/완성`·제목=`작업지시서`·sewNotes=[재단,봉제]순·헤더input pt4/pb2/lh1.5, JSC SYNTAX OK.
- 2026-06-09(9): **작업지시서 내보내기 보강 + 지시사항 강조.** ①캡처 전 `tpWaitImages`로 모든 `<img>` 로드(load/decode) 완료 대기(+60ms)→html2canvas — 도식화/스와치가 로딩 전 캡처돼 하얗게 날아가던 타이밍 버그 방지. html2canvas 옵션 `x:0,y:0` 명시(+기존 scale:2·useCORS·scrollX/Y·width/height·windowW/H). **allowTaint는 미사용**(외부이미지 그리면 캔버스 taint→`toDataURL` 실패=다운로드 불가). **A4 overflow:hidden 미사용**(내용 넘치면 잘림 → contain 비트맵 축소 방식 유지가 잘림 방지). ②**지시사항 메모(`tp-instr`)** 폰트 11→**14px(+3pt)·검정 #000·600** 강조(공장 가독성). 검증: 내보내기 A4 1512×2170·도식화/스와치 픽셀 존재·natH=a4h(무잘림)·지시사항 14px/검정, JSC SYNTAX OK. **⚠️Storage URL 이미지가 CORS 미설정이면 여전히 빈칸**(버킷 CORS 설정 필요, gsutil).
- 2026-06-09(8): **작업지시서 4종 정리(견본/워싱·실물사진·BOM·테두리).** ①견본/워싱: 견본 placeholder 제거(빈칸), 워싱 placeholder=`워싱없음`(미입력 시 자동 표시). ②라벨 실물사진 행: 메인라벨·케어라벨 **2칸만**(완성부자재·단추/스냅 삭제), 아이템 개별 업로드 없으면 **선택한 브랜드 라벨 사진 자동표시**(`tpSelectedLabelImg`+`_izLabel`, 브랜드 뱃지, 캡처 시 뱃지 숨김). ③원·부자재 BOM 1줄=`부위 / 제품명 (업체)` 굵게(부위 비거나'-'면 생략), 2줄=혼용률·규격·요척만 연한 회색(`#6b7280` 얇게)·업체 제거(`.bom-part` 박스 폐기). ④**테두리 위계 변경(점13 재개정)**: 최외곽 `.tp-wrap` 2px `#374151`만 굵게, 내부 전부 1px `#d1d5db` 실선 통일(`.sec`/`.colL`/`.htop`/`.topnote` 2~1.5px→1px, `.sketch`·`.iz` dashed→solid, 헤더 구분선 `#9ca3af`→`#d1d5db`), 표 `border-collapse`로 겹침 방지. 검증: 세로 봉제 BOM·실물사진·테두리·placeholder 프리뷰 확인, JSC SYNTAX OK.
- 2026-06-09(7): **작업지시서 이미지/PDF 내보내기 대수술 — 자연크기 캡처 후 비트맵을 A4에 맞춤.** 기존 `content-fit transform` 채로 html2canvas → 치수표 행 겹침·담당자/전달일 하단 밀림·PDF 다중페이지. → **캡처 시 transform 전부 해제**, `wrap min-height=A4 + height:auto + overflow:visible`(내용 적으면 flex 도식화가 A4 채움, 많으면 늘어나 안 잘림), 자연 height로 `html2canvas` → **`tpFitCanvasToA4`로 비트맵을 A4 비율에 contain-fit**(transform 렌더버그 회피). PDF는 그 A4 캔버스를 `addImage(0,0,pw,ph)` **한 장**. A4 실측은 `offsetWidth/Height`(화면 transform 영향X). **캡처 숨김 추가**: `.izdel`(이미지 ×), 치수표 '패턴 S·M…' 안내문(`tp-editonly`). 검증: 도식화/스와치 dataURL 렌더·담당자/전달일 상단·×없음·치수11행 안잘림·A4 1512×2170 한장, JSC SYNTAX OK. **⚠️미해결**: 이미지가 **Firebase Storage URL**이면 CORS로 캔버스에 안 그려짐(dataURL은 됨) → 버킷 CORS 설정 필요(사용자 환경, gsutil).
- 2026-06-09(6): **아이템 메인라벨 '포함 항목' = 브랜드 완성부자재 목록 기반(동적) + 메인라벨 사진연결 복구.** 사용자 선택: 고정 7체크박스 → **선택한 브랜드의 `finishMaterials` 목록을 체크박스로 동적 생성**(커스텀 '고무줄' 등도 뜸). 체크 상태는 `trim.finishSel`(이름 배열, `toggleFinishSel`로 즉시 반영, `onMainLabelBrandChange` 시 초기화, `saveItemForm`이 `[data-finish-name]` 수집). **발주서(`genPoText`)·작업지시서 완성탭(`tpFinishItems`)** 모두 `finishSel` 우선·없으면 구 include 플래그 폴백(기존 아이템 안 깨짐, 비용계산 영향 0). 또 **`tpLabelName(mainLabel)`이 `t.labelName`(선택한 브랜드 라벨명) 반환**하도록 고쳐 작업지시서 라벨↔브랜드 사진 이름매칭 복구. 검증: 메인라벨 카드에 브랜드 완성부자재(택·고무줄·옷걸이) 체크박스·체크→finishSel→tpFinishItems 일치·메인라벨 사진 hasImg true, JSC SYNTAX OK.
- 2026-06-09(5): **작업지시서 가로형도 세로형과 동일 배치 + 모바일 폰트확대(font boosting) 차단.** ①사용자 요청대로 **라벨·견본워싱·지시사항을 가로형도 좌측 컬럼**으로(이전 `isPort` 방향 분기 제거 → 세로·가로 공통 colL: 도식화→지시사항→(봉제:라벨→견본워싱)→스와치, colR: 수량→원부자재→치수→(봉제:라벨사진)). 앞서 "가로 지시사항 우측" 지시를 사용자가 번복함. ②**모바일에서 `.topnote` 10.5px가 안 먹고 2줄 되던 문제** = iOS/모바일 폰트 자동확대(A4 시트>뷰포트라 트리거) → `#tp-modal{,*}`에 `-webkit-text-size-adjust:100%;text-size-adjust:100%` 추가로 차단. 검증: 가로 봉제 colL 순서·모바일 375 topnote 1줄(cut/sew)·데스크탑, JSC SYNTAX OK. **교훈: 작업지시서 글씨/레이아웃 변경은 데스크탑+모바일(375) 둘 다 확인.** ③헤더 **전달일 = 날짜선택(`tpInpDate`, `type=date`)** — `head.date`에 `YYYY-MM-DD` 저장(기존 비ISO 텍스트는 빈값 처리), `.tp-hdate` 폭 98px(세로 90px). who 시작 61%로 중심 안 넘고 제목 안 잘림.
- 2026-06-09(4): **원가계산서 이미지 저장(`downloadCostImage`) = 편집용 UI 전부 숨겨 깔끔하게.** 캡처 시 `#cs-body`에 `cs-img-mode` 클래스 추가 → CSS로 `button`·`.cs-hide-on-img`·`.cs-excluded-row` 전부 `display:none`. 즉 **버튼(+추가·모두포함·✕·미니멈분배), 체크박스, 체크해제(제외)한 행 전체, 💡설명글·빈상태 힌트·매장가/협상 서브라인·실제발주/원가용단가 입력칸**이 이미지엔 안 나옴(화면·계산값은 그대로). 제외행은 `<tr class="cs-excluded-row">` 마커로 식별(원단/부자재/가공비/부자재가공비/완성부자재 5종 공통). 검증: 이미지모드에서 버튼12→0·체크박스10→0·제외행1→0·설명글28→0, 캡처 스크린샷으로 깔끔 확인, JSC SYNTAX OK. ⚠️결제관리 명세서(`buildPayReceiptHTML`)는 손대지 않음.
- 2026-06-09(3b): **브랜드 라벨·완성부자재 = 목록별 항목마다 사진 (3a의 4고정슬롯 → 목록형으로 개편, 사용자 "라벨마다 이미지 + 완성부자재 목록 추가").** 브랜드 관리 `renderBrandLabelsSection`: **메인라벨·케어라벨 목록 각 행 좌측에 34px 사진 ＋칸**(`lb.img`) + **📦 완성부자재 목록**(신규 `b.finishMaterials`, `_brandLabelArr` kind=`finish`) 행마다 이름·단가·사진. 업로드 `brandLabelImgUpload(brandId,kind,idx)`→Storage `brandlabels/{co}/{brandId}_{kind}{idx}_{ts}.jpg`, URL만 JSON. 작업지시서 연동(2026-06-09 사용자 "사진 없으면 다른 사진 말고 빈칸"): **봉제탭 사진칸(`_iz`) 브랜드 폴백 제거**(아이템 업로드만, 없으면 빈칸) + **라벨 표(`tpLabelTableHTML`)에 `사진` 컬럼 추가** — `tpBrandLabelImgByName`이 **라벨 이름이 정확히 일치**하는 브랜드 항목 사진만 표시(불일치/무사진=빈칸, 첫-사진 대체 안 함). 사진 있는 라벨이 하나도 없으면 사진 컬럼 자체를 숨김. 검증: 일치 라벨만 사진·불일치 라벨 빈칸·미일치 브랜드사진 미표시·봉제칸 뱃지0, JSC SYNTAX OK. (구 `tpBrandRefImg`/`tpBrandFirstImg`/4슬롯 함수는 미사용 잔존.)
- 2026-06-09(3a): **브랜드 탭에 라벨·완성부자재 참조이미지 → 작업지시서 자동 불러오기 (브랜드 로고 패턴 확장).** 〔3b로 대체〕 4슬롯(메인라벨·케어라벨·완성부자재·단추/스냅) 업로드 → `b.refImages[slot]`. 작업지시서 봉제탭 사진칸(`_iz`)이 **아이템 개별 이미지 없으면 브랜드 이미지로 폴백** + `브랜드` 뱃지(클릭 시 아이템 개별 업로드로 오버라이드→×삭제로 폴백 복귀).
- 2026-06-09(2): **★작업지시서 세로형 = 프로페셔널 좌우 2단 분할로 리팩토링 + 원·부자재 BOM 리스트화 + 칸 색칠 전면 제거 (점13·14 개정).** 기존 세로형은 `.row{flex-direction:column}`이라 1단 통짜 → 원자재표가 뚱뚱 → **세로 `.row`를 `grid 1.5fr 1fr`(좌60/우40)로 변경**, `.colL{border-right:2px}` 중앙 구분선(세로·가로 공통). **콘텐츠 재배치**: 좌 = 도식화(크게)+지시사항(`tpMemo`)+스와치 / 우 = 원·부자재 BOM+컬러·사이즈·수량+사이즈스펙. **`tpMaterialTableHTML` 전면 교체**: 9열 `table.mat`(+`TINTS` 파스텔 배경, `subC` 서브셀) → 발주서형 `.tp-bom` 리스트(`[부위chip][품목] + 업체·T60 L40·54"·요척 + 컬러스와치` 묶음, 색칠 0). 프리뷰 검증(AR29 세로 재단/봉제): grid 450/300px·구분선 2px·BOM 5행·수량 TOTAL 200·치수 그리드 정상, JSC SYNTAX OK. **가로형은 같은 새 구조로 렌더되며 다음 작업에서 별도 최적화 예정**(사용자 "세로 끝나면 가로도 수정"). **헤더**: 로고 절반 축소(`.htop .logo img max-height 48→24px`, 로고칸 `108→60px`), 세로형 제목 줄여 2줄 넘침 방지(`.tp-doc:not(.land) .ttl 19→14px` + `tp-pfx white-space:nowrap`). **세로형 담당자·전달일(`.who`) 축소(2026-06-09)**: 기본은 `.who`가 헤더 51% 차지→제목 잘림 → 세로형 한정 `who>div{min-width:0;padding:2px 5px;font-size:9px}`·`who input{width:36px}` → who 41%·시작 59%(중심 안 넘김), 제목 안 잘림. **세로형 주의사항(`.topnote`) 1줄화(2026-06-09)**: 13px→`10.5px`/line-height 1.35 (세로형만) → 재단·봉제 안내문 2~3줄→1줄(좁은 60% 좌측 컬럼). 검증: cut/sew 둘 다 lines:1.
- 2026-06-09: **작업지시서 이미지/PDF 가로 내보내기 세로뒤집힘·하단잘림 수정.** `tpCaptureExpand`에서 `height:auto`(시트 높이 풀림) 제거 → wrap을 A4 원본 크기 유지+content-fit 축소 유지, html2canvas에 `width/height`=A4 박스 명시. 검증: 가로 canvas 2170×1512(가로 A4×2)·세로 756×1085, 내용 박스 내 축소 확인.
- 2026-06-08: **작업지시서 10종 버그/요청 라이브 수정(목업 없이 index.html 직접 — 사용자 "목업 그만, 바로 앱").** 위 9~13 신설·구현. AR29(아루드 린넨셔츠) 실데이터 단위검증 + 프리뷰 스크린샷 검증: 혼용률 `T60 L40`, 컬러 4개, 부자재 컬러 로드(흰색/검정·TRIV/스모크·30수 8콘), 수량 `TOTAL 200`(free/FREE 대소문자 버그 수정), 스와치 균등, 라벨 중복제거+`위치`, 포장→완성, 완성부자재 선택분만(메인택/행택끈/행거/폴리백), A4 자동축소(봉제 0.74배로 1장 유지) 전부 확인.
- 2026-06-08(2): **작업지시서 헤더/탭/표 2차 개편.** ① 제목 앞에 `작업지시서(재단)`/`작업지시서(봉제)`… 프로모션은 `지시서`(아이템명과 같은 굵기·크기) — tpTab이 탭별로 갱신. ② 메타 1줄: 브랜드·품명·**시즌**·품번·(봉제/프로모션)·작업경로 한 줄(`table.tp-meta`). ③ **재단/봉제/완성 탭을 작지 바깥 최상단 버튼**(`.tp-tabsbar`, 이미지/PDF/인쇄엔 안 나옴 — 캡처 시 `.tp-tabsbar` 숨김). ④ 원자재 컬러 **1컬러당 1칸(세로)** + **소재넘버 칸** 추가(`.tp-sub`) — colorLinks의 itemColor/fabricColor, 가로 안 넘침. ⑤ 프로모션 = 탭/제목 `지시서`, "재단·봉제 통합" 문구 삭제, 안내문 좌측정렬(`.topnote text-align:left`). ⑥ 도식화 여백 5→2px. ⑦ **브랜드 로고**: 브랜드 관리 카드에 로고 업로드(`brandLogoUpload`→Storage `brandlogos/{co}/{brandId}`, 폴백 dataURL) → 작지 헤더 로고칸 자동표시(`tpBrandLogo`). ⑧ **치수 프리셋 = 상의(네크단면…뒷총장 11)/팬츠(오비단면…인심 8)/스커트(허리단면…와끼총장 4)** 고정. ⑨ 작업지시서 툴바에 **💾 저장 버튼**(`tpSaveNow`, 자동저장은 그대로 + 명시 버튼). 두 컬러(예 아이/겨자) 반반 스와치는 기존 `tpSwatchBox`가 `/`·`·`로 split해 그라데이션 — 정상 동작 확인.

- 2026-06-15: **뒤로가기/되돌리기 + 아이디어보드 2단계 + 택배시재 + 원단라이브러리 + 참고탭 (5건).** ①앱 뒤로가기/나가기/되돌리기: 헤더 ←/↩/↪, popstate 트랩(작지→모달→오버레이→아이템폼→이전탭), saveData 스냅샷 20단계(undo), Esc=닫기. ②아이디어 상세(openIdeaDetail, .overlay): 영감·소재·핏·목표가 + 예산계산 + 일정역산(ymAdd) + 레퍼런스(tpCompress/tpUpload) + 샘플승격(statusManual.auto=true). ③**택배 시재**=결제 서브탭 '🚚 택배 시재'(renderCourierLedger): 빠른입력 한줄(clParseNL)/버튼칩, 브랜드별 묶음·미정산/정산완료·이미지(html2canvas), S.courierLedger={bank,entries} 전 영속지점 미러링. ④**원단 라이브러리**=단가장 토글 '🧵 원단 라이브러리'(renderFabricLib): 검색·필터(사용/이슈), 카드, 상세(스와치업로드·태그·이슈·장단점·쓴아이템 자동), 데이터=priceBook material/supplier(savePB). ⑤**참고 탭**='📌 참고'(renderRefTab): 브랜드별/공장별/공통체크리스트, 그레이딩표·패턴이미지·주의체크·장단점·연결아이템 자동, S.refData={brands,factories,checklists} 전 영속지점 미러링. 전부 두 테마 토큰 대응, JSC SYNTAX OK 후 push.

- 2026-06-18: **★부자재 폼 재구조 — 확정안 (✅2026-06-19 전체 구현 완료).** 사용자와 시안 합의 완료 → **13개 타입 새 카드 전부 적용·검증·푸시 끝**(구현 상세는 아래 2026-06-19 항목). 아래 확정안은 합의 원본 보존용. **목표:** 부자재 카드가 길고 인라인스타일로 어긋남 → 일관 골격+컴팩트.
  - **공용 4탭 골격 (모든 타입 동일):** ①기본(정체+계산 2분할) ②(타입)디테일 ③적용 ④옵션. 평소 핵심(기본)만 보이고 나머지 접힘/탭. 타입 바뀌어도 위치 동일. 인라인스타일→공용클래스(.trow/.tedit/.frow/.calc 등)로 통일.
  - **렌더형:** 행 리스트(한 줄=타입칩·이름·거래처·요척·단가·상태배지)→누르면 탭 편집. (시안 trim-redesign-mock2/3/4, trim-zipdetail-mock, trim-apply-mock — /tmp/fpf-preview)
  - **기본 탭 배치(핵심):** 짧은칸(용도·단위·동·호수·크기·색상)=내용크기 고정폭, 긴칸(거래처·부자재명)만 flex. **정체(왼쪽 넓게) | 계산(오른쪽 좁은 칼럼: 요척·단가·로스)** 2분할(≤560px 세로쌓임). 계산 칼럼에 **변환 한 줄**(롤·절·봉지·단추고리: 예 "0.5×310=155y ÷롤당200y=1롤").
  - **흐름 배지:** 값마다 발(발주서)·원(원가)·장(단가장자동) 미니배지. 단가장 자동값=회색칸.
  - **지퍼 디테일:** 규격4칸(방향·호수·기장·이빨컬러) 한줄 + 슬라이더박스·로고박스 **좌우 2열**.
  - **타입별 연결 매트릭스(설계도)** = mock4 표: 타입→직접입력→계산식→전용칸→단가. 이게 각 타입 계산칼럼/디테일탭 내용 정의.
  - **확정 개선 7+1:** ①단가 미입력=빨강 경고배지(원가 0원 새는 것 방지) ②단위 드롭다운 제거→타입에서 자동(롤계열만 절/롤/박스/봉 선택 유지) ③"색상(자재 자체색)" vs "적용컬러(오더컬러별)" 라벨 명확 ④로고·염색 발주서엔OK·**작지 부자재표엔 추가 필요**(tpTrimTableHTML에 로고/염색 칸) ⑤사이즈별+컬러별 단가=적용탭에서 "달라지는 기준(공통/컬러별/사이즈별/컬러×사이즈)" 골라 그 표에만 단가 입력(계산탭단가=기본값, 적용탭=override, 원가는 적용컬러 단가 MAX) ⑥용어=타입별 라벨 자동(개수형="벌당 개수"/길이형="요척(y)") ⑦부자재 복제 버튼 ⑧**기본 부자재처**(아이템에 1개 지정=메이드)→새 부자재 자동채움, 다른 곳만 수정.
  - **타입 통합(확정):** 봉지→단추고리, 레이스→롤(레이스 체크), 절→롤(단위 절+÷30 자동)으로 합침. 추가버튼 12→8~9개. **기존 데이터 호환 유지.** 스냅·실은 유지(사용중).
  - **안전:** 폼 HTML/CSS만 변경, 계산함수(calcTrimNeed/calcSups/genPoText)·data-f 필드명 불변 → 지시서·원가·단가장·결제 연결 보존. 단계별(골격+지퍼 먼저→나머지) push, 매번 기존과 숫자·발주서 동일 검증. 두 테마 적용.

- 2026-06-20: **★아이템 리스트 카드 모바일 정리안 적용 (`itemRowHTML` 교체).** 모바일에서 버튼 ~10개가 뭉개지고 한눈에 안 들어오던 문제 해결. **방식: 겉(마크업/CSS)만 바꾸고 기능은 전부 보존** — 옛 함수 16개(tpOpen·showItemCost·showItemForm·dupItem·delItem·toggleItemStat·toggleCostSent·openKcModal·itemKcState·itemNeedsKc·setItemCost·itemLaborInline·itemBadgeHTML·itemStartDateHTML·itemStatusEditorHTML·COST_DEFS) 그대로 호출.
  - **새 카드 구조(`.nc-card`):** 헤더(시즌·품번·시작일date) → 배지줄(itemBadgeHTML 그대로=클릭 시 상태편집기) → 이름 → **스펙 한 줄(nowrap+말줄임, 정보항목 안 뺌·우선순위만)** → **상태 칩 한 줄(.nc-st)** → **가공비 토글(.nc-cost, 접힘 기본·편집 인풋 그대로)** → **액션바 3개(작지·원가·수정)+⋯(복제·삭제 .nc-more-row)**.
  - **상태 칩:** 작지(instrDone)·원가전달(costSent)·그래이딩(gradingDone)·**KC(itemNeedsKc=프루토만, openKcModal 컬러별)**·촬영용(photoReady). 색: **중요(작지·원가전달·KC)는 대기=빨강(warn)**, 그 외 대기=중립, 완료=연두(on). il-pin 우선순위 로직과 동일.
  - **CSS는 `.nc-*` 새 클래스**로 분리(렌더 시 STY에 주입) → 기존 `.im-*` 안 건드림. 레트로 기본 + `html[data-theme="minimal"]` 오버라이드로 **두 테마 일관**(둥근/알약형). il-pin·시즌그룹은 itemRowHTML 재사용이라 자동 반영.
  - **검증:** JSC SYNTAX OK, 옛 함수 16개 호출 grep 확인(누락 0), 미리보기 양 테마·375px에서 가공비 토글(공임·워싱 편집 인풋)·배지→편집기·KC 0/2·메인중 ✎ 모두 동작 확인.
  - **교훈(사용자 강력 명시):** 디자인 변경 시 겉만 바꾸지 말 것. 기존 버튼·인풋·기능이 존재하는 이유를 코드로 먼저 확인하고, 옛→새 1:1 매핑표(누락0)를 만들어 확인받은 뒤 변경. (배지를 처음에 "표시만"으로 오판해 누락할 뻔함 → 코드 확인으로 바로잡음.)

- 2026-06-19: **★부자재(트림) 폼 재구조 — 전체 구현 완료 (위 2026-06-18 확정안의 실제 코드 반영).** 13개 타입 전부 새 카드로 전환·round-trip 검증·푸시.
  - **공용 카드 시스템:** 상태=`window._trimUI[trim.id]{open,tab}`, 조작=`trimToggleOpen/trimSetTab/trimDup`(복제), 적용탭 축선택=`trimApplyPane/trimAx`. **핵심 패턴: 4탭(기본/디테일/적용/옵션)을 전부 DOM에 렌더하되 비활성 탭은 CSS로 숨김** → `colTR()` 수집이 보존됨(탭 안 보여도 값 안 날아감). CSS는 `.tcd*` 클래스(`#pane-items` 스코프).
  - **타입별 카드 함수:** `zipperCardNew`·`trimCardNewGen`(롤/야드/실/개수/레이스/절/단추고리/봉지 8종 공용)·`buttonCardNew`·`biasCardNew`·`snapCardNew`(4면 grid+로고)·`labelShell`+`careLabelCardNew`+`mainLabelCardNew`(브랜드칩·완성부자재 체크=finishSel). `trimRowHTML`이 타입별로 분기해 호출(옛 블록은 `if(0){}` 죽은코드로 보존).
  - **타입 통합(확정 반영):** 봉지→단추고리 카드(단위 봉/봉지 입력), 레이스→롤 카드(레이스 체크), 절→롤(단위 절+÷30). 추가버튼 12→9개. colTR에 isLace/packUnit additive 수집. 기존 데이터 호환.
  - **3단계 개선 적용:** #8 기본 부자재처(`it.defaultTrimSup`→새 부자재 자동채움, 바이어스 제외) · #6 용어 자동(지퍼·단추·스냅 "요척"→"벌당개수") · #5 적용탭 단가 축선택(공통/컬러별/사이즈별/컬러×사이즈 토글, **표시만**—두 표 DOM 유지로 colTR·원가 불변) · 작지 부자재표(`tpTrimTableHTML`)에 로고/염색 칸(`tpLogoDyeStr`). 단가 미입력 빨강경고는 `trimHasPrice(t)`(sizeRates·슬라이더·로고 단가까지 고려)로 통일.
  - **안전:** 계산함수(calcTrimNeed·calcSups·genPoText)·data-f 필드명 불변 → 발주서·원가·단가장·결제 보존. 13개 타입 전부 lexical formTrims round-trip 검증(⚠️`window.formTrims`≠lexical `formTrims`라 반드시 lexical로 검증).

- 2026-06-19(2): **★발주서 카드 — 5버튼을 거래처명 옆 한 줄로 + 담당 제거(출고처만) (A안 적용).** 기존: 본문 아래 큰 버튼 5개 세로 쌓임(자리 낭비). 변경: 거래처명 줄(`po2-hd`)에 `.po2-acts`(복사·카톡·메일·문자·발송완료) + 삭제 버튼을 한 줄로. `po2-meta`는 **출고처만**(담당 제거).
  - **CSS:** `.po2-acts`(flex·gap)·`.po2-ab`(작은 버튼, 복사=파랑/카톡=노랑/발송완료=초록 색 유지). 모바일 `@media(max-width:600px){.po2-acts{width:100%;order:3} .po2-del{order:2;margin-left:auto}}` + `.po2-hd{flex-wrap:wrap}` → 폰에선 이름줄/버튼줄 자동 2줄. 출고처 select는 `white-space:nowrap;width:auto;min-width:90px`.
  - 본문·발주내용선택·계산식·거래처확인은 아래 그대로 유지.

- 2026-06-19(3): **★생산 대시보드 — 정렬 규칙 + 행 펼침 A2 매트릭스 + 입고 단계별 카드(D안).** (사용자 요청 3건)
  - **정렬 우선순위(확정):** ①출고 임박(출고예정일 가까운 순) → ②진행률 높은 순 → ③오더일 오래된 순. 헬퍼 `pdRowStages(r)`(단계 계산 추출)·`pdRowProgress(r)`(0~1). 정렬 전 `rows.forEach(r=>{r._prog=pdRowProgress(r);r._ord=toISO(r.o.createdAt)})` 후 comparator.
  - **A2 매트릭스(행 펼침 상세):** `renderProdDashRow` detail에 **오더›재단›출고** 인라인 매트릭스(컬러×사이즈). `pdCutCSGrid` 재사용, CSS `.pdc-mtx`/`.pdc-iv`. 요약(대시보드 셀)엔 재단도 포함.
  - **입고 단계별 카드(D안):** 원·부자재 입고 줄이 좌우로 길게 늘어지던 문제 → `prepCell`에 `card` 파라미터로 단계별 카드. CSS `.pdc-prep-cards`/`.prepcard`. **함정: 카드를 `.ptab.pc-body`로 감싸야** `#dash-body .ptab .prow{display:flex}` 컴포넌트 스타일이 먹어서 세로로 안 쌓임(처음에 카드가 `.ptab` 밖이라 세로로 쌓이는 버그 있었음).
