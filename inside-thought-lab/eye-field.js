(()=>{
'use strict';
const $=id=>document.getElementById(id);
const W=160,H=120,FIELDS=['lum','rg','bg','glint','dark','tex'];
const TRAIN=12, TEST=12;
const ctx=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
ctx.canvas.width=W;ctx.canvas.height=H;
const state={stream:null,ticker:null,latest:null,trace:[],eye:null,ref:null,busy:false,nonce:0,training:[],testing:[],modelEye:null,modelRef:null,words:['أيوه','لأ'],recordedAt:null,calib:null};
const wait=ms=>new Promise(ok=>setTimeout(ok,ms));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mean=a=>a.reduce((s,v)=>s+v,0)/(a.length||1);
const stdev=a=>{const m=mean(a);return Math.sqrt(mean(a.map(v=>(v-m)**2)))};
const pct=v=>(v*100).toFixed(2)+'%';
function say(msg,type=''){$('note').textContent=msg;$('note').className='note '+type}
function cue(k,v){$('cueLabel').textContent=k;$('cueText').textContent=v}
function status(msg){$('trialState').textContent=msg}
function progress(n){$('count').textContent=n+' / '+(TRAIN+TEST);$('progressBar').style.width=(100*n/(TRAIN+TEST))+'%'}
function buttons(){const cameraReady=!!state.stream?.active;const ready=cameraReady&&!!state.eye&&!state.busy;$('calibrateBtn').disabled=!ready;$('trainBtn').disabled=!ready;$('testBtn').disabled=!ready||!state.modelEye;$('cameraBtn').disabled=state.busy;$('resetBtn').disabled=state.busy;$('phraseA').disabled=state.busy;$('phraseB').disabled=state.busy}
function positionRoi(){
 if(!state.eye)return;
 const eye=$('roiEye'),ref=$('roiRef');
 eye.style.left=(state.eye.x*100)+'%';eye.style.top=(state.eye.y*100)+'%';
 ref.style.left=(state.ref.x*100)+'%';ref.style.top=(state.ref.y*100)+'%';
}
function selectEye(ev){
 if(!state.stream?.active||state.busy)return;
 const rect=$('stage').getBoundingClientRect();
 const x=clamp((ev.clientX-rect.left)/rect.width,.13,.87);
 const y=clamp((ev.clientY-rect.top)/rect.height,.15,.67);
 state.eye={x,y};
 state.ref={x:clamp(x+.11,.13,.87),y:clamp(y+.25,.14,.87)};
 positionRoi();say('تمام. الإطار الأخضر على العين، والبرتقالي منطقة مقارنة من الوجه. عدّل المكان بلمسة تانية.','good');
 cue('تم تحديد العين','الآن نقدر نقيس');buttons()
}
function cameraAlert(message='',kind=''){
 const el=$('camAlert');
 if(!el)return;
 el.hidden=!message;
 el.textContent=message;
 el.className='camAlert '+kind;
}
function cameraErrorDescription(err){
 const n=err?.name||'', m=err?.message||'';
 if(n==='NotAllowedError'||n==='PermissionDeniedError'||n==='SecurityError')return 'المتصفح منع إذن الكاميرا. افتح الموقع في Chrome الخارجي، واضغط علامة الإعدادات بجانب العنوان ← أذونات الموقع ← الكاميرا ← سماح. بعد كده اعمل تحديث.';
 if(n==='NotFoundError'||n==='DevicesNotFoundError')return 'المتصفح مش شايف أي كاميرا. تأكد إن كاميرا الموبايل شغالة وإن Chrome مسموح له يستخدمها.';
 if(n==='NotReadableError'||n==='TrackStartError')return 'الكاميرا مشغولة أو تطبيق تاني حاجزها. اقفل تطبيق الكاميرا والفيديوهات، وبعدها جرب تاني.';
 if(n==='OverconstrainedError')return 'الكاميرا مش متوافقة مع الإعدادات المطلوبة. جرّب تاني أو افتح من Chrome.';
 if(n==='TimeoutError')return 'الطلب أخد وقت طويل من غير استجابة. اتأكد إن نافذة إذن الكاميرا مش مستخبية، وافتح الصفحة في Chrome الخارجي.';
 if(n==='AbortError')return 'تشغيل الكاميرا اتقطع. اقفل أي تطبيق بيستخدم الكاميرا وجرب تاني.';
 return 'تعذر تشغيل الكاميرا ('+(n||'Unknown')+'): '+(m||'سبب غير معروف')+'. افتح في Chrome، واتأكد من السماح للكاميرا.';
}
async function cameraWithTimeout(constraints,timeout=20000){
 let expired=false,timer;
 const promise=navigator.mediaDevices.getUserMedia(constraints);
 const timeoutPromise=new Promise((_,reject)=>{
  timer=setTimeout(()=>{expired=true;const err=new Error('Camera permission did not resolve');err.name='TimeoutError';reject(err)},timeout)
 });
 promise.then(s=>{if(expired)s.getTracks().forEach(t=>t.stop())}).catch(()=>{});
 try{return await Promise.race([promise,timeoutPromise])}finally{clearTimeout(timer)}
}
async function startCamera(){
 if(state.busy)return;
 const btn=$('cameraBtn');
 btn.disabled=true;btn.textContent='بنطلب إذن الكاميرا…';
 cameraAlert('بيتم طلب إذن الكاميرا. لو ظهر سؤال من المتصفح، دوس سماح.','pending');
 say('بنطلب إذن استخدام الكاميرا الأمامية…');
 try{
  if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia)throw Object.assign(new Error('الكاميرا غير متاحة في المتصفح الحالي، افتح رابط HTTPS في Chrome الخارجي.'),{name:'SecurityError'});
  if(state.ticker){clearInterval(state.ticker);state.ticker=null}
  if(state.stream){state.stream.getTracks().forEach(t=>t.stop());state.stream=null}
  $('stage').classList.remove('active');
  let stream;
  try{
   stream=await cameraWithTimeout({video:{facingMode:{ideal:'user'},width:{ideal:640},height:{ideal:480},frameRate:{ideal:15}},audio:false});
  }catch(e){
   if(e.name!=='OverconstrainedError'&&e.name!=='NotFoundError')throw e;
   stream=await cameraWithTimeout({video:true,audio:false});
  }
  state.stream=stream;
  const video=$('video');
  video.muted=true;video.playsInline=true;video.srcObject=stream;
  try{
   await Promise.race([video.play(),new Promise((_,reject)=>setTimeout(()=>reject(Object.assign(new Error('Video playback stalled'),{name:'TimeoutError'})),8000))]);
  }catch(e){stream.getTracks().forEach(t=>t.stop());state.stream=null;throw e}
  $('stage').classList.add('active');
  $('camLabel').textContent='LIVE · LOCAL';
  $('camDot').classList.add('on');
  $('cameraText').textContent='الكاميرا شغالة · الصور بتتعالج محليًا';
  btn.textContent='إعادة تشغيل الكاميرا';
  state.trace=[];state.latest=null;
  state.ticker=setInterval(tick,125);
  const track=stream.getVideoTracks()[0];
  if(track)track.addEventListener('ended',()=>{
   if(state.stream===stream){
    say('الكاميرا اتقفلت. شغّلها تاني.','error');
    cameraAlert('اتقطع اتصال الكاميرا. اقفل التطبيقات اللي ممكن تكون بتستخدمها وجرب تاني.','error');
    $('camDot').classList.remove('on');state.nonce++;buttons();
   }
  });
  cameraAlert('الكاميرا اشتغلت ✓ المس عين واحدة في الصورة علشان نحدد منطقة القياس.','good');
  say('الكاميرا اشتغلت. المس عين واحدة في الصورة علشان نحدد مكان القياس.','good');
  cue('الخطوة التالية','المس عينك في الصورة');
 }catch(err){
  const message=cameraErrorDescription(err);
  $('camLabel').textContent='CAMERA OFFLINE';
  $('camDot').classList.remove('on');
  $('cameraText').textContent='الكاميرا مش متاحة';
  btn.textContent='جرّب تشغيل الكاميرا تاني';
  cameraAlert(message,'error');
  say(message,'error');
 }finally{btn.disabled=false;buttons()}
}

function region(data,roi){
 const w2=Math.round(W*.11),h2=Math.round(H*.09);
 const xc=Math.round(roi.x*W),yc=Math.round(roi.y*H);
 const x0=clamp(xc-w2,0,W-1),x1=clamp(xc+w2,0,W);
 const y0=clamp(yc-h2,0,H-1),y1=clamp(yc+h2,0,H);
 let lum=0,rg=0,bg=0,glint=0,dark=0,tex=0,n=0;
 for(let y=y0;y<y1;y+=2)for(let x=x0;x<x1;x+=2){
  const i=(y*W+x)*4,r=data[i]/255,g=data[i+1]/255,b=data[i+2]/255;
  const l=.299*r+.587*g+.114*b;lum+=l;rg+=r-g;bg+=b-g;
  glint+=l>.79?1:0;dark+=l<.25?1:0;n++;
  if(x+2<x1){const j=(y*W+x+2)*4;tex+=Math.abs(l-(.299*data[j]+.587*data[j+1]+.114*data[j+2])/255)}
 }
 if(!n)return null;
 return {lum:lum/n,rg:rg/n,bg:bg/n,glint:glint/n,dark:dark/n,tex:tex/n}
}
function tick(){
 const v=$('video');
 if(!state.stream?.active||!state.eye||v.readyState<2||!v.videoWidth)return;
 try{
  ctx.setTransform(-1,0,0,1,W,0);ctx.drawImage(v,0,0,W,H);ctx.setTransform(1,0,0,1,0,0);
  const buf=ctx.getImageData(0,0,W,H).data;
  const e=region(buf,state.eye),r=region(buf,state.ref);
  if(!e||!r)return;
  const s={t:performance.now(),e,r};
  state.latest=s;state.trace.push(s);
  if(state.trace.length>90)state.trace.shift();
  $('lum').textContent=pct(e.lum-r.lum);
  $('chrom').textContent=(100*(e.rg-r.rg)).toFixed(2);
  $('glint').textContent=pct(e.glint);
  drawGraph()
 }catch(err){if(!state.busy)say('تعذّر تحليل صورة الكاميرا: '+err.message,'error')}
}
function drawGraph(){
 const cv=$('signalCanvas'),b=cv.getBoundingClientRect();
 if(!b.width)return;const ratio=Math.min(devicePixelRatio||1,2),w=b.width,h=b.height;
 if(cv.width!==Math.round(w*ratio)||cv.height!==Math.round(h*ratio)){cv.width=Math.round(w*ratio);cv.height=Math.round(h*ratio)}
 const g=cv.getContext('2d');g.setTransform(ratio,0,0,ratio,0,0);g.clearRect(0,0,w,h);
 const t=state.trace.slice(-70),pad=13;
 g.strokeStyle='#354340';g.lineWidth=1;
 for(let n=1;n<4;n++){const y=pad+(h-2*pad)*n/4;g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
 if(t.length<2)return;
 const vals=t.flatMap(s=>[s.e.lum,s.r.lum]),min=Math.min(...vals)-.008,max=Math.max(...vals)+.008;
 function draw(key,color){
  g.beginPath();g.lineWidth=1.6;g.strokeStyle=color;
  t.forEach((v,i)=>{const x=pad+i*(w-2*pad)/(Math.max(t.length-1,1)),y=pad+(h-2*pad)*(1-(v[key].lum-min)/(max-min));if(i===0)g.moveTo(x,y);else g.lineTo(x,y)});
  g.stroke()
 }
 draw('r','#c69a73');draw('e','#c8dfb2');
}
function meanRegion(a,key){const o={};for(const k of FIELDS)o[k]=mean(a.map(s=>s[key][k]));return o}
function ensure(n){if(n!==state.nonce||document.hidden||!state.stream?.active)throw Error('التجربة اتقطعت. افتح الصفحة وثبّت الموبايل وجرّب تاني.')}
async function hold(ms,n){const end=performance.now()+ms;while(performance.now()<end){ensure(n);await wait(Math.min(100,Math.max(1,end-performance.now())))}}
async function capture(ms,n){
 const samples=[],begin=performance.now();let last=-1;
 while(performance.now()-begin<ms){
  ensure(n);
  if(state.latest&&state.latest.t!==last&&performance.now()-state.latest.t<500){samples.push(state.latest);last=state.latest.t}
  await wait(75)
 }
 if(samples.length<5)throw Error('الكاميرا ما سجلتش بيانات كفاية؛ محتاج إضاءة ثابتة ووش ظاهر.');
 return samples
}
async function probe(){
 if(!state.eye||state.busy)return;
 state.busy=true;const n=++state.nonce;buttons();$('calibration').classList.add('show');
 say('بنجرّب 3 درجات إضاءة هادئة من شاشة الموبايل، من غير فلاش أو وميض.','good');
 const modes=[['neutral','إضاءة محايدة'],['warm','إضاءة دافئة'],['cool','إضاءة باردة']];
 const set={};
 try{
  for(const [k,name] of modes){
   document.body.dataset.light=k;
   $('calibTitle').textContent=name;cue('معايرة الضوء',name);
   await hold(750,n);set[k]=await capture(2650,n);
  }
  const warm=meanRegion(set.warm,'e'),cool=meanRegion(set.cool,'e');
  const warmRef=meanRegion(set.warm,'r'),coolRef=meanRegion(set.cool,'r');
  const strengthE=Math.hypot(warm.rg-cool.rg,warm.bg-cool.bg);
  const strengthR=Math.hypot(warmRef.rg-coolRef.rg,warmRef.bg-coolRef.bg);
  state.calib={eyeShift:strengthE,refShift:strengthR,at:new Date().toISOString()};
  $('calibTitle').textContent='خلص اختبار الضوء';
  $('calibDetails').textContent='تغيّر اللون المقاس: عند العين '+pct(strengthE)+' | المرجع '+pct(strengthR)+'. '+(strengthE<.005?'الاستجابة ضعيفة جدًا أو غير واضحة في الظروف الحالية.':'الكاميرا لاحظت اختلافًا بصريًا مع الإضاءة. ده مش دليل على رؤية الأفكار.');
  say('المعايرة خلصت. نتيجة قياس ضوء فقط، مش نشاط عصبي.','good');cue('المعايرة اكتملت','جرّب الكلام الداخلي');
 }catch(e){say(e.message,'error');$('calibTitle').textContent='المعايرة توقفت'}
 finally{document.body.dataset.light='neutral';state.busy=false;buttons()}
}
function vector(base,thought,key){
 const b=meanRegion(base,key),t=meanRegion(thought,key);
 return FIELDS.map(k=>t[k]-b[k]).concat(stdev(thought.map(x=>x[key].lum))-stdev(base.map(x=>x[key].lum)))
}
function trialFeatures(base,thought){
 const e=vector(base,thought,'e'),r=vector(base,thought,'r');
 return {eye:e.map((v,i)=>v-r[i]),ref:r}
}
function rng(max){
 const r=new Uint32Array(1);
 if(crypto?.getRandomValues){crypto.getRandomValues(r);return r[0]%max}
 return Math.floor(Math.random()*max)
}
function order(n){const a=[...Array(n/2).fill(0),...Array(n/2).fill(1)];for(let i=a.length-1;i>0;i--){const j=rng(i+1),q=a[i];a[i]=a[j];a[j]=q}return a}
function fit(data,key){
 const x=data.map(d=>d[key]);const d=x[0].length;
 const mu=Array.from({length:d},(_,j)=>mean(x.map(row=>row[j])));
 const sd=Array.from({length:d},(_,j)=>Math.max(.002,stdev(x.map(row=>row[j]))));
 const centroid=[0,1].map(k=>Array.from({length:d},(_,j)=>mean(data.filter(v=>v.label===k).map(row=>(row[key][j]-mu[j])/sd[j]))));
 return {mu,sd,centroid}
}
function predict(model,x){
 const z=x.map((v,i)=>(v-model.mu[i])/model.sd[i]);
 const ds=model.centroid.map(c=>mean(z.map((v,i)=>(v-c[i])**2)));
 return ds[0]<=ds[1]?0:1
}
function chance(k,n){let sum=0;for(let i=k;i<=n;i++){let c=1;for(let j=1;j<=i;j++)c=c*(n-j+1)/j;sum+=c/Math.pow(2,n)}return sum}
async function attempt(label,i,total,kind,n){
 status((kind==='train'?'التدريب':'اختبار أعمى')+' · '+(i+1)+' / '+total);
 cue('احفظ الكلمة بدون نطق',state.words[label]);
 say('الكلمة ظاهرة للتذكير فقط. مش هنقيس أي بيانات وإنت بتقراها.');
 await hold(1700,n);
 cue('ثبّت نظرك','•');
 await hold(1450,n);
 cue('قياس خط الأساس','•');
 const baseline=await capture(1150,n);
 cue('قولها جواك دلوقتي','•');
 say('كرر الكلمة داخليًا، من غير صوت أو حركة مقصودة.','good');
 const thought=await capture(2700,n);
 const f=trialFeatures(baseline,thought);
 if(kind==='train')state.training.push({label,...f});
 else {
  const guessEye=predict(state.modelEye,f.eye),guessRef=predict(state.modelRef,f.ref);
  state.testing.push({label,...f,guessEye,guessRef})
 }
 progress(state.training.length+state.testing.length);
 cue('المحاولة اتسجلت','✓');
 await hold(430,n)
}
async function begin(kind){
 if(state.busy||!state.eye||!state.stream?.active)return;
 if(kind==='test'&&!state.modelEye){say('خلص التدريب الأول.','error');return}
 if(kind==='train'){
  const a=$('phraseA').value.trim(),b=$('phraseB').value.trim();
  if(!a||!b||a===b){say('اكتب كلمتين مختلفتين، مش نفس الكلمة.','error');return}
  state.words=[a,b];state.training=[];state.testing=[];state.modelEye=null;state.modelRef=null;state.recordedAt=new Date().toISOString();progress(0);
  $('results').classList.remove('show');$('testBtn').classList.add('hidden');
 }
 state.busy=true;const n=++state.nonce;buttons();
 const seq=order(kind==='train'?TRAIN:TEST);
 try{
  for(let i=0;i<seq.length;i++)await attempt(seq[i],i,seq.length,kind,n);
  if(kind==='train'){
   state.modelEye=fit(state.training,'eye');state.modelRef=fit(state.training,'ref');
   cue('التدريب انتهى','جاهز للاختبار');
   say('التدريب خلص. دلوقتي 12 محاولة جديدة، ومش هنعرض التخمينات غير بعد النهاية.','good');
   $('testBtn').classList.remove('hidden')
  }else{
   cue('انتهى الاختبار','النتيجة تحت');
   say('خلصنا. بنقارن العين بمنطقة الوجه المرجعية، مع اختبار الصدفة.','good');
   results()
  }
 }catch(e){say(e.message,'error');status('الجلسة اتوقفت');cue('توقف القياس','ابدأ من جديد');state.modelEye=null;state.modelRef=null;$('testBtn').classList.add('hidden')}
 finally{state.busy=false;buttons()}
}
function results(){
 const n=state.testing.length,good=state.testing.filter(t=>t.guessEye===t.label).length,reference=state.testing.filter(t=>t.guessRef===t.label).length,p=chance(good,n);
 $('eyeAccuracy').textContent=Math.round(100*good/n)+'%';$('controlAccuracy').textContent=Math.round(100*reference/n)+'%';
 $('chance').textContent=p.toFixed(3);
 $('trials').replaceChildren();
 for(const t of state.testing){const el=document.createElement('i');el.className='trial '+(t.guessEye===t.label?'ok':'bad');el.title='نتيجة التوقع: '+(t.guessEye===t.label?'صح':'غلط');$('trials').append(el)}
 let conclusion='';
 if(good<=n/2)conclusion='النتيجة مش أحسن من الصدفة. الكاميرا ما قدّمتش دليلًا إنها عرفت الكلمة من العين.';
 else if(p>.05)conclusion='النتيجة أعلى من 50%، لكن 12 تجربة مش كفاية علشان نعتبرها أعلى من الصدفة إحصائيًا.';
 else conclusion='في الجلسة دي التصنيف أعلى من الصدفة إحصائيًا، لكن ده لا يثبت قراءة الكلام الداخلي. لازم إعادة تجارب مستقلة واستبعاد حركة العين والإضاءة وتسريب معرفة الكلمة.';
 if(reference>=good)conclusion+=' منطقة الوجه المرجعية أداؤها مساوي أو أعلى؛ فده سبب قوي للحذر من تفسير النتيجة كإشارة خاصة بالعين.';
 else conclusion+=' تفوّق نموذج العين وحده ما يكفيش؛ ممكن يكون نتيجة حركة لا إرادية أو اختلاف في النظر.';
 $('judgement').textContent=conclusion+' قيمة p أحادية الطرف، استكشافية وليست دليلًا علميًا مستقلًا.';
 $('results').classList.add('show');$('results').scrollIntoView({behavior:'smooth',block:'start'})
}
function exportData(){
 const data={project:'INSIDE / OPTICAL FIELD',version:'0.2',date:new Date().toISOString(),sensor:'phone front camera only; not EEG or neural signals',privacy:'video frames processed in browser and not retained by this code',roi:state.eye,control:state.ref,calibration:state.calib,words:state.words,training:state.training,testing:state.testing,notes:'Spectral/brightness/texture pixel statistics. Eye model uses eye minus cheek control. No thought decoding claim.'};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='inside-eye-field-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)
}
function reset(){
 if(state.busy)return;
 state.nonce++;state.training=[];state.testing=[];state.modelEye=null;state.modelRef=null;progress(0);
 $('testBtn').classList.add('hidden');$('results').classList.remove('show');
 cue('لسه مستكشفين','التجربة جاهزة');
 status('اختبار 24 محاولة اختياري');say('اتصفرت نتائج التجربة. منطقة العين والمعايرة لسه محفوظين مؤقتًا.');buttons()
}
$('stage').addEventListener('click',selectEye);
$('cameraBtn').addEventListener('click',startCamera);
$('calibrateBtn').addEventListener('click',probe);
$('trainBtn').addEventListener('click',()=>begin('train'));
$('testBtn').addEventListener('click',()=>begin('test'));
$('resetBtn').addEventListener('click',reset);
$('exportBtn').addEventListener('click',exportData);
window.addEventListener('resize',drawGraph);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.busy){state.nonce++;say('التجربة وقفت عشان الصفحة خرجت من الشاشة.','error')}});
window.addEventListener('pagehide',()=>{state.nonce++;if(state.ticker)clearInterval(state.ticker);state.stream?.getTracks().forEach(t=>t.stop())});
window.INSIDE_DIAGNOSTICS={region,trialFeatures,fit,predict,chance,order};
buttons();progress(0)
})();