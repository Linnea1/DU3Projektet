<?php
require_once("functions.php");

$filename = "data/users.json";
$users = json_decode(file_get_contents($filename), true);
$post = json_decode(file_get_contents("php://input"), true);

if($_SERVER["REQUEST_METHOD"] == "POST"){

    if ((isset($post["username"], 
                $post["new"], 
                $post["password"]))){
        change($post, $users, $filename, "username"); // change username
    }

    if ((isset($post["email"], 
                $post["new"], 
                $post["password"]))){
        change($post, $users, $filename, "email"); // change email
    }
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE"){
    foreach ($users as $index => $user) {
        if($user["username"] == $post["username"] && $user["password"] == $post["password"]){
            array_splice($users, $index, 1); // remove from list
            file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));

            send_JSON(["message"=>"User has been deleted"]);
        }
    }
}

send_JSON(["message"=>"Wrong method"], 405);

?>