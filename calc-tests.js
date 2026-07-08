// ===== FPF 돈 계산 검산표 (10문제) =====
// 실행: ./calc-check.sh  — index.html에서 진짜 계산 함수를 추출해 이 문제들로 채점한다.
// 규칙: 이 파일에는 계산식을 절대 다시 구현하지 않는다. 문제(입력)와 정답(손계산 숫자)만 둔다.
//       정답 근거는 각 문제 주석에 손계산 과정으로 남긴다. (숫자 바꾸려면 근거부터 갱신)

// ---- JSC 실행 환경 스텁 (계산과 무관한 껍데기만) ----
var window = this;
var _LS = {};
function lsGet(k){ return _LS[k] !== undefined ? _LS[k] : null; }
function lsSet(k, v){ _LS[k] = v; return true; }
function showToast(){}
function esc(s){ return String(s == null ? '' : s); }
function num(n){ return String(n == null ? '' : n); }
function getBrands(){ return (S && S.brands) || []; }
var DEFAULT_PO_OPTS = {};
var curCoId = 'testco';
var S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[] };

// ---- 채점기 ----
var _fails = [], _okCount = 0;
function CHECK(name, actual, expected){
  var ok = JSON.stringify(actual) === JSON.stringify(expected);
  if(ok){ _okCount++; print('    ' + name + ' ... 통과'); }
  else { _fails.push(name); print('    ' + name + ' ... 실패! 기대 ' + JSON.stringify(expected) + ', 나온 답 ' + JSON.stringify(actual)); }
}
function TEST(title, fn){
  print('  ' + title);
  try{ fn(); }
  catch(e){ _fails.push(title + ' (오류)'); print('    오류로 중단: ' + e); }
}

print('돈 계산 검산 시작');

// ── 문제 1. 부자재 로스(%) 기본 ─────────────────────────────
// 단추: 벌당 2개, 로스 5%, 단가 100원, 오더 95장.
// 손계산: 95×2=190개 → ×1.05=199.5 → 올림 200개 → 20,000원. needPcs=95.
// 로스 미설정이면 기본 로스 2%(TRIM_LOSS_PCT): 벌당1 ×95=95 → ×1.02=96.9 → 97개 → 9,700원.
TEST('문제 1. 로스 5% → 200개·20,000원 / 기본로스 2%', function(){
  var r = calcTrimNeed({ id:'x', qtyPerPiece:2, buffer:5, unitPrice:100 }, 95);
  CHECK('로스 5% 수량', r.qty, 200);
  CHECK('로스 5% 금액', Math.round(r.cost), 20000);
  CHECK('의뢰장수 보존', r.needPcs, 95);
  var r2 = calcTrimNeed({ id:'x2', qtyPerPiece:1, unitPrice:100 }, 95);
  CHECK('기본로스 2% 수량', r2.qty, 97);
});

// ── 문제 2. 미니멈 발주량 ─────────────────────────────
// 단추: 벌당 1, 로스 0, 단가 50원, 미니멈 500개, 오더 100장 → 100<500 → 500개·25,000원.
// 실(thread)은 자체 로직이라 미니멈 미적용: 색당 10개 그대로.
TEST('문제 2. 미니멈 500개 적용 / 실은 미적용', function(){
  var r = calcTrimNeed({ id:'x', orderType:'button', qtyPerPiece:1, buffer:0, unitPrice:50, hasMinOrder:true, minOrderQty:500 }, 100);
  CHECK('미니멈 수량', r.qty, 500);
  CHECK('미니멈 금액', Math.round(r.cost), 25000);
  CHECK('미니멈 적용 표시', !!r.minOrderApplied, true);
  var r2 = calcTrimNeed({ id:'x2', orderType:'thread', threadQty:10, threadMin:30, unitPrice:100, hasMinOrder:true, minOrderQty:500 }, 100);
  CHECK('실 미니멈 미적용', r2.qty, 10);
});

