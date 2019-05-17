const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyParser.json())


 
app.listen(8080, () => console.log('Job Dispatch API running on port 8080!'))