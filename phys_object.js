class PhysicalObject {
    constructor (x, y, m=5) {
        this.name = "PhysicalObject";
        this.mass = m;
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.t_out = "";
        this.a_out = "";
        this.v_out = "";
        this.p_out = "";
        this.m_out = "";
        this.active = true;

        this.t = millis();

        this.radius = sqrt(this.mass);
        this.width = this.radius * 2;
        this.height = this.radius * 2;

        this.dmg = 0;
    }


    left_most_edge() {
        let left_edge = this.pos.x - this.radius;
        return left_edge;
    }
    
    right_most_edge() {
        let right_edge = this.pos.x + this.radius;
        return right_edge;
    }

    top_most_edge() {
        let top_edge = this.pos.y - this.radius;
        return top_edge;
    }

    bottom_most_edge() {
        let bottom_edge = this.pos.y + this.radius;
        return bottom_edge;
    }

    hitBoxStart() {
        let rect_start = createVector(this.left_most_edge(), this.top_most_edge());

        return rect_start;
    }

    hitBoxEnd() {
        let rect_size = createVector(this.width, this.height);

        return rect_size;
    }

    fall(g) {
        let weight = p5.Vector.mult(g, this.mass);
        this.applyForce(weight);
    }

    drag(C) {
        let drag = this.vel.copy();
        drag.normalize();
        drag.mult(-1);
        let speedSq = this.vel.magSq();
        let A = this.width * 0.15;
        drag.setMag(C * speedSq * A)
        this.applyForce(drag);
    }

    applyForce(force, mass = this.mass) {
        let f = p5.Vector.div(force, mass);
        // console.log(this.name + " has a force of " + f + " being applied.")
        this.acc.add(f);
        // console.log(this.name + " is accelerating -- acc_x: " + this.acc.x + "  acc_y: " + this.acc.y);
    }

    edges() {
        if (this.pos.y > height - this.r) {
            this.pos.y = height - this.r;
            this.vel.y *= -1;
            this.active = false;
        }
    }

    move() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);

        this.a_out = "ACC(x: " + this.acc.x.toFixed(2) + " y: " + this.acc.y.toFixed(2) + ")\t";
        this.acc.set(0, 0);
    }

    text() {
        this.m_out = "MASS: " + this.mass + "\t";
        this.t_out = "T: " + ((millis() - this.t)/1000).toFixed(2) + "\t";
        this.v_out = "VEL(x: " + this.vel.x.toFixed(2) + " y: " + this.vel.y.toFixed(2) + ")\t";
        this.p_out = "POS(x: " + this.pos.x.toFixed(2) + " y: " + this.pos.y.toFixed(2) + ")\t";

        return (this.m_out + this.t_out + this.a_out + this.v_out + this.p_out);
    }

    draw(debug = false, verbose = false, text_y = 12) {
        let hue = map(this.pos.y, height, height-550, 0, 255, true);
        stroke(255-hue, hue, 255- hue/2);
        strokeWeight(2);
        fill(hue-hue/2, 0, 255-hue/2);
        circle(this.pos.x, this.pos.y, this.radius*2);

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

        if (verbose) {
            if (this.pos.y > height - 40) {fill(0);} else {fill(255, 0 ,0)}
            stroke(255);
            strokeWeight(1);
            textSize(12);
            text(this.text(), 40, text_y)
        }
    }

    damage(dmg) {
        this.dmg += dmg;
        console.log("Physical object has taken " + this.dmg + " damage.");
    }

    kill() {
        if(this.active) {this.death = millis();}
        this.active = false;
    }
}