// ── 문제 3. 심지 절(jeol) 단위 올림 ─────────────────────────────
// 심지: 요척 0.5y, 로스 2%, 단가 1,000원, 1절=30y, 오더 90장.
// 손계산: 45y → ×1.02=45.9y → 2절(60y) → 60,000원. 절 없으면 46y 올림 → 46,000원.
TEST('문제 3. 절 올림 45.9y→2절 60y / 절 없으면 46y', function(){
  var r = calcTrimNeed({ id:'x', orderType:'yard', consumptionPerPiece:0.5, buffer:2, unitPrice:1000, yardsPerJeol:30 }, 90);
  CHECK('절 수', r.jeol, 2);
  CHECK('발주 야드', r.qty, 60);
  CHECK('금액', Math.round(r.cost), 60000);
  CHECK('원필요량 표시', r.originalNeed, 45.9);
  var r2 = calcTrimNeed({ id:'x2', orderType:'yard', consumptionPerPiece:0.5, buffer:2, unitPrice:1000 }, 90);
  CHECK('절 없이 올림', r2.qty, 46);
});

// ── 문제 4. 원단 사이즈별 요척 + kg 환산 + 올림 정책 ─────────────────────────────
// 원단: 요척 S1.1/M1.2/L1.3, 로스 10%, kg단가 9,000원, 1kg=3y. 수량 S10/M10/L10.
// 손계산: 11+12+13=36y → ×1.1=39.6y → 올림 40y → 40/3=13.33kg → 119,970원.
// 올림 정책: 39.2y는 기본(무조건 올림)=40, 0.5단위 설정=39.5.
TEST('문제 4. 원단 36y→40y·13.33kg·119,970원 / 올림 정책', function(){
  var f = { consumptionBySize:{ S:1.1, M:1.2, L:1.3 }, consumption:1.2, buffer:10, pricingUnit:'kg', yardsPerKg:3, pricePerKg:9000 };
  var r = calcFabYards(f, 30, { S:10, M:10, L:10 }, '');
  CHECK('총 야드', r.ty, 40);
  CHECK('kg 환산', r.tk, 13.33);
  CHECK('금액', Math.round(r.cost), 119970);
  CHECK('사이즈 계산 표시', !!r.isSizeCalc, true);
  _LS['fpm_fab_round'] = 'half';
  CHECK('0.5y 단위 올림', roundYards(39.2), 39.5);
  delete _LS['fpm_fab_round'];
  CHECK('기본 무조건 올림', roundYards(39.2), 40);
});

// ── 공용 시나리오: 소라/아이보리 각 100장(S50/M50), 몸판 원단 100y ──
function mkDominoState(actualY){
  S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[] };
  S.items.itA = { id:'itA', colors:['소라','아이보리'], sizes:['S','M'],
    fabrics:[{ id:'f1', part:'몸판', consumption:1, buffer:0 }],
    trims:[{ id:'t1', supplier:'부자재상사', name:'단추', qtyPerPiece:1, buffer:0, unitPrice:100 }] };
  var oi = { itemId:'itA', qtyGrid:{ '소라':{ S:50, M:50 }, '아이보리':{ S:50, M:50 } } };
  var o = { id:'o1', orderItems:[oi], suppliers:{ '원단처':{ materials:[
    { type:'fabric', itemId:'itA', fabId:'f1', part:'몸판', colorName:'소라', totalYards:100, actualOrderedQty:actualY }
  ] } } };
  S.orders.o1 = o;
  return { o:o, oi:oi };
}

// ── 문제 5. 원단 부족 도미노 (내림) ─────────────────────────────
// 소라 몸판 원단 100y 중 90y만 입고 → 소라 90장(S45/M45), 아이보리 불변, 부족은 내림.
TEST('문제 5. 90y 입고 → 소라 90장·S45/M45·아이보리 불변', function(){
  var st = mkDominoState(90);
  var eff = getEffectivePcsByColor(st.o, st.oi);
  CHECK('소라 생산가능', eff['소라'], 90);
  CHECK('아이보리 불변', eff['아이보리'], 100);
  var bd = getEffectivePcsBreakdown(st.o, st.oi);
  CHECK('소라 S(내림)', bd.effGrid['소라'].S, 45);
  CHECK('소라 M(내림)', bd.effGrid['소라'].M, 45);
  CHECK('전체 190장', bd.effTotal, 190);
  CHECK('부족 표시', bd.isShortage, true);
  CHECK('초과 아님', bd.isExpansion, false);
});

