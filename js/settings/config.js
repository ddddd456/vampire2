// ===========================
// CONFIG.JS — дополнительные утилиты конфигурации
// Этот файл загружается после game-config.js и weapons-config.js
// ===========================

// Expose CONFIG globally (already set in game-config.js, this is a safety net)
if (typeof window !== 'undefined') {
  window.CONFIG = window.CONFIG || CONFIG;
  window.WEAPONS_DATA = window.WEAPONS_DATA || WEAPONS_DATA;
  window.PASSIVES_DATA = window.PASSIVES_DATA || PASSIVES_DATA;
}

console.log('[Config] Все конфиги загружены');
