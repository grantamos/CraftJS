Craft.Renderer = (function(){

	var Renderer = function(params) {

		params = params !== undefined ? params : {};

		var _canvas = params.canvas != undefined ? params.canvas : document.createElement('canvas'),
		_gl,
		_height = _canvas.height,
		_width = _canvas.width,
		_aspectRatio,
		_material,
		_program;

		initGL();

		var initGL = function() {
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

		var setMaterial = function(material) {

			_material = material;

			if(_material.needsUpdate())
				return updateMaterial();

			return true;

		};

		var updateMaterial = function() {

			var vertexShader = _material.getVertexShader();
			var fragmentShader = _material.getFragmentShader();
			var program = _material.getProgram();

			if(vertexShader == undefined || fragmentShader == undefined)
				return false;

			if(vertexShader.hasContent() && !vertexShader.isInitialized()) {
				vertexShader.setShader(compileShader(vertexShader.getContent(), vertexShader.getType()));
			}

			if(fragmentShader.hasContent() && !fragmentShader.isInitialized()) {
				fragmentShader.setShader(compileShader(fragmentShader.getContent(), fragmentShader.getType()));
			}

			program = compileProgram(vertexShader.getShader(), fragmentShader.getShader());
			material.setProgram(program);
			setProgram(program);

			return program != undefined;

		};

		var compileShader = function(content, type) {
		
			var shader;

			if(type == 'fragment')
				shader = _gl.createShader(_gl.FRAGMENT_SHADER);

			else if(type == 'vertex')
				shader = _gl.createShader(_gl.VERTEX_SHADER);

			_gl.shaderSource(shader, content);
			_gl.compileShader(shader);

			if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
				alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));    
			}

			return shader;

		};

		var compileProgram = function(fragment, vertex) {

			if(fragment == undefined || vertex == undefined)
				return null;
			
			var program = _gl.createProgram();

			_gl.attachShader(program, fragment);
			_gl.attachShader(program, vertex);

			_gl.linkProgram(program);

			if (!_gl.getProgramParameter(program, _gl.LINK_STATUS)) {
				alert("Unable to initialize the shader program.");
			}

			return program;

		};

		var setProgram = function(program) {
		
			_program = program;
			_gl.useProgram(program);

		};

		this.render = function(scene, camera) {

			var renderList = scene.getRenderList();

			for(var i = 0; i < renderList.length; i++) {

				var renderObject = renderList[i];
				var material = renderObject.material;

				if(!setMaterial(material))
					continue;

				bindObject(renderObject);

			}
		
		};

		this.setSize = function(width, height) {

			_width = width;
			_height = height;
			
			_aspectRatio = _width / _height;
			this.aspectRatio = _aspectRatio;

			_canvas.width = _width;
			_canvas.height = _height;

		};

		this.context = _gl;
		this.domElement = _canvas;
		this.aspectRatio = this._aspectRatio;
	};

	return Renderer;
})();