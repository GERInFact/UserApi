class Credentials {
  constructor(username, password, email) {
    this.username = username || "";
    this.password = password || "";
    this.email = email || "";
  }

  get() {
    return `${this.id}\n${this.username}\n${this.password}\n${this.email}`;
  }

  set(id, username, password, email) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
  }
}
module.exports = Credentials;
