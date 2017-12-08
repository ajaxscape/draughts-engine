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
  let fakeGame
  let game

  const expectGamesToMatch = (game, fakeGame) => {
    expect(game.state).to.deep.have.same.members(fakeGame.state)
    expect(game.currentPlayer).to.equal(fakeGame.currentPlayer)
  }

  beforeEach(function () {
    const cols = 'abcdefgh'
    fakeGame = {
      state: defaultState.map((row) => row.map((col) => col)),
      currentPlayer: defaultPlayer,
      move: (source, target) => {
        const {state, currentPlayer} = fakeGame
        const sourceCol = cols.indexOf(source[0])
        const sourceRow = parseInt(source[1]) - 1
        const targetCol = cols.indexOf(target[0])
        const targetRow = parseInt(target[1]) - 1
        const sourceCell = state[sourceRow][sourceCol]
        state[sourceRow][sourceCol] = '#'
        state[targetRow][targetCol] = sourceCell
        fakeGame.currentPlayer = currentPlayer === WHITE ? BLACK : WHITE
        return fakeGame
      }
    }
    game = new Game()
  })

  describe('constructor', function () {
    it('should have a default state', function () {
      expectGamesToMatch(game, fakeGame)
    })

    it('should make a valid standard move', function () {
      const source = 'f3'
      const target = 'e4'
      expectGamesToMatch(game.move(source, target), fakeGame.move(source, target))
    })
  })
})
