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

        //Defaults
        fieldOfView = fieldOfView != undefined ? fieldOfView : 45;
        aspectRatio = aspectRatio !== undefined ? aspectRatio : window.innerWidth/window.innerHeight;
        nearVal = nearVal !== undefined ? nearVal : 0.1;
        farVal = farVal !== undefined ? farVal : 10000;

        mat4.perspective(this.projectionMat, fieldOfView, aspectRatio, nearVal, farVal);

    }

    Camera.prototype = new Craft.Object3D();

    return Camera;

})();
