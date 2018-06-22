const express = require("express");
const router = express.Router();
const db = require("../db/api");

router.post("/add", function(req, res, next) {
  db.addMember(req.body).then(() => {
    res.json({
      message: "Member added successfully"
    });
  });
});

router.put("/:id", (req, res, next) => {
  db.updateMemberById(req.body).then(() => {
    res.json({
      message: "Member updated successfully"
    });
  });
});

router.delete("/:id", (req, res, next) => {
  db.deleteMemberById(req.params.id).then(() => {
    res.json({
      message: "Member deleted successfully"
    });
  });
});

module.exports = router;
