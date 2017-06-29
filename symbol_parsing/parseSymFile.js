var _ = require('lodash');
var LineByLineReader = require('line-by-line');

let current_category = '';
const BANK_SIZE=0x4000;

var non_rom_labels = {};
var rom_labels={};

const addSymbolsToGameJson = require('./addSymbolsToGameJson.js');

module.exports.parseSymFiles = function() {
    const lr = new LineByLineReader('./tetris/tetris.sym');
    lr.on('error', handle_dot_sym_parsing_error);
    lr.on('line', handle_dot_sym_file_line);
    lr.on('end', end_of_dot_sym_file);
}

function handle_dot_sym_parsing_error(err) {
    console.error("Error parsing .sym file",err);
}



//
//
//
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

//
//
//
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

function handle_dot_sym_file_line(line) {
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
}

function end_of_dot_sym_file() {
    // All lines are read, file is closed now.
    console.log('closed file');
    addSymbolsToGameJson.add_labels_to_json(rom_labels);
}