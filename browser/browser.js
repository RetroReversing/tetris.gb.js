var Clusterize = require('clusterize.js');
window.$ = require('jquery');
var _ = require('lodash');
require('../node_modules/clusterize.js/clusterize.css');

console.log('about to clusterize');
var data = ['<tr>…</tr>', '<tr>…</tr>'];
_.times(10000, function(i) {data.push(`<tr><p>${i}</p></tr>`);});
var clusterize = new Clusterize({
  rows: data,
  scrollId: 'scrollArea',
  contentId: 'contentArea',
  rows_in_block:50,
  callbacks: {
    clusterWillChange: function(a,b,c) {
        console.log('Cluster about to change',a,b,c);
    }
  }
});

var iframes = $('iframe');

    $('button').click(function() {
        iframes.attr('src', function() {
            return $(this).data('src');
        });
    });

    iframes.attr('data-src', function() {
        var src = $(this).attr('src');
        $(this).removeAttr('src');
        return src;
    });

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