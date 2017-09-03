var express = require("express");
var router  = express.Router({mergeParams: true});
var Teacher = require("../models/teacher");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find teacher by id
    console.log(req.params.id);
    Teacher.findById(req.params.id, function(err, teacher){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {teacher: teacher});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn, middleware.isAdmin, function(req, res){
   //lookup teacher using ID
   Teacher.findById(req.params.id, function(err, teacher){
       if(err){
           console.log(err);
           res.redirect("/teachers");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
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
               req.flash('success', 'Created a comment!');
               res.redirect('/teachers/' + teacher._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    // findteacher by id
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {teacher_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", middleware.isAdmin, function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/teachers/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId", middleware.checkUserComment, middleware.isAdmin, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
            Teacher.findByIdAndUpdate(req.params.id, {
              $pull: {
                comments: comment.id
              }
            }, function(err) {
              if(err){ 
                console.log(err)
              } else {
                req.flash('error', 'Comment deleted!');
                res.redirect("/teachers/" + req.params.id);
              }
            });
        }
    });
});

module.exports = router;