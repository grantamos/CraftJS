Craft.Chunk = (function () {
	
	var Chunk = function (params) {

		params = params !== undefined ? params : {};

		Craft.Object3D.call(this, params);

		var _size = assignDefault(params.size, 16),
		_blockSize = 1,
		_blocks,
		_mesh,
		_vertices = [],
		_vertexIndices = [],
		_this = this;

		var createChunk = function () {
			_blocks = new Array();

			for (var x = 0; x < _size; x++) {
				
				_blocks[x] = new Array();

				for (var y = 0; y < _size; y++) {
					
					_blocks[x][y] = new Array();

					for (var z = 0; z < _size; z++) {

						_blocks[x][y][z] = new Craft.Block();

					}
				}
			}
		};

		var buildMesh = function () {

			for (var x = 0; x < _size; x++) {

				for (var y = 0; y < _size; y++) {

					for (var z = 0; z < _size; z++) {

						var block = _blocks[x][y][z];
						
						if(block !== undefined && block.isActive()) {
							var xPos, xNeg, yPos, yNeg, zPos, zNeg;

							xPos = x == _size - 1 || !_blocks[x+1][y][z].isActive();
							xNeg = x == 0 || !_blocks[x-1][y][z].isActive();
							yPos = y == _size - 1 || !_blocks[x][y+1][z].isActive();
							yNeg = y == 0 || !_blocks[x][y-1][z].isActive();
							zPos = z == _size - 1 || !_blocks[x][y][z+1].isActive();
							zNeg = z == 0 || !_blocks[x][y][z-1].isActive();

							addCube(
								x*_blockSize, y*_blockSize, z*_blockSize,
								xNeg, xPos,
								yNeg, yPos,
								zNeg, zPos
							);
						}

					};

				};

			};

			_mesh = new Craft.Mesh({
				vertices: _vertices,
				vertexIndices: _vertexIndices
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

		createChunk();
		buildMesh();

	};

	Chunk.prototype = new Craft.Object3D();

	return Chunk;

})();
