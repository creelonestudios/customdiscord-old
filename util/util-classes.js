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
	}
	
	get guilds() {
		return this.#guilds;
	}
	
	get channels() {
		return this.#channels;
	}
	
	getChannelsOfGuild(id) {
		var guild = client.guilds.cache.get(id);
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
	}
	
}

class Guild {
	#id; #e; #cache;
	
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
		this.#e = document.createElement("div");
		var g = client.guilds.cache.get(this.#id);
		var channels = this.channels;
		for(var i = 0; i < channels.length; i++) {
			if(!channels[i].parent && channels[i].type != "category") {
				this.#e.appendChild(channels[i].e);
			}
		}
		for(var i = 0; i < channels.length; i++) {
			if(!channels[i].parent && channels[i].type == "category") {
				this.#e.appendChild(channels[i].e);
			}
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
		this.#e = createChannelDiv(c);
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
	
	get id() {
		return this.#id;
	}
	
	get messages() {
		return this.#messages;
	}
	
	get e() {
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