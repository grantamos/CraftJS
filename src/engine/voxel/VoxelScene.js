Craft.VoxelScene = (function() {

	var VoxelScene = function(params) {

		params = params !== undefined ? params : {};

		Craft.Scene.call(this, params);

		var _numChunks = assignDefault(params.numChunks, 100),
		_this = this;

		var init = function() {

			for(var i = 0; i < _numChunks; i++) {

				_this.add(new Craft.Chunk({
					material: new Craft.Material({
						vertex: 'plain.vs',
						fragment: 'plain.fs',
						attributes: {
							'aVertexPosition': {
								type: 'ARRAY_BUFFER'
							}
						}
					})
				}));

			}

		};

		init();

	};

	return VoxelScene;

})();