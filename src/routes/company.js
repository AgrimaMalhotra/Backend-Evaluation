const controller = require('../controllers/company');
const express = require('express');

const router = express.Router();

router.post('/save', controller.createDb);
router.get('/companies', controller.getCompanyRanking);
router.patch('/update', controller.updateCompanyDetails);

module.exports = router;