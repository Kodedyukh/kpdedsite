var loadState = {
	preload: function() {
		game.scale.onOrientationChange.add(this.orientChange, this);

		this.background = game.add.sprite(game.width/2, game.height/2, 'loadBackground');
		this.background.anchor.x = 0.5;
		this.background.anchor.y = 0.5;
		this.scale = Math.max(game.width / game.cache.getImage('loadBackground').width, game.height / game.cache.getImage('loadBackground').height);
		this.background.scale.setTo(this.scale, this.scale);
		this.pbBack = game.add.sprite(game.width/2 - game.cache.getImage('pbBack').width/2, game.height * 0.7, 'pbBack');
		this.pbBack.anchor.y =0.5;
		this.progressBar = game.add.sprite(game.width/2 - game.cache.getImage('progressBar').width/2, game.height * 0.7, 'progressBar');
		this.progressBar.anchor.y = 0.5;		

		this.load.setPreloadSprite(this.progressBar);

		//loading percentage
		game.load.onLoadStart.add(this.loadStart, this);
		game.load.onFileComplete.add(this.fileComplete, this);
		game.load.onLoadComplete.add(this.loadComplete, this);

		this.loadingText = game.add.bitmapText(game.width/2, this.pbBack.y+this.pbBack.height/2, 'FJCaptionFont', '', 47);
		this.loadingText.anchor.setTo(0.5, 0);

		game.load.image('ball', 'assets/images/ball.png');
		game.load.image('joystick', 'assets/images/joystick.png');
		game.load.image('background', 'assets/images/background.png');
		game.load.image('mainMenuLabel', 'assets/images/mainMenuLabel.png');
		game.load.image('tricksMenuLabel', 'assets/images/tricksMenuLabel.png');
		game.load.image('mamasjuggler', 'assets/images/mamasjugglerLabel.png');
		game.load.image('beesknees', 'assets/images/beeskneesLabel.png');
		game.load.image('shouldermaster', 'assets/images/shouldermasterLabel.png');
		game.load.image('header', 'assets/images/headerLabel.png');
		game.load.image('pancake', 'assets/images/pancakeLabel.png');
		game.load.image('halfmilkshake', 'assets/images/halfmilkshakeLabel.png');
		game.load.image('milkshake', 'assets/images/milkshakeLabel.png');
		game.load.image('stall', 'assets/images/stallLabel.png');
		game.load.image('aroundTheWorld', 'assets/images/atwLabel.png');
		game.load.image('finalMenuLabel', 'assets/images/finalMenuLabel.png');
		game.load.image('shadow', 'assets/images/shadow.png');
		game.load.image('personShadow', 'assets/images/personShadow.png');
		game.load.image('scoreLabel', 'assets/images/applause.png');
		game.load.image('pauseLabel', 'assets/images/pauseLabel.png');
		game.load.image('shine', 'assets/images/shine.png');
		game.load.image('demoLabel3', 'assets/images/demoLabel3.png');
		game.load.image('demoArrowLeft', 'assets/images/demoArrowLeft.png');
		game.load.image('demoArrowRight', 'assets/images/demoArrowRight.png');
		game.load.image('finger', 'assets/images/finger.png');
		game.load.image('demoBall', 'assets/images/demoBall.png');
		game.load.image('demoTrajLong', 'assets/images/demoTrajLong.png');
		game.load.image('demoTrajShort', 'assets/images/demoTrajShort.png');	
		game.load.image('demoMoveRArrow', 'assets/images/demoMoveRArrow.png');
		game.load.image('demoMoveLArrow', 'assets/images/demoMoveLArrow.png');
		game.load.image('demoPers', 'assets/images/demoPers.png');
		game.load.image('numOne', 'assets/images/numOne.png');
		game.load.image('numTwo', 'assets/images/numTwo.png');
		game.load.image('numThree', 'assets/images/numThree.png');
		game.load.image('rotBoundaries', 'assets/images/rotBoundaries.png');
		game.load.image('rotBall', 'assets/images/rotBall.png');
		game.load.image('tutorialLabel', 'assets/images/tutorialLabel.png');
		game.load.atlas('leftLeg', 'assets/images/leftLeg.png', 'assets/images/leftLeg.json');
		game.load.atlas('leftKnee', 'assets/images/leftKnee.png', 'assets/images/leftKnee.json');
		game.load.atlas('leftShoulder', 'assets/images/leftShoulder.png', 'assets/images/leftShoulder.json');
		game.load.atlas('leftHead', 'assets/images/leftHead.png', 'assets/images/leftHead.json');
		game.load.atlas('rightLeg', 'assets/images/rightLeg.png', 'assets/images/rightLeg.json');
		game.load.atlas('rightKnee', 'assets/images/rightKnee.png', 'assets/images/rightKnee.json');
		game.load.atlas('rightShoulder', 'assets/images/rightShoulder.png', 'assets/images/rightShoulder.json');
		game.load.atlas('rightHead', 'assets/images/rightHead.png', 'assets/images/rightHead.json');
		game.load.spritesheet('touchAnimation', 'assets/images/touchAnim.png', 115, 100);
		game.load.spritesheet('explosion', 'assets/images/explosion.png', 200, 146);
		game.load.atlas('sticker', 'assets/images/sticker.png', 'assets/images/sticker.json');
		game.load.atlas('leftArrowBut', 'assets/images/leftArrow.png', 'assets/images/leftArrow.json');
		game.load.atlas('secondChanceBut', 'assets/images/secondChance.png', 'assets/images/secondChance.json');
		game.load.atlas('rightArrowBut', 'assets/images/rightArrow.png', 'assets/images/rightArrow.json');
		game.load.atlas('startBut', 'assets/images/startBut.png', 'assets/images/startBut.json');
		game.load.atlas('tricksBut', 'assets/images/tricksBut.png', 'assets/images/tricksBut.json');
		game.load.atlas('backBut', 'assets/images/backBut.png', 'assets/images/backBut.json');
		game.load.atlas('restartBut', 'assets/images/restartBut.png', 'assets/images/restartBut.json');
		game.load.atlas('exitBut', 'assets/images/exitBut.png', 'assets/images/exitBut.json');
		game.load.atlas('getMobBut', 'assets/images/getMobBut.png', 'assets/images/getMobBut.json');
		game.load.atlas('loaferMale', 'assets/images/loaferMale.png', 'assets/images/loaferMale.json');
		game.load.atlas('loaferFemale', 'assets/images/loaferFemale.png', 'assets/images/loaferFemale.json');
		game.load.atlas('loaferGirl', 'assets/images/loaferGirl.png', 'assets/images/loaferGirl.json');
		game.load.atlas('pauseBut', 'assets/images/pauseBut.png', 'assets/images/pauseBut.json');
		game.load.atlas('muteBut', 'assets/images/muteBut.png', 'assets/images/muteBut.json');
		game.load.atlas('fullscreenBut', 'assets/images/fullscreenBut.png', 'assets/images/fullscreenBut.json');
		game.load.atlas('tutorialBut', 'assets/images/tutorialBut.png', 'assets/images/tutorialBut.json');
		game.load.atlas('mainMenuBut', 'assets/images/mainMenuBut.png', 'assets/images/mainMenuBut.json');
		game.load.atlas('leftButton', 'assets/images/leftButton.png', 'assets/images/leftButton.json');
		game.load.atlas('rightButton', 'assets/images/rightButton.png', 'assets/images/rightButton.json');
		game.load.json('joystickPhysics', 'assets/images/joystickPhysics.json');
		game.load.bitmapFont('FJFont', 'assets/fonts/FJFont.png', 'assets/fonts/FJFont.fnt');
		game.load.audio('ballLeg', 'assets/music/Ball3.m4a');
		game.load.audio('ballKnee', 'assets/music/Ball2.m4a');
		game.load.audio('ballShoulder', 'assets/music/Ball1.m4a');
		game.load.audio('ballHead', 'assets/music/Ball4.m4a');
		game.load.audio('finalMusic', 'assets/music/End.m4a');
		game.load.audio('menuMusic', 'assets/music/FootballMenuMusic.m4a');
		game.load.audio('mainLoop', 'assets/music/Loop.m4a');
		game.load.audio('support1', 'assets/music/SoundsOfSupport1.m4a');
		game.load.audio('support2', 'assets/music/SoundsOfSupport2.m4a');
		game.load.audio('support3', 'assets/music/SoundsOfSupport3.m4a');
		game.load.audio('mainIntro', 'assets/music/Verse.m4a');
		game.load.audio('whistle', 'assets/music/Whistle.m4a');
		game.scale.onOrientationChange.remove(this.orientChange, this);
	},

	create: function() {
		this.progressBar.cropEnabled = false;
		game.state.start('mainMenu');
	},

	orientChange: function(){
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
		var bgScale = Math.max(game.width / game.cache.getImage('loadBackground').width, game.height / game.cache.getImage('loadBackground').height);
		this.background.x = game.width/2;
		this.background.y = game.height/2;
		this.background.scale.setTo(bgScale, bgScale);

		if (game.height/game.width > 960/640)
		{
			this.scale = game.width/640;
		} else {
			this.scale = game.height/960;
		}
		

		this.pbBack.x = game.width*0.5 - game.cache.getImage('pbBack').width/2*this.scale;
		this.pbBack.y = 0.7*game.height;
		this.pbBack.scale.setTo(this.scale, this.scale);

		this.progressBar.y = game.height*0.7;
		this.progressBar.x = game.width/2 - game.cache.getImage('progressBar').width/2*this.scale;
		this.progressBar.scale.setTo(this.scale, this.scale);

		this.loadingText.x = game.width*0.5;
		this.loadingText.y = this.pbBack.y + this.pbBack.height/2;
		this.loadingText.scale.setTo(this.scale, this.scale);
	},

	handlePause: function(){		
		game.paused = true;
	},

	handleResume: function(){
		game.paused = false;
	},

	loadStart: function(){
		this.loadingText.text = 'Loading...'
	},

	fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
		this.loadingText.text = ''+progress+'%';
	},

	loadComplete: function() {
		this.loadingText.text='Load complete';
	},
};

document.addEventListener("pause", loadState.handlePause, false);

document.addEventListener("resume", loadState.handleResume, false);

window.addEventListener('resize', function() {
	var currentState = game.state.getCurrentState();
	currentState.orientChange();
})