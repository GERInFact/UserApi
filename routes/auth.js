const config = require("config");
const jwt = require("jsonwebtoken");

function sendNewJWT(user, res) {
  jwt.sign(
    user,
    config.get("jwt.secret"),
    { expiresIn: "9h" },
    (err, token) => {
      if (err) return res.status(500).send(err.message);
      res.json({ user, token });
    }
  );
}
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return res.status(403).send("Missing credentials.");
  const token = bearerHeader.split(" ")[1];
  jwt.verify(token, config.get("jwt.secret"), (err, authData) => {
    if (err || req.params.username !== authData.username)
      return res.status(403).send("User not found");
    next();
  });
}

exports.sendNewJWT = sendNewJWT;
exports.verifyToken = verifyToken;
