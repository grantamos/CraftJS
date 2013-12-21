Craft.Terrain2D = (function() {

	var Terrain2D = function(params) {

		Craft.Object3D.call(this, params);

		params = params !== undefined ? params : {};

		this.seed = 1;
		this.scale = assignDefault(params.scale, 1);
		this.chunksHigh = assignDefault(params.height, 2);
		this.drawDistance = assignDefault(params.drawDistance, 16);
		this.chunkSize = assignDefault(params.chunkSize, 16);
		this.simplexNoise = new SimplexNoise();
		this.material = new Craft.BasicMaterial();

		var _this = this;

		var generateRandomVoxelData = function(x1, y1, z1, size) {

			var data = new Array();
			for (var x = 0; x < size; x++) {
				
				data[x] = new Array();
				for (var y = 0; y < size; y++) {

					data[x][y] = new Array();
					for(var z = 0; z < size; z++) {

						var simplexValue = _this.simplexNoise.noise((x1*size + x)/_this.scale, (z1*size + z)/_this.scale);
						simplexValue = simplexValue + 1;
						simplexValue = simplexValue / 2.0;
						
						data[x][y][z] = simplexValue * _this.chunksHigh * size > y1 * size + y;
					}
				}
			}

			return data;
		};

		var loadVoxelTimeout = function(x, y, z, timeout) {
			setTimeout(function() {
				var voxelData = generateRandomVoxelData(x, y, z, _this.chunkSize);

				var matrix = mat4.create();
				matrix = mat4.translate(matrix, matrix, vec3.fromValues(x * _this.chunkSize, y * _this.chunkSize, z * _this.chunkSize));

				_this.add(new Craft.VoxelObject({
					blockData: voxelData,
					matrix: matrix
				}));
			}, timeout);

		};

		var init = function() {
			for(var x = 0; x < _this.drawDistance; x++) {
				for(var y = 0; y < _this.chunksHigh; y++) {
					for(var z = 0; z < _this.drawDistance; z++) {
						loadVoxelTimeout(x, y, z, x*100);
					}
				}
			}
		};

		init();
	};

	Terrain2D.prototype = new Craft.Object3D();

	return Terrain2D;

})();
