// esversion: 9
const express = require("express"),
  router = express.Router(),
  User = require("../models/User"),
  ModelValidator = require("../models/ModelValidator"),
  bcrypt = require("bcrypt"),
  DbManager = require("../components/DbManager"),
  config = require("config"),
  Auth = require("./auth");
const { check, validationResult } = require("express-validator");

// initialize base componentes
const saltRounds = 10;
const validator = new ModelValidator();
const dbManager = new DbManager(config.get("database.url"));

// login user and send jwt
router.post("/login", async (req, res) => {
  try {
    const submittedCredentials = { loginCredentials: req.body };
    const foundUser = await getUser(submittedCredentials);
    const isMatch = await isMatchingCredentials(
      foundUser,
      submittedCredentials
    );
    if (!foundUser || !isMatch) return res.status(400).send("User not found");
    
    submittedCredentials.loginCredentials.password = foundUser.loginCredentials.password;
    Auth.sendNewJWT(submittedCredentials.loginCredentials, res);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// send information about certain user
router.get("/:username", Auth.verifyToken, async (req, res) => {
  try {
    const user = await getUser({ loginCredentials: req.params });
    if (!user) return res.status(400).send("User not found");

    res.json(user);
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

// register new user
router.post(
  "/",
  [check("password").isAlphanumeric(), check("email").isEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).send("Invalid parameters.");

      const newUser = User.getDefault();
      newUser.loginCredentials = req.body;
      if (!isRegistrationData(newUser) || (await getUser(newUser)))
        return res.status(400).send("Missing data or username already taken.");

      const passwordHash = await bcrypt.hash(
        newUser.loginCredentials.password,
        saltRounds
      );
      await dbManager.write(User.createFrom(newUser, passwordHash));
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).send(`Error: ${err.message}`);
    }
  }
);

// update information of a certain user
router.put(
  "/:username",
  Auth.verifyToken,
  [
    check("loginCredentials.password").isAlphanumeric(),
    check("loginCredentials.email").isEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).send("Invalid parameters.");

      const updates = req.body;
      if (!updates) return res.status(404).send("User not found.");

      const updatedUser = await getUserUpdate(updates, req.params.username);

      const result = await dbManager.update(updatedUser);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// deregister a certain user
router.delete("/:username", Auth.verifyToken, async (req, res) => {
  try {
    const deletedUser = await dbManager.delete({
      "loginCredentials.username": req.params.username
    });
    if (!deletedUser) return res.status(404).send("User not found.");

    res.status(201).send(req.params.username + " was successfully deleted.");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

async function getUserUpdate(userData, originalUsername) {
  userData.loginCredentials.username = originalUsername;
  const passwordHash = await bcrypt.hash(
    userData.loginCredentials.password,
    saltRounds
  );
  return User.createFrom(userData, passwordHash);
}

function isRegistrationData(userData) {
  return (
    userData.loginCredentials &&
    validator.isRegistrationModel(userData.loginCredentials)
  );
}

async function getUser(userData) {
  return dbManager.read({
    "loginCredentials.username": userData.loginCredentials.username
  });
}

async function isMatchingCredentials(user, credentialsSubmitted) {
  if (!user) return false;
  const match = await bcrypt.compare(
    credentialsSubmitted.loginCredentials.password,
    user.loginCredentials.password
  );
  return (
    match &&
    credentialsSubmitted.loginCredentials.username ===
      user.loginCredentials.username
  );
}
module.exports = router;
