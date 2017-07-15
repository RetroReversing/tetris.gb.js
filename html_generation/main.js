const createRomDataVis=require("./createRomDataVis");
const createHTML=require("./createHTML");

function generateHTMLForGame(gameName,json) {
    createRomDataVis.writeGameVis(gameName,json);
    createHTML.createHTML(gameName,json);
}
module.exports.generateHTMLForGame = generateHTMLForGame;