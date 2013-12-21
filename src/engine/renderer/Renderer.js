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
		_mvMatrix = mat4.create(),
		_nMatrix = mat4.create(),
		_cMatrix,
		_pMatrix,
		_mvMatrixStack = [];

		var mvPushMatrix = function() {
		    var copy = mat4.create();
		    mat4.copy(copy, _mvMatrix);
		    _mvMatrixStack.push(copy);
		};

		var mvPopMatrix = function() {
		    if (_mvMatrixStack.length === 0) 
		      return;

		    _mvMatrix = _mvMatrixStack.pop();
		};

		var multiplyMvMatrix = function(matrix) {
			mvPushMatrix(_mvMatrix);
			_mvMatrix = mat4.multiply(_mvMatrix, _mvMatrix, matrix);
		};

		var initGL = function() {
			var error = "Unknown reason.";

			try {
				_gl = _canvas.getContext('webgl') || _canvas.getContext('experimental-webgl');

				_gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
			    _gl.enable(_gl.DEPTH_TEST);                               // Enable depth testing
			    _gl.depthFunc(_gl.LEQUAL);                                // Near things obscure far things
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
				bufferData = new Float32Array(bufferData);

			_gl.bindBuffer(bufferType, buffer);
			_gl.bufferData(bufferType, bufferData, drawType);

			return buffer;

		};

		var createShader = function(shaderSource, shaderType) {

			if(shaderSource == undefined)
				return null;

			var shader = _gl.createShader(shaderType);

			_gl.shaderSource(shader, shaderSource);
			_gl.compileShader(shader);

			if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
				alert("An error occurred compiling the shaders: " + _gl.getShaderInfoLog(shader));
				return null;
			}

			return shader;

		};

		var createProgram = function(fragmentSource, vertexSource, bindings) {

			var fragmentShader = createShader(fragmentSource, _gl.FRAGMENT_SHADER);
			var vertexShader = createShader(vertexSource, _gl.VERTEX_SHADER);

			if(fragmentShader == undefined || vertexShader == undefined)
				return null;

			var program = _gl.createProgram();

			_gl.attachShader(program, fragmentShader);
			_gl.attachShader(program, vertexShader);

			_gl.linkProgram(program);

			if (!_gl.getProgramParameter(program, _gl.LINK_STATUS)) {
				alert("Unable to initialize the shader program.");
				return null;
			}

			initBindings(program, bindings);

			return program;

		};

		var setMaterial = function(material) {

			if(_material != undefined && material.id == _material.id)
				return false;

			var program = material.program;
			var bindings = material.bindings;

			if(program == undefined) {
				program = createProgram(material.fragmentSource, material.vertexSource, bindings);
				
				if(program == undefined)
					return false;

				material.program = program;
			}

			_material = material;
			_program = program;

			_gl.useProgram(_program);

			bind(bindings);

			return true;
		};

		var initBindings = function(program, bindings) {

			for(var key in bindings.uniforms) {

				var uniform = bindings.uniforms[key];

				var glType = 'uniform';

				switch(uniform.type) {
					case "mat":
						glType += 'Matrix' + uniform.size + "fv";
						break;
					case "int":
						glType += uniform.size + 'iv';
						break;
					case "float":
						glType += uniform.size + 'fv';
						break;
					default:
                        break;
				}

				uniform.glType = glType;

				uniform.location = _gl.getUniformLocation(program, key);
			}

			for(key in bindings.attributes) {

				var attribute = bindings.attributes[key];

				if(attribute.type == 'array')
					attribute.glType = 'vertexAttrib'+attribute.size+''+attribute.type[0]+'v';

				attribute.location = _gl.getAttribLocation(program, key);
			}

			for(key in bindings.textureSamplers) {
				bindings.textureSamplers[key].location = _gl.getUniformLocation(program, key);
			}

		};

		var bind = function(bindings) {

			if(_material == undefined || _program == undefined)
				return;

			if(bindings.uniforms != undefined)
				bindUniforms(bindings.uniforms);

			if(bindings.attributes != undefined)
				bindAttributes(bindings.attributes);

			if(bindings.textureSamplers != undefined)
				bindTextureSamplers(bindings.textureSamplers);

		};

		var bindUniforms = function(uniforms) {

			for(var key in uniforms) {

				if(_material.bindings.uniforms[key] == undefined)
					continue;

				bindUniform(key, uniforms[key].value);
			}
		};

		var bindUniform = function(key, value) {

			var uniform = _material.bindings.uniforms[key];

			if(value == undefined || value == uniform.value)
				return;

			if(uniform.type == 'mat')
				_gl[uniform.glType](uniform.location, false, value);
			else
				_gl[uniform.glType](uniform.location, value);

			uniform.value = value;

		};

		var bindAttributes = function(attributes) {

			for(var key in attributes) {

				if(_material.bindings.attributes[key] == undefined)
					continue;

				bindAttribute(key, attributes[key]);
			}

		};

		var bindAttribute = function(key, attribute) {

			var materialAttribute = _material.bindings.attributes[key];

			if(attribute.value == undefined || attribute.value == materialAttribute.value)
				return;

			if(attribute.type == 'array') {

				_gl[attribute.glType](materialAttribute.location, attribute.value);

			} else {

				if(attribute.buffer == undefined) {
					attribute.buffer = bufferData(
						null,
						_gl[attribute.type],
						attribute.value,
						_gl.STATIC_DRAW,
						attribute.isInt
					);
				}

				_gl.bindBuffer(_gl[attribute.type], attribute.buffer);

				if(attribute.type != "ELEMENT_ARRAY_BUFFER") {
			    	_gl.vertexAttribPointer(materialAttribute.location, attribute.itemSize, _gl.FLOAT, false, 0, 0);
			    	_gl.enableVertexAttribArray(materialAttribute.location);
			    }

			}

			materialAttribute.value = attribute.value;

		};

		var bindTextureSamplers = function(textureSamplers) {

			var i = 0;

			for(var key in textureSamplers) {

				if(_material.bindings.textureSamplers[key] == undefined)
					continue;
					
				bindTextureSampler(key, textureSamplers[key], i);
				i++;
			}

		};

		var bindTextureSampler = function(key, textureSampler, index) {

			if(textureSampler.value == undefined || textureSampler.value == _material.bindings.textureSamplers[key].value)
				return;

			var textureType = _gl.TEXTURE_2D;

			if(textureSampler.type == 'cube')
				textureType = _gl.TEXTURE_CUBE_MAP;

			_gl.activeTexture(_gl['TEXTURE'+index]);
			_gl.bindTexture(textureType, textureSampler.value);
			_gl.uniform1i(textureSampler.location, index);

			_material.bindings.textureSamplers[key].value = textureSamplers.value;

		};

		var bindObject = function(item) {

			if(item.bindings == undefined || _program == undefined)
				return;

			//console.time("bindObject");
			bind(item.bindings);
			//console.timeEnd("bindObject");

		};

		var renderObject = function(item) {

			if(!(item instanceof Craft.Mesh))
				return;

			//console.time("renderObject");

			if(_renderBackFaces)
				_gl.disable(gl.CULL_FACE);

			multiplyMvMatrix(_cMatrix);

			//var pMatrixBinding = _material.bindings.uniforms.uPMatrix;

			bindUniform('uPMatrix', _pMatrix);
			bindUniform('uMVMatrix', _mvMatrix);

			mat4.invert(_nMatrix, _mvMatrix);
			mat4.transpose(_nMatrix, _nMatrix);

			bindUniform('uNMatrix', _nMatrix);

			/*
			if(_pMatrix != undefined && pMatrixBinding != undefined) {
				_gl.uniformMatrix4fv(pMatrixBinding.location, false, _pMatrix);
			}

			var mvMatrixBinding = _material.bindings.uniforms.uMVMatrix;
			if(_mvMatrix != undefined && mvMatrixBinding != undefined) {
				_gl.uniformMatrix4fv(mvMatrixBinding.location, false, _mvMatrix);
			}
			*/

			_gl.drawElements(_gl.TRIANGLES, item.numItems, _gl.UNSIGNED_SHORT, 0);

			mvPopMatrix();

			if(_renderBackFaces)
				_gl.enable(_gl.CULL_FACE);

			//console.timeEnd("renderObject");
		};

		var renderObjects = function(objects, camera) {

			if(objects == undefined)
				return;

			for(var i = 0; i < objects.length; i++) {

				var child = objects[i];
				var material = child.material;
				
				if(material != undefined) {
					//console.time("setMaterial");
					setMaterial(material);
					//console.timeEnd("setMaterial");
				}

				if(child.matrix != undefined) {
					//console.time("multiplyMvMatrix");
					multiplyMvMatrix(child.matrix);
					//console.timeEnd("multiplyMvMatrix");
				}

				if(_material != undefined) {
					bindObject(child);
					renderObject(child);
				}

				if(child.getRenderList != undefined) {
					//console.time("getRenderList");
					renderObjects(child.getRenderList(camera));
					//console.timeEnd("getRenderList");
				}

				if(child.matrix != undefined)
					mvPopMatrix();

			}

		};

		this.render = function(scene, camera) {

			//console.time("renderScene");

			_gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);

			_pMatrix = camera.projectionMat;
			_cMatrix = camera.matrix;

			//multiplyMvMatrix(camera.matrix);
			multiplyMvMatrix(scene.matrix);

			renderObjects(scene.getRenderList(), camera);

			//mvPopMatrix();
			mvPopMatrix();

			//console.timeEnd("renderScene");

			_pMatrix = null;
			_cMatrix = null;
		
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
