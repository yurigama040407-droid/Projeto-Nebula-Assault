// ============================================================
// NEBULA ASSAULT — Procedural Sprite Generator (v4)
// ============================================================
const SPRITES = {};

// --- Optional: use external images from /img/ ---
// If files exist in img/, they will override procedural sprites.
// This lets you drop new enemy images without editing code.
// Mapping is based on filename convention:
//   scout.png -> SPRITES.scout
//   fighter.png -> SPRITES.fighter
//   etc.
// You can also use e.g. enemy_scout_new.png and then add a mapping below.
const IMG_SPRITE_MAP = {
    player: 'player.png',
    scout: 'scout.png',
    fighter: 'fighter.png',
    heavy: 'heavy.png',
    elite: 'elite.png',
    bomber: 'bomber.png',
    phantom: 'phantom.png',
    sniper: 'sniper.png',
    paladin: 'paladin.png',
    healer: 'healer.png',
    boss: 'boss.png',
    droneAttack: 'droneAttack.png',
    droneCollector: 'droneCollector.png',
    droneHealer: 'droneHealer.png',
    loot: 'loot.png',
    projectilePlayer: 'projectilePlayer.png',
    projectileEnemy: 'projectileEnemy.png',
    powerupHeal: 'powerupHeal.png',
    powerupShield: 'powerupShield.png',
    powerupFury: 'powerupFury.png',
    asteroid: 'asteroid.png',
    asteroidHeavy: 'asteroidHeavy.png'
};

function tryLoadSpriteFromImg(key, fileName) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            SPRITES[key] = img;
            resolve(true);
        };
        img.onerror = () => resolve(false);
        img.src = 'img/' + fileName;
    });
}


function createCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
}

function generatePlayerSprite() {
    const c = createCanvas(64, 64);
    const x = c.getContext('2d');
    const cx = 32, cy = 32;
    // Body
    x.fillStyle = '#b0bec5';
    x.beginPath();
    x.moveTo(cx, 6); x.lineTo(cx + 18, 48); x.lineTo(cx + 22, 52);
    x.lineTo(cx - 22, 52); x.lineTo(cx - 18, 48); x.closePath();
    x.fill();
    // Wings
    x.fillStyle = '#78909c';
    x.beginPath(); x.moveTo(cx - 10, 36); x.lineTo(cx - 26, 54); x.lineTo(cx - 8, 48); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(cx + 10, 36); x.lineTo(cx + 26, 54); x.lineTo(cx + 8, 48); x.closePath(); x.fill();
    // Cockpit
    x.fillStyle = '#00e5ff';
    x.shadowColor = '#00e5ff'; x.shadowBlur = 8;
    x.beginPath(); x.ellipse(cx, 24, 4, 8, 0, 0, Math.PI * 2); x.fill();
    // Details
    x.shadowBlur = 0;
    x.strokeStyle = '#00e5ff'; x.lineWidth = 1;
    x.beginPath(); x.moveTo(cx - 6, 40); x.lineTo(cx - 6, 50); x.stroke();
    x.beginPath(); x.moveTo(cx + 6, 40); x.lineTo(cx + 6, 50); x.stroke();
    return c;
}

