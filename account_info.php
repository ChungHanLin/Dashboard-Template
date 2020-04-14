<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header("Content-Type:text/html; charset=utf-8");
ini_set("default_charset", "utf8");
    
$path = "../C-Crawler-Server/log/account";

// 一定要連線確認在線 account
$host = "127.0.0.1";
$port = 8080;

$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP) or die("Socket create failed.\n");
$connection = socket_connect($socket, $host, $port) or die("Server error"); 

// When first visited to the server, send "dashboard" for registering accout.
socket_write($socket, "dashboard");

// If buffer size value change in the server, 512 should be replaced.
$buffer = socket_read($socket, 512, PHP_NORMAL_READ);
$connected = explode(" ", $buffer);
socket_close($socket);

$file = scandir($path);
$record_list = array();
$record_num = 0;
$success = $fail = $collect = "";

for ($i = 2; $i < count($file); $i++) {
    $fp = fopen($path . "/" . $file[$i], "r");
    $status = "false";
    while (!feof($fp)) {
        $value = fgets($fp);
        
        if (strpos($value, 'Account: ') !== false) {
            $account = substr($value, 9, -1);
        }
        else if(strpos($value, 'Total crawled count: ') !== false) {
            
            $success = substr($value, 21, -1);
        }
        else if (strpos($value, 'Total fail count: ') !== false) {
            $fail = substr($value, 18, -1);
        }
        else if (strpos($value, 'Collected link count: ') !== false) {
            $collect = substr($value, 22, -1);

            for ($j = 0; $j < count($connected) - 1; $j++) {
                if ($account === $connected[$j]) {
                    $status = "true";
                    break;
                }
                else {
                    $status = "false";
                }
            }

            $record_list[$record_num] = array(
                "account"=>$account,
                "status"=>$status,
                "success"=>$success,
                "fail"=>$fail,
                "collect"=>$collect
            );
            $record_num++;
        }
        
    }
    fclose($fp);
}

echo json_encode($record_list);