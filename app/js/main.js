'use strict';

(function () {
	// Initialize defaults
	var artBoard = document.getElementById("artboard"),
		bg = document.getElementById("bg"),
		redrawBtn = document.getElementById("redrawBtn"),
		textField = document.getElementById("textVal"),
		value = "Default value",
		bgHandler = null,
		artboardHandler = null,
		resizeDebouceTimer = null,
		bgCtx,
		bgGrad,
		ctx,
		angle = 0,
		WIDTH = artboard.width,
		HEIGHT = artboard.height;

	//Support detection
	if(!artBoard.getContext) {
		console.log("Canvas not supported. ABORTING");
		return;
	}

	console.info("Browser supports Canvas API");
	ctx = artBoard.getContext("2d");
	bgCtx = bg.getContext("2d");

	bgGrad = bgCtx.createRadialGradient(0, 0, 6, 0, 6, 0);  
	bgGrad.addColorStop(0, "green");
	bgGrad.addColorStop(0.8, "yellow");
	bgCtx.fillStyle = bgGrad;

	//Draw methods
	function draw(hrTime) {
		ctx.clearRect(0, 0,WIDTH, HEIGHT);
		ctx.font = "60px Times New Roman";
		ctx.fillStyle = "Black";
		ctx.fillText(value, 10, 120);

		console.info("Canvas sized at", WIDTH + "x" + HEIGHT);
	}

	function drawBg(hrTime) {
		bgHandler = requestAnimationFrame(drawBg);

		bgCtx.rect(0, 0, 6, 6);

		bgCtx.save();
		bgCtx.translate(3, 3);  
		bgCtx.rotate(angle);
		bgCtx.fill();  
		bgCtx.restore();

		if(angle >= 360) {
			angle = 0;
		}
		angle += 0.01;
	}

	//Event Handlers
	function onWindowResize(e) {
		clearTimeout(resizeDebouceTimer);
		resizeDebouceTimer = setTimeout(function () {
			artboard.width = window.innerWidth;
			artboard.height = window.innerHeight;
			WIDTH = artboard.width,
			HEIGHT = artboard.height;
			init();
		}, 50);
	}

	function onRedrawBtnClicked(e) {
		e.preventDefault();
		value = textField.value;
		init();
	}

	function clearHandlers() {
		if(artboardHandler) {
			cancelAnimationFrame(artboardHandler);
		}
		if(bgHandler) {
			cancelAnimationFrame(bgHandler);
		}		
	}

	function init() {
		clearHandlers();
		artboardHandler = requestAnimationFrame(draw);
		bgHandler = requestAnimationFrame(drawBg);
	}

	window.addEventListener("resize", onWindowResize, false);
	redrawBtn.addEventListener("click", onRedrawBtnClicked, false);

	//Init
	init();

})();