const { celebrate, Joi } = require('celebrate');

const validationUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validationCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .min(9)
      .uri(),
  }),
});

const validationUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validationAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .uri(),
  }),
});

const validationId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().required().length(24)
      .hex(),
  }),
});

module.exports = {
  validationUser,
  validationCard,
  validationUserData,
  validationAvatar,
  validationId,
};
