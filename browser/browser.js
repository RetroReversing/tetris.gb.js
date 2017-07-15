var Clusterize = require('clusterize.js');
window.$ = require('jquery');
var _ = require('lodash');
require('../node_modules/clusterize.js/clusterize.css');
// require('./cluster.jsx');
require('./browser.css');
require('materialize-css/dist/css/materialize.min.css');
//require('materialize-css/dist/js/materialize.min.js');

import Rx from 'rx';
window.subject = new Rx.Subject();

var subscription = subject.subscribe(function (data) {
	console.log('data: ' + data);
});



console.log('about to clusterize');

const colour_map = {
    data: '#FFFFCC' ,
    code: '#CCDDFF',
    unknown: '#FFAACC',
    bgmap: '#CCFFCC',
    graphics: '#CCAACC'
}

function parseAddress(addressKey) {
    return +(addressKey.split('-')[0])
}

function setup_clusterize(game_data) {
    var data = [];
    _.each(Object.keys(game_data), function(a,b) {
        var colour = colour_map[game_data[a].type];
        // console.error(a,game_data[a]);
        var width=( (parseAddress(a) %  0x4000) / 0x4000) *100;
        var labelsHtml = '';
        if (game_data[a]['labels']) {
            console.log(game_data[a]['labels']);
            game_data[a]['labels'].forEach(label_name => {labelsHtml+=label_name+' ';});
        }
        data.push(`<div  onclick="window.subject.onNext('${a}')" class='addrListElement progress-parent'>
        <span class="progress-bar" style="width: ${width}%;background:${colour}"></span>
        <a>${a} (<strong style="background:${colour}">${game_data[a].type}</strong>) <small>${labelsHtml}</small></a>
        </div>`);
    } );
    var clusterize = new Clusterize({
    rows: data,
    scrollId: 'scrollArea',
    contentId: 'contentArea',
    rows_in_block:100,
    callbacks: {
        clusterWillChange: function(a,b,c) {
            console.log('Cluster about to change',a,b,c);
        }
    }
    });
}

// var iframes = $('iframe');

//     $('button').click(function() {
//         iframes.attr('src', function() {
//             return $(this).data('src');
//         });
//     });

//     iframes.attr('data-src', function() {
//         var src = $(this).attr('src');
//         $(this).removeAttr('src');
//         return src;
//     });

window.onload = function() {
        var canvas=document.getElementById("myCanvas");
        var context=canvas.getContext("2d");
        var image=document.getElementById("vis");


        // save the unrotated context of the canvas so we can restore it later
        // the alternative is to untranslate & unrotate after drawing
        context.save();

        // // move to the center of the canvas
        context.translate(canvas.width/2,canvas.height/2);

        // // rotate the canvas to the specified degrees
        context.rotate(270*Math.PI/180);

        // // draw the image
        // // since the context is rotated, the image will be rotated also
        context.drawImage(image,(-canvas.width),(-canvas.height/2));

        // // we’re done with the rotating so restore the unrotated context
        context.restore();
    };

    $.getJSON( "./game.json", function( game_data ) {
        setup_clusterize(game_data);
    });
    // require('./events.js');
    // require('./redux.jsx');
    require('./romData.jsx');
