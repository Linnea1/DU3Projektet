<?php

ini_set("display_errors", 1);

require_once "functions.php";

$filename = "data/favourites.json";

$json = file_get_contents($filename);
$data = json_decode($json, true);
$method = $_SERVER["REQUEST_METHOD"];

if ($method == "GET") {

    if (isset($_GET["idMeal"],$_GET["user"])) {  // if the keys exists
     
        $recipe = $_GET["idMeal"];
        $username = $_GET["user"];
        
        foreach($data as $user){
            if ($user['username'] == $username) {
                
                if (in_array($recipe, $user['idMeal'])) { // if the recipe is a favourite
                    send_JSON(true); // if it is, send back true
                }else{
                    send_JSON(false); // if it is not, send back false
                }
    
            }
        }
        send_JSON(false); // if the user don't have any favourites, send back false
    }
    

    if (isset($_GET["favourites"])) {  // checks after the key favourites
        $username = $_GET["favourites"];
        
        foreach($data as $user){    
            if ($user['username'] === $username) { 
                send_JSON($user["idMeal"]); // if the user exists in the database, send back users list of favourites (meal)
            }
        }
        $error = ["error" => "There are no liked recipes"]; // if the user doesn't exist in the database (favourites.json), send back error and statuscode 404
        send_JSON($error, 404); // not found
    
    }

    if (isset($_GET["ownRecipe"])) { // checks after key

        $ownRecipe = $_GET["ownRecipe"];
        $filename = "data/recipes.json";
        $json = file_get_contents($filename);
        $data = json_decode($json, true);

        foreach($data as $recipe){
            if($recipe["idMeal"] === $ownRecipe){ // if there is a matching id in the database
                send_JSON($recipe); // send it as a response
            }
        }
        $error = ["error" => "Could not find matching idMeal"];
        send_JSON($error, 404);

    }

}


if ($method == "POST") {

    $requestJSON = file_get_contents("php://input");
    $requestDATA = json_decode($requestJSON,true);
    
    $username = $requestDATA['username']; // take out the two keys that are sent in the request
    $idMeal = $requestDATA['idMeal'];
    

    $userExists = false; // start of with giving this vairable the value of false
    
    foreach ($data as $user) {
        if ($user['username'] == $username) { // if the user does exist in the database (favourites.json)
            $userExists = true; // change the value to true
            break; // exit the loop once the user is found
        }
    }
    
    
    if ($userExists) { // if $userExists has the value of true
        // add the new meal to the existing user's array of meals
        foreach($data as &$userData){
            if ($userData["username"] == $username) { // find the correct user

                if (in_array($idMeal, $userData["idMeal"])) { // if the user is trying to add a recipe that already exists in the array
                    $error = ["error" => "This recipe is already added to your favourites"];
                    send_JSON($error, 400); // eller 406?
                }

                $userData["idMeal"][] = $idMeal; //update the array of favourites 
                $json = json_encode($data, JSON_PRETTY_PRINT);
                file_put_contents($filename, $json); // update the database
                send_JSON($userData);
            }
        }
    } else { // if the user doesn't exist in the dataabse and are adding their first favourite
        // add the new user to the data array
        $newUser = [ // make a new assosiativ array
            "username" => $username,
            "idMeal" => [$idMeal],
        ];
        $data[] = $newUser;
        $json = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents($filename, $json); //update the databse and send back the user as response
        send_JSON($newUser);
    }
    
}

if ($method == "DELETE") {
    
    $requestJSON = file_get_contents("php://input");
    $requestDATA = json_decode($requestJSON,true);

    $username = $requestDATA["username"];  // take out the two keys and their value
    $idMeal = $requestDATA["idMeal"];
    // $userExists = false;
    
    foreach ($data as &$user) {
        if ($user['username'] == $username) { // if the user does exist in favourites.json

            foreach($user["idMeal"] as $index => $value){
                if ($value == $idMeal) { // find the matching recipe 
                    array_splice($user["idMeal"], $index, 1); // delete it
                    $json = json_encode($data, JSON_PRETTY_PRINT);
                    file_put_contents($filename, $json); // update the code and send back the whole user
                    send_JSON($user);
                }
            }
            
        }
    }

    // foreach ($data as $user) {
    //     if ($user['username'] == $username) {
    //         $userExists = true;
    //         break; // exit the loop once the user is found
    //     }
    // }
    
    // foreach($data as &$userData){
    //     if ($userData["username"] == $username) {

    //         foreach($userData["idMeal"] as $index => $value){
    //             if ($value == $idMeal) {
    //                 array_splice($userData["idMeal"], $index, 1);
    //                 $json = json_encode($data, JSON_PRETTY_PRINT);
    //                 file_put_contents($filename, $json);
    //                 send_JSON($userData);
    //             }
    //         }
    //     }
    // }


}

?>