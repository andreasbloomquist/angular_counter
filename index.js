var express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  bcrypt = require("bcrypt"),
  session = require("express-session"),
  db = require("./models");


var views = path.join(__dirname, "views");

app = express();
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

var loginHelpers = function (req, res, next) {
  req.login = function (user) {
    req.session.userId = user._id;
    req.user = user;
    return user;
  };
  req.logout = function() {
    req.session.userId = null;
    req.user = null;
  };
  req.currentUser = function(cb) {
    var userId = req.session.userId;
    db.User.
      findOne({
        _id: userId
      }, cb);
  };
  next();
};

app.use(loginHelpers);

app.get("/", function (req, res){
  var homePath = path.join(views, "index.html");
  res.sendFile(homePath);
});

app.post("/users", function (req,res){
  var newUser = req.body.user;
  newUser.name = newUser.first_name.replace(/[</>]/gi, '');
    db.User.
    createSecure(newUser, function (err, user){
      if (user) {
        req.login(user);
      }
    });


})


app.listen(3000, function(){
  console.log("Running! GO CHECK LOCALHOST:3000");
});
