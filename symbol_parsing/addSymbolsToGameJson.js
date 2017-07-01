var _ = require('lodash');
var game_json = require('../tetris/tetris.gb.js');

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

module.exports.add_labels_to_json=function(rom_labels) {

    function push_labels_to_correct_range(i,addr_range) {
        if (rom_labels[i]) {
                if (!game_json[addr_range].labels) {
                    game_json[addr_range].labels = []
                }
                game_json[addr_range].labels.push(rom_labels[i]);
            }
    }

    module.exports.game_json_loop(game_json,push_labels_to_correct_range);
    //console.log('add labels to json');
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
    //console.log(JSON.stringify(game_json,null,4));
    console.log(JSON.stringify(rom_labels,null,4));

}