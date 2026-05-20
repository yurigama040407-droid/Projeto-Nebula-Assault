// ============================================================
// NEBULA ASSAULT — Game Data & State (MEGA UPGRADE v3)
// ============================================================

const STORY_MOTIVATIONS = [
    "Raptaram sua noiva. A última transmissão veio do centro da nebulosa... Alguém — ou algo — a levou. Você não vai parar até encontrá-la.",
    "A princesa estelar foi sequestrada. O Dono do Universo Conhecido exige sua submissão. Você escolhe a guerra.",
    "Seu ouro foi saqueado. Frotas piratas devastaram suas reservas. Cada moeda será recuperada... com juros em plasma.",
    "Seus diamantes foram roubados. Cristais de energia que mantinham seu planeta vivo. Sem eles, resta apenas escuridão.",
    "Seu planeta foi destruído. Onde antes havia lar, agora há poeira cósmica. Só a vingança mantém seus motores ligados.",
    "Seu clã foi escravizado. O Império Solar corrompeu seus irmãos. Você é o último piloto livre.",
    "Seu mentor desapareceu. O maior piloto da galáxia sumiu perto do Vórtice Proibido. Você vai descobrir o porquê.",
    "Um artefato proibido foi levado. A Chave de Orion — capaz de reescrever a realidade — caiu em mãos erradas."
];

const NPC_PHRASES = [
    '"Bem-vindo, piloto. Seu escudo está deplorável."',
    '"Trouxe peças novas. Vai precisar."',
    '"Cada crédito investido aqui te mantém vivo lá fora."',
    '"Ouvi dizer que o próximo setor é brutal."',
    '"Upgrades? Tenho os melhores da nebulosa."',
    '"Não morra lá fora. Você me deve dinheiro."',
    '"Nova galáxia, novos perigos. Prepare-se."',
    '"Essas skins são lendárias. Valem cada moeda."',
    '"Conseguiu sobreviver? Impressionante."',
    '"Última chance de melhorar antes do caos."'
];

const TRANSITION_MESSAGES = [
    "Missão cumprida.", "Você superou probabilidades impossíveis.",
    "Mais perto do coração do império.", "O inimigo recua... por enquanto.",
    "Seus motores rugem para a próxima batalha.", "A nebulosa escurece à sua frente.",
    "Uma nova galáxia se revela.", "O cosmos treme com seu poder.",
    "Nenhuma força pode detê-lo.", "O universo observa em silêncio."
];

// --- Tips & Strategies ---
const TIPS_DATA = [
    { title: 'Combos', icon: '🔥', text: 'Destrua inimigos em sequência para multiplicar pontos até x10!' },
    { title: 'Auto vs Manual', icon: '🔫', text: 'Pressione F para alternar. AUTO dispara sozinho, MANUAL usa ESPAÇO.' },
    { title: 'Habilidades', icon: '⚡', text: 'Use 1/2/3 para selecionar e SHIFT para ativar. Cada uma tem cooldown.' },
    { title: 'Escudo', icon: '🛡️', text: 'Regenera lentamente e absorve dano antes do HP. Invista no upgrade!' },
    { title: 'Assistente', icon: '👾', text: 'Desbloqueado na fase 3! Um alien que atira automaticamente.' },
    { title: 'Loot', icon: '🧲', text: 'Ouro cai dos inimigos. Upgrade Magnetismo atrai loot à distância.' },
    { title: 'Bosses', icon: '💀', text: 'Fases 5, 8, 12, 16 e 20. Cada um tem padrões únicos!' },
    { title: 'Skins', icon: '🚀', text: 'Desbloqueie avançando fases. Compre no hangar!' },
    { title: 'Armadura', icon: '🪖', text: 'Cada nível reduz dano em 8%. Essencial em fases altas!' },
    { title: 'Sorte', icon: '🍀', text: '+15% ouro por nível. Invista cedo!' },
    { title: 'Nova Collapse', icon: '💥', text: 'Elimina TODOS da tela + 50 ouro bônus!' },
    { title: 'Dano Crítico', icon: '⚡', text: 'Chance de 2x dano (amarelo). Aumenta com nível!' },
    { title: 'Dificuldade', icon: '⚙️', text: 'FÁCIL (0.6x), NORMAL (1x), HARDCORE (1.6x).' },
    { title: 'Bombers', icon: '💣', text: 'Explodem ao morrer! Dano a inimigos próximos E a você!' },
    { title: 'Phantoms', icon: '👻', text: 'Ficam invisíveis periodicamente. Imunes quando transparentes!' },
    { title: 'XP & Nível', icon: '📈', text: 'Ganhe XP por kills. Nível aumenta dano crítico!' }
];

