var tricksMenu = {
	create: function() {
		game.scale.onOrientationChange.add(this.orientChange, this);
		this.background = game.add.sprite(0, 0, 'background');
		this.background.scale.setTo(game.height / game.cache.getImage('background').height, game.height / game.cache.getImage('background').height);
		//set label
		if (game.height/game.width > 960/640)
		{
			this.scale = game.width/640;
		} else {
			this.scale = game.height/960;
		}
		this.tricksMenuLabel = game.add.sprite(game.width/ 2, game.height / 2, 'tricksMenuLabel');
		this.tricksMenuLabel.anchor.x = 0.5;
		this.tricksMenuLabel.anchor.y = 0.5;
		this.tricksMenuLabel.scale.setTo(game.width / 640, game.height / 960);
		this.trickArray = [];
		//menu name
		this.menuName = game.add.bitmapText(0.5*game.width, 0.085*game.height,'FJFont', 'TRICKS', 72);
		this.menuName.anchor.x = 0.5;
		this.menuName.scale.setTo(this.scale, this.scale);
		//trick labels
		var trickDict = {
			stall: {
				name: 'Stall',
				image: 'stall',
				points: 50,
				description: 'Keep the ball at nearly the same position for 3 seconds'
			},
			pancake: {
				name: 'Pancake',
				image: 'pancake',
				points: 50,
				description: 'Kick the ball with feet very low, just a bit above the grass, after head hit'
			},
			mamasjuggler: {
				name: 'Mama`s juggler',
				image: 'mamasjuggler',
				points: 100,
				description: 'Kick the ball 5 times with left feet after right (or visa-versa)',
			},
			beesknees: {
				name: 'Bee`s knees',
				image: 'beesknees',
				points: 100,
				description: 'Juggle the ball with left after right knee (or visa-versa) 5 times in a row',
			},
			shouldermaster: {
				name: 'Shoulder master',
				image: 'shouldermaster',
				points: 100,
				description: 'Juggle the ball with left after right shoulder (or visa-versa) 5 times in a row',
			},
			halfmilkshake: {
				name: 'Half-milkshake',
				image: 'halfmilkshake',
				points: 150,
				description: 'Kick the ball with feet, knee, shoulder and head on one side, left or right (head could be on any side)'
			},
			header: {
				name: 'Header',
				image: 'header',
				points: 150,
				description: 'Hit the ball with head 5 times in a row'
			},
			milkshake: {
				name: 'Milkshake',
				image: 'milkshake',
				points: 200,
				description: 'Kick the ball with feet, knee, shoulder and head on one side, and shoulder, knee and feet on the other (head could be on any side)'
			},
			aroundtheworld: {
				name: 'Around the world',
				image: 'aroundTheWorld',
				points: 300,
				description: 'Kick the ball from one side and then from the other while keeping mouse button pressed'
			},
		}
		for (var k in trickDict)
		{
			var trickLabel = new TrickLabel(trickDict[k].name, trickDict[k].image, trickDict[k].points, trickDict[k].description);
			this.trickArray.push(trickLabel);
			trickLabel.spriteGroup.alpha = 0;
			game.add.group(trickLabel.spriteGroup);
		}
		this.currentTrick = this.trickArray[0];
		this.currentTrick.spriteGroup.alpha = 1;
		this.currentIndex = 0;
		//back button
		this.backBut = game.add.button(game.width * 0.5, game.height * 0.88,
			'backBut', this.goBack, this, 'out', 'out', 'down', 'out');
		this.backBut.scale.setTo(0.8 * this.scale, 0.8*this.scale);
		this.backBut.anchor.x = 0.5;
		this.backBut.anchor.y = 0.5;
		//left and right arrows
		this.turnLeftBut = game.add.button(game.width*0.2, game.height*0.88, 
			'leftArrowBut', this.showNext, this, 'out', 'out', 'down', 'out');
		this.turnLeftBut.anchor.x = 0.5;
		this.turnLeftBut.anchor.y = 0.5;
		this.turnLeftBut.scale.setTo(0.8*this.scale, 0.8*this.scale);
		this.turnRightBut = game.add.button(game.width*0.8, game.height*0.88, 
			'rightArrowBut', this.showNext, this, 'out', 'out', 'down', 'out');
		this.turnRightBut.anchor.x = 0.5;
		this.turnRightBut.anchor.y = 0.5;
		this.turnRightBut.scale.setTo(0.8*this.scale, 0.8*this.scale);
	},

	showNext: function(button){
		if (button.key==='leftArrowBut')
		{
			if (this.currentIndex>0){
				this.currentIndex--;
				
			} else {
				this.currentIndex = this.trickArray.length - 1;
			}
		} else
		{
			if (this.currentIndex<this.trickArray.length - 1){
				this.currentIndex++;
			} else {
				this.currentIndex = 0;
			}
		}
		this.nextTrick = this.trickArray[this.currentIndex];
		var fadeOutTween = game.add.tween(this.currentTrick.spriteGroup).to({alpha:0}, 300, Phaser.Easing.Linear.None, true);
		fadeOutTween.onComplete.add(this.fadeInNext, this);
	},

	fadeInNext: function(){
		var fadeInTween = game.add.tween(this.nextTrick.spriteGroup).to({alpha:1}, 300, Phaser.Easing.Linear.None, true);
		this.currentTrick = this.nextTrick;
	},

	goBack: function() {
		game.scale.onOrientationChange.remove(this.orientChange, this);
		if (game.state.previousToTricks === 'main')
		{
			game.state.start('mainMenu');			
		} else {
			game.state.start('play');
		}
	},

	orientChange: function(scale, prevOrientation) {
		var prevGameWidth = game.width;
		var prevGameHeight = game.height;
		if (game.device.safari || game.device.mobileSafari || game.device.desktop) {
			var height = window.innerHeight*window.devicePixelRatio;
			var width = window.innerWidth*window.devicePixelRatio;
			var gDimensions = determineGameDimensions(width, height);
			game.scale.setGameSize(gDimensions[0], gDimensions[1]);
			game.scale.setUserScale(window.innerHeight/gDimensions[1], 
				window.innerHeight/gDimensions[1]);
			var cScale = window.innerHeight/gDimensions[1];
			cScale = window.innerHeight/game.height;
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
			}
		}
		game.scale.refresh();
		var scalAllscaleY = game.height/prevGameHeight;
		this.scaleAll(game.width/prevGameWidth, game.height/prevGameHeight);
	},

	scaleAll: function(scaleX, scaleY){
		this.background.scale.setTo(game.height / game.cache.getImage('background').height, game.height / game.cache.getImage('background').height);
		this.backWidth = Math.round(game.height / game.cache.getImage('background').height * game.cache.getImage('background').width);
		this.width = game.width;
		this.height = game.height;
		if (game.height/game.width > 960/640)
		{
			this.scale = game.width/640;
		} else {
			this.scale = game.height/960;
		}
		this.tricksMenuLabel.scale.setTo(game.width / 640, game.height / 960);
		this.tricksMenuLabel.x = game.width/2;
		this.tricksMenuLabel.y = game.height/2;
		this.menuName.scale.setTo(this.scale, this.scale);
		this.menuName.x = 0.5*game.width;
		this.menuName.y = 0.085*game.height;
		this.turnLeftBut.scale.setTo(0.8*this.scale, 0.8*this.scale);
		this.turnLeftBut.x =game.width*0.2;
		this.turnLeftBut.y = game.height*0.88;
		this.turnRightBut.scale.setTo(0.8*this.scale, 0.8*this.scale);
		this.turnRightBut.x =game.width*0.8;
		this.turnRightBut.y = game.height*0.88;
		this.backBut.scale.setTo(0.8 * this.scale, 0.8*this.scale);
		this.backBut.x = 0.5*game.width;
		this.backBut.y = 0.88*game.height;
		for (t in this.trickArray){
			this.trickArray[t].picture.scale.setTo(this.scale, this.scale);
			this.trickArray[t].picture.x = game.width*0.5;
			this.trickArray[t].picture.y = game.height*0.45;

			this.trickArray[t].nameSticker.scale.setTo(this.scale, this.scale);
			this.trickArray[t].nameSticker.x = 0.28*game.width;
			this.trickArray[t].nameSticker.y = game.height*0.3;

			this.trickArray[t].scoreLabel.scale.setTo(this.scale, this.scale);
			this.trickArray[t].scoreLabel.x = 0.5*game.width;
			this.trickArray[t].scoreLabel.y = 0.36*game.height;

			this.trickArray[t].pointsText.scale.setTo(this.scale, this.scale);
			this.trickArray[t].pointsText.x = this.trickArray[t].scoreLabel.x + this.trickArray[t].scoreLabel.width*1.1;
			this.trickArray[t].pointsText.y = this.trickArray[t].scoreLabel.y - this.trickArray[t].scoreLabel.height*0.5;
			this.trickArray[t].pointsText.maxWidth = 0.4*game.width;
		}		
	},

	handlePause: function(){		
		game.paused = true;
	},

	handleResume: function(){
		game.paused = false;
	},
}

