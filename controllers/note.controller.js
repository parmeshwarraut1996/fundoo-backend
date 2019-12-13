const noteService = require("../services/note.service");
var express = require("express");
var key = require("../config/config");
var expressValidator = require("express-validator");
var bodyParser = require("body-parser");
var elasticsearch = require("elasticsearch");
var key = require("../config/config");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
const client = new elasticsearch.Client({
  host: key.ELASTIC_HOST
});

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
      let noteData2 = [];

      let noteData = {
        title: req.body.title,
        description: req.body.description,
        pin: req.body.pin,
        image: req.file ? req.file.location : "",
        reminder: req.body.reminder,
        label: req.body.label,
        collaborator: req.body.collaborator,
        color: req.body.color,
        archive: req.body.archive,
        trashed: req.body.trashed,
        userId: req.body.userId
      };
      noteData2.push(noteData);
      noteService.addNote(noteData, (err, data) => {
        if (err) {
          console.log("in 500");

          return res.status(500).send(err);
        } else {
          console.log("data   " + data);
          this.addDocument(noteData2);
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
    return res.send(error);
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
exports.isTrashed = (req, res) => {
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
    return res.send(error);
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
    return res.send(error);
  }
};

exports.addLabel = (req, res) => {
  console.log("in controller==>" + req.body);

  try {
    req.checkBody("labels", "Labels are required").notEmpty();
    var errors = req.validationErrors();
    if (errors) {
      console.log("in errors====>" + errors);

      return res.status(400).send(errors);
    } else {
      var obj = {
        userId: req.body.userId,
        labels: req.body.labels
      };
      noteService.addLabel(obj, (err, res) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.status(200).send(obj);
        }
      });
    }
  } catch (error) {}
};
exports.createIndex = req => {
  try {
    let index = req;
    console.log("index ", index);

    client.indices.create(
      {
        index: index
      },
      (err, result) => {
        if (err) {
          return err;
        } else {
          return result;
        }
      }
    );
  } catch (error) {
    return res.send(error);
  }
};

exports.addDocument = (req, res) => {
  try {
    let data = [];
    req.forEach((element, key) => {
      data.push({
        index: {
          _index: element.userId,
          _type: "notes"
        }
      });
      let noteData = {
        _id: element._id,
        title: element.title,
        description: element.description
      };
      data.push(noteData);
      console.log("data ", data);
    });
    client.bulk({ body: data }, (err, result) => {
      if (err) {
        return res.status(400).send(result);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
exports.searchNote = (req, res) => {
  console.log("in search", req.tokenData.id);
  try {
    let body = {
      query: {
        query_string: {
          query: `*${req.body.searchKey}*`,
          analyze_wildcard: true,
          fields: ["title", "description", "_id"]
        }
      }
    };
    client
      .search({ index: req.tokenData.id, body: body, type: "notes" })
      .then(resultSet => {
        return res.status(200).send(resultSet.hits.hits);
      })
      .catch(err => {
        return res.status(404).send(err);
      });
  } catch (error) {
    return res.status(500).send(error);
  }
};
