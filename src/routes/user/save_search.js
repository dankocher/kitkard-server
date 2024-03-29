
const express = require('express');
const router = express.Router();

const User = require("../../models/User");
// const removeByKey = require("../../utils/removeByKey");


router.post("/", async(req, res) => {
    const { search, search_updated } = req.body;


    const user = await User.findById(req.session._id);

    if (user !== null) {
        // let search = user.search || [];
        // search = await removeByKey(search, {key: "cardname", value: cardname});
        // search.unshift({cardname, date: search_updated});
        if (user.search_updated > search_updated) {
            res.json({
                ok: false,
                status: "new",
                search: user.search,
                search_updated: user.search_updated
            });
        } else if (user.search_updated < search_updated) {
            user.search = search;
            user.search_updated = search_updated;
            await user.save();
            res.json({ok: true});
        } else{
            res.json({ok: true})
        }


    } else {
        res.json({ok: false, status: "incorrect"})
    }
});



module.exports =  router;
