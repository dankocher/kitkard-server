const crypto = require('crypto');

const generate_key = function() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};

module.exports = generate_key;