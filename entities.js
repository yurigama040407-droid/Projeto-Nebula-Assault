// ============================================================
// NEBULA ASSAULT — Entities (v3 — Optimized)
// ============================================================
const projectiles=[];
function fireProjectile(x,y,vx,vy,damage,isPlayer,color,size){
    if(projectiles.length>=MAX_PROJECTILES)return;
    projectiles.push({x,y,vx,vy,damage,isPlayer,color,size:size||3,life:300});
}
function updateProjectiles(){let i=projectiles.length;while(i--){const p=projectiles[i];p.x+=p.vx;p.y+=p.vy;p.life--;if(p.x<-20||p.x>canvas.width+20||p.y<-20||p.y>canvas.height+20||p.life<=0){projectiles[i]=projectiles[projectiles.length-1];projectiles.pop();}}}
function drawProjectiles(){for(const p of projectiles){ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=8;if(p.isPlayer){ctx.fillRect(p.x-1.5+shakeX,p.y-p.size+shakeY,3,p.size*2);}else{ctx.beginPath();ctx.arc(p.x+shakeX,p.y+shakeY,p.size,0,Math.PI*2);ctx.fill();}ctx.shadowBlur=0;}}

const missiles=[];
function fireMissile(x,y,target){missiles.push({x,y,vx:rand(-2,2),vy:-5,target,speed:6,damage:player.damage*2.5,life:180,color:'#ff9800'});}
function updateMissiles(){for(let i=missiles.length-1;i>=0;i--){const m=missiles[i];let t=m.target;if(!t||t.hp<=0){t=enemies[0]||boss;m.target=t;}if(t){const a=Math.atan2(t.y-m.y,t.x-m.x);m.vx=lerp(m.vx,Math.cos(a)*m.speed,0.08);m.vy=lerp(m.vy,Math.sin(a)*m.speed,0.08);}m.x+=m.vx;m.y+=m.vy;m.life--;spawnParticles(m.x,m.y,m.color,1,1,8);let hit=false;for(let ei=enemies.length-1;ei>=0;ei--){if(dist(m,enemies[ei])<enemies[ei].size+8){enemies[ei].hp-=m.damage;spawnParticles(m.x,m.y,'#ff6d00',5,3,15);if(enemies[ei].hp<=0)killEnemy(enemies[ei],ei);hit=true;break;}}if(!hit&&boss&&!boss.entering&&dist(m,boss)<boss.size+10){damageBoss(m.damage);hit=true;}if(hit||m.life<=0||m.x<-30||m.x>canvas.width+30||m.y<-30||m.y>canvas.height+30)missiles.splice(i,1);}}
function drawMissiles(){for(const m of missiles){ctx.fillStyle=m.color;ctx.shadowColor=m.color;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(m.x+shakeX,m.y+shakeY,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}}

// --- Player ---
const player={x:400,y:500,w:24,h:24,hp:100,maxHp:100,shield:0,maxShield:50,speed:5,damage:10,fireTimer:0,alive:true,invTimer:0,thrustAnim:0};
const assistant={x:0,y:0,hp:50,maxHp:50,fireTimer:0,alive:false,angle:0};

let hazards=[], powerups=[];

function resetPlayer(){
    player.x=canvas.width/2;player.y=canvas.height-100;
    const oc=1+(gameState.upgrades.overclock||0)*0.05;
    player.maxHp=(100+gameState.upgrades.maxHp*30)*oc;player.maxShield=(50+gameState.upgrades.maxShield*25)*oc;
    player.hp=player.maxHp;player.shield=player.maxShield;
    player.speed=(5+gameState.upgrades.speed*0.8)*oc;
    player.fireRate=Math.max(3,12-gameState.upgrades.fireRate*1);
    player.damage=(12+gameState.upgrades.damage*5)*oc;
    player.alive=true;player.invTimer=60;player.fireTimer=0;
}

function updatePlayer(){
    if(!player.alive)return;
    const sp=player.speed;
    if(keys['ArrowLeft']||keys['KeyA'])player.x-=sp;
    if(keys['ArrowRight']||keys['KeyD'])player.x+=sp;
    if(keys['ArrowUp']||keys['KeyW'])player.y-=sp;
    if(keys['ArrowDown']||keys['KeyS'])player.y+=sp;
    player.x=clamp(player.x,player.w,canvas.width-player.w);
    player.y=clamp(player.y,player.h,canvas.height-player.h);
    player.thrustAnim+=0.15;
    if(player.invTimer>0)player.invTimer--;
    if(player.shield<player.maxShield)player.shield+=0.03;
    const shouldFire=gameState.autoFire||(keys['Space']);
    player.fireTimer--;
    if(gameState.activePowerups&&gameState.activePowerups['fury']>0){gameState.activePowerups['fury']--;player.fireTimer--;}
    const odSlot=findSkillSlot('overdrive');
    const odActive=odSlot>=0&&gameState.skillActive[odSlot]>0;
    const rate=odActive?Math.max(2,Math.floor(player.fireRate/2)):player.fireRate;
    if(shouldFire&&player.fireTimer<=0){
        player.fireTimer=rate;
        const skin=SHIP_SKINS[gameState.selectedSkin];
        const shots=1+gameState.upgrades.multishot;
        // Critical hit check
        const isCrit=Math.random()<gameState.critChance;
        const dmg=isCrit?player.damage*2:player.damage;
        const col=isCrit?'#ffd740':skin.engineColor;
        const sz=isCrit?6:5;
        if(shots===1){fireProjectile(player.x,player.y-player.h/2,0,-11,dmg,true,col,sz);}
        else if(shots===2){fireProjectile(player.x-8,player.y-player.h/2,-0.3,-11,dmg,true,col,sz-1);fireProjectile(player.x+8,player.y-player.h/2,0.3,-11,dmg,true,col,sz-1);}
        else if(shots===3){fireProjectile(player.x,player.y-player.h/2,0,-11,dmg,true,col,sz);fireProjectile(player.x-12,player.y-player.h/2,-0.8,-11,dmg*0.7,true,col,sz-2);fireProjectile(player.x+12,player.y-player.h/2,0.8,-11,dmg*0.7,true,col,sz-2);}
        else{fireProjectile(player.x,player.y-player.h/2,0,-11,dmg,true,col,sz);fireProjectile(player.x-10,player.y-player.h/2,-0.5,-11,dmg*0.7,true,col,sz-2);fireProjectile(player.x+10,player.y-player.h/2,0.5,-11,dmg*0.7,true,col,sz-2);fireProjectile(player.x-18,player.y-5,-1.3,-9,dmg*0.5,true,col,sz-2);fireProjectile(player.x+18,player.y-5,1.3,-9,dmg*0.5,true,col,sz-2);}
        if(isCrit)spawnText(player.x,player.y-50,'CRÍTICO!','#ffd740',16);
    }
}

function drawPlayer(){
    if(!player.alive)return;
    if(player.invTimer>0&&Math.floor(player.invTimer/4)%2===0)return;
    const x=player.x+shakeX,y=player.y+shakeY;
    const skin=SHIP_SKINS[gameState.selectedSkin];
    const pskin=PILOT_SKINS[gameState.selectedPilot];
    ctx.save();
    if(pskin.auraColor){ctx.fillStyle=pskin.auraColor;ctx.beginPath();ctx.arc(x,y,38,0,Math.PI*2);ctx.fill();}
    const thrustLen=14+Math.sin(player.thrustAnim)*6;
    ctx.fillStyle=skin.engineColor;ctx.shadowColor=skin.engineColor;ctx.shadowBlur=18;
    ctx.beginPath();ctx.moveTo(x-7,y+player.h/2);ctx.lineTo(x,y+player.h/2+thrustLen);ctx.lineTo(x+7,y+player.h/2);ctx.fill();
    if(Math.random()<0.2)spawnParticles(x,y+player.h/2,pskin.trailColor,1,1.5,12);
    ctx.shadowBlur=0;
    ctx.fillStyle=skin.bodyColor;ctx.strokeStyle=skin.engineColor;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(x,y-player.h/2);ctx.lineTo(x+player.w/2,y+player.h/2-4);ctx.lineTo(x+player.w/2+6,y+player.h/2);ctx.lineTo(x-player.w/2-6,y+player.h/2);ctx.lineTo(x-player.w/2,y+player.h/2-4);ctx.closePath();ctx.fill();ctx.stroke();
    if(skin.rainbow){ctx.strokeStyle='hsl('+(Date.now()*0.1%360)+',100%,70%)';ctx.lineWidth=2;ctx.stroke();}
    ctx.fillStyle=skin.cockpitColor;ctx.shadowColor=skin.cockpitColor;ctx.shadowBlur=10;
    ctx.beginPath();ctx.ellipse(x,y-2,4,7,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    if(gameState.skillActive[findSkillSlot('shield')]>0){ctx.strokeStyle='rgba(0,229,255,0.5)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,35,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
}

function findSkillSlot(skillId){for(let i=0;i<3;i++){if(SKILL_DEFS[gameState.equippedSkills[i]]?.id===skillId)return i;}return-1;}

function damagePlayer(amount){
    if(player.invTimer>0)return;
    const slot=findSkillSlot('shield');
    if(slot>=0&&gameState.skillActive[slot]>0)return;
    let dmg=amount*DIFF_MULT[difficulty];
    dmg*=(1-gameState.upgrades.armor*0.08);
    if(player.shield>0){const absorbed=Math.min(player.shield,dmg);player.shield-=absorbed;dmg-=absorbed;}
    player.hp-=dmg;player.invTimer=20;triggerShake(6);
    if(player.hp<=0){player.hp=0;player.alive=false;spawnParticles(player.x,player.y,'#ff1744',25,5,50);spawnParticles(player.x,player.y,'#ff9800',15,4,40);triggerShake(15);}
}

// --- Loot (with cap) ---
const lootDrops=[];
function spawnLoot(x,y,gold){
    if(lootDrops.length>=MAX_LOOT)return;
    const luckMult=1+gameState.upgrades.luck*0.15;
    lootDrops.push({x,y,gold:Math.floor(gold*luckMult),vy:rand(-1,0.5),life:350,magnet:false});
}
const POWERUP_TYPES=['heal','shield','fury'];
function spawnPowerup(x,y){powerups.push({x:x,y:y,type:choice(POWERUP_TYPES),timer:500,vy:1});}
function updateLoot(){
    const magnetRadius=100+gameState.upgrades.magnet*30;
    const mSlot=findSkillSlot('magnet');
    const mActive=mSlot>=0&&gameState.skillActive[mSlot]>0;
    let i=lootDrops.length;
    while(i--){
        const l=lootDrops[i];l.y+=l.vy;l.vy+=0.02;l.life--;
        const dx=player.x-l.x,dy=player.y-l.y,d=Math.hypot(dx,dy);
        const pullDist=mActive?canvas.width:magnetRadius;
        if(d<pullDist){const spd=mActive?0.15:0.08;l.x+=dx*spd;l.y+=dy*spd;}
        if(gameState.upgrades.droneCollector>0&&d<150+gameState.upgrades.droneCollector*40){l.x+=dx*0.08;l.y+=dy*0.08;}
        if(d<22&&player.alive){gameState.gold+=l.gold;gameState.totalGold+=l.gold;spawnText(l.x,l.y,'+'+l.gold,'#ffd740');lootDrops[i]=lootDrops[lootDrops.length-1];lootDrops.pop();continue;}
        if(l.life<=0||l.y>canvas.height+20){lootDrops[i]=lootDrops[lootDrops.length-1];lootDrops.pop();}
    }
    for(let i=powerups.length-1;i>=0;i--){
        let p=powerups[i];p.y+=p.vy;p.timer--;
        if(dist(player,p)<30){
            if(p.type==='heal'){player.hp=Math.min(player.maxHp,player.hp+player.maxHp*0.3);}
            if(p.type==='shield'){player.invTimer=300;spawnText(player.x,player.y-20,'ESCUDO DE ENERGIA','#00e5ff',16);}
            if(p.type==='fury'){if(!gameState.activePowerups)gameState.activePowerups={};gameState.activePowerups['fury']=480;spawnText(player.x,player.y-20,'FÚRIA','#ff1744',16);}
            spawnParticles(p.x,p.y,'#fff',15,4,20);powerups.splice(i,1);
        }else if(p.timer<=0||p.y>canvas.height+30)powerups.splice(i,1);
    }
}
function drawLoot(){
    for(const l of lootDrops){ctx.fillStyle='#ffd740';ctx.shadowColor='#ffd740';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(l.x+shakeX,l.y+shakeY,5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
    for(let p of powerups){
        ctx.fillStyle=p.type==='heal'?'#00e676':(p.type==='shield'?'#00b0ff':'#ff1744');
        ctx.font='20px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(p.type==='heal'?'\u2764':(p.type==='shield'?'\ud83d\udee1':'\ud83d\udd25'),p.x+shakeX,p.y+shakeY);
    }
}

// --- Enemies ---
const enemies=[];
function spawnEnemy(type,x,y,pathType){
    const def=ENEMY_TYPES[type];
    const hpMult=1+(gameState.stage-1)*0.15+Math.floor((gameState.stage-1)/5)*0.3;
    const spdMult=1+(gameState.stage-1)*0.02;
    const regionIdx=GALAXY_REGIONS.findIndex(r=>r.stages.includes(gameState.stage));
    const variants=REGION_ENEMY_VARIANTS[regionIdx]||{};
    const color=variants[type]||def.color;
    enemies.push({type,x,y,hp:def.hp*hpMult*DIFF_MULT[difficulty],maxHp:def.hp*hpMult*DIFF_MULT[difficulty],speed:def.speed*spdMult,score:def.score,gold:def.gold,color,size:def.size,shape:def.shape,fireRate:def.fireRate>0?def.fireRate:0,fireTimer:randInt(30,120),pathType:pathType||'straight',pathTimer:0,baseX:x,phantomAlpha:1,phantomTimer:0});
}

function updateEnemies(){
    const slowSlot=findSkillSlot('slow');
    let slowMult=(slowSlot>=0&&gameState.skillActive[slowSlot]>0)?0.25:1;
    if(gameState.skinAbilityActive>0&&SHIP_SKINS[gameState.selectedSkin].ability==='slow_motion')slowMult=0.25;
    for(let i=enemies.length-1;i>=0;i--){
        const e=enemies[i];e.pathTimer++;
        const sp=e.speed*slowMult;
        switch(e.pathType){
            case'straight':e.y+=sp;break;
            case'sine':e.y+=sp;e.x=e.baseX+Math.sin(e.pathTimer*0.03)*60;break;
            case'zigzag':e.y+=sp*0.8;e.x+=Math.sign(Math.sin(e.pathTimer*0.05))*sp*1.2;break;
            case'dive':if(e.pathTimer<60)e.y+=sp*0.5;else e.y+=sp*2.5;break;
            case'orbit':e.y+=sp*0.3;e.x=e.baseX+Math.sin(e.pathTimer*0.025)*80;break;
            case'swarm':e.y+=sp*0.7;e.x+=Math.sin(e.pathTimer*0.04+e.baseX)*1.5;break;
        }
        if(e.type==='phantom'){e.phantomTimer++;if(e.phantomTimer%120<40)e.phantomAlpha=0.15;else e.phantomAlpha=1;}
        if(e.type==='sniper'){
            e.fireTimer--;if(e.fireTimer===30){ctx.beginPath();ctx.moveTo(e.x+shakeX,e.y+shakeY);ctx.lineTo(player.x+shakeX,player.y+shakeY);ctx.strokeStyle='rgba(255,0,0,0.5)';ctx.lineWidth=1;ctx.stroke();}
            if(e.fireTimer<0){const ang=Math.atan2(player.y-e.y,player.x-e.x);fireProjectile(e.x,e.y,Math.cos(ang)*15,Math.sin(ang)*15,15+gameState.stage*1.5,false,'#ff1744',6);e.fireTimer=150;}
        }else if(e.type==='paladin'){
            e.fireTimer--;if(e.fireTimer<0){const ang=Math.atan2(player.y-e.y,player.x-e.x);fireProjectile(e.x,e.y,Math.cos(ang)*5,Math.sin(ang)*5,12+gameState.stage*1.0,false,'#00e5ff',4);e.fireTimer=80;}
        }else if(e.fireRate>0){e.fireTimer--;if(e.fireTimer<=0){e.fireTimer=e.fireRate;const angle=Math.atan2(player.y-e.y,player.x-e.x);fireProjectile(e.x,e.y,Math.cos(angle)*4,Math.sin(angle)*4,8+gameState.stage*1.2,false,'#ff5252',4);}}
        if(e.y>canvas.height+40){e.y=-30;e.x=rand(50,canvas.width-50);e.baseX=e.x;e.pathTimer=0;gameState.comboCount=0;}
        if(e.x<-50){e.x=canvas.width+20;e.baseX=e.x;}
        if(e.x>canvas.width+50){e.x=-20;e.baseX=e.x;}
    }
}

function drawEnemyShape(e){
    const x=e.x+shakeX,y=e.y+shakeY,s=e.size;
    ctx.save();ctx.globalAlpha=e.phantomAlpha||1;
    ctx.fillStyle=e.color;ctx.strokeStyle=e.color;ctx.lineWidth=1.5;ctx.shadowColor=e.color;ctx.shadowBlur=6;
    switch(e.shape){
        case'tri':ctx.beginPath();ctx.moveTo(x,y+s);ctx.lineTo(x-s*0.8,y-s*0.6);ctx.lineTo(x+s*0.8,y-s*0.6);ctx.closePath();ctx.fill();break;
        case'diamond':ctx.beginPath();ctx.moveTo(x,y-s);ctx.lineTo(x+s*0.7,y);ctx.lineTo(x,y+s);ctx.lineTo(x-s*0.7,y);ctx.closePath();ctx.stroke();ctx.globalAlpha*=0.3;ctx.fill();break;
        case'hex':ctx.beginPath();for(let a=0;a<6;a++){const ang=Math.PI/3*a-Math.PI/2;ctx.lineTo(x+s*Math.cos(ang),y+s*Math.sin(ang));}ctx.closePath();ctx.stroke();ctx.globalAlpha*=0.25;ctx.fill();break;
        case'star':ctx.beginPath();for(let a=0;a<10;a++){const ang=Math.PI/5*a-Math.PI/2;const r=a%2===0?s:s*0.5;ctx.lineTo(x+r*Math.cos(ang),y+r*Math.sin(ang));}ctx.closePath();ctx.fill();break;
        case'circle':ctx.beginPath();ctx.arc(x,y,s,0,Math.PI*2);ctx.stroke();ctx.globalAlpha*=0.4;ctx.fill();break;
        case'ghost':ctx.beginPath();ctx.arc(x,y-s*0.3,s*0.7,Math.PI,0);ctx.lineTo(x+s*0.7,y+s*0.5);for(let w=0;w<4;w++){const wx=x+s*0.7-s*0.35*w;ctx.lineTo(wx-s*0.15,y+s*0.2);ctx.lineTo(wx-s*0.35,y+s*0.5);}ctx.closePath();ctx.fill();break;
        default:ctx.fillRect(x-s/2,y-s/2,s,s);
    }
    ctx.shadowBlur=0;ctx.globalAlpha=e.phantomAlpha||1;
    if(e.hp<e.maxHp){const bw=s*1.4,bx=x-bw/2,by=y-s-6;ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(bx,by,bw,3);ctx.fillStyle='#69f0ae';ctx.fillRect(bx,by,bw*(e.hp/e.maxHp),3);}
    ctx.restore();
}
function drawEnemies(){for(const e of enemies)drawEnemyShape(e);}

function killEnemy(e,idx){
    const pc=gameState.stage>=10?8:15;
    spawnParticles(e.x,e.y,e.color,pc,4,30);spawnParticles(e.x,e.y,'#fff',3,2,20);
    if(e.type==='bomber'){triggerShake(8);spawnParticles(e.x,e.y,'#ff6e40',pc,6,35);if(dist(player,e)<80)damagePlayer(20);for(let ei=enemies.length-1;ei>=0;ei--){if(ei!==idx&&dist(enemies[ei],e)<70){enemies[ei].hp-=25;if(enemies[ei].hp<=0)killEnemy(enemies[ei],ei);}}}
    spawnLoot(e.x,e.y,e.gold+randInt(0,5));
    if(Math.random()<0.05)spawnPowerup(e.x,e.y);
    gameState.score+=e.score*gameState.comboMultiplier;gameState.totalKills++;
    gameState.comboCount++;gameState.comboTimer=120;gameState.comboMultiplier=Math.min(10,1+Math.floor(gameState.comboCount/4));
    gameState.bestiary.add(e.type);
    // XP reward
    const xpReward=XP_REWARDS[e.type]||5;
    addXP(xpReward);
    spawnText(e.x,e.y-15,'+'+(e.score*gameState.comboMultiplier),'#00e5ff');
    enemies.splice(idx,1);gameState.enemiesRemaining=enemies.length+waveQueue.length;
}

// --- Boss ---
let boss=null;
function spawnBoss(def){
    const hpMult=1+(gameState.stage-1)*0.2+Math.floor((gameState.stage-1)/5)*0.5;
    boss={name:def.name,x:canvas.width/2,y:-80,hp:def.hp*DIFF_MULT[difficulty]*hpMult,maxHp:def.hp*DIFF_MULT[difficulty]*hpMult,color:def.color,size:55,phase:0,patterns:def.patterns,special:def.special,patIdx:0,patTimer:0,fireTimer:0,entering:true,shakeTimer:0,angle:0,summonTimer:0};
    gameState.bossActive=true;
    document.getElementById('boss-hud').style.display='block';
    document.getElementById('boss-name').textContent=def.name;
}

function updateBoss(){
    if(!boss)return;
    let slowMult=1;
    if(gameState.skinAbilityActive>0&&SHIP_SKINS[gameState.selectedSkin].ability==='slow_motion')slowMult=0.25;
    if(boss.entering){boss.y=lerp(boss.y,100,0.02);if(boss.y>90)boss.entering=false;return;}
    boss.angle+=0.012*(boss.phase>0?1.5:1)*slowMult;boss.x=canvas.width/2+Math.sin(boss.angle)*160;
    boss.patTimer+=slowMult;boss.fireTimer-=slowMult;
    const pat=boss.patterns[boss.patIdx];
    if(boss.fireTimer<0){
        switch(pat){
            case'spiral':for(let a=0;a<8;a++){const ang=(Math.PI*2/8)*a+boss.patTimer*0.05;fireProjectile(boss.x,boss.y,Math.cos(ang)*3.5,Math.sin(ang)*3.5,12,false,boss.color,5);}boss.fireTimer=18*(boss.phase>0?0.6:1);break;
            case'spread':for(let a=-3;a<=3;a++){const ang=Math.PI/2+a*0.18;fireProjectile(boss.x,boss.y+boss.size/2,Math.cos(ang)*4,Math.sin(ang)*4,10,false,'#ff5252',4);}boss.fireTimer=32*(boss.phase>0?0.6:1);break;
            case'aimed':const angle=Math.atan2(player.y-boss.y,player.x-boss.x);for(let s=-2;s<=2;s++){fireProjectile(boss.x,boss.y,Math.cos(angle+s*0.12)*5.5,Math.sin(angle+s*0.12)*5.5,14,false,'#ff1744',5);}boss.fireTimer=24*(boss.phase>0?0.6:1);break;
            case'wave':for(let a=0;a<10;a++){const ang=(Math.PI*2/10)*a;fireProjectile(boss.x,boss.y,Math.cos(ang)*2.5,Math.sin(ang)*2.5,10,false,'#e040fb',4);}boss.fireTimer=38*(boss.phase>0?0.6:1);break;
        }
    }
    if(boss.special==='summon'){boss.summonTimer+=slowMult;if(boss.summonTimer>300*(boss.phase>0?0.6:1)){boss.summonTimer=0;for(let s=0;s<2;s++)spawnEnemy('scout',boss.x+rand(-60,60),-20,'straight');}}
    if(boss.special==='gravity'&&!boss.entering){const dx=boss.x-player.x,dy=boss.y-player.y,d=Math.max(1,Math.hypot(dx,dy));if(d<300){player.x+=dx/d*0.8*(boss.phase>0?1.5:1);player.y+=dy/d*0.8*(boss.phase>0?1.5:1);}}
    if(boss.patTimer>180){boss.patTimer=0;boss.patIdx=(boss.patIdx+1)%boss.patterns.length;}
    const hpPct=boss.hp/boss.maxHp;
    if(hpPct<0.5&&boss.phase<1){boss.phase=1;boss.shakeTimer=30;boss.color='#ff1744';boss.hp+=boss.maxHp*0.1;spawnParticles(boss.x,boss.y,boss.color,40,6,50);spawnText(boss.x,boss.y-40,'FORMA 2!','#ff1744',20);}
    if(boss.shakeTimer>0)boss.shakeTimer--;
    document.getElementById('boss-hp-fill').style.width=(hpPct*100)+'%';
}

function drawBoss(){
    if(!boss)return;
    const x=boss.x+(boss.shakeTimer>0?rand(-3,3):0)+shakeX;
    const y=boss.y+(boss.shakeTimer>0?rand(-3,3):0)+shakeY;
    const s=boss.size;
    ctx.save();
    ctx.strokeStyle=boss.color;ctx.globalAlpha=0.15+Math.sin(Date.now()*0.003)*0.1;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(x,y,s+18,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
    ctx.fillStyle='#1a1a2e';ctx.strokeStyle=boss.color;ctx.lineWidth=2;ctx.shadowColor=boss.color;ctx.shadowBlur=25;
    ctx.beginPath();for(let a=0;a<6;a++){const ang=Math.PI/3*a-Math.PI/2;ctx.lineTo(x+s*Math.cos(ang),y+s*Math.sin(ang));}ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle=boss.color;ctx.beginPath();ctx.arc(x,y,14+Math.sin(Date.now()*0.005)*3,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.restore();
}

function damageBoss(amount){
    if(!boss)return;boss.hp-=amount;boss.shakeTimer=5;triggerShake(4);
    if(boss.hp<=0){
        boss.hp=0;spawnParticles(boss.x,boss.y,boss.color,30,7,60);spawnParticles(boss.x,boss.y,'#ffd740',15,4,40);
        spawnLoot(boss.x,boss.y,120+gameState.stage*20);
        spawnText(boss.x,boss.y,'BOSS DERROTADO!','#ffd740',22);
        addXP(XP_REWARDS.boss);
        gameState.score+=500*gameState.stage;gameState.bossActive=false;gameState.bossDefeated=true;
        triggerShake(18);document.getElementById('boss-hud').style.display='none';boss=null;
    }
}

// --- Assistant ---
function resetAssistant(){assistant.x=player.x+35;assistant.y=player.y+10;assistant.hp=assistant.maxHp;assistant.alive=true;assistant.fireTimer=0;}
function updateAssistant(){
    if(!assistant.alive)return;
    if(gameState.upgrades.droneAttack>0){
        assistant.x=lerp(assistant.x,player.x+35,0.06);assistant.y=lerp(assistant.y,player.y+10,0.06);
        assistant.fireTimer--;
        if(assistant.fireTimer<=0){
            assistant.fireTimer=18;
            fireProjectile(assistant.x,assistant.y-8,0,-9,(player.damage*0.5)*gameState.upgrades.droneAttack,true,'#69f0ae',3);
        }
    }
    if(gameState.upgrades.droneHealer>0){
        if(gameState.comboTimer===0&&player.hp<player.maxHp){
            player.hp=Math.min(player.maxHp,player.hp+0.02*gameState.upgrades.droneHealer);
        }
    }
}
function drawAssistant(){
    if(!assistant.alive||gameState.upgrades.droneAttack<=0)return;
    ctx.fillStyle='#69f0ae';ctx.shadowColor='#69f0ae';ctx.shadowBlur=8;
    ctx.beginPath();ctx.moveTo(assistant.x+shakeX,assistant.y-8+shakeY);ctx.lineTo(assistant.x+7+shakeX,assistant.y+5+shakeY);ctx.lineTo(assistant.x-7+shakeX,assistant.y+5+shakeY);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
}

function updateHazards(){
    if(gameState.phase!=='playing')return;
    if(gameState.stage>=15){
        if(gameState.hazardTimer>0)gameState.hazardTimer--;
        else{
            if(Math.random()<0.005){
                gameState.currentHazard=Math.random()<0.5?'meteor':'solar';
                gameState.hazardTimer=600;
                showWaveAnnounce(gameState.currentHazard==='meteor'?'\u26a0 CHUVA DE METEOROS \u26a0':'\u26a0 TEMPESTADE SOLAR \u26a0');
            }
        }
        if(gameState.hazardTimer>0){
            if(gameState.currentHazard==='meteor'&&Math.random()<0.05){
                hazards.push({x:rand(0,canvas.width),y:-50,vx:rand(-2,2),vy:rand(4,8),size:rand(15,30),hp:100});
            }
            if(gameState.currentHazard==='solar'&&gameState.hazardTimer%30===0){
                if(player.shield>0)player.shield--;else player.hp-=0.5;
            }
        }else{
            gameState.currentHazard=null;
        }
    }
    for(let i=hazards.length-1;i>=0;i--){
        let h=hazards[i];h.x+=h.vx;h.y+=h.vy;
        if(dist(player,h)<h.size+15){damagePlayer(30);spawnParticles(h.x,h.y,'#9e9e9e',20,4,30);hazards.splice(i,1);triggerShake(10);continue;}
        if(h.y>canvas.height+50)hazards.splice(i,1);
    }
}

function drawHazards(){
    for(let h of hazards){
        ctx.fillStyle='#757575';ctx.beginPath();ctx.arc(h.x+shakeX,h.y+shakeY,h.size,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#424242';ctx.lineWidth=3;ctx.stroke();
    }
    if(gameState.currentHazard==='solar'){
        ctx.fillStyle='rgba(255,100,0,0.1)';ctx.fillRect(0,0,canvas.width,canvas.height);
    }
}
