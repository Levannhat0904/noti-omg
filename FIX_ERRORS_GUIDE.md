# 🔧 Hướng Dẫn Sửa Các Lỗi

## ✅ Các Lỗi Đã Sửa

### 1. **SafeAreaView Deprecated** ✓
**Vấn đề:** `SafeAreaView` từ `react-native` bị deprecated
**Giải pháp:** Đã thay thế bằng `SafeAreaView` từ `react-native-safe-area-context`
**File:** `screens/DashboardMetricsTab.tsx`

```typescript
// ❌ Cũ
import { SafeAreaView } from 'react-native';

// ✅ Mới
import { SafeAreaView } from 'react-native-safe-area-context';
```

### 2. **TypeError: Cannot read property 'toFixed' of null** ✓
**Vấn đề:** `item.video_score` có thể là `null`, gọi `.toFixed()` trên `null` gây lỗi
**Giải pháp:** Thêm kiểm tra null trước khi gọi `.toFixed()`
**File:** `components/molecules/VideosList.tsx` (dòng 64)

```typescript
// ❌ Cũ
{(item.video_score ?? 0).toFixed(1)}

// ✅ Mới
{item.video_score !== null && item.video_score !== undefined 
  ? item.video_score.toFixed(1) 
  : 'N/A'}
```

### 3. **Background Fetch Configuration Error** ✓
**Vấn đề:** Background Fetch chưa được cấu hình trong `Info.plist`
**Giải pháp:** Đã thêm xử lý lỗi tốt hơn trong `backgroundFetchService.ts`
**File:** `services/backgroundFetchService.ts`

Cấu hình trong `app.json` đã có:
```json
"ios": {
  "infoPlist": {
    "UIBackgroundModes": ["fetch"]
  }
}
```

---

## ⚠️ Các Cảnh Báo Còn Lại

### 1. **expo-background-fetch Deprecated**
```
WARN  expo-background-fetch: This library is deprecated. Use expo-background-task instead.
```

**Giải pháp:** Migrate sang `expo-background-task` (tùy chọn)
- Hiện tại vẫn hoạt động nhưng sẽ bị loại bỏ trong tương lai
- Nếu muốn migrate: `npm install expo-background-task`

### 2. **Reanimated Shared Value Warning**
```
WARN  It looks like you might be using shared value's .value inside reanimated inline style
```

**Giải pháp:** Sử dụng shared value trực tiếp thay vì `.value`
- Tìm các file sử dụng Reanimated animations
- Thay thế `sharedValue.value` bằng `sharedValue` trong inline styles

### 3. **expo-notifications Limitations**
```
WARN  expo-notifications: Android Push notifications functionality provided by expo-notifications 
was removed from Expo Go with the release of SDK 53. Use a development build instead of Expo Go.
```

**Giải pháp:** Sử dụng development build thay vì Expo Go
```bash
# Build development client
eas build --platform ios --profile preview
```

### 4. **shouldShowAlert Deprecated**
```
WARN  [expo-notifications]: `shouldShowAlert` is deprecated. Specify `shouldShowBanner` and / or `shouldShowList` instead.
```

**Giải pháp:** Cập nhật notification config
```typescript
// ❌ Cũ
shouldShowAlert: true

// ✅ Mới
shouldShowBanner: true,
shouldShowList: true
```

---

## 🚀 Các Bước Tiếp Theo

### 1. **Rebuild App**
```bash
# Xóa cache
rm -rf node_modules .expo

# Cài đặt lại
npm install

# Chạy lại
npm start
```

### 2. **Xóa Build Cache**
```bash
# iOS
rm -rf ios/Pods ios/Podfile.lock
cd ios && pod install && cd ..

# Android
./gradlew clean
```

### 3. **Kiểm Tra Lỗi**
```bash
# Xem linter errors
npm run lint

# Chạy tests
npm test
```

---

## 📋 Checklist

- [x] Sửa SafeAreaView deprecated
- [x] Sửa TypeError video_score.toFixed()
- [x] Thêm xử lý lỗi background fetch
- [ ] Migrate sang expo-background-task (tùy chọn)
- [ ] Sửa Reanimated shared value warnings
- [ ] Build development client cho notifications
- [ ] Cập nhật notification config

---

## [object Object]hi Chú

- **Background Fetch:** Cấu hình đã có trong `app.json`, nhưng cần rebuild native code để áp dụng
- **Expo Go:** Một số tính năng như push notifications không hoạt động trên Expo Go
- **Development Build:** Khuyến nghị sử dụng development build cho testing trên device thực

---

**Cập nhật:** 2025-12-08

