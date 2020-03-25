const morgan = require("morgan"),
  bodyParser = require("body-parser"),
  users = require("../routes/Users"),
  home = require("../routes/Home");
  cors = require("cors");

class AppManger {
  constructor(middleWare) {
    if (!middleWare) throw new Error("middleware can not be null");
    this.middleWare = middleWare;
    this.corsOptions = {
      origin: "http://localhost",
      optionsSuccessStatus: 200
    };
  }

  // Set up middleware functions
  initMiddleWare(app) {
    if (!app) throw new Error("app can not be null");

    app.use(cors(this.corsOptions));
    app.use(bodyParser.json());
    app.use(morgan("common"));
    app.use(this.middleWare.logRequestDetails);
    app.use(this.middleWare.logRequestError);
    app.use("/users", users);
    app.use("/", home);
  }

  // provide static files via public folder
  initStaticFolder(app, express) {
    if (!express) throw new Error("express can not be null");
    app.use(express.static("public"));
  }
}

module.exports = AppManger;
