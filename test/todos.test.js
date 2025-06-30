const request = require('supertest');
const app = require('../app');
const setupTestData = require('./setupTestData');
const db = require('../models');

// 在所有測試之前運行
beforeAll(async () => {
  // 設置環境變數為測試環境
  process.env.NODE_ENV = 'test';
  
  // 等待數據庫連接和設置測試數據
  try {
    await setupTestData();
  } catch (error) {
    console.error('設置測試數據失敗:', error);
    throw error;
  }
});

// 在所有測試之後運行
afterAll(async () => {
  // 關閉數據庫連接
  await db.sequelize.close();
});

describe('Todo API 測試', () => {
  // 測試獲取所有待辦事項
  test('GET /todos 應該返回所有待辦事項', async () => {
    const response = await request(app).get('/todos');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
  });
  
  // 測試根據ID獲取待辦事項
  test('GET /todos/:id 應該返回特定待辦事項', async () => {
    const todos = await request(app).get('/todos');
    const firstTodoId = todos.body[0].id;
    
    const response = await request(app).get(`/todos/${firstTodoId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(firstTodoId);
  });
  
  // 測試創建待辦事項
  test('POST /todos 應該創建新的待辦事項', async () => {
    const newTodo = {
      title: '新測試待辦事項',
      completed: false
    };
    
    const response = await request(app)
      .post('/todos')
      .send(newTodo);
    
    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.completed).toBe(newTodo.completed);
    
    // 確認總數已增加
    const todosResponse = await request(app).get('/todos');
    expect(todosResponse.body.length).toBe(4);
  });
  
  // 測試更新待辦事項
  test('PUT /todos/:id 應該更新待辦事項', async () => {
    const todos = await request(app).get('/todos');
    const todoToUpdate = todos.body[0];
    
    const updatedData = {
      completed: !todoToUpdate.completed
    };
    
    const response = await request(app)
      .put(`/todos/${todoToUpdate.id}`)
      .send(updatedData);
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(todoToUpdate.id);
    expect(response.body.completed).toBe(updatedData.completed);
  });
  
  // 測試刪除待辦事項
  test('DELETE /todos/:id 應該刪除待辦事項', async () => {
    const todos = await request(app).get('/todos');
    const todoToDelete = todos.body[0];
    
    const response = await request(app)
      .delete(`/todos/${todoToDelete.id}`);
    
    expect(response.status).toBe(204);
    
    // 確認已被刪除
    const getTodoResponse = await request(app).get(`/todos/${todoToDelete.id}`);
    expect(getTodoResponse.status).toBe(404);
    
    // 確認總數已減少
    const todosResponse = await request(app).get('/todos');
    expect(todosResponse.body.length).toBe(3);
  });
}); 