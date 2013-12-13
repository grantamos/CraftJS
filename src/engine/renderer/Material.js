Craft.Material = (function () {
	
	var Material = function (params) {

		params = params !== undefined ? params : {};

		var _id = Math.uuid(),

		_vertexShader = new Craft.Shader({
			url : params.vertex,
			type : 'vertex'
		}),

		_fragmentShader = new Craft.Shader({
			url : params.fragment,
			type : 'fragment'
		}),

		_program,
		_uniforms = assignDefault(params.uniforms, {}),
		_attributes = assignDefault(params.attributes, {}),
		_needsUpdate = true;

		var getFragmentShader = function() {

			return _fragmentShader;

		}

		var getVertexShader = function() {

			return _vertexShader;
			
		}

		this.setProgram = function(program) {

			_program = program;
		
		};

		this.needsUpdate = function() {
			return _program == undefined;
		}

	};

	Material.prototype.getId = function() {

		return this._id;

	}

	Material.prototype.compileProgram = function(renderer) {
		
		this._program = renderer.compileProgram(this._fragmentShader.shader, this._vertexShader.shader);

		if(this._program == undefined)
			return;

		for(var key in this._uniforms) {

			var uniform = this._uniforms[key];

			var evalType = 'uniform';
			var isMat = uniform.type == 'mat';

			evalType += isMat ? 'Matrix' : '';

			evalType += uniform.size;
			evalType += (isMat ? 'f' : uniform.type[0]) + 'v';

			uniform.evalType = evalType;

			uniform.location = renderer._gl.getUniformLocation(this._program, key);
		
		}

		for(var key in this._attributes) {

			var attribute = this._attributes[key];

			if(attribute.type != 'buffer')
				attribute.evalType = 'vertexAttrib'+attribute.size+''+attribute.type[0]+'v';
			
			attribute.location = renderer._gl.getAttribLocation(this._program, key);

		}

		for(var key in this._textureSamplers) {

			var textureSampler = this._textureSamplers[key];

			textureSampler.location = gl.getUniformLocation(this._program, key);

		}
	
	};

	Material.prototype.bind = function(gl) {

		for(var key in this._uniforms) {

			var uniform = this._uniforms[key];

			if(uniform.type == 'mat')
				gl[uniform.evalType](uniform.location, false, uniform.value);
			else
				gl[uniform.evalType](uniform.location, uniform.value);
			
		}

		for(var key in this._attributes) {

			var attribute = this._attributes[key];
			
			if(attribute.type == 'buffer') {

				gl.bindBuffer(gl.ARRAY_BUFFER, attribute.value);
			    gl.vertexAttribPointer(attribute.location, attribute.value.itemSize, gl.FLOAT, false, 0, 0);
			    gl.enableVertexAttribArray(attribute.location);

			} else {
				gl[attribute.evalType](attribute.location, attribute.value);
			}

		}

		var i = 0;
		for(var key in this._textureSamplers) {

			var textureSampler = this._textureSamplers[key];

			var textureType = gl.TEXTURE_2D;

			if(textureSampler.type == 'cube')
				textureType = gl.TEXTURE_CUBE_MAP;

			gl.activeTexture(gl['TEXTURE'+i]);
			gl.bindTexture(textureType, textureSampler.value);
			gl.uniform1i(textureSampler.location, i);
			
			i++;

		}

	};

	return Material;

})();