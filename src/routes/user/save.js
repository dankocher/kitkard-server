const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Session = require("../../models/Session");

router.post("/", async(req, res) => {
    const {user} = req.body;
    let __user = await User.findById(req.session._id);

    if (__user !== null) {
        __user = {
            ...__user,
            ...user
        };
        await __user.save();
        res.json({ok: true, user: __user});
    } else {
        res.json({ok: false, status: "incorrect"})
    }

});

module.exports =  router;
