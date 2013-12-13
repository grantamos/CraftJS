Craft.Renderer = (function(){

	var Renderer = function(params) {

		params = params !== undefined ? params : {};

		var _canvas = params.canvas !== undefined ? params.canvas : document.createElement('canvas');

		var _gl,
		_height = _canvas.height,
		_width = _canvas.width,
		_aspectRatio,
		_this = this;

		initGL();

		this.context = _gl;

		this.setSize = function(width, height) {
			_width = width;
			_height = height;
			_aspectRatio = _width / _height;

			_canvas.width = _width;
			_canvas.height = _height;

			_this.aspectRatio = _aspectRatio;
		}

		function initGL() {
			var error = "Unknown reason.";

			try {
				_gl = _canvas.getContext('webgl') || _canvas.getContext('experimental-webgl');
			} catch(e) {
				error = e;
			}

			if(!_gl) {
				alert("Could not initialize WebGL: " + error);
			}
		};

		this.domElement = _canvas;
		this.aspectRatio = _aspectRatio;
	};

	Renderer.prototype.render = function(scene, camera) {
		
	};

	return Renderer;
})();