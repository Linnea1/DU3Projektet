<?php
require_once("functions.php");
$filename = "data/comments.json";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $post = json_decode(file_get_contents("php://input"), true);
    $ids = $post['listOfIds'];

    $data = json_decode(file_get_contents($filename), true);

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
}


?>