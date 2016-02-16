/**
 * Created by i.panfilenko on 16.02.2016.
 */

define([], function () {
    var Socket = {
        Connects: {},
        USEWEBSOCKET: false
    };

    var SocketSingleton = (function () {
        var instance;

        function createInstance() {
            var object = new WebSocket('ws://panfilenkoi:8088');
            return object;
        }

        return {
            getInstance: function () {
                if (!instance) {
                    instance = createInstance();
                }
                return instance;
            }
        };
    })();

    if (Socket.USEWEBSOCKET) {
        Socket.Connects = SocketSingleton.getInstance();
    }

    Socket.Connects.msg = "send";
    Socket.Connects.onopen = function (e) {
        console.log("Connection established!");
    };

    Socket.Connects.onmessage = function (e) {
        console.log("Message add!");
        updateData(); //Update data on client from server
    };

    if (!("send" in Socket.Connects)) {
        Socket.Connects.send = function (e) {
            console.log("Send message!");
        };
    }

    return Socket;
});