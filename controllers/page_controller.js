var models = require('../models/base');

module.exports = {
    index: (req, res) => {
        res.render('public/index.html', {});
    }
};
