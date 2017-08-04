const path = require('path');
const pixel= require('pixel');
const svg= require('pixel-to-svg');
const fs = require('fs');
const PNG = require('pngjs2').PNG;
const createHTML = require('./createHtml');
const gameJsonHandler = require('../symbol_parsing/addSymbolsToGameJson.js');
const config = require('../config');

global.pixel_columns = [];
var colour_type_map = {
    data: [0XFF, 0XFF, 0xCC, 0xFF],// [255,0,0,255], //red for data
    code: [0xCC, 0xDD, 0xFF, 0xFF],//[0,255,255,255], //cyan for code
    unknown: [0xFF,0xAA,0xCC,0xFF],//[0,0,0,255], //black for unkown
    bgmap: [0xCC,0xFF,0xCC,0xFF],//[0,0,255,255], //blue fot bgmap
    graphics: [0xCC,0xAA,0xCC,0xFF],//[0,255,0,255] //green for graphics
}

var colour_opacity=255;

function writeColourToPixelData(i,addr_range,range_data,start_of_new_block) {
    var colour = colour_type_map[range_data.type];
    if (start_of_new_block) {
        colour_opacity = (colour_opacity===255)?50:255;
        //console.log(colour_opacity);
    }
    //colour[3]=colour_opacity;
    global.pixel_columns = global.pixel_columns.concat(colour);
}


function writeGameVis(gameName, game_json) {
    gameJsonHandler.game_json_loop(game_json,writeColourToPixelData);

    var pixelsAsUInt8Array = new Uint8ClampedArray(global.pixel_columns);
    var image_path = path.join(config.distDirectory,gameName,"/romVis.");
    var image_height = (pixelsAsUInt8Array.length/4)/64+1;

    //
    // PNG
    //
    var img_png = new PNG({width: 64, height: image_height})
    img_png.data = Buffer.from(pixelsAsUInt8Array);
    img_png.pack().pipe(fs.createWriteStream(image_path+'png'))

    //
    // SVG
    //
    var svgfile = svg.convert({data:pixelsAsUInt8Array,width:64,height:image_height});
    createHTML.writeToFile(image_path+'svg', svgfile);

}
module.exports.writeGameVis = writeGameVis;

if (typeof require != 'undefined' && require.main==module) {
    writeGameVis('tetris');
}
