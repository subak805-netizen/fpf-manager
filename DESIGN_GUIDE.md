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

- 2026-06-21: **전체 메뉴(더보기) 시트 통일 — 아이콘 제거·텍스트 통일·그룹·하단배지·카드 얇게 (미리보기 mockup-mobile-menu.html 승인).** btabSheet/btabEdit 그리드를 `PD_NAVGROUPS`(생산/작업/기타=사이드바와 동일 구분)로 묶고 `<span class="i">`(아이콘) 제거→텍스트만. 하단탭에 있는 항목엔 `.badge`("하단", 기본 파랑/레트로 초록). `.bts-it` padding 11→9·min-height 38·아이콘 의존 제거로 카드 얇게. **PD_NAVTABS의 icon 필드·하단 탭바(renderBottomTabs)는 그대로**(시트만 정리). 검증: 그룹3·카드14·하단배지4·아이콘0, 편집모드 14카드·클릭 정상, 양테마, JSC SYNTAX OK. (옛 문제=일부만 ▦▤✓◇ 아이콘 붙어 들쭉날쭉.)

- 2026-06-22: **아이디어를 메인 네비로 꺼냄 + 네비 순서 재정렬 (사용자 요청).** 아이템 안 `#item-subtabs`(아이템목록/아이디어 토글) 제거 → 빈 div. 네비에 `nt-idea` 추가: `nt-items`=`setItemView('list')`, `nt-idea`=`setItemView('idea')` 둘 다 switchTab('items')(같은 pane). 같은 pane이라 switchTab·setItemView에 **`_itemView`로 nt-items/nt-idea 활성구분** 로직 추가. 네비 순서(사용자 지정): 아이템·아이디어·도식화 / 생산대시보드·오더·결제 / 단가장·참고·잔량·불량 / 할일판·할일·동선 / 업체·분석 (도식화는 사용자 목록에 없어 그룹1에 임시배치·확인필요). PD_NAVTABS도 idea 추가+동일 순서. 검증: 아이디어 클릭→보드+강조, 아이템→목록+강조, JSC SYNTAX OK.

- 2026-06-21: **모바일 정리 묶음 — 전체메뉴 단순화 / 하단탭 B / 대시보드 상단 정리 (사용자 피드백 반영).** ① 전체 메뉴 시트: 작은 글씨(헤더·그룹라벨·하단배지) 제거 → 평면 카드. ② 하단 탭바(renderBottomTabs): 아이콘 제거·텍스트만 + 활성 상단 액센트 바(B안). `window.activeTab`(let이라 undefined) 버그 → `activeTab`으로 고쳐 활성표시 복구. ③ **대시보드 상단(renderProdDash @~15068):** 통계박스 4개(진행아이템·긴급·컨펌임박·출고완료) 중 **사용자가 가끔 보는 긴급·출고완료만 작은 필터 칩(.pd-sf)으로 남기고** 나머지 제거(숫자 안 봄). 클릭=pdSetView 토글(다시 누르면 active 복귀, 필터 기능 보존). 뷰토글(.pd-vsw) `리스트/타임라인`을 세그먼트→**밑줄 탭(안3)**, ≣▭ 기호 제거. 브랜드필터 sticky top 70→0. 검증: 테스트오더 주입해 양테마·칩 필터 토글·오더카드 렌더 확인, JSC SYNTAX OK. (미리보기 mockup-dash-top/dash-toggle/bottom-tabs.html)

- 2026-06-21: **푸터·전체메뉴 레트로를 미리보기 픽셀룩으로 맞춤 (사용자 "미리보기 대로").** 처음 적용 때 iOS 스타일을 minimal에만 스코프하고 retro는 앱 기본 버튼을 둬서 미리보기(레트로 픽셀)와 어긋났음. 보완: **푸터** `html[data-theme=retro] body .hdr .btn.s`=2px 잉크보더+하드그림자·각짐, `#hdr-more-btn`=네온블루 픽셀, 연동 상태버튼은 보더리스 유지, `.hdr` border-top 점선→**실선**(나브와 한 박스로=얹어놓은 느낌 제거). **전체메뉴 시트** `html[data-theme=retro] .bts-it`=잉크보더+그림자·각짐, inbar=네온블루, sel=네온그린, 바꾸기버튼=paper2 픽셀. 검증: 데스크탑 푸터·모바일 시트 레트로 픽셀 일치, minimal은 iOS 유지(retro 스코프라 영향0), JSC SYNTAX OK. **교훈: 미리보기에 테마별 룩(특히 레트로 픽셀)이 있으면 적용 때 그 테마 스코프 CSS도 같이 넣어야 함 — 안 그러면 한 테마만 덜 고쳐짐.**

- 2026-06-21: **★사이드바 푸터(.hdr) 정돈 v2 — 좌측정렬 + 기본은 iOS 스타일 (미리보기 mockup-footer.html 승인 후 적용).** `.hdr-utils` HTML을 **상태 스트립(`.hu-status`=save-ind+연동)** / **기록 그룹(`.hu-record`=기록 라벨+세그먼트 `.hu-seg`[←↩↪]+새로고침)** / **설정·데이터 메뉴**로 재구성. **모든 id·onclick 보존**(save-ind·cloud-btn·btn-back/undo/redo·hdr-refresh-btn·hdr-more). 데스크탑(@min-width:761)만 v2 스타일 스코프: 상태 초록점(레트로=사각), 기본테마 iOS 버튼(`#ececed` 둥근·세그먼트 inset 디바이더·설정 둥근), 레트로는 기존 픽셀 그대로. **네비는 이미 좌측정렬**(.nav .ntab text-align:left). 모바일 상단바 영향 0(같은 .hdr이라 신중) — save·기록·↩↪·새로고침 숨김 유지, order로 `← 연동 설정` 자연순서. 검증: 데스크탑 양테마·모바일 상단바·요소7개 id 보존, JSC SYNTAX OK. (.hdr=데스크탑 푸터/모바일 상단바 이중레이아웃이라 둘 다 검증 필수.)

- 2026-06-21: **★진행 묶음 해제 — 생산대시보드·오더관리·결제관리·단가장·잔량을 메인 네비로 평탄화 (사용자 "목록에 꺼내줘").** ① 데스크탑 `.nav`: `nt-progress`(진행) 버튼 제거 → `nt-dash`·`nt-orders`·`nt-pay`·`nt-book`·`nt-leftover` 5개 추가(라벨 생산 대시보드/오더 관리/결제 관리/단가장/잔량). ② `#progress-subtabs` 바 HTML을 빈 div로(CSS·잔여참조 안전), switchTab의 묶음 처리 블록 제거 → **하이라이트는 기존 `nt-{탭}` 루프가 자동**(별도 코드 불필요). ③ 모바일 `PD_NAVTABS`: dash 라벨 '진행'→'대시보드', orders·pay·book·leftover 4개 추가(하단탭/더보기 목록에 노출). 부팅 기본 dash 유지. 검증: nt-progress·pt-* 잔여참조 0, 5탭 클릭→화면+강조+에러0, 모바일 PD_NAVTABS resolve·renderBottomTabs 정상, JSC SYNTAX OK. (메모리 [모바일≠웹]: 데스크탑 .nav + 모바일 PD_NAVTABS 둘 다 손봐야 함.)

- 2026-06-21: **진행 서브탭에서 샘플 대시보드·샘플 발주 제거 (사용자 요청).** `#progress-subtabs`에서 `pt-board`·`pt-sample` 버튼 2개만 삭제 → 진행 서브탭=생산 대시보드·오더 관리·결제 관리·단가장·잔량. **패널(pane-board/sample)·렌더함수·`goToSample`·할일 task→sample 링크는 그대로** 둬서 기능 안 끊김(샘플 발주는 할일 링크로 여전히 진입 가능). 하이라이트 로직(4775)은 `if(b)` 가드라 버튼 없어도 안전. switchTab('sample') 에러 0 확인.

- 2026-06-21: **★아이템 탭 상태칩 1줄화 + 최상단 정리 (모바일 가독성).**
  - **상태칩 1줄:** KC 추가로 칩5개가 2줄로 넘치던 것 → `.nc-st`에서 점(`nc-dot`) 제거 + 표시 라벨 축약(원가 미전달→원가, 촬영용→촬영). 토글/토스트용 풀네임·KC 카운트·색(빨강 대기/초록 완료)은 유지. 양 테마 375px 1줄. (점 제거가 결정타 — 라벨만 줄여선 안 됨, 목업 측정으로 확인.)
  - **최상단 4종 정리(사용자 "상단 겹침·복잡"):** ① **safe-area** — 모바일 `.hdr`에 `padding-top:calc(6px + env(safe-area-inset-top))` (viewport엔 이미 `viewport-fit=cover` 있었음) → 제목이 아이폰 상태바와 안 겹침. ② **헤더 슬림** — 새로고침 버튼(`#hdr-refresh-btn`)을 모바일 상단바에서 숨기고 `#hdr-more`(설정·데이터▾) 메뉴로 이동(기능 보존). ③ **브랜드칩 가로스크롤 1줄** — `#item-brand-pills` `flex-wrap:nowrap;overflow-x:auto;flex:1 1 100%` + 칩 `flex:0 0 auto`·스크롤바 숨김. ④ **검색+필터 한 줄** — 필터 토글 버튼을 리스트(il-bar) 안에서 정적 검색줄(`#item-filter-btn`)로 이동, `renderItemsList`가 그 버튼 라벨·적용수 배지를 DOM으로 갱신(패널 il-fwrap만 리스트에 남김).
  - **검증:** JSC SYNTAX OK, 모바일=상단바 슬림·칩 스크롤·검색+필터 한줄·새로고침 메뉴 안, 데스크탑=사이드바 헤더·새로고침 노출·카드 가로행 모두 정상(기능 누락 0). `.hdr`은 전 탭 공용이라 신중히 처리.

- 2026-06-21: **★앱 전체 이모지(픽토그램) 전면 제거 (사용자 명시 "이모지 다 없애고 싶다").** index.html 전역에서 픽토그램 이모지 122종·~2,600자 제거(📋✅🗑💡🚚📦💰🏭🧵🏷📍📝🔍📅🔄✏⚠ 등). **유지=기능 기호**: 화살표(→←↑↓↩↪), 체크/엑스(✓✔✕✗), 별(★☆), 박스선(─━└), 동그라미숫자(①②③), 기하도형(■□▲▾●), 체크박스(☐☑). **아이콘 전용 버튼 27개는 빈칸 대신 텍스트 라벨**(🗑→삭제·✎✏→수정·🔍→보기·🔀→병합·⚙→상세 옵션). 외부 전달 문서(거래명세서·발주서·작지)도 포함. 검증: 정적 픽토그램 0·onclick 834개 불변·빈버튼 7(원본동일·신규0)·JSC SYNTAX OK·7개 탭 런타임 픽토그램 0(✕ 같은 기능기호만 잔존). 방식=파이썬 일괄(공백정리 포함), 임시파일 빌드→검증→교체. **앞으로 새 UI에 이모지 금지.**

