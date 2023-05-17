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

if($_SERVER["REQUEST_METHOD"] == "POST"){

    $newComment = [
        "recipeId" => $post['recipeId'],
        "author" => $post['usersname'],
        "timestamp" =>$timestamp,
        "rating" => $post['rating'],
        "comment" => $post['comment'],
    ];

    $comments[] = $newComment;
    file_put_contents($filename, json_encode($comments, JSON_PRETTY_PRINT));
    send_JSON($newComment);
}elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET["id"])) {
        $id = $_GET["id"];

        $filteredComments = filterComments($comments, $id, "recipeId");
        send_JSON(["comments" => $filteredComments]);
    } else {
        send_JSON(["message" => "No ID provided for retrieving comments"], 400);
    }
}elseif($_SERVER["REQUEST_METHOD"] == "DELETE"){

    if (isset($_GET["author"])) {
        $commentId = $_GET["author"];

        $index = findCommentIndex($comments, $commentId, "recipeId");
        if ($index !== -1) {
            array_splice($comments, $index, 1); // remove from list
            file_put_contents($filename, json_encode($comments, JSON_PRETTY_PRINT));
            send_JSON(["message" => "Comment deleted successfully"]);
        } else {
            send_JSON(["message" => "Comment not found"], 404);
        }

    }
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
//Test
?>