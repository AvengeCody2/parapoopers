class Explosion {
    constructor(x, y, range, blast = 100) {
        this.pos = createVector(x, y);
        this.range = range;
        this.t = millis();

        this.radius = 1;
        this.damage = 20;
        this.blast = blast;

        this.active = true;
    }

    draw() {
        let now = millis() - this.t;
        

        let hue = map(this.range, 30, 110, 0, 100, true);
        noStroke();
        // stroke(255, 100, 0); //for debugging
        fill(255, 180 + hue, 204, 255 - (now/12));
        ellipseMode(CENTER);

        //explode in 0.6 seconds
        let duration = 600
        if (now < duration) {
            this.radius = map(now, 0, duration, 1, this.blast);
            circle(this.pos.x, this.pos.y, this.radius);
        } else if (now >= duration) {
            this.active = false;
        }
    }
}