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

function incorrectChar ($array, $value){ // characters outside the english alphabet is not allowed
    $allowed = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    if($value == "email"){ // email is allowed to have @ and .
        $allowed[] = '@';
        $allowed[] = '.';}

    foreach($array as $char){
        if(!in_array($char, $allowed)){
            send_JSON(["message"=>"Character not allowed in $value"], 400); 
        }
    }
}

function change ($post, $users, $filename, $field){ // universal for most "change" settings
    // field decides what will be changed
        if($post[$field] == $post["new"]){ // cant be the same
            send_JSON(["message"=>"New $field cannot be the same as old $field"], 400); 
        }

        foreach ($users as $index => $user) {
            if($user[$field] == $post[$field] && $user["password"] == $post["password"]){
                ////////////// time for checks...
                // first, check its not already taken
                $array = $users; 
                $copiedArray = $array; // array needs to be copied so original array isn't damaged
                array_splice($copiedArray, $index, 1);
                foreach($copiedArray as $owned){
                    if($owned[$field] == $post["new"]){
                        send_JSON(["message"=>"This $field is already taken, please try again"], 400); 
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

                send_JSON($post["new"]);
            }
        }
        send_JSON(["message"=>"Problems with finding user"], 400); // if user cant be found / matched

    // send_JSON(["message"=>"Something went wrong"], 400); // unknown error
}
?>