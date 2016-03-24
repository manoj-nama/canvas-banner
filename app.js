var express = require("express"),
	app = express();

app.use(express.static("./app"));

app.listen(3000, "0.0.0.0", function () {
	console.log("Server listening on port 3000");
});