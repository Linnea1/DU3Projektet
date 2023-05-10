<?php
require_once("functions.php");

$filename = "data/users.json";
$users = json_decode(file_get_contents($filename), true);
$post = json_decode(file_get_contents("php://input"), true);

if($_SERVER["REQUEST_METHOD"] == "POST"){

    if (isset($post["old"], 
                $post["new"],
                $post["password"], 
                $post["username"])){
        change($post, $users, $filename, "password", "username"); // change password
    }

    if (isset($post["username"], 
                $post["new"], 
                $post["password"])){
        change($post, $users, $filename, "username"); // change username
    }

    if (isset($post["email"], 
                $post["new"], 
                $post["password"])){
        change($post, $users, $filename, "email"); // change email
    }

    // if(isset($post["file"], 
    // $post["username"], 
    // $post["password"]))

    if($_FILES){
        $source = $_FILES["pfp"]["tmp_name"];
        $destination = "/loginregister-api/data/pictures/".$_FILES["pfp"]["name"];
        $size = $_FILES["pfp"]["size"];
        $type = $_FILES["pfp"]["type"];
        $time = time();

        $username = $_POST["username"];
        $password = $_POST["password"];

        // if ($type != "image/jpeg" || $type != "image/png"){
        //     send_JSON(["message"=>"Wrong filetype"], 400);
        // }
        // move_uploaded_file($source, $destination);
        
        foreach($users as $user){
            if($user["username"] == $username && $user["password"] == $password){

                $user["pfp"] = "data/pictures/" . $_FILES["pfp"]["name"];

                if(move_uploaded_file($source, "data/pictures/" . $_FILES["pfp"]["name"])){
                    send_JSON($_FILES["pfp"]);
                } else {
                    send_JSON($_FILES["wrong"]);
                }
            }

            send_JSON(["message"=>"Problems with finding user"], 400);
        }
    }

    send_JSON($post);
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