(function ($, Backbone, _, win, alertify) {
    'use strict';

    // This will be the entrypoint to our App
    var App = {};

    App.config = {
        'rpcUrl':'/rpc.php'
    };

    //The Main App View
    App.MainView = Backbone.View.extend({

        initialize:function () {

            // Create the UserModel and the the TaskCollection
            this.user = new App.UserModel();
            this.tasks = new App.TaskCollection();

            // create all sub-views
            this.introView = new App.IntroView({ el:this.$('#intro') });
            this.loginView = new App.LoginView({ el:this.$('#signup'), model:this.user });
            this.addView = new App.TaskAddView({ el:this.$('#add'), collection:this.tasks, model:this.user });
            this.listView = new App.TaskListView({ el:this.$('#list'), collection:this.tasks });
        }

    });

    // AddTask Form
    App.TaskAddView = Backbone.View.extend({

        events:{
            'submit':'add'
        },

        initialize:function () {
            // show the AddTask-Form as soon a user logs in
            this.model.on('change:hash', this.show, this);
        },

        add:function (ev) {
            ev.preventDefault();

            // Create a new instance of Task
            var task = new App.TaskModel({
                'title':this.$('#title').val()
            });

            // Save the task (push it to the Server)
            task.save()
                .success(_.bind(function() {

                    // Add the task to the TaskCollection
                    alertify.success('Added Task: ' + task.get('title'));
                    this.collection.add(task);
                }, this))
                .error(_.bind(function() {
                    alertify.error('Could not add Task: ' + task.get('title'));
                }, this));
        },

        show:function () {
            this.$el.fadeIn();
        }

    });

    // The entire Task List
    App.TaskListView = Backbone.View.extend({

        initialize:function () {

            // render this view, as-soon the collection has items
            this.collection.on('reset', this.render, this);

            // append the view with an added item
            this.collection.on('add', this.add, this);

            // fetch the models from the server (sync)
            this.collection.fetch();
        },

        render:function () {

            // reset list
            this.$el.empty();

            // append list items
            this.collection.forEach(this.add, this);
            return this;
        },

        add:function (task) {
            // Create a new subview 'TaskItemView'
            // and append it to this views table
            this.$el.append(new App.TaskItemView({ model:task }).render().el);
        }

    });

    // Represents one Row (tr) in the Task Table
    App.TaskItemView = Backbone.View.extend({

        tagName:'tr',

        events:{
            'click .remove':'destroy',
            'click .done':'done'
        },

        // fetch the rows template content
        template:_.template($("#task-item").html()),

        initialize:function () {

            // If the hash value of the user model changes, rerender
            App.main.user.on('change:hash', this.render, this);

            // do the same if the 'done' property of the task-model changes
            this.model.on('change:done', this.render, this);
        },

        render:function () {
            // compile the template and add it to this views DOM element
            this.$el.html(this.template(this.model.toJSON()));

            // toggle the done-css-class based on the models done-property
            this.$el.toggleClass('done', this.model.get('done'));

            // Show the Buttons 'Toggle' and 'Delete' if the User is logged in
            App.main.user.get('hash') && this.$('.controls').show();

            return this;
        },

        destroy:function (ev) {
            ev.preventDefault();

            // Destroy the Model
            // This will also automaticly call 'Todo.delete' on the Server-Side
            // and the model will also be removed from the collection
            this.model.destroy()
                .success(_.bind(function() {
                    alertify.success('Deleted Task: ' + this.model.get('title'));
                },
                this))
                .error(_.bind(function() {
                    alertify.error('Could not delete Task: ' + this.model.get('title'));
                },
                this));

            // Remove this View from the DOM
            this.remove();
        },

        done:function (ev) {
            ev.preventDefault();

            // toggle the done-state of the task
            this.model.set('done', !this.model.get('done'));

            // ...and sync it with the server
            this.model.save();
        }

    });


    // The Login Form
    App.LoginView = Backbone.View.extend({

        events:{
            'submit':'login'
        },

        initialize:function () {
            // Hide the login-form as-soon the user has logged in
            this.model.on('change:hash', this.hide, this);
        },

        login:function (ev) {
            ev.preventDefault();

            // Perform an RPC Request with username/password as POST-Parameters
            // This calls the RPC-Method 'generateHash' which will give us
            // back an hash (=token). With this hash the user authorize his
            // further RPC-Requests
            App.utils.rpcRequest(
                'generateHash',
                {
                    fe_username:this.$('#username').val(),
                    fe_password:this.$('#password').val()
                }
            ).success(_.bind(function (data) {
                if (data.error) {

                    // The JSON-RPC Response contains an Error.
                    // Show the Error to the User.
                    alertify.error(data.error.message);
                } else {

                    // The Request was successful.
                    // Update the User-Model with the Hash
                    this.model.set('hash', data.result);

                    // Modify TaskModel and TaskCollection by attaching the
                    // hash as postParameter.
                    // Each time the Model/Collection syncs with the server
                    // it will now also send the hash in an POST-Field
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

    // Intro Text
    App.IntroView = Backbone.View.extend({

        events:{
            'click .close':'hide'
        },

        hide:function () {
            this.$el.slideUp();
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

        url:App.config.rpcUrl,

        // Map the CRUD verbs to
        // RPC-Methods.
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

        url:App.config.rpcUrl,

        model:App.TaskModel,

        // Map the CRUD verbs to
        // RPC-Methods.
        methods:{
            read:'Todo.retrieve'
        }

    });

    App.utils = {

        rpcRequest:function (method, postParams, rpcParams) {

            // prepare the rpc-request which will get
            // within a POST-Field
            var data = {
                rpc:JSON.stringify({
                    jsonrpc:'2.0',
                    method:method,
                    id:_.uniqueId(),
                    params:rpcParams || {}
                }),
                provider:'json'
            };

            // merge data and postParams
            _.defaults(data, postParams);

            // Perform the Ajax-Request
            // Using jQuerys $.ajax()
            return $.ajax({
                url:App.config.rpcUrl,
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