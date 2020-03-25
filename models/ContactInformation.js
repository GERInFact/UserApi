const Address = require("./Address");
class ContactInformation {
  constructor(name, surname, address) {
      this.name = name || "";
      this.surname = surname || "";
      this.address = address || new Address();
  }
  get() {
      return `${this.name}\n${this.surname}\n${this.address.get()}`; 
  }
}
module.exports = ContactInformation;