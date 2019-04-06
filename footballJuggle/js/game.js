var configuration = {
	'canvasWidthMax' : 2048,
	'canvasWidth': 640,
	'canvasHeightMax': 2048,
	'canvasHeight': 960,
	'scaleRatio': 1,
	'originalAspectRatio': 640/960,
	'addbarHeight': 0,
};

determineGameDimensions = function(width, height) {
	var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
	if (!orientation) {
		orientation = {'type': ''};
		switch (window.orientation) {
			case 90:
				orientation.type = 'landscape-primary';
				break;
			case 180:
				orientation.type = 'portrait-secondary';
				break;
			case 0:
				orientation.type = 'portrait-primary';
				break;
			case -90:
				orientation.type = 'landscape-secondary';
				break;
		}
	}
	var gameWidth = configuration.canvasWidth;
	var gameHeight = configuration.canvasHeight;
	if (window.devicePixelRatio === 1) {
		if (height>configuration.canvasHeight && width>configuration.canvasWidth) {
			gameWidth = configuration.canvasWidth;
			gameHeight = configuration.canvasHeight;
		} else {
			gameWidth = height * configuration.originalAspectRatio;
			gameHeight = height;
		}
	} else {
		if (orientation.type === 'portrait-primary' || orientation.type === 'portrait-secondary') {
			gameWidth = width;
			gameHeight = height;
		} else {
			gameWidth = height*configuration.originalAspectRatio;
			gameHeight = height;
		}
	}
	return [gameWidth, gameHeight];
};

window.onload = function () {
	var width = window.innerWidth*window.devicePixelRatio;
	var height = window.innerHeight*window.devicePixelRatio;
	configuration.addbarHeight = Math.max(window.screen.availHeight - window.innerHeight, window.screen.availWidth - window.innerWidth);
	var gDimensions = determineGameDimensions(width, height);
	var gWidth = gDimensions[0];
	var gHeight = gDimensions[1];
	game = new Phaser.Game(gWidth, gHeight, Phaser.WEBGL, 'gameDiv');
	game.configuration = configuration;
	//define states
	game.state.add('boot', bootState);
	game.state.add('load', loadState);
	game.state.add('mainMenu', mainMenu);
	game.state.add('play', playState);
	game.state.add('tricksMenu', tricksMenu);
	game.state.add('demo', demoState);
	
	document.addEventListener("deviceready", function (){
		StatusBar.hide();
	}, false);

	game.state.start('boot');
}




