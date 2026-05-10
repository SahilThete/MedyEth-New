require('dotenv').config();
const mongoose = require ('mongoose')
mongoose.Promise = global.Promise

const mongo_link = process.env.MONGODB_URI

mongoose.connect(mongo_link, {useNewUrlParser: true, useUnifiedTopology:true})
    .then(() => console.log('Database Connected'))
    .catch((error) => console.log(error))

module.exports =  mongoose;