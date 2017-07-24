var _ = require('lodash');
const path = require('path');
var createHTML = require('../html_generation/createHtml');
const config = require('../config');

module.exports.game_json_loop = function (game_json, handle_byte_callback) {
  _.each(game_json, function (value, addr_range) {
    var range = _.split(addr_range, '-');
    var min = range[0];
    var max = range[1];
    //
    // # We want to addthe start address to each element so that we can sort on the UI
    //
    game_json[addr_range].start = +min;

    for (var i = min; i <= max; i++) {
      var start_of_new_block = (i === min);
      handle_byte_callback(i, addr_range, game_json[addr_range], start_of_new_block);
    }
  });
};

module.exports.add_labels_to_json = function (rom_labels, gameName, game_json) {
  function push_labels_to_correct_range (i, addr_range) {
    if (rom_labels[i]) {
      if (!game_json[addr_range].labels) {
        game_json[addr_range].labels = [];
      }
      game_json[addr_range].labels.push(rom_labels[i]);
    }
  }
  module.exports.game_json_loop(game_json, push_labels_to_correct_range);

  function add_rom_labels (addr_range, current_addr) {
    if (!rom_labels[current_addr]) return;
    if (!game_json[addr_range].labels) {
      game_json[addr_range].labels = [];
    }
    game_json[addr_range].labels.push(rom_labels[current_addr]);
  }

  function splitUpBasedOnRomLabels (min, max, addrRange) {
    for (var i = min; i <= max; i++) {
      if (rom_labels['' + i]) {
        let returnData = splitUpAddrRange(addrRange, +min, +max, i);
        addrRange = returnData[0];
        min = i;
      }
    }
  }

  function removeExcessData (newRange, min, max) {
    console.error('removeExcessData', newRange, min, max);
    const filteredData = _.filter(game_json[newRange].data, function (value, index) {
        // console.info('filter', min + index, (min + index) <= max);
      return (min + index) < max;
    });
    game_json[newRange].data = filteredData;
  }

  function splitUpAddrRange (addrRange, min, max, currentAddr) {
    const initialRange = JSON.stringify(game_json[addrRange]);
    const newRange = '0x' + (min).toString(16) + '-0x' + (currentAddr - 1).toString(16);
    game_json[newRange] = JSON.parse(initialRange);
    game_json[newRange].len = (currentAddr) - min;
    game_json[newRange].labels = [];
    game_json[newRange].start = +min;
    add_rom_labels(newRange, min);
    removeExcessData(newRange, min, currentAddr);

    const newRangeForSecondHalf = '0x' + (currentAddr).toString(16) + '-0x' + (max).toString(16);
    game_json[newRangeForSecondHalf] = JSON.parse(initialRange);
    game_json[newRangeForSecondHalf].labels = [];
    game_json[newRangeForSecondHalf].start = +currentAddr;

    delete game_json[addrRange];

    add_rom_labels(newRangeForSecondHalf, currentAddr);
    removeExcessData(newRangeForSecondHalf, currentAddr, max);
    return [newRangeForSecondHalf, currentAddr];
  }

  _.each(game_json, function (value, addr_range) {
    var range = _.split(addr_range, '-');
    var min = range[0];
    var max = range[1];

    if (rom_labels[min]) {
      add_rom_labels(addr_range, min);
    }

    splitUpBasedOnRomLabels(min, max, addr_range);
  });

  const pathToJsonSymbolFile = path.join(config.distDirectory, gameName, 'symbols.json');
  createHTML.writeToFile(pathToJsonSymbolFile, JSON.stringify(rom_labels, null, 4));

  function compareObjectKeyByAddresses (gameJson, key1, key2) {
    return (gameJson[key1].start) - (gameJson[key2].start);
  }

  function sortJsonObjectKeys (gameJson) {
    var ordered = {};
    Object.keys(gameJson).sort(compareObjectKeyByAddresses.bind(this, gameJson)).forEach(function (key) {
      ordered[key] = gameJson[key];
    });
    return ordered;
  }

  const pathToGameJsonFile = path.join(config.distDirectory, gameName, 'game.json');
  var orderedJson = sortJsonObjectKeys(game_json);
  createHTML.writeToFile(pathToGameJsonFile, JSON.stringify(orderedJson, null, 4));
};
