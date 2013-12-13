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

		/*
		this.render = function(renderer) {

			for(var key in _batches) {

				var batch = _batches[key];
				var material = batch.material;

				if(material == undefined)
					continue;

				var success = renderer.setMaterial(material);

				if(!success) {
					console.log("Material is not ready.");
					continue;
				}

				for(var i = 0; i < batch.objects.length; i++) {

					batch.objects[i].render(renderer._gl);
					
				}

			}
			
		};
		*/

	};

	Scene.prototype.getRenderList = function() {
		
		if(!_needsUpdate)
			return _renderList;

		_renderList = [];

		for(var key in _batches) {

			var batch = _batches[key];
			var material = batch.material;

			if(material == undefined)
				continue;

			_renderList.concat(batch.objects);

		}

		return _renderList;

	};

	return Scene;

})();