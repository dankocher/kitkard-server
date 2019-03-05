const express = require('express');
const router = express.Router();

const User = require("../models/user");
const Card = require("../models/card");
const Session = require("../models/Session");

const filterCard = require("../helphers/filterCard");
const {isMyCard, isCardholder, isRequested, isPrivateEnabled, isKeeper} = require("../helphers/cardholder");

const N = {
    requested_card: "request_card",
    added_card: "added_card",
};

// SET NOTIFICATION VIEWED
router.post("/viewed/", async (req, res) => {
    const { cardname, notification} = req.body;

    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

    if (isMyCard(__user, cardname)) {
        await Card.updateOne({cardname: cardname,
            'notifications.from_cardname': notification.from_cardname,
            'notifications.type': notification.type,
            'notifications.date': notification.date
        },{
            $set: {'notifications.$.viewed': true}
        });
        res.json({status: "viewed"});
    } else {
        res.json({status: "incorrect"});
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