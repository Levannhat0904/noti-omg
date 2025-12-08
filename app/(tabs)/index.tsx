import { MinerList } from '@/components/MinerList';
import { MINER_CONFIG } from '@/config/minerConfig';
import { useMinerFetcher } from '@/hooks/useMinerFetcher';
import { backgroundFetchService } from '@/services/backgroundFetchService';
import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const fetcher = useMinerFetcher(); // Sử dụng config mặc định

  useEffect(() => {
    // Yêu cầu quyền notifications
    requestNotificationPermissions();

    // Bắt đầu fetch khi component mount
    fetcher.startFetching();

    // Đăng ký background fetch (15 phút)
    backgroundFetchService.registerBackgroundFetch(900);

    // Cleanup khi component unmount
    return () => {
      fetcher.stopFetching();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Cảnh báo',
          'Ứng dụng cần quyền gửi thông báo để hoạt động tốt nhất'
        );
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  };

  const handleToggleFetching = () => {
    if (fetcher.isRunning) {
      fetcher.stopFetching();
    } else {
      fetcher.startFetching();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>🎯 Miners Tracker</Text>
          {fetcher.lastUpdated && (
            <View style={{flexDirection: "row", alignItems: "center", gap: 8}}>
            <Text style={styles.statusLabel}>
              Cập nhật: {fetcher.lastUpdated.toLocaleTimeString("vi-VN")}
            </Text>
            </View>
          )}
          <Text style={styles.subtitle}>
            Theo dõi dữ liệu mỗi {MINER_CONFIG.FETCH.INTERVAL_MS / 1000}s
          </Text>
        </View>
        {/* Status bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: fetcher.isRunning ? "#4CAF50" : "#FF9800",
                },
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {fetcher.isRunning ? "🟢 Đang chạy" : "🔴 Dừng"}
              </Text>
            </View>
          </View>

          {fetcher.error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>❌ {fetcher.error}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Miner List */}
      <MinerList
        miners={fetcher.miners}
        loading={fetcher.loading}
        onRefresh={fetcher.manualFetch}
        lastUpdated={fetcher.lastUpdated}
      />

      {/* Control buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: fetcher.isRunning ? "#FF6B6B" : "#4CAF50",
            },
          ]}
          onPress={handleToggleFetching}
        >
          <Text style={styles.buttonText}>
            {fetcher.isRunning ? "⏸️ Dừng" : "▶️ Bắt đầu"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#2196F3" }]}
          onPress={fetcher.manualFetch}
          disabled={fetcher.loading}
        >
          <Text style={styles.buttonText}>🔄 Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#9E9E9E" }]}
          onPress={() =>
            Alert.alert(
              "Xóa dữ liệu local",
              "Bạn có chắc muốn xóa dữ liệu đã lưu?",
              [
                { text: "Hủy", style: "cancel" },
                {
                  text: "Xóa",
                  style: "destructive",
                  onPress: () => fetcher.clearLocal(),
                },
              ]
            )
          }
        >
          <Text style={styles.buttonText}>🧹 Xóa data</Text>
        </TouchableOpacity>
      </View>

      {/* Background Fetch Info */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#999",
  },
  statusBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  statusLabe2: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  errorBox: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFEBEE",
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  errorText: {
    fontSize: 12,
    color: "#C62828",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#E3F2FD",
    borderTopWidth: 1,
    borderTopColor: "#BBDEFB",
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1565C0",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#0D47A1",
    lineHeight: 18,
  },
});
