const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mail = require('../../authantication/sendMail')
// create instance of Schema
var mongoSchema = mongoose.Schema;
var userSchema = new mongoSchema({
        'firstname': { type: String, required: [true, "First name is required"] },
        'lastname': { type: String, required: [true, "LastName is required"] },
        'email': { type: String, required: [true, "Email is required"] },
        'password': { type: String, required: [true, "password is required"] },
}, {
                timestamps: true
        });
function usermodel() {

}
var user = mongoose.model('user', userSchema);
function hash(password) {
        var salt = bcrypt.genSaltSync(10);
        var hashPassword = bcrypt.hashSync(password, salt);
        return hashPassword;
}

usermodel.prototype.register = (body, callback) => {
        user.find({ 'email': body.email }, (err, data) => {
                if (err) {
                        console.log("Error in register user schema ");
                        return callback(err);
                } else if (data.length > 0) {
                        response = { "error": true, "message": "Email already exists ", "errorCode": 404 };
                        return callback(response);
                }
                else {
                        const newUser = new user({
                                'firstname': body.firstname,
                                'lastname': body.lastname,
                                'email': body.email,
                                'password': hash(body.password)
                        });
                        newUser.save((err, result) => {
                                if (err) {
                                        console.log("error in model file", err);
                                        return callback(err);
                                } else {
                                        console.log("data save successfully", result);
                                        return callback(null, result);
                                }
                        })
                }
        });

}
usermodel.prototype.login = (body, callback) => {
        user.find({ 'email': body.email }, (err, data) => {
                if (err) {
                        console.log('error in email', err);

                        return callback(err);
                } else if (data.length > 0) {
                        bcrypt.compare(body.password, data[0].password, function (err, res) {
                                console.log('error in becryt', err);

                                if (err) {
                                        return callback(err);
                                } else if (res) {
                                        console.log(data);

                                        return callback(null, data);
                                }
                        });
                } else {
                        return callback("Invalid User ");
                }
        })
}


usermodel.prototype.getAllUser = (callback) => {
        user.find({}, (err, data) => {
                if (err) {
                        callback(err);
                } else {
                        callback(null, data);
                }
        })
}
usermodel.prototype.forgotPassword = (req, callback) => {
        console.log('in schema', req.email);

        user.find({ 'email': req.email }, (err, data) => {
                if (err) {
                        return callback(err);
                } else if (data.length > 0) {
                        var secret = "adcgfft";
                        var token = jwt.sign({ email: req.email, id: data[0]._id }, secret, { expiresIn: 8640000 });
                        console.log(token);
                        token='http://localhost:3000/#!/reset/'+token;
                        mail.sendMail(req.email,token);
                        
                        return callback(null, 'Link send successFully on your mail')

                } else {
                        return callback('Email does not Exist');
                }
        })
}
usermodel.prototype.resetPassword=(req,callback)=>{
        user.update({_id:req.decodedData.id}, {$set:{password:req.body.password}}, function(err, result){
                if(err){
                        return callback(err)
                }else{
                        
                        return callback(null,'password update successfully');
                }
        })
}

module.exports = new usermodel();