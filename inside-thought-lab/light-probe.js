(()=>{
'use strict';
const $=id=>document.getElementById(id);
const VW=192,VH=144,PW=44,PH=30,N=PW*PH*3;
const state={stream:null,roi:null,tick:null,scanning:false,token:0,phaseData:[],lastResult:null};
const ctx=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
ctx.canvas.width=VW;ctx.canvas.height=VH;
const delay=t=>new Promise(ok=>setTimeout(ok,t));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mean=arr=>arr.reduce((s,v)=>s+v,0)/Math.max(1,arr.length);
const rms=arr=>Math.sqrt(mean(arr.map(v=>v*v)));
function notice(msg,type=''){$('notice').hidden=!msg;$('notice').className='status '+type;$('notice').textContent=msg}
function setStatus(text){$('scanStatus').textContent=text}
function setButtons(){const ok=!!state.stream?.active&&!!state.roi&&!state.scanning;$('scanBtn').disabled=!ok;$('cameraBtn').disabled=state.scanning}
function setROI(){
 if(!state.roi)return;
 for(const [id,r] of [['eyeMark',state.roi],['cheekMark',{x:state.roi.x,y:state.roi.y+.25}]]){
  $(id).style.left=(100*r.x)+'%';$(id).style.top=(100*r.y)+'%';
 }
 $('stage').classList.add('marked');
}
function chooseROI(ev){
 if(!state.stream?.active||state.scanning)return;
 const rect=$('stage').getBoundingClientRect();
 state.roi={x:clamp((ev.clientX-rect.left)/rect.width,.16,.84),y:clamp((ev.clientY-rect.top)/rect.height,.18,.53)};
 setROI();setStatus('العين اتحددت. نقدر نبدأ.');
 notice('المربع الأخضر على العين، والبرتقالي مرجع من الخد. تأكد إنهم في مكانهم، ولو غلط المس عينك من جديد.','good');
 setButtons();
}
function problem(e){
 const n=e?.name||'',m=e?.message||'';
 if(n==='NotAllowedError'||n==='PermissionDeniedError'||n==='SecurityError')return 'الكاميرا مرفوضة. افتح الموقع في Chrome الخارجي، واضغط إعدادات الموقع ← الأذونات ← الكاميرا ← سماح.';
 if(n==='NotReadableError'||n==='TrackStartError')return 'الكاميرا محجوزة من تطبيق تاني. اقفل أي تطبيق بيستخدم الكاميرا وجرب تاني.';
 if(n==='NotFoundError')return 'المتصفح مش شايف كاميرا. راجع أذونات Chrome والكاميرا في إعدادات الموبايل.';
 if(n==='TimeoutError')return 'طلب الكاميرا معلق. جرب Chrome الخارجي واتأكد إن نافذة سماح الكاميرا مش مستخبية.';
 return 'تعذر فتح الكاميرا ('+(n||'Unknown')+'): '+m;
}
async function askCam(){
 if(state.scanning)return;
 $('cameraBtn').disabled=true;notice('بنطلب إذن استخدام الكاميرا…','pending');
 try{
  if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia)throw Object.assign(new Error('الموقع يحتاج HTTPS وChrome يدعم الكاميرا'),{name:'SecurityError'});
  if(state.tick)clearInterval(state.tick);
  state.stream?.getTracks().forEach(t=>t.stop());
  state.roi=null;$('stage').classList.remove('marked');
  const request=navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'user'},width:{ideal:640},height:{ideal:480},frameRate:{ideal:20}},audio:false});
  let timer;
  const timeout=new Promise((_,fail)=>{timer=setTimeout(()=>fail(Object.assign(new Error(),{name:'TimeoutError'})),18000)});
  let stream;
  try{stream=await Promise.race([request,timeout])}finally{clearTimeout(timer)}
  state.stream=stream;
  const v=$('video');v.srcObject=stream;v.muted=true;v.playsInline=true;
  await v.play();
  $('stage').classList.add('online');
  $('cameraFlag').textContent='LIVE / LOCAL';
  $('camTip').textContent='الكاميرا شغالة. المس مركز عين واحدة في الصورة.';
  $('cameraBtn').textContent='إعادة تشغيل الكاميرا';
  setStatus('المس عين واحدة');
  notice('الكاميرا اشتغلت. اختار عينك من الصورة.','good');
  state.tick=setInterval(()=>{if(state.stream?.active&&state.roi&&!state.scanning)refreshCameraStats()},450);
  const track=stream.getVideoTracks()[0];
  track?.addEventListener('ended',()=>{if(state.stream===stream){notice('الكاميرا وقفت، شغّلها تاني.','error');$('stage').classList.remove('online');setButtons()}});
 }catch(e){notice(problem(e),'error');$('camTip').textContent='حصلت مشكلة في فتح الكاميرا.'}
 finally{$('cameraBtn').disabled=false;setButtons()}
}
function grab(){
 const v=$('video');if(!state.stream?.active||v.readyState<2||!v.videoWidth)return null;
 ctx.save();ctx.setTransform(-1,0,0,1,VW,0);ctx.drawImage(v,0,0,VW,VH);ctx.restore();
 return ctx.getImageData(0,0,VW,VH).data
}
function extract(data,roi){
 const out=new Float32Array(N);
 const x0=clamp(Math.round(roi.x*VW-PW/2),0,VW-PW);
 const y0=clamp(Math.round(roi.y*VH-PH/2),0,VH-PH);
 for(let y=0;y<PH;y++)for(let x=0;x<PW;x++){
  const src=((y0+y)*VW+x0+x)*4,dst=(y*PW+x)*3;
  out[dst]=data[src]/255;out[dst+1]=data[src+1]/255;out[dst+2]=data[src+2]/255
 }
 return out
}
function averageData(samples){const out=new Float32Array(N);for(const a of samples)for(let i=0;i<N;i++)out[i]+=a[i];for(let i=0;i<N;i++)out[i]/=samples.length;return out}
function regionMean(data){
 let sum=0;
 for(let i=0;i<N;i+=3)sum+=(data[i]+data[i+1]+data[i+2])/3;
 return sum/(PW*PH)
}
function refreshCameraStats(){
 const d=grab();if(!d)return;
 const e=extract(d,state.roi),cheek=extract(d,{x:state.roi.x,y:state.roi.y+.25});
 $('level').textContent='EYE '+(100*regionMean(e)).toFixed(1)+'% · REF '+(100*regionMean(cheek)).toFixed(1)+'%'
}
function check(token){
 if(token!==state.token||document.hidden||!state.stream?.active)throw Error('القياس اتوقف. متقفلش الصفحة أثناء المسح.');
}
async function sleepCheck(ms,token){
 const start=performance.now();
 while(performance.now()-start<ms){check(token);await delay(70)}
}
async function readPhase(ms,token){
 const eye=[],cheek=[];let lastFrame=-1;const start=performance.now();
 while(performance.now()-start<ms){
  check(token);
  const v=$('video');const stamp=v.requestVideoFrameCallback?null:v.currentTime;
  if(stamp===null||stamp!==lastFrame){
   const d=grab();
   if(d){
    eye.push(extract(d,state.roi));cheek.push(extract(d,{x:state.roi.x,y:state.roi.y+.25}));
    lastFrame=stamp
   }
  }
  await delay(110)
 }
 if(eye.length<4)throw Error('عدد فريمات الكاميرا قليل. ثبّت الموبايل وخلي الوش ظاهر وجرب تاني.');
 return {eye:averageData(eye),cheek:averageData(cheek),frames:eye.length}
}
function averagePhases(items,key){return averageData(items.map(x=>x[key]))}
function colorAt(array,i){
 const r=array[i],g=array[i+1],b=array[i+2],s=Math.max(.04,r+g+b);
 return {red:r/s,blue:b/s}
}
function spatialDiff(warm,cool,controlWarm,controlCool){
 let refRed=0,refBlue=0;const total=PW*PH;
 for(let j=0;j<total;j++){
  const i=j*3,c1=colorAt(controlWarm,i),c2=colorAt(controlCool,i);
  refRed+=c1.red-c2.red;refBlue+=c1.blue-c2.blue;
 }
 refRed/=total;refBlue/=total;
 const eye=[],control=[],signed=[];
 for(let j=0;j<total;j++){
  const i=j*3,a=colorAt(warm,i),b=colorAt(cool,i),c=colorAt(controlWarm,i),d=colorAt(controlCool,i);
  const r=a.red-b.red,bl=a.blue-b.blue;
  eye.push(Math.hypot(r-refRed,bl-refBlue));
  signed.push(r-refRed);
  control.push(Math.hypot(c.red-d.red,c.blue-d.blue))
 }
 return {eye,control,signed}
}
function pairMap(data){
 const warm=data.filter(x=>x.mode==='warm'),cool=data.filter(x=>x.mode==='cool');
 if(!warm.length||!cool.length)throw Error('مفيش فريمات كفاية من كل لون.');
 const wE=averagePhases(warm,'eye'),cE=averagePhases(cool,'eye'),wR=averagePhases(warm,'cheek'),cR=averagePhases(cool,'cheek');
 return {raw:wE, ...spatialDiff(wE,cE,wR,cR)}
}
function corr(a,b){
 if(a.length!==b.length||!a.length)return 0;
 const ma=mean(a),mb=mean(b);let xy=0,xx=0,yy=0;
 for(let i=0;i<a.length;i++){const x=a[i]-ma,y=b[i]-mb;xy+=x*y;xx+=x*x;yy+=y*y}
 return xx>1e-10&&yy>1e-10?xy/Math.sqrt(xx*yy):0
}
function drawRaw(arr){
 const canvas=$('rawCanvas');canvas.width=PW;canvas.height=PH;
 const image=canvas.getContext('2d').createImageData(PW,PH);
 for(let p=0;p<PW*PH;p++){
  const i=p*3,o=p*4;
  image.data[o]=Math.round(clamp(arr[i],0,1)*255);
  image.data[o+1]=Math.round(clamp(arr[i+1],0,1)*255);
  image.data[o+2]=Math.round(clamp(arr[i+2],0,1)*255);
  image.data[o+3]=255;
 }
 canvas.getContext('2d').putImageData(image,0,0)
}
function drawDifference(arr){
 const canvas=$('diffCanvas');canvas.width=PW;canvas.height=PH;
 const image=canvas.getContext('2d').createImageData(PW,PH);
 const sorted=arr.map(Math.abs).sort((a,b)=>a-b);
 const scale=Math.max(.001,sorted[Math.floor(sorted.length*.96)]||.001);
 for(let p=0;p<PW*PH;p++){
  const z=clamp(arr[p]/scale,-1,1),o=p*4;
  const base=[17,31,30],positive=[217,158,104],negative=[78,158,175],target=z>=0?positive:negative;
  const a=Math.abs(z);
  for(let k=0;k<3;k++)image.data[o+k]=Math.round(base[k]+a*(target[k]-base[k]));
  image.data[o+3]=255
 }
 canvas.getContext('2d').putImageData(image,0,0);
 $('scaleLegend').textContent='مقياس اللون نسبي لكل مسح ±'+(scale*100).toFixed(2)+'%'
}
function finish(data){
 const whole=pairMap(data),half1=pairMap(data.slice(0,4)),half2=pairMap(data.slice(4,8));
 const repeat=corr(half1.signed,half2.signed);
 const eyeRms=rms(whole.eye),ctrlRms=rms(whole.control);
 const sum=(x)=>Math.round(x*10000)/100;
 $('eyeAmplitude').textContent=sum(eyeRms).toFixed(2)+'%';
 $('refAmplitude').textContent=sum(ctrlRms).toFixed(2)+'%';
 $('repeatability').textContent=repeat.toFixed(2);
 drawRaw(whole.raw);drawDifference(whole.signed);
 let interpretation='خريطة الألوان هي فرق انعكاس محسوب من صور الكاميرا مع لونين مختلفين للشاشة، بعد طرح متوسط التغير اللوني في الخد. مش خريطة للأفكار أو نشاط المخ. ';
 if(repeat<.3)interpretation+='التكرار ضعيف: الاستجابة البصرية غير ثابتة، وقد تكون بسبب تغير وضع العين أو الكاميرا أو الإضاءة. ';
 else interpretation+='ظهر شكل بصري متكرر نسبيًا عبر جزئين من المسح. ده دليل على قابلية قياس انعكاس ضوئي، مش على محتوى الكلام الداخلي. ';
 if(ctrlRms>=eyeRms)interpretation+='الفروق في مرجع الخد مساوية أو أعلى من منطقة العين؛ فالتغير غالبًا غير مميز للعين وحدها. ';
 interpretation+='توازن اللون الأبيض والتعريض التلقائي وحركة العين ممكن يغيروا القياسات؛ والألوان هنا RGB عادية وليست مطيافًا ضوئيًا.';
 $('interpretation').textContent=interpretation;
 $('result').classList.add('show');
 state.lastResult={version:'0.3',date:new Date().toISOString(),source:'Phone front camera + controlled screen light',method:'8 alternating color phases; RGB channel fractions with cheek reference correction',noNeuralClaim:true,roi:state.roi,measurements:{eyeOpticalContrastRMS:eyeRms,cheekOpticalContrastRMS:ctrlRms,spatialRepeatability:repeat},signedRedDifference:whole.signed.map(x=>Math.round(x*100000)/100000),sampleSize:{width:PW,height:PH,phases:data.map(p=>({mode:p.mode,frames:p.frames}))},notes:'Map is visualization of RGB chromaticity response, not an image of the retina or thought.'};
 setStatus('المسح خلص · النتيجة ظهرت');
 notice('اتعمل مسح ضوئي حقيقي بالكاميرا. الفروق مش دليل إن الموبايل قرأ فكرة.','good');
 $('result').scrollIntoView({behavior:'smooth',block:'start'})
}
async function scan(){
 if(state.scanning||!state.stream?.active||!state.roi)return;
 state.scanning=true;state.phaseData=[];state.lastResult=null;setButtons();$('result').classList.remove('show');
 const token=++state.token;
 const overlay=$('lightOverlay');
 overlay.classList.add('on');overlay.setAttribute('aria-hidden','false');
 const sequence=['warm','cool','warm','cool','cool','warm','cool','warm'];
 const data=[];
 setStatus('جارٍ المسح · أبقِ الهاتف ثابتًا');
 try{
  await sleepCheck(800,token);
  for(let i=0;i<sequence.length;i++){
   const mode=sequence[i];
   overlay.dataset.light=mode;
   $('phaseLabel').textContent='مسح الضوء '+(i+1)+' / '+sequence.length;
   $('phaseText').textContent=mode==='warm'?'لون الشاشة دافئ':'لون الشاشة بارد';
   $('phaseMeter').style.width=(i/sequence.length*100)+'%';
   await sleepCheck(1100,token);
   const sample=await readPhase(1400,token);
   data.push({...sample,mode});
  }
  $('phaseMeter').style.width='100%';
  overlay.classList.remove('on');overlay.setAttribute('aria-hidden','true');
  finish(data)
 }catch(e){
  setStatus('المسح توقف');
  notice(e.message||String(e),'error')
 }finally{
  overlay.classList.remove('on');overlay.setAttribute('aria-hidden','true');
  overlay.dataset.light='warm';state.scanning=false;setButtons()
 }
}
function cancel(){
 if(!state.scanning)return;
 state.token++;
 $('lightOverlay').classList.remove('on');
 $('lightOverlay').setAttribute('aria-hidden','true');
 setStatus('تم إلغاء المسح');
 notice('لغينا المسح. الكاميرا ما زالت شغالة.','')
}
function exportResult(){
 if(!state.lastResult)return;
 const blob=new Blob([JSON.stringify(state.lastResult,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='inside-light-probe-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)
}
$('cameraBtn').addEventListener('click',askCam);
$('stage').addEventListener('click',chooseROI);
$('stage').addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();const b=$('stage').getBoundingClientRect();chooseROI({clientX:b.left+b.width*.5,clientY:b.top+b.height*.37})}});
$('scanBtn').addEventListener('click',scan);
$('cancelScan').addEventListener('click',cancel);
$('exportBtn').addEventListener('click',exportResult);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.scanning)cancel()});
window.addEventListener('pagehide',()=>{state.token++;if(state.tick)clearInterval(state.tick);state.stream?.getTracks().forEach(t=>t.stop())});
window.INSIDE_TEST={spatialDiff,corr,regionMean,pairMap};
setButtons();
})();