function generateScoutSprite() {
    const c = createCanvas(48, 48);
    const x = c.getContext('2d');
    const cx = 24, cy = 24;
    x.fillStyle = '#78909c';
    x.beginPath();
    x.moveTo(cx, cy + 16); x.lineTo(cx - 12, cy - 10); x.lineTo(cx, cy - 16);
    x.lineTo(cx + 12, cy - 10); x.closePath(); x.fill();
    x.fillStyle = '#b0bec5';
    x.beginPath(); x.arc(cx, cy - 2, 5, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#fff';
    x.beginPath(); x.arc(cx, cy - 2, 2.5, 0, Math.PI * 2); x.fill();
    // Engine glow
    x.fillStyle = '#546e7a'; x.shadowColor = '#90a4ae'; x.shadowBlur = 6;
    x.fillRect(cx - 4, cy - 18, 3, 5);
    x.fillRect(cx + 1, cy - 18, 3, 5);
    x.shadowBlur = 0;
    return c;
}

function generateFighterSprite() {
    const c = createCanvas(48, 48);
    const x = c.getContext('2d');
    const cx = 24, cy = 24;
    // Wings
    x.fillStyle = '#c62828';
    x.beginPath();
    x.moveTo(cx, cy - 6); x.lineTo(cx - 20, cy + 6); x.lineTo(cx - 16, cy + 16);
    x.lineTo(cx, cy + 10); x.closePath(); x.fill();
    x.beginPath();
    x.moveTo(cx, cy - 6); x.lineTo(cx + 20, cy + 6); x.lineTo(cx + 16, cy + 16);
    x.lineTo(cx, cy + 10); x.closePath(); x.fill();
    // Body
    x.fillStyle = '#ef5350';
    x.beginPath();
    x.moveTo(cx, cy + 18); x.lineTo(cx - 8, cy - 12); x.lineTo(cx, cy - 18);
    x.lineTo(cx + 8, cy - 12); x.closePath(); x.fill();
    // Cockpit
    x.fillStyle = '#ff8a80'; x.shadowColor = '#ff1744'; x.shadowBlur = 6;
    x.beginPath(); x.ellipse(cx, cy, 3, 5, 0, 0, Math.PI * 2); x.fill();
    x.shadowBlur = 0;
    return c;
}

function generateHeavySprite() {
    const c = createCanvas(56, 56);
    const x = c.getContext('2d');
    const cx = 28, cy = 28;
    const s = 18;
    // Hexagon body
    x.fillStyle = '#e65100';
    x.beginPath();
    for (let a = 0; a < 6; a++) {
        const ang = Math.PI / 3 * a - Math.PI / 2;
        x.lineTo(cx + s * Math.cos(ang), cy + s * Math.sin(ang));
    }
    x.closePath(); x.fill();
    // Armor plates
    x.strokeStyle = '#bf360c'; x.lineWidth = 2;
    x.stroke();
    x.fillStyle = '#ff9800';
    x.beginPath();
    for (let a = 0; a < 6; a++) {
        const ang = Math.PI / 3 * a - Math.PI / 2;
        x.lineTo(cx + s * 0.65 * Math.cos(ang), cy + s * 0.65 * Math.sin(ang));
    }
    x.closePath(); x.fill();
    // Core
    x.fillStyle = '#fff3e0'; x.shadowColor = '#ff9800'; x.shadowBlur = 10;
    x.beginPath(); x.arc(cx, cy, 5, 0, Math.PI * 2); x.fill();
    x.shadowBlur = 0;
    // Cannons
    x.fillStyle = '#bf360c';
    x.fillRect(cx - 22, cy - 3, 8, 6);
    x.fillRect(cx + 14, cy - 3, 8, 6);
    return c;
}

function generateEliteSprite() {
    const c = createCanvas(56, 56);
    const x = c.getContext('2d');
    const cx = 28, cy = 28;
    const s = 18;
    // Star shape
    x.fillStyle = '#9c27b0';
    x.beginPath();
    for (let a = 0; a < 10; a++) {
        const ang = Math.PI / 5 * a - Math.PI / 2;
        const r = a % 2 === 0 ? s : s * 0.5;
        x.lineTo(cx + r * Math.cos(ang), cy + r * Math.sin(ang));
    }
    x.closePath(); x.fill();
    x.strokeStyle = '#e040fb'; x.lineWidth = 1.5; x.stroke();
    // Inner ring
    x.fillStyle = '#e040fb'; x.shadowColor = '#e040fb'; x.shadowBlur = 12;
    x.beginPath(); x.arc(cx, cy, 7, 0, Math.PI * 2); x.fill();
    // Eye
    x.fillStyle = '#fff';
    x.beginPath(); x.arc(cx, cy, 3, 0, Math.PI * 2); x.fill();
    x.shadowBlur = 0;
    return c;
}

function generateBomberSprite() {
    const c = createCanvas(52, 52);
    const x = c.getContext('2d');
    const cx = 26, cy = 26;
    // Outer shell
    x.fillStyle = '#bf360c';
    x.beginPath(); x.arc(cx, cy, 16, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#ff6e40'; x.lineWidth = 2; x.stroke();
    // Inner danger
    x.fillStyle = '#ff6e40'; x.shadowColor = '#ff3d00'; x.shadowBlur = 8;
    x.beginPath(); x.arc(cx, cy, 9, 0, Math.PI * 2); x.fill();
    // Warning symbol
    x.shadowBlur = 0;
    x.fillStyle = '#fff';
    x.font = 'bold 14px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('!', cx, cy + 1);
    // Fuse lines
    x.strokeStyle = '#ff9e80'; x.lineWidth = 1.5;
    for (let a = 0; a < 4; a++) {
        const ang = Math.PI / 2 * a + Math.PI / 4;
        x.beginPath();
        x.moveTo(cx + 12 * Math.cos(ang), cy + 12 * Math.sin(ang));
        x.lineTo(cx + 19 * Math.cos(ang), cy + 19 * Math.sin(ang));
        x.stroke();
    }
    return c;
}

function generatePhantomSprite() {
    const c = createCanvas(52, 52);
    const x = c.getContext('2d');
    const cx = 26, cy = 24;
    // Ghost body
    x.fillStyle = '#7c4dff';
    x.globalAlpha = 0.8;
    x.beginPath();
    x.arc(cx, cy - 2, 14, Math.PI, 0);
    x.lineTo(cx + 14, cy + 14);
    for (let w = 0; w < 5; w++) {
        const wx = cx + 14 - 7 * w;
        x.lineTo(wx - 2.5, cy + 8);
        x.lineTo(wx - 5.6, cy + 14);
    }
    x.closePath(); x.fill();
    x.globalAlpha = 1;
    // Eyes
    x.fillStyle = '#fff';
    x.beginPath(); x.arc(cx - 5, cy - 4, 4, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.arc(cx + 5, cy - 4, 4, 0, Math.PI * 2); x.fill();
    // Pupils
    x.fillStyle = '#311b92';
    x.beginPath(); x.arc(cx - 4, cy - 3, 2, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.arc(cx + 6, cy - 3, 2, 0, Math.PI * 2); x.fill();
    // Glow
    x.shadowColor = '#b388ff'; x.shadowBlur = 15;
    x.strokeStyle = '#b388ff'; x.lineWidth = 1; x.globalAlpha = 0.5;
    x.beginPath(); x.arc(cx, cy, 18, 0, Math.PI * 2); x.stroke();
    x.globalAlpha = 1; x.shadowBlur = 0;
    return c;
}

function generateSniperSprite() {
    const c = createCanvas(48, 48);
    const x = c.getContext('2d');
    const cx = 24, cy = 24;
    // Long body
    x.fillStyle = '#d32f2f';
    x.beginPath();
    x.moveTo(cx, cy + 20); x.lineTo(cx - 6, cy - 4); x.lineTo(cx - 4, cy - 16);
    x.lineTo(cx + 4, cy - 16); x.lineTo(cx + 6, cy - 4); x.closePath(); x.fill();
    // Barrel
    x.fillStyle = '#b71c1c';
    x.fillRect(cx - 1.5, cy + 16, 3, 8);
    // Scope
    x.fillStyle = '#ff5252'; x.shadowColor = '#ff1744'; x.shadowBlur = 8;
    x.beginPath(); x.arc(cx, cy + 22, 3, 0, Math.PI * 2); x.fill();
    // Wings
    x.shadowBlur = 0;
    x.fillStyle = '#c62828';
    x.beginPath(); x.moveTo(cx - 4, cy); x.lineTo(cx - 16, cy + 8); x.lineTo(cx - 6, cy + 6); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(cx + 4, cy); x.lineTo(cx + 16, cy + 8); x.lineTo(cx + 6, cy + 6); x.closePath(); x.fill();
    // Cockpit
    x.fillStyle = '#ff8a80';
    x.beginPath(); x.ellipse(cx, cy - 6, 3, 4, 0, 0, Math.PI * 2); x.fill();
    return c;
}

function generatePaladinSprite() {
    const c = createCanvas(64, 64);
    const x = c.getContext('2d');
    const cx = 32, cy = 32;
    const s = 22;
    // Shield hexagon
    x.fillStyle = '#006064';
    x.beginPath();
    for (let a = 0; a < 6; a++) {
        const ang = Math.PI / 3 * a - Math.PI / 2;
        x.lineTo(cx + s * Math.cos(ang), cy + s * Math.sin(ang));
    }
    x.closePath(); x.fill();
    // Shield glow border
    x.strokeStyle = '#00e5ff'; x.lineWidth = 3; x.shadowColor = '#00e5ff'; x.shadowBlur = 12;
    x.stroke();
    // Inner armor
    x.shadowBlur = 0;
    x.fillStyle = '#00838f';
    x.beginPath();
    for (let a = 0; a < 6; a++) {
        const ang = Math.PI / 3 * a - Math.PI / 2;
        x.lineTo(cx + s * 0.6 * Math.cos(ang), cy + s * 0.6 * Math.sin(ang));
    }
    x.closePath(); x.fill();
    // Core
    x.fillStyle = '#80deea'; x.shadowColor = '#00e5ff'; x.shadowBlur = 10;
    x.beginPath(); x.arc(cx, cy, 6, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#fff';
    x.beginPath(); x.arc(cx, cy, 3, 0, Math.PI * 2); x.fill();
    x.shadowBlur = 0;
    // Side cannons
    x.fillStyle = '#004d40';
    x.fillRect(cx - 28, cy - 4, 10, 8);
    x.fillRect(cx + 18, cy - 4, 10, 8);
    return c;
}

function generateHealerSprite() {
    const c = createCanvas(52, 52);
    const x = c.getContext('2d');
    const cx = 26, cy = 26;
    // Body circle
    x.fillStyle = '#1b5e20';
    x.beginPath(); x.arc(cx, cy, 15, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#69f0ae'; x.lineWidth = 2; x.shadowColor = '#69f0ae'; x.shadowBlur = 10;
    x.stroke();
    // Cross symbol
    x.shadowBlur = 0;
    x.fillStyle = '#69f0ae';
    x.fillRect(cx - 3, cy - 10, 6, 20);
    x.fillRect(cx - 10, cy - 3, 20, 6);
    // Inner glow
    x.fillStyle = '#b9f6ca'; x.shadowColor = '#69f0ae'; x.shadowBlur = 8;
    x.beginPath(); x.arc(cx, cy, 4, 0, Math.PI * 2); x.fill();
    x.shadowBlur = 0;
    // Orbiting particles positions (decorative)
    x.fillStyle = '#a5d6a7';
    for (let i = 0; i < 4; i++) {
        const ang = Math.PI / 2 * i + Math.PI / 4;
        x.beginPath(); x.arc(cx + 20 * Math.cos(ang), cy + 20 * Math.sin(ang), 2.5, 0, Math.PI * 2); x.fill();
    }
    return c;
}

function generateBossSprite() {
    const c = createCanvas(128, 128);
    const x = c.getContext('2d');
    const cx = 64, cy = 64;
    const s = 48;
    // Octagon body
    x.fillStyle = '#1a1a2e';
    x.beginPath();
    for (let a = 0; a < 8; a++) {
        const ang = Math.PI / 4 * a - Math.PI / 2;
        x.lineTo(cx + s * Math.cos(ang), cy + s * Math.sin(ang));
    }
    x.closePath(); x.fill();
    // Outer glow ring
    x.strokeStyle = '#ff6d00'; x.lineWidth = 3; x.shadowColor = '#ff6d00'; x.shadowBlur = 15;
    x.stroke();
    // Inner rotating diamond
    x.shadowBlur = 0;
    x.strokeStyle = '#fff'; x.lineWidth = 1.5;
    x.beginPath();
    for (let a = 0; a < 4; a++) {
        const ang = Math.PI / 2 * a;
        x.lineTo(cx + s * 0.6 * Math.cos(ang), cy + s * 0.6 * Math.sin(ang));
    }
    x.closePath(); x.stroke();
    // Armored sections
    x.fillStyle = '#0d0d1a';
    for (let a = 0; a < 8; a++) {
        const ang = Math.PI / 4 * a - Math.PI / 2;
        const ang2 = Math.PI / 4 * (a + 1) - Math.PI / 2;
        x.beginPath();
        x.moveTo(cx, cy);
        x.lineTo(cx + s * 0.85 * Math.cos(ang), cy + s * 0.85 * Math.sin(ang));
        x.lineTo(cx + s * 0.85 * Math.cos(ang2), cy + s * 0.85 * Math.sin(ang2));
        x.closePath();
        if (a % 2 === 0) { x.fillStyle = '#1a1a2e'; x.fill(); }
    }
    // Eye / Core
    x.fillStyle = '#ff6d00'; x.shadowColor = '#ff6d00'; x.shadowBlur = 20;
    x.beginPath(); x.arc(cx, cy, 14, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#fff';
    x.beginPath(); x.arc(cx, cy, 7, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#ff6d00';
    x.beginPath(); x.arc(cx, cy, 3, 0, Math.PI * 2); x.fill();
    x.shadowBlur = 0;
    // Weapon ports
    x.fillStyle = '#ff9800';
    const ports = [[-40, -10], [40, -10], [-30, 30], [30, 30]];
    for (const [px, py] of ports) {
        x.beginPath(); x.arc(cx + px, cy + py, 5, 0, Math.PI * 2); x.fill();
    }
    return c;
}

function generateDroneAttackSprite() {
    const c = createCanvas(24, 24);
    const x = c.getContext('2d');
    x.fillStyle = '#ff1744'; x.shadowColor = '#ff1744'; x.shadowBlur = 4;
    x.beginPath(); x.moveTo(12, 2); x.lineTo(22, 18); x.lineTo(12, 14); x.lineTo(2, 18); x.closePath(); x.fill();
    x.fillStyle = '#ff8a80';
    x.beginPath(); x.arc(12, 10, 3, 0, Math.PI * 2); x.fill();
    x.shadowBlur = 0;
    return c;
}

function generateDroneHealerSprite() {
    const c = createCanvas(24, 24);
    const x = c.getContext('2d');
    x.fillStyle = '#00e676'; x.shadowColor = '#00e676'; x.shadowBlur = 4;
    x.beginPath(); x.moveTo(12, 2); x.lineTo(22, 18); x.lineTo(12, 14); x.lineTo(2, 18); x.closePath(); x.fill();
    x.fillStyle = '#b9f6ca';
    x.fillRect(10, 7, 4, 10); x.fillRect(7, 10, 10, 4);
    x.shadowBlur = 0;
    return c;
}

function generateDroneCollectorSprite() {
    const c = createCanvas(24, 24);
    const x = c.getContext('2d');
    x.fillStyle = '#00e5ff'; x.shadowColor = '#00e5ff'; x.shadowBlur = 4;
    x.beginPath(); x.moveTo(12, 2); x.lineTo(22, 18); x.lineTo(12, 14); x.lineTo(2, 18); x.closePath(); x.fill();
    x.fillStyle = '#80deea';
    x.beginPath(); x.arc(12, 10, 3, 0, Math.PI * 2); x.fill();
    x.shadowBlur = 0;
    return c;
}

function generateExplosionFrames() {
    const frames = [];
    for (let f = 0; f < 8; f++) {
        const c = createCanvas(64, 64);
        const x = c.getContext('2d');
        const cx = 32, cy = 32;
        const progress = f / 7;
        const radius = 8 + progress * 24;
        const alpha = 1 - progress * 0.8;
        x.globalAlpha = alpha;
        // Outer ring
        x.fillStyle = '#ff6d00';
        x.beginPath(); x.arc(cx, cy, radius, 0, Math.PI * 2); x.fill();
        // Middle
        x.fillStyle = '#ffab40';
        x.beginPath(); x.arc(cx, cy, radius * 0.7, 0, Math.PI * 2); x.fill();
        // Core
        x.fillStyle = '#fff';
        x.beginPath(); x.arc(cx, cy, radius * 0.3, 0, Math.PI * 2); x.fill();
        frames.push(c);
    }
    return frames;
}

function generateProjectilePlayerSprite() {
    const c = createCanvas(8, 20);
    const x = c.getContext('2d');
    x.fillStyle = '#00e5ff'; x.shadowColor = '#00e5ff'; x.shadowBlur = 6;
    x.fillRect(2.5, 0, 3, 18);
    x.fillStyle = '#fff';
    x.fillRect(3, 2, 2, 10);
    x.shadowBlur = 0;
    return c;
}

function generateProjectileEnemySprite() {
    const c = createCanvas(12, 12);
    const x = c.getContext('2d');
    x.fillStyle = '#ff5252'; x.shadowColor = '#ff1744'; x.shadowBlur = 6;
    x.beginPath(); x.arc(6, 6, 5, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#fff';
    x.beginPath(); x.arc(6, 6, 2, 0, Math.PI * 2); x.fill();
    x.shadowBlur = 0;
    return c;
}

function generatePowerupSprite(type) {
    const c = createCanvas(32, 32);
    const x = c.getContext('2d');
    const colors = { heal: '#00e676', shield: '#00b0ff', fury: '#ff1744' };
    const icons = { heal: '♥', shield: '◆', fury: '★' };
    const col = colors[type] || '#fff';
    x.fillStyle = col; x.globalAlpha = 0.3;
    x.beginPath(); x.arc(16, 16, 14, 0, Math.PI * 2); x.fill();
    x.globalAlpha = 1;
    x.fillStyle = col; x.shadowColor = col; x.shadowBlur = 8;
    x.beginPath(); x.arc(16, 16, 10, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#fff';
    x.font = 'bold 14px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(icons[type], 16, 17);
    x.shadowBlur = 0;
    return c;
}

function generateAsteroidSprite(isHeavy) {
    const c = createCanvas(48, 48);
    const x = c.getContext('2d');
    const cx = 24, cy = 24;
    const col = isHeavy ? '#303030' : '#757575';
    const sCol = isHeavy ? '#111' : '#424242';
    // Irregular shape
    x.fillStyle = col;
    x.beginPath();
    for (let a = 0; a < 10; a++) {
        const ang = Math.PI * 2 / 10 * a;
        const r = 16 + Math.sin(a * 2.7) * 5;
        x.lineTo(cx + r * Math.cos(ang), cy + r * Math.sin(ang));
    }
    x.closePath(); x.fill();
    x.strokeStyle = sCol; x.lineWidth = 2; x.stroke();
    // Crater
    x.fillStyle = sCol;
    x.beginPath(); x.arc(cx - 4, cy - 3, 4, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.arc(cx + 6, cy + 4, 3, 0, Math.PI * 2); x.fill();
    return c;
}

function generateLootSprite() {
    const c = createCanvas(16, 16);
    const x = c.getContext('2d');
    x.fillStyle = '#ffd740'; x.shadowColor = '#ffd740'; x.shadowBlur = 6;
    // Diamond shape
    x.beginPath();
    x.moveTo(8, 1); x.lineTo(14, 8); x.lineTo(8, 15); x.lineTo(2, 8); x.closePath();
    x.fill();
    x.fillStyle = '#fff';
    x.beginPath(); x.arc(8, 8, 2, 0, Math.PI * 2); x.fill();
    x.shadowBlur = 0;
    return c;
}

// --- Load all sprites ---
function loadAssets(callback) {
    // Procedural defaults (fallback)
    SPRITES.player = generatePlayerSprite();

    SPRITES.scout = generateScoutSprite();
    SPRITES.fighter = generateFighterSprite();
    SPRITES.heavy = generateHeavySprite();
    SPRITES.elite = generateEliteSprite();
    SPRITES.bomber = generateBomberSprite();
    SPRITES.phantom = generatePhantomSprite();
    SPRITES.sniper = generateSniperSprite();
    SPRITES.paladin = generatePaladinSprite();
    SPRITES.healer = generateHealerSprite();
    SPRITES.boss = generateBossSprite();
    SPRITES.droneAttack = generateDroneAttackSprite();
    SPRITES.droneHealer = generateDroneHealerSprite();
    SPRITES.droneCollector = generateDroneCollectorSprite();
    SPRITES.explosion = generateExplosionFrames();
    SPRITES.projectilePlayer = generateProjectilePlayerSprite();
    SPRITES.projectileEnemy = generateProjectileEnemySprite();
    SPRITES.powerupHeal = generatePowerupSprite('heal');
    SPRITES.powerupShield = generatePowerupSprite('shield');
    SPRITES.powerupFury = generatePowerupSprite('fury');
    SPRITES.asteroid = generateAsteroidSprite(false);
    SPRITES.asteroidHeavy = generateAsteroidSprite(true);
    SPRITES.loot = generateLootSprite();

    // Optionally override with external images if present
    const loadPromises = [];
    for (const [key, fileName] of Object.entries(IMG_SPRITE_MAP)) {
        loadPromises.push(tryLoadSpriteFromImg(key, fileName));
    }

    Promise.all(loadPromises)
        .catch(() => {})
        .finally(() => {
            console.log('Sprites loaded (procedural fallback + optional img overrides).');
            if (callback) callback();
        });
}

