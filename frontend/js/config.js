require.config({
    paths: {
        jquery: 'jquery-1.12.0.min',
        backbone: 'backbone',
        underscore: 'underscore',
        "date": "date",
        "datepicker": "jquery-ui.datepicker.min",
        "datepicker_ru": "jquery-ui.datepicker.min_ru",
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
            deps: ['jquery'],
            exports: 'datepicker_ru'
        },
        'date': {
            exports: 'Date'
        }
    }
});


require(["jquery", "underscore", "m_backbone", "datepicker_ru", "datepicker"], function ($, _, App) {
    $(document).ready(function () {

////////////////// DOM ///////////////////////////////////////
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

        $("#priority").on('click', function () {
            sortView("priority");   // sorting for alphabet
        });

        $("#status").on('click', function () {
            sortView("status");     // sorting for alphabet
        });

        $("#dateStart").on('click', function () {
            sortView("dateStart"); // sorting for alphabet
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

////////////// BACKBONE //////////////////////////////////////////////////////////
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
            tasksCollection.url = App.BASEURL
                + "?action=add&textTask=" + curModel.get('textTask')
                + "&priority=" + curModel.get('priority')
                + "&dateStart=" + curModel.get('dateStart');
            tasksCollection.create(curModel, {
                success: _.bind(function (model, response) {
                    Socket.Connects.send('create');
                }, this),
                error: function (model, response) {
                    console.log("Model created in localstorage");
                }
            });
        }

        //Update data on client from server
        function updateData() {
            tasksCollection.url = App.BASEURL;
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
    })
});

