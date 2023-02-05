const axios = require('axios');
const utils = require('../utils/csvToJson');
const services = require('../services/company');

const createDb = async (req, res) => {
  try {
    const response = await axios.get(req.body.urlLink, { responseType: 'blob' });
    const file = response.data;
    const jsonObj = utils.csvJson(file);
    let companyId = [], companySector = [];

    for (let i = 0; i < jsonObj.length; i++) {
      companyId.push(jsonObj[i].company_id);
      companySector.push(jsonObj[i].company_sector);
    }

    for (const id of companyId) {
      const companyData = await axios.get(`http://54.167.46.10/company/${id}`);
      await services.createCompanyDetails(companyData.data);
    }

    for (const sectorName of companySector) {
      const sectorData = await axios.get(`http://54.167.46.10/sector?name=${sectorName}`);
      for (const obj of sectorData.data) { await services.createSectorDetails(sectorName, obj); }
    }

    const companyData = await services.getData();
    if (companyData === null) {
      throw new Error('No data found');
    }
    res.status(200).json(companyData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const getCompanyRanking = async (req, res) => {
  try {
    if (req.query.sector === undefined) {
      throw new Error('Sector is not defined');
    }
    const companyData = await services.getCompanyRanking(req.query.sector);
    if (companyData === null) {
      throw new Error('No data found');
    }
    res.status(200).json(companyData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { createDb, getCompanyRanking };