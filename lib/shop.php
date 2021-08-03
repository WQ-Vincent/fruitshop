<?php
    include('./conn.php');

    $idList = $_REQUEST['idList'];

    $sql = "select * from product where id in ($idList)";

    $res = $mysqli->query($sql);
    
    $arr = array();

    while($row=$res->fetch_assoc()){
        array_push($arr,$row);
    }


    $json = json_encode($arr);

    echo $json;

    $mysqli->close();
?>