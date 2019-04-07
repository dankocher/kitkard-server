const express = require('express');
const fs = require('fs');
const router = express.Router();

// REGISTRATION OR  LOGIN IF EXIST
router.get("/:doc/:lang", async (req, res) => {
    let {doc, lang} = req.params;
    if (lang === undefined) lang = "en";

    // res.json({ok: true});

    let path = __dirname + "/../../../documents/" + doc + "/" + lang + ".html";

    fs.readFile(path, 'utf8', function (err, content) {
        if (err) {
            res.json({ok: false, path});
        } else {
            res.json({ok: true, html: content});
        }
    });

});

module.exports =  router;
