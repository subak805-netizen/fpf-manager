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
var _fails = [], _okCount = 0, _testCount = 0;
function CHECK(name, actual, expected){
  var ok = JSON.stringify(actual) === JSON.stringify(expected);
  if(ok){ _okCount++; print('    ' + name + ' ... 통과'); }
  else { _fails.push(name); print('    ' + name + ' ... 실패! 기대 ' + JSON.stringify(expected) + ', 나온 답 ' + JSON.stringify(actual)); }
}
function TEST(title, fn){
  _testCount++;
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

// ── 문제 13. 사이즈별 공임 (2026-08-13) ─────────────────────────────
// 공임 기본 24,000원, M사이즈만 26,000원(it.laborBySize={M:26000}).
// 출고 S 100장 + M 50장.
// 손계산: 24,000×100=2,400,000 + 26,000×50=1,300,000 → 3,700,000원.
// 사이즈별을 안 쓰는 아이템은 예전 그대로 24,000×150=3,600,000원이어야 한다(회귀 방지).
TEST('문제 13. 사이즈별 공임 = 3,700,000원 · 미사용 아이템은 불변', function(){
  var itSz = { sizes:['S','M'], laborCost:24000, laborBySize:{ M:26000 } };
  var itNo = { sizes:['S','M'], laborCost:24000 };
  CHECK('M은 사이즈 단가', laborRate(itSz,'M'), 26000);
  CHECK('S는 기본 공임', laborRate(itSz,'S'), 24000);
  CHECK('사이즈 없으면 기본', laborRate(itSz,''), 24000);
  CHECK('프리사이즈는 기본', laborRate(itSz,'free'), 24000);
  CHECK('사이즈별 미사용 판정', hasLaborBySize(itNo), false);
  CHECK('사이즈별 사용 판정', hasLaborBySize(itSz), true);

  var recs = [ { size:'S', qty:100 }, { size:'M', qty:50 } ];
  CHECK('사이즈별 공임 합계', sewLaborBase(24000, recs, itSz).base, 3700000);
  CHECK('사이즈별 미사용은 예전대로', sewLaborBase(24000, recs, itNo).base, 3600000);
  CHECK('it 없이 부르면 예전대로', sewLaborBase(24000, recs).base, 3600000);

  // 사이즈가 안 적힌 옛 출고 회차 → 기본 공임으로 떨어져야 한다
  CHECK('옛 회차(사이즈 없음)', sewLaborBase(24000, [{ qty:10 }], itSz).base, 240000);

  // 비품 할인은 "그 사이즈 단가" 기준 — 26,000의 50% = 13,000
  var rBg = sewLaborBase(24000, [{ size:'M', qty:20, bg:1, bgDc:50 }], itSz);
  CHECK('비품 할인 단가 기준', rBg.bgAmt, 260000);
  CHECK('비품 합계', rBg.base, 260000);
});

// ── 문제 12. 벌치 로스 = 컬러별 +N벌 (2026-07-09 사용자 확정) ─────────────────────────────
// 지퍼(벌당 1개) 컬러링크 아이·블랙, 오더 아이 20 + 블랙 40.
// 벌치 5 → 컬러마다 +5개: 아이 25 / 검정 45. (예전 비례분배+올림 22/44는 회귀)
// +개 6은 총량을 컬러 비례 분배 유지: 아이 20+2=22 / 검정 40+4=44.
TEST('문제 12. 벌치 5 = 컬러별 +5개 (아이 25 / 검정 45)', function(){
  S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[] };
  S.items.itZ = { id:'itZ', colors:['아이','블랙'], sizes:['S'], fabrics:[],
    trims:[{ id:'z1', supplier:'메이드', name:'양면지퍼 10인치', orderType:'count', qtyPerPiece:1, buffer:3, unitPrice:280,
      colorLinks:[{ itemColor:'아이', colorName:'030 아이' },{ itemColor:'블랙', colorName:'검정' }] }] };
  var oi = { itemId:'itZ', qtyGrid:{ '아이':{ S:20 }, '블랙':{ S:40 } } };
  S.orders.oZ = { id:'oZ', orderItems:[oi], loss:{ itZ:{ z1:'5b' } } };
  var sups = calcSups(S.orders.oZ.orderItems);
  var by = {};
  (((sups['메이드']||{}).materials)||[]).forEach(function(m){ if(m.type==='trim') by[m.colorName] = m.calc.qty; });
  CHECK('벌치 5: 아이 25개', by['030 아이'], 25);
  CHECK('벌치 5: 검정 45개', by['검정'], 45);
  S.orders.oZ.loss = { itZ:{ z1:'6a' } };
  sups = calcSups(S.orders.oZ.orderItems);
  by = {};
  (((sups['메이드']||{}).materials)||[]).forEach(function(m){ if(m.type==='trim') by[m.colorName] = m.calc.qty; });
  CHECK('+개 6: 아이 22개(비례)', by['030 아이'], 22);
  CHECK('+개 6: 검정 44개(비례)', by['검정'], 44);
});

