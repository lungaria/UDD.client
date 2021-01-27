<?php
$from_replace=array("á","é","í","ó","ú","à","è","ì","ò","ù","ä","ë","ï","ö","ü","Á","É","Í","Ó","Ú","À","È","Ì","Ò","Ù","Ä","Ë","Ï","Ö","Ü","Ñ","ñ","Ç","ç",".JPG",".JPEG",".PNG",".GIF",".jpeg",".png",".gif","'","/","\\");
$to_replace=array("a","e","i","o","u","a","e","i","o","u","a","e","i","o","u","a","e","i","o","u","a","e","i","o","u","a","e","i","o","u","n","n","C","c",".jpg",".jpg",".jpg",".jpg",".jpg",".jpg",".jpg","","","");

//include "includes/ini_db.php";
//include "includes/functions.php";

// Check if image file is a actual image or fake image
if($_FILES["fileToUploadG"]) {
        $uploadOk = 1;
/*    $check = getimagesize($_FILES["fileToUploadG"]["tmp_name"]);
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
		if($check["mime"]=="image/jpeg" || $check["mime"]=="image/png" || $check["mime"]=="image/jpeg" || $check["mime"]=="image/gif") {convertImage($_FILES["fileToUploadG"]["tmp_name"], $tmp_img, 100);}
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }*/
}
else {
        echo "NOFILE";
        $uploadOk = 0;
		exit;
    }
	
$target_dir = "resources/custom_layers/";$table_lk="api_layers";
//if(substr($_POST["codi"],0,3)=="ZZ-") {$table_lk.="2";}
$codi="";//$_POST["codi"];
for ($i = 0; $i < count($_FILES['fileToUploadG']['name']); $i++) {
$target_filename=str_replace($from_replace,$to_replace,basename($_FILES["fileToUploadG"]["name"][$i]));
$target_file = $target_dir . $target_filename;
$uploadOk = 1;
$imageFileType = strtolower(pathinfo(basename($_FILES["fileToUploadG"]["name"][$i]),PATHINFO_EXTENSION));
/*
// Check if file already exists
if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
    $uploadOk = 0;
}*/
// Check file size
if ($_FILES["fileToUploadG"]["size"][$i] > 9999999) {
    echo "Sorry, your file is too large. Max: 10Mb";
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "geojson" && $imageFileType != "GEOJSON") {
    echo "Sorry, only GEOJSON files are allowed.<br>";
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.<br>";
// if everything is ok, try to upload file
} else {
	if (move_uploaded_file($_FILES["fileToUploadG"]["tmp_name"][$i], $target_file)) {
		//$out0="UPDATE ".$table_lk." set area1='".$codi . ".geojson" ."', modiby='".$_SESSION['name']."' , modidate='".date("YmdHis")."' where codi='".$_POST["codi"]."';";
		//if(query_simple($db_host,$db_user,$db_pass,$db_name,$out0)) {echo "YES2_0";} else {echo "SORRY2_0";}
		echo "The file ". basename( $_FILES["fileToUploadG"]["name"][$i]). " has been uploaded.<br>";
	}
	else {
        echo "Sorry, there was an error uploading your file.<br>";
    }
}
}
?>