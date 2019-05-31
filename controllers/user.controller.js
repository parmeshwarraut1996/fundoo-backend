const userService = require("../services/user.service");

/**
    new user registration call from controller

    @param {} req
    @param {} res

*/

exports.signUp = function(req, res, next) {

  try {
    req.assert("firstName", "first name cannot empty").notEmpty();
    req.assert("lastName", "last name can not empty").notEmpty();
    req.assert("email", "email is not valid").isEmail();
    req.assert("email", "email cannot empty").notEmpty();
    req.assert("password", "password must be more than 8 characters").len(8);
    req.sanitize("email").normalizeEmail({ remove_dots: false });

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
exports.login=(req,res,next)=>{
    console.log("in controller" + req.body.email);

    try{
        req.assert("email","email is not valid").isEmail();
        req.assert("email","email cannot empty").notEmpty();
        req.assert("password","password cannot empty").notEmpty();
        req.sanitize("email").normalizeEmail({remove_dots:false});
        console.log("in controllervdfsgfd====>  " + req.body.email);

        var errors=req.validationErrors();
        console.log("error" + errors);

        if(errors){
            console.log("in error");

            return res.status(404).send(errors);

        }
        else{
            console.log("in success",req.body);
            
            userService.login(req.body, (err, data) => {
                if (err) {
                    console.log("err in login===>"+err);
                    
                  return res.status(500).send(err);
                } else {
                    console.log("data===?>"+data);
                    
                  return res.status(200).send(data);
                }
              });
          

        }
    }
    catch(error){
        res.send(error)
    }
}
