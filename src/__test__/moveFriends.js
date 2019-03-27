const Card = require("../models/Card");
const Friend = require("../models/Friend");

const saveFriend = async (cardholder, cardname) => {

    for (const f in cardholder) {
        let __friend = await Friend.findOne({cardname: cardname, friend_cardname: f});

        if (__friend === null) {
            let cf = cardholder[f];
            let friend = new Friend({
                cardname: cardname,
                friend_cardname: f,
                enabled: cf.enabled,
                deleted: !cf.enabled,
                private_enabled: cf.private_enabled,
                updated: cf.updated || cf.date,
                date: cf.date,
            });
            await friend.save();
        }
    }
};

const start = async () => {
    let cards = await Card.find({$and: [{cardholder: {$exists: true}, keepers: {$exists: true}}]});
    for (const card of cards) {
        if (card.cardholder !== undefined && card.cardholder !== null) {
            await saveFriend(card.cardholder, card.cardname);
        }
        card.cardholder = undefined;
        card.keepers = undefined;
        await card.save();
        console.log(card.cardname)
    }
};

start();
