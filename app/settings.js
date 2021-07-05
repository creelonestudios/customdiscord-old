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
			var tab = e("div");
			tab.className = "settings-tabname";
			tab.innerText = section.tabs[j].name;
			list.appendChild(tab);
		}
	}
	
	settings.appendChild(list);
}

class SettingsTab {
	#e;
	constructor(name) {
		this.name = name;
	}
	
	get labelE() {
		if(this.#e.label) validateLabel();
		return this.#e.label;
	}
	
	function validateLabel() {
		e("div");
		tab.className = "settings-tabname";
		tab.innerText = section.tabs[j].name;
		list.appendChild(tab);
	}
}

class SettingsSection {
	constructor(name, tabs) {
		this.name = name;
		this.tabs = tabs;
	}
}

var settingsTabs = [
	new SettingsSection("User Settings", [
		new SettingsTab("Accounts"),
		new SettingsTab("User Profile"),
		new SettingsTab("Privacy & Safety")
	])
];