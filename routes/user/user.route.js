const express=require('express');
const cors=require('cors');
const expressValidator=require('express-validator');
const userController=require('../../controllers/user.controller')
const auth=require('../../authorization/token')
const router=express.Router();

router.use(cors());
router.use(expressValidator());

router.post('/signUp',userController.signUp);
router.post('/login',userController.login);
router.post('/forgetPassword',userController.forgetPassword);
router.put('/resetPassword',auth.auth,userController.resetPassword)

module.exports=router;







