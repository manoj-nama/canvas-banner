'use strict';

/*
 * Text Animation Demo
 * ---------------------------------------------------------------------
 * Parameter description:
 * 1. (text)		: The static text to be displayed on the page
 * 2. (textColor)	: The color of text (default: white, value: Any valid css color)
 * 2. (bgColor1)	: Color 1 for the background gradient (default: green, value: Any valid css color)
 * 3. (bgColor2)	: Color 2 for the background gradient (default: yellow, value: Any valid css color)
 * 4. (bgDir)		: Which direction the background needs to move in (default: cw (clockwise), value: ['cw', 'acw' (anticlockwise)])
 * ---------------------------------------------------------------------
 */

(function () {
	// Initialize defaults
	var artBoard = document.getElementById("artboard"),
		bg = document.getElementById("bg"),
		text = "Please note the perspective property doesn't affect how the element is rendered",
		textArr = text.split(" "),
		words = [],
		bgHandler = null,
		artboardHandler = null,
		resizeDebouceTimer = null,
		bgCtx,
		bgGrad,
		lineHeight = 40,
		fontSize = 40,
		ctx,
		idx,
		metric,		
		WIDTH = artboard.width,
		HEIGHT = artboard.height,
		top = HEIGHT + 20,
		angle = 0;

	//Support detection
	if(!artBoard.getContext) {
		console.warn("Canvas not supported. ABORTING");
		return;
	}

	console.info("Browser supports Canvas API");
	ctx = artBoard.getContext("2d");
	bgCtx = bg.getContext("2d");

	bgGrad = bgCtx.createRadialGradient(0, 0, 6, 0, 6, 0);  
	bgGrad.addColorStop(0, "green");
	bgGrad.addColorStop(0.8, "yellow");
	bgCtx.fillStyle = bgGrad;
	ctx.font = fontSize + "px 'Fugaz One'";

	//Constructors
	function Word(val, w, fontSize, idx) {
		this.val = val;
		this.width = w;
		this.left = (WIDTH - w) / 2;
		this.top = (idx * fontSize) + 20;
		this.height = fontSize + 20;
	}

	//Draw methods
	function draw(hrTime) {
		var idx = 0,
			o;
			metric;
		
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		
		artboardHandler = requestAnimationFrame(draw);
		
		ctx.strokeStyle = "#fc0";
		ctx.lineWidth = 2;
		for (idx = 0; idx < words.length; idx++) {
			o = words[idx];
			ctx.strokeText(o.val, o.left, top + o.top);
			ctx.fillText(o.val, o.left, top + o.top);
		}
		
		if(top <= -((words.length-1) * (fontSize + 5))) {
			clearHandlers();
		} else {
			top -= 1;
		}
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
		angle += 0.05;
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
		words = [];
		ctx.font = fontSize + "px 'Fugaz One'";
		for (idx = 0; idx < textArr.length; idx++) {
			var txt = textArr[idx] && textArr[idx].toUpperCase() || "";
			metric = ctx.measureText(txt);
			words.push(new Word(txt, metric.width, fontSize, idx));
		}
		top = HEIGHT + 20;
		artboardHandler = requestAnimationFrame(draw);
		bgHandler = requestAnimationFrame(drawBg);
	}

	window.addEventListener("resize", onWindowResize, false);

	//Init
	init();

})();