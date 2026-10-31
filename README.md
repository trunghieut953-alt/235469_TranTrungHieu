# Hệ thống Quản lý Thiết bị Phòng học trên Đám mây (235469_TranTrungHieu)

## 1. Mô tả đề tài
Ứng dụng quản lý thông tin thiết bị phòng học, theo dõi tình trạng sử dụng và cập nhật thông tin thiết bị trên nền tảng đám mây.

## 2. Công nghệ sử dụng
- Frontend: React (Vite)
- Backend: Node.js, Express, Mongoose
- Cơ sở dữ liệu: MongoDB Atlas
- Đóng gói và triển khai: Docker, Docker Hub, Render

## 3. Cấu trúc dự án
- `backend/`: Mã nguồn RESTful API sử dụng Node.js và Express
- `frontend/`: Giao diện người dùng sử dụng React

## 4. Hướng dẫn cài đặt và chạy chương trình
- Backend: `cd backend && npm install && npm start`
- Frontend: `cd frontend && npm install && npm run dev`

### Chạy Backend bằng Docker (Câu 5)
docker pull trunghieu02122/backend
docker run -d -p 5000:5000 --env-file ./backend/.env trunghieu02122/backend

### Chạy Frontend bằng Docker (Câu 6)
docker pull trunghieu02122/frontend
docker run -d -p 3000:3000 trunghieu02122/frontend
