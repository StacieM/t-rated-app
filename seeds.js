
var mongoose = require("mongoose");
var Teacher = require("./models/teacher");
var Comment = require("./models/comment");

var data = [
    {
        name: "Joe Teacher",
        image: "http://hotemoji.com/images/emoji/0/1nhll4o1aczf50.png",
        description: "yadda yadda yadda"
    },
    {
        name: "Jim Teacher",
        image: "http://hotemoji.com/images/emoji/0/1nhll4o1aczf50.png",
        description: "yadda yadda yadda"
    },
    {
        name: "Jed Teacher",
        image: "http://hotemoji.com/images/emoji/0/1nhll4o1aczf50.png",
        description: "yadda yadda yadda"
    }
]

function seedDB(){
    // remove all teachers
    Teacher.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed teacher");
        // add some teachers
        data.forEach(function(seed){
            Teacher.create(seed, function(err, teacher){
                if(err){
                console.log(err)
                } else {
                    console.log("added a teacher");
                    // add a comment
                    Comment.create(
                        {
                            text: "this teacher is great",
                            author: "Homer"
                        },  function(err, comment){
                            if(err){
                                console.log(err);
                            }  else {
                            teacher.comments.push(comment);
                            teacher.save();
                            console.log("created new comment")
                            }
                        });
                    }
                
                
        });
    });
    });
}
    


module.exports = seedDB;
