class Menu_Button {
    constructor (text, x, y, w = 150, h = 50) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.stx = this.x - this.w/2,
        this.sty = this.y - this.h/2;

        this.text = text;

        this.col = color(76, 20, 0);

        this.hovering = false;
    }

    hover() {
        // if (mouseX >= this.x- this.w &&
        //     mouseX <= this.x + this.w &&
        //     mouseY >= this.y - this.h &&
        //     mouseY <= this.y + this.h) {
        //         //mouse is inside button edges
        //         this.hovering = true;
        //     } else {
        //         this.hovering = false;
        //     }
            
        this.hovering = collidePointRect(mouseX, mouseY, this.stx, this.sty, this.w, this.h);
        return this.hovering;
    }

    draw() {
        rectMode(CORNER);
        if (this.hover()) {
            this.col.setRed(89);
        } else {
            this.col.setRed(76);
        }
        fill(this.col);
        rect(this.stx, this.sty, this.w, this.h, 15);

        textAlign(CENTER, CENTER);
        fill(255);
        textFont(Nosifer);
        let font_size = this.h*0.75;
        textSize(font_size);
        text(this.text, this.x, this.y-font_size/2+4);
    }
}