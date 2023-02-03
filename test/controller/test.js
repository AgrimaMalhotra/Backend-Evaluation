const service = require('../../src/services/company');
const controller = require('../../src/controllers/company');
const utils = require('../../src/utils/csvToJson');

jest.mock('axios');
describe('Test Controller', () => {
  describe('Post API', () => {
    const axios = require('axios');
    const axiosData = '95b,IT\n95b,IT\n';
    const mockCompany = [{
      id: 1,
      companyId: '95b',
      name: 'Volkswagen',
      ceo: 'Marshall Kautzer'
    }];
    const mockSector = { 'sectorName': 'IT', 'companyId': '95b', 'score': 13.102174999999999 };
    const mockResult = {
      id: 1,
      companyId: '95b',
      name: 'Volkswagen',
      ceo: 'Marshall Kautzer',
      score: 13.102174999999999
    };
    it('Should return all tasks', async () => {
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
    // it('Should return 404 error', async () => {
    //   jest.spyOn(service, 'createCompanyDetails').mockResolvedValue(null);
    //   const mockReq = {
    //   }
    //   const mockRes = {
    //     status: jest.fn().mockReturnThis(),
    //     json: jest.fn()
    //   }
    //   await controller.createCompanyDetails(mockReq, mockRes);
    //   expect(mockRes.status).toBeCalledWith(404);
    //   expect(mockRes.json).toBeCalledWith({ message: 'No entries found' });
    // });
    // it('Should return 500 Error', async () => {
    //   jest.spyOn(service, 'createCompanyDetails').mockRejectedValue(null);
    //   const mockReq = {
    //   }
    //   const mockjson = jest.fn();
    //   const mockRes = {
    //     status: jest.fn(() => ({
    //       json: mockjson,
    //     }))
    //   }
    //   await controller.createCompanyDetails(mockReq, mockRes);
    //   expect(mockRes.status).toBeCalledWith(500);
    //   expect(mockjson).toBeCalledWith({ message: 'Something went wrong' });
    // });
  });
});