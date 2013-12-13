Craft.Object3D = (function () {

	var Object3D = function(params){

		params = params !== undefined ? params : {};

		this._tMatrix = mat4.create(),
		this._material = params.material != undefined ? params.material : new Craft.Material();

	};

	Object3D.prototype.render = function(gl) {

		if(_vertexBuffer == undefined) {

			_vertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, _vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_vertices), gl.STATIC_DRAW);

			_vertexBuffer.itemSize = 3;
			_vertexBuffer.numItems = _vertices.length / 3;

		}

		if(_vertexIndexBuffer == undefined) {

			_vertexIndexBuffer = gl.createBuffer();

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _vertexIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

			_vertexIndexBuffer.itemSize = 1;
			_vertexIndexBuffer.numItems = indices.length;

		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _vertexIndexBuffer);
		gl.drawElements(gl.TRIANGLES, _vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	};

	Object3D.prototype.getMaterial = function() {
		
		return this._material;

	};

	Object3D.prototype.getProgram = function() {
		
		if(this._material !== undefined)
			return this._material.getProgram();
		else
			return null;

	};

	return Object3D;

})();