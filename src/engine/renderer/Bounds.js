Craft.Bounds = (function() {

	var Bounds = function(center, size) {
		this.center = center;
		this.size = size;
		this.extents;
		this.max;
		this.min;

		this.update();
	};

	Bounds.prototype.update = function() {
		this.extents = vec3.fromValues(this.size.x / 2, this.size.y / 2,
		                               this.size.z / 2);
		this.max = vec3.fromValues(this.center.x + this.extents.x,
		                           this.center.y + this.extents.y, this.center.z + this.extents.z);
		this.min = vec3.fromValues(this.center.x - this.extents.x,
		                           this.center.y - this.extents.y, this.center.z - this.extents.z);
	};

	Bounds.prototype.containsVec3 = function(vec) {
		return this.containsXYZ(vec.x, vec.y, vec.z);
	};

	Bounds.prototype.containsXYZ = function(x, y, z) {
		return x < this.max.x && x > this.min.x && y < this.max.y && y > this.min.y && z < this.max.z && z > this.min.z;
	};

	Bounds.prototype.intersects = function(bounds) {
		return !(this.max.x < bounds.min.x
			|| this.min.x > bounds.max.x
			|| this.max.y < bounds.min.y
			|| this.min.y > bounds.max.y
			|| this.max.z < bounds.min.z
			|| this.min.z > bounds.max.z);
	};

	Bounds.prototype.encapsulate = function(bounds) {
	};

	return Bounds;

})();
