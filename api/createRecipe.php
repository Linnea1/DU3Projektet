<?php
require_once("functions.php");
$filename = "data/recipes.json";
$directory = "data";
$pictures = "data/pictures";
$recipePictures = "data/pictures/recipes";

if(!file_exists($directory)){ // if no directory, create it
    mkdir($directory, 755);
}

if(!file_exists($pictures)){ // if no directory, create it
    mkdir($pictures, 755);
}

if(!file_exists($recipePictures)){ // if no directory, create it
    mkdir($recipePictures, 755);
}

if(!file_exists($filename)){
    file_put_contents($filename, "[]");
}

$recipes = json_decode(file_get_contents($filename), true);

if($_SERVER["REQUEST_METHOD"] == "POST") {//upload new recipe
    $mealName = $_POST['mealName'];
    if (empty($mealName)) {
        send_JSON(["message" => "Meal name cannot be empty"], 400);
    }
    
    $newRecipe = [
        "idMeal" => "x_" . uniqid(),
        "author" => $_POST['author'],
        "strCategory" => $_POST['mealCategory'],
        "strMeal" => $_POST['mealName'],
        "strInstructions" => $_POST['instructions'],
    ];

    for ($i = 1; $i <= 20; $i++) {
        if (empty($_POST['strIngredient' . $i])) {
            break;
        }
        $newRecipe['strIngredient' . $i] = $_POST['strIngredient' . $i];
    } 
    
    for ($i = 1; $i <= 20; $i++) {
        if (empty($_POST['strMeasure' . $i])) {
            break;
        }
        $newRecipe['strMeasure' . $i] = $_POST['strMeasure' . $i];
    }
    if(!empty($_FILES["picture"]["tmp_name"])){
        $source = $_FILES["picture"]["tmp_name"];
        
        $size = $_FILES["picture"]["size"];
        $type = $_FILES["picture"]["type"];
        $time = time();
    
        $allowedFiles = ["image/jpeg", "image/png", "image/gif"];
        if (!in_array($type, $allowedFiles)){
            send_JSON(["message"=>"Wrong filetype"], 415);
        }
        
        $ending = str_replace("image/", ".", $type);
        $filePath = "data/pictures/recipes/";
        $name = $time . $ending;
        $destination = "api/data/pictures/recipes/". $name;
        
        $newRecipe['strMealThumb'] = $destination;
        $recipes[] = $newRecipe;
        
        if (isset($_FILES["picture"]) && $_FILES["picture"]["error"] === UPLOAD_ERR_OK){
            if(move_uploaded_file($source, $filePath . $name)){
                file_put_contents($filename, json_encode($recipes, JSON_PRETTY_PRINT));
                send_JSON($newRecipe);
            } else {
                send_JSON(["message" => "Failed to upload picture"], 400);
            }
        }else{
            
        }
      
    }else{//If there is no picture added, standard will be a basic picture.
        $newRecipe['strMealThumb'] = "icons/PinkPot.jpg";
        $recipes[] = $newRecipe;
        file_put_contents($filename, json_encode($recipes, JSON_PRETTY_PRINT));
        send_JSON($newRecipe);
    }
    
}elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    if(isset($_GET["category"])){//Get recipes from categories
        $category = $_GET['category'];

        $filteredMeals = filterMeals($recipes, $category, 'strCategory');
        send_JSON(["meals" => $filteredMeals]);
    }
    if(isset($_GET["author"])){//Get recipes from author
        $recipeAuthor = $_GET['author'];

        $filteredMeals = filterMeals($recipes, $recipeAuthor, 'author');
        send_JSON(["meals" => $filteredMeals]);
    }
}else {
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
