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
		avatar = "./img/icon_256.png";
	} else {
		authortag = author = message.author.tag;
		author = message.author.tag;
		if(message.member && message.member.nickname) author = message.member.nickname; 
		content = unparseMsg(message.content, message.guild);
		avatar = message.author.displayAvatarURL();
	}
	var div = document.createElement("div");
	var div1 = document.createElement("div");
	var div2 = document.createElement("div");
	var img3 = document.createElement("img");
	div.appendChild(img3);
	div.appendChild(div1);
	div.appendChild(div2);
	div.className = "message";
	div1.className = "message-author";
	div2.className = "message-content";
	img3.className = "message-avatar";
	div1.innerText = author;
	div1.title = authortag;
	div2.innerHTML = content;
	img3.src = avatar;
	img3.width = img3.height ="64";
	img3.title = authortag;
	return div;
}