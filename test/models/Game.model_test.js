const Game = require('../../src/models/Game.model')
const {expect} = require('chai')

const WHITE = 'w'
const BLACK = 'b'
const EMPTY = '#'
const CROWNED = true
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

describe('Game', function () {
  let fakeGame
  let game

  const getPos = (pos) => {
    const cols = 'abcdefgh'
    return [cols.indexOf(pos[0]), parseInt(pos[1]) - 1]
  }

  const expectGamesToMatch = (game, fakeGame) => {
    expect(game.state).to.deep.have.same.members(fakeGame.state)
    expect(game.currentPlayer).to.equal(fakeGame.currentPlayer)
  }

  const expectLoserToBe = (game, player) => {
    expect(game.state.toString().toLowerCase().indexOf(player)).to.equal(-1)
  }

  const expectInvalidMove = (move, game, fakeGame) => {
    console.log(`MOVING: (${move.split(',').join(') to (')})`)
    const [source, target] = move.split(',')
    expect(() => game.move(source, target)).to.throw(Error, `Invalid move (${source}, ${target})`)
    expectGamesToMatch(game, fakeGame)
    console.log(game.render())
  }

  const expectValidMove = (move, game, fakeGame, isCrowned) => {
    console.log(`MOVING: (${move.split(',').join(') to (')})`)
    const [source, jumped, target] = move.split(',')
    if (isCrowned) {
      const [sourceCol, sourceRow] = getPos(source)
      fakeGame.state[sourceRow][sourceCol] = fakeGame.state[sourceRow][sourceCol].toUpperCase()
    }
    if (target) {
      const [jumpedCol, jumpedRow] = getPos(jumped)
      fakeGame.state[jumpedRow][jumpedCol] = EMPTY
    }
    expectGamesToMatch(game.move(source, target || jumped), fakeGame.move(source, target || jumped))
    console.log(game.render())
  }

  beforeEach(function () {
    fakeGame = {
      state: defaultState.map((row) => row.map((col) => col)),
      currentPlayer: defaultPlayer,
      move: (source, target) => {
        const {state, currentPlayer} = fakeGame
        const [sourceCol, sourceRow] = getPos(source)
        const [targetCol, targetRow] = getPos(target)
        const sourceCell = state[sourceRow][sourceCol]
        state[sourceRow][sourceCol] = EMPTY
        state[targetRow][targetCol] = sourceCell
        fakeGame.currentPlayer = currentPlayer === WHITE ? BLACK : WHITE
        return fakeGame
      }
    }
    game = new Game()
  })

  describe('state', function () {
    it('should have a default state', function () {
      expectGamesToMatch(game, fakeGame)
    })

    it('should successfully complete a game', function () {
      expectValidMove('f3,e4', game, fakeGame)
      expectValidMove('g6,f5', game, fakeGame)
      expectValidMove('e4,f5,g6', game, fakeGame)
      expectValidMove('h7,g6,f5', game, fakeGame)
      expectValidMove('b3,c4', game, fakeGame)
      expectValidMove('f5,e4', game, fakeGame)
      expectValidMove('d3,e4,f5', game, fakeGame)
      expectValidMove('e6,f5,g4', game, fakeGame)
      expectValidMove('h3,g4,f5', game, fakeGame)
      expectValidMove('f7,g6', game, fakeGame)
      expectValidMove('f5,g6,h7', game, fakeGame)
      expectValidMove('g8,f7', game, fakeGame)
      expectValidMove('h7,g8', game, fakeGame, CROWNED)
      expectValidMove('a6,b5', game, fakeGame)
      expectValidMove('g8,f7,e6', game, fakeGame)
      expectValidMove('b5,c4,d3', game, fakeGame)
      expectValidMove('e2,d3,c4', game, fakeGame)
      expectValidMove('c6,b5', game, fakeGame)
      expectValidMove('c4,b5,a6', game, fakeGame)
      expectValidMove('b7,c6', game, fakeGame)
      expectValidMove('a6,b7', game, fakeGame)
      expectValidMove('c6,d5', game, fakeGame)
      expectValidMove('e6,d5,c4', game, fakeGame)
      expectValidMove('d7,c6', game, fakeGame)
      expectValidMove('c4,b5', game, fakeGame)
      expectValidMove('c8,d7', game, fakeGame)
      expectValidMove('b7,c8', game, fakeGame, CROWNED)
      expectValidMove('c6,b5,a4', game, fakeGame)
      expectValidMove('c8,d7,e6', game, fakeGame)
      expectValidMove('e8,d7', game, fakeGame)
      expectValidMove('e6,d7,c8', game, fakeGame)
      expectValidMove('a8,b7', game, fakeGame)
      expectValidMove('c8,b7,a6', game, fakeGame)
      expectValidMove('a4,b3', game, fakeGame)
      expectValidMove('c2,d3', game, fakeGame)
      expectValidMove('b3,c2', game, fakeGame)
      expectValidMove('d1,c2,b3', game, fakeGame)
      expectLoserToBe(game, BLACK)
    })

    it('should handle invalid moves', function () {
      expectInvalidMove('f3,f3', game, fakeGame)
      expectInvalidMove('h3,i3', game, fakeGame)
      expectInvalidMove('f3,g0', game, fakeGame)
    })

    it('should make an invalid standard move', function () {
      const source = 'h3'
      const target = 'i4'
      expect(() => game.move(source, target)).to.throw(Error, `Invalid move (${source}, ${target})`)
      expectGamesToMatch(game, fakeGame)
    })
  })
})
