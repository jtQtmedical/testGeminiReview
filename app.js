require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./models');

// 設定 Handlebars 模板引擎
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    formatDate: function(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// 設定靜態檔案目錄
app.use(express.static(path.join(__dirname, 'public')));

// 設置 middleware 來解析 JSON 和 URL-encoded 資料
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.redirect('/todos');
});

// 顯示所有 todos 的頁面
app.get('/todos', async (req, res) => {
  try {
    const todos = await db.Todo.findAll();
    res.render('todos', { todos });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

// 顯示新增 todo 的表單
app.get('/todos/new', (req, res) => {
  res.render('todo-form', { action: '/todos', method: 'POST' });
});

// 顯示編輯 todo 的表單
app.get('/todos/:id/edit', async (req, res) => {
  try {
    const todo = await db.Todo.findByPk(req.params.id);
    if (todo) {
      res.render('todo-form', { 
        todo, 
        action: `/todos/${todo.id}`, 
        method: 'PUT',
        isEdit: true 
      });
    } else {
      res.status(404).render('error', { error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

// API 路由
app.get('/api/todos', async (req, res) => {
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
    res.redirect('/todos');
  } catch (error) {
    res.status(400).render('error', { error: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const todo = await db.Todo.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/todos/:id', async (req, res) => {
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
      res.redirect('/todos');
    } else {
      res.status(404).render('error', { error: 'Todo not found' });
    }
  } catch (error) {
    res.status(400).render('error', { error: error.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
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
      res.redirect('/todos');
    } else {
      res.status(404).render('error', { error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
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