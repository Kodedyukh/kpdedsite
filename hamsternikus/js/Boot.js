var BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        if (this.game.device.touch) {
            this.input.maxPointers = 2;    
        } else {
            this.input.maxPointers = 1;
        }
        
        this.time.advancedTiming = true;

        

    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', 'assets/images/preloaderBack.png');
        this.load.image('preloaderBar', 'assets/images/preloaderBar.png');
        this.load.image('preloaderBarOverlay', 'assets/images/preloaderBarOverlay.png')

    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going

        // sometimes on load in index can correctly caught inner width and height, so 
        // I duplicated scaling routine in the boot stage
        if (!this.game.device.desktop)
        {
            scaleGame(this.game);
        }

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = false;

        this.scale.pageAlignHorizontally = false;
        //this.scale.fullScreenTarget = document.getElementById('wrapper');
        
        this.scale.refresh();
        this.state.start('Preloader');

        this.scale.onOrientationChange.add(scaleGame, this, 0);

    }

};

scaleGame = function(game) {
    // if called from orientation change event
    if (game.__proto__.constructor===Phaser.ScaleManager) {
        game = game.game;
    }

    /*console.log('orientationchange');
    console.log(game.scale.screenOrientation);
    console.log(window.innerHeight);
    console.log(window.innerWidth);*/
    if (game.scale.screenOrientation==='landscape-primary' || game.scale.screenOrientation==='landscape-secondary') {
        game.time.events.add(500, function() {
            game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;                        
            game.scale.setGameSize(configuration.canvasWidth, configuration.canvasHeight);         
            game.scale.setUserScale(window.innerHeight/game.height, window.innerHeight/game.height);
            game.scale.refresh();
        }, this)
    } else {
        game.time.events.add(500, function() {
            game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;                        
            game.scale.setGameSize(configuration.canvasWidth, configuration.canvasHeight);         
            game.scale.setUserScale(window.innerWidth/game.width, window.innerWidth/game.width);
            game.scale.refresh();
        }, this);
    }
};

/*document.addEventListener("orientationchange", function(event){
    switch(window.orientation) 
    {  
        case -90: case 90:
            
            break; 
        default:
            
            var c=document.getElementById("gameContainer");
            var ctx=c.getContext("2d");
            ctx.rotate(90*Math.PI/180);
    }
});*/



