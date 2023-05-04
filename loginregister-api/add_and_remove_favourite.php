<?php

ini_set("display_errors", 1);

require_once "functions.php";

$filename = "data/favourites.json";

$json = file_get_contents($filename);
$data = json_decode($json, true);
$method = $_SERVER["REQUEST_METHOD"];

if ($method == "GET") {
    
    $recipe = $_GET["meal"];
    $username = $_GET["user"];



    foreach($data as $user){

        if ($user['username'] == $_GET["user"]) {
            
            if (in_array($recipe, $user['meal'])) {
                send_JSON(true);
            }else{
                send_JSON(false);
            }
        }
    }

}




if ($method == "POST") {

    $requestJSON = file_get_contents("php://input");
    $requestDATA = json_decode($requestJSON,true);
    
    $username = $requestDATA["username"];
    $meal = $requestDATA["meal"];
    

    $userExists = false;
    
    foreach ($data as $user) {
        if ($user['username'] == $username) {
            $userExists = true;
            break; // exit the loop once the user is found
        }
    }
    
    
    if ($userExists) {
        // add the new meal to the existing user's array of meals
        foreach($data as &$userData){
            if ($userData["username"] == $username) {

                if (in_array($meal, $userData["meal"])) {
                    $message = ["message" => "is already added to your favourites"];
                    send_JSON($message, 400);
                }

                $userData["meal"][] = $meal;
                $json = json_encode($data, JSON_PRETTY_PRINT);
                file_put_contents($filename, $json);
                send_JSON($userData);
            }
        }
    } else {
        // add the new user to the data array
        $newUser = [
            "username" => $username,
            "meal" => [$meal],
        ];
        $data[] = $newUser;
        $json = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents($filename, $json);
        send_JSON($newUser);
    }
    
}

if ($method == "DELETE") {
    
    $requestJSON = file_get_contents("php://input");
    $requestDATA = json_decode($requestJSON,true);

    $username = $requestDATA["username"];
    $meal = $requestDATA["meal"];
    $userExists = false;
    
    foreach ($data as $user) {
        if ($user['username'] == $username) {
            $userExists = true;
            break; // exit the loop once the user is found
        }
    }
    foreach($data as &$userData){
        if ($userData["username"] == $username) {

            foreach($userData["meal"] as $index => $value){
                if ($value == $meal) {
                    array_splice($userData["meal"], $index, 1);
                    $json = json_encode($data, JSON_PRETTY_PRINT);
                    file_put_contents($filename, $json);
                    send_JSON($userData);
                }
            }
        }
    }

}

?>