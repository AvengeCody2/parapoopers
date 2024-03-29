class Parachute extends PhysicalObject{
    constructor(x, y, hp=15) {
        super(x, y, 1);
        this.name = "Parachute";

        this.deployed = true;
        this.width = 100;
        this.height = 20;
        this.area = this.width * this.height;

        this.HP = hp;
    }

    edges() {
        if (this.pos.y > height - 20) {
            this.active = false;
        }
    }

    move() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);

        this.a_out = "ACC(x: " + this.acc.x.toFixed(2) + " y: " + this.acc.y.toFixed(2) + ")\t";
        this.acc.set(0, 0);
    }

    hitBoxStart() {
        let rect_start = createVector(this.pos.x-this.width/2, this.pos.y - this.height);

        return rect_start;
    }

    hitBoxEnd() {
        let rect_size = createVector(this.width, this.height);

        return rect_size;
    }

    draw(debug = false, verbose = false, text_y = 12) {
        // cords
        stroke(5, 50, 0);
        strokeWeight(2);
        line(this.pos.x - (this.width/2 -4), this.pos.y, this.pos.x, this.pos.y+44);
        line(this.pos.x + (this.width/2 -4), this.pos.y, this.pos.x, this.pos.y+44);
        line(this.pos.x - (this.width/4), this.pos.y, this.pos.x, this.pos.y+44);
        line(this.pos.x + (this.width/4), this.pos.y, this.pos.x, this.pos.y+44);

        // chute
        fill(210);
        stroke(255);
        strokeWeight(1);
        arc(this.pos.x, this.pos.y, this.width, this.height*2, PI, 0, OPEN);

        //draw the hit box
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
            text(this.text(), 40, text_y)
        }
    }

    damage(dmg) {
        this.HP -= dmg;
        if (this.HP <= 0) {
            this.kill();
        }
    }
}