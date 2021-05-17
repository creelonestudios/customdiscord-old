var settings;

loadSettings();
loadLocal("token");

chrome.storage.onChanged.addListener(function(changes, areaName) {
	if(areaName == "sync" && changes.settings) {
		settings = fixSettings(changes.settings.newValue);
	} else if(changes.token) {
		token = changes.token.newValue;
	} else {
		// local settings
	}
});

function loadSettings() {
	chrome.storage.sync.get("settings", function(res) {
		settings = fixSettings(res.settings);
	});
}

function updateSettings() {
	chrome.storage.sync.set({settings: settings}, function() {
		//console.log("Updated value:", kv);
	});
}

function loadLocal(key) {
	chrome.storage.local.get(key, function(res) {
		if(res.token) {
			token = res.token;
		}
		load();
	});
}

function updateLocal(key, value) {
	var kv = {};
	kv[key] = value;
	chrome.storage.local.set(kv, function() {
		//console.log("Updated value:", kv);
	});
}

// deprecated. since 2021-04-26 19:08
chrome.runtime.onMessage.addListener(data => {
	if(data.type === 'notification') {
		// moved
	} else if(data.type == "popup") {
		window.open(data.url, "_blank", "menubar=1,width=" + data.width + ",height=" + data.height + ",toolbar:1")
		/*chrome.windows.create({
			url: data.url,
			type: "normal",
			width: data.width,
			height: data.height
		}, function(win) {
			//console.log(win)
		});*/
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
	openApp();
});