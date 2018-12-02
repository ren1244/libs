<?php

if($argc!==3)
    exit("php data2img input_file output_prefix");

$inputFile=$argv[1];
$edgeLength=1024;
$prefix=$argv[2];

$data=file_get_contents($inputFile);
$totalSize=strlen($data)+4;
$data=pack('V',$totalSize-4).$data;
$blockSize=$edgeLength*$edgeLength*3;
$nBlocks=intdiv($totalSize+$blockSize-1,$blockSize);

for($i=0;$i<$nBlocks;++$i)
{
    $outFileName=$prefix.sprintf("%02d",$i).".png";
    echo $outFileName.PHP_EOL;
    $len=($i+1<$nBlocks?$blockSize:$totalSize-$i*$blockSize);
    $segment=substr($data, $i*$blockSize, $len);
    if($len%3==1){
        $segment=$segment.'  ';
    } elseif ($len%3==2){
        $segment=$segment.' ';
    }
    
    $img=imagecreatetruecolor(1024,1024);
    for($byteIndex=0;$byteIndex<$len;$byteIndex+=3){
        $byteList=unpack("C3",$segment,$byteIndex);
        $x=$byteIndex/3%$edgeLength;
        $y=intdiv($byteIndex,$edgeLength*3);
        $col=imageColorAllocate($img,$byteList[1],$byteList[2],$byteList[3]);
        imagesetpixel($img, $x, $y, $col);
    }
    imagepng($img,$outFileName,9);
    imagedestroy($img);
}
