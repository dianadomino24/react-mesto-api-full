const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

const {
  validationCard,
  validationId,
} = require('../middlewares/requestValidator');

router.get('/', getCards);
router.post('/', validationCard, createCard);
router.delete('/:cardId', validationId, deleteCard);
router.put('/:cardId/likes', validationId, putLike);
router.delete('/:cardId/likes', validationId, deleteLike);

module.exports = router;
