Craft.Block = (function () {

	var Block = function (params) {

		params = assignDefault(params, {});

		var _active = assignDefault(params.active, true);

		this.setActive = function (active) {
			_active = active;
		};

		this.isActive = function () {
			return _active;
		};

	};

	Block.prototype.BLOCK_TYPE = {
		BLOCK_TYPE_GRASS: {},
		BLOCK_TYPE_DIRT: {}
	};

	return Block;
	
})();
