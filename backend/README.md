# Backend – Django REST Framework

## Cấu trúc dự án

```
django_backend/
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── authentication/   # Đăng ký / Đăng nhập / Đăng xuất (JWT)
│   ├── users/            # GET|PUT /api/users/me/ + đổi mật khẩu
│   ├── addresses/        # Sổ địa chỉ giao hàng
│   ├── products/         # Danh mục + sản phẩm (list & detail)
│   └── cart/             # Giỏ hàng
├── manage.py
├── requirements.txt
└── .env.example
```

## Cài đặt

```bash
# 1. Tạo virtualenv
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# 2. Cài thư viện
pip install -r requirements.txt

# 3. Cấu hình biến môi trường
cp .env.example .env
# Chỉnh sửa .env nếu cần

# 4. Migrate & tạo superuser
python manage.py migrate
python manage.py createsuperuser

# 5. Chạy server
python manage.py runserver
```

## Danh sách API

### Authentication
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register/` | Đăng ký |
| POST | `/api/auth/login/` | Đăng nhập → JWT |
| POST | `/api/auth/logout/` | Đăng xuất (blacklist token) |
| POST | `/api/auth/token/refresh/` | Làm mới access token |

### Users
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users/me/` | Thông tin cá nhân |
| PUT | `/api/users/me/` | Cập nhật thông tin |
| POST | `/api/users/change-password/` | Đổi mật khẩu |

### Addresses
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/addresses/` | Danh sách địa chỉ |
| POST | `/api/addresses/` | Thêm địa chỉ |
| PUT | `/api/addresses/{id}/` | Sửa địa chỉ |
| DELETE | `/api/addresses/{id}/` | Xoá địa chỉ |
| POST | `/api/addresses/{id}/set-default/` | Đặt làm mặc định |

### Products
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/categories/` | Danh sách danh mục |
| GET | `/api/products/` | Danh sách SP (filter + search + phân trang) |
| GET | `/api/products/{id}/` | Chi tiết SP (nested: specs, images, colors, variants) |

### Cart
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/cart/` | Xem giỏ hàng |
| POST | `/api/cart/add/` | Thêm SP vào giỏ |
| PUT | `/api/cart/{item_id}/` | Cập nhật số lượng |
| DELETE | `/api/cart/{item_id}/` | Xoá khỏi giỏ |

## Xác thực

Tất cả endpoint cần auth phải gửi header:
```
Authorization: Bearer <access_token>
```
