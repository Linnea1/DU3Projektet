<?php
require_once("functions.php");

$filename = "data/users.json";
$users = json_decode(file_get_contents($filename), true);
$input = json_decode(file_get_contents("php://input"), true);

if($_SERVER["REQUEST_METHOD"] == "PATCH"){

    if (isset($input["old"], 
                $input["new"],
                $input["password"], 
                $input["username"])){
        change($input, $users, $filename, "password", "username"); // change password
    }

    if (isset($input["username"], 
                $input["new"], 
                $input["password"])){
        change($input, $users, $filename, "username"); // change username
    }

    if (isset($input["email"], 
                $input["new"], 
                $input["password"])){
        change($input, $users, $filename, "email"); // change email
    }

    // if(isset($input["file"], 
    // $input["username"], 
    // $input["password"]))

    send_JSON(["message"=>"Wrong parameters"], 405);
}

if($_SERVER["REQUEST_METHOD"] == "POST"){
    if($_FILES){ // change profile picture
        $source = $_FILES["pfp"]["tmp_name"];
        $destination = "api/data/pictures/pfp/".$_FILES["pfp"]["name"];
        $size = $_FILES["pfp"]["size"];
        $type = $_FILES["pfp"]["type"];
        $time = time();

        // these are needed for giving the right person the pfp
        $username = $_POST["username"];
        $password = $_POST["password"];

        $allowedFiles = ["image/jpeg", "image/png", "image/gif"]; // checking so that the filetype is allowed
        if (!in_array($type, $allowedFiles)){
            send_JSON(["message"=>"Wrong filetype"], 415);
        }

        $ending = str_replace("image/", ".", $type);
        $filePath = "api/data/pictures/pfp/";
        $name = $time . $ending;
        
        foreach($users as $index => $user){
            if($user["username"] == $username && $user["password"] == $password){

                $users[$index]["pfp"] = $filePath . $name;

                if(isset($_POST["old"])){
                    $correctPath = str_replace("api/data/pictures/pfp/", "data/pictures/pfp/", $_POST["old"]);
                    unlink($correctPath);
                }

                if(move_uploaded_file($source, "data/pictures/pfp/" . $name)){
                    $users[$index]["pfp"] = $filePath . $name;
                    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));

                    $favorites = json_decode(file_get_contents("data/favourites.json"), true);
                    $comments = json_decode(file_get_contents("data/comments.json"), true);
                    $recipes = json_decode(file_get_contents("data/recipes.json"), true);

                    //// change in other databases too
                    function changePfp ($dataBase, $filePath){
                        foreach($dataBase as $index => $data){
                            if($data["author"] == $_POST["username"]){
                                $dataBase[$index]["pfp"] = $filePath . $name;

                                file_put_contents($filePath, json_encode($dataBase, JSON_PRETTY_PRINT));
                            }
                        }
                    }

                    changePfp($comments, "data/comments.json");
                    // changeUsername($recipes, "data/recipes.json", $input);
                    ////

                    send_JSON($filePath . $name);
                } else {
                    send_JSON(["message"=>"File could not be added to server, please try again"], 400);
                }

            }
        }

    }
    send_JSON(["message"=>"Send a file"], 421);
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE"){
    foreach ($users as $index => $user) {
        if($user["username"] == $input["username"] && $user["password"] == $input["password"]){
            array_splice($users, $index, 1); // remove from list
            file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));

            //////
            function deletedUser ($dataBase, $filePath, $input){
                foreach($dataBase as $index => $data){
                    if($data["author"] == $input["username"]){
                        $dataBase[$index]["deleted"] = true; // adds the key "deleted"

                        file_put_contents($filePath, json_encode($dataBase, JSON_PRETTY_PRINT));
                    }
                }
            }
            deletedUser($comments, "data/comments.json", $input);
            /////

            send_JSON(["message"=>"User has been deleted"]);
        }
    }
    send_JSON(["message"=>"User could not be deleted"], 400);
}

send_JSON(["message"=>"Wrong method"], 405);

?>