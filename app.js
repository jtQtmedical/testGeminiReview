require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./models');

// 設置 middleware 來解析 JSON
app.use(express.json());

// 連接資料庫並重試邏輯
const connectWithRetry = async () => {
  console.log('嘗試連接到數據庫...');
  try {
    await db.sequelize.authenticate();
    console.log('數據庫連接已建立');
    
    // 同步資料庫
    await db.sequelize.sync({ alter: true });
    console.log('數據庫已同步');
  } catch (error) {
    console.error('無法連接到數據庫:', error);
    console.log('將在 5 秒後重試...');
    setTimeout(connectWithRetry, 5000);
    return;
  }
};

app.get('/', (req, res) => {
  res.send('Hello, this is a simple Todo List application!');
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await db.Todo.findAll();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const todo = await db.Todo.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await db.Todo.findByPk(req.params.id);
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await db.Todo.findByPk(req.params.id);
    if (todo) {
      await todo.update(req.body);
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await db.Todo.findByPk(req.params.id);
    if (todo) {
      await todo.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (require.main === module) {
  // 先啟動服務器，然後嘗試連接數據庫
  const server = app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
    connectWithRetry();
  });
}

module.exports = app;