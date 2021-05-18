var guilds = [];
var blockedusers = [];
var addonnames = [];
var addons = [];
var wl_tags = ["i", "/i", "b", "/b", "text", "/text", "h2", "/h2", "h3", "/h3", "h4", "/h4", "h5", "/h5", "strike", "/strike", "u", "/u", "p", "/p", "code", "/code"];
var themes = [];
var typing = false;
var loadDone = false;
var statemanager;

/*function setStatus() {
	var popup = new JSONPopup({
		title: "Status",
		submit: "OK",
		fields: [
			{type: 0, name: "Setze deinen Status."},
			{type: 1, name: "Text", length: -1}
		]
	});
	PopupManager.setPopup(popup);
	popup.submit = function() {
		PopupManager.closePopup();
		// this.fields[1].e.value;
		client.user.setPresence({
			status: 'online',
			activity: {
				name: this.fields[1].e.value,
				type: "PLAYING"
			}
		});
		setTimeout(function() {
			updateUserRegion();
		}, 100);
	};
}*/

function setStatus() {
	var popup = new JSONPopup({
		title: "Change Status",
		submit: "OK",
		fields: [
			{type: 1, name: "Name: ", length: -1},
			{type: 4, name: "Typ: ", options: ["PLAYING", "STREAMING", "WATCHING", "LISTENING"]},
			{type: 1, name: "URL: ", length: -1},
			{type: 4, name: "Onlinestatus: ", options: ["online", "dnd", "idle", "invisible"]}
		]
	});
	PopupManager.setPopup(popup);
	popup.submit = function() {
		PopupManager.closePopup();
		if(this.fields[1].e.value == "STREAMING") {
			client.user.setPresence({
				status: this.fields[3].e.value,
				activity: {
					name: this.fields[0].e.value,
					type: this.fields[1].e.value,
					url: this.fields[2].e.value
				}
			});
		} else {
			client.user.setPresence({
				status: this.fields[3].e.value,
				activity: {
					name: this.fields[0].e.value,
					type: this.fields[1].e.value
				}
			});
		}
		setTimeout(function() {
			updateUserRegion();
		}, 100);
	};
}

function sendMsg() {
	$("typing").innerHTML = "";
	var channel = client.channels.cache.get(cache.currentChannel.id); // uff das war eig. so ez fix xD
	//if(!channel) channel = client.users.cache.get($("channelid").value); // for DMs
	/*if(!channel) {
		$("channelid").value = "Invalid Channel/User ID";
		return;
	}*/
	/*if($("inputbox-inner").value.startsWith("/embed") && channel) {
		channel.send(embed($("inputbox-inner").value.split(" ")[1], $("inputbox-inner").value.split(" ")[2], "success", $("inputbox-inner").value.split(" ")[3]));
		$("inputbox-inner").value = "";
		return;
	}*/
	if($("inputbox-inner").innerText && channel) channel.send(parseMsg($("inputbox-inner").innerText)).catch(error => {
		if(error.message == "Missing Permissions")  {
			errorPopup("Missing Permissions");
		}
	});
	for(var i = 0; i < addons.length; i++) {
		if(addons[i].onmsg) addons[i].onmsg($("inputbox-inner").innerText);
	}
}

function loadMessageHistory() {
	$("typing").innerText = "";
	var guild = cache.getGuild(cache.current);
	var channel = client.channels.cache.get(guild.current);
	var guild = channel.guild;
	if(!channel) return;
	if(channel.type == "text" || channel.type == "voice") {
		console.log(channel.permissionsFor(guild.me).toArray());
		while($("chat-history").children.length > 0) {
			$("chat-history").removeChild($("chat-history").children[0]);
		}
		if(channel.viewable && channel.permissionsFor(guild.me).has("VIEW_CHANNEL") && channel.permissionsFor(guild.me).has("READ_MESSAGE_HISTORY")) {
			if(channel.type == "text") {
				channel.messages.fetch(20)
					.then(msgs => {
						var history = msgs.array();
						for(var i = history.length - 1; i >= 0; i--) {
							$("chat-history").appendChild(createMessageDiv(history[i]))
						}
						$("chat-history").children[$("chat-history").children.length-1].scrollIntoViewIfNeeded();
					})
					.catch(error => console.log("Could not load message history: " + error));
			} else if(channel.type == "voice") {
				$("chat-history").appendChild(createMessageDiv("Voice Channel view work in progress..."))
			}
		} else {
			if(channel.type == "text") {
				$("chat-history").appendChild(createMessageDiv("You can't read the message history of this channel."));
			} else {
				$("chat-history").appendChild(createMessageDiv("You can't view this channel!"));
			}
		}
		/*
		for(var i = 0; i < addons.length; i++) {
			if(addons[i].onchannelswitched) addons[i].onchannelswitched();
		}*/
		$("inputbox-inner").focus();
		if(!guild) {
			$("inputbox-placeholder").innerText = "Guild error.";
			$("inputbox-inner").disabled = true;
			errorPopup("Guild error: not guild"); // speech 100
		} else if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
			$("inputbox-placeholder").innerText = "Send messages to #" + channel.name;
			$("inputbox-inner").disabled = false;
		} else {
			$("inputbox-placeholder").innerText = "You don't have permissions to write in this channel.";
			$("inputbox-inner").disabled = true;
		}
	}
}

