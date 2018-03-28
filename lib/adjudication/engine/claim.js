import ClaimLineItem from './claimLineItem';

export default class Claim {
  constructor(claimObj) {
    this.number = claimObj['number'];
    this.provider = claimObj['npi'];
    this.subscriber = claimObj['subscriber'];
    this.patient = claimObj['patient'];
    this.start_date = claimObj['start_date'];
    this.line_items = claimObj['line_items'].map(lineItem => { return new ClaimLineItem(lineItem) });
    this.is_duplicate = false;
  }

  isDuplicateClaim() {
    this.is_duplicate = true;
  }

  procedureCodes() {
    return this.line_items.sort((currentLineItem, nextLineItem) => {
      return currentLineItem.procedure_code < nextLineItem.procedure_code;
    });
  }
}
