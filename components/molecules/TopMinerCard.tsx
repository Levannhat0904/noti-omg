import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { dashboardMetricsService } from '../../services/dashboardMetricsService';

interface TopMinerCardProps {
  hotkey: string;
  earnings: number;
}

export const TopMinerCard: React.FC<TopMinerCardProps> = ({ hotkey, earnings }) => {
  const shortenHotkey = (key: string) => {
    if (key.length <= 16) return key;
    return `${key.substring(0, 8)}...${key.substring(key.length - 8)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Top Miner</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.hotkeyContainer}>
          <Text style={styles.label}>Hotkey</Text>
          <Text style={styles.hotkey}>{shortenHotkey(hotkey)}</Text>
        </View>

        <View style={styles.earningsContainer}>
          <Text style={styles.label}>Tổng Kiếm</Text>
          <Text style={styles.earnings}>
            {dashboardMetricsService.formatCurrency(earnings)} TAO
          </Text>
        </View>
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
  content: {
    gap: 16,
  },
  hotkeyContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  earningsContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 12,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  hotkey: {
    fontSize: 13,
    color: '#1F2937',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  earnings: {
    fontSize: 18,
    color: '#10B981',
    fontWeight: '700',
  },
});

