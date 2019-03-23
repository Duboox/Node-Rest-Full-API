const checkAuth = require("../middleware/check-auth");
const cors = require("cors");

module.exports = function (app) {
  var user = require("../controllers/userController");

  //app.route("/users").get(cors(), checkAuth, user.list_all);
  app.route("/user").get(cors(), user.getUser);

  app.route("/users").get(cors(), checkAuth, user.list_all);

  app.route("/singup").post(user.singUP);

  app.route("/login").post(cors(), user.login);

  app.route("/challenges").post(cors(), user.challenges);

  /*app.route('/tasks/:taskId')
        .get(todoList.read_a_task)
        .put(todoList.update_a_task)
        .delete(todoList.delete_a_task);*/
};
