const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
var config = require("./config/config.database");
var router = require("./routes/user/user.route");
const hostname = "127.0.0.1";
const port = 3000;
const app = express();
var schedule = require("node-schedule");
var service = require("./services/note.service");
var objPushnotification = require("./middleware/pushNotification");
app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use("/", router);

mongoose
  .connect(config.url, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });
app.listen(port, () => {
  console.log("server is running http://" + hostname + ":" + port);
});
console.log("date===>"+Date());


schedule.scheduleJob("*/1 * * * *", () => {
  service.currentReminders((res) => {
    console.log("res===>"+res.length);
    console.log("err in server + ");
    
    
    if (res===null) {
      console.log("server not working");
    } else {
      if (res.length == 0) {
        console.log("currently no any reminders");
      } else {
        console.log("caught some reminders");
        for (let i = 0; i < res.length; i++) {
          console.log(res[i]);
          
          service.buidReminderObj(res[i], (err, result) => {
            console.log('data after build ',result);
            
            if (err) {
              console.log("can't process further, due to some error....");
              console.log(err);
            } else {
             
              
              if (result.firebaseToken) {
                console.log("in result====>"+result.email);
                objPushnotification.throwPushMessage(result.firebaseToken, {
                  notification: {
                    title: result.title,
                    description: result.description
                  }
                });
              }

              objPushnotification.throwIntoMail(result.email, {
                title: result.title,
                description: result.description
              });
            }
          });
        }
      }
    }
  });
});
