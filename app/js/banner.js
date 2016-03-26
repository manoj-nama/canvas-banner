'use strict';

/*
 * Text Animation Demo
 * ---------------------------------------------------------------------
 * Parameter description:
 * 1. (text)		: The static text to be displayed on the page
 * 2. (color)		: The color of text (default: black, value: Any valid css color)
 * 3. (stroke)		: The color of text stroke (default: yellow, value: Any valid css color)
 * 4. (bgColor1)	: Color 1 for the background gradient (default: green, value: Any valid css color)
 * 5. (bgColor2)	: Color 2 for the background gradient (default: yellow, value: Any valid css color)
 * 6. (bgDir)		: Which direction the background needs to move in (default: cw (clockwise), value: ['cw', 'acw' (anticlockwise)])
 * ---------------------------------------------------------------------
 */

function loadExternalCSS(url, callback) {
	var link = document.createElement('link'),
		img = document.createElement('img');

	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = url;

	document.getElementsByTagName('head')[0].appendChild(link);
    
	img.onerror = function(){
	   if(callback) callback(link);
	}
	img.onload = function() {
		// console.log("Image has loaded");
	}
	img.src = url;	
} 

function parseUrl() {
	var params = {};

	params.text = getQueryStringValue("text");
	params.color = getQueryStringValue("color");
	params.stroke = getQueryStringValue("stroke");
	params.bgColor1 = getQueryStringValue("bgColor1");
	params.bgColor2 = getQueryStringValue("bgColor2");
	params.bgDir = getQueryStringValue("bgDir");

	return params;
} 

function getParamsDTO(params) {
	var defaults = {
		text: "Please note the perspective property doesn't affect how the element is rendered",
		color: "black",
		stroke: "#fc0",
		bgColor1: "green",
		bgColor2: "yellow",
		bgDir: "cw"
	};

	defaults.text = params.text || defaults.text;
	defaults.textColor = params.color || defaults.color;
	defaults.textStroke = params.stroke || defaults.stroke;
	defaults.bgColor1 = params.bgColor1 || defaults.bgColor1;
	defaults.bgColor2 = params.bgColor2 || defaults.bgColor2;
	defaults.bgDir = params.bgDir && ["cw", "acw"].indexOf(params.bgDir.toLowerCase() !== -1) && params.bgDir || defaults.bgDir;

	return defaults;
}

function getQueryStringValue (key) {
   return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function render(params) {
	// Initialize defaults
	var artBoard = document.getElementById("artboard"),
		bg = document.getElementById("bg"),
		text = params.text,
		textColor = params.textColor,
		textStroke = params.textStroke,
		bgColor1 = params.bgColor1,
		bgColor2 = params.bgColor2,
		bgDir = params.bgDir,
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

	// console.info("Browser supports Canvas API");
	ctx = artBoard.getContext("2d");
	bgCtx = bg.getContext("2d");

	bgGrad = bgCtx.createRadialGradient(0, 0, 6, 0, 6, 0);  
	bgGrad.addColorStop(0, bgColor1);
	bgGrad.addColorStop(0.8, bgColor2);
	bgCtx.fillStyle = bgGrad;

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
		
		ctx.strokeStyle = textStroke;
		ctx.fillStyle = textColor;
		ctx.lineWidth = 2;
		for (idx = 0; idx < words.length; idx++) {
			o = words[idx];
			ctx.strokeText(o.val, o.left, top + o.top);
			ctx.fillText(o.val, o.left, top + o.top);
		}
		
		if(top <= -((words.length-1) * (fontSize + 20))) {
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

		if(bgDir === "cw") {
			angle += 0.02;
			if(angle >= 360) {
				angle = 0;
			}
		} else {
			angle -= 0.02;
			if(angle <= 0) {
				angle = 360;
			}
		}
		
	}

	//Event Handlers
	function onWindowResize(e) {
		clearTimeout(resizeDebouceTimer);
		resizeDebouceTimer = setTimeout(init, 50);
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
		artboard.width = window.innerWidth;
		artboard.height = window.innerHeight;
		WIDTH = artboard.width,
		HEIGHT = artboard.height;

		clearHandlers();
		words = [];
		ctx.font = fontSize + "px 'Fugaz One'";

		//Initialize the words
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
}


//Initialize viewport when the custom font file has loaded
loadExternalCSS("https://fonts.googleapis.com/css?family=Fugaz+One", function() {
	render(getParamsDTO(parseUrl()));
});