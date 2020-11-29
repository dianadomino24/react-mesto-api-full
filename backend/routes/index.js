const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const cardsRouter = require('./cards');
const userRouter = require('./users');

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/cards', auth, cardsRouter);
router.use('/users', auth, userRouter);

module.exports = router;
