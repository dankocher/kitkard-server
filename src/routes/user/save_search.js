const express = require('express');
const router = express.Router();

const User = require("../../models/user");


router.post("/save_search/", async(req, res) => {
    //TODO: Sync and save search!!!!!!!!!!
    const { card, updated } = req.body;

    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

    if (__user !== null) {
        if (__user.search === undefined) {
            __user.search = []
        }

        res.json({status: "updated", updated: __user.updated});
    } else {
        res.json({status: "incorrect"})
    }
});



module.exports =  router;
