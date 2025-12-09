import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { LiveSession, dashboardMetricsService } from '../../services/dashboardMetricsService';

interface LiveSessionsListProps {
  sessions: LiveSession[];
}

export const LiveSessionsList: React.FC<LiveSessionsListProps> = ({ sessions }) => {
  const shortenHotkey = (key: string) => {
    if (key.length <= 16) return key;
    return `${key.substring(0, 8)}...${key.substring(key.length - 8)}`;
  };

  const renderSessionItem = ({ item }: { item: LiveSession }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <Text style={styles.hotkey}>{shortenHotkey(item.user_hotkey)}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>🔴 Live</Text>
        </View>
      </View>

      <View style={styles.sessionContent}>
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>TAO Balance</Text>
            <Text style={styles.balanceValue}>
              {dashboardMetricsService.formatCurrency(item.tao_balance)}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Alpha Balance</Text>
            <Text style={[styles.balanceValue, { color: '#8B5CF6' }]}>
              {dashboardMetricsService.formatCurrency(item.alpha_balance)}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Task ID:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {item.focused_task_id}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Bắt Đầu:</Text>
          <Text style={styles.value}>
            {dashboardMetricsService.formatDateTime(item.created_at)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🟢 Live Sessions ({sessions.length})</Text>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có phiên hoạt động</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.user_id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  listContent: {
    gap: 12,
  },
  emptyContainer: {
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hotkey: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'monospace',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  sessionContent: {
    gap: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    flex: 0.3,
  },
  value: {
    fontSize: 11,
    color: '#1F2937',
    flex: 0.7,
    textAlign: 'right',
  },
});

