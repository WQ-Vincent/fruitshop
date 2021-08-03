<?php
    include('./conn.php');

    $sql = "select * from product where id between 22 and 24";

    $res = $mysqli->query($sql);

    $arr = array();   //wangqiang

    while($row = $res->fetch_assoc()){
        array_push($arr,$row);
    }

    $json = json_encode($arr);

    echo $json;

    $mysqli->close();
?>