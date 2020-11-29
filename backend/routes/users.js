const router = require('express').Router();
const {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const {
  validationUserData,
  validationAvatar,
  validationId,
} = require('../middlewares/requestValidator');

router.get('/', getUsers);

router.get('/:id', validationId, getUser);
router.get('/me', getMe);

router.patch('/me', validationUserData, updateUser);
router.patch('/me/avatar', validationAvatar, updateAvatar);

module.exports = router;
