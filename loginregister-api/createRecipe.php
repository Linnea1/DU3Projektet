<?php
require_once("functions.php");
$filename = "data/recipes.json";

if(!file_exists($filename)){ // if no file, create it
    file_put_contents($filename, "[]");
}

$recipes = json_decode(file_get_contents($filename), true);
$post = json_decode(file_get_contents("php://input"), true);

if($_SERVER["REQUEST_METHOD"] == "POST") {
    // Make sure all required fields are provided
    //if (empty($post['strMeal']) || empty($post['strInstructions'])){
   //     send_JSON(["message" => "Please do not leave any field empty"], 400);
    //}

    $listOfIngredients = $post['ingredients'];
    $listOfMeasurements = $post['measurements'];

    $newRecipe = [
        "idMeal" => "x_" . uniqid(),
        "author" => $post['author'],
        "strCategory" => $post['mealCategory'],
        "strMealThumb" => $post['picture'],
        "strMeal" => $post['mealName'],
        "strInstructions" => $post['instructions'],
    ];

    foreach ($listOfIngredients as $key => $ingredient) {
        $newRecipe['strIngredient'. $key] = $ingredient;
    }

    foreach ($listOfMeasurements as $key => $Measurement) {
        $newRecipe['strMeasurement'. $key] = $Measurement;
    }

    // Append new recipe to user's profile
    $recipes[] = $newRecipe;
    file_put_contents($filename, json_encode($recipes, JSON_PRETTY_PRINT)); // add new user to file
    send_JSON($newRecipe);
}elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Handle GET requests to fetch meals by category
    $category = $_GET['category'];

    $filteredMeals = filterMealsByCategory($recipes, $category);

    if (!empty($filteredMeals)) {
        send_JSON(["meals" => $filteredMeals]);
    } else {
        send_JSON(["message" => "No meals found for the specified category"], 404);
    }
} else {
    send_JSON(["message" => "Wrong method"], 405);
}

function filterMealsByCategory($meals, $category)
{
    $filteredMeals = [];
    foreach ($meals as $meal) {
        if ($meal['strCategory'] === $category) {
            $filteredMeals[] = $meal;
        }
    }
    return $filteredMeals;
}

?>