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
}

class SettingsTab {
	#e;
	constructor(name) {
		this.name = name;
		this.#e = {};
	}
	
	get labelE() {
		if(!this.#e.label) this.validateLabel();
		return this.#e.label;
	}
	
	validateLabel() {
		this.#e.label = e("div");
		this.#e.label.className = "settings-tabname";
		this.#e.label.innerText = this.name;
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
		this.#e = e("div");
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
		new SettingsTab("Accounts"),
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