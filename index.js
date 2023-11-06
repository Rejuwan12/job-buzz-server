
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Jobs Site Server Is Running!')
})

app.listen(port, () => {
  console.log(`Example app listening at port ${port}`)
})