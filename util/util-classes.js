class ClientCache {
	#guilds; #channels; #current;
	
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
		this.#current = "";
		if(this.#guilds.size > 0) this.#current = this.#guilds.values().next().value.id;
	}
	
	get guilds() {
		return this.#guilds;
	}
	
	get channels() {
		return this.#channels;
	}
	
	get current() {
		return this.#current;
	}
	
	set current(v) {
		if(!v) return;
		var old = this.#current;
		this.#current = v;
		if(old) this.guilds.get(old).validate();
		this.guilds.get(v).validate();
	}
	
	get currentChannel() {
		var guild = cache.getGuild(cache.current);
		return this.getChannel(guild.current);
	}
	
	getGuild(id) {
		var g = this.guilds.get(id);
		//console.log(id, g);
		if(!g) {
			var raw = client.guilds.cache.get(id);
			if(!raw) return;
			g = new Guild(raw, this);
			this.#guilds.set(id, g);
		}
		//console.log(id, g);
		return g;
	}
	
	getChannel(id) {
		var c = this.channels.get(id);
		if(!c) {
			var raw = client.channels.cache.get(id);
			if(!raw) return;
			c = new Channel(raw, this);
			this.#channels.set(id, c);
		}
		return c;
	}
	
	getChannelsOfGuild(g) {
		var guild = g;
		if(typeof g != "object") guild = client.guilds.cache.get(g);
		var raw = guild.channels.cache.array();
		var chans = [];
		for(var i = 0; i < raw.length; i++) {
			var chan = this.getChannel(raw[i].id);
			chans.push(chan);
		}
		return chans;
	}
	
	searchChannel(name) {
		var channels = client.channels.cache.array();
		for(var i = 0; i < channels.length; i++) {
			if(channels[i].name == name) {
				return channels[i];
			}
		}
	}
	
}

class Guild {
	#id; #e; #channellist; #current; #cache;
	
	constructor(g, cache) {
		console.log("NEW GUILD");
		this.#id = g.id;
		this.#cache = cache;
		this.#e = { top: null, icon: null }
		this.#channellist;
		this.#current = "";
		var chans = this.#cache.getChannelsOfGuild(this.#id);
		console.log(g.id, chans);
		for(var i = 0; i < chans.length; i++) {
			if(chans[i].type != "category") {
				console.log(chans[i]);
				this.#current = chans[i].id;
				break;
			}
		}
		console.log("µ", this.#current);
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
		if(!this.#e.top) this.validate();
		return this.#e.top;
	}
	
	get channellist() {
		if(!this.#channellist) this.validateChannellist();
		return this.#channellist;
	}
	
	get current() {
		return this.#current;
	}
	
	set current(v) {
		if(!v) return;
		var old = this.#current;
		var chan = client.channels.cache.get(v);
		if(!chan || chan.type == "category") return;
		this.#current = v;
		if(old) this.#cache.channels.get(old).validate();
		this.#cache.channels.get(v).validate();
	}
	
	getChannelById(id) {
		return this.#cache.channels.get(id);
	}
	
	validate() {
		var guild = client.guilds.cache.get(this.id);
		if(!this.#e.icon) {
			this.#e.icon = document.createElement("img");
		}
		if(!this.#e.top) {
			this.#e.top = document.createElement("div");
			this.#e.top.addEventListener("click", () => {
				this.#cache.current = this.#id;
				reloadChannelList();
				loadMessageHistory();
			});
			this.#e.top.appendChild(this.#e.icon);
		}
		if(this.#cache.current == this.#id) {
			this.#e.top.className = "guild guild-active";
		} else {
			this.#e.top.className = "guild";
		}
		this.#e.icon.src = guild.iconURL() || "../img/icon_256.png";
		this.#e.top.title = guild.name;
	}
	
	validateChannellist() {
		if(!this.#channellist) this.#channellist = document.createElement("div");
		while(this.#channellist.firstChild) this.#channellist.removeChild(this.#channellist.lastChild);
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
			var c = this.#cache.getChannel(topChans[i].id);
			this.#channellist.appendChild(c.e);
		}
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
	#type; #id; #messages; #e; #showChans; #cache;
	
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
		if(!this.#e) this.#e = document.createElement("div");
		while(this.#e.firstChild) this.#e.removeChild(this.#e.lastChild);
		var channel = client.channels.cache.get(this.#id);
		var callback = () => {
			this.#cache.getGuild(channel.guild.id).current = this.#id;
			this.validate();
			this.#cache.getGuild(channel.guild.id).validate();
			console.log("Switched channel to", this.#id, this.#cache.getGuild(channel.guild.id).current);
			loadMessageHistory();
		}
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
			if(channel.id == this.#cache.getGuild(channel.guild.id).current) {
				this.#e.className = "channel channel-active";
			} else {
				//console.log("inactive", channel.id, this.#cache.getGuild(channel.guild.id).current);
			}
			if(channel.type == "text") {
				div1.innerText = "# " + channel.name;
				this.#e.addEventListener("click", callback);
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
					this.#e.addEventListener("click", callback);
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

class StateManager {
	#states = ["load", "main", "settings"];
	#state = 0;
	
	constructor() {
		document.body.className = "state-load";
	}
	
	set state(s) {
		if(!isNaN(s)) {
			s = Number(s);
			if(s >= 0 && s < this.#states.length) {
				this.#state = s;
			}
		} else if(this.#states.includes(s)) {
			this.#state = this.#states.indexOf(s);
		}
		document.body.className = "state-" + this.getStateName();
	}
	
	get state() {
		return this.#state;
	}
	
	getStateName() {
		return this.#states[this.state];
	}
}