const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Card = require("../../models/Card");
const Friend = require("../../models/Friend");
const Session = require("../../models/Session");


// GET ALL NOTIFICATIONS
router.get("/", async (req, res) => {
    const __user = await User.findById(req.session._id);
    if (__user !== null) {
        let friends = await Friend.find({$or: [
                {cardname: {$in: __user.cards}},
                {friend_cardname: {$in: __user.cards}},
            ]});
        res.json({ok: true, friends: friends})
    } else {
        res.json({ok: false});
    }
});

module.exports =  router;