const Credentials = require("../models/Credentials"),
  ContactInformation = require("../models/ContactInformation"),
  Address = require("../models/Address");
BillingInformation = require("../models/BillingInformation");
class User {
  constructor(
    loginCredentials,
    contactInformation,
    billingInformation,
    userGroups
  ) {
    this.loginCredentials = loginCredentials;
    this.contactInformation = contactInformation;
    this.billingInformation = billingInformation;
    this.userGroups = userGroups;
    this.joined = new Date();
  }

  static createFrom(userData, passwordHash) {
    return new User(
      new Credentials(
        userData.loginCredentials.username,
        passwordHash,
        userData.loginCredentials.email
      ),
      new ContactInformation(
        userData.contactInformation.name,
        userData.contactInformation.surname,
        new Address(
          userData.contactInformation.address.street,
          userData.contactInformation.address.number,
          userData.contactInformation.address.zip,
          userData.contactInformation.address.city,
          userData.contactInformation.address.county,
          userData.contactInformation.address.country
        )
      ),
      new BillingInformation(
        userData.billingInformation.bank,
        userData.billingInformation.iban
      ),
      ["", ""],
      Date.now()
    );
  }
  static getDefault() {
    return new User(
      new Credentials(),
      new ContactInformation(),
      new BillingInformation(),
      []
    );
  }
}
module.exports = User;
