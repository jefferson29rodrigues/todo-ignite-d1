const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: 'User does not exist'});
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const exists = users.some((user) => user.username === username);

  if (exists) {
    return response.status(400).json('User already exists');
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });

  return response.status(201).json(users[users.length - 1]);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  user.todos.push({
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  });

  return response.status(201).json(user.todos[user.todos.length - 1]);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;
  const { id } = request.params;
  
  const todoUser = user.todos.find((todo) => todo.id === id);
  
  if (!todoUser) {
    return response.json({error: "todo is not found!"});
  }

  user.todos.push({
    ...todoUser,
    title: title,
    deadline: new Date(deadline),
    id: uuidv4()
  });

  const todosNew = user.todos.filter((todo) => todo.id !== id);
    
  user.todos = todosNew;
  
  return response.status(201).json(user.todos);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;