// ── 문제 14. 옛 바이어스 체크 → 원단 가공비 이관 + 발주 (2026-09-04) ─────────────────────
// 원단A(모스트, 요척 1y·로스 0·1,000원/y)에 옛 f.bias{메이드, 30mm, 벌당 0.1y, 컬러당 20,000, 합쳐서} · 오더 소라 100장.
// 손계산: 원단 100y + 바이어스용 0.1×100=10y → 모스트 110y. 메이드엔 «재단 발주» 10y·0원(공임 20,000은 가공비 줄 perLot 로 결제·원장).
// 이관: trimCosts 1줄(fabId f1·바이어스 재단·perLot 20,000·biasYo 0.1·합쳐서) · f.bias.on=false · 두 번 돌려도 1줄.
// 합쳐서 끄면: 모스트 100y + 「몸판 바이어스용」 10y 줄 따로. 담당이 원단처 자신이면 재단 발주 없음.
// 발주서 블록: 염색 개당 1,500원/y·벌당 1.2y·최소 150y → "원단A 염색 (1500원/y) · 최소 150y (합계 120y)" + "#소라 - 120y".
TEST('문제 14. 바이어스 이관: 모스트 110y · 메이드 재단 10y 0원 · 멱등 · 안합침 · 발주서 블록', function(){
  S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[] };
  S.items.itB = { id:'itB', name:'테스트', colors:['소라'], sizes:['S'],
    fabrics:[{ id:'f1', name:'원단A', supplier:'모스트', part:'몸판', consumption:1, buffer:0, unitPrice:1000,
               bias:{ on:true, factory:'메이드', spec:'30mm', yo:0.1, fee:20000, fold:true } }],
    trims:[], trimCosts:[] };
  var oi = { itemId:'itB', qtyGrid:{ '소라':{ S:100 } } };
  var o = { id:'o2', orderItems:[oi], suppliers:{} };
  S.orders.o2 = o;
  var sups = calcSups(o.orderItems);
  var it = S.items.itB, tcs = it.trimCosts;
  CHECK('이관: 가공비 1줄', tcs.length, 1);
  var tc = tcs[0] || {};
  CHECK('이관: fabId·종류·청구방식', [tc.fabId, tc.procKind, tc.costType], ['f1','바이어스 재단','perLot']);
  CHECK('이관: 공임·벌당야드·합쳐서·담당', [tc.costPerLot, tc.biasYo, tc.biasFold, tc.factory], [20000, 0.1, true, '메이드']);
  CHECK('이관: 옛 체크 꺼짐', [it.fabrics[0].bias.on, it.fabrics[0].bias.migrated], [false, true]);
  var fm = ((sups['모스트']||{}).materials)||[];
  CHECK('모스트: 원단 1줄', fm.length, 1);
  CHECK('모스트: 110y (100+바이어스 10)', [fm[0].totalYards, fm[0].biasYards], [110, 10]);
  var mm = ((sups['메이드']||{}).materials)||[];
  CHECK('메이드: 재단 발주 1줄', mm.length, 1);
  var b = mm[0] || { calc:{} };
  CHECK('메이드: 10y · 원단값 0 · 공임 0', [b.orderType, b.calc.qty, b.calc.cost, b.biasFee, b.unitPrice], ['bias', 10, 0, 0, 0]);
  CHECK('메이드: 원단출처·규격·가공비 줄 연결', [b.fabricSource, b.biasSpec, b.tcId===tc.id], ['원단A (모스트)', '30mm', true]);
  calcSups(o.orderItems);
  CHECK('멱등: 다시 돌려도 가공비 1줄', it.trimCosts.length, 1);
  tc.biasFold = false;
  var sups2 = calcSups(o.orderItems);
  var fm2 = ((sups2['모스트']||{}).materials)||[];
  CHECK('안 합침: 모스트 2줄', fm2.length, 2);
  CHECK('안 합침: 원단 100y + 바이어스용 10y', [fm2[0].totalYards, fm2[1].totalYards, fm2[1].isBiasCut, fm2[1].part], [100, 10, true, '몸판 바이어스용']);
  tc.biasFold = true; tc.factory = '모스트';
  var sups3 = calcSups(o.orderItems);
  CHECK('담당=원단처: 재단 발주 안 만듦', !!sups3['메이드'], false);
  CHECK('담당=원단처: 원단 110y 그대로', (((sups3['모스트']||{}).materials)||[])[0].totalYards, 110);
  CHECK('발주서 「가공:」 줄 (컬러별 정액·담당 원단처)', _poFabProcNotes({ colors:(sups3['모스트'].materials) }, '모스트'), ['가공: 원단A 바이어스 재단 30mm (20000원 · 컬러당)']);
  CHECK('발주서 「가공:」 줄 (담당 남의 집이면 없음)', _poFabProcNotes({ colors:(sups3['모스트'].materials) }, '메이드'), []);
  it.trimCosts.push({ id:'tcD', fabId:'f1', name:'원단A', procKind:'염색', costType:'perPcs', costPerPcs:1500, qtyPerPiece:1.2, minQty:150, factory:'모스트' });
  var blk = _poProcBlocks({ colors:(sups3['모스트'].materials) }, '모스트');
  CHECK('발주서 블록: 개당 원단 가공', blk, [['원단A 염색 (1500원/y) · 최소 150y (합계 120y)', '#소라 - 120y']]);
  CHECK('발주서 블록: 남의 집엔 없음', _poProcBlocks({ colors:(sups3['모스트'].materials) }, '메이드'), []);
});

