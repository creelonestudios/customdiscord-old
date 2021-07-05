function generateSettingsView() {
	var settings = $("settings");
	var list = e("div");
	list.id = "settings-list";
	
	var listTitle = e("div");
	listTitle.id = "settings-title";
	listTitle.innerText = "User Settings";
	list.appendChild(listTitle);
	
	for(var i = 0; i < settingsTabs.length; i++) {
		var section = settingsTabs[i];
		for(var j = 0; j < section.tabs.length; j++) {
			list.appendChild(section.tabs[j].labelE);
		}
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
	}
}

var settingsTabs = [
	new SettingsSection("User Settings", [
		new SettingsTab("Accounts"),
		new SettingsTab("User Profile"),
		new SettingsTab("Privacy & Safety")
	])
];