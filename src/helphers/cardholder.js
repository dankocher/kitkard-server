const Card = require("../models/card");

const isMyCard = async (user, cardname) => {
    return user.cards.findIndex(c => c === cardname) >= 0;
};

const isCardholder = async (user, cardname) => {
    for (const myCardname of user.cards) {
        const myCard = await Card.findOne({cardname: myCardname});
        if (myCard != null && myCard.cardholder !== undefined
            && myCard.cardholder[cardname] !== undefined) {
            console.log("---------------", myCard.cardholder[cardname].enabled);
            return myCard.cardholder[cardname].enabled
        }
    }
    return false
};

const isRequested = async (user, cardname) => {
    for (const myCardname of user.cards) {
        const myCard = await Card.findOne({cardname: myCardname});
        if (myCard != null && myCard.cardholder !== undefined
            && myCard.cardholder[cardname] !== undefined) {
            return !myCard.cardholder[cardname].enabled
        }
    }
    return false
};

const isKeeper = async (user, cardname) => {
    for (const myCardname of user.cards) {
        const myCard = await Card.findOne({cardname: myCardname});
        if (myCard != null && myCard.keepers !== undefined
            && myCard.keepers[cardname] !== undefined) {
            return myCard.cardholder[cardname].enabled
        }
    }
    return false
};

const isPrivateEnabled = async (user, cardname) => {
    for (const myCardname of user.cards) {
        const myCard = await Card.findOne({cardname: myCardname});
        if (myCard != null && myCard.cardholder !== undefined
            && myCard.cardholder[cardname] !== undefined) {
            return myCard.cardholder[cardname].private_enabled
        }
    }
    return false
};

module.exports = {isMyCard, isCardholder, isRequested, isKeeper, isPrivateEnabled};
// router.exports.isCardholder = isCardholder;
// router.exports.isKeeper = isKeeper;
// router.exports.isPrivateEnabled = isPrivateEnabled;