// ── 문제 15. 수량별·리오더 공임 (2026-09-11) ─────────────────────────────
// 기본 55,000 / 100장 이상 50,000 / 리오더 18,000 / 1사이즈만 58,000.
// 손계산: 99장 메인 → 55,000 · 100장 메인 → 50,000 · 1사이즈는 58,000−5,000=53,000 · 리오더 → 18,000(사이즈1은 21,000)
// 규칙 없는 아이템은 예전 그대로. 규칙 넣은 날 이전 오더(eligible=false)는 기본.
TEST('문제 15. 수량별·리오더 공임 = 99장 55,000 / 100장 50,000 / 리오더 18,000 · 미사용 불변', function(){
  var it = { id:'i1', sizes:['0','1'], laborCost:55000, laborBySize:{'1':58000}, laborTiers:[{min:100,rate:50000}], laborReorder:18000, laborRuleSince:'2026-09-11' };
  var itNo = { id:'i2', sizes:['0','1'], laborCost:55000 };
  CHECK('99장 메인 → 기본 55,000', laborRate(it,'0',{qty:99,reorder:false,eligible:true}), 55000);
  CHECK('100장 메인 → 50,000', laborRate(it,'0',{qty:100,reorder:false,eligible:true}), 50000);
  CHECK('100장 메인 1사이즈 → 58,000−5,000=53,000', laborRate(it,'1',{qty:100,reorder:false,eligible:true}), 53000);
  CHECK('리오더 → 무조건 18,000', laborRate(it,'0',{qty:500,reorder:true,eligible:true}), 18000);
  CHECK('리오더 1사이즈 → 18,000+3,000=21,000', laborRate(it,'1',{qty:500,reorder:true,eligible:true}), 21000);
  CHECK('옛 오더(규칙 전) → 기본', laborRate(it,'0',{qty:500,reorder:true,eligible:false}), 55000);
  CHECK('ctx 없이(원가계산서) → 기본(제일 비싼)', laborRate(it,'0'), 55000);
  CHECK('규칙 없는 아이템 불변', laborRate(itNo,'0',{qty:500,reorder:true,eligible:true}), 55000);
  CHECK('규칙 판정', hasLaborRule(it)&&!hasLaborRule(itNo), true);
  var recs=[{size:'0',qty:60},{size:'1',qty:40}];
  var lb=sewLaborBase(55000,recs,it,null,{qty:100,reorder:false,eligible:true});
  CHECK('결제 기본액 100장: 60×50,000 + 40×53,000 = 5,120,000', lb.base, 5120000);
  var lbNo=sewLaborBase(55000,recs,itNo,null,{qty:100,reorder:false,eligible:true});
  CHECK('규칙 없는 아이템 결제 불변 100×55,000', lbNo.base, 5500000);
});

// ── 문제 16. 원단 컬러 단가 = (컬러별 단가 or 기본) + 가산 항목 · KG 컬러별 단가 (2026-09-14) ─────────────
// 야드 원단: 기본 4,500 · 카키 직접 5,200 · 가산 「워싱 +1,000」(전체) · 「형광 +500」(라임만). 요척 1, 로스 0.
// 손계산: 겨자 4,500+1,000=5,500 · 라임 4,500+1,000+500=6,000 · 카키 5,200+1,000=6,200 · 원가용 MAX=6,200.
//         겨자 10장 → 10y × 5,500 = 55,000 · 컬러 모름(아이템 원가) 10y × 6,200 = 62,000.
// KG 원단: 기본 9,000/kg · 블랙 직접 9,500/kg · 1kg=3y · 요척 1 · 로스 0 · 30장 → 30y → 10kg.
// 손계산: 블랙 10kg × 9,500 = 95,000 · 화이트(직접 없음) 10kg × 9,000 = 90,000.
TEST('문제 16. 원단 컬러 단가 = 가산 포함 · KG 컬러별 단가', function(){
  var f = { pricingUnit:'yard', unitPrice:4500, consumption:1, buffer:0,
    colorLinks:[{itemColor:'겨자'},{itemColor:'라임'},{itemColor:'카키',price:5200}],
    priceAdditions:[{name:'워싱',price:1000,applyTo:'all'},{name:'형광',price:500,applyTo:'colors',colors:['라임']}] };
  CHECK('겨자 단가', fabColorPrice(f,'겨자').unit, 5500);
  CHECK('라임 단가', fabColorPrice(f,'라임').unit, 6000);
  CHECK('카키 직접 단가+가산', fabColorPrice(f,'카키').unit, 6200);
  CHECK('원가용 MAX', fabMaxPrice(f), 6200);
  CHECK('겨자 10장 금액', Math.round(calcFabYards(f,10,null,'겨자').cost), 55000);
  CHECK('컬러 모름 10장 금액(MAX)', Math.round(calcFabYards(f,10,null,'').cost), 62000);
  var k = { pricingUnit:'kg', pricePerKg:9000, yardsPerKg:3, consumption:1, buffer:0, colorLinks:[{itemColor:'블랙',price:9500},{itemColor:'화이트'}] };
  CHECK('KG 블랙 30장 금액', Math.round(calcFabYards(k,30,null,'블랙').cost), 95000);
  CHECK('KG 화이트 30장 금액', Math.round(calcFabYards(k,30,null,'화이트').cost), 90000);
  var plain = { pricingUnit:'yard', unitPrice:3000, consumption:1, buffer:0 };
  CHECK('가산·컬러 없는 원단 불변', Math.round(calcFabYards(plain,10,null,'').cost), 30000);
  // 결제 금액(발주 자재): 겨자 10장·카키 10장 → 겨자 10y × 5,500 = 55,000 · 카키 10y × 6,200 = 62,000. KG 블랙 30장 → 10kg × 9,500 = 95,000.
  S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[] };
  S.items.itY = { id:'itY', name:'야드', colors:['겨자','카키'], sizes:['S'], trims:[], trimCosts:[],
    fabrics:[Object.assign({ id:'fy', name:'30수싱글', supplier:'팝콘' }, f)] };
  S.items.itK = { id:'itK', name:'키로', colors:['블랙'], sizes:['S'], trims:[], trimCosts:[],
    fabrics:[Object.assign({ id:'fk', name:'잭콕쭈리', supplier:'엠케이' }, k, { colorLinks:[{itemColor:'블랙',price:9500}] })] };
  var oY = { id:'oY', orderItems:[{ itemId:'itY', qtyGrid:{ '겨자':{S:10}, '카키':{S:10} } }], suppliers:{} };
  var oK = { id:'oK', orderItems:[{ itemId:'itK', qtyGrid:{ '블랙':{S:30} } }], suppliers:{} };
  S.orders.oY = oY; S.orders.oK = oK;
  var mY = ((calcSups(oY.orderItems)['팝콘']||{}).materials)||[];
  var byC = {}; mY.forEach(function(m){ byC[m.colorName] = m; });
  CHECK('결제: 겨자 단가·금액', [byC['겨자']&&byC['겨자'].unitPrice, Math.round(getMatActualCost(byC['겨자']))], [5500, 55000]);
  CHECK('결제: 카키 단가·금액', [byC['카키']&&byC['카키'].unitPrice, Math.round(getMatActualCost(byC['카키']))], [6200, 62000]);
  var mK = ((calcSups(oK.orderItems)['엠케이']||{}).materials)||[];
  CHECK('결제: KG 블랙 원/kg·금액', [mK[0]&&mK[0].pricePerKg, Math.round(getMatActualCost(mK[0]))], [9500, 95000]);
});

