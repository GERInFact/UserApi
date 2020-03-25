class BillingInformation {
  constructor(bank, iban) {
    this.bank = bank || "";
    this.iban = iban || "";
  }
}
module.exports = BillingInformation;
