var multer = require("multer");
var express = require("express");
var imageRouter = express.Router();
var upload = multer({ dest: "uploads/" });


imageRouter.post("/uploadfile", upload.single('file'), (req, res,next) => {
  // console.log("file is", req.body,);

  const file = req.file;
  if (!file) {
   
    res.send(null);
  }
  res.send(file);
  next();
});
module.exports = imageRouter;
