class Enemy extends PhysicalObject {
    constructor(x, y, mass = 25, hp=4) {
        super(x, y, mass)
        this.name = "Enemy";
        this.HP = hp;
        this.alive = true;
        this.death = null;
        let r = round(random(1,splat_sounds.length)) -1;
        console.log('choose splat_sounds[%d]', r);
        this.splat = splat_sounds[r];
        console.log('this.splat = ' + this.splat);
        this.splatPlayed = false;

        this.width = 15;
        this.height = 36;

        this.chute = new Parachute(this.pos.x, this.pos.y);
        this.chute.name = this.name + "_chute";
        this.chute.mass += this.mass;
    }

    fall(g) {
        if(this.chute.active == true) {
            this.chute.fall(g);
            // this.acc.set(this.chute.acc);
        } else if (this.chute.active == false){
            super.fall(g);
        }
    }
    drag(C) {
        if(this.chute.active == true) {
            this.chute.drag(C);
            // this.acc.set(this.chute.acc);
        } else if (this.chute.active == false){
            super.drag(C);
        }
    }

    // applyForce(force) {
    //     if(this.chute.active == true) {
    //         this.chute.applyForce(force);
    //         this.acc.set(this.chute.acc);
    //     } else if (this.chute == false){
    //         super.applyForce(force);
    //     }
    // }

    edges() {
        if (this.pos.y > height - 40 || this.pos.x < -10 || this.pos.x > width+10) {

            if (this.vel.y > 3.5) { 
                // go splat!
                this.kill();
            }
            this.vel.y = 0;
        }
    }

    move() {
        if (this.pos.y <= height -40) {
            if (this.chute.active == true){
                this.acc.set(this.chute.acc);
                this.chute.move();
            }
        } else if (this.pos.y > height - 40) {
            this.pos.y = height - 40;
            this.chute.active = false;
            this.acc.set(0,0);
            if (this.alive) {
                //move to middle
                if (this.pos.x > width/2 + 20) {
                    this.vel.x = -0.5;
                } else if (this.pos.x < width/2 - 20) {
                    this.vel.x = 0.5;
                } else {
                    this.vel.x = 0;
                    //ATTACK!
                }
            } else {
                this.vel.x = 0;
            }
        }

        this.vel.add(this.acc);
        this.pos.add(this.vel);

        // console.log("v_x: " + this.vel.x + "\tv_y: " + this.vel.y);

        this.a_out = "ACC(x: " + this.acc.x.toFixed(2) + " y: " + this.acc.y.toFixed(2) + ")\t";
        this.acc.set(0, 0);
    }

    draw(debug = false, verbose = false, text_y = 12) {
        angleMode(RADIANS);
        ellipseMode(CENTER);
        if(this.chute.active == true){
            this.chute.pos.set(this.pos);
            this.chute.pos.y = this.pos.y-44;
            this.chute.draw(debug, verbose, text_y);
        }

        if (this.alive == false && this.pos.y >= height - 40) {
            fill(51, 0, 0);
            stroke(71, 31, 0);
            strokeWeight(1);

            let now = millis() - this.death;
            if (now/10 < 30) {
                this.width = map(round(now/10), 0, 30, 16, 58, true);
                this.height = map(round(now/10), 0, 30, 36, 4, true);
                let drop_y = map(round(now/10), 0, 30, 0, 14);
                ellipse(this.pos.x, this.pos.y+drop_y, this.width, this.height);
                let eyepos = createVector(this.pos.x, this.pos.y+(drop_y*2));
                eyes(eyepos, "DEAD");
                if (!this.splatPlayed) {
                    this.splat.play();
                    this.splatPlayed = true;
                }
            } else if (now/100 > 40) {
                this.active = false;
            } else {
                ellipse(this.pos.x, this.pos.y+14, 58, 4);
            }
        } else {
                //body
                fill(51, 0, 0);
                stroke(71, 31, 0);
                strokeWeight(1);
                ellipse(this.pos.x+2, this.pos.y+2, 8, 12); //head
                ellipse(this.pos.x+3, this.pos.y+26, 6, 12); //thorax
                ellipse(this.pos.x+1, this.pos.y+14, 10, 16); //abdomen
                //eyes
                if (this.vel.y < 3 && this.alive == true){
                    eyes(this.pos, "NARROW");
                } else if (this.alive == false) {
                    eyes(this.pos, "DEAD");
                } else {
                    eyes(this.pos, "OPEN");
                }
            if (verbose) {
                fill(0);
                stroke(255);
                strokeWeight(1);
                textSize(12);
                text(this.text(), 40, text_y)
            }
        }

        if (debug === true) {
            push();
            rectMode(CORNER);
            stroke(220, 100, 0);
            strokeWeight(3);
            point(this.pos);
            strokeWeight(1);
            noFill();
            rect(this.hitBoxStart().x, this.hitBoxStart().y, this.hitBoxEnd().x, this.hitBoxEnd().y);
            pop();
        }

        function eyes(pos, type) {
            if (type == "OPEN") {
                fill(255);
                noStroke();
                ellipse(pos.x-3, pos.y-14, 5,6);
                ellipse(pos.x+3, pos.y-14, 5,6);
                fill(0);
                circle(pos.x-3, pos.y-14,3);
                circle(pos.x+3, pos.y-14,3);        
            } else if (type == "NARROW") {
                fill(255);
                noStroke();
                ellipse(pos.x-3, pos.y, 5,6);
                ellipse(pos.x+3, pos.y, 5,6);
                fill(0);
                circle(pos.x-3, pos.y+1,2);
                circle(pos.x+3, pos.y+1,2);
                //eye lids
                fill(51,0,0);
                arc(pos.x-3, pos.y, 5, 6, PI+QUARTER_PI, (2*PI)+QUARTER_PI, OPEN);
                arc(pos.x+3, pos.y, 5, 6, PI-QUARTER_PI, -QUARTER_PI, OPEN);
            } else if (type == "DEAD") {
                fill(255);
                noStroke();
                ellipse(pos.x-3, pos.y, 5,6);
                ellipse(pos.x+3, pos.y, 5,6);
                fill(0);
                stroke(0);
                strokeWeight(2);
                line(pos.x-4, pos.y-1, pos.x+5, pos.y-12);
                line(pos.x-4, pos.y+2, pos.x+5, pos.y-15);
                // circle(pos.x-2, pos.y-16,2);
                // circle(pos.x+4, pos.y-16,2);
            }
        }
    }

    damage(dmg) {
        this.HP -= dmg;
        if (this.HP <= 0) {
            this.kill();
        }
    }

    kill() {
        if(this.alive) {
            this.death = millis();
        }
        this.alive = false;
    }
}