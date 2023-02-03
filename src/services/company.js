const models = require('../../database/models');

const createCompanyDetails = async (companyDetails) => {
  const company = models.company.create({ companyId: companyDetails.id, name: companyDetails.name, ceo: companyDetails.ceo, tags: companyDetails.tags, employeeCount: Number(companyDetails.numberEmployees) });
  return company;
}

const createSectorDetails = async (sectorName, sectorDetails) => {
  const entry = {
    sectorName: sectorName,
    companyId: sectorDetails.companyId
  };
  sectorDetails.performanceIndex.forEach(obj => entry[obj.key] = Number(obj.value));
  entry['score'] = ((entry.cpi * 10) + (entry.cf / 10000) + (entry.mau * 10) + entry.roic) / 4;
  const sector = models.sector.create(entry);
  return sector;
}

const getData = async () => {
  const company = await models.company.findAll({
    include: [{
      model: models.sector,
      attributes: ['score']
    }]
  });
  return company;
}

module.exports = { createCompanyDetails, createSectorDetails, getData };
