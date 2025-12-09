# Hướng Dẫn Tích Hợp Dashboard Metrics Tab

## 📋 Tổng Quan

Đã tạo một tab hoàn chỉnh để hiển thị dữ liệu từ API Dashboard Metrics với các thành phần sau:

### 📁 Cấu Trúc Thư Mục

```
services/
├── dashboardMetricsService.ts       # Service để fetch và cache dữ liệu API

components/
├── atoms/
│   ├── MetricCard.tsx              # Card hiển thị metric đơn
│   ├── LoadingSpinner.tsx           # Spinner loading
│   └── ErrorMessage.tsx             # Thông báo lỗi
├── molecules/
│   ├── MetricsGrid.tsx              # Grid hiển thị các metrics chính
│   ├── TopMinerCard.tsx             # Card hiển thị top miner
│   ├── MarketplaceRatioChart.tsx    # Biểu đồ tỷ lệ marketplace
│   ├── KPIsSection.tsx              # Section hiển thị KPIs
│   ├── VideosList.tsx               # Danh sách videos
│   └── LiveSessionsList.tsx         # Danh sách live sessions

screens/
└── DashboardMetricsTab.tsx          # Main tab component
```

## 🚀 Cách Tích Hợp

### 1. Thêm vào Navigation (nếu sử dụng React Navigation)

```typescript
import { DashboardMetricsTab } from './screens/DashboardMetricsTab';

// Trong Bottom Tab Navigator hoặc Stack Navigator
<Tab.Screen
  name="Dashboard"
  component={DashboardMetricsTab}
  options={{
    tabBarLabel: 'Dashboard',
    tabBarIcon: ({ color, size }) => (
      <Icon name="chart-line" size={size} color={color} />
    ),
  }}
/>
```

### 2. Hoặc sử dụng trực tiếp trong component

```typescript
import { DashboardMetricsTab } from './screens/DashboardMetricsTab';

export default function App() {
  return <DashboardMetricsTab />;
}
```

## 🎨 Tính Năng

### ✅ Đã Triển Khai

1. **Metrics Grid** - Hiển thị 6 metrics chính:
   - Tổng TAO Kiếm
   - Số Video Mua
   - Miners Hoạt Động
   - Trung Bình Reward/Video
   - Người Dùng Hoạt Động (Tuần)
   - Tổng Focussers

2. **Top Miner Card** - Hiển thị:
   - Hotkey của top miner
   - Tổng kiếm của top miner

3. **Marketplace Ratio Chart** - Biểu đồ thanh hiển thị:
   - Tỷ lệ USER
   - Tỷ lệ BOOSTED
   - Tỷ lệ MARKETPLACE

4. **KPIs Section** - Hiển thị:
   - Tổng giờ tập trung
   - Tổng TAO đã trả
   - Điểm trung bình (nonzero)
   - Giờ trung bình/người dùng

5. **Live Sessions** - Danh sách các phiên hoạt động với:
   - Hotkey người dùng
   - TAO Balance
   - Alpha Balance
   - Task ID đang tập trung
   - Thời gian bắt đầu

6. **Videos List** - Danh sách videos với:
   - Tiêu đề task
   - Video ID
   - Điểm video
   - Trạng thái xử lý
   - Thời gian tạo/cập nhật

### 🔄 Caching

- Dữ liệu được cache trong AsyncStorage
- Thời gian cache: 5 phút
- Nếu API lỗi, sẽ sử dụng dữ liệu từ cache

### 🔃 Refresh

- Hỗ trợ pull-to-refresh
- Tự động refresh khi component mount
- Có thể refresh thủ công bằng cách kéo xuống

## 📱 UI/UX

- **Atomic Design**: Sử dụng atoms (MetricCard, LoadingSpinner) và molecules (MetricsGrid, etc.)
- **Responsive**: Tự động điều chỉnh theo kích thước màn hình
- **Loading State**: Hiển thị spinner khi đang tải
- **Error State**: Hiển thị thông báo lỗi với nút retry
- **Color Scheme**: Sử dụng màu sắc rõ ràng và dễ nhìn

## 🔧 Tùy Chỉnh

### Thay Đổi Thời Gian Cache

```typescript
// Trong dashboardMetricsService.ts
const CACHE_DURATION = 10 * 60 * 1000; // 10 phút
```

### Thay Đổi API URL

```typescript
// Trong dashboardMetricsService.ts
const API_URL = 'https://your-api-url.com/endpoint';
```

### Thay Đổi Màu Sắc

Tất cả các component đều hỗ trợ prop `color` để tùy chỉnh màu sắc.

## 📦 Dependencies

Đảm bảo bạn đã cài đặt:

```bash
npm install @react-native-async-storage/async-storage
npm install @react-navigation/native
```

## 🐛 Debugging

### Xem Logs

```typescript
// Trong DashboardMetricsTab.tsx
console.log('Metrics:', metrics);
```

### Xóa Cache

```typescript
import { dashboardMetricsService } from './services/dashboardMetricsService';

await dashboardMetricsService.clearCache();
```

## [object Object] Response Structure

```json
{
  "total_tao_earned": number,
  "total_videos_purchased": number,
  "active_miners_count": number,
  "avg_reward_per_video": number,
  "top_miner_hotkey": string,
  "top_miner_earnings": number,
  "weekly_active_users": number,
  "total_focussers": number,
  "marketplace_vs_user_ratio": {
    "USER": number,
    "BOOSTED": number,
    "MARKETPLACE": number
  },
  "live_sessions": number,
  "videos": Video[],
  "live_sessions_data": LiveSession[],
  "kpis": KPIs
}
```

## ✨ Tính Năng Có Thể Thêm Trong Tương Lai

- [ ] Biểu đồ thống kê chi tiết
- [ ] Lọc và sắp xếp videos
- [ ] Tìm kiếm hotkey
- [ ] Xuất dữ liệu CSV
- [ ] Thông báo khi có thay đổi lớn
- [ ] Dark mode support
- [ ] Animations

## [object Object]eshooting

### Lỗi: "Cannot find module"

Đảm bảo tất cả các file được tạo trong đúng thư mục.

### Lỗi: "API Error"

Kiểm tra:
- URL API có chính xác không
- Network connection
- CORS headers (nếu cần)

### Dữ liệu không cập nhật

- Xóa cache: `dashboardMetricsService.clearCache()`
- Kiểm tra thời gian cache
- Thử refresh lại

---

**Tác Giả**: Cascade AI Assistant
**Ngày Tạo**: 2025-12-08
**Phiên Bản**: 1.0

