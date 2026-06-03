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
