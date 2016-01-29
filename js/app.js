/**
 * Created by i.panfilenko on 28.01.2016.
 */

$(document).ready(function() {
	'use strict'
    var Task = Backbone.Model.extend({
        initialize: function() {
            //    console.log('Model initialized');
        },
        defaults: {
            status  : "new",
            priority: 0,
            datStart: '01.01.2016',
            textTask: ''
        }
    });

    var CollectionTask = Backbone.Collection.extend({
        model: Task
    });

    var collectionTask = new CollectionTask (
        [   {status:"new", priority:0, dateStart:'29.01.2016', textTask:'some task'},
            {status:"new", priority:1, dateStart:'28.01.2016', textTask:'some task2'},
            {status:"new", priority:0, dateStart:'27.01.2016', textTask:'some task3'},
            {status:"new", priority:2, dateStart:'26.01.2016', textTask:'some task4'}
        ]
    );

//TODO Наверное всетаки стоит вынести в объект collectionTask
    var template = $("#usageList").html();
	
    var itemTasks = [ {status:"new", priority:0, dateStart:'29.01.2016', textTask:'some task'},
                      {status:"new", priority:1, dateStart:'28.01.2016', textTask:'some task2'},
                      {status:"new", priority:0, dateStart:'27.01.2016', textTask:'some task3'},
                      {status:"new", priority:2, dateStart:'26.01.2016', textTask:'some task4'}
                    ]
///////
    var TaskView = Backbone.View.extend({
        tagName : 'div',
        todoTpl : _.template(template,{itemTasks:itemTasks}),
        initialize: function() {
            this.$el =  $("#target");
            this.listenTo(collectionTask, 'all', this.render());
            $('.btn').on('click',this.addNewTask);
        },
        render: function() {
            this.$el.html(this.todoTpl);
            return this;
        },
        close: function(){
            alert('close');
        },
        addNewTask: function(){
           var _this = this;
           var newTextTask = $('#textText').val();
           var priorityTask  = $('#statusText').val();
           
		   if (newTextTask != "") {
               var newTask = new Task({
                    priority : priorityTask,
                    textTask : newTextTask
               });
              //Add in collection
              console.log('add in collection');
           } else {
               alert('Empty text task!');
           }
        }
    })

    var taskView = new TaskView ({
        model:Task
    })


    ///////////////////////////////
/*
    var template = $("#usageList").html();
    $("#target").html(_.template(template,{itemTasks:itemTasks}));
*/
    var templateHeader =  $("#title").html();
    $(".header").html(_.template("Simple Todo List"));

})


