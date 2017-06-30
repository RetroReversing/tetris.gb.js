var pixel= require('pixel');
var svg= require('pixel-to-svg');
var fs = require('fs');
var gameJsonHandler = require('../symbol_parsing/addSymbolsToGameJson.js');

global.pixel_columns = [];
var colour_type_map = {
    data: [255,0,0,255], //red for data
    code: [0,255,255,255], //cyan for code
    unknown: [0,0,0,255], //black for unkown
    bgmap: [0,0,255,255], //blue fot bgmap
    graphics: [0,255,0,255] //green for graphics
}

function writeColourToPixelData(i,addr_range,range_data) {
    var colour = colour_type_map[range_data.type]
    global.pixel_columns = global.pixel_columns.concat(colour);
}


writeGameVis('tetris');


function writeGameVis(gameName) {
    var game_json = require('../'+gameName+'/'+gameName+'.out.json');
    gameJsonHandler.game_json_loop(game_json,writeColourToPixelData);

    var pixelsAsUInt8Array = new Uint8ClampedArray(global.pixel_columns);
    var svgfile = svg.convert({data:pixelsAsUInt8Array,width:64,height:500});
    fs.writeFile("./dist/"+gameName+".romVis.svg", svgfile, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});

}




//console.log(svg.convert({data:pixelsAsUInt8Array,width:64,height:500}));


