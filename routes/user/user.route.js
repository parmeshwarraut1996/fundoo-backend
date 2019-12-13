const express=require('express');
const cors=require('cors');
const expressValidator=require('express-validator');
const userController=require('../../controllers/user.controller')
const auth=require('../../authorization/token')
const userRouter=express.Router();

userRouter.use(cors());
userRouter.use(expressValidator());

userRouter.post('/signUp',userController.signUp);
userRouter.post('/login',userController.login);
userRouter.post('/forgetPassword',userController.forgetPassword);
userRouter.put('/resetPassword',auth.auth,userController.resetPassword)

module.exports=userRouter;







