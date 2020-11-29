const routerIndex = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const cardsRouter = require('./cards');
const userRouter = require('./users');

routerIndex.post('/signin', login);
routerIndex.post('/signup', createUser);

routerIndex.use('/cards', auth, cardsRouter);
routerIndex.use('/users', auth, userRouter);

module.exports = { routerIndex };
