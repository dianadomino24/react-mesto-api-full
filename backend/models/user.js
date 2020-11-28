const mongoose = require('mongoose');
const validator = require('validator');
const {defaultValues} = require('../utils/utils')

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
module.exports = mongoose.model('user', userSchema);
