const configs = require("./api/app.config");

const fs = require("fs"),
  https = require("https"),
  express = require("express"),
  app = express(),
  // port = 443,
  port = process.env.PORT || 3000,
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  Rollbar = require("rollbar"),
  rollbar = new Rollbar(configs.rolbar.post_server_item),
  cors = require("cors"),

  User = require("./api/models/userModel"),
  Campaign = require("./api/models/campaignModel"),
  Organization = require("./api/models/organizationModel");

/*Adding Routes */
let userRoutes = require("./api/routes/userRoutes"),
  campaignRoutes = require("./api/routes/campaignRoutes"),
  sponsorRoutes = require("./api/routes/sponsorRoutes"),
  organizationRoutes = require("./api/routes/organizationRoutes");

// mongoose instance connection url connection
mongoose.Promise = global.Promise;

app.use(function (req, res, next) {
  var connection_options = { auto_reconnect: true };
  mongoose.connect(
    configs.database.url + configs.database.name,
    { useNewUrlParser: true },
    function (err, db) {
      if (err) {
        res.status(500).json({
          error: err
        });
        return next(err);
      }
      req.db = db;
      next();
    }
  );
});

app.use(rollbar.errorHandler());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*Importing Routes */
userRoutes(app); //register the route
campaignRoutes(app); //register the route
sponsorRoutes(app); //register the route
organizationRoutes(app); //register the route


app.listen(port);

/*Defaul 404*/
app.use(cors(), function (req, res, next) {
  res.status(404);
  res.send({ error: "Url Not found" });
  return;
});

console.log("RESTful API server started on: " + port);
