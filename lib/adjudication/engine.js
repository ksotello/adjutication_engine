import { Adjudicator } from './engine';
import Fetcher from './providers/fetcher';
import Helpers from './providers/helpers';

export default class Engine {
  static run(claimsData) {
    return Fetcher.providerData().then(providerData => {
      console.log(providerData);

      const filteredProviderData = Helpers.removeBadNPIData(providerData);
      const fiteredClaimData = Helpers.removeBadNPIData(mockClaimJSON);
      const unmatchedClaims = Helpers.getUnmatchedClaims(filteredProviderData, fiteredClaimData);
      const matchedClaims = Helpers.matchClaimWithProvider(filteredProviderData, fiteredClaimData);

      return Adjudicator.adjudicate({
        matchedClaims: matchedClaims,
        unmatchedClaims: unmatchedClaims
      });
    });
  }
}
