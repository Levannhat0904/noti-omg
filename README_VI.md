# 🎯 Miners Tracker - Ứng Dụng Theo Dõi Dữ Liệu Miners

> Ứng dụng React Native/Expo để theo dõi dữ liệu miners từ API và phát thông báo local khi có thay đổi.

## ✨ Tính Năng

- 🔄 **Auto Fetch** - Tự động fetch API mỗi 2 phút
- 🔔 **Smart Notifications** - Thông báo khi có dữ liệu mới, cập nhật, hoặc bị xóa
- [object Object] Lưu dữ liệu vào AsyncStorage
- 📊 **Data Comparison** - So sánh dữ liệu cũ/mới tự động
- [object Object] UI** - Giao diện đẹp & responsive
- ⚙️ **Configurable** - Dễ dàng tùy chỉnh mọi thứ
- [object Object]-Platform** - Hỗ trợ iOS, Android, Web

## 🚀 Quick Start (30 giây)

### 1. Cài đặt
```bash
npm install
```

### 2. Chạy
```bash
npm run ios      # iOS
npm run android  # Android
npm run web      # Web
```

### 3. Sử dụng
- Nhấn "▶️ Bắt đầu" để bắt đầu fetch
- Chờ thông báo khi có dữ liệu mới
- Nhấn "🔄 Refresh" để fetch ngay lập tức

## 📁 Cấu Trúc Dự Án

```
noti/
├── config/
│   └── minerConfig.ts              ⚙️ Cấu hình chính
├── services/
│   └── minerService.ts             🔌 API & Notifications
├── hooks/
│   └── useMinerFetcher.ts          🎣 Fetch logic
├── components/
│   └── MinerList.tsx               🎨 UI Component
├── app/(tabs)/
│   └── index.tsx                   📱 Trang chính
├── QUICK_START.md                  📖 Hướng dẫn nhanh
├── RUN_INSTRUCTIONS.md             📖 Hướng dẫn chạy
├── MINERS_TRACKER_README.md        📖 Hướng dẫn chi tiết
└── IMPLEMENTATION_SUMMARY.md       📖 Tóm tắt implementation
```

## 🔧 Cấu Hình

### Thay đổi Fetch Interval
```typescript
// config/minerConfig.ts
FETCH: {
  INTERVAL_MS: 120000, // 2 phút
}
```

### Thay đổi API URL
```typescript
// config/minerConfig.ts
API: {
  BASE_URL: 'https://api-focus.omegatron.ai',
  ENDPOINT: '/miners/latest',
}
```

## 📱 Giao Diện

### Trang Chính
- **Header** - Tiêu đề & mô tả
- **Status Bar** - Trạng thái (Đang chạy/Dừng)
- **Miner List** - Danh sách miners với pull-to-refresh
- **Control Buttons** - Nút Bắt đầu/Dừng & Refresh

### Miner Card
Mỗi miner hiển thị:
- 📝 Tên task
- 💰 Reward (TAO)
- 🎬 Video ID
- 🔑 Miner hotkey
- 📅 Ngày tạo

## 🔔 Thông Báo

### Loại Thông Báo

1. **Miners Mới** [object Object]
   Tiêu đề: "[object Object] Miner Mới!"
   Nội dung: Tên task của 2 miner mới
   ```

2. **Miners Cập[object Object]
   ```
   Tiêu đề: "📈 X Miner Được Cập Nhật!"
   Nội dung: "Tổng reward: +X.XXXXXX TAO"
   ```

3. **Miners Bị Xóa** ❌
   ```
   Tiêu đề: "❌ X Miner Bị Xóa"
   Nội dung: Tên task của 2 miner bị xóa
   ```

## [object Object]uy Trình Hoạt Động

```
App Mount
   ↓
Request Permissions
   ↓
Start Fetching (mỗi 2 phút)
   ↓
Fetch API
   ↓
Compare Data (old vs new)
   ↓
Send Notifications (nếu có thay đổi)
   ↓
Save to Storage
   ↓
