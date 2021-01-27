<?php
session_start();
header('Content-Type: text/html; charset=utf-8');
//include "includes/ini_db.php";
//include "includes/functions.php";
//$now_ini=date('Ymd');
//$yesterday_ini = date("Ymd", mktime(0, 0, 0, date("m") , date("d")-1,date("Y")));
//$now_max=0;
//$consult="select max(id0) ma from bcn_covid1";
//$result=query_direct($db_host,$db_user,$db_pass,$db_name,$consult);
//foreach ($result as $row) {$now_max=$row["ma"];}
//echo $now_max.":".$now_ini.":".$yesterday_ini;
//if($now_max==$yesterday_ini) {$cont=0;echo "yet did";}
//else {$cont=1;}

$q="";
if ($_SERVER["REQUEST_METHOD"] == "GET") 
{
	$url=$_GET['url'];
	$id=$_GET['id'];
	$q=$_GET['q'];
	$limit=$_GET['limit'];
}
else {
	echo '{ "error": true1 }';
	return;
}
$json="";
if($q=="") {$nada=1;} else {$q='&q={"'.str_replace(":",'":"',$q).'"}';}
if($id=="") {$idT="";} else {$idT="?id=".$id.$q."&limit=".$limit;}
//echo $url."?id=".$id."&limit=".$limit;
$url_do=$url.$idT;//echo $url_do."<br>";
/*$handle = fopen($url_do, 'rb');
while(feof($handle) !== true) {
   echo fgets($handle); 
}
fclose($handle);
$json = $handle;*/
$json = file_get_contents($url_do, true);//if(is_file($url_do)) {echo "SIFI";} else {echo "NOFI".$url_do;}
//$json = file_get_contents('https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search?id=7d02a5a0-5339-4289-bc6b-7260484ff435&limit=2000',true);
//while($json=="") {$nada=1;} 
echo $json;
//$obj = json_decode($json);
//echo $obj;
exit;

$cont=0;
if($cont==1) {
$now = date("Y-m-d", mktime(0, 0, 0, date("m") , date("d")-1,date("Y")));
//echo $now;
$nowT=$now."T00:00:00.000";
$url="https://analisi.transparenciacatalunya.cat/resource/xuwf-dxjd.json?data=".$nowT;//"2020-05-17T00:00:00.000";
echo $url;
$json = file_get_contents($url, true);
$obj = json_decode($json);
//var_dump($obj);
$out0='insert into bcn_covid1 (id1,di1,d1,di2,d2,di3,d3,di4,d4,d5,m1,id0) VALUES ("';
$out='insert into bcn_covid1 (id1,di1,d1,di2,d2,di3,d3,di4,d4,d5,m1,id0) VALUES ';
$i=0;
forEach($obj as $b) {
	if($i==0) {$pipe='';} else {$pipe=', ';} 
	$outx="";$j=0;$out_i="";$c0=0;
	forEach($b as $c) {if($j==0) {$p='("';$c0=substr($c,0,4).substr($c,5,2).substr($c,8,2);$c=substr($c,8,2)."/".substr($c,5,2)."/".substr($c,0,4);} else {$p='","';} $outx.=$p.$c;$j++;}
	$out.=$pipe.$outx.'","'.$c0.'")';//.'","'.$b["regiosanitariacodi"].'";';
	/*$out_i=$out0.$outx.'");';
	if(query_simple($db_host,$db_user,$db_pass,$db_name,$out_i)) {
		echo "OK".$i."<br>";
	}
	else {echo "KO:".$out_i."<br>";}*/
	$i++;
	}
$out.=";";
//echo $out;
	if(query_simple($db_host,$db_user,$db_pass,$db_name,$out)) {
		echo "OK".$i."<br>";
	}
	else {echo "KO:".$out."<br>";}
}


?>
