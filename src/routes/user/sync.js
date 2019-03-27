const express = require('express');
const router = express.Router();

const User = require("../../models/User");

router.get("/:updated", async(req, res) => {
    const {updated} = req.params;
    const __user = await User.findById(req.session._id);

    if (__user !== null) {
        if (updated < __user.updated) {
            res.json({ok: true, status: "new", user: __user});
        } else if (updated > __user.updated) {
            res.json({ok: true, status: "old"});
        } else {
            res.json({ok: true})
        }
    } else {
        res.json({ok: false, status: "incorrect"})
    }
});


module.exports =  router;