// ── 문제 17. 메인라벨 발주처 = 브랜드 (2026-09-14) ─────────────
// 메이드 부자재를 메인라벨로 타입만 바꿔 부자재처가 「메이드」로 남은 줄 · 브랜드 더프루토 · 20장.
// 기대: 더프루토 발주서에 메인라벨이 들어가고 메이드 발주서엔 없음. 브랜드 없는 메인라벨은 적힌 부자재처 그대로.
TEST('문제 17. 메인라벨 발주처 = 브랜드 (옛 부자재처 무시)', function(){
  S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[{ id:'b1', name:'더프루토' }] };
  S.items.itM = { id:'itM', name:'가방', colors:['아이'], sizes:['F'], fabrics:[], trimCosts:[],
    trims:[{ id:'m1', supplier:'메이드', name:'메인라벨', orderType:'mainLabel', brandId:'b1', labelName:'자수라벨', unitPrice:300, qtyBuffer:0, qtyPerPiece:1, buffer:0 },
           { id:'m2', supplier:'하나라벨', name:'메인라벨', orderType:'mainLabel', brandId:'', labelName:'직접', unitPrice:100, qtyBuffer:0, qtyPerPiece:1, buffer:0 }] };
  var oM = { id:'oM', orderItems:[{ itemId:'itM', qtyGrid:{ '아이':{ F:20 } } }], suppliers:{} };
  S.orders.oM = oM;
  var sups = calcSups(oM.orderItems);
  var names = function(sn){ return (((sups[sn]||{}).materials)||[]).map(function(m){ return m.orderType; }); };
  CHECK('더프루토 발주서에 메인라벨', names('더프루토').indexOf('mainLabel')>=0, true);
  CHECK('메이드 발주서엔 없음', !sups['메이드'] || names('메이드').indexOf('mainLabel')<0, true);
  CHECK('브랜드 없는 메인라벨은 적힌 부자재처', names('하나라벨').indexOf('mainLabel')>=0, true);
  // 카드에서 브랜드를 안 골랐어도 아이템 브랜드가 있으면 그 브랜드로
  S.items.itM.brandId = 'b1'; S.items.itM.trims[0].brandId = '';
  sups = calcSups(oM.orderItems);
  CHECK('카드 브랜드 없음 → 아이템 브랜드(더프루토)', names('더프루토').filter(function(x){return x==='mainLabel';}).length, 2);
  CHECK('카드 브랜드 없음 → 메이드엔 없음', !sups['메이드'] || names('메이드').indexOf('mainLabel')<0, true);
});

