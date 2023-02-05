const joi = require('joi');
const querySchema = () => {
  return joi.string().required();
};

module.exports = { querySchema };