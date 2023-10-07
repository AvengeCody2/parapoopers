class Bullet extends PhysicalObject {
    constructor (x, y, rng) {
        super(x, y, 6);
        this.name = "Bullet";
        this.radius = 1;
        this.range = rng;

        this.blast;
        this.exploded = false;
    }

    edges() {
        if (this.pos.y > height) {
            this.active = false;
        }
    }

    move() {
        if(this.exploded == false) {
            this.vel.add(this.acc);
            if (this.vel.y < 0) {
                this.pos.add(this.vel);
            } else {
                this.explode();
            }
        }

        this.a_out = "ACC(x: " + this.acc.x.toFixed(2) + " y: " + this.acc.y.toFixed(2) + ")\t";
        this.acc.set(0, 0);
    }

    explode() {
        this.vel.set(0, 0);
        this.blast = new Explosion(this.pos.x, this.pos.y, this.range);
        // console.log("Blast: " + this.blast.pos + "\tactive: "+ this.blast.active);
        this.exploded = true;
    }

    // Unfortunately, this method appears to do damage every cycle of the loop that it's collision with an enemy object is detected.
    hits(target) {
        if (this.pos.x - this.radius > target.left_most_edge() && this.pos.x + this.radius < target.right_most_edge()) {
            let d = abs(this.pos.y - target.pos.y);
            let h = this.radius + target.height;
            if (d < h) {
                if (this.exploded) {
                    target.damage(this.blast.blast);
                } else if(target.name.includes("Enemy")) {
                    this.vel.add(target.vel);
                    target.damage(1);
                    console.log("damaged " + target.name);
                }
            }
        }

        // let d = p5.Vector.sub(this.pos, target.pos);
        // if (d.mag() < this.radius/2 + target.height/3) {
        //     if (this.exploded) {
        //         target.damage(this.blast.blast);
        //     } else if(target.name == "Enemy") {
        //         this.vel.add(target.vel);
        //         target.damage(1);
        //     }            
        // }
    }
    
    draw(verbose = false, text_y = 12) {
        rectMode(CENTER);
        angleMode(DEGREES);
        let hue = map(this.range, 30, 110, 0, 75, true);
        noStroke();
        fill(255, 180 + hue, 204);

        //explode
        if (this.exploded) {
            if (this.blast.active) {
                //draw explosion
                this.blast.draw();
                this.radius = this.blast.radius;
            } else {
                this.active = false;
            }
        } else {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.vel.heading()-90);
            rect(0, 0, 4, 8);
            circle(0, -4, 4);
            pop();
        }

        if (verbose) {
            fill(0);
            stroke(255);
            strokeWeight(1);
            textSize(12);
            text(this.text(), 40, text_y)
        }
    }
}