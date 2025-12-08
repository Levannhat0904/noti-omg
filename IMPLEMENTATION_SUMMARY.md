# [object Object] Miners Tracker

## ✅ Hoàn Thành

Đã xây dựng một ứng dụng React Native/Expo hoàn chỉnh để theo dõi dữ liệu miners từ API và phát thông báo local.

## 📦 Packages Cài Đặt

```json
{
  "expo-notifications": "^15.0.0+",
  "axios": "^1.x",
  "@react-native-async-storage/async-storage": "^1.x"
}
```

## 📁 File Tạo Mới

### 1. **config/minerConfig.ts** ⚙️
- Tập trung tất cả cấu hình
- Dễ dàng tùy chỉnh:
  - API URL & timeout
  - Fetch interval (2 phút)
  - Notification settings
  - Storage keys
  - UI configuration
  - Messages & formatting

### 2. **services/minerService.ts** 🔌
- Fetch dữ liệu từ API
- So sánh dữ liệu cũ/mới
- Gửi notifications
- Lưu/lấy dữ liệu từ AsyncStorage

**Tính năng:**
- `fetchMiners()` - Fetch từ API
- `getStoredMiners()` - Lấy dữ liệu cũ
- `compareMiners()` - So sánh & phát hiện thay đổi
- `sendNotification()` - Gửi notification
- `notifyNewMiners()` - Thông báo miners mới
- `notifyUpdatedMiners()` - Thông báo miners cập nhật
- `notifyRemovedMiners()` - Thông báo miners bị xóa

### 3. **hooks/useMinerFetcher.ts** 🎣
- Custom hook quản lý fetch logic
- Auto-start/stop fetching
- Manual refresh
- Error handling
- State management

**Return:**
```typescript
{
  miners: MinerData[],
  loading: boolean,
  error: string | null,
  lastUpdated: Date | null,
  isRunning: boolean,
  startFetching: () => Promise<void>,
  stopFetching: () => void,
  manualFetch: () => Promise<void>
}
```

### 4. **components/MinerList.tsx** 🎨
- Hiển thị danh sách miners
- Pull-to-refresh
- Empty state
- Loading indicator
- Formatted data display

**Thông tin hiển thị:**
- Task title (2 dòng)
- Reward (TAO)
- Video ID
- Miner hotkey (20 ký tự)
- Created date

### 5. **app/(tabs)/index.tsx** 📱
- Trang chính ứng dụng
- Control buttons (Start/Stop, Refresh)
- Status bar
- Error display
- Integration với MinerList

## 🔄 Quy Trình Hoạt Động

```
┌─────────────────────────────────────┐
│   App Mount                         │
│   - Request notification permissions│
│   - Start fetching                  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Fetch Interval (2 phút)           │
│   - Fetch API                       │
│   - Get stored data                 │
│   - Compare                         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Comparison Results                │
│   - New items?    → Notify          │
│   - Updated?      → Notify          │
│   - Removed?      → Notify          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Save & Update UI                  │
│   - Save to AsyncStorage            │
│   - Update state                    │
│   - Refresh list                    │
└─────────────────────────────────────┘
```

## 🔔 Notification Types

### 1. New Miners 🆕
```
Title: "[object Object] Miner Mới!"
Body: "Task 1\nTask 2"
Data: { type: 'new_miners', count: X }
```

### 2.[object Object]
```
Title: "📈 X Miner Được Cập Nhật!"
Body: "Tổng reward: +X.XXXXXX TAO"
Data: { type: 'updated_miners', count: X, totalReward: X }
```

### 3. Removed Miners ❌
```
Title: "❌ X Miner Bị Xóa"
Body: "Task 1, Task 2"
Data: { type: 'removed_miners', count: X }
```

## 💾 Data Storage

### AsyncStorage
- **Key:** `miners_data`
- **Format:** JSON array
- **Purpose:** Lưu dữ liệu để so sánh lần fetch tiếp theo

