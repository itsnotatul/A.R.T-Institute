var express = require("express");
var router  = express.Router();
var passport= require("passport");
var User    = require("../models/user");
var mongoose = require("mongoose");


router.get("/",function(req,res){
	res.render("landing");
});

	
//==========================OATH GOOGLE =================================================
const { google } = require('googleapis');

const OAuth2Data = require('../google_key.json')



const CLIENT_ID = "704744508958-e819n34n88rna1enris6qqbo09fligfm.apps.googleusercontent.com";
const CLIENT_SECRET = "vK3N-nX94xP3uzQeSDrvyJTz";
const REDIRECT_URL = "http://localhost:3000/auth/google/callback";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;
router.get('/loginwithgoogle', (req, res) => {
    if (!authed) {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/gmail.readonly'
        });
        console.log(url)
        res.redirect(url);
    } else {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        gmail.users.labels.list({
            userId: 'me',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const labels = res.data.labels;
            if (labels.length) {
                console.log('Labels:');
                labels.forEach((label) => {
                    console.log(`- ${label.name}`);
                });
            } else {
                console.log('No labels found.');
            }
        });
        res.render("/explore");
    }
})

router.get('/auth/google/callback', function (req, res) {
    const code = req.query.code
    if (code) {
        // Get an access token based on our OAuth code
        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                oAuth2Client.setCredentials(tokens);
                authed = true;
				req.flash("success","Welcome to A.R.T Community "  );
                res.redirect('/explore')
            }
        });
    }
});

//AUTH ROUTE

//show register form
router.get("/register",function(req,res){
	res.render("register"); 
})

	//handle sign up logic
router.post("/register",function(req,res){
	var newUser = new User({username:req.body.username});
	
	User.register(newUser,req.body.password,function(err,user){
		if(err){	
			req.flash("error", err.message);
				return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to A.R.T Community " + user.username );
			res.redirect("/explore");
		})

}) });
	
//SHOW LOGIN FORM
router.get("/login",function(req,res){
	
	res.render("login");
})
	
//handling login logic
router.post("/login",passport.authenticate("local",{
	successRedirect: "/explore",
	failureRedirect: "/login"
}),function(req,res){});
	
//LOGOUT 
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/");
})



module.exports= router;
	
	
	