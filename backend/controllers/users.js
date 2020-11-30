const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }
      return res.status(200).send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь с таким id не найден'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден getMe'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Такой пользователь уже существует');
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
    .then(({ email, _id }) =>  res.status(200).send({ email, _id }))
    .catch(next);
};

const updateUser = (req, res, next) => {
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
    .orFail(new NotFoundError('Пользователь не найден updateUser'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
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
    .orFail(new NotFoundError('Пользователь не найден updateAvatar'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

function login(req, res, next) {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new BadRequestError('Поля email и password должны быть заполнены');
  }

  User.findOne({ email })
    .select('+password')
    .orFail(new NotFoundError('Данный email не зарегистрирован'))
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
          { expiresIn: '7d' },
        );
        return res.status(200).send({ token });
      }
      throw new UnauthorizedError('Неправильный логин или пароль');
    }))
    .catch(next);
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
