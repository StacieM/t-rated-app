var express = require("express");
var router  = express.Router();
var Teacher = require("../models/teacher");
var middleware = require("../middleware");


//INDEX - show all teachers
router.get("/", function(req, res){
    // Get all teachers from DB
    Teacher.find({}, function(err, allTeachers){
       if(err){
           console.log(err);
       } else {
          res.render("teachers/index",{teachers:allTeachers});
       }
    });
});

//CREATE - add new teacher to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to teachers array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newTeacher = {name: name, image: image, description: desc, author:author}
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

//NEW - show form to create new teacher
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("teachers/new"); 
});

// SHOW - shows more info about one teacher
router.get("/:id", function(req, res){
    //find the teacher with provided ID
    Teacher.findById(req.params.id).populate("comments").exec(function(err, foundTeacher){
        if(err){
            console.log(err);
        } else {
            console.log(foundTeacher)
            //render show template with that teacher
            res.render("teachers/show", {teacher: foundTeacher});
        }
    });
});

// EDIT teacher ROUTE
router.get("/:id/edit", middleware.checkTeacherOwnership, function(req, res){
    Teacher.findById(req.params.id, function(err, foundTeacher){
        res.render("teachers/edit", {teacher: foundTeacher});
    });
});

// UPDATE teacher ROUTE
router.put("/:id",middleware.checkTeacherOwnership, function(req, res){
    // find and update the correct teacher
    Teacher.findByIdAndUpdate(req.params.id, req.body.teacher, function(err, updatedTeacher){
       if(err){
           res.redirect("/teachers");
       } else {
           //redirect somewhere(show page)
           res.redirect("/teachers/" + req.params.id);
       }
    });
});

// DESTROY teacher ROUTE
router.delete("/:id",middleware.checkTeacherOwnership, function(req, res){
    Teacher.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/teachers");
      } else {
          res.redirect("/teachers");
      }
   });
});


module.exports = router;

