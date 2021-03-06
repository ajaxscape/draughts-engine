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
  constructor (state, currentPlayer) {
    if (state) {
      this.state = state.map((row) => row.map((col) => col))
    } else {
      this.state = initState()
    }
    this.currentPlayer = currentPlayer || WHITE
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

  getCell (col, row) {
    return this.state[row][col]
  }

  setCell (col, row, value) {
    this.state[row][col] = value
  }

  static _isValid (col, row) {
    return !((col % 2 && row % 2) ||
      (!(col % 2) && !(row % 2)) ||
      col < 0 ||
      col > 7 ||
      row < 0 ||
      row > 7)
  }

  static _getPos (alpha) {
    if (alpha.length !== 2) {
      throw new Error(`Invalid position (${alpha})`)
    }
    const col = 'abcdefgh'.indexOf(alpha[0])
    const row = parseInt(alpha[1]) - 1
    return [col, row]
  }

  validTarget (col, row, colDiff, rowDiff) {
    const jumpedCol = col + colDiff
    const jumpedRow = row + rowDiff
    const jumpTargetCol = col + colDiff * 2
    const jumpTargetRow = row + rowDiff * 2

    if (!Game._isValid(jumpedCol, jumpedRow)) {
      return
    }

    const jumpedCell = this.getCell(jumpedCol, jumpedRow)
    if (jumpedCell === EMPTY) {
      if (this.jumping) {
        return // Must continue to jump
      }
      return {col: jumpedCol, row: jumpedRow}
    }

    if (!Game._isValid(jumpTargetCol, jumpTargetRow)) {
      return
    }

    const jumpTargetCell = this.getCell(jumpTargetCol, jumpTargetRow)
    if (jumpTargetCell !== EMPTY) {
      return
    }

    if (this.getCell(col, row).toUpperCase() !== jumpedCell.toUpperCase()) {
      return {col: jumpTargetCol, row: jumpTargetRow, jumpedCol, jumpedRow}
    }
  }

  getPossibleTargets (source) {
    const list = []
    const [col, row] = Game._getPos(source)
    if (!Game._isValid(col, row)) {
      return list
    }
    const sourceCell = this.getCell(col, row)
    if (sourceCell !== WHITE) {
      list.push(this.validTarget(col, row, -1, -1))
      list.push(this.validTarget(col, row, 1, -1))
    }
    if (sourceCell !== BLACK) {
      list.push(this.validTarget(col, row, -1, 1))
      list.push(this.validTarget(col, row, 1, 1))
    }
    return list.filter((target) => target)
  }

  move (source, target) {
    const [sourceCol, sourceRow] = Game._getPos(source)
    const [targetCol, targetRow] = Game._getPos(target)
    if (this.jumping && this.jumping !== source) {
      throw new Error(`Invalid move (${source}, ${target})`)
    }
    if (!Game._isValid(sourceCol, sourceRow) || !Game._isValid(targetCol, targetRow)) {
      throw new Error(`Invalid move (${source}, ${target})`)
    }
    const sourceCell = this.getCell(sourceCol, sourceRow)
    const targetCell = this.getCell(targetCol, targetRow)
    if (sourceCell.toLowerCase() !== this.currentPlayer || targetCell !== EMPTY) {
      throw new Error(`Invalid move (${source}, ${target})`)
    }

    // Get the valid move
    const validMove = this.getPossibleTargets(source)
      .filter(({col, row}) => (targetCol === col && targetRow === row))
      .pop()

    // Only continue if this is a valid move
    if (!validMove) {
      throw new Error(`Invalid move (${source}, ${target})`)
    }

    // Make the move now we know it's valid
    this.setCell(targetCol, targetRow, this.getCell(sourceCol, sourceRow))
    this.setCell(sourceCol, sourceRow, EMPTY)

    const {jumpedCol, jumpedRow} = validMove
    if (jumpedCol && jumpedRow) {
      this.setCell(jumpedCol, jumpedRow, EMPTY)
      this.jumping = target
    }

    // Make a draught a king (uppercase) if eligible
    if (this.currentPlayer === WHITE && targetRow === 7) {
      this.setCell(targetCol, targetRow, 'W')
    }
    if (this.currentPlayer === BLACK && targetRow === 0) {
      this.setCell(targetCol, targetRow, 'B')
    }

    if (this.jumping) {
      if (!this.getPossibleTargets(target).length) {
        this.jumping = false
      }
    }

    // Switch to the next player if there are no possible targets
    if (!this.jumping) {
      this.currentPlayer = this.currentPlayer === WHITE ? BLACK : WHITE
    }
    return this
  }
}
