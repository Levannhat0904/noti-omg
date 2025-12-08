import { MinerData } from '@/services/minerService';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface MinerListProps {
  miners: MinerData[];
  loading: boolean;
  onRefresh: () => void;
  lastUpdated: Date | null;
}

export function MinerList({
  miners,
  loading,
  onRefresh,
  lastUpdated,
}: MinerListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatReward = (reward: number) => {
    return reward.toFixed(6);
  };

  const renderMinerItem = ({ item }: { item: MinerData }) => (
    <View style={styles.minerCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.taskTitle} numberOfLines={2}>
          {item.focusing_task}
        </Text>
        <Text style={styles.reward}>{formatReward(item.earned_reward_tao)} TAO</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Video ID:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {item.video_id}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Miner:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {item.miner_hotkey.substring(0, 20)}...
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ngày:</Text>
          <Text style={styles.value}>{formatDate(item.created_at)}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Không có dữ liệu</Text>
      <Text style={styles.emptySubtext}>
        Nhấn nút refresh để tải dữ liệu
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Danh sách */}
      <FlatList
        data={miners}
        renderItem={renderMinerItem}
        keyExtractor={(item) => item.task_id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        scrollEnabled={true}
      />

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#999',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  minerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  reward: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
    minWidth: 80,
    textAlign: 'right',
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    minWidth: 70,
  },
  value: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#fff',
  },
});

