
export default class Helpers {
  static convertCSVtoJSON(csvFile) {
    var lines = csvFile.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for(var i = 1; i < lines.length; i++){

  	  var obj = {};
  	  var currentline = lines[i].split(",");

  	  for(var j = 0; j < headers.length; j++){
  		  obj[headers[j]] = currentline[j];
  	  }

  	  result.push(obj);

    }

    return JSON.stringify(result);
  }

  static removeBadNPIData(claimDataArray) {
    return claimDataArray.filter(currentClaimData => {
      const claimNPI = currentClaimData.hasOwnProperty('NPI') ? currentClaimData.NPI : currentClaimData.npi;
      if (claimNPI.toString().length === 10) {
        return claimNPI;
      } else {
        console.log(claimNPI);
      }
    });
  }

  static matchClaimWithProvider(claimDataArray, providerDataArray) {
    if (claimDataArray === undefined) return [];

    return claimDataArray.reduce((processedArray, currentClaimData) => {
      return providerDataArray.filter(currentProviderData => {
        if (currentClaimData.NPI.toString() === currentProviderData.npi.toString()) {
          processedArray.push(providerDataArray);
        }
        return processedArray;
      });
    }, []);
  }

  static getUnmatchedClaims(claimDataArray, providerDataArray) {
    if (claimDataArray === undefined) return [];

    return claimDataArray.reduce((processedArray, currentClaimData) => {
      return providerDataArray.filter(currentProviderData => {
        if (currentClaimData.NPI.toString() !== currentProviderData.npi.toString()) {
          console.log(currentProviderData);
          processedArray.push(providerDataArray);
        }
        return processedArray;
      });
    }, []);
  }

  static rejectDuplicateEntries(claims) {
    return claims.map(currentClaim => {
      if (currentClaim.is_duplicate) {
        currentClaim.line_items.forEach(currentLineItem => {
          console.log(currentClaim);
          currentLineItem.reject();
        });
      }

      return currentClaim;
    });
  }

  static getDuplicateClaims(claim, currentClaimsToTest) {
    return currentClaimsToTest.reduce((dupeClaimsArray, currentClaimToTest) => {
      const hasSameStartDate = claim.start_date === currentClaimToTest.start_date;
      const hasSameSubscriberSSN = claim.patient.ssn === currentClaimToTest.patient.ssn;
      const hasSameProcedureCode = Helpers.getDuplicateProcedureCodes(claim, currentClaimsToTest).length > 1;

      if (hasSameStartDate && hasSameSubscriberSSN && hasSameProcedureCode) {
        dupeClaimsArray.push(currentClaimToTest);
      }

      return dupeClaimsArray;
    }, []);
  }

  static getDuplicateProcedureCodes(claim, currentClaimsToTest) {
    return claim.line_items.filter((dupeLineItemsArray, cLineItem) => {
      return currentClaimsToTest.filter(currentClaim => {
        currentClaim.line_items.forEach(lineItemToTestAgainst => {
          if (cLineItem.procedure_code === lineItemToTestAgainst.procedure_code) {
            return cLineItem;
          }
        });
      });
    });
  }

  static fullyPayPreventiveAndDiagnosticCodes(claimLineItem) {
    if (claimLineItem.isPreventiveAndDiagnostic()) {
      claimLineItem.pay(claimLineItem.charged);
    }
  }

  static payOrtho(claimLineItem) {
    if (claimLineItem.isOrtho()) {
      const payedAmount = claimLineItem.charged * .25;
      claimLineItem.pay(claimLineItem.charged - payedAmount);
    }
  }
}
