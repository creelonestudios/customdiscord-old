function generateSettingsView() {
	var settings = $("settings");
	var list = e("div");
	list.id = "settings-list";
	
	for(var i = 0; i < settingsTabs.length; i++) {
		var section = settingsTabs[i];
		list.appendChild(section.e);
		var separator = e("div");
		separator.className = "settings-separator";
		list.appendChild(separator);
	}
	
	settings.appendChild(list);
	
	var main = e("div");
	main.id = "settings-main";
	
	main.appendChild(settingsTabs[0].tabs[0].contentE);
	
	settings.appendChild(main);
}

class SettingsTab {
	#e;
	constructor(name, content) {
		this.name = name;
		this.content = content;
		this.#e = {};
	}
	
	get labelE() {
		if(!this.#e.label) this.validateLabel();
		return this.#e.label;
	}
	
	get contentE() {
		if(!this.#e.content) this.validateContent();
		return this.#e.content;
	}
	
	validateLabel() {
		if(!this.#e.label) this.#e.label = e("div");
		this.#e.label.className = "settings-tabname";
		this.#e.label.innerText = this.name;
	}
	
	validateContent() {
		if(!this.#e.content) this.#e.content = e("div");
		this.#e.content.className = "settings-tab";
		while(this.#e.content.childElementCount > 0) this.#e.content.removeChild(this.#e.content.children[0]);
		addJSONFields(this.#e.content, this.content);
	}
}

class SettingsSection {
	#e;
	constructor(name, tabs) {
		this.name = name;
		this.tabs = tabs;
	}
	
	get e() {
		if(!this.#e) this.validate();
		return this.#e;
	}
	
	validate() {
		if(!this.#e) this.#e = e("div");
		this.#e.className = "settings-section";
		if(this.name) {
			var label = e("div");
			label.className = "settings-section-name";
			label.innerText = this.name;
			this.#e.appendChild(label);
		}
		for(var i = 0; i < this.tabs.length; i++) {
			this.#e.appendChild(this.tabs[i].labelE);
		}
	}
}

var settingsTabs = [
	new SettingsSection("User Settings", [
		new SettingsTab("Accounts", [{type: 0, name: "Erstelle dein Embed."},
						{type: 1, name: "Titel: ", length: -1},
						{type: 1, name: "Beschreibung: ", length: -1},
						{type: 1, name: "Footer", length: -1}]),
		new SettingsTab("User Profile"),
		new SettingsTab("Privacy & Safety")
	]),
	new SettingsSection("App Settings", [
		new SettingsTab("Appearance"),
		new SettingsTab("Accessibility"),
		new SettingsTab("Voice & Video"),
		new SettingsTab("Text & Images"),
		new SettingsTab("Notifications"),
		new SettingsTab("Keybinds"),
		new SettingsTab("Language"),
		new SettingsTab("Streamer Mode"),
		new SettingsTab("Developer Mode"),
	]),
	new SettingsSection("Custom Discord", [
		new SettingsTab("Plugins"),
		new SettingsTab("Themes"),
		new SettingsTab("Soundpacks")
	])
];