const express = require('express');
const router = express.Router();

const Card = require("../../models/Card");
const User = require("../../models/User");

const filterCard = require("../../helphers/filterCard");

router.get("/:cardname", async (req, res) => {
    const { cardname } = req.params;

    const dbcard = await Card.findOne({ cardname });
    if (dbcard != null) {
        const __user = await User.findById(req.session._id);
        const f_card = await filterCard(__user, dbcard);

        res.json({ok: true, status: f_card.status, card: f_card.card});
    } else {
        res.json({ok: false});
    }
});

router.get("/sync/:cardname", async (req, res) => {
    const { cardname } = req.params;

    var dbcard = await Card.findOne({ cardname });
    if (dbcard !== null) {
        res.json({ok: true, status: "updated", updated: dbcard.updated || dbcard.date});
    } else {
        res.json({ok: false, status: "incorrect"})
    }
});

module.exports =  router;
