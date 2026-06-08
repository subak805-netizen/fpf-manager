#!/usr/bin/env python3
# fpf-manager 정적 health-check (야간 점검용). index.html 기준.
import re,sys,collections,os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
h=open('index.html',encoding='utf-8').read()
js="\n".join(re.findall(r'<script\b[^>]*>(.*?)</script>',h,re.S|re.I))
issues=[]

# (1) 문법은 외부 JSC로 검사(셸에서). 여기선 정적 분석만.

# (2) HTML 핸들러 정의 검사
hcalls=set()
for m in re.finditer(r'on(?:click|change|input|focus|blur|submit|keyup|keydown|mousedown|mouseup)\s*=\s*(?:"|\'|\\")\s*([A-Za-z_$][\w$]*)\s*\(',h): hcalls.add(m.group(1))

# 정의된 이름(중첩·파라미터·catch 포함)
defined=set()
for m in re.finditer(r'function\s+([A-Za-z_$][\w$]*)',js): defined.add(m.group(1))
for m in re.finditer(r'(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=',js): defined.add(m.group(1))
for m in re.finditer(r'\bwindow\.([A-Za-z_$][\w$]*)\s*=',js): defined.add(m.group(1))
for m in re.finditer(r'([A-Za-z_$][\w$]*)\s*=\s*function',js): defined.add(m.group(1))
for m in re.finditer(r'([A-Za-z_$][\w$]*)\s*[:=]\s*(?:async\s*)?(?:function|\([^()]*\)\s*=>)',js): defined.add(m.group(1))
for m in re.finditer(r'function[^(]*\(([^)]*)\)',js):
    for p in m.group(1).split(','):
        p=p.strip().split('=')[0].strip().lstrip('.')
        if re.match(r'^[A-Za-z_$][\w$]*$',p): defined.add(p)
for m in re.finditer(r'\(([^()]*)\)\s*=>',js):
    for p in m.group(1).split(','):
        p=p.strip().split('=')[0].strip()
        if re.match(r'^[A-Za-z_$][\w$]*$',p): defined.add(p)
for m in re.finditer(r'catch\s*\(\s*([A-Za-z_$][\w$]*)',js): defined.add(m.group(1))

KW={'if','for','while','switch','catch','function','return','typeof','do','else','new','delete','void','in','of','await','yield','case','throw','with','instanceof','try','finally','break','continue','const','let','var'}
BUILT={'parseInt','parseFloat','isNaN','isFinite','String','Number','Boolean','Array','Object','JSON','Math','Date','RegExp','Map','Set','WeakMap','Promise','Symbol','Error','encodeURIComponent','decodeURIComponent','encodeURI','decodeURI','setTimeout','setInterval','clearTimeout','clearInterval','alert','confirm','prompt','fetch','require','btoa','atob','structuredClone','queueMicrotask','Notification'}
GLOB={'S','window','document','console','localStorage','sessionStorage','firebase','navigator','location','history','event','html2canvas','XMLHttpRequest','FileReader','Image','Blob','FormData','URL','Audio','Worker','MutationObserver','IntersectionObserver','ResizeObserver','getComputedStyle','requestAnimationFrame','cancelAnimationFrame'}
# CSS 함수/문맥 토큰(스타일 문자열 가짜양성)
CSS={'translate','translateX','translateY','translateZ','translate3d','rotate','rotateX','rotateY','scale','scaleX','scaleY','skew','matrix','rgba','rgb','hsl','hsla','var','calc','min','max','minmax','clamp','repeat','linear','gradient','radial','blur','brightness','contrast','grayscale','saturate','sepia','drop','url','media','supports','keyframes','cubic','steps','attr','counter','env','perspective','opacity'}
ignore=defined|KW|BUILT|GLOB|CSS

# (3) 전체 JS 미정의 bareword 호출 스캔 (save() 류)
calls=collections.Counter(m.group(1) for m in re.finditer(r'(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(',js))
suspects=[]
for nm,cnt in calls.items():
    if nm in ignore: continue
    if not re.match(r'^[a-z][A-Za-z0-9_$]{2,}$',nm): continue  # 소문자 시작 camelCase 함수꼴만(대문자상수·한글·짧은건 제외)
    # 가드/주석 휴리스틱: typeof 가드되거나 주석에만 있으면 제외는 호출자(나)가 라인 보고 판단
    lines=[i+1 for i,l in enumerate(js.split('\n')) if re.search(r'(?<![.\w$])'+re.escape(nm)+r'\s*\(',l)]
    suspects.append((nm,cnt,lines[:4]))

hmiss=sorted(c for c in hcalls if c not in defined and c not in KW)

# 중복 static ID
ids=re.findall(r'\bid="([^"]+)"',h)
dup=[k for k,v in collections.Counter(ids).items() if v>1 and not(("'" in k)or("+" in k)or("${" in k))]
known={'ded-fabric','ded-yards','new-brand-nm','pickup-route-ai','new-task-brand','new-task-loc','new-task-pri','new-task-item','new-task-name','new-task-sup','dl-task-sup'}
newdup=[k for k in dup if k not in known]

print("[HANDLER] HTML 핸들러 미정의:", hmiss if hmiss else "0")
print("[DUPID] 신규 중복ID:", newdup if newdup else "없음")
print("[UNDEF-CALL] 미정의 bareword 호출 의심(소문자함수꼴) — 라인 보고 가드/주석/오타 판단:")
if suspects:
    for nm,cnt,lns in sorted(suspects,key=lambda x:x[1]):
        print(f"   {nm} (x{cnt}) lines {lns}")
else:
    print("   없음")
