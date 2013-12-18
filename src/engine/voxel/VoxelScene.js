Craft.VoxelScene = (function() {

	var VoxelScene = function(params) {

		params = params !== undefined ? params : {};

		Craft.Scene.call(this, params);

		var _numChunks = assignDefault(params.numChunks, 100),
		_this = this;

		var init = function() {

			var mat = new Craft.BasicMaterial();

			for(var i = 0; i < _numChunks; i++) {

				var chunk = new Craft.Chunk({
					material: mat
				});

				_this.add(chunk);

			}

		};

		init();

	};

	VoxelScene.prototype = new Craft.Scene();

	return VoxelScene;

})();