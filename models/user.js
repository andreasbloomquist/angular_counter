var mongoose = require("mongoose"),
  bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    index: {
      unique: true
    }
  },
  passwordDigest: {
    type: String,
    require: true
  }
})

// Function to confirm if the passwords match during signup
var confirm = function (password, passwordConf) {
  return password === passwordConf;
};  

// Function to create user account
userSchema.statics.createSecure = function (params, cb) {
  var isConfirmed;
  isConfirmed = confirm(params.password, params.password_conf);

  if (!isConfirmed) {
    return cb("Passwords Should Match", null);
  };
  var that = this;
  bcrypt.hash (params.password, 10, function (err, hash) {
    params.passwordDigest = hash;
    that.create(params, cb);
  });
};

// Function to log a user in. If the login fails, then a second callback function is called.
userSchema.statics.authenticate = function(params, cb, cb2) {
  this.findOne({
    email: params.email
  }, function (err, user) {
    if (user) {
    user.checkPassword(params.password, cb);
    } else if (user === null) {
      cb2();
    };
  });
};

// Function to check if a users password is correct
userSchema.methods.checkPassword = function (password, cb) {
  var user = this;
  bcrypt.compare(password,
    user.passwordDigest, function (err, isMatch){
      if (isMatch) {
        cb(null, user);
      } else {
        cb("Oops your password doesnt seem right", null);
      }
    });
};

var User = mongoose.model("User", userSchema);

module.exports = User;