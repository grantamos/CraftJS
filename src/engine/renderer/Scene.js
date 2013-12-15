Craft.Scene = (function() {

	var Scene = function(params) {

		params = params !== undefined ? params : {};

		_batches = { '-1': {
			material : null,
			objects : []
		}},
		_renderList = [],
		_needsUpdate = false;

		this.add = function(object) {

			_needsUpdate = true;

			var mat = object.getMaterial();

			if(mat == undefined) {

				_batches['-1'].objects.push(object);

				return;

			}

			var id = mat.getId();

			if(_batches[id] == undefined) {

				_batches[id] = {
					material : mat,
					objects : []
				};

			}

			_batches[id].objects.push(object);

		};

		this.getRenderList = function() {
		
			if(!_needsUpdate)
				return _renderList;

			_renderList = [];

			for(var key in _batches) {

				if(key == -1)
					continue;

				var batch = _batches[key];
				var material = batch.material;

				_renderList = _renderList.concat(batch.objects);

			}

			_needsUpdate = false;

			return _renderList;

		};

	};

	return Scene;

})();