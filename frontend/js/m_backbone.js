/**
 * Created by i.panfilenko on 16.02.2016.
 */

define(['jquery', 'underscore', 'backbone', 'date', 'm_websocket', 'm_localstorage'], function ($, _, Backbone, Date, Socket, LS) {
    var App = {
        Models: {},
        Collections: {},
        Views: {},
        BASEURL: 'http://panfilenkoi:8888/backend/node/'
        // BASEURL = '../../backend/application'; //for Yii
    };

    App.Models.Task = Backbone.Model.extend({
        defaults: {
            status: 'new',
            priority: 0,
            dateStart: (function () {
                return Date.today().toString('yyyy-MM-dd');
            })(),
            textTask: ''
        }
    });

    App.Collections.TaskCollection = Backbone.Collection.extend({
        model: App.Models.Task,
        url: App.BASEURL,
        comparator: 'priority',
        createData: function (newModel) {
            this.url = App.BASEURL
                + "?action=add&textTask=" + newModel.get('textTask')
                + "&priority=" + newModel.get('priority')
                + "&dateStart=" + newModel.get('dateStart');
            this.create(newModel, {
                success: function (model, response) {
                    Socket.Connects.send('create');
                    LS.updateData();
                },
                error: function (model, response) {
                    console.log("Model created in localstorage");
                    LS.insertData(model, 'create');
                }
            });
        }
    });

// The View for a Task (one)
    App.Views.TaskView = Backbone.View.extend({
        tagName: 'tr',
        template: _.template($('#usageList').html()),
        initialize: function () {
            this.model.on('change', this.render, this);
        },
        events: {
            'click .remove': 'remove',
            'click td': 'changeStatus'
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.model.get('status') == 'done') {
                this.$el.addClass('success');
            }
            if (this.model.get('status') == 'archive') {
                this.$el.addClass('warning');
            }
            return this;
        },
        remove: function (e) {
            var idDelete = this.model.get('id');
            this.model.url = App.BASEURL + "?action=destroy&id=" + idDelete;
            this.model.destroy({
                success: _.bind(function (model, response) {
                    Socket.Connects.send(this.msg);
                    localStorage.removeItem('model' + this.model.get('id'));
                    LS.updateData();
                }, this),
                error: _.bind(function (model, response) {
                    LS.insertData(model, 'destroy');
                    console.log("Error: model not removed");
                }, this)
            });
            this.$el.remove();
            e.stopPropagation();
        },
        changeStatus: function () {
            switch (this.model.get('status')) {
                case 'new'    :
                    this.model.set('status', 'archive');
                    this.$el.addClass('warning');
                    break;
                case 'archive':
                    this.model.set('status', 'done');
                    this.$el.removeClass('warning').addClass('success');
                    break;
                case 'done'   :
                    this.model.set('status', 'new');
                    this.$el.removeClass('warning success');
                    break;
            }
            this.model.url = App.BASEURL + "?action=update&id=" + this.model.get("id") + "&status=" + this.model.get("status");
            this.model.save(null, {
                success: _.bind(function (model, response) {
                    Socket.Connects.send(this.msg);
                    console.log("save model on server");
                    LS.updateData();
                }, this),
                error: _.bind(function (model, response) {
                    console.log("Model saved in localstorage");
                    LS.insertData(model, 'save');
                }, this)
            });
        }
    });

// View for all Tasks (all of them)
    App.Views.TasksView = Backbone.View.extend({
        tagName: 'tbody',
        initialize: function () {
            this.$el = $('#target');
            this.collection.fetch({
                success: _.bind(function () {
                    //    this.render();
                }, this),
                error: function () {
                    console.log('ERROR: no connect with server!');
                }
            });
            this.collection.bind("sort", this.render, this);
        },
        render: function () {
            this.$el.empty();
            this.collection.each(function (curTask) {
                if (curTask.get('status') != 'local') {       //model not in localstorage
                    var taskView = new App.Views.TaskView({model: curTask});
                    this.$el.append(taskView.render().el);
                }
            }, this);
            return this;
        }
    });

    return App;
});