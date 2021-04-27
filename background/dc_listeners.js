client.on('ready', () => {
  	console.log(`Logged in as ${client.user.tag}!`);
	try {
		
		// Default Presence
		client.user.setPresence({
			status: 'online',
			activity: {
				name: "Custom Discord - Open Source!",
				type: "PLAYING"
			}
		});
		
		// init addons
		/*for(var i = 0; i < addonnames.length; i++) {
			var script = document.createElement("script");
			script.src = addonnames[i];
			document.getElementsByTagName("head")[0].appendChild(script);
		}*/
		
		// init themes
		/*for(var i = 0; i < themes.length; i++) {
			var link = document.createElement("link");
			link.rel = "stylesheet";
			link.src = themes[i];
			document.getElementsByTagName("head")[0].appendChild(link);
		}*/
		
		cache = new ClientCache();
		//cache.guilds = [];
		//cache.current_guild = -1;
		/*var guilds = client.guilds.cache.array();
		if(guilds.length > 0) cache.current_guild = guilds[0].id;
		for(var i = 0; i < guilds.length; i++) {
			cache.guilds.push(new Guild(guilds[i]));
		}*/
		console.log(cache);
		
		if(clientWindow && !clientWindow.loadDone) {
			clientWindow.onLoaded();
		}
	} catch(error) {
		//alert("Error while loading:\n" + error);
		console.error(error);
		if(clientWindow) {
			loginDialogue(token => {
				setToken(encrypt(getSalt(), token));
				login();
			});
		}
	}
});

client.on('message', (message) => {
	if(message.author.id != client.user.id) {
		var audio = new Audio('../sounds/discord-notification.mp3');
		audio.play();
		
		chrome.notifications.create('', {
			  "title": message.author.username,
			  "message": message.content,
			  "iconUrl": "../img/icon_128.png",
			  "type": "basic",
			  "silent": true,
			  "contextMessage": "CustomDiscord"
			});
	}
	return; // DEBUG
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
	//updateUserRegion();
})

client.on('typingStart', (channel, user) => {
	/*if(channel.id == current_channel && user.id != client.user.id) {
		var author;
		author = user.tag;
		if(user && user.nickname) author = user.nickname; 
		//console.log(user.username + " schreibt");
		//$("typing").innerHTML = "<b>" + author + "</b> is typing...";
	}*/
});