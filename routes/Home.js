const express = require("express"),
router = express.Router();

// send Welcome Page
router.get("/", (req, res) => {
  res.redirect("/index.html");
});

module.exports = router;