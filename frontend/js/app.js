/**
 * Created by i.panfilenko on 28.01.2016.
 */

$(document).ready(function() {

    'use strict'

    window.App = {
        Models: {},
        Collections: {},
        Views: {}
    };
    window.Socket = {
         Connects: {}
    };
/////////////////  BACKBONE ///////////////////////////////////
    var BASEURL = '../../backend/application';
    App.Models.Task = Backbone.Model.extend({
        defaults: {
            status   : 'new',
            priority : 0,
            dateStart: (function(){
                return Date.today().toString('yyyy-MM-dd');
            })(),
            textTask : ''
        }
    });

    App.Collections.TaskCollection = Backbone.Collection.extend({
        model     : App.Models.Task,
        url       : BASEURL,
        comparator: 'priority'
    });

    // The View for a Task (one)
    App.Views.TaskView = Backbone.View.extend({
        tagName: 'tr',
        template: _.template($('#usageList').html()),
        initialize:function(){
            this.model.on('change', this.render, this);
        },
        events: {
            'click .remove' : 'remove',
            'click td'      : 'changeStatus'
        },
        render: function() {
            this.$el.html( this.template(this.model.toJSON()) );
            if (this.model.get('status') == 'done') {
                this.$el.addClass('success');
            }
            if (this.model.get('status') == 'archive') {
                this.$el.addClass('warning');
            }
            return this;
        },
        remove: function(e){
            var idDelete = this.model.get('id');
            this.model.url = BASEURL + "/?action=destroy&id="+idDelete;
            this.model.destroy();
            Socket.Connects.send(this.msg);
            e.stopPropagation();
            this.$el.remove();
        },
        changeStatus:function(){
            switch (this.model.get('status')) {
                case 'new':
                    this.model.set('status','archive');
                    this.$el.addClass('warning');
                    break;
                case 'archive':
                    this.model.set('status','done');
                    this.$el.removeClass('warning').addClass('success');
                    break;
                case 'done':
                    this.model.set('status','new');
                    this.$el.removeClass('warning success');
                    break;
            }
            this.model.url = BASEURL + "/?action=update";
            this.model.save();
            Socket.Connects.send(this.msg);
        }
    });

    // View for all Tasks (all of them)
    App.Views.TasksView = Backbone.View.extend({
        tagName: 'tbody',
        initialize:function(){
            this.$el =   $('#target');
        },
        render: function() {
            this.collection.each(function(curTask) {
                var taskView = new App.Views.TaskView({ model: curTask });
                this.$el.append(taskView.render().el);
            }, this);
            return this;
        },
    });

    var tasksCollection = new App.Collections.TaskCollection();
    tasksCollection.comparator = function(tasksCollection) {
        return -tasksCollection.get("priority");
    };
    var tasksView = new App.Views.TasksView({ collection: tasksCollection });

    updateData();

    //Header of table
    $('#add').on('click',function(){        //add new task
        var newTextTask = $('#textTask').val();
        var newPriority = $('#priorityTask').val();
        if (newTextTask == '') {
            alert("Text task is empty!");
            return false;
        }
        var newTask     = new App.Models.Task({
            textTask : newTextTask,
            priority : newPriority,
            dateStart:(function(){
                var selectDate = Date.parse($("#datepicker").datepicker('getDate'));
                return selectDate.toString('yyyy-MM-dd');
            })()
        });
        var taskView = new App.Views.TaskView({model:newTask});
        tasksCollection.url = BASEURL + "/?action=add";
        tasksCollection.create(newTask);
        Socket.Connects.send(this.msg);
        sortView("priority");
    });

    //Update data on client from server
    function updateData() {
        tasksView.$el.find('tr').remove();
        tasksCollection.url = BASEURL;
        tasksCollection.fetch({
            success: function() {
                console.log('JSON load');
                tasksView.render();
            },
            error : function() {
                console.log('ERROR');
            }
        });
    }

    //Sorting for header
    function sortView(paramSort){
        tasksCollection.comparator = function (tasksCollection) {
            return tasksCollection.get(paramSort);
        }
        tasksCollection.sort();
        tasksView.$el.find('tr').remove();
        tasksView.render();
    }
//////////////////  WEBSOCKET /////////////////////////////////
    var Singleton = (function () {
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

    Socket.Connects = Singleton.getInstance();
    Socket.Connects.msg = "send";
    Socket.Connects.onopen = function(e) {
        console.log("Connection established!");
    };

    Socket.Connects.onmessage = function(e) {
        console.log("Message add!");
        updateData(); //Update data on client from server
    };

////////////////// DOM ///////////////////////////////////////
    $("#priority").on('click',function(){
        sortView("priority");   // sorting for alphabet
    });
    $("#status").on('click',function(){
        sortView("status");     // sorting for alphabet
    });
    $("#dateStart").on('click',function(){
        sortView("dateStart"); // sorting for alphabet
    });

    //Header template
    var templateHeader =  $('#title').html();
    $('.header').html(_.template('Simple Todo List'));

    //Filter for task
    $("#done").on('click',function(){
        $('#target tr').hide();
        $('.success').fadeIn();
    });
    $("#all").on('click',function(){
        $('#target tr').fadeIn();
    });
    $("#new").on('click',function(){
        $('#target tr').show();
        $('.success').hide();
        $('.warning').hide();
    });
    $('#forDate').on('click',function(){
        var selectDate = Date.parse($("#datepicker").datepicker('getDate'));
        var selectDateStr = selectDate.toString('yyyy-MM-dd');
        var dataCells = $('#target tr');
        dataCells.find('td.date-cell:not(:contains("' + selectDateStr + '"))').parent().hide();
        dataCells.find('td.date-cell:contains("' + selectDateStr + '")').parent().fadeIn();
    });

    //Datepicker
    $.datepicker.setDefaults( $.datepicker.regional[ "ru" ] );
    $("#datepicker").datepicker();
})



