Craft.VoxelScene = (function () {
	
	var VoxelScene = function (params) {

		params = assignDefault(params, {});

		var _chunkSize = assignDefault(params.chunkSize, 16),
		_blockSize = assignDefault(params.blockSize, 1),
		_chunks = [];

	};

	return VoxelScene;

})();