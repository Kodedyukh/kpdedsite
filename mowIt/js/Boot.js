var BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {

        this.input.maxPointers = 1;
        
        this.stage.disableVisibilityChange = false;

    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('mainMenuBackground', 'assets/images/mainMenuBackground.png');
        this.load.image('preloaderBar', 'assets/images/preloaderBar.png');
        this.load.image('preloaderBarBack', 'assets/images/preloaderBarBack.png');
        this.load.image('playlandscape', 'assets/images/playlandscape.png');
        this.load.image('smgSplash', 'assets/images/cmgSplash.jpg');

    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
         if (!this.game.device.desktop)
        {
            scaleGame(this.game);
        }

        this.scale.pageAlignHorizontally = true;
        this.scale.fullScreenTarget = document.getElementById('wrapper');
        if (!this.game.device.desktop) {
            this.scale.forceOrientation(true, false);
            this.scale.enterIncorrectOrientation.add(handleIncorrect, this);
            this.scale.leaveIncorrectOrientation.add(handleCorrect, this);    
        }
        
        
        this.scale.refresh();

        this.scale.onOrientationChange.add(scaleGame, this, 0);       
        

    },

    update: function() {

        if (!this.scale.incorrectOrientation)
        {
            //console.log(this.scale.incorrectOrientation);
            this.state.start('Preloader');
        }

    },

    updateScale: function() {

    }   

};



handleIncorrect = function() {

    //console.log('handle incorrect called from ');
    //console.log(this);

    var underlayGraphics = this.game.make.graphics();
    underlayGraphics.beginFill(0x44d9bf);
    underlayGraphics.drawRect(0, 0, Math.max(window.innerHeight * devicePixelRatio, window.innerWidth * devicePixelRatio), 
        Math.max(window.innerHeight * devicePixelRatio, window.innerWidth * devicePixelRatio));
    underlayGraphics.endFill();
    this.playlandscapeUnderlay = this.game.add.sprite(0, 0, underlayGraphics.generateTexture());

    this.game.time.events.add(200, function() {        

        this.playlandscapeSprite = this.game.add.sprite(window.innerWidth/2 * devicePixelRatio, 
            window.innerHeight/2 * devicePixelRatio, 'playlandscape');
        
        this.playlandscapeSprite.anchor.setTo(0.5, 0.5);
    }, this)    
        
};

handleCorrect = function() {

    if (this.playlandscapeSprite) {
        this.playlandscapeSprite.destroy();
    }
    if (this.playlandscapeUnderlay) {
        this.playlandscapeUnderlay.destroy();
    }
        
};