// ── 문제 18. 컬러 이름 가산 (2026-09-14) ─────────────
// 단가장 팝콘 「30수싱글」 규칙: 멜란지 +500 · 형광 +500 · 차콜 +300. 기본 4,500원/y. 요척 1 · 로스 0.
// 손계산: 겨자(#12 멜란지그레이)=5,000 · 차콜(#31 차콜 — 우리 컬러명·원단처 둘 다 차콜, 한 번만)=4,800 · 라임(#55형광 라임)=5,000
//         카키(#40 멜란지카키, 직접 5,200)=5,200(가산 안 붙음) · 네온(형광 멜란지)=5,500 · 아이보리=4,500 · 원가용 MAX=5,500.
//         겨자 10장 결제 10y × 5,000 = 50,000. 단가장에 없는 원단은 아이템 원단 규칙(f.colorKwAdds)으로.
TEST('문제 18. 컬러 이름 가산 — 원단처 색상명·컬러명 · 직접 단가 우선 · 겹침 합산', function(){
  S = { items:{}, orders:{}, factories:{}, priceBook:{ '팝콘':{ materials:{ '30수싱글':{ type:'fabric', name:'30수싱글', colorKwAdds:[{kw:'멜란지',add:500},{kw:'형광',add:500},{kw:'차콜',add:300}] } } } }, brands:[] };
  var f = { id:'fp', supplier:'팝콘', name:'30수싱글', pricingUnit:'yard', unitPrice:4500, consumption:1, buffer:0,
    colorLinks:[{itemColor:'겨자',fabricColor:'#12 멜란지그레이'},{itemColor:'차콜',fabricColor:'#31 차콜'},{itemColor:'라임',fabricColor:'#55형광 라임'},
                {itemColor:'카키',fabricColor:'#40 멜란지카키',price:5200},{itemColor:'네온',fabricColor:'형광 멜란지'},{itemColor:'아이보리',fabricColor:'#01 아이보리'}] };
  CHECK('겨자 멜란지', fabColorPrice(f,'겨자').unit, 5000);
  CHECK('차콜 한 번만', fabColorPrice(f,'차콜').unit, 4800);
  CHECK('라임 형광', fabColorPrice(f,'라임').unit, 5000);
  CHECK('카키 직접 단가 우선', fabColorPrice(f,'카키').unit, 5200);
  CHECK('네온 형광+멜란지', fabColorPrice(f,'네온').unit, 5500);
  CHECK('아이보리 해당 없음', fabColorPrice(f,'아이보리').unit, 4500);
  CHECK('원가용 MAX', fabMaxPrice(f), 5500);
  S.items.itP = { id:'itP', name:'싱글', colors:['겨자','아이보리'], sizes:['S'], trims:[], trimCosts:[], fabrics:[f] };
  var oP = { id:'oP', orderItems:[{ itemId:'itP', qtyGrid:{ '겨자':{S:10}, '아이보리':{S:10} } }], suppliers:{} };
  S.orders.oP = oP;
  var mP = ((calcSups(oP.orderItems)['팝콘']||{}).materials)||[]; var byP = {}; mP.forEach(function(m){ byP[m.colorName]=m; });
  CHECK('결제: 겨자 10장 50,000', [byP['겨자']&&byP['겨자'].unitPrice, Math.round(getMatActualCost(byP['겨자']))], [5000, 50000]);
  var loose = { supplier:'없는처', name:'없는원단', pricingUnit:'yard', unitPrice:3000, colorKwAdds:[{kw:'형광',add:700}] };
  CHECK('단가장에 없는 원단 규칙', fabColorPrice(loose,'형광핑크').unit, 3700);
  var noRule = { supplier:'팝콘', name:'다른원단', pricingUnit:'yard', unitPrice:3000 };
  CHECK('규칙 없는 원단 불변', fabColorPrice(noRule,'멜란지').unit, 3000);
});

// ── 문제 19. 협상가 — 새 오더 자동 · 결제는 협상가 · 원가는 매장가 (2026-09-15) ─────────────
// 엠케이 잭콕쭈리: 아이템 매장가 15,000원/kg · 단가장 협상가 14,000(kg) · 9/14 에 정함. 10kg 발주.
// 손계산: 9/15 에 만든 오더 → 협상가 14,000 자동 → 결제 10kg × 14,000 = 140,000 · 원가 10kg × 15,000 = 150,000.
//         9/10 에 만든(협상가 전) 오더 → 자동 안 들어감. 야드 자재엔 kg 협상가 안 씀. 매장가와 같으면 안 넣음.
TEST('문제 19. 협상가 새 오더 자동 · 결제 14,000 · 원가 15,000', function(){
  S = { items:{}, orders:{}, factories:{}, priceBook:{ '엠케이':{ materials:{ '잭콕쭈리':{ type:'fabric', name:'잭콕쭈리', pricePerKg:15000, pricingUnit:'kg', negotiatedPrice:14000, negoUnit:'kg', negoAt:'2026-09-14' } } } }, brands:[] };
  var mKg = { type:'fabric', name:'잭콕쭈리', pricingUnit:'kg', pricePerKg:15000, totalKg:10 };
  CHECK('9/15 새 오더 → 14,000 자동', _pbNegoFor({ createdAt:'2026. 09. 15.' }, '엠케이', mKg), 14000);
  CHECK('9/10 옛 오더 → 자동 안 함', _pbNegoFor({ createdAt:'2026-09-10' }, '엠케이', mKg), 0);
  CHECK('추가발주 거래처 이름도 같은 단가장', _pbNegoFor({ createdAt:'2026-09-20' }, '엠케이 (추가발주)', mKg), 14000);
  CHECK('야드 자재엔 kg 협상가 안 씀', _pbNegoFor({ createdAt:'2026-09-20' }, '엠케이', { type:'fabric', name:'잭콕쭈리', pricingUnit:'yard', unitPrice:15000 }), 0);
  CHECK('매장가와 같으면 안 넣음', _pbNegoFor({ createdAt:'2026-09-20' }, '엠케이', { type:'fabric', name:'잭콕쭈리', pricingUnit:'kg', pricePerKg:14000 }), 0);
  var paid = Object.assign({}, mKg, { negotiatedPrice:14000 });
  CHECK('결제 10kg × 14,000', Math.round(getMatActualCost(paid)), 140000);
  var fItem = { pricingUnit:'kg', pricePerKg:15000, yardsPerKg:3, consumption:1, buffer:0 };
  CHECK('원가 10kg(30y) × 매장가 15,000', Math.round(calcFabYards(fItem,30,null,'').cost), 150000);
});

