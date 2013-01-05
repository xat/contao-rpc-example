(function ($, Backbone, _, win, alertify) {
  'use strict';

  // This will be the entrypoint to our App
  var App = {};

  /*
   * VIEWS
   */

  // Main App View
  App.MainView = Backbone.View.extend({

    initialize:function () {
      this.user = new App.UserModel();
      this.tasks = new App.TaskCollection();

      this.loginView = new App.LoginView({ el:this.$('#signup'), model:this.user });
      this.addView = new App.TaskAddView({ el:this.$('#add'), collection:this.tasks, model:this.user });
      this.listView = new App.TaskListView({ el:this.$('#list'), collection:this.tasks });
    }

  });

  // Add Task Form
  App.TaskAddView = Backbone.View.extend({

    events:{
      'submit':'add'
    },

    initialize:function () {
      this.model.on('change:hash', this.show, this);
    },

    add:function (ev) {
      ev.preventDefault();
      var task = new App.TaskModel({
        'title':this.$('#title').val()
      });
      task.save();
      this.collection.add(task);
    },

    show:function () {
      this.$el.fadeIn();
    }

  });

  // The entire Task List
  App.TaskListView = Backbone.View.extend({

    initialize:function () {
      this.collection.on('reset', this.render, this);
      this.collection.on('add', this.add, this);
      this.collection.fetch();
    },

    render:function () {
      // reset list
      this.$el.empty();

      // append list items
      this.collection.forEach(this.append, this);
    },

    add: function(task) {
      alertify.log('Added Task: ' + task.get('title'));
      this.append(task);
    },

    append:function (task) {
      this.$el.append(new App.TaskItemView({ model:task }).render().el);
    }

  });

  // Represents one Row in the Task List
  App.TaskItemView = Backbone.View.extend({

    tagName:'tr',

    events:{
      'click .remove':'destroy',
      'click .done':'done'
    },

    template:_.template($("#task-item").html()),

    initialize:function () {
      App.main.user.on('change:hash', this.render, this);
      this.model.on('change:done', this.render, this);
    },

    render:function () {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      App.main.user.get('hash') && this.$('.controls').show();
      return this;
    },

    destroy:function (ev) {
      ev.preventDefault();
      alertify.log('Deleted Task: ' + this.model.get('title'));
      this.model.destroy();
      this.remove();
    },

    done:function (ev) {
      ev.preventDefault();
      this.model.set('done', !this.model.get('done'));
      this.model.save();
    }

  });


  // The Login Form
  App.LoginView = Backbone.View.extend({

    events:{
      'submit':'login'
    },

    initialize:function () {
      this.model.on('change:hash', this.hide, this);
    },

    login:function (ev) {
      ev.preventDefault();
      App.utils.rpcRequest(
        'generateHash',
        {
          fe_username:this.$('#username').val(),
          fe_password:this.$('#password').val()
        }
      ).success(_.bind(function (data) {
        if (data.error) {
          alertify.error(data.error.message);
        } else {
          this.model.set('hash', data.result);
          App.TaskModel.prototype.postParams = {'fe_hash':data.result};
          App.TaskCollection.prototype.postParams = {'fe_hash':data.result};
          alertify.success('Login succeeded');
        }
      }, this));
    },

    hide:function () {
      this.$el.fadeOut();
    }

  });

  /*
   * MODELS
   */

  App.UserModel = Backbone.Model.extend({

    defaults:{
      hash:false
    }

  });

  App.TaskModel = Backbone.Model.extend({

    url:'/rpc.php',

    methods:{
      'read':'Todo.retrieve',
      'create':'Todo.create',
      'delete':'Todo.delete',
      'update':'Todo.update'
    },

    defaults:{
      done:false
    }

  });

  /*
   * COLLECTIONS
   */

  App.TaskCollection = Backbone.Collection.extend({

    url:'/rpc.php',

    model:App.TaskModel,

    methods:{
      read:'Todo.retrieve'
    }

  });

  App.utils = {

    rpcRequest:function (method, postParams, rpcParams) {

      var data = {
        rpc:JSON.stringify({
          jsonrpc:'2.0',
          method:method,
          id:_.uniqueId(),
          params: rpcParams || {}
        }),
        provider:'json'
      };

      _.defaults(data, postParams);

      return $.ajax({
        url:'/rpc.php',
        type:'POST',
        dataType:'json',
        data:data
      });
    }

  };

  // Bootstrap
  $(function () {

    // Initialize the main View
    App.main = new App.MainView({ el:$('#app') });

    // Export App
    win.App = App;

  });

})(jQuery, Backbone, _, window, alertify);