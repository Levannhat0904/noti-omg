import { MINER_CONFIG } from '@/config/minerConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface MinerData {
  video_id: string;
  task_id: string;
  miner_hotkey: string;
  earned_reward_tao: number;
  created_at: string;
  focusing_task: string;
}

const API_URL = `${MINER_CONFIG.API.BASE_URL}${MINER_CONFIG.API.ENDPOINT}`;
const STORAGE_KEY = MINER_CONFIG.STORAGE.KEY;

// Cấu hình notifications (chỉ native)
if (Platform.OS !== 'web' && typeof Notifications.setNotificationHandler === 'function') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export class MinerService {
  static async fetchMiners(): Promise<MinerData[]> {
    try {
      const response = await axios.post<MinerData[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching miners:', error);
      throw error;
    }
  }

  static async getStoredMiners(): Promise<MinerData[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored miners:', error);
      return [];
    }
  }

  static async saveMiners(miners: MinerData[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(miners));
    } catch (error) {
      console.error('Error saving miners:', error);
    }
  }

  static async clearMiners(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing miners:', error);
    }
  }

  static compareMiners(
    oldMiners: MinerData[],
    newMiners: MinerData[]
  ): {
    newItems: MinerData[];
    updatedItems: MinerData[];
    removedItems: MinerData[];
  } {
    const oldIds = new Set(oldMiners.map((m) => m.task_id));
    const newIds = new Set(newMiners.map((m) => m.task_id));

    // Items mới
    const newItems = newMiners.filter((m) => !oldIds.has(m.task_id));

    // Items bị xóa
    const removedItems = oldMiners.filter((m) => !newIds.has(m.task_id));

    // Items được cập nhật (reward thay đổi)
    const updatedItems = newMiners.filter((newMiner) => {
      const oldMiner = oldMiners.find((m) => m.task_id === newMiner.task_id);
      return (
        oldMiner &&
        oldMiner.earned_reward_tao !== newMiner.earned_reward_tao
      );
    });

    return { newItems, updatedItems, removedItems };
  }

  static async sendNotification(
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          badge: 1,
          data: data || {},
        },
        trigger: null, // Gửi ngay lập tức
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  static async notifyNewMiners(miners: MinerData[]): Promise<void> {
    if (miners.length === 0) return;

    const title = `🆕 ${miners.length} Miner Mới!`;
    const body = miners
      .slice(0, 2)
      .map((m) => `${m.focusing_task.substring(0, 30)}...`)
      .join('\n');

    await this.sendNotification(title, body, {
      type: 'new_miners',
      count: miners.length,
    });
  }

  static async notifyUpdatedMiners(miners: MinerData[]): Promise<void> {
    if (miners.length === 0) return;

    const title = `📈 ${miners.length} Miner Được Cập Nhật!`;
    const totalReward = miners.reduce((sum, m) => sum + m.earned_reward_tao, 0);
    const body = `Tổng reward: +${totalReward.toFixed(6)} TAO`;

    await this.sendNotification(title, body, {
      type: 'updated_miners',
      count: miners.length,
      totalReward,
    });
  }

  static async notifyRemovedMiners(miners: MinerData[]): Promise<void> {
    if (miners.length === 0) return;

    const title = `❌ ${miners.length} Miner Bị Xóa`;
    const body = miners
      .slice(0, 2)
      .map((m) => m.focusing_task.substring(0, 25))
      .join(', ');

    await this.sendNotification(title, body, {
      type: 'removed_miners',
      count: miners.length,
    });
  }
}

