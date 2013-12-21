Craft.FlyCamera = (function(){

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
    var FlyCamera = function(params) {

        params = assignDefault(params, {});

        Craft.Camera.call(this, params.fieldOfView, params.aspectRatio, params.nearVal, params.farVal);

        this.input = params.input;
        
    }

    FlyCamera.prototype = new Craft.Camera();

    FlyCamera.prototype.update = function(delta) {

        if(this.input.getKeyDown(" "))
            delta *= 4;

        if(this.input.getKeyDown("w"))
            this.translate(0, 0, 20 * delta);

        if(this.input.getKeyDown("s"))
            this.translate(0, 0, -20 * delta);

        if(this.input.getKeyDown("a"))
            this.translate(20 * delta, 0, 0);

        if(this.input.getKeyDown("d"))
            this.translate(-20 * delta, 0, 0);

        if(this.input.getKeyDown("q"))
            this.rotateY(-20 * delta);

        if(this.input.getKeyDown("e"))
            this.rotateY(20 * delta);

        if(this.input.getKeyDown("r"))
            this.translate(0, -20 * delta, 0);

        if(this.input.getKeyDown("f"))
            this.translate(0, 20 * delta, 0);

    };

    return FlyCamera;

})();
