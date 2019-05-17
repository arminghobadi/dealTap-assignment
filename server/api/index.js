const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser')
const redis = require("redis")
const { promisify } = require('util');

/**
 * Init Redis
 */
const client = redis.createClient({
  host: 'redis',
  port: 6379
})

client.on("error", function (err) {
  console.log("Error " + err);
});

const hgetAsync = promisify(client.hget).bind(client)
const hsetAsycn = promisify(client.hset).bind(client)

/**
 * Init App
 */
const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/mini', async (req, res) => {
  // error
  const rawURL = req.body.url
  let originalURL
  const [protocol, ...restOfUrl] = rawURL.split('://')
  if (protocol === 'http' || protocol === 'https')
    originalURL = rawURL
  else 
    originalURL = `http://${rawURL}`
  const minifiedURL = rawURL + '-minified'
  try {
    const oldMinifiedOfURL = await hgetAsync('original-to-minified', originalURL)
    if (oldMinifiedOfURL){
      return res.send(oldMinifiedOfURL)
    }
    await hsetAsycn('original-to-minified', originalURL, minifiedURL)
    await hsetAsycn('minified-to-original', minifiedURL, originalURL)

    const dataToBeSaved = {
      minifiedURL,
      users: [],
      views: 0
    }
    await hsetAsycn('original-to-data', originalURL, JSON.stringify(dataToBeSaved))
  } catch(error) {
    console.log(error)
  }
  res.setHeader('Content-Type', 'application/json')
  res.status(200)
  res.send(minifiedURL)
})



app.get('/g*', async (req, res) => {
  const url = req.url.split('/')
  const minifiedURL = url[url.length - 1]
  try {
    const originalURL = await hgetAsync('minified-to-original', minifiedURL)
    if (!originalURL) throw new Error(404)
    const oldDataString = await hgetAsync('original-to-data', originalURL)
    const oldData = JSON.parse(oldDataString)
    const updatedData = {...oldData}
    updatedData.users = oldData.users.concat({ ip: req.ip, device: req.headers["user-agent"], timestamp: Date() })
    updatedData.views = oldData.views + 1
    await hsetAsycn('original-to-data', originalURL, JSON.stringify(updatedData))
    res.send(JSON.stringify({ url: originalURL }))
  } catch(error){
    console.log(error)
  }
  
})



app.get('/admin', (req, res) => {
  client.get('URLS', (e,a) => {res.send(JSON.stringify(a))})
  
})


app.listen(8080, () => console.log('Job Dispatch API running on port 8080!'))