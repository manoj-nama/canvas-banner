'use strict';

(function() {

	//Initialize text fields
	var textField = document.getElementById("text"),
		colorField = document.getElementById("color"),
		strokeField = document.getElementById("stroke"),
		bg1Field = document.getElementById("bgColor1"),
		bg2Field = document.getElementById("bgColor2"),
		bgDirField = document.getElementById("dir"),
		btn = document.getElementById("submitBtn"),
		bannerFrame = document.getElementById("banner-frame"),
		finalUrl = document.getElementById("finalUrl");

	function prepareUrl() {
		var loc = window.location,
			search = "?",
			params = [],
			baseUrl = loc.protocol + "//" + loc.host;

		if(textField.value) {
			params.push("text=" + textField.value);
		}
		if(colorField.value) {
			params.push("color=" + colorField.value);
		}		
		if(strokeField.value) {
			params.push("stroke=" + strokeField.value);
		}		
		if(bgColor1.value) {
			params.push("bgColor1=" + bgColor1.value);
		}
		if(bgColor2.value) {
			params.push("bgColor2=" + bgColor2.value);
		}
		if(bgDirField.value) {
			params.push("bgDir=" + bgDirField.value);
		}

		return loc + "banner.html" + (params.length && search + params.join("&") || "");
	}

	//Event handlers
	function onSubmitClick(e) {
		var url;
		//stop default form submission
		e && e.preventDefault();

		url = prepareUrl();
		finalUrl.innerText = url;
		bannerFrame.src = url;
	}

	submitBtn.addEventListener("click", onSubmitClick, false);

	//Initialize
	onSubmitClick();

})();