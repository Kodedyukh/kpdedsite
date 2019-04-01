
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		
		this.mainMenuBack = this.add.sprite(this.game.width*0.5, this.game.height*0.02, 'mainMenuBackground');
		this.mainMenuBack.anchor.setTo(0.5, 0);
		this.mainMenuBack.scale.setTo(this.game.width*0.4/this.game.cache.getImage('mainMenuBackground').width, this.game.width*0.4/this.game.cache.getImage('mainMenuBackground').width);		

		this.preloadBarBack = this.add.sprite(this.game.width/2, this.game.height*0.75, 'preloaderBarBack');
		this.preloadBarBack.anchor.setTo(0.5, 0.5);

		this.preloadBar = this.add.sprite(this.game.width/2 - this.cache.getImage('preloaderBar').width / 2, this.game.height*0.75, 'preloaderBar');
		this.preloadBar.anchor.setTo(0, 0.5);
		this.stage.backgroundColor = 0x333333;

        this.splashScreen = this.add.sprite(this.game.width*0.5, this.game.height*0.5, 'smgSplash');
        this.splashScreen.anchor.setTo(0.5, 0.5);

        this.time.events.add(1500, function(){
        	this.splashScreen.alpha = 0;
        	this.stage.backgroundColor = 0x44d9bf;
        }, this);

		if (!this.game.device.desktop)
        {            
            //this.time.events.add(200, function(){
				scaleGame(this.game);
				this.scale.refresh();
				this.time.events.add(250, function(){
					this.mainMenuBack.position.set(this.game.width*0.5, this.game.height*0.02);
					this.mainMenuBack.scale.setTo(this.game.width*0.4/this.game.cache.getImage('mainMenuBackground').width, this.game.width*0.4/this.game.cache.getImage('mainMenuBackground').width);
					this.preloadBarBack.position.set(this.game.width/2, this.game.height*0.75);
					this.preloadBar.position.set(this.game.width/2 - this.cache.getImage('preloaderBar').width / 2, this.game.height*0.75);					

					var splashScale = Math.min(this.game.width/800, this.game.height/600);
					this.splashScreen.position.set(this.game.width/2, this.game.height/2);
					this.splashScreen.scale.setTo(splashScale, splashScale);
				}, this);


			//}, this);
        }
		
		this.load.setPreloadSprite(this.preloadBar);
		
		this.load.image('cableCutPopup', 'assets/images/cableCutPopup.png');
		this.load.image('tipPopup', 'assets/images/tipPopup.png');
		this.load.image('tipPopupMob', 'assets/images/tipPopupMob.png');
		this.load.image('twinPopup', 'assets/images/twinPopup.png');
		this.load.image('backtipPopup', 'assets/images/backtipPopup.png');
		this.load.image('gamebeatenPopup', 'assets/images/gameBeatenPopup.png');
		this.load.image('mainMenuUnderlay', 'assets/images/mainMenuUnderlay.png');
		this.load.image('lockImage', 'assets/images/lock.png');
		this.load.image('orPressR', 'assets/images/orPressR.png');

		this.load.spritesheet('explosion', 'assets/images/mowingExplosion.png', 100, 100);
		this.load.spritesheet('explosionU', 'assets/images/mowingExplosionU.png', 100, 100);
		this.load.spritesheet('cableCut', 'assets/images/cableCut.png', 100, 100);
		
		this.load.atlas('playButton', 'assets/images/startBut.png', 'assets/images/startBut.json');
		this.load.atlas('moveBackButton', 'assets/images/moveBackButton.png', 'assets/images/moveBackButton.json');
		this.load.atlas('moveBeginButton', 'assets/images/moveBeginButton.png', 'assets/images/moveBeginButton.json');
		this.load.atlas('reloadLevelButton', 'assets/images/reloadLevelButton.png', 'assets/images/reloadLevelButton.json');
		this.load.atlas('squareTypes', 'assets/images/squareTypes.png', 'assets/images/squareTypes.json');
		this.load.atlas('wire', 'assets/images/wire.png', 'assets/images/wire.json');
		this.load.atlas('mowerGuy', 'assets/images/mowerGuy.png', 'assets/images/mowerGuy.json');
		this.load.atlas('mowerGuyU', 'assets/images/mowerGuyU.png', 'assets/images/mowerGuyU.json');
		this.load.atlas('plugTile', 'assets/images/plugTile.png', 'assets/images/plugTile.json');
		this.load.atlas('muteButton', 'assets/images/muteButton.png', 'assets/images/muteButton.json');
		this.load.atlas('hintButton', 'assets/images/hintButton.png', 'assets/images/hintButton.json');
		this.load.atlas('moveDownButton', 'assets/images/moveDown.png', 'assets/images/moveDown.json');
		this.load.atlas('moveLeftButton', 'assets/images/moveLeft.png', 'assets/images/moveLeft.json');
		this.load.atlas('moveRightButton', 'assets/images/moveRight.png', 'assets/images/moveRight.json');
		this.load.atlas('moveUpButton', 'assets/images/moveUp.png', 'assets/images/moveUp.json');
		this.load.atlas('fullscreenButton', 'assets/images/fullscreenButton.png', 'assets/images/fullscreenButton.json');
		this.load.atlas('levelButton', 'assets/images/levelButton.png', 'assets/images/levelButton.json');
		
		this.load.bitmapFont('basicFont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
		this.load.json('4x4', 'assets/4x4.json');
		this.load.json('8x8', 'assets/8x8.json');
		this.load.json('10x10', 'assets/10x10.json');
		this.load.json('level1', 'assets/levels/level1.json');
		this.load.json('level2', 'assets/levels/level2.json');
		this.load.json('level3', 'assets/levels/level3.json');
		this.load.json('level4', 'assets/levels/level4.json');
		this.load.json('level5', 'assets/levels/level5.json');
		this.load.json('level6', 'assets/levels/level6.json');
		this.load.json('level7', 'assets/levels/level7.json');
		this.load.json('level8', 'assets/levels/level8.json');
		this.load.json('level9', 'assets/levels/level9.json');
		this.load.json('level10', 'assets/levels/level10.json');
		this.load.json('level11', 'assets/levels/level11.json');
		this.load.json('level12', 'assets/levels/level12.json');
		this.load.json('level13', 'assets/levels/level13.json');
		this.load.json('level14', 'assets/levels/level14.json');
		this.load.json('level15', 'assets/levels/level15.json');
		this.load.json('level16', 'assets/levels/level16.json');
		this.load.json('level17', 'assets/levels/level17.json');
		this.load.json('level18', 'assets/levels/level18.json');
		this.load.json('level19', 'assets/levels/level19.json');
		this.load.json('level20', 'assets/levels/level20.json');
		this.load.json('level21', 'assets/levels/level21.json');
		this.load.json('level22', 'assets/levels/level22.json');
		this.load.json('level23', 'assets/levels/level23.json');

		this.load.audio('bckgMusic', 'assets/sound/background.mp3');
		this.load.audio('electric', 'assets/sound/electricityShock.mp3');
		this.load.audio('mower', 'assets/sound/mower.mp3');
		this.load.audio('bird', 'assets/sound/bird.mp3');

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {	

		if (this.splashScreen.alpha === 0)
		{						
			this.state.start('MainMenu');
		}
	},

    updateScale: function() {

    } 

};


