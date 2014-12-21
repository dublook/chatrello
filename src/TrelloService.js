/**
 * @fileoverview
 */

goog.provide('com.dublook.chatrello.trello.TrelloService');

goog.require('goog.net.XhrIo');
goog.require('goog.events');
goog.require('goog.dom');
goog.require('goog.string.format');
goog.require('goog.storage.Storage');
goog.require('goog.labs.net.xhr');
goog.require('goog.Promise');

goog.require('goog.ui.MenuButton');
goog.require('goog.ui.Menu');
goog.require('goog.ui.PopupMenu');
goog.require('goog.ui.SubMenu');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Textarea');
goog.require('goog.ui.LabelInput');

goog.require('com.dublook.chatrello.StorageService');
goog.require('com.dublook.chatrello.chatwork.ChatworkCtrl');
goog.require('com.dublook.chatrello.trello.model.List');

/**
 * @constructor
 */
com.dublook.chatrello.trello.TrelloService = function () {
};

// singleton
goog.addSingletonGetter(com.dublook.chatrello.trello.TrelloService);

/**
 * @const
 * @type {string}
 */
var API_ROOT = 'https://api.trello.com/1';

/**
 * @const
 * @type {string}
 */
var APP_KEY = 'f3ddc4ae7cd22c3205116b7d40f352c5';

/**
 * @const
 * @type {string}
 */
var TOKEN_KEY = 'com.dublook.chatrello.trello.TrelloService.token';


/**
 * @private
 * @param {string} href
 * @return {String} token key for Trello account.
 */
com.dublook.chatrello.trello.TrelloService.prototype.getToken_ = function(href) {
  var storage = new com.dublook.chatrello.StorageService();
  var token = storage.get(TOKEN_KEY);
  if (token) {
    return token;
  }

  if (href && goog.string.contains(href, 'token=')) {
    token = href.split('token=')[1];
    storage.set(TOKEN_KEY, token);
    return token;
  }

  return null;
};

/**
 * TODO convert to a component class
 * @private
 */
com.dublook.chatrello.trello.TrelloService.prototype.createListSelectMenu_ = function () {
  var menu = new goog.ui.PopupMenu();
  return menu;
};

com.dublook.chatrello.trello.TrelloService.prototype.createListSelectButton_ = function (menu) {
    var button = new goog.ui.MenuButton('Select list to add cards.', menu);
    return button;
};

/**
 * @private
 */
com.dublook.chatrello.trello.TrelloService.prototype.init_ = function () {
  console.log(window.location.href);
  var chatworkCtrl = new com.dublook.chatrello.chatwork.ChatworkCtrl();
  var token = this.getToken_(window.location.href);
  var createListSelectMenu_ = this.createListSelectMenu_;
  var createListSelectButton_ = this.createListSelectButton_;
  var format = goog.string.format;

  chatworkCtrl.waitForContentArea().then(function() {
    var $div = goog.dom.createDom('div', null, '');
    if (token === null) {
      var $anchor = goog.dom.createDom('a', null, 'auth');
      $anchor.href = format('%s/authorize?key=%s&name=chatrello&expiration=never&response_type=token&scope=read,write&callback_method=fragment&return_url=' + window.location.href, API_ROOT, APP_KEY);
      goog.dom.appendChild($div, $anchor);
      chatworkCtrl.showContent($div);
    } else {
      var $container = new goog.ui.Container();
      var $cardTitleInput = new goog.ui.LabelInput();
      var inputContr = new goog.ui.Control();
      inputContr.addChild($cardTitleInput, true);
      $container.addChild(inputContr, true);
      var textarea = new goog.ui.Textarea('');
      $container.addChild(textarea, true);
      var $menu = createListSelectMenu_();
      var $button = createListSelectButton_($menu);
      var xhr = goog.labs.net.xhr;
      var $sendButton = new goog.ui.Button('New Card');
      $sendButton.setEnabled(false);
      $sendButton.listen('action', function(event) {
        var listId = $button.getValue();
        if (!listId) {
          alert('Select a list to create new card to');
          return;
        }
        $sendButton.setEnabled(false);
        var list = com.dublook.chatrello.trello.model.List.get(listId);
        var createCardUrl = format('%s/cards?key=%s&token=%s&idList=%s&name=%s&desc=%s',
            API_ROOT, APP_KEY, token, listId,
            goog.string.urlEncode($cardTitleInput.getValue()),
            goog.string.urlEncode(textarea.getValue()));
        xhr.postJson(createCardUrl).then(function(newCard) {
          console.log(newCard);
          $sendButton.setEnabled(true);
        }).thenCatch(function(error) {
          alert('Failed to add new card.');
          console.error(error);
          $sendButton.setEnabled(true);
        });
      });
      document.onmouseup = function(event) {
        var cardDraft = chatworkCtrl.getCardDraft(window.getSelection());
        if (cardDraft) {
          $cardTitleInput.setValue(cardDraft.title);
          textarea.setValue(cardDraft.description);
          $sendButton.setEnabled(true);
        }
      };
      $container.addChild($button, true);
      chatworkCtrl.decorateContent($container);
      var boardUrl = format('%s/members/my/boards?key=%s&token=%s&fields=name',
          API_ROOT, APP_KEY, token);
      xhr.getJson(boardUrl).then(function(boards) {
        goog.array.forEach(boards, function(board) {
          var listsUrl = format('%s/boards/%s/lists?key=%s&token=%s&fields=name',
              API_ROOT, board.id, APP_KEY, token);
          goog.labs.net.xhr.getJson(listsUrl).then(function(lists) {
            var boardMenu = new goog.ui.SubMenu(board.name);
            goog.array.forEach(lists, function(listJson) {
              var ListModel = com.dublook.chatrello.trello.model.List;
              var list = new ListModel(board, listJson);
              ListModel.add(list);
              var listMenu = new goog.ui.MenuItem(list.name);
              listMenu.setValue(list.id);
              boardMenu.addItem(listMenu);
              listMenu.listen('action', function(event) {
                $button.setValue(list.id);
                $button.setContent(list.boardName + ' > ' + list.name);
                $sendButton.setEnabled(true);
              });
            });
            $menu.addItem(boardMenu);
          });
        });
      });
      $container.addChild($sendButton, true);
    }
  });
};

// initialization
com.dublook.chatrello.trello.TrelloService.getInstance().init_();
