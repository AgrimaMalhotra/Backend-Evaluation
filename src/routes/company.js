const controller = require('../controllers/company');
const express = require('express');
const { validationTest } = require('../middleware');

const router = express.Router();

router.post('/save', validationTest('urlSchema', ''), controller.createDb);
router.get('/companies', validationTest('querySchema', 'sector'), controller.getCompanyRanking);
router.patch('/update', validationTest('querySchema', 'id'), validationTest('patchSchema', 'id'), controller.updateCompanyDetails);

module.exports = router;