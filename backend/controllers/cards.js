const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточки не найдены getCards');
      }
      return res.status(200).send( cards );
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner})
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Ошибка валидации при создании карточки');
      }
      return next(err);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
  .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      // запрет удалять чужие карточки
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('У Вас нет прав для удаления чужой карточки');
      }

      Card.findByIdAndRemove(req.params.cardId)
        .then((deletedCard) => res.status(200).send(deletedCard));
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена в БД'))
    .then((card) => {
      res.status(200).send(card );
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new NotFoundError('Карточка не найдена в БД'))
    .then((card) => {
      res.status(200).send( card );
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
