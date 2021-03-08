<?php
header("Content-type: image/png");
include 'function.php';
$im = imagecreatefrompng("background.png");
$ip = $_SERVER["REMOTE_ADDR"];
$week=array("日","一","二","三","四","五","六");
//ip
$url = 'http://ip-api.com/json/'.$ip.'?fields=537&lang=zh-CN';
$UserAgent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
$data = curl_init();
curl_setopt($data, CURLOPT_URL, $url);
curl_setopt($data, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($data, CURLOPT_USERAGENT, $UserAgent);
$data = curl_exec($data);
$data = json_decode($data, true);
$country = $data['country'];
$region = $data['regionName'];
$city = $data['city'];
$isp = $data['isp'];
//一言
//$url = "https://v2.jinrishici.com/one.json";
//$UserAgent = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
//$yiyan = curl_init();
//curl_setopt($yiyan, CURLOPT_URL, $url);
//curl_setopt($yiyan, CURLOPT_RETURNTRANSFER, 1);
//curl_setopt($yiyan, CURLOPT_USERAGENT, $UserAgent);
//$yiyan = curl_exec($yiyan);
//$yiyan = json_decode($yiyan, true);
//$content = $yiyan['data']['content'];
//定义颜色
$black = ImageColorAllocate($im, 0,0,0);//RGB值
$color = ImageColorAllocate($im, 255,250,250);//黑色
$font = 'font.ttf';//加载字体
//输出
imagettftext($im, 16, 0, 20, 36, $color, $font, 'Location: '.$country.' - '.$region.' - '.$city);
imagettftext($im, 16, 0, 20, 72, $color, $font, 'Time: '.date('Y年n月j日')."    星期".$week[date("w")]);//当前时间
imagettftext($im, 16, 0, 20, 108, $color, $font, 'IP: '.$ip.' - '.$isp);//ip
imagettftext($im, 16, 0, 20, 144, $color, $font, 'OS: '.$os);//操作系统
imagettftext($im, 16, 0, 20, 180, $color, $font, 'Browser: '.$bro);//浏览器
imagettftext($im, 14, 0, 20, 216, $black, $font, $content);//一言
ImageGif($im);
ImageDestroy($im);