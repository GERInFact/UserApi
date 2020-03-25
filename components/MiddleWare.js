class MiddleWare {
  constructor(logger) {
    if (!logger) throw new Error("logger can not be null");
    this.logger = logger;

    // log request details in log.txt
    this.logRequestDetails = (req, res, next) => {
      this.logger.log(
        `${__dirname}/../log/log.txt`,
        `IP: ${req.ip}\nMethod: ${req.method}\nURL: ${req.url}\nTimestamp: ${new Date()}\n\n`
      );
      next();
    };

    // log request errors in error.txt
    this.logRequestError = (err, req, res, next) => {
      this.logger.log(
        `${__dirname}/../log/error.txt`,
        err + " Timetamp: " + new Date() + "\n\n"
      );
      next();
    };
  }
}

module.exports = MiddleWare;
