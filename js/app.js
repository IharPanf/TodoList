/**
 * Created by i.panfilenko on 28.01.2016.
 */

$(document).ready(function(){
    var Task = Backbone.Model.extend({
        initialize:function(){
            //    console.log('Model initialized');
        }
    });
    var task = new Task({});

    var itemTasks = [
        {status:"new", priority:0, datStart:'29.01.2016', textTask:'some task'},
        {status:"new", priority:1, datStart:'28.01.2016', textTask:'some task2'},
        {status:"new", priority:0, datStart:'27.01.2016', textTask:'some task3'},
        {status:"new", priority:2, datStart:'26.01.2016', textTask:'some task4'}
    ];

    var template = $("#usageList").html();
    $("#target").html(_.template(template,{itemTasks:itemTasks}));

    var template =  $("#title").html();
    $(".header").html(_.template("Simple Todo List"));

})


