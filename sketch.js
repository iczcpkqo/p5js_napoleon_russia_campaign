
var longi_y;


function setup() {
  createCanvas(1400, 800);
  background(255,233,183);
}

function draw() {
   drawDataBox(getDataArmyOneGo(), "getColorArmyOneGo");
   drawDataBox(getDataArmyOneBack(), "getColorArmyOneBack");
   drawDataBox(getDataArmyTwoGo(), "getColorArmyTwoGo");
   drawDataBox(getDataArmyTwoBack(), "getColorArmyTwoBack");
   drawDataBox(getDataArmyThreeGo(), "getColorArmyThreeGo");
   drawDataBox(getDataArmyThreeBack(), "getColorArmyThreeBack");
   drawCityPoint(getRelativePositionXY(filtrCityData()));
   drawTemper(sortAsc(getRelativePositionX(filtrTemperData()),0));
  
   drawLongitude();
  tuli();
}

function tuli (){
  
    noStroke(1);    
      
    fill(color(239,203,59));  
    
    rect(width*0.9-20, longi_y-20, 10, 10);
  
    fill(color(255,0,51));  
    rect(width*0.9-10, longi_y-20, 10, 10);
  
  fill(color(145,200,254));  
   rect(width*0.9, longi_y-20, 10, 10);
  
    textSize(14);
    strokeWeight(0.01);
    textStyle(NORMAL);
    fill(color(133,133,133));
    text("survival", width*0.9+15, longi_y-20, 70, 80);  
}

function drawLongitude(){
  let logi_x = width*0.1;
  let step = width*0.8/10;
  
  fill(color(153,102,0));
  textSize(10);
  strokeWeight(0.01);
  textStyle(ITALIC);
  
  for(let i=0; i<width*0.8; i+=step){

text((i*((37.6-24)/step)+24).toFixed(4)+"° E",logi_x+i,longi_y-10,70, 80); 
  
  } 
  
}

function drawTemper(data){  
  let tmTop = height*0.70;
  let tmBottom = height*0.95
  let tmWidth = width*0.93;
  let tmHeight = tmBottom - tmTop;
  let tm_0 = tmTop+tmHeight/8;
  let tm_30 = tm_0 + 6*tmHeight/8;
  let temperBarHeight = tm_30 - tm_0;
  
  longi_y= tmTop;
   
  strokeWeight(1);
  line (width*0.05,tmTop, tmWidth, tmTop);
  line (width*0.05,tmBottom, tmWidth, tmBottom);
  
  strokeWeight(1.5);
  for (let i=1; i<8; i++){
    drawDotLine(width*0.05+25,tmTop+i*temperBarHeight/6, tmWidth-25, tmTop+i*temperBarHeight/6, 10);
    
    fill(color(136,136,136));
    textSize(10);
    strokeWeight(0.01);
    textStyle(ITALIC);
   
    if(i%2!=0)
      text((i-1)*(-5)+" ℃",tmWidth-18, tmTop+i*temperBarHeight/6, 70, 80); 

  }
  
  let dic = getLinedic();
  let cityLoc = getRelativePositionXY(filtrCityData());   
    
  for (let i=0; i<data.length; i++){
    let tm_x = data[i][0];
    let tm_y = tm_0+temperBarHeight*abs(data[i][1])/30;
    point(tm_x, tm_y);   
    
    
    noFill();
    stroke(1);
    rect(tm_x-5, tm_y-5, 10, 10);
    
    fill(color(204,153+(data[i][1]*5),0));
    textSize(14);
    strokeWeight(0.01);
    textStyle(NORMAL);
    text(data[i][4]+" "+data[i][3], tm_x-20, tm_y+10, 70, 80);   
    
        
   
  
    for(let j=0; j<cityLoc.length; j++)
      if (dic[data[i][4]+""+data[i][3]] == cityLoc[j][2]){
        stroke(2);
        fill(color(153,0,153));
        line(tm_x,tm_y-5, tm_x, cityLoc[j][1]);
        
        break;
      }
       
  }
  
  
}


function drawCityPoint(data){
    data.map((e)=>{
      
      stroke(1);
      noFill();
      strokeWeight(1);
      rect(e[0], e[1], 10, 10);
      
      strokeWeight(0.1);
      fill(color(153,0,153));
      line(e[0]+10,e[1], e[0]+50, e[1]-75);
      textSize(12);     

      
      strokeWeight(0.05);
      textStyle(ITALIC);
      text(e[2], e[0]+50, e[1]-80);    
      
  });  
}

