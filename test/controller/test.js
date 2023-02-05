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


  describe('Get Ranking API', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    it('Should return all tasks according to their ranking', async () => {
      const mockReq = {
        query: {
          sector: 'Software'
        }
      };
      const mockResult = [{
        companyId: '95b',
        name: 'Tesla',
        ceo: 'Musk',
        tags: ['automotive'],
        employeeCount: 10000,
        sector: {
          score: 20
        }
      },
      {
        companyId: '97b',
        name: 'Google',
        ceo: 'Pichai',
        tags: ['software'],
        employeeCount: 1000000,
        sector: {
          score: 10
        }
      }
      ];
      jest.spyOn(service, 'getCompanyRanking').mockResolvedValue(mockResult);
      await controller.getCompanyRanking(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith(mockResult);
    });
    it('Should return error if no sector mentioned', async () => {
      const mockResult = [];
      const mockReq = {
        query: {
          sector: undefined
        }
      };
      jest.spyOn(service, 'getCompanyRanking').mockResolvedValue(mockResult);
      await controller.getCompanyRanking(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockRes.json).toBeCalledWith({ message: 'Sector is not defined' });
    });
    it('Should return error if no data for sector found', async () => {
      const mockResult = null;
      const mockReq = {
        query: {
          sector: 'Software'
        }
      };
      jest.spyOn(service, 'getCompanyRanking').mockResolvedValue(mockResult);
      await controller.getCompanyRanking(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockRes.json).toBeCalledWith({ message: 'No data found' });
    });
  });
  describe('Update Company API', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    it('Should update the company details', async () => {
      const mockReq = {
        body: {
          name: 'Tesla',
          ceo: 'Musk',
        },
        query: {
          id: '95b'
        }
      };
      const mockResult = {
        companyId: '95b',
        name: 'Tesla',
        ceo: 'Musk',
        tags: ['automotive'],
        employeeCount: 10000,
      };
      jest.spyOn(service, 'updateCompanyDetails').mockResolvedValue(mockResult);
      await controller.updateCompanyDetails(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockRes.json).toBeCalledWith(mockResult);
    });
    it('Should throw error if no data updated ', async () => {
      const mockReq = {
        body: {
          name: 'Tesla',
          ceo: 'Musk',
        },
        query: {
          id: '95b'
        }
      };
      const mockResult = null;
      jest.spyOn(service, 'updateCompanyDetails').mockResolvedValue(mockResult);
      await controller.updateCompanyDetails(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(400);
      expect(mockRes.json).toBeCalledWith({ message: 'No data updated' });
    });
  });

});

