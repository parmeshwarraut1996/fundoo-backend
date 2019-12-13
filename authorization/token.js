var jwt = require("jsonwebtoken");
var key = require("../config/config");

exports.auth = function(req, res, next) {
  var token = req.headers["token"];
  var errMessage = {
    message: "unauthorised user"
  };

  jwt.verify(token, key.API_KEY, function(err, tokenData) {
    if (err) {
      return res.status(401).send({
        err:err,
        message:errMessage
      });
    } else {
      req.tokenData = tokenData;
      next();
    }
  });
};

exports.userAuth=(req,res,next)=>{
  console.log("in auth  "+req.body.title);
    var token=req.headers["token"];
  console.log("token"+token);
    var errMessage={
    message:"unauthorised user"
  };
    jwt.verify(token,key.API_KEY,(err,tokenData)=>{
    if(err){
      console.log("in  err auth"+err);

      return res.status(108).send({
        err:err,
        message:errMessage
      });
    }
      else{
        console.log("in success in token===>");
        
        req.tokenData=tokenData
        next();
      }
    
  })
}