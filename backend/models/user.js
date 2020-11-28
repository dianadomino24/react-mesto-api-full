const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /https?:\/\/\S*/.test(v);
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
});
module.exports = mongoose.model('user', userSchema);

// https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}
// \.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)
