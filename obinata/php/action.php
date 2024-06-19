

<?php
header("Content-Type: application/json");

$data=json_decode(file_get_contents('php://input'),true);

$servername="localhost";
$username="user01";
$password="user01";
$db="mydb";

$conn=new mysqli($servername,$username,$password,$db);

if($conn->connect_error){
    die("Connection faild: " .$conn->connect_error);
}


$response=['status'=>'error','message'=>'No exist'];

if(isset($data['name'])&&isset($data['pass'])){
    $sql="select password from MyGuests where username='".$data["name"]."'";
    $result=$conn->query($sql);

    if($result->num_rows>0){
        $row=$result->fetch_assoc();
        if($data["pass"]===$row["password"]){
            $response=['status'=>'success','message'=>'Login successful'];
        }else{
            $response=['status'=>'error','message'=>'Invalid username or password'];
        }
    }else{
        $response=['status'=>'error','message'=>'No exist'];
    }
}else{
    $response=['status'=>'error','message'=>'No exist'];
}

//余計なencodeをするとjsonファイルの形式がおかしくなって文法エラーが起こる
echo json_encode($response);
$conn->close();
?>

