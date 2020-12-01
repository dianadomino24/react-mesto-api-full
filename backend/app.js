const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { routerIndex } = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');

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

app.use('*', cors({
  origin: 'https://dianadomino24.students.nomoreparties.space',
  credentials: true,
}));

app.options('*', cors());

app.use(requestLogger);
// !!!!!!!!!!!!!!!!!!!!!убрать после успешного ревью!!!!!!!!!!!!!!!!!!!!!!!!!
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', routerIndex);
app.use(errorLogger);

// Централизованная обработка ошибок
app.use(errors());

app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message || 'На сервере произошла ошибка' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
