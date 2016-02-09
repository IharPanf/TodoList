<?php
require __DIR__ . '/../vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require_once "ConnectSocket.php";

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new ConnectSocket()
        )
    ),
    8088
);

$server->run();