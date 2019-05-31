var userModel = require("../models/user.model");

exports.signUp = (req, callback) => {
  console.log("in services" + req.body.email);

  userModel.signUp(req, (err, data) => {
    if (err) {
      console.log("in services=>" + err);
      return callback(err);
    } else {
      console.log("in services=>" + data);
      return callback(null, data);
    }
  });
};

exports.login=(req,callback)=>{
    console.log("data in user service login method==>"+req.email);
    userModel.login(req,(err,data)=>{
        if(err){
            return callback(err)
        }
        else{
            return callback(null,data)
        }
    })
    
}
