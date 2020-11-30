const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        return res.status(404).send({ message: 'Пользователи не найдены' });
      }
      return res.status(200).send(users );
    })
    .catch((err) => res.status(500).send({
      message: `Ошибка считывания файла пользователей: ${err}`,
    }));
};

const getUser = (req, res) => {
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  User.findById(req.requestedUser)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id getUser' });
      }
      return res.status(200).send( user );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Нет пользователя с таким id getUser' });
      }
      return res.status(500).send({
        message: `Ошибка считывания файла пользователя: ${err}`,
      });
    });
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id getME' });
      }
      res.send(user);
    })
    .catch((err) => res
      .status(500)
      .send({ message: `Ошибка при запросе к своим данным getMe: ${err}` }));
};

const createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then(({ email, _id }) => res.send({ email, _id }))

    .catch((err) => res
      .status(400)
      .send({ message: `Ошибка при создании пользователя: ${err}` }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const me = req.user._id;
  User.findByIdAndUpdate(
    me,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.status(200).send( user ))
    .catch((err) => res.status(400).send({
      message: `Ошибка изменения данных пользователя: ${err}`,
    }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const me = req.user._id;
  User.findByIdAndUpdate(
    me,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.status(200).send( user ))
    .catch((err) => res.status(400).send({
      message: `Ошибка изменения аватара пользователя: ${err}`,
    }));
};

function login(req, res) {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).send({ message: 'Поля email и password должны быть заполнены.' });
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Данный email не зарегистрирован' });
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (matched) {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
              { expiresIn: '7d' },
            );
            return res.status(200).send({ token });
          }
          return res.status(401).send({ message: 'Неправильный логин или пароль' });
        });
    })
    .catch((err) => res.status(500).send({
      message: `Ошибка сервера при логине: ${err}`,
    }));
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getMe,
};
