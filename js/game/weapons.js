// ===========================
// VAMPIRE SURVIVORS — WEAPONS.JS
// Weapon instances, projectiles, pools
// ===========================

class Projectile {
  constructor() { this.reset(); }
  reset() {
    this.x = 0; this.y = 0;
    this.vx = 0; this.vy = 0;
    this.damage = 0;
    this.radius = 8;
    this.life = 0; this.maxLife = 1;
    this.active = false;
    this.color = '#fff';
    this.glowColor = '#fff';
    this.piercing = 1;
    this.hitEnemies = null;
    this.type = 'bolt';
    this.weaponId = '';
    this.burnDamage = 0; this.burnDuration = 0;
    this.isCrit = false;
    // Boomerang specific
    this.returning = false;
    this.ownerX = 0; this.ownerY = 0;
    this.maxDist = 0; this.distTraveled = 0;
  }
}

class AoeZone {
  constructor() { this.reset(); }
  reset() {
    this.x = 0; this.y = 0;
    this.radius = 50;
    this.damage = 0;
    this.tickRate = 0.5;
    this.tickTimer = 0;
    this.life = 0;
    this.active = false;
    this.color = 'rgba(100,200,255,0.3)';
    this.hitEnemies = new Set();
    this.type = 'pool';
  }
}

class WeaponInstance {
  constructor(data, player) {
    this.data = { ...data };
    this.player = player;
    this.level = 1;
    this.timer = 0;

    // Computed stats
    this.damage      = data.baseDamage;
    this.cooldown    = data.baseCooldown;
    this.range       = data.baseRange;
    this.count       = data.projectileCount || 1;
    this.speed       = data.speed || 300;
    this.piercing    = data.piercing || 1;
    this.arcAngle    = data.arcAngle || Math.PI * 0.5;
    this.chainCount  = data.chainCount || 0;
    this.chainRange  = data.chainRange || 120;
    this.poolRadius  = data.poolRadius || 50;
    this.poolDur     = data.poolDuration || 3.0;
    this.tickRate    = data.tickRate || 0.5;
    this.burnDamage  = data.burnDamage || 0;
    this.burnDuration= data.burnDuration || 0;
    // New weapon properties
    this.slowAmount  = data.slowAmount || 0;
    this.slowDuration= data.slowDuration || 0;
    this.stunDuration= data.stunDuration || 0;
    this.lifeSteal   = data.lifeSteal || 0;
  }

  upgrade() {
    if (this.level >= this.data.maxLevel) return;
    const upg = this.data.upgrades[this.level - 1];
    if (!upg) return;
    if (upg.dmg)     this.damage   *= upg.dmg;
    if (upg.cd)      this.cooldown *= upg.cd;
    if (upg.range)   this.range    *= upg.range;
    if (upg.count)   this.count    += upg.count;
    if (upg.piercing)this.piercing += upg.piercing;
    if (upg.arc)     this.arcAngle *= upg.arc;
    if (upg.chain)   this.chainCount += upg.chain;
    if (upg.chainR)  this.chainRange *= upg.chainR;
    if (upg.poolR)   this.poolRadius *= upg.poolR;
    if (upg.poolDur) this.poolDur   *= upg.poolDur;
    if (upg.burnDmg) this.burnDamage  *= upg.burnDmg;
    if (upg.burnDur) this.burnDuration *= upg.burnDur;
    if (upg.speed)   this.speed    *= upg.speed;
    this.level++;
  }

  getEffectiveCooldown() {
    return this.cooldown * (this.player.cdMult || 1);
  }

  getEffectiveDamage() {
    return this.damage * (this.player.dmgMult || 1);
  }
}

class WeaponSystem {
  constructor() {
    this.projectiles = [];
    this.aoeZones    = [];
    this.maxProjectiles = 200;
  }

  // ---- Fire logic per weapon type ----
  fire(weapon, player, enemies, particles, game) {
    const id = weapon.data.id;
    const cd = weapon.getEffectiveCooldown();
    weapon.timer += game.dt;
    if (weapon.timer < cd) return;
    weapon.timer = 0;

    switch (id) {
      case 'SWORD_ARC':       this._fireSwordArc(weapon, player, enemies, particles, game); break;
      case 'MAGIC_BOLT':      this._fireMagicBolt(weapon, player, enemies, particles, game); break;
      case 'HOLY_WATER':      this._fireHolyWater(weapon, player, enemies, particles, game); break;
      case 'CROSS_BOOMERANG': this._fireCross(weapon, player, enemies, particles, game); break;
      case 'LIGHTNING':       this._fireLightning(weapon, player, enemies, particles, game); break;
      case 'FIRE_WAND':       this._fireFireWand(weapon, player, enemies, particles, game); break;
      case 'GARLIC':          this._fireGarlic(weapon, player, enemies, particles, game); break;
      case 'SHADOW_BLADE':    this._fireShadowBlade(weapon, player, enemies, particles, game); break;
      case 'ICE_LANCE':       this._fireIceLance(weapon, player, enemies, particles, game); break;
      case 'SOUL_SCYTHE':     this._fireSoulScythe(weapon, player, enemies, particles, game); break;
      case 'THUNDER_SPEAR':   this._fireThunderSpear(weapon, player, enemies, particles, game); break;
      case 'BLIZZARD_STORM':  this._fireBlizzardStorm(weapon, player, enemies, particles, game); break;
      case 'DEATH_SPIRAL':    this._fireDeathSpiral(weapon, player, enemies, particles, game); break;
      case 'STORM_CALLER':    this._fireStormCaller(weapon, player, enemies, particles, game); break;
      // Новые обычные
      case 'SPEAR':           this._fireSpear(weapon, player, enemies, particles, game); break;
      case 'DAGGER_STORM':    this._fireDaggerStorm(weapon, player, enemies, particles, game); break;
      case 'WAR_HAMMER':      this._fireWarHammer(weapon, player, enemies, particles, game); break;
      case 'WHIP':            this._fireWhip(weapon, player, enemies, particles, game); break;
      case 'THROWING_AXE':    this._fireThrowingAxe(weapon, player, enemies, particles, game); break;
      // Новые магические
      case 'ARCANE_ORB':      this._fireArcaneOrb(weapon, player, enemies, particles, game); break;
      case 'POISON_CLOUD':    this._firePoisonCloud(weapon, player, enemies, particles, game); break;
      case 'METEOR':          this._fireMeteor(weapon, player, enemies, particles, game); break;
      // Эволюции
      case 'PHANTOM_LANCE':   this._firePhantomLance(weapon, player, enemies, particles, game); break;
      case 'VOID_AXE':        this._fireVoidAxe(weapon, player, enemies, particles, game); break;
    }
  }

