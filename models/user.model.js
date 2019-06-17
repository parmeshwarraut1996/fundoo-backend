var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
var key=require('../config/config')
var nodeMailer=require('../authorization/nodeMailer')
var validateEmail = function(email) {
  var emailRegex = /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/;
  return emailRegex.test(email);
};

var userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"]
  },

  lastName: {
    type: String,
    required: [true, "Last name is required"]
  },
  email: {
    type: String,
    required: [true, "Email id is required"],
    validate: [validateEmail, "Please enter valid email address"],
    index: { unique: true, dropDups: true }
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  }
},{timestamps:true});
var user = mongoose.model("user", userSchema);

function usermodel() {
  
}

function hash(password, callback) {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      // Store hash in your password DB.
      if (err) {
        callback(err);
      } else {
        callback(null, hash);
      }
    });
  });
}
usermodel.prototype.signUp = (req, callback) => {
  var registeredUser = user.findOne({
    email: req.body.email
  });

  try {
    if (registeredUser) {
      hash(req.body.password, (errorHash, resulthash) => {
        if (errorHash) {
          callback(errorHash);
        } else {
            console.log("password   ===>" + resulthash);
          var newUser = new user({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: resulthash
          });
          
          newUser.save((error, result) => {
            if (error) {
              console.log("Error in user model ");
              return callback(error);
            } else {
              console.log("SuccessFully data save" + result);
              return callback(null, result);
            }
          });
        }
      });
    } else {
      var response = {
        error: true,
        message: "Email already exists ",
        errorCode: 500
      };
      return callback(response);
    }
  } catch (error) {
    return callback(error);
  }
};

usermodel.prototype.login=(body,callback)=>{
    console.log("email in user body model===>"+body);

    user.find({'email':body.email},(err,data)=>{
               
        if(err){
            return callback(err)
        }
        else if(data.length>0){
            bcrypt.compare(body.password,data[0].password,function(err,res){
                if(err){
                        console.log("err in model"+err);
                        
                    return callback(err);
                }
                else if(res){
                    console.log("data in usermdels==>"+data);
                    
                    return callback(null,data)
                }
            })

        }
        else{
            return callback("invalid user")
        }

    })

}

usermodel.prototype.forgetPassword=(req,callback)=>{
  user.find({'email':req.body.email},(err,data)=>{
    if(err){
      return callback(err);
    }
    else if(data.length>0){
      console.log("in models"+req.body.email);
      
      var token=jwt.sign({email:req.body.email,id:data[0].id},key.API_KEY,{expiresIn:5500077});
      token="http://localhost:3000/reset/"+token;
      nodeMailer.sendMail(req.body.email,token);

      return callback(null,req.body.email);
    }
    else{
      return callback("email not exist")
    }

  })

}

usermodel.prototype.resetPassword=(req,callback)=>{
        user.update({id:req.tokenData.id},{$set:{password:req.body.password}},function (err,result){
          if(err){
            return callback(err)
          }
          else{
            return callback(null,"password updated")
          }
        })
}
module.exports = new usermodel();
