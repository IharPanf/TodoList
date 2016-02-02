/**
 * Created by i.panfilenko on 28.01.2016.
 */

$(document).ready(function() {
	'use strict'
    var Task = Backbone.Model.extend({
        defaults: {
            status   : 'new',
            priority : 0,
            dateStart: (function(){
                return Date.today().toString('dd.MM.yyyy');
            })(),
            textTask : ''
        }
    });

    var TaskCollection = Backbone.Collection.extend({
        model     : Task,
        url       : 'task.json',
        comparator: 'priority',

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

//  var task = new Task();
    var tasksCollection = new TaskCollection();
    tasksCollection.comparator = function(tasksCollection) {
        return -tasksCollection.get("priority");
    };
    var tasksView = new TasksView({ collection: tasksCollection });
    tasksCollection.fetch({
        success: function() {
            tasksView.render();
        }
    });
    $(document.body).append(tasksView.render().el);


    //Header of table
    $('#add').on('click',function(){        //add new task
        var newTextTask = $('#textTask').val();
        var newPriority = $('#priorityTask').val();
        var newTask     = new Task({
            textTask : newTextTask,
            priority : newPriority,
            dateStart:(function(){
                var selectDate = Date.parse($("#datepicker").datepicker('getDate'));
                return selectDate.toString('dd.MM.yyyy');
            })()
        });
        var taskView = new TaskView({model:newTask});
        tasksCollection.create(newTask);
        sortView("priority");
    })

    $("#priority").on('click',function(){
        sortView("priority");   // sorting for alphabet
    });
    $("#status").on('click',function(){
        sortView("status");     // sorting for alphabet
    });
    $("#dateStart").on('click',function(){
        sortView("dateStart"); // sorting for alphabet
    });

    //Sorting for header
    function sortView(paramSort){
        tasksCollection.comparator = function (tasksCollection) {
            return tasksCollection.get(paramSort);
        }
        tasksCollection.sort();
        tasksView.$el.find('tr').remove();
        tasksView.render();
    }
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
        var selectDateStr = selectDate.toString('dd.MM.yyyy');
        //������� �������� � DOM
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



