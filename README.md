# Fuji Store - Fullstack React + Django REST

Fuji Store là dự án thương mại điện tử mô phỏng cửa hàng máy ảnh Fujifilm, được xây dựng theo kiến trúc fullstack tách riêng frontend và backend. Dự án có các luồng nghiệp vụ gần với sản phẩm thực tế: danh mục sản phẩm, biến thể, tồn kho, giỏ hàng, đặt hàng, hồ sơ người dùng, địa chỉ giao hàng và chatbot tư vấn sản phẩm dùng OpenRouter.

## Tổng Quan

| Hạng mục | Thông tin |
| --- | --- |
| Frontend | React 19, Vite 8, React Router DOM 7 |
| Backend | Django 5.2, Django REST Framework |
| Xác thực | JWT với Simple JWT, refresh token blacklist |
| Database phát triển | SQLite |
| Media | Django media upload cho ảnh sản phẩm |
| UI libraries | Bootstrap 5, React Bootstrap, Swiper |
| AI assistant | OpenRouter Chat Completions API |
| Hỗ trợ deploy | Vercel frontend, Gunicorn/Whitenoise backend |

## Tính Năng Chính

- Hiển thị danh sách sản phẩm theo series/danh mục.
- Tìm kiếm sản phẩm trên header với gợi ý nhanh.
- Lọc sản phẩm theo giá, loại, series và các bộ lọc cấu hình động.
- Chi tiết sản phẩm gồm ảnh, màu sắc, biến thể, thông số và mô tả.
- Hiển thị trạng thái hết hàng khi tổng tồn kho bằng 0.
- Giỏ hàng cho khách vãng lai bằng `localStorage`.
- Giỏ hàng cho người dùng đã đăng nhập qua API backend.
- Kiểm tra tồn kho khi thêm vào giỏ, cập nhật số lượng và checkout.
- Checkout tạo đơn hàng, lưu snapshot sản phẩm và trừ tồn kho an toàn trong transaction.
- Quản lý tài khoản, hồ sơ, đổi mật khẩu và địa chỉ giao hàng.
- Lịch sử đơn hàng trong trang profile.
- Chatbox nổi bên phải màn hình, gọi OpenRouter qua backend proxy.
- Chatbot có context sản phẩm từ database: tên, giá, biến thể và tồn kho.

## Công Nghệ Sử Dụng

### Frontend

- **React 19**: xây dựng giao diện theo component.
- **Vite 8**: dev server và build tool tốc độ cao.
- **React Router DOM 7**: điều hướng SPA.
- **Bootstrap 5 / React Bootstrap**: layout và một số thành phần UI.
- **Swiper**: carousel sản phẩm trên trang chủ.
- **CSS theo component**: mỗi màn hình/component có file CSS riêng.
- **Browser storage**:
  - `localStorage`: token đăng nhập và giỏ hàng khách vãng lai.
  - `sessionStorage`: cache API ngắn hạn cho danh sách/chi tiết sản phẩm.

### Backend

- **Django 5.2**: web framework chính.
- **Django REST Framework**: xây dựng REST API.
- **Simple JWT**: cấp và refresh access token.
- **django-filter**: lọc dữ liệu sản phẩm.
- **Pillow**: xử lý ảnh upload.
- **Whitenoise**: phục vụ static files khi deploy.
- **Gunicorn**: WSGI server cho production.
- **python-dotenv**: đọc biến môi trường local từ `.env`.
- **SQLite**: database phát triển mặc định.

### AI / Chatbot

- Backend proxy endpoint: `POST /api/chatbot/`.
- OpenRouter endpoint: `https://openrouter.ai/api/v1/chat/completions`.
- Model mặc định: `openai/gpt-4o-mini`.
- API key chỉ nằm ở backend environment, không đưa vào frontend.
- Lịch sử chat chỉ được giữ trong React state của lần mở trang hiện tại.
- Mỗi request chatbot sẽ lấy context sản phẩm liên quan từ DB để trả lời về giá và tồn kho.

## Kiến Trúc Thư Mục

```text
BTL_REACTJS/
|-- backend/
|   |-- apps/
|   |   |-- authentication/   # Đăng ký, đăng nhập, logout, OTP, reset password
|   |   |-- users/            # Hồ sơ người dùng, đổi mật khẩu
|   |   |-- addresses/        # Sổ địa chỉ giao hàng
|   |   |-- products/         # Loại, series, danh mục, sản phẩm, biến thể, tồn kho
|   |   |-- cart/             # Giỏ hàng người dùng
|   |   |-- orders/           # Checkout, đơn hàng, order items
|   |   `-- chatbot/          # Proxy OpenRouter và context sản phẩm DB
|   |-- backend/              # Settings, urls, ASGI/WSGI
|   |-- media/                # Ảnh sản phẩm upload local
|   |-- db.sqlite3            # Database local
|   `-- requirements.txt
|
|-- frontend/
|   |-- public/               # Static assets, logo, icon chatbox
|   |-- src/
|   |   |-- components/       # UI pages/components
|   |   |-- utils/            # API helper, guest cart helper
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- package.json
|   `-- vite.config.js
|
`-- README.md
```

