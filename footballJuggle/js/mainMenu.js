var demoEnter = 'mainMenu';

var mainMenu = {
	create: function() {

		game.scale.onOrientationChange.add(this.orientChange, this);
		this.background = game.add.sprite(0, 0, 'background');
		this.background.scale.setTo(game.height / game.cache.getImage('background').height, game.height / game.cache.getImage('background').height);
		//set music
		if (typeof this.mainMenuMusic==='undefined')
		{
			this.mainMenuMusic = game.add.audio('menuMusic');
			this.mainMenuMusic.volume = 0.6;
			this.mainMenuMusic.loopFull();
		} else if (!this.mainMenuMusic.isPlaying) {
			this.mainMenuMusic.volume = 0.6;
			this.mainMenuMusic.loopFull();
		}
		//set label
		if (game.height/game.width > 960/640)
		{
			this.scale = game.width/640;
		} else {
			this.scale = game.height/960;
		}		
		this.label = game.add.sprite(game.width/2, game.height*0.2, 'mainMenuLabel');
		this.label.scale.setTo(this.scale, this.scale);
		this.label.anchor.x = 0.5;
		this.label.anchor.y = 0.5;
		//set ball's shadow
		this.shadow = game.add.sprite(game.width/2,
			game.height*0.9, 'shadow');
		this.shadow.anchor.x = 0.5;
		this.shadow.anchor.y = 0.5;
		this.shadow.scale.setTo(1.2 * this.scale, 1.2* this.scale);
		this.shadowUpTween = game.add.tween(this.shadow.scale).to({y: 1 /3, x: 1/3}, 800, Phaser.Easing.Quadratic.InOut, true, 0, -1).yoyo(true);
		//set jumping ball
		this.ball = game.add.sprite(game.width/2, game.height * 0.9, 'ball');
		this.ball.anchor.setTo(0.5, 1);
		this.ball.scale.setTo(1.2 * this.scale, 1.2* this.scale);
		this.ballUpTween = game.add.tween(this.ball).to({y: game.height *6/16}, 800, Phaser.Easing.Quadratic.InOut, true, 0, -1).yoyo(true);
		//set start button
		this.startBut = game.add.button(game.width/2, game.height * 0.58, 
			'startBut', this.goStart, this, 'out', 'out', 'down', 'out');
		this.startBut.anchor.x = 0.5;
		this.startBut.anchor.y = 0.5;
		this.startBut.scale.setTo(1.2*this.scale, 1.2*this.scale);
		//set tricks button
		this.tutorialBut = game.add.button(game.width/2, game.height * 0.72, 
			'tutorialBut', this.goDemo, this, 'out', 'out', 'down', 'out');
		this.tutorialBut.anchor.x = 0.5;
		this.tutorialBut.anchor.y = 0.5;
		this.tutorialBut.scale.setTo(this.scale, this.scale);
		//set demo button
		this.tricksBut = game.add.button(game.width/2, game.height * 0.84, 
			'tricksBut', this.goTricks, this, 'out', 'out', 'down', 'out');
		this.tricksBut.anchor.x = 0.5;
		this.tricksBut.anchor.y = 0.5;
		this.tricksBut.scale.setTo(this.scale, this.scale);
		//mute button
		this.muteBut = null;
		if (game.sound.mute) {
			this.muteBut = game.add.button(game.width*0.98, game.height*0.98, 'muteBut', this.manageMute, this,
				'muteOnOut', 'muteOnOut', 'muteOnDown', 'muteOnOut');
		} else {
			this.muteBut = game.add.button(game.width*0.98, game.height*0.98, 'muteBut', this.manageMute, this,
				'muteOffOut', 'muteOffOut', 'muteOffDown', 'muteOffOut');
		}
		this.muteBut.anchor.x = 1;
		this.muteBut.anchor.y = 1;
		this.muteBut.scale.setTo(this.scale, this.scale);
		this.fullscreenBut = game.add.button(game.width*0.02, game.height*0.98, 'fullscreenBut', this.manageFullscreen, this,
			'fsOffOut', 'fsOffOut', 'fsOffDown', 'fsOffOut');
		if (game.scale.isFullScreen) {
			this.fullscreenBut.setFrames('fsOnOut', 'fsOnOut', 'fsOnDown', 'fsOnOut');
		}
		this.fullscreenBut.anchor.setTo(0, 1);
		this.fullscreenBut.scale.setTo(this.scale, this.scale);
		//uncomment for custom build
		if (!game.device.fullscreen) {
			this.fullscreenBut.alpha = 0;
			this.fullscreenBut.inputEnabled = false;
		}
	},

	orientChange: function() {
		if (game.device.safari || game.device.mobileSafari || game.device.desktop) {
			var height = window.innerHeight*window.devicePixelRatio;
			var width = window.innerWidth*window.devicePixelRatio;
			var gDimensions = determineGameDimensions(width, height);
			game.scale.setGameSize(gDimensions[0], gDimensions[1]);
			game.scale.setUserScale(window.innerHeight/gDimensions[1], 
				window.innerHeight/gDimensions[1]);
			game.scale.refresh();
			this.scaleAll(configuration.originalAspectRatio);
		} else {
			if (game.scale.screenOrientation === 'portrait-primary' || game.scale.screenOrientation === 'portrait-secondary')
			{
				if (!game.scale.isFullScreen) {
					var height = (window.screen.availHeight - configuration.addbarHeight)*window.devicePixelRatio;
					var width = window.screen.availWidth*window.devicePixelRatio;
					var gDimensions = determineGameDimensions(width, height);
					game.scale.setGameSize(gDimensions[0], gDimensions[1]);
					game.scale.setUserScale((window.screen.availHeight - configuration.addbarHeight)/gDimensions[1], 
						(window.screen.availHeight - configuration.addbarHeight)/gDimensions[1]);
					
				} else {
					var height = window.screen.availHeight*window.devicePixelRatio;
					var width = window.screen.availWidth*window.devicePixelRatio;
					var gDimensions = determineGameDimensions(width, height);			
					game.scale.setGameSize(gDimensions[0], gDimensions[1]);
					game.scale.setUserScale(window.screen.availHeight/gDimensions[1], window.screen.availHeight/gDimensions[1]);
				}	
				game.scale.refresh();
				this.scaleAll(1/configuration.originalAspectRatio);
			} else if (game.scale.screenOrientation === 'landscape-primary' || game.scale.screenOrientation === 'landscape-secondary') {
				if (!game.scale.isFullScreen) {
					var height = (window.screen.availHeight - configuration.addbarHeight)*window.devicePixelRatio;
					var width = window.screen.availWidth*window.devicePixelRatio;
					var gDimensions = determineGameDimensions(width, height);
					game.scale.setGameSize(gDimensions[0], gDimensions[1]);
					game.scale.setUserScale((window.screen.availHeight - configuration.addbarHeight)/gDimensions[1], 
						(window.screen.availHeight - configuration.addbarHeight)/gDimensions[1]);
				} else {
					var height = window.screen.availHeight*window.devicePixelRatio;
					var width = window.screen.availWidth*window.devicePixelRatio;
					var gDimensions = determineGameDimensions(width, height);			
					game.scale.setGameSize(gDimensions[0], gDimensions[1]);
					game.scale.setUserScale(window.screen.availHeight/gDimensions[1], window.screen.availHeight/gDimensions[1]);
				}
				game.scale.refresh();
				this.scaleAll(configuration.originalAspectRatio);
			}
		}
	},

	scaleAll: function(scale){
		this.background.scale.setTo(game.height / game.cache.getImage('background').height, game.height / game.cache.getImage('background').height);
		if (game.height/game.width > 960/640)
		{
			this.scale = game.width/640;
		} else {
			this.scale = game.height/960;
		}
		this.ballUpTween.stop();
		this.ball.scale.setTo(1.2*this.scale, 1.2*this.scale);
		this.ball.x = game.width/2;
		this.ball.y = game.height*0.9;
		this.ballUpTween = game.add.tween(this.ball).to({y: game.height *6/16}, 800, Phaser.Easing.Quadratic.InOut, true, 0, -1).yoyo(true);
		this.shadowUpTween.stop();
		this.shadow.scale.setTo(1.2*this.scale, 1.2*this.scale);
		this.shadow.x = game.width/2;
		this.shadow.y = game.height*0.9;
		this.shadowUpTween = game.add.tween(this.shadow.scale).to({y: 1 /3, x: 1/3}, 800, Phaser.Easing.Quadratic.InOut, true, 0, -1).yoyo(true);
		this.label.scale.setTo(this.scale, this.scale);
		this.label.x = game.width/2;
		this.label.y = game.height*0.2;
		this.startBut.scale.setTo(1.2*this.scale, 1.2*this.scale);
		this.startBut.x = game.width /2;
		this.startBut.y = game.height *0.58;
		this.tutorialBut.scale.setTo(this.scale, this.scale);
		this.tutorialBut.x = game.width/2;
		this.tutorialBut.y = game.height*0.72;
		this.tricksBut.scale.setTo(this.scale, this.scale);
		this.tricksBut.x = game.width/2;
		this.tricksBut.y = game.height * 0.84;
		this.muteBut.scale.setTo(this.scale, this.scale);
		this.muteBut.x = game.width*0.98;
		this.muteBut.y = game.height*0.98;
		this.fullscreenBut.scale.setTo(this.scale, this.scale);
		this.fullscreenBut.x = game.width*0.02;
		this.fullscreenBut.y = game.height*0.98;
	},

	goStart: function() {
		game.scale.onOrientationChange.remove(this.orientChange, this);
		if (localStorage.getItem('demoShown')===null)
		{
			localStorage.setItem('demoShown', 'true');
			demoEnter = 'start';
			game.state.start('demo');
		} else if(localStorage.getItem('demoShown')==='true') {
			game.state.start('play');
		}
		this.mainMenuMusic.stop();
	},

	goTricks: function() {
		game.scale.onOrientationChange.remove(this.orientChange, this);
		game.state.previousToTricks = 'main';
		game.state.start('tricksMenu');		
	},

	goDemo: function() {
		game.scale.onOrientationChange.remove(this.orientChange, this);
		game.state.start('demo');
		this.mainMenuMusic.stop();
	},

	manageMute: function() {
		if (game.sound.mute){
			game.sound.mute = false;
			this.muteBut.setFrames('muteOffOut', 'muteOffOut', 'muteOffDown', 'muteOffOut');
		} else {
			game.sound.mute = true;
			this.muteBut.setFrames('muteOnOut', 'muteOnOut', 'muteOnDown', 'muteOnOut');
		}
	},

	manageFullscreen: function() {
		game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
		if (!game.scale.isFullScreen) {
			game.scale.startFullScreen();
			if (!game.device.desktop) {
				var height = window.screen.availHeight*window.devicePixelRatio;
				var width = window.screen.availWidth*window.devicePixelRatio;
				var gDimensions = determineGameDimensions(width, height);			
				game.scale.setGameSize(gDimensions[0], gDimensions[1]);
				game.scale.setUserScale(window.screen.availHeight/gDimensions[1], window.screen.availHeight/gDimensions[1]);
				game.scale.refresh();
				this.scaleAll(configuration.originalAspectRatio);	
			}			
			this.fullscreenBut.setFrames('fsOnOut', 'fsOnOut', 'fsOnDown', 'fsOnOut');
		} else {
			game.scale.stopFullScreen();
			if (!game.device.desktop) {
				var height = (window.innerHeight - configuration.addbarHeight)*window.devicePixelRatio;
				var width = window.innerWidth*window.devicePixelRatio;
				var gDimensions = determineGameDimensions(width, height);
				game.scale.setGameSize(gDimensions[0], gDimensions[1]);
				game.scale.setUserScale((window.innerHeight - configuration.addbarHeight)/gDimensions[1], 
					(window.innerHeight - configuration.addbarHeight)/gDimensions[1]);
				game.scale.refresh();
				this.scaleAll(configuration.originalAspectRatio);
			}
			this.fullscreenBut.setFrames('fsOffOut', 'fsOffOut', 'fsOffDown', 'fsOffOut');
		}
	},

	handlePause: function(){		
		game.paused = true;
	},

	handleResume: function(){
		game.paused = false;
	},
};


document.addEventListener("pause", mainMenu.handlePause, false);

document.addEventListener("resume", mainMenu.handleResume, false);