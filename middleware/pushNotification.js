const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
var serviceAccount = require("../firebaseSDK.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fundoonotes-4ede7.firebaseio.com/"
});

module.exports = {
  throwPushMessage(token, payload) {
    admin
      .messaging()
      .sendToDevice(token, payload, {
        priority: "normal",
        timeToLive: 60 * 60
      })
      .then(function(response) {
        console.log("Message sent successfully", response);
      })
      .catch(function(error) {
        console.log("Error in sending message", error);
      });
  },

  throwIntoMail(email, data) {
    console.log('data into mail',email);
    
    const mailOptions = {
      from: "parmeshwarraut1996@gmail.com",
      to: email,
      subject: "you have reminder today",
      text: "\n title:" + data.title + "\n description:" + data.description
    };
    nodemailer
      .createTransport({
        service: "Gmail",
        
        auth: {
          user: "parmeshwarraut1996@gmail.com",
          pass: "Parmeshwar@55"
        }
      })
      .sendMail(mailOptions, (err, result) => {
        if (err) {
          console.log("Nodemailer error:", err);
        } else {
          console.log("Nodemailer does good job:", result);
        }
      });
  }
};
