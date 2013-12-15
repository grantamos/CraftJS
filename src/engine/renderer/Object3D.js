Craft.Object3D = (function () {

    /**
     * Object3D
     *
     * @name Object3D
     * @function
     * @return
     */
    function Object3D(){
        this.UID = "";

        this.children = [];

        this.parent = null;

        this.matrix = mat4.create();

        this.position = vec3.fromValues(0, 0, 0);

        this.rotation = vec3.create();

        this.scale = 1.0;

        this.up = vec3.fromValues(0, 1, 0);

        this.look = vec3.fromValues(0, 0, 0);
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

	return Object3D;

})();
