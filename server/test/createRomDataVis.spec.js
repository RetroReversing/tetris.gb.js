const assert = require('assert');
const fs = require('fs');
const CreateRomDataVis = require('../html_generation/createRomDataVis');

function removeFiles(filesToRemove) {
    filesToRemove.forEach(
        function(filePath) {
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath);
            }
        }
    );
}

function callbackForCheckingFiles() {
    assert.equal(fs.existsSync('../dist/TestGame/romVis.svg'), true, "expect romVis.svg output file to exist");
    assert.equal(fs.existsSync('../dist/TestGame/romVis.png'), true, "expect romVis.png output file to exist");
}


describe('Create Image for Rom data visualization', function() {

    beforeEach(function() {
        var filesToRemove = ['../dist/TestGame/romVis.svg', '../dist/TestGame/romVis.png']
        removeFiles(filesToRemove);
    })

    it('should create svg and png files', function(done) {
        const gameJson = require('../TestGame/TestGame.json');
        CreateRomDataVis.writeGameVis('TestGame', gameJson);
        callbackForCheckingFiles();
        done();

    }).timeout(50000);
});