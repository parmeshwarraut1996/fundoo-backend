const dotenv = require('dotenv');
dotenv.config();
module.exports={
    API_KEY:process.env.API_KEY,
    AWS_SECRET_KEY:process.env.AWS_SECRET_KEY,
    AWS_ACCESS_KEY:process.env.AWS_ACCESS_KEY,
    AUTH_KEY:process.env.AUTH_KEY,
    ELASTIC_HOST:process.env.ELASTIC_HOST
}