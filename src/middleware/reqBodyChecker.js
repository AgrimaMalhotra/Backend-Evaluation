const joi = require('joi');
const patchSchema = () => joi.object({
  name: joi.string(),
  ceo: joi.string()
});

module.exports = { patchSchema };