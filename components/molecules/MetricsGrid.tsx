import React from 'react';
import { StyleSheet, View } from 'react-native';
import { dashboardMetricsService } from '../../services/dashboardMetricsService';
import { MetricCard } from '../atoms/MetricCard';

interface MetricsGridProps {
  totalTaoEarned: number;
  totalVideosPurchased: number;
  activeMinersCount: number;
  avgRewardPerVideo: number;
  weeklyActiveUsers: number;
  totalFocussers: number;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  totalTaoEarned,
  totalVideosPurchased,
  activeMinersCount,
  avgRewardPerVideo,
  weeklyActiveUsers,
  totalFocussers,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <MetricCard
            label="Tổng TAO Kiếm"
            value={dashboardMetricsService.formatCurrency(totalTaoEarned)}
            icon="💰"
            color="#10B981"
            size="medium"
          />
        </View>
        <View style={styles.column}>
          <MetricCard
            label="Video Mua"
            value={totalVideosPurchased.toLocaleString('vi-VN')}
            icon="🎬"
            color="#3B82F6"
            size="medium"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <MetricCard
            label="Miners Hoạt Động"
            value={activeMinersCount}
            icon="⛏️"
            color="#F59E0B"
            size="medium"
          />
        </View>
        <View style={styles.column}>
          <MetricCard
            label="Trung Bình Reward/Video"
            value={dashboardMetricsService.formatCurrency(avgRewardPerVideo, 6)}
            icon="📊"
            color="#8B5CF6"
            size="medium"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <MetricCard
            label="Người Dùng Hoạt Động (Tuần)"
            value={weeklyActiveUsers}
            icon="👥"
            color="#EC4899"
            size="medium"
          />
        </View>
        <View style={styles.column}>
          <MetricCard
            label="Tổng Focussers"
            value={totalFocussers}
            icon="🎯"
            color="#06B6D4"
            size="medium"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  column: {
    flex: 1,
  },
});

