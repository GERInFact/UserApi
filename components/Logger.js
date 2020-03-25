const fs = require("fs");
class Logger {

  // wirte log data to file at given path
  log(path, data) {
    if (!path || !data) return;
    fs.appendFile(path, data, err => {
      if (err) console.log(err);
    });
  }
}
module.exports = Logger;
