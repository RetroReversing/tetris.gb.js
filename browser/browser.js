import * as _ from 'lodash';
import Rx from 'rx';

var Clusterize = require('clusterize.js');

const $ = require('jquery');
window.$ = $;

require('../node_modules/clusterize.js/clusterize.css');

require('materialize-css/dist/css/materialize.min.css');
require('./browser.css');

window.gameData = {};

window.subject = new Rx.Subject();

var subscription = subject.subscribe(function (data) {
  console.log('data: ' + data);
});

console.log('about to clusterize');

const colour_map = {
  data: '#FFFFCC',
  code: '#CCDDFF',
  unknown: '#FFAACC',
  bgmap: '#CCFFCC',
  graphics: '#CCAACC'
};

function parseAddress (addressKey) {
  return +(addressKey.split('-')[0]);
}

function createHTMLForListElement (gameData, resultList, a, b) {
  var colour = colour_map[gameData[a].type];
            // console.error(a,game_data[a]);
  const width = ((parseAddress(a) % 0x4000) / 0x4000) * 100;
  const len = gameData[a].len;
  const lenColour = len > 50 ? 'red' : 'blue';
  var labelsHtml = '';
  if (gameData[a]['labels']) {
    console.log(gameData[a]['labels']);
    gameData[a]['labels'].forEach(labelName => { labelsHtml += labelName + ' '; });
  }
  resultList.push(`<div  onclick="window.subject.onNext('${a}')" class='addrListElement progress-parent'>
            <div class="chip" style="background:${colour}">${gameData[a].type}</div>
            <span class="progress-bar" style="width: ${width}%;background:${colour}"></span>
            <a>${a}<small>${labelsHtml}</small> </a>
            <span data-badge-caption="bytes" class="new badge ${lenColour}">${len}</span>
            </div>`);
}

function filterBasedOnDataType (selectedFilters, gameData, value, index) {
  return _.includes(selectedFilters, gameData[value].type);
}

const filterFunctionMap = {
  'labelled': function (selectedFilters, gameData, value, index) {
    if (gameData[value].labels && gameData[value].labels.length > 0) {
      return true;
    }
    return false;
  }
};

function chainMultipleFilterFunctions (selectedFilters, gameData, filterFunctions, key, value) {
  let returnValue = false;
  _.each(filterFunctions, function (func) {
    if (func(selectedFilters, gameData, key, value)) {
      console.log('set return true');
      returnValue = true;
    }
  });
  return returnValue;
}

/*
    Filter Rows
*/
function filterRows (gameData, selectedFilters, filterFunctions) {
  var resultList = [];
  const sortedKeys = Object.keys(gameData);
  let filteredKeys = sortedKeys;
  if (selectedFilters && selectedFilters.length > 0) {
    filteredKeys = _.filter(sortedKeys, chainMultipleFilterFunctions.bind(this, selectedFilters, gameData, filterFunctions));
  }
  _.each(filteredKeys, createHTMLForListElement.bind(this, gameData, resultList));
  return resultList;
}

var clusterize = null;
function clusterWillChange (a, b, c) {
  console.log('Cluster about to change due to scroll ', a, b, c);
}

function setup_clusterize (game_data) {
  const data = filterRows(game_data, [], filterBasedOnDataType);
  clusterize = new Clusterize({
    rows: data,
    scrollId: 'scrollArea',
    contentId: 'contentArea',
    rows_in_block: 50,
    callbacks: {
      clusterWillChange: clusterWillChange
    }
  });
}

window.onload = function () {
//         var canvas=document.getElementById("myCanvas");
//         var context=canvas.getContext("2d");
//         var image=document.getElementById("vis");

//         // save the unrotated context of the canvas so we can restore it later
//         // the alternative is to untranslate & unrotate after drawing
//         context.save();

//         // // move to the center of the canvas
//         context.translate(canvas.width/2,canvas.height/2);

//         // // rotate the canvas to the specified degrees
//         context.rotate(270*Math.PI/180);

//         // // draw the image
//         // // since the context is rotated, the image will be rotated also
//         context.drawImage(image,(-canvas.width),(-canvas.height/2));

//         // // we’re done with the rotating so restore the unrotated context
//         context.restore();

};

$(document).ready(function () {
  $('select').material_select();
  $('#data-type-filter').change(function () {
    const selectedFilters = $('#data-type-filter').first().val();
    // console.log('Selection change', selectedFilters);
    clusterize.update(filterRows(gameData, selectedFilters, [filterBasedOnDataType]));
  });
  $('#data-filter').change(function () {
    const selectedFilters = $('#data-filter').first().val();
    console.log('Selection change', selectedFilters);
    const filterFunctions = _.map(selectedFilters, function (value) {
      if (filterFunctionMap[value]) { return filterFunctionMap[value]; }
      return null;
    });
    //  TODO problem: there can be multiple selected filters at once!
    clusterize.update(filterRows(gameData, selectedFilters, filterFunctions));
  });
});

$.getJSON('./game.json', function (game_data) {
  gameData = game_data;
  setup_clusterize(game_data);
});
    // require('./events.js');
    // require('./redux.jsx');
require('./romData.jsx');
