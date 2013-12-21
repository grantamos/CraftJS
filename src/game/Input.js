Craft.Input = (function() {

	var Input = function(params) {

		params = params !== undefined ? params : {};

		var _this = this;

		this.keyPress = {};
		this.keyDown = {};
		this.keyUp = {};

		this.domElement = params.domElement;
		this.domElement.onkeydown = function(evt) {_this.onKeyDown(evt)};
		//this.domElement.onkeypress = function(evt) {_this.onKeyPress(evt)};
		this.domElement.onkeyup = function(evt) {_this.onKeyUp(evt)};

	};

	Input.prototype.onKeyDown = function(evt) {
		evt = evt || window.event;
		var charCode = evt.keyCode || evt.which;
		var charStr = String.fromCharCode(charCode).toLowerCase();
		
		this.keyDown[charStr] = true;
	};

	/*
	Input.prototype.onKeyPress = function(evt) {
		evt = evt || window.event;
		var charCode = evt.keyCode || evt.which;
		var charStr = String.fromCharCode(charCode);

		console.log("Press " + charStr);

		this.keyPress[charStr] = true;
		this.keyDown[charStr] = false;
	};
	*/

	Input.prototype.onKeyUp = function(evt) {
		evt = evt || window.event;
		var charCode = evt.keyCode || evt.which;
		var charStr = String.fromCharCode(charCode).toLowerCase();

		this.keyUp[charStr] = true;
		this.keyPress[charStr] = false;
		this.keyDown[charStr] = false;
	};

	Input.prototype.getKeyDown = function(key) {
		return this.keyDown[key] == true;
	};

	Input.prototype.getKey = function(key) {
		return this.keyPress[key] == true;
	};

	Input.prototype.getKeyUp = function(key) {
		return this.keyUp[key] == true;
	};

	return Input;

})();