const assert = require('assert');
const ParseSymFile = require('../symbol_parsing/parseSymFile');
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
    //assert.equal(fs.existsSync('../dist/TestGame/game.json'), true, "expect game.json output file to exist");
    //assert.equal(fs.existsSync('../dist/TestGame/symbols.json'), true, "expect symbols.json output file to exist");
}

describe('#parseSymFiles(gameName,game_json)', function() {
    it('should return rom labels as a json object', function() {
      assert.equal(-1, [1,2,3].indexOf(-1));
      var gameJson = require('../TestGame/TestGame.json');
      ParseSymFile.parseSymFiles('TestGame',gameJson).then(callbackForCheckingFiles);
    });
  });
});