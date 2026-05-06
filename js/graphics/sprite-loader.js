// ===========================
// SPRITE LOADER - Загрузчик спрайтов
// Graceful fallback: если спрайт не найден — игра продолжается с примитивами
// ===========================

const SpriteLoader = {
    images: {},
    loaded: false,
    total: 0,
    count: 0,
    callbacks: [],
    _loadStarted: false,

    load() {
        // Prevent double-loading
        if (this._loadStarted) {
            if (this.loaded) {
                this.callbacks.forEach(cb => cb());
                this.callbacks = [];
            }
            return;
        }
        this._loadStarted = true;

        const assets = window.ASSETS && window.ASSETS.images;
        if (!assets) {
            console.warn('[SpriteLoader] ASSETS не найден — запуск без спрайтов');
            this._finishImmediately();
            return;
        }

        const enemyKeys = Object.keys(assets.enemies || {});
        this.total = 2 + enemyKeys.length;
        this.count = 0;

        this._loadOne('player',    assets.player);
        this._loadOne('playerGun', assets.playerGun);

        for (const type of enemyKeys) {
            this._loadOne('enemy_' + type, assets.enemies[type]);
        }

        console.log(`[SpriteLoader] Загрузка ${this.total} спрайтов...`);

        // Safety timeout: if images take too long, start anyway
        setTimeout(() => {
            if (!this.loaded) {
                console.warn('[SpriteLoader] Таймаут загрузки — запуск с частичными спрайтами');
                this._finishImmediately();
            }
        }, 5000);
    },

    _loadOne(key, src) {
        if (!src) {
            // No path configured — count as done, no image stored
            this.count++;
            this._checkComplete();
            return;
        }
        const img = new Image();
        img.onload = () => {
            this.images[key] = img;
            this.count++;
            console.log(`[SpriteLoader] ✓ ${key}`);
            this._checkComplete();
        };
        img.onerror = () => {
            // Missing file is not fatal — fallback drawing handles it
            console.warn(`[SpriteLoader] ✗ Не найден: ${src} (будет использован примитив)`);
            this.count++;
            this._checkComplete();
        };
        img.src = src;
    },

    _checkComplete() {
        if (this.count >= this.total && !this.loaded) {
            this.loaded = true;
            const ok = Object.keys(this.images).length;
            console.log(`[SpriteLoader] Готово: ${ok}/${this.total} спрайтов загружено`);
            this._fireCallbacks();
        }
    },

    _finishImmediately() {
        if (!this.loaded) {
            this.loaded = true;
            this._fireCallbacks();
        }
    },

    _fireCallbacks() {
        const cbs = this.callbacks.slice();
        this.callbacks = [];
        cbs.forEach(cb => { try { cb(); } catch(e) { console.error('[SpriteLoader] callback error', e); } });
    },

    get(key) {
        return this.images[key] || null;
    },

    onReady(callback) {
        if (this.loaded) {
            try { callback(); } catch(e) { console.error('[SpriteLoader] onReady error', e); }
        } else {
            this.callbacks.push(callback);
        }
    },

    // Reset for re-use (e.g. restart)
    reset() {
        this.images = {};
        this.loaded = false;
        this.total = 0;
        this.count = 0;
        this.callbacks = [];
        this._loadStarted = false;
    }
};

window.SpriteLoader = SpriteLoader;
