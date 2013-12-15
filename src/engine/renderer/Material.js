Craft.Material = (function () {
	
	var Material = function (params) {

		params = params !== undefined ? params : {};

		var _id = Math.uuid(),		
		_fragmentSource,
		_vertexSource,
		_program,
		_this = this;

		this.bindings = {
			uniforms: assignDefault(params.uniforms, {}),
			attributes: assignDefault(params.attributes, {}),
			textureSamplers: assignDefault(params.textureSamplers, {})
		};

		var init = function() {

			fetchContent(params.fragment, function(content){
				_fragmentSource = content;
			});

			fetchContent(params.vertex, function(content){
				_vertexSource = content;
			});

			_this.bindings.attributes.aIndexBuffer = {};
		
			_this.updateBindings();
		};

		var fetchContent = function(url, callback) {
		
			var xmlhttp = Craft.getXMLHTTP();

			xmlhttp.onreadystatechange = function() {

				if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 0)) {
					
					callback(xmlhttp.responseText);
				
				}

			};

			xmlhttp.open("GET", url, true);
			xmlhttp.send();

		};

		this.updateBindings = function() {

			for(var key in this.bindings.uniforms) {

				var uniform = this.bindings.uniforms[key];

				var evalType = 'uniform';
				var isMat = uniform.type == 'mat';

				evalType += isMat ? 'Matrix' : '';

				evalType += uniform.size;
				evalType += (isMat ? 'f' : uniform.type[0]) + 'v';

				uniform.evalType = evalType;
			
			}

			for(var key in this.bindings.attributes) {

				var attribute = this.bindings.attributes[key];

				if(attribute.type == 'array')
					attribute.evalType = 'vertexAttrib'+attribute.size+''+attribute.type[0]+'v';

			}

		};

		this.getFragmentSource = function() {
			return _fragmentSource;
		};

		this.getVertexSource = function() {
			return _vertexSource;
		};

		this.getProgram = function() {
			return _program;
		}

		this.setProgram = function(program) {
			
			_program = program;

			_program.attributes = {};
			_program.uniforms = {
				pMatrix: {},
				mvMatrix: {}
			};
			_program.textureSamplers = {};

			for(var key in this.bindings.uniforms)
				_program.uniforms[key] = {value: undefined};

			for(var key in this.bindings.attributes)
				_program.attributes[key] = {value: undefined};

			for(var key in this.bindings.textureSamplers)
				_program.textureSamplers[key] = {value: undefined};
		};

		this.needsBuild = function() {
			return _program == undefined;
		};

		this.getId = function() {

			return _id;

		};

		init();

	};

	return Material;

})();