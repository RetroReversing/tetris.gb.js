const HtmlGeneration = require('./html_generation/main');
const parseSymFile = require('./symbol_parsing/parseSymFile.js');
const AddSymbolsToGameJson = require('./symbol_parsing/addSymbolsToGameJson');


function modifyGameJSONToAddRomSymbols(rom_labels) {
    AddSymbolsToGameJson.add_labels_to_json(rom_labels, gameName, game_json);
}

function createHtmlForGame(gameName, game_json) {
    HtmlGeneration.generateHTMLForGame(gameName, game_json);
    return game_json;
}

function generateGame(gameName) {
    var game_json = require('./'+gameName+'/'+gameName+'.json');
    return parseSymFile.parseSymFiles(gameName, game_json)
                .then(modifyGameJSONToAddRomSymbols.bind(this,gameName, game_json))
                .then(createHtmlForGame.bind(this,gameName, game_json));
}
module.exports.generateGame = generateGame;

if (typeof require != 'undefined' && require.main==module) {
    generateGame('tetris');
}

