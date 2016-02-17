/**
 * Created by i.panfilenko on 16.02.2016.
 */

define(['jquery', 'underscore', 'backbone', 'date', 'm_websocket'], function ($, _, Backbone, Date, Socket) {
    var App = {
        Models: {},
        Collections: {},
        Views: {},
        BASEURL: 'http://panfilenkoi:8888/backend/node/'
    };

// var BASEURL = '../../backend/application';
    App.Models.Task = Backbone.Model.extend({
        defaults: {
            status: 'new',
            priority: 0,
            dateStart: (function () {
                return Date.today().toString('yyyy-MM-dd');
            })(),
            textTask: '',
            lastAction: 'none'
        }
    });

    App.Collections.TaskCollection = Backbone.Collection.extend({
        model: App.Models.Task,
        url: App.BASEURL,
        comparator: 'priority'
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
                }, this),
                error: _.bind(function (model, response) {
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
                }, this),
                error: _.bind(function (model, response) {
                    console.log("Model saved in localstorage");
                }, this)
            });
        }
    });

// View for all Tasks (all of them)
    App.Views.TasksView = Backbone.View.extend({
        tagName: 'tbody',
        initialize: function () {
            this.$el = $('#target');
        },
        render: function () {
            this.collection.each(function (curTask) {
                var taskView = new App.Views.TaskView({model: curTask});
                this.$el.append(taskView.render().el);
            }, this);
            return this;
        }
    });

    return App;
});