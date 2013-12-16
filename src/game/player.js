Craft.Player = (function(){
    function Player(){
        Craft.Entity.call(this);
    }

    Player.prototype = new Craft.Entity();

    return Player;
})();
