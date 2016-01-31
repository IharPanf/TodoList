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
                var curDate = new Date();
                return formatDate(curDate);
            })(),
            textTask : ''
        }
    });

    var TaskCollection = Backbone.Collection.extend({
        model: Task,
        url: 'task.json'
    });

    // The View for a Task (one)
    var TaskView = Backbone.View.extend({
        tagName: 'tr',
        template: _.template($('#usageList').html() ),
        initialize:function(){
            this.model.on('change', this.render, this);
        },
        events: {
            'click .remove' : 'remove',
            'click td'      : 'changeStatus'
        },
        render: function() {
            this.$el.html( this.template(this.model.toJSON()) );
            return this;
        },
        remove: function(e){
            e.stopPropagation();
            this.$el.remove();
        },
        changeStatus:function(){
            if (this.model.get('status') == 'new') {
                this.model.set('status','archive');
                this.$el.addClass('warning');
            } else {
                if (this.model.get('status') == 'archive') {
                    this.model.set('status','done');
                    this.$el.removeClass('warning').addClass('success');
                }
            }
        }
    });

    // View for all Tasks (all of them)
    var TasksView = Backbone.View.extend({
        tagName: 'tbody',
        initialize:function(){
            this.$el =   $('#target');
            this.collection.fetch({
                success: function () {
                    console.log("JSON file load was successful", this);
                },
                error: function () {
                    console.log('There was some error in loading and processing the JSON file');
                }
            });
            console.log(this.collection.toJSON());
        },
        render: function() {
            this.collection.each(function(curTask) {
                var taskView = new TaskView({ model: curTask });
                this.$el.append(taskView.render().el);
            }, this);
            return this;
        },
    });
    //View for buttons "Add"
    var AddNewTaskView = Backbone.View.extend({
        initialize:function(){
            $('#add').on('click',this.addNewTask);
        },
        addNewTask: function() {
            var newTextTask = $('#textTask').val();
            var newPriority = $('#priorityTask').val();
            var newTask     = new Task({
                textTask : newTextTask,
                priority : newPriority
            });
            var taskView = new TaskView({model:newTask});
            $('#target').append(taskView.render().el);
        }
    })
    var task = new Task();
    var tasksCollection = new TaskCollection([
        { textTask: 'SomeTask1', priority: 2 },
        { textTask: 'SomeTask2', dateStart: '01.02.2016'},
        { textTask: 'SomeTask3'},
        { textTask: 'SomeTask4'}
    ]);
    var addNewTaskView = new AddNewTaskView({ collection: tasksCollection });
    var tasksView = new TasksView({ collection: tasksCollection });
    $(document.body).append(tasksView.render().el);



    //Header template
    var templateHeader =  $('#title').html();
    $('.header').html(_.template('Simple Todo List'));

    //Filter for task
    $("#done").on('click',function(){
        $('#target tr').hide();
        $('.success').fadeIn();
    })
    $("#all").on('click',function(){
        $('#target tr').fadeIn();
    })
    $("#new").on('click',function(){
        $('#target tr').show();
        $('.success').hide();
        $('.warning').hide();
    })
    //Datepicker
    $.datepicker.setDefaults( $.datepicker.regional[ "ru" ] );
    $("#datepicker").datepicker({
        dateFormat: 'dd.mm.yy',
        onSelect: function(date) {
           // console.log(date);
        },
    });
})

function formatDate(anyDate)  {
    var day   = anyDate.getDate();
    var month = anyDate.getMonth() + 1;
    var year  = anyDate.getFullYear();

    if (day < 10) { day = '0' + day };
    if (month < 10) { month = '0' + month };
    if (year < 10) { year = '0' + year };

    return day + '.' + month + '.' + year;
}


