# [object Object]ướng Dẫn Chạy Ứng Dụng

## 1️⃣ Chuẩn Bị

### Kiểm tra Node.js
```bash
node --version  # Phải >= 16.0.0
npm --version   # Phải >= 8.0.0
```

### Kiểm tra Expo
```bash
expo --version  # Phải >= 50.0.0
```

## 2️⃣ Cài Đặt Dependencies

```bash
cd /Users/levannhat/Documents/noti-vid/noti
npm install
```

Hoặc nếu đã cài rồi:
```bash
npm ci
```

## 3️⃣ Chạy Ứng Dụng

### iOS (Simulator)
```bash
npm run ios
```

Hoặc:
```bash
expo start --ios
```

### Android (Emulator)
```bash
npm run android
```

Hoặc:
```bash
expo start --android
```

### Web
```bash
npm run web
```

Hoặc:
```bash
expo start --web
```

### Expo Go (Mobile)
```bash
npm start
# Hoặc
expo start
```

Sau đó:
- **iOS:** Mở Camera app, scan QR code
- **Android:** Mở Expo Go app, scan QR code

## 4️⃣ Cấp Quyền Notifications

Khi ứng dụng mở lần đầu:
1. Sẽ hiển thị dialog "Allow notifications?"
2. Nhấn **"Allow"** để cấp quyền
3. Nếu bỏ qua, có thể cấp quyền sau trong Settings

### Cấp quyền thủ công:

**iOS:**
1. Mở Settings > Noti
2. Tìm ứng dụng "noti"
3. Bật "Allow Notifications"

**Android:**
1. Mở Settings > Apps > noti
2. Tìm "Notifications"
3. Bật "Allow"

## 5️⃣ Sử Dụng Ứng Dụng

### Giao Diện Chính
```
┌─────────────────────────────────┐
│ 🎯 Miners Tracker               │
│ Theo dõi dữ liệu mỗi 120s       │
├─────────────────────────────────┤
│ Trạng thái: 🟢 Đang chạy        │
├─────────────────────────────────┤
│ 📊 Danh Sách Miners (10)        │
│ Cập nhật: 08:50:14              │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Create a Finalized...       │ │
│ │ 0.009738 TAO                │ │
│ │ Video: c38910               │ │
│ │ Miner: 5HBv1ZieCu4JGA...   │ │
│ │ Ngày: 12-07 07:56           │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [Miner card khác...]        │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ [▶️ Bắt đầu] [🔄 Refresh]      │
└─────────────────────────────────┘
```

### Các Nút Điều Khiển

| Nút | Chức Năng |
|-----|----------|
| ▶️ Bắt đầu | Bắt đầu fetch tự động |
| ⏸️ Dừng | Dừng fetch tự động |
| 🔄 Refresh | Fetch ngay lập tức |

### Pull-to-Refresh
- Kéo danh sách xuống để refresh
- Hoặc nhấn nút "🔄 Refresh"

## 6️⃣ Kiểm Tra Hoạt Động

### Xem Console Logs
```
iOS:
- Nhấn Cmd+D
- Chọn "Debug"

Android:
- Nhấn Cmd+M
- Chọn "Debug"

Web:
- Nhấn F12
- Mở Console tab
```

### Logs Sẽ Hiển Thị
```
✅ Fetch thành công: { total: 10, new: 2, updated: 1, removed: 0 }
🟢 Bắt đầu fetch mỗi 120s
⏸️ Dừng fetch
❌ Lỗi fetch: Network Error
```

### Kiểm Tra Notifications
1. Bắt đầu fetch
2. Chờ 2 phút
3. Nếu có dữ liệu mới, sẽ nhận notification
4. Kiểm tra Notification Center

## 7️⃣ Tùy Chỉnh Cấu Hình

### Thay Đổi Fetch Interval

**File:** `config/minerConfig.ts`

```typescript
FETCH: {
  INTERVAL_MS: 120000, // Thay đổi giá trị này
}
```

**Ví dụ:**
- 30 giây: `30000`
- 1 phút: `60000`
- 2 phút: `120000` (mặc định)
- 5 phút: `300000`

Sau đó restart ứng dụng (Cmd+R hoặc Cmd+Shift+R)

### Thay Đổi API URL

**File:** `config/minerConfig.ts`

```typescript
API: {
  BASE_URL: 'https://api-focus.omegatron.ai',
  ENDPOINT: '/miners/latest',
}
```

## 8️⃣ Troubleshooting

### Ứng dụng không chạy
```bash
# Clear cache
npm start -- --clear

# Hoặc
expo start --clear
```

### Notifications không hiển thị
1. Kiểm tra quyền trong Settings
2. Kiểm tra ứng dụng không bị mute
3. Kiểm tra console logs
4. Restart ứng dụng

### API không fetch
1. Kiểm tra kết nối internet
2. Xem console logs
3. Kiểm tra API URL trong config
4. Thử manual refresh

### Ứng dụng bị lag
1. Giảm tần suất fetch (tăng interval)
2. Xóa dữ liệu cũ
3. Restart ứng dụng
4. Xóa node_modules & cài lại

## 9️⃣ Xóa Dữ Liệu

### Xóa AsyncStorage Data
```bash
# Trong ứng dụng, mở console và chạy:
AsyncStorage.removeItem('miners_data')
```

### Xóa Cache
```bash
npm start -- --clear
```

### Xóa node_modules
```bash
rm -rf node_modules
npm install
```

## 🔟 Dừng Ứng Dụng

### Terminal
```bash
Ctrl+C
```

### Expo Menu
```
iOS: Cmd+D -> "Stop"
Android: Cmd+M -> "Stop"
Web: Ctrl+C
```

## 📱 Chạy Trên Thiết Bị Thực

### iOS (Real Device)
1. Cài Expo Go từ App Store
2. Chạy `npm start`
3. Scan QR code bằng Camera app
4. Ứng dụng sẽ mở trong Expo Go

### Android (Real Device)
1. Cài Expo Go từ Google Play
2. Chạy `npm start`
3. Scan QR code bằng Expo Go app
4. Ứng dụng sẽ mở

## 🎯 Workflow Hoàn Chỉnh

```bash
# 1. Mở terminal
cd /Users/levannhat/Documents/noti-vid/noti

# 2. Chạy ứng dụng
npm run ios  # hoặc android/web

# 3. Chờ ứng dụng mở
# (Nếu lần đầu, sẽ mất 1-2 phút)

# 4. Cấp quyền notifications
# (Nhấn "Allow" khi được hỏi)

# 5. Nhấn "▶️ Bắt đầu"
# (Ứng dụng sẽ bắt đầu fetch)

# 6. Chờ 2 phút
# (Sẽ fetch dữ liệu từ API)

# 7. Nhận notification
# (Nếu có dữ liệu mới)

# 8. Xem danh sách miners
# (Danh sách sẽ được cập nhật)
```

## 💡 Tips

- Giữ ứng dụng chạy ở background để nhận notifications
- Kiểm tra console logs để debug
- Thay đổi config để tùy chỉnh
- Xem QUICK_START.md để hướng dẫn nhanh

## 📞 Cần Giúp?

1. Xem **QUICK_START.md** - Hướng dẫn nhanh
2. Xem **MINERS_TRACKER_README.md** - Hướng dẫn chi tiết
3. Xem **IMPLEMENTATION_SUMMARY.md** - Tóm tắt implementation
4. Kiểm tra console logs

---

**Happy Tracking! 🎯**

