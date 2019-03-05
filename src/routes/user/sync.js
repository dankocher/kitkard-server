const express = require('express');
const router = express.Router();

const User = require("../../models/user");

router.get("/sync/", async(req, res) => {
    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

    console.log(req.session)


    if (__user !== null) {
        res.json({status: "updated", updated: __user.updated || __user.date});
    } else {
        res.json({status: "incorrect"})
    }
});


module.exports =  router;
