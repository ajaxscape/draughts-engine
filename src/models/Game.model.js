const WHITE = 'w'
const BLACK = 'b'
const EMPTY = '#'

const initState = () => [
  ' w w w w',
  'w w w w ',
  ' w w w w',
  '# # # # ',
  ' # # # #',
  'b b b b ',
  ' b b b b',
  'b b b b '
].map((row) => row.split(''))

module.exports = class Game {
  constructor (player1, player2) {
    this.player1 = player1
    this.player2 = player2
    this.state = initState()
    this.currentPlayer = WHITE
  }

  render (err) {
    const simple = [
      ' ~~~ A B C D E F G H ~ ',
      ' -------------------- '
    ]
    this.state.forEach((row, index) => simple.push(` ${index + 1}  |${row.join('|')}| `))
    if (err) {
      simple.push(' -------------------- ')
      simple.push(' **** E R R O R ***** ')
    }
    simple.push(' -------------------- ')
    simple.push(` -- ${this.currentPlayer === WHITE ? 'WHITE' : 'BLACK'} TO MOVE --- `)
    return simple
  }

  getCell (x, y) {
    return this.state[y][x]
  }

  setCell (x, y, value) {
    this.state[y][x] = value
  }

  static _isValid (x, y) {
    if (
      (x % 2 && y % 2) ||
      (!(x % 2) && !(y % 2)) ||
      x < 0 ||
      x > 7 ||
      y < 0 ||
      y > 7) {
      return false
    } else {
      return true
    }
  }

  static _getPos (alpha) {
    if (alpha.length !== 2) {
      throw new Error(`Invalid position (${alpha})`)
    }
    const x = 'abcdefgh'.indexOf(alpha[0])
    const y = parseInt(alpha[1]) - 1
    return {x, y}
  }

  validTarget (x, y, xDiff, yDiff) {
    const jumpedX = x + xDiff
    const jumpedY = y + yDiff
    const jumpTargetX = x + xDiff * 2
    const jumpTargetY = y + yDiff * 2

    if (!Game._isValid(jumpedX, jumpedY)) {
      return
    }

    const jumpedCell = this.getCell(jumpedX, jumpedY)
    if (jumpedCell === EMPTY) {
      return {x: jumpedX, y: jumpedY}
    }

    if (!Game._isValid(jumpTargetX, jumpTargetY)) {
      return
    }

    const jumpTargetCell = this.getCell(jumpTargetX, jumpTargetY)
    if (jumpTargetCell !== EMPTY) {
      return
    }

    if (this.getCell(x, y).toUpperCase() !== jumpedCell.toUpperCase()) {
      return {x: jumpTargetX, y: jumpTargetY, jumpedX, jumpedY}
    }
  }

  getPossibleTargets (source) {
    const list = []
    const {x, y} = Game._getPos(source)
    if (!Game._isValid(x, y)) {
      return list
    }
    const sourceCell = this.getCell(x, y)
    if (sourceCell !== WHITE) {
      list.push(this.validTarget(x, y, -1, -1))
      list.push(this.validTarget(x, y, 1, -1))
    }
    if (sourceCell !== BLACK) {
      list.push(this.validTarget(x, y, -1, 1))
      list.push(this.validTarget(x, y, 1, 1))
    }
    return list.filter((target) => target)
  }

  move (source, target) {
    const {x: sourceX, y: sourceY} = Game._getPos(source)
    const {x: targetX, y: targetY} = Game._getPos(target)
    if (!Game._isValid(sourceX, sourceY) || !Game._isValid(targetX, targetY)) {
      throw new Error(`Invalid move (${source}, ${target})`)
    }
    const sourceCell = this.getCell(sourceX, sourceY)
    const targetCell = this.getCell(targetX, targetY)
    if (sourceCell.toLowerCase() !== this.currentPlayer || targetCell !== EMPTY) {
      throw new Error(`Invalid move (${source}, ${target})`)
    }

    // Get the valid move
    const validMove = this.getPossibleTargets(source)
      .filter(({x, y}) => (targetX === x && targetY === y))
      .pop()

    // Only continue if this is a valid move
    if (!validMove) {
      throw new Error(`Invalid move (${source}, ${target})`)
    }

    // Make the move now we know it's valid
    this.setCell(targetX, targetY, this.getCell(sourceX, sourceY))
    this.setCell(sourceX, sourceY, EMPTY)

    const {jumpedX, jumpedY} = validMove
    if (jumpedX && jumpedY) {
      this.setCell(jumpedX, jumpedY, EMPTY)
    }

    // Make a draught a king (uppercase) if eligible
    if (this.currentPlayer === WHITE && targetY === 7) {
      this.setCell(targetX, targetY, 'W')
    }
    if (this.currentPlayer === BLACK && targetY === 0) {
      this.setCell(targetX, targetY, 'B')
    }

    // Switch to the next player
    this.currentPlayer = this.currentPlayer === WHITE ? BLACK : WHITE
  }
}
