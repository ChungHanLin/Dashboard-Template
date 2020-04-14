<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header("Content-Type:text/html; charset=utf-8");
ini_set("default_charset", "utf8");
 
$status = isset($_POST["status"]) ? $_POST["status"] : "";
$path = "../C-Crawler-Server/log/analysis.log";

function cmp($a, $b) {
    return ($a["rate"] >= $b["rate"]) ? -1 : 1;
}

if ($status === "true") {
    // Should connect to the socket server
    $host = "127.0.0.1";
    $port = 8080;

    $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP) or die("Socket create failed.\n");
    $connection = socket_connect($socket, $host, $port) or die("Server error"); 

    // When first visited to the server, send "dashboard" for registering accout.
    socket_write($socket, "dashboard");

    // If buffer size value change in the server, 512 should be replaced.
    $buffer = socket_read($socket, 512, PHP_NORMAL_READ);

    socket_write($socket, "@IP analysis");
    $buffer = socket_read($socket, 512, PHP_NORMAL_READ);

    socket_close($socket);
}

// 開檔讀取
$fp = fopen($path, "r");
$route = array();
$route_cnt = $error = 0;

while (!feof($fp)) {
    $value = fgets($fp);
    $value = str_replace("\n", "", $value);
    $str = explode(" ", $value);
    if (count($str) === 3) {
        if ($str[1] === "0" && $str[2] === "0") {
            continue;
        }
        $error = round(intval($str[2]) / (intval($str[1]) + intval($str[2])), 2); 
        $route[$route_cnt] = array(
                "ip"=>$str[0],
                "success"=>$str[1],
                "fail"=>$str[2],
                "rate"=>$error
            );
        $route_cnt++;
    }
    
}
fclose($fp);

usort($route, 'cmp');

echo json_encode($route);