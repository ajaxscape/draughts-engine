const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send(req.game)
})

router.get('/reset', (req, res) => {
  res.send(req.game)
})

router.get('/render', (req, res) => {
  res.send(req.game.render())
})

router.get('/move/:start/:end', (req, res) => {
  const {start, end} = req.params
  try {
    req.game.move(start, end)
    res.send(req.game)
  } catch (err) {
    const {message} = err
    return res.status(406).send({message})
  }
})

module.exports = router
