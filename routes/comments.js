var express = require("express");
var router  = express.Router({mergeParams: true});
var Teacher = require("../models/teacher");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find teacher by id
    console.log(req.params.id);
    Teacher.findById(req.params.id, function(err, teacher){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {
                teacher: teacher
            });
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup teacher using ID
   Teacher.findById(req.params.id, function(err, teacher){
       if(err){
           req.flash('error', JSON.stringify(err));
           res.redirect("/teachers");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               teacher.comments.push(comment);
               teacher.save();
               console.log(comment);
               req.flash("success", "You've successfully added a comment");
               res.redirect('/teachers/' + teacher._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {
            teacher_id: req.params.id, 
            comment: foundComment
        });
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
        req.flash("success", "Your comment has been updated");
          res.redirect("/teachers/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Your comment has been deleted");
           res.redirect("/teachers/" + req.params.id);
       }
    });
});

module.exports = router;