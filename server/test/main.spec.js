const assert = require('assert');
const Main = require('../main');
const fs = require('fs');

describe('Parse Sym File', function() {

beforeEach(function() {
    var filesToRemove = ['../dist/TestGame/game.json', '../dist/TestGame/symbols.json']
    filesToRemove.forEach(
        function(filePath) {
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath);
            }
        }
    );
})

function callbackForCheckingFiles(rom_labels) {
    assert.equal(Object.keys(rom_labels).length >= 1165, true, "")
    assert.equal(fs.existsSync('../dist/TestGame/game.json'), true, "expect game.json output file to exist");
    assert.equal(fs.existsSync('../dist/TestGame/symbols.json'), true, "expect symbols.json output file to exist");
}

describe('#main server-side modification', function() {
    it('should create game.json and symbols.json file', function() {
      var gameJson = require('../TestGame/TestGame.json');
      Main.generateGame('TestGame').then(callbackForCheckingFiles);
    });
  });
});