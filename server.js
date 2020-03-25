const express = require("express"),
  Logger = require("./components/Logger"),
  MiddleWare = require("./components/MiddleWare"),
  AppManager = require("./components/AppManager");

const app = express();
const appManager = new AppManager(new MiddleWare(new Logger()));

// initialize Middleware and static folder
appManager.initMiddleWare(app);
appManager.initStaticFolder(app, express);

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Server is listening on port ${port}`);
