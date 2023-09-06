class Gun {
    constructor(x, y, rng) {
        angleMode(DEGREES);
        this.pos = createVector(x, y);
        this.range = rng;
        this.rng_max = 110;
        this.rng_min = 30;
        this.theta = 20;
        this.thetaVel = 0;
        this.thetaAcc = 0;
        this.aim_angle = this.theta;
        this.delta = this.aim_angle - this.theta;
        this.vel_max = 0.75;

        this.HP = 100;
        this.alive = true;
        this.poops = [];
        this.poops = (this.poops.concat(poop_stains())).flat();


        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
    }
    
    set_range(r) {
        if (r < this.rng_max && r > this.rng_min){
            this.range = r;
        }
    }

    steer(dir) {
        let aim_acc = 0.01;
        if (this.aim_angle >= -90 && this.aim_angle <= 90) {
            if(dir < 38) {
                //steer left
                if (this.delta < 0) {this.applyForce(aim_acc *-1);}
                this.aim_angle += -1;
            } else if (dir > 38) {
                //steer right
                if (this.delta > 0) {this.applyForce(aim_acc);}
                this.aim_angle += 1;
            } 
            if(this.aim_angle > 90) {this.aim_angle = 90;}
            else if(this.aim_angle < -90) {this.aim_angle = -90;}
            // console.log("AAgun cannot move past " + this.aim_angle);
        }
    }

    applyForce(force) {
        this.thetaAcc += force;
    }

    move() {
        this.delta = this.aim_angle - this.theta;

        if (this.theta >= -90 && this.theta <= 90) {
            if (this.thetaVel <= this.vel_max && this.thetaVel >= -1* this.vel_max){
                this.thetaVel += this.thetaAcc;
            } else if (this.thetaVel > this.vel_max){
                this.thetaVel = this.vel_max;
            } else if (this.thetaVel < -1* this.vel_max) {
                this.thetaVel = -1 * this.vel_max;
            }

            if (this.delta > -0.5 && this.delta < 0.5) {
                this.thetaVel = 0;
                this.theta = this.aim_angle;

            } else if ((this.delta >= 0.5 && this.thetaVel > 0) || this.delta <= -0.5 && this.thetaVel < 0) {
                //moving, delta gap is closing
                this.theta += this.thetaVel;
            } else {
                this.thetaVel = 0;
            }
        }
        
        if (this.theta < -90) {
            this.theta = -90;
        } else if (this.theta > 90) {
            this.theta = 90;
        }

        this.thetaAcc = 0;
    }

    draw() {
        angleMode(DEGREES);
        rectMode(CORNER);
        stroke(100);
        strokeWeight(2);
        fill(55);
        
        if(this.alive) {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.theta);
            rect(-4, -36, 8, 42);
            pop();
        } else {
            push();
            translate(this.pos.x, this.pos.y);
            if (this.theta >= 0){rotate(-80);}
            else {rotate(80);}
            rect(-4, 0, 8, 42)
            pop();

            line(this.pos.x-8, this.pos.y, this.pos.x-8, this.pos.y-32);
            noStroke();
            fill(255);
            rect(this.pos.x-8, this.pos.y-32, 24, 16);
            let e = new Enemy(this.pos.x+4, this.pos.y-12);
            e.chute.active = false;
            e.draw();
        }
        
        stroke(100);
        strokeWeight(2);
        fill(55);

        beginShape();
        vertex(this.pos.x-12, this.pos.y);
        vertex(this.pos.x+12, this.pos.y);
        vertex(this.pos.x+20, this.pos.y+24);
        vertex(this.pos.x-20, this.pos.y+24);
        endShape(CLOSE);

        if (this.HP < 100) {
            //little brown splots
            for (let p = 0; p < round((100 -this.HP)/5); p++) {
                noStroke();
                fill(52, 0, 0);
                let poo = this.poops[p];
                circle(this.pos.x + poo.x, this.pos.y + poo.y, poo.r);
            }
        }
        //  else if (this.HP <= 25) {
            //bigger brown splots
        // }

        noStroke();
        fill(255,0,0);

        fill(255);
        stroke(0);
        strokeWeight(1);
        // text("thetaAcc:" + this.thetaAcc + "\tthetaVel: " + this.thetaVel, 400, 20);
    }

    hit(enemy) {
        if (enemy.pos.y > height -30) {
            console.log("enemy on the ground");
        }
        let d = p5.Vector.sub(this.pos, enemy.pos);
        if (d.mag() < 40 && enemy.alive == true) {
            console.log("You're hit!!!");
            enemy.active = false;
            this.HP -= enemy.HP*5;
            if (this.HP <= 50 && this.HP > 25) {
                console.log("Cannon movement slowed down!");
                this.vel_max = 0.50;
            } else if (this.HP <= 25 && this.HP > 0) {
                console.log("Cannon is lookin pretty bad!");
                this.vel_max = 0.25;
            } else if (this.HP <= 0) {
                this.HP = 0;
                console.log("you dead.");
                this.alive = false;
            }
        }
    }
}

function poop_stains() {
    let poops = [];
    //little brown splots
    for (let i = 0; i < 20; i++) {
        let poo_x = random(-8, 8);
        let poo_y = random(4, 20);
        let poo_r = random(2, 5);

        let poo = {x: poo_x, y: poo_y, r: poo_r};
        poops.push(poo);
    }
    console.log(poops);
    return poops;
}
