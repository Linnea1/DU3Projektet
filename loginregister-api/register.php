<?php

require_once("functions.php");

$filename = "data/users.json";
$directory = "data";
if(!file_exists("data")){ // if no directory, create it
    mkdir($directory, 755);
}
if(!file_exists($filename)){ // if no file, create it
    file_put_contents($filename, "[]");
}

$users = json_decode(file_get_contents($filename), true);
$post = json_decode(file_get_contents("php://input"), true);

if($_SERVER["REQUEST_METHOD"] == "POST"){ // make sure its the right method

    if($post["username"] == "" or $post["password"] == ""){  // if field(s) empty
        send_JSON(["message"=>"Please do not leave any field empty"], 400);
    }

    if(!isset($post["email"], // check that it's the right data
            $post["username"],
            $post["password"])){
        send_JSON(["message"=>"Wrong data"], 401);
    }

    if(!str_contains($post["email"], "@")){ // checking that the email is an email
        send_JSON(["message"=>"Please enter a valid email"], 401);
    }

    if($users != []){ // dont do this if no users yet
        foreach($users as $user){
            if($user["username"] == $post["username"]){ // check if username already exists
                send_JSON(["message"=>"Username already taken"], 409); 
            }
            if($user["email"] == $post["email"]){ // check if email already exists
                send_JSON(["message"=>"Email already taken"], 409); 
            }
        }
    }

    $newUser = [ // create new user
        "email" => $post["email"],
        "username" => $post["username"],
        "password" => $post["password"]
    ];
    $users[] = $newUser; 
    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT)); // add new user to file

    unset($newUser["password"]); // dont send password
    send_JSON($newUser); // return the new user

} else {
    send_JSON(["message"=>"Wrong method"], 405);
}

?>