class ClientCache {
	#guilds; #channels;
	
	constructor() {
		this.#guilds = new Map();
		this.#channels = new Map();
		var rawG = client.guilds.cache.array();
		for(var i = 0; i < rawG.length; i++) {
			this.#guilds.set(rawG[i].id, new Guild(rawG[i], this));
		}
		var rawC = client.channels.cache.array();
		for(var i = 0; i < rawC.length; i++) {
			this.#channels.set(rawC[i].id, new Channel(rawC[i], this));
		}
		this.current = "";
		if(this.#guilds.size > 0) this.current = this.#guilds.values().next().value.id;
	}
	
	get guilds() {
		return this.#guilds;
	}
	
	get channels() {
		return this.#channels;
	}
	
	getGuild(id) {
		var g = this.guilds.get(id);
		console.log(id, g);
		if(!g) {
			var raw = client.guilds.cache.get(id);
			if(!raw) return;
			g = new Guild(raw, this);
			this.#guilds.set(id, g);
		}
		console.log(id, g);
		return g;
	}
	
	getChannel(id) {
		var c = this.channels.get(id);
		if(!c) {
			var raw = client.guilds.cache.get(id);
			if(!raw) return;
			c = new Channel(raw, this);
			this.#channels.set(id, c);
		}
		return c;
	}
	
	getChannelsOfGuild(g) {
		var guild = g;
		if(typeof g != "object") guild = client.guilds.cache.get(g);
		console.log(guild);
		var raw = guild.channels.cache.array();
		var chans = [];
		for(var i = 0; i < raw.length; i++) {
			var chan = this.#channels.get(raw[i].id);
			if(!chan) {
				chan = new Channel(chan, this);
				this.#channels.set(raw[i].id, chan);
			}
			chans.push(chan);
		}
		return chans;
	}
	
}

class Guild {
	#id; #e; #channellist; #cache;
	
	constructor(g, cache) {
		console.log("NEW GUILD");
		this.#id = g.id;
		this.#cache = cache;
		this.current = 0;
	}
	
	getChannelById(id) {
		return this.#cache.channels.get(id);
	}
	
	validate() {
		var guild = client.guilds.cache.get(this.id);
		this.#e = document.createElement("div");
		this.#e.className = "guild";
		var img = document.createElement("img");
		img.src = guild.iconURL() || "../img/icon_256.png";
		this.#e.appendChild(img);
		this.#e.addEventListener("click", () => {
			this.#cache.current = this.#id;
		});
	}
	
	validateChannellist() {
		this.#channellist = document.createElement("div");
		var guild = client.guilds.cache.get(this.#id);
		var channels = guild.channels.cache.array();
		var topChans = [];
		for(var i = 0; i < channels.length; i++) {
			if(!channels[i].parent) {
				topChans.push(channels[i]);
			}
		}
		console.log("before", topChans);
		topChans = topChans.sort((e1, e2) => (e1.rawPosition < e2.rawPosition) ? -1 : ((e1.rawPosition > e2.rawPosition) ? 1 : 0));
		console.log("after", topChans);
		for(var i = 0; i < topChans.length; i++) {
			var c = cache.getChannel(topChans[i].id);
			this.#channellist.appendChild(c.e);
		}
	}
	
	get id() {
		return this.#id;
	}
	
	get channels() {
		return this.#cache.getChannelsOfGuild(this.#id);
	}
	
	get categories() {
		//return this.#categories;
		return 0; // debug
	}
	
	get e() {
		if(!this.#e) this.validate();
		return this.#e;
	}
	
	get channellist() {
		if(!this.#channellist) this.validateChannellist();
		return this.#channellist;
	}
}

class Category {
	#id; #channels; #e;
	
	constructor(c) {
		console.log("NEW CAT");
		this.#id = c.id;
		this.current = 0;
		this.#channels = [];
		this.#e = createChannelDiv(c);
		var raw = c.children.array();
		for(var i = 0; i < raw.length; i++) {
			this.#channels.push(new Channel(raw[i], this.#e));
		}
	}
	
	getChannelById(id) {
		var chans = client.channels.cache.get(this.#id).children;
		for(var i = 0; i < chans.length; i++) {
			if(chans[i].id == id) {
				return chans[i];
			}
		}
	}
	
	get id() {
		return this.#id;
	}
	
	get channels() {
		return this.#channels;
	}
	
	get e() {
		return this.#e;
	}
}

class Channel {
	#type; #id; #messages; #e; #cache;
	
	constructor(c, cache) {
		console.log("NEW CHAN");
		this.#type = c.type;
		this.#id = c.id;
		this.#messages;
		this.#e;
		this.#cache = cache;
	}
	
	getMessageById(id) {
		var msgs = client.channels.cache.get(this.#id).messages.cache.array();
		for(var i = 0; i < msgs.length; i++) {
			if(msgs[i].id == id) {
				return msgs[i];
			}
		}
	}
	
	fetchMessages(count) {
		// fetch and validate msgs
	}
	
	validate() {
		this.#e = document.createElement("div");
		var channel = client.channels.cache.get(this.#id);
		if(channel.type == "category") {
			var div1 = document.createElement("div");
			this.#e.className = "category";
			div1.className = "category-name";
			this.#e.appendChild(div1);
			div1.innerText = "-- " + channel.name.toUpperCase() + " --";
			var chans = channel.children.array();
			for(var i = 0; i < chans.length; i++) {
				var e = this.#cache.getChannel(chans[i].id).e;
				this.#e.appendChild(e);
			}
			this.#e.addEventListener("click", event => {
				if(event.target.classList.contains("category-name")) {
					event.target.parentElement.classList.toggle("category-showchans");
				}
			});
		} else {
			var div1 = document.createElement("div");
			this.#e.appendChild(div1);
			this.#e.className = "channel";
			div1.className = "channel-name";
			//if(channel.id == current_channel) div.className = "channel channel-active"
			if(channel.type == "text") {
				div1.innerText = "# " + channel.name;
				this.#e.addEventListener("click", () => {
					switchChannel(channel.id);
				});
			} else if(channel.type == "voice") {
				div1.innerText = "🔊" + channel.name;
				div1.onclick = function() {
					var popup = new JSONPopup({
						title: "VoiceChannels in CustomDiscord",
						submit: "Understood!",
						fields: [
							{type: 0, name: "Hey! You can't talk in voice channels right now!"},
							{type: 0, name: "Discord.JS WebAPI can't encode or stream voice yet. :("}
						]
					});
					PopupManager.setPopup(popup);
					popup.submit = function() {
						PopupManager.closePopup();
					}
					this.#e.addEventListener("click", () => {
						switchChannel(channel.id);
					});
				}
			} else {
				div1.innerText = "? " + channel.name;
			}
		}
	}
	
	get id() {
		return this.#id;
	}
	
	get messages() {
		return this.#messages;
	}
	
	get e() {
		if(!this.#e) this.validate();
		return this.#e;
	}
}

class Message {
	#id; #e;
	
	constructor(m) {
		console.log("NEW MSG");
		this.#id = m.id;
		this.#e = createMessageDiv(m);
	}
	
	get id() {
		return this.#id;
	}
	
	get e() {
		return this.#e;
	}
}