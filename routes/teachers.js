var express = require("express");
var router  = express.Router();
var Teacher = require("../models/teacher");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require('geocoder');
var { isLoggedIn, checkUserTeacher, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all teachers
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all teachers from DB
      Teacher.find({name: regex}, function(err, allTeachers){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allTeachers);
         }
      });
  } else {
      // Get all teachers from DB
      Teacher.find({}, function(err, allTeachers){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allTeachers);
            } else {
              res.render("teachers/index",{teachers: allTeachers, page: 'teachers'});
            }
         }
      });
  }
});

//CREATE - add new teacher to DB
router.post("/", isLoggedIn, isSafe, function(req, res){
  // get data from form and add to teacher array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
//   var cost = req.body.cost;
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    // var newTeacher = {name: name, image: image, description: desc, cost: cost, author:author, location: location, lat: lat, lng: lng};
    var newTeacher = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new teacher and save to DB
    Teacher.create(newTeacher, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to teachers page
            console.log(newlyCreated);
            res.redirect("/teachers");
        }
    });
  });
});

//NEW - show form to create new teacher
router.get("/new", isLoggedIn, function(req, res){
   res.render("teachers/new"); 
});

// SHOW - shows more info about one teacher
router.get("/:id", function(req, res){
    //find the teacher with provided ID
    Teacher.findById(req.params.id).populate("comments").exec(function(err, foundTeacher){
        if(err || foundTeacher == undefined){
            console.log(err);
            req.flash('error', 'Sorry, that teacher does not exist!');
            return res.redirect('/teachers');
        }
        console.log(foundTeacher)
        //render show template with that teacher
        res.render("teachers/show", {teacher: foundTeacher});
    });
});

// EDIT - shows edit form for a teacher
router.get("/:id/edit", checkUserTeacher, function(req, res){
    //find the teacher with provided ID
    Teacher.findById(req.params.id, function(err, foundTeacher){
      if(err || foundTeacher == undefined){
          console.log(err);
          req.flash('error', 'Sorry, that teacher does not exist!');
          return res.redirect('/teachers');
      }
      //render edit template with that teacher
      res.render("teachers/edit", {teacher: foundTeacher});
    });
});

// PUT - updates teacherin the database
router.put("/:id", isSafe, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    // var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, location: location, lat: lat, lng: lng};
    Teacher.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, teacher){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/teachers/" + teacher._id);
        }
    });
  });
});

// DELETE - removes teacher and its comments from the database
router.delete("/:id", function(req, res) {
    Teacher.findByIdAndRemove(req.params.id, function(err, teacher) {
    Comment.remove({
      _id: {
        $in: teacher.comments
      }
    }, function(err, comments) {
      req.flash('error', teacher.name + ' deleted!');
      res.redirect('/teachers');
    })
  });
});

module.exports = router;

