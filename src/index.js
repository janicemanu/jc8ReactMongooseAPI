const express  = require('express')
const port = require('./config')
require('./config/mongose')


const app = express()
app.use(express.json())

app.listen(port, () => console.log("API Running on port" + port))