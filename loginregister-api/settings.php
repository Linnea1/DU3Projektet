<?php
require_once("functions.php");

$filename = "data/users.json";
$users = json_decode(file_get_contents($filename), true);
$post = json_decode(file_get_contents("php://input"), true);

// if($_SERVER["REQUEST_METHOD"] == "POST"){
//     if(isset($post["email"],
//             $post["username"])) {

//         foreach($users as $user){
//             if($user["username"] == $post["username"]){
//                 $user["email"] = $post["email"];
//                 send_JSON("test");
//             }
//         }

//     } elseif (isset($post["username"])){

//     } elseif (isset($post["password"])){
    
//     } else {
//         send_JSON(["message"=>"Wrong data"], 400);
//     }


// } 


// if($user["username"] == $post["username"] && $user["password"] == $post["password"])

if ($_SERVER["REQUEST_METHOD"] == "DELETE"){
    foreach ($users as $index => $user) {
        if($user["username"] == $post["username"]){
            array_splice($users, $index, 1);
            send_JSON($users);
        }
    }
}



?>