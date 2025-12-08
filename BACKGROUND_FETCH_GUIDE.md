# 🌙 Background Fetch Guide

## Tổng Quan

App của bạn giờ đã được cấu hình để **tự động fetch dữ liệu ngầm** khi app chạy ở background hoặc thậm chí khi bị đóng.

## ⚙️ Cấu Hình

### 1. **Packages Đã Cài Đặt**
- `expo-background-fetch` - Quản lý background tasks
- `expo-task-manager` - Định nghĩa background tasks

### 2. **File Được Tạo/Sửa**

#### `services/backgroundFetchService.ts` (NEW)
- Định nghĩa background task `background-fetch-miners`
- Hàm `registerBackgroundFetch()` - Đăng ký background fetch
- Hàm `unregisterBackgroundFetch()` - Hủy đăng ký
- Hàm `isBackgroundFetchRegistered()` - Kiểm tra trạng thái

#### `app.json` (UPDATED)
- Thêm plugins: `expo-background-fetch`, `expo-task-manager`

#### `app/(tabs)/index.tsx` (UPDATED)
- Import `backgroundFetchService`
- Gọi `backgroundFetchService.registerBackgroundFetch(900)` khi app mount
- Thêm info section hiển thị trạng thái background fetch

#### `app/_layout.tsx` (NEW)
- Khởi tạo background fetch khi app start

## 🔄 Cách Hoạt Động

```
┌─────────────────────────────────────────┐
│         App Khởi Động                   │
│  (app/_layout.tsx useEffect)            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Đăng Ký Background Fetch Task          │
│  - Interval: 900 giây (15 phút)         │
│  - stopOnTerminate: false               │
│  - startOnBoot: true                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Mỗi 15 Phút (Background)               │
│  - Fetch dữ liệu từ API                 │
│  - So sánh với dữ liệu cũ               │
│  - Gửi notifications nếu có thay đổi    │
│  - Lưu dữ liệu vào storage              │
└─────────────────────────────────────────┘
```

## 📱 Hành Vi Trên Các Platform

### iOS
- ✅ Fetch mỗi 15 phút khi app ở background
- ✅ Fetch tiếp tục khi device khởi động lại
- ⚠️ Có thể bị hệ thống tối ưu hóa (nếu app không được sử dụng thường xuyên)

### Android
- ✅ Fetch mỗi 15 phút khi app ở background
- ✅ Fetch tiếp tục khi device khởi động lại
- ⚠️ Cần quyền `android.permission.RECEIVE_BOOT_COMPLETED`

## 🎯 Các Tính Năng

### 1. **Foreground Fetch** (Khi App Mở)
- Fetch mỗi 10 giây (hoặc interval được cấu hình)
- Hiển thị loading state
- Cập nhật UI ngay lập tức

### 2. **Background Fetch** (Khi App Ở Background)
- Fetch mỗi 15 phút
- Không cập nhật UI (chạy ngầm)
- Gửi notifications nếu có thay đổi
- Lưu dữ liệu vào storage

### 3. **Notifications**
- Thông báo khi có miner mới
- Thông báo khi miner được cập nhật
- Thông báo khi miner bị xóa

## [object Object]ử Dụng API

### Đăng Ký Background Fetch
```typescript
import { backgroundFetchService } from '@/services/backgroundFetchService';

// Đăng ký với interval 15 phút (900 giây)
await backgroundFetchService.registerBackgroundFetch(900);
```

### Hủy Đăng Ký
```typescript
await backgroundFetchService.unregisterBackgroundFetch();
```

### Kiểm Tra Trạng Thái
```typescript
const isRegistered = await backgroundFetchService.isBackgroundFetchRegistered();
console.log('Background fetch registered:', isRegistered);
```

## 📊 Logs

Background fetch task sẽ in logs khi chạy:
```
🌙 Background fetch task bắt đầu...
✅ Background fetch thành công: {
  total: 10,
  new: 2,
  updated: 1,
  removed: 0
}
```

## ⚠️ Lưu Ý Quan Trọng

1. **Interval Tối Thiểu**
   - iOS: 15 phút (900 giây)
   - Android: Không có giới hạn, nhưng nên >= 15 phút để tiết kiệm pin

2. **Battery & Data**
   - Background fetch sẽ tiêu tốn pin
   - Sẽ sử dụng dữ liệu di động
   - Nên cân nhắc interval phù hợp

3. **Permissions**
   - Cần quyền notifications
   - iOS: Cần `NSUserNotificationUsageDescription`
   - Android: Cần `android.permission.POST_NOTIFICATIONS`

4. **Testing**
   - Trên emulator/simulator, background fetch có thể không hoạt động
   - Nên test trên thiết bị thực

## 🧪 Testing Background Fetch

### iOS (Xcode)
```
Debug > Simulate Background Fetch
```

### Android (Android Studio)
```
Logcat > Search "background"
```

## 📝 Troubleshooting

### Background Fetch Không Chạy
1. Kiểm tra app có quyền notifications không
2. Kiểm tra device settings có cho phép background activity không
3. Kiểm tra logs trong Xcode/Android Studio

### Quá Nhiều Notifications
- Giảm interval từ 900 giây xuống (ví dụ: 600 giây = 10 phút)
- Hoặc tăng interval lên (ví dụ: 1800 giây = 30 phút)

### Pin Nhanh Hết
- Tăng interval (fetch ít hơn)
- Hoặc disable background fetch khi pin thấp

## 🚀 Next Steps

1. **Rebuild app** để áp dụng plugins mới:
   ```bash
   expo prebuild --clean
   ```

2. **Test trên thiết bị thực** để xác nhận background fetch hoạt động

3. **Monitor logs** để xem background fetch chạy bao giờ

4. **Adjust interval** nếu cần (hiện tại là 15 phút)

