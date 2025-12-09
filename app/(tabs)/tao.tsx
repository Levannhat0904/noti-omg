import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AccountItem = {
  address: { ss58: string; hex: string };
  network: string;
  block_number: number;
  timestamp: string;
  rank: number;
  balance_free: string;
  balance_staked: string;
  balance_total: string;
  balance_reserved: string;
};

type AccountResponse = {
  data?: AccountItem[];
};

type StakeBalance = {
  hotkey: string;
  coldkey: string;
  stake: string;
  stake_as_tao?: string;
};

const WALLET_ADDRESS = '5CPMmMCVrz3Fa13dRAPWxghypBDSHaBy2UDy7JGZwgV7Cwyo';
const HOTKEY = WALLET_ADDRESS;

const FAKE_EMAILS: { email: string; wallet: string }[] = [
  { email: 'alice@example.com', wallet: '5F1...alice' },
  { email: 'bob@example.com', wallet: '5G2...bob' },
  { email: 'carol@example.com', wallet: '5H3...carol' },
  { email: 'dave@example.com', wallet: '5J4...dave' },
];

export default function TaoScreen() {
  const [account, setAccount] = useState<AccountItem | null>(null);
  const [stake, setStake] = useState<StakeBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setError(null);
      const [accountRes, stakeRes] = await Promise.all([
        axios.get<AccountResponse>(
          `https://taostats.io/api/account/account?address=${WALLET_ADDRESS}`
        ),
        axios.get<StakeBalance[]>(
          `https://taostats.io/api/dtao/allStakeBalance?coldkey=${WALLET_ADDRESS}`
        ),
      ]);

      const accountItem = accountRes.data?.data?.[0] ?? null;
      setAccount(accountItem);

      const stakeItem = Array.isArray(stakeRes.data)
        ? stakeRes.data.find((item) => item.coldkey === WALLET_ADDRESS) ?? null
        : null;
      setStake(stakeItem);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu';
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const balanceText = useMemo(() => {
    if (!account) return '—';
    return account.balance_total;
  }, [account]);

  const stakeText = useMemo(() => {
    if (!stake) return '—';
    return stake.stake_as_tao ?? stake.stake;
  }, [stake]);

  const renderInfoRow = (label: string, value: string | number | null | undefined) => (
    <View style={styles.row} key={label}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? '—'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            fetchData();
          }} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.title}>Thông tin ví</Text>
          {loading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#0a7ea4" />
              <Text style={styles.subtle}>Đang tải dữ liệu...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerBox}>
              <Text style={styles.error}>Lỗi: {error}</Text>
              <Text style={styles.subtle}>Kéo xuống để thử lại</Text>
            </View>
          ) : account ? (
            <>
              {renderInfoRow('Hotkey', HOTKEY)}
              {renderInfoRow('Địa chỉ ví', account.address.ss58)}
              {renderInfoRow('Network', account.network)}
              {renderInfoRow('Rank', account.rank)}
              {renderInfoRow('Số dư tổng', balanceText)}
              {renderInfoRow('Số dư khả dụng', account.balance_free)}
              {renderInfoRow('Đang stake', account.balance_staked)}
              {renderInfoRow('Đã giữ chỗ', account.balance_reserved)}
              {renderInfoRow('Block', account.block_number)}
              {renderInfoRow('Timestamp', account.timestamp)}
              {renderInfoRow('Stake (TAO)', stakeText)}
            </>
          ) : (
            <View style={styles.centerBox}>
              <Text style={styles.subtle}>Không có dữ liệu</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Emails & ví (fake)</Text>
          {FAKE_EMAILS.map((item) => (
            <View style={styles.row} key={item.email}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{item.email}</Text>
                <Text style={styles.subtle}>{item.wallet}</Text>
              </View>
              <Text style={styles.badge}>Fake</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    maxWidth: '50%',
    textAlign: 'right',
  },
  badge: {
    backgroundColor: '#e5e7eb',
    color: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: '700',
  },
  subtle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  error: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '700',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
});

