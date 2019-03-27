const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Session = require("../../models/Session");

// Logout, destroy session
router.get("/:session", async (req, res) => {
    //TODO: check user with session
    const { session } = req.params;

    Session.remove({_id: session});
    req.session.destroy();
    res.json({ok: true});

});

router.get("/", async (req, res) => {

    Session.remove({_id: req.sessionID});
    req.session.destroy();
    res.json({ok: true});

});

module.exports =  router;
