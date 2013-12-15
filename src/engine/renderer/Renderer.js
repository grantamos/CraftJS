Craft.Renderer = (function() {

	var Renderer = function(params) {

		params = params != undefined ? params : {};

		var _canvas = params.canvas != undefined ? params.canvas : document.createElement('canvas'),
		_gl,
		_height = _canvas.height,
		_width = _canvas.width,
		_aspectRatio,
		_material,
		_program,
		_renderBackFaces = false,
		_mvMatrix = mat4.identity(mat4.create()),
		_pMatrix,
		_mvMatrixStack = [];

		var mvPushMatrix = function() {
		    var copy = mat4.create();
		    mat4.set(_mvMatrix, copy);
		    _mvMatrixStack.push(copy);
		};

		var mvPopMatrix = function() {
		    if (_mvMatrixStack.length == 0) {
		      return;
		    }
		    _mvMatrix = _mvMatrixStack.pop();
		};

		var initGL = function() {
			var error = "Unknown reason.";

			try {
				_gl = _canvas.getContext('webgl') || _canvas.getContext('experimental-webgl');

				_gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
			    _gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
			    _gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
			} catch(e) {
				error = e;
			}

			if(!_gl) {
				alert("Could not initialize WebGL: " + error);
			}
		};

		var bufferData = function(buffer, bufferType, bufferData, drawType, isInt) {

			if(buffer == null)
				buffer = _gl.createBuffer();

			if(isInt)
				bufferData = new Uint16Array(bufferData);
			else
				bufferData = new Float32Array(bufferData)

			_gl.bindBuffer(bufferType, buffer);
			_gl.bufferData(bufferType, bufferData, drawType);

			return buffer;

		};

		var createProgram = function(fragmentSource, vertexSource) {

			if(fragmentSource == undefined || vertexSource == undefined)
				return null;

			var fragmentShader = _gl.createShader(_gl.FRAGMENT_SHADER);
			var vertexShader = _gl.createShader(_gl.VERTEX_SHADER);

			_gl.shaderSource(fragmentShader, fragmentSource);
			_gl.compileShader(fragmentShader);

			if (!_gl.getShaderParameter(fragmentShader, _gl.COMPILE_STATUS)) {
				alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(fragmentShader));
				return null;
			}

			_gl.shaderSource(vertexShader, vertexSource);
			_gl.compileShader(vertexShader);

			if (!_gl.getShaderParameter(fragmentShader, _gl.COMPILE_STATUS)) {
				alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(vertexShader));
				return null;
			}

			var program = _gl.createProgram();

			_gl.attachShader(program, fragmentShader);
			_gl.attachShader(program, vertexShader);

			_gl.linkProgram(program);

			if (!_gl.getProgramParameter(program, _gl.LINK_STATUS)) {
				alert("Unable to initialize the shader program.");
				return null;
			}

			return program;

		};

		var setMaterial = function(material) {

			if(material == undefined)
				return false;

			if(_material != undefined && material.getId() == _material.getId())
				return true;

			var program = material.getProgram();
			var bindings = material.bindings;

			if(program == undefined) {
				
				program = createProgram(material.getFragmentSource(), material.getVertexSource());
				
				if(program == undefined)
					return false;

				material.setProgram(program);
				getBindingLocations(program);
			}

			_material = material;
			_program = program;

			_gl.useProgram(_program);

			if(_pMatrix != undefined && _program.uniforms.pMatrix != undefined) {
				_gl.uniformMatrix4fv(_program.uniforms.pMatrix.location, false, _pMatrix);
			}

			bind(bindings);

			return true;
		};

		var getBindingLocations = function(program) {

			for(var key in program.uniforms) {
				program.uniforms[key].location = _gl.getUniformLocation(program, key);
			};

			for(var key in program.attributes) {
				program.attributes[key].location = _gl.getAttribLocation(program, key);
			};

			for(var key in program.textureSamplers) {
				program.textureSamplers[key].location = _gl.getUniformLocation(program, key);
			};

		};

		var bind = function(bindings) {

			if(bindings.uniforms != undefined)
				bindUniforms(bindings.uniforms);

			if(bindings.attributes != undefined)
				bindAttributes(bindings.attributes);

			if(bindings.textureSamplers != undefined)
				bindTextureSamplers(bindings.textureSamplers);

		};

		var bindUniforms = function(uniforms) {

			for(var key in uniforms) {

				var programUniform = _program.uniforms[key];

				if(programUniform != undefined)
					bindUniform(uniforms[key], programUniform);
			}

		};

		var bindUniform = function(uniform, programUniform) {

			if(uniform.value == undefined || uniform.value == programUniform.value)
				return;

			if(uniform.type == 'mat')
				gl[uniform.evalType](programUniform.location, false, uniform.value);
			else
				gl[uniform.evalType](programUniform.location, uniform.value);

			currentUniform.value = uniform.value;

		};

		var bindAttributes = function(attributes) {

			for(var key in attributes) {

				var programAttribute = _program.attributes[key];

				if(programAttribute != undefined)
					bindAttribute(attributes[key], programAttribute);
			}

		};

		var bindAttribute = function(attribute, programAttribute) {

			if(attribute.value == undefined || programAttribute.value == attribute.value)
				return;

			if(attribute.type == 'array') {

				_gl[attribute.evalType](programAttribute.location, attribute.value);

			} else {

				if(attribute.buffer == undefined || attribute.isDirty) {
					attribute.buffer = bufferData(
						null,
						_gl[attribute.type],
						attribute.value,
						_gl.DYNAMIC_DRAW,
						attribute.isInt
					);
				}

				_gl.bindBuffer(_gl[attribute.type], attribute.buffer);

				if(attribute.type != "ELEMENT_ARRAY_BUFFER") {
			    	_gl.vertexAttribPointer(programAttribute.location, attribute.itemSize, _gl.FLOAT, false, 0, 0);
			    	_gl.enableVertexAttribArray(programAttribute.location);
			    }

			}

			programAttribute.value = attribute.value;

		};

		var bindTextureSamplers = function(textureSamplers) {

			var i = 0;

			for(var key in textureSamplers) {
				
				var programSampler = _program.textureSamplers[key];

				if(programSampler != undefined) {
					
					bindTextureSampler(textureSampler, i, programSampler);
					i++;
				}
			}

		};

		var bindTextureSampler = function(textureSampler, index, programSampler) {

			if(textureSampler.value == undefined || textureSampler.value == programSampler.value)
				return;

			var textureType = gl.TEXTURE_2D;

			if(textureSampler.type == 'cube')
				textureType = gl.TEXTURE_CUBE_MAP;

			gl.activeTexture(gl['TEXTURE'+index]);
			gl.bindTexture(textureType, textureSampler.value);
			gl.uniform1i(programSampler.location, index);

		};

		var bindObject = function(renderable) {

			if(renderable.bindings == undefined || _program == undefined)
				return;

			bind(renderable.bindings);

		};

		var renderObject = function(renderable) {

			if(!(renderable instanceof Craft.Mesh))
				return;

			if(_renderBackFaces)
				_gl.disable(gl.CULL_FACE);

			_gl.drawElements(_gl.TRIANGLES, renderable.numItems, _gl.UNSIGNED_SHORT, 0);

			if(_renderBackFaces)
				_gl.enable(_gl.CULL_FACE);

		};

		var renderNode = function(node) {

			if(node.getRenderList == undefined) {
				return;
			}

			var list = node.getRenderList();

			for(var i = 0; i < list.length; i++) {

				var childeNode = list[i];
				var material;
				
				if(childeNode.getMaterial != undefined) {
					material = childeNode.getMaterial();
					setMaterial(material);
				}

				if(childeNode.getModelMatrix != undefined) {
					mvPushMatrix();
					mat4.multiply(_mvMatrix, childeNode.getModelMatrix(), _mvMatrix);
				}

				if(_material != undefined) {
					bindObject(childeNode);
					renderObject(childeNode);
				}

				renderNode(childeNode);

				if(childeNode.getModelMatrix != undefined)
					mvPopMatrix();

			}

		};

		this.render = function(scene, camera) {

			_gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);

			mvPushMatrix(camera.getViewMatrix());
			_pMatrix = camera.getPerspectiveMatrix();

			renderNode(scene);

			_pMatrix = null;
		
		};

		this.setSize = function(width, height) {

			_width = width;
			_height = height;
			
			_aspectRatio = _width / _height;
			this.aspectRatio = _aspectRatio;

			_canvas.width = _width;
			_canvas.height = _height;

			if(_gl != undefined)
				_gl.viewport(0, 0, _width, _height);

		};

		this.context = _gl;
		this.domElement = _canvas;
		this.aspectRatio = this._aspectRatio;

		initGL();

	};

	return Renderer;

})();