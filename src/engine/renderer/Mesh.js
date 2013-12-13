Craft.Mesh = (function () {
	
	var Mesh = function (params) {

		params = params !== undefined ? params : {};

		var _vertices = assignDefault(params.vertices, []),
		_vertexIndices = assignDefault(params.vertices, []),
		_vertexBuffer,
		_vertexIndexBuffer;

	};

	Mesh.prototype.render = function(renderer) {

		renderer.drawMesh(this);

	};

	return Mesh;

});