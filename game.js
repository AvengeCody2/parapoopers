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

    dropEnemy(x = random(40, width-40), y = random(-40, 0)) {
        let e = new Enemy(x, y);
        this.#objects.push(e);
        this.#objects.push(e.chute);
    }

    paradropPlane(altitude=200) {
        let pp = new Plane(-200, altitude);
        this.#objects.push(pp);
    }
}