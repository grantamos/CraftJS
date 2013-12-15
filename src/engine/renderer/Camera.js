Craft.Camera = (function(){

    /**
     * Camera
     *
     * @name Camera
     * @function
     * @param {float} fieldOfView Camera fov
     * @param {float} aspectRatio Camera's aspect ratio
     * @param {float} nearVal Dist to near clip plane
     * @param {float} farVal Dist to far clip plane
     * @return
     */
    function Camera(fieldOfView, aspectRatio, nearVal, farVal) {

        Craft.Object3D.call(this);
        
        this.projectionMat = mat4.create();

        mat4.perspective(this.projectionMat, fieldOfView, aspectRatio, nearVal, farVal);

        this.look = vec3.create();

        this.position = vec3.fromValues(0, 0, 0);
    }

    Camera.prototype = new Craft.Object3D();

    /**
     * lookAt
     *
     * @name lookAt
     * @function
     * @param {vec3} target Target vector to look at
     * @return
     */
    Camera.prototype.lookAt = function(target) {
        this.position = target;
    };

    return Camera;

})();
