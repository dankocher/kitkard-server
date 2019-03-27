const express = require('express');
const router = express.Router();

const User = require("../../models/User");
const Card = require("../../models/Card");
const Notification = require("../../models/Notification");

router.post("/", async (req, res) => {

    const {ids} = req.body;

    console.log(ids);
    const user = await User.findById(req.session._id);

    if (user !== null) {
        const date = new Date().getTime();

        const notifs = await Notification.find({_id: {$in: ids}, cardname: {$in: user.cards}});
        if (notifs !== undefined && notifs !== null && notifs.length === ids.length) {

            await Notification.updateMany(
                {
                    _id: {$in: ids},
                    cardname: {$in: user.cards}
                },
                {
                    viewed: true,
                    updated: date,
                }
            );

            await Card.updateMany(
                {
                    cardname: {$in: user.cards}
                },
                {
                    notifications_updated: date
                }
            );
            res.json({ok: true, ids, updated: date});
        } else {
            res.json({ok: false, error: "not_found"})
        }

    } else {
        res.json({ok: false});
    }
});

module.exports =  router;