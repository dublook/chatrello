/**
 * @fileoverview
 */
goog.provide('com.dublook.chatrello.chatwork.ChatworkCtrl');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.Timer');
goog.require('goog.result');
goog.require('goog.result.SimpleResult');

/**
 * @constructor
 */
com.dublook.chatrello.chatwork.ChatworkCtrl = function(){
};

/**
 * @public
 * @param {string} msg message to send.
 */
com.dublook.chatrello.chatwork.ChatworkCtrl.prototype.sendMessage = function(msg){
  goog.dom.getElement('_chatText').value = msg;
  goog.dom.getElement('_sendButton').click();
};

/**
 * @public
 * @param {string} name
 */
com.dublook.chatrello.chatwork.ChatworkCtrl.prototype.userNameLike = function(name){
  return goog.dom.getElement('_myStatusName').innerHTML.indexOf(name) > -1;
};

/**
 * @public
 */
com.dublook.chatrello.chatwork.ChatworkCtrl.prototype.waitForContentArea = function(){
  var result = new goog.result.SimpleResult();
  var timer = new goog.Timer(1000);
  timer.listen(goog.Timer.TICK, function(e) {
    if (goog.dom.getElementByClass('promotionContent')) {
      e.target.dispose();
      result.setValue(e);
    }
  });
  timer.start();
  return result;
};

/**
 * @public
 * @param {Node} content
 */
com.dublook.chatrello.chatwork.ChatworkCtrl.prototype.showContent = function(content){
  var $promotionArea = goog.dom.getElementByClass('promotionArea');
  goog.dom.removeChildren($promotionArea);
  $promotionArea.appendChild(content);
};

/**
 * @public
 * @param {goog.ui.Component} $content
 */
com.dublook.chatrello.chatwork.ChatworkCtrl.prototype.decorateContent = function($content){
  var $promotionArea = goog.dom.getElementByClass('promotionArea');
  goog.dom.removeChildren($promotionArea);
  $content.render($promotionArea);
};


/**
 * @private
 * @param {Selection} selection
 * @return {Array.<Node>}
 */
com.dublook.chatrello.chatwork.ChatworkCtrl.prototype.findMessageNodes_ = function(selection) {
  if (selection.rangeCount === 0) {
    return [];
  }
  var range = selection.getRangeAt(0);
  var container = range.commonAncestorContainer;
  if (container.id === '_timeLine') {
    var allMessageNodes = container.querySelectorAll('._message');
    var allMessageNodesCnt = allMessageNodes ? allMessageNodes.length : 0;
    var selectedNodes = [];
    var isInRange = false;
    for (var i = 0; i< allMessageNodesCnt; i++) {
      var messageNode = allMessageNodes[i];
      if (isInRange || goog.dom.contains(messageNode, range.startContainer)) {
        isInRange = true;
        selectedNodes.push(messageNode);
        if (goog.dom.contains(messageNode, range.endContainer)) {
          break;
        }
      } else {
        continue;
      }
    }
    return selectedNodes;
  }
  var parentNode = range.startContainer.parentNode;
  if (parentNode && parentNode.nodeName === 'PRE') {
    while (parentNode = parentNode.parentNode) {
      if (goog.dom.classlist.contains(parentNode, '_message')) {
        return [parentNode];
      }
    }
  }
  return [];
};

/**
 * @private
 * @param {Array.<Node>} messageNodes
 * @return {string}
 */
com.dublook.chatrello.chatwork.ChatworkCtrl.prototype.parseCardTitle_ = function(messageNodes) {
  var messages = goog.array.map(messageNodes, function(messageNode) {
    return messageNode.querySelector('.chatTimeLineMessageArea > pre').innerText;
  });
  return messages.join(' ');
};

/**
 * @private
 * @param {Node} messageNodes
 * @return {string}
 */
com.dublook.chatrello.chatwork.ChatworkCtrl.prototype.getMessageId_ = function(messageNode) {
  return messageNode.getAttribute('data-mid');
};

/**
 * @public
 * @param {Selection} selection
 * @return {title:string, description:string}
 */
com.dublook.chatrello.chatwork.ChatworkCtrl.prototype.getCardDraft = function(selection) {
  var messageNodes = this.findMessageNodes_(selection);
  if (messageNodes.length === 0) {
    return null;
  }
  var title = this.parseCardTitle_(messageNodes);
  var messageId = this.getMessageId_(messageNodes[0]);
  return {
    title: title,
    description: window.location.href + '-' + messageId
  };
};
