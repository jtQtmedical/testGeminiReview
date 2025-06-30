# Todo List API

一個簡單的待辦事項清單API，使用Express.js、MySQL和Sequelize。

## 功能

- 建立新的待辦事項
- 獲取所有待辦事項
- 獲取特定待辦事項
- 更新待辦事項
- 刪除待辦事項

## 技術棧

- Node.js / Express
- MySQL
- Sequelize ORM

## 安裝指南

1. 克隆此倉庫
2. 安裝依賴: `npm install`
3. 使用Docker啟動服務: `docker-compose up -d`
4. 或者在本地啟動:
   - 確保MySQL服務正在運行
   - 執行: `npm start`

## API端點

- `GET /todos` - 獲取所有待辦事項
- `POST /todos` - 創建新待辦事項
- `GET /todos/:id` - 獲取特定待辦事項
- `PUT /todos/:id` - 更新待辦事項
- `DELETE /todos/:id` - 刪除待辦事項

## 範例

### 建立待辦事項
```
POST /todos
Content-Type: application/json

{
  "title": "完成作業",
  "completed": false
}
```

### 回應
```
{
  "id": 1,
  "title": "完成作業",
  "completed": false,
  "createdAt": "2023-04-01T12:00:00.000Z",
  "updatedAt": "2023-04-01T12:00:00.000Z"
}
```
