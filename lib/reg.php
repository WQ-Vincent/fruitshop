<?php
    include('./conn.php');

    // 接收前端发送的数据
    $username = $_REQUEST['regusername'];
    $password =$_REQUEST['regpassword'];

    // echo "$username , $password";
    

    $sql = "select * from user where user_name='$username'";  //查询语句

    $result = $mysqli->query($sql);  //执行sql语句

    if($result->num_rows > 0){
        echo '<script>alert("用户名已存在");</script>';
        echo '<script>location.href="../html/login.html";</script>';
        $mysqli->close();
        die; //如果用户名存在 代码不再往下执行
    }

    $insSql = "insert into user(user_name,user_password,user_phone,user_email) values ('$username','$password','','')";//插入语句

    $res = $mysqli->query($insSql);//执行插入语句

    if($res){
        echo '<script>alert("注册成功")</script>';
        echo '<script>location.href="../html/login.html"</script>';
    }

    $mysqli->close();

?>