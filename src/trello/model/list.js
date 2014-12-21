/**
 * @fileoverview
 */

goog.provide('com.dublook.chatrello.trello.model.List');

/**
 * @constructor
 * @param {Object} boardJson Trello board
 * @param {Object} listJson Trello list
 */
com.dublook.chatrello.trello.model.List = function(boardJson, listJson) {
  this.id = listJson.id;
  this.name = listJson.name;
  this.boardId = boardJson.id;
  this.boardName = boardJson.name;
};

com.dublook.chatrello.trello.model.List.CACHE = {};

/**
 * @public
 * @param {com.dublook.chatrello.trello.model.List} listInstane 
 */
com.dublook.chatrello.trello.model.List.add= function(listInstane) {
  com.dublook.chatrello.trello.model.List.CACHE[listInstane.id] = listInstane;
};

/**
 * @public
 * @param {string} listId
 * @return {com.dublook.chatrello.trello.model.List} 
 */
com.dublook.chatrello.trello.model.List.get = function(listId) {
  return com.dublook.chatrello.trello.model.List.CACHE[listId];
};
