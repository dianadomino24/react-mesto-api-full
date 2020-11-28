const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        return res.status(404).send({ message: 'Карточки не найдены' });
      }
      return res.status(200).send({ data: cards });
    })
    .catch((err) => res.status(500).send({ message: `Ошибка считывания файла карточек: ${err}` }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  Card.create({ owner, ...req.body })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Ошибка валидации при создании карточки: ${err}` });
      }
      return res.status(500).send({ message: `Ошибка при создании карточки: ${err}` });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(500).send({ message: `Ошибка при удалении карточки: ${err}` });
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(500).send({ message: `Ошибка при проставлении лайка: ${err}` });
    });
};
const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(500).send({ message: `Ошибка при удалении лайка: ${err}` });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
