<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header("Content-Type:text/html; charset=utf-8");
ini_set("default_charset", "utf8");
 
$account = isset($_POST["account"]) ? $_POST["account"] : "";

$path = "../C-Crawler-Server/log/account/" . $account .".log";
$log = array();
$fp = fopen($path, "r");
    
while (!feof($fp)) {
    $value = fgets($fp);
    if(strpos($value, 'Account: ') !== false) {
        $account = substr($value, 9, -1);
    }
    else if (strpos($value, 'Begin time: ') !== false) {
        $begin = substr($value, 12, -1);
    }
    else if (strpos($value, 'Finish time: ') !== false) {
        $finish = substr($value, 13, -1);
    }
    else if (strpos($value, 'Total crawled count: ') !== false) {
        $total_success = substr($value, 21, -1);
    }
    else if (strpos($value, 'Recent crawled count: ') !== false) {
        $recent_success = substr($value, 22, -1);
    }
    else if (strpos($value, 'Total fail count: ') !== false) {
        $total_fail = substr($value, 18, -1);
    }
    else if (strpos($value, 'Recent fail count: ') !== false) {
        $recent_fail = substr($value, 19, -1);
    }
    else if (strpos($value, 'Collected link count: ') !== false) {
        $collect = substr($value, 22, -1);
        $log[0] = array(
            "account"=>$account,
            "begin_time"=>$begin,
            "finish_time"=>$finish,
            "total_success"=>$total_success,
            "recent_success"=>$recent_success,
            "total_fail"=>$total_fail,
            "recent_fail"=>$recent_fail,
            "collect_count"=>$collect
        );
    }
    
}
fclose($fp);

echo json_encode($log);