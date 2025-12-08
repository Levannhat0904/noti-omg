# 🎯 Miners Tracker - Hướng Dẫn Sử Dụng

Ứng dụng theo dõi dữ liệu miners từ API và phát thông báo local khi có thay đổi.

## [object Object]ính Năng

✅ **Fetch API mỗi 2 phút** - Tự động kiểm tra dữ liệu mới từ `https://api-focus.omegatron.ai/miners/latest`

✅ **So sánh dữ liệu** - Phát hiện:
- 🆕 Miners mới
- 📈 Miners được cập nhật (reward thay đổi)
- ❌ Miners bị xóa

✅ **Thông báo Local** - Gửi notification khi có thay đổi:
- Tiêu đề rõ ràng
- Âm thanh & vibration
- Badge count

✅ **Lưu trữ Local** - Dữ liệu được lưu vào AsyncStorage

✅ **Giao diện thân thiện** - Hiển thị danh sách miners với:
- Tên task
- Reward (TAO)
- Video ID
- Miner hotkey
- Thời gian tạo

## 🚀 Cài Đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy ứng dụng
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📁 Cấu Trúc File

```
noti/
├── services/
│   └── minerService.ts          # Service fetch API & notifications
├── hooks/
│   └── useMinerFetcher.ts       # Hook quản lý fetch logic
├── components/
│   └── MinerList.tsx            # Component hiển thị danh sách
└── app/(tabs)/
    └── index.tsx                # Trang chính
```

## 🔧 Cấu Hình

### Thay đổi interval fetch
Trong `app/(tabs)/index.tsx`, thay đổi giá trị:
```typescript
const fetcher = useMinerFetcher(120000); // 120000ms = 2 phút
```

Các giá trị phổ biến:
- 30 giây: `30000`
- 1 phút: `60000`
- 2 phút: `120000`
- 5 phút: `300000`

### Thay đổi API URL
Trong `services/minerService.ts`:
```typescript
const API_URL = 'https://api-focus.omegatron.ai/miners/latest';
```

## 📱 Giao Diện

### Trang Chính
- **Header**: Tiêu đề & mô tả
- **Status Bar**: Hiển thị trạng thái (Đang chạy/Dừng) & lỗi
- **Miner List**: Danh sách miners với pull-to-refresh
- **Control Buttons**: Nút Bắt đầu/Dừng & Refresh

### Miner Card
Mỗi miner hiển thị:
- 📝 Tên task (2 dòng)
- 💰 Reward (TAO)
- 🎬 Video ID
- 🔑 Miner hotkey (20 ký tự đầu)
- 📅 Ngày tạo

## 🔔 Thông Báo

### Loại thông báo:
1. **Miners Mới** 🆕
   - Tiêu đề: "[object Object] Miner Mới!"
   - Nội dung: Tên task của 2 miner mới

2. **Miners Cập Nhật** 📈
   - Tiêu[object Object] Miner Được Cập Nhật!"
   - Nội dung: Tổng reward thay đổi

3. **Miners Bị Xóa** ❌
   - Tiêu đề: "❌ X Miner Bị Xóa"
   - Nội dung: Tên task của 2 miner bị xóa

## 💾 Lưu Trữ

Dữ liệu được lưu vào AsyncStorage với key: `miners_data`

Để xóa dữ liệu:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.removeItem('miners_data');
```

## [object Object]eshooting

### Thông báo không hiển thị
1. Kiểm tra quyền notifications trong settings
2. Đảm bảo ứng dụng không bị mute
3. Kiểm tra console logs

### API không fetch
1. Kiểm tra kết nối internet
2. Xem console logs để tìm lỗi
3. Thử manual refresh

### Ứng dụng bị lag
1. Giảm tần suất fetch (tăng interval)
2. Xóa dữ liệu cũ từ AsyncStorage
3. Restart ứng dụng

## [object Object]ữ Liệu API

API trả về mảng objects với cấu trúc:
```json
{
  "video_id": "string",
  "task_id": "string",
  "miner_hotkey": "string",
  "earned_reward_tao": number,
  "created_at": "ISO 8601 date string",
  "focusing_task": "string"
}
```

## 🎨 Tùy Chỉnh Giao Diện

### Thay đổi màu
Trong `components/MinerList.tsx` & `app/(tabs)/index.tsx`:
```typescript
backgroundColor: '#4CAF50'  // Xanh
backgroundColor: '#FF6B6B'  // Đỏ
backgroundColor: '#2196F3'  // Xanh dương
```

### Thay đổi font size
Tìm `fontSize` trong StyleSheet và thay đổi giá trị

## 📝 Log

Ứng dụng in ra console:
- ✅ Fetch thành công với số lượng items
- ❌ Lỗi fetch
- ⏸️ Dừng fetch
- [object Object]ắt đầu fetch

## 🔐 Bảo Mật

- API URL không được hardcode trong production
- Sử dụng environment variables cho API keys
- Không lưu sensitive data vào AsyncStorage

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Xem file `MINERS_TRACKER_README.md`
3. Restart ứng dụng
4. Xóa node_modules và cài lại

---

**Phiên bản**: 1.0.0  
**Cập nhật lần cuối**: 2025-12-08

