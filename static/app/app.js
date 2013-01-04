(function($, B, _, win) {

  // This will be the entrypoint to our App
  var App = {};

  /*
   * VIEWS
   */

  // Main App View
  App.MainView = Backbone.View.extend({

    initialize: function() {
      this.collection = new App.TaskCollection();

      this.loginView = new App.LoginView({ el: this.$('#signup') });
      this.addView   = new App.AddTaskView({ el: this.$('#add'), collection: this.collection });
      this.listView  = new App.TaskListView({ el: this.$('#list'), collection: this.collection });
    }

  });

  // The Login Form
  App.LoginView = Backbone.View.extend({

    events: {
      'submit': 'login'
    },

    initialize: function() {
      this.model = new App.UserModel();
      this.model.on('change:hash', this.hide, this);
    },

    login: function(ev) {
      ev.preventDefault();
      App.utils.rpcRequest(
        'generateHash',
        [],
        {
          fe_username: this.$('#username').val(),
          fe_password: this.$('#password').val()
        },
        _.bind(function(data) {
          if (data.error) {
              alertify.error(data.error.message);
          } else {
            this.model.set('hash', data.result);
            alertify.success('Login succeeded');
          }
        }, this)
      );
    },

    hide: function() {
      this.$el.fadeOut();
    }

  });

  // Add Task Form
  App.AddTaskView = Backbone.View.extend({

    events: {
      'submit': 'add'
    },

    add: function(ev) {
      ev.preventDefault();
      var task = new App.TaskModel();
      task.set('title', this.$('#title').val());
      task.save();
      this.collection.add(task);
    }

  });

  // The entire Task List
  App.TaskListView = Backbone.View.extend({

    initialize: function() {
      this.collection = new App.TaskCollection();
      this.collection.on('reset', this.render, this);
      this.collection.on('add', this.add, this);
      this.collection.fetch();
    },

    render: function() {
      // reset list
      this.$el.empty();

      // append list items
      this.collection.forEach(function(task) {
        this.add(task);
      }, this);
    },

    add: function(task) {
      this.$el.append(new App.TaskItemView({ model: task }).render().el);
    }

  });

  // Represents one Row in the Task List
  App.TaskItemView = Backbone.View.extend({

    tagName: 'tr',

    events: {
      'click .remove': 'remove'
    },

    template: _.template($("#task-item").html()),

    initialize: function() {
      this.model.on('destroy', this.destroy, this);
    },

    render: function() {
      this.$el.html(this.model.toJSON());
      return this;
    },

    remove: function() {
      this.model.destroy();
    },

    destroy: function() {
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.remove();
      Backbone.View.prototype.remove.call(this);
    }

  });

  /*
   * MODELS
   */

  App.UserModel = Backbone.Model.extend({

    defaults: {
      status: ''
    }

  });

  App.TaskModel = Backbone.Model.extend({

    url: '/rpc.php',

    methods: {
      read:   'Todo.retrieve',
      create: 'Todo.create',
      delete: 'Todo.delete',
      update: 'Todo.update'
    }

  });

  /*
   * COLLECTIONS
   */

  App.TaskCollection = Backbone.Model.extend({

    url: '/rpc.php',

    model: App.TaskModel,

    methods: {
      read:   'Todo.retrieve'
    }

  });

  App.utils = {

    rpcRequest: function(method, rpcParams, postParams, success, error) {

      var data = {
        rpc: JSON.stringify({
          jsonrpc : '2.0',
          method  : method,
          id      : _.uniqueId(),
          params  : rpcParams
        }),
        provider: 'json'
      };

      _.defaults(data, postParams);

      return $.ajax({
        url: '/rpc.php',
        type: 'POST',
        dataType: 'json',
        data: data,
        success: success,
        error: error
      });
    }

  };

  // Bootstrap
  $(function() {

    // Initialize the main View
    App.main = new App.MainView({ el: $('#app') });

    // Export App
    window.App = App;

  });

})(jQuery, Backbone, _, window);