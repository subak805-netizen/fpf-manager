/* ===== 동기화 검사 — 가짜 기기 (2026-09-28, 동기화 3번 「두 기기 흉내 검사」) =====
   이 파일은 검사용 app.html(= index.html 에서 Firebase SDK 4줄만 이걸로 바꾼 것)에만 들어간다. 실제 앱에는 안 들어간다.
   - 진짜 Firebase 대신 가짜 창고(runner.html 이 들고 있음)와 postMessage 로 주고받는다.
   - 기기마다 주소(a1.localhost, b1.localhost …)가 달라서 localStorage·IndexedDB 가 따로다 = 진짜 다른 기기와 같다.
   - runner 가 보내는 코드를 이 기기 안에서 실행하고 결과를 돌려준다(검사 장면 조종).
   - 인터넷 끊김(offline)·화면 숨김(hidden)을 흉내 낸다. */
(function(){
  var qs={}; location.search.replace(/^\?/,'').split('&').forEach(function(p){ if(!p)return; var i=p.indexOf('='); qs[decodeURIComponent(i<0?p:p.slice(0,i))]=decodeURIComponent(i<0?'':p.slice(i+1)); });
  var DEV=qs.dev||'?';
  var parentWin=window.parent;
  var T={ dev:DEV, offline:false, hidden:false, logs:[], dialogs:[] };
  window.__syncTest=T;
  function log(){ var a=[].slice.call(arguments).map(function(x){ try{ return typeof x==='string'?x:JSON.stringify(x); }catch(e){ return String(x); } }).join(' '); T.logs.push(a); if(T.logs.length>400)T.logs.shift(); }
  T.log=log;
  /* 앱이 콘솔에 남기는 경고·오류도 모아 둔다 — 실패한 장면을 되짚을 때 쓴다 */
  ['warn','error'].forEach(function(k){ var o=console[k]; console[k]=function(){ try{ log('console.'+k, [].slice.call(arguments).map(function(x){ return (x&&x.message)?x.message:(typeof x==='string'?x:JSON.stringify(x)); }).join(' ').slice(0,300)); }catch(e){} return o.apply(console,arguments); }; });

  /* ── 처음 켠 기기에만 시험 자료 심기 (?seed=이름) */
  try{
    if(qs.seed&&!localStorage.getItem('__seeded')){
      var x=new XMLHttpRequest(); x.open('GET','/synctest/seed-'+qs.seed+'.json',false); x.send(null);
      var seed=JSON.parse(x.responseText);
      Object.keys(seed).forEach(function(k){ var v=seed[k]; localStorage.setItem(k, typeof v==='string'?v:JSON.stringify(v)); });
      localStorage.setItem('__seeded','1');
    }
    /* 자동 파일 백업(14시·21시)이 검사 기기에서 파일을 내려받지 않게 — 이미 받은 것으로 표시 */
    var d=new Date(), h=d.getHours(), p=function(n){return String(n).padStart(2,'0');};
    var day=d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());
    localStorage.setItem('fpm_autofilebk_last', day+'-'+(h>=21?21:(h>=14?14:0)));
  }catch(e){ log('seed error', String(e)); }

  /* ── 파일 내려받기·창 띄우기 막기 (검사 중 다운로드 폴더에 파일이 생기면 안 됨) */
  try{ var _click=HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click=function(){ if(this.hasAttribute('download')){ log('download blocked', this.getAttribute('download')); return; } return _click.apply(this,arguments); }; }catch(e){}
  window.alert=function(m){ T.dialogs.push({t:'alert',m:String(m)}); log('alert', String(m).slice(0,200)); };
  window.confirm=function(m){ T.dialogs.push({t:'confirm',m:String(m)}); log('confirm→false', String(m).slice(0,200)); return false; };
  window.prompt=function(m){ T.dialogs.push({t:'prompt',m:String(m)}); return null; };
  window.open=function(){ return null; };

  /* ── 인터넷 끊김 · 화면 숨김 흉내 */
  try{ Object.defineProperty(navigator,'onLine',{configurable:true,get:function(){ return !T.offline; }}); }catch(e){}
  try{ Object.defineProperty(document,'hidden',{configurable:true,get:function(){ return T.hidden; }}); Object.defineProperty(document,'visibilityState',{configurable:true,get:function(){ return T.hidden?'hidden':'visible'; }}); }catch(e){}

  /* ── runner 와 주고받기 */
  var seq=0, waiting={};
  function rpc(op,args){ return new Promise(function(res,rej){ var id=DEV+':'+(++seq); waiting[id]={res:res,rej:rej}; parentWin.postMessage({__st:1,kind:'rpc',dev:DEV,id:id,op:op,args:args},'*'); }); }
  var listeners={};      // path → [cb]
  var lastSeen={};       // path → 마지막으로 이 기기에 알린 ts (끊긴 동안 온 변경을 다시 붙을 때 한 번만)
  var pendingSnap={};    // 끊긴 동안 온 스냅샷(경로별 마지막 것)
  var writeQueue=[];     // 끊긴 동안 쌓인 쓰기
  function snapOf(doc,pending){ return { exists:!!doc, data:function(){ return doc?JSON.parse(JSON.stringify(doc)):undefined; }, metadata:{ hasPendingWrites:!!pending, fromCache:false }, id:null }; }
  function deliver(path,doc,pending){ (listeners[path]||[]).slice().forEach(function(l){ try{ l.next(snapOf(doc,pending)); }catch(e){ log('listener error',String(e&&e.stack||e)); } }); }

  window.addEventListener('message',function(e){
    var m=e.data; if(!m||!m.__st)return;
    if(m.kind==='rpcRes'){ var w=waiting[m.id]; if(!w)return; delete waiting[m.id]; if(m.ok)w.res(m.result); else w.rej(new Error(m.error||'fail')); return; }
    if(m.kind==='snap'){   // 다른 기기가 쓴 것이 창고에 들어옴
      if(T.offline){ pendingSnap[m.path]=m.doc; return; }
      lastSeen[m.path]=m.doc&&m.doc.ts; deliver(m.path,m.doc,false); return; }
    if(m.kind==='eval'){
      Promise.resolve().then(function(){ return (0,eval)(m.code); }).then(function(v){
        var out; try{ out=JSON.parse(JSON.stringify(v===undefined?null:v)); }catch(err){ out=String(v); }
        parentWin.postMessage({__st:1,kind:'evalRes',dev:DEV,id:m.id,ok:true,value:out},'*');
      },function(err){ parentWin.postMessage({__st:1,kind:'evalRes',dev:DEV,id:m.id,ok:false,error:String(err&&err.stack||err)},'*'); });
      return; }
  });

  T.setOffline=function(off){
    off=!!off; if(T.offline===off)return;
    T.offline=off;
    if(off){ try{ window.dispatchEvent(new Event('offline')); }catch(e){} return; }
    /* 다시 연결: 쌓인 쓰기를 순서대로 보내고, 끊긴 동안 온 변경을 한 번씩 알림 */
    var q=writeQueue; writeQueue=[];
    q.reduce(function(p,w){ return p.then(function(){ return rpc('set',{path:w.path,data:w.data}).then(w.res,w.rej); }); },Promise.resolve());
    Object.keys(pendingSnap).forEach(function(path){ var doc=pendingSnap[path]; delete pendingSnap[path]; lastSeen[path]=doc&&doc.ts; deliver(path,doc,false); });
    try{ window.dispatchEvent(new Event('online')); }catch(e){}
  };
  T.setHidden=function(hid){ T.hidden=!!hid; try{ document.dispatchEvent(new Event('visibilitychange')); }catch(e){} if(hid){ try{ window.dispatchEvent(new Event('pagehide')); }catch(e){} } };
  T.pendingWrites=function(){ return writeQueue.length+Object.keys(waiting).length; };

  /* ── 가짜 Firestore (앱이 쓰는 모양만: collection().doc()…get/set/onSnapshot) */
  function DocRef(path){ this.path=path; }
  DocRef.prototype.collection=function(n){ return new ColRef(this.path+'/'+n); };
  DocRef.prototype.get=function(){ var path=this.path;
    if(T.offline)return new Promise(function(res,rej){ setTimeout(function(){ rej(new Error('unavailable: offline')); },30); });
    return rpc('get',{path:path}).then(function(doc){ return snapOf(doc,false); }); };
  DocRef.prototype.set=function(data,opts){ var path=this.path; var clean=JSON.parse(JSON.stringify(data));
    if(opts&&opts.merge){ log('set merge used',path); }
    /* 내 화면엔 바로(쓰기 대기 표시) — 진짜 Firestore 의 지연 보정과 같음 */
    setTimeout(function(){ deliver(path,clean,true); },0);
    if(T.offline)return new Promise(function(res,rej){ writeQueue.push({path:path,data:clean,res:res,rej:rej}); });
    return rpc('set',{path:path,data:clean}); };
  DocRef.prototype.delete=function(){ return rpc('del',{path:this.path}); };
  DocRef.prototype.onSnapshot=function(a,b){
    var path=this.path, l={next:(typeof a==='function')?a:(a&&a.next)||function(){}, error:(typeof b==='function')?b:function(){}};
    (listeners[path]=listeners[path]||[]).push(l);
    if(!T.offline){ rpc('listen',{path:path}).then(function(doc){ lastSeen[path]=doc&&doc.ts; try{ l.next(snapOf(doc,false)); }catch(e){ log('listener error',String(e&&e.stack||e)); } }); }
    return function(){ var arr=listeners[path]||[]; var i=arr.indexOf(l); if(i>=0)arr.splice(i,1); };
  };
  function ColRef(path){ this.path=path; }
  ColRef.prototype.doc=function(id){ return new DocRef(this.path+'/'+id); };
  var db={ collection:function(n){ return new ColRef(n); }, enablePersistence:function(){ return Promise.resolve(); } };
  /* 트랜잭션(09-29 동기화 4번): 진짜 Firestore 처럼 «읽은 문서가 그 사이 안 바뀌었을 때만» 커밋, 바뀌었으면 함수를 다시 돌림(최대 5번).
     끊긴 동안은 진짜처럼 실패. */
  db.runTransaction=function(fn){
    var attempt=0;
    function run(){
      attempt++;
      if(T.offline)return Promise.reject(new Error('unavailable: offline'));
      var reads={}, writes=[];
      var tx={
        get:function(ref){ return rpc('get',{path:ref.path}).then(function(doc){ reads[ref.path]=doc?(doc.ts||'__nots'):null; return snapOf(doc,false); }); },
        set:function(ref,data){ writes.push({path:ref.path,data:JSON.parse(JSON.stringify(data))}); return tx; }
      };
      return Promise.resolve().then(function(){ return fn(tx); }).then(function(result){
        return rpc('txcommit',{reads:reads,writes:writes}).then(function(){
          writes.forEach(function(w){ lastSeen[w.path]=w.data&&w.data.ts; setTimeout(function(){ deliver(w.path,w.data,false); },0); });
          return result;
        },function(err){ if(/aborted/.test(String(err&&err.message))&&attempt<5)return run(); throw err; });
      });
    }
    return run();
  };

  /* ── 가짜 로그인 — 늘 같은 사람(같은 계정으로 네 기기를 쓰는 것과 같음) */
  var user={ uid:'U_TEST', email:'test@example.com' };
  var auth={ currentUser:user,
    onAuthStateChanged:function(cb){ setTimeout(function(){ cb(user); },0); return function(){}; },
    signOut:function(){ return Promise.resolve(); }, signInWithEmailAndPassword:function(){ return Promise.resolve({user:user}); },
    createUserWithEmailAndPassword:function(){ return Promise.resolve({user:user}); }, sendPasswordResetEmail:function(){ return Promise.resolve(); } };

  /* ── 가짜 저장소(사진) — 사진은 이번 검사 대상이 아님. 올린 척만 */
  function SRef(p){ this.fullPath=p||''; }
  SRef.prototype.child=function(c){ return new SRef((this.fullPath?this.fullPath+'/':'')+c); };
  SRef.prototype.put=function(){ return Promise.resolve({}); };
  SRef.prototype.putString=function(){ return Promise.resolve({}); };
  SRef.prototype.getDownloadURL=function(){ return Promise.resolve('https://example.invalid/'+encodeURIComponent(this.fullPath)); };
  SRef.prototype.getMetadata=function(){ return Promise.resolve({size:0}); };
  SRef.prototype.delete=function(){ return Promise.resolve(); };
  var storage={ ref:function(p){ return new SRef(p||''); }, refFromURL:function(u){ return new SRef(String(u)); } };

  var apps=[];
  window.firebase={ apps:apps,
    initializeApp:function(cfg){ apps.push({options:cfg}); return apps[0]; },
    app:function(){ return apps[0]; },
    auth:function(){ return auth; }, firestore:function(){ return db; }, storage:function(){ return storage; } };

  /* ── 준비 끝 알림: 회사 자료를 읽고 첫 동기화까지 끝나면 runner 에 알린다 */
  var t0=Date.now();
  (function ready(){
    try{
      if(typeof S!=='undefined'&&typeof curCoId!=='undefined'&&curCoId&&window._cloudSyncReady===true&&document.readyState==='complete'){
        parentWin.postMessage({__st:1,kind:'ready',dev:DEV,ms:Date.now()-t0},'*'); return; }
    }catch(e){}
    if(Date.now()-t0>30000){ parentWin.postMessage({__st:1,kind:'ready',dev:DEV,ms:Date.now()-t0,timeout:true,logs:T.logs.slice(-20)},'*'); return; }
    setTimeout(ready,100);
  })();
})();
