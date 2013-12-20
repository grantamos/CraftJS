Craft.Object3D = (function () {

    /**
     * Object3D
     *
     * @name Object3D
     * @function
     * @return
     */
    function Object3D(params){

        params = params != undefined ? params : {};

        this.UID = "";

        this.material = params.material;

        this.children = [];

        this.parent = null;

        this.matrix = assignDefault(params.matrix, mat4.create());

        this.position = vec3.fromValues(0, 0, 0);

        this.rotation = vec3.create();

        this.scale = 1.0;

        this.up = vec3.fromValues(0, 1, 0);

        this.lookAt = vec3.fromValues(0, 0, 0);

        this.bounds = new Craft.Bounds(vec3.create(), vec3.create());
	}

    /**
     * add
     *
     * @name add
     * @function
     * @param {Object3D} The obj to be added 
     * @return 
     */
    Object3D.prototype.add = function(obj) {

        this.children.push(obj);
        obj.parent = this;

        if(obj.bounds != undefined)
            this.bounds.encapsulate(obj.bounds);

    };

    /**
     * remove
     *
     * @name remove
     * @function
     * @param {Object3D} obj The object to be removed
     * @return
     */
    Object3D.prototype.remove = function(obj) {
        
        var index = this.children.indexOf(obj);

        if(index != -1) {

            this.children = this.children.splice(index, 1);
            obj.parent = null; 
        }

    };

    /**
     * update
     *
     * @name update Updates objects matrix
     * @function
     * @return
     */
    Object3D.prototype.update = function() {

    };

	Object3D.prototype.look = function(vec) {
	    this.lookAt = vec;
	};

    Object3D.prototype.rotateX = function(x) {
        mat4.rotateX(this.matrix, this.matrix, x);
    };

    Object3D.prototype.rotateY = function(y) {
        mat4.rotateY(this.matrix, this.matrix, y);
    };

    Object3D.prototype.rotateZ = function(z) {
        mat4.rotateZ(this.matrix, this.matrix, z);
    };

    Object3D.prototype.translate = function(x, y, z) {
        mat4.translate(this.matrix, this.matrix, vec3.fromValues(x, y, z));
    };

    Object3D.prototype.getRenderList = function() {
        return this.children;
    };

	return Object3D;

})();
