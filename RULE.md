# PROMPT & RULE — Load db.json từ GitHub và hiển thị ra giao diện

## I. PROMPT (Mô tả bài toán cho AI)

Bạn là một AI chuyên nghiệp. Hãy xây dựng một dự án web đơn giản sử dụng HTML, CSS và JavaScript thuần để load dữ liệu từ file `db.json` được lưu trên GitHub và hiển thị dữ liệu đó ra giao diện người dùng.

### Yêu cầu tổng quát
- Tạo **repo GitHub mới**.
- Dữ liệu được lưu trong file `db.json` trong repo.
- Sử dụng `fetch()` để đọc dữ liệu JSON và render ra giao diện.
- Dự án phải chạy được trên **GitHub Pages**.

### Yêu cầu chức năng
1. Có file `db.json` chứa dữ liệu mẫu (tối thiểu 6 bản ghi).
2. Hiển thị danh sách dữ liệu dạng card (ảnh, tên, giá, mô tả ngắn).
3. Có ô tìm kiếm theo tên (lọc realtime).
4. Click vào 1 item để xem chi tiết.
5. Có xử lý lỗi khi fetch dữ liệu thất bại.
6. Không hard-code dữ liệu trong HTML.

### Ràng buộc kỹ thuật
- Chỉ dùng: HTML, CSS, JavaScript thuần.
- Không dùng framework (React, Vue, Angular…).
- Không dùng API ngoài hay JSON Server.
- Code rõ ràng, tách file đúng quy định.

### Output bắt buộc
- `index.html`
- `app.js`
- `db.json`
- `README.md`
- File này (PROMPT & RULE)

---

## II. RULE (Quy định & tiêu chí nộp bài)

### 1. Cấu trúc repo bắt buộc
Repo **phải** có đúng cấu trúc sau:

```
/
├─ index.html
├─ app.js
├─ db.json
├─ README.md
└─ PROMPT_AND_RULE.md
```

❌ Không nộp thiếu file  
❌ Không để file trong thư mục con

### 2. Quy định file db.json
- JSON hợp lệ, không lỗi cú pháp.
- Có key chính là `items` (mảng).
- Mỗi item tối thiểu có các trường:

```json
{
  "id": 1,
  "name": "Tên",
  "price": 10000,
  "image": "https://...",
  "description": "Mô tả"
}
```

- Phải có **tối thiểu 6 bản ghi**.
- Image phải là URL hợp lệ (https://...).

### 3. Quy định file index.html
- Phải có `<input type="text">` cho search.
- Phải có container để render danh sách sản phẩm (card format).
- CSS nhúng hoặc link file riêng (nên nhúng trong file).
- **Không hard-code** dữ liệu sản phẩm vào HTML.
- Meta viewport cho mobile responsive.

### 4. Quy định file app.js
- Sử dụng `fetch()` để load `db.json`.
- Function để hiển thị sản phẩm dạng card.
- Function tìm kiếm realtime (filter theo `name`).
- Function xem chi tiết (modal hoặc page riêng).
- **Xử lý lỗi**:
  - If fetch fails → Hiển thị thông báo lỗi
  - If invalid JSON → Hiển thị thông báo lỗi
  - If no products → Hiển thị "Không có sản phẩm"
- Code comments rõ ràng.
- Không tồn tại `console.log()` hoặc `debugger` trong code production.

### 5. Quy định file README.md
- Mô tả dự án (1-2 đoạn).
- Cách cài đặt / chạy (local & GitHub Pages).
- Cấu trúc thư mục.
- Hướng dẫn thêm sản phẩm.
- Troubleshooting cơ bản.

### 6. Tiêu chí chất lượng
- ✅ Code phải chạy được (không lỗi JavaScript).
- ✅ Giao diện đẹp, responsive (mobile & desktop).
- ✅ Tìm kiếm hoạt động realtime, không delay.
- ✅ Click sản phẩm mở chi tiết (modal hoặc page).
- ✅ Xử lý lỗi fetch / JSON parsing.
- ✅ Không hard-code dữ liệu.
- ✅ Code sạch, có comment, naming rõ ràng.

### 7. Kiểm tra trước khi nộp
- [ ] Tất cả 5 file bắt buộc đều có
- [ ] `db.json` hợp lệ (dùng jsonlint.com hoặc DevTools)
- [ ] `db.json` có >= 6 bản ghi
- [ ] Chạy local: Mở `index.html` → Products load → Search hoạt động
- [ ] Click product → Chi tiết hiển thị
- [ ] Giao diện responsive (mở DevTools → Toggle device toolbar)
- [ ] GitHub Pages: Push lên → Truy cập URL → Hoạt động bình thường

---

## III. IMPLEMENTATION NOTES

### Cách chạy local
```bash
# Nếu mở trực tiếp file, có thể gặp CORS issue với fetch
# Giải pháp: Dùng local server

# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Sau đó mở: http://localhost:8000
```

### Cách push lên GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo-name.git
git push -u origin main

# Vào Settings → Pages → chọn main branch
# Chờ vài phút, site sẽ available tại https://username.github.io/repo-name
```

### Fetch API tips
```javascript
// Cách đúng
fetch('./db.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Hoặc async/await
async function loadData() {
  try {
    const response = await fetch('./db.json');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Gợi ý UX
- Search: Realtime khi user gõ, case-insensitive
- Modal chi tiết: Có button đóng, click ngoài cũng đóng
- Loading state: Hiển thị "Đang tải..." khi fetch
- Error state: Hiển thị thông báo lỗi rõ ràng

---

**Ngày tạo:** 29/01/2026  
**Yêu cầu:** HTML + CSS + JavaScript thuần  
**Output:** 5 file (index.html, app.js, db.json, README.md, PROMPT_AND_RULE.md)