// ── 문제 20. 부자재 가공비 — 담당 집 발주서 · 금액 표시 · 돈 0 카드 (2026-09-15) ─────────────
// 메이드 186TC(부자재, 벌당 1y)를 가나염색이 염색 · 컬러당 2,300원 · 밤색 30장.
// 기대: 가나염색 발주 카드(type proc, 금액 0, 수수료 2,300 컬러당, #밤색) 생김 · 메이드 발주서 가공 줄엔 안 나옴.
//       담당을 비우면 카드 없음 · 메이드 발주서에 「186TC 염색 (2,300원 · 컬러당)」.
TEST('문제 20. 부자재 가공비 담당 집 카드 · 금액 줄', function(){
  S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[] };
  S.items.itG = { id:'itG', name:'가방', colors:['밤색'], sizes:['F'], fabrics:[],
    trims:[{ id:'t1', supplier:'메이드', name:'186TC', orderType:'yard', consumptionPerPiece:1, buffer:0, unitPrice:1000 }],
    trimCosts:[{ id:'c1', trimId:'t1', name:'186TC 염색', factory:'가나염색', costType:'perLot', costPerLot:2300, colorLinks:[] }] };
  var oG = { id:'oG', orderItems:[{ itemId:'itG', qtyGrid:{ '밤색':{ F:30 } } }], suppliers:{} };
  S.orders.oG = oG;
  var sups = calcSups(oG.orderItems);
  var pm = (((sups['가나염색']||{}).materials)||[])[0] || {};
  CHECK('가나염색 가공 카드', [pm.type, pm.procFee, pm.procMode, pm.unitPrice, (pm.procColors||[]).map(function(c){return c.colorName;}).join()], ['proc', 2300, 'perLot', 0, '밤색']);
  CHECK('가공 카드 결제 0', Math.round(getMatActualCost(pm)), 0);
  var mm = ((sups['메이드']||{}).materials)||[];
  var g = { colors: mm.filter(function(m){return m.type==='trim';}) };
  CHECK('메이드 발주서엔 가공 줄 없음', _poTrimProcNotes(g,'메이드').length, 0);
  S.items.itG.trimCosts[0].factory = '';
  sups = calcSups(oG.orderItems);
  CHECK('담당 비움 → 카드 없음', !sups['가나염색'], true);
  g = { colors: (((sups['메이드']||{}).materials)||[]).filter(function(m){return m.type==='trim';}) };
  CHECK('담당 비움 → 메이드 발주서 금액 줄', _poTrimProcNotes(g,'메이드'), ['186TC 염색 ('+num(2300)+'원 · 컬러당)']);
});

// ── 문제 21. 정정 카드 — 줄 계산 · 발송완료 자동 채움 · 본문 (2026-09-15) ─────────────
// 잭콕쭈리 배색 #C105올리브 15y(11,500원) 보냄 → 지금 계산 14y. 정정 2차: 15y → 14y (-1y).
// 발송완료: 실제 발주 칸 비어 있음 → 14 자동 → 결제 14 × 11,500 = 161,000. 보낸 정정 반영 뒤엔 차이 없음.
// 직접 15.5 적어 둔 경우 → 안 건드림.
TEST('문제 21. 정정 카드 줄 · 자동 채움 · 본문', function(){
  var sent = [{ type:'fabric', name:'잭콕쭈리', part:'배색', colorName:'네이비/올리브', fabricColor:'C105올리브', itemId:'i1', fabId:'f2', pricingUnit:'yard', unitPrice:11500, totalYards:15 }];
  var fresh = [Object.assign({}, sent[0], { totalYards:14 })];
  var lines = _poCorrLines(sent, fresh);
  CHECK('줄 1개 · 15 → 14', [lines.length, lines[0].type, lines[0].from.v, lines[0].to.v], [1, 'changed', 15, 14]);
  var corr = { id:'c1', n:2, createdAt:'2026-09-15', status:'draft', mode:'delta', lines:lines };
  var mats = JSON.parse(JSON.stringify(sent));
  CHECK('발송완료 자동 채움 1칸', _poCorrFill(mats, lines), 1);
  CHECK('결제 14y × 11,500', Math.round(getMatActualCost(mats[0])), 161000);
  corr.status = 'sent';
  CHECK('보낸 정정 반영 뒤 차이 없음', _poCorrLines(_poCorrApplyTo(sent,[corr]), fresh).length, 0);
  var mine = JSON.parse(JSON.stringify(sent)); mine[0].actualOrderedQty = 15.5;
  CHECK('직접 적은 15.5 는 그대로', [_poCorrFill(mine, lines), mine[0].actualOrderedQty], [0, 15.5]);
  var full = '상호 아루드\n품명 배색 파이핑 맨투맨 (9/2)\n\n(배색) 잭콕쭈리\n#C105올리브 - 14y\n\n[요청사항]\n재고 확인 부탁드립니다.\n\n[출고처]\n투케이';
  var dt = _poCorrCompose(full, { mode:'delta', lines:lines }, '9/2', '9/15');
  CHECK('차이만 본문', dt, '상호 아루드\n품명 배색 파이핑 맨투맨 (9/2) 정정 (9/15)\n※ 9/2 보낸 발주서 수량 정정입니다. 아래 줄만 바뀌고 나머지는 그대로예요.\n\n(배색) 잭콕쭈리\n#C105올리브 - 15y → 14y (-1y)\n\n[출고처]\n투케이');
  var ft = _poCorrCompose(full, { mode:'full', lines:lines }, '9/2', '9/15');
  CHECK('전체 다시 본문 첫 3줄', ft.split('\n').slice(0,3), ['상호 아루드','품명 배색 파이핑 맨투맨 (9/2) 정정 (9/15)','※ 9/2 보낸 발주서를 아래 수량으로 바꿔 주세요. (전체)']);
});

