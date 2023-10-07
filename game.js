class Game {
    #objects;
    #bullets;
    #status; //ACTIVE, LOST, WON
    #round;
    #player;
    #game_on;
    #t;
    #now;

    constructor(player = 'Player 1') {
        this.#t = millis();
        this.#now = millis() - this.#t;
        this.#round = 0;
        this.#objects = [];
        this.#bullets = [];
        this.#status = 'ACTIVE'; //how is this different from #game_on?

        this.killMax = 0;
        this.killCount = 0;
        this.#player = player;
        this.#game_on = false;
    }

    get now() {
        this.#now = millis() - this.#t;
        return this.#now;
    }

    get player() {
        return this.#player;
    }

    get status() {
        return this.#status;
    }

    get round() {
        return this.#round;
    }

    get game_on() {
        return this.#game_on;
    }

    set game_on(ready = false) {
        this.#game_on = false;
        if (this.#status == 'ACTIVE') {

        }
        if (ready == true) {
            this.#game_on = true;
        }
    }

    get objects() {
        return this.#objects;
    }

    get bullets() {
        return this.#bullets;
    }

    //Moves and draws all enemies and dropped objects on screen
    animateObjects() {
        let stuff = [];
        for (x of this.#objects) {
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
      
          let i = this.#objects.indexOf(x);
          x.draw(false, (i + 1) * 12); //can turn debug text on/off with bool
      
          if (x.active === true) {
            stuff.push(x);
          } else if (x.name == 'Enemy') {
            if (x.alive == false) { killCount += 1; }
          }
        }
        this.#objects = [];
        this.#objects = (this.#objects.concat(stuff)).flat();
    }

    //Move and draw all bullets fired by player
    animateBullets() {
        for (b of this.#bullets) {
            b.fall(g);
            b.move();
            b.edges();
            for (x of this.#objects) {
              if (x.active) {
                b.hits(x);
              }
            }
            if (b.active) {
              b.draw();
            } else {
              this.#bullets.splice(this.#bullets.indexOf(b), 1);
            }
          }
    }

    next_round() {
        this.#round += 1;
        this.#status == 'ACTIVE'
        this.#game_on = true;
    }

    end_round() {
        //pass
    }

    play() {
        //main
    }

    lose() {
        //set loss conditions to get here in?
    }

    win() {
        //set win conditions at the beginning?
    }

    menu() {
        //which menu? is there more than one?
    }

}

function dropEnemy(x = random(40, width-40), y = random(-40, 0)) {
    let e = new Enemy(x, y);
    currentGame.objects.push(e);
    currentGame.objects.push(e.chute);
}

function paradropPlane(altitude=200) {
    let pp = new Plane(-200, altitude);
    currentGame.objects.push(pp);
}
