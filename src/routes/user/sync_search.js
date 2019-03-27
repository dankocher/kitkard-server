
const express = require('express');
const router = express.Router();

const User = require("../../models/User");
// const removeByKey = require("../../utils/removeByKey");


router.get("/:search_updated", async(req, res) => {
    let { search_updated } = req.params;

    if (search_updated === undefined || search_updated === "undefined") {
        search_updated = 0;
    }


    const user = await User.findById(req.session._id);

    if (user !== null) {
        if (user.search_updated > search_updated) {
            res.json({
                ok: true,
                status: "new",
                search: user.search,
                search_updated: user.search_updated
            });
        } else if (user.search_updated < search_updated) {
            res.json({ok: true, status: 'old'})
        } else{
            res.json({ok: true})
        }
    } else {
        res.json({ok: false, status: "incorrect"})
    }
});



module.exports =  router;
