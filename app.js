 // npm i body-parser connect-flash ejs express express-session method-override mongoose passport passport-local passport-local-mongoose

//sugestion for later , remove the sign up button and make logn ids for student yourselves so that only students can access notes

	var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
	mongoose      = require("mongoose"),
	passport      = require("passport"),
	flash         = require("connect-flash"),
	LocalStrategy = require("passport-local"),
	methodOverride= require("method-override"),
	//Campground    = require("./models/campground"),
	//Comment       = require("./models/comment"),
	User          = require("./models/user");



//requiring routes
 //commentRoutes    = require("./routes/comments"),
 var exploreRoutes    = require("./routes/explore"),
	 indexRoutes      = require("./routes/index"),
	 notesRoutes      = require("./routes/notes");

var url = process.env.DATABASEURL ||  "mongodb://localhost/artutorials"
mongoose.connect(url,{
	useNewUrlParser:true,
	useCreateIndex:true
});

// mongoose.connect("mongodb://localhost/artutorials",{
// 	useNewUrlParser:true,
// 	useCreateIndex:true
// });




//mongoose updates - removes errors
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


//FLASH CONFIGURATION
app.use(require("express-session")({
	secret:"rusty is the best dog in the world",
	resave: false,
	saveUninitialized:false
}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(flash());



//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"rusty is the best dog in the world",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());//decode the password 

// this'll call this functn on every route
app.use(function(req,res,next){
	res.locals.currentUser = req.user;//req.user will either contain da user or not
	res.locals.error       = req.flash("error");
	res.locals.success     = req.flash("success");
	
	next(); // as it is a middleware on every route.
	// all it does is ,that is passes req.user as variable currentUser on every route
});


//app.use(commentRoutes);
app.use(exploreRoutes);
app.use(indexRoutes);
app.use(notesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`A.R. tutorials server is listening now on ${ PORT }`);
});

// app.listen(3000,function(){
// 	console.log("A.R. tutorials server is listening now.")
// })