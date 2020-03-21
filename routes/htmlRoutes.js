var db = require("../models");
var path = require("path");
module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  // Load game page
  app.get("/codenames/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/game.html"));
  });

  // Load example page and pass in an example by id
  // app.get("/codenames/", function(req, res) {
  //   db.gameWords.findAll({
  //     order: [Sequelize.literal("RAND()")],
  //     limit: 1
  //   })
  //   .then(function(resp) {
  //     callback(null, resp);
  //   });
  //  });
      

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });

  app.get('/game', function(req, res) {
    res.sendFile(path.join(__dirname, "../public/game2.html"));
  })

//   // Render 404 page for any unmatched routes
  // app.get("*", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../public/404.html"));
  // });
};
