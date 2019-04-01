const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Card = require("../../models/Card");
const Notification = require("../../models/Notification");
const Session = require("../../models/Session");

const filterCard = require("../../helphers/filterCard");
const {isMyCard, isCardholder, isRequested, isPrivateEnabled, isKeeper} = require("../../helphers/cardholder");

const N = {
    requested_card: "requested_card",
    added_card: "added_card",
};
// GET ALL NOTIFICATIONS
router.get("/", async (req, res) => {
    const __user = await User.findById(req.session._id);
    if (__user !== null) {
        let notifications = await Notification.find({cardname: {$in: __user.cards}});
        res.json({ok: true, notifications: notifications})
    } else {
        res.json({ok: false});
    }
});


module.exports =  router;