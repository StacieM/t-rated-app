var mongoose = require("mongoose");
var Teacher = require("./models/teacher");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Joe Teacher", 
        image: "http://hotemoji.com/images/emoji/0/1nhll4o1aczf50.png",
        description: "Best Teacher Ever!"
    },
    {
        name: "Jim Teacher", 
        image: "http://hotemoji.com/images/emoji/0/1nhll4o1aczf50.png",
        description: "Great Instructor!"
    },
    {
        name: "Jack Teacher", 
        image: "http://hotemoji.com/images/emoji/0/1nhll4o1aczf50.png",
        description: "Lacked Enthusiasm for the Subject"
    }
]

function seedDB(){
   //Remove all teachers
   Teacher.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed teachers!");
         //add a few teachers
        data.forEach(function(seed){
            Teacher.create(seed, function(err, teacher){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a teacher");
                    //create a comment
                    Comment.create(
                        {
                            text: "this teacher and class are very interesting",
                            author: "Katie"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                teacher.comments.push(comment);
                                teacher.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
