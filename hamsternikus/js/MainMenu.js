
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		// I duplicated scaling routine in the boot stage
        if (!this.game.device.desktop)
        {
            scaleGame(this.game);            
        }
        
        this.scale.refresh();

        /*this.music = this.add.audio('titleMusic');
		this.music.play();*/

		teleportScreenGenerator.clearProject();

		this.background = this.add.sprite(0, 0, 'titlepage');
		//this.background.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);

		/*var instructions = this.add.sprite(this.game.width/2, this.game.height/2, 'instructions');
		instructions.anchor.setTo(0.5, 0.5);
		instructions.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);*/

		this.playButtonShadow = this.add.sprite(this.game.width*0.5+10, this.game.height+20, 'playButton', 'out');
		this.playButtonShadow.anchor.setTo(0.5, 0.5);
		this.playButtonShadow.tint = 0x000000;
		this.playButtonShadow.alpha = 0.3;
		
		this.playButtonShadowTweenUp = this.game.add.tween(this.playButtonShadow).to({y: this.game.height*0.7+20}, 1500, Phaser.Easing.Elastic.Out, true);
		this.playButtonShadowTweenDown = this.game.add.tween(this.playButtonShadow).to({top: this.game.height+20}, 500, Phaser.Easing.Linear.None, false);

		this.playButtonShadowIdleTween = this.game.add.tween(this.playButtonShadow.scale).to({x:0.8, y:1.2}, 1700, Phaser.Easing.Elastic.Out, true, 0, -1).yoyo(true);

		this.playButton = this.add.button(this.game.width*0.5, this.game.height, 'playButton', this.startGame, this, 'out', 'out', 'down', 'out');
		this.playButton.anchor.setTo(0.5, 0.5);


		this.playButtonTweenUp = this.game.add.tween(this.playButton).to({y: this.game.height*0.7}, 1500, Phaser.Easing.Elastic.Out, true);
		this.playButtonTweenDown = this.game.add.tween(this.playButton).to({top: this.game.height}, 500, Phaser.Easing.Linear.None, false);

		this.playButtonIdleTween = this.game.add.tween(this.playButton.scale).to({x:0.8, y:1.2}, 1700, Phaser.Easing.Elastic.Out, true, 0, -1).yoyo(true);

		this.playButtonTweenDown.onComplete.add(function(){
			if (isNaN(localStorage.getItem('lockedLevel')) || localStorage.getItem('lockedLevel')===null)
			{
				this.game.levelNum = 1;
				this.state.start('StoryScenes');
			} else {
				this.state.start('LevelChoiceMenu');	
			}
			audioPlayer.playOneTime('buttonPush');
		}, this)
		

		/*this.gameTitle = this.add.sprite(this.game.width/2, 20, 'gameTitle');
		this.gameTitle.anchor.setTo(0.5, 0);
		this.gameTitle.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);*/

		if (!this.game.device.desktop && !this.game.device.cordova && !this.game.device.crosswalk) {
			this.fullscreenButtonShadow = this.add.sprite(this.game.width*0.98+10, this.game.height*0.45+20, 'fullscreenButton', 'outOut');
			this.fullscreenButtonShadow.tint = 0x000000;
			this.fullscreenButtonShadow.alpha = 0.3;
			this.fullscreenButtonShadow.anchor.setTo(1, 0);

			this.fullscreenButton = this.add.button(this.game.width*0.98, this.game.height*0.45, 'fullscreenButton', this.manageFullscreen, this, 'inOut', 'inOut', 'inDown', 'inOut');
			this.fullscreenButton.anchor.setTo(1, 0);
			//this.fullscreenButton.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
		}

		this.muteButtonShadow = this.add.sprite(this.game.width*0.05+10, this.game.height*0.77+20, 'muteButMenu', 'onOut');
		this.muteButtonShadow.tint = 0x000000;
		this.muteButtonShadow.alpha = 0.3;

		this.muteButton = this.add.button(this.game.width*0.05, this.game.height*0.77, 'muteButMenu', this.manageMute, this, 'onOut', 'onOut', 'onDown', 'onOut');
		this.muteButtonTween = this.add.tween(this.muteButton).to({x: "+10", y: "+10"}, 50, Phaser.Easing.Linear.None, false).yoyo(true);

		this.creditsLabel = this.add.sprite(this.game.width/2, this.game.height/2, 'credits');
		this.creditsLabel.anchor.setTo(0.5, 0.5);
		this.creditsLabel.alpha = 0;

		this.creditsButtonShadow = this.add.sprite(this.game.width*0.98+10, this.game.height*0.16+20, 'creditsButton', 'out');
		this.creditsButtonShadow.anchor.setTo(1, 0);
		this.creditsButtonShadow.tint = 0x000000;
		this.creditsButtonShadow.alpha = 0.3;

		this.creditsButton = this.add.button(this.game.width*0.98, this.game.height*0.16, 'creditsButton', this.showCredits, this, 'out', 'out', 'down', 'out');
		this.creditsButton.anchor.setTo(1, 0);
		this.creditsButtonTween = this.add.tween(this.creditsButton).to({x: "+10", y: "+10"}, 50, Phaser.Easing.Linear.None, false).yoyo(true);

		// button with a link to google play
		this.getOnGPButton = this.game.add.button(this.game.width*0.99, this.game.height*0.99, 'getOnGPButton', this.getOnGP, this, 'out', 'out', 'down', 'out');
        this.getOnGPButton.anchor.setTo(1, 1);

		audioPlayer.initiate(this.game);
		audioPlayer.decode(['menuBg', 'mazeBg', 'labBg', 'brainBg', 'storyBg', 'bee', 'buttonPush',
			'electric', 'octopusScream', 'pushWall', 'reverseWall', 'teleport', 
			'wallCollision', 'worm', 'wallBallCollision', 'fan', 'win', 'lose']);

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	getOnGP: function() {
		window.open("https://play.google.com/store/apps/details?id=com.kpded.hamsternikus", "_blank");
	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		
		this.playButtonTweenDown.start();
		this.playButtonShadowTweenDown.start();
		inGame = true;
	},

	manageFullscreen: function() {
		inGame = true;
		audioPlayer.playOneTime('buttonPush');

		if (!this.scale.isFullScreen) {

			this.scale.startFullScreen();
			this.time.events.add(1000, function(){
				scaleGame(this.game);
				this.scale.refresh();
			}, this);
			this.fullscreenButton.setFrames('outOut', 'outOut', 'outDown', 'outOut');
			
			//scaleGame(this.game);

		} else {

			this.scale.stopFullScreen();
			this.time.events.add(1000, function(){
				scaleGame(this.game);
				this.scale.refresh();
			}, this);
			this.fullscreenButton.setFrames('inOut', 'inOut', 'inDown', 'inOut');
			//scaleGame(this.game);
		}
	},

	manageMute: function() {
		this.muteButtonTween.start();
		if (this.sound.mute) {
			this.sound.mute = false;
			this.muteButton.setFrames('onOut', 'onOut', 'onDown', 'onOut');
		} else {
			this.sound.mute = true;
			this.muteButton.setFrames('offOut', 'offOut', 'offDown', 'offOut');
		}
	},

	showCredits: function() {
		this.creditsButtonTween.start();
		this.creditsLabel.alpha = 1;
		this.playButton.inputEnabled = false;
		this.input.onUp.addOnce(function(){
			this.creditsLabel.alpha = 0;
			this.playButton.inputEnabled = true;
		}, this);
	}

};