Update UI
```

## 💾 Data Storage

- **Key:** `miners_data`
- **Format:** JSON array
- **Purpose:** Lưu dữ liệu để so sánh lần fetch tiếp theo

## 📦 Dependencies

```json
{
  "expo-notifications": "^15.0.0+",
  "axios": "^1.x",
  "@react-native-async-storage/async-storage": "^1.x"
}
```

## 🎯 API Response Format

```json
[
  {
    "video_id": "c38910",
    "task_id": "c38910",
    "miner_hotkey": "5HBv1ZieCu4JGA58xhTBiDoLWbkCseEH7sG2a24YVSViRnD8",
    "earned_reward_tao": 0.009738650046037255,
    "created_at": "2025-12-07T07:56:46.681877Z",
    "focusing_task": "Create a Finalized Surgery List Document"
  }
]
```

## 🧪 Testing

### Bắt Đầu Fetch
1. Nhấn nút "▶️ Bắt đầu"
2. Kiểm tra console logs
3. Chờ 2 phút

### Kiểm Tra Notifications
1. Mở Settings > Notifications
2. Đảm bảo ứng dụng có quyền
3. Chờ thông báo

### Manual Refresh
1. Nhấn nút "🔄 Refresh"
2. Hoặc kéo danh sách xuống

## [object Object]eshooting

| Vấn Đề | Giải Pháp |
|--------|----------|
| Thông báo không hiển thị | Kiểm tra quyền notifications |
| API không fetch | Kiểm tra kết nối internet |
| Ứng dụng bị lag | Giảm tần suất fetch |
| Dữ liệu không cập nhật | Thử manual refresh |

## 📚 Documentation

- **QUICK_START.md** - Hướng dẫn nhanh (30 giây)
- **RUN_INSTRUCTIONS.md** - Hướng dẫn chạy chi tiết
- **MINERS_TRACKER_README.md** - Hướng dẫn sử dụng chi tiết
- **IMPLEMENTATION_SUMMARY.md** - Tóm tắt implementation
- **CHECKLIST.md** - Checklist hoàn thành

## 🔐 Security

- ✅ API URL từ config (dễ thay đổi)
- ✅ Error handling & logging
- ✅ Timeout configuration
- ✅ No hardcoded secrets

## 🎨 Tùy Chỉnh

### Thay Đổi Màu
```typescript
// components/MinerList.tsx
backgroundColor: '#4CAF50'  // Xanh
backgroundColor: '#FF6B6B'  // Đỏ
backgroundColor: '#2196F3'  // Xanh dương
```

### Thay Đổi Font Size
```typescript
// Tìm fontSize trong StyleSheet
fontSize: 16  // Thay đổi giá trị
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

## 🎯 Features Highlights

| Feature | Status |
|---------|--------|
| Auto Fetch (2 phút) | ✅ |
| Smart Notifications | ✅ |
| Data Comparison | ✅ |
| Local Storage | ✅ |
| Manual Refresh | ✅ |
| Error Handling | ✅ |
| Beautiful UI | ✅ |
| Configurable | ✅ |

## 🔮 Future Improvements

- [ ] Thêm filter & search
- [ ] Thêm sorting options
- [ ] Thêm detailed view
- [ ] Thêm export data
- [ ] Thêm dark mode
- [ ] Thêm offline support
- [ ] Thêm analytics

## 💡 Tips & Tricks

### Tối ưu hiệu suất
- Tăng interval fetch nếu ứng dụng bị lag
- Xóa dữ liệu cũ định kỳ

### Debug
- Mở console (Cmd+D iOS, Cmd+M Android)
- Kiểm tra Network tab
- Xem logs

## 📞 Support

1. Xem **QUICK_START.md** - Hướng dẫn nhanh
2. Xem **RUN_INSTRUCTIONS.md** - Hướng dẫn chạy
3. Xem **MINERS_TRACKER_README.md** - Hướng dẫn chi tiết
4. Kiểm tra console logs

## 📄 License

MIT

## 👨[object Object]

Created with ❤️ for Miners Tracking

## 🎉 Ready to Use!

✅ Ứng dụng hoàn chỉnh & sẵn sàng sử dụng

```bash
npm install
npm run ios  # hoặc android/web
```

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** 2025-12-08

