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
$input = json_decode(file_get_contents("php://input"), true);

if($_SERVER["REQUEST_METHOD"] == "POST"){ // make sure its the right method

    if($input["username"] == "" or $input["password"] == ""){  // if field(s) empty
        send_JSON(["message"=>"Please do not leave any field empty"], 400);
    }

    if(!isset($input["email"], // check that it's the right data
            $input["username"],
            $input["password"])){
        send_JSON(["message"=>"Wrong data"], 401);
    }

    if(!preg_match("/(@)(.)/", $input["email"])){ // checking that the email has @ and .
        send_JSON(["message"=>"Please enter a valid email"], 401);
    }

    //////////////

    // different requirments
    tooShort($input["username"], "username");
    tooShort($input["password"], "password");

    $splitUsername = str_split($input["username"]);
    $splitPassword = str_split($input["password"]);
    $splitEmail = str_split($input["email"]);

    incorrectChar($splitUsername, "username");
    incorrectChar($splitPassword, "password");
    incorrectChar($splitEmail, "email");
    
    //////////////

    if($users != []){ // dont do this if no users yet
        foreach($users as $user){
            if($user["username"] == $input["username"]){ // check if username already exists
                send_JSON(["message"=>"Username already taken"], 409); 
            }
            if($user["email"] == $input["email"]){ // check if email already exists
                send_JSON(["message"=>"Email already taken"], 409); 
            }
        }
    }

    $newUser = [ // create new user
        "email" => $input["email"],
        "username" => $input["username"],
        "password" => $input["password"]
    ];
    $users[] = $newUser; 
    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT)); // add new user to file

    unset($newUser["password"]); // dont send password
    send_JSON($newUser); // return the new user

} else {
    send_JSON(["message"=>"Wrong method"], 405);
}

?>