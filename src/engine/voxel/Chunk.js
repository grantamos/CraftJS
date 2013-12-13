Craft.Chunk = (function () {
	
	var Chunk = function (params) {

		params = params !== undefined ? params : {};

		var _size = assignDefault(params.size, 16),
		_blocks;

		createChunk();

		var createChunk = function () {
			_blocks = new Array();

			for (var x = 0; x < _size; x++) {
				
				_blocks[x] = new Array();

				for (var y = 0; y < _size; y++) {
					
					_blocks[i][j] = new Array();

					for (var z = 0; z < _size; z++) {

						_blocks[i][j][z] = new Craft.Block();

					};

				};

			};

		};

		var buildMesh = function () {

			_vertexBuffer = ;

			for (var x = 0; x < _size; x++) {

				for (var y = 0; y < _size; y++) {

					for (var z = 0; z < _size; z++) {

						var block = _blocks[i][j][z];
						
						if(block !== undefined && block.isActive()) {
							addCube(x, y, z);
						}

					};

				};

			};

		};

	};

	return Chunk;

});