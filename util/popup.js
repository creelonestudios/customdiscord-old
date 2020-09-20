class Popup {
	constructor(title, width, height, darken) {
		this.title = title || "Popup";
		this.width = width || 50;
		this.height = height || 50;
		this.darken = darken || false;
		this.content = document.createElement("div");
		this.noTitle = false;
	}
	
	genDiv() {
		var div = document.createElement("div");
		var div1 = document.createElement("div");
		if(!this.noTitle) div.appendChild(div1);
		div.appendChild(this.content);
		div.className = "popup";
		div.style.width = this.width + "px";
		div.style.height = this.height + "px";
		this.content.className = "popup-content";
		var n = 0;
		if(this.noTitle) n = 62;
		this.content.style.maxHeight = (this.height-96+n) + "px";
		this.content.style.height = (this.height-96+n) + "px";
		div1.className = "popup-title";
		div1.innerText = this.title || "Popup";
		return div;
	}
}

class PopupManager {
	static activePopup = null;
	
	constructor() {
		
	}
	
	static init() {
		$("popups").addEventListener("click", (event) => {
			if(event.target == $("popups")) {
				PopupManager.closePopup();
			}
		});
	}
	
	static setPopup(popup) {
		var div = $("popups");
		for(var i = 0; i < div.children.length; i++) { div.removeChild(div.children[i]) }
		PopupManager.activePopup = popup;
		PopupManager.updatePopup();
	}
	
	static updatePopup() {
		var div = $("popups");
		var popup = PopupManager.activePopup;
		if(popup) {
			if(popup.darken) div.className = "darken";
			else div.className = "";
			div.style.display = "block";
			div.appendChild(popup.genDiv());
		}
	}
	
	static closePopup() {
		var div = $("popups");
		for(var i = 0; i < div.children.length; i++) { div.removeChild(div.children[i]) }
		div.style.display = "none";
		PopupManager.activePopup = null;
	}
}

class JSONPopup extends Popup {
	constructor(json) {
		super("Popup", 600, 800, true);
		this.fields = [];
		if(json && json instanceof Object) {
			console.log(json);
			this.noTitle = !json.title || !json.title.trim();
			if(json.title && json.title.trim()) {
				this.title = json.title.trim();
			}
			var fields = json.fields;
			if(fields && fields instanceof Array) {
				for(var i = 0; i < fields.length || i > 20; i++) {
					var f = fields[i];
					var type = Number(f.type) || 0;
					var name = f.name || "";
					name = name.trim() || "Unnamed field";
					var elem;
					var field = {};
					field.type = type;
					if(type == 1) field.length = f.length || 0;
					if(type == 2) {
						field.min = Number(f.min) || 0;
						field.max = Number(f.max) || 10;
					}
					if(type == 0) {
						elem = document.createElement("div");
						elem.className = "popup-json-field";
						elem.innerText = name;
						field.e = elem;
						field.type = 0;
						this.fields.push(field);
					} else {
						elem = document.createElement("div");
						elem.className = "popup-json-field";
						if(f.list) {
							var len = f.list.length || 1;
							var max = f.list.max || len;
							if(len < 1 || len > 5) len = 1;
							if(max < 1 || max > 10) max = 1;
							var items = [];
							var desc = document.createElement("text");
							desc.innerText = name;
							var container = document.createElement("div");
							container.classList = "popup-json-items";
							for(var j = 0; j < len; j++) {
								var itemDiv = document.createElement("div");
								var input = document.createElement("input");
								var desc1 = document.createElement("text");
								input.value = f.default || "";
								if(type == 1) {
									input.type = "text";
									input.addEventListener("keyup", () => {
										console.log(input.value);
									});
								}
								else if(type == 2) {
									input.type = "number";
									input.min = Number(f.min) || 0;
									input.max = Number(f.max) || 10;
									input.step = Number(f.step) || 1;
								}
								else if(type == 3) {
									if(f.list.radio) {
										input.type = "radio";
									} else {
										input.type = "checkbox";
									}
									if(f.list.names) {
										var d = f.list.names[j] || "";
										d = d.trim() || "Unnamed item";
										desc1.innerText = d;
									}
								}
								input.name = "item-" + i;
								itemDiv.appendChild(input);
								if(desc1) itemDiv.appendChild(desc1);
								itemDiv.className = "popup-json-item";
								container.appendChild(itemDiv);
								items.push(container);
							}
							field.items = items;
							elem.appendChild(desc);
							elem.appendChild(container);
							/*if(type != 3) {
								var btn = document.createElement("input");
								btn.type = "button";
								btn.className = "popup-json-addbutton";
								btn.value = "+";
								btn.addEventListener("click", (event) => {
									var items = event.target.parentElement.children[1];
									console.log(items);
									var item = document.createElement("div");
								});
								elem.appendChild(btn);
							}*/ /* gonna do this later */
							field.list = true;
							field.e = elem;
							this.fields.push(field);
						} else {
							var desc = document.createElement("text");
							desc.innerText = name;
							elem.appendChild(desc);
							if(type < 4) {
								var input = document.createElement("input");
								input.value = f.default || "";
								if(type == 1) {
									input.type = "text";
									input.addEventListener("keyup", () => {
										if(input.value.length > field.length && field.length > 0) {
											input.value = input.value.substr(0, field.length);
										}
									});
								}
								else if(type == 2) {
									input.type = "number";
									input.min = Number(f.min) || 0;
									input.max = Number(f.max) || 10;
									input.step = Number(f.step) || 1;
								}
								else if(type == 3) input.type = "checkbox";
								elem.appendChild(input);
								field.e = input;
							} else if(type == 4) {
								var select = document.createElement("select");
								if(f.options && f.options instanceof Array) {
									for(var j = 0; j < f.options.length; j++) {
										var option = document.createElement("option");
										option.innerText = f.options[j];
										select.appendChild(option);
									}
								}
								if(f.default) {
									select.value = f.default;
								}
								elem.appendChild(select);
								field.e = select;
							}
							this.fields.push(field);
							field.list = false;
						}
					}
					this.content.appendChild(elem);
				}
				var submitBtn = document.createElement("input");
				submitBtn.type = "button";
				submitBtn.className = "popup-json-submit";
				var s = json.submit || "";
				s = s.trim() || "Submit";
				submitBtn.value = s;
				submitBtn.addEventListener("click", () => {
					var popup = PopupManager.activePopup;
					if(popup) {
						popup.submit();
					} else {
						PopupManager.closePopup();
					}
				})
				this.content.appendChild(submitBtn);
			}
		}
	}
	
	submit() {
		console.log("Submitted!");
	}
}