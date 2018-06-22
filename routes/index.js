const express = require("express");
const router = express.Router();

const teams = require("./teams");
router.use("/teams", teams);

const members = require("./members");
router.use("/members", members);

module.exports = router;
