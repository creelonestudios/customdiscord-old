function parseMsg(msg) {
	if(!msg) return "";
	var result = "";
	var suffix = "";
	var start = 0;
	if(msg.startsWith("/shrug ") || msg == "/shrug") { start = 7; suffix = " ¯\\_(ツ)_/¯" }
	else if(msg.startsWith("/tableflip ") || msg == "/tableflip") { start = 11; suffix = " (╯°□°）╯︵ ┻━┻" }
	else if(msg.startsWith("/unflip ") || msg == "/unflip") { start = 8; suffix = " ┬─┬ ノ( ゜-゜ノ)" }
	else if(msg.startsWith("/doubleflip ") || msg == "/doubleflip") { start = 12; suffix = " ┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻" }
	else if(msg.startsWith("/me ") && msg.length > 4) { start = 4; result += "_"; suffix = "_"; }
	for(var i = start; i < msg.length; i++) {
		var char = msg.charAt(i);
		if(char == "#" || char == "@") {
			var s = "";
			for(var j = i + 1; j < msg.length; j++) {
				var char1 = msg.charAt(j);
				if(char1 == " ") break;
				if(char1 != "\n") s += char1;
			}
			if(char == "#") {
				var channel = cache.searchChannel(s);
				if(channel && channel.type == "text") {
					result += "<#" + channel.id + ">";
				} else result += "#" + s;
			} else if(char == "@") {
				var user = getUserByName(s);
				if(user) {
					result += "<@" + user.id + ">";
				} else {
					var role = getRoleByName(s);
					if(role) {
						result += "<@&" + role.id + ">";
					} else result += "@" + s;
				}
			}
			i += s.length;
		} else if(char == ":") {
			var s = "";
			i++;
			for(; i < msg.length; i++) {
				var char1 = msg.charAt(i);
				if(char1 == ":" || char1 == " " || char1 == "\n") break;
				s += char1;
			}
			var emoji = getEmojiByName(s);
			if(emoji) {
				if(emoji.animated) {
					result += "<a:" + emoji.name + ":" + emoji.id + ">";
				} else {
					result += "<:" + emoji.name + ":" + emoji.id + ">";
				}
			} else result += ":" + s + msg.charAt(i);
		} else if(char == "&") {
			/*if(msg.charAt(i+1) == "&") {
				result += "&";
				i++;
				continue;
			}
			var s = "";
			for(var j = i + 1; j < msg.length; j++) {
				var char1 = msg.charAt(j);
				if(char1 == ";") break;
				if(char1 != "\n") s += char1;
			}
			var valid = true;
			try {
				var json = JSON.parse(s);
				embed = new Discord.MessageEmbed(json);
			} catch(error) {
				valid = false;
			}
			if(embed && valid) {
				// coming soon because wont work currently
			}
			i += s.length + 1;*/
			result += char;
		} else {
			result += char;
		}
	}
	return result + suffix;
}

