var playState = {	

	preload: function() {
		game.time.advancedTiming = true;
	},

	create: function() {
		this.score = 0;
		this.previousScore = 0;
		this.scoreSpeed = 0;
		this.limbArray = [];
		this.angleArray = [];
		this.recordAngle = false;
		this.stationaryPoint = 'undefined';
		this.ballPosArray =[];
		this.stallTrigger = false;
		this.gameMode = 'play';
		this.lastPoints = 0;
		this.isTurningLeft = false;
		this.isTurningRight = false;
		this.timeFromLastKick= 1;		
		this.targetLBorder = 0;
		this.inMilkshake = false;
		this.inHalfMilkshake = false;
		this.currentTrick='';

		game.scale.onOrientationChange.add(this.orientChange, this);
		game.world.setBounds(-10000, -1000, 20000, 1000 + game.height);
		//set local storage
		if (localStorage.getItem('highscore')===null)
		{
			localStorage.setItem('highscore', 0);
		}
		//set up pointers
		game.input.maxPointers = 1;
		//create background
		this.background = game.add.tileSprite(-10000, 0, 20000, game.height, 'background');
		this.background.tileScale.setTo(game.height / game.cache.getImage('background').height, game.height / game.cache.getImage('background').height);
		this.backWidth = Math.round(game.height / game.cache.getImage('background').height * game.cache.getImage('background').width);
		//set game width and height variables
		this.width = game.width;
		this.height = game.height;
		this.relLeftBorder = 0;
		this.relRightBorder = game.width;
		if (game.height/game.width > 960/640)
		{
			this.scale = game.width/640;
		} else {
			this.scale = game.height/960;
		}
		//create character group
		this.people = game.add.group();
		//set physics system
		game.physics.p2.setImpactEvents(true);
		game.physics.p2.gravity.y = 750/960*game.height;//basic is 700
		game.physics.p2.restitution = 1;

		this.kickSignal = new Phaser.Signal();
		this.trickSignal = new Phaser.Signal();
		this.explosionSignal = new Phaser.Signal();
		this.hitFloorSignal = new Phaser.Signal();
		this.limbScaleSignal = new Phaser.Signal();
		this.nextLimbSignal = new Phaser.Signal();		

		this.drawHUD();

		//set shadow
		this.shadow = game.add.sprite(400, this.height * 0.9 + game.cache.getImage('shadow').height/2, 'shadow');
		this.shadow.anchor.x = 0.5;
		this.shadow.anchor.y = 0.5;
		this.bottomBorder = game.add.sprite(0, this.height*0.95);
		this.bottomBorder.height = 0.1*this.height;
		this.bottomBorder.width = 20000;		
		game.physics.p2.enable(this.bottomBorder, false);
		this.bottomBorder.body.static = true;
		this.bottomBorder.body.collideWorldBounds = true;
		this.bottomBorder.body.data.gravityScale = 0;
		this.bottomBorder.body.clearShapes();
		this.bottomBorder.body.addRectangle(this.bottomBorder.width, this.bottomBorder.height);
		this.bottomCollisionGroup = game.physics.p2.createCollisionGroup();
		this.bottomBorder.body.setCollisionGroup(this.bottomCollisionGroup);		
		//set ball
		this.ball = game.add.sprite(game.width*3/4, game.height/3, 'ball');
		this.ball.scale.setTo(this.scale, this.scale);
		game.physics.p2.enable(this.ball, false);
		this.ball.body.setCircle(Math.round(40*this.scale));
		this.ball.body.collideWorldBounds = true;
		this.ball.body.mass = 50;
		this.ball.body.damping = 0.3;
		this.ballCollisionGroup = game.physics.p2.createCollisionGroup();
		this.ball.inFloorBounce = false;
		this.ball.body.data.gravityScale = 0;
		//collision groups
		this.joystickCollisionGroup = game.physics.p2.createCollisionGroup();
		game.physics.p2.updateBoundsCollisionGroup();		
		this.bottomBorder.body.collides([this.ballCollisionGroup], this.floorHit, this);
		//create joystick
		this.joystick = game.add.sprite(this.width, this.height, 'joystick');
		this.joystick.scale.setTo(this.scale, this.scale);
		game.physics.p2.enable(this.joystick, false);
		this.joystick.body.mass = 100;
		this.joystick.body.clearShapes();
		//scale polygon
		var polygonJSON = game.cache.getJSON('joystickPhysics', true);

		for (var label in polygonJSON)
		{
			var shapes = polygonJSON[label];
			for (var i = 0; i<shapes.length; i++)
			{
				for (var c = 0; c<shapes[i].shape.length; c++)
				{
					shapes[i].shape[c] = Math.round(shapes[i].shape[c] * this.scale);
				}
			}
		}
		this.joystick.body.loadPolygon(null, polygonJSON['joystick']);
		this.joystick.body.fixedRotation = true;
		this.joystick.body.setCollisionGroup(this.joystickCollisionGroup);
		this.joystick.alpha = 0;
		//joystick callbacks
		game.input.onDown.add(this.showJoystick, this);
		game.input.onUp.add(this.hideJoystick, this);
		//create mouse body and constrain for joystick to follow it
		this.mouseBody = new p2.Body();
		game.physics.p2.world.addBody(this.mouseBody);
		this.joystickMouseOffset = [0, 30 * this.scale];
		//create explosion
		this.explosion = game.add.sprite(0, 0, 'explosion');
		this.explosion.animations.add('main', [0, 1, 2, 3, 4, 5, 6, 7, 0], 16, false);
		this.explosion.launchExplosion = launchExplosion;
		this.explosion.scale.setTo(this.scale, this.scale);
		this.explosionSignal.add(this.explosion.launchExplosion, this.explosion);
		//pause button
		this.pauseBut = game.add.button(this.width*0.05, this.height*0.99, 
			'pauseBut', this.pauseGame, this, 'offOut', 'offOut', 'offDown', 'offOut');
		this.pauseBut.fixedToCamera = true;
		this.pauseBut.anchor.x = 0;
		this.pauseBut.anchor.y = 1;
		this.pauseBut.scale.setTo(0.8*this.scale, 0.8*this.scale);
		//set mute button
		this.muteBut = null;
		if (game.sound.mute) {
			this.muteBut = game.add.button(game.width*0.95, game.height*0.99, 'muteBut', this.manageMute, this,
				'muteOnOut', 'muteOnOut', 'muteOnDown', 'muteOnOut');
		} else {
			this.muteBut = game.add.button(game.width*0.95, game.height*0.99, 'muteBut', this.manageMute, this,
				'muteOffOut', 'muteOffOut', 'muteOffDown', 'muteOffOut');
		}
		this.muteBut.anchor.x = 1;
		this.muteBut.anchor.y = 1;
		this.muteBut.scale.setTo(0.8*this.scale, 0.8*this.scale);
		this.muteBut.fixedToCamera = true;

		this.rotButton = new RotationButton(game, 0.5, 0.95, this.scale);
		this.rotButton.rotSignal.add(function(distance){
			if (distance<0) this.turnLeft(distance);
			else this.turnRight(distance);
		}, this);

		//create final menu
		this.finalMenu = game.add.group();
		this.finalMenuLabel = game.make.sprite(this.width/2, this.height / 2, 'finalMenuLabel');
		this.finalMenuLabel.scale.setTo(game.width / 640, game.height/ 960);
		this.finalMenuLabel.anchor.x = 0.5;
		this.finalMenuLabel.anchor.y = 0.5;
		//set name of final menu
		this.finalMenuName = game.make.bitmapText(this.width/2, this.height * 0.1, 'FJFont', 'Ball touched the ground', 58);
		this.finalMenuName.anchor.x = 0.5;
		this.finalMenuName.anchor.y = 0.5;
		this.finalMenuName.scale.setTo(this.scale, this.scale);
		//restart button
		this.restartBut = game.make.button(this.width/ 2, this.height*0.46, 
			'restartBut', this.restartGame, this, 'out', 'out', 'down', 'out');
		this.restartBut.anchor.setTo(0.5, 0);
		this.restartBut.scale.setTo(this.scale, this.scale);
		//exit button
		this.mainMenuBut = game.make.button(this.width / 2, this.height*0.58, 
			'mainMenuBut', this.goMainMenu, this, 'out', 'out', 'down', 'out');
		this.mainMenuBut.anchor.setTo(0.5, 0);
		this.mainMenuBut.scale.setTo(this.scale, this.scale);
		//tricks button		
		this.tricksBut = game.make.button(this.width/ 2, this.height*0.70, 
			'tricksBut', this.goToTricks, this, 'out', 'out', 'down', 'out');
		this.tricksBut.anchor.setTo(0.5, 0);
		this.tricksBut.scale.setTo(this.scale, this.scale);
		//get mobile button
		this.getMobBut = game.make.button(this.width/ 2, this.height*0.82, 
			'getMobBut', this.getMobileGame, this, 'out', 'out', 'down', 'out');
		this.getMobBut.anchor.setTo(0.5, 0);
		this.getMobBut.scale.setTo(this.scale, this.scale);
		this.totalScoreText = game.make.bitmapText(this.width * 0.6, this.height*0.28, 'FJCaptionFont','0', 64);
		this.totalScoreText.anchor.x = 0.5;
		this.totalScoreText.anchor.y = 0.5;
		this.totalScoreText.scale.setTo(this.scale, this.scale);
		this.totalScoreLabel = game.make.sprite(this.width * 0.59 - this.totalScoreText.width, this.height*0.28, 'scoreLabel');
		this.totalScoreLabel.anchor.x = 1;
		this.totalScoreLabel.anchor.y = 0.5;
		this.totalScoreLabel.scale.setTo(game.width/640, game.width/640);		
		this.highestScoreText = game.make.bitmapText(this.width * 0.88, this.height*0.4, 'FJCaptionFont', localStorage.getItem('highscore'), 48);
		this.highestScoreText.anchor.x = 1;
		this.highestScoreText.anchor.y = 0.5;
		this.highestScoreText.scale.setTo(this.scale, this.scale);
		this.highestScorePicture = game.make.sprite(this.width * 0.87 - this.highestScoreText.width, this.height * 0.4, 'scoreLabel');
		this.highestScorePicture.anchor.x = 1;
		this.highestScorePicture.anchor.y = 0.5;
		this.highestScorePicture.scale.setTo(game.width/640/2, game.width/640/2);
		this.highestScoreLabel = game.make.bitmapText(this.highestScorePicture.x-this.highestScorePicture.width * 1.1, this.height*0.4, 'FJCaptionFont','Highest', 48)
		this.highestScoreLabel.anchor.x = 1;
		this.highestScoreLabel.anchor.y = 0.5;
		this.highestScoreLabel.scale.setTo(this.scale, this.scale);
		//set people positions
		this.setPeoplePositions();
		//launch score speedometer
		this.speedTimer = game.time.create(false);
		this.speedTimer.loop(1000, this.measureScoreSpeed, this);
		this.speedTimer.start();
		//set kick timer
		this.kickTimer = game.time.create(false);
		this.kickTimer.loop(300, this.updateLastKickTime, this);
		this.kickTimer.start();
		//set music
		this.ballLegSound = game.add.audio('ballLeg');
		this.ballKneeSound = game.add.audio('ballKnee');
		this.ballShoulderSound = game.add.audio('ballShoulder');
		this.ballHeadSound = game.add.audio('ballHead');
		this.finalMusic = game.add.audio('finalMusic');
		this.finalMusic.volume = 0.6;
		this.mainLoopMusic = game.add.audio('mainLoop');
		this.mainLoopMusic.volume = 0.6;
		this.supportSound1 = game.add.audio('support1');
		this.supportSound2 = game.add.audio('support2');
		this.supportSound3 = game.add.audio('support3');
		this.mainIntroMusic = game.add.audio('mainIntro');
		this.mainIntroMusic.volume = 0.6;
		this.whistleSound = game.add.audio('whistle');
		this.whistleSound.volume = 0.6;
		var sounds = [this.ballLegSound, this.ballKneeSound, this.ballShoulderSound, this.ballHeadSound,
		this.finalMusic, this.supportSound1, this.supportSound2, this.supportSound3,
		this.mainIntroMusic, this.whistleSound, this.mainLoopMusic];
		game.sound.setDecodedCallback(sounds, this.soundsDecoded, this);
		//set swipe behavior
		//this.swipe = new Swipe(game);
		//this.game.input.keyboard.destroy();
		//countdown tweens
		this.numOneSprite = game.add.sprite(game.width/2, game.height/3, 'numOne');
		this.numOneSprite.scale.setTo(this.scale, this.scale);
		this.numOneSprite.anchor.setTo(0.5, 0.5);
		this.numOneSprite.alpha = 0

		this.numTwoSprite = game.add.sprite(game.width/2, game.height/3, 'numTwo');
		this.numTwoSprite.scale.setTo(this.scale, this.scale);
		this.numTwoSprite.alpha = 0;
		this.numTwoSprite.anchor.setTo(0.5, 0.5);

		this.numThreeSprite = game.add.sprite(game.width/2, game.height/3, 'numThree');
		this.numThreeSprite.scale.setTo(this.scale, this.scale);
		this.numThreeSprite.anchor.setTo(0.5, 0.5);

		this.countOneScaleTween = game.add.tween(this.numOneSprite.scale).to({x: 1.3*this.scale, y: 1.3*this.scale}, 1000, Phaser.Easing.Linear.None, false);
		this.countTwoScaleTween = game.add.tween(this.numTwoSprite.scale).to({x: 1.3*this.scale, y: 1.3*this.scale}, 1000, Phaser.Easing.Linear.None, false);
		this.countThreeScaleTween = game.add.tween(this.numThreeSprite.scale).to({x: 1.3*this.scale, y: 1.3*this.scale}, 1000, Phaser.Easing.Linear.None, false);
		this.countOneScaleTween.onComplete.add(function() {
			this.numOneSprite.alpha = 0;
			this.numOneSprite.scale.setTo(this.scale, this.scale);
			this.ball.body.data.gravityScale = 1;
			this.ball.body.setCollisionGroup(this.ballCollisionGroup);
			this.ball.body.collides([this.joystickCollisionGroup, this.bottomCollisionGroup]);
		}, this);
		this.countTwoScaleTween.onComplete.add(function() {
			this.numTwoSprite.alpha = 0;
			this.numOneSprite.alpha = 1;
			this.numTwoSprite.scale.setTo(this.scale, this.scale);
			this.countOneScaleTween.start();
		}, this);
		this.countThreeScaleTween.onComplete.add(function() {			
			this.numThreeSprite.alpha = 0;
			this.numTwoSprite.alpha = 1;
			this.numThreeSprite.scale.setTo(this.scale, this.scale);
			this.countTwoScaleTween.start();
		}, this);

		//assign keys
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.leftKey.onHoldCallback = function() {
			this.moveRotBall('left');
		};
		this.leftKey.onHoldContext = this.rotButton;
		this.leftKey.onUp.add(this.rotButton.measureRotSpeed, this.rotButton);

		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		this.rightKey.onHoldCallback = function() {
			this.moveRotBall('right');
		};
		this.rightKey.onHoldContext = this.rotButton;
		this.rightKey.onUp.add(this.rotButton.measureRotSpeed, this.rotButton);

		if (game.state.gameParams!=null)
		{
			this.resurrection();
			game.state.gameParams=null;	
		} else {
			this.countThreeScaleTween.start();
		}
	},

	update: function() {
		if (this.pauseLabel.alpha === 1) {
			this.pauseGame();
		}
		this.shadow.x = this.ball.body.x;
		if (this.joystick.alive)
		{
			this.mouseBody.position[0] = game.physics.p2.pxmi(game.input.x + game.camera.x);
			this.mouseBody.position[1] = game.physics.p2.pxmi(game.input.y);
		}		
		//turn the camera
		if (this.isTurningRight && game.camera.x < this.targetLBorder)
		{
			game.camera.x += 30;
			this.relRightBorder += 30;
			this.relLeftBorder += 30;
			this.relRightBorder = this.relRightBorder % this.backWidth;
			this.relLeftBorder = this.relLeftBorder % this.backWidth;
			this.stickerSprite.x += 30;
			this.stickerShine.x += 30;
			this.people.forEach(function(item){		
				if (typeof item.checkOnScreen === 'function')
				{
					item.checkOnScreen(this.relLeftBorder, this.relRightBorder, 'right');
				}			
			}, this);
			this.hideJoystick();
		} else if(game.camera.x === this.targetLBorder){
			this.isTurningRight = false;
		}
		if (this.isTurningLeft && game.camera.x>this.targetLBorder)
		{
			game.camera.x -= 30;
			this.relRightBorder -= 30;
			this.relLeftBorder -= 30;
			if (this.relLeftBorder < 0)
			{
				this.relLeftBorder = this.backWidth + this.relLeftBorder;
			}
			if (this.relRightBorder < 0)
			{
				this.relRightBorder = this.backWidth + this.relRightBorder;
			}
			this.relRightBorder = this.relRightBorder % this.backWidth;
			this.relLeftBorder = this.relLeftBorder % this.backWidth;
			this.stickerSprite.x -= 30;
			this.stickerShine.x -= 30;
			this.people.forEach(function(item){
				if (typeof item.checkOnScreen === 'function')
				{
					item.checkOnScreen(this.relLeftBorder, this.relRightBorder, 'left');
				}
			}, this);
			this.hideJoystick();
		} else if(game.camera.x === this.targetLBorder){
			this.isTurningLeft = false;
		}
		if (this.recordAngle)
		{
			this.angleArray.push(Math.atan2(this.ball.y - game.physics.p2.mpxi(this.mouseBody.position[1]), this.ball.x - game.physics.p2.mpxi(this.mouseBody.position[0])));
		}
		if (velocityMagnitude(this.ball.body.velocity)<60 && this.ball.body.data.gravityScale != 0)
		{
			if (this.ballPosArray.length === 0)
			{
				this.stationaryPoint = new Phaser.Point();
				this.stationaryPoint.x = this.ball.x;
				this.stationaryPoint.y = this.ball.y;
				this.ballPosArray.push(this.stationaryPoint);
			}			
		} else
		{
			this.stationaryPoint = 'undefined';
			this.ballPosArray = [];
		}
		if (this.stationaryPoint != 'undefined')
		{
			var currentBallPos = new Phaser.Point(this.ball.body.x, this.ball.body.y);
			if (this.stationaryPoint.distance(currentBallPos)<40 && this.gameMode==='play')
			{
				this.ballPosArray.push(currentBallPos);
				if (this.ballPosArray.length === 3*60)
				{
					this.trickSignal.dispatch('stall');
					this.lastPoints += 50;
					this.explosionSignal.dispatch(this.ball.x, this.ball.y + this.ball.height/2, this.lastPoints);
					this.score += this.lastPoints;
					this.scoreText.setText(''+this.score);
				}
			} else
			{
				this.ballPosArray = [];
			}			
		}
		this.shadow.scale.setTo((1000 + this.ball.y + this.ball.height)/ game.world.height, 
			(1000 + this.ball.y + this.ball.height)/ game.world.height);
		//check for swipes
		/*var swipeDirection = this.swipe.check();
		if (swipeDirection!=null){
			switch(swipeDirection.direction) {
				case this.swipe.DIRECTION_RIGHT:
					if (!this.isTurningLeft && this.gameMode === 'play'){
						this.turnLeft();
					}
					break;
				case this.swipe.DIRECTION_LEFT:
					if (!this.isTurningRight && this.gameMode === 'play') {
						this.turnRight();
					}
					break;
			}
		}*/
	},

	showJoystick: function() {
		if (game.paused === true){
			this.pauseLabel.alpha = 0;
			game.paused = false;	
			this.pauseBut.setFrames('offOut', 'offOut', 'offDown', 'offOut');
		} else {
			if (this.joystick.alpha=== 0)
			{
				this.joystick.alpha = 1;
			}
			if (!this.joystick.alive)
			{
				this.joystick.revive();
			}
			this.joystick.body.x = game.input.x + game.camera.x;
			this.joystick.body.y = game.input.y;
			this.mouseConstraint = game.physics.p2.createLockConstraint(this.mouseBody, this.joystick, this.joystickMouseOffset);
			this.joystick.body.collides([this.ballCollisionGroup], this.defKickLimb, this);
			tweenTint(this.joystick, 0xff6060, 0xffffff, 400);
			this.recordAngle = true;
		}
	},

	hideJoystick: function() {
		if (this.joystick.alive)
		{
			this.joystick.body.removeCollisionGroup([this.ballCollisionGroup]);
			this.joystick.alpha = 0;
			game.physics.p2.removeConstraint(this.mouseConstraint);
			this.mouseConstraint = null;
			this.joystick.kill();
		}
		this.recordAngle = false;
		this.angleArray = [];
	},

	checkTricks: function() {
		//function checks all tricks but stall
		var trick = '';
		this.currentTrick = '';
		//check pancake
		if (this.joystick.body.y > 0.85 * game.height && (this.limbArray[this.limbArray.length - 2]==='leftHead' || this.limbArray[this.limbArray.length - 2]==='rightHead'))
		{
			trick = 'pancake';
			this.lastPoints += 50;
		}
		//check halfmilkshake
		if (this.limbArray[this.limbArray.length - 1] === 'leftHead' || this.limbArray[this.limbArray.length - 1] === 'rightHead')
		{
			if (this.limbArray[this.limbArray.length - 2] === 'leftShoulder')
			{
				if (this.limbArray[this.limbArray.length - 3] ==='leftKnee')
				{
					if (this.limbArray[this.limbArray.length - 4] ==='leftLeg')
					{
						trick = 'halfmilkshake';
						this.inHalfMilkshake = false;						
						this.lastPoints += 150;
					}
				}
			} else if (this.limbArray[this.limbArray.length - 2] === 'rightShoulder')
			{
				if (this.limbArray[this.limbArray.length - 3] ==='rightKnee')
				{
					if (this.limbArray[this.limbArray.length - 4] ==='rightLeg')
					{
						trick = 'halfmilkshake';
						this.inHalfMilkshake = false;
						this.lastPoints += 150;
					}
				}
			}
		}
		//check milkshake
		if (this.limbArray[this.limbArray.length - 1] === 'leftLeg')
		{
			if (this.limbArray[this.limbArray.length - 2] ==='leftKnee')
			{
				if (this.limbArray[this.limbArray.length - 3] ==='leftShoulder')
				{
					if (this.limbArray[this.limbArray.length - 4] ==='leftHead' || this.limbArray[this.limbArray.length - 4] ==='rightHead')
					{
						if (this.limbArray[this.limbArray.length - 5] ==='rightShoulder')
						{
							if (this.limbArray[this.limbArray.length - 6] ==='rightKnee')
							{
								if (this.limbArray[this.limbArray.length - 7] === 'rightLeg')
								{
									trick = 'milkshake';
									this.inMilkshake = false;
									this.lastPoints += 200;
								}
							}
						}
					}
				}
			}
		}
		if (this.limbArray[this.limbArray.length - 1] === 'rightLeg')
		{
			if (this.limbArray[this.limbArray.length - 2] ==='rightKnee')
			{
				if (this.limbArray[this.limbArray.length - 3] ==='rightShoulder')
				{
					if (this.limbArray[this.limbArray.length - 4] ==='leftHead' || this.limbArray[this.limbArray.length - 4] ==='rightHead')
					{
						if (this.limbArray[this.limbArray.length - 5] ==='leftShoulder')
						{
							if (this.limbArray[this.limbArray.length - 6] ==='leftKnee')
							{
								if (this.limbArray[this.limbArray.length - 7] === 'leftLeg')
								{
									trick = 'milkshake';
									this.inMilkshake = false;
									this.lastPoints += 200;
								}
							}
						}
					}
				}
			}
		}
		if (this.limbArray.length>=5)
		{
			//check mama's jungler
			var last5Limbs = this.limbArray.slice(this.limbArray.length - 5);
			//remember limb -6 to prevent repetion of trick on the next kick
			if (this.limbArray.length>5) var prevLimb = this.limbArray[this.limbArray.length - 6];
			else var prevLimb = '';			
			if ((last5Limbs.equals(['leftLeg', 'rightLeg', 'leftLeg', 'rightLeg', 'leftLeg']) && prevLimb!='rightLeg') || 
				(last5Limbs.equals(['rightLeg', 'leftLeg', 'rightLeg', 'leftLeg', 'rightLeg']) && prevLimb!='leftLeg')) {
				trick = 'mamasjuggler';
				this.lastPoints += 100;
			}
			//check bee's knees
			if ((last5Limbs.equals(['leftKnee', 'rightKnee', 'leftKnee', 'rightKnee', 'leftKnee']) && prevLimb!='rightKnee')|| 
				(last5Limbs.equals(['rightKnee', 'leftKnee', 'rightKnee', 'leftKnee', 'rightKnee']) && prevLimb!='leftKnee')) {
				trick = 'beesknees';
				this.lastPoints += 100;
			}
			//check shoulder master
			if ((last5Limbs.equals(['leftShoulder', 'rightShoulder', 'leftShoulder', 'rightShoulder', 'leftShoulder']) && prevLimb!='rightShoulder')|| 
				(last5Limbs.equals(['rightShoulder', 'leftShoulder', 'rightShoulder', 'leftShoulder', 'rightShoulder']) && prevLimb!='leftShoulder')) {
				trick = 'shouldermaster';
				this.lastPoints += 100;
			}
			//check header
			if ((last5Limbs[0]==='leftHead' || last5Limbs[0]==='rightHead') && (last5Limbs[1]==='leftHead' || last5Limbs[1]==='rightHead') &&
				(last5Limbs[2]==='leftHead' || last5Limbs[2]==='rightHead') && (last5Limbs[3]==='leftHead' || last5Limbs[3]==='rightHead') &&
				(last5Limbs[4]==='leftHead' || last5Limbs[4]==='rightHead') && (prevLimb!='leftHead' && prevLimb!='rightHead')){
				trick = 'header';
				this.lastPoints += 150;
			}
		}
		//check around the world
		if (Math.abs(this.angleArray[0] - this.angleArray[this.angleArray.length - 1]) < 30 * Math.PI / 180)
		{
			for (var i in this.angleArray)
			{
				if (this.angleArray[i] > 85 * Math.PI / 180 && this.angleArray[i] < 95 * Math.PI / 180)
				{
					trick = 'aroundTheWorld';
					this.lastPoints += 300;
					break;
				}
			}
		}
		if (trick === 'aroundTheWorld')
		{
			this.angleArray = [];
		}
		if (trick != '')
		{
			this.trickSignal.dispatch(trick);
			this.currentTrick = trick;
		}		
	},

	drawHUD: function() {
		var limbPos = {leftLeg: [0.01, 0.825], rightLeg: [0.99, 0.825], leftKnee: [0.01, 0.575],
			rightKnee: [0.99, 0.575], leftShoulder: [0.01, 0.325], rightShoulder: [0.99, 0.325],
			leftHead: [0.01, 0.1], rightHead: [0.99, 0.1]};
		for (var limb in limbPos) {
			var limbSprite = game.add.sprite(this.width*limbPos[limb][0], 
					this.height*limbPos[limb][1], limb);
			limbSprite.frameName = "normal";
			limbSprite.alpha = 0.5;
			limbSprite.anchor.y = 0.5;
			if (limbPos[limb][0] === 0.01) {
				limbSprite.anchor.x = 0;
			} else {
				limbSprite.anchor.x = 1;
			}
			limbSprite.tweenScale = game.add.tween(limbSprite.scale).to({x: 1.2*this.scale, y: 1.2*this.scale}, 500, Phaser.Easing.Linear.None, false).yoyo(true);
			limbSprite.tweenAlpha = game.add.tween(limbSprite).to({alpha: 1}, 500, Phaser.Easing.Linear.None, false).yoyo(true);
			limbSprite.limb = limb;
			limbSprite.launchBlink = launchBlink;
			limbSprite.tintNextLimb = tintNextLimb;
			limbSprite.scaleLimb = scaleLimb;
			limbSprite.fixedToCamera = true;
			this.kickSignal.add(limbSprite.launchBlink, limbSprite);
			this.limbScaleSignal.add(limbSprite.scaleLimb, limbSprite);
			this.nextLimbSignal.add(limbSprite.tintNextLimb, limbSprite);
			limbSprite.scale.setTo(this.scale, this.scale);
		}
		//shine of sticker
		this.stickerShine = game.add.sprite(this.width/2, this.height * 0.3, 'shine');
		this.stickerShine.anchor.x = 0.5;
		this.stickerShine.anchor.y = 0.5;
		this.stickerShine.alpha = 0;
		this.stickerShine.scale.setTo(this.scale, this.scale);
		this.shineTweenAlpha1 = game.add.tween(this.stickerShine).to({alpha: 1, angle: '+45'}, 500, Phaser.Easing.Linear.None, false);
		this.shineTweenAlpha2 = game.add.tween(this.stickerShine).to({alpha: 0, angle: '+45'}, 250, Phaser.Easing.Linear.None, false);
		this.shineTweenAlpha1.chain(this.shineTweenAlpha2);
		//add sticker
		this.stickerSprite = game.add.sprite(this.stickerShine.x, this.stickerShine.y, 'sticker');
		this.stickerSprite.anchor.x = 0.5;
		this.stickerSprite.anchor.y = 0.5;
		this.stickerSprite.scale.setTo(this.scale, this.scale);
		this.stickerSprite.alpha = 0;
		this.stickerSprite.cScale = this.scale;
		this.stickerSprite.scaleTween = game.add.tween(this.stickerSprite.scale).to({x: 1.3*this.scale, y: 1.3*this.scale}, 500, Phaser.Easing.Linear.None, false).yoyo(true);
		this.stickerSprite.scaleTween.onComplete.add(function(){
			this.alpha = 0;
			this.scale.setTo(this.cScale, this.cScale);
		}, this.stickerSprite);
		this.stickerSprite.showSticker = showSticker;
		this.trickSignal.add(this.stickerSprite.showSticker, this.stickerSprite);
		this.trickSignal.add(this.launchShine, this);		
		this.scoreLabel = game.add.sprite(this.width /2, this.height * 0.05, 'scoreLabel');
		this.scoreLabel.anchor.x = 0.5;
		this.scoreLabel.anchor.y = 0.5;
		this.scoreLabel.scale.setTo(0.5*this.scale, 0.5*this.scale);
		this.scoreText = game.add.bitmapText(this.scoreLabel.x+this.scoreLabel.width/2*1.2, this.height * 0.05, 'FJCaptionFont','0', 32);
		this.scoreText.anchor.y = 0.5;
		this.scoreText.scale.setTo(this.scale, this.scale);
		this.scoreLabel.fixedToCamera = true;
		this.scoreText.fixedToCamera = true;
		//pause label
		this.pauseLabel = game.add.sprite(game.width/2 + game.camera.x, game.height/2, 'pauseLabel');
		this.pauseLabel.anchor.x = 0.5;
		this.pauseLabel.anchor.y = 0.5;
		this.pauseLabel.scale.setTo(this.scale, this.scale);
		this.pauseLabel.alpha = 0;
		this.pauseLabel.fixedToCamera = true;
		
	},

	defKickLimb: function(){
		if (this.timeFromLastKick>=1)
		{
			var limb ='';
			if (this.limbArray.length === 0) {
				var prevLimb = '';
				var prePrevLimb = '';
			} else if (this.limbArray.length === 1){
				var prevLimb = this.limbArray[this.limbArray.length - 1];
				var prePrevLimb = '';
			} else {
				var prevLimb = this.limbArray[this.limbArray.length - 1];
				var prePrevLimb = this.limbArray[this.limbArray.length - 2];
			}
			this.lastPoints = 1;
			if (this.joystick.body.x > game.camera.x + this.width / 2)
			{
				if (this.joystick.body.y > 0.7 * this.height)
				{
					limb = 'rightLeg';
					if (prevLimb==='leftLeg' && prePrevLimb==='rightLeg') {
						this.inHalfMilkshake = false;
						this.inMilkshake = false;
					} else {
						this.inHalfMilkshake = true;
						this.inMilkshake = true;
					}
				} else if (this.joystick.body.y > 0.45 * this.height)
				{
					limb = 'rightKnee';
					if (prevLimb === 'rightLeg' && this.inHalfMilkshake) {
						this.inHalfMilkshake = true;
					} else {
						this.inHalfMilkshake = false;
					}
					if ((prevLimb === 'rightShoulder'||prevLimb==='rightLeg') && this.inMilkshake) {
						this.inMilkshake = true;
					} else {
						this.inMilkshake = false;
					}
				} else if (this.joystick.body.y > 0.2 * this.height)
				{
					limb = 'rightShoulder';
					if (prevLimb === 'rightKnee' && this.inHalfMilkshake) {
						this.inHalfMilkshake = true;
					} else {
						this.inHalfMilkshake = false;
					}
					if ((prevLimb === 'rightKnee' || prevLimb==='rightHead' || prevLimb==='leftHead') && this.inMilkshake) {
						this.inMilkshake = true;
					} else {
						this.inMilkshake = false;
					}
				} else {
					limb = 'rightHead';
					if ((prevLimb==='leftShoulder' || prevLimb==='rightShoulder') && this.inMilkshake) {
						this.inMilkshake = true;
					} else {
						this.inMilkshake = false;
					}
				}
			} else
			{
				if (this.joystick.body.y > 0.7* this.height)
				{
					limb = 'leftLeg';
					if (prevLimb === 'rightLeg' && prePrevLimb === 'leftLeg') {
						this.inHalfMilkshake = false;
						this.inMilkshake = false;
					} else {
						this.inHalfMilkshake = true;
						this.inMilkshake = true;
					}
				} else if (this.joystick.body.y > 0.45* this.height)
				{
					limb = 'leftKnee';
					if (prevLimb === 'leftLeg' && this.inHalfMilkshake) {
						this.inHalfMilkshake = true;
					} else {
						this.inHalfMilkshake = false;
					}
					if ((prevLimb === 'leftLeg' || prevLimb==='leftShoulder') && this.inMilkshake) {
						this.inMilkshake = true;
					} else {
						this.inMilkshake = false;
					}
				} else if (this.joystick.body.y > 0.2* this.height)
				{
					limb = 'leftShoulder';
					if (prevLimb==='leftKnee' && this.inHalfMilkshake) {
						this.inHalfMilkshake = true;
					} else {
						this.inHalfMilkshake = false;
					}
					if ((prevLimb==='leftKnee'||prevLimb==='leftHead'||prevLimb==='rightHead') && this.inMilkshake) {
						this.inMilkshake = true;
					} else {
						this.inMilkshake = false;
					}
				} else {
					limb = 'leftHead';
					if ((prevLimb==='leftShoulder'||prevLimb==='rightShoulder') && this.inMilkshake) {
						this.inMilkshake = true;
					} else {
						this.inMilkshake = false;
					}
				}
			}
			this.limbArray.push(limb);

			if (this.limbArray.length > 7)
			{
				this.limbArray.shift();
			}
			
			if (this.gameMode === 'play')
			{
				this.checkTricks();
				this.defNextLimb(limb);
				this.kickSignal.dispatch(limb);
			}
			this.explosionSignal.dispatch(this.ball.x, this.ball.y + this.ball.height/2, this.lastPoints);
			this.score += this.lastPoints;
			this.scoreText.setText(''+this.score);
			//kick timer stuff
			this.kickTimer.stop();
			this.timeFromLastKick = 0;
			this.kickTimer.loop(300, this.updateLastKickTime, this);
			this.kickTimer.start();
		}
		
	},

	defNextLimb: function(limb){
		var nextLimbs = [];
		switch (limb) {
			case 'rightLeg':
				if (this.currentTrick != 'mamasjuggler') {
					nextLimbs.push('leftLeg');	
				}
				nextLimbs.push('rightKnee');
				break;
			case 'rightKnee':
				if (this.inHalfMilkshake) {
					nextLimbs.push('rightShoulder');
				} else if (this.inMilkshake) {
					nextLimbs.push('rightLeg');
				} else if (this.currentTrick != 'beesknees'){
					nextLimbs.push('leftKnee');
				}
				break;
			case 'rightShoulder':
				if (this.inHalfMilkshake) {
					nextLimbs.push('leftHead');
					nextLimbs.push('rightHead');
				} else if (this.inMilkshake) {
					nextLimbs.push('rightKnee');
				} else if (this.currentTrick != 'shouldermaster'){
					nextLimbs.push('leftShoulder');
				}
				break;
			case 'rightHead':
			case 'leftHead':
				if (this.inMilkshake) {
					if (this.limbArray[this.limbArray.length - 2]==='leftShoulder') {
						nextLimbs.push('rightShoulder');
					} else if (this.limbArray[this.limbArray.length - 2]==='rightShoulder') {
						nextLimbs.push('leftShoulder');
					} 
				} else {
					if (this.currentTrick != 'header') {
						nextLimbs.push('leftHead');
						nextLimbs.push('rightHead');	
					}					
					nextLimbs.push('rightLeg');
					nextLimbs.push('leftLeg');
				}
				break;
			case 'leftShoulder':
				if (this.inHalfMilkshake) {
					nextLimbs.push('rightHead');
					nextLimbs.push('leftHead');
				} else if (this.inMilkshake) {
					nextLimbs.push('leftKnee');					
				} else if (this.currentTrick != 'shouldermaster'){
					nextLimbs.push('rightShoulder');
				}
				break;
			case 'leftKnee':
				if (this.inHalfMilkshake) {
					nextLimbs.push('leftShoulder');
				} else if (this.inMilkshake) {
					nextLimbs.push('leftLeg');
				} else if (this.currentTrick != 'beesknees'){
					nextLimbs.push('rightKnee');
				}
				break;
			case 'leftLeg':
				if (this.currentTrick != 'mamasjuggler') {
					nextLimbs.push('rightLeg');	
				}				
				nextLimbs.push('leftKnee');
		}
		this.nextLimbSignal.dispatch(nextLimbs);
	},

	floorHit: function(){
		if (this.gameMode === 'play' && this.ball.y>game.height-this.ball.width/2-this.bottomBorder.height)
		{
			this.drawFinalMenu();
			this.rotButton.active = false;
			this.gameMode = 'finish';
			this.hitFloorSignal.dispatch();
			if (this.score > parseInt(localStorage.getItem('highscore')))
			{
				localStorage.setItem('highscore', this.score);
				this.highestScoreText.setText(''+this.score);
				this.highestScorePicture.x = this.width * 0.87 - this.highestScoreText.width;
				this.highestScoreLabel.x = this.highestScorePicture.x - this.highestScorePicture.width * 1.1;
			}
		}
	},

	drawFinalMenu: function(){
		this.isTurningLeft = false;
		this.isTurningRight = false;
		this.finalMenu.x = game.camera.x;		
		this.totalScoreText.setText(''+this.score);
		this.totalScoreLabel.x = this.width * 0.59 - this.totalScoreText.width/2;
		this.finalMenu.add(this.finalMenuLabel);
		this.finalMenu.add(this.restartBut);
		this.finalMenu.add(this.mainMenuBut);
		this.finalMenu.add(this.getMobBut);
		this.finalMenu.add(this.totalScoreText);
		this.finalMenu.add(this.highestScoreText);
		this.finalMenu.add(this.tricksBut);
		this.finalMenu.add(this.totalScoreLabel);
		this.finalMenu.add(this.highestScoreLabel);
		this.finalMenu.add(this.highestScorePicture);
		this.finalMenu.add(this.finalMenuName);
		this.people.forEachAlive(function(item){
			item.kill();
		}, this);
	},

	setPeoplePositions: function(){
		this.peoplePosArray = [];
		this.peoplePosArray[0] = [];
		this.peoplePosArray[1] = [];
		this.peoplePosArray[2] = [];
		var step = this.backWidth / 14/game.width;
		for (var j=0; j<14; j++)
		{
			this.peoplePosArray[0].push((j+1/2) * step);
		}
		step = this.backWidth / 20/game.width;
		for (var j=0; j<20; j++)
		{
			this.peoplePosArray[1].push((j+1/2) * step);
		}
		step = this.backWidth / 30/game.width;
		for (var j=0; j<30; j++)
		{
			this.peoplePosArray[2].push((j+1/2) * step);
		}		
		for (var i = 0; i<3; i++)
		{
			this.peoplePosArray[i].sort(function(a, b){
				var aDist=Math.abs(1/2 - a);
				var bDist=Math.abs(1/2 - b);
				return aDist - bDist;
			});
		}
	},

	addPerson: function(trick){
		var loaferArray = ['loaferMale', 'loaferFemale', 'loaferGirl'];
		do {
			if (this.people.length<=6) {
				var loaferType = 'loaferMale';
				var rawNumber = Math.floor(Math.random()*2);
			} else if (this.people.length <= 12) {
				var loaferType = loaferArray[Math.floor(Math.random()*2)];
				var rawNumber = Math.floor(Math.random()*2);
			} else {
				var loaferType = loaferArray[Math.floor(Math.random()*3)];
				var rawNumber = Math.floor(Math.random()*3);
			}
			var personScale = (rawNumber===0) ? 1:(rawNumber===1)? 0.7: 0.5;
			var center = (this.relLeftBorder+this.relRightBorder)/2/game.width;
			if (this.relLeftBorder>this.relRightBorder) {
				center = (this.relLeftBorder - this.backWidth + this.relRightBorder)/2/game.width;
				if (center<0) {
					center = this.backWidth/game.width + center;
					}
			}
			for (var i = 0; i<3; i++)
			{
				this.peoplePosArray[i].sort(function(a, b){
					var aDist=Math.abs(center - a);
					var bDist=Math.abs(center - b);
					return aDist - bDist;
				});
			}
			var newPersonXPosition = this.peoplePosArray[rawNumber].shift()*game.width;
		} while (!newPersonXPosition)		
		var newPersonYPosition = (rawNumber===0) ? this.height*4/5:(rawNumber===1)? this.height*7/10: this.height*3/5;
		switch(loaferType){
			case 'loaferMale':
				var loaferSprite = game.make.sprite(newPersonXPosition, newPersonYPosition, 'loaferMale');		
				this.people.add(loaferSprite);
				loaferSprite.animations.add('idle',['idle'], 18, true);
				loaferSprite.animations.add('idleBlink', ['idleBlink1', 'idleBlink2', 'idleBlink3', 'idle'], 8, false);
				loaferSprite.animations.add('idleShiftFoot', Phaser.Animation.generateFrameNames('idleShiftLeg', 1, 4), 8, false);
				loaferSprite.animations.add('clubHands', Phaser.Animation.generateFrameNames('club', 1, 17), 10, false);
				loaferSprite.animations.add('shakeHands', Phaser.Animation.generateFrameNames('handShake', 1, 30), 10, false);
				loaferSprite.animations.play('idle');
				break;
			case 'loaferFemale':
				var loaferSprite = game.make.sprite(newPersonXPosition, newPersonYPosition, 'loaferFemale');		
				this.people.add(loaferSprite);
				loaferSprite.animations.add('idle',['idle'], 18, true);
				loaferSprite.animations.add('idleBlink', Phaser.Animation.generateFrameNames('idleBlink', 1, 5), 8, false);
				loaferSprite.animations.add('idleShiftFoot', Phaser.Animation.generateFrameNames('idleShiftLeg', 1, 3), 8, false);
				loaferSprite.animations.add('clubHands', Phaser.Animation.generateFrameNames('club', 1, 17), 10, false);
				loaferSprite.animations.add('shakeHands', Phaser.Animation.generateFrameNames('handShake', 1, 17), 10, false);
				loaferSprite.animations.play('idle');
				break;
			case 'loaferGirl':
				var loaferSprite = game.make.sprite(newPersonXPosition, newPersonYPosition, 'loaferGirl');		
				this.people.add(loaferSprite);
				loaferSprite.animations.add('idle',['idle'], 18, true);
				loaferSprite.animations.add('idleBlink', Phaser.Animation.generateFrameNames('idleBlink', 1, 5), 8, false);
				loaferSprite.animations.add('idleShiftFoot', Phaser.Animation.generateFrameNames('idleShiftLeg', 1, 3), 8, false);
				loaferSprite.animations.add('clubHands', Phaser.Animation.generateFrameNames('club', 1, 13), 17, false);
				loaferSprite.animations.add('shakeHands', Phaser.Animation.generateFrameNames('handShake', 1, 23), 18, false);
				loaferSprite.animations.play('idle');				
				break;
		}
		loaferSprite.timer = game.time.create(false);
		loaferSprite.timer.start();
		loaferSprite.checkOnScreen = checkOnScreen;
		loaferSprite.showPerson = showPerson;
		loaferSprite.hidePerson = hidePerson;
		loaferSprite.playCheerAnimation = playCheerAnimation;
		loaferSprite.playIdleAnimation = playIdleAnimation;
		loaferSprite.anchor.x = 0.5;
		loaferSprite.anchor.y = 1;
		loaferSprite.alpha = 0;
		loaferSprite.cScale = personScale;
		loaferSprite.constantWidth = loaferSprite.width;
		var timeToCall = 8 + Math.floor(Math.random()*5);
		game.time.events.add(Phaser.Timer.SECOND * timeToCall, loaferSprite.playIdleAnimation, loaferSprite);
		//add shadow for person
		var personShadow = game.make.sprite(newPersonXPosition, 
			newPersonYPosition-game.cache.getImage('personShadow').height/2 * personScale, 'personShadow');		
		personShadow.checkOnScreen = checkOnScreen;
		personShadow.showPerson = showPerson;
		personShadow.hidePerson = hidePerson;
		personShadow.anchor.x = 0.5;
		personShadow.constantWidth = personShadow.width;
		personShadow.cScale = personScale;
		this.people.add(personShadow);
		loaferSprite.scale.setTo(personScale * this.scale, personScale* this.scale);
		personShadow.scale.setTo(personScale* this.scale, personScale* this.scale);
		loaferSprite.relLeftBorder = loaferSprite.x - loaferSprite.width/2;
		loaferSprite.relRightBorder = loaferSprite.x + loaferSprite.width/2;
		personShadow.relLeftBorder = personShadow.x - personShadow.width/2;
		personShadow.relRightBorder = personShadow.x + personShadow.width/2;
		this.trickSignal.add(loaferSprite.playCheerAnimation, loaferSprite);
		this.people.sort('y', Phaser.Group.SORT_ASCENDING);
		game.add.tween(loaferSprite).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true);
		loaferSprite.checkOnScreen(this.relLeftBorder, this.relRightBorder, 'right');
		personShadow.checkOnScreen(this.relLeftBorder, this.relRightBorder, 'right');
		loaferSprite.checkOnScreen(this.relLeftBorder, this.relRightBorder, 'left');
		personShadow.checkOnScreen(this.relLeftBorder, this.relRightBorder, 'left');
	},

	turnRight: function(distance){
		var magnitude = distance;
		this.isTurningRight = true;
		this.targetLBorder +=Math.round(game.width*magnitude/30)*30;
	},

	turnLeft: function(distance){
		//console.log('turn left called');
		var magnitude = distance;
		//console.log(magnitude);
		this.isTurningLeft = true;
		this.targetLBorder +=Math.round(game.width*magnitude/30)*30;
	},

	turnRightUp: function(){
		this.isTurningRight = false;
	},

	turnLeftUp: function(){
		this.isTurningLeft = false;
	},

	pauseGame: function(){
		game.paused = true;
		this.pauseBut.setFrames('onOut', 'onOut', 'onDown', 'onOut');
		this.pauseLabel.alpha = 1;	
	},

	measureScoreSpeed: function() {
		this.scoreSpeed = this.score - this.previousScore;
		this.previousScore = this.score;
		this.generatePeople();
	},

	updateLastKickTime: function() {
		this.timeFromLastKick++;
	},

	generatePeople: function() {
		var speed = this.scoreSpeed;
		while (speed>=50)
		{
			if (this.people.length <=4)
			{
				speed -=50;
				this.addPerson();
			} else if (this.people.length <= 10)
			{
				speed -= 100;
				if (speed>=0)
				{
					this.addPerson();
				}
			} else if (this.people.length <= 20)
			{
				speed -= 150;
				if (speed>=0)
				{
					this.addPerson();
				}
			} else if (this.people.length <= 30)
			{
				speed -= 200;
				if (speed>=0)
				{
					this.addPerson();
				}
			} else if (this.people.length > 30)
			{
				speed -= 300;
				if (speed>=0)
				{
					this.addPerson();
				}
			}
		}
	},

	soundsDecoded: function(){
		this.kickSignal.add(this.kickSoundLaunch, this);
		this.hitFloorSignal.add(this.floorHitSondLaunch, this);
		this.mainMusicThemeLaunch();
		this.trickSignal.add(this.supportSoundLaunch, this);
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

	kickSoundLaunch: function(limb){
		switch (limb)
		{
			case 'leftLeg':
			case 'rightLeg':
				this.ballLegSound.play();
				break;
			case 'leftKnee':
			case 'rightKnee':
				this.ballKneeSound.play();
				break;
			case 'leftShoulder':
			case 'rightShoulder':
				this.ballShoulderSound.play();
				break;
			case 'leftHead':
			case 'rightHead':
				this.ballHeadSound.play();
				break;
		}
	},

	floorHitSondLaunch: function(){
		if (this.mainIntroMusic.isPlaying){
			this.mainIntroMusic.stop();
		}
		if (this.mainLoopMusic.isPlaying){
			this.mainLoopMusic.stop();
		}
		this.whistleSound.restart();
		this.finalMusic.loopFull();
	},

	mainMusicThemeLaunch: function(){
		if (this.finalMusic.isPlaying)
		{
			this.finalMusic.stop();
		}
		this.mainIntroMusic.play();
		this.mainIntroMusic.onStop.add(this.launchLoop, this);
	},

	launchLoop: function(){
		this.mainLoopMusic.loopFull();
	},

	supportSoundLaunch: function(){
		if (this.people.length<6)
		{
			this.supportSound1.play();
		} else if (this.people.length<12)
		{
			this.supportSound2.play();
		} else
		{
			this.supportSound3.play();
		}
	},

	launchShine: function(){
		this.shineTweenAlpha1.start();
	},

	restartGame: function()	{
		this.finalMenu.removeAll();
		this.ball.body.x = game.width * 3 /4;
		this.ball.body.y = game.height/3;
		this.ball.body.setZeroVelocity();
		this.ball.body.setZeroRotation();
		this.ball.body.removeCollisionGroup([this.joystickCollisionGroup]);
		this.ball.body.data.gravityScale = 0;
		game.camera.x = 0;
		this.targetLBorder = 0;
		this.score = 0;
		this.previousScore = 0;
		this.scoreText.setText(''+this.score);
		this.setPeoplePositions();
		this.people.forEach(function(item){
			this.trickSignal.removeAll(item);
		}, this);
		this.people.removeAll(true);
		this.gameMode = 'play';
		game.sound.stopAll();
		this.mainMusicThemeLaunch();
		this.limbArray = [];
		this.stickerShine.x = game.width/2;
		this.stickerSprite.x = game.width/2;
		this.relLeftBorder = 0;
		this.relRightBorder = game.width;
		this.numThreeSprite.alpha = 1;
		this.countThreeScaleTween.start();
		this.nextLimbSignal.dispatch('');
		this.rotButton.active = true;
		this.rotButton.putBallToCenter();
	},
	
	goToTricks: function(){
		game.scale.onOrientationChange.remove(this.orientChange, this);
		game.state.start('tricksMenu');
		game.state.previousToTricks = 'play';
		game.state.gameParams = {
			score: this.score,
			ballPos: [this.ball.body.x, this.ball.body.y],
			adReady: this.adReady
		};
	},

	resurrection: function(){
		this.score = game.state.gameParams.score;
		this.ball.body.x = game.state.gameParams.ballPos[0];
		this.ball.body.x = game.state.gameParams.ballPos[1];
		this.adReady = game.state.gameParams.adReady;
		this.gameMode = 'finish';
		this.drawFinalMenu();
		this.mainIntroMusic.stop();
		this.numThreeSprite.alpha = 0;
		if (this.mainIntroMusic.isPlaying){
			this.mainIntroMusic.stop();
		}
		if (this.mainLoopMusic.isPlaying){
			this.mainLoopMusic.stop();
		}
	},

	goMainMenu: function(){
		this.kickSignal.removeAll();
		this.trickSignal.removeAll();
		this.explosionSignal.removeAll();
		this.hitFloorSignal.removeAll();
		this.limbScaleSignal.removeAll();
		this.nextLimbSignal.removeAll();
		this.mainIntroMusic.stop();
		this.mainLoopMusic.stop();
		this.finalMusic.stop();
		game.state.start('mainMenu');
	},

	getMobileGame: function(){
		window.open("https://play.google.com/store/apps/details?id=com.kpded.footballjuggle", "_blank");
	},

	handlePause: function(){
		game.paused = true;
	},

	handleResume: function(){

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
		game.world.setBounds(-10000, -1000, 20000, 1000 + game.height);
		this.background.tileScale.setTo(game.height / game.cache.getImage('background').height, game.height / game.cache.getImage('background').height);
		this.backWidth = Math.round(game.height / game.cache.getImage('background').height * game.cache.getImage('background').width);
		game.camera.x *= scaleX;
		this.relLeftBorder = game.camera.x;
		this.relRightBorder = game.camera.x + game.width;
		this.width = game.width;
		this.height = game.height;
		if (game.height/game.width > 960/640)
		{
			this.scale = game.width/640;
		} else {
			this.scale = game.height/960;
		}
		this.people.forEach(function(item){			
			item.x *= scaleX;
			item.y *= scaleY;
			var cScale = item.cScale;
			item.scale.setTo(cScale*this.scale, cScale*this.scale);
			item.constantWidth *= scaleX;
			item.relLeftBorder = item.x - item.width/2;
			item.relRightBorder = item.x + item.width/2;
		}, this);
		this.ball.key = 'ball';
		this.ball.scale.setTo(this.scale, this.scale);
		this.ball.x *= scaleX;
		this.ball.y *= scaleY;
		this.ball.body.setCircle(this.ball.width/2);
		this.ball.body.shapeChanged();
		this.ball.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball.body.x = this.ball.x;
		this.ball.body.y = this.ball.y;
		this.shadow.scale.setTo(this.scale, this.scale);
		this.shadow.x = this.ball.x;
		this.shadow.y = game.height * 0.9;
		this.bottomBorder.body.static = false;
		this.bottomBorder.y = game.height*0.95;
		this.bottomBorder.height = 0.1*game.height;
		this.bottomBorder.body.clearShapes();
		this.bottomBorder.body.reset(this.bottomBorder.x, this.bottomBorder.y);
		this.bottomBorder.body.addRectangle(this.bottomBorder.width, this.bottomBorder.height);
		this.bottomBorder.body.shapeChanged();
		this.bottomBorder.body.static = true;
		this.bottomBorder.body.setCollisionGroup(this.bottomCollisionGroup);
		//we don't change joystick x and y position since it detemined by mouse
		this.joystick.scale.setTo(this.scale, this.scale);
		this.joystick.body.clearShapes();
		var polygonJSON = game.cache.getJSON('joystickPhysics', true);
		for (var label in polygonJSON)
		{
			var shapes = polygonJSON[label];
			for (var i = 0; i<shapes.length; i++)
			{
				for (var c = 0; c<shapes[i].shape.length; c++)
				{
					shapes[i].shape[c] = Math.round(shapes[i].shape[c] * this.scale);
				}
			}
		}
		this.joystick.body.loadPolygon(null, polygonJSON['joystick']);
		this.joystick.body.setCollisionGroup(this.joystickCollisionGroup);
		this.joystickMouseOffset = [0, 30 * scaleY];

		this.numOneSprite.x = game.width * 0.5;
		this.numOneSprite.y = game.height/3;
		this.numOneSprite.scale.setTo(this.scale, this.scale);

		this.numTwoSprite.x = game.width * 0.5;
		this.numTwoSprite.y = game.height/3;
		this.numTwoSprite.scale.setTo(this.scale, this.scale);

		this.numThreeSprite.x = game.width * 0.5;
		this.numThreeSprite.y = game.height/3;
		this.numThreeSprite.scale.setTo(this.scale, this.scale);

		//scale explosion
		this.explosion.scale.setTo(this.scale, this.scale);
		//scale HUD
		this.stickerShine.scale.setTo(this.scale, this.scale);
		this.stickerShine.x *= scaleX;
		this.stickerShine.y *= scaleY;
		this.stickerSprite.scale.setTo(this.scale, this.scale);
		this.stickerSprite.x = this.stickerShine.x;
		this.stickerSprite.y = this.stickerShine.y;
		this.scoreLabel.fixedToCamera = false;
		this.scoreLabel.scale.setTo(0.5*this.scale, 0.5*this.scale);
		this.scoreLabel.x = game.width*0.5;
		this.scoreLabel.y = game.height*0.05;
		this.scoreLabel.fixedToCamera = true;
		this.scoreText.fixedToCamera = false;
		this.scoreText.scale.setTo(this.scale, this.scale);
		this.scoreText.x = this.scoreLabel.x+this.scoreLabel.width/2*1.2;
		this.scoreText.y = this.height * 0.05;
		this.scoreText.fixedToCamera = true;
		this.limbScaleSignal.dispatch(this.scale);
		this.pauseBut.fixedToCamera=false;
		this.pauseBut.scale.setTo(0.8*this.scale, 0.8*this.scale);
		this.pauseBut.x =0.05*game.width;
		this.pauseBut.y =0.99*game.height;
		this.pauseBut.fixedToCamera=true;
		this.muteBut.fixedToCamera=false;
		this.muteBut.scale.setTo(0.8*this.scale, 0.8*this.scale);
		this.muteBut.x = 0.95*game.width;
		this.muteBut.y = 0.99*game.height;
		this.muteBut.fixedToCamera=true;
		this.pauseLabel.fixedToCamera = false;
		this.pauseLabel.x = game.width * 0.5;
		this.pauseLabel.y = game.height * 0.5;
		this.pauseLabel.scale.setTo(this.scale, this.scale);
		this.pauseLabel.fixedToCamera = true;
		//finish menu scale
		this.finalMenu.x *= scaleX;
		this.finalMenuLabel.scale.setTo(game.width / 640, game.height/ 960);
		this.finalMenuLabel.x = game.width*0.5;
		this.finalMenuLabel.y = 0.5*game.height;
		this.finalMenuName.scale.setTo(this.scale, this.scale);
		this.finalMenuName.x = game.width/2;
		this.finalMenuName.y = game.height*0.1;
		this.getMobBut.scale.setTo(this.scale, this.scale);
		this.getMobBut.x = 0.5*game.width;
		this.getMobBut.y = 0.82*game.height;
		this.restartBut.scale.setTo(this.scale, this.scale);
		this.restartBut.x =0.5*game.width;
		this.restartBut.y =0.46*game.height;
		this.tricksBut.scale.setTo(this.scale, this.scale);
		this.tricksBut.x =0.5 * game.width;
		this.tricksBut.y =0.70*game.height;
		this.mainMenuBut.scale.setTo(this.scale, this.scale);
		this.mainMenuBut.x =0.5*game.width;
		this.mainMenuBut.y =0.58*game.height;
		this.totalScoreText.scale.setTo(this.scale, this.scale);
		this.totalScoreText.x =0.6*game.width;
		this.totalScoreText.y =0.28*game.height;
		this.totalScoreLabel.scale.setTo(game.width/640, game.width/640);
		this.totalScoreLabel.x =game.width * 0.59 - this.totalScoreText.width;
		this.totalScoreLabel.y =game.height*0.28;
		this.highestScoreText.scale.setTo(this.scale, this.scale);
		this.highestScoreText.x =0.88*game.width;
		this.highestScoreText.y =0.4*game.height;
		this.highestScorePicture.scale.setTo(game.width/640/2, game.width/640/2);
		this.highestScorePicture.x =game.width * 0.87 - this.highestScoreText.width;
		this.highestScorePicture.y =game.height * 0.4;
		this.highestScoreLabel.scale.setTo(this.scale, this.scale);
		this.highestScoreLabel.x =this.highestScorePicture.x - this.highestScorePicture.width * 1.1;
		this.highestScoreLabel.y =game.height*0.4;

		this.rotButton.x = game.camera.x + game.width*0.5;
		this.rotButton.y = game.height*0.95;
		this.rotButton.applyScale(this.scale);
	},

}

