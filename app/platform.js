var bg = chrome.extension.getBackgroundPage();
var Discord = bg.getDiscordJS();
var client = bg.getDCJSClient();

window.addEventListener("DOMContentLoaded", () => {
	if(!client.user) {
		loginDialogue(token => {
			console.log("Login Dialogue returned token:", token);
			if(token) {
				bg.setToken(token);
				bg.login();
			}
			// reopen loginDialogue
		});
	} else {
		onLoaded();
		
	}
})