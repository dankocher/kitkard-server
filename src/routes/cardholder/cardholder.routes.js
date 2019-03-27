const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Card = require("../../models/Card");
const Friend = require("../../models/Friend");
const Notification = require("../../models/Notification");

const filterCard = require("../../helphers/filterCard");
const {isCardholder, isRequested} = require("../../helphers/cardholder");

const N = {
    requested_card: "requested_card",
    added_card: "added_card",
};

// ADD CARD TO CARDHOLDER
router.put("/add/", async (req, res) => {
    const { friend, cardholder } = req.body;

    const __user = await User.findById(req.session._id);
    const f_card = await Card.findOne({cardname: friend});
    const c_card = await Card.findOne({cardname: cardholder});


    if( __user == null || c_card == null || f_card == null
        || __user.cards.find(c => c === cardholder) === undefined
        || __user.cards.find(c => c === friend) !== undefined) {
        res.json({ok:false, status: 'incorrect'});
    }
    else if(await isCardholder(__user, friend)) {
        console.log("added");
        res.json({ok:true, status: "added"});
    }
    else if(await isRequested(__user, friend)) {
        console.log("requested");
        res.json({ok: true, status: "requested"});
    }
    else  {
        if (c_card.cardholder === undefined) c_card.cardholder = {};
        if (f_card.keepers === undefined) f_card.keepers = {};
        if (f_card.notifications === undefined) f_card.notifications = [];

        const date = new Date().getTime();

        let newFriend = new Friend({
            cardname: cardholder,
            friend_cardname: friend,
            enabled: !f_card.is_private,
            private_enabled: false,
            updated: date,
            date: date
        });
        await newFriend.save();

        c_card.friends_updated = date;
        await c_card.save();

        let notification = new Notification({
            type: f_card.is_private ? N.requested_card : N.added_card,
            cardname: friend,
            from_cardname: cardholder,
            viewed: false,
            updated: date,
            date: date
        });
        await notification.save();

        f_card.notifications_updated = date;
        await f_card.save();

        console.log("add:", f_card.is_private ? "requested" : "added");
        res.json({ok: true, status: f_card.is_private ? "requested" : "added"});
    }
});

// REMOVE CARD FROM CARDHOLDER
router.post("/remove/", async (req, res) => {
    const { friend, cardholder } = req.body;

    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });
    const f_card = await Card.findOne({"cardname": friend});
    const c_card = await Card.findOne({"cardname": cardholder});

    if( __user == null || c_card == null || f_card == null
        || __user.cards.find(c => c === cardholder) === undefined
        || __user.cards.find(c => c === friend) !== undefined) {
        res.json({'status': 'incorrect'});
    } else {
        if (c_card.cardholder === undefined) c_card.cardholder = {};
        if (f_card.keepers === undefined) f_card.keepers = {};
        if (f_card.notifications === undefined) f_card.notifications = [];

        const date = new Date().getTime();
        if (c_card.cardholder[friend] !== undefined) {
            if (c_card.cardholder[friend].enabled === false) {
                const index = f_card.notifications.findIndex(n => {
                    return (n.type === N.requested_card &&
                        n.from_cardname === cardholder &&
                        n.date === c_card.cardholder[friend].date)
                });
                console.log(index);
                if (index >= 0) {
                    f_card.notifications.splice(index, 1);
                }
            }
            delete c_card.cardholder[friend];
            delete f_card.keepers[cardholder];

            await Card.updateOne({cardname: cardholder}, {
                cardholder: c_card.cardholder,
                c_updated: date
            });
            await Card.updateOne({cardname: friend}, {
                keepers: f_card.keepers,
                k_updated: date,
                notifications: f_card.notifications,
                n_updated: date,
            });
        }

        res.json({status: "deleted"});
    }
});

// REMOVE CARD FROM CARDHOLDER
router.get("/sync/:cardname", async (req, res) => {
    const { cardname } = req.params;

    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });
    const c_card = await Card.findOne({"cardname": cardname});

    const card = (await filterCard(__user, c_card)).card;

    if(card.c_updated !== undefined) {
        res.json({status: "c_updated", c_updated: card.c_updated || c.updated || c.date});
    } else {
        res.json({status: "incorrect"});
    }
});







module.exports =  router;