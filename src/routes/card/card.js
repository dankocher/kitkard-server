const express = require('express');
const router = express.Router();

const Card = require("../../models/card");
const User = require("../../models/user");

const filterCard = require("../../helphers/filterCard");

router.get("/:cardname", async (req, res) => {
    const { cardname } = req.params;

    const __user = await User.findOne({
        email: req.session.__email,
        password: req.session.__password
    });

    const dbcard = await Card.findOne({ cardname });

    const f_card = await filterCard(__user, dbcard);

    res.json(f_card);
});

router.get("/sync/:cardname", async (req, res) => {
    const { cardname } = req.params;

    var dbcard = await Card.findOne({ cardname });
    if (dbcard !== null) {
        res.json({status: "updated", updated: dbcard.updated || dbcard.date});
    } else {
        res.json({status: "incorrect"})
    }
});

module.exports =  router;
