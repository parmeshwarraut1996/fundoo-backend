const express=require('express');
const expressValidator=require('express-validator');
const cors=require('cors');
const noteController=require('../../controllers/note.controller');
const router=express.Router();
const userController=require('../../controllers/user.controller')
const auth=require('../../authorization/token')
var upload = require('../../authorization/imageUpload')


router.use(cors());
router.use(expressValidator());

router.post('/addNote', upload.single('file') ,noteController.addNote);
router.post('/updateNote', auth.userAuth, noteController.updateNote);
router.put('/isPin', auth.userAuth,noteController.isPin);
router.put('/isArchive',auth.userAuth,noteController.isArchive);
router.put('/isTrashed',auth.userAuth,noteController.isTrashed);
router.put('/addColor',auth.userAuth,noteController.addColor);
router.put('/addReminder',auth.userAuth,noteController.addReminder);
router.post('/reminder',auth.userAuth,userController.reminderToken)
module.exports=router;