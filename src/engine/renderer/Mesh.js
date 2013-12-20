Craft.Mesh = (function () {
	
	var Mesh = function (params) {

		params = params !== undefined ? params : {};

		this.bindings = {
			uniforms: {},
			attributes: {
				'aVertexPosition': {
					type: 'ARRAY_BUFFER',
					value: params.vertices,
					itemSize: 3,
					isDirty: false
				},
				'aIndexBuffer': {
					type: 'ELEMENT_ARRAY_BUFFER',
					value: params.vertexIndices,
					isInt: true,
					isDirty: false
				},
				'aVertexNormal': {
					type: 'ARRAY_BUFFER',
					value: params.normals,
					itemSize: 3,
					isDirty: false
				}
			},
			textureSamplers: {}
		};

		this.numItems = params.vertexIndices.length;

		if(params.attributes != undefined) {

			for(var key in params.attributes)
				this.bindings.attributes[key] = params.attributes[key];
		}

	};

	return Mesh;

})();