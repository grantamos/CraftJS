Craft.VoxelScene = (function () {
	
	var VoxelScene = function (params) {

		params = assignDefault(params, {});

		var _numChunks = assignDefault(params.numChunks, 1024);
		_chunkSize = assignDefault(params.chunkSize, 16),
		_blockSize = assignDefault(params.blockSize, 1),
		_chunks = [];

		init();

		var init = function() {

			for(var i = 0; i < _numChunks; i++) {

				_chunks.push(new Craft.Chunk({
					size : _chunkSize
				}));

			}

		}

	};

	return VoxelScene;

})();