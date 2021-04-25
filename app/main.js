let bg = chrome.extension.getBackgroundPage();
let client = new Discord.Client();
let guilds = [];
let current_guild = "732633809241243679";
let blockedusers = [];
let addonnames = [];
let addons = [];
let wl_tags = ["i", "/i", "b", "/b", "text", "/text", "h2", "/h2", "h3", "/h3", "h4", "/h4", "h5", "/h5", "strike", "/strike", "u", "/u", "p", "/p", "code", "/code"];
let themes = [];
let typing = false;

function $(id) {
	var elem = document.getElementById(id);
	if(!elem) elem = document.body;
	return elem;
}

function copyUser() {
	copyToClipboard($("user-region-name").innerText);
}

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
		client.user.setPresence({
			status: this.fields[3].e.value,
			activity: {
				name: this.fields[0].e.value,
				type: this.fields[1].e.value,
				url: this.fields[2].e.value
			}
		});
		setTimeout(function() {
			updateUserRegion();
		}, 100);
	};
}

client.on('ready', () => {
  	console.log(`Logged in as ${client.user.tag}!`);
	try {
		PopupManager.setPopup(new JSONPopup({
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
		}));
		/*if(Cookie.get("new") == "1") {
			Cookie.set("new", "0", {max_age: "infinite", path: "/"});
			/*PopupManager.setPopup(new JSONPopup({
				title: "Willkommen",
				submit: "OK",
				fields: [
					{type: 0, name: "Du hast auf CustomDiscord gewechselt! DafÃ¼r mÃ¶chten wir dir danken!"},
					{type: 0, name: "Viel SpaÃŸ mit CustomDiscord!"},
					{type: 0, name: " "},
					{type: 0, name: "LG CustomDiscord"}
				]
			}));*/
			/*var welcome = new Popup("Welcome", 600, 800, true);
			var text = document.createElement("p");
			text.innerHTML = "You have switched to CustomDiscord! We wanna thank you for that!<br>Have fun with CustomDiscord!<br><br>LG CustomDiscord";
			welcome.content.appendChild(text);
			PopupManager.setPopup(welcome);
		}*/
		
		// Changelog
		/*if(Cookie.get("ver") != "1") {
			Cookie.set("ver", "1", {max_age: "infinite", path: "/"});
			var changelog = new Popup("Changelog", 600, 800, true);
			var text = document.createElement("p");
			text.innerHTML = "Neue Features!<br>- Login!";
			changelog.content.appendChild(text);
			PopupManager.setPopup(changelog);
		}*/
		
		// Default Presence
		client.user.setPresence({
			status: 'online',
			activity: {
				name: "Custom Discord - Open Source!",
				type: "PLAYING"
			}
		});
		
		// init addons
		for(var i = 0; i < addonnames.length; i++) {
			var script = document.createElement("script");
			script.src = addonnames[i];
			document.getElementsByTagName("head")[0].appendChild(script);
		}
		
		// init themes
		for(var i = 0; i < themes.length; i++) {
			var link = document.createElement("link");
			link.rel = "stylesheet";
			link.src = themes[i];
			document.getElementsByTagName("head")[0].appendChild(link);
		}

		$("user-region-name").addEventListener("click", function(event) {
			copyUser();
		});
		
		var loading = document.getElementById("loading");
		loading.style = "display: none;";
		$("client").style = "";
		switchChannel("732633809241243683");
		updateUserRegion();
	} catch(error) {
		alert("Error while loading:\n" + error);
		console.log(error);
	}
});

client.on('message', (message) => {
	if(!message.author.bot) {
		var audio = new Audio('discord-notification.mp3');
		audio.play();
		
		// TODO                                                            I need to fucking sleep
		chrome.runtime.sendMessage('', { type: 'notification', name: message.author.username, avatar: /* message.author.displayAvatarURL() */ '../img/icon_128.png', content: message.content});
	}
	if(message.channel.id == current_channel) {
		$("typing").innerText = "";
	}
	if(message.guild === null && !message.author.bot) {
		message.channel.send("I can't help you with that. I'm just a bot. Maybe ask a human because DMs havn't been added to CustomDiscord yet.");
	}
	
	console.log(message.channel.name + " -> " + message.content);
	for(var i = 0; i < addons.length; i++) {
		if(addons[i].onmsg) addons[i].onmsg(message);
	}
	if(message.content.includes("I am sorry but you got blocked.") && message.author.bot) return;
	if(blockedusers.includes(message.author.id)) {
		message.reply("I am sorry but you got blocked.");
		return;
	}
	let guild = "DM";
	if(message.guild) guild = message.guild.name;
	let channel = "";
	if(message.channel.name) channel = "[#" + message.channel.name + "] ";
	if($("autoswitch").checked) {
		current_channel = message.channel.id;
	}
	
	if(current_channel == message.channel.id && guild != "DM") {
		$("chat-history").appendChild(createMessageDiv(message));
		$("chat-history").children[$("chat-history").children.length-1].scrollIntoView();
	}
	
	if(guild == "DM") {
		for(var i = 0; i < addons.length; i++) {
			if(addons[i].ondm) addons[i].ondm(message);
		}
	}
	
	// Automate
	/*if(message.content == ifmsg.value && !message.author.bot) {
		console.log(createMessageDiv({content: "[CustomDiscord] [Automate] Automate triggered!", author: {tag: "System"}}));
		$("chat-history").appendChild(createMessageDiv("[CustomDiscord] [Automate] Automate triggered!"));
		message.channel.send(thenmsg.value);
		for(var i = 0; i < addons.length; i++) {
			if(addons[i].onautomatetriggered) addons[i].onautomatetriggered();
		}
	}*/
});

