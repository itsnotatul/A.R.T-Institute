var express = require("express");
var router  = express.Router();
var passport= require("passport");
var User    = require("../models/user");
var mongoose = require("mongoose");
var middleware = require("../middleware");

router.get("/notes",middleware.isLoggedIn,function(req,res){
	res.render("notes");
});

module.exports= router;