var launchBlink = function (cLimb) {
	if (cLimb===this.limb){
		this.tweenScale.start();
		this.tweenAlpha.start();
	}
}

var tintNextLimb = function (cLimbs) {
	if (cLimbs.indexOf(this.limb)>=0) {
		this.frameName = "tint";
		this.tweenAlpha.stop();
		this.alpha = 1;
	} else {
		this.frameName = "normal";
		this.alpha = 0.5;
	}
}

var scaleLimb = function (scale) {
	this.scale.setTo(scale, scale);
	this.tween = game.add.tween(this.scale).to({x: 1.2*scale, y: 1.2*scale}, 500, Phaser.Easing.Linear.None, false).yoyo(true);
	var limbPos = {leftLeg: [0.01, 0.825], rightLeg: [0.99, 0.825], leftKnee: [0.01, 0.575],
			rightKnee: [0.99, 0.575], leftShoulder: [0.01, 0.325], rightShoulder: [0.99, 0.325],
			leftHead: [0.01, 0.1], rightHead: [0.99, 0.1]};
	for (k in limbPos){
		if (k===this.key){
			this.fixedToCamera = false;
			this.x = limbPos[k][0]*game.width;
			this.y = limbPos[k][1]*game.height;
			this.fixedToCamera = true;
		}
	}
}