// --- XP System ---
const XP_PER_LEVEL = [0,100,250,500,800,1200,1800,2500,3500,5000,7000,10000,14000,19000,25000];
const XP_REWARDS = {scout:5,fighter:10,heavy:18,elite:30,bomber:14,phantom:25,boss:200};

// --- Galaxy Regions ---
const GALAXY_REGIONS = [
    { name:'Cinturão de Asteroides', stages:[1,2,3,4], bgColor1:'#05060f', bgColor2:'#0a0d1a', nebulaColor:'rgba(0,229,255,0.03)', starColor:'#c8d6e5', description:'Região inicial.' },
    { name:'Nebulosa Vermelha', stages:[5,6,7,8], bgColor1:'#0f0508', bgColor2:'#1a0a0d', nebulaColor:'rgba(255,23,68,0.04)', starColor:'#ffcdd2', description:'Fighters agressivos.' },
    { name:'Vórtice Solar', stages:[9,10,11,12], bgColor1:'#0f0a02', bgColor2:'#1a1205', nebulaColor:'rgba(255,152,0,0.04)', starColor:'#ffe0b2', description:'Heavies blindados.' },
    { name:'Setor Proibido', stages:[13,14,15,16], bgColor1:'#08050f', bgColor2:'#0d0a1a', nebulaColor:'rgba(179,136,255,0.05)', starColor:'#d1c4e9', description:'Bombers e elites.' },
    { name:'Trono do Universo', stages:[17,18,19,20], bgColor1:'#050f0a', bgColor2:'#0a1a12', nebulaColor:'rgba(105,240,174,0.04)', starColor:'#b2dfdb', description:'Onde o Imperador reside.' },
    { name:'Fronteira Sombria', stages:[21,22,23,24], bgColor1:'#020005', bgColor2:'#05020a', nebulaColor:'rgba(100,0,255,0.05)', starColor:'#9c27b0', description:'A luz quase não alcança.' },
    { name:'Cemitério de Naves', stages:[25,26,27,28], bgColor1:'#0a0a0a', bgColor2:'#141414', nebulaColor:'rgba(150,150,150,0.05)', starColor:'#78909c', description:'Escombros e morte.' },
    { name:'Abismo Cósmico', stages:[29,30,31,32], bgColor1:'#001015', bgColor2:'#002025', nebulaColor:'rgba(0,150,255,0.05)', starColor:'#00bcd4', description:'O frio absoluto.' },
    { name:'Dimensão Fraturada', stages:[33,34,35,36], bgColor1:'#1a001a', bgColor2:'#330033', nebulaColor:'rgba(255,0,255,0.05)', starColor:'#e040fb', description:'A realidade quebra aqui.' },
    { name:'O Verdadeiro Vazio', stages:[37,38,39,40], bgColor1:'#000000', bgColor2:'#020202', nebulaColor:'rgba(255,0,0,0.05)', starColor:'#ff1744', description:'O fim de tudo.' }
];

function getRegionForStage(stage){const s=((stage-1)%40)+1;for(const r of GALAXY_REGIONS){if(r.stages.includes(s))return r;}return GALAXY_REGIONS[0];}

