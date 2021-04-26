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
			if(event.target.classList.contains("category-name")) {
				event.target.parentElement.classList.toggle("category-showchans");
			}
		});
	} else {
		var div1 = document.createElement("div");
		div.appendChild(div1);
		div.className = "channel";
		div1.className = "channel-name";
		//if(channel.id == current_channel) div.className = "channel channel-active"
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
	var embeds = [];
	var attachments = [];
	if(typeof message == "string") {
		authortag = "[Verified] CustomDiscord System";
		author = "System";
		content = unparseMsg(message);
		avatar = "../img/icon_256.png";
	} else if(message.author) {
		authortag = author = message.author.tag;
		author = message.author.tag;
		if(message.member && message.member.nickname) author = message.member.nickname; 
		content = unparseMsg(message.content, message.guild);
		avatar = message.author.displayAvatarURL();
		embeds = message.embeds;
		attachments = message.attachments.array();
	} else return; // error
	var div = document.createElement("div");
	var author_div = document.createElement("div");
	var avatar_div = document.createElement("img");
	var name_div = document.createElement("div");
	var content_div = document.createElement("div");
	var embeds_div = document.createElement("div");
	div.appendChild(author_div);
	div.appendChild(content_div);
	div.appendChild(embeds_div);
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
	//console.log(message)
	for(var i = 0; i < embeds.length; i++) {
		embeds_div.appendChild(createEmbedDiv(embeds[i]));
	}
	//console.log(attachments);
	for(var i = 0; i < attachments.length; i++) {
		embeds_div.appendChild(createAttachmentDiv(attachments[i]));
	}
	return div;
}

function createEmbedDiv(embed) {
	if(!embed) return;
	var div = document.createElement("div");
	if(embed.type == "rich") {
		div.innerHTML = "author: " + embed.author + "<br>color:" + embed.color + " / " + embed.hexColor + "<br>desc: " + embed.description + "<br>fiels: " + embed.fields + "<br>footer: " + embed.footer + "<br>title: " + embed.title;
	} else {
		div.innerText = "Embeds in dev...";
	}
	//console.log(embed);
	return div;
}

function createAttachmentDiv(a) {
	if(!a) return;
	var div = document.createElement("div");
	var handler = () => { 
		var popup = new Popup(a.name, 600, 800, true);
		var img = document.createElement("img");
		var input = document.createElement("input");
		img.src = a.url;
		img.className = "popup-image";
		img.style.display = "block";
		input.type = "button";
		input.className = "popup-image-button";
		input.value = "Open Original";
		input.addEventListener("click", () => {
			window.open(a.url, "_blank");
		});
		popup.content.appendChild(img);
		popup.content.appendChild(input);
		PopupManager.setPopup(popup);
	}
	if(isImageExt(a.name)) {
		if(a.width > 1920 || a.height > 1080) {
			var text = document.createElement("text");
			text.className = "embed-errtxt attachment";
			text.innerHTML = "Refused to load image due to it being too big.<br>Click to view";
			text.addEventListener("click", handler);
			div.appendChild(text);
		} else {
			var img = document.createElement("img");
			img.className = "embed-img attachment";
			img.src = a.url;
			img.addEventListener("click", handler);
			div.appendChild(img);
		}
	} else {
		var text = document.createElement("text");
		text.className = "embed-errtxt attachment";
		text.innerHTML = "Unknown Attachment Type: " + a.name;
		div.appendChild(text);
	}
	//console.log(a);
	return div;
}

function isImageExt(f) {
	return f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".webp");
}