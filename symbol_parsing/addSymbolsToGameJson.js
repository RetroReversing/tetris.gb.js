var _ = require('lodash');
const path = require('path');
var createHTML = require('../html_generation/createHtml');
const config = require('../config');

module.exports.game_json_loop = function(game_json, handle_byte_callback) {
    _.each(game_json,function(value,addr_range) {
        var range = _.split(addr_range,"-");
        var min = range[0];
        var max = range[1];

        for (var i=min;i<=max;i++) {
            var start_of_new_block=(i===min);
            handle_byte_callback(i,addr_range, game_json[addr_range],start_of_new_block);
        }
     })
}

module.exports.add_labels_to_json=function(rom_labels, gameName, game_json) {

    function push_labels_to_correct_range(i,addr_range) {
        if (rom_labels[i]) {
                if (!game_json[addr_range].labels) {
                    game_json[addr_range].labels = []
                }
                game_json[addr_range].labels.push(rom_labels[i]);
            }
    }
    module.exports.game_json_loop(game_json,push_labels_to_correct_range);

    _.each(game_json,function(value,addr_range) {
        var range = _.split(addr_range,"-");
        var min = range[0];
        var max = range[1];

        for (var i=min;i<=max;i++) {
            if (rom_labels[i]) {
                if (!game_json[addr_range].labels) {
                    game_json[addr_range].labels = []
                }
                game_json[addr_range].labels.push(rom_labels[i]);
            }
        }
    })

    const pathToJsonSymbolFile = path.join(config.distDirectory,gameName,'symbols.json')
    createHTML.writeToFile(pathToJsonSymbolFile, JSON.stringify(rom_labels,null,4));

}