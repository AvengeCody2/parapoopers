let mouse;
let mouseReady = false;
let fullAuto = false;
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
let enemy_density = 5000; //milliseconds between each deployment

//physics variables
let gravity = 0.2;
let wind;
const drag = 0.05;

let applyRange = 72;

let AAgun;
let aimAt;
let ee;
let pp;

let currentGame;

function preload() {
  Nosifer = loadFont('./assets/NosiferCaps-Regular.ttf');
}

function setup() {
  textFont(Nosifer);
  angleMode(DEGREES);
  createCanvas(windowWidth - 100, windowHeight - 100);
  g = createVector(0, gravity); //gravity
  wind = createVector(0, 0);

  AAgun = new Gun(width / 2, height - 50, applyRange);
  AAgun.alive = true;
  // AAgun.HP = 50;
  ee = new Enemy(width - 400, height / 2);
  pp = new Plane(width - 400, 200);
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
  rect(0, height - 70, width, 70);

  fill(255);
  stroke(0);
  textSize(16);
  textAlign(LEFT);
  text("KILLS: " + killCount, 40, 20);
  text("KILL " + kills_left + " MORE", 40, 40);
  textAlign(RIGHT);
  text("ROUND " + game_round, width - 40, 20);

  // AAgun
  HPBar();
  ee.draw();
  rectMode(CORNER);
  noFill();
  stroke(255,0,0);
  rect(ee.chute.pos.x - 50, ee.chute.pos.y-20, 100, 20);
  // pln.draw();
  //CONTROLS
  if (mouseIsPressed === true) {
    if (mouseButton === LEFT) {
      if (mouseReady === true) {
        fireBullet();

      }
    } else if (mouseButton === CENTER) {
      if (fullAuto === false) {
        fullAuto = true;
      } else {
        fullAuto = false;
      }
    }
  } else if (mouseIsPressed === false) {
    mouseReady = true;
    // wind.set(-0.5, 0);
  }
  // if (keyIsDown(37)) {
  //   //left arrow
  //   AAgun.steer(37);
  // } else if (keyIsDown(39)) {
  //   //right arrow
  //   AAgun.steer(39);
  // }

  if (keyIsDown(UP_ARROW)) {
    if (applyRange < AAgun.rng_max) {
      applyRange += 0.25;
      AAgun.set_range(applyRange);
    }
  }
  if (keyIsDown(DOWN_ARROW)) {
    if (applyRange > AAgun.rng_min) {
      applyRange -= 0.25;
      AAgun.set_range(applyRange);
    }
  }

  //move all stuff and draw it
  let stuff = [];
  for (x of objects) {
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
    x.draw(false, (i + 1) * 12); //can turn debug text on/off with bool

    if (x.active === true) {
      stuff.push(x);
    } else if (x.name == 'Enemy') {
      if (x.alive == false) { killCount += 1; }
    }
  }
  objects = [];
  objects = (objects.concat(stuff)).flat();

  for (b of bullets) {
    b.fall(g);
    b.move();
    b.edges();
    b.hits(ee);
    b.hits(ee.chute);
    for (x of objects) {
      if (x.active) {
        b.hits(x);
      }
    }
    if (b.active) {
      b.draw();
    } else {
      bullets.splice(bullets.indexOf(b), 1);
    }
  }
  aim(AAgun.pos.x, AAgun.pos.y, color(150, 255, 0, 150));
  AAgun.move();
  AAgun.draw();

  if (game_on) {
    if (kills_left > 0 && AAgun.alive == true) {
      if (t % enemy_density < 16) {
        if (next_wave_ready) {
          // dropEnemyWave();
          if (pp.active == false) {
            next_wave_ready = false;
          }
        } else {
          dropEnemy();
        }
      }
    } else if (objects.length == 0 && AAgun.alive == true) {
      game_on = false;
    }
  } else if (AAgun.alive) {
    textAlign(CENTER, CENTER);
    fill(76, 20, 0);
    // fill(255);
    stroke(144, 98, 0);
    textFont(Nosifer);
    textSize(48);
    if (game_round == 20) {
      //You won!
      text("YOU WON!\nPress E to keep going!", width / 2, height / 2);
    } else {
      // text("PRESS E TO START ROUND " + (game_round + 1), width / 2, height / 2);
      // loadFont('assets/nosifer.ttf', drawText);
    }
  } else {
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(0);
    textSize(48);
    textFont(Nosifer);
    text("GAME OVER", width / 2, height / 2);
  }
}



