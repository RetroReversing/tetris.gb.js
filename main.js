const HtmlGeneration = require('./html_generation/main');
const parseSymFile = require('./symbol_parsing/parseSymFile.js');

const gameName='tetris';
var game_json = require('./'+gameName+'/'+gameName+'.json');
parseSymFile.parseSymFiles(gameName, game_json);
HtmlGeneration.generateHTMLForGame(gameName, game_json);