import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Video, dashboardMetricsService } from '../../services/dashboardMetricsService';

interface VideosListProps {
  videos: Video[];
}

export const VideosList: React.FC<VideosListProps> = ({ videos }) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.7) return '#10B981';
    if (score >= 0.5) return '#F59E0B';
    if (score > 0) return '#EF4444';
    return '#9CA3AF';
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'SUBMITTED':
        return '#3B82F6';
      case 'PROCESSING':
        return '#F59E0B';
      case 'COMPLETED':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const renderVideoItem = ({ item }: { item: Video }) => (
    <View style={styles.videoCard}>
      <View style={styles.videoHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.task_title}
          </Text>
        </View>
        <View
          style={[
            styles.stateBadge,
            { backgroundColor: getStateColor(item.processing_state) },
          ]}
        >
          <Text style={styles.stateBadgeText}>{item.processing_state}</Text>
        </View>
      </View>

      <View style={styles.videoContent}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Video ID:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {item.video_id}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Điểm:</Text>
          <View
            style={[
              styles.scoreBadge,
              { backgroundColor: getScoreColor(item.video_score ?? 0) },
            ]}
          >
            <Text style={styles.scoreText}>
              {item.video_score !== null && item.video_score !== undefined 
                ? item.video_score.toFixed(1) 
                : 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Tạo:</Text>
          <Text style={styles.value}>
            {dashboardMetricsService.formatDateTime(item.created_at)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Cập Nhật:</Text>
          <Text style={styles.value}>
            {dashboardMetricsService.formatDateTime(item.updated_at)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎬 Videos ({videos.length})</Text>
      </View>

      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.video_id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
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
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  titleContainer: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  stateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stateBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  videoContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