// ── 문제 6. 원단 초과 도미노 (반올림) ─────────────────────────────
// 112y 입고 → 소라 112장(S56/M56), 초과는 반올림.
TEST('문제 6. 112y 입고 → 소라 112장·S56/M56·초과 표시', function(){
  var st = mkDominoState(112);
  var eff = getEffectivePcsByColor(st.o, st.oi);
  CHECK('소라 생산가능', eff['소라'], 112);
  var bd = getEffectivePcsBreakdown(st.o, st.oi);
  CHECK('소라 S(반올림)', bd.effGrid['소라'].S, 56);
  CHECK('전체 212장', bd.effTotal, 212);
  CHECK('초과 표시', bd.isExpansion, true);
});

// ── 문제 7. 발주 엔진 통합: 도미노가 부자재 발주에 반영 ─────────────────────────────
// 문제 5 상황에서 발주서를 만들면: 단추(벌당1·로스0·100원)는 190장어치 = 190개·19,000원.
// ※ oi는 반드시 S.orders 안의 같은 객체여야 함(엔진이 객체 동일성으로 오더를 찾음).
TEST('문제 7. 도미노 반영 발주: 단추 190개·19,000원', function(){
  var st = mkDominoState(90);
  var sups = calcSups(st.o.orderItems);
  var mats = (sups['부자재상사'] || {}).materials || [];
  CHECK('부자재 발주 1건', mats.length, 1);
  var m = mats[0] || { calc:{} };
  CHECK('단추 수량(190장어치)', m.calc.qty, 190);
  CHECK('단추 금액', Math.round(m.calc.cost), 19000);
  CHECK('적용 장수 기록', m.effectivePcsApplied, 190);
});

// ── 문제 8. 라벨 여분 이중계산 방지 ─────────────────────────────
// 케어라벨: 벌당 1, 아이템 기본여분 10개, 단가 30원. 오더 100장 + 오더로스 「+20개」.
// 손계산: 100+20=120개·3,600원. (기본여분 10개까지 더한 130개면 이중가산 버그)
TEST('문제 8. 라벨 +20개 → 120개·3,600원 (130이면 버그)', function(){
  S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[] };
  S.items.itB = { id:'itB', colors:['블랙'], sizes:['S'], fabrics:[],
    trims:[{ id:'t2', supplier:'라벨상사', name:'케어라벨', orderType:'careLabel', qtyPerPiece:1, qtyBuffer:10, unitPrice:30 }] };
  var oi = { itemId:'itB', qtyGrid:{ '블랙':{ S:100 } } };
  S.orders.o2 = { id:'o2', orderItems:[oi], loss:{ itB:{ t2:'20a' } } };
  var sups = calcSups(S.orders.o2.orderItems);
  var m = ((sups['라벨상사'] || {}).materials || [])[0] || { calc:{} };
  CHECK('라벨 수량', m.calc.qty, 120);
  CHECK('라벨 금액', Math.round(m.calc.cost), 3600);
  CHECK('이중가산 아님', m.calc.qty !== 130, true);
});

