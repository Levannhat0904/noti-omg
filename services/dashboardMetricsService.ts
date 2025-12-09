import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api-focus.omegatron.ai/dashboard_sn24/metrics';
const CACHE_KEY = 'dashboard_metrics_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

export interface Video {
  video_id: string;
  user_hotkey: string;
  task_id: string;
  video_score: number | null;
  created_at: string;
  updated_at: string;
  earned_reward_tao: number | null;
  earned_reward_alpha: number | null;
  task_title: string;
  processing_state: string;
}

export interface LiveSession {
  user_id: string;
  user_hotkey: string;
  focused_task_id: string;
  created_at: string;
  tao_balance: number;
  alpha_balance: number;
}

export interface KPIs {
  total_hours_focused: number;
  total_tao_paid: number;
  avg_nonzero_task_score: number;
  avg_hours_per_user: number;
}

export interface MarketplaceRatio {
  USER: number;
  BOOSTED: number;
  MARKETPLACE: number;
}

export interface DashboardMetrics {
  total_tao_earned: number;
  total_videos_purchased: number;
  active_miners_count: number;
  avg_reward_per_video: number;
  top_miner_hotkey: string;
  top_miner_earnings: number;
  weekly_active_users: number;
  total_focussers: number;
  marketplace_vs_user_ratio: MarketplaceRatio;
  live_sessions: number;
  videos: Video[];
  live_sessions_data: LiveSession[];
  kpis: KPIs;
}

interface CachedData {
  data: DashboardMetrics;
  timestamp: number;
}

export const dashboardMetricsService = {
  /**
   * Fetch dữ liệu metrics từ API
   */
  async fetchMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: DashboardMetrics = await response.json();
      
      // Lưu vào cache
      await this.cacheMetrics(data);
      
      return data;
    } catch (error) {
      console.error('❌ Lỗi khi fetch metrics:', error);
      
      // Trả về dữ liệu từ cache nếu có
      const cachedData = await this.getCachedMetrics();
      if (cachedData) {
        console.log('📦 Sử dụng dữ liệu từ cache');
        return cachedData;
      }
      
      throw error;
    }
  },

  /**
   * Lưu metrics vào cache
   */
  async cacheMetrics(data: DashboardMetrics): Promise<void> {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('❌ Lỗi khi cache metrics:', error);
    }
  },

  /**
   * Lấy metrics từ cache
   */
  async getCachedMetrics(): Promise<DashboardMetrics | null> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const cacheData: CachedData = JSON.parse(cached);
      const now = Date.now();

      // Kiểm tra xem cache còn hợp lệ không
      if (now - cacheData.timestamp > CACHE_DURATION) {
        await AsyncStorage.removeItem(CACHE_KEY);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error('❌ Lỗi khi lấy cache metrics:', error);
      return null;
    }
  },

  /**
   * Xóa cache
   */
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('❌ Lỗi khi xóa cache:', error);
    }
  },

  /**
   * Format số tiền
   */
  formatCurrency(value: number, decimals: number = 2): string {
    return value.toFixed(decimals);
  },

  /**
   * Format ngày giờ
   */
  formatDateTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN');
    } catch {
      return dateString;
    }
  },

  /**
   * Format giờ
   */
  formatHours(hours: number): string {
    if (hours < 1) {
      return `${(hours * 60).toFixed(0)} phút`;
    }
    return `${hours.toFixed(1)} giờ`;
  },
};

