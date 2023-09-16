class Game {
    #objects;
    #bullets;
    #state; //won, lost, playing
    #round;

    constructor() {
        this.#round = 0;
        this.#objects = [];
        this.#bullets = [];
        this.#tate = null;

        this.killMax = 0;
        this.killCount = 0;
    }
}