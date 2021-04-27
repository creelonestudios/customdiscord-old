var token;
var clientWindow;
var client = new Discord.Client();
var cache;
var loaded = false;

function login() {
	client.login(decrypt(getSalt(), token))
	.catch((e) => {
		/*$("loadingtext").innerText = "Preparing...";
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
			$("loadingtext").innerText = "Applying changes...";
			setTimeout(function() {
				$("loadingtext").innerText = "I regret everything. Sry Jonas (:";
				location.reload();
			}, 500);
		};*/
		console.error("O_o Client couldnt login.", e);
		// tell client to show login dialogue
	});
}

function load() {
	if(!loaded) {
		loaded = true;
		if(token) {
			login();
		} else {
			openApp();
		}
	}
}

/*function getToken() {
	return token;
}*/

function setToken(t) {
	token = t;
	updateLocal("token", encrypt(getSalt(), t));
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

function getDCJSClient() {
	return client;
}

function getCache() {
	return cache || new ClientCache();
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

function openApp() {
	if(!clientWindow || clientWindow.closed) {
		clientWindow = window.open(chrome.extension.getURL("app/app.html"), "_blank", "menubar=0,width=1200,height=800,toolbar=0");
	} else {
		clientWindow.focus();
	}
}

function isAppOpen() {
	return clientWindow && !clientWindow.closed;
}

// this is just here due platform dependent issues
function loadMessageHistory() {
	if(isAppOpen()) clientWindow.loadMessageHistory();
}
function reloadChannelList() {
	if(isAppOpen()) clientWindow.reloadChannelList();
}