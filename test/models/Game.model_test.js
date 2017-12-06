const Game = require('../../src/models/Game.model')
const {expect} = require('chai')

describe("Game", function() {
  describe("constructor", function () {
    it("should have a default state", function () {
      var game = new Game()
      expect(game.state).to.equal({})
    })

    it("should set game's name if provided", function () {
      var game = new Game("Kate")
      expect(game.name).to.equal("Kate")
    })
  })
})