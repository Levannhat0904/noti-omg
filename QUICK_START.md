# 🚀 Quick Start - Background Fetch

## ✅ Đã Hoàn Thành

Background fetch đã được thêm vào app của bạn. App sẽ tự động fetch dữ liệu mỗi **15 phút** khi chạy ở background.

---

## 📋 Checklist

- ✅ Cài đặt packages: `expo-background-fetch`, `expo-task-manager`
- ✅ Tạo `services/backgroundFetchService.ts`
- ✅ Tạo `app/_layout.tsx`
- ✅ Cập nhật `app.json` (thêm plugins)
- ✅ Cập nhật `app/(tabs)/index.tsx` (thêm import & UI)

---

## [object Object]ước Tiếp Theo

### 1️⃣ Rebuild App (Bắt Buộc)

Vì đã thêm native plugins, cần rebuild:

```bash
cd /Users/levannhat/Documents/noti-vid/noti

# Option 1: Dùng expo prebuild
expo prebuild --clean

# Option 2: Dùng EAS (nếu có account)
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

### 2️⃣ Test Trên Thiết Bị Thực

⚠️ **Quan trọng**: Background fetch **KHÔNG hoạt động** trên emulator/simulator

```bash
# iOS
expo run:ios

# Android
expo run:android
```

### 3️⃣ Verify Hoạt Động

1. Mở app
2. Đóng app (hoặc chuyển sang app khác)
3. Chờ 15 phút
4. Kiểm tra:
   - Notifications có xuất hiện không?
   - Logs có in ra không?

---

## 📊 Cấu Hình Hiện Tại

| Tham Số | Giá Trị | Ghi Chú |
|---------|--------|--------|
| Interval | 900 giây (15 phút) | iOS yêu cầu tối thiểu 15 phút |
| stopOnTerminate | false | Tiếp tục khi app bị đóng |
| startOnBoot | true | Bắt đầu khi device khởi động |

---

## 🎯 Cách Hoạt Động

```
App Mở (Foreground)
├─ Fetch mỗi 10 giây
├─ Cập nhật UI
└─ Background fetch chạy song song

App Ở Background
├─ Fetch mỗi 15 phút
├─ Gửi notifications
└─ Lưu dữ liệu

App Bị Đóng
├─ Fetch vẫn mỗi 15 phút
├─ Gửi notifications
└─ Tiếp tục khi device khởi động
```

---

## 🔍 Logs

Khi background fetch chạy, sẽ in logs:

```
🌙 Background fetch task bắt đầu...
✅ Background fetch thành công: {
  total: 10,
  new: 2,
  updated: 1,
  removed: 0
}
```

**Xem logs**:
- iOS: Xcode Console
- Android: Android Studio Logcat

---

## ⚙️ Tuỳ Chỉnh Interval

Nếu muốn thay đổi interval, sửa trong `app/_layout.tsx`:

```typescript
// Hiện tại: 15 phút
backgroundFetchService.registerBackgroundFetch(900);

// Thay đổi thành:
backgroundFetchService.registerBackgroundFetch(600);   // 10 phút
backgroundFetchService.registerBackgroundFetch(1800);  // 30 phút
backgroundFetchService.registerBackgroundFetch(3600);  // 1 giờ
```

---

## ⚠️ Lưu Ý

1. **Rebuild là bắt buộc** vì đã thêm native plugins
2. **Test trên thiết bị thực** - emulator không hỗ trợ background fetch
3. **Battery & Data** - background fetch sẽ tiêu tốn pin và dữ liệu
4. **Permissions** - app cần quyền notifications (đã được cấu hình)

---

## 📚 Tài Liệu Thêm

- `BACKGROUND_FETCH_GUIDE.md` - Hướng dẫn chi tiết
- `CHANGES_SUMMARY.md` - Tóm tắt những thay đổi

---

## ❓ Troubleshooting

### Background fetch không chạy?
- Kiểm tra app có quyền notifications
- Kiểm tra device settings
- Xem logs trong Xcode/Android Studio

### Quá nhiều notifications?
- Tăng interval (ví dụ: 1800 giây = 30 phút)

### Pin nhanh hết?
- Tăng interval
- Hoặc disable background fetch khi pin thấp

---

## ✨ Done!

App của bạn giờ đã có background fetch. Chỉ cần rebuild và test! 🎉
