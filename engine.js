// ============================================================
// NEBULA ASSAULT — Core Engine & Utilities (v3 — Optimized)
// ============================================================
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
resizeCanvas();
window.addEventListener('resize',resizeCanvas);

// --- Performance Caps ---
const MAX_PARTICLES=200;
const MAX_PROJECTILES=150;
const MAX_LOOT=50;
const MAX_FLOATING_TEXTS=30;

// --- Input ---
const keys={};
window.addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();});
window.addEventListener('keyup',e=>keys[e.code]=false);

// --- Utility ---
function rand(a,b){return Math.random()*(b-a)+a;}
function randInt(a,b){return Math.floor(rand(a,b+1));}
function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function lerp(a,b,t){return a+(b-a)*t;}
function choice(arr){return arr[Math.floor(Math.random()*arr.length)];}

// --- Screen Management ---
function showScreen(id){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    const el=document.getElementById(id);
    if(el)el.classList.add('active');
}

// --- Screen Shake ---
let shakeX=0,shakeY=0;
function applyScreenShake(){
    if(gameState.screenShake>0){
        const intensity=gameState.screenShake*0.5;
        shakeX=rand(-intensity,intensity);shakeY=rand(-intensity,intensity);
        gameState.screenShake-=0.8;
        if(gameState.screenShake<0)gameState.screenShake=0;
    }else{shakeX=0;shakeY=0;}
}
function triggerShake(amount){gameState.screenShake=Math.min(gameState.screenShake+amount,20);}

// --- Stars Background (Parallax) ---
const stars=[];
for(let i=0;i<300;i++){
    const layer=rand(1,3); // 1 = far, 3 = near
    stars.push({x:rand(0,1920),y:rand(0,1080),s:layer*0.8,sp:layer*0.5,layer,b:rand(0.3,1),twinkle:rand(0,Math.PI*2)});
}

function updateStars(){
    const spdMult = gameState.bossActive ? 1.5 : 1;
    for(const s of stars){
        s.y+=(s.sp || 0.5)*spdMult;s.twinkle+=0.02;
        if(s.y>canvas.height){s.y=-2;s.x=rand(0,canvas.width);}
    }
}

function drawStars(){
    const region=getRegionForStage(gameState.stage);
    for(const s of stars){
        const twinkleAlpha=s.b*(0.7+0.3*Math.sin(s.twinkle));
        ctx.globalAlpha=twinkleAlpha;ctx.fillStyle=region.starColor;
        const layer = s.layer || 1;
        ctx.fillRect(s.x+(shakeX*layer*0.2),s.y+(shakeY*layer*0.2),s.s,s.s);
    }
    ctx.globalAlpha=1;
}

// --- Dynamic Background ---
function drawBackground(){
    const region=getRegionForStage(gameState.stage);
    const grad=ctx.createLinearGradient(0,0,0,canvas.height);
    grad.addColorStop(0,region.bgColor1);grad.addColorStop(1,region.bgColor2);
    ctx.fillStyle=grad;ctx.fillRect(0,0,canvas.width,canvas.height);
    drawNebulaEffects(region);
}

// --- Nebula effects ---
const nebulaClouds=[];
for(let i=0;i<5;i++){nebulaClouds.push({x:rand(0,1920),y:rand(0,1080),r:rand(100,300),speedX:rand(-0.15,0.15),speedY:rand(0.05,0.2),phase:rand(0,Math.PI*2)});}

