const mongoose = require("mongoose");
const userSchema = require("../models/UserSchema").UserSchema;

class DbManager {
  constructor(connectionString) {
    this.User = mongoose.model("User", userSchema);
    mongoose
      .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(res => {
        console.log("Connected to MongoDB...");
      })
      .catch(err => console.log(err));
  }
  async write(entry) {
    const user = new this.User(entry);
    await user.save();
  }
  async read(filter) {
    return this.User.findOne(filter);
  }
  async readAll(filter) {
    return this.User.find(filter);
  }
  async update(update) {
    if (!update) return;

    const foundUser = await this.User.findOne({
      "loginCredentials.username": update.loginCredentials.username
    });
    if (!foundUser) return;

    const properties = Object.keys(update);
    properties.forEach(p => {
      if (update[p]) foundUser[p] = update[p];
    });
    return foundUser.save();
  }
  async delete(filter) {
    return this.User.deleteOne(filter);
  }
}

module.exports = DbManager;
