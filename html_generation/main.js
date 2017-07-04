const createRomDataVis=require("./createRomDataVis");
const createHTML=require("./createHTML");

function generateHTMLForGame(gameName) {
    createRomDataVis.writeGameVis(gameName);
    createHTML.createHTML(gameName);
}
module.exports.generateHTMLForGame = generateHTMLForGame;