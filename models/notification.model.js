var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var user = require("../models/user.model");

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    email: {
      type: String
    },
    firebaseToken: {
      type: String
    }
  },
  { timestamps: true }
);

var notification = mongoose.model("notification", notificationSchema);
var user = new mongoose.model("user");
function notificationModel() {}

notificationModel.prototype.pushNotification = (req, callback) => {
  user.findOne({ _id: req.body.userId }, (err, data) => {
    if (err) {
      console.log(err);
      return callback(err);
    } else if(data != null) {
      console.log("result is ", data);
      req.body["email"] = req.body.email;
      notification.findOne({ userId: req.body.userId }, (err, res) => {
        if (err) {
          return callback(err);
        } else if (res != null) {
          updateToken(req, (err, result) => {
            if (err) {
              return callback(err);
            } else {
              return callback(null, result);
            }
          });
        } else {
          var objNotification = new notification({
            userId: req.body.userId,
            firebaseToken: req.body.firebaseToken,
            email:req.body.email
          });
          objNotification.save((err, result) => {
            if (err) {
              return callback(err);
            } else {
              return callback(null, result);
            }
          });
        }
      });
    } else {
        callback("Not found")
    }
  });
};
function updateToken(req, callback) {

  notification.find({ userId: req.body.userId }, (err, data) => {
    if (err) {
      return callback(err);
    } else {
      notification.update(
        { userId: req.body.userId },
        { $set: { firebaseToken: req.body.firebaseToken } },
        (err, result) => {
          if (err) {
            return callback(err);
          } else {
            return callback(null, result);
          }
        }
      );
    }
  });
}

notificationModel.prototype.reminder = (req, callback) => {
    console.log("in reminder===>"+req);
    
  notification.find({ userId: req.userId }, (err, data) => {
      console.log('data after search',data);
      
    if (err) {
      return callback(err);
    } else {
      return callback(null, {
        firebaseToken: data[0].firebaseToken,
        title: req.title,
        description: req.description,
        email:data[0].email
      });
    }
  });
};

module.exports = new notificationModel();