var showSticker = function (trick) {
	this.alpha = 1;
	this.frameName = trick;
	this.scaleTween.start();
}

var velocityMagnitude = function(velocity) {
	var vX = velocity.x;
	var vY = velocity.y;
	var velPoint = new Phaser.Point();
	velPoint.x = vX;
	velPoint.y = vY;
	return velPoint.getMagnitude();
}

var launchExplosion = function(exX, exY, points) {
	this.x = exX - this.width/2;
	this.y = exY;
	this.animations.play('main');
	game.add.tween(this).to({y: exY - this.height /3}, 1000, Phaser.Easing.Linear.None, true);
}

var checkOnScreen = function(relScreenLBorder, relScreenRBorder, dir){
	if (dir==='left')
	{
		if (this.relRightBorder>relScreenLBorder)
		{
			this.showPerson(dir);
		} else if (this.relLeftBorder>relScreenRBorder)
		{
			this.hidePerson();
		}
	} else if (dir==='right')
	{
		if (this.relLeftBorder<relScreenRBorder)
		{
			this.showPerson(dir);
		} else if (this.relRightBorder<relScreenLBorder)
		{
			this.hidePerson();
		}
	}
}

var showPerson = function(dir){
	this.revive();
	var backWidth = Math.round(game.height / game.cache.getImage('background').height * game.cache.getImage('background').width);
	if (dir==='left')
	{
		this.x = Math.floor(game.camera.x/backWidth) * backWidth + this.relLeftBorder + this.constantWidth/2;
	} else if (dir === 'right')
	{
		this.x = Math.floor((game.camera.x+game.width)/backWidth) * backWidth + this.relLeftBorder+ this.constantWidth/2;
	}
}

