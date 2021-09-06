const express = require("express");
const router = express.Router();
const limiter = require("requestslimiter");

router.get("/", function (req, res, next) {
    if (limiter(3600, 5, req.ip)) res.send("Hola");
});

router.get("/", function (req, res, next) {
    res.json({ test: "test1" });
});

module.exports = router;
