import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MarketplaceRatio } from '../../services/dashboardMetricsService';

interface MarketplaceRatioChartProps {
  ratio: MarketplaceRatio;
}

export const MarketplaceRatioChart: React.FC<MarketplaceRatioChartProps> = ({ ratio }) => {
  const total = ratio.USER + ratio.BOOSTED + ratio.MARKETPLACE;
  
  const getRatioPercentage = (value: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  const getRatioWidth = (value: number) => {
    return `${(value / total) * 100}%`;
  };

  const ratioItems = [
    { label: 'USER', value: ratio.USER, color: '#3B82F6', icon: '👤' },
    { label: 'BOOSTED', value: ratio.BOOSTED, color: '#F59E0B', icon: '⚡' },
    { label: 'MARKETPLACE', value: ratio.MARKETPLACE, color: '#10B981', icon: '🛒' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Tỷ Lệ Marketplace vs User</Text>
      </View>

      <View style={styles.barContainer}>
        {ratioItems.map((item) => (
          <View
            key={item.label}
            style={[
              styles.barSegment,
              {
                flex: item.value,
                backgroundColor: item.color,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.legendContainer}>
        {ratioItems.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.icon} {item.label}</Text>
            <Text style={styles.legendValue}>{item.value.toFixed(2)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  barContainer: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  barSegment: {
    height: '100%',
  },
  legendContainer: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
});

