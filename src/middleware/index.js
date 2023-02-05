const { querySchema } = require('./queryParamChecker');
const { patchSchema } = require('./reqBodyChecker');
const { urlSchema } = require('./urlChecker');

const validationTest = (validator, param) => {
  if (validator === undefined) {
    throw new Error('Validator is not defined');
  }
  if (validator === 'querySchema' && param === 'sector') {
    return (req, res, next) => {
      const { error } = querySchema().validate(req.query.sector);
      if (error) {
        res.status(400).json({ message: error.message });
      } else {
        next();
      }
    };
  }
  else if (validator === 'querySchema' && param === 'id') {
    return (req, res, next) => {
      const { error } = querySchema().validate(req.query.id);
      if (error) {
        res.status(400).json({ message: error.message });
      } else {
        next();
      }
    };
  }
  else if (validator === 'patchSchema') {
    return (req, res, next) => {
      const { error } = patchSchema().validate(req.body);
      if (error) {
        res.status(400).json({ message: error.message });
      } else {
        next();
      }
    };
  }
  else if (validator === 'urlSchema') {
    return (req, res, next) => {
      const { error } = urlSchema().validate(req.body.urlLink);
      if (error) {
        res.status(400).json({ message: error.message });
      } else {
        next();
      }
    };
  }
}

module.exports = { validationTest };