function aim(x, y, color) {
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
  let p = createVector(x + (mag * cos(phi)), y + (mag * sin(phi)));
  strokeWeight(4);
  let r = 0.154 * (applyRange * applyRange);
  arc(x, y, r, r, 180, 0);
  strokeWeight(1);
  beginShape();
  vertex(p.x + (1.2 * mag * cos(phi)), y);
  vertex(x, y);
  vertex(p.x + (1.2 * mag * cos(phi)), p.y + (1.2 * mag * sin(phi)));
  endShape();
  strokeWeight(1);
  circle(p.x + (1.2 * mag * cos(phi)), p.y + (1.2 * mag * sin(phi)), 8);
  stroke(255, 1.2 * mag);
  circle(p.x + (1.2 * mag * cos(phi)), y, 8);

  AAgun.steer();
  stroke(255, 0, 0, 150);
  let theta = AAgun.theta - 90;
  line(x, y, x + (2.2 * mag * cos(theta)), y + (2.2 * mag * sin(theta)));
  strokeWeight(3);
  circle(x + (2.2 * mag * cos(theta)), y + (2.2 * mag * sin(theta)), 3);
}

function HPBar(x = width / 2 - 200, y = height - 20) {
  let a = width / 2 - 200;
  let hpx = map(AAgun.HP, 0, 100, 1, 400);
  // rectMode(CENTER);
  stroke(0);
  strokeWeight(1);
  noFill();
  rect(x, y, 400, 18);
  noStroke();
  fill(255, 0, 0, 150);
  rect(x, height - 20, hpx, 18);
  stroke(0);
  fill(255, 255);
  textAlign(CENTER);
  text("HEALTH", x + 200, y + 5);
}

function fireBullet() {
  if (fullAuto === false) {
    mouseReady = false;
  } else if (fullAuto === true) {
    if (t%250<200) { mouseReady = true;}
    else { mouseReady = false;}
  }
  if (AAgun.alive) {
    angleMode(DEGREES);
    let c = new Bullet(AAgun.pos.x, AAgun.pos.y - 14, applyRange);
    let powder = createVector((c.range * cos(AAgun.theta - 90)), (c.range * sin(AAgun.theta - 90)));
    c.applyForce(powder);
    bullets.push(c);
    // console.log("bullet[" + bullets.indexOf(c) + "]: -X:" + c.pos.x + "  -Y:" + c.pos.y + "  Angle:" + powder.heading());
  }
}

function thePlane() {
  pp = new ParapooperPlane(-200, 200);
  objects.push(pp);
  next_wave_ready = true;
}

function dropEnemy(x = random(40, width - 40), y = random(-40, 40)) {
  let e = new Enemy(x, y);
  objects.push(e);
  objects.push(e.chute);
}

function dropEnemyWave() {
  for (let i = 64; i < width; i += 192) {
    dropEnemy(i, 40);
  }
  next_wave_ready = false;
}

function startNewRound() {
  game_round += 1;
  killMax = killCount + round((game_round * 4) + round(game_round / 2))
  game_on = true;
  t_round = millis();
  if (game_round % 30 == 0) {
    // next_wave_ready = true;
    dropEnemyWave();
  }
  if (game_round % 3 == 0) {
    thePlane();
    enemy_density -= 200;
  }
}




function keyTyped() {
  if (keyCode === 69) {
    if (AAgun.alive == true && kills_left == 0) {
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

  if (event.delta > 0) {
    //scroll down
    if (applyRange > AAgun.rng_min) {
      applyRange -= 0.5;
      AAgun.set_range(applyRange);
    }
  } else if (event.delta < 0) {
    //scroll up
    if (applyRange < AAgun.rng_max) {
      applyRange += 0.5;
      AAgun.set_range(applyRange);
    }
  }
}

function drawText(font) {
  textAlign(CENTER, CENTER);
  // fill(144, 98, 0);
  fill(255);
  stroke(0);
  textFont(font, 48);
  text("Press E to start round ", width/2, height/2);
}