// --- Skills ---
const SKILL_DEFS = [
    {id:'shield',name:'Escudo de Emergência',desc:'Ativa escudo temporário',cd:550,dur:240,unlockStage:1},
    {id:'slow',name:'Tempo Lento',desc:'Desacelera inimigos',cd:450,dur:220,unlockStage:4},
    {id:'burst',name:'Dano Explosivo',desc:'Rajada de 24 tiros 2x dano',cd:350,dur:1,unlockStage:6},
    {id:'regen',name:'Regeneração+',desc:'Recupera HP rápido',cd:600,dur:300,unlockStage:8},
    {id:'drones',name:'Drones de Combate',desc:'3 drones poderosos',cd:500,dur:280,unlockStage:11},
    {id:'nova',name:'Nova Collapse',desc:'Limpa tela +50 ouro',cd:800,dur:1,unlockStage:13},
    {id:'missile',name:'Míssil Teleguiado',desc:'3 mísseis perseguidores',cd:400,dur:1,unlockStage:15},
    {id:'magnet',name:'Campo Magnético',desc:'Atrai todo loot',cd:300,dur:180,unlockStage:17},
    {id:'overdrive',name:'Overdrive',desc:'2x velocidade de tiro',cd:550,dur:200,unlockStage:19},
    {id:'teleport',name:'Teleporte',desc:'Teleporta + invencibilidade',cd:450,dur:1,unlockStage:20}
];

// --- Bosses ---
const BOSS_DEFS = [
    {stage:5,name:'TITANUS OMEGA',hp:600,color:'#ff6d00',patterns:['spiral','spread'],special:null},
    {stage:8,name:'ESCORPIÃO ESTELAR',hp:900,color:'#ff1744',patterns:['aimed','wave'],special:'summon'},
    {stage:12,name:'LEVIATHAN NEBULAR',hp:1200,color:'#e040fb',patterns:['spiral','aimed','spread'],special:'barrier'},
    {stage:16,name:'DEVORADOR DE MUNDOS',hp:1600,color:'#b388ff',patterns:['wave','spiral','aimed'],special:'gravity'},
    {stage:20,name:'IMPERADOR CÓSMICO',hp:2200,color:'#ffd740',patterns:['spiral','spread','aimed','wave'],special:'shapeshift'},
    {stage:24,name:'SENTINELA DO ABISMO',hp:3500,color:'#9c27b0',patterns:['spiral','aimed'],special:'summon'},
    {stage:28,name:'ESPECTRO DA MORTE',hp:5000,color:'#78909c',patterns:['spread','wave'],special:'gravity'},
    {stage:32,name:'COLOSSO DE GELO',hp:8000,color:'#00bcd4',patterns:['spiral','spread','wave'],special:'barrier'},
    {stage:36,name:'ANOMALIA DIMENSIONAL',hp:12000,color:'#e040fb',patterns:['aimed','wave','spiral'],special:'shapeshift'},
    {stage:40,name:'DEUS DA NEBULOSA',hp:20000,color:'#ff1744',patterns:['spiral','spread','aimed','wave'],special:'gravity'}
];

// --- Shop ---
const SHOP_ITEMS = [
    {id:'fireRate',name:'CADÊNCIA',desc:'Velocidade de tiro',baseCost:80,maxLvl:999,icon:'🔫'},
    {id:'damage',name:'DANO',desc:'Dano dos projéteis',baseCost:100,maxLvl:999,icon:'💥'},
    {id:'maxHp',name:'CASCO',desc:'HP máximo',baseCost:120,maxLvl:999,icon:'❤️'},
    {id:'maxShield',name:'ESCUDO',desc:'Escudo máximo',baseCost:100,maxLvl:999,icon:'🛡️'},
    {id:'speed',name:'MOTORES',desc:'Velocidade da nave',baseCost:90,maxLvl:999,icon:'🚀'},
    {id:'multishot',name:'MULTI-TIRO',desc:'Tiros adicionais',baseCost:250,maxLvl:10,icon:'✦'},
    {id:'magnet',name:'MAGNETISMO',desc:'Raio de coleta',baseCost:70,maxLvl:999,icon:'🧲'},
    {id:'armor',name:'ARMADURA',desc:'-8% dano por nível',baseCost:150,maxLvl:10,icon:'🪖'},
    {id:'luck',name:'SORTE',desc:'+15% ouro por nível',baseCost:100,maxLvl:999,icon:'🍀'},
    {id:'critDamage',name:'CRÍTICO+',desc:'Dano crítico (+0.2x)',baseCost:200,maxLvl:999,icon:'🗡️'},
    {id:'cooldown',name:'RECARGA RÁPIDA',desc:'-5% cooldown de skills',baseCost:300,maxLvl:10,icon:'⏳'},
    {id:'overclock',name:'OVERCLOCK',desc:'+5% Atributos Globais',baseCost:1000,maxLvl:999,icon:'🔥'},
    {id:'droneAttack',name:'DRONE: ATAQUE',desc:'Atira automaticamente',baseCost:500,maxLvl:5,icon:'👾'},
    {id:'droneCollector',name:'DRONE: COLETA',desc:'Busca ouro longe',baseCost:800,maxLvl:5,icon:'🛸'},
    {id:'droneHealer',name:'DRONE: REPARO',desc:'Cura aos poucos',baseCost:1200,maxLvl:5,icon:'🔧'},
    {id:'lifesteal',name:'ROUBO DE VIDA',desc:'Cura ao dar crítico',baseCost:600,maxLvl:5,icon:'🧛'}
];

