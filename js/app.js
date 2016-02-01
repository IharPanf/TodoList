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
        comparator: 'priority'
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
                priority : newPriority,
                dateStart:(function(){
                    var selectDate = Date.parse($("#datepicker").datepicker('getDate'));
                    return selectDate.toString('dd.MM.yyyy');
                })()
            });
            var taskView = new TaskView({model:newTask});
            $('#target').append(taskView.render().el);
        }
    })
    var task = new Task();
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
    var addNewTaskView = new AddNewTaskView({ collection: tasksCollection });
    $(document.body).append(tasksView.render().el);

    //Header of table
    $("#priority").on('click',function(){
        console.log('qwe');
    })
    $("#status").on('click',function(){
        tasksCollection.comparator = function(tasksCollection) {
            return -tasksCollection.get("status");
        };
        tasksCollection.sort();
        console.log(tasksCollection.toJSON());
    })

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



