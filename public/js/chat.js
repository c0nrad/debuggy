// Generated by CoffeeScript 1.6.3
(function() {
  $(document).ready(function() {
    var NUMBER_OF_BG_IMAGES, app, socket;
    NUMBER_OF_BG_IMAGES = 11;
    app = window || {};
    app.ChatModel = Backbone.Model.extend({
      defaults: {
        clients: [],
        chats: ["Enter a username"]
      },
      updateModel: function(chatModel) {
        this.set('clients', chatModel.clients);
        this.set('chats', chatModel.chats);
        return this.trigger('updated');
      }
    });
    app.ChatView = Backbone.View.extend({
      el: $('#chatBlock'),
      initialize: function() {
        this.model = new app.ChatModel({
          chats: ["Enter a username"],
          clients: [""]
        });
        this.model.on('updated', this.render, this);
        this.chatTextArea = $('#chatTextArea');
        this.chatInput = $('#chatInput');
        this.chatClientArea = $('#chatClients');
        return this.chatInput.val("anon");
      },
      events: {
        'click #chatButton': 'sendChat',
        'keypress #chatInput': 'checkForEnter'
      },
      sendChat: function() {
        var line, newNickName, nickNameReg;
        line = this.chatInput.val();
        this.chatInput.val('');
        nickNameReg = /\/nick (.*?)$/i;
        if (nickNameReg.exec(line) != null) {
          newNickName = nickNameReg.exec(line)[1];
          return socket.emit('chat:nick', newNickName);
        } else {
          this.chatInput.val('');
          return socket.emit('chat:sendChat', line);
        }
      },
      checkForEnter: function(e) {
        if (e.keyCode === 13 && this.chatInput.val() !== "") {
          return this.sendChat();
        }
      },
      displayClients: function() {
        var client, _i, _len, _ref, _results;
        this.chatClientArea.html("");
        _ref = _.values(this.model.get('clients'));
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          client = _ref[_i];
          _results.push(this.chatClientArea.append("<li> " + client + " </li>"));
        }
        return _results;
      },
      render: function() {
        this.chatTextArea.val(this.model.get('chats').join("\n"));
        this.displayClients();
        return this;
      }
    });
    socket = io.connect();
    return socket.on('chat:update', function(data) {
      return app.chatView.model.updateModel(data);
    });
  });

}).call(this);
