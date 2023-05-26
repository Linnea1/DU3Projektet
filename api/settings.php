<?php
require_once("functions.php");

$filename = "data/users.json";
$directory = "data";
if(!file_exists("data")){ // if no directory, create it
    mkdir($directory, 755);
}
if(!file_exists("data/pictures")){ // if no directory, create it
    mkdir("data/pictures", 755);
}
if(!file_exists("data/pictures/pfp")){ // if no directory, create it
    mkdir("data/pictures/pfp", 755);
}
if(!file_exists($filename)){ // if no file, create it
    file_put_contents($filename, "[]");
}
if(!file_exists("data/favourites.json")){ // if no file, create it
    file_put_contents("data/favourites.json", "[]");
}
if(!file_exists("data/comments.json")){ // if no file, create it
    file_put_contents("data/comments.json", "[]");
}
if(!file_exists("data/recipes.json")){ // if no file, create it
    file_put_contents("data/recipes.json", "[]");
}


$users = json_decode(file_get_contents($filename), true);
$input = json_decode(file_get_contents("php://input"), true);

if($_SERVER["REQUEST_METHOD"] == "PATCH"){

    if (isset($input["password"], 
                $input["new_password"], 
                $input["username"])){
        change($input, $users, $filename, "password", "username"); // change password
    }

    if (isset($input["username"], 
                $input["new_username"], 
                $input["password"])){
        change($input, $users, $filename, "username"); // change username
    }

    if (isset($input["email"], 
                $input["new_email"], 
                $input["password"])){
        change($input, $users, $filename, "email"); // change email
    }

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

                // if(isset($_POST["old"])){
                //     $correctPath = str_replace("api/data/pictures/pfp/", "data/pictures/pfp/", $_POST["old"]);
                //     unlink($correctPath);
                // }

                if(move_uploaded_file($source, "data/pictures/pfp/" . $name)){
                    $correctName =  $filePath . $name;
                    $users[$index]["pfp"] = $correctName;
                    file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));

                    $favorites = json_decode(file_get_contents("data/favourites.json"), true);
                    $comments = json_decode(file_get_contents("data/comments.json"), true);
                    $recipes = json_decode(file_get_contents("data/recipes.json"), true);

                    //// change in other databases too
                    function changePfp ($dataBase, $key, $filePath, $name){
                        foreach($dataBase as $index => $data){
                            if($data[$key] == $_POST["username"] && !isset($data["deleted"])){
                                $dataBase[$index]["pfp"] = $name;

                                file_put_contents($filePath, json_encode($dataBase, JSON_PRETTY_PRINT));
                            }
                        }
                    }

                    changePfp($comments, "author", "data/comments.json", $correctName);
                    ////

                    send_JSON($filePath . $name);
                } else {
                    send_JSON(["message"=>"File could not be added to server, please try again"], 409);
                }

            }
            
        }
        send_JSON(["message"=>"Problems with finding user"], 404);
    }
    send_JSON(["message"=>"Send a file"], 421);
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE"){
    foreach ($users as $index => $user) {
        if($user["username"] == $input["username"] && $user["password"] == $input["password"]){
            array_splice($users, $index, 1); // remove from list
            file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));

            //////
            $comments = json_decode(file_get_contents("data/comments.json"), true);
            $favorites = json_decode(file_get_contents("data/favourites.json"), true);
            $recipes = json_decode(file_get_contents("data/recipes.json"), true);

            foreach($favorites as $index => $data){
                if($data["username"] == $input["username"]){
                    array_splice($favorites, $index, 1); // remove from list
                    file_put_contents("data/favourites.json", json_encode($favorites, JSON_PRETTY_PRINT));
                }
            }

            foreach($recipes as $index => $data){
                if($data["author"] == $input["username"]){
                    array_splice($recipes, $index, 1); // remove from list
                    file_put_contents("data/recipes.json", json_encode($recipes, JSON_PRETTY_PRINT));
                }
            }


            foreach($comments as $index => $data){
                if($data["author"] == $input["username"]){
                    $comments[$index]["deleted"] = true; // adds the key "deleted"
                    $comments[$index]["author"] = "[DELETED USER]";
                    unset($comments[$index]["pfp"]);

                    file_put_contents("data/comments.json", json_encode($comments, JSON_PRETTY_PRINT));
                }
            }
            
            /////

            send_JSON(["message"=>"User has been deleted"]);
        }
    }
    send_JSON(["message"=>"User could not be deleted"], 400);
}

send_JSON(["message"=>"Wrong method"], 405);

?>