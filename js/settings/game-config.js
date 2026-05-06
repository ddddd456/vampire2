const CONFIG = {
  // World
  WORLD_W: 6400,
  WORLD_H: 6400,
  TILE_SIZE: 64,

  // Player
  PLAYER_BASE_HP: 100,
  PLAYER_BASE_SPEED: 200,
  PLAYER_RADIUS: 14,
  PLAYER_IFRAMES: 800, // ms invincibility after hit

  // XP
  XP_LEVELS: (() => {
    const arr = [0];
    for (let i = 1; i <= 60; i++) {
      arr.push(arr[i - 1] + Math.floor(5 + i * 8 + i * i * 0.8));
    }
    return arr;
  })(),

  // Camera
  CAM_LERP: 0.12,

  // Spawn
  SPAWN_RADIUS_MIN: 600,
  SPAWN_RADIUS_MAX: 800,

  // Game duration (seconds) — 15 min
  GAME_DURATION: 900,

  // Tile colors
  TILE_COLORS: ['#1a2a14','#162211','#1e2e16','#182412','#1c2813'],
  TILE_DETAIL_COLORS: ['#0e1a0c','#122010','#0c1808'],

  // Enemy types
  ENEMY_TYPES: {
    BAT: {
      id: 'BAT', name: 'Летучая мышь', emoji: '🦇',
      hp: 18, speed: 130, damage: 8, xp: 2, radius: 10,
      color: '#6a0dad', colorInner: '#9030d0',
      scoreValue: 10
    },
    SKELETON: {
      id: 'SKELETON', name: 'Скелет', emoji: '💀',
      hp: 45, speed: 75, damage: 15, xp: 5, radius: 14,
      color: '#c8b87a', colorInner: '#ddd0a0',
      scoreValue: 20
    },
    ZOMBIE: {
      id: 'ZOMBIE', name: 'Зомби', emoji: '🧟',
      hp: 80, speed: 55, damage: 20, xp: 8, radius: 16,
      color: '#2d5a2d', colorInner: '#4a8a4a',
      scoreValue: 30
    },
    GHOST: {
      id: 'GHOST', name: 'Призрак', emoji: '👻',
      hp: 30, speed: 100, damage: 12, xp: 6, radius: 13,
      color: 'rgba(150,180,255,0.7)', colorInner: 'rgba(200,220,255,0.9)',
      scoreValue: 25, phasing: true
    },
    ORC: {
      id: 'ORC', name: 'Орк', emoji: '👹',
      hp: 200, speed: 50, damage: 30, xp: 20, radius: 22,
      color: '#2a5a10', colorInner: '#50a030',
      scoreValue: 80
    },
    VAMPIRE: {
      id: 'VAMPIRE', name: 'Вампир', emoji: '🧛',
      hp: 120, speed: 95, damage: 25, xp: 15, radius: 16,
      color: '#8b0000', colorInner: '#c0152a',
      scoreValue: 60
    },
    DEMON: {
      id: 'DEMON', name: 'Демон', emoji: '😈',
      hp: 350, speed: 70, damage: 40, xp: 40, radius: 24,
      color: '#8b0000', colorInner: '#ff2222',
      scoreValue: 150, isBoss: true
    },
    LICH: {
      id: 'LICH', name: 'Лич', emoji: '☠️',
      hp: 600, speed: 60, damage: 50, xp: 80, radius: 28,
      color: '#3a0070', colorInner: '#9000ff',
      scoreValue: 300, isBoss: true
    }
  },

  // Spawn waves — by minute
  SPAWN_WAVES: [
    { time: 0,   types: ['BAT'], rate: 1.8 },
    { time: 30,  types: ['BAT', 'SKELETON'], rate: 1.5 },
    { time: 60,  types: ['BAT', 'SKELETON', 'ZOMBIE'], rate: 1.2 },
    { time: 90,  types: ['SKELETON', 'ZOMBIE', 'GHOST'], rate: 1.0 },
    { time: 120, types: ['ZOMBIE', 'GHOST', 'ORC'], rate: 0.9 },
    { time: 180, types: ['GHOST', 'ORC', 'VAMPIRE'], rate: 0.75 },
    { time: 240, types: ['ORC', 'VAMPIRE', 'DEMON'], rate: 0.6 },
    { time: 360, types: ['VAMPIRE', 'DEMON', 'LICH'], rate: 0.5 },
    { time: 480, types: ['DEMON', 'LICH'], rate: 0.4 }
  ],

  // XP gem sizes
  XP_GEM_SIZES: {
    small:  { r: 5,  xp: 2,  color: '#5dade2' },
    medium: { r: 7,  xp: 6,  color: '#a855f7' },
    large:  { r: 10, xp: 15, color: '#f59e0b' }
  },

  // ---- HEROES ----
  HEROES: {
    WARRIOR: {
      id: 'WARRIOR',
      name: 'Воин',
      title: 'Страж Рассвета',
      desc: 'Крепкий боец ближнего боя. Высокое HP и броня, начинает с мечом.',
      emoji: '⚔️',
      color: '#c0152a',
      startWeapon: 'SWORD_ARC',
      bonuses: { maxHp: 150, armor: 2, speed: 180 },
      passiveBonus: 'Каждые 5 убийств +1 броня (макс +5)'
    },
    WITCH: {
      id: 'WITCH',
      name: 'Ведьма',
      title: 'Повелительница Теней',
      desc: 'Мастер магии. Высокий урон заклинаний, бонус к перезарядке.',
      emoji: '🔮',
      color: '#9020e0',
      startWeapon: 'MAGIC_BOLT',
      bonuses: { maxHp: 80, cdMult: 0.8, dmgMult: 1.3, speed: 210 },
      passiveBonus: '+30% урон магии, -20% перезарядка'
    },
    RANGER: {
      id: 'RANGER',
      name: 'Следопыт',
      title: 'Охотник на Нечисть',
      desc: 'Быстрый лучник. Высокая скорость и шанс крита, начинает с огненной палочкой.',
      emoji: '🏹',
      color: '#2ecc71',
      startWeapon: 'FIRE_WAND',
      bonuses: { maxHp: 90, speed: 260, critChance: 20, xpMult: 1.2 },
      passiveBonus: '+20% шанс крита, +20% опыт'
    },
    NECROMANCER: {
      id: 'NECROMANCER',
      name: 'Некромант',
      title: 'Владыка Мёртвых',
      desc: 'Повелитель нежити. Начинает с Косой Душ, восстанавливает HP с убийств.',
      emoji: '💀',
      color: '#6600aa',
      startWeapon: 'SOUL_SCYTHE',
      bonuses: { maxHp: 85, speed: 190, dmgMult: 1.15, cdMult: 0.95 },
      passiveBonus: 'Каждое убийство восстанавливает 0.5 HP'
    },
    BERSERKER: {
      id: 'BERSERKER',
      name: 'Берсерк',
      title: 'Ярость Севера',
      desc: 'Безумный воин. Чем меньше HP — тем больше урон. Начинает с топором.',
      emoji: '🪓',
      color: '#ff4400',
      startWeapon: 'THROWING_AXE',
      bonuses: { maxHp: 120, speed: 230, armor: 1 },
      passiveBonus: 'При HP < 50%: +50% урон и скорость'
    }
  },

  // ---- DIFFICULTY ----
  DIFFICULTIES: {
    EASY: {
      id: 'EASY', name: 'Легко', emoji: '🌿',
      desc: 'Для новичков. Враги слабее, больше HP.',
      enemyHpMult: 0.6, enemyDmgMult: 0.6, enemySpeedMult: 0.85,
      playerHpMult: 1.5, xpMult: 0.8, spawnRateMult: 1.3
    },
    NORMAL: {
      id: 'NORMAL', name: 'Нормально', emoji: '⚔️',
      desc: 'Стандартный режим.',
      enemyHpMult: 1.0, enemyDmgMult: 1.0, enemySpeedMult: 1.0,
      playerHpMult: 1.0, xpMult: 1.0, spawnRateMult: 1.0
    },
    HARD: {
      id: 'HARD', name: 'Сложно', emoji: '💀',
      desc: 'Враги сильнее и быстрее. Больше опыта.',
      enemyHpMult: 1.5, enemyDmgMult: 1.4, enemySpeedMult: 1.2,
      playerHpMult: 0.85, xpMult: 1.3, spawnRateMult: 0.8
    },
    NIGHTMARE: {
      id: 'NIGHTMARE', name: 'Кошмар', emoji: '☠️',
      desc: 'Только для опытных. Враги очень сильны, спавн ускорен.',
      enemyHpMult: 2.2, enemyDmgMult: 2.0, enemySpeedMult: 1.4,
      playerHpMult: 0.7, xpMult: 1.8, spawnRateMult: 0.55
    }
  },

  // ---- CASTLE LOCATION ----
  CASTLE: {
    x: 2200,
    y: -1800,
    width: 640,
    height: 480,
    chestX: 2200,
    chestY: -1800,
    chestWeapon: 'SOUL_SCYTHE',  // legendary weapon inside
    chestOpened: false
  }
};
