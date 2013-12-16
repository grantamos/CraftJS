Craft.Entity = (function(){
    function Entity(){
        Craft.Object3D.call(this);
    }

    Entity.prototype = new Craft.Object3D();

    return Entity;
})();
