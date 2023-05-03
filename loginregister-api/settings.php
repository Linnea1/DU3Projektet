<?php
require_once("functions.php");

$filename = "data/users.json";
$users = json_decode(file_get_contents($filename), true);
$post = json_decode(file_get_contents("php://input"), true);

if($_SERVER["REQUEST_METHOD"] == "POST"){
    // if(isset($post["email"],
    //         $post["username"])) {

    //     foreach($users as $user){
    //         if($user["username"] == $post["username"]){
    //             $user["email"] = $post["email"];
    //             send_JSON("test");
    //         }
    //     }

    // } 
    if (isset($post["username"], // change username
            $post["new"], 
            $post["password"])){
        foreach ($users as $index => $user) {
            if($user["username"] == $post["username"] && $user["password"] == $post["password"]){

                //////////////
                tooShort($post["new"], "username");

                $splitUsername = str_split($post["new"]);
                incorrectChar($splitUsername, "username");
                //////////////

                $users[$index]["username"] = $post["new"];
                file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));

                send_JSON($post["new"]);
            }
        }
    } 
    // elseif (isset($post["password"])){
    
    // } else {
    //     send_JSON(["message"=>"Wrong data"], 400);
    // }


} 

if ($_SERVER["REQUEST_METHOD"] == "DELETE"){
    foreach ($users as $index => $user) {
        if($user["username"] == $post["username"] && $user["password"] == $post["password"]){
            array_splice($users, $index, 1);
            file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));

            send_JSON(["message"=>"User has been deleted"]);
        }
    }
}



?>