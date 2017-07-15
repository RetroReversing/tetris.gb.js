const path = require('path');
const jsdom = require("jsdom");
const JsonHuman = require('json-human');
const fs = require('fs');
const handlebars = require('handlebars');
const { JSDOM } = jsdom;
const config = require('../config');
const htmlTemplatesPath= path.join(__dirname,'');
const assert = require('assert');
//
// Uses json-human to write a html file of the rom data from the json
//
function writeGameHTML(gameName, json) {
    const { window } = new JSDOM(`<html></html>`);
    const { document } = (window).window;

    global.document = document;

    save_game_json_to_dist(gameName, json);
    var node = JsonHuman.format(json);
    document.body.appendChild(node);
    return {table:document.body.innerHTML}
}

function writeToFile(filename, contents, callback) {
    fs.writeFile(filename, contents, function(err) {
        if(err) {
            return console.error(err);
        }
        console.log("The file "+filename+" was saved!");
        if (callback)
        {
            callback();
        }
    });
}
module.exports.writeToFile = writeToFile;

function populate_rom_contents_template(template, gameName, json) {
    assert(Object.keys(json).length>1,"Expected game json to have many keys")
    var data=writeGameHTML(gameName,json);
    var html = template(data);
    writeToFile(config.distDirectory+gameName+'/romContents.html',html);
}

function populate_index_template(template, gameName) {
    var html = template({});
    writeToFile(path.join(config.distDirectory,gameName,'/index.html'),html);
}

function save_game_json_to_dist(gameName, game_json) {
    writeToFile(path.join(config.distDirectory,gameName,'/game.json'),JSON.stringify(game_json));
}

module.exports.createHTML = function(gameName,json) {
    fs.readFile(path.join(htmlTemplatesPath,'romcontents.template.html'), 'utf-8', function(error, source){
        if (error)
        {
            console.error('Error reading file in createHTML:',error,source);
            return;
        }
        var template = handlebars.compile(source);
        populate_rom_contents_template(template, gameName, json);
    });

    fs.readFile(path.join(htmlTemplatesPath,'template.html'), 'utf-8', function(error, source){
        if (error)
        {
            console.error('Error reading file in createHTML:',error,source);
            return;
        }
        var template = handlebars.compile(source);
        populate_index_template(template, gameName);
    });
}