client.on("presenceUpdate", () => {
	updateUserRegion();
})

client.on('typingStart', (channel, user) => {
	if(channel.id == current_channel) {
		var author;
		author = user.tag;
		if(user && user.nickname) author = user.nickname; 
		//console.log(user.username + " schreibt");
		$("typing").innerHTML = "<b>" + author + "</b> is typing...";
	}
});

function sendMsg() {
	$("typing").innerHTML = "";
	var channel = client.channels.cache.get(current_channel); // uff das war eig. so ez fix xD
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
	if($("inputbox-inner").value && channel) channel.send(parseMsg($("inputbox-inner").value)).catch(error => {
		if(error.message == "Missing Permissions")  {
			alert("You don't have permissions to write in this channel!");
		}
	});
	for(var i = 0; i < addons.length; i++) {
		if(addons[i].onmsg) addons[i].onmsg($("inputbox-inner").value);
	}
	$("inputbox-inner").value = "";
}

function switchChannel(id) {
	$("typing").innerText = "";
	var channel = client.channels.cache.get(id);
	var guild = channel.guild;
	if(!channel) return;
	if(channel.type == "text" || channel.type == "voice") {
		console.log(channel.permissionsFor(guild.me).toArray());
		current_channel = channel.id;
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
		reloadChannelList();
		for(var i = 0; i < addons.length; i++) {
			if(addons[i].onchannelswitched) addons[i].onchannelswitched();
		}
		$("inputbox-inner").focus();
		if(!guild) {
			$("inputbox-inner").placeholder = "Guild error.";
			$("inputbox-inner").disabled = true;
		} else if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
			$("inputbox-inner").placeholder = "Send messages to #" + channel.name;
			$("inputbox-inner").disabled = false;
		} else {
			$("inputbox-inner").placeholder = "You don't have permissions to write in this channel.";
			$("inputbox-inner").disabled = true;
		}
	}
}

function reloadChannelList() {
	var channelsDiv = $("channel-list");
	var guild = client.guilds.cache.get(current_guild);
	var channels = guild.channels.cache.array();
	while(channelsDiv.children.length > 0) {
		channelsDiv.removeChild(channelsDiv.children[0]);
	}
	for(var i = 0; i < channels.length; i++) {
		if(!channels[i].parent && channels[i].type != "category") {
			channelsDiv.appendChild(createChannelDiv(channels[i]));
		}
	}
	for(var i = 0; i < channels.length; i++) {
		if(!channels[i].parent && channels[i].type == "category") {
			channelsDiv.appendChild(createChannelDiv(channels[i]));
		}
	}
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

window.addEventListener("load", () => {
	$("inputbox-inner").addEventListener('keydown', function (e){
		if($("inputbox-inner").value == "") {
			typing = false;
			return;
		} else {
			var channel = client.channels.cache.get(current_channel);
			if(channel.type == "text") {
				channel.startTyping();
			}
		}
	});
	/*addonnames = bg.get("addons").split(", ");*/
	//console.log(addonnames);
	var token = bg.getToken();
	client.login(token)
		.catch(() => {
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
				//Cookie.set("token", token, {max_age: "infinite", path: "/"});
				//Cookie.set("ver", "1", {max_age: "infinite", path: "/"});
				//Cookie.set("theme", "theme-dark", {max_age: "infinite", path: "/"}); // DEBUG just to not burn my eyes
				//Cookie.set("new", "1", {max_age: "infinite", path: "/"});
				//Cookie.set("ver", "1");
				bg.setToken(token);
				$("loadingtext").innerText = "Applying changes...";
				setTimeout(function() {
					location.reload();
				}, 500);
			};
		});
		
	$("client").addEventListener("keydown", (event) => {
		if(!event.ctrlKey) {
			$("inputbox-inner").focus();
		}
		console.log("keydown on client");
	});
	
	$("inputbox").addEventListener("keydown", function(event) { // to make sure \n isnt at the end
	  	if(event.keyCode === 13 && !event.shiftKey) {
			event.preventDefault();
		}
		$("inputbox-a").innerText = "#" + $("inputbox-inner").value + "#";
		$("inputbox-inner").style.height = $("inputbox-a").clientHeight + 5;
	});
	
	$("inputbox").addEventListener("keyup", function(event) {
	  	if(event.keyCode === 13 && !event.shiftKey) {
	   		sendMsg();
		}
		$("inputbox-a").innerText = "#" + $("inputbox-inner").value + "#";
		$("inputbox-inner").style.height = $("inputbox-a").clientHeight + 5;
	});
	
	$("btnstatuschange").addEventListener("click", function(event) {
		//setStatus();
	});
	
	$("user-region-settings").addEventListener("click", event => {
		var popup = new JSONPopup({
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
		PopupManager.setPopup(popup);
	});
	$("user-region-settings").title = "Benutzereinstellungen";
	$("user-region-status").addEventListener("click", setStatus);
	
	PopupManager.init();
	
	setTheme(bg.getSetting("theme") || "theme-default");
});
// #RoadTo500Lines