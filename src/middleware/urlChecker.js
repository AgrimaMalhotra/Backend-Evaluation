const joi = require('joi');
const urlSchema = () => {
  return joi.string().uri();
};

module.exports = { urlSchema };