// ── 문제 22. 원단 가공비 야드당 = 원단 요척 (2026-09-15) ─────────────────────
// 신고: 「야드당 2,000원인데 원가 +2,000원/장이면 안 되지 — 요척에 맞게」. 예전엔 y/장 칸이 비면 1로 곱했다.
// 원단 맥스(요척 2.55·로스 0) · 염색 야드당 2,000 · 담당 은성 · 100장 → 1장당 5,100원 · 발주서 255y.
TEST('문제 22. 원단 가공비 야드당 = 요척 · 옛 1 이관', function(){
  S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[] };
  S.items.itY = { id:'itY', name:'요척', colors:['브라운'], sizes:['FREE'],
    fabrics:[{ id:'fy', name:'맥스', supplier:'은성', part:'몸판', consumption:2.55, buffer:0, unitPrice:12000 }],
    trims:[], trimCosts:[{ id:'ty', fabId:'fy', name:'맥스', procKind:'염색', costType:'perPcs', costPerPcs:2000, qtyPerPiece:'', factory:'은성' }] };
  var it = S.items.itY, tc = it.trimCosts[0];
  CHECK('비우면 요척', _tcQtyPerPiece(tc, it.trims, it.fabrics), 2.55);
  CHECK('원단 목록 안 넘겨도 아이템에서 찾음', _tcQtyPerPiece(tc, it.trims), 2.55);
  CHECK('1장당 원가 5,100', Math.round(trimCostPerPcs(it, 30)), 5100);
  var o = { id:'oY', orderItems:[{ itemId:'itY', qtyGrid:{ '브라운':{ FREE:100 } } }], suppliers:{} };
  S.orders.oY = o;
  var sups = calcSups(o.orderItems);
  CHECK('발주서 블록 255y', _poProcBlocks({ colors:(sups['은성'].materials) }, '은성'), [['맥스 염색 (2000원/y)', '#브라운 - 255y']]);
  tc.qtyPerPiece = 1.2;
  CHECK('직접 적은 값은 그대로', _tcQtyPerPiece(tc, it.trims, it.fabrics), 1.2);
  tc.qtyPerPiece = 1;
  it.trimCosts.push({ id:'tt', trimId:'t1', name:'로고', costType:'perPcs', costPerPcs:40, qtyPerPiece:1 });
  it.trimCosts.push({ id:'tl', fabId:'fy', name:'바이어스', costType:'perLot', costPerLot:20000, qtyPerPiece:1 });
  CHECK('옛 1 이관: 원단 개당 줄만 1줄', _migrateFabProcYo(it), 1);
  CHECK('이관 결과 (원단 개당 비움·옛값 보관 / 부자재·컬러별 그대로)', [tc.qtyPerPiece, tc._qppOld, it.trimCosts[1].qtyPerPiece, it.trimCosts[2].qtyPerPiece], ['', 1, 1, 1]);
  CHECK('두 번 돌려도 0', _migrateFabProcYo(it), 0);
  CHECK('이관 뒤 요척', _tcQtyPerPiece(tc, it.trims, it.fabrics), 2.55);
  tc.minQty = 30;
  CHECK('10장 = 25.5y < 가공집 최소 30y → 30y', _tcEffPcs(tc, it.trims, 10, it.fabrics), 30);
  var it2 = { id:'itZ', fabrics:[{ id:'fz', consumption:0, consumptionBySize:{ S:1.2, M:1.4 } }], trims:[], trimCosts:[{ id:'tz', fabId:'fz', costType:'perPcs', costPerPcs:100, qtyPerPiece:'' }] };
  CHECK('사이즈별 요척만 있으면 가장 큰 값', _tcQtyPerPiece(it2.trimCosts[0], it2.trims, it2.fabrics), 1.4);
});

