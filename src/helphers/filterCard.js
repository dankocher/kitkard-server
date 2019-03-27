const {isCardholder, isPrivateEnabled, isKeeper, isMyCard} = require("../helphers/cardholder");

const filterCard = async (user, card, isSearch) => {
    if (card == null) {
        return({status: "incorrect"})
    }
    else // User Card
    if (user != null && user.cards !== undefined && await isMyCard(user, card.cardname))
    {
        return isSearch ? ({status: "incorrect"}) : ({status: "cards", card: card});
    }
    else // Cardholder
    if (user != null && await isCardholder(user, card.cardname))
    {
        let contacts = isSearch ? undefined :
            (await isPrivateEnabled(user, card.cardname) ? await filterPrivateContacts(card.contacts) : card.contacts);

        return({status: "cardholder", card: {
                cardname: card.cardname,
                name: card.name,
                description: card.description,
                pictures: card.pictures,
                updated: card.updated,
                is_private: card.is_private,
                contacts: contacts,
            }});
    }
    else // Keeper
    if (user != null && (await isKeeper(user, card.cardname) && !card.is_private))
    {
        let contacts = isSearch ? undefined : await filterPrivateContacts(card.contacts);

        return({status: "keepers", card: {
                cardname: card.cardname,
                name: card.name,
                description: card.description,
                pictures: card.pictures,
                updated: card.updated,
                is_private: card.is_private,
                contacts: contacts,
            }});
    }
    else // Private
    if (card.is_private) {
        return({status: "private", card: {
                cardname: card.cardname,
                is_private: card.is_private,
                updated: card.updated
            }});
    }
    else // Public
    {
        let contacts = isSearch ? undefined : await filterPrivateContacts(card.contacts);

        return({status: "public", card: {
                cardname: card.cardname,
                name: card.name,
                description: card.description,
                pictures: card.pictures,
                updated: card.updated,
                is_private: card.is_private,
                contacts: contacts,
            }});
    }
};

const filterPrivateContacts = async (contacts) => {
    const p_contacts = {byId: {}, ids: []};
    if (contacts !== undefined && contacts.ids !== undefined && contacts.ids.length > 0) {
        for (const id of contacts.ids) {
            const contact = contacts.byId[id];
            if (!contact.is_private) {
                p_contacts.byId[id] = contact;
                await p_contacts.ids.push(id);
            }
        }
    }
    return p_contacts;
};

module.exports = filterCard;