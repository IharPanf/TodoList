/**
 * Created by i.panfilenko on 28.01.2016.
 */

$(document).ready(function() {

    'use strict'
/////////////////  BACKBONE ///////////////////////////////////
    var BASEURL = '../../backend/application';
    var Task = Backbone.Model.extend({
        defaults: {
            status   : 'new',
            priority : 0,
            dateStart: (function(){
                return Date.today().toString('yyyy-MM-dd');
            })(),
            textTask : ''
        }
    });

    var TaskCollection = Backbone.Collection.extend({
        model     : Task,
        url       : BASEURL,
        comparator: 'priority'
    });

    // The View for a Task (one)
    var TaskView = Backbone.View.extend({
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
            e.stopPropagation();
            this.$el.remove();
            conn.send(msg);
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
            conn.send(msg);
        }
    });

    // View for all Tasks (all of them)
    var TasksView = Backbone.View.extend({
        tagName: 'tbody',
        initialize:function(){
            this.$el =   $('#target');
        },
        render: function() {
            this.collection.each(function(curTask) {
                var taskView = new TaskView({ model: curTask });
                this.$el.append(taskView.render().el);
            }, this);
            return this;
        },
    });

    var tasksCollection = new TaskCollection();
    tasksCollection.comparator = function(tasksCollection) {
        return -tasksCollection.get("priority");
    };
    var tasksView = new TasksView({ collection: tasksCollection });

    updateData();

    //Header of table
    $('#add').on('click',function(){        //add new task
        var newTextTask = $('#textTask').val();
        var newPriority = $('#priorityTask').val();
        if (newTextTask == '') {
            alert("Text task is empty!");
            return false;
        }
        var newTask     = new Task({
            textTask : newTextTask,
            priority : newPriority,
            dateStart:(function(){
                var selectDate = Date.parse($("#datepicker").datepicker('getDate'));
                return selectDate.toString('yyyy-MM-dd');
            })()
        });
        var taskView = new TaskView({model:newTask});
        tasksCollection.url = BASEURL + "/?action=add";
        tasksCollection.create(newTask);
        conn.send(msg);
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
    var conn = new WebSocket('ws://panfilenkoi:8088');
    var msg = "Need update data";

    conn.onopen = function(e) {
        console.log("Connection established!");
    };

    conn.onmessage = function(e) {
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
        //Жесткая привязка к DOM
        $('#target').find('tr').each(function(){
           if ($(this).find('td').eq(2).text() != selectDateStr) {
               $(this).hide();
           } else {
               $(this).show();
           }
        });
    });

    //Datepicker
    $.datepicker.setDefaults( $.datepicker.regional[ "ru" ] );
    $("#datepicker").datepicker();
})



