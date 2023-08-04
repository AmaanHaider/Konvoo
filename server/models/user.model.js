const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,minLength:6,required:true},
    profilePic:{type:String,default:""},
    followers:{type:[String],default:[]},
    following:{type:[String],default:[]},
    bio:{type:String,default:""}
},
{
    timestamps:true,
});

module.exports = mongoose.model("User", userSchema);
