const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Session = require("../../models/Session");

// REGISTRATION OR LOGIN IF EXIST
router.post("/", async (req, res) => {
    const { email, password, auth } = req.body;

    let user = await User.findOne({email: email});

    if (user !== null) {
        setTimeout(() => {
            res.json({ok: false, status: 'exist'});
        }, 3000);
    } else {
        let date = new Date().getTime();
        user = new User({
            email,
            password,
            auth,
            enabled: true,
            date: date,
            updated: date
        });
        await user.save();

        req.session.email = email;
        req.session.password = user.password;
        req.session._id = user._id;

        res.json({ok: true, status: "registered", "session": req.sessionID, user: user});
    }

});

module.exports =  router;
