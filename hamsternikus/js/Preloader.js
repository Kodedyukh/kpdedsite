
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		//this.background.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');
		//this.preloadBar.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
		this.preloadBarOverlay = this.add.sprite(297, 397, 'preloaderBarOverlay');

		// I duplicated scaling routine in the boot stage
        if (!this.game.device.desktop)
        {            
            this.time.events.add(1000, function(){
				scaleGame(this.game);
				this.scale.refresh();
			}, this);
        }

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		this.load.image('titlepage', 'assets/images/background.png');		
		this.load.image('backgroundMaze', 'assets/images/backgroundMaze.png');	
		this.load.image('backgroundLab', 'assets/images/backgroundLab.png');	
		this.load.image('backgroundSpace', 'assets/images/backgroundSpace.png');
		this.load.image('start', 'assets/images/start.png');		
		this.load.image('finLabel', 'assets/images/GameFinLabel.png');
		this.load.image('wormSection', 'assets/images/wormSection.png');
		this.load.image('wormHead', 'assets/images/wormHead.png');
		this.load.image('wormTail', 'assets/images/wormTail.png');
		this.load.image('innerRadius', 'assets/images/joystickInner.png');
		this.load.image('outerRadius1', 'assets/images/joystickOuter1.png');
		this.load.image('outerRadius0', 'assets/images/joystickOuter0.png');
		this.load.image('firstFingerIndicator', 'assets/images/firstFingerIndicator.png');
		this.load.image('secondFingerIndicator', 'assets/images/secondFingerIndicator.png');
		this.load.image('scrollBackground', 'assets/images/scrollBackground.png');
		this.load.image('hamDir', 'assets/images/hamDirection.png');
		this.load.image('credits', 'assets/images/credits.png');

		this.load.image('metalPipeBasic', 'assets/images/labWalls/metalPipeBasic.png');
		this.load.image('metalPipeEnd1', 'assets/images/labWalls/metalPipeEnd1.png');
		this.load.image('metalPipeEnd2', 'assets/images/labWalls/metalPipeEnd2.png');
		this.load.image('metalPipeJoint', 'assets/images/labWalls/metalPipeJoint.png');
		this.load.image('glassTubeBasic', 'assets/images/labWalls/glassTubeBasic.png');
		this.load.image('glassTubeEnd', 'assets/images/labWalls/glassTubeEnd.png');
		this.load.image('glassTubeMiddle', 'assets/images/labWalls/glassTubeMiddle.png');
		this.load.image('electricStringsBasic', 'assets/images/labWalls/electricBasic.png');
		this.load.image('electricStringsMiddle', 'assets/images/labWalls/electricMiddle.png');
		this.load.image('electricStringsEnd', 'assets/images/labWalls/electricEnd.png');
		this.load.image('plasticTubeBasic', 'assets/images/labWalls/plasticTubeBasic.png');
		this.load.image('plasticTubeMiddle', 'assets/images/labWalls/plasticTubeMiddle.png');
		this.load.image('plasticTubeEnd1', 'assets/images/labWalls/plasticTubeEnd1.png');
		this.load.image('plasticTubeEnd2', 'assets/images/labWalls/plasticTubeEnd2.png');
		this.load.image('wireBasic', 'assets/images/labWalls/wireBasic.png');
		this.load.image('wireEnd1', 'assets/images/labWalls/wireEnd1.png');
		this.load.image('wireEnd2', 'assets/images/labWalls/wireEnd2.png');
		this.load.image('levelLabelBack', 'assets/images/levelLabelBack.png');		
		this.load.image('tipLevel1', 'assets/images/tipLevel1.png');	
		this.load.image('tipLevel3', 'assets/images/tipLevel3.png');	
		this.load.image('tipLevel1Finger', 'assets/images/tipLevel1Finger.png');	
		this.load.image('tipLevel3Finger', 'assets/images/tipLevel3Finger.png');	
		this.load.image('tipLevel31', 'assets/images/tipLevel31.png');	
		this.load.image('tipLevel39', 'assets/images/tipLevel39.png');
		this.load.image('tipLevel50', 'assets/images/tipLevel50.png');
		this.load.image('winBack', 'assets/images/winBack.png');
		this.load.image('lostBack', 'assets/images/looseBack.png');
		this.load.image('beeShadow', 'assets/images/beeShadow.png');
		
		this.load.atlas('playButton', 'assets/images/playButton.png', 'assets/images/playButton.json');
		this.load.atlas('fullscreenButton', 'assets/images/fullscreenButton.png', 'assets/images/fullscreenButton.json');
		this.load.atlas('ball', 'assets/images/ball.png', 'assets/images/ball.json');
		this.load.atlas('electroButton', 'assets/images/electroButton.png', 'assets/images/electroButton.json');
		this.load.atlas('fan', 'assets/images/fan.png', 'assets/images/fan.json');
		this.load.atlas('fanTrigger', 'assets/images/fanTrigger.png', 'assets/images/fanTrigger.json');
		this.load.atlas('electricDischarge', 'assets/images/electricDischarge.png', 'assets/images/electricDischarge.json');
		this.load.atlas('octopus', 'assets/images/octopus.png', 'assets/images/octopus.json');
		this.load.atlas('bee', 'assets/images/bee.png', 'assets/images/bee.json');
		this.load.atlas('alienBee', 'assets/images/alienBee.png', 'assets/images/alienBee.json');
		this.load.atlas('levelButton', 'assets/images/levelButton.png', 'assets/images/levelButton.json');
		this.load.atlas('replayButton', 'assets/images/replayButton.png', 'assets/images/replayButton.json');
		this.load.atlas('replayButtonMenu', 'assets/images/replayButtonMenu.png', 'assets/images/replayButtonMenu.json');
		this.load.atlas('playInGameButton', 'assets/images/playInGameButton.png', 'assets/images/playInGameButton.json');
		this.load.atlas('pauseButton', 'assets/images/pauseButton.png', 'assets/images/pauseButton.json');
		this.load.atlas('mainMenuButton', 'assets/images/mainMenuButton.png', 'assets/images/mainMenuButton.json');
		this.load.atlas('wormHole', 'assets/images/wormHole.png', 'assets/images/wormHole.json');
		this.load.atlas('reverseTrigger', 'assets/images/reverseTrigger.png', 'assets/images/reverseTrigger.json');
		this.load.atlas('scrollUpBut', 'assets/images/scrollUpBut.png', 'assets/images/scrollUpBut.json');
		this.load.atlas('scrollDownBut', 'assets/images/scrollDownBut.png', 'assets/images/scrollDownBut.json');
		this.load.atlas('muteButGame', 'assets/images/muteButGame.png', 'assets/images/muteButGame.json');
		this.load.atlas('muteButMenu', 'assets/images/muteButMenu.png', 'assets/images/muteButMenu.json');
		this.load.atlas('electrode', 'assets/images/electrode.png', 'assets/images/electrode.json');
		this.load.atlas('exitButton', 'assets/images/exitButton.png', 'assets/images/exitButton.json');
		this.load.atlas('creditsButton', 'assets/images/creditsButton.png', 'assets/images/creditsButton.json');
		this.load.atlas('getOnGPButton', 'assets/images/getOnGP.png', 'assets/images/getOnGP.json');

		this.load.spritesheet('touchAnim', 'assets/images/touchSpriteSheet.png', 65, 65);
		this.load.spritesheet('portal', 'assets/images/portal.png', 120, 120);
		this.load.spritesheet('teleportHam', 'assets/images/teleportHam.png', 150, 150);
		this.load.spritesheet('finish', 'assets/images/finish.png', 96, 96);
		this.load.spritesheet('ballWallCollision', 'assets/images/ballWallCollision.png', 80, 80);
		this.load.spritesheet('teleportTimer', 'assets/images/teleportTimer.png', 110, 110);
		this.load.spritesheet('winParticles', 'assets/images/winParticles.png', 30, 30);
		this.load.spritesheet('blowHamster', 'assets/images/blowHamster.png', 80, 80);
		this.load.spritesheet('fanWave', 'assets/images/fanWave.png', 16, 45);
		this.load.spritesheet('lightning', 'assets/images/lightning.png', 35, 1200);

		teleportScreenGenerator.create(this.game);

		for (var i=0; i<=100; i++) {
			var levelName = 'level'+i;
			var levelPath = 'assets/levels/'+levelName+'.json';
			//console.log(levelPath);
			this.load.json(levelName, levelPath);
		}

		this.game.storyPanelsNames = [];

		for (var i=1; i<24; i++) {
			var panelName = "Frame_"+i;
			var fileName = panelName + ".png";

			this.load.image(panelName, "assets/storyPanels/"+fileName);
			this.game.storyPanelsNames.push(panelName);
		}

		this.load.bitmapFont('basicFont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
		this.load.audio('menuBg', ['assets/sound/music/menu.m4a']);
		this.load.audio('mazeBg', ['assets/sound/music/maze.m4a']);
		this.load.audio('labBg', ['assets/sound/music/lab.m4a']);
		this.load.audio('brainBg', ['assets/sound/music/brain.m4a']);
		this.load.audio('storyBg', ['assets/sound/music/story.m4a']);
		this.load.audio('bee', ['assets/sound/effects/bee.m4a']);
		this.load.audio('buttonPush', ['assets/sound/effects/button.m4a']);
		this.load.audio('electric', ['assets/sound/effects/electric.m4a']);
		this.load.audio('octopusScream', ['assets/sound/effects/octopusScream.m4a']);
		this.load.audio('pushWall', ['assets/sound/effects/pushWall.m4a']);
		this.load.audio('reverseWall', ['assets/sound/effects/reverseWall.m4a']);
		this.load.audio('teleport', ['assets/sound/effects/teleport.m4a']);
		this.load.audio('wallCollision', ['assets/sound/effects/wallCollision.m4a']);
		this.load.audio('wallBallCollision', ['assets/sound/effects/wallBallCollision.m4a']);
		this.load.audio('worm', ['assets/sound/effects/worm.m4a']);
		this.load.audio('fan', ['assets/sound/effects/fan.wav']);
		this.load.audio('win', ['assets/sound/effects/win.m4a']);
		this.load.audio('lose', ['assets/sound/effects/lose.m4a']);
		/*this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');*/
		//	+ lots of other required assets here

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		/*if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;*/
			this.state.start('MainMenu');
		/*}*/

	}

};
