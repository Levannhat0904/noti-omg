import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { MinerService } from './minerService';

const BACKGROUND_FETCH_TASK = 'background-fetch-miners';

// Định nghĩa background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('🌙 Background fetch task bắt đầu...');

    // Fetch dữ liệu mới từ API
    const newMiners = await MinerService.fetchMiners();

    // Lấy dữ liệu cũ từ storage
    const oldMiners = await MinerService.getStoredMiners();

    // So sánh
    const { newItems, updatedItems, removedItems } = MinerService.compareMiners(
      oldMiners,
      newMiners
    );

    // Gửi notifications nếu có thay đổi
    if (newItems.length > 0) {
      await MinerService.notifyNewMiners(newItems);
    }

    if (updatedItems.length > 0) {
      await MinerService.notifyUpdatedMiners(updatedItems);
    }

    if (removedItems.length > 0) {
      await MinerService.notifyRemovedMiners(removedItems);
    }

    // Lưu dữ liệu mới vào storage
    await MinerService.saveMiners(newMiners);

    console.log('✅ Background fetch thành công:', {
      total: newMiners.length,
      new: newItems.length,
      updated: updatedItems.length,
      removed: removedItems.length,
    });

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('❌ Lỗi background fetch:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const backgroundFetchService = {
  /**
   * Đăng ký background fetch task
   * @param intervalSeconds - Khoảng thời gian giữa các lần fetch (giây)
   */
  async registerBackgroundFetch(intervalSeconds: number = 900) {
    try {
      // Kiểm tra xem task đã được đăng ký chưa
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);

      if (isRegistered) {
        console.log('✅ Background fetch task đã được đăng ký');
        return;
      }

      // Đăng ký background fetch
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: intervalSeconds, // Tối thiểu 15 phút (900 giây) trên iOS
        stopOnTerminate: false, // Tiếp tục chạy khi app bị terminate
        startOnBoot: true, // Bắt đầu khi device khởi động
      });

      console.log(`🟢 Background fetch đã được đăng ký (mỗi ${intervalSeconds}s)`);
    } catch (error) {
      console.error('❌ Lỗi khi đăng ký background fetch:', error);
    }
  },

  /**
   * Hủy đăng ký background fetch task
   */
  async unregisterBackgroundFetch() {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);

      if (!isRegistered) {
        console.log('ℹ️ Background fetch task chưa được đăng ký');
        return;
      }

      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      console.log('⏹️ Background fetch task đã được hủy đăng ký');
    } catch (error) {
      console.error('❌ Lỗi khi hủy đăng ký background fetch:', error);
    }
  },

  /**
   * Kiểm tra xem background fetch task đã được đăng ký chưa
   */
  async isBackgroundFetchRegistered() {
    try {
      return await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    } catch (error) {
      console.error('❌ Lỗi khi kiểm tra background fetch:', error);
      return false;
    }
  },
};

