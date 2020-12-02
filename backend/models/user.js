const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { defaultValues } = require('../utils/utils');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: defaultValues.name,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: defaultValues.about,
  },
  avatar: {
    type: String,
    default: defaultValues.avatar,
    validate: {
      validator(url) {
        return validator.isURL(url, [{ allow_underscores: true }]);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
