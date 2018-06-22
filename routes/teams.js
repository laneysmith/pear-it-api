const express = require("express");
const router = express.Router();
const db = require("../db/api");

router.get("/:id/pairs", (req, res, next) =>
  Promise.all([
    db.findPairsByTeamId(req.params.id),
    db.findMembersByTeamId(req.params.id)
  ]).then(data => res.json(data))
);

router.post("/:id/recommend", (req, res, next) =>
  db.recommendPairs(req.params.id, req.body).then(data => res.json(data))
);

router.post("/:id/save", (req, res, next) =>
  db.recommendPairs(req.params.id, req.body).then(data => res.json(data))
);

module.exports = router;
