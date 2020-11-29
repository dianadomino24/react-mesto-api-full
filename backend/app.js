const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { routerIndex } = require('./routes/index');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/', routerIndex);

// Централизованная обработка ошибок
app.use(errors());

// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  res.status(500).send({ message: `На сервере произошла ошибка: ${err}` });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
