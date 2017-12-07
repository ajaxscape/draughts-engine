const Game = require('../../src/models/Game.model')
const {expect} = require('chai')

const WHITE = 'w'
const BLACK = 'b'
const defaultPlayer = WHITE
const defaultState = [
  ' w w w w',
  'w w w w ',
  ' w w w w',
  '# # # # ',
  ' # # # #',
  'b b b b ',
  ' b b b b',
  'b b b b '
].map((row) => row.split(''))

describe('Game', function() {
  let game
  beforeEach(function () {
    game = new Game()
    player = defaultPlayer
  })

  describe('constructor', function () {
    it('should have a default state', function () {
      expect(game.state).to.deep.have.same.members(defaultState)
      expect(game.currentPlayer).to.equal(defaultPlayer)
    })
  })
})
