const userService = require("../services/user.service");
var jwt = require("jsonwebtoken");
var express = require('express');
var key = require("../config/config");
var expressValidator=require('express-validator');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(expressValidator());
/**
    new user registration call from controller

    @param {} req
    @param {} res

*/

exports.signUp = function(req, res) {
  try {
    req.checkBody("firstName", "first name cannot empty").notEmpty();
    req.checkBody("lastName", "last name can not empty").notEmpty();
    req.checkBody("email", "email is not valid").isEmail();
    req.checkBody("email", "email cannot empty").notEmpty();
    req.checkBody("password", "password must be more than 8 characters").len(8);
    req.checkBody("email").normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    } else {
      userService.signUp(req, (err, data) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.status(200).send(data);
        }
      });
    }
  } catch (error) {
    res.send(error);
  }
};
exports.login = (req, res, next) => {
  console.log("in controller" + req.body.email);

  try {
    req.checkBody("email", "email is not valid").isEmail();
    req.checkBody("email", "email cannot empty").notEmpty();
    req.checkBody("password", "password cannot empty").notEmpty();
    req.sanitize("email").normalizeEmail({ remove_dots: false });
    console.log("in controllervdfsgfd====>  " + req.body.email);

    var errors = req.validationErrors();
    console.log("error" + errors);

    if (errors) {
      console.log("in error");

      return res.status(404).send(errors);
    } else {
      console.log("in success");

      userService.login(req.body, (err, data) => {
        if (err) {
          console.log("err in login===>" + err);

          return res.status(500).send(err);
        } else {
          var token = jwt.sign(
            { email: req.body.email, id: data[0].id },
            key.API_KEY,
            { expiresIn: 5500077 }
          );

          return res.status(200).send({
            data: data,
            message: "successfully login",
            token: token
          });
        }
      });
    }
  } catch (error) {
    res.send(error);
  }
};

exports.forgetPassword = (req, res) => {
  console.log("in controller");

  try {
    req.checkBody("email", "email can not empty").notEmpty();
    req.checkBody("email", "email is not valid").isEmail();
    req.sanitize("email").normalizeEmail({ remove_dots: false });
    console.log("in try");

    // check for validation errors
    var errors = req.validationErrors();
    console.log("errors" + errors);

    if (errors) {
      console.log("err" + errors);

      return res.status(400).send(errors);
    } else {
      console.log("in usercontroller success " + req.body.email);

      userService.forgetPassword(req, (err, data) => {
        console.log("in success" + err);

        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send({
            data: data,
            message: "Link sent on your mail address"
          });
        }
      });
    }
  } catch (error) {
    return res.send(error);
  }
};
exports.resetPassword = (req, res, next) => {
  console.log("error in controller" + errors);

  try {
    req.checkBody("password", "password can no empty").notEmpty();
    req.checkBody("password", "password must be more than 8 characters").len(8);

    var errors = req.validationErrors();
    console.log("error in controller" + errors);

    if (errors) {
      return res.status(400).send(errors);
    } else {
      userService.resetPassword(req, (err, data)=>{
          if(err)
          {
            return res.status(500).send(err)
          }
          else{
            return res.status(200).send({
              data:data,
              message:"password successfully updated"
            })
          }
      });
    }
  } catch (error) {
    return res.send(error);
  }
};

exports.reminderToken=(req,res)=>{
  console.log("in contrller====="+req.body.userId);
  
  req.checkBody("userId","user can not empty").notEmpty();

  var errors=req.validationErrors();

  if(errors){
    return res.status(400).send(errors);
  }
  else{
    userService.reminder(req,(err,data)=>{
      if(err){
        return res.status(500).send(err);
      }else{
        return res.status(200).send(data);
      }
    })
  }
}