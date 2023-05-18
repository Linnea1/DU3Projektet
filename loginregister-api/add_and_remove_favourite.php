<?php

ini_set("display_errors", 1);

require_once "functions.php";

$filename = "data/favourites.json";

$json = file_get_contents($filename);
$data = json_decode($json, true);
$method = $_SERVER["REQUEST_METHOD"];

if ($method == "GET") {

    if (isset($_GET["mealId"],$_GET["user"])) {
     
        $recipe = $_GET["mealId"];
        $username = $_GET["user"];
        
        foreach($data as $user){
            if ($user['username'] == $username) {
                
                if (in_array($recipe, $user['mealId'])) {
                    send_JSON(true);
                }else{
                    send_JSON(false);
                }
    
            }
        }
        send_JSON(false);
    }
    

    if (isset($_GET["favourites"])) {
        $username = $_GET["favourites"];
        // echo $newData;
        
        foreach($data as $user){    
            if ($user['username'] === $username) {
                send_JSON($user["mealId"]);
            }
        }
        $error = ["error" => "There are no liked recipes"];
        send_JSON($error, 400);
    
    }

}




if ($method == "POST") {

    $requestJSON = file_get_contents("php://input");
    $requestDATA = json_decode($requestJSON,true);
    
    $username = $requestDATA['username'];
    $mealId = $requestDATA['mealId'];
    

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

                if (in_array($mealId, $userData["mealId"])) {
                    $message = ["message" => "is already added to your favourites"];
                    send_JSON($message, 400);
                }

                $userData["mealId"][] = $mealId;
                $json = json_encode($data, JSON_PRETTY_PRINT);
                file_put_contents($filename, $json);
                send_JSON($userData);
            }
        }
    } else {
        // add the new user to the data array
        $newUser = [
            "username" => $username,
            "mealId" => [$mealId],
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
    $mealId = $requestDATA["mealId"];
    $userExists = false;
    
    foreach ($data as $user) {
        if ($user['username'] == $username) {
            $userExists = true;
            break; // exit the loop once the user is found
        }
    }
    foreach($data as &$userData){
        if ($userData["username"] == $username) {

            foreach($userData["mealId"] as $index => $value){
                if ($value == $mealId) {
                    array_splice($userData["mealId"], $index, 1);
                    $json = json_encode($data, JSON_PRETTY_PRINT);
                    file_put_contents($filename, $json);
                    send_JSON($userData);
                }
            }
        }
    }

}

?>