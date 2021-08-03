<?php
    include('./conn.php');
    $keyword = $_REQUEST['keyword'];
    $sql = "select * from product where title like '%$keyword%' limit 3";

    $res = $mysqli->query($sql);

    $arr = array();

    while($row = $res->fetch_assoc()){
        array_push($arr,$row);
    }

    $json = json_encode($arr);

    echo $json;

    $mysqli->close();
?>