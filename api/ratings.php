<?php
require_once("functions.php");
$filename = "data/comments.json";
$directory = "data";

if(!file_exists("data")){ // if no directory, create it
    mkdir($directory, 755);
}
if(!file_exists($filename)){ // if no file, create it
    file_put_contents($filename, "[]");
}

$data = json_decode(file_get_contents($filename), true);
// all recipes
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $post = json_decode(file_get_contents("php://input"), true);
    $ids = $post['listOfIds'];

    

    $ratings = [];
    foreach ($ids as $id) {
        $rating = [];
        foreach ($data as $element) {
            if ($element['recipeId'] === $id && isset($element['rating'])) {
                $rating[] = $element['rating'];
            }
        }

        if (!empty($rating)) {
            $average = array_sum($rating) / count($rating);
            $ratings[] = $average;
        }else{
            $ratings[] = 0;
        }
    }

    send_JSON($ratings);
}elseif ($_SERVER["REQUEST_METHOD"] == "GET") {  /// only one recipe
    if (isset($_GET["id"])) {
        $id = $_GET["id"];
        $ratings = [];
        foreach ($data as $element) {
            if ($element['recipeId'] === $id && isset($element['rating'])) {
                $ratings[] = $element['rating'];
            }
        }
    
        if (!empty($ratings)) {
            $average = array_sum($ratings) / count($ratings);
            $rating = $average;
        }else{
            $rating = 0;
        }
        
        send_JSON($rating);
    } else {
        send_JSON(["message" => "No ID provided for retrieving comments"], 400);
    }

    send_JSON($ratings);
}else{
    send_JSON(["message"=>"Wrong method"], 405);
}

?>