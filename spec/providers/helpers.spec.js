import Helpers from '../../lib/adjudication/providers/helpers';
import { Claim } from '../../lib/adjudication/engine/';
import beamNetworkMockJson from '../mocks/beam-network-mock.json';
import mockClaimJSON from '../mocks/data.json';

describe('The Helpers Class Functionality', () => {
  it('should be defined', () => {
    expect(Helpers).toBeDefined();
  });

  describe('The removeBadNPIData functionality', () => {
    it('should be defined as a function', () => {
      expect(Helpers.removeBadNPIData).toEqual(jasmine.any(Function));
    });

    it('should return valid NPI\'s of a length 10.', () => {
      const result = Helpers.removeBadNPIData(beamNetworkMockJson);
      expect(result.length).toEqual(5);
    });

    it('should return valid npi\'s of a length 10.', () => {
      const result = Helpers.removeBadNPIData(mockClaimJSON);
      expect(result.length).toEqual(4);
    });
  });

  describe('The matchClaimWithProvider functionality', () => {
    it('should be defined as a function', () => {
      expect(Helpers.matchClaimWithProvider).toEqual(jasmine.any(Function));
    });

    it('should return an array', () => {
      expect(Helpers.matchClaimWithProvider() instanceof Array).toBe(true);
    });

    it('should match the claim with it\'s provider', () => {
      const result = Helpers.matchClaimWithProvider(beamNetworkMockJson, mockClaimJSON);
      expect(result.length).toEqual(5);
    });
  });

  describe('The getDuplicateClaims functionality', () => {
    it('should be defined', () => {
      expect(Helpers.getDuplicateClaims).toEqual(jasmine.any(Function));
    });

    it('should return any duplicate claim entries as an array', () => {
      let mappedResults = [];

      const filteredProviderData = Helpers.removeBadNPIData(beamNetworkMockJson);
      const fiteredClaimData = Helpers.removeBadNPIData(mockClaimJSON);
      const unmatchedClaims = Helpers.getUnmatchedClaims(filteredProviderData, fiteredClaimData);
      const matchedClaims = Helpers.matchClaimWithProvider(filteredProviderData, fiteredClaimData);

      const mappedClaims = matchedClaims.map(currentClaim => {
        return new Claim(currentClaim);
      });

      mappedClaims.forEach(currentClaim => {
        mappedResults = Helpers.getDuplicateClaims(currentClaim, mappedClaims);
      });

      expect(mappedResults.length).toBe(2);
    });
  });

  describe('The getDuplicateProcedureCodes functionality', () => {
    it('should be defined as a function', () => {
      expect(Helpers.getDuplicateProcedureCodes).toEqual(jasmine.any(Function));
    });

    it('should return an array of duplicate line item entries', () => {
      let mappedResults = [];
      const mappedClaims = mockClaimJSON.map(currentClaim => {
        return new Claim(currentClaim);
      });

      mappedClaims.forEach(currentClaim => {
        mappedResults = Helpers.getDuplicateProcedureCodes(currentClaim, mappedClaims);
      });

      expect(mappedResults.length).toEqual(2);
    });
  });

  describe('The getUnmatchedClaims functionality', () => {
    it('should be defined as a function', () => {
      expect(Helpers.getUnmatchedClaims).toEqual(jasmine.any(Function));
    });

    it('should return an array', () => {
      expect(Helpers.getUnmatchedClaims() instanceof Array).toBe(true);
    });

    it('should match the claim with it\'s provider', () => {
      const result = Helpers.getUnmatchedClaims(beamNetworkMockJson, mockClaimJSON);
      expect(result.length).toEqual(5);
    });
  });

  describe('The fullyPayPreventiveAndDiagnosticCodes functionality', () => {
    let preventiveClaim;

    beforeEach(() => {
      preventiveClaim = new Claim({
        "npi": "1073702056",
        "number": "2017-09-10-112494",
        "start_date": "2017-09-10",
        "subscriber": {
          "ssn": "000-99-9876",
          "group_number": "US00123"
        },
        "patient": {
          "ssn": "000-99-9876",
          "relationship": "self"
        },
        "line_items": [
          {
            "procedure_code": "D2140",
            "tooth_code": 6,
            "charged": 169
          },
          {
            "procedure_code": "D0270",
            "tooth_code": 6,
            "charged": 28
          },
          {
            "procedure_code": "D1110",
            "tooth_code": null,
            "charged": 78
          }
        ]
      });

      preventiveClaim.line_items.forEach(cli => {
        Helpers.fullyPayPreventiveAndDiagnosticCodes(cli);
      });
    })

    it('should be defined as a function', () => {
      expect(Helpers.fullyPayPreventiveAndDiagnosticCodes).toEqual(jasmine.any(Function));
    });

    it('Should not fully pay out non preventive codes', () => {
      expect(preventiveClaim.line_items[0].patient_paid).toEqual(169);
      expect(preventiveClaim.line_items[0].carrier_paid).toEqual(0);
    });

    it('Should fully pay out preventive codes', () => {
      expect(preventiveClaim.line_items[1].patient_paid).toEqual(0);
      expect(preventiveClaim.line_items[1].carrier_paid).toEqual(28);
    });

    it('Should fully pay out preventive codes', () => {
      expect(preventiveClaim.line_items[2].patient_paid).toEqual(0);
      expect(preventiveClaim.line_items[2].carrier_paid).toEqual(78);
    });
  });

  describe('The payOrtho functionality', () => {
    it('should be defined as a function', () => {
      expect(Helpers.payOrtho).toEqual(jasmine.any(Function));
    });

    it('should pay out 25% of the cost', () => {
      const orthoClaim = new Claim({
        "npi": "1770797672",
        "number": "2017-09-06-983745",
        "start_date": "2017-09-06",
        "subscriber": {
          "ssn": "000-99-9876",
          "group_number": "US00123"
        },
        "patient": {
          "ssn": "000-99-9876",
          "relationship": "self"
        },
        "line_items": [
          {
            "procedure_code": "D8090",
            "tooth_code": null,
            "charged": 5100
          }
        ]
      });

      Helpers.payOrtho(orthoClaim.line_items[0]);

      expect(orthoClaim.line_items[0].carrier_paid).toEqual(3825);
    });
  });
});
