// var sprinkleColors = ["#ee31b7", "#eded6b", "#5554c7", "#0598dd", "#fa7c43", "#c9274e", "#118f74"];
var sprinkleColors = ["#ff2272", "#ffeb5e", "#4cab7b", "#a94bb9", "#00bcd4", "#ff6b50", "#11b4f5", "#0dfdf9"];
var mouseX = 0;
var mouseY = 0;
var prevMouseX = 0;
var prevMouseY = 0;

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

c.width  = window.innerWidth;
c.height = window.innerHeight;

onmousemove = function(event){
	mouseX = event.clientX;
	mouseY = event.clientY;
}

document.body.addEventListener('touchmove', function(event){
	event.preventDefault();
	mouseX = event.touches[0].pageX;
	mouseY = event.touches[0].pageY;
})

document.body.addEventListener('touchstart', function(event){
	mouseX = event.touches[0].pageX;
	mouseY = event.touches[0].pageY;
	prevMouseX = mouseX;
	prevMouseY = mouseY;
})

function drawGrid(time){
	time /= 1000;
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.lineWidth = 2.5;
	ctx.lineCap = "round";
	for (i = 0; i < sprinkleColors.length; i++) {
		currentColor = sprinkleColors[i];
		ctx.beginPath();
		ctx.strokeStyle = currentColor;
		for (x = 0; x < c.width; x+=20) {
			for (y = 0; y < c.height; y+=20) {
				var color = pickSprinkleColor(x * 5, y * 5);
				if (color == currentColor) {
				drawSprinkle(10 + x, 20 + y, time, ctx);
				}
			}
		}
		ctx.stroke();
	}

	var mouseSpeedX = mouseX - prevMouseX;
	var mouseSpeedY = mouseY - prevMouseY;
	prevMouseX = mouseX;
	prevMouseY = mouseY;
	window.requestAnimationFrame(drawGrid);
}

function drawSprinkle(x, y, time, ctx) {
	var noiseX = noise.simplex2((x - mouseX) / 500 + time / 10, (y - mouseY) / 500 - .17);
	var noiseY = noise.simplex2((x - mouseX) / 500 + 50 + time / 10, (y - mouseY) / 500 - .17);
	length = Math.sqrt((noiseX * noiseX) + (noiseY * noiseY));
	noiseX = noiseX / length;
	noiseY = noiseY / length;
	capsuleVectorX = noiseX * 10;
	capsuleVectorY = noiseY * 10;

	ctx.moveTo(x, y);
	ctx.lineTo(x + capsuleVectorX, y + capsuleVectorY);
}
function pickSprinkleColor(x, y) {
	var colorIndex = Math.abs(noise.simplex2(x, y)) * sprinkleColors.length;
	colorIndex = Math.floor(colorIndex);
	return sprinkleColors[colorIndex];
}

drawGrid(0);
