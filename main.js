const HtmlGeneration = require('./html_generation/main');
const parseSymFile = require('./symbol_parsing/parseSymFile.js');

const gameName='tetris';
parseSymFile.parseSymFiles(gameName);
HtmlGeneration.generateHTMLForGame(gameName);