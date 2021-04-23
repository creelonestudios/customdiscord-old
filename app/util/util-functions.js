function copyToClipboard(str) {
	const el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

function getChannelByName(name, guildid) {
	guildid = guildid || current_guild;
	var guild = client.guilds.cache.get(guildid);
	if(!guild) return;
	var channels = guild.channels.cache.array();
	for(var i = 0; i < channels.length; i++) {
		if(channels[i].name == name) return channels[i];
	}
}

function getUserByName(name, guildid) {
	guildid = guildid || current_guild;
	var guild = client.guilds.cache.get(guildid);
	if(guild) {
		var members = guild.members.cache.array();
		for(var i = 0; i < members.length; i++) {
			if(members[i].username == name && !members[i].nickname) return members[i];
			if(members[i].tag == name) return members[i];
		}
		for(var i = 0; i < members.length; i++) {
			if(members[i].nickname == name) return members[i];
		}
	}
	var users = client.users.cache.array();
	for(var i = 0; i < users.length; i++) {
		if(users[i].username == name || users[i].tag == name) return users[i];
	}
}

function getRoleByName(name, guildid) {
	guildid = guildid || current_guild;
	var guild = client.guilds.cache.get(guildid);
	if(!guild) return;
	var roles = guild.roles.cache.array();
	for(var i = 0; i < roles.length; i++) {
		if(roles[i].name == name) return roles[i];
	}
}

function getEmojiByName(name, guildid) {
	guildid = guildid || current_guild;
	var guild = client.guilds.cache.get(guildid);
	if(guild) {
		var emojis = guild.emojis.cache.array();
		for(var i = 0; i < emojis.length; i++) {
			if(emojis[i].name == name) return emojis[i];
		}
	}
	var emojis = client.emojis.cache.array();
	for(var i = 0; i < emojis.length; i++) {
		if(emojis[i].name == name) return emojis[i];
	}
}

function embed(title, desc, color, footer) {
	var embed = new Discord.MessageEmbed();
	if(color == "error") color = [255, 0, 0];
	if(color == "info") color = [150, 150, 150];
	if(color == "success") color = [0, 230, 0];
	embed.setTitle(title || "Embed");
	embed.setColor(color || [0, 0, 0]);
	embed.setDescription(desc || "No description.");
	embed.setFooter(footer || "");
	return embed;
}

function setTheme(theme) {
	document.getElementsByTagName("html")[0].className = theme;
	//Cookie.set("theme", theme, {max_age: "infinite", path: "/"}); ----------------------------------------------------------------------------------------------------- !!!
}