// --- Enemies ---
const ENEMY_TYPES = {
    scout:{hp:15,speed:2,score:10,gold:5,color:'#78909c',size:14,fireRate:0,shape:'tri'},
    fighter:{hp:30,speed:1.5,score:20,gold:10,color:'#ef5350',size:16,fireRate:110,shape:'diamond'},
    heavy:{hp:60,speed:1,score:35,gold:20,color:'#ff9800',size:20,fireRate:85,shape:'hex'},
    elite:{hp:100,speed:1.2,score:60,gold:35,color:'#e040fb',size:22,fireRate:65,shape:'star'},
    bomber:{hp:45,speed:0.8,score:30,gold:18,color:'#ff6e40',size:18,fireRate:0,shape:'circle'},
    phantom:{hp:70,speed:1.8,score:50,gold:30,color:'#7c4dff',size:17,fireRate:90,shape:'ghost'},
    sniper:{hp:40,speed:0.5,score:40,gold:25,color:'#ff5252',size:15,fireRate:150,shape:'diamond'},
    paladin:{hp:150,speed:0.6,score:70,gold:40,color:'#00e5ff',size:24,fireRate:80,shape:'hex'},
    healer:{hp:50,speed:0.8,score:45,gold:22,color:'#69f0ae',size:18,fireRate:0,shape:'circle'}
};

const REGION_ENEMY_VARIANTS = {
    0:{},
    1:{scout:'#ef9a9a',fighter:'#e53935',heavy:'#ff7043',elite:'#f06292'},
    2:{scout:'#ffcc80',fighter:'#ffa726',heavy:'#ff8f00',elite:'#ffab40'},
    3:{scout:'#ce93d8',fighter:'#ab47bc',heavy:'#9c27b0',elite:'#ea80fc'},
    4:{scout:'#80cbc4',fighter:'#26a69a',heavy:'#00897b',elite:'#64ffda'}
};

// --- Ship Skins ---
const SHIP_SKINS = [
    {id:'vanguard',name:'Vanguard',bodyColor:'#b0bec5',engineColor:'#00e5ff',cockpitColor:'#00e5ff',cost:0,unlockStage:0,description:'Nave padrão',ability:'dash'},
    {id:'inferno',name:'Inferno',bodyColor:'#e53935',engineColor:'#ff6d00',cockpitColor:'#ff9800',cost:150,unlockStage:3,description:'Forjada em estrela',ability:'burn'},
    {id:'phantom',name:'Phantom',bodyColor:'#6a1b9a',engineColor:'#e040fb',cockpitColor:'#ea80fc',cost:250,unlockStage:6,description:'Invisível',ability:'stealth'},
    {id:'solarflare',name:'Solar Flare',bodyColor:'#f9a825',engineColor:'#fdd835',cockpitColor:'#fff176',cost:400,unlockStage:9,description:'Brilha como sol',ability:'emp'},
    {id:'icebreaker',name:'Ice Breaker',bodyColor:'#42a5f5',engineColor:'#e0f7fa',cockpitColor:'#80d8ff',cost:500,unlockStage:12,description:'Congela tudo',ability:'freeze'},
    {id:'toxicviper',name:'Toxic Viper',bodyColor:'#2e7d32',engineColor:'#69f0ae',cockpitColor:'#b9f6ca',cost:650,unlockStage:15,description:'Veneno cósmico',ability:'poison'},
    {id:'shadowblade',name:'Shadow Blade',bodyColor:'#212121',engineColor:'#ff1744',cockpitColor:'#ff5252',cost:800,unlockStage:18,description:'Terror dos impérios',ability:'execute'},
    {id:'nebulaKing',name:'Nebula King',bodyColor:'#ffffff',engineColor:'#e040fb',cockpitColor:'#00e5ff',cost:1200,unlockStage:20,description:'Rei do universo',rainbow:true,ability:'slow_motion'}
];

