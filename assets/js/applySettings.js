const settings = require("../../src/settings");

// Retrieve last save location used and set it as current save location
const lastLocation = settings.get("saveLocation");
if (lastLocation) document.getElementById("saveLocationLabel").innerText = `Selected: ${lastLocation}`;