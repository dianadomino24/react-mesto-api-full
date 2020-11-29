const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { login, createUser } = require('./controllers/users');
const {routerIndex} = require('./routes/index');

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

// при обращении к несущ.адресу выдаст ошибку
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден App' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
