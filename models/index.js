var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/app-counter");

module.exports.User = require("./user");