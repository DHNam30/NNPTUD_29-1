# Đặng Hoài Nam - 2280611346
# Bài 2 - Posts & Comments Management

## 📋 Mô tả
Ứng dụng quản lý bài viết (Posts) và bình luận (Comments) với đầy đủ chức năng CRUD. Hỗ trợ soft delete (xóa mềm) bằng cách đánh dấu `isDeleted: true` thay vì xóa hẳng.

## ✨ Tính năng

### Posts Management
- ✅ **Create**: Thêm bài viết mới (ID tự tăng)
- ✅ **Read**: Hiển thị danh sách bài viết
- ✅ **Update**: Sửa tiêu đề và lượt xem
- ✅ **Soft Delete**: Xóa mềm (gạch ngang tiêu đề)
- ✅ **Restore**: Phục hồi bài viết đã xóa

### Comments Management
- ✅ **Create**: Thêm bình luận vào bài viết
- ✅ **Read**: Hiển thị tất cả bình luận
- ✅ **Update**: Sửa nội dung bình luận
- ✅ **Soft Delete**: Xóa mềm bình luận
- ✅ **Restore**: Phục hồi bình luận đã xóa

### Technical Features
- 🔄 **Auto ID Generation**: ID tự tăng và lưu dưới dạng chuỗi
- 🗑️ **Soft Delete Flag**: Sử dụng `isDeleted: true`
- 🎨 **Modern UI**: Bootstrap 5 + Custom CSS với gradient
- 📱 **Responsive Design**: Tương thích mobile
- 🔗 **JSON Server**: Sử dụng json-server làm backend

## 📁 Cấu trúc Dự án

```
/
├── bai2.html           # Giao diện chính
├── bai2.js             # Logic JavaScript
├── db.json             # Database (posts + comments)
├── package.json        # Dependencies
└── README.md           # File này
```

## 🚀 Cách chạy

### 1. Cài đặt dependencies
```bash
npm install json-server
```

### 2. Khởi động json-server
```bash
npx json-server db.json
```
Server sẽ chạy trên `http://localhost:3000`

### 3. Mở ứng dụng
Mở file `bai2.html` trong trình duyệt hoặc sử dụng local server:
```bash
python -m http.server 8000
# hoặc
npx http-server
```

Truy cập: `http://localhost:8000/bai2.html`

## 📊 Cấu trúc Database

### Posts
```json
{
  "id": "1",
  "title": "a title",
  "views": 100,
  "isDeleted": false
}
```

### Comments
```json
{
  "id": "1",
  "text": "a comment about post 1",
  "postId": "1",
  "isDeleted": false
}
```

## 🎯 API Endpoints

### Posts
- `GET /posts` - Lấy tất cả posts
- `POST /posts` - Tạo post mới
- `PATCH /posts/:id` - Cập nhật post
- `DELETE /posts/:id` - Xóa post (hard delete)

### Comments
- `GET /comments` - Lấy tất cả comments
- `POST /comments` - Tạo comment mới
- `PATCH /comments/:id` - Cập nhật comment
- `DELETE /comments/:id` - Xóa comment (hard delete)

## 💡 Cách sử dụng

### Tạo Post
1. Nhập tiêu đề và lượt xem
2. Click "Add New Post"
3. Post sẽ được thêm vào danh sách

### Sửa Post
1. Click nút "Edit" trên post
2. Sửa tiêu đề và lượt xem
3. Click "Save"

### Xóa Post (Soft Delete)
1. Click "Delete" trên post
2. Post sẽ được đánh dấu xóa (gạch ngang)
3. Nút "Restore" sẽ xuất hiện để phục hồi

### Thêm Comment
1. Nhập text vào ô comment
2. Click "Post"
3. Comment sẽ hiển thị ngay lập tức

### Sửa/Xóa Comment
- Tương tự như Post
- Click "Edit" hoặc "Delete" trong comment section

## 🎨 Giao diện

- **Header**: Gradient tím-xanh nam châm
- **Buttons**: Gradient với animation hover
- **Deleted Items**: Gạch ngang + nền màu xám
- **Comments Section**: Nested UI hiển thị chi tiết

## 📝 Lưu ý

- Soft delete chỉ đánh dấu `isDeleted: true`, không xóa dữ liệu
- ID luôn được lưu dưới dạng chuỗi (`"1"`, `"2"`,...)
- ID tự tăng dựa trên maxId hiện tại
- Comments liên kết với posts qua `postId`

## 👨‍💻 Thông tin

**Họ tên**: Đặng Hoài Nam  
**MSSV**: 2280611346  
**Ngày tạo**: 29/01/2026  
**Nhánh**: bai2

---

**Ghi chú**: Đảm bảo json-server đang chạy trước khi mở ứng dụng!
