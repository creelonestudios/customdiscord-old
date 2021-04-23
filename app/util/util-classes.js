class Guild {
	#id; #categories;
	
	constructor(g) {
		this.#id = g.id;
		this.current = 0;
		this.#categories = getCategories(g);
		var raw = g.channels.cache.array();
		for(var i = 0; i < raw.length; i++) {
			if(raw[i].type == "category") {
				this.#categories.push(new Category(raw[i]));
			}
		}
	}
	
	getChannelById(id) {
		var chans = client.guilds.cache.get(this.#id).channels.cache.array();
		for(var i = 0; i < chans.length; i++) {
			if(chans[i].id == id) {
				return chans[i];
			}
		}
	}
	
	get id() {
		return this.#id;
	}
	
	get categories() {
		return this.#categories;
	}
}

class Category {
	#id; #channels; #e;
	
	constructor(c) {
		this.#id = c.id;
		this.current = 0;
		this.#channels = [];
		this.#e = getChannelDiv(c);
		var raw = g.children.cache.array();
		for(var i = 0; i < raw.length; i++) {
			this.#channels.push(new Channel(raw[i], e));
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
	#id; #messages; #e;
	
	constructor(c) {
		this.#id = c.id;
		this.#messages;
		this.#e = getChannelDiv(c);
	}
	
	getMesageById(id) {
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
		this.#id = m.id;
		this.#e = getMessageDiv(m);
	}
	
	get id() {
		return this.#id;
	}
	
	get e() {
		return this.#e;
	}
}