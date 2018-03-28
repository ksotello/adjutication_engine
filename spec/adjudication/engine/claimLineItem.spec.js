import { ClaimLineItem } from '../../../lib/adjudication/engine/';
import mockClaimJSON from '../../mocks/data.json';

describe('The ClaimLineItem Class', () => {
  let claimLineItem;

  afterEach(() => {
    claimLineItem = null;
  })

  it('should be defined', () => {
    expect(ClaimLineItem).toBeDefined();
  });

  describe('The reject functionality', () => {
    beforeEach(() => {
      claimLineItem = new ClaimLineItem(mockClaimJSON[0].line_items);
    });

    it('should have a base status code as an empty string (indicating no status)', () => {
      expect(claimLineItem.status_code).toEqual('');
    });

    it('should be able to reject claims', () => {
      claimLineItem.reject();
      expect(claimLineItem.status_code).toEqual('R');
    });
  });
});
