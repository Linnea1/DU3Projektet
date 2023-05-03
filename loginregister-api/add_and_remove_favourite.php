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
    
    


// for ($i=0; $i < count($data); $i++) { 
//     if ($data[$i]["username"] == $username) {
       
//         $mealArray[] = $meal;
//         $data[$i]["meal"] = $mealArray;
        
//         $data[] = $data[$i];

//         $json = json_encode($user, JSON_PRETTY_PRINT);
//         file_put_contents($filename, $json);
//         send_JSON($data[$i]);
//     }
// }

// // print_r($user);

// //Nu adderar den ingenting
// foreach($data as $user){
//     if ($user["username"] == $username) {
//         $mealArray[]= $meal;
//         $user["meal"] = $mealArray;
        
//         $data[] = $user;
        

//         $json = json_encode($data, JSON_PRETTY_PRINT);
//         file_put_contents($filename, $json);
//         send_JSON($user);
//     }
// }

// $newUser = [
//     "username" => $username,
//     "meal" => $meal,
//     "message" => "ny användare"
// ];


// // print_r($newUser);
// $data[] = $newUser;
// $json = json_encode($data, JSON_PRETTY_PRINT);
// file_put_contents($filename, $json);
// send_JSON($newUser);

?>