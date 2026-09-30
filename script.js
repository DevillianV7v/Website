(function(){
var EMAIL="hello@example.com"; /* <-- set your address here */
document.getElementById("f").onsubmit=function(e){e.preventDefault();var g=function(i){return document.getElementById(i).value};
location.href="mailto:"+EMAIL+"?subject="+encodeURIComponent("Sevenday brief: "+g("pk")+" ("+g("nm")+")")+"&body="+encodeURIComponent(g("brief")+"\n\n"+g("nm")+"\n"+g("em"))};
var WORKS=["Ember Coffee","Atlas Studio","Nori Ramen","Field Notes","Halo Health","Kiln Ceramics","Bluewave","Orbit Launch"];var TYPES=["Shop","Studio site","Restaurant","Editorial","Clinic","Shop","SaaS","Landing page"];
var PAL=[["#ff7a45","#2b1a4d"],["#f2b134","#5a1a0c"],["#38e0c0","#0d2438"],["#e5322d","#f4d9c0"],["#dfe8ff","#4b6fd6"],["#ff5fa2","#180f2e"],["#3a3fd6","#c9d3ff"],["#ffd166","#1d3557"]];
function art(i){var p=PAL[i%PAL.length],a=i*37%60;
var s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 200" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+p[0]+'"/><stop offset="1" stop-color="'+p[1]+'"/></linearGradient></defs><rect width="290" height="200" fill="url(#g)"/><circle cx="'+(90+a)+'" cy="'+(70+a/2)+'" r="'+(40+a/2)+'" fill="'+p[1]+'" opacity=".55"/><rect x="'+(150-a)+'" y="120" width="170" height="16" transform="rotate(-'+(12+a/3)+' 150 120)" fill="'+p[0]+'" opacity=".8"/></svg>';
return "data:image/svg+xml;utf8,"+encodeURIComponent(s);}
var K={H:.38,MW:.34,R:1.45,STEP:40,DRUM:2.22,LENS:2.7,RING:1.14,BOW:1.82,T:.124,IDX:.04,CULL:1.6,WU:900,DU:420,SETTLE:140,EASE:.12};
var sec=document.getElementById("work"),stage=document.getElementById("stage"),wheel=document.getElementById("wheel"),lbl=document.getElementById("lbl"),ttl=document.getElementById("ttl"),idx=document.getElementById("idx");
var n=WORKS.length,last=n-1,cards=[],btns=[];
var turn=0,target=0,active=0,M=null,drag=null,timer=0,moved=0;
var reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
var clamp=function(v,a,b){return Math.min(b,Math.max(a,v))},lerp=function(a,b,t){return a+(b-a)*t},rad=function(d){return d*Math.PI/180};
WORKS.forEach(function(t,i){
var a=document.createElement("a");a.className="card";a.href="#contact";a.setAttribute("role","option");a.onclick=function(e){e.preventDefault()};
a.innerHTML='<span class="face"><img draggable="false" alt="'+t+'" src="'+art(i)+'"><i class="mono">Start like this</i></span>';
wheel.appendChild(a);cards.push(a);
var li=document.createElement("li"),b=document.createElement("button");b.type="button";b.textContent=t;
b.onclick=function(){to(i+1)};li.appendChild(b);idx.appendChild(li);btns.push(b);});
function measure(){var w=stage.clientWidth,h=stage.clientHeight;if(!h)return;
var cw=Math.min(h*K.H*K.R,w*K.MW),ch=cw/K.R,ringR=ch*K.RING;
M={cw:cw,ch:ch,ringR:ringR,drumR:ch*K.DRUM,bow:ch*K.BOW,
rs:clamp((2*Math.PI*ringR/n*.82)/cw,.16,1)};
stage.style.perspective=ch*K.LENS+"px";
lbl.style.fontSize=ttl.style.fontSize=ch*K.T+"px";idx.style.fontSize=ch*K.IDX+"px";
cards.forEach(function(c){c.style.width=cw+"px";c.style.height=ch+"px";c.style.marginLeft=-cw/2+"px";c.style.marginTop=-ch/2+"px"});}
new ResizeObserver(measure).observe(stage);measure();
var PL=[2,1,1,1,1,2,2,0],sel=-2,touched=false;
document.getElementById("brief").addEventListener("input",function(){touched=true});
function sync(i){if(i===sel)return;sel=i;var on=i>=0,g=function(x){return document.getElementById(x)};
document.querySelectorAll(".plan").forEach(function(p,k){var t=p.querySelector(".tag");if(t)t.remove();
p.classList.toggle("rec",on&&PL[i]===k);
if(on&&PL[i]===k){t=document.createElement("span");t.className="tag mono";t.textContent="Suggested for "+WORKS[i];p.insertBefore(t,p.firstChild)}});
var ty=on?TYPES[i].toLowerCase():"";
g("wkfor").textContent=on?"Your week: a "+ty+" like "+WORKS[i]:"";
g("cth").textContent=on?"Want a "+ty+" like "+WORKS[i]+"?":"Have a site that should already exist?";
g("pk").selectedIndex=on?PL[i]:0;
if(!touched)g("brief").value=on?"I'd like something like "+WORKS[i]+" ("+ty+"). ":""}
function to(v){target=clamp(v,0,last+1)}
function draw(){requestAnimationFrame(draw);if(!M)return;
var gap=target-turn;if(Math.abs(gap)<.0005)turn=target;else turn+=gap*(reduced?1:K.EASE);
var m=clamp(turn,0,1),pos=Math.max(0,turn-1);
wheel.style.transform="translateZ("+(-m*M.drumR)+"px)";
for(var i=0;i<n;i++){var d=i-pos,dd=d*K.STEP,c=cards[i];
c.style.transform="translateX("+(m*-M.bow*(1-Math.cos(rad(dd))))+"px) rotateZ("+((1-m)*d*360/n)+"deg) translateY("+(-(1-m)*M.ringR)+"px) rotateX("+(m*dd)+"deg) translateZ("+(m*M.drumR)+"px)";
c.style.opacity=m>.5&&Math.abs(d)>K.CULL?"0":"1";
c.style.zIndex=Math.round(100-Math.abs(d)*2);
c.firstElementChild.style.transform="scale("+lerp(M.rs,1,m)+")";}
lbl.style.opacity=1-m;ttl.style.opacity=m;
var near=clamp(Math.round(pos),0,last);sync(turn>=.5?near:-1);
if(near!==active||!ttl.textContent){active=near;ttl.textContent=WORKS[near];
btns.forEach(function(b,i){b.className=i===near?"on":""});
cards.forEach(function(c,i){c.setAttribute("aria-selected",i===near)});}}
requestAnimationFrame(draw);
stage.addEventListener("wheel",function(e){
var next=target+e.deltaY/K.WU;if(next>0&&next<last+1)e.preventDefault();to(next);
clearTimeout(timer);timer=setTimeout(function(){to(Math.round(target))},K.SETTLE);},{passive:false});
stage.addEventListener("pointerdown",function(e){moved=0;drag=e.clientY;stage.setPointerCapture(e.pointerId)});
stage.addEventListener("pointermove",function(e){if(drag===null)return;moved+=Math.abs(drag-e.clientY);to(target+(drag-e.clientY)/K.DU);drag=e.clientY});
stage.addEventListener("pointerup",function(e){drag=null;if(target>1)to(Math.round(target));
if(moved<6){var els=document.elementsFromPoint(e.clientX,e.clientY);
for(var k=0;k<els.length;k++){var c=els[k].closest&&els[k].closest(".card");if(c){var i=cards.indexOf(c);
if(i===active&&turn>=.5)document.getElementById("scope").scrollIntoView();else to(i+1);break}}}});
stage.addEventListener("keydown",function(e){
if(e.key==="ArrowDown")to(Math.round(target)+1);else if(e.key==="ArrowUp")to(Math.round(target)-1);else return;e.preventDefault()});
})();
