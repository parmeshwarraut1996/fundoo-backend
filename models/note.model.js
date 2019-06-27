var mongoose = require("mongoose");
const Schema = mongoose.Schema;

var noteSchema = new Schema(
  {
    title: {
      type: String
    },
    description: {
      type: String
    },
    pin: {
      type: Boolean
    },
    image: {
      type: String
    },
    reminder: {
      type: Date
    },
    label: {
      type: Array
    },
    collaborator: {
      type: Array
    },
    color: {
      type: String
    },
    archive: {
      type: Boolean
    },
    trashed: {
      type: Boolean
    },
    userId: {
        type:Schema.Types.ObjectId,
        required: true,
        ref: 'users'
       }
  },
  { timestamps: true }
);

var Note = mongoose.model("note", noteSchema);
function noteModel() {}

noteModel.prototype.addNote = (req, callback) => {
  console.log("in model" ,req.title);
  
      var newNote ={
        title: req.title,
        description: req.description,
        pin: req.pin?req.pin:false,
        image:req.image?req.image:"",
        reminder: req.reminder?req.reminder:"",
        label: req.label,
        collaborator: req.collaborator,
        color: req.color?req.color:"",
        archive: req.archive?req.archive:false,
        trashed: req.trashed?req.trashed:false,
        userId: req.userId
      };

      const note=new Note(newNote);
      note.save((error, result) => {
        if (error) {
          console.log('save error');
          
          return callback(error);
        } else {
          console.log('save succes');
          
          return callback(null, result);
        }
      });

};
noteModel.prototype.updateNote = (req, callback) => {
    console.log("req body id  ");
    
    Note.findOne({_id:req.body._id},(err,data)=>{
        if(err){
            return callback(err)
        }
        else{
            note.updateOne({_id:req.body._id},{$set:{title:req.body.title,description:req.body.description}},function(err,result){
                if(err){
                    return callback(err)
                }
                else{
                    return callback(null,result)
                }
            })
        
        }
    })
}

noteModel.prototype.isPin=(req,callback)=>{
    console.log("pin====> "+req.body.pin);
    
    Note.findOne({_id:req.body._id},(err,data)=>{
        if(err){
            return callback(err);
        }
        else{
  
          Note.updateOne({_id:req.body._id},{$set:{pin:req.body.pin}},function(err,result){
                if(err){
                    return callback(err);
                }
                else{
                    return callback(null,result)
                }
            })
        }
    })
}

noteModel.prototype.isArchive=(req,callback)=>{
  Note.findOne({_id:req.body._id},(err,data)=>{
        if(err){
            return callback(err)
        }
        else{
          Note.updateOne({_id:req.body._id},{$set:{archive:req.body.archive}},function(err,data){
                if(err){
                    return callback(err);
                }
                else{
                    return callback(null,data)
                }
            })
        }
    })
}
noteModel.prototype.isTrashed=(req,callback)=>{
  Note.findOne({_id:req.body._id},(err,data)=>{
    if(err){
      return callback(err)
    }
    else{
      Note.updateOne({_id:req.body._id},{$set:{trashed:req.body.trashed}},function(err,result){
        if(err){
          return callback(err);
        }
        else{
          return callback(null,result);
        }
      })
    }
  })
}
 
noteModel.prototype.addColor=(req,callback)=>{
  Note.findOne({_id:req.body._id},(err,data)=>{
    if(err){
      return callback(err);
    }
    else{
      Note.updateOne({_id:req.body._id},{$set:{color:req.body.color}},function(err,result){
        if(err){
          return callback(err);
        }else{
          return callback(null,result)       
        }
      })
    }
  })
}
noteModel.prototype.addReminder=(req,callback)=>{
  Note.findOne({_id:req.body._id},(err,data)=>{
    if(err){
      return callback(err);
    }
    else{
      Note.updateOne({_id:req.body._id},{$set:{reminder:req.body.reminder}},function(err,result){
      if(err){
        return callback(err);
      }else{
        return callback(null,result)       
      }
    })
  }
  })
}

noteModel.prototype.allReminders = (callback) => {
  var d = new Date();
   const d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
   const d2 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()+1);

  Note.find({ reminder: { $gte:d1,$lte:d2 } }, (err, result) => {
      if (err) {
          callback(err)
      } else {
           callback(null,result)
      }
  })
}

var labelSchema=new Schema({

  userId:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:"users"
  },
  label:[String]

},{timestamps:true});

var Label=mongoose.model("Label",labelSchema);

noteModel.prototype.addLabel=(data,callback)=>{
Label.findOne({"userId":data.userId},(err,res)=>{
  if(err){
    return callback(err);
  }
  else if(res===null) {
    var obj={
      "userId":data.userId,
      "labels":data.labels
    }
    var label=new Label(obj);
    label.save((err,result)=>{
      if(err){
        return callback(err)
      }
      else{
        return callback(null,result)
      }
    })
  }
  else{
  Label.findOneAndUpdate({ userId: data.userId }, { $push: { labels: { $each: data.labels } } },(err,res)=>{
    if(err){
      return callback(err)
    }
    else{
      return callback(null,res)
    }
  })

  }

})
}
module.exports = new noteModel();
