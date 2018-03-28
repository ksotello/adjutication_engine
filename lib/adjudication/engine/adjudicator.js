import Claim from './claim';
import Helpers from '../providers/helpers';

export default class Adjudicator {
  static adjudicate(options) {
    const mappedClaims = options.matchedClaims.map(currentClaim => {
      return new Claim(currentClaim);
    });

    const unmatchedClaims = options.unmatchedClaims.map(currentClaim => {
      return new Claim(currentClaim);
    });

    // console.log(unmatchedClaims);

    unmatchedClaims.forEach(currentUnMatchedClaim => {
      currentUnMatchedClaim.line_items.forEach(currentLineItem => {
        currentLineItem.reject();
      });
    });

    const updatedClaimsWithMarkedDuplicates = mappedClaims.map(currentClaim => {
      let matchedIndex = 0;
      Helpers.getDuplicateClaims(currentClaim, mappedClaims).forEach(ccDupeClaim => {
        matchedIndex = currentClaim.npi === ccDupeClaim.npi ? matchedIndex + 1 : matchedIndex;

        if (matchedIndex > 1) {
          currentClaim.isDuplicateClaim();
        }
      });

      return currentClaim;
    });

    const updatedEntries = Helpers.rejectDuplicateEntries(updatedClaimsWithMarkedDuplicates).concat(unmatchedClaims);

    return updatedEntries.map(cc => {
      cc.line_items.forEach(ccli => {
        Helpers.fullyPayPreventiveAndDiagnosticCodes(ccli);
        Helpers.payOrtho(ccli);
      });

      return cc;
    });
  }
}
