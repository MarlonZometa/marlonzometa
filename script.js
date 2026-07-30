const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#current-year').textContent=new Date().getFullYear();

const topbar=$('.topbar'), progress=$('.scroll-progress i');
function onScroll(){
  const y=scrollY, max=document.documentElement.scrollHeight-innerHeight;
  topbar.classList.toggle('scrolled',y>20);
  progress.style.width=`${max?y/max*100:0}%`;
}
addEventListener('scroll',onScroll,{passive:true}); onScroll();

const menu=$('.menu-button'), nav=$('#main-nav');
menu.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.classList.toggle('open',open);
  menu.setAttribute('aria-expanded',open);
});
$$('#main-nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
}),{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

const processObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting) $('#process-number').textContent=entry.target.dataset.step;
}),{rootMargin:'-35% 0px -45%',threshold:.1});
$$('.process-step').forEach(el=>processObserver.observe(el));

const typeWords=['Ideas','Tecnología','Historias','Aprendizaje','Soluciones'];
const typeLabels=['CREATIVIDAD','TECNOLOGÍA','ESCRITURA','EDUCACIÓN','DESARROLLO'];
const typedWord=$('#typed-word');
let typeWordIndex=0,typeCharIndex=typeWords[0].length,typeDeleting=true,typeTimer;
function runTypewriter(){
  if(reduced||!typedWord){if(typedWord) typedWord.textContent=typeWords[0];return}
  const word=typeWords[typeWordIndex];
  if(!typeDeleting){
    typeCharIndex++;
    typedWord.textContent=word.slice(0,typeCharIndex);
    if(typeCharIndex===word.length){
      $('#focus-label').textContent=typeLabels[typeWordIndex];
      typeDeleting=true;
      typeTimer=setTimeout(runTypewriter,1650);
      return;
    }
    typeTimer=setTimeout(runTypewriter,95);
  }else{
    typeCharIndex--;
    typedWord.textContent=word.slice(0,typeCharIndex);
    if(typeCharIndex===0){
      typeDeleting=false;
      typeWordIndex=(typeWordIndex+1)%typeWords.length;
      typeTimer=setTimeout(runTypewriter,320);
      return;
    }
    typeTimer=setTimeout(runTypewriter,58);
  }
}
if(!reduced) typeTimer=setTimeout(runTypewriter,1650);

$$('.planet').forEach(planet=>{
  const activate=()=>{
    $$('.planet').forEach(p=>p.classList.remove('active')); planet.classList.add('active');
    const title=$('#scene-title'), copy=$('#scene-copy');
    title.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});
    title.textContent=planet.dataset.scene; copy.textContent=planet.dataset.copy;
  };
  planet.addEventListener('mouseenter',activate); planet.addEventListener('focus',activate); planet.addEventListener('click',activate);
});

if(!reduced && matchMedia('(pointer:fine)').matches){
  const glow=$('.cursor-glow');
  addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});
  $$('.magnetic').forEach(el=>el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*.1}px,${y*.1}px)`;
  }));
  $$('.magnetic').forEach(el=>el.addEventListener('pointerleave',()=>el.style.transform=''));
  $$('.tilt').forEach(el=>el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(1100px) rotateY(${x*4}deg) rotateX(${-y*4}deg) translateY(-5px)`;
  }));
  $$('.tilt').forEach(el=>el.addEventListener('pointerleave',()=>el.style.transform=''));
  const consoleEl=$('#creative-console');
  consoleEl.addEventListener('pointermove',e=>{
    const r=consoleEl.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    consoleEl.style.transform=`perspective(1200px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`;
  });
  consoleEl.addEventListener('pointerleave',()=>consoleEl.style.transform='');

  const canvas=$('#constellation'),ctx=canvas.getContext('2d'); let dots=[],pointer={x:-999,y:-999};
  function resize(){
    const d=Math.min(devicePixelRatio,2),r=canvas.parentElement.getBoundingClientRect();
    canvas.width=r.width*d;canvas.height=r.height*d;canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(d,0,0,d,0,0);
    dots=Array.from({length:Math.min(56,Math.floor(r.width/23))},()=>({x:Math.random()*r.width,y:Math.random()*r.height,vx:(Math.random()-.5)*.16,vy:(Math.random()-.5)*.16}));
  }
  canvas.parentElement.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top}});
  canvas.parentElement.addEventListener('pointerleave',()=>pointer={x:-999,y:-999});
  function draw(){
    const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);
    dots.forEach((a,i)=>{
      a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>w)a.vx*=-1;if(a.y<0||a.y>h)a.vy*=-1;
      const pd=Math.hypot(a.x-pointer.x,a.y-pointer.y);if(pd<130){a.x+=(a.x-pointer.x)*.003;a.y+=(a.y-pointer.y)*.003}
      ctx.fillStyle='#165dff55';ctx.beginPath();ctx.arc(a.x,a.y,1.15,0,Math.PI*2);ctx.fill();
      for(let j=i+1;j<dots.length;j++){const b=dots[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<95){ctx.strokeStyle=`rgba(22,93,255,${.11*(1-d/95)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
    });requestAnimationFrame(draw);
  }
  resize();addEventListener('resize',resize);draw();
}


// Automatic universe tour: keeps the central panel alive on desktop and touch screens.
const universePlanets=$$('.planet');
let universeIndex=Math.max(0,universePlanets.findIndex(p=>p.classList.contains('active')));
let universeTimer;
function showUniversePlanet(planet){
  if(!planet) return;
  universePlanets.forEach(p=>p.classList.remove('active'));
  planet.classList.add('active');
  const title=$('#scene-title'), copy=$('#scene-copy');
  if(title.animate && !reduced){
    title.animate([{opacity:0,transform:'translateY(12px) scale(.96)',filter:'blur(6px)'},{opacity:1,transform:'none',filter:'none'}],{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});
    copy.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:540,easing:'cubic-bezier(.16,1,.3,1)'});
  }
  title.textContent=planet.dataset.scene;
  copy.textContent=planet.dataset.copy;
}
function startUniverseTour(){
  clearInterval(universeTimer);
  if(reduced || universePlanets.length<2) return;
  universeTimer=setInterval(()=>{
    universeIndex=(universeIndex+1)%universePlanets.length;
    showUniversePlanet(universePlanets[universeIndex]);
  },4200);
}
universePlanets.forEach((planet,index)=>{
  ['click','focus','mouseenter'].forEach(eventName=>planet.addEventListener(eventName,()=>{
    universeIndex=index;showUniversePlanet(planet);startUniverseTour();
  }));
});
document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(universeTimer):startUniverseTour());
startUniverseTour();
