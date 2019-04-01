
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//console.log('new menu');

		this.underlay = this.add.sprite(this.game.width/2, this.game.height/2, 'mainMenuUnderlay');
		this.underlay.anchor.setTo(0.5, 0.5);
		this.underlay.scale.setTo(this.game.width/800, this.game.width/800);

		this.mainMenuBack = this.add.sprite(this.game.width*0.5, this.game.height*0.02, 'mainMenuBackground');
		this.mainMenuBack.anchor.setTo(0.5, 0);
		this.mainMenuBack.scale.setTo(this.game.width*0.4/this.game.cache.getImage('mainMenuBackground').width, this.game.width*0.4/this.game.cache.getImage('mainMenuBackground').width);

		this.playButton = this.add.button(this.game.width/2, this.game.height - 50, 'playButton', this.startGame, this, 'out', 'out', 'down', 'out');
		this.playButton.anchor.setTo(0.5, 1);
		var playButtonScale = (this.game.height - this.mainMenuBack.bottom - 50)/ this.game.cache.getImage('playButton').height > 1?
			Math.min(this.game.width/800, 1): (this.game.height - this.mainMenuBack.bottom - 50)/ this.game.cache.getImage('playButton').height;

		//console.log(playButtonScale);
		this.playButton.scale.setTo(playButtonScale, playButtonScale);

		if (!this.game.device.desktop) {
			if (this.game.scale.screenOrientation==='portrait-primary' || this.game.scale.screenOrientation==='portrait-secondary') {
	           handleIncorrect.call(this);
	        }	
		}	

		//this.stage.backgroundColor = 0x44d9bf;

		this.game.fieldRanges = ['4x4', '8x8', '10x10'];

		if (!this.game.device.desktop)
        {
            scaleGame(this.game);            
        }
        
        this.scale.refresh();

		if (isNaN(localStorage.getItem('mowItLevelNumber')) || localStorage.getItem('mowItLevelNumber')===null)
		{
			/*this.game.currentDimensions = this.game.fieldRanges[0];
			this.game.gameMode = 'single';
			this.game.levelNumber = 1;*/
			localStorage.setItem('mowItCurrentDimensions', this.game.fieldRanges[0]);
			localStorage.setItem('mowItGameMode', 'split');
			localStorage.setItem('mowItLevelNumber', 23);
		} else {
			
		}		

		this.bckgMusic = this.game.add.audio('bckgMusic');

		this.game.sound.setDecodedCallback([this.bckgMusic], this.launchMusic, this);

		if (!this.game.device.desktop) {            
            this.scale.enterIncorrectOrientation.add(handleIncorrect, this);
            this.scale.leaveIncorrectOrientation.add(handleCorrect, this);    
        }

		this.scale.onOrientationChange.add(this.scaleAndPosition, this);
		this.scale.onSizeChange.add(scaleGame, this, 0, this.game);

	},


	startGame: function (pointer) {

		//inGame = true;
		//console.log('start game');
		this.scale.onOrientationChange.remove(this.scaleAndPosition, this);
		if (typeof parent.cmgGameEvent === 'function') parent.cmgGameEvent('start');
		if (localStorage.getItem('mowItGameMode')==='single' && 
			Number(localStorage.getItem('mowItLevelNumber'))===1 && 
			localStorage.getItem('mowItCurrentDimensions')==='4x4') {
			this.game.currentDimensions = localStorage.getItem('mowItCurrentDimensions');
			this.game.gameMode = localStorage.getItem('mowItGameMode');
			this.game.levelNumber = Number(localStorage.getItem('mowItLevelNumber'));
			this.state.start('Game');
		} else {
			this.state.start('LevelChoiceMenu');	
		}		

	},

	launchMusic: function() {

		//console.log('music launched');

		this.bckgMusic.loopFull();
	},

	scaleAndPosition: function() {
		this.time.events.add(300, function(){
			this.mainMenuBack.position.set(this.game.width/2, this.game.height*0.02);
			this.mainMenuBack.scale.setTo(this.game.width*0.4/this.game.cache.getImage('mainMenuBackground').width, this.game.width*0.4/this.game.cache.getImage('mainMenuBackground').width);
			this.playButton.position.set(this.game.width/2, this.game.height - 50);
			var playButtonScale = (this.game.height - this.mainMenuBack.bottom - 50)/ this.game.cache.getImage('playButton').height > 1?
				Math.min(this.game.width/800, 1) : (this.game.height - this.mainMenuBack.bottom - 50)/ this.game.cache.getImage('playButton').height;
			this.playButton.scale.setTo(playButtonScale, playButtonScale);
			
			this.underlay.position.set(this.game.width/2, this.game.height/2);
			this.underlay.scale.setTo(this.game.width/960, this.game.width/960);
		}, this);
	},

	manageFullscreen: function() {
		inGame = true;

		if (!this.scale.isFullScreen) {

			this.scale.startFullScreen();
			this.time.events.add(500, function(){
				scaleGame(this.game);
				this.scale.refresh();
				this.scaleAndPosition();

			}, this);
			this.fullscreenButton.setFrames('offOut', 'offOut', 'offDown', 'offOut');
			
			//scaleGame(this.game);

		} else {

			this.scale.stopFullScreen();
			this.time.events.add(500, function(){
				scaleGame(this.game);
				this.scale.refresh();
				this.scaleAndPosition();
			}, this);
			this.fullscreenButton.setFrames('onOut', 'onOut', 'onDown', 'onOut');
			//scaleGame(this.game);
		}
	},

    updateScale: function() {
    	this.scaleAndPosition();
    } 

};

