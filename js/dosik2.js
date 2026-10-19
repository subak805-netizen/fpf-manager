/* ===== 도식화 탭 v2 (2026-10-19) =====
   클로드가 만든 도식화 파일(밑그림 + 설명 자리 도식화.json)을 불러와 FPF 안에서 글만 쓰고,
   화살표 더하기·라벨/상자 옮기기·부품 찍기를 한 뒤 작지(샘플 회차·메인)로 「복사본」을 보내는 탭.
   ⚠️ 새 창 금지(사용자 명시) — switchTab('dosik') 로 앱 안에서 열림.
   저장: 기기 = IndexedDB fpfDosik2/docs  ·  클라우드 = Firestore users/{uid}/data/fpm_dosik2 (메타·묘비)
         + Storage dosik2/{uid}/{id}_base.png · {id}.json · {id}.png
   ⚠️ 옛 도식화(fpfDosik · fpm_dosik · dosik.html)와 저장소를 일부러 나눔 — 옛 화면이 새 기록을 덮어쓰지 않게. 옛 것은 읽기만.
   ⚠️ 작지 칸 쓰기는 dk2SendToTp 한 곳뿐: techpack.images[칸] = 올린 그림 주소 + saveData() (보통 편집과 같은 길).
   배치 규칙(사용자 10-19): 옷 그림 종이 폭 꽉 · 설명은 옷 위/아래 줄 · 화살촉은 글자 쪽 · 기본 13pt · 한 글자 줄바꿈 금지.
   좌표는 전부 「옷 그림 기준 0~1」(an/rn/pn)로 저장 → 글씨 크기가 바뀌어 옷이 작아져도 화살표·라벨이 따라감. */
