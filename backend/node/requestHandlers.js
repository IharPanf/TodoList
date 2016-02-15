var mysql = require('./node_modules/mysql');

function show(response, request, action) {
    console.log("Request handler 'show' was called.");
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
        case '':
            con.query(
                "SELECT * FROM todos",
                function (error, result, fields) {
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.write(JSON.stringify(result));
    //                response.end(JSON.stringify(result));
                    response.end();

                }
            );

            break;
        case 'delete':
            con.query(
                "DELETE FROM todos WHERE id =' + paramGet['id']",
                function (error, result, fields) {}
            );
            response.writeHead(204, {"Content-Type": "text/plain"});
            response.end();
            break;

        case 'update':
            con.query(
                "UPDATE todos SET status = " + paramGet['status'] +" WHERE id =" + paramGet['id'],
                function (error, result, fields) {}
            );
            response.writeHead(204, {"Content-Type": "text/plain"});
            response.end();
            break;
    }

}

function parseAction(path) {
    var arrayGet = {};
    var path = path.substr(2).split('&');
    var param;
    for (var i = 0, n = path.length; i < n; i++) {
        param = path[i].split('=');
        arrayGet[param[0]] = param[1];
    }
    return arrayGet;
}
exports.show = show;
