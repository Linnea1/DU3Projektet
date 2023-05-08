<?php
require_once("functions.php");
$filename="data/recipes.json";
if(!file_exists($filename)){ // if no file, create it
    file_put_contents($filename, "[]");
}

if($_SERVER["REQUEST_METHOD"] == "POST") {
    // Make sure all required fields are provided
    if (empty($_POST['strMeal']) || empty($_POST['strCategory']) || empty($_POST['strInstructions'])){
        send_JSON(["message"=>"Please do not leave any field empty"], 400);
    }
    
    // Iterate over users array to find matching author
    $found_author = false;
    foreach ($users as $key => &$user) {
        if ($key === $post['author']) {
            // Found matching author, update user's profile with new recipe
            $newRecipe = [
                "idMeal" => "",
                "strCategory" => $post['mealCategory'],
                "strMealThumb" => $post['picture'],
                "strMeal" => $post['strMeal'],
                "strCategory" => $post['strCategory'],
                "strInstructions" => $post['strInstructions'],
            ];

            foreach ($listOfIngredients as $key => $ingredient) {
                $newRecipe['strIngredient'. $key] = $ingredient;
            }

            foreach ($listOfMeasurements as $key => $Measurement) {
                $newRecipe['strMeasurement'. $key] = $Measurement;
            }

            // Append new recipe to user's profile
            $user['recipes'][] = $newRecipe;
            $found_author = true;
            break;
        }
    }

    if (!$found_author) {
        send_JSON(["message"=>"Author not found"], 404);
    }

    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT)); // add new user to file
    send_JSON($newRecipe); 
} else {
    send_JSON(["message"=>"Wrong method"], 405);
}

?>