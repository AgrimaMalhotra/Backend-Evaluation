const service = require('../../src/services/company');
const controller = require('../../src/controllers/company');
const utils = require('../../src/utils/csvToJson');
const axios = require('axios');

jest.mock('axios');
describe('Test Controller', () => {
  describe('Post API', () => {
    it('Should return all tasks', async () => {
      const axiosData = '95b,IT\n95b,IT\n';
      const mockCompany = [{
        id: 1,
        companyId: '95b',
        name: 'Volkswagen',
        ceo: 'Marshall Kautzer'
      }];
      const mockSector = { sectorName: 'IT', companyId: '95b', score: 13.102174999999999 };
      const mockResult = {
        id: 1,
        companyId: '95b',
        name: 'Volkswagen',
        ceo: 'Marshall Kautzer',
        score: 13.102174999999999
      };
      jest.spyOn(service, 'createCompanyDetails').mockResolvedValue(mockCompany);
      jest.spyOn(service, 'createSectorDetails').mockResolvedValue(mockSector);
      jest.spyOn(service, 'getData').mockResolvedValue(mockResult);
      jest.spyOn(utils, 'csvJson').mockResolvedValue([{ company_id: '95b', company_sector: 'IT' }, { company_id: '95b', company_sector: 'IT' }]);
      axios.get.mockResolvedValue(axiosData);
      const mockReq = {
        body:
        {
          urlLink: 'https://store-0001.s3.amazonaws.com/input.csv'
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await controller.createDb(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith(mockResult);
    });
    it('Should return error if the tables are empty', async () => {
      const axiosData = '95b,IT\n95b,IT\n';
      const mockCompany = [{
        id: 1,
        companyId: null,
        name: 'Volkswagen',
        ceo: 'Marshall Kautzer'
      }];
      const mockSector = { sectorName: 'IT', companyId: null, score: 13.102174999999999 };

      jest.spyOn(service, 'createCompanyDetails').mockResolvedValue(mockCompany);
      jest.spyOn(service, 'createSectorDetails').mockResolvedValue(mockSector);
      jest.spyOn(service, 'getData').mockResolvedValue(null);
      jest.spyOn(utils, 'csvJson').mockResolvedValue([{ company_id: null, company_sector: 'IT' }, { company_id: '95b', company_sector: 'IT' }]);
      axios.get.mockResolvedValue(axiosData);
      const mockReq = {
        body:
        {
          urlLink: 'https://store-0001.s3.amazonaws.com/input.csv'
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await controller.createDb(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockRes.json).toBeCalledWith({ message: 'No data found' });
    });
    it('Should return error if the input file is empty', async () => {
      jest.spyOn(utils, 'csvJson').mockImplementation(() => { throw new Error('csv file is empty'); });
      jest.spyOn(service, 'createCompanyDetails').mockResolvedValue(null);
      jest.spyOn(service, 'createSectorDetails').mockResolvedValue(null);
      jest.spyOn(service, 'getData').mockResolvedValue();
      axios.get.mockResolvedValue('');
      const mockReq = {
        body:
        {
          urlLink: 'https://store-0001.s3.amazonaws.com/input.csv'
        }
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await controller.createDb(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockRes.json).toBeCalledWith({ message: 'csv file is empty' });
    });
  });
});