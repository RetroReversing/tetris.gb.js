const jsdom = require("jsdom");
const JsonHuman = require('json-human');
const { JSDOM } = jsdom;

//
// Uses json-human to write a html file of the rom data from the json
//
function writeGameHTML(gameName) {
    const { window } = new JSDOM(`<html></html>`);
    const { document } = (window).window;

    global.document = document;

    var json = require('../'+gameName+'.out.json');
    var node = JsonHuman.format(json);
    document.body.appendChild(node);
    console.log(gameName,document.body);
}
writeGameHTML('tetris');