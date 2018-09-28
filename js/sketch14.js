//Experiment1-Interactive Audio Visualizer
//Vijaei Posarajah
//An interactive audio visualizer on a website using p5.js, inspired by the concept of spring and the bloom of flowers
//found issues loating html page in chrome, using microsoft edge or firefox works
//refenced tutorial by: Yannis Yannakopoulos---https://tympanus.net/codrops/2018/03/06/creative-audio-visualizers/


var pieces, radius, fft, mapMouseX, mapMouseY, audio, toggleBtn, uploadBtn, uploadedAudio, uploadAnim;
var bgColor = "#eabf5b";
var bassColor = ["#ffffff", "#26a865"];
var midColor = "#000000";
var trembleColor = "#8c14d1";
var uploadLoading = false;
var img; 


// used to load initail song for visualizer, users can upload their own song at the bottom
function preload() {
	audio = loadSound("audio/DancinWithTheDevil-LindsayPerry.mp3");
}

// allows users to upload their own song to have visualized, allows interactivity
function uploaded(file) {
	uploadLoading = true;
	uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}

// used to pause and play song, and by default loop currently playing song
function uploadedAudioPlay(audioFile) {

	uploadLoading = false;

	if (audio.isPlaying()) {
		audio.pause();
	}

	audio = audioFile;
	audio.loop();
}

// setup used for play pause buttons, uploading track, mouse clicks, and canvas 
function setup() {

	img = loadImage("flower.jpg");

	uploadAnim = select('#uploading-animation');
	createCanvas(windowWidth, windowHeight);
	pieces = 30;
	radius = windowHeight / 4;

	toggleBtn = createButton("Play / Pause");

	uploadBtn = createFileInput(uploaded);

	uploadBtn.addClass("upload-btn");

	toggleBtn.addClass("toggle-btn");
	
	toggleBtn.mousePressed(toggleAudio);

	fft = new p5.FFT();
	audio.loop();
 

}


// visualizer divided into 3 rings with treble, mid, bass consisting of dots. bass also has rotating mouse interactive lines
function draw() {


	if (uploadLoading) {
		uploadAnim.addClass('is-visible');
	} else {
		uploadAnim.removeClass('is-visible');
	}

	background(bgColor);
	strokeWeight(1);

	fft.analyze();

	var bass = fft.getEnergy("bass");
	var treble = fft.getEnergy(50, 110);
	var mid = fft.getEnergy("mid");

	var mapMid = map(mid, 0, 255, -radius, radius);
	var scaleMid = map(mid, 0, 255, 1, 1.5);

	var mapTreble = map(treble, 0, 255, -radius / 2, radius * 2);
	var scaleTreble = map(treble, 0, 255, 0.5, 2);

	var mapbass = map(bass, 0, 255, 0, 200);
	var scalebass = map(bass, 0, 255, 0, 0.8);

	mapMouseX = map(mouseX, 0, width, 100, 200);
	mapMouseScale = map(mouseX, 0, width, 0.35, 0.2);
	mapMouseY = map(mouseY, 0, height, windowHeight / 4, windowHeight);

	pieces = 9;
	radius = 200;

	translate(windowWidth / 2, windowHeight / 2);

	for (i = 0; i < pieces; i += 1) {

		rotate(TWO_PI / pieces);

		noFill();


		// BASS  
		push();
		strokeWeight(50);
		stroke(bassColor[0]);
		scale(scalebass + mapMouseScale);
		rotate(-frameCount * 0.04);
		point(mapbass, radius / 2);
		stroke(bassColor[1]);
		strokeWeight(50);
		line(mapMouseX, mouseY, radius, radius);
		pop();



		// MID  
		push();
		stroke(midColor);
		strokeWeight(30);
		rotate(-frameCount * 0.01);
		point(mapMid, radius);
		pop();


		// TREMBLE 
		push();
		stroke(trembleColor);
		strokeWeight(8);
		scale(scaleTreble);
		rotate(frameCount * 0.01);
		point(-100, radius / 2);
		point(100, radius / 2);
		pop();

	}

image(img, 0, height/2, width/2);
}

// if statemment for pausing and resuming audio track
function toggleAudio() {
	if (audio.isPlaying()) {
		audio.pause();
	} else {
		audio.play();
	}
}

// used to resize visualizer accorinding to window size
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