function unparseMsg(msg, guild) {
	if(!msg || !guild) return "";
	/*msg = msg.replaceAll("<script>", "&lt;script&gt;");
	msg = msg.replaceAll("</script>", "&lt;/script&gt;");
	msg = msg.replaceAll("<style>", "&lt;style&gt;");
	msg = msg.replaceAll("</style>", "&lt;/style&gt;");
	msg = msg.replaceAll("<button>", "&lt;button&gt;");
	msg = msg.replaceAll("</button>", "&lt;/button&gt;");
	msg = msg.replaceAll("<input>", "&lt;input&gt;");
	msg = msg.replaceAll("</input>", "&lt;/input&gt;");
	msg = msg.replaceAll("<div>", "&lt;div&gt;");
	msg = msg.replaceAll("</div>", "&lt;/div&gt;");*/
	var result = "";
	for(var i = 0; i < msg.length; i++) {
		var char = msg.charAt(i);
		if(char == "\\") {
			var c = msg.charAt(i+1);
			var c1 = msg.charAt(i-1);
			if(c1 == "¯") {
				result += "\\" + c;
			} else {
				if(c == "<") c = "&lt;";
				if(c == ">") c = "&gt;";
				if(c == "\n") c = "<br>";
				result += c;
			}
			i++;
		} else if(char == ">" && msg.charAt(i+1) == " ") {
			var s = "";
			var newl = false;
			for(var j = i + 2; j < msg.length; j++) {
				var char0 = msg.charAt(j);
				if(char0 == "\n") {newl = true; break; }
				s += char0;
			}
			i += s.length + 2;
			s = unparseMsg(s, guild);
			result += "<div class=\"quote\">" + s + "</div>";
		} else if(char == "`") {
			var amount = 1;
			if(msg.charAt(i+1) == "`") amount = 2;
			if(msg.charAt(i+1) == "`" && msg.charAt(i+2) == "`") amount = 3;
			var s = "";
			for(var j = i + amount; j < msg.length; j++) {
				var char0 = msg.charAt(j);
				var char1 = msg.charAt(j+1);
				var char2 = msg.charAt(j+2);
				if(char0 == "`" && amount == 1) break;
				else if(char0 == "`" && char1 == "`" && amount == 2) break;
				else if(char0 == "`" && char1 == "`" && char2 == "`" && amount == 3) break;
				s += char0;
			}
			if(i + s.length + amount*2 -1 >= msg.length) result += "`".repeat(amount) + s;
			else if(amount == 1) result += "<code>" + s + "</code>";
			else if(amount == 2) result += "<code>" + s + "</code>";
			else if(amount == 3) result += "<code class=\"cb\">" + s + "</code>";
			i += s.length + amount*2 -1;
		} else if(char == "~" && msg.charAt(i+1) == "~") {
			var s = "";
			for(var j = i + 2; j < msg.length; j++) {
				var char0 = msg.charAt(j);
				var char1 = msg.charAt(j+1);
				if(char0 == "~" && char1 == "~") break;
				s += char0;
			}
			i += s.length + 3;
			s = unparseMsg(s, guild);
			if(i >= msg.length) result += "~~" + s;
			else result += "<strike>" + s + "</strike>";
		} else if(char == "_") {
			var amount = 1;
			if(msg.charAt(i+1) == "_") amount = 2;
			if(msg.charAt(i+1) == "_" && msg.charAt(i+2) == "_") amount = 3;
			var s = "";
			for(var j = i + amount; j < msg.length; j++) {
				var char0 = msg.charAt(j);
				var char1 = msg.charAt(j+1);
				var char2 = msg.charAt(j+2);
				if(char0 == "_" && amount == 1) break;
				else if(char0 == "_" && char1 == "_" && amount == 2) break;
				else if(char0 == "_" && char1 == "_" && char2 == "_" && amount == 3) break;
				s += char0;
			}
			i += s.length + amount*2 -1;
			s = unparseMsg(s, guild);
			if(i >= msg.length) result += "_".repeat(amount) + s;
			else if(amount == 1) result += "<i>" + s + "</i>";
			else if(amount == 2) result += "<u>" + s + "</u>";
			else if(amount == 3) result += "<u><i>" + s + "</i></u>";
		} else if(char == "*") {
			var amount = 1;
			if(msg.charAt(i+1) == "*") amount = 2;
			if(msg.charAt(i+1) == "*" && msg.charAt(i+2) == "*") amount = 3;
			var s = "";
			for(var j = i + amount; j < msg.length; j++) {
				var char0 = msg.charAt(j);
				var char1 = msg.charAt(j+1);
				var char2 = msg.charAt(j+2);
				if(char0 == "*" && amount == 1) break;
				else if(char0 == "*" && char1 == "*" && amount == 2) break;
				else if(char0 == "*" && char1 == "*" && char2 == "*" && amount == 3) break;
				s += char0;
			}
			i += s.length + amount*2 -1;
			s = unparseMsg(s, guild);
			if(i >= msg.length) result += "*".repeat(amount) + s;
			else if(amount == 1) result += "<i>" + s + "</i>";
			else if(amount == 2) result += "<b>" + s + "</b>";
			else if(amount == 3) result += "<b><i>" + s + "</i></b>";
		} else if(char == "<") {
			var s = "";
			for(var j = i+1; j < msg.length; j++) {
				var char1 = msg.charAt(j);
				if(char1 == ">") break;
				if(char1 != "<" && char1 != "\n") s += char1;
			}
			/*var list = s.split(" ");
			var s = "";
			for(var j = 0; j < list.length; j++) {
				var a = list[j];
				if(a == "script" || a == "style" || a == "button" || a.startsWith("style")) continue;
				s += a;
				if(j < list.length -1) s += " ";
			}
			console.log("-----");
			console.log(msg);
			console.log(s);
			console.log(result);
			if(s) result += "<" + s + ">";
			console.log(result);*/
			var parsed = false;
			if(s.startsWith("@") && s.length > 2) {
				var id = s.substring(1);
				if(id.startsWith("!")) id = id.substring(1);
				if(id.startsWith("&")) {
					id = id.substring(1);
					var role = guild.roles.cache.get(id);
					if(role) {
						result += "<div class=\"mention\" title=\"" + role.name + "\">@" + role.name + "</div>";
					} else result += "@unknown-role";
					parsed = true;
				} else {
					var member = guild.members.cache.get(id);
					if(member) {
						var name = member.nickname;
						if(!name) name = member.user.username;
						var tag = member.user.tag;
						result += "<div class=\"mention\" title=\"" + tag + "\">@" + name + "</div>";
					} else {
						var user = client.users.cache.get(id);
						if(user) {
							result += "<div class=\"mention\" title=\"@" + user.tag + "\">@" + user.username + "</div>";
						} else result += "@unknown-user";
					}
					parsed = true;
				}
			} else if(s.startsWith("#") && s.length > 2) {
				var id = s.substring(1);
				var channel = client.channels.cache.get(id);
				if(channel) {
					var parent = "";
					if(channel.parent) parent = channel.parent.name;
					else parent = channel.guild.name;
					result += "<div class=\"mention\" title=\"" + parent + "\">#" + channel.name + "</div>";
				} else result += "#deleted-channel";
				parsed = true;
			} else if((s.startsWith("a") || s.startsWith(":")) && s.length > 2) {
				var s0 = s.substring(1);
				if(s0.startsWith(":")) s0 = s0.substring(1);
				var name = s0.substring(0, s0.indexOf(":"));
				var id = s0.substring(s0.indexOf(":") + 1);
				var emoji = client.emojis.cache.get(id);
				if(emoji) {
					result += "<img class=\"emoji\" src=\"" + emoji.url + "\" style=\"max-width: 32px; max-height: 38px\" title=\":" + emoji.name + ":\">";
					parsed = true;
				}
			}
			if(!parsed) {
				if(wl_tags.includes(s)) {
					result += "<" + s + ">";
				} else {
					result += "&lt;" + s.replaceAll("<", "lt") + "&gt;";
				}
			}
			i += s.length + 1;
		} else if(char == ">") {
			result += "&gt;";
		} else if(char == "&") {
			result += "&amp;";
		} else if(char == "\n") {
			result += "<br>\n";
		} else {
			result += char;
		}
	}
	return result;
}