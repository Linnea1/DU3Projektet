<?php
function send_JSON ($data, $code = 200){
    header("Content-Type: application/json");
    http_response_code($code);
    echo json_encode($data);
    exit();
}

function tooShort ($input, $value){ // cant be too short
    if(strlen($input) < 3){
        send_JSON(["message"=>"The $value needs to be 3 characters or more"], 400); 
    }
}

function incorrectChar ($splitWord, $value){ // characters outside the english alphabet is not allowed
    $allowed = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    if($value == "email"){ // email is allowed to have @ and .
        $allowed[] = '@';
        $allowed[] = '.';}

    foreach($splitWord as $char){
        if(!in_array($char, $allowed)){
            send_JSON(["message"=>"Character not allowed in $value"], 400); 
        }
    }
}

 // universal for most "change" settings
function change ($post, $users, $filename, $field, $secondaryField = "password"){
        // field decides what will be changed
        if($post[$field] == $post["new"]){ // cant be the same
            send_JSON(["message"=>"New $field cannot be the same as old $field"], 400); 
        }

        foreach ($users as $index => $user) {
            if($user[$field] == $post[$field] && $user[$secondaryField] == $post[$secondaryField]){
                ////////////// time for checks...
                // first, check its not already taken

                if ($field !== "password"){ // password does not have to be "taken"
                    $array = $users; 
                    $copiedArray = $array; // array needs to be copied so original array isn't damaged
                    array_splice($copiedArray, $index, 1);
                    foreach($copiedArray as $owned){
                        if($owned[$field] == $post["new"]){
                            send_JSON(["message"=>"This $field is already taken, please try again"], 400); 
                        }
                    }
                }

                if ($field == "password"){ // old password needs to be correct
                    if ($post[$field] != $post["old"]) {
                        send_JSON(["message"=>"Incorrect password, please try again"], 400); 
                    }
                }

                tooShort($post["new"], $field); // make sure its not too short

                $split = str_split($post["new"]); // or has illegal characters
                incorrectChar($split, $field);

                if($field == "email"){ // email needs to have @ and .
                    if(!preg_match("/(@)(.)/", $post["new"])){
                        send_JSON(["message"=>"Please enter a valid email"], 400); 
                    }
                }
                ////////////// checks are done, can now be changed!

                $users[$index][$field] = $post["new"];
                file_put_contents($filename, json_encode($users, JSON_PRETTY_PRINT));

                if($field == "username"){
                    $favorites = json_decode(file_get_contents("data/favourites.json"), true);
                    $comments = json_decode(file_get_contents("data/comments.json"), true);
                    $recipes = json_decode(file_get_contents("data/recipes.json"), true);

                    function changeUsername ($dataBase, $key, $filePath, $post){
                        foreach($dataBase as $index => $data){
                            if($data[$key] == $post["username"]){
                                $dataBase[$index][$key] = $post["new"];
    
                                file_put_contents($filePath, json_encode($dataBase, JSON_PRETTY_PRINT));
                            }
                        }
                    }

                    changeUsername($favorites, "username", "data/favourites.json", $post);
                    changeUsername($comments, "author", "data/comments.json", $post);
                    changeUsername($favorites, "author", "data/favourites.json", $post);
                }

                send_JSON($post["new"]);
            }
        }

        send_JSON(["message"=>"Problems with finding user"], 400); // if user cant be found / matched
}
?>