### Comparison Logic
```typescript
{
  newItems: [],      // Items không có trong dữ liệu cũ
  updatedItems: [],  // Items có reward thay đổi
  removedItems: []   // Items không có trong dữ liệu mới
}
```

## ⚙️ Configuration

### Thay đổi Fetch Interval
```typescript
// config/minerConfig.ts
FETCH: {
  INTERVAL_MS: 120000, // 2 phút
}
```

### Thay đổi API
```typescript
// config/minerConfig.ts
API: {
  BASE_URL: 'https://api-focus.omegatron.ai',
  ENDPOINT: '/miners/latest',
}
```

### Tắt/Bật Notifications
```typescript
// config/minerConfig.ts
NOTIFICATIONS: {
  ENABLED: true,
  SOUND: 'default',
  VIBRATION: true,
  BADGE: true,
}
```

## 🎯 Features

✅ **Auto Fetch** - Tự động fetch mỗi 2 phút  
✅ **Smart Comparison** - So sánh dữ liệu cũ/mới  
✅ **Notifications** - Thông báo local khi có thay đổi  
✅ **Local Storage** - Lưu dữ liệu vào AsyncStorage  
✅ **Manual Refresh** - Refresh thủ công hoặc pull-to-refresh  
✅ **Error Handling** - Xử lý lỗi gracefully  
✅ **Beautiful UI** - Giao diện đẹp & responsive  
✅ **Configurable** - Dễ dàng tùy chỉnh  

## [object Object] Response Format

```json
[
  {
    "video_id": "string",
    "task_id": "string",
    "miner_hotkey": "string",
    "earned_reward_tao": number,
    "created_at": "ISO 8601 date",
    "focusing_task": "string"
  }
]
```

## 🚀 Deployment

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web
```bash
npm run web
```

## 📝 Logs

Ứng dụng in ra console:
```
✅ Fetch thành công: { total: 10, new: 2, updated: 1, removed: 0 }
🟢 Bắt đầu fetch mỗi 120s
⏸️ Dừng fetch
❌ Lỗi fetch: Network Error
```

## 🔐 Security

- ✅ API URL từ config (dễ thay đổi)
- ✅ Timeout 10 giây cho API calls
- ✅ Error handling & logging
- ✅ Graceful degradation

## 📚 Documentation

- **QUICK_START.md** - Hướng dẫn nhanh (30 giây)
- **MINERS_TRACKER_README.md** - Hướng dẫn chi tiết
- **IMPLEMENTATION_SUMMARY.md** - File này

## 🎨 UI Components

### MinerList
- FlatList với pull-to-refresh
- Card-based design
- Empty state
- Loading indicator

### HomeScreen
- Header với title & subtitle
- Status bar (running/stopped)
- Error display
- Control buttons
- MinerList integration

## 🧪 Testing

Để test ứng dụng:

1. **Bắt đầu fetch**
   - Nhấn nút "▶️ Bắt đầu"
   - Kiểm tra console logs

2. **Kiểm tra notifications**
   - Mở Settings > Notifications
   - Đảm bảo ứng dụng có quyền
   - Chờ thông báo

3. **Manual refresh**
   - Nhấn nút "[object Object]- Hoặc kéo danh sách xuống

4. **Dừng fetch**
   - Nhấn nút "⏸️ Dừng"
   - Kiểm tra console logs

## 🐛 Known Issues

Không có vấn đề đã biết.

## 🔮 Future Improvements

- [ ] Thêm filter & search
- [ ] Thêm sorting options
- [ ] Thêm detailed view
- [ ] Thêm export data
- [ ] Thêm dark mode
- [ ] Thêm offline support
- [ ] Thêm analytics

## 📞 Support

Xem file `MINERS_TRACKER_README.md` để hướng dẫn chi tiết.

---

**Version:** 1.0.0  
**Created:** 2025-12-08  
**Status:** ✅ Production Ready