function drawDotLine(x1, y1, x2, y2, gap){
  let tan0 = (y2-y1)/(x2-x1);
  let theta = atan(tan0);
  let sin0 = sin(theta);
  let cos0 = cos(theta);
  
  let lineLength = (x2-x1)/cos0;
  let times = lineLength/gap;
  let startLength = 0;
  
  for (let i=0; i<times; i++){
    let x_new = x1+startLength*cos0;
    let y_new = y1+startLength*sin0;
    if (x_new>x2||y_new>y2)
      break;
    point(x_new, y_new);
    startLength = startLength + gap + 1;   
  }  
}


function drawDataBox(data, funcName){  
  let dataBox = data;
  noStroke()  
  for(let i=0; i<dataBox.length-1; i++){    
    let pos3a, pos3b;
    if(i<dataBox.length-2)
      [pos3a, pos3b] = [dataBox[i+2][0],dataBox[i+2][1]];
    else
      [pos3a, pos3b] = [dataBox[i+1][0]+1,dataBox[i+1][1]]
    
    let [pos1x1, pos1y1, pos1x2, pos1y2] = getPosition(dataBox[i][0], dataBox[i][1], dataBox[i+1][0], dataBox[i+1][1], dataBox[i][2]);
    let [pos2x1, pos2y1, pos2x2, pos2y2] = getPosition(dataBox[i+1][0], dataBox[i+1][1], pos3a, pos3b, dataBox[i+1][2]);
    
     let func = eval(funcName);
     let c = new func(dataBox[i][2]);
    
    fill(c);
    
    quad(pos1x1, pos1y1, pos2x1, pos2y1, pos2x2, pos2y2, pos1x2, pos1y2); 
  }  
  stroke(1)
}


function getColorArmyOneGo(val){
  return color(255, getColorWeight(val, getRelativeSurv(100000), getRelativeSurv(340000), 0, 204, false),51);   
}

function getColorArmyOneBack(val){
  return color(102, getColorWeight(val, getRelativeSurv(20000), getRelativeSurv(100000), 0, 204, false),255);   
}

function getColorArmyTwoGo(val){
  return color(204, getColorWeight(val, getRelativeSurv(33000), getRelativeSurv(60000), 0, 255, false),153);   
}

function getColorArmyTwoBack(val){
  return color(0, getColorWeight(val, getRelativeSurv(4000), getRelativeSurv(30000), 0, 0, false),0);   
}

function getColorArmyThreeGo(val){
  return color(0, getColorWeight(val, getRelativeSurv(22000), getRelativeSurv(22000), 0, 0, false),0);   
}

function getColorArmyThreeBack(val){
  return color(0, getColorWeight(val, getRelativeSurv(6000), getRelativeSurv(6000), 0, 204, false),0);   
}


function getColorWeight(val, minVal, maxVal, minCol, maxCol, asc){
 // print((maxCol-minCol)*asc-(maxCol-minCol)*((val-minVal)/(maxVal-minVal)));
  return abs((maxCol-minCol)*asc-(maxCol-minCol)*((val-minVal)/(maxVal-minVal)));
}



function getPosition(a1,b1,a2,b2,w){
    return [a1-(w/2)*sin(atan((b2-b1)/(a2-a1))),b1+(w/2)*cos(atan((b2-b1)/(a2-a1))),a1+(w/2)*sin(atan((b2-b1)/(a2-a1))),b1-(w/2)*cos(atan((b2-b1)/(a2-a1)))]; 
}

function getDataArmyOneGo(){
  return  sortAsc(getRelativePositionSurv(getRelativePositionXY(filtrArmyData(1, 1))), 0);
}

function getDataArmyOneBack(){
  return sortDesc(getRelativePositionSurv(getRelativePositionXY(filtrArmyData(1, 0))), 0);
}

function getDataArmyTwoGo(){
  return sortAsc(getRelativePositionSurv(getRelativePositionXY(filtrArmyData(2, 1))), 0);
  
}

function getDataArmyTwoBack(){
   return sortDesc(getRelativePositionSurv(getRelativePositionXY(filtrArmyData(2, 0)), 0));
  
}

