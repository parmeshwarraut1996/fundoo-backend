const express=require('express');
const cors=require('cors');
const expressValidator=require('express-validator');
const userController=require('../controllers/user.controller')
const router=express.Router();

router.use(cors());
router.use(expressValidator());
process.env.SECRET_KEY='secret';


router.post('/signUp',userController.signUp);
router.post('/login',userController.login)

module.exports=router;







