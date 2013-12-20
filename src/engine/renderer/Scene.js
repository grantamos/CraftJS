Craft.Scene = (function() {

	var Scene = function(params) {

		Craft.Object3D.call(this);

		params = params !== undefined ? params : {};

		this.batches = { '-1': []};
		this.renderList = [];
		this.needsUpdate = false;

	};

	Scene.prototype = new Craft.Object3D();

	Scene.prototype.add = function(obj) {

		this.needsUpdate = true;

		var mat = obj.material;

		if(mat == undefined) {

			this.batches['-1'].push(obj);

			return;

		}

		var id = mat.id;

		if(this.batches[id] == undefined) {

			this.batches[id] = [];

		}

		this.batches[id].push(obj);

	};

	Scene.prototype.getRenderList = function() {
		
		if(!this.needsUpdate)
			return this.renderList;

		this.renderList = [];

		for(var key in this.batches) {

			if(key == -1)
				continue;
			
			this.renderList = this.renderList.concat(this.batches[key]);

		}

		this.needsUpdate = false;

		return this.renderList;

	};

	return Scene;

})();