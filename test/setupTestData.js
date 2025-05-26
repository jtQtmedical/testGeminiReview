// 測試數據設置腳本
require('dotenv').config();
const db = require('../models');

async function setupTestData() {
  console.log('開始設置測試數據...');
  
  try {
    // 連接數據庫
    await db.sequelize.authenticate();
    console.log('已連接到測試數據庫');
    
    // 同步數據庫 - 使用 force: true 在每次測試前重置數據
    await db.sequelize.sync({ force: true });
    console.log('數據庫表已重置');
    
    // 創建測試數據
    const testTodos = [
      { title: '測試待辦事項 1', completed: false },
      { title: '測試待辦事項 2', completed: true },
      { title: '測試待辦事項 3', completed: false }
    ];
    
    // 批量創建數據
    await db.Todo.bulkCreate(testTodos);
    console.log('測試數據已創建');
    
    // 顯示創建的數據
    const todos = await db.Todo.findAll();
    console.log('已創建的待辦事項:', JSON.stringify(todos, null, 2));
    
    console.log('測試數據設置完成');
    return true;
  } catch (error) {
    console.error('設置測試數據時出錯:', error);
    throw error;
  }
}

// 如果腳本被直接執行
if (require.main === module) {
  // 設置環境變數為測試環境
  process.env.NODE_ENV = 'test';
  
  // 運行設置，然後結束進程
  setupTestData()
    .then(() => {
      console.log('測試數據設置成功');
      process.exit(0);
    })
    .catch(err => {
      console.error('測試數據設置失敗:', err);
      process.exit(1);
    });
} else {
  // 如果作為模塊導入，則導出函數
  module.exports = setupTestData;
} 