const PILOT_SKINS = [
    {id:'default',name:'Piloto Padrão',trailColor:'#00e5ff',auraColor:null,cost:0,unlockStage:0},
    {id:'fire',name:'Chama Estelar',trailColor:'#ff6d00',auraColor:'rgba(255,109,0,0.15)',cost:200,unlockStage:4},
    {id:'ice',name:'Zero Absoluto',trailColor:'#80d8ff',auraColor:'rgba(128,216,255,0.12)',cost:300,unlockStage:7},
    {id:'electric',name:'Raio Cósmico',trailColor:'#ffd740',auraColor:'rgba(255,215,64,0.12)',cost:350,unlockStage:10},
    {id:'void',name:'Abismo do Vazio',trailColor:'#b388ff',auraColor:'rgba(179,136,255,0.15)',cost:500,unlockStage:14},
    {id:'divine',name:'Ascendência Divina',trailColor:'#ffffff',auraColor:'rgba(255,255,255,0.1)',cost:1000,unlockStage:19}
];

const DIFF_MULT={easy:0.6,normal:1,hard:1.6};
let difficulty='normal';

function getWavesForStage(stage){if(stage<=4)return 2;if(stage<=14)return 3;if(stage<=24)return 4;if(stage<=34)return 5;return 6;}

function getEnemyCountForWave(stage,wave){
    let base;
    if(stage<=3)base=3+wave;
    else if(stage<=7)base=5+wave+Math.floor(stage/2);
    else if(stage<=12)base=8+wave+stage;
    else if(stage<=16)base=12+wave+stage;
    else base=16+wave*2+stage*1.5;
    return Math.min(Math.floor(base), 50);
}

function getAvailableEnemyTypes(stage){
    const types=['scout'];
    if(stage>=3)types.push('fighter');if(stage>=6)types.push('heavy');
    if(stage>=9)types.push('bomber');if(stage>=12)types.push('elite');
    if(stage>=15)types.push('phantom');if(stage>=18)types.push('sniper');
    if(stage>=22)types.push('paladin');if(stage>=10)types.push('healer');return types;
}

function getAvailablePaths(stage){
    const paths=['straight','sine'];
    if(stage>=4)paths.push('zigzag');if(stage>=7)paths.push('dive');
    if(stage>=10)paths.push('orbit');if(stage>=14)paths.push('swarm');return paths;
}

const gameState={
    phase:'menu',stage:1,wave:0,wavesPerStage:2,score:0,gold:0,
    totalKills:0,totalGold:0,comboCount:0,comboTimer:0,comboMultiplier:1,
    upgrades:{fireRate:0,damage:0,maxHp:0,maxShield:0,speed:0,multishot:0,magnet:0,armor:0,luck:0,critDamage:0,cooldown:0,overclock:0,droneAttack:0,droneCollector:0,droneHealer:0,lifesteal:0},
    equippedSkills:[0,1,5],skillCooldowns:[0,0,0],skillActive:[0,0,0],activeSkillSlot:0,
    bossActive:false,bossDefeated:false,bestiary:new Set(),
    selectedSkin:0,selectedPilot:0,unlockedSkins:[0],unlockedPilots:[0],
    highestStage:1,autoFire:true,enemiesRemaining:0,screenShake:0,currentRegion:0,
    xp:0,level:1,critChance:0.05,skinAbilityCooldown:0,skinAbilityActive:0,
    activePowerups:{}, hazardTimer:0, currentHazard:null, ambushActive:false
};
