var c1, c2;
var X_AXIS = 2;

function setup() {
  createCanvas(500,500);
  //background(21,30,69); // original flat color
  c1 = color(17,24,51);
  c2 = color(24,55,112);
}

var lilStars = [];
var bigStars = [];
var lines = [];
var fade = .00001

// keep some comments for old memories/reference
// attemp to make galaxy cloud/smoke
/*var particles = [];
var particleCount = 30;
var maxVelocity = 2;
var targetFPS = 33;*/

function draw() {
  clear();
  background(21,30,69);
  setGradient(0,0,width,height,c1,c2,X_AXIS);
  var currSec = second();
  var currMin = minute();
  var currHour = hour();
  if (bigStars.length > currMin) { // resetting stars when new minute hits
    bigStars = [];
  }
  if (lilStars.length > currSec) { // resetting big stars ...
    lilStars = [];
  }
  if (lines.length > currHour) { // resetting hour constellation lines ...
    lines = [];
  }
  while (lilStars.length < currSec) { // spawning little stars per second
    var star = {x:random(0,500),y:random(0,500),w:random(2,4),a:random(100,160)}; //Math.random()*.8+.2};
    star.color = random([color(230,228,147,star.a),color(235,234,175,star.a),color(242,242,208,star.a),
                         color(250,250,240,star.a),color(255,255,255,star.a)])
    star.h = star.w;
    star.centerX = star.x + star.w/2;
    star.centerY = star.y + star.h/2;
    star.ang = random(0,PI)/random(1,4);
    lilStars.push(star);
  }
  while (bigStars.length < currMin) { // spawning big stars per minute
    var bigStar = {x:random(0,500),y:random(0,500),r1:random(1,4),a:random(100,160),flicker:random(400,800)};
    bigStar.r2 = bigStar.r1*2
    bigStar.color = random([color(230,228,147,bigStar.a),color(235,234,175,bigStar.a),color(242,242,208,bigStar.a),
                         color(250,250,240,bigStar.a),color(255,255,255,bigStar.a)]);
    bigStar.ang = random([radians(millis()/170),radians(millis()/150),radians(millis()/-150),radians(millis()/-170)])
    bigStar.angDir = (Math.random()*0.1) - .05;
    bigStars.push(bigStar);
  }
  while (lines.length < currHour) { // spawning constellation fragments per hour
    var stem = {a:random(120,180),flicker:random(400,800)};
    stem.x1 = random(200,300);
    stem.y1 = random(200,300);
    if (lines.length > 0 && Math.random() < 0.9) { // higher chance of having constellation segments connect
      var otherStem = random(lines);
      stem.x1 = otherStem.x2;
      stem.y1 = otherStem.y2;
    }  
    stem.color = random([color(230,228,147,stem.a),color(235,234,175,stem.a),color(242,242,208,stem.a),
                         color(250,250,240,stem.a),color(255,255,255,stem.a)]);
    var angle = Math.random() * 2 * PI;
    var length = random(50,150);
    stem.x2 = stem.x1 + length*cos(angle);
    stem.y2 = stem.y1 + length*sin(angle);
    stem.dotS = random(1,4);
    lines.push(stem);
  }
  for (var i = 0; i < lilStars.length; i++) {
    var star = lilStars[i];
    star.ang = (star.ang + .01) % (2*PI)
    //if (alpha(star.color) < star.aMax) { // original attempt to have stars fade in and out 
    //  star.color = color(red(star.color),green(star.color),blue(star.color),alpha(star.color)+fade)
    //} // might come back to this lol
    fill(star.color);
    noStroke();
    push();
    translate(star.centerX,star.centerY);
    rotate(star.ang);
    rect(-star.w/2,-star.h/2,star.w,star.h);
    pop();
  }
  for (var i = 0; i < bigStars.length; i++) {
    var bigStar = bigStars[i];
    push();
    var shine = sin(millis()/bigStar.flicker); // spawned stars dim and brighten naturally; thank you golan
    var newOpa = map(shine,-1,1,-60,90);
    var newCol = color(red(bigStar.color),green(bigStar.color),blue(bigStar.color),alpha(bigStar.color)+newOpa);
    fill(newCol);
    noStroke();
    translate(bigStar.x,bigStar.y);
    bigStar.ang = (bigStar.ang + bigStar.angDir) % (2*PI)
    rotate(bigStar.ang);
    makeBigStar(0,0,bigStar.r1,bigStar.r2,5);
    pop();
  }
  for (var i = 0; i < lines.length; i++) {
    var stem = lines[i];
    push();
    var shine = sin(millis()/stem.flicker);
    var newOpa = map(shine,-1,1,-60,90);
    var newCol = color(red(stem.color),green(stem.color),blue(stem.color),alpha(stem.color)+newOpa);
    fill(newCol);
    stroke(newCol);
    line(stem.x1,stem.y1,stem.x2,stem.y2);
    ellipse(stem.x1,stem.y1,stem.dotS,stem.dotS);
    ellipse(stem.x2,stem.y2,stem.dotS,stem.dotS);
    pop();

    
  }
}

function setGradient(x,y,w,h,c1,c2,axis) { // for gradient sky background
  noFill();
  if (axis == X_AXIS) {
    for (var i = x; i <= x+w; i++) {
      var inter = map(i,x,x+w,0,1);
      var c = lerpColor(c1,c2,inter);
      stroke(c);
      line(i,y,i,y+h);
    }
  }
}

function makeBigStar(x,y,r1,r2,nPoints) { // drawing star shape
  var angle = TWO_PI / nPoints;
  var halfAngle = angle / 2.0;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * r2;
    var sy = y + sin(a) * r2;
    vertex(sx,sy);
    sx = x + cos(a + halfAngle) * r1;
    sy = y + sin(a + halfAngle) * r1;
    vertex(sx,sy);
  }
  endShape(CLOSE);
}
