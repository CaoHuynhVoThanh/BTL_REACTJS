# Fuji Store - Fullstack React + Django REST

Fuji Store la du an thuong mai dien tu mo phong cua hang may anh Fujifilm, duoc xay dung theo kien truc fullstack tach rieng frontend va backend. Du an co luong nghiep vu gan voi mot san pham thuc te: danh muc san pham, bien the, ton kho, gio hang, dat hang, ho so nguoi dung, dia chi giao hang va chatbot tu van san pham dung OpenRouter.

## Tong Quan

| Hang muc | Thong tin |
| --- | --- |
| Frontend | React 19, Vite 8, React Router DOM 7 |
| Backend | Django 5.2, Django REST Framework |
| Authentication | JWT voi Simple JWT, refresh token blacklist |
| Database dev | SQLite |
| Media | Django media upload cho anh san pham |
| UI libraries | Bootstrap 5, React Bootstrap, Swiper |
| AI assistant | OpenRouter Chat Completions API |
| Deployment support | Vercel frontend, Gunicorn/Whitenoise backend |

## Tinh Nang Chinh

- Hien thi danh sach san pham theo series/danh muc.
- Tim kiem san pham tren header voi goi y nhanh.
- Loc san pham theo gia, loai, series va cac bo loc cau hinh dong.
- Chi tiet san pham gom anh, mau sac, bien the, thong so va mo ta.
- Hien thi trang thai het hang khi tong ton kho bang 0.
- Gio hang cho khach vang lai bang `localStorage`.
- Gio hang cho nguoi dung da dang nhap qua API backend.
- Kiem tra ton kho khi them vao gio, cap nhat so luong va checkout.
- Checkout tao don hang, luu snapshot san pham va tru ton kho an toan trong transaction.
- Quan ly tai khoan, ho so, doi mat khau va dia chi giao hang.
- Lich su don hang trong trang profile.
- Chatbox noi ben phai man hinh, goi OpenRouter qua backend proxy.
- Chatbot co context san pham tu database: ten, gia, bien the va ton kho.

## Cong Nghe Su Dung

### Frontend

- **React 19**: xay dung giao dien component-based.
- **Vite 8**: dev server va build tool toc do cao.
- **React Router DOM 7**: dieu huong SPA.
- **Bootstrap 5 / React Bootstrap**: layout va mot so thanh phan UI.
- **Swiper**: carousel san pham tren trang chu.
- **CSS module theo component**: moi man hinh/component co file CSS rieng.
- **Browser storage**:
  - `localStorage`: token dang nhap va gio hang khach vang lai.
  - `sessionStorage`: cache API ngan han cho danh sach/chi tiet san pham.

### Backend

- **Django 5.2**: web framework chinh.
- **Django REST Framework**: xay dung REST API.
- **Simple JWT**: cap va refresh access token.
- **django-filter**: loc du lieu san pham.
- **Pillow**: xu ly anh upload.
- **Whitenoise**: phuc vu static files khi deploy.
- **Gunicorn**: WSGI server cho production.
- **python-dotenv**: doc bien moi truong local tu `.env`.
- **SQLite**: database dev mac dinh.

### AI / Chatbot

- Backend proxy endpoint: `POST /api/chatbot/`.
- OpenRouter endpoint: `https://openrouter.ai/api/v1/chat/completions`.
- Model mac dinh: `openai/gpt-4o-mini`.
- API key chi nam o backend environment, khong dua vao frontend.
- Lich su chat chi duoc giu trong React state cua lan mo trang hien tai.
- Moi request chatbot se lay context san pham lien quan tu DB de tra loi ve gia va ton kho.

## Kien Truc Thu Muc

