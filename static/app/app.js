(function($, B, _, win) {

  // This will be the entrypoint to our App
  var App = {};

  /*
   * VIEWS
   */

  // Main App View
  App.MainView = Backbone.View.extend({

    initialize: function() {
      this.user = new App.UserModel();
      this.collection = new App.TaskCollection();

      this.loginView = new App.LoginView({ el: this.$('#signup'), model: this.user });
      this.addView   = new App.AddTaskView({ el: this.$('#add'), collection: this.collection, model: this.user });
      this.listView  = new App.TaskListView({ el: this.$('#list'), collection: this.collection });
    }

  });

  // The Login Form
  App.LoginView = Backbone.View.extend({

    events: {
      'submit': 'login'
    },

    initialize: function() {
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
            App.TaskModel.prototype.postParams = {'fe_hash': data.result};
            App.TaskCollection.prototype.postParams = {'fe_hash': data.result};
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

    initialize: function() {
      this.model.on('change:hash', this.show, this);
    },

    add: function(ev) {
      ev.preventDefault();
      var task = new App.TaskModel();
      task.set('title', this.$('#title').val());
      task.set('done', false);
      task.save();
      this.collection.add(task);
    },

    show: function() {
      this.$el.fadeIn();
    }

  });

  // The entire Task List
  App.TaskListView = Backbone.View.extend({

    initialize: function() {
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
      alertify.log('Added Task: ' + task.get('title'));
      this.$el.append(new App.TaskItemView({ model: task }).render().el);
    }

  });

  // Represents one Row in the Task List
  App.TaskItemView = Backbone.View.extend({

    tagName: 'tr',

    events: {
      'click .remove': 'remove',
      'click .done': 'done'
    },

    template: _.template($("#task-item").html()),

    initialize: function() {
      App.main.user.on('change:hash', this.showControls, this);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      if (App.main.user.get('hash')) {
        this.showControls();
      }
      return this;
    },

    remove: function() {
      //this.remove();
      alertify.log('Deleted Task: ' + this.model.get('title'));
      this.model.destroy();
      this.$el.remove();
    },

    done: function(ev) {
      ev.preventDefault();
      this.model.set('done', !this.model.get('done'));
      this.model.save();
    },

    showControls: function() {
      this.$('.controls').show();
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

  App.TaskCollection = Backbone.Collection.extend({

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