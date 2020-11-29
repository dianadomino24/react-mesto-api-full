const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getMe,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', getUsers);

router.get('/:id', getUser);
router.get('/me', auth, getMe);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
