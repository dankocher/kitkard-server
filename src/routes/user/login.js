const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Session = require("../../models/Session");

// REGISTRATION OR LOGIN IF EXIST
router.post("/", async (req, res) => {
    //TODO: check user with session
    let { email, password, auth } = req.body;

    email = email.replace("+", "");

    let user = null;

    if (auth === "g" || auth === "f") {
        user = await User.findOne({
            email: email,
            auth: auth,
            enabled: true
        });
    } else {
        console.log(email);
        console.log(password);
        user = await User.findOne({
            "$or" : [
                {"username" : email },
                { "email" : email  }
            ],
            "password" : password,
            "enabled" : true
        });
        console.log(user);
    }

    if (user != null && user.enabled === true) {
        req.session.email = user.email;
        req.session.password = user.password;
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
