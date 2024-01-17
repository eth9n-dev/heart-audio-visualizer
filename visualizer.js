var song;
var fft;
var particles = [];
var positions = [];
var message = 'I LOVE YOU SOPHIA';

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function preload() {
    song = loadSound('imgod.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    fft = new p5.FFT();
}

function keyPressed() {
    if (keyCode === 49) {
        song.jump(130);
    }
    else if (keyCode === 50) {
        song.jump(339);
    }
    else if (keyCode === 51) {
        song.jump(579);
    }
    else if (keyCode === 52) {
        song.jump(742);
    }
    else if (keyCode === 53) {
        song.jump(973);
    }
    else if (keyCode === 54) {
        song.jump(1184);
    }
    else if (keyCode === 48) {
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

    push()
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

    beginShape();
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

    if (amp > 100) {
        var randomPos = positions[randomIntFromInterval(0, 250)];
        var p = new Particle(randomPos);
        particles.push(p);
    }
    

    for (var i = particles.length - 1; i >= 0; i--) {
        if (!particles[i].edges()) {
            particles[i].update(amp > 150);
            particles[i].show();
        }
        else {
            particles.splice(i, 1);
        }
    }

    if (song.currentTime() >= song.duration() - 6) {
        message = 'WILL YOU BE MY \nVALENTINE?';
    }
    else {
        message = 'I LOVE YOU SOPHIA';
    }

    print(song.currentTime(), song.duration());
}

function mouseClicked() {
    if (song.isPlaying()) {
        song.pause();
    }
    else {
        song.play();
    }
}

class Particle {
    
    constructor(vec) {
        this.pos = createVector(vec.x, vec.y);
        this.vel = createVector(0, 0);
        this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
        this.w = random(3, 5);
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

    edges() {
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
        ellipse(this.pos.x, this.pos.y, this.w);
    }
}