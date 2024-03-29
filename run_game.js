let mouse;
let mouseReady = false;
let fullAuto = false;
let t;
let t_round;

let objects = [];
let bullets = [];

//interface
let vol_knob;
//menu
let btn_playGame, btn_options;

//sound effects
let main_song, background_noise;
let gun_sounds = [], splat_sounds = [];
let gun_shot, flak_explode;

//game variables
let playing;
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


function vol_change() {
  console.log("volume set to ", vol_knob.value());
  background_noise.setVolume(vol_knob.value()+0.25);
  flak_explode.setVolume(vol_knob.value() - 0.4)
  main_song.setVolume(vol_knob.value());
  
  for (s of gun_sounds) {
    s.setVolume(vol_knob.value());
  }
}

function stopSounds() {
  for (s of gun_sounds) {
    if(s.isPlaying() == true) {
        s.stop();
    }
  }
}


function preload() {
  Nosifer = loadFont('./assets/NosiferCaps-Regular.ttf');
  main_song = loadSound('./assets/sound/song_loop.wav');
  background_noise = loadSound('./assets/sound/distant_battle.wav');
  gun_sounds.push(loadSound('./assets/sound/gun_click.wav')); //0
  gun_sounds.push(loadSound('./assets/sound/cannon_fire.wav')); //1
  flak_explode = loadSound('./assets/sound/cannon_02.wav');

  splat_sounds.push(loadSound('./assets/sound/splat.wav'));
  splat_sounds.push(loadSound('./assets/sound/splat_hard.wav'));
  splat_sounds.push(loadSound('./assets/sound/splat_soft.wav'));
}

function setup() {
  //web page elements
  vol_knob = createSlider(0, 0.2, 0.1, 0.01);
  vol_knob.changed(vol_change);

  textFont(Nosifer);
  angleMode(DEGREES);
  ellipseMode(CENTER);
  createCanvas(windowWidth - 100, windowHeight - 100);
  g = createVector(0, gravity); //gravity
  wind = createVector(0, 0);

  AAgun = new Gun(width / 2, height - 50, applyRange);
  AAgun.alive = true;
  // AAgun.HP = 50;
  ee = new Enemy(width - 400, 200, 25, 4 * 10**4);
  ee.chute.HP = 4 * 10**4;
  // ee = new PhysicalObject(width/2, 200, 200);
  pp = new Plane(width - 400, 200);

  playing = -1;
}



function draw() {
  angleMode(DEGREES);

  // if (playing == 1) {
  //   play_game();
  // } else if (playing == 0){
  //   //MENU
  //   main_menu();
  // } else if (playing == -1) {
  //   //MAIN TITLE
  //   main_title();
  // }
  play_game();
}


function main_title() {
  //background
  rectMode(CORNER);
  background(120, 140, 255);
  fill(180, 120, 120);
  noStroke();
  rect(0, height - 70, width, 70);

  //title
  textAlign(CENTER, CENTER);
  fill(76, 20, 0);
  // fill(255);
  stroke(144, 98, 0);
  strokeWeight(3);
  textFont(Nosifer);
  textSize(100);
  text("PARAPOOPERS", width / 2, height / 2);

  if (keyIsDown(32)) {
      //space bar is pressed
      init_menu();
      playing = 0;
    }

  if (mouseIsPressed === true &&
    mouseX > 0 && mouseX < width &&
    mouseY > 0 && mouseY < height) {
    if(background_noise.isPlaying != true) {
      stopSounds();
      background_noise.stop();
      main_song.stop();
      background_noise.loop();
      main_song.loop();
      vol_change();
    }
  }
}


function init_menu() {
  btn_playGame = new Menu_Button("New Game", width/2, height/2-35, 400, 50);
  btn_options = new Menu_Button("Options", width/2, height/2+35, 400, 50);
}


