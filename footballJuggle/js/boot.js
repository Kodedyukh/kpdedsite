
var bootState = {

	preload: function(){
		game.load.image('loadBackground', 'assets/splash/splashScreen.png');
		game.load.image('progressBar', 'assets/images/progressBar.png');
		game.load.image('pbBack', 'assets/images/pbBack.png');
		game.load.bitmapFont('FJCaptionFont', 'assets/fonts/FJCaptionFont.png', 'assets/fonts/FJCaptionFont.fnt');
	},

	create: function() {
		game.scale.onOrientationChange.add(this.orientChange, this);			
		if (!game.device.desktop)
		{
			game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;
			var width = window.innerWidth*window.devicePixelRatio;
			var height = window.innerHeight*window.devicePixelRatio;
			configuration.addbarHeight = Math.max(window.screen.availHeight - window.innerHeight, window.screen.availWidth - window.innerWidth);
			var gDimensions = determineGameDimensions(width, height);
			var gWidth = gDimensions[0];
			var gHeight = gDimensions[1];
			game.scale.setGameSize(gDimensions[0], gDimensions[1]);			
			game.scale.setUserScale(window.innerHeight/game.height, window.innerHeight/game.height);
			var cScale = window.innerHeight/game.height;
		}
		game.scale.fullScreenTarget = document.getElementById('wrapper');
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;		
		game.scale.refresh();		
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.scale.onOrientationChange.remove(this.orientChange, this);
		game.state.start('load');
	},

	orientChange: function(){
		if (game.scale.screenOrientation === 'portrait-primary' || game.scale.screenOrientation === 'portrait-secondary')
		{
			//console.log('got to portrait on boot');
		} else if (game.scale.screenOrientation === 'landscape-primary' || game.scale.screenOrientation === 'landscape-secondary') {
			//console.log('got to landscape on boot');
		}
	}
};
