const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const attachGame = require('./middleware/attachGame')

app.use(bodyParser.json())
app.use(attachGame)

app.use('/', require('./routes/state.route'))

const PORT = process.env.PORT || 5000
app.listen(PORT)
