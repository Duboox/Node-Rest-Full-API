const checkAuth = require("../middleware/check-auth");
const cors = require("cors");

module.exports = function(app) {
  var sponsor = require("../controllers/sponsorController");

  app.route("/sponsors").get(cors(), sponsor.list);
};
