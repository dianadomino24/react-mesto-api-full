const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError({ message: 'Карточки не найдены getCards' });
      }
      return res.status(200).send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;

  Card.create({ owner, ...req.body })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError({
          message: `Ошибка валидации при создании карточки: ${err}`,
        });
      }
      return next(err);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Карточка не найдена' });
      }

      // запрет удалять чужие карточки
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError({ message: 'У Вас нет прав для удаления чужой карточки' });
      }

      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError({ message: 'Карточка не найдена' });
      }
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Карточка не найдена' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError({ message: 'Карточка не найдена' });
      }
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Карточка не найдена' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError({ message: 'Карточка не найдена' });
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