function TrickLabel(name, image, points, description){
	this.name = name;
	this.image = image;
	this.points = points;
	this.description = description;
	this.spriteGroup = game.make.group();

	if (game.height/game.width > 960/640)
	{
		this.scale = game.width/640;
	} else {
		this.scale = game.height/960;
	}

	this.picture = game.make.sprite(0.5*game.width, 0.45*game.height, image);
	this.picture.anchor.x = 0.5;
	this.picture.anchor.y = 0;
	this.picture.scale.setTo(this.scale, this.scale);
	this.spriteGroup.add(this.picture);

	this.nameSticker = game.make.sprite(game.width*0.28, game.height*0.3, 'sticker');
	this.nameSticker.anchor.x = 0.5;
	this.nameSticker.anchor.y = 0.5;
	this.nameSticker.frameName = image;
	this.nameSticker.scale.setTo(this.scale, this.scale);

	this.scoreLabel = game.make.sprite(game.width*0.5, game.height*0.36, 'scoreLabel');
	this.scoreLabel.anchor.x = 0;
	this.scoreLabel.anchor.y = 1;
	this.scoreLabel.scale.setTo(this.scale, this.scale);

	this.pointsText = game.make.bitmapText(this.scoreLabel.x + this.scoreLabel.width*1.1, this.scoreLabel.y - this.scoreLabel.height/2,'FJCaptionFont', ''+points, 72);
	this.pointsText.anchor.y = 0.5;
	this.pointsText.scale.setTo(this.scale, this.scale);
	this.pointsText.maxWidth = 0.4*game.width;

	this.spriteGroup.add(this.nameSticker);
	this.spriteGroup.add(this.pointsText);
	this.spriteGroup.add(this.scoreLabel);
}

document.addEventListener("pause", tricksMenu.handlePause, false);

document.addEventListener("resume", tricksMenu.handleResume, false);