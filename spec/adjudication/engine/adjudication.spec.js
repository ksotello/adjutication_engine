import { Adjudicator } from '../../../lib/adjudication/engine/';
import Helpers from '../../../lib/adjudication/providers/helpers';
import beamNetworkMockJson from '../../mocks/beam-network-mock.json';
import mockClaimJSON from '../../mocks/data.json';

describe('The Adjudicator Class', () => {

  it('should be defined', () => {
    expect(Adjudicator).toBeDefined();
  });

  describe('The adjudicate functionality', () => {
    it('should be defined as a function', () => {
      expect(Adjudicator.adjudicate).toEqual(jasmine.any(Function));
    });

    it('should return an array of claims', () => {
      const filteredProviderData = Helpers.removeBadNPIData(beamNetworkMockJson);
      const fiteredClaimData = Helpers.removeBadNPIData(mockClaimJSON);
      const unmatchedClaims = Helpers.getUnmatchedClaims(filteredProviderData, fiteredClaimData);
      const matchedClaims = Helpers.matchClaimWithProvider(filteredProviderData, fiteredClaimData);

      const results = Adjudicator.adjudicate({
        matchedClaims: matchedClaims,
        unmatchedClaims: unmatchedClaims
      });

      expect(results.length).toEqual(8);
    });
  });
});
