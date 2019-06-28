const noteService = require("../services/note.service");
var express = require("express");
var key = require("../config/config");
var expressValidator = require("express-validator");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

/**
    new note insert call from controller

    @param {} req
    @param {} res

*/

exports.addNote = (req, res) => {
   //console.log("file=====>  ", req.body.userId);

  try {
    req.checkBody("title", "title can not empty").notEmpty();
    req.checkBody("description", "descriptoin can not empty").notEmpty();

    var errors = req.validationErrors();
    console.log("errors" + errors);

    if (errors) {
      return res.status(400).send(errors);
    } else {
      
      let noteData = {
        title: req.body.title,
        description: req.body.description,
        pin: req.body.pin,
        image: req.file?req.file.location:"",
        reminder: req.body.reminder,
        label: req.body.label,
        collaborator: req.body.collaborator,
        color: req.body.color,
        archive: req.body.archive,
        trashed: req.body.trashed,
        userId: req.body.userId
      };
      noteService.addNote(noteData, (err, data) => {
        if (err) {
          console.log("in 500");

          return res.status(500).send(err);
        } else {
          console.log("data   " + data);

          return res.status(200).send(data);
        }
      });
    }
  } catch (error) {
    return res.send(error);
  }
};

exports.updateNote = (req, res) => {
  try {
    req.checkBody("title", "title can not empty").notEmpty();
    req.checkBody("description", "description can not empty").notEmpty();
    req.checkBody("_id", "id can not empty").notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      console.log("error data" + JSON.stringify(errors));

      return res.status(400).send(errors);
    } else {
      noteService.updateNote(req, (err, data) => {
        if (err) {
          console.log("in err");

          return res.status(500).send(err);
        } else {
          console.log(" data" + data);

          return res.status(200).send(data);
        }
      });
    }
  } catch (error) {
    return res.send(error);
  }
};

exports.isPin = (req, res) => {
  try {
    req.checkBody("_id", "Card index is required").notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    } else {
      noteService.isPin(req, (err, data) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.status(200).send(data);
        }
      });
    }
    
  } catch (error) {
    return res.send(error)
    
  }
 
};

exports.isArchive = (req, res) => {
  try {
    req.checkBody("_id", "Card index is required").notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    } else {
      noteService.isArchive(req, (err, data) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.status(200).send(data);
        }
      });
    }
    
  } catch (error) {
    return res.send(error);
    
  }
 
};
exports. isTrashed = (req, res) => {
  try {
    req.checkBody("_id", "Card index is required").notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  } else {
    noteService.isTrashed(req, (err, data) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).send(data);
      }
    });
  }
    
  } catch (error) {
    return res.send(error);
    
  }
  
};

exports.addColor = (req, res) => {
  try {
    req.checkBody("_id", "Card index is required").notEmpty();

    var errors = req.validationErrors();
  
    if (errors) {
      return res.status(400).send(errors);
    } else {
      noteService.addColor(req, (err, data) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.status(200).send(data);
        }
      });
    }
    
  } catch (error) {
    return res.send(error)
    
  }
 
};

exports.addReminder = (req, res) => {
  try {
    req.checkBody("_id", "Card index is required").notEmpty();
    var errors = req.validationErrors();
  
    if (errors) {
      return res.status(400).send(errors);
    } else {
      noteService.addReminder(req, (err, data) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.status(200).send(data);
        }
      });
    }
    
  } catch (error) {
    return res.send(error)
    
  }
 
};

exports.addLabel=(req,res)=>{
  console.log("in controller==>"+req.body);
  
  try {
    req.checkBody("labels","Labels are required").notEmpty();
    var errors=req.validationErrors();
    if(errors){
      console.log("in errors====>"+errors
      );
      
      return res.status(400).send(errors);
    }
    else{
      var obj={
        "userId":req.body.userId,
        "labels":req.body.labels
      }
      noteService.addLabel(obj,(err,res)=>{
        if(err){
          return res.status(500).send(err);
        }
        else{
          return res.status(200).send(obj)
        }

      })
    }
    
  } catch (error) {
    
  }
  
}