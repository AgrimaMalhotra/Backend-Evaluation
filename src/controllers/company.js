const axios = require('axios');
const utils = require('../utils/csvToJson');
const services = require('../services/company');

const createDb = async (req, res) => {
  const response = await axios.get(req.body.urlLink, { responseType: 'blob' });
  const file = response.data;
  const jsonObj = utils.csvJson(file);
  let companyId = [], companySector = [];

  for (const obj in jsonObj) {
    companyId.push(obj.company_id);
    companySector.push(obj.company_sector);
  };

  for (const id of companyId) {
    const data = await axios.get(`http://54.167.46.10/company/${id}`);
    await services.createCompanyDetails(data.data);
  }

  for (const sectorName of companySector) {
    const sectorData = await axios.get(`http://54.167.46.10/sector?name=${sectorName}`);
    for (const obj of sectorData.data) { await services.createSectorDetails(sectorName, obj); }
  }

  const companyData = await services.getData();
  res.status(200).json(companyData);

}
module.exports = { createDb, };