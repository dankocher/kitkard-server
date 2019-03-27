const Card = require("../models/Card");
const Friend = require("../models/Friend");

const isMyCard = async (user, cardname) => {
    return await user.cards.includes(cardname);
};

const isCardholder = async (user, cardname) => {
    if (user !== null && cardname !== undefined) {
        const friend = await Friend.findOne({ $and: [
                {cardname: {$in: user.cards}},
                {friend_cardname: cardname},
                {enabled: true},
            ]
        });
        return friend != null && friend.deleted !== true;
    } else {
        return false;
    }
};

const isRequested = async (user, cardname) => {
    if (user !== null && cardname !== undefined) {
        const friend = await Friend.findOne({ $and: [
                {friend_cardname: {$in: user.cards}},
                {cardname: cardname},
                {enabled: false}
            ]
        });
        return friend != null && friend.deleted !== true;
    } else {
        return false;
    }
};

const isKeeper = async (user, cardname) => {
    if (user !== null && cardname !== undefined) {
        const friend = await Friend.findOne({ $and: [
                {friend_cardname: {$in: user.cards}},
                {cardname: cardname},
                {enabled: true}
            ]
        });
        return friend != null && friend.deleted !== true;
    } else {
        return false;
    }
};

const isPrivateEnabled = async (user, cardname) => {
    if (user !== null && cardname !== undefined) {
        const friend = await Friend.findOne({ $and: [
                {cardname: {$in: user.cards}},
                {friend_cardname: cardname},
                {enabled: true},
                {private_enabled: true}
            ]
        });
        return friend != null;
    } else {
        return false;
    }
};

module.exports = {isMyCard, isCardholder, isRequested, isKeeper, isPrivateEnabled};
// router.exports.isCardholder = isCardholder;
// router.exports.isKeeper = isKeeper;
// router.exports.isPrivateEnabled = isPrivateEnabled;