## API Chính

### Authentication

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| POST | `/api/auth/register/` | Đăng ký tài khoản |
| POST | `/api/auth/login/` | Đăng nhập và nhận JWT |
| POST | `/api/auth/logout/` | Logout và blacklist refresh token |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| POST | `/api/auth/send-otp/` | Gửi OTP |
| POST | `/api/auth/verify-otp/` | Xác minh OTP |
| POST | `/api/auth/reset-password/` | Đặt lại mật khẩu |

### Products

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/api/product-types/` | Danh sách loại sản phẩm |
| GET | `/api/series/` | Danh sách series |
| GET | `/api/categories/` | Danh sách danh mục |
| GET | `/api/products/` | Danh sách sản phẩm, filter, search, pagination |
| GET | `/api/products/{id}/` | Chi tiết sản phẩm |

### Cart & Checkout

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET | `/api/cart/` | Lấy giỏ hàng |
| POST | `/api/cart/add/` | Thêm sản phẩm vào giỏ |
| PUT | `/api/cart/{item_id}/` | Cập nhật số lượng/biến thể |
| DELETE | `/api/cart/{item_id}/` | Xóa sản phẩm khỏi giỏ |
| POST | `/api/checkout/` | Tạo đơn hàng và trừ tồn kho |

### Users, Addresses, Orders

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| GET/PUT | `/api/users/me/` | Xem/cập nhật hồ sơ |
| POST | `/api/users/change-password/` | Đổi mật khẩu |
| GET/POST | `/api/addresses/` | Danh sách/thêm địa chỉ |
| PUT/DELETE | `/api/addresses/{id}/` | Sửa/xóa địa chỉ |
| POST | `/api/addresses/{id}/set-default/` | Đặt địa chỉ mặc định |
| GET | `/api/orders/` | Lịch sử đơn hàng |
| GET | `/api/orders/{id}/` | Chi tiết đơn hàng |

### Chatbot

| Method | Endpoint | Mô tả |
| --- | --- | --- |
| POST | `/api/chatbot/` | Gửi tin nhắn đến chatbot, backend thêm context sản phẩm từ DB và gọi OpenRouter |

## Xử Lý Tồn Kho

Dự án không chỉ hiển thị tồn kho ở frontend. Backend có các lớp bảo vệ:

- Khi thêm/cập nhật giỏ hàng, API kiểm tra số lượng không vượt quá `variant.stock`.
- Khi checkout, backend dùng transaction và cập nhật có điều kiện `stock >= quantity`.
- Nếu hai người cùng đặt một biến thể, request đến sau sẽ bị từ chối nếu tồn kho không còn đủ.
- Đơn hàng lưu snapshot sản phẩm tại thời điểm mua: tên sản phẩm, biến thể, giá, số lượng, ảnh.

## Cài Đặt Local

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Biến môi trường backend cần có:

```env
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_SITE_URL=http://localhost:5173
OPENROUTER_APP_NAME=Fuji Store
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Biến môi trường frontend:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Frontend chạy tại:

```text
http://127.0.0.1:5173
```

Backend API chạy tại:

```text
http://127.0.0.1:8000/api
```

## Build

Frontend:

```bash
cd frontend
npm run build
```

Backend check:

```bash
cd backend
python manage.py check
```

## Bảo Mật Và Deploy

- Không commit `.env`, API key, token, database production hoặc file cache.
- `OPENROUTER_API_KEY` phải đặt trong environment của backend server khi deploy.
- Frontend không gọi OpenRouter trực tiếp để tránh lộ key.
- Nếu key đã từng bị lộ, hãy rotate key trên OpenRouter.
- Khi deploy frontend, đặt `VITE_API_URL` trỏ về backend production.
- Khi deploy backend, cần cấu hình:
  - `SECRET_KEY`
  - `DEBUG=False`
  - `ALLOWED_HOSTS`
  - `CORS_ALLOWED_ORIGINS`
  - `OPENROUTER_API_KEY`

## Scripts

Frontend:

| Lệnh | Công dụng |
| --- | --- |
| `npm run dev` | Chạy Vite dev server |
| `npm run build` | Build production |
| `npm run preview` | Preview bản build |
| `npm run lint` | Chạy ESLint |

Backend:

| Lệnh | Công dụng |
| --- | --- |
| `python manage.py runserver` | Chạy dev server |
| `python manage.py migrate` | Chạy migrations |
| `python manage.py createsuperuser` | Tạo admin |
| `python manage.py check` | Kiểm tra cấu hình Django |

## Ghi Chú Phát Triển

- Dự án hiện chưa dùng global state manager như Redux/Zustand/Context cho data chính.
- Trạng thái UI chủ yếu nằm trong `useState` của từng component.
- Cache danh sách/chi tiết sản phẩm dùng `sessionStorage`.
- Giỏ hàng guest dùng `localStorage`.
- Chatbot history chỉ tồn tại trong lần mở trang hiện tại.

