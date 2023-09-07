let mouse;
let mouseReady = false;
let t;
let t_round;

let objects = [];
let bullets = [];

//game variables
let killCount = 0;
let killMax = 0;
let kills_left = 0;
let game_round = 0;
let game_on = false;
let next_wave_ready = false;

//physics variables
let gravity = 0.2;
let wind;
const drag = 0.05;

let applyRange = 72;

let AAgun;
let aimAt;
let ee;

function preload() {
  // myFont = loadFont('assets/NosiferCaps-Regular.ttf')
}
function setup() {
  // textFont(myFont);
  angleMode(DEGREES);
  createCanvas(1440, 900);
  g = createVector(0, gravity); //gravity
  wind = createVector(0, 0);

  AAgun = new Gun(width/2, height-30, applyRange);
  AAgun.alive = true;
  // AAgun.HP = 50;
  ee = new Enemy(width-400, height/2);

}

function draw() {
  t = millis();
  if (killMax > killCount) {
    kills_left = killMax - killCount;
  } else {
    kills_left = 0;
  }

  angleMode(DEGREES);
  //background
  rectMode(CORNER);
  background(120, 140, 255);
  fill(180, 120, 120);
  noStroke();
  rect(0, height-40, width, 40);
 
  fill(255);
  stroke(0);
  textSize(16);
  textAlign(RIGHT);
  text("Range: " + applyRange.toFixed(2), width-40, height-20);
  textAlign(LEFT);
  text("Kills: " + killCount, 40, 20);
  text("Kills to next round: " + kills_left, 40, 40);
  text("Angle: " + (AAgun.theta).toFixed(1), 40, height - 60);
  text("Angle: " + (AAgun.aim_angle).toFixed(1), 40, height - 40);
  text("Speed: " + Number((AAgun.vel_max *100).toFixed(0)), 40, height-20);


  // AAgun
  HPBar();
  AAgun.move();
  AAgun.draw();
  //ee.draw();
  //CONTROLS
  if (mouseIsPressed === true) {
      if (mouseButton === LEFT) {
        if (mouseReady === true) {
          fireBullet();
          //ballBarrage();
          mouseReady = false;
        }
      }
    } else if(mouseIsPressed === false) {
      mouseReady = true;
      wind.set(-0.5, 0);
  }

  // if (keyIsDown(37)) {
  //   //left arrow
  //   AAgun.steer(37);
  // } else if (keyIsDown(39)) {
  //   //right arrow
  //   AAgun.steer(39);
  // }

  if (keyIsDown(UP_ARROW)) {
    if(applyRange < AAgun.rng_max) {
      applyRange += 0.25;
      AAgun.set_range(applyRange);
    }
  }
  if (keyIsDown(DOWN_ARROW)) {
    if (applyRange > AAgun.rng_min){
      applyRange -= 0.25;
      AAgun.set_range(applyRange);
    }
  }

  //move all stuff and draw it
  let stuff = [];
  for(x of objects) {
    // console.log("_Gravity_");
    x.fall(g)
    // console.log("_Drag_");
    x.drag(drag);
    x.move();
    x.edges();
    AAgun.hit(x);
    if (AAgun.alive == false) {
      game_on = false;
    }

    let i = objects.indexOf(x);
    x.draw(false, (i+1) * 12); //can turn debug text on/off with bool

    if(x.active === true) {
      stuff.push(x);        
    } else if (x.name == 'Enemy') {
      if(x.alive == false) {killCount += 1;}
    }
  }
  objects = [];
  objects = (objects.concat(stuff)).flat();

  for(b of bullets) {
    b.fall(g);
    b.move();
    b.edges();
    b.hits(ee);
    b.hits(ee.chute);
    for (x of objects) {
      if (x.active){
        b.hits(x);
      }
    }
    if (b.active) {
      b.draw();
    } else {
      bullets.splice(bullets.indexOf(b), 1);
    }
  }
  aim(AAgun.pos.x, AAgun.pos.y, color(150,255,0,150));

  if (game_on) {
    if (kills_left > 0 && AAgun.alive == true) {
      if(t%3000 < 18) {
        if (next_wave_ready) {
          dropEnemyWave();
        }else {
          dropEnemy();
        }
      }
    } else if (objects.length == 0 && AAgun.alive == true){
      game_on = false;
    }
  } else if (AAgun.alive) {
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(0);
    textSize(48);
    text("Press E to start next round", width/2, height/2);
  } else {
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(0);
    textSize(48);
    text("GAME OVER", width/2, height/2);
  }
}



