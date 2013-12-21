Craft.BasicMaterial = (function () {
	
	var BasicMaterial = function () {

		params = {};

		params.fragment = "plain.fs";
		params.vertex = "plain.vs";
		params.attributes = {
			'aVertexPosition': {
				type: 'ARRAY_BUFFER',
				itemSize: 3
			},
			'aVertexNormal': {
				type: 'ARRAY_BUFFER',
				itemSize: 3
			},
			'aIndexBuffer': {
				type: 'ELEMENT_ARRAY_BUFFER',
				isInt: true
			}
		};

		params.uniforms = {
			'uPMatrix': {
				type: 'mat',
				size: 4
			},
			'uMVMatrix': {
				type: 'mat',
				size: 4
			},
			'uNMatrix': {
				type: 'mat',
				size: 4
			}
		};

		Craft.Material.call(this, params);
	};

	return BasicMaterial;

})();
