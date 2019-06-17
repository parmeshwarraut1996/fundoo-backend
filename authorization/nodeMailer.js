const nodemailer = require("nodemailer");

module.exports = {
  sendMail(to, url) {
    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "parmeshwarraut1996@gmail.com",
        pass: "Parmeshwar@55"
      }
    });
console.log('mail',transporter);

  

    transporter.sendMail( {
      from: '"Parmeshwar Raut" <parmeshwarraut1996@gmail.com>',
      to: to,
      subject: "password reset mail",
      text: "Click on following link to reset your password \n \n"  + url
    }, function(err, res) {
      if (err) {
        console.log("error in send mail",err);
        
        return err;
      } else {
        return res.response;
      }
    });
  }
};
