// ===========================
// VAMPIRE SURVIVORS — WORLD.JS
// Tilemap generation & rendering
// ===========================

class World {
  constructor() {
    this.TILE = CONFIG.TILE_SIZE;
    this.W    = CONFIG.WORLD_W;
    this.H    = CONFIG.WORLD_H;
    this.tilesX = Math.ceil(this.W / this.TILE) + 2;
    this.tilesY = Math.ceil(this.H / this.TILE) + 2;

    this.tileData    = this._generateTiles();
    this.decorations = this._generateDecorations();

    this.chestOpened = false;

    this.castle = { x: 2200, y: -1800, w: 640, h: 480 };
  }

  _generateTiles() {
    const map = [];
    for (let ty = 0; ty < this.tilesY; ty++) {
      map[ty] = [];
      for (let tx = 0; tx < this.tilesX; tx++) {
        const r = Math.random();
        map[ty][tx] = {
          color:       Utils.randChoice(CONFIG.TILE_COLORS),
          variant:     r < 0.12 ? 1 : r < 0.04 ? 2 : 0,
          detailColor: Utils.randChoice(CONFIG.TILE_DETAIL_COLORS)
        };
      }
    }
    return map;
  }

  _generateDecorations() {
    const decors = [];
    const count  = 1800;
    const halfW  = this.W / 2, halfH = this.H / 2;
    const decorTypes = [
      { type: 'grave', w: 20, h: 28, color: '#8a8a8a', darkColor: '#606060' },
      { type: 'rock',  w: 16, h: 12, color: '#707070', darkColor: '#505050' },
      { type: 'bone',  w: 24, h: 8,  color: '#c8b87a', darkColor: '#a09060' },
      { type: 'tree',  w: 16, h: 32, color: '#1a3010', darkColor: '#0e1e08' }
    ];
    const cx = 2200, cy = -1800, cw = 640, ch = 480;
    for (let i = 0; i < count; i++) {
      const d = Utils.randChoice(decorTypes);
      let x, y, tries = 0;
      do {
        x = Utils.rand(-halfW, halfW);
        y = Utils.rand(-halfH, halfH);
        tries++;
      } while (
        tries < 10 &&
        x > cx - cw / 2 - 40 && x < cx + cw / 2 + 40 &&
        y > cy - ch / 2 - 40 && y < cy + ch / 2 + 40
      );
      decors.push({ x, y, ...d });
    }
    return decors;
  }

  // Called every frame from game._update()
  updateChest(player, game) {
    if (this.chestOpened) return;
    const dist = Utils.dist(player.x, player.y, this.castle.x, this.castle.y);
    if (dist < 80) {
      this.chestOpened = true;
      player.addWeapon('SOUL_SCYTHE');
      if (game && game.ui) {
        game.ui.spawnFloatText(
          '🏆 Найдено: Коса Душ!',
          game.canvas.width  / 2,
          game.canvas.height / 2 - 80,
          'xp'
        );
        game.ui.screenFlash('gold');
      }
    }
  }

