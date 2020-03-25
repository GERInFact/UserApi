const mongoose = require("mongoose");
module.exports.UserSchema = new mongoose.Schema({
  loginCredentials: {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
  },
  contactInformation: {
    name: String,
    surname: String,
    address: {
      street: String,
      number: String,
      zip: String,
      city: String,
      county: String,
      country: String
    }
  },
  billingInformation: {
    bank: String,
    iban: String
  },
  userGroups: [String],
  joined: { type: Date, default: Date.now }
});