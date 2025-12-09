import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ErrorMessage } from '../components/atoms/ErrorMessage';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { VideosList } from '../components/molecules/VideosList';
import {
    DashboardMetrics,
    dashboardMetricsService,
} from '../services/dashboardMetricsService';

export const DashboardMetricsTab: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = useCallback(async () => {
    try {
      setError(null);
      const data = await dashboardMetricsService.fetchMetrics();
      setMetrics(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Không thể tải dữ liệu';
      setError(errorMessage);
      console.error('❌ Lỗi khi tải metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Fetch dữ liệu khi tab được focus
  useFocusEffect(
    useCallback(() => {
      // Có thể thêm logic để refresh dữ liệu khi tab được focus
      // fetchMetrics();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMetrics();
  }, [fetchMetrics]);

  if (loading && !metrics) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Đang tải dữ liệu dashboard..." />
      </SafeAreaView>
    );
  }

  if (error && !metrics) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage message={error} onRetry={fetchMetrics} />
      </SafeAreaView>
    );
  }

  if (!metrics) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage message="Không có dữ liệu để hiển thị" onRetry={fetchMetrics} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Metrics Grid */}
        {/* <MetricsGrid
          totalTaoEarned={metrics.total_tao_earned}
          totalVideosPurchased={metrics.total_videos_purchased}
          activeMinersCount={metrics.active_miners_count}
          avgRewardPerVideo={metrics.avg_reward_per_video}
          weeklyActiveUsers={metrics.weekly_active_users}
          totalFocussers={metrics.total_focussers}
        /> */}

        {/* Top Miner Card */}
        {/* <TopMinerCard
          hotkey={metrics.top_miner_hotkey}
          earnings={metrics.top_miner_earnings}
        /> */}

        {/* Marketplace Ratio Chart */}
        {/* <MarketplaceRatioChart ratio={metrics.marketplace_vs_user_ratio} /> */}

        {/* KPIs Section */}
        {/* <KPIsSection kpis={metrics.kpis} /> */}

        {/* Live Sessions */}
        {/* <LiveSessionsList sessions={metrics.live_sessions_data} /> */}

        {/* Videos List */}
        <VideosList videos={metrics.videos} />

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  bottomPadding: {
    height: 20,
  },
});

