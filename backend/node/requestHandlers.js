var mysql = require('mysql');
var fs = require('fs');
var path = require('path');

function show(response, request, action) {
    var paramGet = parseAction(action);

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "todo"
    });

    con.connect(function (err) {
        if (err) {
            console.log('Error connecting to Db');
            return;
        }
        console.log('Connection established');
    });
    switch (paramGet['action']) {
        case undefined:
            con.query(
                "SELECT * FROM todos",
                function (error, result, fields) {
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.write(JSON.stringify(result));
                    response.end();
                }
            );
            break;
        case 'destroy':
            con.query(
                "DELETE FROM todos WHERE id =" + paramGet['id'],
                function (error, result, fields) {
                }
            );
            response.writeHead(204, {"Content-Type": "text/plain"});
            response.end();
            break;
        case 'update':
            con.query(
                "UPDATE `todos` SET `status`='" + paramGet['status'] + "' WHERE `id`=" + paramGet['id'],
                function (error, result, fields) {
                }
            );
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.end();
            break;
        case 'add':

            con.query(
                "INSERT INTO `todos` (`textTask`,`dateStart`,`status`,`priority`) VALUE("
                + "'" + paramGet['textTask'] + "',"
                + "'" + paramGet['dateStart'] + "',"
                + "'new',"
                + paramGet['priority']
                + ") ",
                function (error, result, fields) {
                }
            );
            break;
    }
}

function parseAction(path) {
    var arrayGet = {};
    if (path.indexOf('?') < 0) {  //no get params
        return arrayGet;
    }
    var path = path.split('?');
    path = path[1].split('&');     //take only get params
    var param;

    for (var i = 0, n = path.length; i < n; i++) {
        param = path[i].split('=');
        arrayGet[param[0]] = param[1];
    }
    return arrayGet;
}

exports.show = show;
