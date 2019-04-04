const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Session = require("../../models/Session");

// REGISTRATION OR  LOGIN IF EXIST
router.post("/", async (req, res) => {
    //TODO: check user with session
    let { email, auth, auth_method } = req.body;

    let user = await User.findOne({
        email:  new RegExp(email, 'i'),
        enabled: true
    });

    if (user != null && user.enabled === true) {
        if (user.auth === auth) {
            req.session._id = user._id;
            res.json({ok: true, status: "login", "session": req.sessionID, user: user});
        } else if (user.auth === undefined || user.auth === "" || user.auth.length === 32) {
            let date = new Date().getTime();
            user.auth = auth;
            user.auth_method = auth_method;
            user.updated = date;
            await user.save();
            req.session._id = user._id;
            res.json({ok: true, status: "login", "session": req.sessionID, user: user});
        } else {
            setTimeout(() => {
                res.json({ ok: false, status: "incorrect" });
            }, 3000);
        }
    } else
    if (user != null && user.enabled === false) {
        setTimeout(() => {
            res.json({ ok: false, status: "disabled" });
        }, 3000);
    } else {
        let date = new Date().getTime();
        user = new User({
            email,
            password: "",
            auth,
            auth_method,
            enabled: true,
            date: date,
            updated: date
        });
        await user.save();
        req.session._id = user._id;
        res.json({ok: true, status: "login", "session": req.sessionID, user: user});
    }
});

module.exports =  router;