function aim(x, y, color){
  angleMode(DEGREES);

  aimAt = createVector(x - mouseX, y - mouseY);
  stroke(255, 0, 0, 128);
  strokeWeight(3);
  line(mouseX - 20, mouseY, mouseX + 20, mouseY);
  line(mouseX, mouseY - 20, mouseX, mouseY + 20);

  if (mouseY <= y) {
    AAgun.aim_angle = aimAt.heading() - 90;
  } else if (mouseX >= x) {
    AAgun.aim_angle = 90;
  } else if (mouseX < x) {
    AAgun.aim_angle = -90;
  }

  noFill();
  stroke(color);
  let phi = AAgun.aim_angle - 90;
  let mag = applyRange;
  let p = createVector(x + (mag * cos(phi)),y + (mag * sin(phi)));
  strokeWeight(4);
  let r = 0.154*(applyRange * applyRange);
  arc(x, y, r, r, 180, 0);
  strokeWeight(1);
  beginShape();
  vertex(p.x+(1.2*mag*cos(phi)), y);
  vertex(x, y);
  vertex(p.x+(1.2*mag*cos(phi)), p.y+(1.2*mag*sin(phi)));
  endShape();
  strokeWeight(1);
  circle(p.x+(1.2*mag*cos(phi)), p.y+(1.2*mag*sin(phi)), 8);
  stroke(255, 1.2*mag);
  circle(p.x+(1.2*mag*cos(phi)), y, 8);

  AAgun.steer();
  stroke(255, 0, 0, 150);
  let theta = AAgun.theta-90;
  line(x, y, x+(2.2*mag*cos(theta)), y+(2.2*mag*sin(theta)));
  strokeWeight(3);
  circle(x+(2.2*mag*cos(theta)), y+(2.2*mag*sin(theta)), 3);
}

function HPBar() {
  let a = width/2 - 200;
  let b = width/2 + 200;
  let x = map(AAgun.HP, 0, 100, 1, 400);
  // rectMode(CENTER);
  stroke(0);
  strokeWeight(1);
  noFill();
  rect(a, 20, 400, 50);
  noStroke();
  fill(255, 0, 0, 150);
  rect(a, 20, x, 50);
}

function fireBullet() {
  if(AAgun.alive) {
    angleMode(DEGREES); 
    let c = new Bullet(AAgun.pos.x, AAgun.pos.y-14, applyRange);
    let powder = createVector((c.range * cos(AAgun.theta-90)), (c.range * sin(AAgun.theta-90)));
    c.applyForce(powder);
    bullets.push(c);
    // console.log("bullet[" + bullets.indexOf(c) + "]: -X:" + c.pos.x + "  -Y:" + c.pos.y + "  Angle:" + powder.heading());
  }
}

function dropEnemy(x = random(40, width - 40), y = random(-40, 40)) {
  let e = new Enemy(x, y);
  objects.push(e);
  objects.push(e.chute);
}

function dropEnemyWave() {
  for(let i = 64; i < width; i+=128) {
    dropEnemy(i, 40);
  }
  next_wave_ready = false;
}

function startNewRound() {
  game_round += 1;
  killMax = round((game_round * 10) *1.2)
  game_on = true;
  t_round = millis();
  if (game_round%3 == 0) {
    next_wave_ready = true;
  }
}




function keyTyped() {  
  if (keyCode === 69) {
    if(AAgun.alive == true && kills_left == 0) {
      console.log("drop the troops");
      startNewRound();
    }
  }

  if (keyCode === 32) {
    fireBullet();
  }
}

function mouseWheel(event) {
  fill(255);
  stroke(0);
  textSize(16);
  textAlign(RIGHT);
  console.log("mouseWheel: " + event.delta);

  if(event.delta > 0) {
    //scroll down
    if (applyRange > AAgun.rng_min){
      applyRange -= 0.25;
      AAgun.set_range(applyRange);
    }
  } else if (event.delta < 0) {
    //scroll up
    if(applyRange < AAgun.rng_max) {
      applyRange += 0.25;
      AAgun.set_range(applyRange);
    }    
  }
}