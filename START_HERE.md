# 🎯 START HERE - Bắt Đầu Tại Đây

> Chào mừng đến với **Miners Tracker** - Ứng dụng theo dõi dữ liệu miners từ API!

---

## ⚡ 30 Giây Để Chạy

### 1️⃣ Cài đặt
```bash
npm install
```

### 2️⃣ Chạy
```bash
npm run ios      # iOS
npm run android  # Android
npm run web      # Web
```

### 3️⃣ Sử dụng
- ✅ Cấp quyền notifications
- ✅ Nhấn "▶️ Bắt đầu"
- ✅ Chờ thông báo

**Done! 🎉**

---

## 📚 Hướng Dẫn Đầy Đủ

### Nếu bạn muốn...

| Bạn muốn... | Xem file... |
|-------------|-----------|
| 🚀 Chạy ngay | **QUICK_START.md** |
| 📖 Hướng dẫn chi tiết | **RUN_INSTRUCTIONS.md** |
| ⚙️ Tùy chỉnh cấu hình | **MINERS_TRACKER_README.md** |
| 🔧 Hiểu cách hoạt động | **IMPLEMENTATION_SUMMARY.md** |
| ✅ Kiểm tra hoàn thành | **CHECKLIST.md** |
| 📋 Xem files đã tạo | **FILES_CREATED.md** |

---

## 🎯 Tính Năng Chính

✨ **Auto Fetch** - Tự động fetch API mỗi 2 phút  
🔔 **Smart Notifications** - Thông báo khi có dữ liệu mới  
💾 **Local Storage** - Lưu dữ liệu vào AsyncStorage  
📊 **Data Comparison** - So sánh dữ liệu cũ/mới  
🎨 **Beautiful UI** - Giao diện đẹp & responsive  
⚙️ **Configurable** - Dễ dàng tùy chỉnh  

---

## 📁 Cấu Trúc Dự Án

```
noti/
├── config/minerConfig.ts              ⚙️ Cấu hình
├── services/minerService.ts           🔌 API & Notifications
├── hooks/useMinerFetcher.ts           🎣 Fetch logic
├── components/MinerList.tsx           🎨 UI
├── app/(tabs)/index.tsx               📱 Trang chính
└── [Documentation files]              📖 Hướng dẫn
```

---

## 🚀 Workflow

```
1. npm install
   ↓
2. npm run ios (hoặc android/web)
   ↓
3. Cấp quyền notifications
   ↓
4. Nhấn "▶️ Bắt đầu"
   ↓
5. Chờ 2 phút
   ↓
6. Nhận notification khi có dữ liệu mới
   ↓
7. Xem danh sách miners được cập nhật
```

---

## 🔔 Thông Báo

Ứng dụng sẽ gửi notification khi:

🆕 **Có miners mới**
- Tiêu đề: "[object Object] Miner Mới!"
- Nội dung: Tên task của 2 miner mới

📈 **Có miners được cập nhật**
- Tiêu đề: "📈 X Miner Được Cập Nhật!"
- Nội dung: Tổng reward thay đổi

❌ **Có miners bị xóa**
- Tiêu đề: "❌ X Miner Bị Xóa"
- Nội dung: Tên task của 2 miner bị xóa

---

## ⚙️ Cấu Hình

### Thay đổi tần suất fetch

**File:** `config/minerConfig.ts`

```typescript
FETCH: {
  INTERVAL_MS: 120000,  // Thay đổi giá trị này
}
```

**Ví dụ:**
- 30 giây: `30000`
- 1 phút: `60000`
- 2 phút: `120000` (mặc định)
- 5 phút: `300000`

### Thay đổi API URL

**File:** `config/minerConfig.ts`

```typescript
API: {
  BASE_URL: 'https://api-focus.omegatron.ai',
  ENDPOINT: '/miners/latest',
}
```

---

## 🆘 Gặp Vấn Đề?

### Thông báo không hiển thị
1. Kiểm tra quyền notifications trong Settings
2. Đảm bảo ứng dụng không bị mute
3. Xem console logs

### API không fetch
1. Kiểm tra kết nối internet
2. Xem console logs
3. Thử manual refresh

### Ứng dụng bị lag
1. Giảm tần suất fetch (tăng interval)
2. Xóa dữ liệu cũ
3. Restart ứng dụng

**Xem RUN_INSTRUCTIONS.md để troubleshooting chi tiết**

---

## 📝 Logs

Ứng dụng sẽ in ra console:

```
✅ Fetch thành công: { total: 10, new: 2, updated: 1, removed: 0 }
🟢 Bắt đầu fetch mỗi 120s
⏸️ Dừng fetch
❌ Lỗi fetch: Network Error
```

---

## 📱 Giao Diện

### Trang Chính
```
┌─────────────────────────────┐
│ 🎯 Miners Tracker           │
│ Theo dõi dữ liệu mỗi 120s   │
├─────────────────────────────┤
│ Trạng thái: 🟢 Đang chạy    │
├─────────────────────────────┤
│ 📊 Danh Sách Miners (10)    │
│ Cập nhật: 08:50:14          │
│                             │
│ ┌───────────────────────┐   │
│ │ Create a Finalized... │   │
│ │ 0.009738 TAO          │   │
│ │ Video: c38910         │   │
│ │ Miner: 5HBv1ZieCu4... │   │
│ │ Ngày: 12-07 07:56     │   │
│ └───────────────────────┘   │
├─────────────────────────────┤
│ [▶️ Bắt đầu] [🔄 Refresh]  │
└─────────────────────────────┘
```

---

## 💡 Tips

- 📖 Xem QUICK_START.md để hướng dẫn nhanh
- 🔧 Xem MINERS_TRACKER_README.md để tùy chỉnh
- 🚀 Xem RUN_INSTRUCTIONS.md để chạy chi tiết
- 📋 Xem FILES_CREATED.md để xem files đã tạo

---

## ✅ Checklist

- [ ] Cài đặt dependencies (`npm install`)
- [ ] Chạy ứng dụng (`npm run ios/android/web`)
- [ ] Cấp quyền notifications
- [ ] Nhấn "▶️ Bắt đầu"
- [ ] Chờ 2 phút
- [ ] Nhận notification
- [ ] Xem danh sách miners
- [ ] Tùy chỉnh cấu hình (nếu cần)

---

## 🎯 Tiếp Theo

1. **Chạy ứng dụng**
   ```bash
   npm install
   npm run ios
   ```

2. **Cấp quyền notifications**
   - Nhấn "Allow" khi được hỏi

3. **Bắt đầu fetch**
   - Nhấn nút "▶️ Bắt đầu"

4. **Chờ thông báo**
   - Sẽ nhận notification khi có dữ liệu mới

5. **Tùy chỉnh (tùy chọn)**
   - Mở `config/minerConfig.ts`
   - Thay đổi các giá trị cần thiết
   - Restart ứng dụng

---

## 📞 Cần Giúp?

1. **Hướng dẫn nhanh:** QUICK_START.md
2. **Hướng dẫn chi tiết:** RUN_INSTRUCTIONS.md
3. **Tùy chỉnh:** MINERS_TRACKER_README.md
4. **Implementation:** IMPLEMENTATION_SUMMARY.md
5. **Troubleshooting:** RUN_INSTRUCTIONS.md

---

## [object Object]ẵn Sàng!

Ứng dụng hoàn chỉnh & sẵn sàng sử dụng.

```bash
npm install && npm run ios
```

**Happy Tracking! 🎯**

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** 2025-12-08

