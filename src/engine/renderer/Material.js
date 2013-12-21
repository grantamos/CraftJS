Craft.Material = (function () {
	
	var Material = function (params) {

		params = params !== undefined ? params : {};

		var _this = this;

		this.id = Math.uuid();
		this.fragmentSource;
		this.vertexSource;
		this.program;

		this.bindings = {
			uniforms: assignDefault(params.uniforms, {}),
			attributes: assignDefault(params.attributes, {}),
			textureSamplers: assignDefault(params.textureSamplers, {})
		};

		var init = function() {

			fetchContent(params.fragment, function(content){
				_this.fragmentSource = content;
			});

			fetchContent(params.vertex, function(content){
				_this.vertexSource = content;
			});
		};

		var fetchContent = function(url, callback) {
		
			var xmlhttp = Craft.getXMLHTTP();

			xmlhttp.onreadystatechange = function() {

				if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status === 0)) {
					callback(xmlhttp.responseText);
				}
			};

			xmlhttp.open("GET", url, true);
			xmlhttp.send();
		};

		init();
	};

	return Material;

})();
