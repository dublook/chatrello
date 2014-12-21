/**
 * @fileoverview
 */

goog.provide('com.dublook.chatrello.ScriptIncluder');

goog.require('goog.result');
goog.require('goog.result.SimpleResult');


/**
 * @constructor
 */
com.dublook.chatrello.ScriptIncluder = function () {
};

com.dublook.chatrello.ScriptIncluder.prototype.require = function(src) {
    var result = new goog.result.SimpleResult();
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;

    // callback
    var callback = function() {
        console.log(src + ' loaded.');
        console.log(script.readyState);
        result.setValue(src);
    };
    script.onreadystatechange = callback;
    script.onload = callback;
    document.body.appendChild(script);
    return result;
};
