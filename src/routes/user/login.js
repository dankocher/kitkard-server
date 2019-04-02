const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Session = require("../../models/Session");

// REGISTRATION OR LOGIN IF EXIST
router.post("/", async (req, res) => {
    let { email, password } = req.body;

    email = email.replace("+", "");

    let user = await User.findOne({
        "$or" : [
            {"username" : new RegExp(email, 'i') },
            { "email" :  new RegExp(email, 'i')  }
        ],
        "password" : password,
        "enabled" : true
    });

    if (user != null && user.enabled === true) {
        req.session._id = user._id;
        res.json({ok: true, status: "login", "session": req.sessionID, user: user});
    } else
    if (user != null && user.enabled === false) {
        setTimeout(() => {
            res.json({ ok: false, status: "disabled" });
        }, 3000);
    } else {

        setTimeout(() => {
            res.json({ ok: false, status: "incorrect" });
        }, 3000);
    }
});

module.exports =  router;
