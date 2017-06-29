var _ = require('lodash');
var game_json = require('../tetris/tetris.gb.js');

module.exports.add_labels_to_json=function(rom_labels) {
    //console.log('add labels to json');
    _.each(game_json,function(value,addr_range) {
        var range = _.split(addr_range,"-");
        var min = range[0];
        var max = range[1];
        //var array_of_addr_in_range = _.range(min,max);
        //game_json[addr_range].labels = [];
        //console.log(min,max);
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