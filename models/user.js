var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username:String,
	password:String,
	// isAdmin: {type: Boolean, default: false}// changes by ian
});

userSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model("User",userSchema);