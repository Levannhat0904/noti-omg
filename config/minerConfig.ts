/**
 * Cấu hình cho Miners Tracker
 */

export const MINER_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: 'https://api-focus.omegatron.ai',
    ENDPOINT: '/miners/latest',
    TIMEOUT: 10000, // 10 giây
  },

  // Fetch Configuration
  FETCH: {
    INTERVAL_MS: 120000, // 2 phút (120000ms)
    AUTO_START: true, // Tự động bắt đầu fetch khi app mở
  },

  // Notification Configuration
  NOTIFICATIONS: {
    ENABLED: true,
    SOUND: 'default',
    VIBRATION: true,
    BADGE: true,
  },

  // Storage Configuration
  STORAGE: {
    KEY: 'miners_data',
    BACKUP_KEY: 'miners_data_backup',
  },

  // UI Configuration
  UI: {
    ITEMS_PER_PAGE: 20,
    REFRESH_ANIMATION_DURATION: 300,
    CARD_BORDER_RADIUS: 8,
  },

  // Comparison Configuration
  COMPARISON: {
    CHECK_NEW_ITEMS: true,
    CHECK_UPDATED_ITEMS: true,
    CHECK_REMOVED_ITEMS: true,
  },

  // Notification Messages
  MESSAGES: {
    NEW_MINERS: (count: number) => `🆕 ${count} Miner Mới!`,
    UPDATED_MINERS: (count: number) => `📈 ${count} Miner Được Cập Nhật!`,
    REMOVED_MINERS: (count: number) => `❌ ${count} Miner Bị Xóa`,
    FETCH_ERROR: 'Lỗi khi fetch dữ liệu',
    FETCH_SUCCESS: 'Fetch thành công',
  },

  // Reward Formatting
  REWARD: {
    DECIMALS: 6,
    SYMBOL: 'TAO',
  },

  // Date Formatting
  DATE: {
    LOCALE: 'vi-VN',
    FORMAT: {
      FULL: {
        month: '2-digit' as const,
        day: '2-digit' as const,
        hour: '2-digit' as const,
        minute: '2-digit' as const,
      },
      TIME_ONLY: {
        hour: '2-digit' as const,
        minute: '2-digit' as const,
        second: '2-digit' as const,
      },
    },
  },

  // Text Truncation
  TEXT: {
    TASK_TITLE_LINES: 2,
    HOTKEY_PREVIEW_LENGTH: 20,
    TASK_PREVIEW_LENGTH: 30,
  },
};

// Helper functions
export const getMinerConfigValue = (path: string, defaultValue?: any) => {
  const keys = path.split('.');
  let value: any = MINER_CONFIG;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return defaultValue;
  }

  return value;
};

export const updateMinerConfig = (path: string, value: any) => {
  const keys = path.split('.');
  const lastKey = keys.pop();

  if (!lastKey) return;

  let obj: any = MINER_CONFIG;
  for (const key of keys) {
    if (!obj[key]) obj[key] = {};
    obj = obj[key];
  }

  obj[lastKey] = value;
};

