const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Friend = require("../../models/Friend");
const Card = require("../../models/Card");
const Notification = require("../../models/Notification");
const Session = require("../../models/Session");

const filterCard = require("../../helphers/filterCard");
const {isMyCard, isCardholder, isRequested, isPrivateEnabled, isKeeper} = require("../../helphers/cardholder");


// SAVE NOTIFICATION ACTION
router.post("/", async (req, res) => {
    const { n, action } = req.body;

    const user = await User.findById(req.session._id);

    if (isMyCard(user, n.cardname)) {
        const date = new Date().getTime();
        let friend = await Friend.findOne({
            cardname: n.from_cardname,
            friend_cardname: n.cardname,
        });

        friend.enabled = action === "accepted";
        friend.deleted = action === "rejected";
        friend.updated = date;
        await friend.save();

        let notification = await Notification.findById(n._id);
        notification.action = action;
        notification.updated = date;
        await notification.save();

        let friend_card = await Card.findOne({cardname: n.from_cardname});
        friend_card.friends_updated = date;
        await friend_card.save();

        let card = await Card.findOne({cardname: n.cardname});
        card.notifications_updated = date;
        card.friends_updated = date;
        await card.save();

        res.json({ok: true, notification: notification});
    } else {
        res.json({ok: false, status: "incorrect"});
    }
});

module.exports =  router;