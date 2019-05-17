const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser')
const redis = require("redis")
const { promisify } = require('util');

const MY_WEB_PAGE_URL = 'http://localhost:3000'

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
  origin: MY_WEB_PAGE_URL,
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
  let minifiedURL = `${MY_WEB_PAGE_URL}/g/${hash(originalURL)}`
  
  let newURL = originalURL
  while ( await hgetAsync('minified-to-original', minifiedURL)){
    newURL = newURL + ' '
    const newHashKey = hash(newURL)
    minifiedURL = `${MY_WEB_PAGE_URL}/g/${newHashKey}`
  }

  try {
    const oldMinifiedOfURL = await hgetAsync('original-to-minified', originalURL)
    console.log('old minified ',oldMinifiedOfURL)
    if (oldMinifiedOfURL){
      return res.send(JSON.stringify({ miniURL: oldMinifiedOfURL }))
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
  res.send(JSON.stringify({ miniURL: minifiedURL }))
})



app.get('/g*', async (req, res) => {
  const minifiedURL = `${MY_WEB_PAGE_URL}${req.url}`
  console.log('getting ', minifiedURL)
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



app.get('/admin',async (req, res) => {
  try {
    const allData = await hgetAsync('original-to-data')
    console.log(allData)
    res.send(allData)
  } catch(error) {

  }
  
})


app.listen(8080, () => console.log('Job Dispatch API running on port 8080!'))


const hash = (key) => {
  const hash = Array.from(key).reduce(
    (hashAccumulator, keySymbol) => (hashAccumulator + keySymbol.charCodeAt(0)),
    0,
  )
  return (hash % 10000).toString()
}