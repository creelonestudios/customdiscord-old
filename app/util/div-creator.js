function createChannelDiv(channel) {
	var div = document.createElement("div");
	if(channel.type == "category") {
		var div1 = document.createElement("div");
		div.className = "category";
		div1.className = "category-name";
		div.appendChild(div1);
		div1.innerText = "-- " + channel.name.toUpperCase() + " --";
		var chans = channel.children.array();
		for(var i = 0; i < chans.length; i++) {
			div.appendChild(createChannelDiv(chans[i]));
		}
		div.addEventListener("click", event => {
			if(event.target.className.includes("category")) {
				if(event.target.classList.contains("categoy")) {
					event.target.classList.toggle("category-showchannels");
				} else {
					event.target.parentElement.classList.toggle("category-showchans");
				}
			}
		});
	} else {
		var div1 = document.createElement("div");
		div.appendChild(div1);
		div.className = "channel";
		div1.className = "channel-name";
		if(channel.id == current_channel) div.className = "channel channel-active"
		if(channel.type == "text") {
			div1.innerText = "# " + channel.name;
			div.addEventListener("click", () => {
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
				div.addEventListener("click", () => {
					switchChannel(channel.id);
				});
			}
		} else {
			div1.innerText = "? " + channel.name;
		}
	}
	return div;
}

function createMessageDiv(message) {
	var authortag;
	var author;
	var content;
	var avatar;
	if(typeof message == "string") {
		authortag = "[Verified] CustomDiscord System";
		author = "System";
		content = unparseMsg(message);
		avatar = "../img/icon_256.png";
	} else {
		authortag = author = message.author.tag;
		author = message.author.tag;
		if(message.member && message.member.nickname) author = message.member.nickname; 
		content = unparseMsg(message.content, message.guild);
		avatar = message.author.displayAvatarURL();
	}
	var div = document.createElement("div");
	var author_div = document.createElement("div");
	var avatar_div = document.createElement("img");
	var name_div = document.createElement("div");
	var content_div = document.createElement("div");
	div.appendChild(author_div);
	div.appendChild(content_div);
	author_div.appendChild(avatar_div);
	author_div.appendChild(name_div);
	div.className = "message";
	author_div.className = "message-author";
	avatar_div.className = "message-author-avatar";
	name_div.className = "message-author-name";
	content_div.className = "message-content";
	avatar_div.src = avatar;
	avatar_div.title = authortag;
	name_div.innerText = author;
	name_div.title = authortag;
	content_div.innerHTML = content;
	return div;
}