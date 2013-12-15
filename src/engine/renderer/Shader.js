Craft.Shader = (function () {
	
	var Shader = function (params) {

		params = params !== undefined ? params : {};

		var _content,
		_url = params.url,
		_type = params.type,
		_shader;

		var fetchContent = function() {
		
			var xmlhttp = Craft.getXMLHTTP();

			xmlhttp.onreadystatechange = function() {

				if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 0)) {
					
					_content = xmlhttp.responseText;
				
				}

			};

			xmlhttp.open("GET", _url, true);
			xmlhttp.send();

		};

		this.getType = function() {

			return _type;

		}

		this.getContent = function() {

			return _content;
		
		};

		this.getShader = function() {
			return _shader;
		}

		this.setShader = function (shader) {
			
			_shader = shader;

		};

		this.hasContent = function() {

			return _content != undefined;

		};

		this.isInitialized = function() {
			return this.hasContent() && _shader != undefined;
		};

		fetchContent();

	};

	return Shader;

})();