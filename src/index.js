const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userAlreadyExist = users.find(user => user.username === username);
  if (!userAlreadyExist) return response.status(400).json({ error: 'User does not  already exist!' });

  request.user = userAlreadyExist;

  next();
}

app.post('/users', (request, response) => {
  const { username, name } = request.body;

  const userAlreadyExist = users.some(user => user.username === username);

  if (userAlreadyExist) return response.status(400).json({ error: 'Username  already exist!' });

  const newUser = {
    id: uuidv4(),
    username,
    name,
    todos: []
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const newPost = {
    created_at: new Date(),
    id: uuidv4(),
    done: false,
    deadline,
    title
  };

  user.todos.push(newPost);

  return response.status(201).json(newPost);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
