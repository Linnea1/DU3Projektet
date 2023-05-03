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
?>