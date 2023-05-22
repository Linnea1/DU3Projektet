<?php
require_once("functions.php");

if(!file_exists("data")){ // if no directory, send a 404 since the username is automatically wrong
    send_JSON(["message"=>"Wrong username or password"], 404);
}

$filename = "data/users.json";
$users = json_decode(file_get_contents($filename), true);
$input = json_decode(file_get_contents("php://input"), true);

if($input["username"] == "" or $input["password"] == ""){ // if empty fields
    send_JSON(["message"=>"Please do not leave any field empty"], 400);
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($input["username"],
            $input["password"])){
        send_JSON(["message"=>"Wrong data"], 401);
    }

    if($users != []){ // if first user, no need to loop through
        foreach($users as $user){
            if($user["username"] == $input["username"] and $user["password"] == $input["password"]){
                unset($user["password"]); // dont send password
                send_JSON($user); 
                // check so username and password is correct
            }
        }
    } 
    send_JSON(["message"=>"Wrong username or password"], 404);
} else {
    send_JSON(["message"=>"Wrong method"], 405);
}
?>