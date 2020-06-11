const express = require('express')
const Datastore = require('nedb')

const app = express()
const port = 3000
app.listen(port, () => console.log(`Serwer na porcie: ${port}`))
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '1MB' }))

const collection = new Datastore({
  filename: 'logs.db',
  autoload: true,
})

app.get('/', (req, res) => {
  collection.find({}, (error, data) => {
    if (error) {
      console.error(error)
      res.status(404).json({ error })
    }
    res.end(JSON.stringify(data, undefined, 4))
  })
})

app.post('/log', (req, res) => {
  const { data } = req.body

  const log = {}
  log[getCurrentTime()] = data
  collection.insert(log)

  res.end()
})

function getCurrentTime() {
  const now = new Date()
  const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  const hour = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`
  return `${date}_${hour}`
}
