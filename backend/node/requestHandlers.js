var mysql = require('mysql');
var qs = require("querystring");
var url = require("url");
var gFlag = '';
function show(response, request) {
    if (request.url === '/favicon.ico') {
        response.writeHead(404);
        response.end();
    }
    ;

    var query = url.parse(request.url).query,
        params = qs.parse(query);

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
    switch (params.action) {
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
            console.log('destroy');
            con.query(
                "DELETE FROM todos WHERE id =" + params.id,
                function (error, result, fields) {
                }
            );
            response.writeHead(204, {"Content-Type": "application/json"});
            response.end();
            break;
        case 'update':
            console.log('update');
            con.query(
                "UPDATE `todos` SET `status`='" + params.status + "' WHERE `id`=" + params.id,
                function (error, result, fields) {
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.write(JSON.stringify(result));
                    response.end();
                }
            );
            break;
        case 'add':
            if (query !== gFlag) {
                console.log('add');
                con.query(
                    "INSERT INTO `todos` (`textTask`,`dateStart`,`status`,`priority`) VALUE("
                    + "'" + params.textTask + "',"
                    + "'" + params.dateStart + "',"
                    + "'new',"
                    + params.priority
                    + ") ",
                    function (error, result, fields) {
                        response.writeHead(200, {"Content-Type": "application/json"});
                        response.write(JSON.stringify(result));
                        response.end();
                    }
                );
                gFlag = query;
            }
            break;
    }
}

exports.show = show;
