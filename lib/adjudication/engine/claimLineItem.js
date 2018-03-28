export default class ClaimLineItem {
  constructor(lineItemsObj) {
    this._procedure_code = lineItemsObj['procedure_code'] || '';
    this.tooth_code = lineItemsObj['tooth_code'];
    this.charged = lineItemsObj['charged'];

    this.status_code = '';
    this.carrier_paid = 0;
    this.patient_paid = this.charged;
  }

  get procedure_code() {
    return this._procedure_code;
  }

  reject() {
    this.status_code = 'R';
  }

  pay(carrierPaid) {
    this.status_code = 'P';
    this.carrier_paid = carrierPaid;
    this.patient_paid = this.charged - this.carrier_paid;
  }

  isOrtho() {
    return this.procedure_code.indexOf('D8') !== -1;
  }

  isPreventiveAndDiagnostic() {
    const procedure_code = parseInt(this.procedure_code.slice(1, this.procedure_code.length));
    return procedure_code < 2000;
  }

  toString() {
    return [
      this.procedure_code,
      this.tooth_code,
      this.charged,
      this.status_code,
      this.carrier_paid,
      this.patient_paid
    ].join(',');
  }
}
