/**
 * Created by i.panfilenko on 28.01.2016.
 */

$(document).ready(function() {
	'use strict'
    var Task = Backbone.Model.extend({
        defaults: {
            status   : 'new',
            priority : 0,
            dateStart: '01.01.2016',
            textTask : ''
        }
    });

    var TaskCollection = Backbone.Collection.extend({
        model: Task
    });

    // The View for a Task (one)
    var TaskView = Backbone.View.extend({
        tagName: 'tr',
        template: _.template($('#usageList').html() ),
        initialize:function(){
            this.model.on('change', this.render, this)
        },
        events: {
            'click .remove' : 'remove'
        },
        render: function() {
            this.$el.html( this.template(this.model.toJSON()) );
            return this;
        },
        remove: function(){
            this.$el.remove();
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
    //View for buttons "Add" and "Remove"
    var AddNewTaskView = Backbone.View.extend({
        initialize:function(){
            $('#add').on('click',this.addNewTask);
        },
        addNewTask: function() {
            var newTextTask = $('#textTask').val();
            var newPriority = $('#priorityTask').val();
            var newTask = new Task({
                textTask : newTextTask,
                priority : newPriority
            });
            var taskView = new TaskView({model:newTask});
            $('#target').append(taskView.render().el);
        }
    })

    var tasksCollection = new TaskCollection([
        { textTask: 'SomeTask1', priority: 2 },
        { textTask: 'SomeTask2', dateStart: '01.02.2016'},
        { textTask: 'SomeTask3'},
        { textTask: 'SomeTask4'}
    ]);

    var addNewTaskView = new AddNewTaskView({ collection: tasksCollection });
    var tasksView = new TasksView({ collection: tasksCollection });
    $(document.body).append(tasksView.render().el);

    var templateHeader =  $('#title').html();
    $('.header').html(_.template('Simple Todo List'));

})


