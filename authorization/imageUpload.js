const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
var key=require('../config/config')



const s3=new aws.S3({
    secretAccessKey:key.AWS_SECRET_KEY,
    accessKeyId:key.AWS_ACCESS_KEY,
    region:'ap-south-1'
})

const extensions = ['jpg', 'gif', 'WebP', 'jpeg', 'png'];
const extensions2 = ['image/png', '']
const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024, //size of the file 
        files: 1 // number of files
    },
    fileFilter: (req, file, callback) => {
        console.log(req);
        
        
        if(file.originalname===undefined||file.originalname===null||file.originalname===''){
            return callback(null,true)
        }
        else{
            if (extensions.some(ext => file.originalname.endsWith("." + ext)) || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
                return callback(null, true);
            }
            //if the file type is not of expected type create an error and throw back
            return callback(new Error('Only ' + extensions.join() + 'files are allowed'));
        }
       
    },
    storage: multerS3({
        s3: s3,
        bucket: 'fundoobridgelabz',
        acl: 'public-read',
        metadata: function (req, file, callback) {
            console.log("req"+file.path);
            
            callback(null, {
                fieldName: 'TESTING_META_DATA!'
            });
        },
        key: function (req, file, callback) {
            console.log("req"+file.path);

            callback(null, Date.now().toString())
        }
    })
})

module.exports=upload;