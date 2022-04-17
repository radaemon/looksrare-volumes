require('dotenv').config();
import { it } from 'mocha';
import { assert, expect } from 'chai';
import { getCoinMarketCapData } from '../api/utils/getCoinMarketCapData';
import type { CoinMarketCapParsedObject } from '../api/utils/getCoinMarketCapData';
import to from 'await-to-js';

describe('CoinMarketCap', async () => {
  let looksData: Awaited<CoinMarketCapParsedObject>;

  before(async () => {
    const [err, res] = await to(getCoinMarketCapData('17081'));
    if (err) assert.fail(err.message);
    looksData = res;
  });

  it('Test for nullity.', () => {
    expect(looksData).to.not.be.null;
  });
  it('Test for property name.', () => {
    expect(looksData).to.have.property('name', 'LooksRare');
  });
});
