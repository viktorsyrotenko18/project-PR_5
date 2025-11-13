import express from 'express';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.set('view engine', 'pug');
app.set('views', './views');

// Імітація бази даних
let nextId = 3;
let tasks = [
  { id: 1, title: 'Виконати практичну роботу', completed: true },
  { id: 2, title: 'Підготувати звіт', completed: false },
  { id: 3, title: 'Завантажити на GitHub', completed: false },
];

// ВАЛІДАЦІЯ + API
// GET /api/tasks — всі задачі
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks — створити нову задачу
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;

  // Перевірка наявності та валідності назви
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res
      .status(400)
      .json({ error: 'Поле "title" обов’язкове і має містити щонайменше 3 символи.' });
  }

  const newTask = { id: nextId++, title: title.trim(), completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id — змінити статус
app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  // Валідація ID
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Некоректний ID задачі.' });
  }

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Задачу не знайдено.' });
  }

  task.completed = !task.completed;
  res.json(task);
});

// DELETE /api/tasks/:id — видалити задачу
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  // Валідація ID
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Некоректний ID задачі.' });
  }

  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Задачу не знайдено.' });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

// UI (через Pug)
// Головна сторінка
app.get('/', (req, res) => {
  res.send('Сервер працює! Перейди на <a href="/tasks">/tasks</a>');
});

// Pug-шаблон для задач
app.get('/tasks', (req, res) => {
  res.render('tasks', { tasks });
});

// Глобальний обробник помилок
app.use((err, req, res, next) => {
  console.error('Помилка:', err.stack);
  res.status(500).json({ error: 'Внутрішня помилка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});