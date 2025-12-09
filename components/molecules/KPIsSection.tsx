import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KPIs, dashboardMetricsService } from '../../services/dashboardMetricsService';
import { MetricCard } from '../atoms/MetricCard';

interface KPIsSectionProps {
  kpis: KPIs;
}

export const KPIsSection: React.FC<KPIsSectionProps> = ({ kpis }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📈 KPIs</Text>
      </View>

      <View style={styles.metricsContainer}>
        <MetricCard
          label="Tổng Giờ Tập Trung"
          value={dashboardMetricsService.formatHours(kpis.total_hours_focused)}
          icon="⏱️"
          color="#6366F1"
          size="medium"
        />

        <MetricCard
          label="Tổng TAO Đã Trả"
          value={dashboardMetricsService.formatCurrency(kpis.total_tao_paid)}
          icon="💵"
          color="#10B981"
          size="medium"
        />

        <MetricCard
          label="Điểm Trung Bình (Nonzero)"
          value={kpis.avg_nonzero_task_score.toFixed(2)}
          icon="⭐"
          color="#F59E0B"
          size="medium"
        />

        <MetricCard
          label="Giờ Trung Bình/Người Dùng"
          value={dashboardMetricsService.formatHours(kpis.avg_hours_per_user)}
          icon="👤"
          color="#EC4899"
          size="medium"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  metricsContainer: {
    gap: 8,
  },
});