function drawNebulaEffects(region){
    for(const c of nebulaClouds){
        c.x+=c.speedX;c.y+=c.speedY;c.phase+=0.005;
        if(c.y>canvas.height+c.r){c.y=-c.r;c.x=rand(0,canvas.width);}
        if(c.x<-c.r)c.x=canvas.width+c.r;
        if(c.x>canvas.width+c.r)c.x=-c.r;
        const alpha=0.03+0.02*Math.sin(c.phase);
        const gradient=ctx.createRadialGradient(c.x+shakeX,c.y+shakeY,0,c.x+shakeX,c.y+shakeY,c.r);
        gradient.addColorStop(0,region.nebulaColor);gradient.addColorStop(1,'transparent');
        ctx.globalAlpha=alpha;ctx.fillStyle=gradient;
        ctx.beginPath();ctx.arc(c.x+shakeX,c.y+shakeY,c.r,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
}

// --- Particles (optimized with caps & swap-and-pop) ---
const particles=[];
function spawnParticles(x,y,color,count,speed,life){
    // Reduce count in high stages for performance
    const stageMult=gameState.stage>=10?0.5:1;
    const actual=Math.min(Math.floor(count*stageMult),MAX_PARTICLES-particles.length);
    for(let i=0;i<actual;i++){
        const angle=rand(0,Math.PI*2);const sp=rand(0.5,speed);
        particles.push({x,y,vx:Math.cos(angle)*sp,vy:Math.sin(angle)*sp,life:rand(life*0.5,life),maxLife:life,color,r:rand(1,3.5)});
    }
}
function updateParticles(){
    let i=particles.length;
    while(i--){
        const p=particles[i];
        p.x+=p.vx;p.y+=p.vy;p.vx*=0.99;p.vy*=0.99;p.life--;
        if(p.life<=0){particles[i]=particles[particles.length-1];particles.pop();}
    }
}
function drawParticles(){
    const useShadow=gameState.stage<10;
    for(const p of particles){
        const a=p.life/p.maxLife;
        ctx.globalAlpha=a;ctx.fillStyle=p.color;
        if(useShadow){ctx.shadowColor=p.color;ctx.shadowBlur=4;}
        ctx.beginPath();ctx.arc(p.x+shakeX,p.y+shakeY,p.r*a,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;ctx.shadowBlur=0;
}

// --- Floating Text (optimized) ---
const floatingTexts=[];
function spawnText(x,y,text,color,size){
    if(floatingTexts.length>=MAX_FLOATING_TEXTS){floatingTexts[0]=floatingTexts[floatingTexts.length-1];floatingTexts.pop();}
    floatingTexts.push({x,y,text,color,life:55,maxLife:55,size:size||14});
}
function updateFloatingTexts(){
    let i=floatingTexts.length;
    while(i--){
        floatingTexts[i].y-=1.2;floatingTexts[i].life--;
        if(floatingTexts[i].life<=0){floatingTexts[i]=floatingTexts[floatingTexts.length-1];floatingTexts.pop();}
    }
}
function drawFloatingTexts(){
    const useShadow=gameState.stage<10;
    for(const t of floatingTexts){
        ctx.globalAlpha=t.life/t.maxLife;ctx.fillStyle=t.color;
        if(useShadow){ctx.shadowColor=t.color;ctx.shadowBlur=6;}
        ctx.font='bold '+t.size+'px Orbitron';ctx.textAlign='center';
        ctx.fillText(t.text,t.x+shakeX,t.y+shakeY);
    }
    ctx.globalAlpha=1;ctx.shadowBlur=0;
}

// --- Wave Announcement ---
let waveAnnounce={text:'',timer:0,maxTimer:90};
function showWaveAnnounce(text){waveAnnounce.text=text;waveAnnounce.timer=waveAnnounce.maxTimer;}
function drawWaveAnnounce(){
    if(waveAnnounce.timer<=0)return;
    waveAnnounce.timer--;
    const progress=waveAnnounce.timer/waveAnnounce.maxTimer;
    let alpha;
    if(progress>0.8)alpha=(1-progress)/0.2;
    else if(progress<0.2)alpha=progress/0.2;
    else alpha=1;
    ctx.save();
    ctx.globalAlpha=alpha*0.9;ctx.fillStyle='#00e5ff';ctx.shadowColor='#00e5ff';ctx.shadowBlur=20;
    ctx.font='bold 28px Orbitron';ctx.textAlign='center';
    ctx.fillText(waveAnnounce.text,canvas.width/2+shakeX,canvas.height/2-30+shakeY);
    ctx.shadowBlur=0;ctx.globalAlpha=alpha*0.5;ctx.fillStyle='#e0f7fa';ctx.font='16px "Exo 2"';
    const region=getRegionForStage(gameState.stage);
    ctx.fillText(region.name,canvas.width/2+shakeX,canvas.height/2+5+shakeY);
    ctx.restore();
}
