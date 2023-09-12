class Bullet extends PhysicalObject {
    constructor (x, y, rng) {
        super(x, y, 6);
        this.name = "Bullet";
        this.width = 1;
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
        console.log("Blast: " + this.blast.pos + "\tactive: "+ this.blast.active);
        this.exploded = true;
    }

    hits(target) {
        let d = p5.Vector.sub(this.pos, target.pos);
        if (d.mag() < this.width/2 + target.height/3) {
            if (this.exploded) {
                target.damage(this.blast.blast);
            } else if(target.name == "Enemy") {
                this.vel.add(target.vel);
                target.damage(1);
            }
            
        }
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
                this.width = this.blast.width;
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