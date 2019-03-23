const checkAuth = require('../middleware/check-auth');
const cors = require('cors')

module.exports = function (app) {
    let campaing = require('../controllers/campaignController');

    // todoList Routes

    app.route('/campaigns')
        .get(cors(), campaing.list);

    app.route('/campaigns/:campaignId/')
        .get(cors(), campaing.findOne);

    app.route('/initial')
        .get(cors(), campaing.initial);
};