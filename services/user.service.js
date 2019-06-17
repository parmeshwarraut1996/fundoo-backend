var userModel = require("../models/user.model");
var notificationModel=require("../models/notification.model")
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

exports.forgetPassword=(req,callback)=>{
  
  userModel.forgetPassword(req,(err,data)=>{
    console.log("in services"+req.body.email);

    if(err){
      return callback(err)
    }
    else{
      console.log("data in services"+data);
      
      return callback(null,data)
    }
  })

}
exports.resetPassword=(req,callback)=>{
  console.log("in services");
  
  userModel.resetPassword(req,(err,data)=>{
    
    if(err){
      return callback(err)
    }
    else{
      return callback(null,data)
    }

  })
}

exports.reminder=(req,callback)=>{
  notificationModel.pushNotification(req,(err,data)=>{
    if(err){
      return callback(err);
    }
    else{
      return callback(null,data);
    }
  })
  
}
