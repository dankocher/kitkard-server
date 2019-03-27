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

// SAVE NOTIFICATION ACTION
router.post("/action/", async (req, res) => {
    const { cardname, notification} = req.body;

    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

    if (isMyCard(__user, cardname)) {
        //TODO: update keepers for me
        //TODO: update cardholder for friend

        await Card.updateMany({cardname: cardname,
                'notifications.from_cardname': notification.from_cardname,
                'notifications.type': notification.type
            },{
            $set: {
                'notifications.$[notif].action': notification.action,
                'notifications.$[notif].viewed': true,
            }
        },
        {
            arrayFilters: [  {
                "notif.from_cardname": notification.from_cardname,
                "notif.type": notification.type,
            } ],
            multi: true}
        );
        res.json({status: notification.action});
    } else {
        res.json({status: "incorrect"});
    }
});

module.exports =  router;