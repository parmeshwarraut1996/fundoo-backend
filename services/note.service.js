var noteModel = require("../models/note.model");
var notificationModel = require("../models/notification.model")
exports.addNote = (req, callback) => {
  console.log('in service');

  noteModel.addNote(req, (err, noteData) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, noteData);
    }
  });
};

exports.updateNote = (req, callback) => {

  noteModel.updateNote(req, (err, noteData) => {
    if (err) {
      console.log("in service error");

      return callback(err);
    } else {
      console.log("in service success");

      return callback(null, noteData);
    }
  });
};

exports.isPin = (req, callback) => {
  noteModel.isPin(req, (err, noteData) => {
    if (err) {
      return callback(err)
    }
    else {
      return callback(null, noteData)
    }

  })
}
exports.isArchive = (req, callback) => {
  noteModel.isArchive(req, (err, noteData) => {
    if (err) {
      return callback(err);
    }
    else {
      return callback(null, noteData)
    }
  })
}

exports.isTrashed = (req, callback) => {
  noteModel.isTrashed(req, (err, noteData) => {
    if (err) {
      return callback(err);
    }
    else {
      return callback(null, noteData)
    }
  })
}

exports.addColor = (req, callback) => {
  noteModel.addColor(req, (err, noteData) => {
    if (err) {
      return callback(err);
    }
    else {
      return callback(null, noteData)
    }
  })
}
exports.addReminder = (req, callback) => {
  noteModel.addReminder(req, (err, noteData) => {
    if (err) {
      return callback(err);
    }
    else {
      return callback(null, noteData)
    }

  })
}

exports.currentReminders = (callback) => {
  console.log("in seervice request   ");


  noteModel.allReminders((err, result) => {
    if (err) {
      console.log("in service err   " + err);

      callback(err);
    } else {
      console.log("in service success   " + result);

      callback(result)
    }
  })
}

exports.buidReminderObj = (data, callback) => {
  notificationModel.reminder(data, (err, result) => {
    if (err) {
      return callback(err);
    } else {
      return callback(null, result);
    }
  });
}
exports.addLabel = (data, callback) => {
  noteModel.addLabel(data, (err, result) => {
    if (err) {
      return callback(err)

    } else {
      return callback(null, result)
    }
  })
}