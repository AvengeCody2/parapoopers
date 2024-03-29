class Plane extends PhysicalObject{
    #thrust;
    #lift;

    constructor (x, y, mass=100, hp = 1500) {
        super(x, y, mass);
        this.vel.x = 5;
        this.name = 'Plane';
        this.HP = hp;
        this.#thrust = createVector(0.05, 0);
        this.#lift = createVector(0, -0.2);
        this.alive = true;
        this.death = null;

        this.width = 280;
        this.height = 50;
    }

    get thrust() {
        return this.#thrust;
    }

    set thrust(f) {
        if (typeof(f) === "number") {
            this.#thrust.set(f, 0);
        } else if (f.toString().includes("p5.Vector")) {
            this.#thrust = f.copy();
        }
    }

    get lift() {
        return this.#lift;
    }

    set lift(f) {
        if (typeof(f) === "number") {
            this.#thrust.set(0, f);
        } else if (f.toString().includes("p5.Vector")) {
            this.#lift = f.copy();
        }
    }

    fall(g) {
        let f = p5.Vector.add(g, this.lift);
        let weight = p5.Vector.mult(f, this.mass);
        this.applyForce(weight);

        if (this.alive) {
            this.applyForce(this.thrust);
        }
    }

    drag(C) {
        null;
    }

    edges() {
        if(this.pos.x > width + 300) {
            this.active = false;
        } else if (this.pos.x < width) {
            //be dropping troops
        } else if (this.pos.y > height - 40) {
            //this plane crashed
        }
    }

    // move() {
    //     this.vel.add(this.acc);
    //     this.pos.add(this.vel);
    // }

    hitBoxStart() {
        let rect_start = createVector(this.pos.x - this.width/2, this.pos.y - this.height/2);

        return rect_start;
    }

    hitBoxEnd() {
        let rect_size = createVector(this.width, this.height);

        return rect_size;
    }
    
    hit() {
        //When the plane takes damage, it's thrust and lift should be impacted
    }


    draw(debug = true, verbose = false, text_y = 12) {
        // let x = this.pos.x;
        // let y = this.pos.y;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());

        rectMode(CENTER);
        angleMode(RADIANS);
        noStroke();
        strokeWeight(1);
        // stroke(255);
        fill(51, 0, 0);
        rect(0-5, 0, 150, 40);
        arc(0+90, 0-10, 60, 40, PI, PI/4, CHORD);
        arc(0+70, 0, 140, 40, -PI/2, PI/2, PIE);
        
        //tail
        beginShape();
        vertex(0-80, 0+20);
        vertex(0-140, 0);
        vertex(0-160, 0-60);
        vertex(0-130, 0-60);
        vertex(0-100, 0-15);
        vertex(0-80, 0-20);
        endShape(CLOSE);
        
        //wing
        stroke(121, 80, 80);
        beginShape();
        vertex(0+50, 0+10);
        vertex(0-40, 0+40);
        vertex(0-80, 0+40);
        vertex(0-20, 0+10);
        endShape();
        
        //cockpit
        fill(0);
        beginShape();
        vertex(0+100, 0-23);
        vertex(0+108, 0-23);
        vertex(0+113, 0-18);
        vertex(0+102, 0-18);
        endShape(CLOSE);

        pop();

        if (debug === true) {
            push();
            rectMode(CORNER);
            stroke(220, 255, 0);
            strokeWeight(3);
            point(this.pos);
            strokeWeight(1);
            noFill();
            rect(this.hitBoxStart().x, this.hitBoxStart().y, this.hitBoxEnd().x, this.hitBoxEnd().y);
            pop();
        }

        if (verbose) {
            fill(0);
            stroke(255);
            strokeWeight(1);
            textSize(12);
            text(this.text(), 40, text_y);
            console.log(this.text());
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
            this.vel.x = 3;
            this.lift = 0;
        }
        this.alive = false;
    }
}


class ParapooperPlane extends Plane {
    constructor(x, y, mass=100, hp=100) {
        super(x, y, mass, hp);
        this.drop_x = 192;
        this.poopers = [];
        this.load_up();
    }

    load_up(){
        for(let i = 64; i < this.width; i += this.drop_x) {
            this.poopers.push(new Enemy(i, this.pos.y));
        }
    }

    edges() {
        if(this.pos.x > width + 300) {
            this.active = false;
        } else if (this.pos.x < width && this.alive === true) {
            //be dropping troops
            this.parapoop()
        } else if (this.pos.y > height - 40) {
            //this plane crashed
        }
    }

    parapoop() {
        if (this.pos.x >= this.drop_x) {
            dropEnemy(this.pos.x - 150, this.pos.y);
            this.drop_x += 192;
        }
    }

}