```text
BTL_REACTJS/
├── backend/
│   ├── apps/
│   │   ├── authentication/   # Dang ky, dang nhap, logout, OTP, reset password
│   │   ├── users/            # Ho so nguoi dung, doi mat khau
│   │   ├── addresses/        # So dia chi giao hang
│   │   ├── products/         # Loai, series, danh muc, san pham, bien the, ton kho
│   │   ├── cart/             # Gio hang nguoi dung
│   │   ├── orders/           # Checkout, don hang, order items
│   │   └── chatbot/          # Proxy OpenRouter va context san pham DB
│   ├── backend/              # Settings, urls, ASGI/WSGI
│   ├── media/                # Anh san pham upload local
│   ├── db.sqlite3            # Database local
│   └── requirements.txt
│
├── frontend/
│   ├── public/               # Static assets, logo, icon chatbox
│   ├── src/
│   │   ├── components/       # UI pages/components
│   │   ├── utils/            # API helper, guest cart helper
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## API Chinh

### Authentication

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| POST | `/api/auth/register/` | Dang ky tai khoan |
| POST | `/api/auth/login/` | Dang nhap va nhan JWT |
| POST | `/api/auth/logout/` | Logout va blacklist refresh token |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| POST | `/api/auth/send-otp/` | Gui OTP |
| POST | `/api/auth/verify-otp/` | Xac minh OTP |
| POST | `/api/auth/reset-password/` | Dat lai mat khau |

### Products

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/api/product-types/` | Danh sach loai san pham |
| GET | `/api/series/` | Danh sach series |
| GET | `/api/categories/` | Danh sach danh muc |
| GET | `/api/products/` | Danh sach san pham, filter, search, pagination |
| GET | `/api/products/{id}/` | Chi tiet san pham |

### Cart & Checkout

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET | `/api/cart/` | Lay gio hang |
| POST | `/api/cart/add/` | Them san pham vao gio |
| PUT | `/api/cart/{item_id}/` | Cap nhat so luong/bien the |
| DELETE | `/api/cart/{item_id}/` | Xoa san pham khoi gio |
| POST | `/api/checkout/` | Tao don hang va tru ton kho |

### Users, Addresses, Orders

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| GET/PUT | `/api/users/me/` | Xem/cap nhat ho so |
| POST | `/api/users/change-password/` | Doi mat khau |
| GET/POST | `/api/addresses/` | Danh sach/them dia chi |
| PUT/DELETE | `/api/addresses/{id}/` | Sua/xoa dia chi |
| POST | `/api/addresses/{id}/set-default/` | Dat dia chi mac dinh |
| GET | `/api/orders/` | Lich su don hang |
| GET | `/api/orders/{id}/` | Chi tiet don hang |

### Chatbot

| Method | Endpoint | Mo ta |
| --- | --- | --- |
| POST | `/api/chatbot/` | Gui tin nhan den chatbot, backend them context san pham tu DB va goi OpenRouter |

## Xu Ly Ton Kho

Du an khong chi hien thi ton kho o frontend. Backend co cac lop bao ve:

- Khi them/cap nhat gio hang, API kiem tra so luong khong vuot qua `variant.stock`.
- Khi checkout, backend dung transaction va cap nhat co dieu kien `stock >= quantity`.
- Neu hai nguoi cung dat mot bien the, request den sau se bi tu choi neu ton kho khong con du.
- Don hang luu snapshot san pham tai thoi diem mua: ten san pham, bien the, gia, so luong, anh.

## Cai Dat Local

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

Bien moi truong backend can co:

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

Bien moi truong frontend:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Frontend chay tai:

```text
http://127.0.0.1:5173
```

Backend API chay tai:

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

## Bao Mat Va Deploy

- Khong commit `.env`, API key, token, database production hoac file cache.
- `OPENROUTER_API_KEY` phai dat trong environment cua backend server khi deploy.
- Frontend khong goi OpenRouter truc tiep de tranh lo key.
- Neu key da tung bi lo, hay rotate key tren OpenRouter.
- Khi deploy frontend, dat `VITE_API_URL` tro ve backend production.
- Khi deploy backend, can cau hinh:
  - `SECRET_KEY`
  - `DEBUG=False`
  - `ALLOWED_HOSTS`
  - `CORS_ALLOWED_ORIGINS`
  - `OPENROUTER_API_KEY`

## Scripts

Frontend:

| Lenh | Cong dung |
| --- | --- |
| `npm run dev` | Chay Vite dev server |
| `npm run build` | Build production |
| `npm run preview` | Preview ban build |
| `npm run lint` | Chay ESLint |

Backend:

| Lenh | Cong dung |
| --- | --- |
| `python manage.py runserver` | Chay dev server |
| `python manage.py migrate` | Chay migrations |
| `python manage.py createsuperuser` | Tao admin |
| `python manage.py check` | Kiem tra cau hinh Django |

## Ghi Chu Phat Trien

- Du an hien chua dung global state manager nhu Redux/Zustand/Context cho data chinh.
- Trang thai UI chu yeu nam trong `useState` cua tung component.
- Cache danh sach/chi tiet san pham dung `sessionStorage`.
- Gio hang guest dung `localStorage`.
- Chatbot history chi ton tai trong lan mo trang hien tai.

