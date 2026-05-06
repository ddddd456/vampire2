
// WEAPONS DATA
const WEAPONS_DATA = {
  // ---- NEW WEAPON 1: ICE_LANCE ----
  ICE_LANCE: {
    id: 'ICE_LANCE', name: 'Ледяное копьё', icon: '🧊',
    desc: 'Пронзает врагов насквозь, замедляя их',
    baseDamage: 28, baseCooldown: 1.3, baseRange: 380,
    projectileCount: 1, speed: 420, piercing: 99,
    slowAmount: 0.5, slowDuration: 1.5,
    rarity: 'rare', maxLevel: 8,
    // Evolution: ICE_LANCE + MAGIC_BOLT → BLIZZARD_STORM (at max level)
    evolutionRequires: 'MAGIC_BOLT',
    evolutionResult: 'BLIZZARD_STORM',
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.1, count: 1, desc: '+10% урон, +1 копьё' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.1, range: 1.2, desc: '+10% урон, +20% дальность' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 копьё' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  // ---- NEW WEAPON 2: SOUL_SCYTHE ----
  SOUL_SCYTHE: {
    id: 'SOUL_SCYTHE', name: 'Коса Душ', icon: '💀',
    desc: 'Огромная коса вращается вокруг персонажа, пожирая души врагов',
    baseDamage: 20, baseCooldown: 0.4, baseRange: 130,
    projectileCount: 1, orbiting: true,
    rarity: 'epic', maxLevel: 8,
    // Evolution: SOUL_SCYTHE + GARLIC → DEATH_SPIRAL
    evolutionRequires: 'GARLIC',
    evolutionResult: 'DEATH_SPIRAL',
    upgrades: [
      { dmg: 1.25, desc: '+25% урон' },
      { dmg: 1.1, range: 1.2, desc: '+10% урон, +20% радиус' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.1, count: 1, desc: '+10% урон, +1 коса' },
      { dmg: 1.3, range: 1.15, desc: '+30% урон, +15% радиус' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  // ---- NEW WEAPON 3: THUNDER_SPEAR ----
  THUNDER_SPEAR: {
    id: 'THUNDER_SPEAR', name: 'Громовое копьё', icon: '⚡',
    desc: 'Мощный удар молнией вперёд, оглушающий врагов',
    baseDamage: 55, baseCooldown: 2.2, baseRange: 300,
    projectileCount: 1, speed: 600, piercing: 3,
    stunDuration: 1.0,
    rarity: 'epic', maxLevel: 8,
    // Evolution: THUNDER_SPEAR + LIGHTNING → STORM_CALLER
    evolutionRequires: 'LIGHTNING',
    evolutionResult: 'STORM_CALLER',
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.15, piercing: 1, desc: '+15% урон, +1 пробитие' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 копьё' },
      { dmg: 1.2, range: 1.2, desc: '+20% урон, +20% дальность' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  // ---- EVOLUTION 1: BLIZZARD_STORM (ICE_LANCE + MAGIC_BOLT) ----
  BLIZZARD_STORM: {
    id: 'BLIZZARD_STORM', name: 'Буря Метели', icon: '❄️',
    desc: 'ЭВОЛЮЦИЯ: Ледяные снаряды во всех направлениях, замораживают врагов',
    baseDamage: 60, baseCooldown: 0.8, baseRange: 450,
    projectileCount: 8, speed: 380, piercing: 99,
    slowAmount: 0.8, slowDuration: 2.5,
    rarity: 'legendary', maxLevel: 8, isEvolution: true,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.15, count: 2, desc: '+15% урон, +2 снаряда' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.3, range: 1.2, desc: '+30% урон, +20% дальность' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.3, count: 2, desc: '+30% урон, +2 снаряда' },
      { dmg: 2.0, desc: '+100% урон (максимум!)' }
    ]
  },

  // ---- EVOLUTION 2: DEATH_SPIRAL (SOUL_SCYTHE + GARLIC) ----
  DEATH_SPIRAL: {
    id: 'DEATH_SPIRAL', name: 'Спираль Смерти', icon: '🌀',
    desc: 'ЭВОЛЮЦИЯ: Несколько кос вращаются с огромной скоростью, высасывая жизнь',
    baseDamage: 35, baseCooldown: 0.2, baseRange: 180,
    projectileCount: 3, orbiting: true, lifeSteal: 0.1,
    rarity: 'legendary', maxLevel: 8, isEvolution: true,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.15, range: 1.2, desc: '+15% урон, +20% радиус' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 коса' },
      { dmg: 1.2, range: 1.15, desc: '+20% урон, +15% радиус' },
      { dmg: 1.3, cd: 0.85, desc: '+30% урон, -15% перезарядка' },
      { dmg: 2.0, desc: '+100% урон (максимум!)' }
    ]
  },

  // ---- EVOLUTION 3: STORM_CALLER (THUNDER_SPEAR + LIGHTNING) ----
  STORM_CALLER: {
    id: 'STORM_CALLER', name: 'Призыватель Бурь', icon: '🌩️',
    desc: 'ЭВОЛЮЦИЯ: Вызывает шторм молний, поражающий всех врагов на экране',
    baseDamage: 80, baseCooldown: 1.5, baseRange: 600,
    projectileCount: 1, chainCount: 10, chainRange: 200,
    stunDuration: 1.5,
    rarity: 'legendary', maxLevel: 8, isEvolution: true,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.15, chain: 3, desc: '+15% урон, +3 цепи' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.3, chainR: 1.3, desc: '+30% урон, +30% радиус цепи' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.3, chain: 5, desc: '+30% урон, +5 цепей' },
      { dmg: 2.0, desc: '+100% урон (максимум!)' }
    ]
  },
  SWORD_ARC: {
    id: 'SWORD_ARC', name: 'Удар мечом', icon: '⚔️',
    desc: 'Наносит урон веером перед персонажем',
    baseDamage: 30, baseCooldown: 0.9, baseRange: 100,
    arcAngle: Math.PI * 0.6, projectileCount: 1,
    rarity: 'common', maxLevel: 8,
    upgrades: [
      { dmg: 1.15, range: 1.1, desc: '+15% урон, +10% дальность' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.2, arc: 1.2, desc: '+20% урон, +20% угол атаки' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 удар' },
      { dmg: 1.2, range: 1.2, desc: '+20% урон, +20% дальность' },
      { dmg: 1.3, cd: 0.85, desc: '+30% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },
  MAGIC_BOLT: {
    id: 'MAGIC_BOLT', name: 'Магический болт', icon: '🔮',
    desc: 'Запускает магические снаряды по случайным врагам',
    baseDamage: 18, baseCooldown: 1.4, baseRange: 350,
    projectileCount: 1, speed: 300, piercing: 1,
    rarity: 'common', maxLevel: 8,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.1, count: 1, desc: '+10% урон, +1 снаряд' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.1, piercing: 1, desc: '+10% урон, +1 пробитие' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 снаряд' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },
  HOLY_WATER: {
    id: 'HOLY_WATER', name: 'Святая вода', icon: '💧',
    desc: 'Бросает флакон, создающий лужу урона',
    baseDamage: 12, baseCooldown: 2.0, baseRange: 200,
    poolDuration: 3.0, poolRadius: 50, tickRate: 0.5,
    rarity: 'rare', maxLevel: 8,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон лужи' },
      { dmg: 1.1, poolR: 1.2, desc: '+10% урон, +20% размер лужи' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.1, poolDur: 1.3, desc: '+10% урон, +30% длительность' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 бросок' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },
  CROSS_BOOMERANG: {
    id: 'CROSS_BOOMERANG', name: 'Крест-бумеранг', icon: '✝️',
    desc: 'Летит прямо, отражается и возвращается',
    baseDamage: 22, baseCooldown: 1.6, baseRange: 300,
    speed: 260, rarity: 'rare', maxLevel: 8,
    upgrades: [
      { dmg: 1.25, desc: '+25% урон' },
      { dmg: 1.1, cd: 0.9, desc: '+10% урон, -10% перезарядка' },
      { dmg: 1.2, count: 1, desc: '+20% урон, +1 крест' },
      { dmg: 1.3, range: 1.2, desc: '+30% урон, +20% дальность' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.2, count: 1, desc: '+20% урон, +1 крест' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },
  LIGHTNING: {
    id: 'LIGHTNING', name: 'Молния', icon: '⚡',
    desc: 'Бьёт молнией по ближайшему врагу, цепляя соседей',
    baseDamage: 40, baseCooldown: 2.5, baseRange: 400,
    chainCount: 2, chainRange: 120,
    rarity: 'epic', maxLevel: 8,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.1, chain: 1, desc: '+10% урон, +1 цепь' },
      { dmg: 1.3, cd: 0.9, desc: '+30% урон, -10% перезарядка' },
      { dmg: 1.2, chain: 1, chainR: 1.2, desc: '+20% урон, +1 цепь, +20% радиус цепи' },
      { dmg: 1.3, cd: 0.85, desc: '+30% урон, -15% перезарядка' },
      { dmg: 1.2, chain: 2, desc: '+20% урон, +2 цепи' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },
  FIRE_WAND: {
    id: 'FIRE_WAND', name: 'Огненная палочка', icon: '🔥',
    desc: 'Стреляет огненным шаром, поджигающим врагов',
    baseDamage: 25, baseCooldown: 1.8, baseRange: 320,
    burnDamage: 5, burnDuration: 3.0, speed: 280,
    rarity: 'common', maxLevel: 8,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.1, burnDmg: 1.3, desc: '+10% урон, +30% поджог' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.1, burnDur: 1.4, count: 1, desc: '+10% урон, дольше поджог, +1 шар' },
      { dmg: 1.3, cd: 0.85, desc: '+30% урон, -15% перезарядка' },
      { dmg: 1.2, burnDmg: 1.5, desc: '+20% урон, +50% поджог' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },
  GARLIC: {
    id: 'GARLIC', name: 'Чеснок', icon: '🧄',
    desc: 'Постоянный АоЕ урон вокруг персонажа',
    baseDamage: 6, baseCooldown: 0.5, baseRange: 90,
    rarity: 'rare', maxLevel: 8,
    upgrades: [
      { dmg: 1.3, desc: '+30% урон' },
      { dmg: 1.1, range: 1.2, desc: '+10% урон, +20% радиус' },
      { dmg: 1.3, cd: 0.85, desc: '+30% урон, -15% перезарядка' },
      { dmg: 1.2, range: 1.15, desc: '+20% урон, +15% радиус' },
      { dmg: 1.2, cd: 0.8, desc: '+20% урон, -20% перезарядка' },
      { dmg: 1.3, range: 1.2, desc: '+30% урон, +20% радиус' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },
  SHADOW_BLADE: {
    id: 'SHADOW_BLADE', name: 'Теневой клинок', icon: '🗡️',
    desc: 'Высокоскоростные клинки в 8 направлениях',
    baseDamage: 14, baseCooldown: 1.1, baseRange: 200,
    projectileCount: 8, speed: 380, piercing: 99,
    rarity: 'epic', maxLevel: 8,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.1, cd: 0.9, desc: '+10% урон, -10% перезарядка' },
      { dmg: 1.3, speed: 1.2, desc: '+30% урон, +20% скорость' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.2, range: 1.2, desc: '+20% урон, +20% дальность' },
      { dmg: 1.3, cd: 0.8, desc: '+30% урон, -20% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  // ========== НОВЫЕ ОБЫЧНЫЕ ОРУЖИЯ ==========

  SPEAR: {
    id: 'SPEAR', name: 'Копьё', icon: '🗡️',
    desc: 'Длинное копьё пронзает врагов насквозь по прямой',
    baseDamage: 35, baseCooldown: 1.4, baseRange: 320,
    projectileCount: 1, speed: 550, piercing: 99,
    rarity: 'common', maxLevel: 8,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.1, count: 1, desc: '+10% урон, +1 копьё' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.2, range: 1.2, desc: '+20% урон, +20% дальность' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 копьё' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  DAGGER_STORM: {
    id: 'DAGGER_STORM', name: 'Шквал кинжалов', icon: '🔪',
    desc: 'Выпускает веер кинжалов вперёд с высокой скоростью',
    baseDamage: 12, baseCooldown: 0.6, baseRange: 260,
    projectileCount: 3, speed: 480, piercing: 1,
    rarity: 'common', maxLevel: 8,
    upgrades: [
      { dmg: 1.2, count: 1, desc: '+20% урон, +1 кинжал' },
      { dmg: 1.1, cd: 0.9, desc: '+10% урон, -10% перезарядка' },
      { dmg: 1.2, count: 1, desc: '+20% урон, +1 кинжал' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.3, count: 2, desc: '+30% урон, +2 кинжала' },
      { dmg: 1.2, range: 1.2, desc: '+20% урон, +20% дальность' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  WAR_HAMMER: {
    id: 'WAR_HAMMER', name: 'Боевой молот', icon: '🔨',
    desc: 'Медленный но мощный удар, оглушает и отбрасывает врагов',
    baseDamage: 80, baseCooldown: 2.8, baseRange: 90,
    projectileCount: 1, stunDuration: 1.2,
    rarity: 'rare', maxLevel: 8,
    upgrades: [
      { dmg: 1.3, desc: '+30% урон' },
      { dmg: 1.2, range: 1.3, desc: '+20% урон, +30% радиус' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 удар' },
      { dmg: 1.2, range: 1.2, desc: '+20% урон, +20% радиус' },
      { dmg: 1.3, cd: 0.8, desc: '+30% урон, -20% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  WHIP: {
    id: 'WHIP', name: 'Хлыст', icon: '〰️',
    desc: 'Хлыст бьёт горизонтально через весь экран',
    baseDamage: 22, baseCooldown: 1.0, baseRange: 500,
    projectileCount: 1, speed: 800, piercing: 99,
    rarity: 'common', maxLevel: 8,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.1, count: 1, desc: '+10% урон, +1 удар' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.2, range: 1.3, desc: '+20% урон, +30% дальность' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 удар' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  THROWING_AXE: {
    id: 'THROWING_AXE', name: 'Метательный топор', icon: '🪓',
    desc: 'Топор летит по дуге и возвращается, нанося урон дважды',
    baseDamage: 38, baseCooldown: 1.8, baseRange: 350,
    projectileCount: 1, speed: 320,
    rarity: 'rare', maxLevel: 8,
    upgrades: [
      { dmg: 1.25, desc: '+25% урон' },
      { dmg: 1.1, count: 1, desc: '+10% урон, +1 топор' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.2, range: 1.2, desc: '+20% урон, +20% дальность' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 топор' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  // ========== НОВЫЕ МАГИЧЕСКИЕ ОРУЖИЯ ==========

  ARCANE_ORB: {
    id: 'ARCANE_ORB', name: 'Тайный шар', icon: '🔵',
    desc: 'Медленный шар парит вокруг игрока и взрывается при контакте',
    baseDamage: 45, baseCooldown: 0.3, baseRange: 110,
    projectileCount: 1, orbiting: true,
    rarity: 'rare', maxLevel: 8,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.1, count: 1, desc: '+10% урон, +1 шар' },
      { dmg: 1.2, range: 1.2, desc: '+20% урон, +20% радиус' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 шар' },
      { dmg: 1.2, range: 1.15, desc: '+20% урон, +15% радиус' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  POISON_CLOUD: {
    id: 'POISON_CLOUD', name: 'Ядовитое облако', icon: '☠️',
    desc: 'Создаёт ядовитое облако под ногами врагов',
    baseDamage: 8, baseCooldown: 1.6, baseRange: 220,
    poolDuration: 4.0, poolRadius: 65, tickRate: 0.4,
    rarity: 'rare', maxLevel: 8,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон яда' },
      { dmg: 1.1, poolR: 1.25, desc: '+10% урон, +25% размер облака' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.1, poolDur: 1.4, desc: '+10% урон, +40% длительность' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 облако' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  METEOR: {
    id: 'METEOR', name: 'Метеор', icon: '☄️',
    desc: 'Вызывает метеор на позицию ближайшего врага с задержкой',
    baseDamage: 120, baseCooldown: 3.5, baseRange: 400,
    poolDuration: 0.5, poolRadius: 80, tickRate: 0.1,
    rarity: 'epic', maxLevel: 8,
    upgrades: [
      { dmg: 1.3, desc: '+30% урон' },
      { dmg: 1.2, poolR: 1.2, desc: '+20% урон, +20% радиус взрыва' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 метеор' },
      { dmg: 1.2, poolR: 1.15, desc: '+20% урон, +15% радиус' },
      { dmg: 1.3, cd: 0.85, desc: '+30% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  // ========== ЭВОЛЮЦИИ НОВЫХ ОРУЖИЙ ==========

  PHANTOM_LANCE: {
    id: 'PHANTOM_LANCE', name: 'Призрачное копьё', icon: '👻',
    desc: 'ЭВОЛЮЦИЯ: Копьё + Теневой клинок. Призрачные копья пронзают всё и телепортируются к врагам',
    baseDamage: 70, baseCooldown: 0.8, baseRange: 450,
    projectileCount: 3, speed: 650, piercing: 99,
    rarity: 'legendary', maxLevel: 8, isEvolution: true,
    evolutionRequires: null,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.2, count: 2, desc: '+20% урон, +2 копья' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.3, range: 1.2, desc: '+30% урон, +20% дальность' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.3, count: 2, desc: '+30% урон, +2 копья' },
      { dmg: 2.0, desc: '+100% урон (максимум!)' }
    ]
  },

  VOID_AXE: {
    id: 'VOID_AXE', name: 'Топор Пустоты', icon: '🌑',
    desc: 'ЭВОЛЮЦИЯ: Топор + Молния. Топоры притягивают врагов и взрываются молнией',
    baseDamage: 90, baseCooldown: 1.2, baseRange: 400,
    projectileCount: 2, speed: 380, chainCount: 4, chainRange: 150,
    rarity: 'legendary', maxLevel: 8, isEvolution: true,
    evolutionRequires: null,
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.2, count: 1, desc: '+20% урон, +1 топор' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.3, chain: 2, desc: '+30% урон, +2 цепи' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 топор' },
      { dmg: 2.0, desc: '+100% урон (максимум!)' }
    ]
  },

  // Эволюция копья
  SPEAR: {
    id: 'SPEAR', name: 'Копьё', icon: '🗡️',
    desc: 'Длинное копьё пронзает врагов насквозь по прямой',
    baseDamage: 35, baseCooldown: 1.4, baseRange: 320,
    projectileCount: 1, speed: 550, piercing: 99,
    rarity: 'common', maxLevel: 8,
    evolutionRequires: 'SHADOW_BLADE',
    evolutionResult: 'PHANTOM_LANCE',
    upgrades: [
      { dmg: 1.2, desc: '+20% урон' },
      { dmg: 1.1, count: 1, desc: '+10% урон, +1 копьё' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.2, range: 1.2, desc: '+20% урон, +20% дальность' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 копьё' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  },

  THROWING_AXE: {
    id: 'THROWING_AXE', name: 'Метательный топор', icon: '🪓',
    desc: 'Топор летит по дуге и возвращается, нанося урон дважды',
    baseDamage: 38, baseCooldown: 1.8, baseRange: 350,
    projectileCount: 1, speed: 320,
    rarity: 'rare', maxLevel: 8,
    evolutionRequires: 'LIGHTNING',
    evolutionResult: 'VOID_AXE',
    upgrades: [
      { dmg: 1.25, desc: '+25% урон' },
      { dmg: 1.1, count: 1, desc: '+10% урон, +1 топор' },
      { dmg: 1.2, cd: 0.9, desc: '+20% урон, -10% перезарядка' },
      { dmg: 1.2, range: 1.2, desc: '+20% урон, +20% дальность' },
      { dmg: 1.3, count: 1, desc: '+30% урон, +1 топор' },
      { dmg: 1.2, cd: 0.85, desc: '+20% урон, -15% перезарядка' },
      { dmg: 1.5, desc: '+50% урон (максимум!)' }
    ]
  }
};
