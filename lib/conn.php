<?php
header('content-type:text/html;charset=utf-8');
$hff = array(
    'host'=>'localhost:3306',
    'user'=>'root',
    'pwd'=>'123456',
    'db'=>'fruitshop'
);   //wangqiang
$mysqli = @new mysqli($hff['host'],$hff['user'],$hff['pwd'],$hff['db']);
if($mysqli->connect_errno){
    die('连接错误'.$mysqli->connect_errno);
}
$mysqli->query("st names utf8");
$sl=$mysqli->select_db($hff['db']);
if(!$sl){
    die('数据库连接错误'.$mysqli->error);
}else{

}


?>