var hidePerson = function(){
	if (this.key!='personShadow'){
		this.frameName = 'idle';	
	}	
	this.kill();
}

var playCheerAnimation = function(trick) {
	var cheerArray = ['clubHands', 'shakeHands'];
	var cheerType = cheerArray[Math.floor(Math.random()*2)];
	var timeToClap = game.rnd.integerInRange(100, 800);
	this.timer.add(timeToClap, function(){
		this.animations.play(cheerType);
	}, this);
}

var playIdleAnimation = function(){
	if (this.frameName === 'idle')
	{
		var idleArray = ['idleBlink', 'idleShiftLeg'];
		var idleType = idleArray[Math.floor(Math.random()*2)];
		var timeToCall = 8 + Math.floor(Math.random()*5);
		this.animations.play(idleType);
	}
	if (this.alive)
	{
		game.time.events.add(Phaser.Timer.SECOND * timeToCall, this.playIdleAnimation, this);
	}	
}

RotationButton = function(game, widthPer, heightPer, scale) {
	Phaser.Group.call(this, game);
	game.add.existing(this);

	this.game = game;
	this.rotSignal = new Phaser.Signal();
	this.position.set(widthPer*this.game.width, heightPer*this.game.height);
	this.previousCamX = this.game.camera.x;
	this.active = true;

	this.rotBoundaries = this.game.add.sprite(0, 0, 'rotBoundaries');
	this.rotBoundaries.anchor.setTo(0.5, 0.5);
	this.add(this.rotBoundaries);

	this.rotBall = this.game.add.sprite(0, 0, 'rotBall');
	this.rotBall.anchor.setTo(0.5, 0.5);
	this.add(this.rotBall);
	this.rotBall.inputEnabled = true;
	this.rotBall.input.enableDrag();
	this.rotBall.input.allowVerticalDrag = false;	

	this.rotBall.events.onDragStop.add(this.measureRotSpeed, this);

	this.applyScale(scale);

};