(function(){
'use strict';
var LAND={w:3300,h:2334}, PORT={w:2334,h:3300}, PX_PT=3300/841, LEADER_W=2.6, NEW_TEXT='부위) 내용';
var PAGE_W=3300, PAGE_H=2334;   /* 지금 그리는 도식화의 종이 — pageOf(r) 가 바꿔 끼움 (아루드=세로 지시서) */
function pageOf(r){ var p=(r&&r.doc&&r.doc.orient==='port')||(r&&r.orient==='port')?PORT:LAND; PAGE_W=p.w; PAGE_H=p.h; return p; }
var FONT_STACK='"Pretendard","Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif';
var KIND={label:'라벨',band:'밴드',stitch:'봉제·스티치',tuck:'턱·주름',lining:'안감·안쪽',art:'아트웍',etc:'기타'};
var SIDE={top:'옷 위 줄',bottom:'옷 아래 줄'};
var NEED=[['main','메인라벨'],['care','케어라벨'],['stitch','봉제'],['band','밴드'],['lining','안감']];
var SLOT_LBL={sewSketch:'메인 지시서',cutSketch:'메인 재단',innSketch:'메인 안사양'};
var PARTS=[
  {k:'btn4',nm:'단추 4구',w:44,h:44,svg:'<circle r="20" fill="#fff" stroke="#231f20" stroke-width="2.6"/><circle r="13" fill="none" stroke="#231f20" stroke-width="1.4"/><circle cx="-4.5" cy="-4.5" r="2.4" fill="#231f20"/><circle cx="4.5" cy="-4.5" r="2.4" fill="#231f20"/><circle cx="-4.5" cy="4.5" r="2.4" fill="#231f20"/><circle cx="4.5" cy="4.5" r="2.4" fill="#231f20"/>'},
  {k:'btn2',nm:'단추 2구',w:44,h:44,svg:'<circle r="20" fill="#fff" stroke="#231f20" stroke-width="2.6"/><circle r="13" fill="none" stroke="#231f20" stroke-width="1.4"/><circle cx="-5" r="2.6" fill="#231f20"/><circle cx="5" r="2.6" fill="#231f20"/>'},
  {k:'snap',nm:'스냅',w:34,h:34,svg:'<circle r="15" fill="#fff" stroke="#231f20" stroke-width="2.6"/><circle r="6" fill="none" stroke="#231f20" stroke-width="2"/>'},
  {k:'prong',nm:'하마구리',w:34,h:34,svg:'<circle r="15" fill="#fff" stroke="#231f20" stroke-width="2.6"/>'+[0,60,120,180,240,300].map(function(a){return '<circle cx="'+(9*Math.cos(a*Math.PI/180)).toFixed(1)+'" cy="'+(9*Math.sin(a*Math.PI/180)).toFixed(1)+'" r="2" fill="#231f20"/>';}).join('')},
  {k:'zip',nm:'지퍼 손잡이',w:30,h:60,svg:'<rect x="-9" y="-28" width="18" height="16" rx="3" fill="#fff" stroke="#231f20" stroke-width="2.4"/><path d="M-7 -12 L-10 26 Q0 32 10 26 L7 -12 Z" fill="#fff" stroke="#231f20" stroke-width="2.4"/><rect x="-3.5" y="6" width="7" height="12" rx="3" fill="none" stroke="#231f20" stroke-width="1.8"/>'},
  {k:'dring',nm:'D링',w:44,h:34,svg:'<path d="M-18 -14 L4 -14 Q20 -14 20 0 Q20 14 4 14 L-18 14 Z" fill="none" stroke="#231f20" stroke-width="3.4"/>'},
  {k:'stopper',nm:'스토퍼',w:30,h:40,svg:'<rect x="-13" y="-18" width="26" height="36" rx="8" fill="#fff" stroke="#231f20" stroke-width="2.6"/><circle r="5" fill="none" stroke="#231f20" stroke-width="2"/>'},
  {k:'eyelet',nm:'아일렛',w:30,h:30,svg:'<circle r="13" fill="#fff" stroke="#231f20" stroke-width="3.6"/><circle r="6.5" fill="#fff" stroke="#231f20" stroke-width="1.6"/>'},
  {k:'main',nm:'메인라벨',w:110,h:36,svg:'<rect x="-55" y="-18" width="110" height="36" fill="#f4b8c8" stroke="#8f8a84" stroke-width="1.6"/>',need:'main'},
  {k:'care',nm:'케어라벨',w:56,h:96,svg:'<rect x="-28" y="-48" width="56" height="96" fill="#f7f3b8" stroke="#8f8a84" stroke-width="1.6"/>',need:'care'},
  {k:'size',nm:'사이즈라벨',w:40,h:40,svg:'<rect x="-20" y="-20" width="40" height="40" fill="#fff" stroke="#8f8a84" stroke-width="1.6"/>'},
  {k:'heart',nm:'하트라벨',w:44,h:40,svg:'<path d="M0 16 C-22 2 -20 -16 -9 -16 C-4 -16 -1 -12 0 -9 C1 -12 4 -16 9 -16 C20 -16 22 2 0 16 Z" fill="#f4b8c8" stroke="#8f8a84" stroke-width="1.6"/>'}
];
function allParts(){ return PARTS.concat((window.DK2_EXTRA_PARTS||[]).filter(function(p){return p&&p.k&&p.svg;})); }
var st={recs:[],old:[],cur:null,brand:'전체',q:'',sel:null,selPart:null,moving:false,adding:false,placing:null,custom:[],zoom:false,view:'detail',loaded:false,listOpen:false};
var $=function(id){return document.getElementById(id);};
/* ⚠️ FPF 의 S 는 전역 let 이라 window.S 로는 안 보임 — 이름으로 직접 읽기 */
function SS(){ try{ return (typeof S!=='undefined')?S:null; }catch(e){ return null; } }
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function toast(t,ms){ if(typeof showToast==='function')showToast(t,ms||2600); }
function isPhone(){ return window.matchMedia('(max-width:760px)').matches; }
var _mcx=null;
function measure(s,fs){ if(!_mcx)_mcx=document.createElement('canvas').getContext('2d'); _mcx.font='400 '+fs+'px '+FONT_STACK; return _mcx.measureText(s).width; }
function today(){ var d=new Date(); return (d.getMonth()+1)+'.'+String(d.getDate()).padStart(2,'0'); }
function newId(){ return 'dk2_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function itemOf(r){ return r&&r.itemId&&SS()&&SS().items?SS().items[r.itemId]:null; }
function brandName(id){ var b=((SS()&&SS().brands)||[]).find(function(x){return x.id===id;}); return b?b.name:''; }
function recBrand(r){ if(r.kind==='old')return '옛 도식화'; var it=itemOf(r); return it?(brandName(it.brandId)||'브랜드 없음'):'아이템 미연결'; }
function cur(){ return st.recs.concat(st.old).find(function(r){return r.id===st.cur;})||null; }

/* ---------- 기기 저장(IndexedDB) ---------- */
function idb(){ return new Promise(function(res,rej){ try{ var rq=indexedDB.open('fpfDosik2',1); rq.onupgradeneeded=function(){ var db=rq.result; if(!db.objectStoreNames.contains('docs'))db.createObjectStore('docs',{keyPath:'id'}); }; rq.onsuccess=function(){res(rq.result);}; rq.onerror=function(){rej(rq.error);}; }catch(e){rej(e);} }); }
function idbAll(){ return idb().then(function(db){ return new Promise(function(res,rej){ var out=[],cr=db.transaction('docs','readonly').objectStore('docs').openCursor(); cr.onsuccess=function(){ var c=cr.result; if(c){out.push(c.value);c.continue();} else res(out); }; cr.onerror=function(){rej(cr.error);}; }); }); }
function idbPut(o){ return idb().then(function(db){ return new Promise(function(res,rej){ var tx=db.transaction('docs','readwrite'); tx.objectStore('docs').put(o); tx.oncomplete=function(){res(true);}; tx.onerror=function(){rej(tx.error);}; }); }); }

/* 저장용 모양(화면 계산값은 빼고 저장) */
function clean(r){
  var d=r.doc;
  return {id:r.id,itemId:r.itemId||'',name:r.name||'',code:r.code||'',updated:r.updated||Date.now(),ver:r.ver||0,del:r.del||0,orient:r.orient||(d&&d.orient)||'land',
    base:{url:(r.base&&r.base.url)||'',w:r.base.w,h:r.base.h},
    doc:d?{asp:d.asp,fs:d.fs,orient:d.orient||'land',
      callouts:d.callouts.map(function(c){ var o={id:c.id,kind:c.kind||'etc',text:c.text,value:c.value||'',an:c.an}; if(c.moved){o.moved=true;o.x=c.x;o.y=c.y;} return o; }),
      marks:d.marks.map(function(m){ var o={type:m.type}; if(m.rn)o.rn=m.rn; if(m.pn)o.pn=m.pn; if(m.sn!=null)o.sn=m.sn; if(m.dir!=null)o.dir=m.dir; return o; }),
      notes:(d.notes||[]).map(function(n){return {text:n.text};})}:null,
    parts:(r.parts||[]).map(function(p){return {id:p.id,k:p.k,nm:p.nm,src:p.src||null,pn:p.pn,s:p.s};}),
    tp:{log:(r.tp&&r.tp.log)||[]},pngUrl:r.pngUrl||''};
}
var _saveT={};
function persist(r,immediateCloud){
  r.updated=Date.now();
  var o=clean(r); o.base.data=(r.base&&r.base.data)||''; o.png=r.png||'';
  return idbPut(o).catch(function(e){ console.warn('[도식화] 기기 저장 실패',e); toast('기기에 저장하지 못했어요 — 저장 공간을 확인해 주세요'); })
    .then(function(){ clearTimeout(_saveT[r.id]); _saveT[r.id]=setTimeout(function(){ cloudPush(r); },immediateCloud?0:2500); });
}
function touch(r){ r=r||cur(); if(!r||r.kind==='old')return; r.ver=(r.ver||0)+1; persist(r); renderSent(); }

/* ---------- 클라우드(로그인돼 있을 때만) ---------- */
function cloudOk(){ return !!(window.fbDB&&window.fbUser&&window.fbStorage); }
function cloudDoc(){ return window.fbDB.collection('users').doc(window.fbUser.uid).collection('data').doc('fpm_dosik2'); }
function upload(path,blob){ var ref=window.fbStorage.ref().child(path); return ref.put(blob).then(function(){return ref.getDownloadURL();}); }
function dataToBlob(u){ var i=u.indexOf(','),head=u.slice(0,i),b=atob(u.slice(i+1)),a=new Uint8Array(b.length); for(var k=0;k<b.length;k++)a[k]=b.charCodeAt(k); return new Blob([a],{type:(head.match(/data:([^;]+)/)||[])[1]||'application/octet-stream'}); }
function cloudPush(r){
  if(!cloudOk()||!r||r.kind==='old')return Promise.resolve(false);
  var uid=window.fbUser.uid, pre='dosik2/'+uid+'/'+r.id;
  var chain=Promise.resolve();
  if(!r.base.url&&r.base.data) chain=chain.then(function(){ return upload(pre+'_base.png',dataToBlob(r.base.data)).then(function(u){ r.base.url=u; }); });
  if(r.png&&!r._pngUp) chain=chain.then(function(){ return upload(pre+'.png',dataToBlob(r.png)).then(function(u){ r.pngUrl=u; r._pngUp=true; }); });
  return chain.then(function(){ return upload(pre+'.json',new Blob([JSON.stringify(clean(r))],{type:'application/json'})); })
    .then(function(jsonUrl){ var o={items:{}}; o.items[r.id]={id:r.id,name:r.name||'',code:r.code||'',itemId:r.itemId||'',updated:r.updated,del:r.del||0,jsonUrl:jsonUrl,pngUrl:r.pngUrl||'',baseUrl:r.base.url||''};
      return cloudDoc().set(o,{merge:true}); })
    .then(function(){ var o=clean(r); o.base.data=r.base.data||''; o.png=r.png||''; return idbPut(o); })
    .then(function(){ return true; })
    .catch(function(e){ console.warn('[도식화] 클라우드 올리기 실패 — Storage 규칙(dosik2/ 경로) 확인',e); return false; });
}
function cloudPull(){
  if(!cloudOk())return Promise.resolve(false);
  return cloudDoc().get().then(function(snap){
    var items=(snap.exists&&snap.data()&&snap.data().items)||{}, chain=Promise.resolve(), changed=false;
    Object.keys(items).forEach(function(id){
      var rem=items[id], loc=st.recs.find(function(x){return x.id===id;});
      if(loc&&(loc.updated||0)>=(rem.updated||0))return;
      chain=chain.then(function(){ return fetch(rem.jsonUrl).then(function(x){return x.json();}).then(function(j){
        var r=normalizeRec(j); if(loc&&loc.base&&loc.base.data&&loc.base.url===r.base.url)r.base.data=loc.base.data;
        var o=clean(r); o.base.data=r.base.data||''; return idbPut(o).then(function(){ var i=st.recs.findIndex(function(x){return x.id===id;}); if(i>=0)st.recs[i]=r; else st.recs.push(r); changed=true; });
      }).catch(function(e){ console.warn('[도식화] 받기 실패',id,e); }); });
    });
    st.recs.forEach(function(r){ var rem=items[r.id]; if(!rem||(r.updated||0)>(rem.updated||0)) cloudPush(r); });
    return chain.then(function(){ return changed; });
  }).catch(function(e){ console.warn('[도식화] 클라우드 받기 실패',e); return false; });
}

/* ---------- 불러온 파일 → 옷 그림 기준 좌표(0~1) ---------- */
function normalizeRec(r){
  r.parts=r.parts||[]; r.tp=r.tp||{log:[]}; r.base=r.base||{};
  if(r.doc&&r.doc.baseRect){   // annotate.py 가 만든 도식화.json (종이 좌표) → 0~1
    var br=r.doc.baseRect, bx=br[0],by=br[1],bw=br[2],bh=br[3], d=r.doc;
    d.asp=bh/bw; d.fs=d.fs||52; d.orient=(d.page&&d.page[1]>d.page[0])?'port':(d.orient||'land'); delete d.page;
    d.callouts=(d.callouts||[]).map(function(c){ return {id:c.id||newId(),kind:c.kind||'etc',text:c.text||NEW_TEXT,value:'',an:[(c.anchor[0]-bx)/bw,(c.anchor[1]-by)/bh]}; });
    d.marks=(d.marks||[]).map(function(m){ var o={type:m.type}; if(m.prect)o.rn=[(m.prect[0]-bx)/bw,(m.prect[1]-by)/bh,m.prect[2]/bw,m.prect[3]/bh];
      if(m.pat)o.pn=[(m.pat[0]-bx)/bw,(m.pat[1]-by)/bh]; if(m.pspan)o.sn=m.pspan/bw; if(m.dir!=null)o.dir=m.dir; return o; });
    d.notes=(d.notes||[]).map(function(n){return {text:n.text};}); delete d.baseRect;
  }
  if(r.doc){ r.doc.fs=r.doc.fs||52; r.doc.callouts.forEach(function(c){ if(c.value==null)c.value=''; }); }
  return r;
}
function geo(r){
  pageOf(r);
  if(r.doc&&r.doc.geo)return r.doc.geo;
  var w=r.base.w||4,h=r.base.h||3,s=Math.min((PAGE_W-240)/w,(PAGE_H-240)/h);
  return {x:(PAGE_W-w*s)/2,y:(PAGE_H-h*s)/2,w:w*s,h:h*s};
}

/* ---------- 배치(사용자 10-19): 옷 꽉 · 설명 위/아래 줄 · 가리키는 곳 바로 위아래 · 붐비면 반대 줄 · 그래도 넘치면 두 줄(바깥 줄 지시선은 틈으로) ---------- */
function lines(c){ var t=(c.value||'').trim()||c.text; return t.split(/\s+\/\s+|\n/).filter(Boolean); }
function written(c){ return (c.value||'').trim().length>0; }
function wrapLine(t,fs,maxw){
  if(measure(t,fs)<=maxw||t.indexOf(' ')<0)return [t];
  var out=[],cur='';
  t.split(' ').forEach(function(wd){ var cand=(cur+' '+wd).trim(); if(cur&&measure(cand,fs)>maxw){out.push(cur);cur=wd;} else cur=cand; });
  if(cur)out.push(cur);
  if(out.length>1&&measure(out[out.length-1],fs)<maxw*0.3){ var last=out.pop(); out[out.length-1]+=' '+last; }   /* 한 글자 줄바꿈 금지 */
  return out;
}
function placeBand(items,xmin,xmax,GAP){
  items.forEach(function(c){ c.x=Math.min(Math.max(c.ax-c.w/2,xmin),xmax-c.w); });
  for(var i=1;i<items.length;i++){ var p=items[i-1]; if(items[i].x<p.x+p.w+GAP)items[i].x=p.x+p.w+GAP; }
  var last=items[items.length-1];
  if(last&&last.x+last.w>xmax){ last.x=xmax-last.w; for(var j=items.length-2;j>=0;j--){ var n=items[j+1]; if(items[j].x+items[j].w+GAP>n.x)items[j].x=n.x-GAP-items[j].w; } }
  return !items.length||items[0].x>=xmin-1;
}
function placeVertical(rows,xmin,xmax,GAP){   /* 여러 줄: 지시선 전부 수직, 안쪽 줄 상자는 바깥 줄 지시선 자리를 비움 → 화살표가 글자·다른 화살표와 안 겹침. 되면 비켜난 정도 합, 안 되면 null */
  var pad=22, dev=0;
  for(var r=0;r<rows.length;r++){
    var forb=[]; rows.slice(r+1).forEach(function(rr){ rr.forEach(function(c){ forb.push(c.ax); }); });
    var row=rows[r].slice().sort(function(a,b){return a.ax-b.ax;}), plan=null;
    ['near','left'].some(function(strat){
      var prevEnd=xmin-GAP, p=[];
      for(var i=0;i<row.length;i++){ var c=row[i], lo=Math.max(prevEnd+GAP,c.ax-c.w+24,xmin), hi=Math.min(c.ax-24,xmax-c.w), ideal=Math.min(Math.max(c.ax-c.w/2,lo),hi), cands=[ideal,lo,hi];
        forb.forEach(function(f){ cands.push(f+pad,f-pad-c.w); });
        var valid=cands.filter(function(x){ return x>=lo-0.01&&x<=hi+0.01&&!forb.some(function(f){return x-pad<f&&f<x+c.w+pad;}); });
        if(!valid.length)return false;
        var x=strat==='near'?valid.reduce(function(a,b){return Math.abs(b-ideal)<Math.abs(a-ideal)?b:a;}):Math.min.apply(null,valid);
        p.push([c,x]); prevEnd=x+c.w; }
      plan=p; return true; });
    if(!plan)return null;
    plan.forEach(function(q){ q[0].x=q[1]; q[0].lx=q[0].ax; dev+=Math.abs(q[1]+q[0].w/2-q[0].ax); });
  }
  return dev;
}
function layout(r){
  if(!r)return; pageOf(r); if(!r.doc)return;
  var d=r.doc, fs=d.fs, lh=Math.round(fs*1.3), cs=d.callouts, GAP=46, MAXW=fs*12.5;
  cs.forEach(function(c){ c.ls=[].concat.apply([],lines(c).map(function(t){return wrapLine(t,fs,MAXW);})); c.w=Math.max.apply(null,[fs*2].concat(c.ls.map(function(t){return measure(t,fs);}))); c.h=c.ls.length*lh; });
  var M=90, minBand=lh*3+110, gw=PAGE_W-2*M, gh=gw*d.asp, maxGh=PAGE_H-2*minBand-60;
  if(gh>maxGh){ gh=maxGh; gw=gh/d.asp; }
  var xmin=60,xmax=PAGE_W-60, free=cs.filter(function(c){return !c.moved;}), g, plan, pad=30;
  function rowsFor(all){   /* 한 줄에 다 들어가면 한 줄. 아니면 2줄(→3줄)로 나누는 모든 경우 중 지시선을 전부 수직으로 세울 수 있는 것(10-20, annotate.py 와 같은 순서·규칙) */
    if(placeBand(all,xmin,xmax,GAP))return {mode:'one',rows:[all]};
    var k=all.length,best=null;
    [2,3].some(function(n){ if((n===2&&k>12)||(n===3&&k>7))return false;
      for(var m=0,total=Math.pow(n,k);m<total;m++){ var asg=new Array(k),t=m; for(var i=k-1;i>=0;i--){ asg[i]=t%n; t=Math.floor(t/n); }
        var used={}; asg.forEach(function(a){used[a]=1;}); if(Object.keys(used).length<n)continue;
        var rows=[]; for(var r=0;r<n;r++)rows.push(all.filter(function(_,j){return asg[j]===r;}));
        var dev=placeVertical(rows,xmin,xmax,GAP); if(dev!=null&&(best==null||dev<best.dev))best={dev:dev,rows:rows}; }
      return !!best; });
    if(best)return {mode:'vert',rows:best.rows};
    for(var n=2;n<=4;n++){ var rows=[]; for(var i=0;i<n;i++)rows.push(all.filter(function(_,j){return j%n===i;}));
      if(rows.every(function(rw){return placeBand(rw,xmin,xmax,GAP);})||n===4)return {mode:'route',rows:rows}; } }
  function bandH(pb){ var rs=pb.rows.filter(function(rw){return rw.length;}); if(!rs.length)return 0;
    return 40+rs.reduce(function(s,rw){return s+Math.max.apply(null,rw.map(function(c){return c.h;}));},0)+34*(rs.length-1); }
  function planBands(g){
    cs.forEach(function(c){ c.ax=g.x+c.an[0]*g.w; c.ay=g.y+c.an[1]*g.h; c.band=c.an[1]<0.5?'top':'bottom'; c.lx=null; });
    var need=function(b){ var a=free.filter(function(c){return c.band===b;}); return a.reduce(function(s,c){return s+c.w;},0)+GAP*Math.max(0,a.length-1); };
    for(var k=0;k<free.length;k++)[['top','bottom'],['bottom','top']].forEach(function(p){
      if(need(p[0])>xmax-xmin){ var cand=free.filter(function(c){return c.band===p[0]&&Math.abs(c.an[1]-0.5)<=0.15&&need(p[1])+c.w+GAP<=xmax-xmin;}); if(cand.length){   /* 10-20: 가운데쯤 가리키는 것만, 반대 줄에 한 줄로 들어갈 때만 옮김 */ cand.sort(function(a,b){return Math.abs(a.an[1]-0.5)-Math.abs(b.an[1]-0.5);}); cand[0].band=p[1]; } } });
    var o={}; ['top','bottom'].forEach(function(band){ o[band]=rowsFor(free.filter(function(c){return c.band===band;}).sort(function(a,b){return a.ax-b.ax;})); });
    return o;
  }
  /* 2026-10-20 설명 줄이 많으면 종이 밖으로 안 나가게: 먼저 옷+설명 덩어리를 가운데로, 그래도 넘치면 옷을 줄임 */
  for(var it=0;it<5;it++){
    g={x:(PAGE_W-gw)/2,y:(PAGE_H-gh)/2+10,w:gw,h:gh}; plan=planBands(g);
    var ht=bandH(plan.top), hb=bandH(plan.bottom);
    if(g.y-ht>=pad&&g.y+g.h+hb<=PAGE_H-pad)break;
    var room=PAGE_H-2*pad-ht-hb;
    if(room>=gh){ g.y=pad+ht+(room-gh)/2; plan=planBands(g); break; }
    gh=Math.max(room,PAGE_H*0.3); gw=gh/d.asp;
  }
  d.geo=g;
  d.marks.forEach(function(m){ if(m.rn)m.r2=[g.x+m.rn[0]*g.w,g.y+m.rn[1]*g.h,m.rn[2]*g.w,m.rn[3]*g.h]; if(m.pn)m.p2=[g.x+m.pn[0]*g.w,g.y+m.pn[1]*g.h]; if(m.sn!=null)m.s2=m.sn*g.w; });
  ['top','bottom'].forEach(function(band){
    var pb=plan[band], rows=pb.rows, edge=band==='top'?g.y-40:g.y+g.h+40, inner=[];
    if(pb.mode==='vert'){ placeVertical(rows,xmin,xmax,GAP);
      rows.forEach(function(row){ if(!row.length)return; row.forEach(function(c){ c.y=band==='top'?edge-c.h:edge; }); var rh=Math.max.apply(null,row.map(function(c){return c.h;})); edge=band==='top'?edge-rh-34:edge+rh+34; });
      return; }
    rows.forEach(function(row,ri){ if(!row.length)return; var rh=Math.max.apply(null,row.map(function(c){return c.h;}));
      row.forEach(function(c){ c.y=band==='top'?edge-c.h:edge; c.lx=Math.min(Math.max(c.ax,c.x+24),c.x+c.w-24);
        if(ri>0&&inner.some(function(b){return b.x-12<c.lx&&c.lx<b.x+b.w+12;})){
          var ed=inner.map(function(b){return [b.x,b.x+b.w];}).sort(function(a,b){return a[0]-b[0];}), gaps=[], l=xmin;
          ed.forEach(function(e){ if(e[0]-l>40)gaps.push([l,e[0]]); l=Math.max(l,e[1]); }); if(xmax-l>40)gaps.push([l,xmax]);
          if(gaps.length){ var g0=gaps.sort(function(a,b){return Math.abs((a[0]+a[1])/2-c.ax)-Math.abs((b[0]+b[1])/2-c.ax);})[0];
            c.lx=Math.min(Math.max(c.ax,g0[0]+20),g0[1]-20); c.x=Math.min(Math.max(c.lx-c.w/2,xmin),xmax-c.w); } } });
      inner.push.apply(inner,row); edge=band==='top'?edge-rh-34:edge+rh+34; });
  });
  cs.forEach(function(c){
    var lx=Math.min(Math.max(c.moved?c.ax:(c.lx==null?c.ax:c.lx),c.x+24),c.x+c.w-24);
    if(!c.moved){ c.sx=lx; c.sy=c.band==='top'?c.y+c.h+12:c.y-12; }
    else if(c.ay>c.y+c.h){ c.sx=lx; c.sy=c.y+c.h+12; }
    else if(c.ay<c.y){ c.sx=lx; c.sy=c.y-12; }
    else if(c.ax<c.x){ c.sx=c.x-20; c.sy=c.y+lh/2; }
    else { c.sx=c.x+c.w+20; c.sy=c.y+lh/2; }
  });
}

/* ---------- 종이 그리기(화면·내보내기 공용) ---------- */
function arrowhead(x,y,fx,fy,s){ var d=Math.hypot(x-fx,y-fy)||1,ux=(x-fx)/d,uy=(y-fy)/d,bx=x-ux*s,by=y-uy*s,nx=-uy*s*0.42,ny=ux*s*0.42;
  return '<path d="M'+x.toFixed(1)+','+y.toFixed(1)+' L'+(bx+nx).toFixed(1)+','+(by+ny).toFixed(1)+' L'+(bx-nx).toFixed(1)+','+(by-ny).toFixed(1)+' Z" fill="#231f20"/>'; }
function foldArrow(p,s,dir){ var x=p[0],y=p[1],x0=dir>0?x-s:x+s,x1=dir>0?x+s:x-s,tip=[x1+dir*s*0.05,y+s*0.45],a=Math.atan2(tip[1]-y,tip[0]-x1),hs=Math.max(s*0.5,11);
  var l=[tip[0]-hs*Math.cos(a-0.5),tip[1]-hs*Math.sin(a-0.5)],rr=[tip[0]-hs*Math.cos(a+0.5),tip[1]-hs*Math.sin(a+0.5)];
  return '<path d="M'+x0+','+y+' Q'+x+','+(y-s*0.55)+' '+x1+','+y+' L'+tip[0]+','+tip[1]+'" fill="none" stroke="#e8402c" stroke-width="3.6" stroke-linecap="round"/><path d="M'+tip[0]+','+tip[1]+' L'+l[0]+','+l[1]+' L'+rr[0]+','+rr[1]+' Z" fill="#e8402c"/>'; }
function partSVG(r,p,ui,opt2){ var g=geo(r),x=g.x+p.pn[0]*g.w,y=g.y+p.pn[1]*g.h, def=p.k==='custom'?null:allParts().find(function(z){return z.k===p.k;}), on=ui&&st.selPart===p.id;
  var src=(opt2&&opt2[p.src])||p.src, inner=def?def.svg:'<image href="'+esc(src)+'" x="-40" y="-40" width="80" height="80" preserveAspectRatio="xMidYMid meet"/>', hw=(def?def.w:80)/2+8, hh=(def?def.h:80)/2+8;
  return '<g class="pt" data-pid="'+p.id+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+') scale('+p.s+')">'+(on?'<rect x="'+(-hw)+'" y="'+(-hh)+'" width="'+(hw*2)+'" height="'+(hh*2)+'" fill="none" stroke="#e0a800" stroke-width="3" stroke-dasharray="8 6"/>':'')+inner+'</g>'; }
function sheetSVG(r,opt){   /* opt.ui=화면(선택·옮기기 표시) / opt.noBase=내보내기용(밑그림은 캔버스에 따로 그림) */
  opt=opt||{}; layout(r);
  var s='', g=geo(r), base=(r.base&&(r.base.data||r.base.url))||r.png||'';
  if(!opt.noBase)s+='<rect width="'+PAGE_W+'" height="'+PAGE_H+'" fill="#ffffff"/>'+(base?'<image href="'+esc(base)+'" x="'+g.x+'" y="'+g.y+'" width="'+g.w+'" height="'+g.h+'"/>':'');
  if(r.doc){
    var d=r.doc, fs=d.fs, lh=Math.round(fs*1.3), ah=Math.round(fs*0.46);
    d.marks.forEach(function(m,i){
      if(m.type==='care'||m.type==='main'){ var q=m.r2; s+='<rect class="lb" data-mi="'+i+'" x="'+q[0]+'" y="'+q[1]+'" width="'+q[2]+'" height="'+q[3]+'" fill="'+(m.type==='care'?'#f7f3b8':'#f4b8c8')+'" stroke="#9a9a9a" stroke-width="1.5"/>'; }
      else if(m.type==='fold'&&m.p2)s+=foldArrow(m.p2,m.s2||20,m.dir||1);
      else if(m.type==='spot'&&m.p2)s+='<circle cx="'+m.p2[0]+'" cy="'+m.p2[1]+'" r="'+(m.s2||30)+'" fill="none" stroke="#231f20" stroke-width="2" stroke-dasharray="6 5"/>';
    });
    (d.notes||[]).forEach(function(n,i){ var x=60,y=50+i*130,nf=Math.max(60,fs*1.5),tw=measure(n.text,nf);
      s+='<rect x="'+x+'" y="'+y+'" width="'+(tw+50).toFixed(0)+'" height="'+(nf*1.5).toFixed(0)+'" fill="#fff" stroke="#f0a0a8" stroke-width="3"/><text x="'+(x+25)+'" y="'+(y+nf*1.1).toFixed(0)+'" font-size="'+nf+'" font-weight="700" fill="#231f20" font-family=\''+FONT_STACK+'\'>'+esc(n.text)+'</text>'; });
    d.callouts.forEach(function(c){ s+='<line x1="'+c.ax.toFixed(1)+'" y1="'+c.ay.toFixed(1)+'" x2="'+c.sx.toFixed(1)+'" y2="'+c.sy.toFixed(1)+'" stroke="#231f20" stroke-width="'+LEADER_W+'"/>'+arrowhead(c.sx,c.sy,c.ax,c.ay,ah); });
    if(opt.ui)d.callouts.forEach(function(c){ if(!st.moving&&st.sel!==c.id)return; s+='<circle class="ah" data-cid="'+c.id+'" cx="'+c.ax.toFixed(1)+'" cy="'+c.ay.toFixed(1)+'" r="13" fill="#fff1a1" stroke="#231f20" stroke-width="2.4"/>'; });
    d.callouts.forEach(function(c){ var on=opt.ui&&st.sel===c.id, w=written(c);
      if(!opt.ui&&!w)return;   /* 내보내기·작지: 안 쓴 예시 글은 빼고 */
      s+='<g class="co" data-cid="'+c.id+'">';
      if(opt.ui)s+='<rect x="'+(c.x-10)+'" y="'+(c.y-6)+'" width="'+(c.w+20)+'" height="'+(c.h+12)+'" fill="'+(on?'#fff1a1':'#ffffff')+'" fill-opacity="'+(on?1:0.01)+'" stroke="'+(on?'#231f20':(st.moving?'#c9c3b8':'none'))+'" stroke-width="2"'+(st.moving&&!on?' stroke-dasharray="8 6"':'')+'/>';
      s+=c.ls.map(function(t,k){ return '<text x="'+c.x+'" y="'+(c.y+(k+0.78)*lh).toFixed(1)+'" font-size="'+fs+'" font-family=\''+FONT_STACK+'\' fill="'+(w?'#231f20':'#a39d93')+'">'+esc(t)+'</text>'; }).join('')+'</g>'; });
  }
  (r.parts||[]).forEach(function(p){ s+=partSVG(r,p,opt.ui,opt.srcMap); });
  return s;
}
/* 화살표가 붙지 않은 예시 글의 지시선도 내보내기에서 빼기 */
function sheetSVGExport(r,srcMap){
  var keep=r.doc?r.doc.callouts:null;
  if(keep){ r.doc.callouts=keep.filter(written); }
  try{ return sheetSVG(r,{noBase:true,srcMap:srcMap}); } finally { if(keep)r.doc.callouts=keep; layout(r); }
}
function loadImg(src,cors){ return new Promise(function(res,rej){ var im=new Image(); if(cors&&!/^data:/.test(src))im.crossOrigin='anonymous'; im.onload=function(){res(im);}; im.onerror=function(){rej(new Error('그림을 못 불러왔어요'));}; im.src=src; }); }
function renderPNG(r){   /* A4 PNG(Blob) — 가로 3300×2334 / 세로 2334×3300 */
  pageOf(r); var cv=document.createElement('canvas'); cv.width=PAGE_W; cv.height=PAGE_H; var cx=cv.getContext('2d');
  cx.fillStyle='#fff'; cx.fillRect(0,0,PAGE_W,PAGE_H); layout(r);
  var g=geo(r), base=(r.base&&(r.base.data||r.base.url))||r.png;
  return (base?loadImg(base,true).then(function(im){ cx.drawImage(im,g.x,g.y,g.w,g.h); }):Promise.resolve())
    .then(function(){ return inlineSrcs(r); })
    .then(function(map){ pageOf(r); var svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+PAGE_W+'" height="'+PAGE_H+'" viewBox="0 0 '+PAGE_W+' '+PAGE_H+'">'+sheetSVGExport(r,map)+'</svg>';
      return loadImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)); })
    .then(function(ov){ cx.drawImage(ov,0,0,PAGE_W,PAGE_H); return new Promise(function(res){ cv.toBlob(function(b){res(b);},'image/png'); }); });
}
function inlineSrcs(r){ var map={}, urls=(r.parts||[]).map(function(p){return p.src;}).filter(function(u){return u&&!/^data:/.test(u);});
  return Promise.all(urls.map(function(u){ return fetch(u,{mode:'cors'}).then(function(x){return x.blob();}).then(blobToData).then(function(d){ map[u]=d; }).catch(function(){}); })).then(function(){ return map; }); }
/* 클라우드에 못 올릴 때 작지에 넣는 그림 — 가로 1800px JPEG 로 줄여서(앱 저장 공간 보호, 작지 사진 폴백과 같은 생각) */
function smallData(blob){ return blobToData(blob).then(function(u){ return loadImg(u); }).then(function(im){ var s=Math.min(1,1800/Math.max(im.naturalWidth,im.naturalHeight)), cv=document.createElement('canvas'); cv.width=Math.round(im.naturalWidth*s); cv.height=Math.round(im.naturalHeight*s); var cx=cv.getContext('2d'); cx.fillStyle='#fff'; cx.fillRect(0,0,cv.width,cv.height); cx.drawImage(im,0,0,cv.width,cv.height); return cv.toDataURL('image/jpeg',0.86); }); }
function blobToData(b){ return new Promise(function(res){ var fr=new FileReader(); fr.onload=function(){res(fr.result);}; fr.readAsDataURL(b); }); }
function refreshPreview(r){ if(!r||r.kind==='old')return Promise.resolve();
  return renderPNG(r).then(function(b){ return blobToData(b); }).then(function(u){ r.png=u; r._pngUp=false; return persist(r,true); }).catch(function(e){ console.warn('[도식화] 미리보기 그림 실패',e); }); }

/* ---------- 상태 ---------- */
function stat(r){
  if(r.kind==='old')return {cls:'old',t:'옛 도식화 · 그림만'};
  if(!r.doc)return {cls:'base',t:'밑그림만 · 설명 상자 전'};
  var n=r.doc.callouts.length,w=r.doc.callouts.filter(written).length;
  return w===n?{cls:'done',t:'글 다 씀 '+w+'/'+n}:{cls:'text',t:'글 쓰는 중 '+w+'/'+n};
}
function needStatus(r){
  var o={main:false,care:false,stitch:false,band:false,lining:false};
  if(r.doc){ r.doc.marks.forEach(function(m){ if(m.type==='main')o.main=true; if(m.type==='care')o.care=true; });
    r.doc.callouts.forEach(function(c){ if(c.kind==='stitch'||c.kind==='tuck')o.stitch=true; if(c.kind==='band')o.band=true; if(c.kind==='lining')o.lining=true; }); }
  (r.parts||[]).forEach(function(p){ var def=allParts().find(function(x){return x.k===p.k;}); if(def&&def.need)o[def.need]=true; });
  return o;
}

/* ---------- 화면 뼈대(한 번만) ---------- */
function shell(){
  var host=$('dosik2-root'); if(host)return host;
  var pane=$('pane-dosik'); if(!pane)return null;
  pane.innerHTML='<div id="dosik2-root" class="dk2" data-view="detail">'
   +'<div class="dk2-top"><h1>도식화</h1><div class="dk2-grow"></div>'
   +'<input id="dk2-q" class="dk2-search" placeholder="품번·이름 검색" autocomplete="off" aria-label="도식화 검색">'
   +'<button class="dk2-btn" id="dk2-import" type="button">도식화 파일 불러오기</button></div>'
   +'<div class="dk2-body">'
   + '<aside class="dk2-col dk2-list" id="dk2-list" aria-label="도식화 목록"><div class="dk2-col-h">도식화 <span class="dk2-n" id="dk2-list-n"></span><div class="dk2-grow"></div><button class="dk2-btn sm dk2-drawer-x" id="dk2-list-x" type="button">닫기</button></div>'
   +  '<div class="dk2-chips" id="dk2-chips"></div><div class="dk2-scroll" id="dk2-cards"></div></aside>'
   + '<main class="dk2-col dk2-stage" id="dk2-stage">'
   +  '<div class="dk2-stage-bar"><button class="dk2-btn sm dk2-back" id="dk2-back" type="button">목록</button>'
   +   '<div class="dk2-ttl"><b id="dk2-ttl"></b><span id="dk2-sub"></span></div><div class="dk2-grow"></div>'
   +   '<button class="dk2-btn sm" id="dk2-info" type="button">정보</button><button class="dk2-btn" id="dk2-export" type="button">내보내기</button>'
   +   '<button class="dk2-btn" id="dk2-send" type="button">작지로 보내기</button><button class="dk2-btn save" id="dk2-save" type="button">저장</button></div>'
   +  '<div class="dk2-tool" role="toolbar" aria-label="편집 도구">'
   +   '<button class="dk2-btn sm" id="dk2-add" type="button" aria-pressed="false">＋ 화살표</button><button class="dk2-btn sm" id="dk2-move" type="button" aria-pressed="false">상자 옮기기</button>'
   +   '<button class="dk2-btn sm dk2-phone" id="dk2-parts" type="button">부품</button><span class="dk2-sep" aria-hidden="true"></span>'
   +   '<span class="dk2-fs" role="group" aria-label="글씨 크기"><button class="dk2-btn sm" id="dk2-fs-down" type="button">글씨 −</button><b id="dk2-fs-val">13pt</b><button class="dk2-btn sm" id="dk2-fs-up" type="button">글씨 +</button></span>'
   +   '<div class="dk2-grow"></div><span class="dk2-sent" id="dk2-sent"></span><button class="dk2-btn sm" id="dk2-zoom" type="button" aria-pressed="false">크게 보기</button></div>'
   +  '<div class="dk2-paper" id="dk2-paper"><svg id="dk2-sheet" viewBox="0 0 '+PAGE_W+' '+PAGE_H+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="도식화 종이"></svg><div class="dk2-empty" id="dk2-empty" hidden></div></div>'
   +  '<div class="dk2-hint" id="dk2-hint"></div></main>'
   + '<aside class="dk2-col dk2-side" id="dk2-side" aria-label="글쓰기와 부품"><div class="dk2-scroll" id="dk2-side-in"></div></aside>'
   +'</div><div id="dk2-float"></div><div id="dk2-modal"></div>'
   +'<input type="file" id="dk2-file" accept=".json,image/*" multiple hidden><input type="file" id="dk2-file-part" accept="image/*" hidden></div>';
  wire();
  return $('dosik2-root');
}
function fitHeight(){ var root=$('dosik2-root'); if(!root)return; if(isPhone()){ root.style.height=''; return; }
  var top=root.getBoundingClientRect().top; root.style.height=Math.max(520,window.innerHeight-top-12)+'px'; }

/* ---------- 목록 ---------- */
function allRecs(){ return st.recs.filter(function(r){return !r.del;}).sort(function(a,b){return (b.updated||0)-(a.updated||0);}).concat(st.old); }
function thumbSrc(r){ return r.png||r.pngUrl||(r.base&&(r.base.data||r.base.url))||''; }
function renderList(){
  var recs=allRecs(), brands=['전체'];
  recs.forEach(function(r){ var b=recBrand(r); if(brands.indexOf(b)<0)brands.push(b); });
  if(brands.indexOf(st.brand)<0)st.brand='전체';
  $('dk2-chips').innerHTML=brands.map(function(b){ return '<button type="button" class="dk2-chip'+(st.brand===b?' on':'')+'" data-b="'+esc(b)+'">'+esc(b)+'</button>'; }).join('');
  var q=st.q.trim().toLowerCase();
  var list=recs.filter(function(r){ return (st.brand==='전체'||recBrand(r)===st.brand)&&(!q||((r.code||'')+' '+(r.name||'')).toLowerCase().indexOf(q)>=0); });
  $('dk2-list-n').textContent=list.length+'개';
  $('dk2-cards').innerHTML=list.length?list.map(function(r){ var s=stat(r), it=itemOf(r), src=thumbSrc(r);
    return '<div class="dk2-card'+(r.id===st.cur?' on':'')+'" data-id="'+esc(r.id)+'" role="button" tabindex="0">'
      +'<div class="dk2-thumb">'+(src?'<img alt="" loading="lazy" src="'+esc(src)+'">':'')+'</div>'
      +'<div class="dk2-ci"><div class="dk2-nm">'+esc(r.name||'이름 없음')+'</div><div class="dk2-cd">'+esc((it&&it.code)||r.code||'품번 없음')+' · '+esc(recBrand(r))+'</div>'
      +'<span class="dk2-st '+s.cls+'">'+esc(s.t)+'</span></div></div>'; }).join('')
    :'<div class="dk2-emptytxt">'+(recs.length?'조건에 맞는 도식화가 없어요.':'아직 도식화가 없어요.<br>클로드에게 받은 <b>도식화 파일</b>을 위의 「도식화 파일 불러오기」로 넣어 주세요.')+'</div>';
}

/* ---------- 종이·오른쪽 칸 ---------- */
function renderSheet(){
  var r=cur(), svg=$('dk2-sheet'), em=$('dk2-empty');
  if(!r){ svg.innerHTML=''; svg.style.display='none'; em.hidden=false; em.innerHTML='왼쪽 목록에서 도식화를 고르거나, 「도식화 파일 불러오기」로 새 도식화를 넣어 주세요.'; return; }
  svg.style.display=''; em.hidden=true;
  var pg=pageOf(r); svg.setAttribute('viewBox','0 0 '+pg.w+' '+pg.h); svg.classList.toggle('port',pg===PORT);
  svg.innerHTML=sheetSVG(r,{ui:true});
  svg.classList.toggle('moving',st.moving); svg.classList.toggle('adding',st.adding||!!st.placing); svg.classList.toggle('zoom',st.zoom);
}
function partsHTML(inFloat){
  var r=cur();
  var tile=function(p){ return '<button type="button" class="dk2-tile'+(st.placing===p.k?' on':'')+'" data-part="'+esc(p.k)+'"><svg viewBox="'+(-p.w/2-6)+' '+(-p.h/2-6)+' '+(p.w+12)+' '+(p.h+12)+'">'+p.svg+'</svg>'+esc(p.nm)+'</button>'; };
  var extra=(window.DK2_EXTRA_PARTS||[]).filter(function(p){return p&&p.k&&p.svg;});
  var bgroups=brandAssets(r).filter(function(g){return g.list.length;});
  var tiles=PARTS.map(tile).join('')
    +st.custom.map(function(c){ return '<button type="button" class="dk2-tile'+(st.placing===c.id?' on':'')+'" data-custom="'+c.id+'"><img alt="" src="'+esc(c.src)+'">'+esc(c.nm)+'</button>'; }).join('')
    +'<button type="button" class="dk2-tile add" data-addpart="1"><svg viewBox="-20 -16 40 32"><path d="M0 -10 V10 M-10 0 H10" stroke="currentColor" stroke-width="3"/></svg>내 부품</button>';
  var more=(extra.length?'<div class="dk2-grp">클로드가 그린 부품</div><div class="dk2-tiles">'+extra.map(tile).join('')+'</div>':'')
    +bgroups.map(function(g){ return '<div class="dk2-grp">'+esc(g.brand)+' · '+esc(g.nm)+'</div><div class="dk2-tiles">'+g.list.map(function(a){ return '<button type="button" class="dk2-tile img'+(st.placing===a.key?' on':'')+'" data-asset="'+esc(a.key)+'"><img alt="" loading="lazy" src="'+esc(a.img)+'">'+esc(a.nm)+'</button>'; }).join('')+'</div>'; }).join('')
    +(r&&r.kind!=='old'&&!bgroups.length?'<div class="dk2-note" style="margin-top:8px">'+(itemOf(r)?'이 브랜드에 등록된 라벨·자수 그림이 없어요. 「업체관리 → 브랜드」에 올리면 여기 떠요.':'아이템을 연결하면 그 브랜드의 라벨·자수 그림이 여기 떠요.')+'</div>':'');
  var sp=r&&(r.parts||[]).find(function(p){return p.id===st.selPart;});
  return (inFloat?'<div class="dk2-note" style="margin-bottom:8px">눌러서 고르고 → 종이를 누르면 찍혀요</div>':'<h3>부품 서랍 <span class="dk2-n">눌러서 고르고 → 종이를 누르면 찍혀요</span></h3>')
    +'<div class="dk2-tiles">'+tiles+'</div>'+more
    +(sp?'<div class="dk2-selpart"><b>고른 부품: '+esc(sp.nm)+'</b><div class="dk2-grow"></div><button type="button" class="dk2-btn sm" data-ps="-">작게</button><button type="button" class="dk2-btn sm" data-ps="+">크게</button><button type="button" class="dk2-btn sm" data-ps="del">빼기</button></div>':'');
}
function kindSel(c){ return '<select class="dk2-kind" data-kind="'+c.id+'" aria-label="설명 종류">'+Object.keys(KIND).map(function(k){return '<option value="'+k+'"'+(c.kind===k?' selected':'')+'>'+KIND[k]+'</option>';}).join('')+'</select>'; }
function countText(r){ var w=r.doc.callouts.filter(written).length; return w+'/'+r.doc.callouts.length+' 씀 · 상자를 누르거나 여기서 바로 쓰기'; }
function renderSide(){
  var r=cur(), host=$('dk2-side-in'); if(!r){ host.innerHTML=''; return; }
  var need=needStatus(r), h='';
  if(r.kind!=='old')h+='<div class="dk2-sec"><h3>필수 표시 확인</h3><div class="dk2-need">'+NEED.map(function(p){ return '<div class="'+(need[p[0]]?'y':'n')+'">'+p[1]+'<i>'+(need[p[0]]?'있음':'없음')+'</i></div>'; }).join('')+'</div></div>';
  if(r.doc){
    layout(r);
    var order=r.doc.callouts.slice().sort(function(a,b){ return ({top:0,bottom:1}[a.band]-{top:0,bottom:1}[b.band])||a.ax-b.ax; });
    h+='<div class="dk2-sec"><h3>설명 글 <span class="dk2-n" id="dk2-count">'+countText(r)+'</span></h3>'
      +order.map(function(c){ var isNew=c.text===NEW_TEXT;
        return '<div class="dk2-co'+(st.sel===c.id?' on':'')+'" data-cid="'+c.id+'"><div class="dk2-co-h">'+kindSel(c)+'<span class="dk2-side-l">'+esc(c.moved?'옮긴 상자':SIDE[c.band])+'</span><span class="dk2-grow"></span>'
          +'<span class="dk2-w '+(written(c)?'y':'e')+'">'+(written(c)?'씀':(isNew?'새 화살표':'예시 글'))+'</span></div>'
          +'<textarea id="dk2-ta-'+c.id+'" rows="'+Math.max(2,lines(c).length)+'" placeholder="'+esc(c.text.replace(/\s+\/\s+/g,'\n'))+'">'+esc(c.value||'')+'</textarea>'
          +'<div class="dk2-co-f">'+(written(c)?'<button type="button" class="dk2-btn sm ghost" data-clear="'+c.id+'">지우기</button>':(isNew?'':'<button type="button" class="dk2-btn sm ghost" data-fill="'+c.id+'">예시 그대로 쓰기</button>'))
          +'<button type="button" class="dk2-btn sm ghost" data-del="'+c.id+'">화살표 빼기</button></div></div>'; }).join('')
      +'<div class="dk2-note">줄을 바꾸면 도식화에서도 줄이 바뀌어요. 「부위) 내용」 형식으로 써 주세요. 안 쓴 회색 예시 글은 작지·내보내기에 안 나가요.</div></div>';
  } else if(r.kind==='old'){
    h+='<div class="dk2-sec"><h3>옛 도식화</h3><div class="dk2-note">예전 도식화 편집기로 그린 <b>그림만</b> 있어요. 이 그림 그대로 <b>작지로 보내기</b>는 돼요. 설명 상자를 붙이려면 클로드에게 「이 도식화에 설명 붙여줘」라고 해 주세요.</div></div>';
  } else {
    h+='<div class="dk2-sec"><h3>설명 상자 전</h3><div class="dk2-note">밑그림만 있어요. 클로드가 라벨 상자·화살표·설명 상자를 붙인 도식화 파일을 다시 불러오면 글을 쓸 수 있어요. 그 전에도 <b>＋ 화살표</b>로 직접 더할 수 있어요.</div></div>';
  }
  if(r.kind!=='old')h+='<div class="dk2-sec dk2-parts-sec">'+partsHTML()+'</div>';
  host.innerHTML=h;
  var fp=$('dk2-float-in'); if(fp)fp.innerHTML=partsHTML(true);
}
function brandAssets(r){
  var it=r&&itemOf(r); if(!it)return [];
  var b=(typeof tpBrandObj==='function')?tpBrandObj(it):((SS()&&SS().brands)||[]).find(function(x){return x.id===it.brandId;});
  if(!b)return [];
  var bn=b.name||'브랜드';
  return [['메인라벨',b.mainLabels,'main'],['케어라벨',b.careLabels,'care'],['자수',b.embroideries,'emb'],['아트웍',b.artworks,'art'],['단추로고',b.buttonLogos,'btn'],['완성부자재',b.finishMaterials,'fin']].map(function(g){
    return {brand:bn,nm:g[0],list:(Array.isArray(g[1])?g[1]:[]).map(function(a,i){ return a&&a.img?{key:'b:'+g[2]+':'+i,img:a.img,nm:(a.name||a.labelName||g[0]).slice(0,10),kind:g[2]}:null; }).filter(Boolean)};
  });
}
function assetByKey(r,key){ var f=null; brandAssets(r).forEach(function(g){ g.list.forEach(function(a){ if(a.key===key)f=a; }); }); return f; }
function placingName(){ var p=allParts().find(function(x){return x.k===st.placing;}); if(p)return p.nm; var c=st.custom.find(function(x){return x.id===st.placing;}); if(c)return c.nm; var a=assetByKey(cur(),st.placing); return a?a.nm:''; }
function renderTitle(){
  var r=cur();
  $('dk2-ttl').textContent=r?(r.name||'이름 없음'):'도식화';
  var it=r&&itemOf(r);
  $('dk2-sub').textContent=r?(((it&&it.code)||r.code||'품번 없음')+' · '+recBrand(r)+' · '+stat(r).t):'';
  var editable=!!(r&&r.kind!=='old');
  ['dk2-add','dk2-move','dk2-parts','dk2-fs-down','dk2-fs-up','dk2-info'].forEach(function(id){ $(id).disabled=!editable&&id!=='dk2-info'; });
  $('dk2-info').disabled=!r; $('dk2-send').disabled=!r; $('dk2-export').disabled=!r; $('dk2-save').disabled=!editable;
  $('dk2-fs-down').disabled=$('dk2-fs-up').disabled=!(r&&r.doc);
  [['dk2-move',st.moving],['dk2-add',st.adding],['dk2-zoom',st.zoom]].forEach(function(p){ $(p[0]).classList.toggle('on',p[1]); $(p[0]).setAttribute('aria-pressed',p[1]); });
  $('dk2-zoom').textContent=st.zoom?'한눈에 보기':'크게 보기';
  $('dk2-fs-val').textContent=r&&r.doc?Math.round(r.doc.fs/PX_PT)+'pt':'—';
  $('dk2-hint').innerHTML=!r?'':st.placing?'<b>'+esc(placingName())+'</b> — 종이에서 놓을 곳을 누르세요. 부품을 다시 누르면 취소.'
    :st.adding?'<b>＋ 화살표</b> — 옷에서 화살표가 가리킬 곳을 누르세요. 새 설명 상자가 생겨요. 다시 누르면 취소.'
    :st.moving?'<b>상자 옮기기</b> — 설명 상자, 노란 점(가리키는 곳), 라벨, 부품을 끌어서 옮겨요.'
    :r.doc?('설명 상자를 누르면 '+(isPhone()?'아래':'오른쪽')+'에서 글을 써요. 케어·메인라벨 상자는 언제든 끌어서 옮길 수 있어요.'):'';
}
function tpInfo(r){ r.tp=r.tp||{log:[]}; return r.tp; }
function renderSent(){
  var r=cur(), host=$('dk2-sent'); if(!host)return; if(!r||r.kind==='old'){ host.innerHTML=''; return; }
  var seen={}, last=tpInfo(r).log.slice().reverse().filter(function(x){ if(seen[x.to])return false; seen[x.to]=1; return true; }).reverse();
  host.innerHTML=last.length?last.map(function(x){ var old=(r.ver||0)>x.ver; return '<span class="'+(old?'old':'')+'" title="'+(old?'보낸 뒤 고쳤어요 — 다시 보내면 최신으로 바뀌어요':'보낸 그대로예요')+'">'+esc(x.lbl)+' '+esc(x.at)+(old?' · 다시 보내기':'')+'</span>'; }).join(''):'<span>작지 안 보냄</span>';
}
function renderAll(){ if(!$('dosik2-root'))return; renderList(); renderTitle(); renderSheet(); renderSide(); renderSent(); }

/* ---------- 좌표 ---------- */
function svgPt(e){ var svg=$('dk2-sheet'),pt=svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); }
function toN(r,p){ var g=geo(r); return [(p.x-g.x)/g.w,(p.y-g.y)/g.h]; }

