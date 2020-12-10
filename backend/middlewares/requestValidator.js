const { celebrate, Joi } = require('celebrate');

const validationUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().replace(/\s/g, '').required().email(),
    password: Joi.string().replace(/\s/g, '').required().min(6)
      .max(15),
  }),
});

const validationUserSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().replace(/\s/g, '').required().email(),
    password: Joi.string().replace(/\s/g, '').required().min(6)
      .max(15),
    name: Joi.string().replace(/\s/g, '').min(2).max(30),
    about: Joi.string().replace(/\s/g, '').min(2).max(30),
    avatar: Joi.string().replace(/\s/g, '').uri(),
  }),
});

const validationCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().replace(/\s/g, '').required().min(2)
      .max(30),
    link: Joi.string().replace(/\s/g, '').required().min(9)
      .uri(),
  }),
});

const validationUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().replace(/\s/g, '').required().min(2)
      .max(30),
    about: Joi.string().replace(/\s/g, '').required().min(2)
      .max(30),
  }),
});

const validationAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().replace(/\s/g, '').required().uri(),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  validationUser,
  validationUserSignUp,
  validationCard,
  validationUserData,
  validationAvatar,
  validationCardId,
  validationUserId,
};
