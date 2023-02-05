const services = require('../../src/services/company.js')
const models = require('../../database/models')

describe('SERVICES', () => {
  describe('createCompanyDetails', () => {
    const companyDetails = {
      id: '95b',
      name: 'Volkswagen',
      ceo: 'Marshall Kautzer',
      tags: ['automotive', 'germany'],
      numberEmployees: 100000
    };
    const companyDbDetails = {
      id: 133,
      companyId: '95b',
      name: 'Volkswagen',
      ceo: 'Marshall Kautzer',
      tags: ['automotive', 'germany'],
      employeeCount: 100000,
      createdAt: '2023-02-05T14:10:10.018Z',
      updatedAt: '2023-02-05T14:10:10.018Z'
    };
    it('should create company table', async () => {
      jest.spyOn(models.company, 'create').mockResolvedValue(companyDbDetails);

      const result = await services.createCompanyDetails(companyDetails);
      expect(result).toEqual(companyDbDetails);
    });
  });
  describe('createSectorDetails', () => {
    const sectorDetails = {
      companyId: '95b',
      performanceIndex: [
        { key: 'cpi', value: 10 },
        { key: 'cf', value: 10000 },
        { key: 'mau', value: 10 },
        { key: 'roic', value: 10 }
      ]
    };
    const sectorDbDetails = {
      id: 133,
      sectorName: 'automotive',
      companyId: '95b',
      cpi: 10,
      cf: 10000,
      mau: 10,
      roic: 10,
      score: 52.75,
      createdAt: '2023-02-05T14:10:10.018Z',
      updatedAt: '2023-02-05T14:10:10.018Z'
    };
    it('should create sector  table', async () => {

      jest.spyOn(models.sector, 'create').mockResolvedValue(sectorDbDetails);

      const result = await services.createSectorDetails('automotive', sectorDetails);
      expect(result).toEqual(sectorDbDetails);
    });
  });
  describe('getData', () => {
    const companyDbDetails = {
      companyId: '95b',
      name: 'Volkswagen',
      ceo: 'Marshall Kautzer',
      tags: ['automotive', 'germany'],
      employeeCount: 100000,
      sector: {
        score: 10
      }
    };
    it('should return score for each company', async () => {

      jest.spyOn(models.company, 'findAll').mockResolvedValue(companyDbDetails);

      const result = await services.getData();
      expect(result).toEqual(companyDbDetails);
    });
  });
});
