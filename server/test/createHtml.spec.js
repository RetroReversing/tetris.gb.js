const createHtml = require('../html_generation/createHtml');
//TODO move into its own utility class for tests
function removeFiles(filesToRemove) {
    filesToRemove.forEach(
        function(filePath) {
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath);
            }
        }
    );
}

describe('Create HTML for Rom', function() {

    beforeEach(function() {
    })

    it('should create a temp file when writeToFile is called', function(done) {
        const gameJson = require('../TestGame/TestGame.json');
        createHtml.writeToFile('Tempfile.test.txt','Created via Automated test', done)

    }).timeout(50000);
});