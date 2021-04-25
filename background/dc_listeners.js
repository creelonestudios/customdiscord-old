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
	if(channel.id == current_channel && user.id != client.user.id) {
		var author;
		author = user.tag;
		if(user && user.nickname) author = user.nickname; 
		//console.log(user.username + " schreibt");
		$("typing").innerHTML = "<b>" + author + "</b> is typing...";
	}
});