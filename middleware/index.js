var Campground= require("../models/campground");
var Comment= require("../models/comment");
var mongoose = require("mongoose");

var middlewareObj={};

middlewareObj.checkCampgroundOwnership=function(req,res,next){
	
	if(req.isAuthenticated()){ // meaning whether its logged in or not
		var id = mongoose.Types.ObjectId(req.params.id);
		Campground.findById(id,function(err,foundCampground){
			if(err || !foundCampground){
				req.flash("error","Campground not found");
				res.redirect("back");
			}else{
				//does user own tha campground
				if(foundCampground["author"]["id"].equals(req.user._id)){
				  next();
				} else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
				})
		
			}else{ // if hes not logged in
				req.flash("error","You need to be logged in to do that");
				res.redirect("back");
			}
}
	
middlewareObj.checkCommentOwnership = function(req,res,next){
	
	if(req.isAuthenticated()){ // meaning whether its logged in or not
		var id = mongoose.Types.ObjectId(req.params.comment_id);
		Comment.findById(id,function(err,foundComment){
			if(err || !foundComment){
				req.flash("error","Comment not found");
				res.redirect("back");
			}else{
				//does user own the comment
				if(foundComment["author"]["id"].equals(req.user._id)){
				  next();
				} else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
				})
		
			}else{ // if hes not logged in
				req.flash("error","You need to be logged in to do that");
				res.redirect("back");
			}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
	   return next();
	   }
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}


module.exports=middlewareObj;