// ── 문제 9. 결제 부대비: 과세/부가세 미포함 분리 ─────────────────────────────
// 박스 2×1,000원(과세)=2,000 / 택배 3×5,000원(부가세 미포함)=15,000 → 절대 섞이면 안 됨.
TEST('문제 9. 부대비 과세 2,000 / 미포함 15,000 분리', function(){
  S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[] };
  S.orders.o9 = { id:'o9', payFees:{ 'fc:f1':[
    { name:'박스', qty:2, unitPrice:1000 },
    { name:'택배', qty:3, unitPrice:5000, noVat:true }
  ] } };
  CHECK('박스 금액(개수×단가)', payFeeAmt({ qty:2, unitPrice:1000 }), 2000);
  CHECK('금액 직접입력 폴백', payFeeAmt({ amount:7000 }), 7000);
  var pb = payFeeBlock('o9', 'fc:f1', 1);
  CHECK('과세 합계', pb.feeTot, 2000);
  CHECK('부가세 미포함 합계', pb.noVatTot, 15000);
});

// ── 문제 10. 오더별 공장 스냅샷 고정 ─────────────────────────────
// 오더 생성 후 아이템 공장을 바꿔도 옛 오더의 결제 귀속은 원래 공장 그대로.
// 빈값으로 얼린 칸은 빈값 그대로(현재 공장으로 폴백 금지). 스냅샷 없는 옛 오더만 현재값 폴백.
TEST('문제 10. 공장 바꿔도 옛 오더는 fc1 고정', function(){
  S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[] };
  S.items.itC = { id:'itC', sewingFcId:'fc1', washingFcId:'fcW' };
  var o = { orderItems:[{ itemId:'itC' }] };
  snapshotOrderFc(o);
  S.items.itC.sewingFcId = 'fc2';
  CHECK('스냅샷 고정', orderFc(o, S.items.itC, 'sewingFcId'), 'fc1');
  o.fcMap.itC.embroideryFcId = '';
  S.items.itC.embroideryFcId = 'fcE';
  CHECK('빈값 얼림 존중', orderFc(o, S.items.itC, 'embroideryFcId'), '');
  CHECK('스냅샷 없는 옛 오더 폴백', orderFc({}, S.items.itC, 'sewingFcId'), 'fc2');
});

// ── 문제 11. 비품 출고 공임 할인 ─────────────────────────────
// 공임 24,000원. 정상 100장 + 비품 25장(30% 할인 단가 16,800원).
// 손계산: 24,000×100=2,400,000 + 16,800×25=420,000 → 2,820,000원.
// 반올림: 공임 28,500원의 30% 할인 단가 = 28,500×0.7 = 19,950원(원 단위 반올림).
// 할인율 비었으면 기본 50%(2026-07-08 사용자 확정: 30→50). 비품 표시 없으면 전액 정상.
TEST('문제 11. 비품 공임 30% 할인 = 2,820,000원 · 기본율 50%', function(){
  CHECK('비품 단가 24000→16800', bgUnitPrice(24000, 30), 16800);
  CHECK('비품 단가 반올림 28500→19950', bgUnitPrice(28500, 30), 19950);
  CHECK('할인율 비면 기본 50%', bgUnitPrice(24000, null), 12000);
  CHECK('할인율 0%면 정상가', bgUnitPrice(24000, 0), 24000);
  var recs = [
    { qty:60, color:'블랙' }, { qty:40, color:'화이트' },          // 정상 100장
    { qty:25, color:'블랙', bg:1, bgDc:30 }                        // 비품 25장
  ];
  var r = sewLaborBase(24000, recs);
  CHECK('정상 수량', r.normalQty, 100);
  CHECK('비품 수량', r.bgQty, 25);
  CHECK('비품 금액', r.bgAmt, 420000);
  CHECK('공임 합계', r.base, 2820000);
  var r2 = sewLaborBase(24000, [{ qty:100 }]);
  CHECK('비품 없으면 전액 정상', r2.base, 2400000);
});

// ---- 결과 ----
print('');
if(_fails.length){
  print('CALC TESTS: FAIL — ' + _fails.length + '건 실패 (통과 ' + _okCount + ')');
  print('실패 목록: ' + _fails.join(' / '));
  print('>>> 고치기 전에는 push 금지. (검사 자체를 건너뛰려면 SKIP_CALC=1 ./safe-push.sh)');
}else{
  print('CALC TESTS: OK — 11문제 전부 통과 (검사 ' + _okCount + '개)');
}
