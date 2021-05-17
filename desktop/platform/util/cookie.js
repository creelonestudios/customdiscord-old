// Made by j0code

class Cookie {
	constructor() {
		
	}
	
	static get(key) {
		var cookies = document.cookie.split(";");
		for(var i = 0; i < cookies.length; i++) {
			var ckey = decodeURIComponent(cookies[i].substring(0, cookies[i].indexOf("=")));
			if(ckey.startsWith(" ")) ckey = ckey.substr(1);
			if(ckey == key && cookies[i].indexOf("=") + 1 < cookies[i].length) {
				return decodeURIComponent(cookies[i].substring(cookies[i].indexOf("=") + 1));
			}
		}
		return "";
	}
	
	static set(key, value, args) {
		var comment = "";
		var domain = "";
		var path = "";
		var secure = "";
		var version = "";
		var max_age = "";
		if(args) {
			if(args.comment) comment = "; comment=" + args.comment;
			if(args.domain) domain = "; domain=" + args.domain;
			if(args.path) path = "; path=" + args.path;
			if(args.secure) secure = "; secure";
			if(args.version) version = "; version=" + args.version;
			if(args.max_age || args.max_age == 0) {
				if(args.max_age == "session" || args.max_age == "sess") {
					max_age = "";
				} else if(args.max_age == "infinity" || args.max_age == "infinite" || args.max_age == "perm" || args.max_age == "permanent" || args.max_age == "inf") {
					max_age = "; max-age=" + 3155760000;
				} else {
					max_age = "; max-age=" + args.max_age;
				}
			} else if(args.years) {
				max_age = "; max-age=" + (args.hours*256*24*60*60);
			} else if(args.days) {
				max_age = "; max-age=" + (args.days*24*60*60);
			} else if(args.hours) {
				max_age = "; max-age=" + (args.hours*60*60);
			} else if(args.mins) {
				max_age = "; max-age=" + (args.mins*60);
			}
		}
		key = encodeURIComponent(key);
		if(!value) value = "";
		value = encodeURIComponent(value);
		comment = encodeURIComponent(comment);
		document.cookie = key + "=" + value + comment + domain + path + secure + version + max_age;
		return key + "=" + value + comment + domain + path + secure + version + max_age;
	}
	
	static del(key) {
		return this.set(key, "", {max_age: 0});
	}
	
	static exists(key) {
		return this.keys.includes(key);
	}
	
	static get cookie() {
		return decodeURIComponent(document.cookie);
	}
	
	static set cookie(query) {
		document.cookie = query;
		return this.cookie;
	}
	
	static get keys() {
		if(this.cookie == "") return [];
		var cookies = document.cookie.split(";");
		var keys = [];
		for(var i = 0; i < cookies.length; i++) {
			var ckey = decodeURIComponent(cookies[i].substring(0, cookies[i].indexOf("=")));
			if(ckey.startsWith(" ")) ckey = ckey.substr(1);
			keys.push(ckey);
		}
		return keys;
	}
	
	static get values() {
		if(this.cookie == "") return [];
		var cookies = document.cookie.split(";");
		var values = [];
		for(var i = 0; i < cookies.length; i++) {
			var cval = decodeURIComponent(cookies[i].substring(cookies[i].indexOf("=") + 1));
			if(cval.startsWith(" ")) cval = cval.substr(1);
			values.push(cval);
		}
		return values;
	}
	
	static asArray() {
		if(this.cookie == "") return [];
		var cookies = document.cookie.split(";");
		var array = [];
		for(var i = 0; i < cookies.length; i++) {
			var ckey = decodeURIComponent(cookies[i].substring(0, cookies[i].indexOf("=")));
			var cval = decodeURIComponent(cookies[i].substring(cookies[i].indexOf("=") + 1));
			if(ckey.startsWith(" ")) ckey = ckey.substr(1);
			if(cval.startsWith(" ")) cval = cval.substr(1);
			var cookie = { key: ckey, value: cval };
			array.push(cookie);
		}
		return array;
	}
}