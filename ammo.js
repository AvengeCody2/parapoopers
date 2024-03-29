class Bullet extends PhysicalObject {
    constructor (x, y, rng) {
        super(x, y, 6);
        this.name = "Bullet";
        this.radius = 1;
        this.range = rng;

        this.damage = 1;
        this.blast;
        this.exploded = false;
        // this.touching = false;
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
        this.exploded = true;
        this.blast = new Explosion(this.pos.x, this.pos.y, this.range, 25);
        // console.log("Blast: " + this.blast.pos + "\tactive: "+ this.blast.active);
        // this.touching = false;
        // flak_explode.play();
    }

    // Ammo objects are represented as a point. Targets passed as argument should be PhysicalObjects with hitBox() property.
    //This function uses Collide2d library
    hits(target) {
        rectMode(CORNER);
        let hit = false;

        if (!this.exploded){
            hit = collidePointRectVector(this.pos, target.hitBoxStart(), target.hitBoxEnd());
        } else {
            hit = collideRectCircleVector(target.hitBoxStart(), target.hitBoxEnd(), this.blast.pos, this.blast.radius);
        }

        if (hit){
            if (this.exploded) {
                target.damage(this.blast.damage);
            } else if(target.name == "Enemy") {
                this.vel.add(target.vel);
                target.damage(this.damage);
            } 
        }

        return hit;
    }
    
    draw(debug = false, verbose = false, text_y = 12) {
        rectMode(CENTER);
        ellipseMode(CENTER);
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
                //verbose output to console
                if(verbose) {
                    console.log("radius: " + this.radius + "\nblast radius: " + this.blast.radius + "\ntop edge @ y = " + this.top_most_edge());
                    if (this.radius > this.blast.blast -1) {
                        console.log(this.text());
                    }
                }
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

        //for debugging
        stroke(255, 100, 0);
        point(this.pos.x, this.pos.y);
        circle(this.pos.x, this.pos.y, this.radius);
        

        if (verbose) {
            fill(0);
            stroke(255);
            strokeWeight(1);
            textSize(12);
            text(this.text(), 40, text_y)
        }
    }
}