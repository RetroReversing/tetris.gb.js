var _ = require('lodash');
var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('tetris.sym');
var game_json = require('./tetris.gb.js');

let current_category = '';
const BANK_SIZE=0x4000;

var non_rom_labels = {};
var rom_labels={};

lr.on('error', function (err) {
	// 'err' contains error object
});

function parse_rom_address(hex_address_with_bank) {
    var components_of_address = _.split(hex_address_with_bank,':');
    var bank_number = +components_of_address[0];
    var full_rom_address = +("0x"+components_of_address[1]);
    if (full_rom_address > 0x8000) {
        //
        // Special case where its actually reffering to other parts of memory (WRAM, HRAM etc)
        //
        return {memory_type:"OTHER",addr:full_rom_address};
    }
    //
    // The second bank is changeable so add
    //
    if (bank_number>1) {
        full_rom_address += (BANK_SIZE*bank_number);
    }
    return {memory_type:"ROM",addr:full_rom_address};
}

function parse_label(line) {
    var components_of_line = _.split(line,' ');
    var rom_address = parse_rom_address(components_of_line[0]);
    var label_name = components_of_line[1];

    if (rom_address.memory_type === 'OTHER') {
        non_rom_labels[rom_address.addr] = label_name;
    }
    else {
        rom_labels[rom_address.addr] = label_name;
        //console.log(rom_address.addr, rom_labels[rom_address.addr]);
    }

}

lr.on('line', function (line) {
    if (_.startsWith(line,';')) return;
    if (line === '') return;
    if (_.startsWith(line,'[')) {
        current_category = line;
        return;
    }
    if (current_category === '[labels]') {
        parse_label(line);
        return;
    }
    //console.log(current_category,"::",line)
	// 'line' contains the current line without the trailing newline character.
});

lr.on('end', function () {
	// All lines are read, file is closed now.
    add_labels_to_json();
});

function add_labels_to_json() {
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

        // _.each(array_of_addr_in_range, function(addr) {
        //     if (rom_labels[addr]) {
        //         //console.log(rom_labels[addr]);
        //         game_json[addr_range].labels.push(rom_labels[addr]);
        //     }
        // });
        //var labels_in_range = _.filter(rom_labels, function(o) { return !o.active; });

        //console.log(value.labels);
    })
    //console.log(JSON.stringify(game_json,null,4));
    console.log(JSON.stringify(rom_labels,null,4));

}