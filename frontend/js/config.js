require.config({
    paths: {
        jquery: 'jquery-1.12.0.min',
        backbone: 'backbone',
        underscore: 'underscore',
        "date": "date",
        "datepicker": "jquery-ui.datepicker.min",
        "datepicker_ru": "jquery-ui.datepicker.min_ru"
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'datepicker': {
            deps: ['jquery'],
            exports: 'datepicker'
        },
        'datepicker_ru': {
            deps: ['jquery', 'datepicker'],
            exports: 'datepicker_ru'
        },
        'date': {
            exports: 'Date'
        }
    }
});


require(["jquery", "underscore", "m_backbone", "m_localstorage", "m_websocket", "datepicker", "datepicker_ru"], function ($, _, App, LS, Socket) {
    $(document).ready(function () {
////////////// BACKBONE //////////////////////////////////////////////////////////
        var tasksCollection = new App.Collections.TaskCollection();
        var tasksView = new App.Views.TasksView({collection: tasksCollection});

        //Header of table
        $('#add').on('click', function (e) {        //add new task
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
            tasksCollection.createData(newTask);
        });
////////////////// LOCALSTORAGE //////////////////////////////
        LS.updateData = function () {
            var tempAction, curModel, modelInCollection;
            for (var model in localStorage) {
                tempAction = model.split('%')[1];
                curModel = JSON.parse(localStorage.getItem(model));
                switch (tempAction) {
                    case 'create' :
                        localStorage.removeItem(model);
                        var newTask = new App.Models.Task({
                            textTask: curModel.textTask,
                            priority: curModel.priority,
                            dateStart: curModel.dateStart,
                            status: 'local'
                        });
                        tasksCollection.createData(newTask);
                        break;
                    case 'save'  :
                        console.log('save');
                        modelInCollection = tasksCollection.get(curModel.id);
                        if (modelInCollection) {
                            modelInCollection.url = App.BASEURL
                                + "?action=update&id="
                                + modelInCollection.get("id")
                                + "&status="
                                + modelInCollection.get("status");
                            modelInCollection.save(null, {
                                success: _.bind(function () {
                                    Socket.Connects.send('save');
                                }, this)
                            });
                        }
                        localStorage.removeItem(model);
                        break;
                    case 'destroy' :
                        console.log('destroy');
                        localStorage.removeItem(model);
                        var idDelete = curModel.id;
                        modelInCollection = tasksCollection.get(curModel.id);
                        if (modelInCollection) {
                            modelInCollection.url = App.BASEURL + "?action=destroy&id=" + idDelete;
                            modelInCollection.destroy({
                                success: _.bind(function (model, response) {
                                    Socket.Connects.send('delete');
                                }, this)
                            });
                        }
                }
            }
        };
////////////////// DOM ///////////////////////////////////////
        $("#priority").on('click', function () {
            tasksCollection.comparator = 'priority';
            tasksCollection.sort();                     // sorting for alphabet
        });

        $("#status").on('click', function () {
            tasksCollection.comparator = 'status';
            tasksCollection.sort();                     // sorting for alphabet
        });

        $("#dateStart").on('click', function () {
            tasksCollection.comparator = 'dateStart';
            tasksCollection.sort();                     // sorting for alphabet
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
    })
});