- 2026-06-20: **★아이템 리스트 카드 모바일 정리안 적용 (`itemRowHTML` 교체).** 모바일에서 버튼 ~10개가 뭉개지고 한눈에 안 들어오던 문제 해결. **방식: 겉(마크업/CSS)만 바꾸고 기능은 전부 보존** — 옛 함수 16개(tpOpen·showItemCost·showItemForm·dupItem·delItem·toggleItemStat·toggleCostSent·openKcModal·itemKcState·itemNeedsKc·setItemCost·itemLaborInline·itemBadgeHTML·itemStartDateHTML·itemStatusEditorHTML·COST_DEFS) 그대로 호출.
  - **새 카드 구조(`.nc-card`):** 헤더(시즌·품번·시작일date) → 배지줄(itemBadgeHTML 그대로=클릭 시 상태편집기) → 이름 → **스펙 한 줄(nowrap+말줄임, 정보항목 안 뺌·우선순위만)** → **상태 칩 한 줄(.nc-st)** → **가공비 토글(.nc-cost, 접힘 기본·편집 인풋 그대로)** → **액션바 3개(작지·원가·수정)+⋯(복제·삭제 .nc-more-row)**.
  - **상태 칩:** 작지(instrDone)·원가전달(costSent)·그래이딩(gradingDone)·**KC(itemNeedsKc=프루토만, openKcModal 컬러별)**·촬영용(photoReady). 색: **중요(작지·원가전달·KC)는 대기=빨강(warn)**, 그 외 대기=중립, 완료=연두(on). il-pin 우선순위 로직과 동일.
  - **CSS는 `.nc-*` 새 클래스**로 분리(렌더 시 STY에 주입) → 기존 `.im-*` 안 건드림. 레트로 기본 + `html[data-theme="minimal"]` 오버라이드로 **두 테마 일관**(둥근/알약형). il-pin·시즌그룹은 itemRowHTML 재사용이라 자동 반영.
  - **검증:** JSC SYNTAX OK, 옛 함수 16개 호출 grep 확인(누락 0), 미리보기 양 테마·375px에서 가공비 토글(공임·워싱 편집 인풋)·배지→편집기·KC 0/2·메인중 ✎ 모두 동작 확인.
  - **교훈(사용자 강력 명시):** 디자인 변경 시 겉만 바꾸지 말 것. 기존 버튼·인풋·기능이 존재하는 이유를 코드로 먼저 확인하고, 옛→새 1:1 매핑표(누락0)를 만들어 확인받은 뒤 변경. (배지를 처음에 "표시만"으로 오판해 누락할 뻔함 → 코드 확인으로 바로잡음.)
  - **반응형 추가(2026-06-21, 모바일≠웹):** 사용자가 "모바일은 좋은데 웹은 가로가 더 한눈에"라고 함. itemRowHTML 자식을 3그룹(`.nc-c1` 시즌·품번·시작일·배지 / `.nc-c2` 이름·스펙·칩 / `.nc-c3` 가공비·액션)으로 감싸고, **`@media(min-width:761px)`에서 `.nc-card`를 `grid 158px·1fr·auto` 가로 행으로** 전환(편집기는 `grid-column:1/-1` 풀폭). 모바일(<761)은 그대로 세로 카드(block). 마크업·함수 동일, CSS만 분기. 검증: 1280px 양 테마 가로 행·375px 세로 카드·JSC SYNTAX OK·기능 보존. (앱 기존 사이드바 분기 761px와 동일 경계.)

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
- 2026-06-22: **★원가계산서 — 요척 원가용 직접 수정 입력칸 + KG 단가 야드 환산.** (사용자 요청)
  - **요척 원가용 입력칸:** 단가 원가용(초록 알약)과 동일 패턴으로 계산식 칸에 `<input>` 추가 → `csSetOverride(id,'fab'|'trim',matId,값)`. 비우면 작지 요척, 입력시 그 값으로 원가. 활성=연두배경(#ecfdf5)+초록보더(#10b981)+"수정" 배지+작지 원래값 병기. renderCS 원단 셀(~19663)·부자재 셀(~19738).
  - **부자재 override 전 타입 통일:** 기존엔 실(thread)만 반영, 롤/야드/단추는 trimPure가 csQtyOvr를 안 읽어 무시됨. `_yf`(타입별 요척필드: thread=threadQty / roll·yard=consumptionPerPiece / 그외=qtyPerPiece)로 tEff 만들어 trimPure에 전달. 죽은코드 qs/ovrInput/trimOvr 제거.
  - **KG 단가 야드 환산:** kg단가 원단은 단가칸에 `= round(effPrice/yardsPerKg)/y 환산` 파란 줄 추가(표시만).
  - **함정:** 요척을 읽는 곳이 6+군데 복붙이라 표시·계산이 어긋났던 이력(단추 요척 버그, 12225/12269). 원가 셀은 cp.ty(실제 쓰는 값)를 표시하도록 정직화. **금액 계산식 자체는 불변.** 미리보기 수치검증 필수.
- 2026-06-22(2): **케어라벨 제조국/시장 선택 + 발주서 출력.** (사용자 요청)
  - 폼: `careLabelCardNew`(@8408) 제조 연월 셀렉트 옆에 `<select data-f="madeIn">` (표시 안 함/메이드인 코리아=KR/메이드인 차이나=CN/미국용=US, 기본='').
  - 출력=**한글**, 미국용은 별도 한 줄. 발주서 `genPoText` 케어라벨 블록(@제조연월 뒤)에 `{KR:'메이드인 코리아',CN:'메이드인 차이나',US:'미국용'}[cl.madeIn]` 한 줄(manufactureYM='none'이어도 독립 출력).
  - 연결 6곳: 폼·수집(colTR @careLabel분기)·기본값(newRow/타입변환 @9381/9426)·자재전달(calcSups material push, manufactureYM 옆)·발주출력·단가장(saveToPB @5076 / autofill 고정필드배열). **케어라벨만**(메인라벨 미적용). 계산 불변.
- 2026-06-22(3): **컬러칩 드래그 순서변경 + 컬러 톤 세분화.**
  - 순서변경: `renderColorChips` 칩에 `onpointerdown="colorDragStart"` + `touch-action:none` (포인터 이벤트=터치+마우스). colorDragMove가 elementFromPoint로 대상칩 찾아 formColors splice 재배열·재렌더. 탭=renameColor 유지(드래그 직후 `_colDragEnd` 타임스탬프로 클릭 억제). HTML5 draggable은 iOS 터치 미지원이라 안 씀.
  - 컬러 톤: `colorToHex`가 매칭된 색이름 **뒤(나머지) 접두어**로 톤 판별 — 연/라이트/파스텔/옅=`_shadeC light`, 진/짙/딥/다크=dark, 형광/네온=neon(HSL 채도↑). 기존 색이름(연두 등)은 키워드 자체매칭이라 영향X. 라임을 연두에서 분리(#c5e21a), 골드·실버 추가. **스와치는 colorToHex 사용**(tpColorHex 아님 — 두 맵 불일치 주의).
- 2026-06-22(4): **작업지시서 완성·포장·검품 3탭 분리 + 편집형 리스트.** (사용자 확정, mockup `mockups/instruction-split.html`)
  - 탭: 지시서·샘플패턴·**완성(pack)·포장(pack2)·검품(insp)**·(자수/나염…). PROC/_validTabs/tabs/doc.innerHTML(tpRender ~27780~27914)에 pack2·insp 추가.
  - **완성(pack)**: 앞/뒤 사진 + 완성작업 편집리스트(워싱·시야게·나나인치·단추·스냅·마도메·바텍·큐큐) + 출고수량 + 메모. (기존 택SET·완성부자재사진·포장은 이동/제거)
  - **포장(pack2)**: 포장·접는법 사진 + 택/부자재 실물사진(finTbl) + 포장사양(폴리백·접는법·옷걸이·택부착위치·**사이즈스티커·바코드스티커=텍스트**) + 박스정보 + 출고수량.
  - **검품(insp)**: 검사항목 편집리스트(사이즈스펙·꼬임·봉탈·원단불량·실밥·부자재) + 합격기준 + tpSpecSecHTML 치수표 + 검사대상수량 + 검사결과란. (라벨위치 사진 없음)
  - **편집형 리스트 공용**: `tpEditList(path,defs,opts)` + `tpRowsEnsure/Add/Del/Set/Toggle/Move` + 포인터 드래그 `tpRowDragStart/Move/End`(drop시 elementFromPoint로 대상행→tpRowMove). 데이터 d.pack.ops / d.insp.checks = [{name,on,detail}]. CSS=#tp-modal .tp-elist/.tp-li/.tp-lck/.tp-lx/.tp-ladd/.tp-drag.
  - ⚠️ 검품지시서(뭘 검사)≠검사신청서(언제·몇 개 신청, 대시보드 INS폼). 별개.

- 2026-06-27: **★오더수량 배수 계산기에 「원단 배분」 탭 추가 (신규).** 기존 인라인 `.ocalc` 계산기(오더 생성 옆 `수량계산` 버튼, `ocalcToggle`)에 탭 2개 신설: `수량 계산`(기존 그대로) | `원단 배분`(신규).
  - **원단 배분 = 마카 기반 계산**: 총 원단(yd) → 아이템별 사이즈별 요척·마카비율 → 마카당yd=Σ(요척×비율), 마카회수=floor(배정yd÷마카당), 사이즈별 장수=마카×비율, 사용/잔여/남은원단. 아이템 고르면 **요척 자동**(첫=메인 원단 `fabrics[0].consumption`, 사이즈별이면 `consumptionBySize[sz]`, 없으면 base 폴백·원단 없으면 0), 마카비율 기본 1.
  - **자동 배분**: 한 아이템만 `자동` 토글 → 배정yd=총원단−나머지수동합. 여러 아이템 가능, 각자 마카 자투리만큼 자체 손실.
  - **★과배정 경고(안전)**: 배정 합 > 총원단이면 "원단 부족 Nyd" 빨강(`hint bad`). (음수 남은원단을 "완전 소진"으로 잘못 표시하던 것 방지 — 재단 사고 예방.)
  - **구현**: HTML=`.oc-tabs`+`#oc-tab-qty`(기존 감쌈)+`#oc-tab-fab`(신규). CSS=`.ocalc .oc-tabs/.oc-tab/.fa-*`(토큰 사용 → 레트로·미니멀 자동). JS=`ocalcSwitchTab`+`fa*` 함수(faBuildItemList/faResolveItem/faAddItem/faCalcItem/faRecalc/faRenderCard/...). 결과는 기존 `.rtot`(검은바)+`.rchip`(초록칩) **수량계산기 컴포넌트 재사용**. 검색은 별도 `_faItemMap`.
  - **안전**: 기존 수량계산 함수·DOM id 전부 불변(바깥만 탭 래핑). **읽기전용 헬퍼 — 오더·발주·원가·돈에 쓰기 0**(faItems는 메모리만, 영속 안 함). 계산 로직 JSC 18케이스 + 실앱 스모크(탭전환·요척자동·150yd→100마카·과배정경고) 통과. 시안=mockup-fabric-alloc-v2(수량계산기처럼 정리, /tmp/fpf-preview).

- 2026-06-27(2): **원단 배분 탭에 「계산 수량을 오더에 적용」 버튼 추가.** `faApply()` — 각 아이템 카드에 **컬러 선택칸**(`fa-col-<id>`, 아이템 colors), 푸터에 적용 버튼(`fa-apply-btn`, 아이템 있을 때만 표시). 누르면 고른 컬러칸에 마카 계산 사이즈별 장수를 채움. **기존 `ocalcFill`과 동일 안전 패턴**: `_ncQtyCache['q_'+itemId+'_'+encodeURIComponent(color)+'_'+size]`+`_ncChecked` 채우고 `renderOrderNewItems()` 재렌더 → **오더 폼 미리채우기만, "오더 생성" 눌러야 확정**(데이터 즉시 쓰기 0). 여러 아이템 일괄 적용, 고른 컬러에만(다른 컬러 0 유지). 사용자 선택="적용 전 컬러 고르기". 실앱 스모크 검증(90yd→블랙 60/60/60·아이 0/0/0).

- 2026-06-27(3): **★부자재 카드 재설계 — 1단계: 단추 카드.** (시안 v7+A안, 단계별 적용 시작) 단추(buttonCardNew)만 새 레이아웃: ①스타일(buttonStyle)→기본 탭(부자재명 옆) ②단추 디테일 탭 삭제 ③가로 계산바(`.tcd-calcbar`, 로스칸 제거 — 로스는 발주서에서만) ④로고(hasButtonLogo/buttonLogoText)→기본 탭 하단 박스. **안전: colTR 단추 분기 buffer 가드**(`if(g('buffer')!=null)` — 로스칸 없어도 저장 buffer 0으로 안 덮음). 계산함수(calcTrimNeed/calcSups/genPoText) 변경 0(git diff 확인). round-trip 실앱 검증(스타일/로고/qty/단가 보존·buffer=7 유지). **다음 단계**: 가공비→「가공·염색」 탭 이동 + A안 적용컬러 생지/염색 토글(공유함수 trimApplyPane/colorSec·가공비footer 손대는 cross-cutting이라 별도 검증) → 그담 지퍼·스냅·롤 등 나머지 타입.

- 2026-06-27(4): **★부자재 카드 재설계 — 2단계: 가공비→탭 + 생지/염색 토글 (단추).** #1·#2. **#1 가공비→「가공·염색」 탭(단추)**: buttonCardNew에 `data-pane="cost"` 탭(`inlineTrimCostsHTML(t)`+＋가공비 버튼) 신설, 탭에 가공비 개수 배지(`.tcd-tabcnt`). 중복 방지: renderTrimRows에서 `x.t.orderType==='button'`이면 외부 `inlineTrimCostsHTML` 생략, 글로벌 ＋가공비 footer 래퍼도 button이면 early-return. **#2 생지/염색 명확화**: mkColorSec 컬러 행의 염색 버튼이 상태 보이게 — 켜짐=`염색`(보라), 꺼짐=`생지`(회색)로 라벨/색 전환(onClrDye·colorLinks.dye 데이터 불변). **검증**: 계산함수 변경0, 실앱 round-trip — 가공비 탭 안 1개만(카드밖 중복0·옛footer0), 탭 숨겨도 colTrimCosts 수집 유지, 생지/염색 라벨. **남음(3단계)**: 지퍼·스냅·롤·야드·라벨 등 나머지 타입에 1·2단계 골격(가공탭·생지염색은 이미 공유 mkColorSec라 적용탭 자동 반영, 가공탭은 각 카드함수에 추가 필요).

- 2026-06-27(5): **★가공·염색 탭 v8 단순화 + 염색비 색수=적용탭 염색 컬러 (돈 변경, 사용자 승인).** 가공비 줄에 반복되던 적용 컬러 리스트(생지/염색/스와치) 제거 → **참조 박스**("적용 컬러 탭에서 염색 켠 N색에 자동 적용")만. **컬러별 가공비 원가 색수 = 연결 부자재 적용탭에서 '염색' 켠 컬러 수**(생지 제외). 신규 `tcEffColors(tc,trims,allColors)` — **3단계 폴백으로 구데이터 보존**: ①부자재 적용탭 염색컬러 ②가공비 자체 염색컬러 ③가공비 선택컬러 전체(기존). **개당(로고비)·한번에는 불변**(컬러별만 변경). 적용 3곳: `_tcPer`(표시칩)·`trimCostPerPcs`(원가)·원가계산서/명세서 상세(out.push perLot). **검증**: JSC 4시나리오(새규칙 1700·폴백1133·**기존보존 2267불변**·기타가공비) + 실앱 trimCostPerPcs(신규1700/구데이터2267) + UI 참조박스·옛 컬러리스트 제거. trimCostRowHTML perLot의 mkColorSec 호출 제거. ⚠️기존 아이템 중 부자재 적용탭에 염색 토글한 게 있으면 그 가공비 원가가 생지 제외로 줄 수 있음(의도된 정확화).

- 2026-06-27(6): **★부자재 카드 재설계 3단계 — 배치1: 공유 헬퍼 + 지퍼.** 가공탭 마이그레이션을 타입별 안전하게: `_TRIM_COST_TAB_TYPES={button,zipper}`(목록) + `_trimHasCostTab(t)` + `trimCostTabBtn(i,t,Tf)`/`trimCostTabPane(i,t,Tf)` 공유 헬퍼. 렌더 4곳(renderTrimRows basics/labels + 또다른 렌더 basics/labels)의 외부 `inlineTrimCostsHTML`·footer 래퍼를 `_trimHasCostTab`로 게이트(목록 타입만 생략 → 미마이그레이션 타입은 기존 외부박스 유지). **지퍼**(zipperCardNew): 탭에 가공·염색 추가(trimCostTabBtn)·계산박스→가로 계산바(`.tcd-calcbar`, 로스칸 제거)·가공 패널(trimCostTabPane)·colTR 지퍼 분기 buffer 가드. 검증: JSC OK·계산함수0·실앱 round-trip(탭/로스없음/계산바/가공비 탭내 1개·중복0·옛footer0·buffer=7보존). **다음 배치**: 스냅·trimCardNewGen(롤/야드/실/개수/레이스/절/단추고리/봉지 8종)·바이어스·라벨(각 카드함수에 동일 3편집 + colTR buffer 가드 + 목록 추가).

- 2026-06-27(7): **★부자재 카드 재설계 3단계 완료 — 14개 타입 전부.** 배치2~4로 나머지 타입에 골격 적용. **배치2**: 스냅·바이어스(가공·염색 탭+계산바). **배치3**: trimCardNewGen(롤/야드/실/개수/레이스/절/단추고리/봉지 8종) — 계산부 thread/비thread 둘 다 ch→`<span>`·계산박스→`.tcd-calcbar`(로스칸 제거, conv "로스는 발주서"). colTR 전 buffer 수집을 `if(g('buffer')!=null)`로 통일(idempotent, 미마이그레이션 무관). **배치4(라벨)**: 케어/메인라벨은 labelShell=단일패널(탭 없음)이라 카드 맨아래 **인라인 「가공·염색」 섹션**(inlineTrimCostsHTML+＋가공비) 추가, 계산바 해당없음(라벨은 unitPrice/qtyPerPiece 인라인·로스 미사용). `_TRIM_COST_TAB_TYPES`에 전 14타입(button/zipper/snap/bias/roll/yard/thread/count/careLabel/mainLabel) 등록 → 외부 가공비 박스·footer 전부 생략. **검증**: 매 배치 JSC OK·계산함수0·실앱 round-trip(buffer 보존·가공비 중복0·colTrimCosts 수집). 전 타입 가공·염색 카드 안으로 이동 완료, 발주/원가 숫자 불변.

- 2026-07-01: **★작지 자수 위치표 개선 + 봉제 지시서 연동.** ①**tpPosHTML 재구조**(자수/나염 공용): 기존 「위치(기준점)·크기」 2줄 고정 → `posRows=[{label,seam('out'/'in'),tol,vals:{size}}]` 배열. 컬럼 순서 **항목(라벨 직접입력 tpInpL) | 기준(시접빼고/시접포함 토글 `tp-seam`, out=초록/in=노랑) | 편차(맨 앞, `.d`) | 사이즈들 | ×삭제**. `＋항목`(tpAddRow)·×(tpDelRow)은 `tp-editonly`(인쇄 숨김), 값·기준·편차는 인쇄됨. 기존 `pos`/`size` 객체는 첫 두 줄 vals로 **1회 자동 이관**(Object.assign 복사, 첫 편집 시 저장). 신규 `tpPosSeam(pfx,ri)` 토글. ②**연동①(치수 밑 자수 위치·크기)**: `tpEmbSpecLinkHTML(it)`를 `tpSpecSecHTML` 끝에 append → 치수표 있는 4패널(cut/sew/cs/spat) 전부 밑에 **읽기전용 보라 블록**. 게이트=**값이 실제 있는 행만**(`vals` 비어있으면 안 뜸 — 기본 라벨만 이관된 케이스 방지). posRows 없으면 옛 pos/size 폴백. ③**연동②(스와치 위 자수실컬러)**: `tpSwatchAttachHTML`가 `tpItem().techpack.emb.color`를 읽어 헤더행-이미지행 사이에 `tp-thread` 행 삽입(컬러별 「자수실 …」). 자수실 하나도 없으면 행 자체 생략. **자수 없으면 ①②다 안 떠서 기존 지시서와 100% 동일.** CSS `#tp-modal .tp-wrap` 스코프에 `.tp-seam`/`.tp-rx`/`.tp-emblink`/`.tp-seamtag`/`.tp-thread` 추가. 발주/원가 숫자 무관(작지 표시 전용). 검증: JSC SYNTAX OK + 로직 단위테스트 7종(이관·값필터·빈값숨김·시접토글·자수실 유무일부). ⚠️ preview 서버(8756=404, 8757=url무시)로 라이브 브라우저 렌더 스모크는 막힘 → 정적검증으로 대체. ⚠️ **나염 위치표도 tpPosHTML 공용이라 같이 바뀜**(연동은 자수만).

- 2026-07-01(2): **★추가발주 수량단위 버그픽스 + 추가분 로스 따로 설정.** ①**버그**: `setPoTrimRound`이 `S.orders[oid]`만 조회 → 추가발주(가상오더 `_poExtraOrders`)를 못 찾고 조용히 return. `poResolveOrder`(chips 핸들러와 동일 리졸버)로 교체. ②**추가분 로스**(신규): 추가발주는 calcSups 주문매칭 실패로 지금껏 자재 기본 buffer만 먹었음. `ex.loss`(첫발주 `o.loss`와 동일 형식) 추가. **calcSups(items,{lossMap})** 옵션 — `_effLoss`·표시용 `_lp`·라벨 `orderLabelBuffer` **3곳 모두** lossMap 우선(없으면 기존 `_co.loss` → **첫 발주 계산 100% 불변**, 정적 등가증명). `ensureExLoss`=첫 생성 시 첫발주 로스 **깊은복사(독립)**. UI=추가발주 카드 **자재 표 위** 로스/여분 패널(`exLossPanelHTML`, 첫발주와 동일 `.lp-*` UI 재사용) + `setExLoss(Mode/Val)`(리졸버 `_exFind`). genPoText·자재표 모두 prebuilt `ex.suppliers` 사용해 일치. 검증: JSC OK + 복사독립성·인코딩 round-trip. ⚠️ 로스=발주 수량 직결이라 첫발주 경로는 절대 안 건드림(lossMap 없으면 pass-through).

- 2026-07-01(3): **★요척 정리 독립 탭 신설.** 아이템 카드의 「요척」 버튼(그 아이템만)과 별도로, 전 아이템 요척을 한눈에 보는 **메인 네비 독립 탭 「요척」**(서브탭 아님). 4곳: 네비버튼 `nt-yocheok`(아이템/아이디어 옆) + `pane-yocheok` + switchTab 숨김배열·디스패치(`renderYocheokTab`) + 함수. **renderYocheokTab**: `Object.values(S.items)` 순회 → 기존 `yocheokHistory(id)` 재사용 → 아이템 카드마다 원단×컬러별 `계획→실제(wAvg)` + 배지. **배지=`_yoStat`**(계획 대비 `_YO_TH=0.15`=±15%: over 과다/under 여유/ok 정상/na 참고) · 재단기록 없고 발주·원단 있으면 `wait 대기`. 상단 요약(집계·과다·여유·재단대기 4메트릭) + 필터칩(전체/이상만/재단대기, `yoSetFilter`) + 검색(`yoFilterDom` DOM show/hide로 포커스 유지·재렌더 안 함, `data-yo-search`/`data-yo-over`/`data-yo-wait` 속성). 정렬=과다 큰 순→대기 맨뒤. 스타일 `#yocheok-body` 스코프 레트로(2px ink+그림자·보라 실제요척). **읽기전용·계획요척 불변·발주/원가 영향 0.** 아이템 「요척」 버튼은 유지(둘 다). 검증: JSC OK + 배지 7종. 상세=[[project_fpf_yocheok]].

- 2026-07-01(4): **★재단 수량 계산기 독립 탭 + 요척 탭 브랜드그룹·행상세.** ①**재단 수량 계산기**(불량관리 아래 독립 탭, 기존 `재단계산기.html` 이식): 부위별 재단 장수 입력 → **생산가능=부위 min**(한 벌엔 모든 부위 필요)·부족/남는 부위·목표 대비 충족/부족·컬러소계·합계. 전 함수 **`jd` 접두사**(충돌0), 상태 `window._jd`(부위/사이즈/컬러), 재단장수=입력칸(DOM). `renderJaedanCalc`는 최초 1회만 셸 생성(입력값 보존, 재렌더 안 함). **저장 안 함·발주/원가 무관 스크래치**. 4곳 배선(nt-jaedan/pane-jaedan/switchTab/함수), CSS `#jaedan-body` 스코프. ②**요척 탭**: 브랜드별 그룹(`byBrand`, 헤더=아이템수·과다수, `yoFilterDom`이 빈 그룹 숨김) + 행 메타 상세(`컬러·오더 N장·실발주 My(계획 Ky)·재단 K장`, `yocheokHistory`에 `sumOrdQty` 수집 추가—기존 필드 불변). ③요척 탭 위치 결제관리 아래로 이동. 검증: JSC OK + 계산/배지/메타 시나리오 일치.

- 2026-07-01(5): **★결제 3종 + 운임모달 샘플비 + 요척 3자리/브랜드필터.** 
①**운임·택배 모달 「+ 샘플비」** 버튼(addPayFee 프리셋, 15832 옆). 
②**요척 탭 3자리**(_yoR3=×1000/1000, 0.07→0.075) + **브랜드 필터 버튼**(yoSetBrand·data-yo-brand·yoFilterDom 브랜드필터) + 과다/여유 뜻 note 명확화. yocheokHistory에 sumOrdQty(오더장수) 수집·행 메타 상세(오더N장·실발주My(계획Ky)·재단K장). 
③**결제 수동 완료(A)**: allPaid여도 자동 이동 안 함 → 카드 '완료로 보내기'/'되돌리기', `o.payArchivedItems[itemId]`, 필터 allPaid→archived, payArchiveItem/payUnarchiveItem. 마이그레이션=현재 결제완료 오더 1회 완료고정. 
④**추천요척 정밀(C)**: 「추천요척 적용」이 _yoR2(2자리) 반올림 후 ×장수 → 작은요척 왜곡(0.075→0.08). yocheokRecFor 정밀값으로 야드계산(0.075×100=7.5), 표시 3자리. 
⑤**★오더별 공장 스냅샷(B)** — 리오더 결제 꼬임 해결. `o.fcMap[itemId][fk]`=오더 생성시점 공장 고정. **`orderFc(o,it,fk)`**(스냅샷 우선·hasOwnProperty로 빈값도 존중·없으면 아이템 현재값 폴백)+`snapshotOrderFc(o)`. 마이그레이션=기존 전 오더 1회 스냅샷(멱등). createOrder·autoAssignFactories에서 스냅샷. **귀속 7곳** it[fk]/it.sewingFcId→orderFc: 스케줄생성(autoAssignFactories·renderProdTab)·결제카드(_payFcSet·targetFcId, renderItemPay·거래명세서 함수)·대시보드(renderDashCard)·트랙싱크(syncFcToTrack). **아이템 공장 바꿔도 옛 오더 결제/명세서 불변**. 돈 액수 불변·공장 귀속만 오더 기준. 검증 JSC 시나리오 전부 일치. ⚠️ 이 영역(비용→공장 귀속) 손대기 전 orderFc 통해야 함.

- 2026-08-07: **원부자재 「무게(그람수·온즈)」 칸 추가.** 원단 카드 = 폭(인치) 뒤, 부자재 카드 7종(지퍼/일반/스냅/케어라벨/메인라벨/단추/바이어스) = 크기·규격(라벨은 부위) 뒤에 `무게 (g/㎡)` + `온즈 (oz)` 두 칸. 공통 빌더 **`wgFabFlds(f)` / `wgTrimFlds(t)`** 하나만 고치면 전 카드 반영. **자동 환산 `onWeightIn(el,kind)`** — 한쪽 적으면 다른 쪽 자동(1 oz/yd²=33.906 g/㎡, `WG_OZ`), **빈칸일 때만** 채워 직접 적은 값은 안 덮음. 저장 = `f/t.weightGsm·weightOz` → colFR/colTR 수집 → **단가장(saveToPB·pbRegisterFormMat) 저장** → `autofillFab`(`_wgFill`, 단가장·같은원단처·이름DB 3경로)·`autofillTrim`(고정필드 루프) 자동완성 → 단가장 상세패널에 **무게 섹션**(원단·전 부자재 공통, `_pbdF`). **적어두는 스펙일 뿐 발주·원가 계산엔 안 씀**(calc-check 57 통과). 작지·발주서 출력은 미연결(요청 시 추가). 시안=`mockup-material-weight.html`.

- 2026-08-07(2): **아이템 폼 자동저장 확대 + 「자동 저장됨」 표시.** 기존엔 **수정 중인 아이템만** 2.5초 디바운스 자동저장(`_itemAutoSaveArm`, `#ipf`의 input/change → `saveItemForm({silent:true})`)이었고 **새 아이템은 임시저장(localStorage draft)만** — 사용자가 "저장 안 눌러도 저장되게" 요청(2026-08-07). ①`fire`/`sched`의 `if(!editItemId)return` 제거 → **새 아이템도 자동 등록**(아이템명 비면 `saveItemForm`이 조용히 건너뛰므로 빈 아이템 안 생김, 등록되면 `editItemId` 세팅 + 제목 '아이템 수정'으로 + `clearDraft()`). ②**품번 중복 시 자동저장이 조용히 return 하던 것 제거** — 그동안 적은 내용이 통째로 저장 안 되던 유실 경로(혼용률 미달 때와 같은 유형, 2026-07-20 전례). 이제 자동저장은 저장하고 확인창은 수동 저장에서만, 표시에 `· 품번 중복(아이템명)` 부기. ③**표시** `_itemSavedInd()`가 `#draft-ind`(임시저장 표시 자리 재사용)에 `자동 저장됨 HH:MM`. ④**발주 동기화 안내(`notifyOrdersAffectedByItemChange`=confirm)는 자동저장 중엔 못 띄우므로 폼 닫을 때 1회로 미룸** — `window._itemDirty`(showItemForm에서 false, sched에서 true, 수동저장·안내 후 false)로 중복 방지. 검증: 실코드 추출 하네스 브라우저 실측 14종(새아이템 자동등록·디바운스 1회·폼 닫힘 시 미저장·change 이벤트·닫기 직후 저장·안내 1회·중복저장 없음) 전부 통과, calc 57 통과.

- 2026-08-10: **단가장(원단·부자재) 레트로 적용 + 표 가독성.** 업체관리(`#pane-vendors`)와 **같은 규칙**을 `html[data-theme="retro"] #pane-book`에 그대로: 거래처 카드 2.5px ink·각진·오프셋 그림자 / 거래처 이름줄 **카키 #6B7A3F + 흰 글씨**(브랜드관리 헤더와 동일) / 버튼 각진 ink+눌림 / 표 2px 각진 격자·머리줄 크림 #EFE8D4·홀짝 줄무늬 #FBF8EF / 강조칸 레트로 팔레트(크기·규격·롤당yard=#EAF3F8, 혼용률=#E8F6EE, 종류=#FBF8EF, **인라인 배경을 이겨야 해서 !important**). **표 가독성(테마 공통)**: `renderBookList` th/td에 칼럼 클래스(`c-name/c-color/c-type/c-kind/c-spec/c-roll/c-comp`) 부여 → CSS로 최소폭 지정. **품목 이름은 `<input>`→`<textarea class="pb-nm">`**(13px/700, 길면 자동 줄바꿈, `pbFitNm`/`pbFitAllNm`이 높이 맞춤, Enter=줄바꿈 대신 blur→저장, 저장 시 개행은 공백으로). **유형·종류 드롭다운이 「밴⊾」처럼 끊기던 문제** → `c-type` 92px·`c-kind` 96px 최소폭 + select `width:100%`. 표 `min-width:1020px`라 좁은 화면은 카드 안에서 가로 스크롤. 검증: 실제 마크업+실 CSS 하네스 브라우저 실측 9종(드롭다운 글자 여유·긴 이름 2줄·카키 헤더·각진 격자·강조칸 색) 통과. `css/main.css?v=20260810a`로 캐시 갱신.

- 2026-08-10(2): **생산 대시보드 「수선중」 → 불량 관리 자동 연동 + 통합 명세서 묶어보기 전환.** ①**수선→불량**: 출고 모달 수선 바에 유형 칩(`PD_REPAIR_TYPES` 오염/봉제/원단/부자재/기타, `pdSetRepairType`, hidden `#pd-grid-repairtype`) → `rec.repairType`. 저장 끝에 **`pdSyncRepairDefects(oid,fcId,itemId)`** — 그 공장 shipments 중 `repair`인 것을 **날짜+컬러로 묶어(사이즈 합산)** `S.defectRecs`에 upsert. **고정 id `_pdDfId`=`dfs_{oid}~{fcId}~{itemId}~{date}~{color}`**(encodeURIComponent)라 여러 번 저장해도 안 늘어남. 없어진 회차는 **`_arrDelWhere`로 묘비 남기고 제거**(다기기 부활 방지). 출고가 주인인 칸(date/qty/color/from/repair/itemName/code/brandId)만 갱신하고 **사용자가 불량 탭에서 적은 memo·returned·to는 보존**, type은 '기타'일 때만 덮음. 손으로 만든 기록(id가 `dfs_` 아님)은 무시. 불량 표에 `출고연동` 배지(`.df-shipbg`)+행 배경(`tr.df-ship`), `dfRecDel`은 `dfs_` id면 "다시 생긴다" 안내. `migrateData`에서 기존 수선 회차 1회 소급(멱등이라 매 부팅 재실행돼도 안전). 검증 하네스 19종 통과. ②**통합 명세서**(`ipBuildGroupReceipt(fcId,brandId,items,mode)`): `mode='date'`(기본, 기존 모양) / `'item'`(아이템명→날짜 정렬, 반복 아이템명 숨김, 소계 라벨 「아이템 소계」). 모달 상단 전환 버튼 `ipSetRcMode`(`window._ipRcMode`). **금액·부가세·총합계 계산은 완전히 동일** — 묶는 방식만 다름(하네스로 합계 일치 확인). 검증 9종 통과, calc 57 통과.

- 2026-08-10(3): **현금결제 공장 = 부가세 없음.** ①**공장 설정**(`fc-modal`)에 「현금결제 (부가세 없음)」 체크 → `fc.noVat`. `saveFc`가 켜짐/꺼짐이 바뀐 순간 **그 공장의 스케줄 중 `sch.paymentSent`가 아닌 것만** `vatRate=0/10`으로 써준다(**결제 끝난 과거 건은 불변** — 사용자 결정). 몇 건 바뀌고 몇 건 남겼는지 토스트로 알림. ②**새 스케줄**: `mkFcSch(fcId)`가 인자를 받아 `noVat`면 `vatRate:0`으로 생성(호출부 11곳 전부 fcId 전달). ③**건별 예외**: 결제 카드 부가세 줄에 `payToggleVat(oid,fcId)` 버튼(「VAT 빼기」/「현금 · VAT 없음」) — 그 오더·그 공장의 `vatRate`만 0↔10. 결제 완료 건은 확인창. 최종 합계 배지도 0%면 「현금 · VAT 없음」. **⚠️ 설계 원칙: 계산·명세서는 예전처럼 `sch.vatRate` 하나만 읽는다 — 새 계산 경로(리졸버)를 만들지 않아서 결제·명세서·카톡·원가 어디도 안 건드림.** 검증: 하네스 15종(미결제만 적용·결제완료 보호·다른 공장 무영향·새 스케줄 기본값·건별 토글·금액식) 통과, calc 57 통과.

- 2026-08-10(4): **★현금결제 0%가 안 먹던 진짜 원인 = `sch.vatRate||10`.** 부가세율을 읽는 코드가 앱 전체에 **13곳** 있었고 전부 `||10` 이라, **0%를 넣으면 거짓값이라 다시 10%로 되돌아갔다**(공장 설정을 켜도 결제·명세서에 그대로 VAT가 붙던 이유). → **`vatOf(sch)` 헬퍼 신규**(`v==null||v===''` 일 때만 10, 그 외엔 `+v`) + 13곳 전부 교체(오더상세 부가세율칸 2·결제 카드 4·명세서·분석 2·통합명세서 등). **앞으로 부가세율은 반드시 `vatOf()`로 읽을 것 — `||10` 금지.** 추가로 `ipBuildGroupReceipt`는 **하드코딩 `const vatRate=10`** 이었음 → 현금결제 공장이면 0, 아니면 그 명세서에 들어간 스케줄 값을 읽도록 교체. 결제 카드(브랜드별 보기 `.ip-fc`)에 **「VAT 빼기 (현금결제)」 버튼**(`.ip-vatbtn`, `payToggleVat`) 추가 — 앞서 넣은 토글은 상세 표 뷰에만 있어서 사용자가 못 찾았음. 청구줄 표기도 0%면 「현금 · VAT 없음」. 검증: `vatOf` 10종(0·'0'·null·빈값·미설정) + 금액식(130,500 → 125,000) 통과, calc 57 통과. `css/main.css?v=20260810d`.

- 2026-08-10(5): **레퍼런스 사진 업로드 체감속도 개선(측정치 포함).** `refAddImage`가 **2400px·q0.92**로 줄이고 `tpCompress`가 **항상 `toDataURL`까지** 돌려(안 쓰는데도) 큰 파일을 올리고 있었음. 변경: ①**1600px·q0.86**(A4 가로 카드 인쇄엔 충분) ②`tpCompress(file,maxDim,q,png,skipDataUrl)` — Storage로 올릴 땐 base64 생략 ③`createImageBitmap(file,{resizeWidth})`로 디코딩하며 축소(미지원 시 옵션없이 → 옛 FileReader 순 폴백) ④`tpUpload(...,onProg)`가 `state_changed`로 **퍼센트 표시** ⑤사진 고른 즉시 `URL.createObjectURL`로 **화면에 먼저 보여주고**(저장 안 함) 업로드 끝나면 실제 URL로 교체·revoke. **측정(4000×3000 합성사진, 크롬)**: 줄이는 시간 **1145ms → 1176ms(변화 없음 — 원본 JPEG 디코딩이 대부분이라 못 줄임)**, **올릴 파일 683KB → 284KB(2.4배 작음)** → 업로드 2Mbps 기준 3.8초→2.3초. 즉 **실제 이득은 파일 크기·즉시 미리보기·진행률**이고 압축 자체는 그대로임(과장 금지). 결과 해상도 1600×1200 확인.

- 2026-08-11: **레퍼런스 카드 = 한 줄에 하나(기본) + 「1열/2열」 토글.** 2열이라 카드가 좁아 사진이 작게 보이던 것 → 기본을 **1열**로 바꾸고 좌우 여백을 줄임(`gap 22→18`, 카드 `width:100%;max-width:1400px;margin:0 auto`). 예전 2열이 필요하면 폴더 헤더의 **「1열 / 2열」** 버튼(`refSetCols`, `#reference-body.rf-2col`, `lsSet('fpm_ref2col')`로 기억). 폰(<900px)은 설정과 무관하게 항상 1열. **⚠️ 함정**: 그리드 칸에 `margin:0 auto`만 주면 stretch가 풀려 **카드가 내용 크기로 쪼그라든다(실측 138px)** — `width:100%`를 반드시 같이. 실측: 1열 1400px vs 2열 723px(1.9배), 폰 375에서 343px 꽉 참.

- 2026-08-11(2): **브랜드관리 라벨·자수 카드 순서 이동 ◀▶.** 메인라벨·케어라벨·완성부자재·자수·아트웍·단추로고 카드에 앞/뒤 이동 버튼(`_bcMove` → `moveBrandLabel(brandId,kind,idx,dir)`, 배열 swap + `saveData` + 재렌더). 카드가 가로 격자로 흐르므로 ▲▼ 대신 **◀▶**, 양 끝은 disabled. **⚠️ 렌더러가 두 개**(`labelRows`=단가 있는 라벨 / `_brandPresetRows`=자수·아트웍·단추로고) — 둘 다 붙임(CLAUDE.md §12 교훈). **kind 값은 `main`/`care`/`finish`/`emb`/`art`/`btnlogo`** (배열명 `mainLabels`… 아님 — `_brandLabelArr`가 매핑하고 **모르는 값은 careLabels로 폴백**하므로 오타 시 엉뚱한 목록이 바뀐다. 검증 때 이걸로 한 번 헛짚음). CSS `.bc-mvwrap`/`.bc-mv`. 검증 14종 통과. `css/main.css?v=20260811a`.

- 2026-08-11(3): **★할일판이 폰 열자마자 옛 내용으로 되돌아가던 사고 — 원인 2개.** ①**`_tbJson`이 archive까지 지문에 포함**했다. 저녁 8시 이후 폰에서 할일판을 **열기만 해도** `tbAutoArchive`가 보관본을 하나 추가 → 지문 변경 → `saveData`가 `todoBoard._mt`를 올림 → `_tbPick`이 **폰의 옛 할일판을 '최신'으로 판정해 맥의 최신판을 덮음**. → `_tbJson`에서 `archive` 제외(내용이 실제로 바뀔 때만 `_mt` 갱신). ②**`_tbPick`이 이긴 쪽 todoBoard를 통째로 채택**해서 **진 쪽의 archive(지난 할일판)까지 같이 소실** — 그래서 "저장된 것도 예전 것"이 됨. → 보관본은 승패와 무관하게 **날짜 기준 합집합**(같은 날짜는 `ts` 큰 것, 370개 상한). ③복구용으로 **지난 할일판에 「되돌리기」**(`tbArchiveRestore`) 추가 — 되돌리기 전 현재 판을 오늘 저장본으로 자동 보관(오늘 저장본이 없을 때만). 검증 13종(지문 불변·합집합·역방향·빈판 규칙 유지) 통과. **교훈: 기기 간 "누가 최신인가"를 판단하는 지문에는 '자동으로 생기는 부산물(보관본·로그)'을 넣지 말 것.**

- 2026-08-11(4): **★공장(업체)·단가장이 기기 동기화에서 통째로 덮이던 치명 문제.** `applyRemoteCoData`가 `factories: sh.factories||S.factories`, `priceBook: sh.priceBook||S.priceBook` 로 **클라우드 공유문서를 통째 채택**하고 있었다 — 병합 로직이 아예 없었음. 폰이 옛 `fpm_shared`를 올려두면 **방금 등록한 업체·단가가 그대로 사라짐**(실제 유실: 업체 '퍼니베베'). → **`_mergeFactories`/`_mergePB` 신설: 키 합집합 + 같은 키는 로컬(방금 고친 값) 우선**, 진짜 삭제만 묘비로 차단. 묘비 이름: `factories`(공장 id) / `pbSup`(거래처명) / `pbMat`(거래처+품목키) — `deleteFc`·`deletePriceBookEntry`·`deletePbMaterial`에 `_tombArr` 추가. 검증 12종(신규 보존·양방향·로컬 우선·삭제 부활 방지) 통과. **남은 같은 유형**: `renamePBMaterial`/거래처 이름변경은 옛 키가 묘비 없이 사라지므로 다른 기기의 옛 키가 되살아날 수 있음(관찰 필요).

- 2026-08-11(5): **결제 탭에만 안 뜨던 아이템('데님팬츠') — 공장 찾는 기준이 달랐다.** 생산 대시보드·거래명세서는 **`orderFc(o,it,fk)`(오더 생성시점 공장 스냅샷 `o.fcMap`)** 를 쓰는데, `renderItemPay`만 **`it.sewingFcId` / `it[cd[2]]`(아이템의 '현재' 공장)** 를 직접 읽고 있었다. 그래서 아이템 공장을 나중에 바꾸거나 비우면 **대시보드엔 출고완료로 뜨는데 결제 탭에선 사라짐** (게이트: `if(!sewShipQty)continue` → 봉제공장 스케줄을 못 찾아 출고수량 0). → 결제 탭 4곳을 `orderFc` 우선 + 현재값 폴백으로 통일: 봉제공장(`sewingFcId`), 비용공장 집합(`fcSet`), 공정별 단가 매칭(`it[cd[2]]===fcId`), 검품공장 판정(`isInspFc`). **원칙 재확인: 비용→공장 귀속은 항상 `orderFc`** (memory project_fpf_order_fcmap). calc 57 통과.

- 2026-08-13: **★★아이템 폼 자동저장이 confirm()을 띄우고, [취소]하면 적은 게 통째로 저장 안 되던 치명 버그.** `saveItemForm`의 컬러·사이즈 '구성 변경' 확인창(오더 수량 재배치 경고)에 `_silent` 가드가 없어서, **2.5초 자동저장에서도 확인창이 떴고 거기서 [취소]를 누르면 `return` → 그 순간 폼의 공임·요척·단가가 전부 미저장**. 닫을 때(`hideItemForm`)도 같은 자동저장을 부르므로 또 취소 → 결국 아무것도 안 남음. 실제 신고 2건이 같은 뿌리였음: ①'공임을 적어도 다시 열면 0원'(→ 결제 탭에서 단가 0원이라 청구 카드가 안 만들어져 **'데님팬츠가 결제 탭에 안 뜸'**의 진짜 원인) ②'요척을 사이즈별로 다르게 적어도 다시 열면 전부 같은 값'(→ `consumptionBySize`가 저장 안 되면 렌더가 `f.consumption` 하나로 폴백해서 모든 사이즈가 같아 보임). → **자동저장은 절대 묻지 않는다**: 구성 변경만 옛 컬러·사이즈로 미뤄두고 나머지는 전부 저장 + 안내문('컬러·사이즈 변경은 「저장」을 눌러야 반영돼요'). 구성 변경 = 수동 「저장」에서만 확인 후 반영(기존 동작 유지). 추가로 **비용 입력칸을 못 찾으면 0으로 덮어쓰던 것**을 옛 값 유지로 바꿈(`COST_DEFS` 수집). 검증: 4케이스 브라우저 하니스(실제 패치 블록 그대로 추출) — 자동저장+사이즈변경 시 confirm 0회·공임 보존·사이즈 옛값 유지, 수동저장 취소는 종전대로 저장 중단. calc 57 통과.
- 2026-08-13(2): **결제 탭 「안 뜨는 이유」 진단 버튼 신설**(`payWhyMissing`, 기간 필터 옆). `renderItemPay`의 게이트를 그대로 따라가며 걸러진 (오더×아이템)마다 이유+고치는 법을 표로 보여준다(읽기 전용). 판정: 브랜드 필터 / 봉제공장 미지정 / 봉제공장 삭제됨 / 출고기록 없음 / 출고회차가 전부 잔량·수선중 / 출고회차가 다른 아이템 것 / 출고수량 0 / 공정 공장 미연결 / 공장 필터 / **단가 0원** / 기간 필터 / 완료 탭으로 보냄. 하니스 검증 5케이스 전부 정확히 분류.

- 2026-08-13(3): **사이즈별 공임 신설**(사용자 승인: 공임만 / 결제·거래명세서·원가계산서 전부 반영). 모델 = **`it.laborBySize={사이즈명:원}`**(비면 키 자체를 안 만듦 → 옛 아이템 완전 불변). **돈 계산 진입점은 `laborRate(it,size)` 하나로 통일** — 그 사이즈 값이 있으면 그 단가, 없으면 `it.laborCost`. `hasLaborBySize(it)`가 false면 모든 경로가 예전 식과 1원도 안 달라진다. **`it.laborCost`를 직접 곱하지 말 것**(세 화면이 갈라짐). 적용: ①결제 `sewLaborBase(rate,recs,it)`(회차의 `r.size`로 단가 결정, **비품 할인 `bgUnitPrice`도 그 사이즈 단가 기준**) ②거래명세서 회차줄(`_u`)·그리드줄(`_ug`) ③원가계산서(사이즈별 수량×사이즈별 단가, 분해 불가하면 기본식으로 폴백). UI = 아이템 폼 공임 행 아래 `#labor-size-wrap` + 「사이즈별로 다르게」 토글(`renderLaborSizes`/`toggleLaborBySize`/`onLaborSizeIn`/`colLaborBySize`). **접혀 있으면 DOM에 입력칸이 없으므로 `colLaborBySize`가 메모리(`formLaborBySize`) 값을 지킨다**(안 그러면 접은 채 저장할 때 전부 0). `renderSizeChips` 끝에서 같이 다시 그려 폼열기·추가·삭제·이름변경·임시저장을 한 번에 커버. ⚠️ **범위 밖**: 분석 탭(20131·20503)은 사이즈 분해 정보가 없어 기본 공임을 쓴다 → 사이즈별을 쓰는 아이템은 분석 총액이 결제와 다를 수 있음(사용자 합의).
- 2026-08-13(4): **★사이즈로 키를 잡은 값 = 이름 변경 시 전부 같이 옮겨야 한다.** `renameSize`는 트림 `sizeBySize`/`qtyBySize`만 옮기고 **원단 `consumptionBySize`(사이즈별 요척)를 빼먹어서, 사이즈명만 바꿔도 사이즈별 요척이 통째로 사라졌다.** → `renameSize`에 원단 `consumptionBySize` + 새 `formLaborBySize` 이관 추가, 앞서 `colFR()`도 호출(원단 입력값 먼저 거둬야 다시 그릴 때 안 날아감), 뒤에 `renderFabRows()`. `saveItemForm`의 사이즈 마이그레이션(sizeMap)에도 `item.laborBySize`·원단 `consumptionBySize` 추가(트림 `sizeRates` 옆). **현재 사이즈 키 목록: `laborBySize` / 원단 `consumptionBySize` / 트림 `sizeRates`·`sizeBySize`·`qtyBySize` — 새로 만들면 이 두 곳(renameSize, saveItemForm 마이그)에 반드시 추가.** 검증: 계산 하니스 14케이스(세 화면 금액 일치·비품할인·옛회차·프리사이즈) + UI 하니스 12케이스(접힘 보존·없어진 사이즈 버림·이름변경 이관) + **돈 검산에 문제 13 신설**(`calc-tests.js`, `laborRate`/`hasLaborBySize`를 `calc-check.sh` FUNCS에 추가) → 13문제 69검사 통과. 검산 문제 수도 하드코딩에서 자동 카운트로 교체.

- 2026-08-14: **★「수선중」 출고 회차가 결제에 청구되던 문제 — 진짜 원인은 `recomputeShipping`.** 각 회차의 `repair` 플래그는 정상 저장돼 있었고 결제·명세서의 `_shipExcl` 필터도 정상이었다. 문제는 **`recomputeShipping(sch)`가 `shipments`를 전부 더해 `shippingQty`/`shippingGrid`에 수선중·잔량 수량까지 넣어둔 것**. 결제·거래명세서·원가계산서는 **회차를 못 찾으면 이 합계를 폴백으로** 쓰기 때문에, 걸러낸 수량이 뒷문으로 되살아나 청구됐다. → ①`recomputeShipping`이 `_shipExcl`를 제외(수량·그리드·`shippingDate` 전부). ②`migrateData`에 **이미 저장된 `shippingQty`/`shippingGrid` 정정**(섞인 회차가 있는 스케줄만, **`shippingDate`는 안 건드림** — 손으로 맞춘 출고일이 밀리면 안 되니 `recomputeShipping`을 부르지 않고 수량·그리드만 다시 셈. 여러 번 돌아도 결과 동일 = 다른 기기가 옛 형식으로 올려도 자동 치유). ③결제 탭·진단(`payWhyMissing`)의 폴백을 **「회차가 아예 없을 때만」** 옛 수기 합계를 쓰도록 좁힘(예전엔 「살아있는 회차가 없을 때」라 전부 수선중이면 옛 합계가 되살아났음). 검증 13케이스: 정상+수선중 분리 / 수선중만이면 0 / 잔량은 미출고만 제외(`lvShipped`는 포함) / 옛 데이터 정정 시 출고일 불변 / 회차 없는 옛 수기데이터는 종전대로 폴백. calc 13문제 69검사 통과.
  **원칙**: 출고 '수량'을 쓰는 새 코드는 `sch.shippingQty`를 직접 믿지 말고 `_shipExcl`로 거른 `shipments` 합을 쓸 것. `shippingQty`는 회차가 없는 옛 데이터 폴백 전용.
- 2026-08-14: **★소재 관리 탭 신설** (역인터뷰 → 목업 승인 → 적용. 시안=`mockup-material.html`, 참고=키위 kiwi.today). **목적**: 썼던 소재 + 수배만 한 소재를 한 곳에서 사진으로 훑고, `울100`·`자켓용`으로 찾고, 실물 스와치가 어디 있는지 알고, 업체 스와치 요청/수령을 따라가기. **위치** = 네비 `원단 단가장` 바로 앞(`nt-material`/`pane-material`/`renderMaterial`, 모바일 전체메뉴 '결제·단가' 그룹). **데이터(이중 저장 안 함이 핵심)**: 목록 = 단가장(`S.priceBook`의 type fabric/trim) 자동 + 직접 추가(`S.matExtra`). 부가정보는 **단가장 항목 자체에** `mUses`(용도)·`mStatus`(상태 수동)·`mSwLoc`(실물 보관위치)·`mReq{ask,got}`(스와치 요청/수령)로 저장하고 **사진·태그·이슈·장단점은 원단 라이브러리가 쓰던 `swatches`/`tags`/`issues`/`pros`/`cons`를 그대로 승계**(마이그레이션 0). **⚠️`S.matExtra`는 `refCards`와 100% 동일 배선** — `_ID_ARRS` 포함 + `_mergeById`+묘비, 저장 9곳·복원/병합·부팅 가드 4곳에 **refCards 옆에 항상 짝으로**(한 곳 빠지면 다음 저장 때 빈값으로 덮여 사라짐). **상태는 자동 판정**(`_mtStatus`): 쓴 아이템의 phase가 main/reorder면 `양산 씀`, 아이템만 있으면 `샘플만 씀`, 요청했는데 못 받았으면 `스와치 요청중`, 아니면 `수배만 함` — 수동 지정(`mStatus`)이 있으면 그게 우선. **검색**(`_mtHay`)은 이름·업체·혼용·용도(+`…용` 형태도 넣어 "자켓용"이 잡힘)·상태·보관위치·쓴 아이템명을 다 훑고, **공백 제거본도 함께 검사**해 "울100"이 "울 100%"에 걸림. **화면**: 종류칩(전체/원단/부자재) + 검색 + 정렬 + 격자↔목록, 좌측 필터 사이드바(용도·상태·실물 스와치·업체, **옵션마다 개수** — 자기 축은 빼고 세는 `_mtPass(m,skip)`), 폰(≤760px)은 사이드바 숨기고 `필터` 버튼→바텀시트·격자 2열. **사진**: 상세 왼쪽이 드롭존(`mt-dz`, 여러 장) + `＋사진`. **연동 로그인 상태에서만 Storage 업로드**, 아니거나 실패하면 1100px dataURL로 이 기기에만 저장하고 토스트로 알림(예전 실패 시 아무것도 안 남던 버그의 교훈). CSS는 `_mtEnsureStyle()`로 **head에 1회 주입**(재렌더 컨테이너 안에 `<style>` 넣지 말 것 — 거래처 원장 교훈). 두 테마 다 적용(레트로는 `html[data-theme="retro"] #pane-material` 오버라이드). **발주·원가·결제 숫자에는 일절 관여하지 않음**(표시·기록 전용). 다음 단계 = 스와치 사진 판독(헤더 글자로 업체·품번·혼용·폭·단가 채우고 **못 읽은 칸은 비워둠**, 한 장에 여러 스와치면 잘라서 여러 개 등록).

- 2026-08-14(2): **작업지시서 「치수」 표 줄 순서 변경(▲▼) 추가.** 자수·나염 위치표에만 있던 `tpPosMove` 방식을 공용화 — **`tpMoveRow(path,i,dir)` + `tpRowMoveBtns(path,i,len)`** 신설(`tpDelRow` 옆). 줄 객체를 통째로 스왑하므로 사이즈별 수치(`pat`/`v`/`grade`)가 같이 따라간다. 첫 줄 ▲·마지막 줄 ▼는 `disabled`(흐리게). 적용: **치수 표(`sew.spec`)** + **봉제 기호 표(`sew.legend`)** — 같은 위젯이라 한쪽만 하면 또 물어봐야 하므로 둘 다. 마지막 칸 헤더를 빈칸 → **「순서」**(58px)로. CSS는 `.tp-pos` 안에서만 먹던 `.tp-rx`/`.tp-rmv`를 `#tp-modal .tp-wrap` 전체로 넓히고 `[disabled]{opacity:.28}` 추가(작지 인라인 `<style>`이라 css/main.css `?v=` 갱신 불필요). 검증 12케이스: 버튼 개수·첫/막줄 비활성·위아래 이동·수치 동반 이동·경계에서 무동작·기호표 동일 동작·사이즈 3개일 때 열 수(9칸) 유지 + 렌더 스크린샷 확인.

- 2026-08-14(3): **사이즈별 공임 버튼이 「없다」고 보이던 것** — 사이즈 미등록 아이템에서 `renderLaborSizes`가 빈칸을 그려 기능 자체가 없는 줄 알게 됐다. → 안내문 표시(「위 사이즈에 사이즈를 추가하면…」) + `showItemForm`/`loadDraft` 두 렌더 경로에 `renderLaborSizes()` 직접 호출(안전망).
- 2026-08-14(4): **★단가장 항목이 지워도 계속 늘어나던 문제(`saveToPB`).** `pbKey(name,color,size)`에는 **사이즈가 들어간다**. 그런데 `saveToPB`는 **"이름만 맞으면 통과"**시켜 놓고 저장은 `t.size`를 붙인 **새 키**로 했다 → 아이템마다 사이즈 글자가 조금만 달라도(44 / 44") 항목이 계속 늘고, **아이템 자동저장이 2.5초마다 도니 지워도 즉시 부활**(신고: 186TC 3개). → **실제로 매칭된 키에만 다시 쓴다**(정확한 키 우선 → 없으면 사이즈 없는 이름 키). 새 키는 절대 안 만든다. 사이즈별 단가가 따로 필요하면 단가장에서 직접 등록(그러면 정확한 키가 매칭됨). `size` 필드도 `existing.size||t.size`로 바꿔 아이템마다 글자가 뒤바뀌지 않게. 검증 8케이스: 반복 저장해도 1개 / 사이즈 항목을 직접 등록해두면 그것만 갱신 / 미등록은 여전히 자동생성 안 함 / 단가 0이면 기존 보호.
- 2026-08-14(5): **「＋ 종류 추가」가 목록에 안 나오던 문제 2겹.** ①**렌더 누락**: 가공비 줄은 **두 군데**에 그려진다 — 부자재 카드 안 「가공·염색」 탭(`renderTrimRows`)과 카드 밖 독립 가공비(`renderTrimCostRows`). `addProcKind`/`setProcKind`가 후자만 불러서, 카드 안에서 추가하면 셀렉트가 「＋ 종류 추가…」에 멈춰 있었다. → `_procKindRerender()`(colTR → renderTrimRows → renderTrimCostRows) 신설, prompt 취소 시에도 되돌림. 열린 탭은 `window._trimUI[t.id].tab`으로 복원됨. ②**동기화에서 사라짐**: `S.refData=_mergeMap(...)`는 같은 키면 **원격이 통째로 이김** → 방금 추가한 종류가 다른 기기 옛 목록에 덮였다. → **`_mergeRefData`** 신설: 배열 값은 합집합(로컬 순서 먼저), 한 겹 안쪽 배열(checklists.sample/main)까지, 스칼라는 종전대로 원격 우선. 진짜 삭제만 묘비 **`refArr:<키>`** 로 차단(`deleteTrimCategory`에 `_tombArr('refArr:trimCategories',old)` 추가). ⚠️ **refData에 삭제 UI를 새로 만들면 반드시 같은 묘비를 남길 것.** 검증 8케이스. 함정 기록: **한 줄짜리 함수 안에 `//` 주석을 넣으면 뒤 코드가 통째로 주석 처리된다**(deleteTrimCategory에서 실제로 발생, 문법검사가 잡음 → `/* */`로 교체).

- 2026-08-14(6): **★택배 시재 줄을 지워도 계속 되살아나던 문제 — 원인 2개.** ①**묘비 없음**: `_mergeCourier`가 `_mergeById(a.entries,b.entries)`를 **tomb 인자 없이** 불러서, 지운 줄이 다른 기기 사본에서 그대로 부활했다(지워도 미정산 건수가 안 줄어듦). → `_mergeById(...,(S._tomb&&S._tomb.courierEntries)||null)` + `clDel`에 `_tombArr('courierEntries',id)`. ②**겹친 id**: `_mergeById`는 같은 id면 **뒤엣것이 앞엣것을 덮는다**. 시재 줄 두 개가 같은 id를 갖고 있어 **한 자리를 두고 서로 싸웠고**, 그래서 «아이케이를 지우면 투케이가 생기고, 투케이를 지우면 아이케이가 생기는» 증상이 났다(총 건수는 계속 14로 고정). → 로드 시 겹친 id·빈 id에 새 `uid()`를 주는 자가치유를 `migrateData`에 추가(콘솔에 '겹친 id N건 분리' 경고). 검증 9케이스: 지운 줄 부활 안 함(양방향) / 새 줄은 정상 합쳐짐 / **증상 재현**(같은 id면 한 줄만 남음) / id 분리 후 둘 다 생존 / id 없는 줄 부여 / 계좌(bank)는 종전대로 원격 우선.
  **원칙**: `_mergeById`를 쓰는 배열은 **삭제 경로에 반드시 `_tombArr`** 를 남길 것. 현재 tomb 없이 병합되던 마지막 배열이 courierLedger.entries였다.

- 2026-08-14(7): **드래그로 순서 바꿀 때 화면이 안 굴러가서 아래쪽으로 못 옮기던 문제.** 순서변경 드래그는 `pointermove`에서 `e.preventDefault()`를 하고 손잡이에 `touch-action:none`이 걸려 있어 **드래그 중엔 스크롤이 완전히 막힌다** → 화면 밖 줄로는 옮길 수가 없었다. → **가장자리 자동 스크롤** 신설: `_dragScrollHost(el)`(스크롤되는 조상 탐색, 없으면 창) / `_dragScrollEdge(y,host)` / `_dragScrollOn(target,y)`·`_dragScrollY(y)`·`_dragScrollOff()`(rAF 루프). 손을 멈춰도 계속 굴러가고, 가장자리에 가까울수록 빨라진다(최대 20px/frame). **가장자리 폭은 고정 70px이 아니라 `max(20, min(70, 보이는높이×0.18))`** — 폰처럼 보이는 영역이 짧으면 위·아래 구역이 겹쳐 **화면 전체가 스크롤 구역**이 돼 가운데에 놓을 수 없게 된다(검사에서 실제로 잡힘). 적용: 컬러 칩·사이즈 칩·작업지시서 표 줄(`tpRowDrag`). ⚠️ **새 순서변경 드래그를 만들면 move에서 `_dragScrollOn`/`_dragScrollY`, end에서 `_dragScrollOff`를 반드시 붙일 것.** 그리고 **반드시 `active`가 된 뒤에만** 켤 것(그냥 톡 눌렀을 때 켜지면 화면이 멋대로 움직임). HTML5 기본 드래그(`clDrag`·`qbSupDrag`)는 브라우저가 알아서 굴려주므로 제외. 검증 16케이스(가운데 무동작·양끝 방향·거리별 속도·짧은 영역·손 멈춰도 반복·중복 실행 방지·종료 후 무반응). 검사 환경 함정: 이 브라우저 하니스는 `window.innerHeight`가 0이고 타이머가 크게 눌린다 → `Object.defineProperty`로 높이를 심고 rAF를 직접 돌려 검증했다.
- 2026-08-15: **레퍼런스 탭 — 사진 다루기 3종 + 폴더 시즌 분류.** ①**사진 끌어내기**: 카드 사진에 `draggable`+`-webkit-user-drag:element`, `dragstart`에서 **`DownloadURL`(`mime:파일이름:주소`)**+`text/uri-list`+`text/plain` 세팅 → 카톡 같은 **네이티브 앱엔 파일로 떨어짐**(실사용 확인). ⚠️**클로드 같은 웹앱엔 원리상 불가** — 웹→웹 드래그는 파일이 아니라 주소만 넘어감(브라우저 제약, 코드로 못 뚫음) → 그래서 **「복사」(클립보드 PNG, 붙여넣기)**·**「저장」(fetch→blob→a[download], 실패 시 새 창)** 두 길을 같이 제공. 파일명 `_refFileName`=`제목_앞.jpg`. 인쇄·이미지저장 캡처 시 버튼 숨김(`.rf-capturing`). ②**사진 클릭 = 확대**(`refZoomImage`/`#rf-zoom`) — 예전 "눌러서 바꾸기"는 **「바꾸기」 버튼으로 분리**(기능 누락 금지 규칙). 배경클릭·닫기·Esc로 닫히고 **사진 클릭은 안 닫힘**(끌어내다 실수 방지), 확대창 안에서도 바꾸기·저장·복사·끌어내기 가능. 빈 칸 클릭은 그대로 사진 고르기. ③**폴더 시즌 분류**: `col.season` + **이름에서 자동 추정 `_refGuessSeason`**(`26FW 코디`→26FW, `25 S/S`→25SS, AW→FW·SU→SS 정규화) — **이미 만들어둔 폴더가 손 안 대고 바로 묶이는 게 핵심**. 셀렉트로 고른 값이 추정값보다 우선. 상단 **시즌 칩 + 「묶기: 시즌별/브랜드별」 토글**(기본 시즌별, `fpm_refGroupBy`에 기억), 폴더 카드에 시즌 배지, 섹션 제목에 개수. 시즌 목록=실제 쓰이는 값 ∪ 직접 추가분(`S.refData.refSeasons`), 최신 연도·FW 먼저.

- 2026-08-14(8): **저장 폴더 지정 + 오래된 자동백업 자동 정리 (신규).** 앱이 만드는 파일을 **다운로드 폴더 대신 사용자가 고른 폴더**에 저장한다(File System Access API). **브라우저는 다운로드 폴더의 파일을 지울 수 없다** — 그래서 '오래된 백업 정리'는 폴더 지정이 선행돼야 가능하다(두 요청이 한 묶음인 이유). 신규: `fpfDirSupported`/`fpfDirHandle`/`fpfDirReady`(권한 granted일 때만 반환)/`fpfDirNeedsReconnect`/`fpfPickSaveDir`/`fpfReconnectSaveDir`/`fpfClearSaveDir`, **`fpfSaveFile(data,filename,opts)` = 파일 저장 단일 통로**(Blob·dataURL·문자열 다 받음, 폴더 없으면 `<a download>` 폴백, 같은 이름은 `이름(1).png`로 비켜 씀). 폴더 손잡이는 기존 IndexedDB(`fpmBackups`/kv, 키 `fpm_saveDir`)에 저장. **저장 지점 13곳 전부 이관**(백업 4: 안전망·복구본·수동·자동 / 이미지 9: 라인시트·레퍼런스 사진·레퍼런스 카드·검사신청서·통합명세서·택배시재·원가계산서·거래명세서·작업지시서). 남은 `<a download>`는 폴백 통로 `_fpfDownload` **하나뿐** — grep으로 확인. 정리: `fpfCleanupBackups(keep=14)`가 **`패션생산관리_자동백업_*.json`만** 대상(이름=날짜_시각이라 이름순=시간순). 수동 백업·이미지·다른 파일은 절대 안 건드림. 자동 파일백업 직후 + 앱 켤 때 하루 1회(`fpfAutoCleanupOnce`, `fpm_bkclean_last`). UI는 데이터 관리 맨 위 「저장 폴더」 칸(지정/다시 연결/바꾸기/해제 + 지금 정리 + 보관 개수). ⚠️ **크롬·엣지 전용.** 사파리·아이폰은 `showDirectoryPicker`가 없어 자동으로 예전 동작(다운로드) — 나빠지는 건 없다. ⚠️ 브라우저를 껐다 켜면 권한이 'prompt'로 돌아갈 수 있고 `requestPermission`은 **사용자 클릭이 필요**해서 그동안 자동저장은 다운로드로 간다 → 데이터 관리에 「다시 연결」 버튼을 띄운다. ⚠️ **새로 파일 만드는 코드는 `<a download>` 직접 쓰지 말고 `fpfSaveFile()`을 쓸 것.** 검증 29케이스: 미지원/미지정 폴백 · 폴더 저장 · 이름 비켜쓰기 · dataURL→Blob(MIME 보존) · 권한 풀림 시 폴백 · 재연결 · 해제 / 정리 13케이스(가장 오래된 것부터, 수동백업·이미지·남의 파일 보존, 재실행 0개, 폴더 없으면 중단). 하니스 함정: 추출기가 `function`부터 잘라 **`async`가 떨어져 나갔다** → `async function`을 먼저 찾도록 수정.

- 2026-08-17: **아이패드에서 상단이 상태바(시간·배터리)에 가리던 문제.** `viewport-fit=cover` + `apple-mobile-web-app-status-bar-style=black-translucent`라 홈화면 앱에선 상태바가 화면을 덮는데, **safe-area 여백이 모바일(≤760px) `.hdr`에만 있었고 사이드바 레이아웃(≥761px, 아이패드·데스크탑)엔 아예 없었다** → 「생산관리」·리스트/타임라인 탭·긴급/출고완료 버튼이 상태바에 가림. → `@media (min-width:761px)`에 **`.shell{padding-top:env(safe-area-inset-top,0px)}`** 추가(`height:100vh`+전역 `box-sizing:border-box`라 안쪽으로 먹어 넘치지 않음). `.nav`·`.hdr`는 `position:fixed`라 body/shell 여백이 안 먹으므로 각자 `padding:calc(14px + env(top))…` / `padding-bottom:calc(10px + env(bottom))`로 따로. retro `.nav` 규칙도 같이(뒤에 와서 덮으므로 필수). **css/main.css `?v=20260817a`로 갱신**(안 하면 캐시 때문에 반영 안 됨). 검증 20케이스: 안전영역 24/20px 흉내 → shell 24 · nav 38(=14+24) · content top 24 · hdr 아래 30(=10+20) · 세로 넘침 없음 + 스크린샷으로 상태바 영역 비었는지 눈으로 확인 / **안전영역 0(데스크탑)이면 1px도 안 바뀜**(shell 0 · nav 14 · content 0 · hdr 10) / **폰(375px)에서 여백 중복 없음**(shell 0 유지, hdr 30=6+24). ⚠️ 새 고정(fixed) 상단 요소를 만들면 `env(safe-area-inset-top)`을 직접 넣어야 한다 — 부모 여백이 안 먹는다.

- 2026-08-17(2): **「아이패드 동기화가 최신이 아닌 것 같다」 → 확인할 방법이 아예 없었다.** 클라우드 창은 '연동됨'만 보여줄 뿐, **마지막으로 자료를 받은 시각도, 실행 중인 앱 버전도** 안 보였다. 홈화면 앱(PWA)은 옛 `index.html`을 오래 물고 있을 수 있는데 그러면 **동기화 로직도 옛것**이라, 최근에 고친 병합(공장·단가장·refData·시재 묘비)이 안 돌아 데이터가 어긋난다 — 이게 가장 흔한 원인. → **`APP_BUILD`(BUILD 주석표시로 마킹) + `fpfCheckAppVersion()`**: 서버의 `index.html`을 `cache:'no-store'`로 받아 자기 버전과 비교. 다르면 하단에 **「이 기기는 옛 버전이에요 → 최신으로 새로고침」** 막대. `fpfHardReload()`는 Cache Storage·서비스워커까지 지우고 `?vc=` 붙여 재요청. 클라우드 창에 **동기화 진단**(앱 버전 / 계정 / 현재 업체 / 이 업체 자료 받은 시각 / 공장·단가장 받은 시각 = `getSyncBase`)과 「버전 다시 확인」·「최신으로 새로고침」 버튼. 부팅 8초 뒤 1회 자동 확인. ⚠️ **배포할 때마다 `APP_BUILD`를 올릴 것.** 안 올리면 옛 버전 알림이 안 뜬다. 검증 14케이스: 같은 버전=조용 / 다른 버전=감지+막대(두 버전 표시) / **막대 중복 안 쌓임** / **서버에 표시가 없으면 옛버전으로 오판 안 함** / 진단에 계정·업체·두 시각 표시 / 기록 없을 때 '기록 없음'. 함정 기록: **블록 주석 안에 `/*BUILD*/`를 그대로 적었더니 거기서 주석이 닫혀 문법이 깨졌다**(문법검사가 잡음). 주석엔 그 표시를 쓰지 말 것.

- 2026-08-17(3): **오더수량 → 공장 안내(텍스트 복사 / 이미지 복사·저장) 신규.** 「수량」 창 아래에 버튼 3개. **텍스트는 기존 카톡 형식(`pdQtyLineCS`)과 같은 모양으로 맞췄다** — 공장이 이미 익숙하기 때문. `워싱블루종 (TF26) / 1차 리오더 · 2026. 08. 17. / 연두 2:30 3:45 4:60 5:40 총175장 … / 합계 685장`. 컬러 없음(단색)·사이즈 없음(프리)이면 그 조각을 빼서 `총120장`으로만 — 예전 방식이면 `- 120 총120장`처럼 어색해진다. **이미지는 표를 그대로 찍지 않는다** — 가로로 길어 카톡에서 잘리기 때문. 680×최소900 **세로형 카드**를 따로 만들어 찍는다(컬러마다 한 덩어리 + 사이즈는 **칩으로 줄바꿈** → 사이즈가 8개여도 옆으로 안 늘어나고 아래로 쌓임). 남는 세로는 `flex:1 + justify-content:space-evenly`로 컬러 칸들이 고르게 나눠 갖는다(안 그러면 아래에 큰 빈칸). 이미지 복사는 **사파리 때문에 클릭 순간 `ClipboardItem`에 Blob이 아니라 Promise를 넣는다**(비동기로 다 기다렸다 쓰면 '사용자 동작 아님'으로 거부). 안 되면 「이미지 저장」 안내. 저장은 `fpfSaveFile` 통로 사용(저장 폴더 설정 따름). 검증: 컬러3×사이즈4 / 프리사이즈 무컬러 / 사이즈 8개 — 셋 다 680×900(비율 1.32) 세로 + 텍스트 3종 + 스크린샷 확인.

- 2026-08-17(4): **★「사라진 오더만 되살리기」 신설** (신고: 만든 오더 2건이 갑자기 사라짐). 복구 도구엔 **전체 복구(옵션 0/0b)밖에 없어서** 오더 하나 되살리려면 그 시점 이후 다른 작업까지 통째로 되돌려야 했다 — 위험해서 못 씀. → `_ordMissingCands()`가 저장백업(5)+매시간백업(12)을 훑어 **백업엔 있는데 지금 `S.orders`엔 없는** 오더를 모으고(같은 id는 가장 최신 백업본), 데이터 관리 맨 위에서 **건별/전체 되살리기**. **⚠️ 핵심**: 되살릴 때 `o._mt=Date.now()`로 찍고 **`S._tomb.orders[oid]`(삭제기록)를 지운다**. 안 하면 `_entMerge`가 `dt>=lt`로 '삭제가 더 최신'이라 판정해 **다음 동기화에서 또 지운다**(검사로 확인). `window._entShadow.orders`도 지워 다음 저장 때 새 항목으로 도장 찍히게. 오더가 사라지는 구조적 경로: `_entStampChanges`가 **그림자에는 있는데 `S.orders`에 없으면 무조건 무덤을 남긴다**(1577행) → 어떤 이유로든 메모리에서 잠깐 빠지면 그 다음 저장에 삭제로 확정된다. 이 영역 손댈 때 주의. 검증 12케이스: 사라진 2건 탐지(살아있는 건 제외) / 건별·전체 복구 / **복구 후 클라우드에 삭제기록이 남아 있어도 `_entMerge` 통과** / 없을 때 안내 / 취소 시 무변경.

- 2026-08-17(5): **★★대량 삭제 안전밸브 — 「오더·아이템이 통째로 사라짐」의 구조적 원인 차단.** `_entStampChanges`는 **'그림자엔 있는데 지금 `S.items`/`S.orders`엔 없다'를 곧바로 삭제(무덤)로 확정**한다(1577행). 그래서 어떤 이유로든 메모리가 잠깐 비거나 옛 상태로 돌아가면 **바로 다음 저장 한 번에 전부 삭제로 굳고, 무덤이 클라우드로 퍼져 모든 기기에서 사라진다.** (신고: 만든 오더 2건 + 아이템 수정내용이 통째로 사라짐 — 되살리기 도구로 확인된 2건 = 워싱블루종 685장·코튼팬츠 310장) → **사람은 보통 하나씩 지운다**는 전제로, 한 번에 **4건 초과** 또는 **전체의 34% 이상**이 사라지면 **무덤을 남기지 않고** 경고+토스트만 띄운다(살려두는 쪽으로 실수). 1~3건 삭제는 종전대로 정상 기록되고, 수정(`_mt`) 도장도 그대로 동작한다. 검증 10케이스: 1건·3건 삭제 정상 기록 / 4건·전멸·3중2 = 기록 안 함+알림 / 밸브 작동 중에도 수정 도장 정상 / 병합 후 생존. ⚠️ 진짜로 여러 건을 지우려면 하나씩 지우거나, 밸브 기준을 넘지 않게 나눠 지울 것.
- 2026-08-17(6): **복구 도구가 안 열리던 문제 방어.** 오버레이를 함수 **맨 끝**에서 만들어서, 중간에 예외가 나거나 `await`가 응답을 안 주면 **오류도 없이 창이 안 뜬다**(신고). → ①`_rtWait(p,ms,dflt)`로 IndexedDB 로드(3초)·저장폴더 조회(2~2.5초)에 시간제한 ②`openRecoveryTool`을 래퍼로 감싸 실패하거나 6초 초과면 **최소 기능 창**(`_recoveryFallback`: 사라진 오더 되살리기만이라도) ③모달 새로고침 id가 `recovery-ov`로 **틀려 있던 것 5곳**을 `recovery-overlay`로 수정.

- 2026-08-17(7): **오더수량 공유 이미지를 「칩 나열」 → 「표」로 되돌림**(사용자: 수량 창의 표가 한눈에 들어온다). 표를 버리지 말 것. 대신 표를 그냥 찍으면 가로로 길어 카톡에서 잘리므로 **720px 세로형 카드 안에 넣고 줄 높이로 세로를 채운다**. 고정 `min-height`는 컬러 수에 따라 아래가 크게 비어 어색했다(시안에서 확인) → **줄 높이를 역산**: `base=170+110+68+72`, `need=W*1.05-base`, `rowH=clamp(70,150, need/컬러수)`, 합계줄은 `margin-top:auto`. 결과: 컬러3×사이즈4 = 720×746(세로비 1.04, 빈칸 없음). 사이즈 7개면 폭 860·글씨 축소로 한 표 유지, 프리사이즈는 `컬러|합계` 2칸 표.

- 2026-08-17(8): **★동기화 실패 「문서 1MB 초과 — 발주서데이터 1050KB」.** 클라우드(Firestore)는 **문서 1개당 1MB**가 한계인데 `ordersData={orders:S.orders,_tomb}` 를 **오더 전체 한 문서**로 올린다 → 넘는 순간 **저장이 거부돼 동기화가 통째로 멈춘다.** 그 사이 다른 기기가 옛 자료를 올리면 **되돌아간 것처럼 보인다** — 오늘의 오더·아이템 유실 사고와 직접 연결될 수 있는 원인. ⚠️ 아이템 화면에서 저장해도 실패한다(올리는 건 오더 문서 전체라 화면과 무관). 로컬(localStorage)엔 저장되므로 그 기기 데이터는 살아 있다. → 우선 **용량 진단** 추가(`fpfSizeReport`/`fpfSizeReportHTML`, 데이터 관리 맨 위): 문서별 크기·1MB 대비 %·막대, **자리를 많이 먹는 오더 상위 8개**와 각 오더에서 제일 큰 칸(발주서/추가발주/공장일정/수량표/결제비용/생산블록)까지 표시. 읽기 전용. 덩치 후보: `o.suppliers[].materials`(발주서 줄), **`o.extraOrders[].suppliers`(추가발주가 전체 발주서를 한 벌 더 스냅샷)**, `factorySchedules[].shipments`. 다음 단계(미착수): 완료·오래된 오더를 **별도 문서로 분리**하거나 재계산 가능한 필드를 업로드에서 제외.

- 2026-08-17(9): **★클라우드 문서 다이어트 — 「1MB 초과」로 동기화가 멈추던 것 해결(1단계).** 덜어내는 대상 = **추가발주의 발주서 줄 `ex.suppliers[*].materials`**. 이건 `ex.addGrid/qty/loss/excl`로 **다시 계산되는 값**이고, 렌더 쪽이 이미 '비어 있으면 다시 만든다'(`exBuildSuppliers`, 18047행)를 하고 있어 구조상 안전하다. → `_slimOrdersForCloud(orders)`: **업로드본만** 줄을 비우고 `_slim:1` 표시. `_rehydrateExtraSuppliers()`가 수신 직후(`applyRemoteOrders`)와 부팅(`migrateData`)에서 표시된 것만 다시 계산. ⚠️ **`status==='sent'`(보낸 발주서)는 절대 안 건드린다** — 실제로 공장에 보낸 내용이라 재계산하면 안 됨. ⚠️ **로컬(localStorage)은 원본 그대로** — 줄이는 건 클라우드 업로드본뿐이라 그 기기 데이터는 손실 없음. 실패 토스트에 **큰 오더 2개(이름·KB·제일 큰 칸)**를 덧붙여 화면 안 열고도 원인을 알게 함. 검증 13케이스: 업로드본만 제거·원본 보존·메인 발주서 불변·발송건 불변(객체 동일성까지)·수신 후 복원·복원은 표시된 것만 1회·추가발주 없으면 통과. 테스트 데이터 57% 감소. **남은 2단계(미착수)**: 그래도 1MB에 가까우면 완료 오더를 별도 문서로 분리.

- 2026-08-17(10): **레퍼런스 묶기에 「브랜드 → 시즌」 2단 추가**(사용자: 시즌별/브랜드별로 **나누는** 게 아니라 브랜드 안에서 시즌으로 묶고 싶다). 기존 두 칩은 그대로 두고 세 번째 칩 `gb==='brandsea'` 추가(`fpm_refGroupBy`에 영속). **⚠️ 폴더가 새로 생기는 구조가 아니다** — `S.refCollections`는 그대로, 화면에서 제목만 두 겹(브랜드 큰제목 → 시즌 소제목 → 폴더 카드)으로 정리한다. 클릭 단계도 안 늘어남. 시즌 정렬은 `getRefSeasons()` 순서, 시즌 없는 폴더는 「시즌 미지정」으로 맨 뒤. CSS: `.rf-bsec-2lv`(브랜드 칸 테두리) / `.rf-ssec-h`(시즌 소제목, 브랜드 제목보다 한 단 작게). 검증: 브랜드 3칸·시즌 소제목·폴더 개수 불변(6→6) 확인 + 스크린샷.

- 2026-08-17(11): **레퍼런스를 「묶기(보기)」가 아니라 실제 폴더 분류로 — 브랜드 → 시즌 → 폴더 → 카드.** 사용자 정정: 「묶기」는 그때만 묶어 보는 것이고 원한 건 **폴더 분류**였다(내가 '하위 폴더 안 생긴다'로 반대로 만들었던 것 바로잡음). **⚠️ 자료 이관 없음** — 폴더에 이미 있는 `brandId`/`season`을 '위치'로 읽을 뿐이라, 폴더의 브랜드·시즌을 바꾸면 그 자리로 자동으로 옮겨간다(되돌리기도 쉬움). 신규: `_refNav()`/`_refNavSet(b,s)`(위치 `lsSet('fpm_refNav')`에 기억, 미지정은 `'__none'`) · `_refRenderBrands`(레벨0) · `_refRenderSeasons`(레벨1) · `_refCrumb()`(경로, 눌러서 되돌아감) · `_refGroupThumb`/`_refBigFolder`/`_refHeadHTML`(3단계 공용). `renderReference`가 4단계 분기(폴더 열림 → 레벨0 → 레벨1 → 레벨2). 레벨2(`_refRenderFolders`)는 현재 브랜드+시즌으로 좁히고 **「묶기」칩은 숨김**(분류가 대신함), 미분류(폴더 없는 카드)는 레벨0으로 이동. `refAddCollection`은 **지금 보고 있는 자리**의 브랜드·시즌으로 새 폴더를 만든다. 검증 12케이스: 3단계 이동·되돌아가기·경로 표시·미지정 경로(브랜드/시즌)·폴더 열었다 닫으면 제자리·위치 기억 + 스크린샷.

- 2026-08-17(12): **선택 인쇄를 「지금 열어둔 폴더 안」으로 한정.** 예전엔 `refPrintSelected`가 `S.refCards` 전체에서 체크된 걸 인쇄해 **다른 폴더에서 체크해둔 카드가 딸려 나왔다**. → 현재 `window._refOpenCol` 기준으로 거른다(`__orphan`이면 폴더 없는 카드만). 덧붙여 `refOpenCol`/`refCloseCol`/`_refNavSet`에서 `_refPick={}`로 비워, 「선택 인쇄 (N)」이 항상 **이 폴더에서 고른 수**를 뜻하게 함. 검증 7케이스.
- 2026-08-17(13): **메뉴 글씨가 자꾸 바뀌던 것 고정.** 레트로 `.ntab`은 `var(--font-display)='Galmuri11'`인데 그 웹폰트를 **일부 화면에서만 `@import`로 뒤늦게** 불러온다(택배 송장 배치·도식화 등) → 처음엔 대체 글꼴로 보이다가 그 화면을 다녀오면 Galmuri로 바뀌어 **메뉴 글씨가 달라 보였다**. → 사이드바·메뉴(`.nav .ntab`, `.nav .nav-brand`, `#mobile-nav-toggle`)만 **시스템 글꼴로 `!important` 고정**. css `?v=20260817b`.

- 2026-08-17(14): **레퍼런스 인쇄 — 설명이 비어 있어도 손으로 적을 칸을 남긴다.** 예전엔 `c.desc`가 없으면 `.desc` 블록 자체를 안 그려서 **인쇄본에 적을 여백이 아예 없었다**(신고). → 빈 경우 `.desc.desc-blank`로 「설명」 라벨 + 옅은 밑줄 3개(`.ln`, `#c9c4b4`)를 그린다. 한 장 인쇄(`.page.one`)는 줄 간격 9mm, 2×2 모아찍기는 4mm로 자동 조절. 검증: 4장 중 빈 설명 2장 → 손글씨 줄 6개 + 확대 스크린샷 확인.

- 2026-08-17(15): **레퍼런스 인쇄 두 모드 병행**(사용자: 폴더 안만도 좋고 여러 폴더에 걸쳐 고르는 것도 좋다 — 둘 다 살려달라). 직전(12)에서 폴더 이동 시 `_refPick`을 비웠던 걸 **되돌리고**(체크가 폴더를 건너 유지돼야 여러 폴더 선택이 가능), 버튼을 셋으로: **「선택 인쇄 (이 폴더 N)」**(`refPrintSelected`) / **「다른 폴더까지 (전체 M)」**(`refPrintSelectedAll`, **다른 폴더에도 체크가 있을 때만 노출**) / **「선택 해제」**(`refClearPick`). `_refPickCounts(colId)`가 `{all, here}`를 세고, `refTogglePick`이 세 버튼 라벨·표시를 그 자리에서 갱신한다(재렌더 없이). 검증 13케이스: 개수 계산 · 두 모드 인쇄 범위 · 폴더 이동 후 체크 유지 · 전부 이 폴더면 전체버튼 숨김 · 해제 · 미분류 폴더.

- 2026-08-18: **샘플 스케줄표 탭 신설**(나브 「할일판」 아래 `nt-ssched` / `pane-ssched` / `renderSampleSchedule`). 목적 두 가지 — ①전체 흐름을 표로 ②**거래처가 무리한 촬영일을 요구할 때 「일정 안 나옴 + 가장 빠른 가능일」로 막기.** **촬영일은 아이템(샘플)마다** `s.shootDate`. 위쪽 「촬영 예정일(빈 칸 일괄)」은 비어 있는 것에만 한꺼번에 넣는 용도(`ssFillEmpty`) — 거래처가 준 날짜는 안 건드림. **걸리는 날수는 앱에서 직접 수정**: `S.refData.sampleLead[브랜드id|'_']` 9칸(`SS_LEAD_LBL`), 기본값 `SS_LEAD_DEF`. refData라 기기 간 병합됨. 계산: 촬영일이 있으면 **거꾸로**(촬영→촬영준비→수정→컨펌→전달→샘플→패턴), 없으면 오늘부터 앞으로 → **샘플 나오는 예정일**만 표시. 판정은 `지금 단계`(`ssStage`: status+checklist로 추정)별 남은 소요일(`_ssRemain`)로 **오늘 기준 최단 촬영 가능일**을 구해 비교 → 가능 / 안 나옴(+가능일) / 촬영일 미정. 전달 텍스트(`ssBuildText`): 맨 위 촬영 예정일 + **촬영 가능/불가/미정 목록** → 소요 기간 안내(투입≠완성) → 카테고리별 `* 이름 (단계, 전달 N/N 예정)` + 패턴·샘플 일수. **컨펌일·아이콘 없음**(사용자 지시). ⚠️ **`toISOString()` 금지** — 한국 자정을 UTC로 바꾸며 **하루가 밀린다**(검사에서 실제로 잡음). `_ssAdd`는 로컬 기준으로 문자열을 만든다. ⚠️ 단계별 '실제 끝난 날'을 적는 칸은 아직 없다(예정일은 전부 계산값) — 다음 단계. 검증 10케이스: 월·연 넘김 날짜 계산 · 불가 판정 · 가능일 · 미정 시 샘플 예정일 · 소요일 변경 즉시 반영 + 렌더 스크린샷. css `?v=20260818a`.

## 2026-08-18b — 샘플 스케줄표 2단계 · 시즌 세부 직접 추가

### 샘플 스케줄표 (renderSampleSchedule 일대 개편)
- **실제로 끝난 날 굳히기**: 표의 날짜를 누르면 쪽지(`.ss-pop`) → 「오늘로 기록 / 날짜 고르기 / 기록 지우기」.
  굳힐 수 있는 자리 6군데 = `SS_NODES` (matIn·patIn·patOut·samIn·samOut·deliv).
  - 회색 점선(`.ss-dt`) = 예정(계산값) / 검정 밑줄(`.ss-dt.on`) = 실제로 끝난 날.
  - 계산: **마지막으로 굳힌 날이 기준점.** 뒤는 앞으로 더하고, 앞은 거꾸로 채운다.
  - 이미 지난 예정일은 **오늘로 밀고 「지연」**(`.ss-dt.late` + `.ss-lt`).
  - ⚠️ 굳힌 기록이 하나도 없으면 종전과 100% 같게 동작한다(`_ssRemain`, 오늘+남은 날수).
- **줄이 두 종류**: `s:<샘플id>` = 샘플 발주 / `i:<아이템id>` = 샘플 발주 아직 안 한 아이템(「미발주」).
  저장 자리도 각자 — 샘플: `s.ssAct`·`s.shootDate`·`s.ssOff` / 아이템: `it.ssAct`·`it.ssShoot`·`it.ssOff`.
  ⚠️ `_ssRows()` 는 `deriveItemBadge(it).phase==='sample' && stage==='none'` 인 아이템만 미발주 줄로 넣는다.
- **체크해서 빼기**: 줄 앞 네모 + 「선택한 N건 빼기」 + 「메인 N건 체크」. 뺀 것은 맨 아래 카드에서 되돌리기.
  ⚠️ **메인·리오더를 자동으로 숨기지 않는다** — 「메인」 표시만 붙인다.
     자동으로 숨기면 왜 사라졌는지 알 수 없고 표에서 되돌릴 수도 없다(사용자 결정).
- **칸 분리**: 「전달 예정」 / 「촬영일」. 위쪽 「촬영 예정일(빈 칸 일괄)」 바는 없앰.
- 전달 텍스트(`ssBuildText`)는 뺀 줄을 제외한다. 형식은 종전 그대로(컨펌일·아이콘 없음).

### 시즌 세부 (봄·여름·가을·겨울 + 내가 추가)
- `SEASON_SUB_BASE`(4계절)은 **그대로 둔다** — 이미 「26FW 겨울」이 들어간 아이템이 있어서
  목록에서 빼면 그 아이템을 수정만 해도 시즌이 조용히 바뀐다.
- 내가 만든 세부는 `S.refData.seasonSubs`. 드롭다운 「＋ 세부 추가…」로 넣는다(띄어쓰기 없이 8자).
- 정규식이 `(봄|여름|가을|겨울)` → `(\S{1,8})` 로 넓어졌다. 목록에 없는 세부도 `seasonRestore` 가 끼워넣어 살린다.

## 2026-08-18c — 샘플 스케줄표: 보류 제외 · 통계 눌러 거르기 · 공장 칸/공장별 묶기

- **보류**(`it.hold`)는 표에서 빼고 맨 아래 「뺀 것」에 「보류」 배지로 내린다. 되돌리기 버튼은 안 준다
  (아이템 「보류」를 풀면 자동 복귀). 거래처 전달 텍스트에서도 빠진다.
  ⚠️ 메인·리오더는 여전히 **자동으로 안 숨긴다** — 보류는 사용자가 직접 찍은 상태라 자동이어도 예측되지만,
     메인은 오더 유무로 자동 판정된 것이라 사용자가 모르는 사이 사라진다.
- **통계 상자가 버튼**(`_ssStat`/`ssSetFilter`/`_ssPass`). 전체·일정 안 나옴·가능·촬영일 미정·미발주·보류·뺀 것.
  같은 걸 다시 누르면 전체. `off`/`hold`는 `_ssPass`가 false → 위 표를 비우고 맨 아래 카드만 보인다.
- **공장 칸 추가** + **묶기 전환**(`ssSetGroup`): 브랜드별(거래처에 보낼 때) / 공장별(공장에 확인할 때).
  안쪽 묶기는 항상 반대 축(브랜드로 묶으면 공장, 공장으로 묶으면 브랜드). 카테고리 묶기는 버렸다 — 실제 자료가 거의 「기타」라 쓸모없었다.
  공장 = `it.sewingFcId` → `S.factories[].name`. 없으면 샘플 발주의 `patternMaker` 첫 곳 + 「(패턴)」.
  ⚠️ 묶기 키(`pt:이름`)와 화면 이름이 어긋나지 않게 **둘 다 첫 곳만** 쓴다.
- `ssBuildText(gkey)` 는 지금 묶기 모드(`window._ssGroup`)에 맞춰 거른다.

## 2026-08-18f — 전달완료 체크 · 줄 순서 고정 · 주말/빨간날 · 컨펌 뒤 재사이클

- **전달완료는 체크로만**(`it.ssDone`/`s.ssDone`, `ssToggleDone`). 전달 칸 아래 「전달완료」 체크.
  ⚠️ 전달 **예정일**을 적어두는 일이 흔하다. 날짜가 있다고 완료로 치면 아직 안 준 것이 「전달완료」로 뜨고
     거래처 텍스트에도 '전달'로 나간다(실제 신고). `ssStage` 는 `_ssGetDone` 만 본다.
- **줄 순서를 이름순으로 고정**(`_ssByName`). 안 하면 `_ssRows()` 순서 = `S.items` 키 순서인데,
  동기화가 끝나면 `_entMerge` 가 `S.items` 를 새로 만들어 키 순서가 바뀐다 → 표가 뒤죽박죽 섞인다(신고).
  카드·소제목도 이름순, 거래처 텍스트도 같은 순서.
- **주말·빨간날 건너뛰기**(`_ssWk(iso,dir)`, 기본 켜짐 `S.refData.ssSkipWeekend`).
  ⚠️ 방향이 중요하다 — 앞으로 계산한 예정일은 **다음 평일**, 거꾸로 계산한 날은 **앞의 평일**.
     둘 다 일정이 실제보다 여유 있어 보이지 않는 쪽이다.
  ⚠️ 사용자가 굳힌 실제 날짜는 안 건드린다(토요일에 진짜 받았을 수 있다).
  빨간날 = `SS_HOLI_DEF`(2026년 손으로 적음, 음력이라 계산 불가) + `S.refData.ssHolidays`(앱에서 추가).
  **해가 바뀌면 표를 갱신하거나 사용자가 추가해야 한다.**
- **컨펌 뒤에 '촬영준비' 단계는 없다.** 수정이 나오면 **패턴 투입부터 한 바퀴 더 돈다**(사용자 확인).
  `fixPrep`/`prepShoot` 삭제 → `confFix`(컨펌→수정 패턴투입) + `shootAfter`(수정샘플 전달→촬영).
  재샘플 구간은 별도 날수 없이 `_ssCycle(L)`(patDone+patSam+samDone+samDeliv)을 **그대로 다시 쓴다**.
  전달→촬영 = `_ssTail(L)` = delivConf + confFix + _ssCycle + shootAfter.

## 2026-08-18g — 작지: 엔터로 아래 칸 · 다른 아이템 도식화/치수 가져오기

- **치수 표에서 엔터 = 아래 칸, Shift+엔터 = 위 칸**(`tpSpecKeyInit`, `tpOpen` 에서 1회 등록).
  `table.tp-spec` 안에서만 동작한다. 같은 **열**을 유지한 채 다음 줄의 input 으로 간다.
- **다른 아이템 도식화 가져오기**(`tpSketchPick`/`tpSketchTake`) — 도식화 칸 왼쪽 아래 「다른 아이템」 버튼.
  카드는 **그림만** 보여준다(품명·품번 안 띄움, 검색은 이름·품번으로 됨, 마우스 올리면 tooltip).
  ⚠️ 가져올 때 **그림 파일을 이 아이템 것으로 새로 올린다**(fetch→blob→tpUpload). 업로드 못 하면 주소 복사로 물러난다.
     주소 복사도 안전하긴 하다 — 작지 그림은 바꿀 때 옛 파일을 지우지 않고 새 타임스탬프 파일을 올리기 때문.
     그래도 나중에 파일 정리 기능이 생기면 깨지므로 복사본이 기본.
- **다른 아이템 치수 가져오기**(`tpSpecPick`→`tpSpecOpts`→`tpSpecTake`) — 치수 머리 「불러오기」 버튼.
  **가져올 사이즈 → 넣을 사이즈**를 고른다(S/M/L 짜리에서 FREE로 가져오기 가능). 패턴·완성·편차 각각 선택.
  두 방식: **통째로 바꾸기**(측정부위 목록까지 교체, 기존 값 지워짐 — confirm 물음) / **빈 칸만 채우기**(이름 같은 부위의 빈 칸만).
  ⚠️ 값은 전부 **복사**된다(JSON 복사). 원본 아이템을 고쳐도 가져다 쓴 쪽은 안 바뀐다 — 검사로 확인함.

## 2026-08-18i — 샘플 스케줄표: 브랜드 순서 · 소제목 흰 상자

- **브랜드는 ㄱㄴㄷ이 아니라 「브랜드 관리에 등록된 순서」**(`_ssBrandOrd` = `getBrands()` 배열 index).
  아루드가 맨 위여야 하는데 이름순이면 더프루토가 먼저 온다. 미지정은 맨 뒤.
  공장으로 묶었을 때 안쪽 소제목(브랜드)에도 같은 순서를 쓴다(`_ssKeyOrd(k,isBrandAxis)`).
  공장 축은 종전대로 이름순(미지정만 뒤).
- 소제목 줄(`tr.ss-cat`)은 **검정 채움 → 흰 바탕 + 위아래 검은 선**.

## 2026-08-18j — 브랜드 라벨 「불러오기」가 왜 비었는지 알려주기

신고: 「라벨 사진이 안 불러와져서 내가 넣었어 / 왜 안 불러와지는 거지」.
원인이 ①아이템에 브랜드 없음 ②브랜드관리에 등록 자체가 없음 ③등록은 됐는데 사진이 없음 — 셋 중
무엇인지 알 수 없는 게 문제였다(예전엔 alert 하나 띄우고 창을 아예 안 열었다).

- `tpBrandAssetPick` 이 **창을 무조건 연다.** 사진 없는 항목도 회색 「사진 없음」으로 같이 보여준다.
- 항목마다 **어느 칸에 등록된 것인지**(메인라벨·케어라벨·완성부자재·단추로고) 함께 띄운다. 검색도 그 이름으로 된다.
- 등록이 하나도 없으면 「브랜드관리 → 그 브랜드 → … 칸에 먼저 넣어주세요」로 안내.
- 브랜드 미지정이면 아이템 이름을 넣어 「아이템 수정에서 브랜드를 골라주세요」로 안내.
- 사진 없는 항목은 눌러도 안 들어간다(cursor:not-allowed).

## 2026-08-18k — 아이템 카드에 「1회비」 묶음 (패턴비·샘플비·그래이딩비 + 패턴실·샘플실)

- 아이템 리스트 카드의 「가공비 N ▾」 **아래에 「1회비 N/5 ▾」** 접이식 묶음을 추가. 같은 모양, 머리만 노란색(`.nc-once-tg`).
  숫자 3칸(`patternCost`·`sampleCost`·**`gradingCost` 신규**) + 글자 2칸(**`patternMaker`·`sampleMaker` 신규**).
  글자 저장은 `setItemText(id,key,val)`(신규, 숫자는 기존 `setItemCost`).
- **아이템 수정 폼에도 같은 칸을 넣었다.** 안 넣으면 폼 저장 때 카드에서 적은 값이 날아간다.
  ⚠️ `saveItemForm` 에서 세 새 필드는 **칸이 화면에 없으면 옛 값을 지킨다**(`_prev` 폴백).
     공임 0원 사고와 같은 함정 — 없다고 0으로 밀면 안 된다. 임시저장 담기/되살리기에도 넣었다.
- **원가에서 그래이딩비는 패턴비·샘플비와 똑같이 취급**한다(onceParts·원가계산서 행·`inclOnce` 합계).
  기본값이 0이라 기존 계산 결과는 안 바뀐다(검산 13문제 69검사 통과로 확인).

## 2026-08-18m — 1회비 다시 디자인: 떠 있는 쪽지 · 회차(1차·2차) · 업체 선택

**신고 3건을 한꺼번에 고침.**

1. **카드가 찌그러짐** — 카드는 `grid: 158px / minmax(0,1fr) / auto`. 펼친 칸이 자리를 차지하면
   auto 칸이 부풀어 **아이템 이름이 한 글자 폭으로 세로로 눌린다**.
   → 펼친 칸을 **떠 있는 쪽지**로(`.nc-cost-body.open{position:absolute;right:0;top:100%}`).
     `.nc-cost{position:relative}`, `.nc-c3 .nc-cost-body`의 `white-space:nowrap` 해제.
   ⚠️ 앞으로 카드 안에 펼침 UI를 넣을 땐 반드시 absolute — 흐름에 넣으면 또 찌그러진다.
2. **아무거나 누르면 접힘** — 값 하나 고칠 때마다 `renderItemsList()`가 카드를 통째로 다시 그려서였다.
   → 열어둔 칸을 `window._ncOpen={id,w}`에 기억하고 그릴 때 되살린다(`_ncIsOpen`). 접는 건 토글을 눌렀을 때만.
3. **패턴비가 1차·2차로 또 생김** — 금액을 회차 배열로(`it.patternFees`/`it.sampleFees` = `[{amt}]`).
   ⚠️ 원가·분석은 지금도 `it.patternCost`/`it.sampleCost`를 읽는다.
      그래서 회차를 고칠 때마다 **합계를 그 칸에 다시 써 넣는다**(`_feeWrite`) — 돈 계산 코드는 손대지 않았다.
   ⚠️ `_feeArr`는 **읽기 전용**(옛 단일 금액을 1차로 보여줄 뿐 자료를 만들지 않는다) — 열어보기만 해도
      '내가 고침'으로 찍히면 동기화가 흔들린다.
   ⚠️ `saveItemForm`은 회차가 2건 이상이면 폼의 한 칸으로 덮어쓰지 않는다(2차·3차 유실 방지).
- **패턴실·샘플실은 등록된 공장 목록에서 고른다**(`_ncMakerOpts`, 종류별 optgroup, 패턴/봉제를 맨 앞).
  「직접 적기…」도 있고, **목록에 없는 옛 값도 절대 안 지운다**(맨 위에 selected로 살려둠).
  배치는 「패턴실 — 패턴비 회차들」, 「샘플실 — 샘플비 회차들」로 짝을 붙였다.

## 2026-08-18n — 1회비 쪽지 레이아웃 정리 · 패턴실/샘플실 목록 좁히기

- 쪽지를 **폭 고정(330px) + 세로 쌓기**로 바꿈. 가로로 늘어놓으니 쪽지 밖으로 삐져나왔다(신고).
  구조 = `.nc-oblk`(블록) > `.nc-oh`(라벨+업체) + `.nc-fees`(회차 줄들, 라벨 폭만큼 들여쓰기) + `.nc-fbot`(＋차수·합계).
- **패턴실 칸엔 패턴실만, 샘플실 칸엔 봉제집만** 뜬다(`_ncMakerOpts(cur,pref)`).
  ⚠️ 공장 종류 이름이 자리마다 '패턴'/'패턴실'로 섞여 들어와 **포함 여부**로 본다(`t.indexOf(w)>=0`).
  지금 적힌 값이 목록에 없어도 맨 위에 살려둔다. 「직접 적기…」 유지.

## 2026-08-18p — 1회비 쪽지: 가공비와 같은 줄 모양 + 하단 ＋ 하나

사용자가 그려준 대로.
- 기본은 **세 줄**: `패턴` / `샘플` / `그래이딩`. 그 위에 각각 `패턴실` / `샘플실` 고르는 줄.
  줄 모양은 가공비 쪽지와 **완전히 같다**(`.im-labor` = 이름 왼쪽 · 숫자 오른쪽 · 「원」).
- 맨 아래 **＋ 차수 추가** 하나. 누르면 「어느 걸 늘릴까요? [패턴 N차] [샘플 N차] [취소]」.
  차수가 2개 이상이 되면 이름이 `패턴 1차`·`패턴 2차`로 바뀌고 `× 지우기`와 합계 배지가 붙는다.
- `itemFeeSet` 은 **없는 자리에 처음 적으면 그때 만든다**(빈 1차 칸이 늘 보이므로 필요).
- `itemFeeAdd` 는 비어 있으면 1차부터 만들고 2차를 얹는다. 옛 단일 금액은 1차로 살아남는다.

## 2026-08-18q — 「1회비」 탭 신설 (단가 비교 탭 대체) · 차수는 2차부터 · 쪽지 칸 통일

### 1회비 탭 (`renderOnceFee`, `#pane-oncefee`)
사용자 결정: **단가 비교 탭은 이제 안 쓴다 → 그 자리를 1회비가 차지**한다.
(탭 버튼·메뉴·탭 배열·렌더 분기에서 `pricecompare`를 `oncefee`로 교체. **pc* 함수와 저장된 견적 자료는 지우지 않았다** — 코드에 남아 있고 데이터도 그대로다.)
- 묶기 세 가지: **종류별 / 패턴실별 / 샘플실별**(`_of.mode`). 안쪽 요약은 늘 반대 축.
  - 종류별 = 「같은 맨투맨인데 왜 비싼지」 · 패턴실별 = 「어느 집이 싼지」 (사용자 원문 그대로의 두 질문)
- 종류(`it.kind`)는 이름으로 짐작(`OF_KINDS`/`_ofGuess`, 맨투맨을 티셔츠보다 먼저 본다).
  ⚠️ **화면 그릴 때 저장하지 않는다** — 사용자가 드롭다운으로 고를 때만 `it.kind`에 쓴다.
- 평균 대비 ±15% 넘으면 「평균보다 N% 비쌈/쌈」(빨강/초록). 패턴실 요약칩은 가장 쌈=초록, 가장 비쌈=빨강.
- 표에서 바로 고친다 — 전부 아이템의 같은 필드(`_feeArr`/`itemFeeSet`/`setItemMaker`/`setItemCost`)라 카드 「1회비」와 같은 값.
- 「적은 것만」 체크(기본 켬)로 값 없는 아이템을 숨긴다.

### 카드 쪽지 다듬기
- **차수 추가는 언제나 2차부터**(`Math.max(2,len+1)`). 1차는 위에 늘 있는 칸이라 「1차 추가」는 말이 안 된다.
- **칸·간격 통일**: 쪽지 줄을 `grid-template-columns:62px 1fr 16px 22px; gap:8px` 로 바꿔
  라벨/입력칸/「원」/× 를 같은 격자에 올린다. **select 와 input 의 높이(30px)·폭(100%)·글씨를 동일하게** 맞췄다
  (디자인 지침: 같은 영역의 보더 높이는 동일).

## 2026-08-18r — 패턴비에 종류 (새패턴·수정패턴·출력)

- 패턴비 줄마다 **무엇 때문에 든 돈인지** 고른다: `PF_TYPES=['새패턴','수정패턴','출력']` → `fee.t`.
  카드 쪽지에서는 **라벨 자리가 종류 드롭다운**이 된다(라벨 칸 62→82px, 쪽지 폭 330→352px).
  1회비 탭에서도 금액 앞에 종류 드롭다운이 붙는다.
- ⚠️ 옛 자료엔 `t`가 없다 → `_feeType(f,i)` 가 **읽을 때만** 1차=새패턴 / 그 뒤=수정패턴으로 채워 보여준다. **저장하지 않는다.**
- `itemFeeAdd('pattern')` 이 만드는 새 줄은 `수정패턴`. ＋버튼 문구도 「패턴 한 줄」로(차수 개념이 아니라 종류별 줄이라).
- 샘플비에는 종류를 붙이지 않는다(요청 범위 밖).
- 거래처 전달 텍스트에도 패턴 줄이 2개 이상이면 `[새패턴 110,000 / 수정패턴 15,000]`처럼 붙는다.

## 2026-08-18s — 케어라벨도 종류대로 불러오기

신고: 「케어라벨 30」·「케어라벨 15」를 나눠 쓰는데 작지엔 늘 같은 사진만 나왔다.
- 원인: 메인라벨은 부자재 줄에서 **고른 이름**으로 브랜드 목록을 찾는데(`tpBrandLabelImgByName`),
  케어라벨은 「브랜드당 1개」라 보고 **케어라벨 목록의 첫 사진**을 무조건 가져오고 있었다.
- 고침: 케어라벨도 메인라벨과 **완전히 같은 방식**. `_mainNames(t)`로 고른 이름마다 칸을 만들고
  (`labelCare`, `labelCare2`, …) 이름으로 사진을 찾는다.
  ⚠️ **첫 칸만** 예전 폴백(첫 사진)을 남겼다 — 이름을 안 골라둔 옛 아이템이 갑자기 빈칸이 되지 않게.
     둘째 칸부터는 폴백 없음(엉뚱한 사진이 붙는 게 더 나쁘다).
- 쓰는 쪽: 부자재의 케어라벨 줄에서 **브랜드관리에 등록한 이름과 똑같이** 고르면 그 사진이 나온다.

## 2026-08-18t — 케어라벨에도 「라벨명(브랜드별 등록)」 고르는 칸

사용자 「어디서 고르면 돼?」 — 고를 데가 아예 없었다.
- 메인라벨엔 **칩 + 드롭다운 + ＋새 라벨**이 있는데 케어라벨엔 「라벨 이름」 자유입력 하나뿐이었다.
  게다가 그 자유입력의 자동완성(`dl-carelabel`)은 **다른 아이템이 쓴 이름만** 모았지
  **브랜드관리에 등록한 케어라벨은 아예 안 나왔다.**
- 이름 체계가 둘로 갈라져 있는 게 진짜 문제였다:
  부자재 「라벨 이름」=`가로15 무광양면공단`(규격) / 브랜드관리=`케어라벨 15`. 그래서 이름으로 사진을 못 찾았다.
- 고침: 케어라벨 줄에 **`careLabelChipsHTML`**(메인라벨과 같은 모양, 초록)을 넣었다.
  `addCareLabelEntry` / `removeCareLabelEntry`, 첫 라벨을 고르면 단가 자동(비어 있을 때만).
  ⚠️ **케어라벨엔 브랜드 선택칸이 없다** → 아이템의 브랜드(`f-brand`)를 쓴다.
  ⚠️ `colTR`의 careLabel 갈래에서 `labelNames`를 읽되 **`labelName`은 덮지 않는다**(메인라벨과 다른 점 —
     케어라벨의 labelName은 부자재 규격명이라 성격이 다르다).
  ⚠️ `buildCareLabelDB`가 브랜드 등록 이름도 자동완성에 합친다.

## 2026-08-18u — 그래이딩도 회차로

- `그래이딩`도 패턴·샘플과 똑같이 `_feeBlock('grading',…)`. `it.gradingFees` + 합계는 `it.gradingCost`에 자동 반영
  (원가·분석 코드는 여전히 `gradingCost`만 읽는다 — 손대지 않았다).
- ＋ 물음줄에 「그래이딩 N차」 추가, 1회비 탭의 그래이딩 칸도 여러 줄 지원.
- `saveItemForm` 방어 목록에 `grading` 포함(폼 한 칸이 2차·3차를 덮지 않게).

## 2026-08-18v — 그래이딩 옆에 사이즈 수

- 그래이딩은 사이즈 수에 비례하므로 「**4사이즈 · 사이즈당 18,750원**」을 그래이딩 블록 아래에 붙인다
  (`it.sizes.length`, 사이즈 미지정이면 그렇게 표시). 1회비 탭의 그래이딩 칸에도 같은 줄.
- `_feeBlock(kind,lbl,selHtml,note)` — 넷째 인자로 덧붙임 문구를 받는다.

## 2026-08-18w — 브랜드별 기본 패턴실·샘플실

사용자: 「더프루토는 패턴실 기본을 제이제이로, 아루드는 그대로」.
- `S.refData.brandDefaults[brandId] = {patternMaker, sampleMaker}` (`setBrandDef`).
- 읽기는 `itemMaker(it,key)` — **아이템에 값이 없을 때만** 브랜드 기본을 보여준다.
  ⚠️ **보여주기만 한다. 아이템 자료를 만들지 않는다**(렌더 중 저장 금지 원칙).
     아이템에서 다른 곳을 고르면 그게 이긴다. 기본을 바꾸면 안 적은 아이템 전부가 따라간다.
- 설정 자리: **1회비 탭 상단 「브랜드 기본값」** 버튼 → 브랜드마다 패턴실·샘플실 드롭다운 한 줄.

## 2026-08-18x — 「샘플 코멘트」 탭 신설 + 아이템 카드 「진행」 버튼

미팅하면서 사진 보며 「이거 고쳐야 한다」를 적고, 공장에 보낼 것만 따로 뽑는 화면.
- **진행 창을 따로 두지 않는다** — 카드를 눌러 **그 자리에서 펼친다**(사용자: 「나눌 이유 없다」).
  접힌 카드 = 미팅용(앞·뒤 + 코멘트 3개 + 「외 N개」) / 펼친 카드 = 적는 용(회차별 사진 4칸 + 코멘트 + ＋코멘트).
  펼친 카드는 `grid-column:1/-1`로 한 줄 전체를 쓴다.
- **사진은 회차마다 따로**(1차·2차 비교용, 사용자 결정). `it.smpRounds[i].pics.{front,back,lining,detail}`.
- **작지의 「샘플 사진」 탭은 그대로 둔다** — 여기 사진과 별개(사용자 결정). 작지 인쇄물 불변.
- 자료: `it.smpRounds = [{n,date,pics,cms:[{k,t,d,fix}]}]` — 최신 회차가 앞.
  ⚠️ `_scRounds`는 **읽기 전용**. 화면 그릴 때 자료를 만들지 않는다.
- 사진은 작지와 같은 길: `tpCompress` → `tpUpload(itemId,'smp_<회차>_<칸>')` → 주소만 저장.
  올리기 실패하면 그림(dataURL)을 로컬에만 두고 그렇게 알린다(클라우드 업로드 시 `_stripDataUrlsDeep`가 걸러낸다).
- 아이템 카드 **「진행」 버튼(주황, 원가 앞)** → `scOpenItem(id)` = 탭 이동 + 그 카드만 펼침. 옆 빨간 숫자 = 수정필요 개수.
- 텍스트 두 가지: **텍스트 복사**(확인됨까지 전부) / **공장용 복사**(수정필요만 + 「수정 부탁드립니다」 마무리).

## 2026-08-18y — 샘플 스케줄표 「재진행」 · 「진행」 눌렀을 때 1차 자동 생성 · 탭 위치

- **재진행**(`ssRestart`) — 전달완료된 줄의 **맨 오른쪽**에 「＋ N차 재진행」. 1차 마감 → 2차로 넘어간다.
  ⚠️ 굳혀둔 날짜를 그냥 지우지 않고 `ssHist`에 넣어 보관한다(1차가 언제 나왔는지 나중에 봐야 한다).
  촬영일은 그대로 둔다(같은 촬영을 향해 다시 도는 것). 회차는 `ssRound`(기본 1), 이름 옆에 2차부터 배지.
  표 열이 11개가 됐다 — 소제목 `colspan` 도 11.
- **「진행」 버튼 눌렀는데 적을 데가 없던 것**(신고): `_scRows`가 회차 없는 아이템을 걸러서 목록에 안 떴다.
  → `scOpenItem`이 **1차를 만들어 준다**(버튼 누름 = 사용자 행동이라 저장해도 안전).
    거르개(시즌·브랜드·수정필요만)도 함께 풀어 그 카드가 반드시 보이게 한다.
- 나란한 일이라 **「샘플 코멘트」 탭을 「샘플 스케줄표」 바로 아래**로 옮겼다(사용자 요청). 메뉴 그룹도 '작업'으로.

## 2026-08-18z — 샘플 코멘트: 날짜칸 폭 · 회차 지우기 아래에도

- 회차 머리의 날짜 칸이 남는 폭을 다 먹어 **달력 아이콘이 멀리 밀려 있었다**(신고) → `width:142px;flex:0 0 auto`.
- **「＋ 회차 추가」 옆에 「－ N차 지우기」** 추가(빨강). 회차 머리의 「회차 지우기」는 그대로 둔다.
  코멘트는 줄마다 `×`, 사진은 사진 위 `×`로 지운다.

## 2026-08-19a — 샘플 코멘트: 분류에 「패턴」 · 사진 끌어다 놓기·붙여넣기

- `SC_KINDS`에 **패턴** 추가(봉제 다음).
- 사진칸에 **끌어다 놓기**(`scDropImage`, 놓는 동안 `.sc-pic.drag` 표시)와 **붙여넣기(Ctrl+V)**.
  ⚠️ 붙여넣기는 대상이 필요하므로 **마우스를 올려둔 칸**(`scPicHover` → `window._scPasteAt`)에 넣는다.
     `document`의 paste 리스너는 `scPasteInit()`로 **한 번만** 등록하고, 샘플 코멘트 탭이 보일 때만 동작한다.
- 파일 처리는 `_scPutFile(file,ctx)`로 모았다(클릭 업로드·드롭·붙여넣기 공용).

## 2026-08-19b — 샘플 코멘트를 「자유롭게 적는 두 칸」으로

사용자: 「이렇게 적으면 적었던 내용 수정이 힘들다. 작업지시서처럼 적기만 되게, 위아래 2칸으로 패턴 코멘트 / 샘플 코멘트」.
- 줄 단위 추가/삭제(분류 드롭다운 + ＋코멘트 + × )를 **버리고**, 회차마다 **textarea 두 개**:
  `patMemo`(패턴 코멘트) / `smpMemo`(샘플 코멘트). 작업지시서 지시사항과 같은 모양(라벨 바 + 큰 칸).
- 「수정필요/확인됨」은 **회차 단위 토글**(`r.done`)로 옮겼다. 아이템 「진행」 배지 = 적은 내용이 있고 아직 확인 안 된 회차 수.
- ⚠️ **옛 줄 코멘트(`r.cms`)는 지우지 않는다** — `_scMemo`가 샘플 칸에 `[분류] 내용` 으로 이어붙여 **보여만 준다**.
  사용자가 그 칸을 한 번 고치면 그때 `smpMemo`로 저장되고 `cms`를 정리한다.
- 공장용 복사는 **확인 안 된 회차만** 담는다(회차 단위).
- 안 쓰게 된 `scAddCm`/`scDelCm`/`scToggleFix`/`_scCmHTML` 은 지웠다.

## 2026-08-19c — 아이템 부자재 구역 재정리: 좌 요약목록(거래처 묶음) / 우 카드 1개 · 추가버튼 20개→1개

사용자 결정(역인터뷰): 화면 정리가 목표. 자주 하는 일 = 새 아이템에 부자재 넣기·단가 갱신. 줄엔 용도·이름·요척·단가·단가장 등록여부만.
타입(롤·단추·야드) 배지·색 구분 없앰, 컬러도 줄에서 뺌. 거래처 정보는 글자 한 줄. 규격·단위·단가는 카드에서 수정 불가(단가장에서만).
- **설계 원칙 = 카드 DOM은 안 건드림.** `#trim-rows`(colTR가 읽는 실제 카드)는 그대로 두고, 왼쪽에 **읽기전용 요약 목록 `#trim-list`**(`renderTrimSummary`)를 새로 그린다.
  카드는 선택된 1개만 `.tcd-open`(CSS로 나머지 숨김) → 수집·저장·발주·원가 **0줄 변경**. 요약은 카드 `input` 이벤트에 350ms 뒤 `colTR()+renderTrimSummary()`만(카드 재렌더 X → 타이핑 안 날아감).
- **레이아웃**(main.css, 두 테마 공통): `.trim-split` = `minmax(0,1fr) 560px`, 오른쪽 `sticky + 자체 스크롤`. **≥1200px에서만 2단**이고 `#ipf`(아이템 폼, 인라인 max-width 680)를 **1180으로 넓힘**(`!important`). 그 밑은 세로 스택(목록→카드), 폰은 용도·등록배지·요척칸 숨기고 이름·단가만.
- 오른쪽 카드: 탭(`.tcd-tab`) 숨기고 **`.tcd-pane` 전부 표시**(구역 제목은 `::before` content: 기본/디테일/적용컬러/가공·염색/옵션). 헤더 `.tcd-row`는 클릭 막음(원래 접기라 카드가 사라짐)·타입칩 숨김. 순서이동·복제·삭제 버튼(`.tcd-tact`)은 유지.
- **단가장 등록된 줄**(`_pbHasTrim`) → `_lockTrimPbFields()`(renderTrimRows 끝): `size/zipperSize/zipperLength/buttonSize/snapSize/biasSpec/yardsPerRoll/unitPrice` readonly, `rollUnit/packUnit/unit` select는 `.tcd-ro`(pointer-events 차단, 값은 그대로 → colTR 불변), 단가 옆 「단가장에서 수정」(`openBookWindow('trim')`). 거래처 `.tcd-frow`에 `.tcd-suprow` 붙여 숨기고 앞에 `.tcd-supline`「메이드 B동 2층 215호 · 단가장에서 불러옴」 삽입(입력 DOM은 남김). 미등록 줄은 전부 그대로.
- **추가 = 「+ 부자재 추가」 하나** → `openTrimPickerNew(sup)`: 기존 `openTrimPicker`에 **인라인 모드**(`#trim-picker-host`에 마운트, 모달 아님; 호스트 없으면 옛 모달 폴백). 고르면 `_pbMatAddKey(m)`(단가장 자재 orderType+플래그 → addTrimRow 키)로 줄을 먼저 만들고 기존 `_trimPickApply`(autofillTrim). 「새 부자재 만들기」= 종류 칩 9개(`_TRIM_NEW_TYPES`) + 이름·단가 → 단가장 등록 후 줄 생성(yardp/buttonloop는 pb에 `plainYard/isButtonLoop` 플래그 저장). 거래처 헤더 「+ 여기에 추가」= 검색어에 거래처 미리 채움.
- 요약 헤더 **「벌당(순)」 합계** = `_trimPerPcsCost` (요척×단가, 롤은 ÷롤당y, 로스·올림·미니멈·가공비 제외) — 원가계산서와 다를 수 있어 라벨에 (순).
- 아무것도 안 열려 있으면 첫 부자재 자동 선택. 여러 개 열려 있으면 마지막 것만(단일 선택 강제).
- 시안: `mockups/trim-split.html`(+`-phone`). 옛 타입 버튼 20개·하단 추가상자 삭제(`.trim-add-grid` CSS는 잔존·무해).
- ⚠️ 함정: 아이템 폼 `#ipf`는 인라인 `max-width:680px` — 2단을 넓히려면 그 규칙을 이겨야 함. 카드 헤더 클릭은 접기 토글이라 2단에선 반드시 막을 것.

## 2026-08-19c — 코멘트 칸에 눌렀을 때 색 바뀌는 것 제거

사용자: 「이렇게 색 바뀌고 이런 거 하지 마. 지시서처럼 그냥 냅둬」.
`#sccm-body .sc-ta:focus` 의 테두리 강조·배경(#FFFDF3)을 없앴다. 작업지시서 지시사항 칸과 같이 아무 변화 없음.

## 2026-08-19d — 애플펜슬 손글씨·사진 위 표시 · 키보드 가림 방지

- **손글씨 / 사진 위 표시**(`scDrawOpen(id,ri,bgUrl)`) — 한 캔버스 창으로 둘 다 한다.
  사진칸의 「표시」 버튼은 그 사진을 배경으로 열고, 메모 아래 「＋ 손글씨」는 빈 칸으로 연다.
  ⚠️ **원본 사진을 덮지 않는다** — 그린 결과는 `r.hands[]` 에 따로 쌓는다(되돌릴 수 없게 만들면 안 된다).
  ⚠️ **손바닥 눌림 방지**: 펜(`pointerType==='pen'`)이 한 번 닿으면 그 뒤 `touch`는 전부 무시.
  ⚠️ 창 자리잡기는 **인라인 style**로 준다(_tpOvl·dosikPick과 같은 방식). 클래스에만 맡겼더니 28px로 쪼그라들었다.
  ⚠️ 캔버스 크기는 **그릴 때** 바깥 창(.sc-dw) 기준으로 재고, `clientWidth`가 0이면 60ms 뒤 다시 잰다.
     (안 보이는 탭에선 뷰포트가 0으로 잡힌다 — 실제로 겪음). rAF에 기대지 않는다.
- **키보드 가림 방지**(`scFocusFix`) — 코멘트 칸을 누르면 `visualViewport` 높이로 가려졌는지 보고 가운데로 스크롤.
  ⚠️ 아이패드의 「떠 있는 키보드」 자체는 앱에서 못 바꾼다(두 손가락으로 벌리면 원래대로).
- 코멘트 칸에 **글자로** 쓰려면 아이패드 **스크리블**을 쓰면 된다 — 앱에서 할 게 없다(iPadOS 17+ 한국어).

## 2026-08-19e — 부자재 단가장을 표 하나로 (거래처 카드 → 플랫 표)

사용자 결정: 「한눈에 들어오는 게 없다. **카드 말고 표**」 + 「거래처부터 찾는 방식은 그대로」.
열은 사용자가 쓰던 시트 그대로 — `유형 · 품명 · 규격(숫자+단위) · 단위 · 묶음 · 개당단가 · 묶음단가 · 세트 · 갱신`.

- `renderBookList` 에서 **`_scope==='trim'` 이면 `renderPbTrimTable()` 로 분기**하고 리턴.
  **원단 단가장은 예전 카드 그대로** — 손대지 않았다.
- 거래처는 **검은 띠**. 띠를 누르면 그 거래처의 건물·층·호수·전화·메모 줄이 펼쳐진다(정보 편집은 거기서).
- **색상·네고가 열은 뺐다**(사용자 결정). ⚠️ **자료는 안 지운다** — 색상은 품목 키에 그대로 있고
  품명 옆에 작게 붙여 보인다(안 보이면 중복처럼 오해된다). `negoPrice` 값도 남아 있다.
  확인해보니 `negoPrice` 는 화면 외에 **쓰는 곳이 없었다**(아이템 자동채움은 `unitPrice` 를 쓴다).
- **새로 만든 칸은 딱 둘** — `packPrice`(묶음단가 직접값)·`setItems`(세트 구성).
  나머지는 있던 칸 재사용: 유형=`category` / 묶음=`yardsPerRoll` / 규격=`size` / 단위=`orderType`.
- **규격은 숫자·단위 두 칸**이지만 저장은 `size` 한 칸(`_pbSplitSpec`/`_pbJoinSpec`).
  ⚠️ `pbKey(name,color,size)` 라 **키는 안 건드린다** — size 값만 바꾼다(기존 `updatePBSpec` 과 같은 방식).
- **묶음단가는 비우면 자동**(묶음×개당). 적으면 적은 값이 이긴다.
- **세트**: 구성마다 `n`(A·B…)·`nm`(품명)·`p`(단가). ⚠️ **합계를 `updatePBPrice` 로 `unitPrice` 에 써 넣는다** —
  원가·발주는 지금도 `unitPrice` 를 읽으므로 돈 계산 코드를 하나도 안 건드리고 맞는다(1회비 회차와 같은 방식).
  이력·아이템 전파도 기존 함수를 타므로 그대로 돈다.
- **단가 변동 표시**: `priceLog` 의 마지막 '매장' 항목으로 `▲+10`(빨강)·`▼-40`(초록). 90일 지나면 갱신일 빨강 + 「N일」.
- 아직 안 한 것: **발주서에서 세트 부품만 골라 보내기**, **아이템에서 이 표로 고르기** — 돈 경로라 따로.

## 2026-08-19f — 단가장 표 다듬기 + 「＋ 품목」 되살리기

- **품명 옆 색상 표시 제거**(사용자 요청). 자료(품목 키의 color)는 그대로.
- **초록 「자동」 배지가 칸에 잘려 안 읽혔다** → 배지를 없애고 빈 칸 안내문을 **「자동 26,000」**으로.
  세트의 「구성합」 배지도 같은 이유로 아래 회색 글씨 「구성 합계」로.
- ⚠️ **표로 바꾸면서 「＋ 새 품목 추가」가 통째로 빠져 있었다**(신고). 거래처 띠 오른쪽 **「＋ 품목」**으로 되살림
  (`pbTrimAddMat` — 만드는 규칙은 기존 `pbSaveNewMat` 과 동일: `pbKey(이름,'','')`, trim/count/단가0).
  **교훈: 카드→표처럼 화면을 통째로 바꿀 땐 옛 화면의 버튼을 하나씩 세어 옮길 것.**

## 2026-08-19h — 단가장 표: 유형 대분류 · 정보 한 줄 · 새 품목은 빈 줄로 · 칸 넓힘

- **유형마다 대분류 띠**(`tr.pbt-cat`) — 거래처 안에서 유형이 바뀔 때마다 「단추 2」처럼 한 줄.
- **새 품목은 창(prompt) 대신 표 맨 아래 빈 줄**. 이름은 `새 품목`·`새 품목 2`…로 만들고 그 칸에 커서를 둔다
  (키에 이름이 들어가는 구조라 빈 이름은 못 쓴다). 새 줄은 노랗게 표시.
- ⚠️ **`td` 에 `display:flex` 를 주면 `colspan` 폭이 깨져 세로로 접힌다**(거래처 띠·정보 줄에서 실제로 겪음).
  → 안쪽 `div`(`.pbt-supbar`/`.pbt-inf`)로 감싸고 그 div 에 flex 를 준다. 정보 줄은 `flex-wrap:nowrap`으로 **한 줄**.
- 버튼을 `float:right` 로 붙이면 **가로로 넓은 표에선 화면 밖으로 잘린다** → 이름 옆에 나란히.
- 칸 넓힘: 유형 86→112 · 품명 150→210 · 단위 74→96 (이름이 「미분」「단」처럼 잘리던 것).

## 2026-08-19i — 부자재 결제체크 「아이템별」을 카드로 + 통합 명세서

사용자: 「공장 결제관리처럼 아이템별로 나누고, 선택해서 통합명세서」. 묶음 기준은 **거래처 × 브랜드**.
- **아이템별 보기만** 카드로 바뀐다(`_tlView==='item'` && 미결제). 「날짜순」·「결제완료」 보기는 예전 표 그대로.
- ⚠️ 카드 모양은 결제관리의 클래스(`ip-card`/`ip-head`/`ip-chk`/`ip-info`/`ip-title`/`ip-line`/`ip-summary`)를
  **그대로 재사용**한다. 새 스타일을 만들면 두 화면이 갈라진다.
- 카드 = 체크박스 + 브랜드 + 아이템명 + 「미결제 합계(VAT 포함)」. 카드 안은 **발주일별로 묶고**(`tl-grph`)
  줄은 기존 `_tlRowHTML` 그대로(수량·단가 수정, 줄별 결제 체크가 다 살아 있음).
- 카드 아래 **「✓ 이 아이템 결제완료」**(`tlPayItem`) — 그 아이템의 미결제 줄만 한 번에.
- 고르면 위에 **sticky 검은 띠** + **「통합 명세서 만들기」**(`tlBatchReceipt`) → **거래처 × 브랜드**로 한 장씩,
  장마다 「이미지 저장」(`tlBatchSaveImg` → html2canvas → `fpfSaveFile`).
- 고른 목록은 `window._tlSel` (키 = `브랜드|아이템명`).

## 2026-08-19j — 부자재 결제체크 = 공장 결제관리와 같은 카드
- **카드가 기본**(`window._tlView` 기본값 `'date'` → `'item'`). 예전엔 표가 먼저 떠서 "카드가 아닌데"로 보였다.
- 「결제완료」 화면도 카드로. 「보기」 토글(아이템 카드 / 날짜순 표)은 미결제·결제완료 둘 다에서 보인다.
- 카드 구조는 결제관리(`renderItemPay`)를 그대로 씀: `.ip-card` > `.ip-head`(체크·브랜드·아이템명·발주일 요약·합계) > `.ip-fcs .ip-fcgrid` > **발주일별 `.ip-fc` 서브카드**(공장 카드에서 「공정별 공장」 자리).
- 서브카드 = `.role`(08/03 발주) · `.nm`(N건) · 줄들 · `.am`(청구/VAT포함) · **`.ip-vatbtn`(VAT 빼기(현금결제))** · `.acts`(명세서 / 결제완료).
- ⚠️ 서브카드가 좁아 결제관리처럼 한 줄에 다 못 넣는다 → `.tl-fln`은 **이름 줄 / 값 줄 2단**. 값 줄에 수량·단가 입력, 금액, 줄별 결제 체크(기존 기능 유지).
- ⚠️ VAT 빼기 플래그는 **새 컬렉션을 만들지 않는다**. 저장·동기화 15군데 등록이 필요해서 이미 등록된 `S.trimLedgerOvr` 안에 예약키 `__vat@{브랜드|아이템}@{발주일}` = `{vatOff:1}` 로 얹었다. (`_tlVatKey`/`_tlVatOff`/`tlToggleVat`)

## 2026-08-19k — 부자재 결제체크 카드: 넘침 방지 + 거래처 이름
- 서브카드 = 결제관리와 같은 배치. `.role`=「08/11 발주 · 1건」, **`.nm`=거래처(부자재집) 이름** (결제관리에서 `.nm`이 공장 이름인 자리).
- 카드 머리 첫 배지도 거래처(`.tl-supbadge` 남보라).
- ⚠️ 결제관리 줄은 글자뿐이라 안 넘치지만 부자재 줄엔 **입력칸 2개**가 있어 좁은 칸에서 옆으로 삐져나갔다.
  → `.tl-cards` 래퍼를 씌우고 그 안에서만 `min-width:0`·`overflow:hidden`·금액 `flex:1 1 auto`·900px 이하 1열. **결제관리 CSS는 안 건드림.**
- 검증: 360/390/430/768px 전부 `scrollWidth>clientWidth` 없음.

## 2026-08-19m — 부자재 결제체크 윗부분도 결제관리 톤으로
- 예전엔 윗 컨트롤바만 **레트로**(2.5px 검정테·네온·노랑)라서 아래 카드(결제관리 룩)와 따로 놀았다. 날짜칸도 폭이 없어 한 줄씩 늘어졌다.
- 이제 `_tlEnsureStyle` 안의 `html[data-theme="retro"] .tl-*` 블록을 **중립값으로 덮음**(지우지 않음 — 되돌릴 땐 그 블록만 원복).
- 값: 테두리 `1px #e5e7eb`, 라운드 8~12px, 그림자 없음, 선택된 칩·세그 `#1f2937`, 결제상태 켜짐 `#047857`.
- `.tl-date{width:138px;flex:0 0 auto}` — 날짜칸이 한 줄 통째로 늘어나던 것 고정.
- 검증용 미리보기: `/tmp/fpf-preview/tltop.html` (mkharness_tltop.py, 윗바+카드+합계를 실제 함수로 렌더)

## 2026-08-19n — 샘플·패턴 지시서 회차 (1차/2차/3차…)
- 「샘플·패턴」 탭이 회차만큼 생긴다. `d.spatRounds=['spat','spat2',…]`, 최대 5차. 1개일 땐 이름 그대로 「샘플·패턴」.
- **회차 = 완전히 따로 노는 지시서 한 장** (사용자 확정 "안 엮이게 해줘")
  · 도식화 `images.{k}Sketch` · 치수 `{k}.spec` · 지시문·전달일·견본·워싱·패턴실·업체명 `{k}.*`
  · 지시서 탭(`sew.spec`/`sewSketch`)과 **안 엮임**. 옛 아이템은 처음 열 때 1회 복사(보이는 건 안 바뀜).
- **원·부자재는 「회차 만들 때 굳히기」**: 아이템에 살아 있는 자료라 회차에 못 넣는다.
  `＋ 회차`를 누르면 **직전 회차를 그 순간 스냅샷**(`{k}.mat={at,fabrics,trims}`)으로 굳히고, 새 회차는 안 굳혀 최신을 본다.
  회차 막대에 「지금 걸로 굳히기 / 다시 굳히기 / 최신 따라가기」.
- ⚠️ **회차를 지워도 키 이름은 다시 안 매긴다**(spat2 지워도 spat3은 그대로). 다시 매기면 남은 회차 내용이 통째로 밀린다. 번호는 화면에서만 순서대로.
- 치수 함수는 전부 경로를 인자로 받게 바뀜: `tpSpecHTML(it,base)` · `tpSpecSecHTML(it,base)` · `tpSpecAdd(base)` · `tpSpecPreset(t,base)` · `tpSpecPick(base)`(→`window._tpSpBase`). **기본값은 예전 그대로 `sew.spec`**.
- 도식화는 `_skSlot(slot,ph)`로 분리(`_sk`는 sewSketch 별칭 유지).
- 검증: `/tmp/fpf-preview/spat.html` (mkharness_spat.py) — 실제 함수로 46개 검사 전부 통과.

## 2026-08-19p — [버그] 발송한 발주서 수량이 요척 바꾸면 따라 바뀌던 것
- 신고: 「요척 0.71로 발주 → 발송완료 → 아이템 요척 0.77로 수정」 했더니 **이미 보낸 발주서 본문이 142y → 154y** 로 바뀜.
  카드 배지는 「발송 · 고정 (아이템·오더수량·요척 바꿔도 이 발주서는 안 변함)」이라 설명과도 어긋났다.
- 원인: `syncOrderMaterialsFromItems`의 「양쪽에 있음」 갈래가 **isSent 상관없이**
  `['totalYards','totalKg','calc']`를 최신값으로 덮어쓰고 있었다. (추가·삭제만 isSent를 봤다)
- 고침: 발송(sent/shipped/arrived)이면 수량을 안 건드리고, 바뀐 게 있으면 `result.frozenQty`에 담아
  동기화 알림에 「이미 발송한 발주서라 수량을 그대로 뒀어요 (더 필요하면 추가발주로)」로 알려준다.
- 곁가지: `_propagateEffectiveRatioRaw`의 동결 조건이 `'sent'`만 봤는데 `shipped`·`arrived`도 포함하게 맞춤.
- ⚠️ **수량을 쓰는 곳은 딱 두 군데**뿐이다 — 이 sync 의 field 루프와 `_propagateEffectiveRatioRaw`. 새로 만들면 둘 다 동결 조건을 넣을 것.
- 검증: `/tmp/fpf-preview/freeze.html` (mkharness_freeze.py) — 실제 sync 함수로 12개 검사 통과
  (발송분 유지 · 미발송분 갱신 · 반복 동기화 · 발송취소하면 다시 따라감 · 입고완료도 동결).

## 2026-08-19q — 부자재 결제체크: 부자재집으로 안 나눔 (브랜드만) + 사라진 줄 복구
- 사용자 요청: 「부자재집 별로 안 나눠도 돼, 브랜드만 나눠줘 결제관리처럼」.
- **부자재집 고르는 칸 삭제.** 거래처 전부를 한 화면에. 줄마다 `r.sup` 을 들고 다닌다.
- 카드 묶음 = **거래처 × 브랜드 × 아이템** (`_tlGKey`/`_tlGParse`, 구분자 `|~|`).
- ⚠️ 결제·수량수정·VAT 저장 자리는 예전 그대로 **거래처별 맵**(`S.trimLedgerPaid[거래처][키]`).
  그래서 줄 함수 시그니처가 바뀌었다: `tlSetOvr(sup,key,f,v)` · `tlClearOvr(sup,key)` · `tlTogglePaid(sup,key)`.
  묶음 함수(`tlPayItem`/`tlPayDay`/`tlDayReceipt`/`tlToggleVat`)는 **키에서 거래처를 뽑아** 쓴다.
- 「＋ 수동 추가」 폼에 거래처 고르는 칸(`tl-m-sup`)이 생겼다 — 수동 줄·발주서 붙여넣기는 여기서 거래처를 정한다.
- 날짜순 표에 「거래처」 칸 추가(colspan 8→9).
- **[버그] 브랜드 없는 줄이 사라지던 것** (신고: "패션포인트 7월 결제가 사라졌어")
  · 원인: 브랜드 칩이 자동으로 **첫 브랜드에 고정**되고 `r.brand!==bsel` 로 걸러서, 브랜드가 안 걸린 줄
    (가공비 줄 `it.brandId` 없음 · 브랜드 안 고른 수동 줄)이 **닿을 방법 없이** 사라졌다.
  · 고침: 기본 「전체」, 브랜드 없는 줄이 있으면 `TL_NOBRAND='(브랜드 없음)'` 칩을 만들어 반드시 보이게.
- ⚠️ 원장 줄은 `trimLedgerAuto()`가 **`calcSups`로 매번 새로 계산**하고 날짜는 `o.createdAt` 이다.
  아이템의 부자재처를 바꾸면 **옛 달 줄도 그 거래처로 옮겨간다**(원장은 스냅샷이 아니다).
- 검증: `/tmp/fpf-preview/allsup.html` (mkharness_allsup.py) — 실제 함수로 18개 검사 통과.

## 2026-08-19r — 부자재 원장: 거래처 「전체 / 업체별」 둘 다 + 「안 뜨는 이유」 진단
- 거래처 칩 줄 추가: `전체` + 거래처마다 **이 기간·이 브랜드 기준 건수**를 같이 표시(`window._tlSupFlt`).
  0건이면 칩이 흐려진다(`.tl-br.zero`) — 「그 업체는 이 기간에 진짜 0건」이 눈에 바로 보이게.
- 건수는 **거래처로 거르기 전**(기간+브랜드까지만 건) `preSup` 에서 센다 — 업체를 골라도 다른 업체 숫자가 안 바뀐다.
- **`tlWhyMissing()` 진단** (윗바 「안 뜨는 이유」): 지금 걸린 거르개 / **거래처 × 월 건수 표(거르개 무시)** /
  이 기간 브랜드별·거래처별 건수 / `calcSups` 가 깨져 통째로 빠진 오더 / 자주 놓치는 4가지 안내.
- `trimLedgerAuto` 의 `calcSups` 실패를 `window._tlCalcFail` 에 모은다 — 예전엔 `console.warn` 뒤 조용히 `return` 이라
  **그 오더의 부자재가 원장에서 통째로 사라져도 아무도 몰랐다.**
- ⚠️ 되새김: 원장 줄은 저장된 기록이 아니라 **매번 새로 계산**(`calcSups`)하고 날짜는 **`o.createdAt`(오더 만든 날)**.
  아이템 부자재처를 바꾸면 지난달 줄도 옮겨가고, 부자재를 지우면 옛 줄도 사라진다.
- 검증: `/tmp/fpf-preview/allsup.html` — 30개 검사 통과.

## 2026-08-21a — 작지 포장 탭: 포장 사진 · 접는 방법을 위아래로
- 예전엔 `.tp-pack2photos{grid-template-columns:1fr 1fr}` 로 좌우 2칸 → **세로 1칸씩**(세로형·가로형 둘 다).
- 사진칸 높이 세로형 300px / 가로형 250px.

## 2026-08-24a — 샘플 코멘트 = 리스트 / A4 샘플확인서
- 사용자 요청: 「샘플확인서를 샘플 코멘트 탭에 넣고, 오더관리처럼 리스트 → 열면 상세」.
  카드가 전부 펼쳐진 격자라 훑기 힘들던 걸 **왼쪽 리스트(320px) / 오른쪽 A4 한 장**으로 바꿈.
- **A4 맞춤은 작지(tpFit/tpScreenFit)와 같은 2단** — 새로 만들지 않았다.
  · `scFitContent()` 내용이 종이보다 길면 **내용만** 축소 → 종이 밖으로 안 넘침
  · `scFitScreen()` 종이 전체를 화면 남은 가로·세로에 맞춰 축소 (인쇄·캡처 땐 끔)
  · 종이 = **200×287mm**, `@page{size:A4 portrait;margin:3mm}`
- ⚠️ **scFitScreen 함정 2개** (겪고 고침):
  ① 종이가 화면 아래쪽이면 「남은 높이」가 0에 가까워져 **종이가 점처럼 찌그러짐** → 위 여백은 최대 200px만 빼고, 좁으면 창 높이 기준으로 되돌림.
  ② 폭·높이를 **0으로 보고하는 화면**(임베드·자동화)이 있음 → 못 재면 **축소를 아예 안 함**. 최소 0.35배 바닥.
  시험용 인자 `scFitScreen(tW,tH)` 로 계산을 검증할 수 있게 열어둠.
- 종이 순서: 헤더 → 브랜드·품명·컬러·사이즈 → **코멘트(패턴/샘플 2칸)** → 원단(원단만) → 사이즈 체크리스트 → **사진(맨 밑, 남는 높이 사용)**.
  남는 높이는 코멘트 30% / 사진 70%로 나눠 가져 **아래 빈 여백 0**.
- 새 자료는 회차에만 붙음: `rr.size=[{part,pat,give,meas}]`, `rr.labor`. 기존 `pics/patMemo/smpMemo/hands/done/date` 그대로.
  **차이 = 실측 − 지시 자동**(`_scDiff`, ＋빨강/−파랑/0회색). 부위·패턴·지시는 작지 `sew.spec`에서 자동(「작지에서 불러오기」로 다시 채움). 공임은 `laborRate(it,size)` 자동(고쳐 쓰면 `rr.labor`).
- ⚠️ 작지 「샘플·패턴」 회차(`spatRounds`)와는 **따로**다. 써보고 묶을지 나중에 결정하기로 함.
- `scToggleOpen`은 이제 **고르기**(예전엔 토글이라 다시 누르면 상세가 통째로 사라졌다).
- 검증: 실제 함수 하네스로 34개 + 축소 계산 6개 통과. 기존 기능(사진4칸·손글씨·회차추가/삭제·확인됨·날짜·텍스트복사·공장용복사·이미지저장) 전부 살아있음을 항목별로 확인.

## 2026-08-24b — 부자재 「용도」를 맨 위(부자재명 위)로
- 확인 결과 지퍼·일반·스냅·케어라벨·메인라벨·바이어스는 **이미 용도가 첫 칸**이었고,
  **단추 카드(`buttonCardNew`)에만 용도 칸이 통째로 없었다** → 단추는 용도를 못 적고 있었다.
- 단추 카드 「기본」 탭 맨 위(부자재처·부자재명 위)에 용도 추가. 원단(`fabRowHTML`)·다른 부자재와 자리 통일.
- `part` 는 `colTR()` 이 수집하고 `autofillTrim` 고정필드 목록에 `['part',e.part,0]`(빈 칸만) 로 이미 있어 저장·자동채움은 그대로 붙는다.
- 검증: 7종 카드 전부 `data-f="part"` 가 `data-f="name"` 보다 앞에 오는지 프로그램으로 확인.

## 2026-08-24c — 발주서에 단가 · 지시서에서 자수 빼기

### 발주서 단가 `@7,000>6,500`
- 품명 바로 밑줄에 `@단가`. 네고가(`m.negotiatedPrice`, 오더 「거래처 확인 — 협상단가」)를 알면 `@정가>네고가`.
- 원단은 단위를 붙인다: `@12,000/y` · `@9,800/kg`(pricingUnit==='kg' → pricePerKg).
- **컬러마다 단가가 같으면** 품명 밑에 한 줄, **다르면** 컬러 줄 끝에 각각(`_poAtGroup` 이 빈값을 주면 컬러별로 붙임).
- 들어간 곳 7군데: 원단(그룹+컬러별) · 바이어스 · 지퍼 · 단추 · 스냅 · 일반부자재(단일+다중+컬러별).
  단추는 예전에 **네고가만** `7,000원/개` 로 나왔는데 `@` 형식으로 통일했다.
- ⚠️ **단가 0/빈값이면 줄을 아예 안 만든다** (`@0` 이 거래처에 나가면 안 된다).
- ⚠️ 예전엔 일부러 숨겼던 값이다(코드에 「단가는 발주서에 표기하지 않음」 주석이 있었음).
  → 「발주 내용 선택」에 **「단가 표시」** 칩 추가(`poOpts.showPrice`, `togglePoShowPrice`). **기본 켜짐**,
  옛 발주서는 값이 없으므로 `showPrice!==false` 로 켜진 것으로 본다. 거래처마다 따로 끌 수 있다.
- 검증: 형식 18개 + 실제 `genPoText` 본문 8개 통과(켰을 때/껐을 때 본문이 단가 줄만 빼고 완전히 같은지까지).

### 지시서에서 자수 빼기
- 「자수 위치·크기」(치수 표 밑 보라 블록)를 **그 지시서에서만** 빼기/다시 넣기. 자수 탭 자료는 안 지운다.
- 치수 섹션 머리에 「자수 빼기 / 자수 넣기」 버튼 — 자수에 값이 있을 때만 보인다(`_tpEmbHas`).
- 시트마다 따로 기억: 키는 치수 경로 앞부분(`_tpSheetOf`: `sew.spec`→`sew`, `spat2.spec`→`spat2`) → `d[sheet].embOff`.
  1차엔 넣고 2차엔 빼는 식이 된다.

## 2026-08-24d — [버그] 원단처·부자재처 바꾸면 옛 거래처 동/호수가 따라가던 것
- 신고: 「엠케이 → 비호로 업체 이름 바꿨더니 **엠케이 호수가 비호 호수로 저장됨**」. 계속 반복되던 문제.
- **원인 사슬 (4단계)**
  ① `autofillFab`/`autofillTrim` 이 위치(시장·동·층·호수)를 **빈 칸일 때만** 채웠다 →
     거래처를 바꿔도 옛 주소가 칸에 그대로 남음
  ② `colFR()`/`colTR()` 이 그 값을 아이템 원단·부자재 줄에 저장
  ③ **`saveToPB` 가 `pbSup.building=f.building` 으로 «새 거래처»의 주소를 덮어씀** ← 진짜 피해
  ④ 그 뒤로 그 거래처를 쓰는 **모든 아이템·발주서 출고처**에 잘못된 주소가 퍼짐
- **고침 2겹**
  · A. 거래처가 «바뀌면» 위치를 새 거래처 걸로 **갈아끼운다**(`_fabPutLoc`).
       **새 거래처에 주소가 없으면 비운다** — 옛 주소가 절대 안 따라가게. 원단·부자재 둘 다.
       옛 거래처 값은 `formFabrics[i].supplier`/`formTrims[i].supplier`(colFR/colTR 전)로 판단.
  · B. **단가장 주소는 아이템이 못 덮어쓴다** — `saveToPB` 가 `building`/`room` 을 **비어 있을 때만** 채운다.
       주소는 «거래처의 정보»라 한 아이템의 실수가 전체로 번지면 안 된다. (floor 는 원래부터 이 규칙이었다)
       바꾸려면 단가장 거래처 카드에서 직접 고친다.
- ⚠️ 앞으로 이 자리에 손댈 때: 거래처에 딸린 값(주소·연락처·계좌)은 **아이템 줄이 소스가 아니다**. 아이템은 읽기만.
- 검증: `_fabPutLoc` 실제 함수로 6가지(신고 상황 재현·주소 없는 거래처·모르는 거래처·거래처 비움·되돌리기) 통과.

## 2026-08-25a·b — 샘플 코멘트: 아이패드 · 사진 2칸 · 버튼 거르개 · 검색 · 여기서 바로 시작
- **아이패드**(신고): 두 칸이 비좁아 종이와 리스트가 겹쳐 보였다 →
  한 칸으로 내리는 폭을 `1000px` → **`1280px`**(아이패드 가로 1180·세로 820 둘 다 포함).
  그때 `.sc-sl` 의 `sticky`·`max-height` 를 풀고 `.sc-slist{max-height:44vh}` 로만 제한. `.sc-dt{overflow:hidden}` 로 종이가 칸 밖으로 못 나가게.
- **사진 4칸 → 2칸**(신고: 「칸이 세로로 기니까 사진이 잘 안 담겨」). `repeat(2,1fr)` + `grid-auto-rows:1fr` → 2×2.
- **거르개를 드롭다운 → 버튼(칩)** 으로. 시즌·브랜드·정렬·수정필요만. (`.sc-fc`, 브랜드는 2개 이상일 때만 줄이 생김)
- **검색칸 추가**(`_sc.q`) — 아이템명·품번, 띄어쓰기·대소문자 무시(`_scNorm`/`_scMatch`).
- **「여기서 바로 시작」**: 예전엔 아이템 탭 「진행」을 눌러야만 코멘트가 생겼다 →
  회차가 없는 아이템(`_scNewCands`)을 리스트 밑에 보여주고 누르면 1차를 만들고 바로 고른다(`scStartItem`).
  검색어가 없으면 8개만, 검색하면 전부. 시즌·브랜드 거르개도 같이 먹는다.
- 검증: 실제 함수 하네스 34개(기존) + 15개(새로) 전부 통과. 아이패드 1180×820에서 겹침·가로스크롤 0 확인.

## 2026-08-25c — [버그] 샘플 코멘트 검색칸에서 한글이 「ㅊㅔㅋㅡ」로 쳐지던 것
- 신고: 「체크」를 치면 `ㅊㅔㅋㅡ` 로 분해됨. **다른 칸은 멀쩡** — 이 칸만 `oninput`이었다.
- 원인: `scSetQ` 가 글자마다 `renderSampleComment()` 로 **화면을 통째로 다시 그려** 입력칸 DOM이 사라짐 →
  한글 IME 조합이 매 글자 끊긴다. (앱의 다른 칸은 `onchange` = 다 치고 나서라 안 걸렸다)
- 고침: 목록 알맹이를 **`_scListHTML()`** 로 빼고, 검색은 `#sc-slist` 의 **innerHTML만** 갈아끼운다.
  **입력칸은 손대지 않는다** → 조합 유지. 통계는 `#sc-stat` 만 따로 갱신. 「×」는 `scClearQ()`.
- ⚠️ 앞으로 **`oninput` 으로 재렌더하는 코드는 금지**. 한글이 깨진다. 꼭 실시간이어야 하면 이렇게
  «입력칸을 건드리지 않는 부분 갱신»으로 짤 것.
- 검증: 실제 함수로 `ㅊ→체→첵→체크` 를 차례로 넣으며 **입력칸 DOM 노드가 같은 객체로 살아있는지** 확인 + 검색·통계·×·확인서 유지 9개 통과.

## 2026-08-25d — [버그] 케어라벨을 골라도 선택이 안 되던 것
- 신고: 라벨명에서 「케어라벨 15」를 골라도 칩이 안 생김. **메인라벨은 멀쩡**.
- 원인: `addCareLabelEntry`/`removeCareLabelEntry` 가 **`renderTrims()` 라는 없는 함수**를 부르고 있었다(오타).
  값은 `formTrims[i].labelNames` 에 들어갔는데 그 다음 줄에서 ReferenceError 로 터져 **화면이 안 그려지고 저장도 안 됨** →
  사용자 눈엔 「선택이 안 된다」. 메인라벨(`addMainLabelEntry`)은 `renderTrimRows()` 를 써서 정상이었다.
- 고침: 메인라벨과 **같은 마무리**로 통일 — `formTrims[i].labelName=arr[0]||''`(대표 라벨명) + `renderTrimRows()` + `persistTrimEdit(i)`.
  삭제 쪽도 같이. 대표 `labelName` 은 작지 라벨 사진·발주서가 보는 값이라 케어라벨만 비어 있던 것도 같이 메워졌다.
- 훑기: `<script>` 전체에서 «호출은 있는데 정의가 없는» render*/persist*/autofill*/col?R 함수를 프로그램으로 뒤졌고, `renderTrims` 하나뿐이었다(이제 0).
- 검증: 실제 함수로 14개(고르기·단가 자동·중복·빈값·지우기·대표명 따라가기) 통과.

## 2026-08-25e — [버그] 프로모션 아이템은 출고 수량을 못 적던 것
- 신고: 「MNK 프로모션인데 출고 수량 적으려니까 **공장이 지정되지 않았다**고 나와」.
- 원인: 생산 대시보드의 **재단·봉제·출고** 칸이 `fcSew = it.sewingFcId` 만 봤다.
  프로모션 아이템은 봉제공장이 비어 있고 **`promotionFcId`** 가 그 자리다 → `fcId` 가 빈값 →
  `pdOpenQtyModal` 이 「공장이 지정되지 않았어요」로 막음. (작지 `tpRender` 는 이미 `promoFc||sewFc` 로 쓰고 있었다)
- 고침: **`makerFc(it)` = `sewingFcId || promotionFcId`** 를 공용 유틸(`orderFc` 옆)에 두고
  대시보드 두 자리(`pdRowStages`, 행 렌더)와 결제 알림 한 자리에서 쓰게 했다. 봉제공장이 있으면 그게 우선.
- ⚠️ 앞으로 **「만드는 공장」이 필요한 자리는 `makerFc(it)` 를 쓸 것. `it.sewingFcId` 를 직접 읽지 말 것.**
  (`COST_DEFS` 에 `promotionCost/promotionFcId` 가 이미 있어 원가·결제는 따로 잡힌다)
- 검증: `makerFc` 실제 함수로 5개(프로모션/일반/둘 다 없음/null/둘 다면 봉제 우선) 통과 +
  재단·봉제·출고 셀이 모두 `fcSew`(=`makerFc`)를 받는지 코드로 확인.

## 2026-08-25f — 샘플확인서 치수: 「어느 지시서에서 가져올지 고르기」
- 배경: 작지는 치수가 **시트마다 따로**다(2026-08-19 「안 엮이게」 결정) — `sew.spec` / `spat.spec` / `spat2.spec` …
  그런데 샘플확인서는 무조건 `sew.spec`(지시서)만 끌어와서, 2차 샘플을 확인할 때
  「내가 2차에 지시한 치수」와 확인서의 「지시」 칸이 달랐다.
- 이제 「불러오기」를 누르면 **가져올 지시서를 고른다**(`_scSpecSources` → `scSizeReload` 창 → `scSizeTake`).
  · 목록 = **지시서** + **샘플·패턴 1차/2차/3차…** (치수가 실제로 적힌 것만, 부위 개수 같이 표시)
  · 그레이딩은 지시서와 같은 `sew.spec` 이라 목록에 안 낸다(중복)
- 고른 곳을 회차에 기억(`rr.sizeSrc`) → 섹션 머리에 「**· 샘플·패턴 2차에서**」 로 보여주고,
  아직 아무것도 안 적은 회차는 그 출처(없으면 첫 번째)의 치수를 미리 보여준다.
- ⚠️ 다시 불러오면 **적어둔 실측·차이는 지워진다**(창에 빨간 글씨로 안내).
- 검증: 실제 함수 18개(목록·부위수·기본출처·창·가져오기·출처 기억·실측 초기화·치수 없음) + 기존 34개 통과.

## 2026-08-25g — 샘플확인서: 인쇄 빈칸 · 작지 규칙으로 디자인 통일 · 치수 사이즈까지 고르기

### [버그] 인쇄가 빈 종이로 나오던 것
- 원인: `body.sc-printing>*{display:none}` 로 숨기고 `#pane-sccm` 만 되살렸는데,
  **`#pane-sccm` 은 body 직속 자식이 아니라** 그 위 조상이 `display:none` 이 되어 아무것도 안 찍혔다.
  (작지는 `#tp-modal` 이 body 직속이라 같은 방식으로도 잘 나왔다 — 그대로 베낀 게 함정)
- 고침: 인쇄하는 동안 종이(`#sc-a4wrap`)를 **body 직속 상자 `#sc-print-host`** 로 잠깐 옮기고, 끝나면 제자리로.
  `afterprint` 가 안 오는 브라우저를 대비해 0.8초 뒤 자동 복구도 건다.
- ⚠️ 앞으로 인쇄 CSS 쓸 때 **`body>*` 로 숨기는 방식은 대상이 body 직속일 때만** 쓸 것.

### 디자인 — 작지(#tp-modal) 규칙으로 통일 (사용자: 「지시서처럼」, 「디자인MD 봐」)
- 표·칸 선 = **1px `#d1d5db`** (진한 `#2c3e50` 다 걷어냄), 섹션·머리 배경 = **`#f3f4f6`**, 외곽 뼈대만 **2px `#6b7280`**.
- **입력칸은 테두리 없이 투명**, 포커스 때만 `#fff6d6` — 「코멘트 칸 안에 작은 네모」의 원인이 textarea 테두리였다.
- 코멘트 두 칸은 가운데 선 하나로 나누고 안쪽을 꽉 채움(작지 지시사항과 같은 모양).
- 사진 = **2칸 × 2줄**, 선 1px. 레트로 테마의 굵은 검정 테두리가 새어 들어와 `!important` 로 눌렀다.
- `.sc-a4 *{border-radius:0}` — 종이 안에서는 둥근 모서리 없음(작지와 동일).
- 표는 `table-layout:fixed` — 칸 폭이 내용에 따라 흔들리지 않게(정렬 맞춤).

### 치수 불러오기 — **사이즈까지** 고르기
- 예전엔 **첫 사이즈만** 읽어서, 값이 3호에 적혀 있으면 빈칸으로 나왔다(신고: 사이즈 2·3·4·5 아이템).
- 이제 「불러오기」가 **지시서 × 사이즈 표**를 보여주고, 칸마다 **값이 적힌 부위 수**를 적어 준다(없으면 `-`).
- 안 골랐으면 `_scBestSpec` 이 **값이 가장 많은 조합**을 알아서 고른다 → 빈 표가 안 뜬다.
- 고른 조합은 회차에 기억(`rr.sizeSrc`/`rr.sizeSz`), 머리글에 「· 샘플·패턴 1차 · 3」 으로 표시.
- 검증: 치수 20개 + 인쇄 8개 + 기존 34개 통과. 화면 값도 실제로 재서 확인(코멘트·입력칸 테두리 0px, 표선 1px #d1d5db, 섹션 #f3f4f6, 종이 2px #6b7280, 사진 2칸).

## 2026-08-25h — 샘플확인서: 인쇄 제대로 · 실측 보존 · 사진 2칸 · 사이즈 이름 바뀔 때 치수 이관

### [버그] 인쇄 — 두 번 밟은 함정
- ① `body.sc-printing>*{display:none}` → `#pane-sccm` 이 body 직속이 아니라 **조상이 숨겨져 빈 종이**.
- ② 그래서 종이를 body 직속 상자로 **옮겼더니**, CSS 가 전부 `#sccm-body ...` 로 묶여 있어
     **스타일이 통째로 떨어져** 표가 세로로 흐르고 2장이 됐다.
- **결론: 옮기지 않는다.** 제자리에 두고 `visibility` 로 나머지를 감춘다(조상이 hidden 이어도 자손은 visible 가능).
  종이만 `position:absolute; left/top:0` 로 첫 장에 붙이고, 조상들의 `overflow:hidden`·`transform` 을 풀어 준다.
- ⚠️ **스코프가 걸린 CSS(`#부모 .자식`)를 쓰는 화면은 인쇄할 때 DOM 을 옮기면 안 된다.**

### [버그] 실측이 불러올 때마다 사라지던 것
- `scSizeTake` 가 `rr.size` 를 통째로 갈아끼워 실측이 날아갔다.
- 이제 **같은 「측정부위 이름」 기준으로 실측을 옮겨 담고**, 새 지시서에 없는 부위라도
  실측이 적혀 있으면 그 줄을 **뒤에 남긴다**(버리지 않는다). 창 안내문도 「실측은 그대로 둡니다」로.

### [버그] 사이즈 이름을 바꾸면 작지 치수가 사라진 것처럼 보이던 것
- `saveItemForm` 이 `laborBySize`·`consumptionBySize`·`sizeRates` 는 옮겼는데 **`techpack` 은 안 옮겼다.**
  치수는 `sew.spec[i].pat{사이즈}` / `.v{사이즈}` 처럼 **사이즈 이름이 키**라, 이름이 바뀌면 화면이 못 찾는다.
  **값이 지워진 게 아니라 옛 이름 밑에 남아 있다.**
- 고침 ①: 사이즈가 바뀔 때 `sew/grd/spat*` 의 `pat`·`v`, 자수 `posRows[].vals`, `smpRounds[].sizeSz` 를 같이 옮긴다.
- 고침 ②: 이미 어긋난 것도 되살리게 — 치수표 밑에 **「〇〇 N칸 되살리기」** 줄(`tpSpecOrphans`/`tpSpecAdopt`).

### 그 밖
- **사진 칸을 앞·뒤 2개로** (「2칸으로 줄여달라」 = 열이 아니라 **칸 수**였다).
  안감·디테일에 이미 사진이 있으면 그 칸도 이어서 보여준다 — 올려둔 자료를 숨기지 않으려고.
- 메타 줄에 `table-layout:fixed` 를 걸었더니 폭 없는 「품명」이 남는 자리를 다 먹고 「사이즈」가 잘렸다 → **메타는 내용대로**, 품명만 `.grow`. (사이즈 표만 fixed 유지)
- 「완성 → 지시」 연결은 원래부터 맞았다(`r.v` = 완성 → 확인서 「지시」). 값이 안 보였던 건 **첫 사이즈만 읽던 것**이 원인.
- 검증: 치수·실측·되살리기 21개 + 인쇄 스타일 10개 + 인쇄 규칙 11개 확인.

## 2026-08-25i — ★[자료손실] 아이템을 저장하면 샘플 코멘트가 통째로 사라지던 것
- 신고: 「목도리 샘플 코멘트 어디갔어 / 없어졌어」.
- **원인**: `saveItemForm` 은 폼 값으로 `item` 을 **새로 만든 뒤** 폼에 칸이 없는 것들만 `oldItem` 에서 되살린다.
  그 보존 목록에 **`smpRounds`(샘플 코멘트: 회차·사진·코멘트·손글씨·사이즈표·실측)가 빠져 있었다.**
  → 아이템을 한 번 수정·저장할 때마다 샘플 코멘트가 **통째로 날아갔다.**
- 같은 구멍이 더 있었다: **`ideaData`(아이디어보드)**, **`ssAct`·`ssShoot`·`ssOff`·`ssDone`·`ssRound`·`ssHist`(샘플 스케줄표)**.
  전부 보존 목록에 추가.
- ⚠️ **폼 밖에서 아이템에 쌓는 자료는 반드시 이 보존 줄에 넣을 것.** 새 기능을 만들 때 제일 먼저 확인할 것.
  (지금 지키는 것: techpack · smpRounds · ideaData · ss* · category · createdAt · startDate · kcCert/At ·
   instrDone/At · gradingDone/At · photoReady/At · costSent/At · statusManual · hold · qc · kcColors · csQtyOvr · csPriceOvr · csLossMode/Pct)
- 검증: 저장 로직의 보존 줄을 그대로 떼어 «폼 밖 자료가 살아남는지» 11개 확인(사진·코멘트·실측까지).

## 2026-08-25j — 샘플 코멘트 리스트: 「미작성」 상태 추가
- 신고: 방금 만든 빈 회차가 초록 「확인됨」으로 뜸.
- 원인: 칩이 **「수정필요(적었는데 확인 안 함)」가 0이면 무조건 확인됨** 이었다.
  아무것도 안 적은 회차는 수정필요로 안 세니 0 → 확인됨으로 보였다.
- 고침: `_scStateOf(it)` 로 **세 상태**를 가른다 — `fix`(수정 N·빨강) / `empty`(**미작성**·회색) / `ok`(확인됨·초록).
  적은 것도 확인 표시도 없으면 «미작성». 안 적었어도 사용자가 「확인됨」을 직접 눌렀으면 그 뜻을 존중한다.
- 검증: 실제 함수로 10가지(빈 회차·적고 미확인·적고 확인·안 적고 확인·여러 회차·회차 없음·옛 cms) 통과.

## 2026-08-25k — 자수 빼기: 자수실도 같이 · 자수 표 머리에도 버튼
- 「자수 빼기」를 켠 시트에서는 **스와치의 「자수실」 줄도 같이 빠진다**(사용자 요청).
  `tpSwatchAttachHTML(qb, sheet)` 로 시트를 받아 `tpEmbOff(sheet)` 면 실컬러 맵을 비운다.
  스와치는 `swatchOf(sheet)` 로 만들고, 샘플·패턴 회차 패널은 그 회차 키를 넘긴다.
- 버튼을 **자수 위치·크기 블록 머리에도** 넣었다 — 치수 섹션 머리(불러오기 옆)에만 있어서 못 찾으셨다.

## 2026-08-25m — 샘플확인서 인쇄가 2장·가로처럼 나오던 것 · 사진칸 글자 정리
- 신고: 「왜 갑자기 가로로 나오지 원래 세로였는데」 — 실제로는 **2장으로 쪼개져** 그렇게 보인 것.
- 원인: `@page{margin:3mm}` 인데 브라우저 인쇄창의 **「여백: 기본」**(약 10mm)이 더해져
  200×287mm 종이가 A4 안에 못 들어가고 다음 장으로 넘어갔다.
- 고침: `@page{margin:0}` — 종이 자체 여백(`margin:5mm auto`)만 쓰고, `page-break-inside:avoid` 로 한 장에 묶는다.
- 사진 없는 칸 글자는 **「사진」** 하나만(예전 「＋ 사진 / 끌어다 놓기 · 붙여넣기」). 인쇄 때는 그 글자와 ×·펜 버튼도 안 나간다.

## 2026-08-25n — 샘플확인서 머리줄 정리: 컬러·사이즈·공임
- 브랜드·품명은 **위 제목줄에 이미 있어** 중복이라 뺐다. 메타 줄은 **컬러 / 사이즈 / 공임** 셋만.
- 공임은 사이즈 표 맨 아래에 있던 것을 **사이즈 옆으로** 옮겼다(표에서는 뺌 — 중복 방지).
  값은 그대로 `laborRate(it,size)` 자동, 고쳐 쓰면 `rr.labor`.

---

## 2026-08-25p — 샘플확인서 마무리 + 작지 가운데 선

**요청 8건 (한 묶음)**

| 신고 | 원인 | 고침 |
|---|---|---|
| 「검색하는 부분 오더관리처럼 … 여기 디자인 왜 안바꿔」 | 이 탭만 쓰는 새 칩 CSS(`.sc-fc`/`.sc-fbar`/`.sc-q`)를 만들어 썼다 | **앱 공용 부품**으로 교체: 기본 `<input>`(=`#o-search` 모양) + `getBrandPillsHTML()` + 기본 `<select>` 3개(시즌·상태·정렬). 「수정필요만」 토글 → 「전체 상태」 드롭다운(수정필요/미작성/확인됨) |
| 프린트가 A4를 넘어 다음 장으로 | `visibility:hidden` 은 **자리를 그대로 차지**해 뒤에 빈 장이 붙었다. 종이 5+287+5=297mm 도 딱 맞아 반올림에 밀렸다 | 종이까지 이어지는 **조상 줄기**(`_scPrintChain` → `.sc-pchain`)만 남기고 나머지는 `display:none`. 종이 여백 `5mm auto 0`(총 292mm) |
| 「공임 자동이라고 왜 써있어」 | placeholder `자동` | 뺐다 — 없으면 빈칸 |
| 「탭 치면 하단으로, 옆으로 말고」 | 기본 Tab | `scSzKey()` — Tab=아래 줄 같은 칸, Shift+Tab=위. 마지막 줄이면 기본동작 |
| 「선 위로 면이 올라와 거슬림」 | 종이 `border` 위로 안쪽 회색 면이 축소(scale) 때 반 픽셀 삐져나옴 | 테두리를 **맨 위 층**에 따로 그림 — `.sc-a4::after{border:2px …;z-index:9}` (`.sc-a4`는 `border:0`) |
| 「코멘트를 패턴/샘플 말고 미팅전/미팅후로」 | — | **보이는 이름만** 바꿈. 저장 자리는 `patMemo`/`smpMemo` 그대로 (키 바꾸면 적어둔 글이 날아간다) |
| 「코멘트 크게, 사진 작게」 | 코멘트 `flex:1 1 30%` / 사진 `1 1 70%` | 코멘트 `flex:6` / 사진 `flex:4` (+최소높이) |
| 「작지 2단 가운데 선 끊김」 | 선을 `.colL{border-right}` 한쪽에만 그어서, **colR 이 더 길면** 그 구간엔 선이 없었다 | `.colR{border-left:1px;margin-left:-1px}` 추가 — 양쪽에 긋고 1px 포개서 굵기는 그대로 |

**＋ 아이템 이동 탭에 「코멘트」 추가** — `itemCtxBarHTML` 은 작지·원가·요척·수정 4화면 공용. 여기에 `코멘트`(→`scOpenItem`)를 넣고, 샘플 코멘트 상세 조작줄 맨 앞에도 같은 탭을 붙였다.

### ⚠️ 이 영역 손대기 전 필독
- **샘플 코멘트 검색·거르개에 새 CSS 를 만들지 말 것.** 오더관리와 같은 부품(`getBrandPillsHTML`·기본 input/select)을 쓴다. 2026-08-25 「디자인을 계속 놓치는 것 같다」 지적의 원인이 바로 새 칩 CSS 였다.
- **인쇄는 종이를 옮기지 않는다.** CSS 가 전부 `#sccm-body …` 로 묶여 있어 옮기면 스타일이 통째로 떨어진다. `_scPrintChain()` 로 조상 줄기만 남긴다.
- **`.sc-a4-fit` 의 transform 은 인쇄에서도 지우지 않는다** — 내용이 종이보다 길 때 줄여주는 축소라, 지우면 잘려 나간다.
- 코멘트 칸 저장 키는 `patMemo`(미팅전)·`smpMemo`(미팅후). 이름만 다르다.

---

## 2026-08-25q — 라벨 저장 사고 · 인쇄 재수정 · 줄 순서 드래그

| 신고 | 진짜 원인 | 고침 |
|---|---|---|
| 「라벨 바꿨는데 껐다 켜면 도루묵」 「3번이나 다시했어」 | **`colTR()` 가 그 칸이 없는 카드에서 값을 지웠다.** 라벨 카드(`labelShell`)엔 `[data-f=name]`·`size`·`color` 입력칸이 없는데 `formTrims[i].name=g('name')\|\|''` 라 저장할 때마다 **빈 값으로 덮였다** | `if(g('name')!=null)` 처럼 **칸이 있을 때만** 덮어쓴다 (name·supplier·size·color·part) |
| 「저장이 바로바로 안 돼」 | 라벨 칩 추가/삭제는 `persistTrimEdit` 를 부르는데 그건 미니멈 4개만 옮겼다 → 폼 「저장」 전엔 안 남음 | `persistTrimEdit` 가 `labelNames·labelName·midSize·labelPart·brandId·finishSel·unitPrice·name` 도 옮긴다 (⚠️ `undefined` 는 건너뛴다 — 덮으면 오히려 지워짐) |
| 「작지에 반영도 안 되고」 | `tpLabelTableHTML` 이 `tpLabelName(t)`(=첫 칩 하나)만 썼다 | 고른 칩 **전부**(`labelNames`)를 줄로 |
| 「프린트 아직 그대로」 (2장) | **`@page{margin:0}` 이 문제였다.** 크롬은 인쇄창의 「여백」 설정을 우선하고, `@page` 를 걸면 **맞춤 배율(자동 축소)이 꺼져** 200×287mm 종이가 인쇄영역(190×277mm)을 넘어 쪼개졌다. 작지는 `@page` 가 없어서 크롬이 알아서 줄여 한 장에 나왔던 것 | `@page` **삭제** + 종이는 작지 `.tp-wrap` 과 같은 규칙(`margin:0 auto;overflow:hidden;transform:none`) |
| 「치수 순서 화살표 말고 끌어서」 | — | `tpRowMoveBtns` = 손잡이(⠿) 하나. `tpRowDragStart/Move/End`+`tpMoveRowTo`. 포인터 이벤트라 아이패드 손가락도 됨. **▲▼ 없앰**. 순서칸 폭 58→44px |
| 「확인서에서 부위 추가하면 작지에도」 | — | `_scPushPartToSpecs` — `scSetSize(...,'part',…)` 때 **모든 회차**(sew·grd·spat*)에 부위 줄 추가. 값은 안 건드림 |
| 코멘트 예시 글씨 없애기 / 글씨 2pt 키우기 | — | placeholder 제거, 12.5→14.5px |

### ⚠️ 이 영역 손대기 전 필독
- **`colTR()` 에서 `g('x')||''` 로 바로 덮지 말 것.** 부자재 카드는 종류마다 칸 구성이 달라서, 없는 칸을 덮으면 **저장할 때마다 값이 사라진다.** `!=null` 로 «칸이 있는지» 먼저 본다.
- **샘플확인서 인쇄에 `@page` 를 넣지 말 것.** 넣는 순간 크롬 자동 축소가 꺼져 2장이 된다. 작지와 똑같이 두는 게 정답.
- **줄 순서 드래그**는 `data-tp-path`/`data-tp-i` 를 단 손잡이를 기준으로 대상 줄을 찾는다. `tpRowMoveBtns` 를 쓰는 표는 전부 자동으로 드래그가 된다.
- **`_scPushPartToSpecs` 는 «치수표가 이미 있는» 시트에만 넣는다.** 빈 시트에 한 줄만 만들면 작지가 기본 부위 목록 폴백을 잃는다.

---

## 2026-08-25s·t — 한글 조합 깨짐 + 「원단 필요량」 계산기

**`2026-08-25s` — 원단 배분 검색칸 한글이 「ㅇㅗㄷㅓ」로 쳐지던 것**
`faResolveItem()` 이 `oninput` 마다 ① 부분일치가 하나면 **바로 담고** ② `input.value=''` 로 칸을 비우고 ③ `faRenderAll()` 로 화면을 다시 그렸다. 조합 중에 이러면 IME 조합이 끊긴다.
→ `oncompositionstart/end` + `e.isComposing` 으로 **조합 중엔 아무것도 안 함**, 부분일치 자동추가는 **2글자 이상**부터.

> ⚠️ **`oninput` 에서 그 입력칸의 값을 고치거나 칸이 든 영역을 다시 그리지 말 것.** 한글이 자모로 쪼개진다.
> 꼭 해야 하면 `_cmp` 플래그(compositionstart/end) + `e.isComposing` 을 먼저 확인한다.
> 같은 사고 이력: 샘플 코멘트 검색칸(08-25) → 원단 배분 검색칸(08-25).

**`2026-08-25t` — 오더수량 배수 계산기에 세 번째 탭 「원단 필요량」**
「이 아이템 한 컬러에 80장 만들면 원단 몇 야드?」

| 정한 것 | 왜 |
|---|---|
| 장수는 **총 장수 한 칸만** | 사용자 결정. 사이즈 비율을 안 받으므로 요척은 **사이즈별이면 평균**을 쓴다 (`_fnYo`) |
| **로스 칸 없음** | 사용자 결정 — 여유는 발주서에서 붙인다 |
| 컬러 수는 아이템에서 자동, 고칠 수 있음 | 「한 컬러 / 전체」 두 줄로 보여줌 |
| 원단 없는 아이템도 목록에 둔다 | 안 그러면 「검색해도 안 나온다」가 되어 더 헷갈린다 → 고르면 「등록된 원단이 없어요」 |

새 CSS 안 만들었다 — `.hint.clean` · `.hint.adj` · `.hint.bad` · `.rtot` 를 그대로 썼다. 탭 경계선만 `:first-child` → `:not(:last-child)` (탭 3개).

**`2026-08-25u` — 원단 필요량에서 요척이 「0」으로 나오던 것**
`num()` 은 `Math.round(n).toLocaleString()` 이라 **소수를 통째로 버린다**. 요척 0.325 → 「0」, 야드 110.7 → 「110」.
→ `_fnN(v, 소수자리)` 로 따로 찍는다 (요척 3자리 · 야드 2자리 · 장수 0자리).

> ⚠️ **소수를 보여줘야 하는 곳에 `num()` 을 쓰지 말 것** (요척·환율·비율 등). `num()` 은 «원 단위 정수»용이다.
> ⚠️ 검증 하네스에서 `num` 같은 공용 함수를 **흉내내지 말 것** — 진짜 정의를 뽑아 써야 한다. 이 버그를 하네스가 못 잡은 이유가 그거였다.

---

## 2026-08-25v — 바이어스 원단출처가 다른 아이템 값으로 튀던 것

**신고**: 「원단출처가 뜬금없이 이티가 됨」

**원인 (사슬 4단계)**
1. 바이어스 카드는 이름이 늘 `'바이어스재단'` 으로 **고정**(`formTrims[i].name='바이어스재단'`, 카드에 이름 칸 없음)
2. `saveToPB` 는 `pbKey(name,color,size)` 로 단가장 항목을 찾는다 → **모든 아이템의 바이어스가 단가장 항목 하나를 공유**
3. `saveToPB` 가 `biasSpec`·`fabricSource` 를 그 하나에 저장 → 한 아이템 값이 «공용»이 됨
4. `autofillTrim` 의 고정값 목록(fixed=1)과 `_TRIM_PB_LOCK_FIELDS` 가 그 값을 **카드에 다시 밀어 넣고 잠갔다**

**고침**: `biasSpec`·`fabricSource` 를 **autofill 목록·잠금 목록 둘 다에서 제거**. 단가장엔 계속 기록되지만 카드로 되돌아오지 않는다.

> ⚠️ **아이템마다 다른 값은 `_TRIM_PB_LOCK_FIELDS`·autofill 고정목록에 넣지 말 것.**
> 특히 바이어스는 이름이 하나로 고정이라 단가장 항목을 전부 공유한다 — 여기 넣는 값은 전부 «남의 아이템 값»이 된다.

---

## 2026-08-25w — 원단 카드에서 바이어스 재단 (B단계)

**실제 업무** (역인터뷰로 확인)
```
원단처 ──원단 발주(원단값)──▶ 우리 ──원단 전달──▶ 메이드(가공처)
                                      ──재단 발주: "이 원단을 30mm로"──▶
                                        공임 = 컬러탕 (컬러당 정액)
```
가공처 발주엔 **원단값이 안 들어간다.** 예전 부자재 바이어스 카드는 「요척 × 수량 × 단가」라 장수가 늘면 공임도 늘었다 — 틀렸다.

**모델** — 원단 `f.bias = {on, factory, spec, yo, fee, fold}`
- `yo` = 벌당 필요 야드 · `fee` = **컬러당** 공임 · `fold` = 원단 발주에 합칠지

**calcSups 에서 하는 일**
| fold | 원단처 | 가공처 |
|---|---|---|
| 켬(기본) | 몸판 108y **+ 바이어스 8y = 116y** (`biasYards` 로 표시) | 컬러별 8y · 공임 20,000 |
| 끔 | 몸판 108y + 「몸판 바이어스용」 8y **별도 줄**(`isBiasCut`) | 같음 |

가공처 material 은 `{type:'trim',orderType:'bias',unitPrice:0,biasFee,calc:{qty,cost:fee}}` 로 합성 —
**기존 바이어스 발주서 블록이 그대로 찍는다.** 컬러당 하나씩 밀어 넣으므로 `cost` 합 = 컬러탕.

### ⚠️ 필독
- **`calc` 는 `_calcBase` 와 같은 객체일 수 있다.** 원단 야드에 바이어스를 더할 때 `calc.ty` 를 고치면 「거래처 확인 계산수량」까지 같이 바뀐다 → 더한 값을 **따로 넘긴다**.
- **가공처가 비면 재단 발주를 안 만든다** (원단 야드만 늘어남). 발주처 없는 material 방지.
- **옛 부자재 바이어스 카드(`orderType:'bias'`)는 그대로 둔다.** 둘 다 켜면 이중 계산 — 이관은 E단계.
- **아직 안 된 것**: 원가계산서(아이템 단위)는 `it.trims` 를 도니 원단 바이어스 공임이 아직 안 잡힌다. 결제/원장(`_tlLine`)은 `calc.cost` 를 쓰므로 **정상**.

---

## 2026-08-25x — 「치수를 다시 적어도 하나는 되고 하나는 안 됨」

**원인**: 자동으로 채운 칸인지 아닌지(`data-auto`)를 **화면(DOM)에만** 들고 있었다.
표를 다시 그리면 그 표시가 날아가서, 자동으로 채웠던 칸이 **「손으로 적은 값」으로 둔갑**한다.
`tpGrade` 의 `setv` 는 «빈 칸이거나 자동칸»만 덮어쓰므로 → 그 칸만 안 바뀐다.
같은 세션에서 방금 채운 칸은 표시가 살아 있어 바뀐다 → **「하나는 되고 하나는 안 되고」**.

**고침**: 그릴 때마다 **편차대로 딱 떨어지는 칸을 자동칸으로 다시 알아본다** (`_tpRowAutoMap` · `_tpPosAutoMap`).
자료는 안 건드린다. 손으로 다르게 맞춰 둔 칸(편차에 안 맞는 값)은 그대로 손값으로 남는다.

| 상황 | 결과 |
|---|---|
| 패턴 2호 고침 (편차 1) | 3·4·5호 따라 변함 ✅ |
| 편차 고침 | 전부 다시 계산 ✅ |
| 4호만 손으로 25 로 맞춰 둠 | 2호 고쳐도 **4호는 25 유지** ✅ |
| 편차 비어 있음 | 예전 그대로 자동 안 함 ✅ |

자수·나염 「위치·크기」 표도 같은 사고라 같이 고쳤다 (편차 0=전부 같은 값 / 편차 N=등차).
＋ 자수 위치표의 ▲▼ 도 손잡이 드래그로 통일.

> ⚠️ **자동채움 상태를 DOM dataset 에만 두지 말 것.** 다시 그리는 순간 사라진다.
> 자료에 안 남길 거면 «값만 보고 다시 알아보는» 방법을 써야 한다.

---

## 2026-08-25y — 단가장: 적은 게 안 저장되던 것 + 머리줄 고정

**신고**: 「단가장에 새로 저장하면 저장이 안 돼서 없어지는데」

**원인**: 칸 하나 고칠 때마다 `renderBookList()` 로 **표를 통째로 다시 그렸다.**
`onchange` 는 «다음 칸으로 옮길 때» 터지는데, 그 순간 표가 새로 그려져
**방금 옮겨 간 칸이 DOM 에서 사라진다** → 거기 적던 값은 아무 데도 안 남는다.
`품명 → 규격 → 단위 → 묶음 → 단가` 처럼 이어 적으면 대부분이 날아갔다.

터지던 손잡이: `pbSetSpecPart`(규격) · `pbSetPack`(묶음) · `pbSetPackPrice`(묶음단가) ·
`setPbMatCategory`(유형) · `renamePBMaterial`(품명).

**고침**
- `pbSoftRender()` — **표 안에 커서가 있으면 다시 그리기를 미룬다.** 표 밖으로 나갈 때(`focusout`) 한 번만 그린다. 자료는 이미 `savePB()` 로 저장돼 있어 미뤄도 안 잃는다.
- 품명은 **키가 바뀌므로** 미루기만 하면 안 된다 → `_pbRekeyRow()` 로 그 줄의 `on*` 속성 안 옛 키를 새 키로 **갈아끼운다**(줄에 `data-pbs`/`data-pbk` 를 달아 찾는다). 다시 그리지 않으니 커서·적던 값이 산다.

검증(실제 함수): 새 품목 → 이름·규격 15mm·묶음 10·단가 3,000·묶음단가 28,000 을 이어 적었을 때
**다시 그리기 1회**, 모든 칸 DOM 유지, 자료 전부 저장 ✅

**＋ 표 머리줄 고정** — `.pbt-wrap` 에 `max-height:calc(100vh - 168px);overflow:auto` 를 주고
`thead th{position:sticky;top:0}` · 거래처 검정 줄 `top:23px`.

> ⚠️ **`.pbt-wrap` 은 `overflow-x:auto` 라 브라우저가 세로도 스크롤 상자로 만든다.**
> 그래서 높이를 정해 «표 안에서» 스크롤하게 해야 sticky 가 먹는다(페이지 스크롤로는 안 붙는다).
> 머리줄 밑줄은 border 로 두면 sticky 때 사라져서 `box-shadow:inset` 으로 그린다.
> ⚠️ **입력칸 `onchange` 에서 그 칸이 든 영역을 다시 그리지 말 것.** 적던 게 통째로 날아간다.
> (같은 사고: 샘플 코멘트 검색칸 · 원단 배분 검색칸 · 단가장 표)
> ⚠️ inline `onchange` 안에서 난 오류는 **조용히 삼켜진다** — 저장이 안 되는데 아무 표시도 안 난다.

---

## 2026-08-25z — 확인서 이미지에 화면 전용 것들이 같이 찍히던 것

**신고**: 「샘플확인서 이미지 저장하면 불러오기·삭제(×)·클릭 안내·빈 사진칸의 「사진」 글자가 그대로 나온다」

**원인**: 그걸 감추는 규칙이 **`@media print` 안에만** 있었다. 이미지 저장은 html2canvas 라 **화면 그대로** 찍는다 → 인쇄 규칙이 안 먹는다.

**고침**: `scSaveSheet()` 가 `body.sc-capturing` 을 붙였다 떼고, 같은 목록을 **@media print 밖에** 따로 둔다.
감추는 것: `.tp-editonly`(불러오기·＋부위 추가·줄 삭제 ×) · `.sc-gb` · `.sc-a4-add` · `.sc-a4-sec .hint` · `.sc-a4-pics .sc-add/.sc-px/.sc-pm` · 사진 딱지 · placeholder.
**올린 사진(img)·코멘트·치수 값은 그대로 남는다** (검증 완료).

> ⚠️ **인쇄용 규칙과 이미지 저장용 규칙은 따로 만들어야 한다.** `@media print` 는 html2canvas 에 안 먹는다.
> 화면 전용 UI 를 새로 만들면 **두 곳 다** 등록할 것.

---

## 2026-08-26a — 손잡이 드래그가 안 되던 것 (이름 충돌)

**신고**: 「드래그안돼」 (자수 위치·크기 표 손잡이)

**원인**: **앱에 `tpRowDragStart`/`tpRowDragMove`/`tpRowDragEnd`/`_tpRowDrag` 가 이미 있었다**
(`tpEditList` 목록 드래그용, 파일 뒤쪽 38300줄대).
내가 같은 이름으로 앞쪽(37470줄대)에 새로 만들었고 → **뒤에 있는 정의가 이겨서** 내 것이 통째로 안 돌았다.
누르면 초점 테두리만 생기고 아무 일도 안 일어났던 이유.

**고침**: `tpGripStart` / `tpGripMove` / `tpGripEnd` / `_tpGripRowAt` / `_tpGripDrag` 로 이름 분리.

> ⚠️ **새 전역 함수를 만들기 전에 같은 이름이 있는지 먼저 볼 것.** 38,000줄짜리 한 파일이라 조용히 덮인다.
> 확인법:
> ```
> grep -n "function 이름" index.html
> ```
> 전체 중복 검사(가끔 돌리기):
> ```
> python3 -c "import io,re,collections;s=io.open('index.html',encoding='utf-8').read();
> js='\n'.join(re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>',s,re.S));
> n=re.findall(r'^\s*(?:async\s+)?function\s+([A-Za-z_\$][\w\$]*)\s*\(',js,re.M);
> print([k for k,c in collections.Counter(n).items() if c>1])"
> ```
> 현재 남은 중복은 전부 **함수 안 지역 함수**라 안전: `itemRowHTML`(10358·14167) · `_qkOf`(34316·34363) · `add` · `chip`.

---

## 2026-08-26b — 작지 이미지가 흐리고 글씨가 뭉개지던 것

**원인 둘**
1. **배율 3배 고정** — A4 200mm 가 2,268px(≈288dpi) 밖에 안 나왔다.
2. 내용이 종이에 안 들어가면 `.tp-fit` 에 **축소(transform)** 가 걸리는데,
   html2canvas 는 «변형된 덩어리»를 작게 그린 뒤 늘려서 **글씨가 뭉개진다.**

**고침** — `_tpShotScales(ctx)`
- 축소가 걸린 만큼 배율을 **되올린다** (`want = 4 / 축소배율`, 최대 6)
- 후보를 **높은 것부터** 시도하고 실패하면 한 단계 낮춘다: `[want, 4, 3.5, 3, 2]`
- `toDataURL` 결과가 비었으면 실패로 보고 다음 단계로

| 기기 | 예전 | 지금 |
|---|---|---|
| 맥·크롬(한계 넉넉) | 3배 = 2,268px | **4배 = 3,024px** |
| 아이패드 사파리(한 변 4,090px) | 3배 = 2,268px | **3.5배 = 2,646px** |
| 내용 축소 0.75 걸린 경우 | 실질 2.25배 | 5.33 → 4 → 3 순으로 시도 |

> ⚠️ **배율을 올리면 캔버스 한계에 걸려 저장이 «통째로» 실패한다.** 반드시 낮은 배율로 되물러설 사다리를 둘 것.
> ⚠️ 4·3·2 같은 **정수 배율**은 표의 1px 선이 픽셀에 딱 떨어져 선이 안 흐려진다. 중간값(3.5)은 어쩔 수 없을 때만.
> ⚠️ **PDF 저장(`tpSavePDF`)도 같은 사다리를 쓴다.** 게다가 JPEG 0.92 였는데 글씨·표선 둘레에 얼룩(링잉)이 생겨 **0.97** 로 올렸다.

---

## 2026-08-26d — 작지 이미지가 아직도 흐림 (도식화 원본 + 크기 표시)

**도식화가 2,000px 로 줄여 저장되고 있었다** (`tpProcessImageFile` → `tpCompress(f,2000,0.85)`).
A4 이미지 저장 때 도식화 칸은 **~2,800px** 로 그려지니 늘려 그리느라 흐릿할 수밖에 없다.
→ **2,800px · 화질 0.93** 으로. (선 그림이라 JPEG 압축에 특히 약하다)

> ⚠️ **이미 올려둔 도식화는 그대로 2,000px 이다.** 또렷하게 하려면 그 그림만 다시 올려야 한다.

**＋ 저장된 이미지 크기를 알림에 표시** — 「이미지 저장됨 · 3024×4340px」.
흐릿하다는 신고가 오면 **이 숫자부터 물어본다**: 배율 사다리가 몇 단계까지 내려갔는지 바로 알 수 있다.

| 상황 | 알림 |
|---|---|
| 넉넉한 기기 | 이미지 저장됨 · **3024×4340px** |
| 사파리 한계(4,090px) | 이미지 저장됨 · **2646×3798px** |

---

## 2026-08-26e — ★글씨가 「3개 겹쳐 쓴 것처럼」 나오던 진짜 원인

배율 문제가 아니었다. **같은 글자를 두 군데서 각각 그리고 있었다.**

| 그리는 곳 | 하는 일 |
|---|---|
| `tpCaptureTextOverlay` (살아있는 화면) | 칸 위에 `div.tp-capture-text` 를 **덮어** 그리고, 원래 칸은 `visibility:hidden` |
| `tpCaptureFixVAlign` (onclone, 복제본) | 복제본의 `textarea` 를 글자 `div` 로 **갈아끼움** |

지시사항(textarea)은 **둘 다** 걸려서 글자가 두 겹.
게다가 한쪽은 `position:absolute` + 복사한 padding, 다른 쪽은 정상 흐름 + `padding:cs.padding` 이라
**줄마다 몇 px 씩 어긋나** 세 겹처럼 번져 보였다. 굵어 보이던 것도 이 때문.

**고침**
1. `tpCaptureTextOverlay` 는 **종이(`.tp-wrap`) 안 textarea 를 건너뛴다** — 복제본 쪽에만 맡긴다.
2. `tpCaptureFixVAlign` 에서 **덮어 그린 자리(`[data-tp-hid]`)의 값을 복제본에서 비운다** — html2canvas 가 숨긴 input 값을 그려도 안 겹치게.

검증(실제 함수, 복제본에서 같은 글자가 몇 번 그려지나): **옛 방식 2 → 지금 1** ✅ (지시사항·담당자·치수 전부 1)

> ⚠️ **캡처용 글자 그리기는 «한 군데»에서만 해야 한다.**
> 지금 규칙: 종이 안 `textarea` = onclone 쪽(`tpCaptureFixVAlign`) · `input` = 덮어그리기 쪽(`tpCaptureTextOverlay`).
> 어느 한쪽을 손대면 **반대쪽이 같은 글자를 또 그리지 않는지** 반드시 확인할 것.
> ⚠️ 흐릿하다는 신고가 오면 배율(2026-08-26b·d)부터 의심하기 전에 **겹쳐 그리는지** 먼저 볼 것 — 겹침은 배율을 아무리 올려도 안 없어진다.

---

## 2026-08-26f — ★화질이 «더» 나빠진 이유 (원본을 늘려서 저장하고 있었다)

`tpCompress` 는 속도 때문에 **디코딩하면서 줄이는** 길을 썼다:
```js
createImageBitmap(file,{resizeWidth:maxDim,resizeQuality:'high'})
```
그런데 `resizeWidth` 는 **원본이 작아도 그 크기까지 «늘린다».**
그래서 1,200px 짜리 도식화가 2,800px 로 뻥튀기된 뒤 JPEG 로 다시 구워졌다 →
**파일만 커지고 그림은 뿌예짐.** (내가 maxDim 을 2,000→2,800 으로 올리면서 더 심해졌다)

**고침**: 원본 그대로 디코딩하고 줄이기는 `draw()` 에 맡긴다.
`draw()` 의 `sc=Math.min(1, maxDim/Math.max(w,h))` 가 **절대 안 늘린다.**

검증(실제 `tpCompress`):

| 원본 | maxDim 2800 | 결과 |
|---|---|---|
| 1200×800 | | **1200×800** (안 늘어남) ✅ |
| 4000×2600 | | 2800×1820 ✅ |
| 2800×1800 | | 2800×1800 ✅ |
| 1500×3600 (세로) | | 1167×**2800** (긴 변 기준) ✅ |

**＋ 즉시 미리보기 900px·0.7 → 1,400px·0.85** — 화면 칸이 ~840px 인데 900·0.7 이라
«올린 직후»가 눈에 띄게 나빴다(업로드 끝나면 고화질로 바뀌지만 그 사이).

**＋ 복제본 지시사항 div 에 글자 속성 전부 복사** — 몇 개만 복사해서 화면과 다른 자간·글꼴 다듬기로 그려졌다.
덮어그리기(`tpCaptureTextOverlay`)와 **같은 목록**을 쓴다.

> ⚠️ **`createImageBitmap` 의 `resizeWidth` 는 작은 원본을 늘린다.** 줄이기 전용이 아니다.
> 이미지 크기를 다룰 땐 반드시 `Math.min(1, …)` 로 «늘리지 않음»을 못박을 것.

---

## 2026-08-26g — 단가장 검색 한글 깨짐 + 머리 정리

**① 검색이 「4하ㅏ」로 깨지고 끊기던 것**
`pbTrimSet('q',…)` 가 글자 칠 때마다 `renderBookList()` 로 **표를 통째로 다시 그려** 입력칸이 사라졌다 → 한글 조합이 끊긴다.
**세 번째 같은 사고** (샘플 코멘트 검색칸 · 원단 배분 검색칸 · 단가장 검색칸).

고침:
- 입력칸에 `oncompositionstart/end` → **조합 중엔 아무것도 안 함**
- 그 외엔 **220ms 쉬었다** 한 번만 그림
- 다시 그린 뒤 **커서 자리 복원**

검증: 조합 중 재렌더 **0회** · 조합 끝나고 **1회** · 영문 4글자 빠르게 쳐도 **1회** · 거래처/유형 선택은 즉시 ✅

**② 머리가 정신없던 것**
```
[전] 검색 → 백업/중복정리/건물명 → 부자재 종류 칩 15개+종류추가 → 단가표사진 일괄가져오기 → 거래처 직접추가 → 표
[후] 거래처 직접추가 → 검색 → ▸정리 도구 → 표
```
접이식 「정리 도구」 안: 백업/되돌리기 · 중복 자동정리 · 건물명 통일 · **단가표 사진 일괄 가져오기** · **부자재 종류 칩(＋종류 추가·이름변경·삭제)**

> ⚠️ **지운 게 아니라 접어 둔 것.** 부자재 종류는 표의 「유형」 드롭다운이 계속 쓰고,
> 종류 이름변경·삭제와 사진 일괄 가져오기는 여기 말고 들어갈 데가 없다.

> ⚠️ **입력칸 `oninput` 에서 그 칸이 든 영역을 다시 그리지 말 것** — 이제 네 번째다.
> 새 검색칸을 만들 땐 처음부터 `_cmp`(compositionstart/end) 가드를 넣을 것.

---

## 2026-08-26h — 「도식화가 다 안 뜨는」 것 + 검색할 때 창 크기 변하던 것

**① 도식화 목록이 빠지던 이유**
`_tpSketchItems` 가 **세 칸만** 봤다: `sewSketch` · `cutSketch` · `spatSketch`.
2026-08-19 에 샘플·패턴 **회차**(spat2·spat3…)를 만들면서 도식화 칸도 늘었는데 여기를 안 고쳤다.
→ 2·3차에만 올린 도식화는 목록에 **아예 안 떴다.**

고침: `images` 안에서 이름에 `Sketch` 가 든 칸을 **전부** 훑는다.
아이템 하나가 여러 장이면 **여러 장 다** 보여주고(회차별로 고를 수 있게), 같은 그림이 두 칸에 있으면 한 번만.
툴팁에 「울자켓 · AR44 — 샘플·패턴 2차」처럼 **어느 지시서 것인지** 표시.

검증(시험 자료 8아이템): **예전 5개 → 지금 8개**, 2·3차만 있던 것 뜸 ✅, 같은 그림 1번 ✅, 지금 아이템 제외 ✅

**② 검색할 때마다 창이 커졌다 작아졌다**
결과 칸(`#tp-sk-grid`·`#tp-sp-list`)에 높이가 없어 결과 수만큼 늘었다 줄었다 했다.
→ `height:58vh;min-height:300px;overflow:auto` 로 고정. 카드 8→3→0 이어도 높이 그대로 ✅

> ⚠️ **회차·시트를 새로 만들면 «그 칸을 훑는 곳»도 같이 고칠 것.**
> 도식화 목록(`_tpSketchItems`) · 치수 목록(`_tpSpecItems`) · 확인서 치수 출처(`_scSpecSheetKeys`) 처럼
> 「모든 시트를 도는」 자리가 여러 군데다. 하나 빠지면 조용히 «안 보임» 으로 나타난다.
> ⚠️ **검색 결과 칸엔 높이를 박아 둘 것.** 안 그러면 칠 때마다 창이 들썩인다.

---

## 2026-08-26i — 단가장을 업체별 표로 나눔

한 표에 검정 띠로 업체를 구분하던 것 → **업체마다 표를 따로**.

각 표의 `<thead>` 에 **업체 띠 + 열 이름** 두 줄을 넣어 2단 sticky:
```
tr.pbt-sup td { position:sticky; top:0    }   ← 업체 띠 (높이 35px 고정)
tr.pbt-hd  th { position:sticky; top:35px }   ← 유형·품명·규격 …
```
스크롤하면 지금 보는 업체의 띠와 열 이름이 같이 붙어 있고, 다음 업체 표가 오면 자연스럽게 교대한다.

> ⚠️ **업체 띠 높이(35px)와 열 이름 `top` 값은 반드시 같아야 한다.** 어긋나면 겹치거나 틈이 생긴다.
> td 에 `height:34px` 을 줘도 `border-bottom:1px` 때문에 실제는 **35px** 이다. 안에 단추가 있어 line-height 만으론 안 정해진다.
> 띠 안 단추 크기를 바꾸면 이 값도 같이 확인할 것.

검증: 표 2개(업체 수만큼) · 품목 없는 업체는 표 없음 · 거래처 거르면 1개 · 스크롤 후 띠 0px/열이름 35px, 틈·겹침 0 ✅

---

## 2026-08-26k — 스트링: 두 가지 요척 나누기

**실제 업무** — 스트링 발주엔 요척이 둘 필요하다:
```
스트링 끈 요척   1.7 야드   ← 스트링 1개당 (끈 원자재)
스트링 개당 요척  1 개      ← 옷 1장당 (몇 개 다나)
```

**넣은 자리**: 「개당·조건부」 가공비 줄에 `× [1] 개/장` 칸 (`tc.qtyPerPiece`) — 사용자 선택.

**두 군데에 쓰인다**
| | 계산 |
|---|---|
| 공임 | `개당단가 × 개당요척 × 장수` (`_tcQtyPerPiece` — **가공비 자기 값 우선**, 없으면 부자재 벌당개수, 없으면 1) |
| 원자재 야드 | `끈요척 × 장수 × 개당요척` (`_pcsPG(t)` — 부자재의 **새 칸 `pcsPerGarment`**) |

> ⚠️ 부자재 쪽엔 **새 이름 `pcsPerGarment`** 으로 옮긴다. 기존 `qtyPerPiece` 를 건드리면
> 단추·라벨 등 이미 그 칸을 쓰는 부자재 계산이 조용히 바뀐다. `colTrimCosts` 가 거울처럼 옮겨 준다.

**발주서 「가공」 블록** (`_poProcBlocks`) — 개당·조건부 가공만, **담당업체가 그 발주서 거래처와 같을 때만**:
```
스트링 제작 138cm 악어 팁 니켈컬러 10mm (1,100원)
#44카키   - 23개
#69네이비 - 43개
합계 66개
```
「한번에」·「컬러별」 가공은 예전처럼 「가공: 이름」 한 줄. 이름과 종류가 사실상 같으면(「스트링 제작」/「스트링제작」) 한 번만 쓴다.

검증(실제 함수, 사용자 자료):

| | 결과 |
|---|---|
| 카키 23장 | **39.1y → 1롤** · 공임 25,300원 |
| 네이비 43장 | **73.1y → 1롤** · 공임 47,300원 |
| 벌당 2개로 바꾸면 | 78.2y · 개수 46/86 (둘 다 2배) |
| 개당요척 비우면 | 39.1y · 개수 1 (**예전과 동일**) |
| 남의 거래처 발주서 | 블록 안 들어감 |

> ⚠️ **`calc-check.sh` 의 함수 목록에 `_pcsPG` 를 넣어야 한다.** `_calcTrimNeedRaw` 가 부르므로
> 안 넣으면 「문제 3」이 ReferenceError 로 죽는다. 계산 함수에 새 헬퍼를 쓰면 이 목록도 같이 고칠 것.

---

## 2026-08-26m — ★호출부만 들어가고 함수는 안 들어간 사고

`2026-08-26j` 에서 라벨 「단가장 등록」 버튼을 넣을 때,
**한 python 스크립트 안에서 ①함수 추가 ②호출부 추가**를 연달아 했는데
②가 `AssertionError` 로 죽으면서 **스크립트가 파일을 저장하기 전에 끝났다.**
그런데 ①의 「OK」는 이미 찍힌 뒤라 **성공한 줄 알았다.**

이어서 호출부만 따로 넣어 저장 → **`_pbLabelBadge` 는 부르는데 정의는 없는 상태**로 배포됐다.
라벨 카드를 그릴 때 ReferenceError 가 나서 **부자재 카드가 통째로 안 그려질 수 있었다.**

> ⚠️ **여러 수정을 한 스크립트에 담을 땐, 다 성공한 뒤 «마지막에 한 번만» 파일을 쓴다.**
> 중간에 실패하면 아무것도 안 바뀌어야 한다. 지금 쓰는 `sub1()` 패턴이 그 구조다 —
> 다만 **한 번이라도 assert 가 터지면 그 실행에서 저장이 아예 안 된다**는 걸 기억할 것.
> ⚠️ **밀어 넣은 뒤 `grep -c "function 이름"` 로 «정의»가 들어갔는지 확인할 것.** 호출부만 세면 못 잡는다.
> 배포 확인 때도 정의·호출을 **둘 다** 센다.

**복구** — 함수 4개(`_pbLabelName`·`_pbHasLabel`·`pbRegisterLabel`·`_pbLabelBadge`) 다시 넣고,
`_pbLabelBadge` 는 안에서 try/catch 로 감싸 **어떤 값이 와도 카드 그리기를 안 죽이게** 했다.

검증: 미등록→「단가장 등록」 · 등록 후→「✓ 단가장」 · 다시 누르면 갱신(항목 안 늘어남) ·
거래처/이름 없으면 안내만 하고 저장 안 함 · `null` 을 넣어도 안 죽음 ✅

---

## 2026-08-26n — 거래처 추가 버튼 · 거래처 종류 직접 지정 · 묘비 사고

**① 「＋ 거래처 직접 추가」 큰 폼 → 버튼 하나**
상단에 **「＋ 거래처 추가」** 버튼만 두고, 누르면 창(`openAddSupModal`)에서 입력.
칸 id 는 예전 그대로(`newpb-*`) 라 `addPriceBookEntry` 는 안 고쳤다.

**② 「하나라벨이 부자재 단가장에 안 뜬다」**
`_pbSupKind` 가 **품목 종류로만** 판정했다 → 품목 0개면 `'none'` → 부자재 단가장 필터(`trim|both`)에 안 걸린다.
(원단 단가장은 `!=='trim'` 이라 거기엔 떴다.)
→ **`pb.kind`(직접 지정)가 있으면 그게 이긴다.** 추가 창에서 부자재처/원단처/둘 다 고른다.
→ 이미 있는 거래처면 **막지 않고 종류만 바꿔 「옮겨」** 준다.

**③ ★삭제한 이름으로 다시 만들면 또 사라지는 사고**
거래처를 지우면 `_tombArr('pbSup',name)` 로 **묘비**가 남는다.
같은 이름으로 다시 만들면 `_mergeSharedSmart` 가 그 묘비를 보고 **동기화 때 또 지운다.**
→ 추가·옮기기에서 `delete S._tomb.pbSup[name]` 로 **묘비를 먼저 푼다.**

> ⚠️ **묘비가 있는 컬렉션은 «같은 키로 되살릴 때» 반드시 묘비를 풀어야 한다.**
> pbSup 말고도 refCards·matExtra·defectRecs 등 묘비 쓰는 곳 전부 같은 함정.

**④ 품목 0개 거래처도 표를 보여준다** — 안 그러면 「＋ 품목」을 누를 데가 없어 첫 품목을 못 넣는다.
(검색·거르개 중일 땐 뺀다)

**⑤ 표 안쪽 스크롤 제거** — 사용자가 싫어함. `.pbt-wrap` 에서 `overflow`·`max-height` 를 빼서 **페이지가 스크롤**되게.
머리줄 sticky 는 그대로 살아 있다(스크롤 상자가 아니어야 페이지 기준으로 붙는다).
좁은 화면(≤1180px)에서만 가로 스크롤을 켠다.

---

## 2026-08-26q — ★완성부자재 비용이 사라지던 것

**신고**: 「완성부자재가 갑자기 없어지고」 「왜 추가도 안 되지」 (허니스웨이드숏츠)

**원인**: `saveItemForm` 이 완성부자재 비용을 **화면에서만** 긁어온다.
```js
const finishRows=document.querySelectorAll('#finish-cost-rows .trim-row');
item.finishCosts=[...finishRows].map(...)   // ← 칸이 없으면 []
```
그 칸이 없거나 아직 안 그려진 상태에서 저장이 돌면 **빈 배열로 덮여 자료가 통째로 날아간다.**
2026-08-25 샘플 코멘트(`smpRounds`) 유실과 **똑같은 구조**.

일회비(패턴비·샘플비·기타 1회성·이름·포함여부)도 `?.value||0` 이라 칸이 없으면 **0으로 덮였다.**

**고침** — 칸이 있을 때만 덮어쓰고, 없으면 **옛 값을 지킨다** (`_oldI` / `_numOf` / `_strOf`).
`＋ 추가` 버튼도 칸이 없으면 조용히 아무것도 안 하던 걸 안내로 바꿨다.

> ⚠️ **저장할 때 화면에서 긁어오는 값은 「칸이 없을 때」를 반드시 정할 것.**
> `querySelectorAll(...)` → 빈 배열, `?.value||0` → 0. 둘 다 **조용한 자료 유실**이다.
> 지금까지 같은 사고: `smpRounds`(08-25) · `ideaData`·`ss*`(08-25) · `finishCosts`·일회비(08-26).
> 새 필드를 폼에 붙일 때 이 규칙을 먼저 볼 것.

**되살리기**: 자료가 이미 날아갔으면 **데이터 관리 → 옵션 0 「자동 백업에서 되돌리기」** —
저장할 때마다 스냅샷을 5개 보관하므로 지워지기 직전 시점을 고르면 된다.

---

## 2026-08-26r·s — 라벨도 단가장에서 불러오기 · 스트링 로스

**① 「부자재칸이 갑자기 다시 바뀌었어」 · 「단가 변경 안 되게 해야지」 — 한 원인**
`_lockTrimPbFields`(단가장 잠금 + 거래처 글자줄)가 **한 줄에서 오류가 나면 나머지 줄이 통째로 안 잠겼다.**
부르는 쪽이 `try{}catch{}` 라 아무 표시도 안 났다.
→ **줄마다 따로 감싼다** + 실패는 `console.warn` 으로 남긴다. 라벨 칸(`#label-trim-rows`)도 같이 훑는다.

**② 「라벨도 여기서 단가장 불러오게 해줘 — 부자재 단가장이랑 동일하게」**
라벨은 `t.name` 이 「케어라벨」·「메인라벨」로 **고정**이라 단가장을 이름으로 못 찾았다.
→ `_pbTrimName(t)` — 라벨이면 `labelName`(부자재 규격명)으로 찾는다. `_pbHasTrim`·`_pbFindTrimMat`·`_pbTrimBadge` 전부 이걸 쓴다.
→ 잠근 칸은 **단가장 값으로 채운다**(예전엔 잠그기만 해서 0 인 채 남았다). 채운 뒤 `colTR()` 로 메모리에도 옮긴다.

> ⚠️ **잠그기만 하고 값을 안 채우면 0 으로 저장된다.** 잠금 = 「단가장이 주인」이므로 값도 단가장에서 가져와야 한다.

**③ 「스트링 로스는 끈이랑 갯수 둘 다 들어가야 되는데」**
발주서 가공 블록이 `basePcs`(**로스 전** 의뢰수량)를 쓰고 있었다 → 끈은 35장(59.5y)인데 개수만 30개.
→ `needPcs`(**로스 포함**, 실제 계산에 쓴 장수)를 먼저 쓴다.

검증(사용자 실제 발주서: 의뢰 30 + 로스 5):

| | |
|---|---|
| 끈 | 1.7 × 35 = **59.5y → 1롤** |
| 스트링제작 | **35개 / 35개 · 합계 70개** |
| 개당요척 2개 | 끈 119y · 개수 70/70 (둘 다 2배) |
| 로스 10% 방식 | 1.7 × 30 × 1.1 = 56.1y |

> ⚠️ `calc` 안의 두 장수를 헷갈리지 말 것: **`needPcs` = 로스 포함(발주 기준)** · `basePcs` = 로스 전 의뢰수량(거래처 확인 표시용).

---

## 2026-08-26t — ★요척이 「아무렇게나」 써 있던 것 (부자재 전수 점검)

**신고**: 「심지랑 다데테이프 같은 부자재에 요척이 자꾸 아무렇게나 써있어」

**원인**: `autofillTrim` 이 단가장 항목에서 **아이템마다 다른 값**까지 끌어왔다.
단가장 항목은 «자재 하나 = 항목 하나»라 모든 아이템이 공유한다 →
A 아이템에서 적은 심지 요척 0.5 가 단가장에 저장되고, B 아이템에서 심지를 고르면 **0.5 가 자동으로 들어온다.**
바이어스 「원단출처가 뜬금없이 이티」(08-26v)와 **똑같은 구조**.

**전수 점검 결과** — 자동채움 목록을 자재 고유값만 남기고 정리:

| 남긴 것 (자재 고유) | 뺀 것 (아이템마다 다름) |
|---|---|
| 폭 · 무게 · 온즈 · 혼용률 · 롤당y · 절당y · 색당개수 · 실 미니멈 · 야드당고리 · 라벨이름 · 제조국 | **요척**(consumptionPerPiece) · **벌당개수**(qtyPerPiece) · **용도**(part) · **부위**(labelPart) · **제조연월**(manufactureYM) · 규격(biasSpec)·원단출처(fabricSource) — 뒤 둘은 08-26v 에 이미 제거 |

**＋ 저장 쪽도 막았다** — `saveToPB` 가 그 값들을 아이템에서 단가장으로 **덮어쓰지 않는다**(`existing` 유지).
안 그러면 자동채움만 막아도 단가장이 계속 오염되고, 단가장 상세에서 정한 값이 아이템 저장 때마다 뭉개진다.
(단가장 상세 화면에는 요척·벌당개수·용도·부위 칸이 **아예 없다** = 원래 자재값이 아니라는 뜻)

> ⚠️ **`autofillTrim` 의 자동채움 목록엔 «자재 고유값»만 넣을 것.**
> 판단 기준: *같은 자재를 다른 옷에 써도 늘 같은 값인가?* 아니면 넣으면 안 된다.
> ⚠️ **`saveToPB` 도 마찬가지** — 아이템 값으로 단가장을 덮으면 다음 아이템에 새어 나간다.

검증(실제 `autofillTrim`, 오염된 단가장 항목으로): 7개 전부 **빈칸 유지** ·
롤당y 100 · 혼용률 폴리100 · 단가 50,000 은 정상 · 내가 적은 요척 0.15 는 안 건드림 ✅

> **이미 단가장에 들어간 값**은 그대로 남아 있지만 더 이상 아이템으로 넘어오지 않는다.

---

## 2026-08-26u — 원단 「오무데」 칸

능직 방향(우상/좌상). **단가장이 주인** — 사용자 확정 「이것도 단가장에서만 쓰는 거」.
요척·용도와 달리 **같은 원단이면 늘 같은 값**이라 자재 고유값으로 다룬다(08-26t 판단 기준 적용).

| 어디 | 무엇 |
|---|---|
| 원단 단가장 표 | 원단 줄의 「롤당야드」 자리(원단엔 `—` 였다)에 **오무데 고르기** (`updatePBSpec(...,'omude',...)`) |
| 아이템 원단 카드 | 폭 옆에 「오무데」 — `autofillFab` 가 단가장 값으로 **채운다** |
| 작지 원·부자재 | 규격줄에 `58" · 오무데 좌상` (없으면 안 나옴) |
| 단가장 등록 버튼 | `pbRegisterFormMat('fab')` 도 오무데 같이 올림 |

검증: 단가장 우상 → 카드 「우상」 · 단가장에서 좌상으로 바꾸면 카드도 좌상 · 작지 규격줄 `58" · 오무데 좌상` · 오무데 없으면 규격줄 깔끔 ✅

---

## 2026-08-26v — 오더 공장 「다시 맞추기」

**신고**: 「결제 업체 바뀐 걸로 바꿔줘」

오더는 만들 때 공장을 **얼려 둔다**(`o.fcMap`) — 아이템 공장을 나중에 바꿔도 옛 오더 결제가 안 움직이게.
**의도된 동작**이라 자동으로 따라가면 안 된다(지난달 정산한 돈이 다른 공장으로 옮겨감). → **사용자가 누를 때만.**

**결제 카드에 「공장 바뀜 N건 · 다시 맞추기」 배지** (다른 게 있을 때만 뜸) → `orderResyncFc(oid)`

같이 옮기는 것:
| | |
|---|---|
| `o.fcMap[아이템][공장키]` | 새 공장 |
| `o.payments['fc_<공장>_<비용키>']` | 결제 체크·날짜 (옛 키 삭제) |
| `o.factorySchedules[공장]` | 출고 회차·부가세 — **옛 공장이 이 오더에서 완전히 안 쓰이게 될 때만**. 한 공장이 여러 공정을 맡고 있으면 회차가 딸려 가므로 안 옮긴다. 새 공장에 이미 회차가 있어도 안 섞는다 |

> ⚠️ **이미 결제 「완료」인 공정은 안 건드린다**(사용자 확정). 확인창에 「완료라 안 바꿉니다 · 먼저 완료를 푸세요」로 알려만 준다.
> ⚠️ 바꾸기 전에 **무엇이 어디로 가는지 확인창에 전부 보여주고** 「예」를 받아야 한다. 돈이 움직이는 자리다.

검증(실제 함수):

| | |
|---|---|
| 자수 백제사→새자수집 · 완성 흥민사→새완성집 | 둘 다 옮김 · 결제키·회차 같이 · 옛 키 삭제 ✅ |
| **봉제가 결제 완료인 채로 바뀜** | 봉제는 **f1 그대로** · 결제 `{paid:true}` 그대로 · 출고회차 100장 그대로 ✅ |
| 완료를 풀고 다시 누름 | 그때 봉제도 옮겨짐 ✅ |
| 취소 | 아무것도 안 바뀜 ✅ |
| 두 번째 누름 | 「바뀐 공장이 없어요」 ✅ |

---

## 2026-08-26x — ★샘플 코멘트 창이 겹쳐 뜨던 것 (CSS 순서)

**신고**: 「코멘트 창이 이상하게 뜨는데 왜 그러지」 — 확인서가 목록 **위에 겹쳐서** 떴다.

**원인**: **미디어쿼리를 기본 규칙보다 «위»에 써 놨다.**
```css
@media(max-width:1280px){ #sccm-body .sc-sl{position:static;max-height:none} }   ← 먼저
#sccm-body .sc-sl{...position:sticky;max-height:calc(100vh - 40px)...}           ← 나중 (이김)
```
**미디어쿼리는 우선순위를 올리지 않는다.** 같은 특정도면 «나중에 쓴 것»이 이긴다.
그래서 1단으로 바뀌어도 목록이 계속 `sticky` 로 붙어 있었고, 그 밑으로 흐르는 확인서와 겹쳤다.

**고침**: 미디어쿼리 블록을 **기본 규칙 전부 뒤로** 옮겼다.
검증: `position:static` · `max-height:none` · 목록 아래(327) → 확인서 위(345) **안 겹침** ✅

> ⚠️ **미디어쿼리는 항상 그 요소의 기본 규칙 «뒤»에 쓸 것.** 앞에 쓰면 조용히 무시된다.
> 이 파일은 한 곳에 CSS 가 길게 쌓여 있어 특히 쉽게 어긋난다.

**＋ 검색칸 레트로** — 샘플 코멘트 검색칸·드롭다운·지우기·브랜드 알약을
`2px solid var(--ink)` 각진 테두리 + `2px 2px 0` 그림자로 (요청).

**＋ 작지 안 이동탭은 작게** — 15px/42px 이 작지 머리에선 자리를 너무 먹었다 → `#tp-modal .ctxbar button{12.5px/32px}`.
아이템 수정 화면은 그대로 크게.

## 2026-08-26y — 작지 넘나들기 탭 글씨가 아래로 처짐
- **뿌리**: `#tp-modal .ctxbar{height:30px}` 로 바 높이를 고정했는데 버튼은 `min-height:32px`.
  넘친 2px가 `overflow:hidden` 으로 **아래쪽만 잘려서** 위여백 12.3 / 아래여백 6.0 이 됐다.
- **고침**: 바 `height:auto` + `.ctxbar button` 을 `inline-flex; align-items:center; line-height:1`.
  작지 안 버튼은 `min-height:28px; padding:5px 14px 6px` 로 바 크기를 그대로 유지(30→31px).
- ⚠️ **글씨가 처져 보이면 먼저 «잘림»을 의심할 것.** 컨테이너 고정높이 < 아이템 높이 + overflow:hidden 조합.
- ⚠️ 작지(`#tp-modal`)는 폰트가 **IBM Plex Sans KR** 이라 애플 기본폰트와 위아래 여백이 다르다.
  ctxbar 같은 공용 부품을 잴 땐 **그 화면의 실제 폰트로** 재야 한다.

## 2026-08-26z — 작지 오른쪽 「코멘트」 칸 (같이 보기)
- 작지 머리의 「코멘트 열기」 → `#tp-cmt` (오른쪽 340px 고정 칸). 글(미팅전·미팅후)만, 사진·사이즈표는 뺐다.
- ⚠️ **저장은 샘플 코멘트와 같은 자리**(`it.smpRounds`) — `scSetMemo` / `_scWrite` 만 쓴다. 새 통로 금지.
- ⚠️ **`scAddRound` / `scToggleRoundDone` 를 쓰지 말 것.** 그 함수들은 `renderSampleComment()` 를 불러
  코멘트 탭에서 고른 아이템(`window._scOpen`)까지 바꿔버린다. 여기선 자료만 고치고 이 칸만 다시 그린다.
- ⚠️ 글칸은 **onchange 로만 저장**. `oninput` 으로 저장/재렌더하면 한글 조합이 깨진다(전에 4번 터진 자리).
  `oninput` 은 칸 높이 조절(`tpCmtGrow`)에만 쓴다 — 값을 안 건드리므로 안전.
- `tpScreenFit` 의 자리 폭 기준을 `modal.clientWidth` → **`doc.clientWidth`** 로 바꿨다.
  칸이 열리면 `.tp-doc` 이 `margin-right:340px` 로 줄어 자동 반영되고, 닫혀 있으면 두 값이 같아 예전과 동일.
- 폰(≤900px)에선 칸이 작지를 **덮는다**(`margin-right:0`). 인쇄는 `@media print` **두 블록 모두**에서 숨김.
- 알려진 것: A4 좌우 여백이 17px쯤 어긋난다(축소되면 스크롤바가 사라져 폭이 늘어나는데 여백은 이미 계산된 뒤).
  **이 칸과 무관하게 원래 있던 것** — 열림/닫힘 편차가 같다.

## 2026-09-01a — 단추 「크기」만 잠기지 않던 것
- **뿌리**: 잠금 목록 `_TRIM_PB_LOCK_FIELDS` 에 `'buttonSize'` 가 빠져 있었다.
  「크기」 칸은 종류마다 이름이 다르다 — 일반 `size` · 단추 `buttonSize` · 지퍼 `zipperSize` · 스냅 `snapSize`.
  일반·지퍼·스냅은 넣었는데 단추만 `buttonStyle`(스타일)만 넣고 `buttonSize`(크기)를 빠뜨렸다.
  그래서 같은 카드 안에서 **스타일은 점선(잠김) · 크기는 실선(안 잠김)** 이 됐다.
- **피해 2가지**: ① 아이템에서 단추 크기를 고칠 수 있었다(단가장이 주인인 값인데)
  ② `_pbRefreshOpenTrims` 도 같은 목록을 쓰므로 **단가장에서 크기를 고쳐도 아이템에 다시 안 불러왔다**.
- `_pbMatVal` 은 이미 `buttonSize→m.size` 매핑을 갖고 있었다 — 목록에만 없어서 그 코드가 한 번도 안 돌았다.
- ⚠️ **새 부자재 종류를 만들면 그 「크기」 칸 이름을 `_TRIM_PB_LOCK_FIELDS` 에 꼭 넣을 것.**
- 아직 목록에 없는 자재 속성(확인 필요): `composition` `labelName` `madeIn` `threadQty` `sliderLogoText` `hasSliderLogo`
  — `autofillTrim` 이 단가장에서 끌어오는데 잠금 목록엔 없다. 아이템별로 달라야 하는지 확인 후 처리.

## 2026-09-02a — 단가장 유형(심지 등)을 바꿔도 화면에 반영 안 됨
- **뿌리**: `pbSoftRender()` 는 «표 안에 포커스가 있으면» 다시 그리기를 blur 때까지 미룬다(한글 조합 보호).
  그런데 **드롭다운은 고른 순간 그 select 가 activeElement** 라 항상 미루기에 걸렸다 →
  자료엔 들어갔는데 화면은 그대로 = 「반영이 안돼」. 다른 데를 클릭해야 그제서야 바뀌었다.
- **고침**: `pbSoftRender(force)` 추가. **조합이 없는 select 만** `force=true` 로 부른다(`setPbMatCategory`).
  글자 칸은 예전대로 미룬다 — 여기서 force 를 쓰면 한글 조합이 깨진다.
- ⚠️ 앞으로 단가장에 **드롭다운을 새로 만들면** 그 핸들러도 `pbSoftRender(true)` 로 부를 것.
- 같이: 유형 띠(「심지 15」)에 **「＋ 품목」** — `pbTrimAddMat(encSup, encCat)` 로 그 유형으로 바로 만든다.
  「미분류」 띠에서 누르면 유형은 빈 값. 거래처 띠의 기존 「＋품목」은 그대로(유형 없음).

## 2026-09-02b — 세로 작지 스와치를 세로로 쌓기
- 세로 작지는 폭이 200mm 뿐이라 컬러 4개면 칸이 좁아져 「배색」 글자가 잘렸다(신고).
- **세로 작지 + 컬러 2개 이상**이면 컬러를 **줄**로 쌓는다(`table.tp-swv`). 가로 작지는 그대로.
- 자수실은 컬러 이름 밑으로 (`th.tp-swvh` 안).
- ⚠️ **줄 높이를 인라인 `style="height:.."` 로 주면 안 된다** — 이 규칙들이 `!important` 로 이긴다:
  `#tp-modal .panel[data-panel="sew"] .tp-swrow{height:70px!important}` ·
  `#tp-modal .tp-doc:not(.land) .panel[...] .tp-swrow{height:98px!important}`
  → 테이블에 `style="--swvh:75px"` 로 넘기고 `.tp-swv tr.tp-swrow{height:var(--swvh)!important}` 로 받는다.
  (목업에서도 같은 함정에 걸렸다 — `height:auto!important` 가 인라인을 무시시켰다.)
- 높이 = `min(96, max(58, 300/컬러수))` → 2~3컬러 96px · 4컬러 75px · 5컬러 60px.
- `swRow`(문자열 join) → `swCells`(배열)로 바꿔 가로/세로가 같은 칸 만들기를 공유한다.

## 2026-09-02c — 「다른 기기에서 받기」가 자꾸 뜨면서 안 되던 것
- **뿌리 ①**: `isEditingNow()` 가 «`-modal` 로 끝나는 창이 하나라도 열려 있으면» **무조건 편집 중**으로 봤다.
  그래서 아무것도 안 적는 창(클라우드 설정·보고서·명세서·복구 도구…)을 열어둔 동안
  원격 변경이 **계속 배너로만 뜨고 자동 반영이 안 됐다**.
  하필 「동기화가 안 되네?」 하고 **클라우드 창을 열면 그때부터 더 막히는** 구조였다.
  → 보기 전용 창 8개(`cloud/progress-report/receipt/defect-history/keygen/manual-restore/task-next/schedule`)는
    열려 있어도 편집 중으로 안 본다. 그 창 **안 입력칸에 커서가 있으면** 맨 위 activeElement 규칙이 여전히 잡는다.
  ⚠️ 값을 적는 창(발주 생성·수량 편집·작지·아이템 폼)은 **예전 그대로** — 적던 게 날아가면 안 된다.
- **뿌리 ②**: `applyPendingRemote()` 에 try/catch 가 없어, 한 군데서 오류가 나면
  **나머지(보조·발주·업체단가장)가 통째로 안 들어오고 알림도 없이 조용히 끝났다**.
  → 하나가 실패해도 나머지는 받고, 배너를 되살리고, 무엇이 실패했는지 알린다.
- **뿌리 ③**: 받을 게 없는데 배너만 남아 있으면 눌러도 아무 일이 없었다(= 「안 된다」).
  → 그 경우 `cloudSyncLoad()` 로 **클라우드에서 다시 받는다**.
- ⚠️ 새 모달을 만들 때 «값을 적는 창»이면 아무것도 안 해도 되고, «보기 전용 창»이면
  `_viewOnlyMods` 에 넣어야 그 창 때문에 동기화가 막히지 않는다.

## 2026-09-02d — 단가장 3건 (값 소실 · 업체 열기 · 검색칸 2개)
### ① 「＋ 품목」 누르면 적던 게 사라짐
- **뿌리**: `pbTrimAddMat` 이 곧바로 `renderBookList()` 로 표를 통째로 새로 만든다.
  품명·규격 칸은 `onchange`(= 칸을 벗어날 때) 저장인데, **아직 저장 안 된 글자**가 그대로 날아갔다.
- **고침**: `pbFlushEditing()` — 표 안에 커서가 있으면 **`change` 를 직접 쏘고** blur.
  ⚠️ `blur()` 만으로는 안 된다: 브라우저가 «사용자가 고친 값»으로 안 보면 change 를 안 쏜다(하니스에서 확인).
  저장 핸들러들은 같은 값이면 아무것도 안 하므로(멱등) 두 번 불려도 안전.
- ⚠️ **앞으로 단가장 표를 다시 그리기 전엔 `pbFlushEditing()` 을 먼저 부를 것.**
### ② 업체 눌러서 열기
- 품목이 100건 넘으면 다 펼쳐져 스크롤이 끝없이 길었다 → 업체 띠를 눌러 여닫는다(`window._pbtOpen`, `fpm_pbtOpen` 에 저장).
- 닫히면 열이름줄·품목줄을 **아예 안 만든다**(가벼움). `＋품목` 을 누르면 그 업체를 펴 준다.
- ⚠️ 거르개(검색·거래처·유형·90일)를 쓰는 중엔 결과를 봐야 하므로 **무조건 펼친다**(`_pbtAnyFilter`).
- 원단 단가장의 `_bookOpen` 과 **별개** — 섞지 말 것.
### ③ 검색칸이 2개
- 위쪽 `#book-search`(거래처 거르개, 원단과 공용) + 아래 표 거르개(품명·거래처·유형)가 겹쳐 헷갈렸다.
- 부자재 화면에서는 **위쪽 칸만 숨긴다**(안내줄·새 창 버튼은 남김). 원단 단가장은 그대로.

## 2026-09-02e — 작지 사진칸에 샘플 회차 사진 가져오기
- 도식화 칸의 「다른 아이템」 옆에 **「샘플 사진」** 버튼. 그 아이템의 샘플 코멘트 회차 사진을 골라 넣는다.
- 자료 위치: `it.smpRounds[i].pics[front|back|lining|detail]` (`SC_PICS`). 빈 칸은 목록에서 뺀다.
- **최근 회차가 위**로 (보통 마지막 샘플 사진을 쓴다).
- 가져오면 **복사본** — `tpSketchTake` 와 같은 방식으로 내 작지 것으로 새로 올려 원본과 갈라놓는다.
  (Storage 가 없으면 URL 만 복사)
- 버튼에 `tp-loadbtn` 클래스를 쓰면 **인쇄·이미지 저장 때 자동으로 숨겨진다**(985줄 규칙) — 새 버튼도 이 클래스로.

## 2026-09-02f — 부자재도 오무데 방향
- 원단에 있던 오무데(우상/좌상)를 **부자재에도**. 원단과 **같은 6군데**에 붙였다:
  ① 부자재 카드 폼(`omudeTrimFld` — 무게·온즈 옆) ② `colTR` 수집 ③ `saveToPB` 부자재 분기
  ④ `autofillTrim`(단가장→폼) ⑤ 단가장 상세 롤·야드 칸(`_pbdOmude`) ⑥ 작지 재료표 부자재 줄
- ⚠️ **단가장이 주인** → `_TRIM_PB_LOCK_FIELDS` 에 `'omude'` 를 넣었다. 등록된 부자재는 아이템에서 못 고치고,
  단가장 상세(롤·야드 디테일)에서만 고친다. 안 넣으면 단추 크기처럼 «아이템마다 제각각»이 된다(2026-09-01a 참고).
- 자재 속성을 새로 만들 때 확인할 것: 폼칸 · colTR · saveToPB · autofillTrim · 단가장 입력칸 · 잠금목록 — **6군데 세트**.

## 2026-09-02g — 가공비 「최소 작업수량」
- 그 수량 아래로는 안 받는 가공(예: **바이어스 재단 5야드 미니멈** — 3야드만 필요해도 5야드 값).
- 단위는 **그 가공이 세는 것 그대로**(개·야드). 개당·조건부에만 칸이 보인다(정액은 수량 개념이 없음).
- ★ **`_tcEffPcs(tc,trims,qty)` 하나만 쓴다** — `max(장수×벌당개수, tc.minQty)`.
  ⚠️ 한 군데라도 `costPerPcs × _tcQtyPerPiece × 장수` 를 직접 곱하면 **화면마다 금액이 갈라진다.**
  거쳐 가는 곳: `_tcPer`(폼 표시) · `trimCostPerPcs`(원가계산서 1장당) · `calcTrimPerQty`(수량별 총액) ·
  `getTrimCostRows`(결제·원장) · `_tcTierIsFlat`(조건부 판정) · `_poProcBlocks`(발주서 「최소 N」 표시).
- 검증(실제 함수 하니스 24개): 개당40·최소100 → 30장 4,000원 / 250장 10,000원 ·
  바이어스 벌당0.1야드·최소5 → 30장 5야드 / 100장 10야드 · 정액은 미니멈 무관 · 미니멈 없으면 값 불변.

## 2026-09-02h — 라벨 이름 자동완성을 «그 거래처 것만»
- **뿌리**: `buildCareLabelDB()` 가 **모든 아이템 + 모든 브랜드**의 라벨 이름을 다 모았다.
  거래처를 「하나라벨」로 골라도 남의 집 라벨(가로15·불변·데님불변…)이 줄줄이 떴다(신고).
- **고침**: `buildCareLabelDB(sup)` — sup 을 주면 **그 거래처 것만**.
  자료 순서 ① 단가장(라벨의 주인) ② 다른 아이템이 쓴 이름(그 거래처만) ③ 브랜드 등록 이름.
  ③은 **거래처를 안 골랐을 때만** — 브랜드 라벨엔 거래처가 없어 섞으면 또 남의 것이 뜬다.
- 라벨 이름 칸에 `onfocus="updCareLabelDL(this)"` — 누를 때 그 카드의 부자재처로 목록을 다시 만든다.
- 거래처가 비어 있으면 예전처럼 전체(골라야 하니까). 인자 없이 부르면 전체 = 초기화용 그대로.

## 2026-09-02i — 원단에도 가공비 추가
- 원단 카드 아래 **「＋ 가공비 (염색·재단 등)」**. 부자재 가공비와 **같은 자료·같은 줄 부품**을 쓴다:
  자료 `formTrimCosts` · 줄 `trimCostRowHTML` · 부자재는 `tc.trimId`, 원단은 **`tc.fabId`**.
  덕분에 청구방식 4가지·최소 작업수량·원가계산서·결제·원장이 **저절로 똑같이** 돈다(검증됨).
- 아래 「따로 노는 가공비」 목록에서는 원단에 붙은 것을 **뺀다**(중복 표시 방지).
  원단을 지우면 다시 그 목록에 나타나 잃어버리지 않는다.
- ⚠️ 옛 「바이어스 재단 보내기」(`f.bias`)는 **그대로 뒀다** — 둘 다 켜면 공임이 두 번 잡힌다.
  옛 자료 이관은 아직 안 함.
- ⚠️ **발주서(`_poProcBlocks`)는 아직 `tc.trimId` 로만 찾는다** → 원단 가공비는 발주서에 안 나온다. 다음 할 일.

## 2026-09-02j — 발주서 상단 카드 3건
### ① 몸판만 보이던 것
- **뿌리**: 요약 카드가 원단을 «이름+폭»으로만 묶어서, 같은 원단이 몸판·배색으로 쓰이면 **한 줄로 합쳐지고**
  용도는 처음 것(몸판)만 남았다. 발주서 **본문은 용도별로 나뉘는데** 위 카드만 안 나뉘어 서로 안 맞았다.
- **고침**: 묶는 키에 **용도(part)** 를 넣고(`이름|폭|용도`) 카드에 `(몸판)`·`(배색)` 을 붙인다.
  용도는 `S.items[itemId].fabrics` 에서 `fc.part` 로 얻는다.
- 검증: 몸판 114y · 배색 25y · 시보리 30y — 본문과 일치.
### ②③ 키로 발주 표기
- 키로 발주면 **kg 가 앞, 야드가 뒤** (`103.6kg (114yd)`), kg 는 **소수점 1자리**.
- 상단 카드와 **발주서 본문 둘 다** 같게 고쳤다(`#C110네이비 - 61.8kg (68y) (네이비/올리브 사용)`).
- kg 가 없으면 예전처럼 야드만.

## 2026-09-02k — 하나라벨이 자꾸 사라지던 것 (묘비)
- **뿌리**: 거래처를 지우면 **묘비**(`_tomb.pbSup['하나라벨']`)가 남는다. 동기화 병합은 묘비가 있는 이름을
  «지운 것»으로 보고 **합집합에서 계속 뺀다**(`_mergeShared`/`_mergePB` 의 `_tombHas('pbSup',...)`).
  그런데 묘비를 지우는 곳이 **거래처 추가 모달뿐**이었다 → 「+품목」·아이템 저장(`getPB`)으로 다시 만든
  거래처는 **만들어졌다가 다음 동기화에 또 사라졌다**(신고 반복).
- **고침**: `getPB(sup)` 가 거래처를 **새로 만들 때** 묘비를 지운다. 이미 있으면 안 건드린다.
  `pbTrimAddMat` 은 품목 묘비(`_tomb.pbMat`)도 지운다.
- 앞으로 «자료를 다시 만드는» 자리를 만들면 그 묘비를 같이 지울 것. 안 지우면 동기화가 되살린 걸 또 지운다.
- 같이: 라벨 카드의 「단가장 등록」 버튼 2개 제거(요청) — `_pbLabelBadge` 는 빈 값 반환,
  `_pbTrimBadge` 는 careLabel/mainLabel 이면 빈 값. 다른 부자재는 그대로.

## 2026-09-02m — 「샘플 사진」 가져오기를 작지 사진 기준으로
- 처음엔 **샘플 코멘트**(`it.smpRounds[i].pics`)를 봤는데, 사용자가 원한 건
  **작지 안에 올린 사진**이었다(「샘플 코멘트에 올린 사진 말고 작지 샘플 1차 2차 3차」).
- `_tpSmpPics()` 가 모으는 것: ① 샘플·패턴 회차 도식화(`spatSketch`·`spat2Sketch`… = `tpSpatLbl` 로 1차·2차·3차)
  ② 「샘플 사진」 탭 4칸(`smpFront/smpBack/smpLining/smpDetail`) ③ 지시서 도식화(`sewSketch`).
  빈 칸은 빼고, 같은 슬롯은 한 번만.
- 회차 목록은 `tpSpatRounds()` 로 얻는다 — 회차를 더 만들면 자동으로 따라온다.

## 2026-09-02n — 자수 불러오기에 아트웍도
- `_tpAssetGroups(b,type)` 가 `emb` 는 자수만, `prt` 는 아트웍만 보여줬다.
  실무에선 로고 하나가 자수로도 나염(아트웍)으로도 쓰여서 **둘 다** 보여야 한다(요청).
- 고침: `emb` → `[자수, 아트웍]`, `prt` → `[아트웍, 자수]` (지금 고른 쪽이 앞).
  카드 밑에 출처(`from`=그룹명)가 적히고, 검색은 이름·출처 둘 다로 걸린다.
- 사진 없는 항목은 예전처럼 «못 고름 + 안내», 둘 다 없으면 빈 안내(문구도 「자수·아트웍」으로).

## 2026-09-02p — 작지 회차 ↔ 코멘트 회차 잇기
- **뿌리**: 두 회차가 완전히 별개였다. 작지 `it.techpack.spatRounds`(spat·spat2…) vs 코멘트 `it.smpRounds[].n`.
  그래서 한쪽에서 「+회차」를 누르면 그쪽만 늘어 개수가 어긋났다(코멘트 4차 / 작지 3차).
- **고침**: 자료 구조는 그대로 두고 **번호(N차)로 짝**을 맞춘다.
  `_rndSyncToComment(itemId,n)` / `_rndSyncToTechpack(itemId,n)` — 한쪽에서 회차를 만들면
  다른 쪽에 **그 번호가 없을 때만** 만든다. `tpAddSpatRound` 와 `scAddRound` 양쪽에 연결.
- 작지 회차를 만들 땐 직전 회차를 복사하되 **굳힘(mat)은 안 물려받고 전달일은 비운다**(기존 규칙과 동일).
- 코멘트는 맨 앞이 최신이라 넣은 뒤 **번호 내림차순 정렬**.
- 작지를 한 번도 안 연 아이템(`techpack.spatRounds` 없음)은 **작지 쪽을 안 건드린다** — 빈 작지가 생기면 안 된다.
- 이미 어긋나 있던 자료는 「+회차」를 누를 때부터 맞춰진다(과거 것을 자동으로 만들지는 않는다).

## 2026-09-02q — 하나라벨이 «아직도» 사라지던 것 (되살림 표시)
- 2026-09-02k 에서 «다시 만들 때 묘비를 지운다»로 고쳤지만 **부족했다**.
  묘비는 병합 때 **합집합**이다(`_mergeTomb` 가 양쪽을 합치고 날짜 큰 쪽을 남긴다).
  로컬에서 지워도 **클라우드에 남은 묘비가 다음 동기화에 다시 내려와** 또 지웠다.
- **고침**: 되살림도 **묘비 저장소 안에** `un:<이름>` 으로 남긴다 → 저장·전송·병합 배선을 그대로 타고
  다른 기기까지 전달된다. `_tombHas` 는 **되살림 날짜 >= 묘비 날짜면 묘비를 무시**한다
  (같은 날 지웠다 되살렸으면 되살림이 이긴다 — 방금 다시 만든 것이므로).
  나중에 «진짜로» 다시 지우면 `_tombArr` 가 되살림 표시를 거둬서 삭제가 정상 동작한다.
- ⚠️ **로컬에서 묘비를 지우는 것만으로는 절대 안 된다** — 반드시 `_untombArr` 로 되살림을 남길 것.

## 2026-09-02r — 단가장 라벨 ↔ 브랜드 케어라벨 짝짓기
- 두 곳이 서로 다른 걸 저장한다: `t.labelName`(거래처에서 **단가**를 찾는 이름) vs
  `t.labelNames`(작지에 붙일 **사진**의 브랜드 케어라벨 이름). 이름이 달라 매번 둘 다 골라야 했다.
- **고침**: 한 번 고르면 **단가장 항목에 짝을 기억**한다 —
  `S.priceBook[거래처].materials[키].brandLabels = { 브랜드id: [브랜드라벨이름…] }` (브랜드마다 다를 수 있다).
  다음부터 단가장 라벨만 고르면 브랜드 라벨이 자동으로 붙는다(**아직 안 골랐을 때만**).
- ⚠️ 같이 고친 것: `colTR` 이 브랜드 라벨로 **단가장 이름을 통째로 덮었다** →
  이름이 바뀌어 단가를 못 찾았다. 이제 **단가장 이름 칸이 비어 있을 때만** 채운다(사용자가 적은 값 우선).
