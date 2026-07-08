#!/usr/bin/env bash
# 돈 계산 검산 — index.html의 "진짜" 계산 함수를 추출해 calc-tests.js의 문제 10개로 채점한다.
# 사용: ./calc-check.sh   (safe-push.sh가 push 전에 자동 실행. 건너뛰기: SKIP_CALC=1 ./safe-push.sh)
# 원칙: 계산식은 여기·calc-tests.js 어디에도 재구현하지 않는다. index.html의 함수 그 자체를 채점한다.
set -u
cd "$(dirname "$0")" || exit 1

TMP=$(mktemp -d) || exit 2
trap 'rm -rf "$TMP"' EXIT

python3 - "$TMP/extracted.js" <<'PY'
import sys, re
OUT=sys.argv[1]
src=open('index.html',encoding='utf-8').read()

# 이름 목록: 검산에 필요한 계산 함수/상수 (index.html에서 원문 그대로 추출)
FUNCS=['orderFc','snapshotOrderFc','calcFabAdditionForColor','calcFabShrinkForColor',
'getFabRound','roundYards','calcFabYards','trimExtrasCost','calcTrimNeed','_calcTrimNeedRaw',
'getMatActualQty','getMatActualCost','getMatOrigQty','hasMatOverride','getMatBaseQty',
'_trimWeightedPrice','ensureOrderLoss','orderLabelBuffer','calcSups','mkSup','mkSupWithDefaults',
'lossParse','lossEnc','getEffectivePcsByColor','getEffectivePcsForOrderItem','getEffectivePcsBreakdown',
'getPayFees','payFeeAmt','payFeeBlock','bgUnitPrice','sewLaborBase']
CONSTS=['COST_DEFS']

def find_def(name):
    for pat in ('function '+name+'(', 'const '+name+'=', 'let '+name+'=', 'var '+name+'='):
        i=src.find(pat)
        if i>=0: return i,pat
    return -1,None

def extract(name):
    i,pat=find_def(name)
    if i<0:
        sys.stderr.write('추출 실패: '+name+' 정의를 못 찾음 (이름이 바뀌었나요? calc-check.sh 목록 갱신 필요)\n')
        sys.exit(3)
    is_func=pat.startswith('function')
    n=len(src); j=i; depth=0; started=False
    state=[]  # 원소: 'sq' 'dq' 'line' 'block' 또는 ('tl',) ('code',depth)
    while j<n:
        ch=src[j]; nxt=src[j+1] if j+1<n else ''
        st=state[-1] if state else None
        if st=='line':
            if ch=='\n': state.pop()
            j+=1; continue
        if st=='block':
            if ch=='*' and nxt=='/': state.pop(); j+=2; continue
            j+=1; continue
        if st=='sq':
            if ch=='\\': j+=2; continue
            if ch=="'": state.pop()
            j+=1; continue
        if st=='dq':
            if ch=='\\': j+=2; continue
            if ch=='"': state.pop()
            j+=1; continue
        if st=='tl':
            if ch=='\\': j+=2; continue
            if ch=='`': state.pop(); j+=1; continue
            if ch=='$' and nxt=='{': state.append(('code',depth)); j+=2; continue
            j+=1; continue
        # 코드 상태 (기본 또는 템플릿 ${} 내부)
        if ch=='/' and nxt=='/': state.append('line'); j+=2; continue
        if ch=='/' and nxt=='*': state.append('block'); j+=2; continue
        if ch=="'": state.append('sq'); j+=1; continue
        if ch=='"': state.append('dq'); j+=1; continue
        if ch=='`': state.append('tl'); j+=1; continue
        if ch=='{': depth+=1; started=True; j+=1; continue
        if ch=='}':
            if state and isinstance(state[-1],tuple) and state[-1][0]=='code' and depth==state[-1][1]:
                state.pop(); j+=1; continue  # ${ } 닫힘 → 템플릿으로 복귀
            depth-=1; j+=1
            if is_func and started and depth==0: return src[i:j]
            continue
        if (not is_func) and ch==';' and depth==0:
            return src[i:j+1]
        j+=1
    sys.stderr.write('추출 실패: '+name+' 끝을 못 찾음\n'); sys.exit(3)

parts=[]
# 로스율 상수 (스크립트 1번 블록)
for nm in ('FAB_LOSS_PCT','TRIM_LOSS_PCT'):
    m=re.search(r'const '+nm+r'\s*=\s*[^;]+;', src)
    if not m: sys.stderr.write('추출 실패: '+nm+'\n'); sys.exit(3)
    parts.append(m.group(0))
for nm in CONSTS: parts.append(extract(nm))
for nm in FUNCS: parts.append(extract(nm))
open(OUT,'w',encoding='utf-8').write('\n;\n'.join(parts)+'\n')
print('추출 OK: 상수 %d + 함수 %d'%(2+len(CONSTS),len(FUNCS)))
PY
[ $? -ne 0 ] && { echo "❌ 검산 준비 실패(함수 추출)"; exit 3; }

cat "$TMP/extracted.js" calc-tests.js > "$TMP/bundle.js"

JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
OUT=$("$JSC" "$TMP/bundle.js" 2>&1)
echo "$OUT"
echo "$OUT" | grep -q "CALC TESTS: OK" && exit 0
exit 1
