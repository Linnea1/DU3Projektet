<?php

ini_set("display_errors", 1);

require_once "functions.php";

$directory = "data";
$filename = "data/favourites.json";
$filenameOwnRecipes = "data/recipes.json";

if(!file_exists("data")){ // if no directory, create it
    mkdir($directory, 755);
}
if(!file_exists($filename)){ // if no file, create it
    file_put_contents("data/favourites.json", "[]");
}

if(!file_exists("data/recipes.json")){ // if no file, create it
    file_put_contents("data/recipes.json", "[]");
}

if(!file_exists("data/users.json")){ // if no file, create it
    file_put_contents("data/users.json", "[]");
}


$json = file_get_contents($filename);
$data = json_decode($json, true);
$method = $_SERVER["REQUEST_METHOD"];


$jsonRecipe = file_get_contents($filenameOwnRecipes);
$dataRecipe = json_decode($jsonRecipe, true);

if ($method == "GET") {

    if (isset($_GET["idMeal"],$_GET["user"])) { // checks if the keys exists
     
        $recipe = $_GET["idMeal"];
        $username = $_GET["user"];
        
        foreach($data as $user){
            if ($user['username'] == $username) {
                
                if (in_array($recipe, $user['idMeal'])) {  // if the recipe exist in the users favourites
                    send_JSON(true);
                }else{
                    send_JSON(false); // if it doesn't
                }
    
            }
        }
        send_JSON(false); // if the user don't have any favourites
    }
    

    if (isset($_GET["favourites"])) { 
        $username = $_GET["favourites"];
        // echo $newData;
        
        foreach($data as $user){    
            if ($user['username'] === $username) {
                send_JSON($user["idMeal"]);  // Gets all the users favourite recipes
            }
        }
        $error = ["message" => "There are no liked recipes"];  // if there are no favourites
        send_JSON($error, 400);
    
    }

    if (isset($_GET["ownRecipe"])) { // checks after key

        $ownRecipe = $_GET["ownRecipe"];

        foreach($dataRecipe as $recipe){
            if($recipe["idMeal"] === $ownRecipe){ // if there is a matching id in the database
                send_JSON($recipe); // send it as a response
            }
        }
        $error = ["message" => "Could not find matching recipe"];
        send_JSON($error, 404);

    }

    if (isset($_GET["ourOwnDatabase"])) {

        $ownRecipeName = $_GET["ourOwnDatabase"];

        foreach($dataRecipe as $recipe){
            if(strstr($recipe["strMeal"],$ownRecipeName )){ // if there is a matching id in the database
                send_JSON($recipe); // send it as a response
            }
        }
        $error = ["message" => "Could not find a matching recipe to your input"];
        send_JSON($error, 404);

    }


    if (isset($_GET["author"])) {
        $author = $_GET["author"];

        $filename = "data/users.json";
        $json = file_get_contents($filename);
        $data = json_decode($json, true);

        foreach($data as $user){
            if ($user['username'] === $author) {
                send_JSON($user);  // if we find the matching user then we send it as response
            }
        }
        $error = ["message" => "Could not find a matching user"];
        send_JSON($error, 404);
    }

}

if ($method == "POST") {

    $requestJSON = file_get_contents("php://input");
    $requestDATA = json_decode($requestJSON,true);
    
    $username = $requestDATA['username']; // take out the two keys that are sent in the request
    $idMeal = $requestDATA['idMeal'];
    
    foreach($data as &$userData){
        if ($userData["username"] == $username) { // find the correct user

            if (in_array($idMeal, $userData["idMeal"])) { // if the user is trying to add a recipe that already exists in the array
                $error = ["message" => "This recipe is already added to your favourites"];
                send_JSON($error, 400); // eller 406?
            }
            $userData["idMeal"][] = $idMeal; //update the array of favourites 
            $json = json_encode($data, JSON_PRETTY_PRINT);
            file_put_contents($filename, $json); // update the database
            send_JSON($userData);
        }
        
    }  
    
    // if the user doesn't exist in the dataabse and are adding their first favourite
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



if ($method == "DELETE") {
    $requestJSON = file_get_contents("php://input");
    $requestDATA = json_decode($requestJSON, true);

    $username = $requestDATA["username"];
    $idMeal = $requestDATA["idMeal"];

    foreach ($data as $userIndex => $user) {
        if ($user['username'] == $username) {
            foreach ($user["idMeal"] as $mealIndex => $value) {
                if ($value == $idMeal) {
                    array_splice($data[$userIndex]["idMeal"], $mealIndex, 1);
                    $json = json_encode($data, JSON_PRETTY_PRINT);
                    file_put_contents($filename, $json);
                    send_JSON($user);
                }
            }
        }
    }

    send_JSON(["message"=>"recipe could not be deleted"], 400);

}


?>