function main_menu() {
  background(0);

  //menu
  btn_playGame.draw();
  if (mouseIsPressed === true) {
    if (mouseReady === true) {
      if (mouseButton === LEFT) {
        if(btn_playGame.hover()){
          //run the game
          //init_game(); to reset timer and enemies to 0...
          gun_sounds[0].play();
          playing = 1;
          main_song.stop();
          background_noise.stop();
        }
      }
      mouseReady = false;
    }
  } else {
    mouseReady = true;
  }

  // if (keyIsDown(32)) {
  //     //space bar is pressed
  //     playing = 1;
  //   }
}

function play_game() {
  //Start Game Time
  t = millis();

  //Update HUD
  if (killMax > killCount) {
    kills_left = killMax - killCount;
  } else {
    kills_left = 0;
  }


  //BACKGROUND
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


  // HUD (hp bar)
  HPBar();
  // pp.draw(true, false);

  // pln.draw();
  //CONTROLS
  if (mouseIsPressed === true) {
    if (mouseButton === LEFT) {
      fullAuto = false;
      if (mouseReady === true) {
        fireBullet();
        gun_sounds[1].play();
      }
    } else if (mouseButton === CENTER) {
      fullAuto = true;
      fireBullet();
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


  //ENEMIES, PLANES, ETC.
  let stuff = [];
  // console.log("There are currently %d items in objects[]", objects.length);
  // console.log(objects);
  for (x of objects) {
    //move all stuff and detect position
    x.fall(g)
    x.drag(drag);
    x.move();
    x.edges();

    //detect if object is touching gun
    AAgun.hit(x);
    if (AAgun.alive == false) {
      game_on = false;
    }

    //draw object and show debug text if verbose==true
    let i = objects.indexOf(x);
    x.draw(true, false, (i + 1) * 12); //can turn debug text on/off with bool

    if (x.active === true) {//put active objects in stuff array
      stuff.push(x);
    } else if (x.name == 'Enemy') {//increment killCount
      if (x.alive == false) { killCount += 1; }
    }
  }
  //clear objects array and re-add active objects from stuff
  objects = [];
  objects = (objects.concat(stuff)).flat();


  //BULLETS
  for (b of bullets) {
    if (b.active) {
      b.fall(g);
      b.move();
      b.edges();
      // let pp_hit = b.hits(pp);
      // console.log("pp_hit? %s\npp_hp = %d", pp_hit, pp.HP);
      // let eecht_hit = b.hits(ee.chute);
      // console.log("ee hit? %s \nee_chute? %s \nee_HP = %d\neeChute_HP = %d", ee_hit, eecht_hit, ee.HP, ee.chute.HP);
      for (x of objects) {
        if (x.active) {
          b.hits(x);
          try {
            if (x.chute.active) {
              b.hits(x.chute);
            }
          }catch(err) {
            console.log("%s does not have a chute", x.name);
            // console.log(err);
          }
        }
      }
      b.draw(false, false);
    } else {
      bullets.splice(bullets.indexOf(b), 1);
    }
  }

  //AA GUN
  aim(AAgun.pos.x, AAgun.pos.y, color(150, 255, 0, 150));
  AAgun.move();
  AAgun.draw();


  //GAME STATUS & ROUNDS
  if (game_on) { // round is still going
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
  } else if (AAgun.alive) { // inbetween rounds
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
      text("PRESS E TO START ROUND " + (game_round + 1), width / 2, height / 2);
      // loadFont('assets/nosifer.ttf', drawText);
    }
  } else { // Game over
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
  //Single fire or full-auto
  if (fullAuto === false) {
    mouseReady = false;
  } else if (fullAuto === true) {
    if (t%250<200) { mouseReady = true;}
    else { mouseReady = false;}
  }

  //fire a bullet
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
  // objects.push(e.chute);
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
  // if (game_round % 3 == 0) {
  //   // next_wave_ready = true;
  //   dropEnemyWave();
  // }
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