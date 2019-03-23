const checkAuth = require("../middleware/check-auth");
const cors = require("cors");

module.exports = function(app) {
  let organization = require("../controllers/organizationController");
  // todoList Routes
  app.route("/organizations").get(cors(), organization.list);
};
