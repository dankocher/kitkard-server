const express = require('express');
const router = express.Router();

const User = require("../models/User");
const Card = require("../models/Card");
const Friend = require("../models/Friend");
const Notification = require("../models/Notification");
const Session = require("../models/Session");

const {isCardholder, isMyCard} = require("../helphers/cardholder");

//UPDATE
router.put('/', async (req, res) => {
    const {from_cardname, cardname, shared_cardname} = req.body;

    let user = await User.findById(req.session._id);

    const shared_card = await Card.findOne({cardname: shared_cardname});

    if (await isMyCard(user, from_cardname) && await isCardholder(user, cardname) && shared_card !== null) {
        const date = new Date().getTime();

        const card = await Card.findOne({cardname: cardname});

        let notification = new Notification({
            type: "shared_card",
            cardname: cardname,
            from_cardname: from_cardname,
            shared_cardname: shared_cardname,
            viewed: false,
            date: date,
            updated: date,
        });
        await notification.save();

        card.notifications_updated = date;
        await card.save();

        res.json({ok: true, updated: date});
    } else {
        res.json({ok: false});
    }
});

module.exports =  router;
