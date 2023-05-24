<?php
require_once("functions.php");
$filename = "data/comments.json";

if(!file_exists($filename)){ // if no file, create it
    file_put_contents($filename, "[]");
}

$comments = json_decode(file_get_contents($filename), true);
$post = json_decode(file_get_contents("php://input"), true);
$time=time();
$timestamp = date('d-m-Y H:i', $time);

if($_SERVER["REQUEST_METHOD"] == "POST"){//Creat a comment

    $newComment = [
        "recipeId" => $post['recipeId'],
        "author" => $post['username'],
        "timestamp" =>$timestamp,
        "rating" => $post['rating'],
        "comment" => $post['comment'],
        // "pfp" => $post['pfp']
    ];

    if (isset($post['pfp'])) {
        $newComment["pfp"] = $post['pfp'];
    };

    $comments[] = $newComment;
    file_put_contents($filename, json_encode($comments, JSON_PRETTY_PRINT));
    send_JSON($newComment);
}elseif ($_SERVER["REQUEST_METHOD"] == "GET") {//Get all comments with the same recipe ID
    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $filteredComments = filterComments($comments, $id, "recipeId");
        send_JSON(["comments" => $filteredComments]);
    } else {
        send_JSON(["message" => "No ID provided for retrieving comments"], 400);
    }
}elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $deleteAuthor = $_GET["author"];
    $deleteRecipeId = $_GET["recipeId"];

    $commentIndex = -1;
    foreach ($comments as $index => $comment) {
        if ($comment["author"] === $deleteAuthor && $comment["recipeId"] === $deleteRecipeId) {
            $commentIndex = $index;
            break;
        }
    }

    if ($commentIndex !== -1) {
        array_splice($comments, $commentIndex, 1); // remove from list
        file_put_contents($filename, json_encode($comments, JSON_PRETTY_PRINT));
        send_JSON(["message" => "Comment deleted successfully"]);
    } else {
        send_JSON(["message" => "Comment not found"], 404);
    }
}else{
    send_JSON(["message" => "Wrong method"], 405);
}

function filterComments($comments, $id, $key) {
    $filteredComments = [];
    foreach ($comments as $comment) {
        if ($comment[$key] === $id) {
            $filteredComments[] = $comment;
        }
    }
    return $filteredComments;
}
?>