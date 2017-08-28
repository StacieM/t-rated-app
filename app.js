var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var  flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Teacher = require("./models/teacher");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var keys = require("./middleware/keys");

//requiring routes
var commentRoutes    = require("./routes/comments"),
teacherRoutes = require("./routes/teachers"),
indexRoutes      = require("./routes/index")

var url = process.env.DATABASEURL || keys.mongoURI;
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "yadda yadda yadda",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });
 
 app.use("/", indexRoutes);
 app.use("/teachers", teacherRoutes);
 app.use("/teachers/:id/comments", commentRoutes);


 app.listen(process.env.PORT || 27017, process.env.IP, function(){
    console.log("The T-Rated Server Has Started!");
});