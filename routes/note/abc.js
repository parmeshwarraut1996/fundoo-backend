var multer = require("multer");
var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var fs = require('fs-extra');
var url="mongodb://localhost:27017/fundoo";
var upload = multer({ dest: "uploads/" });

router.get('/', function(req, res){ res.send('index'); });
router.post("/uploadfile", upload.single("file"), (req, res) => {
  console.log("file is", req.file);

  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    res.send(error);
  }
  else{
    MongoClient.connect(url,  {useNewUrlParser: true},
      function(err,database){
      var newImg = fs.readFileSync(req.file.path);
      var encImg = newImg.toString('base64');
      var newItem = {
        description: req.body.description,
        contentType: req.file.mimetype,
        size: req.file.size,
        img: Buffer(encImg, 'base64')
     };
     database.collection('notes').insert(newItem,function(err,result){
       if(err){
         res.send(err)
       }
       else{
         var newImageId=new ObjectId(result.ops[0]._id);
         fs.remove(req.file.path, function(err) {
           if(err){
             res.send(err)
           }
           else{
             res.send(newImageId)
           }

       })
     }
     
    })
  });
}
})
module.exports = router;
