const { csvJson } = require('../../src/utils/csvToJson');

describe('Test Utils', () => {
  it('should return data in json format', () => {
    const data = 'company_id,company_sector\n95b,Automobile\n46e,Software';
    expect(csvJson(data)).toEqual([{ company_id: '95b', company_sector: 'Automobile' }, { company_id: '46e', company_sector: 'Software' }]);
  });
  it('should return error if input empty', () => {
    expect(() => csvJson()).toThrow('csvStr is undefined');
  });
});