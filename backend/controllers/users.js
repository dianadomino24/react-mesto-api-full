const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        return res.status(404).send({ message: 'Пользователи не найдены' });
      }
      return res.status(200).send({ data: users });
    })
    .catch((err) => res.status(500).send({ message: `Ошибка считывания файла пользователей: ${err}` }));
};

const getUser = (req, res) => {
  // User.findOne({ _id: req.params.id })
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(500).send({ message: `Ошибка считывания файла пользователя: ${err}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(400).send({ message: `Ошибка при создании пользователя: ${err}` }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const me = req.user._id;
  User.findByIdAndUpdate(me, { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(400).send({ message: `Ошибка изменения данных пользователя: ${err}` }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const me = req.user._id;
  User.findByIdAndUpdate(me, { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(400).send({ message: `Ошибка изменения аватара пользователя: ${err}` }));
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
};
