var token;
var settings;

loadSettings();
loadLocal("token");

/*var client = new Discord.Client();

client.login(token)
	.catch((e) => {
		/*
		$("loadingtext").innerText = "Preparing...";
		var loginpopup = new JSONPopup({
			title: "Login",
			submit: "Login",
			width: "100%",
			height: "100%",
			fields: [
				{type: 0, name: "Welcome to CustomDiscord."},
				{type: 1, name: "Enter your Token here: ", length: -1}
			]
		});
		PopupManager.setPopup(loginpopup);
		loginpopup.submit = function() {
			PopupManager.closePopup();
			console.log(this.fields[1].e.value);
			var token = this.fields[1].e.value;
			//var token = "NzMzNjgzNDAwMDY1Njc5Mzkw.XxcMmw._TGuo7UmQ-RJ4bs0ldlQt5_RDt8";
			//Cookie.set("token", token, {max_age: "infinite", path: "/"});
			//Cookie.set("ver", "1", {max_age: "infinite", path: "/"});
			//Cookie.set("theme", "theme-dark", {max_age: "infinite", path: "/"}); // DEBUG just to not burn my eyes
			//Cookie.set("new", "1", {max_age: "infinite", path: "/"});
			//Cookie.set("ver", "1");
			$("loadingtext").innerText = "Applying changes...";
			setTimeout(function() {
				$("loadingtext").innerText = "I regret everything. Sry Jonas (:";
				location.reload();
			}, 500);
		};

		console.error("O_o Client couldnt login.", e);
	});
*/

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
	});
}

function updateLocal(key, value) {
	var kv = {};
	kv[key] = value;
	chrome.storage.local.set(kv, function() {
		//console.log("Updated value:", kv);
	});
}

function getToken() {
	return token;
}

function setToken(t) {
	token = t;
	updateLocal("token", t);
}

function getSettings() {
	settings = fixSettings(settings);
	return settings;
}

function getSetting(key) {
	settings = fixSettings(settings);
	return settings[key];
}

function setSetting(key, value) {
	settings[key] = value;
	settings = fixSettings(settings);
}

function fixSettings(s) {
	if(!s) s = {};
	if(!s.theme) s.theme = "theme-dark";
	//if(!s.bla) s.bla = "";
	return s;
}

function getDiscordJS() {
	return Discord;
}

chrome.contextMenus.create({
	title: "Custom Discord",
	id: "top",
	type: "normal",
	contexts: ["page", "frame", "selection", "link", "editable", "image", "video", "audio", "page_action"],
	onclick: openApp
});

chrome.contextMenus.create({
	title: "Launch",
	id: "launch",
	type: "normal",
	contexts: ["browser_action"],
	onclick: openApp
});

chrome.runtime.onMessage.addListener(data => {
	if(data.type === 'notification') {
		chrome.notifications.create('', {
										  "title": data.name,
										  "message": data.content,
										  "iconUrl": "../img/icon_128.png",
										  "type": "basic",
										  "silent": true,
										  "contextMessage": "CustomDiscord"
										});
	}
});

function openApp() {
	window.open(chrome.extension.getURL("app/app.html"), "_blank", "menubar=0,width=1200,height=800,toolbar=0");
}
