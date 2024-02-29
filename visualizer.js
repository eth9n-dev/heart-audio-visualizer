var song;
var fft;
var particles = [];
var positions = []; // particle origin positions
var message = 'I LOVE YOU'; // message default

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function preload() { // preload song
    song = loadSound('imgod.mp3');
}

function setup() { // waveform analysis + canvas creation
    createCanvas(windowWidth, windowHeight);
    fft = new p5.FFT();
}

function windowResized() { // resize canvas if window size is changed
    resizeCanvas(windowWidth, windowHeight); 
}

function keyPressed() {
    if (keyCode === 49) { // 1
        song.jump(130);
    }
    else if (keyCode === 50) { // 2
        song.jump(339);
    }
    else if (keyCode === 51) { // 3
        song.jump(579);
    }
    else if (keyCode === 52) { // 4
        song.jump(742);
    }
    else if (keyCode === 53) { // 5
        song.jump(973);
    }
    else if (keyCode === 54) { // 6
        song.jump(1184);
    }
    else if (keyCode === 48) { // 0
        song.jump(0);
    }
}

function draw() {
    background(0);
    stroke(255, 0, 0);
    noFill();
    translate(width / 2, height / 2);

    fft.analyze();
    amp = fft.getEnergy(20, 200);

    push() // draw text + shake animation
    if (amp > 100) {
        rotate(random(-0.03, 0.03));
        textSize(26);
    }
    else {
        textSize(25);
    }
    textAlign(CENTER)
    text(message, 0, 0);
    pop()

    var wave = fft.waveform();

    beginShape(); // draw heart
    drawingContext.shadowBlur = 32; // add neon effect
    drawingContext.shadowColor = color(255, 0, 0);
    for (var i = 0; i < 25; i += .1) {
        var index = floor(map(i, 0, width, 0, wave.length));
        var r = map(wave[index], -1, 1, 10, 13);
        var x = r * 16 * pow(sin(i), 3);
        var y = -r * (13 * cos(i) - 5 * cos(2 * i) - 2 * cos(3 * i) - cos(4 * i));
        vertex(x, y);

        if (positions.length <= 250) {
            positions.push(new p5.Vector(x, y))
        }
    }
    endShape();

    if (amp > 100) { // if amp is high enough, create particles
        var randomPos = positions[randomIntFromInterval(0, 250)];
        var p = new Particle(randomPos);
        particles.push(p);
    }
    

    for (var i = particles.length - 1; i >= 0; i--) { // iterate through our particles
        if (!particles[i].edges()) { // if not off screen
            particles[i].update(amp > 150); // add velocity if amp is high
            particles[i].show();
        }
        else {
            particles.splice(i, 1); // remove particle
        }
    }

    if (song.currentTime() >= song.duration() - 6) { // change text before song ends
        message = 'WILL YOU BE MY \nVALENTINE?';
    }
    else {
        message = 'I LOVE YOU SOPHIA';
    }
}

function mouseClicked() { // play/pause functionality
    if (song.isPlaying()) {
        song.pause();
    }
    else {
        song.play();
    }
}

class Particle {
    
    constructor(vec) {
        this.pos = createVector(vec.x, vec.y); // position
        this.vel = createVector(0, 0); // velocity
        this.acc = this.pos.copy().mult(random(0.0001, 0.00001)); // acceleration
        this.w = random(3, 5); // width
    }
    
    update(cond) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        
        if (cond) {
            this.pos.add(this.vel);
            this.pos.add(this.vel);
            this.pos.add(this.vel);
        }
    }

    edges() { // edge of canvas check
        if (this.pos.x < -width / 2 || this.pos.x > width / 2 ||
        this.pos.y < -height / 2 || this.pos.y > width / 2) {
            return true;
        }
        else {
            return false;
        }
    }

    show() {
        noStroke();
        fill(255, 0, 0);
        drawingContext.shadowBlur = 32;
        drawingContext.shadowColor = color(255, 0, 0);
        ellipse(this.pos.x, this.pos.y, this.w);
    }
}