function reloadGuildList() {
	var guildsDiv = $("guild-list");
	var guilds = cache.guilds.values();
	var guild = guilds.next();
	while(!guild.done) {
		console.log(guild);
		guild.value.validate();
		guildsDiv.appendChild(guild.value.e);
		guild = guilds.next();
	}
}

function reloadChannelList() {
	var channelsDiv = $("channel-list");
	var guild = cache.getGuild(cache.current);
	console.log(guild);
	while(channelsDiv.firstChild) channelsDiv.removeChild(channelsDiv.lastChild);
	channelsDiv.appendChild(guild.channellist);
}

function updateUserRegion() {
	$("user-region-name").innerText = client.user.tag;
	$("user-region-avatar").style.backgroundImage = "url('" + client.user.displayAvatarURL() + "')";
	var status = "CustomDiscord";
	var prefix = "\u2753"; // question mark
	if(client.user.presence.activities[0]) {
		status = client.user.presence.activities[0].name;
		if(client.user.presence.activities[0].type == "PLAYING") prefix = "\u{1F3AE}"; // game controller
		if(client.user.presence.activities[0].type == "WATCHING") prefix = "\u{1F5A5}"; // monitor
		if(client.user.presence.activities[0].type == "LISTENING") prefix = "\u{1F3A7}"; // headphones
		if(client.user.presence.activities[0].type == "STREAMING") prefix = "\u{1F3A5}"; // video camera
	}
	$("user-region-status").innerText = prefix + "\u00A0" + status.replaceAll(" ", "\u00A0"); // replaces spaces with no-break-spaces
}

