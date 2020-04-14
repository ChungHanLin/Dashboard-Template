<?php

$host = "127.0.0.1";
$port = 8080;

$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP) or die("Socket create failed.\n");
$connection = socket_connect($socket, $host, $port) or die("Server error"); 


// When first visited to the server, send "dashboard" for registering accout.
socket_write($socket, "dashboard");

// If buffer size value change in the server, 512 should be replaced.
$buffer = socket_read($socket, 512, PHP_NORMAL_READ);



socket_close($socket);
?>