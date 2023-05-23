<?php
require_once("functions.php");
$filename = "data/recipes.json";
$uploadFolder = "data/recipePictures/";

if(!file_exists($filename)){
    file_put_contents($filename, "[]");
}

$recipes = json_decode(file_get_contents($filename), true);
$post = json_decode(file_get_contents("php://input"), true);

if($_SERVER["REQUEST_METHOD"] == "POST") {
 
    //if (empty($post['strMeal']) || empty($post['strInstructions'])){
    //    send_JSON(["message" => "Do not leave any field empty"], 400);
    //}

    $listOfIngredients = $post['ingredients'];
    $listOfMeasurements = $post['measurements'];

    $newRecipe = [
        "idMeal" => "x_" . uniqid(),
        "author" => $post['author'],
        "strCategory" => $post['mealCategory'],
       // "strMealThumb" => $post['picture'],
        "strMeal" => $post['mealName'],
        "strInstructions" => $post['instructions'],
    ];

    foreach ($listOfIngredients as $key => $ingredient) {
        $index = $key + 1;
        $newRecipe['strIngredient'. $index] = $ingredient;
    }

    foreach ($listOfMeasurements as $key => $Measurement) {
        $index = $key + 1;
        $newRecipe['strMeasure'. $index] = $Measurement;
    }

    $recipes[] = $newRecipe;
    file_put_contents($filename, json_encode($recipes, JSON_PRETTY_PRINT));
    send_JSON($newRecipe);
}elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
   if(isset($_GET["category"])){
    $category = $_GET['category'];

    $filteredMeals = filterMeals($recipes, $category, 'strCategory');
    send_JSON(["meals" => $filteredMeals]);
   }
   if(isset($_GET["author"])){
    $recipeAuthor = $_GET['author'];

    $filteredMeals = filterMeals($recipes, $recipeAuthor, 'author');
    send_JSON(["meals" => $filteredMeals]);
   }


   ////// 
   if($_FILES){
    $source = $_FILES["picture"]["tmp_name"];
    $destination = "loginregister-api/data/pictures/".$_FILES["picture"]["name"];
    $size = $_FILES["picture"]["size"];
    $type = $_FILES["picture"]["type"];
    $time = time();

    $allowedFiles = ["image/jpeg", "image/png"]; // checking so that the filetype is allowed
        if (!in_array($type, $allowedFiles)){
            send_JSON(["message"=>"Wrong filetype"], 400);
        }

        $ending = str_replace("image/", ".", $type);
        $filePath = "loginregister-api/data/pictures/";
        $name = $time . $ending;

        if(move_uploaded_file($source, "data/pictures/recipe/" . $name)){

        }
   }
   
} else {
    send_JSON(["message" => "Wrong method"], 405);
}

function filterMeals($meals, $category, $key)
{
    $filteredMeals = [];
    foreach ($meals as $meal) {
        if ($meal[$key] === $category) {
            $filteredMeals[] = $meal;
        }
    }
    return $filteredMeals;
}

?>