/* ---------- 확인창(앱 안) ---------- */
function modal(html){ $('dk2-modal').innerHTML='<div class="dk2-modal-bg"><div class="dk2-modal" role="dialog">'+html+'</div></div>';
  Array.prototype.forEach.call($('dk2-modal').querySelectorAll('[data-x]'),function(b){ b.addEventListener('click',closeModal); }); }
function closeModal(){ $('dk2-modal').innerHTML=''; }
function mhead(t){ return '<div class="dk2-mh"><span>'+t+'</span><span class="dk2-grow"></span><button type="button" class="dk2-x" data-x aria-label="닫기">×</button></div>'; }
function itemOptions(){ return Object.values((SS()&&SS().items)||{}).sort(function(a,b){return String(a.code||'').localeCompare(String(b.code||''));})
  .map(function(it){ return '<option value="'+esc((it.code?it.code+' · ':'')+(it.name||''))+'">'; }).join(''); }
function findItem(txt){ txt=String(txt||'').trim(); if(!txt)return null; var all=Object.values((SS()&&SS().items)||{});
  return all.find(function(it){ return ((it.code?it.code+' · ':'')+(it.name||''))===txt; })||all.find(function(it){ return it.code&&it.code===txt; })||all.find(function(it){ return it.name===txt; })||null; }