  _fireSwordArc(weapon, player, enemies, particles, game) {
    // Атакует ближайших врагов в радиусе, а не просто вперёд
    const dmg = weapon.getEffectiveDamage();
    const targets = this._getNearestEnemies(player, enemies, weapon.range, weapon.count);
    
    // Если врагов нет — бьём в направлении движения
    const dirs = targets.length > 0
      ? targets.map(e => Utils.angle(player.x, player.y, e.x, e.y))
      : [player.lastDir || 0];

    for (const dir of dirs) {
      const halfArc = weapon.arcAngle / 2;
      // Наносим урон всем врагам в конусе вокруг цели
      for (const e of enemies) {
        if (!e.active) continue;
        const d = Utils.dist(player.x, player.y, e.x, e.y);
        if (d > weapon.range) continue;
        const a = Math.atan2(e.y - player.y, e.x - player.x);
        let diff = a - dir;
        while (diff > Math.PI)  diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) <= halfArc) {
          const isCrit = Utils.chance(player.critChance || 0);
          game.damageEnemy(e, isCrit ? dmg * 2 : dmg, player);
          particles.spawnHitSpark(e.x, e.y, '#ffe44a', 5);
        }
      }
      // Визуальная дуга
      const p = this._spawnProjectile();
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(dir) * 500; p.vy = Math.sin(dir) * 500;
      p.damage = 0;
      p.life = 0.15; p.maxLife = 0.15;
      p.radius = 14; p.piercing = 99;
      p.color = '#ffe44a'; p.glowColor = '#ffaa00';
      p.type = 'arc'; p.weaponId = 'SWORD_ARC';
      p.hitEnemies = new Set();
    }
  }

  _fireMagicBolt(weapon, player, enemies, particles, game) {
    const targets = this._getNearestEnemies(player, enemies, weapon.range, weapon.count);
    for (const e of targets) {
      const p = this._spawnProjectile();
      const a = Utils.angle(player.x, player.y, e.x, e.y);
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = weapon.getEffectiveDamage();
      p.life = weapon.range / weapon.speed;
      p.maxLife = p.life;
      p.radius = 7; p.piercing = weapon.piercing;
      p.color = '#c060ff'; p.glowColor = '#9020e0';
      p.type = 'bolt'; p.weaponId = 'MAGIC_BOLT';
      p.hitEnemies = new Set();
      p.isCrit = Utils.chance(player.critChance || 0);
      if (p.isCrit) { p.damage *= 2; p.radius = 11; }
    }
  }

  _fireHolyWater(weapon, player, enemies, particles, game) {
    const targets = this._getNearestEnemies(player, enemies, weapon.range, weapon.count);
    const spawnPos = targets.length > 0
      ? { x: targets[0].x, y: targets[0].y }
      : { x: player.x + Utils.rand(-weapon.range, weapon.range), y: player.y + Utils.rand(-weapon.range, weapon.range) };

    const zone = this._spawnAoeZone();
    zone.x = spawnPos.x; zone.y = spawnPos.y;
    zone.radius = weapon.poolRadius;
    zone.damage = weapon.getEffectiveDamage();
    zone.tickRate = weapon.tickRate;
    zone.tickTimer = 0;
    zone.life = weapon.poolDur;
    zone.color = 'rgba(100,200,255,0.25)';
    zone.glowColor = '#80ccff';
    zone.type = 'pool';
    zone.hitEnemies = new Set();

    // Throw visual
    const p = this._spawnProjectile();
    const a = Utils.angle(player.x, player.y, spawnPos.x, spawnPos.y);
    p.x = player.x; p.y = player.y;
    p.vx = Math.cos(a) * 280; p.vy = Math.sin(a) * 280;
    p.damage = 0;
    p.life = Utils.dist(player.x, player.y, spawnPos.x, spawnPos.y) / 280;
    p.maxLife = p.life;
    p.radius = 6; p.piercing = 1;
    p.color = '#80ccff'; p.glowColor = '#40aaff';
    p.type = 'bolt'; p.weaponId = 'HOLY_WATER_THROW';
    p.hitEnemies = new Set();
  }

  _fireCross(weapon, player, enemies, particles, game) {
    const targets = this._getNearestEnemies(player, enemies, weapon.range * 2, weapon.count);
    for (let i = 0; i < weapon.count; i++) {
      const a = targets[i]
        ? Utils.angle(player.x, player.y, targets[i].x, targets[i].y)
        : Math.random() * Math.PI * 2;

      const p = this._spawnProjectile();
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = weapon.getEffectiveDamage();
      p.maxDist = weapon.range;
      p.distTraveled = 0;
      p.life = 3.0; p.maxLife = 3.0;
      p.radius = 10; p.piercing = 99;
      p.color = '#fffaaa'; p.glowColor = '#ffeeaa';
      p.type = 'boomerang'; p.weaponId = 'CROSS_BOOMERANG';
      p.returning = false;
      p.ownerX = player.x; p.ownerY = player.y;
      p.hitEnemies = new Set();
    }
  }

  _fireLightning(weapon, player, enemies, particles, game) {
    const nearest = this._getNearestEnemies(player, enemies, weapon.range, 1);
    if (!nearest.length) return;

    const hitSet = new Set();
    let current = nearest[0];
    let cx = player.x, cy = player.y;
    const dmg = weapon.getEffectiveDamage();
    const isCrit = Utils.chance(player.critChance || 0);

    // Main target
    game.damageEnemy(current, isCrit ? dmg * 2 : dmg, player);
    particles.spawnLightningEffect(cx, cy, current.x, current.y);
    particles.spawnHitSpark(current.x, current.y, '#a0e0ff', 8);
    hitSet.add(current);
    cx = current.x; cy = current.y;

    // Chain
    for (let c = 0; c < weapon.chainCount; c++) {
      const chainTarget = enemies.find(e =>
        e.active && !hitSet.has(e) &&
        Utils.dist(cx, cy, e.x, e.y) < weapon.chainRange
      );
      if (!chainTarget) break;
      game.damageEnemy(chainTarget, (isCrit ? dmg * 2 : dmg) * 0.7, player);
      particles.spawnLightningEffect(cx, cy, chainTarget.x, chainTarget.y);
      particles.spawnHitSpark(chainTarget.x, chainTarget.y, '#a0e0ff', 5);
      hitSet.add(chainTarget);
      cx = chainTarget.x; cy = chainTarget.y;
    }
  }

  _fireFireWand(weapon, player, enemies, particles, game) {
    const targets = this._getNearestEnemies(player, enemies, weapon.range, weapon.count);
    for (const e of targets) {
      const p = this._spawnProjectile();
      const a = Utils.angle(player.x, player.y, e.x, e.y);
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = weapon.getEffectiveDamage();
      p.life = weapon.range / weapon.speed;
      p.maxLife = p.life;
      p.radius = 9; p.piercing = 1;
      p.color = '#ff8800'; p.glowColor = '#ff4400';
      p.type = 'fire'; p.weaponId = 'FIRE_WAND';
      p.burnDamage = weapon.burnDamage;
      p.burnDuration = weapon.burnDuration;
      p.hitEnemies = new Set();
      p.isCrit = Utils.chance(player.critChance || 0);
      if (p.isCrit) p.damage *= 2;
    }
  }

  _fireGarlic(weapon, player, enemies, particles, game) {
    const dmg = weapon.getEffectiveDamage();
    const isCrit = Utils.chance(player.critChance || 0);
    for (const e of enemies) {
      if (!e.active) continue;
      if (Utils.dist(player.x, player.y, e.x, e.y) <= weapon.range) {
        game.damageEnemy(e, isCrit ? dmg * 2 : dmg, player);
        if (isCrit) particles.spawnHitSpark(e.x, e.y, '#ffe44a', 3);
      }
    }
  }

  _fireShadowBlade(weapon, player, enemies, particles, game) {
    const dmg = weapon.getEffectiveDamage();
    for (let i = 0; i < weapon.count; i++) {
      const a = (i / weapon.count) * Math.PI * 2;
      const p = this._spawnProjectile();
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = dmg;
      p.life = weapon.range / weapon.speed;
      p.maxLife = p.life;
      p.radius = 6; p.piercing = weapon.piercing;
      p.color = '#8040ff'; p.glowColor = '#6020cc';
      p.type = 'bolt'; p.weaponId = 'SHADOW_BLADE';
      p.hitEnemies = new Set();
      p.isCrit = Utils.chance(player.critChance || 0);
      if (p.isCrit) p.damage *= 2;
    }
  }

  // ---- NEW WEAPONS ----

  _fireIceLance(weapon, player, enemies, particles, game) {
    const targets = this._getNearestEnemies(player, enemies, weapon.range, weapon.count);
    const dirs = targets.length > 0
      ? targets.map(e => Utils.angle(player.x, player.y, e.x, e.y))
      : [player.lastDir || 0];
    for (const a of dirs) {
      const p = this._spawnProjectile();
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = weapon.getEffectiveDamage();
      p.life = weapon.range / weapon.speed;
      p.maxLife = p.life;
      p.radius = 8; p.piercing = weapon.piercing;
      p.color = '#80e8ff'; p.glowColor = '#40c8ff';
      p.type = 'ice'; p.weaponId = 'ICE_LANCE';
      p.slowAmount = weapon.data.slowAmount || 0.5;
      p.slowDuration = weapon.data.slowDuration || 1.5;
      p.hitEnemies = new Set();
      p.isCrit = Utils.chance(player.critChance || 0);
      if (p.isCrit) { p.damage *= 2; p.radius = 12; }
    }
  }

  _fireSoulScythe(weapon, player, enemies, particles, game) {
    // Orbiting scythe — damage enemies in range each tick
    const dmg = weapon.getEffectiveDamage();
    const isCrit = Utils.chance(player.critChance || 0);
    const angle = (performance.now() * 0.003) % (Math.PI * 2);
    for (let i = 0; i < weapon.count; i++) {
      const a = angle + (i / weapon.count) * Math.PI * 2;
      const ox = player.x + Math.cos(a) * weapon.range;
      const oy = player.y + Math.sin(a) * weapon.range;
      for (const e of enemies) {
        if (!e.active) continue;
        if (Utils.dist(ox, oy, e.x, e.y) < e.radius + 18) {
          game.damageEnemy(e, isCrit ? dmg * 2 : dmg, player);
          particles.spawnHitSpark(e.x, e.y, '#cc44ff', 3);
          // Life steal for DEATH_SPIRAL
          if (weapon.data.lifeSteal) {
            player.heal(dmg * weapon.data.lifeSteal);
          }
        }
      }
      // Visual arc projectile at orbit position
      const p = this._spawnProjectile();
      p.x = ox; p.y = oy;
      p.vx = 0; p.vy = 0;
      p.damage = 0;
      p.life = weapon.getEffectiveCooldown();
      p.maxLife = p.life;
      p.radius = 14; p.piercing = 99;
      p.color = '#cc44ff'; p.glowColor = '#9900cc';
      p.type = 'scythe'; p.weaponId = weapon.data.id;
      p.hitEnemies = new Set();
    }
  }

  _fireDeathSpiral(weapon, player, enemies, particles, game) {
    // Shiva-стиль: косы вылетают наружу и втягиваются обратно
    // Используем таймер фазы на самом weapon
    if (!weapon._spiralPhase) weapon._spiralPhase = 0;
    if (!weapon._spiralTimer) weapon._spiralTimer = 0;
    
    const phaseDur = 0.6; // секунд на вылет + втягивание
    weapon._spiralTimer += game.dt;
    const t = (weapon._spiralTimer % phaseDur) / phaseDur; // 0..1
    const expanding = t < 0.5;
    const progress = expanding ? t * 2 : (1 - t) * 2; // 0..1..0
    
    const dmg = weapon.getEffectiveDamage();
    const isCrit = Utils.chance(player.critChance || 0);
    const baseAngle = (weapon._spiralTimer * 1.5) % (Math.PI * 2);
    
    for (let i = 0; i < weapon.count; i++) {
      const a = baseAngle + (i / weapon.count) * Math.PI * 2;
      const dist = progress * weapon.range;
      const ox = player.x + Math.cos(a) * dist;
      const oy = player.y + Math.sin(a) * dist;
      
      // Урон врагам рядом с косой
      for (const e of enemies) {
        if (!e.active) continue;
        if (Utils.dist(ox, oy, e.x, e.y) < e.radius + 20) {
          game.damageEnemy(e, isCrit ? dmg * 2 : dmg, player);
          particles.spawnHitSpark(e.x, e.y, '#cc44ff', 3);
          if (weapon.data.lifeSteal) player.heal(dmg * weapon.data.lifeSteal);
        }
      }
      
      // Визуальный снаряд
      const p = this._spawnProjectile();
      p.x = ox; p.y = oy;
      p.vx = 0; p.vy = 0;
      p.damage = 0;
      p.life = game.dt + 0.02;
      p.maxLife = p.life;
      p.radius = 16 + progress * 6;
      p.piercing = 99;
      p.color = expanding ? '#cc44ff' : '#ff44cc';
      p.glowColor = '#9900cc';
      p.type = 'scythe';
      p.weaponId = 'DEATH_SPIRAL';
      p.hitEnemies = new Set();
      
      // Линия от игрока до косы
      const trail = this._spawnProjectile();
      trail.x = player.x + Math.cos(a) * dist * 0.5;
      trail.y = player.y + Math.sin(a) * dist * 0.5;
      trail.vx = 0; trail.vy = 0;
      trail.damage = 0;
      trail.life = game.dt + 0.02;
      trail.maxLife = trail.life;
      trail.radius = 4;
      trail.piercing = 99;
      trail.color = `rgba(180,50,255,${0.3 * progress})`;
      trail.glowColor = '#9900cc';
      trail.type = 'scythe';
      trail.weaponId = 'DEATH_SPIRAL';
      trail.hitEnemies = new Set();
    }
  }

  _fireThunderSpear(weapon, player, enemies, particles, game) {
    const dir = player.lastDir || 0;
    const dmg = weapon.getEffectiveDamage();
    for (let i = 0; i < weapon.count; i++) {
      const spread = weapon.count > 1 ? ((i / (weapon.count - 1)) - 0.5) * 0.4 : 0;
      const a = dir + spread;
      const p = this._spawnProjectile();
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = dmg;
      p.life = weapon.range / weapon.speed;
      p.maxLife = p.life;
      p.radius = 11; p.piercing = weapon.piercing;
      p.color = '#ffe040'; p.glowColor = '#ffaa00';
      p.type = 'thunder'; p.weaponId = 'THUNDER_SPEAR';
      p.stunDuration = weapon.data.stunDuration || 1.0;
      p.hitEnemies = new Set();
      p.isCrit = Utils.chance(player.critChance || 0);
      if (p.isCrit) { p.damage *= 2; p.radius = 16; }
    }
  }

  _fireBlizzardStorm(weapon, player, enemies, particles, game) {
    const dmg = weapon.getEffectiveDamage();
    for (let i = 0; i < weapon.count; i++) {
      const a = (i / weapon.count) * Math.PI * 2;
      const p = this._spawnProjectile();
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = dmg;
      p.life = weapon.range / weapon.speed;
      p.maxLife = p.life;
      p.radius = 9; p.piercing = weapon.piercing;
      p.color = '#b0f0ff'; p.glowColor = '#60d0ff';
      p.type = 'ice'; p.weaponId = 'BLIZZARD_STORM';
      p.slowAmount = weapon.data.slowAmount || 0.8;
      p.slowDuration = weapon.data.slowDuration || 2.5;
      p.hitEnemies = new Set();
      p.isCrit = Utils.chance(player.critChance || 0);
      if (p.isCrit) { p.damage *= 2; p.radius = 14; }
    }
  }

  _fireStormCaller(weapon, player, enemies, particles, game) {
    const nearest = this._getNearestEnemies(player, enemies, weapon.range, 1);
    if (!nearest.length) return;

    const hitSet = new Set();
    let current = nearest[0];
    let cx = player.x, cy = player.y;
    const dmg = weapon.getEffectiveDamage();
    const isCrit = Utils.chance(player.critChance || 0);
    const chainCount = weapon.chainCount || 10;
    const chainRange = weapon.chainRange || 200;

    game.damageEnemy(current, isCrit ? dmg * 2 : dmg, player);
    particles.spawnLightningEffect(cx, cy, current.x, current.y);
    particles.spawnHitSpark(current.x, current.y, '#ffe040', 10);
    if (current.stagger !== undefined) {
      current.stagger = Math.max(current.stagger, weapon.data.stunDuration || 1.5);
    }
    hitSet.add(current);
    cx = current.x; cy = current.y;

    for (let c = 0; c < chainCount; c++) {
      const chainTarget = enemies.find(e =>
        e.active && !hitSet.has(e) &&
        Utils.dist(cx, cy, e.x, e.y) < chainRange
      );
      if (!chainTarget) break;
      game.damageEnemy(chainTarget, (isCrit ? dmg * 2 : dmg) * 0.8, player);
      particles.spawnLightningEffect(cx, cy, chainTarget.x, chainTarget.y);
      particles.spawnHitSpark(chainTarget.x, chainTarget.y, '#ffe040', 6);
      if (chainTarget.stagger !== undefined) {
        chainTarget.stagger = Math.max(chainTarget.stagger, weapon.data.stunDuration || 1.5);
      }
      hitSet.add(chainTarget);
      cx = chainTarget.x; cy = chainTarget.y;
    }
  }

  // ---- Update ----
  update(dt, player, enemies, particles, game) {
    this._updateProjectiles(dt, enemies, particles, game);
    this._updateAoeZones(dt, enemies, particles, game);
    this._updateSlowTimers(dt, enemies);
    // Fire weapons
    for (const w of player.weapons) {
      this.fire(w, player, enemies, particles, game);
    }
    // Check evolutions
    this._checkEvolutions(player);
  }

  _updateSlowTimers(dt, enemies) {
    for (const e of enemies) {
      if (!e.active) continue;
      if (e.slowTimer > 0) {
        e.slowTimer -= dt;
        if (e.slowTimer <= 0) {
          e.slowTimer = 0;
          if (e._baseSpeed) { e.speed = e._baseSpeed; e._baseSpeed = null; }
        }
      }
    }
  }

  _checkEvolutions(player) {
    for (const w of player.weapons) {
      const data = w.data;
      if (!data.evolutionRequires || !data.evolutionResult) continue;
      if (w.level < data.maxLevel) continue;
      // Check if player has the required companion weapon
      const hasCompanion = player.weapons.some(ow => ow.data.id === data.evolutionRequires);
      if (!hasCompanion) continue;
      // Check evolution not already applied
      const alreadyEvolved = player.weapons.some(ow => ow.data.id === data.evolutionResult);
      if (alreadyEvolved) continue;
      // Evolve!
      this._evolveWeapon(player, w, data.evolutionResult);
      break; // one evolution per frame
    }
  }

  _evolveWeapon(player, weapon, evolutionId) {
    const evoData = WEAPONS_DATA[evolutionId];
    if (!evoData) return;
    const companionId = weapon.data.evolutionRequires;
    player.weapons = player.weapons.filter(w =>
      w.data.id !== weapon.data.id && w.data.id !== companionId
    );
    player.addWeapon(evolutionId);
    console.log(`[Evolution] ${weapon.data.name} → ${evoData.name}`);
    if (window.game && window.game.ui) {
      window.game.ui.spawnFloatText(
        `✨ ЭВОЛЮЦИЯ: ${evoData.name}!`,
        window.game.canvas.width / 2,
        window.game.canvas.height / 2 - 60,
        'xp'
      );
      window.game.ui.screenFlash('gold');
    }
  }

  // ========== НОВЫЕ ОБЫЧНЫЕ ОРУЖИЯ ==========

  _fireSpear(weapon, player, enemies, particles, game) {
    const targets = this._getNearestEnemies(player, enemies, weapon.range, weapon.count);
    const dirs = targets.length > 0
      ? targets.map(e => Utils.angle(player.x, player.y, e.x, e.y))
      : [player.lastDir || 0];
    for (const a of dirs) {
      const p = this._spawnProjectile();
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = weapon.getEffectiveDamage();
      p.life = weapon.range / weapon.speed;
      p.maxLife = p.life;
      p.radius = 7; p.piercing = weapon.piercing;
      p.color = '#c8a060'; p.glowColor = '#e8c080';
      p.type = 'spear'; p.weaponId = 'SPEAR';
      p.hitEnemies = new Set();
      p.isCrit = Utils.chance(player.critChance || 0);
      if (p.isCrit) { p.damage *= 2; p.radius = 11; }
    }
  }

  _fireDaggerStorm(weapon, player, enemies, particles, game) {
    const dir = player.lastDir || 0;
    const dmg = weapon.getEffectiveDamage();
    const spread = 0.35;
    for (let i = 0; i < weapon.count; i++) {
      const offset = weapon.count > 1 ? ((i / (weapon.count - 1)) - 0.5) * spread * 2 : 0;
      const a = dir + offset;
      const p = this._spawnProjectile();
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = dmg;
      p.life = weapon.range / weapon.speed;
      p.maxLife = p.life;
      p.radius = 5; p.piercing = weapon.piercing;
      p.color = '#e0e0e0'; p.glowColor = '#ffffff';
      p.type = 'dagger'; p.weaponId = 'DAGGER_STORM';
      p.hitEnemies = new Set();
      p.isCrit = Utils.chance(player.critChance || 0);
      if (p.isCrit) { p.damage *= 2; p.color = '#ffe44a'; }
    }
  }

  _fireWarHammer(weapon, player, enemies, particles, game) {
    // AoE удар вокруг игрока
    const dmg = weapon.getEffectiveDamage();
    const isCrit = Utils.chance(player.critChance || 0);
    let hit = 0;
    for (const e of enemies) {
      if (!e.active) continue;
      if (Utils.dist(player.x, player.y, e.x, e.y) <= weapon.range) {
        game.damageEnemy(e, isCrit ? dmg * 2 : dmg, player);
        particles.spawnHitSpark(e.x, e.y, '#ff8800', 8);
        // Оглушение
        e.stagger = Math.max(e.stagger || 0, weapon.data.stunDuration || 1.2);
        e.vx = (e.x - player.x) * 3;
        e.vy = (e.y - player.y) * 3;
        hit++;
      }
    }
    // Визуальная волна
    const p = this._spawnProjectile();
    p.x = player.x; p.y = player.y;
    p.vx = 0; p.vy = 0;
    p.damage = 0;
    p.life = 0.25; p.maxLife = 0.25;
    p.radius = weapon.range; p.piercing = 99;
    p.color = '#ff8800'; p.glowColor = '#ffaa00';
    p.type = 'hammer'; p.weaponId = 'WAR_HAMMER';
    p.hitEnemies = new Set();
    if (hit > 0) particles.spawnHitSpark(player.x, player.y, '#ff8800', 12);
  }

  _fireWhip(weapon, player, enemies, particles, game) {
    // Горизонтальный удар через весь экран
    const dmg = weapon.getEffectiveDamage();
    for (let i = 0; i < weapon.count; i++) {
      const yOffset = (i - (weapon.count - 1) / 2) * 40;
      const p = this._spawnProjectile();
      p.x = player.x - weapon.range;
      p.y = player.y + yOffset;
      p.vx = weapon.speed; p.vy = 0;
      p.damage = dmg;
      p.life = (weapon.range * 2) / weapon.speed;
      p.maxLife = p.life;
      p.radius = 10; p.piercing = weapon.piercing;
      p.color = '#c8a060'; p.glowColor = '#e8c080';
      p.type = 'whip'; p.weaponId = 'WHIP';
      p.hitEnemies = new Set();
      p.isCrit = Utils.chance(player.critChance || 0);
      if (p.isCrit) { p.damage *= 2; p.color = '#ffe44a'; }
    }
  }

  _fireThrowingAxe(weapon, player, enemies, particles, game) {
    const targets = this._getNearestEnemies(player, enemies, weapon.range * 2, weapon.count);
    for (let i = 0; i < weapon.count; i++) {
      const a = targets[i]
        ? Utils.angle(player.x, player.y, targets[i].x, targets[i].y)
        : Math.random() * Math.PI * 2;
      const p = this._spawnProjectile();
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = weapon.getEffectiveDamage();
      p.maxDist = weapon.range;
      p.distTraveled = 0;
      p.life = 3.0; p.maxLife = 3.0;
      p.radius = 11; p.piercing = 99;
      p.color = '#a06020'; p.glowColor = '#c08040';
      p.type = 'axe'; p.weaponId = 'THROWING_AXE';
      p.returning = false;
      p.ownerX = player.x; p.ownerY = player.y;
      p.hitEnemies = new Set();
      p.isCrit = Utils.chance(player.critChance || 0);
      if (p.isCrit) { p.damage *= 2; }
    }
  }

  // ========== НОВЫЕ МАГИЧЕСКИЕ ОРУЖИЯ ==========

  _fireArcaneOrb(weapon, player, enemies, particles, game) {
    // Орбитальные шары вокруг игрока
    const dmg = weapon.getEffectiveDamage();
    const isCrit = Utils.chance(player.critChance || 0);
    const angle = (performance.now() * 0.002) % (Math.PI * 2);
    for (let i = 0; i < weapon.count; i++) {
      const a = angle + (i / weapon.count) * Math.PI * 2;
      const ox = player.x + Math.cos(a) * weapon.range;
      const oy = player.y + Math.sin(a) * weapon.range;
      for (const e of enemies) {
        if (!e.active) continue;
        if (Utils.dist(ox, oy, e.x, e.y) < e.radius + 22) {
          game.damageEnemy(e, isCrit ? dmg * 2 : dmg, player);
          particles.spawnHitSpark(e.x, e.y, '#4488ff', 5);
        }
      }
      const p = this._spawnProjectile();
      p.x = ox; p.y = oy;
      p.vx = 0; p.vy = 0;
      p.damage = 0;
      p.life = weapon.getEffectiveCooldown();
      p.maxLife = p.life;
      p.radius = 18; p.piercing = 99;
      p.color = '#4488ff'; p.glowColor = '#2266dd';
      p.type = 'orb'; p.weaponId = 'ARCANE_ORB';
      p.hitEnemies = new Set();
    }
  }

  _firePoisonCloud(weapon, player, enemies, particles, game) {
    const targets = this._getNearestEnemies(player, enemies, weapon.range, weapon.count);
    const spawnPos = targets.length > 0
      ? { x: targets[0].x, y: targets[0].y }
      : { x: player.x + Utils.rand(-weapon.range, weapon.range), y: player.y + Utils.rand(-weapon.range, weapon.range) };
    const zone = this._spawnAoeZone();
    zone.x = spawnPos.x; zone.y = spawnPos.y;
    zone.radius = weapon.poolRadius;
    zone.damage = weapon.getEffectiveDamage();
    zone.tickRate = weapon.tickRate;
    zone.tickTimer = 0;
    zone.life = weapon.poolDur;
    zone.color = 'rgba(80,200,80,0.2)';
    zone.glowColor = '#40cc40';
    zone.type = 'pool';
    zone.hitEnemies = new Set();
    // Визуальный бросок
    const p = this._spawnProjectile();
    const a = Utils.angle(player.x, player.y, spawnPos.x, spawnPos.y);
    p.x = player.x; p.y = player.y;
    p.vx = Math.cos(a) * 300; p.vy = Math.sin(a) * 300;
    p.damage = 0;
    p.life = Utils.dist(player.x, player.y, spawnPos.x, spawnPos.y) / 300;
    p.maxLife = p.life;
    p.radius = 8; p.piercing = 1;
    p.color = '#80cc80'; p.glowColor = '#40cc40';
    p.type = 'bolt'; p.weaponId = 'POISON_CLOUD';
    p.hitEnemies = new Set();
  }

  _fireMeteor(weapon, player, enemies, particles, game) {
    const targets = this._getNearestEnemies(player, enemies, weapon.range, weapon.count);
    for (let i = 0; i < weapon.count; i++) {
      const target = targets[i] || { x: player.x + Utils.rand(-200, 200), y: player.y + Utils.rand(-200, 200) };
      // Предупреждение — маркер на земле
      const warn = this._spawnProjectile();
      warn.x = target.x; warn.y = target.y;
      warn.vx = 0; warn.vy = 0;
      warn.damage = 0;
      warn.life = 0.8; warn.maxLife = 0.8;
      warn.radius = weapon.poolRadius; warn.piercing = 99;
      warn.color = 'rgba(255,80,0,0.3)'; warn.glowColor = '#ff4400';
      warn.type = 'meteor_warn'; warn.weaponId = 'METEOR';
      warn.hitEnemies = new Set();
      // Задержка — потом взрыв через AoE
      const delay = 0.8;
      setTimeout(() => {
        if (!game.world) return;
        const zone = this._spawnAoeZone();
        zone.x = target.x; zone.y = target.y;
        zone.radius = weapon.poolRadius;
        zone.damage = weapon.getEffectiveDamage();
        zone.tickRate = 0.05;
        zone.tickTimer = 0;
        zone.life = weapon.poolDur;
        zone.color = 'rgba(255,120,0,0.35)';
        zone.glowColor = '#ff6600';
        zone.type = 'pool';
        zone.hitEnemies = new Set();
        particles.spawnDeathExplosion(target.x, target.y, '#ff4400');
      }, delay * 1000);
    }
  }

  // ========== ЭВОЛЮЦИИ ==========

  _firePhantomLance(weapon, player, enemies, particles, game) {
    const targets = this._getNearestEnemies(player, enemies, weapon.range, weapon.count);
    const dirs = targets.length > 0
      ? targets.map(e => Utils.angle(player.x, player.y, e.x, e.y))
      : Array.from({ length: weapon.count }, (_, i) => (i / weapon.count) * Math.PI * 2);
    for (const a of dirs) {
      const p = this._spawnProjectile();
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = weapon.getEffectiveDamage();
      p.life = weapon.range / weapon.speed;
      p.maxLife = p.life;
      p.radius = 10; p.piercing = weapon.piercing;
      p.color = '#cc88ff'; p.glowColor = '#aa44ff';
      p.type = 'phantom'; p.weaponId = 'PHANTOM_LANCE';
      p.hitEnemies = new Set();
      p.isCrit = Utils.chance(player.critChance || 0);
      if (p.isCrit) { p.damage *= 2; p.radius = 15; }
    }
  }

  _fireVoidAxe(weapon, player, enemies, particles, game) {
    const targets = this._getNearestEnemies(player, enemies, weapon.range * 2, weapon.count);
    for (let i = 0; i < weapon.count; i++) {
      const a = targets[i]
        ? Utils.angle(player.x, player.y, targets[i].x, targets[i].y)
        : Math.random() * Math.PI * 2;
      const p = this._spawnProjectile();
      p.x = player.x; p.y = player.y;
      p.vx = Math.cos(a) * weapon.speed; p.vy = Math.sin(a) * weapon.speed;
      p.damage = weapon.getEffectiveDamage();
      p.maxDist = weapon.range;
      p.distTraveled = 0;
      p.life = 3.0; p.maxLife = 3.0;
      p.radius = 14; p.piercing = 99;
      p.color = '#220044'; p.glowColor = '#8800ff';
      p.type = 'void_axe'; p.weaponId = 'VOID_AXE';
      p.returning = false;
      p.ownerX = player.x; p.ownerY = player.y;
      p.chainCount = weapon.chainCount || 4;
      p.chainRange = weapon.chainRange || 150;
      p.hitEnemies = new Set();
    }
  }

  _updateProjectiles(dt, enemies, particles, game) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (!p.active) { this.projectiles.splice(i, 1); continue; }

      // Boomerang logic (boomerang, axe, void_axe)
      if (p.type === 'boomerang' || p.type === 'axe' || p.type === 'void_axe') {
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        p.distTraveled += speed * dt;
        if (!p.returning && p.distTraveled >= p.maxDist) {
          p.returning = true;
          p.hitEnemies.clear();
          // void_axe: цепная молния при развороте
          if (p.type === 'void_axe' && p.chainCount > 0) {
            const nearest = enemies.filter(e => e.active)
              .sort((a, b) => Utils.distSq(p.x, p.y, a.x, a.y) - Utils.distSq(p.x, p.y, b.x, b.y))
              .slice(0, 1);
            if (nearest.length) {
              let cx = p.x, cy = p.y;
              const hitSet = new Set();
              let cur = nearest[0];
              for (let c = 0; c <= p.chainCount; c++) {
                game.damageEnemy(cur, p.damage * 0.6, game.player);
                particles.spawnLightningEffect(cx, cy, cur.x, cur.y);
                hitSet.add(cur);
                cx = cur.x; cy = cur.y;
                const next = enemies.find(e => e.active && !hitSet.has(e) && Utils.dist(cx, cy, e.x, e.y) < p.chainRange);
                if (!next) break;
                cur = next;
              }
            }
          }
        }
        if (p.returning) {
          const owner = game.player;
          const a = Utils.angle(p.x, p.y, owner.x, owner.y);
          const returnSpeed = p.type === 'void_axe' ? 500 : 380;
          p.vx = Math.cos(a) * returnSpeed;
          p.vy = Math.sin(a) * returnSpeed;
          if (Utils.dist(p.x, p.y, owner.x, owner.y) < 20) { p.active = false; continue; }
        }
      }

      // Fire trail
      if (p.type === 'fire' && Math.random() < 0.4) {
        particles.spawnFireTrail(p.x, p.y);
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) { p.active = false; continue; }

      // Hit detection
      if (p.damage > 0) {
        for (const e of enemies) {
          if (!e.active) continue;
          if (p.hitEnemies && p.hitEnemies.has(e.id)) continue;
          if (Utils.circlesOverlap(p.x, p.y, p.radius, e.x, e.y, e.radius)) {
            game.damageEnemy(e, p.damage, game.player, p);
            particles.spawnHitSpark(e.x, e.y, p.glowColor, 4);
            if (p.hitEnemies) p.hitEnemies.add(e.id);
            // Slow effect (ice weapons)
            if (p.slowAmount && p.slowDuration) {
              if (!e.slowTimer || e.slowTimer <= 0) {
                e._baseSpeed = e._baseSpeed || e.speed;
              }
              e.speed = (e._baseSpeed || e.speed) * (1 - p.slowAmount);
              e.slowTimer = p.slowDuration;
            }
            // Stun effect (thunder weapons)
            if (p.stunDuration) {
              e.stagger = Math.max(e.stagger || 0, p.stunDuration);
              e.vx = 0; e.vy = 0;
            }
            if (!p.piercing || p.piercing <= 0 || p.hitEnemies.size >= p.piercing) {
              p.active = false; break;
            }
          }
        }
      }
    }
  }

  _updateAoeZones(dt, enemies, particles, game) {
    for (let i = this.aoeZones.length - 1; i >= 0; i--) {
      const z = this.aoeZones[i];
      if (!z.active) { this.aoeZones.splice(i, 1); continue; }
      z.life -= dt;
      if (z.life <= 0) { z.active = false; continue; }
      z.tickTimer += dt;
      if (z.tickTimer >= z.tickRate) {
        z.tickTimer = 0;
        z.hitEnemies.clear();
        for (const e of enemies) {
          if (!e.active) continue;
          if (Utils.dist(z.x, z.y, e.x, e.y) < z.radius + e.radius) {
            game.damageEnemy(e, z.damage, game.player);
            particles.spawnHitSpark(e.x, e.y, z.glowColor || '#80ccff', 2);
          }
        }
      }
    }
  }

  // ---- Draw ----
  draw(ctx, camX, camY, W, H) {
    const hw = W / 2, hh = H / 2;

    // AOE Zones
    for (const z of this.aoeZones) {
      if (!z.active) continue;
      const sx = z.x - camX + hw, sy = z.y - camY + hh;
      if (sx < -z.radius || sx > W + z.radius || sy < -z.radius || sy > H + z.radius) continue;
      const alpha = Utils.clamp(z.life / 0.5, 0, 1) * 0.7;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 30; ctx.shadowColor = z.glowColor || '#80ccff';

      // Outer ring
      ctx.strokeStyle = z.glowColor || '#80ccff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx, sy, z.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner fill
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, z.radius);
      grad.addColorStop(0, z.color || 'rgba(100,200,255,0.1)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, z.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Projectiles
    for (const p of this.projectiles) {
      if (!p.active) continue;
      const sx = p.x - camX + hw, sy = p.y - camY + hh;
      if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) continue;

      ctx.save();
      ctx.shadowBlur = 20; ctx.shadowColor = p.glowColor || p.color;

      if (p.type === 'boomerang') {
        // Cross shape
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3;
        const spin = performance.now() * 0.01;
        ctx.translate(sx, sy);
        ctx.rotate(spin);
        ctx.beginPath();
        ctx.moveTo(-p.radius * 1.2, 0); ctx.lineTo(p.radius * 1.2, 0);
        ctx.moveTo(0, -p.radius * 1.2); ctx.lineTo(0, p.radius * 1.2);
        ctx.stroke();
      } else if (p.type === 'arc') {
        // Slash arc
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(sx, sy, p.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'fire') {
        // Fireball
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, p.radius);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.3, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sx, sy, p.radius * 1.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'ice') {
        // Ice shard
        ctx.save();
        ctx.translate(sx, sy);
        const iceAngle = Math.atan2(p.vy, p.vx);
        ctx.rotate(iceAngle);
        const grad = ctx.createLinearGradient(-p.radius, 0, p.radius, 0);
        grad.addColorStop(0, 'rgba(180,240,255,0.2)');
        grad.addColorStop(0.5, p.color);
        grad.addColorStop(1, 'rgba(180,240,255,0.2)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-p.radius * 1.5, 0);
        ctx.lineTo(-p.radius * 0.3, -p.radius * 0.5);
        ctx.lineTo(p.radius * 1.5, 0);
        ctx.lineTo(-p.radius * 0.3, p.radius * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'thunder') {
        // Thunder spear — elongated bolt
        ctx.save();
        ctx.translate(sx, sy);
        const tAngle = Math.atan2(p.vy, p.vx);
        ctx.rotate(tAngle);
        const tGrad = ctx.createLinearGradient(-p.radius * 2, 0, p.radius * 2, 0);
        tGrad.addColorStop(0, 'transparent');
        tGrad.addColorStop(0.3, p.color);
        tGrad.addColorStop(0.7, '#ffffff');
        tGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = tGrad;
        ctx.fillRect(-p.radius * 2, -p.radius * 0.4, p.radius * 4, p.radius * 0.8);
        ctx.restore();
      } else if (p.type === 'scythe') {
        // Orbiting scythe blade
        ctx.save();
        ctx.translate(sx, sy);
        const sAngle = performance.now() * 0.008;
        ctx.rotate(sAngle);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 1.5);
        ctx.stroke();
        // Blade tip
        ctx.fillStyle = p.glowColor;
        ctx.beginPath();
        ctx.arc(p.radius, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'spear') {
        // Копьё — длинный заострённый снаряд
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(Math.atan2(p.vy, p.vx));
        const sg = ctx.createLinearGradient(-p.radius * 2.5, 0, p.radius * 2.5, 0);
        sg.addColorStop(0, 'transparent');
        sg.addColorStop(0.3, p.color);
        sg.addColorStop(0.8, '#fff');
        sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.moveTo(-p.radius * 2.5, -p.radius * 0.3);
        ctx.lineTo(p.radius * 2.5, 0);
        ctx.lineTo(-p.radius * 2.5, p.radius * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'dagger') {
        // Кинжал — маленький острый снаряд
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(Math.atan2(p.vy, p.vx));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(p.radius * 1.8, 0);
        ctx.lineTo(-p.radius, -p.radius * 0.4);
        ctx.lineTo(-p.radius * 0.5, 0);
        ctx.lineTo(-p.radius, p.radius * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'hammer') {
        // Волна от молота — расширяющееся кольцо
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha * 0.6;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(sx, sy, p.radius * (1 - alpha * 0.3), 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = alpha * 0.2;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(sx, sy, p.radius * (1 - alpha * 0.3), 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'whip') {
        // Хлыст — горизонтальная полоса
        ctx.save();
        ctx.translate(sx, sy);
        const wg = ctx.createLinearGradient(-p.radius * 2, 0, p.radius * 2, 0);
        wg.addColorStop(0, 'transparent');
        wg.addColorStop(0.2, p.color);
        wg.addColorStop(0.8, p.color);
        wg.addColorStop(1, 'transparent');
        ctx.strokeStyle = wg;
        ctx.lineWidth = p.radius * 0.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-p.radius * 2, 0);
        ctx.lineTo(p.radius * 2, 0);
        ctx.stroke();
        ctx.restore();
      } else if (p.type === 'axe') {
        // Топор — вращающийся
        ctx.save();
        ctx.translate(sx, sy);
        const spin = performance.now() * 0.015;
        ctx.rotate(spin);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.glowColor;
        ctx.lineWidth = 2;
        // Лезвие
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, -Math.PI * 0.3, Math.PI * 0.3);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Рукоять
        ctx.strokeStyle = '#8b5a2b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-p.radius * 1.2, p.radius * 0.8);
        ctx.stroke();
        ctx.restore();
      } else if (p.type === 'orb') {
        // Тайный шар — пульсирующий
        const pulse = 0.8 + 0.2 * Math.sin(performance.now() * 0.005);
        const og = ctx.createRadialGradient(sx, sy, 0, sx, sy, p.radius * pulse);
        og.addColorStop(0, '#ffffff');
        og.addColorStop(0.3, p.color);
        og.addColorStop(0.7, p.glowColor);
        og.addColorStop(1, 'transparent');
        ctx.fillStyle = og;
        ctx.beginPath();
        ctx.arc(sx, sy, p.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'meteor_warn') {
        // Предупреждение метеора — мигающий круг
        const blink = 0.3 + 0.7 * Math.abs(Math.sin(performance.now() * 0.008));
        ctx.globalAlpha = blink * 0.5;
        ctx.strokeStyle = '#ff4400';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.arc(sx, sy, p.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = blink * 0.15;
        ctx.fillStyle = '#ff4400';
        ctx.beginPath();
        ctx.arc(sx, sy, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'phantom') {
        // Призрачное копьё — полупрозрачное с шлейфом
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(Math.atan2(p.vy, p.vx));
        ctx.globalAlpha = 0.85;
        const pg = ctx.createLinearGradient(-p.radius * 3, 0, p.radius * 3, 0);
        pg.addColorStop(0, 'transparent');
        pg.addColorStop(0.2, p.glowColor);
        pg.addColorStop(0.6, '#ffffff');
        pg.addColorStop(1, 'transparent');
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.moveTo(-p.radius * 3, -p.radius * 0.4);
        ctx.lineTo(p.radius * 3, 0);
        ctx.lineTo(-p.radius * 3, p.radius * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (p.type === 'void_axe') {
        // Топор пустоты — тёмный с фиолетовым свечением
        ctx.save();
        ctx.translate(sx, sy);
        const vspin = performance.now() * 0.02;
        ctx.rotate(vspin);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.glowColor;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 25; ctx.shadowColor = p.glowColor;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#8800ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-p.radius * 1.4, p.radius);
        ctx.stroke();
        ctx.restore();
      } else {
        // Generic bolt
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, p.radius);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.4, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(sx, sy, p.radius * (p.isCrit ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // ---- Helpers ----
  _spawnProjectile() {
    if (this.projectiles.length >= this.maxProjectiles) {
      this.projectiles[0].active = false;
      this.projectiles.shift();
    }
    const p = new Projectile();
    p.active = true;
    this.projectiles.push(p);
    return p;
  }

  _spawnAoeZone() {
    const z = new AoeZone();
    z.active = true;
    this.aoeZones.push(z);
    return z;
  }

  _getNearestEnemies(player, enemies, range, count) {
    const active = enemies.filter(e => e.active);
    active.sort((a, b) =>
      Utils.distSq(player.x, player.y, a.x, a.y) -
      Utils.distSq(player.x, player.y, b.x, b.y)
    );
    return active.filter(e => Utils.dist(player.x, player.y, e.x, e.y) <= range).slice(0, count);
  }
}
