class Explosion {
    constructor(x, y, range, blast = 50) {
        this.pos = createVector(x, y);
        this.range = range;
        this.t = millis();

        this.width = 1;
        this.damage = 20;
        this.blast = blast;

        this.active = true;
    }

    draw() {
        let now = millis() - this.t;
        

        let hue = map(this.range, 30, 110, 0, 75, true);
        noStroke();
        fill(255, 180 + hue, 204, 255 - (now/10));

        //explode in 1.5 seconds
        if (now < 1500) {
            this.width = map(round(now/10), 0, 150, 1, this.blast);
            circle(this.pos.x, this.pos.y, this.width);
        } else if (now >= 1500) {
            this.active = false;
        }
    }
}