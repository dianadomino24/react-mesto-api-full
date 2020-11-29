const mongoose = require('mongoose');
const validator = require('validator');
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
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: defaultValues.name,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: defaultValues.about,
  },
  avatar: {
    type: String,
    required: true,
    default: defaultValues.avatar,
    validate: {
      validator(url) {
        return validator.isUrl(url, [{ allow_underscores: true }]);
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