RotationButton.prototype = Object.create(Phaser.Group.prototype);
RotationButton.prototype.constructor = RotationButton;

RotationButton.prototype.update = function() {
	if (this.game.camera.x != this.previousCamX) {
		this.x = this.game.camera.x + this.game.width/2;
		/*var dragBound = new Phaser.Rectangle(this.x - this.rotBoundaries.width/2, this.y - this.rotBoundaries.height/2,
			this.rotBoundaries.width, this.rotBoundaries.height);*/
		//this.rotBall.input.boundsRect = dragBound;
		this.previousCamX = this.game.camera.x;
	}
	if (this.rotBall.y != this.rotBoundaries.y) {
		this.rotBall.y = this.rotBoundaries.y;
	}
	if (this.rotBall.x < -this.rotBoundaries.width/2) {
		this.rotBall.x = -this.rotBoundaries.width/2;
	} else if (this.rotBall.x > this.rotBoundaries.width/2) {
		this.rotBall.x = this.rotBoundaries.width/2;
	}

};

RotationButton.prototype.measureRotSpeed = function() {
	if (this.active) {
		var distance = this.rotBall.x;
		this.rotSignal.dispatch(distance/(this.rotBoundaries.width/2));
		this.rotBall.position.set(0, 0);	
	}	
};

RotationButton.prototype.moveRotBall = function(dir) {
	if (dir==='left') {
		if (this.rotBall.x>-this.rotBoundaries.width/2)  {
			this.rotBall.x -= 2;
		}
	} else if (dir==='right') {
		if (this.rotBall.x<this.rotBoundaries.width/2)  {
			this.rotBall.x += 2;
		}
	}	
};

RotationButton.prototype.putBallToCenter = function() {
	this.rotBall.position.set(0, 0);	
};

RotationButton.prototype.applyScale = function(scale) {
	this.rotBall.scale.setTo(scale, scale);
	this.rotBoundaries.scale.setTo(scale, scale);
};

//below code is taken from https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

document.addEventListener("pause", playState.handlePause, false);

document.addEventListener("resume", playState.handleResume, false);
