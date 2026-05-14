# Checklist Backend API (Django REST Framework)

Dựa trên các chức năng đã xây dựng ở Frontend, dưới đây là danh sách các API cần thiết lập ở Backend (Django REST) để phục vụ dữ liệu cho ứng dụng.

## 1. Authentication & User Profile (`Profile.jsx`)
Cung cấp chức năng đăng nhập, đăng xuất và quản lý thông tin tài khoản.
- [ ] `POST /api/auth/register/`: Đăng ký tài khoản mới.
- [ ] `POST /api/auth/login/`: Đăng nhập (trả về JWT Token).
- [ ] `POST /api/auth/logout/`: Đăng xuất (Blacklist token nếu cần).
- [ ] `GET /api/users/me/`: Lấy thông tin cá nhân của người dùng hiện tại.
- [ ] `PUT /api/users/me/`: Cập nhật thông tin cá nhân (Họ tên, SĐT, Email).
- [ ] `POST /api/users/change-password/`: Đổi mật khẩu.

## 2. Quản Lý Sổ Địa Chỉ (`Profile.jsx`)
Quản lý các địa chỉ giao hàng của người dùng.
- [ ] `GET /api/addresses/`: Lấy danh sách địa chỉ của người dùng.
- [ ] `POST /api/addresses/`: Thêm địa chỉ mới.
- [ ] `PUT /api/addresses/{id}/`: Sửa thông tin địa chỉ.
- [ ] `DELETE /api/addresses/{id}/`: Xóa địa chỉ.
- [ ] `POST /api/addresses/{id}/set-default/`: Đặt làm địa chỉ mặc định.

## 3. Lịch Sử Đơn Hàng (`Profile.jsx`)
Xem các đơn hàng đã đặt.
- [ ] `GET /api/orders/`: Lấy danh sách đơn hàng của người dùng (Mã đơn, ngày đặt, số lượng SP, tổng tiền, trạng thái).
- [ ] `GET /api/orders/{id}/`: Xem chi tiết một đơn hàng cụ thể.

## 4. Quản Lý Sản Phẩm & Danh Mục (`Body.jsx`, `CategoryPage.jsx`, `ProductDetail.jsx`)
Phục vụ dữ liệu hiển thị trang chủ, trang danh mục và trang chi tiết.
- [ ] `GET /api/categories/`: Lấy danh sách các danh mục (X Series, GFX Series...).
- [ ] `GET /api/products/`: Lấy danh sách sản phẩm.
  - Hỗ trợ filter: `?category={id}`, `?search={keyword}` (Cho thanh tìm kiếm ở Header).
  - Hỗ trợ pagination (phân trang).
- [ ] `GET /api/products/{id}/`: Lấy chi tiết 1 sản phẩm. Phải bao gồm các bảng liên kết (Nested Data):
  - `images`: Danh sách link ảnh.
  - `specs`: Thông số kỹ thuật (Cảm biến, vi xử lý...).
  - `colors`: Các tùy chọn màu sắc.
  - `variants`: Tùy chọn cấu hình (Body, Kit...) và giá tiền tương ứng.

## 5. Quản Lý Giỏ Hàng & Thanh Toán (`Cart.jsx`)
Vì giỏ hàng có thể lưu ở Local Storage (nếu chưa đăng nhập) hoặc Database (nếu đã đăng nhập), Backend cần cung cấp API để đồng bộ giỏ hàng.
- [ ] `GET /api/cart/`: Lấy danh sách sản phẩm trong giỏ hàng.
- [ ] `POST /api/cart/add/`: Thêm sản phẩm (variant) vào giỏ hàng.
- [ ] `PUT /api/cart/{item_id}/`: Cập nhật số lượng sản phẩm.
- [ ] `DELETE /api/cart/{item_id}/`: Xóa sản phẩm khỏi giỏ.
- [ ] `POST /api/checkout/`: Khởi tạo đơn hàng từ giỏ hàng (Chuyển dữ liệu từ Cart sang Orders).

## 6. Model/Database Tham Khảo Cần Tạo
- **User**: AbstractUser hoặc kế thừa, thêm `phone`.
- **Address**: Liên kết User, các field `fullName`, `phone`, `address`, `is_default`.
- **Category**: `name`, `slug`.
- **Product**: `name`, `description`, `category_id`.
- **ProductSpec**: `sensor`, `processor`, `video`... (hoặc gộp chung JSONField vào Product).
- **ProductImage**: `product_id`, `image_url`.
- **ProductColor**: `product_id`, `name`, `hex_code`.
- **ProductVariant**: `product_id`, `name`, `price`.
- **Order** & **OrderItem**: Trạng thái đơn, tổng tiền, chi tiết từng sản phẩm.
- **Cart** & **CartItem**: Tương tự OrderItem nhưng trạng thái pending.