function itemLabel(it){ return it?((it.code?it.code+' · ':'')+(it.name||'')):''; }

/* ---------- 불러오기 ---------- */
function openImport(){
  modal(mhead('도식화 파일 불러오기')+'<div class="dk2-mb"><div class="dk2-note">클로드에게 <b>「OO 도식화 만들어줘」</b>라고 하면 받는 두 파일(<b>도식화.json</b> + <b>밑그림.png</b>)을 같이 고르세요. 그림만 고르면 「밑그림만」으로 들어와요.</div>'
    +'<label class="dk2-lbl">연결할 아이템 <span class="dk2-n">(비워 두면 파일 이름으로 찾아요)</span></label><input id="dk2-imp-item" class="dk2-search wide" list="dk2-items" placeholder="품번 · 이름 검색" autocomplete="off"><datalist id="dk2-items">'+itemOptions()+'</datalist></div>'
    +'<div class="dk2-ma"><button type="button" class="dk2-btn" data-x>취소</button><button type="button" class="dk2-btn save" id="dk2-imp-pick">파일 고르기</button></div>');
  $('dk2-imp-pick').addEventListener('click',function(){ st._impItem=$('dk2-imp-item').value; $('dk2-file').click(); });
}
function readURL(f){ return new Promise(function(res){ var fr=new FileReader(); fr.onload=function(){res(fr.result);}; fr.readAsDataURL(f); }); }
function readTXT(f){ return new Promise(function(res){ var fr=new FileReader(); fr.onload=function(){res(fr.result);}; fr.readAsText(f); }); }
function shrinkImage(dataUrl,maxW){ return loadImg(dataUrl).then(function(im){ var w=im.naturalWidth,h=im.naturalHeight; if(w<=maxW)return {data:dataUrl,w:w,h:h};
  var s=maxW/w,cv=document.createElement('canvas'); cv.width=Math.round(w*s); cv.height=Math.round(h*s); cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);
  return {data:cv.toDataURL('image/png'),w:cv.width,h:cv.height}; }); }
