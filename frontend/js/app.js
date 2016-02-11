/**
 * Created by i.panfilenko on 28.01.2016.
 */

$(document).ready(function () {

    'use strict';

    window.App = {
        Models: {},
        Collections: {},
        Views: {}
    };

    window.Socket = {
        Connects: {},
        USEWEBSOCKET: false
    };

/////////////////  BACKBONE ///////////////////////////////////
    var BASEURL = '../../backend/application';
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
        url: BASEURL,
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
            this.model.url = BASEURL + "/?action=destroy&id=" + idDelete;
            this.model.destroy({
                success: _.bind(function (model, response) {
                    this.$el.remove();
                    Socket.Connects.send(this.msg);
                    localStorage.removeItem('model' + this.model.get('id'));
                    updateDataFromLocalstorage();
                }, this),
                error: _.bind(function (model, response) {
                    this.$el.remove();
                    insertDataInLocalStorage(model, 'destroy');
                    console.log("Error: model not removed");
                }, this)
            });
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
            this.model.url = BASEURL + "/?action=update";
            this.model.save(null, {
                success: _.bind(function (model, response) {
                    Socket.Connects.send(this.msg);
                    updateDataFromLocalstorage();
                }, this),
                error: _.bind(function (model, response) {
                    insertDataInLocalStorage(model, 'save');
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

    var tasksCollection = new App.Collections.TaskCollection();
    tasksCollection.comparator = function (tasksCollection) {
        return -tasksCollection.get("priority");
    };
    var tasksView = new App.Views.TasksView({collection: tasksCollection});

    updateData();

    //Header of table
    $('#add').on('click', function () {        //add new task
        var newTextTask = $('#textTask').val();
        var newPriority = $('#priorityTask').val();
        if (newTextTask == '') {
            alert("Text task empty!");
            return false;
        }
        var newTask = new App.Models.Task({
            textTask: newTextTask,
            priority: newPriority,
            dateStart: (function () {
                var selectDate = Date.parse($("#datepicker").datepicker('getDate'));
                return selectDate.toString('yyyy-MM-dd');
            })()
        });
        createData(newTask);
        sortView("priority");
    });

    //Create new model
    function createData(curModel) {
        tasksCollection.url = BASEURL + "/?action=add";
        tasksCollection.create(curModel, {
            success: _.bind(function (model, response) {
                Socket.Connects.send('create');
                updateDataFromLocalstorage();
            }, this),
            error: function (model, response) {
                insertDataInLocalStorage(model, 'create');
                console.log("Model created in localstorage");
            }
        });
    }

    //Update data on client from server
    function updateData() {
        tasksCollection.url = BASEURL;
        tasksCollection.fetch({
            success: function (model, response) {
                tasksView.$el.find('tr').remove();
                tasksView.render();
            },
            error: function (model, response) {
                console.log('ERROR: no connection with server');
            }
        });
    }

    //Sorting for header
    function sortView(paramSort) {
        tasksCollection.comparator = function (tasksCollection) {
            return tasksCollection.get(paramSort);
        };
        tasksCollection.sort();
        tasksView.$el.find('tr').remove();
        tasksView.render();
    }

//////////////////  WEBSOCKET /////////////////////////////////
    var SocketSingleton = (function () {
        var instance;

        function createInstance() {
            var object = new WebSocket('ws://panfilenkoi:8088');
            return object;
        }

        return {
            getInstance: function () {
                if (!instance) {
                    instance = createInstance();
                }
                return instance;
            }
        };
    })();

    if (Socket.USEWEBSOCKET) {
        Socket.Connects = SocketSingleton.getInstance();
    }

    Socket.Connects.msg = "send";
    Socket.Connects.onopen = function (e) {
        console.log("Connection established!");
    };

    Socket.Connects.onmessage = function (e) {
        console.log("Message add!");
        updateData(); //Update data on client from server
    };

    if (!("send" in Socket.Connects)) {
        Socket.Connects.send = function (e) {
            console.log("Send message!");
        };
    }
////////////////// LOCALSTORAGE ///////////////////////////////
    function insertDataInLocalStorage(curModel, action) {
        var timeMark = new Date().getTime();  //for unique
        localStorage.setItem(timeMark + '%' + action, JSON.stringify(curModel))
    }

    function updateDataFromLocalstorage() {
        var tempAction, curModel;
        for (var model in localStorage) {
            tempAction = model.split('%')[1];
            curModel = JSON.parse(localStorage.getItem(model));
            switch (tempAction) {
                case 'create' :
                    tasksCollection.url = BASEURL + "/?action=add";
                    tasksCollection.create(curModel, {
                        success: _.bind(function () {
                            Socket.Connects.send('create');
                            localStorage.removeItem(model);
                        }, this)
                    });
                    break;
                case 'save'  :
                    curModel.url = BASEURL + "/?action=update";
                    curModel.save(null, {
                        success: _.bind(function () {
                            Socket.Connects.send(this.msg);
                            localStorage.removeItem(model);
                        }, this)
                    });
                    break;
                case 'destroy' :
                    var idDelete = curModel.get('id');
                    curModel.url = BASEURL + "/?action=destroy&id=" + idDelete;
                    curModel.destroy({
                        success: _.bind(function (model, response) {
                            Socket.Connects.send(this.msg);
                            localStorage.removeItem('model' + this.model.get('id'));
                        }, this)
                    });
            }
        }
    }

////////////////// DOM ///////////////////////////////////////
    $("#priority").on('click', function () {
        sortView("priority");   // sorting for alphabet
    });
    $("#status").on('click', function () {
        sortView("status");     // sorting for alphabet
    });
    $("#dateStart").on('click', function () {
        sortView("dateStart"); // sorting for alphabet
    });

    //Header template
    var templateHeader = $('#title').html();
    $('.header').html(_.template('Simple Todo List'));

    //Filter for task
    $("#done").on('click', function () {
        $("#target tr").hide();
        $('.success').fadeIn();
    });
    $("#all").on('click', function () {
        $("#target tr").fadeIn();
    });
    $("#new").on('click', function () {
        $("#target tr").show();
        $('.success').hide();
        $('.warning').hide();
    });
    $('#forDate').on('click', function () {
        var selectDate = Date.parse($("#datepicker").datepicker('getDate'));
        var selectDateStr = selectDate.toString('yyyy-MM-dd');
        var dataCells = $("#target tr");
        dataCells.find('td.date-cell:not(:contains("' + selectDateStr + '"))').parent().hide();
        dataCells.find('td.date-cell:contains("' + selectDateStr + '")').parent().fadeIn();
    });

    //Datepicker
    $.datepicker.setDefaults($.datepicker.regional["ru"]);
    $("#datepicker").datepicker();
});



