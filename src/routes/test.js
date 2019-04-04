const express = require('express');
const router = express.Router();

const User = require("../models/User");
const Card = require("../models/Card");
const Session = require("../models/Session");

router.get("/", async(req, res) => {
    res.json({test: "test"})

});

module.exports =  router;
