<?php
include("./conn.php");
$name=$_REQUEST['username'];
$pwd=$_REQUEST['password'];


$sql="select * from user where user_name='$name' and user_password='$pwd'";
$res=$mysqli->query($sql);
if($res->num_rows>0){
    echo "<script src='../js/cookie.js'></script>";
    echo "<script>cookie.set('isLogin','true',1);cookie.set('username','$name',1);</script>";
    echo "<script>location.href='../html/index.html'</script>";
    echo "<script>alert('登录成功');</script>";
}else{
    echo "<script>alert('用户名或密码错误');</script>";
    echo "<script>location.href=\"../html/login.html\"</script>";
}
$mysqli->close();
?>