import {formatCurrency} from '../scripts/utils/money.js'
describe('test suite: formatecurrency',() =>{
  it('converts cents into dollors',() => {
      expect(formatCurrency(2095)).toEqual('20.95');
  });
});