function getDataArmyThreeGo(){
   return sortAsc(getRelativePositionSurv(getRelativePositionXY(filtrArmyData(3, 1)), 0));
}

function getDataArmyThreeBack(){
   return sortDesc(getRelativePositionSurv(getRelativePositionXY(filtrArmyData(3, 0)), 0));
}

function getRelativePositionXY(data){
  for (let i=0; i<data.length; i++){
    data[i][0] = getRelativeWidth(data[i][0]);
    data[i][1] = getRelativeHeight(data[i][1]);
  }
  return data;
}

function getRelativePositionX(data){
  for (let i=0; i<data.length; i++)
    data[i][0] = getRelativeWidth(data[i][0]);
  return data;
}

function getRelativePositionSurv(data){
  for (let i=0; i<data.length; i++)
    data[i][2] = getRelativeSurv(data[i][2]);
  return data;
}

function getRelativeSurv(s){
  let rel = 340000/(height*0.2);
  return s/rel;
}


function getRelativeWidth(w){
  return width*0.1+(width*0.8)*((w-24)/13.6);  
}


function getRelativeHeight(h){
  // let rel = (width*0.8)/13.6;
  // return height*0.1+h*rel;
  let h_new = width*0.8*(1.6/13.6);
  return height*0.3+(h_new*0.8)*((h-54.2)/1.6);
}

function sortAsc(data, field){
  return sortData(data, field, true);
}

function sortDesc(data, field){
  return sortData(data, field, false);
}

function sortData(data, field, isAsc){
    let len = data.length;
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (data[j][field] > data[j+1][field] == isAsc) {
                let temp = data[j+1][field];        
                data[j+1][field] = data[j][field];
                data[j][field] = temp;
            }
        }
    }
    return data;
}

function filtrArmyData(army, arrow){
  let armyData = getArmyData();
  let data = new Array();
  for(let i=0; i<armyData.length; i++)
    if (armyData[i].div == army && armyData[i].dir == arrow)
        data.push([armyData[i].x, armyData[i].y, armyData[i].surv]);
  return data;
}

function filtrCityData(){
  let cityData = getCityData();
  let data = new Array();
  for(let i=0;i<cityData.length; i++)
    data.push([cityData[i].x, cityData[i].y, cityData[i].city]);
  return data;
}


function filtrTemperData(){  
  let temperData = getTemperData();
  
  let data = new Array();
  for(let i=0;i<temperData.length; i++)
    data.push([temperData[i][0], temperData[i][1], temperData[i][2], temperData[i][3], temperData[i][4]] ); 

  return data;
  
}