// ── 문제 23. 가산 항목 금액 기준(야드당·컬러별·한번에) · 더 시킬 야드 (2026-09-15) ─────────────
// 제로원(요척 0.6·로스 0·5,000원/y) · 네이비 50장·카키 30장.
// 바이오워싱 야드당 1,000 → 컬러 단가 6,000 / 코팅 컬러별 20,000 · 샘플비 한번에 30,000(카키만) → 원단처 정액(가공비 줄처럼)
// 앞뒤 여유 +2y → 네이비 30+2=32y · 카키 18+2=20y. 역산: 네이비 실제 26y → (26-2)/(32-2)=80% → 40장.
TEST('문제 23. 가산 항목 금액 기준 · 더 시킬 야드', function(){
  S = { items:{}, orders:{}, factories:{}, priceBook:{}, brands:[] };
  var f = { id:'fx', name:'제로원', supplier:'대광', part:'몸판', consumption:0.6, buffer:0, unitPrice:5000,
    colorLinks:[{ itemColor:'네이비', fabricColor:'16번 네이비' }, { itemColor:'카키', fabricColor:'1번 카키' }],
    priceAdditions:[
      { id:'a1', name:'바이오워싱', price:1000, applyTo:'all', basis:'yard' },
      { id:'a2', name:'코팅', price:20000, applyTo:'all', basis:'lot' },
      { id:'a3', name:'앞뒤 여유', price:0, applyTo:'all', extraYd:2 },
      { id:'a4', name:'샘플비', price:30000, applyTo:'colors', colors:['카키'], basis:'once' } ] };
  S.items.iX = { id:'iX', name:'가산', colors:['네이비','카키'], sizes:['FREE'], fabrics:[f], trims:[], trimCosts:[] };
  var it = S.items.iX;
  CHECK('야드 단가엔 야드당만 +1,000', calcFabAdditionForColor(f, '네이비'), 1000);
  CHECK('컬러 단가 6,000', fabColorPrice(f, '네이비').unit, 6000);
  CHECK('50장 30y + 여유 2y = 32y', calcFabYards(f, 50, null, '네이비').ty, 32);
  CHECK('컬러 모를 때(원가용)는 여유 안 더함', calcFabYards(f, 50).ty, 30);
  CHECK('정액 2줄 → 원단처 가공비 줄', _fabAddTcs(it).map(function(t){ return [t.name, t.costType, t.costPerLot, t.factory]; }), [['코팅','perLot',20000,'대광'], ['샘플비','once',30000,'대광']]);
  CHECK('원가 1장당 = 20,000×2색÷30 + 30,000÷30', Math.round(trimCostPerPcs(it, 30)), Math.round(20000*2/30 + 30000/30));
  var o = { id:'oX', orderItems:[{ itemId:'iX', qtyGrid:{ '네이비':{ FREE:50 }, '카키':{ FREE:30 } } }], suppliers:{} };
  S.orders.oX = o;
  var sups = calcSups(o.orderItems); o.suppliers = sups;
  var ms = sups['대광'].materials;
  CHECK('발주 야드 네이비 32 · 카키 20', ms.map(function(m){ return m.totalYards; }), [32, 20]);
  CHECK('자재에 더 시킬 야드', ms.map(function(m){ return m.extraYards; }), [2, 2]);
  CHECK('발주서 가산 줄', _poFabProcNotes({ colors:ms }, '대광'), ['가산: 코팅 (20000원 · 컬러당)', '가산: 샘플비 (30000원 · 한번에)']);
  ms[0].actualOrderedQty = 26;
  var eff = getEffectivePcsByColor(o, o.orderItems[0]);
  CHECK('역산은 여유 빼고: 26y → 40장', eff && eff['네이비'], 40);
});

// 단가장 미니멈 발주가 라벨엔 안 먹던 것(09-17k) + 계산 방식 전용 칸 선택.
TEST('문제 24. 미니멈 발주 — 라벨도 적용 · 단가장 계산 방식 전용 칸', function(){
  var lbl = { orderType:'careLabel', qtyPerPiece:1, qtyBuffer:10, unitPrice:100, hasMinOrder:true, minOrderQty:500 };
  CHECK('케어라벨 30장+여분10 < 500 → 500장', calcTrimNeed(lbl, 30).qty, 500);
  CHECK('케어라벨 값 500×100', calcTrimNeed(lbl, 30).cost, 50000);
  var ml = { orderType:'mainLabel', qtyPerPiece:1, qtyBuffer:10, unitPrice:150, hasMinOrder:true, minOrderQty:100 };
  CHECK('메인라벨 200장+10 ≥ 100 → 그대로 210', calcTrimNeed(ml, 200).qty, 210);
  // 실은 문제 2 대로 미니멈 발주 미적용(컬러마다 적용할지 결정 대기)
  var b = { orderType:'button', unit:'ea', qtyPerPiece:6, unitPrice:70 };
  CHECK('단추 계산 키', _pbCalcKey(b), 'button');
  _pbCalcApply(b, 'single', 'ea'); CHECK('단추 → 낱개 = count', b.orderType, 'count');
  _pbCalcApply(b, 'button', 'ea'); CHECK('낱개 → 단추 복귀', _pbCalcKey(b), 'button');
  var lp = { orderType:'yard', loopPerYard:20, unitPrice:1500 };
  CHECK('야드 + loopPerYard = 단추고리', _pbCalcKey(lp), 'loop');
  _pbCalcApply(lp, 'single', 'Y'); CHECK('단추고리 → 낱개: loopPerYard 남아도 낱개', _pbCalcKey(lp), 'single');
  _pbCalcApply(lp, 'loop', 'Y'); CHECK('낱개 → 단추고리 복귀', _pbCalcKey(lp), 'loop');
  CHECK('단위 맞춤: 바이어스 Y', _pbCalcUnit('bias', 'ea'), 'Y');
  CHECK('단위 맞춤: 단추는 ea (콘이었어도)', _pbCalcUnit('button', '콘'), 'ea');
  CHECK('미니멈 분배: 낱개도 값 보임', _pbSplitVal({ orderType:'count', minSplitQty:30 }), 30);
  CHECK('미니멈 발주 단위: 바이어스 y', _pbMinUnit({ orderType:'bias' }), 'y');
});

// ---- 결과 ----
print('');
if(_fails.length){
  print('CALC TESTS: FAIL — ' + _fails.length + '건 실패 (통과 ' + _okCount + ')');
  print('실패 목록: ' + _fails.join(' / '));
  print('>>> 고치기 전에는 push 금지. (검사 자체를 건너뛰려면 SKIP_CALC=1 ./safe-push.sh)');
}else{
  print('CALC TESTS: OK — ' + _testCount + '문제 전부 통과 (검사 ' + _okCount + '개)');
}

