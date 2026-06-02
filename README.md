# fe_old_tool_scan

Giao diện frontend cho hệ thống quét lỗ hổng bảo mật web có hỗ trợ AI. Ứng dụng cung cấp giao diện đồ họa theo phong cách retro để nhập mục tiêu quét, cấu hình tham số và xem kết quả lỗ hổng trả về từ backend.

## Tổng quan

Repository này chứa thành phần frontend React của hệ thống VULN_SCAN v2.0. Frontend giao tiếp với một dịch vụ backend riêng biệt chịu trách nhiệm crawl web và phát hiện lỗ hổng. Giao diện trình bày kết quả quét theo cấu trúc rõ ràng, bao gồm loại lỗ hổng, endpoint mục tiêu, phương thức HTTP, tham số dễ bị tấn công, payload, bằng chứng, giải thích từ LLM và mã remediation.

Hệ thống được thiết kế để sử dụng trên các ứng dụng web chấp nhận yêu cầu HTTP có hoặc không có xác thực. Hỗ trợ inject cookie phiên để quét các bề mặt tấn công yêu cầu xác thực, đặc biệt phù hợp với các môi trường kiểu DVWA trong quá trình đánh giá bảo mật.

## Tính năng

- Nhập URL mục tiêu để thực hiện quét lỗ hổng toàn diện
- Cấu hình độ sâu crawl (mức 1 đến 3) và số trang tối đa
- Inject cookie phiên để quét bề mặt web yêu cầu xác thực (ví dụ: DVWA PHPSESSID)
- Xem danh sách lỗ hổng đang hoạt động với thẻ chi tiết có thể thu gọn
- Mỗi finding hiển thị: loại lỗ hổng, endpoint, phương thức, tham số, payload, bằng chứng, giải thích từ LLM và mã remediation được tô màu cú pháp
- Lưu lịch sử quét và danh sách báo cáo theo phiên

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| HTTP Client | Axios |
| Tô màu cú pháp | react-syntax-highlighter |
| Giao diện | Hệ thống CSS phong cách retro / Windows 95 |
| Linting | ESLint với plugin React |

## Cấu trúc dự án

```
src/
  api/
    scanApi.js              # Axios wrapper cho endpoint /scanner/full-scan và /health
  components/
    layout/
      Header.jsx            # Thanh tiêu đề ứng dụng
      Footer.jsx            # Footer với các liên kết điều hướng
      StatusBar.jsx         # Thanh trạng thái hiển thị tab đang hoạt động
    scan/
      DashboardPanel.jsx    # Form quét chính và danh sách finding theo thời gian thực
      FindingCard.jsx       # Thẻ có thể thu gọn hiển thị chi tiết từng lỗ hổng
      ReportsPanel.jsx      # Bảng lịch sử báo cáo
      ScansPanel.jsx        # Bảng lịch sử lần quét
  hooks/
    useScan.js              # Custom hook quản lý trạng thái quét, loading và lỗi
  styles/
    retro.css               # Hệ thống thiết kế phong cách Windows 95
    index.css               # Biến CSS gốc và reset toàn cục
  utils/
    riskUtils.js            # Ánh xạ điểm rủi ro sang nhãn và màu sắc
  App.jsx                   # Component gốc với layout shell
  main.jsx                  # Điểm khởi động React
```

## Yêu cầu môi trường

- Node.js >= 18
- Một instance backend scanning service đang chạy

## Cài đặt

```bash
git clone https://github.com/SuDick11/fe_old_tool_scan.git
cd fe_old_tool_scan
npm install
```

## Cấu hình

Frontend xác định URL backend thông qua biến môi trường.

Để phát triển local, tạo file `.env.local` tại thư mục gốc của dự án:

```env
VITE_BACKEND_URL=http://localhost:8000
```

Trong môi trường production, URL backend được cấu hình sẵn trong `.env.production`:

```env
VITE_BACKEND_URL=https://automated-web-vulnerability-scanner-zclx.onrender.com
```

Nếu `VITE_BACKEND_URL` không được thiết lập, ứng dụng sẽ dùng chuỗi rỗng và dựa vào proxy của Vite dev server để chuyển tiếp yêu cầu đến `http://localhost:8000`.

## Chạy ở môi trường local

```bash
npm run dev
```

Dev server khởi động trên cổng 5173 theo mặc định. Proxy Vite được cấu hình để chuyển tiếp các route `/scanner` và `/health` đến backend tại `http://localhost:8000`, tự động xử lý CORS preflight.

## Build production

```bash
npm run build
```

Kết quả build production xuất ra thư mục `dist/`. Source map bị tắt trong cấu hình build production.

## Tích hợp API

Frontend giao tiếp với hai endpoint của backend:

### POST /scanner/full-scan

Khởi động quét lỗ hổng toàn diện.

Request body:

```json
{
  "url": "https://target.example.com",
  "max_depth": 2,
  "max_pages": 100,
  "dvwa_cookie": {
    "phpsessid": "session_id_value",
    "security": "low"
  }
}
```

Trường `dvwa_cookie` là tùy chọn, chỉ được đưa vào khi người dùng cung cấp cookie phiên. Giá trị `max_pages` mặc định là 100 nếu giá trị được cung cấp không phải số nguyên hợp lệ lớn hơn 0.

### GET /health

Endpoint kiểm tra trạng thái hoạt động của backend.

## Tham số quét

| Tham số | Mô tả | Mặc định |
|---|---|---|
| Target URL | URL đầy đủ của ứng dụng web cần quét | Bắt buộc |
| Depth | Độ sâu crawl — số cấp liên kết cần theo dõi (1, 2 hoặc 3) | 1 |
| Max Pages | Số URL tối đa cần crawl | 100 (default) |
| Cookie | Giá trị cookie PHPSESSID để quét xác thực | Tìm qua DevTools |

## Lưu ý bảo mật

Công cụ này chỉ được sử dụng trong các đánh giá bảo mật được ủy quyền và môi trường lab kiểm soát. Việc quét một ứng dụng web mà không có sự cho phép bằng văn bản của chủ sở hữu hệ thống là hành vi vi phạm pháp luật theo các quy định an ninh mạng hiện hành tại hầu hết các khu vực pháp lý.

File `.env.production` chứa URL backend production và được commit vào repository. Cần rà soát và thay thế mọi thông tin xác thực hoặc endpoint trước khi triển khai vào môi trường nhạy cảm.

Giá trị `security: "low"` được hardcode trong payload cookie DVWA là cấu hình đặc thù cho môi trường lab DVWA và không được sử dụng đối với hệ thống production.

## Linting

```bash
npm run lint
```

ESLint được cấu hình với `eslint:recommended` và `plugin:react/recommended`. Kiểm tra PropTypes và cảnh báo thuộc tính không xác định được tắt.

## Backend

Frontend là lớp giao diện của một hệ thống lớn hơn. Backend scanning engine là một dịch vụ riêng biệt. Backend production được triển khai tại:

```
https://automated-web-vulnerability-scanner-zclx.onrender.com
```

## Giấy phép

