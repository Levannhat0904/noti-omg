import { MINER_CONFIG } from '@/config/minerConfig';
import { MinerData, MinerService } from '@/services/minerService';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseMinerFetcherState {
  miners: MinerData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isRunning: boolean;
}

export function useMinerFetcher(intervalMs?: number) {
  // Sử dụng config mặc định nếu không truyền intervalMs
  const interval = intervalMs ?? MINER_CONFIG.FETCH.INTERVAL_MS;
  const [state, setState] = useState<UseMinerFetcherState>({
    miners: [],
    loading: false,
    error: null,
    lastUpdated: null,
    isRunning: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFetchingRef = useRef(false);

  const fetchAndCompare = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

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

      // Cập nhật state
      setState((prev) => ({
        ...prev,
        miners: newMiners,
        loading: false,
        lastUpdated: new Date(),
      }));

      console.log('✅ Fetch thành công:', {
        total: newMiners.length,
        new: newItems.length,
        updated: updatedItems.length,
        removed: removedItems.length,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Lỗi không xác định';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      console.error('❌ Lỗi fetch:', errorMessage);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  const startFetching = useCallback(async () => {
    // Nếu đã có interval thì không tạo thêm
    if (intervalRef.current) {
      return;
    }

    // Fetch ngay lập tức lần đầu
    await fetchAndCompare();

    // Sau đó fetch định kỳ
    intervalRef.current = setInterval(fetchAndCompare, interval);

    setState((prev) => ({ ...prev, isRunning: true }));
    console.log(`🟢 Bắt đầu fetch mỗi ${interval / 1000}s`);
  }, [fetchAndCompare, interval]);

  const stopFetching = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState((prev) => ({ ...prev, isRunning: false }));
    console.log('⏸️ Dừng fetch');
  };

  const manualFetch = async () => {
    await fetchAndCompare();
  };

  const clearLocal = async () => {
    try {
      await MinerService.clearMiners();
      setState((prev) => ({
        ...prev,
        miners: [],
        error: null,
        lastUpdated: new Date(),
      }));
      console.log('🧹 Đã xóa dữ liệu local');
    } catch (e) {
      console.error('❌ Lỗi khi xóa dữ liệu local', e);
    }
  };

  useEffect(() => {
    // Cleanup khi component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startFetching,
    stopFetching,
    manualFetch,
    clearLocal,
  };
}

