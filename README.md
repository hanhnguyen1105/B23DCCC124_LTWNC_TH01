# Student Deadline Tracker

Ứng dụng quản lý deadline bài tập cá nhân, xây dựng với React, TypeScript, Redux Toolkit và Vite.

## Chạy ứng dụng

Yêu cầu Node.js LTS và npm:

```bash
npm install
npm run dev
```

Kiểm tra production build và lint:

```bash
npm run build
npm run lint
```

## Tính năng

- Hiển thị môn học, tên bài tập, hạn nộp, mức ưu tiên và trạng thái.
- Thêm bài tập, đánh dấu/bỏ đánh dấu hoàn thành và xóa bài tập.
- Lọc tất cả, chưa hoàn thành, quá hạn và đã hoàn thành.
- Tìm kiếm theo môn học/tên bài tập, sắp xếp theo hạn nộp hoặc độ ưu tiên; chuyển giữa bảng danh sách và Kanban.
- Hiển thị số ngày còn lại hoặc số ngày quá hạn.
- Tải dữ liệu mẫu bất đồng bộ qua `createAsyncThunk`; API giả lập hiện nằm trong `src/features/assignments/assignmentApi.ts`.

## Cấu trúc và nội dung thực hành

- `src/features/assignments/`: feature-based structure cho model, API, Redux slice, hook và component bài tập.
- `src/app/store.ts`, `src/app/hooks.ts`: Redux store và typed hooks.
- `src/features/assignments/types.ts`: generic `AsyncState<T>`, utility type `Pick` và type guards kiểm tra dữ liệu API.
- `src/features/assignments/useAssignments.ts`: custom hook gom selector, filter, số liệu và action.
- `src/features/assignments/FilterTabs.tsx`: Compound Component gồm `FilterTabs` và `FilterTabs.Option`.
