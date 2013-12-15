Craft.Object3D = (function () {

	var Object3D = function(params){

		params = params !== undefined ? params : {};

		var _tMatrix = mat4.create(),
		_material = params.material != undefined ? params.material : new Craft.Material(),
		_objects = [];

		this.getRenderList = function() {
			return _objects;
		}

		this.addMesh = function(mesh) {
			return _objects.push(mesh);
		};

		this.getMaterial = function() {
			return _material;
		};

		this.getProgram = function() {
		
			if(_material != undefined)
				return _material.getProgram();
			else
				return null;

		};

	};

	return Object3D;

})();