function getArmyData(){
return [{x:24, y:54.9, surv:340000, dir:1, div:1}, {x:24.5, y:55, surv:340000, dir:1, div:1}, {x:25.5, y:54.5, surv:340000, dir:1, div:1}, {x:26, y:54.7, surv:320000, dir:1, div:1}, {x:27, y:54.8, surv:300000, dir:1, div:1}, {x:28, y:54.9, surv:280000, dir:1, div:1}, {x:28.5, y:55, surv:240000, dir:1, div:1}, {x:29, y:55.1, surv:210000, dir:1, div:1}, {x:30, y:55.2, surv:180000, dir:1, div:1}, {x:30.3, y:55.3, surv:175000, dir:1, div:1}, {x:32, y:54.8, surv:145000, dir:1, div:1}, {x:33.2, y:54.9, surv:140000, dir:1, div:1}, {x:34.4, y:55.5, surv:127100, dir:1, div:1}, {x:35.5, y:55.4, surv:100000, dir:1, div:1}, {x:36, y:55.5, surv:100000, dir:1, div:1}, {x:37.6, y:55.8, surv:100000, dir:0, div:1}, {x:37.5, y:55.7, surv:98000, dir:0, div:1}, {x:37, y:55, surv:97000, dir:0, div:1}, {x:36.8, y:55, surv:96000, dir:0, div:1}, {x:35.4, y:55.3, surv:87000, dir:0, div:1}, {x:34.3, y:55.2, surv:55000, dir:0, div:1}, {x:33.3, y:54.8, surv:37000, dir:0, div:1}, {x:32, y:54.6, surv:24000, dir:0, div:1}, {x:30.4, y:54.4, surv:20000, dir:0, div:1}, {x:29.2, y:54.4, surv:20000, dir:0, div:1}, {x:28.5, y:54.3, surv:20000, dir:0, div:1}, {x:28.3, y:54.4, surv:20000, dir:0, div:1}, {x:24, y:55.1, surv:60000, dir:1, div:2}, {x:24.5, y:55.2, surv:60000, dir:1, div:2}, {x:25.5, y:54.7, surv:60000, dir:1, div:2}, {x:26.6, y:55.7, surv:40000, dir:1, div:2}, {x:27.4, y:55.6, surv:33000, dir:1, div:2}, {x:28.7, y:55.5, surv:30000, dir:0, div:2}, {x:29.2, y:54.3, surv:30000, dir:0, div:2}, {x:28.5, y:54.2, surv:30000, dir:0, div:2}, {x:28.3, y:54.3, surv:28000, dir:0, div:2}, {x:27.5, y:54.5, surv:20000, dir:0, div:2}, {x:26.8, y:54.3, surv:12000, dir:0, div:2}, {x:26.4, y:54.4, surv:14000, dir:0, div:2}, {x:24.6, y:54.5, surv:8000, dir:0, div:2}, {x:24.4, y:54.4, surv:4000, dir:0, div:2}, {x:24.2, y:54.4, surv:4000, dir:0, div:2}, {x:24.1, y:54.3, surv:4000, dir:0, div:2}, {x:24, y:55.2, surv:22000, dir:1, div:3}, {x:24.5, y:55.3, surv:22000, dir:1, div:3}, {x:24.6, y:55.8, surv:6000, dir:0, div:3}, {x:37.6	,y:55.8	,surv:100000,dir:1,div:1},{x:28.5	,y:54.2,surv:30000	,dir:1,div:2}, {x:24.1,y:54.3,surv:6000,dir:1,div:3},{x:24.2, y:54.4, surv:6000, dir:0, div:3}, {x:24.1, y:54.3, surv:6000, dir:0, div:3}];
}

function getCityData(){
return [{x:24, y:55, city:"Kowno"}, 
{x:25.3, y:54.7, city:"Wilna"}, 
{x:26.4, y:54.4, city:"Smorgoni"}, 
{x:26.8, y:54.3, city:"Molodexno"}, 
{x:27.7, y:55.2, city:"Gloubokoe"}, 
{x:27.6, y:53.9, city:"Minsk"}, 
{x:28.5, y:54.3, city:"Studienska"}, 
{x:28.7, y:55.5, city:"Polotzk"}, 
{x:29.2, y:54.4, city:"Bobr"}, 
{x:30.2, y:55.3, city:"Witebsk"}, 
{x:30.4, y:54.5, city:"Orscha"}, 
{x:30.4, y:53.9, city:"Mohilow"}, 
{x:32, y:54.8, city:"Smolensk"}, 
{x:33.2, y:54.9, city:"Dorogobouge"}, 
{x:34.3, y:55.2, city:"Wixma"}, 
{x:34.4, y:55.5, city:"Chjat"}, 
{x:36, y:55.5, city:"Mojaisk"}, 
{x:37.6, y:55.8, city:"Moscou"}, 
{x:36.6, y:55.3, city:"Tarantino"}, 
{x:36.5, y:55, city:"Malo-jarosewli"}];
}


function getTemperData(){
  return [[37.6   ,0     , 6    ,"Oct"   ,18],
[36     ,0     , 6    ,"Oct"   ,24],
[33.2   ,-9    , 16   ,"Nov"   ,9],
[32     ,-21   , 5    ,"Nov"   ,14],
[29.2   ,-11   , 10   ,"Nov"   ,24],
[28.5   ,-20   , 4    ,"Nov"   ,28],
[27.2   ,-24   , 3    ,"Dec"   ,1],
[26.7   ,-30   , 5    ,"Dec"   ,6],
[25.3   ,-26   , 1    ,"Dec"   ,7]];
}

function getLinedic(){
  return {
    "18Oct": "Wilna",
    "24Oct": "Smorgoni",
    "9Nov": "Molodexno",
    "14Nov": "Studienska",
    "24Nov": "Bobr",
     "28Nov": "Smolensk",
    "1Dec": "Dorogobouge",
    "6Dec": "Mojaisk",
    "7Dec": "Moscou",   
  };
}