function onImportFiles(e){
  var fs=Array.prototype.slice.call(e.target.files); e.target.value=''; closeModal();
  var jf=fs.find(function(f){return /\.json$/i.test(f.name);}), imf=fs.find(function(f){return /^image\//.test(f.type);});
  if(!imf){ toast('그림 파일(밑그림.png)이 필요해요'); return; }
  var doc=null;
  (jf?readTXT(jf).then(function(t){ doc=JSON.parse(t); }):Promise.resolve()).then(function(){ return readURL(imf); }).then(function(u){ return shrinkImage(u,2600); })
  .then(function(img){
    var it=findItem(st._impItem)||(doc&&(findItem(doc.code)||findItem(doc.name)))||null;
    var r=normalizeRec({id:newId(),itemId:it?it.id:'',name:(doc&&doc.name)||(it&&it.name)||imf.name.replace(/\.[^.]+$/,''),code:(it&&it.code)||(doc&&doc.code)||'',
      base:{data:img.data,w:img.w,h:img.h,url:''},orient:(doc&&doc.page&&doc.page[1]>doc.page[0])?'port':'land',doc:doc?{baseRect:doc.baseRect,page:doc.page,callouts:doc.callouts,marks:doc.marks,notes:doc.notes,fs:doc.fs}:null,ver:0});
    st.recs.push(r); st.cur=r.id; st.view='detail'; renderAll();
    toast('「'+r.name+'」 불러왔어요'+(it?' · '+itemLabel(it)+'에 연결':' — 아이템 연결은 「정보」에서'),3200);
    return refreshPreview(r);
  }).catch(function(err){ console.warn(err); toast('파일을 읽지 못했어요 — 클로드가 만든 도식화.json·밑그림인지 확인해 주세요',3500); });
}

/* ---------- 정보(이름·아이템 연결·지우기) ---------- */
function openInfo(){
  var r=cur(); if(!r)return;
  if(r.kind==='old'){ modal(mhead('옛 도식화')+'<div class="dk2-mb"><div class="dk2-note">예전 도식화 편집기로 그린 그림이에요. 이름·지우기는 예전 화면에서 해 주세요(새 탭에서는 그림 보기·작지로 보내기·내보내기만 돼요).</div></div><div class="dk2-ma"><button type="button" class="dk2-btn" data-x>닫기</button></div>'); return; }
  var it=itemOf(r);
  modal(mhead('도식화 정보')+'<div class="dk2-mb"><label class="dk2-lbl">이름</label><input id="dk2-inf-name" class="dk2-search wide" value="'+esc(r.name||'')+'">'
    +'<label class="dk2-lbl">연결된 아이템 <span class="dk2-n">(작지로 보내려면 꼭 필요)</span></label><input id="dk2-inf-item" class="dk2-search wide" list="dk2-items2" value="'+esc(itemLabel(it))+'" placeholder="품번 · 이름 검색" autocomplete="off"><datalist id="dk2-items2">'+itemOptions()+'</datalist>'
    +'<div class="dk2-danger"><button type="button" class="dk2-btn sm ghost" id="dk2-inf-del">이 도식화 지우기</button></div></div>'
    +'<div class="dk2-ma"><button type="button" class="dk2-btn" data-x>취소</button><button type="button" class="dk2-btn save" id="dk2-inf-ok">저장</button></div>');
  $('dk2-inf-ok').addEventListener('click',function(){ var nm=$('dk2-inf-name').value.trim(), t=$('dk2-inf-item').value.trim(), it2=findItem(t);
    if(t&&!it2){ toast('그 아이템을 찾지 못했어요 — 목록에서 골라 주세요'); return; }
    r.name=nm||r.name; r.itemId=it2?it2.id:''; r.code=it2?(it2.code||''):r.code; closeModal(); persist(r); renderAll(); toast('정보를 저장했어요'); });
  $('dk2-inf-del').addEventListener('click',function(){
    modal(mhead('도식화 지우기')+'<div class="dk2-mb"><div class="dk2-note"><b>'+esc(r.name)+'</b>을(를) 지울까요? 이미 작지로 보낸 그림은 작지에 그대로 남아요.</div></div><div class="dk2-ma"><button type="button" class="dk2-btn" data-x>취소</button><button type="button" class="dk2-btn" id="dk2-del-ok">지우기</button></div>');
    $('dk2-del-ok').addEventListener('click',function(){ r.del=Date.now(); persist(r,true); st.cur=(allRecs()[0]||{}).id||null; closeModal(); renderAll();
      toast('지웠어요 — 30초 안에 「정보」 옆 되살리기',4000); st._undoDel=r; clearTimeout(st._undoT); st._undoT=setTimeout(function(){ st._undoDel=null; renderTitle(); },30000); renderUndo(); });
  });
}
function renderUndo(){ var b=$('dk2-undo'); if(st._undoDel){ if(!b){ b=document.createElement('button'); b.id='dk2-undo'; b.className='dk2-btn sm'; b.type='button'; b.textContent='되살리기'; $('dk2-info').after(b);
    b.addEventListener('click',function(){ var r=st._undoDel; if(!r)return; r.del=0; persist(r,true); st.cur=r.id; st._undoDel=null; b.remove(); renderAll(); toast('되살렸어요'); }); } } else if(b) b.remove(); }

/* ---------- 작지로 보내기 ---------- */
function spatRounds(it){ var d=it&&it.techpack; return (d&&Array.isArray(d.spatRounds))?d.spatRounds.slice():[]; }
function spatKeyOf(n){ return (typeof tpSpatKeyOf==='function')?tpSpatKeyOf(n):(n===1?'spat':'spat'+n); }
function ensureRound(it,n){
  if(!it.techpack)it.techpack={};
  var d=it.techpack;
  if(!Array.isArray(d.spatRounds)||!d.spatRounds.length){ d.spatRounds=['spat']; if(!d.spat)d.spat={}; if(!d.images)d.images={}; }
  if(n>d.spatRounds.length&&typeof _rndSyncToTechpack==='function')_rndSyncToTechpack(it.id,n);
  if(typeof _rndSyncToComment==='function')_rndSyncToComment(it.id,n);
  return d.spatRounds[n-1]||null;
}
function lastSent(r,to){ var l=tpInfo(r).log.filter(function(x){return x.to===to;}); return l[l.length-1]; }
function openSend(){
  var r=cur(); if(!r)return; var it=itemOf(r);
  if(!it){ modal(mhead('작지로 보내기')+'<div class="dk2-mb"><div class="dk2-note">이 도식화가 <b>어느 아이템</b>인지 먼저 연결해 주세요. 작지는 아이템마다 있어요.</div></div><div class="dk2-ma"><button type="button" class="dk2-btn" data-x>닫기</button><button type="button" class="dk2-btn save" id="dk2-go-info">아이템 연결하기</button></div>');
    $('dk2-go-info').addEventListener('click',openInfo); return; }
  var rounds=spatRounds(it), phase=(typeof deriveItemBadge==='function')?deriveItemBadge(it).phase:'sample';
  var rec=phase==='sample'?(rounds.length?rounds[rounds.length-1]:'new'):'sewSketch';
  var row=function(to,title,sub){ var ls=r.kind==='old'?null:lastSent(r,to), chg=ls&&(r.ver||0)>ls.ver;
    return '<label class="dk2-radio'+(to===rec?' on':'')+'"><input type="checkbox" value="'+to+'"'+(to===rec?' checked':'')+'><div><b>'+title+'</b><span>'+sub+'</span></div>'
      +'<span class="dk2-meta'+(ls?(chg?'':' sent'):(to===rec?' rec':''))+'">'+(ls?(chg?esc(ls.at)+' 보냄 · 그 뒤 고침':esc(ls.at)+' 보냄'):(to===rec?'추천':''))+'</span></label>'; };
  var next=rounds.length+1, max=(typeof TP_SPAT_MAX!=='undefined')?TP_SPAT_MAX:5;
  modal(mhead('작지로 보내기')+'<div class="dk2-mb"><div class="dk2-note"><b>'+esc(itemLabel(it))+'</b> — 지금 모습 그대로 <b>복사본</b>으로 들어가요. 여기서 나중에 고쳐도 <b>이미 보낸 작지는 안 바뀌어요</b>. 여러 곳을 한 번에 고를 수 있어요. 안 쓴 회색 예시 글은 빠져요.</div>'
    +'<div class="dk2-grp">샘플 작지 (샘플·패턴 지시서)</div>'
    +rounds.map(function(k,i){ return row(k,'샘플 '+(i+1)+'차','작지 「샘플·패턴」 '+(i+1)+'차의 도식화 칸'); }).join('')
    +(next<=max?'<label class="dk2-radio'+(rec==='new'?' on':'')+'"><input type="checkbox" value="new"'+(rec==='new'?' checked':'')+'><div><b>＋ 샘플 '+next+'차 새로 만들어서 넣기</b><span>작지 '+next+'차와 샘플 코멘트 '+next+'차가 같이 생겨요</span></div>'+(rec==='new'?'<span class="dk2-meta rec">추천</span>':'')+'</label>':'')
    +'<div class="dk2-grp">메인 작지</div>'
    +row('sewSketch','지시서 도식화','작지 「지시서」 큰 도식화 칸 (완성·검품 탭에도 같이 나와요)')
    +row('cutSketch','재단 썸네일','작지 위 막대·재단에 나오는 작은 그림')
    +row('innSketch','안사양 도식화','작지 「안사양」 도식화 칸')
    +'</div><div class="dk2-ma"><button type="button" class="dk2-btn" data-x>취소</button><button type="button" class="dk2-btn save" id="dk2-send-ok">보내기</button></div>');
  var upd=function(){ var n=$('dk2-modal').querySelectorAll('input:checked').length; $('dk2-send-ok').textContent=n?n+'곳에 보내기':'보내기'; $('dk2-send-ok').disabled=!n; };
  Array.prototype.forEach.call($('dk2-modal').querySelectorAll('.dk2-radio'),function(lb){ var cb=lb.querySelector('input'); lb.addEventListener('click',function(e){ if(e.target!==cb){ e.preventDefault(); cb.checked=!cb.checked; } lb.classList.toggle('on',cb.checked); upd(); }); });
  upd();
  $('dk2-send-ok').addEventListener('click',function(){ var tos=Array.prototype.map.call($('dk2-modal').querySelectorAll('input:checked'),function(x){return x.value;}); closeModal(); dk2SendToTp(r,it,tos); });
}
function dk2SendToTp(r,it,tos){
  toast('작지에 넣는 중이에요…',6000);
  var blobP=r.kind==='old'?fetch(r.png).then(function(x){return x.blob();}):renderPNG(r);
  blobP.then(function(blob){
    var names=[], chain=Promise.resolve();
    tos.forEach(function(to){
      chain=chain.then(function(){
        var slot,lbl;
        if(to==='new'){ var n=spatRounds(it).length+1, k=ensureRound(it,n); if(!k)throw new Error('회차를 만들지 못했어요'); slot=k+'Sketch'; lbl='샘플 '+n+'차'; to=k; }
        else if(/^spat/.test(to)){ var idx=spatRounds(it).indexOf(to); slot=to+'Sketch'; lbl='샘플 '+(idx+1)+'차'; }
        else { slot=to; lbl=SLOT_LBL[to]||to; }
        var up=(window.fbStorage&&window.fbUser&&typeof tpUpload==='function')?tpUpload(blob,it.id,slot,true).catch(function(){ return smallData(blob); }):smallData(blob);
        return up.then(function(url){
          if(!it.techpack)it.techpack={}; if(!it.techpack.images)it.techpack.images={};
          it.techpack.images[slot]=url;
          if(r.kind!=='old')tpInfo(r).log.push({to:to,lbl:lbl,at:today(),ver:r.ver||0});
          names.push(lbl);
        });
      });
    });
    return chain.then(function(){
      try{ if(typeof saveData==='function')saveData(); }catch(e){}
      if(r.kind!=='old')persist(r);
      renderSent(); toast(names.join(' · ')+'에 넣었어요',3200);
      if(!(window.fbStorage&&window.fbUser))toast('로그인이 안 돼 있어 그림을 이 기기에만 넣었어요 — 로그인 후 다시 보내 주세요',4200);
    });
  }).catch(function(e){ console.warn('[도식화] 작지로 보내기 실패',e); toast('작지로 보내지 못했어요 — '+((e&&e.message)||'잠시 후 다시 해 주세요'),4000); });
}

/* ---------- 내보내기(PNG · PDF) ---------- */
function loadJsPDF(){ if(window.jspdf&&window.jspdf.jsPDF)return Promise.resolve(window.jspdf.jsPDF);
  return new Promise(function(res,rej){ var s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'; s.onload=function(){ res(window.jspdf.jsPDF); }; s.onerror=function(){ rej(new Error('PDF 도구를 못 불러왔어요')); }; document.head.appendChild(s); }); }
function fileBase(r){ var it=itemOf(r); return String(((it&&it.code)||r.code||'')+'_'+(r.name||'도식화')).replace(/^_/,'').replace(/[\\/:*?"<>|]/g,'')+'_도식화'; }
function openExport(){
  var r=cur(); if(!r)return;
  modal(mhead('내보내기')+'<div class="dk2-mb">'
    +'<label class="dk2-radio on"><input type="radio" name="dk2ex" value="png" checked><div><b>PNG 그림</b><span>카톡·메신저로 공장에 보낼 때</span></div></label>'
    +'<label class="dk2-radio"><input type="radio" name="dk2ex" value="pdf"><div><b>PDF (A4 '+(pageOf(r)===PORT?'세로':'가로')+')</b><span>인쇄해서 붙일 때</span></div></label>'
    +'<div class="dk2-note">「FPF 파일 저장 폴더」로 저장돼요. 안 쓴 회색 예시 글은 빠져요.</div></div>'
    +'<div class="dk2-ma"><button type="button" class="dk2-btn" data-x>취소</button><button type="button" class="dk2-btn save" id="dk2-ex-ok">저장</button></div>');
  Array.prototype.forEach.call($('dk2-modal').querySelectorAll('.dk2-radio'),function(lb){ lb.addEventListener('click',function(){ Array.prototype.forEach.call($('dk2-modal').querySelectorAll('.dk2-radio'),function(x){x.classList.toggle('on',x===lb);}); lb.querySelector('input').checked=true; }); });
  $('dk2-ex-ok').addEventListener('click',function(){ var v=$('dk2-modal').querySelector('input:checked').value; closeModal();
    var blobP=r.kind==='old'?fetch(r.png).then(function(x){return x.blob();}):renderPNG(r);
    blobP.then(function(blob){
      if(v==='png')return fpfSaveFile(blob,fileBase(r)+'.png',{mime:'image/png',label:'PNG 저장됨'});
      return Promise.all([loadJsPDF(),blobToData(blob)]).then(function(a){ var port=pageOf(r)===PORT, pdf=new a[0]({orientation:port?'portrait':'landscape',unit:'mm',format:'a4'}); pdf.addImage(a[1],'PNG',0,0,port?210:297,port?297:210); return fpfSaveFile(pdf.output('blob'),fileBase(r)+'.pdf',{mime:'application/pdf',label:'PDF 저장됨'}); });
    }).catch(function(e){ console.warn(e); toast('내보내지 못했어요 — '+((e&&e.message)||''),3500); }); });
}

/* ---------- 이벤트(한 번만 연결) ---------- */
var drag=null;
function wire(){
  $('dk2-q').addEventListener('input',function(e){ st.q=e.target.value; renderList(); });
  $('dk2-chips').addEventListener('click',function(e){ var b=e.target.closest('[data-b]'); if(!b)return; st.brand=b.getAttribute('data-b'); renderList(); });
  var open=function(id){ Object.assign(st,{cur:id,sel:null,selPart:null,placing:null,adding:false,moving:false,view:'detail',listOpen:false}); applyView(); renderAll(); };
  $('dk2-cards').addEventListener('click',function(e){ var c=e.target.closest('.dk2-card'); if(c)open(c.getAttribute('data-id')); });
  $('dk2-cards').addEventListener('keydown',function(e){ if(e.key==='Enter'){ var c=e.target.closest('.dk2-card'); if(c)open(c.getAttribute('data-id')); } });
  $('dk2-back').addEventListener('click',function(){ if(isPhone())st.view='list'; else st.listOpen=true; applyView(); renderList(); });
  $('dk2-list-x').addEventListener('click',function(){ st.listOpen=false; if(isPhone())st.view='detail'; applyView(); });
  $('dk2-import').addEventListener('click',openImport);
  $('dk2-file').addEventListener('change',onImportFiles);
  $('dk2-file-part').addEventListener('change',function(e){ var f=e.target.files[0]; e.target.value=''; if(!f)return;
    readURL(f).then(function(u){ return shrinkImage(u,400); }).then(function(img){ var id='c'+Date.now(); st.custom.push({id:id,nm:f.name.replace(/\.[^.]+$/,'').slice(0,6)||'내 부품',src:img.data}); saveMyParts(); st.placing=id; renderSide(); renderTitle(); renderSheet(); toast('내 부품을 추가했어요 — 종이를 누르면 찍혀요'); }); });
  var mode=function(k){ var v=!st[k]; st.moving=false; st.adding=false; st.placing=null; st[k]=v; renderTitle(); renderSheet(); renderSide(); };
  $('dk2-move').addEventListener('click',function(){ mode('moving'); });
  $('dk2-add').addEventListener('click',function(){ mode('adding'); if(st.adding&&isPhone())toast('옷에서 화살표가 가리킬 곳을 누르세요'); });
  $('dk2-zoom').addEventListener('click',function(){ st.zoom=!st.zoom; renderTitle(); renderSheet(); });
  var setFs=function(dl){ var r=cur(); if(!r||!r.doc)return; r.doc.fs=Math.max(32,Math.min(88,r.doc.fs+dl)); touch(r); renderTitle(); renderSheet(); };
  $('dk2-fs-down').addEventListener('click',function(){ setFs(-4); }); $('dk2-fs-up').addEventListener('click',function(){ setFs(4); });
  $('dk2-info').addEventListener('click',openInfo); $('dk2-send').addEventListener('click',openSend); $('dk2-export').addEventListener('click',openExport);
  $('dk2-save').addEventListener('click',function(){ var r=cur(); if(!r||r.kind==='old')return; refreshPreview(r).then(function(){ renderList(); toast(cloudOk()?'저장했어요':'이 기기에 저장했어요 — 로그인하면 다른 기기와 맞춰져요'); }); });
  $('dk2-parts').addEventListener('click',function(){
    $('dk2-float').innerHTML='<div class="dk2-floatbox" role="dialog" aria-label="부품 서랍"><div class="dk2-mh"><span>부품 서랍</span><span class="dk2-grow"></span><button type="button" class="dk2-x" id="dk2-float-x" aria-label="닫기">×</button></div><div class="dk2-scroll" style="padding:12px" id="dk2-float-in">'+partsHTML(true)+'</div></div>';
    $('dk2-float-x').addEventListener('click',function(){ $('dk2-float').innerHTML=''; }); });
  /* 오른쪽 칸: 글쓰기 */
  var side=$('dk2-side-in');
  side.addEventListener('focusin',function(e){ var t=e.target.closest('textarea'); if(!t)return; var id=t.id.replace('dk2-ta-',''); if(st.sel!==id){ st.sel=id; renderSheet(); Array.prototype.forEach.call(document.querySelectorAll('.dk2-co'),function(x){ x.classList.toggle('on',x.getAttribute('data-cid')===id); }); } });
  side.addEventListener('input',function(e){ var t=e.target.closest('textarea'); if(!t)return; var r=cur(), c=r.doc.callouts.find(function(x){return x.id===t.id.replace('dk2-ta-','');}); c.value=t.value; touch(r);
    t.rows=Math.max(2,lines(c).length); renderSheet(); renderList(); renderTitle();
    var box=t.closest('.dk2-co'), w=written(c), ws=box.querySelector('.dk2-w'); ws.className='dk2-w '+(w?'y':'e'); ws.textContent=w?'씀':(c.text===NEW_TEXT?'새 화살표':'예시 글');
    var cc=$('dk2-count'); if(cc)cc.textContent=countText(r); });
  side.addEventListener('change',function(e){ var k=e.target.closest('[data-kind]'); if(!k)return; var r=cur(), c=r.doc.callouts.find(function(x){return x.id===k.getAttribute('data-kind');}); c.kind=k.value; touch(r); renderSide(); });
  side.addEventListener('focusout',function(e){ if(e.target.closest('textarea'))setTimeout(function(){ var a=document.activeElement; if(!a||!a.closest('#dk2-side-in'))renderSide(); },150); });
  var sideClick=function(e){
    var r=cur(); if(!r)return;
    var f=e.target.closest('[data-fill]'), cl=e.target.closest('[data-clear]'), dl=e.target.closest('[data-del]'), pt=e.target.closest('[data-part]'), cu=e.target.closest('[data-custom]')||e.target.closest('[data-asset]'), ps=e.target.closest('[data-ps]');
    if(f){ var c=r.doc.callouts.find(function(x){return x.id===f.getAttribute('data-fill');}); c.value=c.text.replace(/\s+\/\s+/g,'\n'); st.sel=c.id; touch(r); renderAll(); return; }
    if(cl){ var c2=r.doc.callouts.find(function(x){return x.id===cl.getAttribute('data-clear');}); c2.value=''; touch(r); renderAll(); return; }
    if(dl){ var i=r.doc.callouts.findIndex(function(x){return x.id===dl.getAttribute('data-del');}); if(i<0)return; r.doc.callouts.splice(i,1); st.sel=null; touch(r); renderAll(); toast('화살표를 뺐어요'); return; }
    if(pt||cu){ var key=pt?pt.getAttribute('data-part'):(cu.getAttribute('data-custom')||cu.getAttribute('data-asset')); st.moving=false; st.adding=false; st.placing=st.placing===key?null:key; renderTitle(); renderSheet(); renderSide();
      if(isPhone()&&st.placing){ $('dk2-float').innerHTML=''; toast(placingName()+' — 종이에서 놓을 곳을 누르세요'); } return; }
    if(e.target.closest('[data-addpart]')){ $('dk2-file-part').click(); return; }
    if(ps){ var p=(r.parts||[]).find(function(x){return x.id===st.selPart;}); if(!p)return;
      if(ps.getAttribute('data-ps')==='del'){ r.parts=r.parts.filter(function(x){return x!==p;}); st.selPart=null; }
      else p.s=Math.max(0.4,Math.min(4,+(p.s*(ps.getAttribute('data-ps')==='+'?1.2:1/1.2)).toFixed(2)));
      touch(r); renderSheet(); renderSide(); }
  };
  side.addEventListener('click',sideClick); $('dk2-float').addEventListener('click',sideClick);
  /* 종이: 부품 찍기 · 화살표 더하기 · 끌어 옮기기 */
  var sheet=$('dk2-sheet');
  sheet.addEventListener('pointerdown',function(e){
    var r=cur(); if(!r||r.kind==='old')return; var p=svgPt(e);
    if(st.placing){ var def=allParts().find(function(x){return x.k===st.placing;}), cu=st.custom.find(function(x){return x.id===st.placing;})||assetByKey(r,st.placing), id='p'+Date.now();
      if(!def&&!cu){ st.placing=null; renderAll(); return; }
      r.parts=r.parts||[]; r.parts.push({id:id,k:def?def.k:'custom',nm:def?def.nm:cu.nm,src:cu?(cu.src||cu.img):null,pn:toN(r,p),s:def?1.4:2.2});
      st.selPart=id; st.placing=null; touch(r); renderAll(); toast((def?def.nm:cu.nm)+' 찍었어요'); return; }
    if(st.adding){ if(!r.doc)r.doc={asp:r.base.h/r.base.w,fs:52,callouts:[],marks:[],notes:[]};
      var nid='n'+Date.now(); r.doc.callouts.push({id:nid,kind:'etc',text:NEW_TEXT,value:'',an:toN(r,p)});
      st.adding=false; st.sel=nid; touch(r); renderAll(); selectCallout(nid,!isPhone()); toast('화살표를 더했어요 — 글을 써 주세요'); return; }
    var t=e.target, ahEl=t.closest('.ah'), lbEl=t.closest('.lb'), ptEl=t.closest('.pt'), coEl=t.closest('.co');
    if(ahEl){ drag={type:'anchor',obj:r.doc.callouts.find(function(x){return x.id===ahEl.getAttribute('data-cid');})}; e.preventDefault(); return; }
    if(lbEl){ var m=r.doc.marks[+lbEl.getAttribute('data-mi')], q=m.r2, pad=40;
      var linked=r.doc.callouts.filter(function(c){ return c.ax>=q[0]-pad&&c.ax<=q[0]+q[2]+pad&&c.ay>=q[1]-pad&&c.ay<=q[1]+q[3]+pad; });
      var inner=r.doc.marks.filter(function(o){ return o!==m&&o.r2&&o.r2[0]>=q[0]&&o.r2[1]>=q[1]&&o.r2[0]+o.r2[2]<=q[0]+q[2]&&o.r2[1]+o.r2[3]<=q[1]+q[3]; });
      drag={type:'label',obj:m,linked:linked,inner:inner,last:toN(r,p)}; e.preventDefault(); return; }
    if(ptEl){ st.selPart=ptEl.getAttribute('data-pid'); st.sel=null; var part=r.parts.find(function(x){return x.id===st.selPart;}), n=toN(r,p);
      drag={type:'part',obj:part,off:[n[0]-part.pn[0],n[1]-part.pn[1]]}; renderSheet(); renderSide(); e.preventDefault(); return; }
    if(coEl){ var c=r.doc.callouts.find(function(x){return x.id===coEl.getAttribute('data-cid');});
      if(st.moving){ drag={type:'co',obj:c,ox:p.x-c.x,oy:p.y-c.y}; e.preventDefault(); } else selectCallout(c.id,!isPhone()); return; }
    if(st.sel||st.selPart){ st.sel=null; st.selPart=null; renderSheet(); renderSide(); }
  });
  window.addEventListener('pointermove',function(e){ if(!drag)return; var r=cur(); if(!r)return; var p=svgPt(e), n=toN(r,p); drag.moved=true;
    if(drag.type==='part')drag.obj.pn=[n[0]-drag.off[0],n[1]-drag.off[1]];
    else if(drag.type==='anchor')drag.obj.an=n;
    else if(drag.type==='label'){ var du=n[0]-drag.last[0],dv=n[1]-drag.last[1]; drag.last=n; [drag.obj].concat(drag.inner).forEach(function(m){ m.rn[0]+=du; m.rn[1]+=dv; }); drag.linked.forEach(function(c){ c.an[0]+=du; c.an[1]+=dv; }); }
    else { var o=drag.obj; o.x=Math.max(10,Math.min(PAGE_W-o.w-10,p.x-drag.ox)); o.y=Math.max(10,Math.min(PAGE_H-o.h-10,p.y-drag.oy)); o.moved=true; }
    renderSheet(); });
  window.addEventListener('pointerup',function(){ if(drag&&drag.moved){ touch(); if(drag.type==='label')toast('라벨 위치를 옮겼어요 — 가리키던 화살표도 같이 따라가요'); renderSide(); } drag=null; });
  window.addEventListener('resize',function(){ if(!$('dosik2-root')||$('pane-dosik').style.display==='none')return; if(!isPhone())st.view='detail'; applyView(); fitHeight(); renderTitle(); });
}
function saveMyParts(){ idbPut({id:'__myparts',del:1,list:st.custom}).catch(function(){}); }
function selectCallout(id,focus){
  st.sel=id; st.selPart=null; renderSheet(); renderSide();
  var card=document.querySelector('.dk2-co[data-cid="'+id+'"]');
  if(card){ card.scrollIntoView({block:isPhone()?'center':'nearest',behavior:'smooth'}); if(focus){ var ta=$('dk2-ta-'+id); if(ta)ta.focus({preventScroll:true}); } }
}
function applyView(){ var root=$('dosik2-root'); if(!root)return; root.setAttribute('data-view',isPhone()?st.view:'detail'); root.classList.toggle('list-open',st.listOpen); }

/* ---------- 바깥에서 부르는 것 ---------- */
function loadAll(){
  var oldP=(typeof _dosikLibAsync==='function')?_dosikLibAsync().catch(function(){return [];}):Promise.resolve([]);
  return Promise.all([idbAll().catch(function(e){ console.warn('[도식화] 기기 저장소 읽기 실패',e); return []; }),oldP]).then(function(a){
    var mp=a[0].find(function(o){return o.id==='__myparts';}); if(mp&&Array.isArray(mp.list))st.custom=mp.list;
    st.recs=a[0].filter(function(o){return o.id!=='__myparts';}).map(function(o){ var r=normalizeRec(o); return r; });
    st.old=(a[1]||[]).filter(function(p){return p&&p.png;}).map(function(p){ return {id:'old:'+p.id,kind:'old',name:p.name||'옛 도식화',code:p.code||'',png:p.png,base:{},updated:p.updated||0}; });
    st.loaded=true;
    if(!st.cur||!cur()){ var first=allRecs()[0]; st.cur=first?first.id:null; }
    renderAll();
    return cloudPull().then(function(ch){ if(ch)renderAll(); });
  });
}
window.renderDosikPane=function(opts){
  var root=shell(); if(!root)return;
  if(isPhone()&&!st.loaded)st.view='list';
  applyView(); fitHeight();
  if(opts&&opts.itemId){ st.q=''; var r=st.recs.find(function(x){return x.itemId===opts.itemId&&!x.del;}); if(r){ st.cur=r.id; st.view='detail'; } }
  if(!st.loaded)loadAll().then(function(){ if(opts&&opts.itemId){ var r=st.recs.find(function(x){return x.itemId===opts.itemId&&!x.del;}); if(r){ st.cur=r.id; st.view='detail'; applyView(); renderAll(); } } });
  else renderAll();
  setTimeout(fitHeight,60);
};
/* 작지 「도식화」 버튼(dosikPick)이 새 도식화도 고를 수 있게 — 저장 때 만든 그림을 씀 */
window.dk2PickList=function(){ return idbAll().then(function(rows){ return rows.filter(function(o){return o.id!=='__myparts'&&!o.del&&(o.png||o.pngUrl);}).map(function(o){ return {id:'v2:'+o.id,name:o.name||'',code:o.code||'',png:o.pngUrl||o.png,updated:o.updated||0}; }); }).catch(function(){ return []; }); };
})();
