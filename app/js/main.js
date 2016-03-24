'use strict';

(function () {
	// Initialize defaults
	var artBoard = document.getElementById("artboard"),
		redrawBtn = document.getElementById("redrawBtn"),
		textField = document.getElementById("textVal"),
		value = "Default value",
		resizeDebouceTimer = null,
		ctx,
		WIDTH = artboard.width,
		HEIGHT = artboard.height;

	//Support detection
	if(!artBoard.getContext) {
		console.log("Canvas not supported. ABORTING");
		return;
	}

	console.info("Borwser supports Canvas API");
	ctx = artBoard.getContext("2d");

	//Draw methods
	function draw() {
		ctx.clearRect(0, 0,WIDTH, HEIGHT);
		ctx.font = "60px Times New Roman";
		ctx.fillStyle = "Black";
		ctx.fillText(value, 10, 120);

		console.info("Canvas sized at", WIDTH + "x" + HEIGHT);
	}

	//Event Handlers
	function onWindowResize(e) {
		clearTimeout(resizeDebouceTimer);
		resizeDebouceTimer = setTimeout(function () {
			artboard.width = window.innerWidth;
			artboard.height = window.innerHeight;
			WIDTH = artboard.width,
			HEIGHT = artboard.height;
			requestAnimationFrame(draw);
		}, 50);
	}

	function onRedrawBtnClicked(e) {
		e.preventDefault();
		value = textField.value;
		requestAnimationFrame(draw);
	}

	window.addEventListener("resize", onWindowResize, false);
	redrawBtn.addEventListener("click", onRedrawBtnClicked, false);

	//Init
	onWindowResize();

})();