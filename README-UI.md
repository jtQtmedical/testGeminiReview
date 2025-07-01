# Todo List 應用程式 - UI 功能說明

本專案已加入 Handlebars 模板引擎，提供了完整的網頁使用者介面。

## 🎨 新增功能

### 網頁介面
- **首頁**: 自動重定向到待辦事項列表
- **待辦事項列表**: 以卡片形式顯示所有待辦事項
- **新增待辦事項**: 簡潔的表單介面
- **編輯待辦事項**: 可編輯現有待辦事項
- **錯誤頁面**: 美觀的錯誤處理頁面

### 使用者體驗
- 📱 **響應式設計**: 支援桌面和行動裝置
- 🎯 **直觀操作**: 一鍵完成、編輯、刪除
- ⌨️ **快速鍵支援**: 
  - `Ctrl + N`: 新增待辦事項
  - `Escape`: 返回列表
- 🎨 **美觀介面**: 使用 Bootstrap 5 和 Font Awesome 圖示

## 📁 檔案結構

```
├── views/                    # Handlebars 模板
│   ├── layouts/
│   │   └── main.hbs         # 主要佈局
│   ├── partials/            # 部分模板（預留）
│   ├── todos.hbs            # 待辦事項列表
│   ├── todo-form.hbs        # 新增/編輯表單
│   └── error.hbs            # 錯誤頁面
├── public/                   # 靜態檔案
│   ├── css/
│   │   └── style.css        # 自訂樣式
│   └── js/
│       └── app.js           # 前端 JavaScript
└── app.js                   # 主應用程式（已更新）
```

## 🚀 啟動應用程式

```bash
npm start
```

然後開啟瀏覽器訪問: http://localhost:3000

## 📖 路由說明

### 網頁路由
- `GET /` - 重定向到待辦事項列表
- `GET /todos` - 顯示所有待辦事項
- `GET /todos/new` - 顯示新增表單
- `GET /todos/:id/edit` - 顯示編輯表單
- `POST /todos` - 建立新待辦事項
- `PUT /todos/:id` - 更新待辦事項
- `DELETE /todos/:id` - 刪除待辦事項

### API 路由（保持不變）
- `GET /api/todos` - 取得所有待辦事項（JSON）
- `POST /api/todos` - 建立新待辦事項（JSON）
- `GET /api/todos/:id` - 取得特定待辦事項（JSON）
- `PUT /api/todos/:id` - 更新待辦事項（JSON）
- `DELETE /api/todos/:id` - 刪除待辦事項（JSON）

## 🔧 技術細節

### 新增套件
- `express-handlebars`: 模板引擎
- Bootstrap 5: CSS 框架（CDN）
- Font Awesome 6: 圖示庫（CDN）

### 資料庫更新
- 新增 `description` 欄位到 Todo 模型
- 支援較長的描述文字

### 前端功能
- AJAX 刪除和完成操作
- 表單驗證
- 載入狀態顯示
- 確認對話框

## 🎯 主要特色

1. **卡片式佈局**: 每個待辦事項以卡片形式呈現
2. **狀態視覺化**: 已完成項目有劃線效果
3. **互動式按鈕**: 編輯、刪除、完成按鈕
4. **美觀表單**: 帶驗證的表單介面
5. **錯誤處理**: 完整的錯誤頁面和訊息 