window.addEventListener("DOMContentLoaded", () => {
	statemanager = new StateManager();
	$("inputbox-inner").addEventListener('keydown', function (e){
		if($("inputbox-inner").value == "") {
			typing = false;
			return;
		} else {
			var channel = client.channels.cache.get(cache.currentChannel.id);
			if(channel.type == "text") {
				//channel.startTyping();
			}
		}
	});
	/*addonnames = bg.get("addons").split(", ");*/
	//console.log(addonnames);
		
	$("client").addEventListener("keydown", (event) => {
		if(!event.ctrlKey) {
			$("inputbox-inner").focus();
			// thx to Andy Raddaz on Stackoverflow: https://stackoverflow.com/questions/511088/use-javascript-to-place-cursor-at-end-of-text-in-text-input-element
			if(typeof $("inputbox-inner").selectionStart == "number") {
				$("inputbox-inner").selectionStart = $("inputbox-inner").selectionEnd = $("inputbox-inner").value.length;
			} else if(typeof $("inputbox-inner").createTextRange != "undefined") {           
				var range = $("inputbox-inner").createTextRange();
				range.collapse(false);
				range.select();
			}
		}
		console.log("keydown on client");
	});
	
	$("inputbox-inner").addEventListener("keydown", function(event) { // to make sure \n isnt at the end
	  	if(event.keyCode === 13 && !event.shiftKey) {
			event.preventDefault();
		}
	});
	
	$("inputbox").addEventListener("keyup", function(event) {
		var msg = $("inputbox-inner").innerText;
	  	if(event.keyCode === 13 && !event.shiftKey) {
			if(msg.startsWith("/embed")) {
				var embedpopup = new JSONPopup({
					title: "Embed erstellen",
					submit: "Senden",
					fields: [
						{type: 0, name: "Erstelle dein Embed."},
						{type: 1, name: "Titel: ", length: -1},
						{type: 1, name: "Beschreibung: ", length: -1},
						{type: 1, name: "Footer", length: -1}
					]
				});
				PopupManager.setPopup(embedpopup);
				embedpopup.submit = function() {
					PopupManager.closePopup();
					var title = this.fields[1].e.value || "Kein Titel";
					var desc = this.fields[2].e.value || "Keine Beschreibung";
					var footer = this.fields[3].e.value;
					if(!footer) {
						footer = "Kein Footer | CustomDiscord";
					} else {
						footer = footer + " | CustomDiscord";
					}
					var channel = client.channels.cache.get(current_channel);
					channel.send(embed(title, desc, "RANDOM", footer));
				};
				return;
			} else if(msg.startsWith("/error ") && msg.length > 7) {
				msg = msg.slice(7); errorPopup("Manually triggered error: " + msg);
			} else {
				sendMsg();
			}
			$("inputbox-inner").innerText = "";
		}
		msg = $("inputbox-inner").innerText;
		//$("inputbox-a").innerText = "#" + msg + "#";
		//$("inputbox-inner").style.height = $("inputbox-a").clientHeight + 5;
		
		// msg preview
		if(msg.trim()) {
			$("inputbox-placeholder").style.display = "none";
			if(/`|\*|~|_|<|>|@|#|:/.test(msg) || msg.startsWith("/")) {
				$("previewbox-inner").innerHTML = unparseMsg(parseMsg(msg), client.guilds.cache.get(cache.current));
				$("previewbox").style.display = "block";
			} else {
				$("previewbox").style.display = "none";
			}
		} else {
			$("inputbox-placeholder").style.display = "block";
			$("previewbox").style.display = "none";
		}
	});
	
	/*$("btnstatuschange").addEventListener("click", function(event) {
		//setStatus();
	});*/
	
	$("user-region-settings").addEventListener("click", event => {
		/*var popup = new JSONPopup({
			title: "Settings",
			submit: "Save",
			fields: [
				{type: 0, name: "Willkommen in den Benutzereinstellungen."},
				{type: 5, name: "Status", action: "setStatus"},
				{type: 4, name: "Theme: ", options: ["theme-dark", "theme-default"], default: bg.getSetting("theme")}
			]
		});
		popup.submit = () => {
			bg.setSetting("theme", popup.fields[2].e.value);
			setTheme(popup.fields[2].e.value);
		}
		PopupManager.setPopup(popup);*/
		statemanager.state = "settings";
		console.log("lolp");
	});
	$("user-region-settings").title = "Benutzereinstellungen";
	$("user-region-name").addEventListener("click", () => {
		const name = $("user-region-name").innerText;
		copyToClipboard(name);
		$("user-region-name").innerText = "Copied!";
		setTimeout(() => {
			$("user-region-name").innerText = name;
		}, 1500);
	});
	$("user-region-status").addEventListener("click", setStatus);
	
	PopupManager.init();
	updateUserRegion();
	
	setTheme(bg.getSetting("theme") || "theme-default");
});

function onLoaded() {
	loadDone = true;
	/*PopupManager.setPopup(new JSONPopup({
		title: "Popup-Titel",
		submit: "CLICK ME",
		fields: [
			{type: 0, name: "Description"},
			{type: 1, name: "String", length: -1},
			{type: 2, name: "Number", min: 0, max: 10},
			{type: 3, name: "Boolean"},
			{type: 1, name: "List (String)", length: -1, list: {length: 2, max: 5}},
			{type: 2, name: "List (Number)", min: 0, max: 10, list: {length: 2, max: 5}},
			{type: 3, name: "List (Boolean)", list: {length: 3, names: ["1", "2", "3"]}},
			{type: 3, name: "Radio", list: {length: 4, names: ["A", "B", "C"], radio: true}}
		]
	}));*/
	statemanager.state = "main";
	reloadGuildList();
	reloadChannelList();
	loadMessageHistory();
	updateUserRegion();
	console.log("Loaded CustomDC!");
}

function errorPopup(message) {
	var popup = new Popup("Error", 500, 500, true);

	var error_p = document.createElement("p");
	error_p.innerHTML = message;
	popup.content.appendChild(error_p);
	// TODO add OK button to close

	PopupManager.setPopup(popup);

	console.error(message);
}
function loginDialogue(callback) {
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
		if(typeof callback == "function") callback(token);
		$("loadingtext").innerText = "Applying changes...";
	};
}