  draw(ctx, camX, camY, W, H) {
    const T  = this.TILE;
    const hw = W / 2, hh = H / 2;

    // ---- Tiles ----
    const startTX = Math.floor((camX - hw) / T) - 1;
    const startTY = Math.floor((camY - hh) / T) - 1;
    const endTX   = startTX + Math.ceil(W / T) + 3;
    const endTY   = startTY + Math.ceil(H / T) + 3;

    for (let ty = startTY; ty < endTY; ty++) {
      for (let tx = startTX; tx < endTX; tx++) {
        const sx  = tx * T - camX + hw;
        const sy  = ty * T - camY + hh;
        const dtx = ((tx % this.tilesX) + this.tilesX) % this.tilesX;
        const dty = ((ty % this.tilesY) + this.tilesY) % this.tilesY;
        const tile = this.tileData[dty] && this.tileData[dty][dtx];

        ctx.fillStyle = tile ? tile.color : CONFIG.TILE_COLORS[0];
        ctx.fillRect(sx, sy, T + 1, T + 1);

        if (tile) {
          if (tile.variant === 1) {
            ctx.fillStyle = tile.detailColor;
            ctx.fillRect(sx + 2, sy + 2, T - 4, T - 4);
          } else if (tile.variant === 2) {
            ctx.fillStyle = tile.detailColor;
            ctx.beginPath();
            ctx.arc(sx + T * 0.5, sy + T * 0.5, T * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.lineWidth   = 0.5;
        ctx.strokeRect(sx, sy, T, T);
      }
    }

    // ---- Fog vignette ----
    const fogGrad = ctx.createRadialGradient(hw, hh, W * 0.25, hw, hh, W * 0.7);
    fogGrad.addColorStop(0, 'rgba(0,0,0,0)');
    fogGrad.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, 0, W, H);

    // ---- Decorations ----
    for (const d of this.decorations) {
      const sx = d.x - camX + hw;
      const sy = d.y - camY + hh;
      if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) continue;

      ctx.save();
      switch (d.type) {
        case 'grave':
          ctx.fillStyle = d.darkColor;
          ctx.fillRect(sx - d.w * 0.3, sy + d.h * 0.4, d.w * 0.6, d.h * 0.6);
          ctx.fillStyle = d.color;
          ctx.fillRect(sx - d.w * 0.35, sy, d.w * 0.7, d.h * 0.55);
          ctx.beginPath();
          ctx.arc(sx, sy + d.h * 0.2, d.w * 0.35, Math.PI, 0);
          ctx.fill();
          ctx.fillStyle = d.darkColor;
          ctx.fillRect(sx - 1, sy + d.h * 0.1, 2, d.h * 0.35);
          ctx.fillRect(sx - d.w * 0.15, sy + d.h * 0.2, d.w * 0.3, 2);
          break;

        case 'rock':
          ctx.fillStyle = d.darkColor;
          ctx.beginPath();
          ctx.ellipse(sx + 2, sy + 2, d.w * 0.5, d.h * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = d.color;
          ctx.beginPath();
          ctx.ellipse(sx, sy, d.w * 0.5, d.h * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.beginPath();
          ctx.ellipse(sx - d.w * 0.15, sy - d.h * 0.15, d.w * 0.2, d.h * 0.2, 0, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'bone':
          ctx.fillStyle = d.color;
          ctx.fillRect(sx - d.w * 0.5, sy - d.h * 0.15, d.w, d.h * 0.3);
          ctx.beginPath();
          ctx.arc(sx - d.w * 0.45, sy, d.h * 0.4, 0, Math.PI * 2);
          ctx.arc(sx + d.w * 0.45, sy, d.h * 0.4, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'tree':
          ctx.fillStyle = d.darkColor;
          ctx.fillRect(sx - 3, sy, 6, d.h);
          ctx.shadowBlur = 8; ctx.shadowColor = d.color;
          ctx.fillStyle  = d.color;
          ctx.beginPath();
          ctx.arc(sx, sy - 4, d.w, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          break;
      }
      ctx.restore();
    }

    // ---- Castle ----
    this._drawCastle(ctx, camX, camY, W, H);

    // ---- World border ----
    const bx = -this.W / 2 - camX + hw;
    const by = -this.H / 2 - camY + hh;
    ctx.strokeStyle = 'rgba(192,21,42,0.5)';
    ctx.lineWidth   = 4;
    ctx.shadowBlur  = 20; ctx.shadowColor = '#c0152a';
    ctx.strokeRect(bx, by, this.W, this.H);
    ctx.shadowBlur  = 0;
  }

  _drawCastle(ctx, camX, camY, W, H) {
    const hw = W / 2, hh = H / 2;
    const { x, y, w, h } = this.castle;
    const sx = x - camX + hw;
    const sy = y - camY + hh;

    // Frustum cull
    if (sx + w < -100 || sx - w > W + 100 || sy + h < -100 || sy - h > H + 100) return;

    const now       = performance.now() * 0.001;
    const wallColor = '#3a3028';
    const wallDark  = '#1e1810';
    const wallLight = '#5a4a38';

    ctx.save();

    // Courtyard ground
    ctx.fillStyle = '#2a2018';
    ctx.fillRect(sx - w / 2, sy - h / 2, w, h);

    // Stone floor grid
    ctx.strokeStyle = 'rgba(80,60,40,0.5)';
    ctx.lineWidth   = 1;
    const tileS = 48;
    for (let tx = 0; tx <= Math.ceil(w / tileS); tx++) {
      for (let ty = 0; ty <= Math.ceil(h / tileS); ty++) {
        ctx.strokeRect(sx - w / 2 + tx * tileS, sy - h / 2 + ty * tileS, tileS, tileS);
      }
    }

    // Back wall
    ctx.fillStyle = wallColor;
    ctx.fillRect(sx - w / 2, sy - h / 2 - 60, w, 60);
    // Side walls
    ctx.fillRect(sx - w / 2 - 50, sy - h / 2 - 60, 50, h + 60);
    ctx.fillRect(sx + w / 2,      sy - h / 2 - 60, 50, h + 60);

    // Wall highlights
    ctx.fillStyle = wallLight;
    ctx.fillRect(sx - w / 2,      sy - h / 2 - 62, w,  4);
    ctx.fillRect(sx - w / 2 - 52, sy - h / 2 - 62, 4,  h + 62);
    ctx.fillRect(sx + w / 2 + 48, sy - h / 2 - 62, 4,  h + 62);

    // Battlements — top
    ctx.fillStyle = wallColor;
    const merlonW = 28, merlonH = 30, merlonGap = 18;
    for (let mx = sx - w / 2; mx < sx + w / 2; mx += merlonW + merlonGap) {
      ctx.fillRect(mx, sy - h / 2 - 90, merlonW, merlonH);
    }
    // Battlements — sides
    for (let my = sy - h / 2 - 60; my < sy + h / 2; my += merlonW + merlonGap) {
      ctx.fillRect(sx - w / 2 - 80, my, merlonH, merlonW);
      ctx.fillRect(sx + w / 2 + 50, my, merlonH, merlonW);
    }

    // Corner towers
    const towerR = 45;
    const towers = [
      { tx: sx - w / 2 - 25, ty: sy - h / 2 - 30 },
      { tx: sx + w / 2 + 25, ty: sy - h / 2 - 30 },
      { tx: sx - w / 2 - 25, ty: sy + h / 2 + 10 },
      { tx: sx + w / 2 + 25, ty: sy + h / 2 + 10 }
    ];
    for (const t of towers) {
      ctx.fillStyle = wallDark;
      ctx.beginPath();
      ctx.arc(t.tx, t.ty, towerR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = wallColor;
      ctx.beginPath();
      ctx.arc(t.tx, t.ty, towerR - 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = wallLight;
      ctx.lineWidth   = 3;
      ctx.beginPath();
      ctx.arc(t.tx, t.ty, towerR - 4, 0, Math.PI * 2);
      ctx.stroke();
      // Window glow
      ctx.fillStyle  = 'rgba(255,180,50,0.6)';
      ctx.shadowBlur = 10; ctx.shadowColor = '#ffaa00';
      ctx.fillRect(t.tx - 5, t.ty - 8, 10, 14);
      ctx.shadowBlur = 0;
    }

    // Gate
    ctx.fillStyle = wallDark;
    ctx.fillRect(sx - 40, sy + h / 2 - 80, 80, 80);
    ctx.fillStyle = '#0a0806';
    ctx.beginPath();
    ctx.arc(sx, sy + h / 2 - 80, 36, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(sx - 36, sy + h / 2 - 80, 72, 80);
    // Gate bars
    ctx.strokeStyle = '#4a3a28';
    ctx.lineWidth   = 4;
    for (let gx = sx - 30; gx <= sx + 30; gx += 12) {
      ctx.beginPath();
      ctx.moveTo(gx, sy + h / 2 - 80);
      ctx.lineTo(gx, sy + h / 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(sx - 36, sy + h / 2 - 50);
    ctx.lineTo(sx + 36, sy + h / 2 - 50);
    ctx.stroke();

    // Torches
    const torches = [
      { tx: sx - w / 2 + 30, ty: sy - h / 2 + 20 },
      { tx: sx + w / 2 - 30, ty: sy - h / 2 + 20 },
      { tx: sx - 80,         ty: sy + h / 2 - 30  },
      { tx: sx + 80,         ty: sy + h / 2 - 30  }
    ];
    for (const tp of torches) {
      const flicker = 0.7 + 0.3 * Math.sin(now * 8 + tp.tx);
      ctx.fillStyle  = `rgba(255,160,30,${flicker})`;
      ctx.shadowBlur = 20 * flicker; ctx.shadowColor = '#ff8800';
      ctx.beginPath();
      ctx.arc(tp.tx, tp.ty, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Chest
    if (!this.chestOpened) {
      const chestX = sx, chestY = sy - 40;
      const pulse  = 0.5 + 0.5 * Math.sin(now * 3);
      ctx.shadowBlur = 30 * pulse; ctx.shadowColor = '#e8b84b';
      // Body
      ctx.fillStyle = '#6b3a1f';
      ctx.fillRect(chestX - 22, chestY - 14, 44, 28);
      // Lid
      ctx.fillStyle = '#8b4a2f';
      ctx.fillRect(chestX - 22, chestY - 22, 44, 12);
      ctx.beginPath();
      ctx.arc(chestX, chestY - 22, 22, Math.PI, 0);
      ctx.fill();
      // Bands
      ctx.strokeStyle = '#e8b84b';
      ctx.lineWidth   = 2;
      ctx.strokeRect(chestX - 22, chestY - 14, 44, 28);
      ctx.strokeRect(chestX - 22, chestY - 22, 44, 12);
      // Lock
      ctx.fillStyle = '#e8b84b';
      ctx.beginPath();
      ctx.arc(chestX, chestY - 8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      // Opened chest
      ctx.fillStyle = '#3a1a08';
      ctx.fillRect(sx - 22, sy - 54, 44, 28);
      ctx.fillStyle = '#5a2a18';
      ctx.fillRect(sx - 22, sy - 70, 44, 18);
      ctx.strokeStyle = '#6b4a28';
      ctx.lineWidth   = 2;
      ctx.strokeRect(sx - 22, sy - 54, 44, 28);
    }

    ctx.restore();

    // Label
    ctx.save();
    ctx.font      = 'bold 14px serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(232,184,75,0.85)';
    ctx.shadowBlur = 8; ctx.shadowColor = '#e8b84b';
    ctx.fillText('🏰 Проклятый Замок', sx, sy - h / 2 - 100);
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}
