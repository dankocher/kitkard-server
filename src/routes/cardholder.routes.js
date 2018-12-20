const express = require('express');
const router = express.Router();

const User = require("../models/user");
const Card = require("../models/card");
const Session = require("../models/Session");

const filterCard = require("../helphers/filterCard");
const {isCardholder, isRequested, isPrivateEnabled, isKeeper} = require("../helphers/cardholder");

const N = {
    requested_card: "request_card",
    added_card: "added_card",
};

// ADD CARD TO CARDHOLDER
router.post("/add/", async (req, res) => {
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
        console.log("incorrect");
        res.json({'status': 'incorrect'});
    }
    else if(await isCardholder(__user, friend)) {
        console.log("added");
        res.json({status: "added"});
    }
    else if(await isRequested(__user, friend)) {
        console.log("requested");
        res.json({status: "requested"});
    }
    else  {
        if (c_card.cardholder === undefined) c_card.cardholder = {};
        if (f_card.keepers === undefined) f_card.keepers = {};
        if (f_card.notifications === undefined) f_card.notifications = [];

        const date = new Date().getTime();
        console.log(c_card.cardholder);
        c_card.cardholder[friend] = {
            private_enabled: false,
            enabled: !f_card.is_private,
            date: date,
        };
        //add to keepers f_card
        f_card.keepers[cardholder] = {
            private_enabled: false,
            enabled: !f_card.is_private,
            date: date,
        };
        //add notification to f_card
        f_card.notifications.unshift({
            type: f_card.is_private ? N.requested_card : N.added_card,
            from_cardname: cardholder,
            viewed: false,
            date: date,
        });

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

        console.log("add:", f_card.is_private ? "requested" : "added");
        res.json({status: f_card.is_private ? "requested" : "added"});
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