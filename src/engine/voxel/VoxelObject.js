Craft.VoxelObject = (function () {
	
	var VoxelObject = function (params) {
		
		Craft.Object3D.call(this, params);

		params = params !== undefined ? params : {};

		var _blockData = params.blockData,
		_blockSize = assignDefault(params.blockSize, 1),
		_mesh = null,
		_vertices = [],
		_vertexIndices = [],
		_normals = [],
		_this = this;

		var buildMesh = function () {

			var xSize = _blockData.length;

			var empty = true;
			
			for (var x = 0; x < _blockData.length; x++) {

				var ySize = _blockData[x].length;
				for (var y = 0; y < _blockData[x].length; y++) {

					var zSize = _blockData[x][y].length;
					for (var z = 0; z < _blockData[x][y].length; z++) {

						if(!_blockData[x][y][z])
							continue;

						empty = false;
						
						var xPos, xNeg, yPos, yNeg, zPos, zNeg;

						xPos = x == xSize - 1 || !_blockData[x+1][y][z];
						xNeg = x === 0 || !_blockData[x-1][y][z];
						yPos = y === ySize - 1 || !_blockData[x][y+1][z];
						yNeg = y === 0 || !_blockData[x][y-1][z];
						zPos = z == zSize - 1 || !_blockData[x][y][z+1];
						zNeg = z === 0 || !_blockData[x][y][z-1];

						addCube(
							x*_blockSize, y*_blockSize, z*_blockSize,
							xNeg, xPos,
							yNeg, yPos,
							zNeg, zPos
						);
					}
				}
			}

			if(empty)
				return;

			_mesh = new Craft.Mesh({
				vertices: _vertices,
				vertexIndices: _vertexIndices,
				normals: _normals
			});

			_this.add(_mesh);

		};

		var addCube = function(x, y, z, xNeg, xPos, yNeg, yPos, zNeg, zPos) {

			var startLength = _vertices.length;
			var offset = _vertices.length / 3;

			if(zPos) {
				_vertices.push(
					// Front face
					-_blockSize, -_blockSize,  _blockSize,
					_blockSize, -_blockSize,  _blockSize,
					_blockSize,  _blockSize,  _blockSize,
					-_blockSize,  _blockSize,  _blockSize
				);

				_normals.push(
					0, 0, 1,
					0, 0, 1,
					0, 0, 1,
					0, 0, 1
				);

				_vertexIndices.push(
					0+offset, 1+offset, 2+offset,
					0+offset, 2+offset, 3+offset
				);

				offset += 4;
			}

			if(zNeg) {
				_vertices.push(
					// Back face
					-_blockSize, -_blockSize, -_blockSize,
					-_blockSize,  _blockSize, -_blockSize,
					_blockSize,  _blockSize, -_blockSize,
					_blockSize, -_blockSize, -_blockSize
				);

				_normals.push(
					0, 0, -1,
					0, 0, -1,
					0, 0, -1,
					0, 0, -1
				);

				_vertexIndices.push(
					0+offset, 1+offset, 2+offset,
					0+offset, 2+offset, 3+offset
				);

				offset += 4;
			}
			
			if(yPos) {
				_vertices.push(
					// Top face
					-_blockSize,  _blockSize, -_blockSize,
					-_blockSize,  _blockSize,  _blockSize,
					_blockSize,  _blockSize,  _blockSize,
					_blockSize,  _blockSize, -_blockSize
				);

				_normals.push(
					0, 1, 0,
					0, 1, 0,
					0, 1, 0,
					0, 1, 0
				);

				_vertexIndices.push(
					0+offset, 1+offset, 2+offset,
					0+offset, 2+offset, 3+offset
				);

				offset += 4;
			}

			if(yNeg) {
				_vertices.push(
					// Bottom face
					-_blockSize, -_blockSize, -_blockSize,
					_blockSize, -_blockSize, -_blockSize,
					_blockSize, -_blockSize,  _blockSize,
					-_blockSize, -_blockSize,  _blockSize
				);

				_normals.push(
					0, -1, 0,
					0, -1, 0,
					0, -1, 0,
					0, -1, 0
				);

				_vertexIndices.push(
					0+offset, 1+offset, 2+offset,
					0+offset, 2+offset, 3+offset
				);

				offset += 4;
			}

			if(xPos) {
				_vertices.push(
					// Right face
					_blockSize, -_blockSize, -_blockSize,
					_blockSize,  _blockSize, -_blockSize,
					_blockSize,  _blockSize,  _blockSize,
					_blockSize, -_blockSize,  _blockSize
				);

				_normals.push(
					1, 0, 0,
					1, 0, 0,
					1, 0, 0,
					1, 0, 0
				);

				_vertexIndices.push(
					0+offset, 1+offset, 2+offset,
					0+offset, 2+offset, 3+offset
				);

				offset += 4;
			}

			if(xNeg) {
				_vertices.push(
					// Left face
					-_blockSize, -_blockSize, -_blockSize,
					-_blockSize, -_blockSize,  _blockSize,
					-_blockSize,  _blockSize,  _blockSize,
					-_blockSize,  _blockSize, -_blockSize
				);

				_normals.push(
					-1, 0, 0,
					-1, 0, 0,
					-1, 0, 0,
					-1, 0, 0
				);

				_vertexIndices.push(
					0+offset, 1+offset, 2+offset,
					0+offset, 2+offset, 3+offset
				);

				offset += 4;
			}

			for(var i = startLength; i < _vertices.length; i+=3) {
				_vertices[i] += x;
				_vertices[i+1] += y;
				_vertices[i+2] += z;
			}

		};

		buildMesh();
	};

	VoxelObject.prototype = new Craft.Object3D();

	return VoxelObject;

})();
