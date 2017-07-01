const jsdom = require("jsdom");
const JsonHuman = require('json-human');
const fs = require('fs');
const handlebars = require('handlebars');
const { JSDOM } = jsdom;

//
// Uses json-human to write a html file of the rom data from the json
//
function writeGameHTML(gameName) {
    const { window } = new JSDOM(`<html></html>`);
    const { document } = (window).window;

    global.document = document;

    var json = require('../'+gameName+'/'+gameName+'.out.json');
    var node = JsonHuman.format(json);
    document.body.appendChild(node);
    //console.log(gameName,document.body);
    return {table:document.body.innerHTML}
}

function writeToFile(filename, contents, callback) {
    fs.writeFile(filename, contents, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        if (callback)
        {callback();}
    });
}

function populate_template(template, gameName) {
    var data=writeGameHTML(gameName);
    var html = template(data);
    writeToFile('../dist/'+gameName+'.html',html);
    //console.log('Handlebars:',html)
}

fs.readFile('./template.html', 'utf-8', function(error, source){
    var template = handlebars.compile(source);
    populate_template(template, 'tetris');
});