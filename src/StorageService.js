/**
 * @fileoverview
 */

goog.provide('com.dublook.chatrello.StorageService');

goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.HTML5LocalStorage');

/**
 * @constructor
 */
com.dublook.chatrello.StorageService = function () {
  this.storage = new goog.storage.mechanism.HTML5LocalStorage();
};

/**
 * @public
 */
com.dublook.chatrello.StorageService.prototype.get = function(key) {
  return this.storage.get(key);
};

/**
 * @public
 */
com.dublook.chatrello.StorageService.prototype.set = function(key, value) {
  this.storage.set(key, value);
};

/**
 * @public
 */
com.dublook.chatrello.StorageService.prototype.remove = function(key) {
  this.storage.remove(key);
};
