var demoState = {
	currentDemo: 1,

	create: function(){
		game.scale.onOrientationChange.add(this.orientChange, this);
		game.world.setBounds(-10000, -1000, 20000, 1000 + game.height);
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
		//create characters group
		this.people = game.add.group();
		this.limbArray = [];
		//create signals
		this.kickSignal = new Phaser.Signal();
		this.trickSignal = new Phaser.Signal();
		this.explosionSignal = new Phaser.Signal();
		this.limbScaleSignal = new Phaser.Signal();
		//set physics system
		game.physics.p2.setImpactEvents(true);
		game.physics.p2.gravity.y = 700;
		game.physics.p2.restitution = 1;

		this.nextLimbSignal = new Phaser.Signal();

		this.drawHUD();
		//create mouse body
		this.mouseBody = new p2.Body();
		game.physics.p2.world.addBody(this.mouseBody);

		this.mouseBody1 = new p2.Body();
		game.physics.p2.world.addBody(this.mouseBody1);

		this.joystickMouseOffset = [0, 30 * this.scale];
		//create explosion
		this.explosion = game.add.sprite(0, 0, 'explosion');
		this.explosion.animations.add('main', [0, 1, 2, 3, 4, 5, 6, 7, 0], 16, false);
		this.explosion.scale.setTo(this.scale, this.scale);
		this.explosion.launchExplosion = launchExplosion;
		this.explosionSignal.add(this.explosion.launchExplosion, this.explosion);
		this.setPeoplePositions();
		//launch score speedometer
		this.speedTimer = game.time.create(false);
		this.speedTimer.loop(1000, this.measureScoreSpeed, this);
		this.speedTimer.start();
		//set music
		this.ballLegSound = game.add.audio('ballLeg');
		this.ballKneeSound = game.add.audio('ballKnee');
		this.ballShoulderSound = game.add.audio('ballShoulder');
		this.ballHeadSound = game.add.audio('ballHead');
		this.finalMusic = game.add.audio('finalMusic');
		this.finalMusic.volume = 0.6;
		this.supportSound1 = game.add.audio('support1');
		this.supportSound2 = game.add.audio('support2');
		this.supportSound3 = game.add.audio('support3');
		this.mainIntroMusic = game.add.audio('mainIntro');
		this.mainIntroMusic.volume = 0.6;
		this.whistleSound = game.add.audio('whistle');
		this.whistleSound.volume = 0.6;
		var sounds = [this.ballLegSound, this.ballKneeSound, this.ballShoulderSound, this.ballHeadSound,
		this.finalMusic, this.supportSound1, this.supportSound2, this.supportSound3,
		this.mainIntroMusic, this.whistleSound];
		game.sound.setDecodedCallback(sounds, this.soundsDecoded, this);
		//boolean labels for demo trick
		this.footHit = false;
		this.kneeHit = false;
		this.shoulderHit = false;
		this.balancedOffset = 110;

		//game objects in demo		
		this.ballCollisionGroup = game.physics.p2.createCollisionGroup();

		this.ball = game.add.sprite(game.width*0.7, game.height*0.2, 'ball');
		this.ball.scale.setTo(this.scale, this.scale);
		game.physics.p2.enable(this.ball, false);
		this.ball.body.setCircle(Math.round(40*this.scale));
		this.ball.body.collideWorldBounds = true;
		this.ball.body.mass = 50;
		this.ball.body.damping = 0.3;
		this.ball.alpha = 0;

		this.ball1 = game.add.sprite(game.width*0.2, game.height*0.2, 'ball');
		this.ball1.scale.setTo(this.scale, this.scale);
		game.physics.p2.enable(this.ball1, false);
		this.ball1.body.setCircle(Math.round(40*this.scale));
		this.ball1.body.collideWorldBounds = true;
		this.ball1.body.mass = 50;
		this.ball1.body.damping = 0.3;
		this.ball1.alpha = 0;

		this.joystickCollisionGroup = game.physics.p2.createCollisionGroup();

		game.physics.p2.updateBoundsCollisionGroup();
		
		this.joystick = game.add.sprite(game.width, game.height, 'joystick');
		this.joystick.anchor.x = 0.5;
		this.joystick.anchor.y = 0;
		this.joystick.scale.setTo(this.scale, this.scale);
		game.physics.p2.enable(this.joystick, false);
		this.joystick.body.mass = 100;
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
		this.joystick.body.fixedRotation = true;
		this.joystick.body.setCollisionGroup(this.joystickCollisionGroup);
		this.joystick.alpha = 0;
		this.joystick.kill();

		this.joystick1 = game.add.sprite(game.width, game.height, 'joystick');
		this.joystick1.anchor.x = 0.5;
		this.joystick1.anchor.y = 0;
		this.joystick1.scale.setTo(this.scale, this.scale);
		game.physics.p2.enable(this.joystick1, false);
		this.joystick1.body.mass = 100;
		this.joystick1.body.clearShapes();
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

		this.joystick1.body.loadPolygon(null, polygonJSON['joystick']);
		this.joystick1.body.fixedRotation = true;
		this.joystick1.body.setCollisionGroup(this.joystickCollisionGroup);
		this.joystick1.alpha = 0;
		this.joystick1.kill();

		this.rotBoundaries = game.add.sprite(game.width/2, game.height*0.95, 'rotBoundaries');
		this.rotBoundaries.anchor.setTo(0.5, 0.5);
		this.rotBoundaries.scale.setTo(this.scale, this.scale);
		this.rotBoundaries.alpha = 0;

		this.rotBall = game.add.sprite(game.width/2, game.height*0.95, 'rotBall');
		this.rotBall.anchor.setTo(0.5, 0.5);
		this.rotBall.scale.setTo(this.scale, this.scale);
		this.rotBall.alpha = 0;

		this.fingerSprite = game.add.sprite(0, 0, 'finger');
		this.fingerSprite.anchor.setTo(0.5, 0.7);
		this.fingerSprite.scale.setTo(this.scale, this.scale);
		this.fingerSprite.alpha = 0;

		this.fingerSprite1 = game.add.sprite(0, 0, 'finger');
		this.fingerSprite1.anchor.setTo(0.5, 0.7);
		this.fingerSprite1.scale.setTo(this.scale, this.scale);
		this.fingerSprite1.alpha = 0;

		this.touchAnimation = game.add.sprite(game.width/2, game.height*0.98, 'touchAnimation');
		this.touchAnimation.anchor.x = 0.5;
		this.touchAnimation.anchor.y = 1;
		this.touchAnimation.alpha = 0;
		this.touchAnimation.scale.setTo(this.scale, this.scale);
		this.touchAnimation.animations.add('main', [0, 1, 2, 3, 4, 5, 6], 8, true);		

		this.demoBallHigh = game.add.sprite(game.width*0.75, game.height*0.1, 'demoBall');
		this.demoBallHigh.anchor.x = 0.5;
		this.demoBallHigh.anchor.y = 1;
		this.demoBallHigh.alpha = 0;

		this.demoTrajectoryHigh = game.add.sprite(this.demoBallHigh.x, this.demoBallHigh.y, 'demoTrajLong');
		this.demoTrajectoryHigh.scale.setTo(game.width/640, game.height/960);
		this.demoTrajectoryHigh.anchor.x = 0.5;
		this.demoTrajectoryHigh.anchor.y = 0;
		this.demoTrajectoryHigh.alpha = 0;

		this.demoJoystickHigh = game.add.sprite(this.demoBallHigh.x, this.demoTrajectoryHigh.y+this.demoTrajectoryHigh.height, 'joystick');
		this.demoJoystickHigh.anchor.x = 0.5;
		this.demoJoystickHigh.anchor.y = 0;
		this.demoJoystickHigh.alpha = 0;

		this.demoBallLow = game.add.sprite(game.width*0.25, game.height*0.5, 'demoBall');
		this.demoBallLow.anchor.x = 0.5;
		this.demoBallLow.anchor.y = 1;
		this.demoBallLow.alpha = 0;

		this.demoTrajectoryLow = game.add.sprite(this.demoBallLow.x, this.demoBallLow.y, 'demoTrajShort');
		this.demoTrajectoryLow.scale.setTo(game.width/640, game.height/960);
		this.demoTrajectoryLow.anchor.x = 0.5;
		this.demoTrajectoryLow.anchor.y = 0;
		this.demoTrajectoryLow.alpha = 0;

		this.demoJoystickLow = game.add.sprite(this.demoBallLow.x, this.demoTrajectoryLow.y+this.demoTrajectoryLow.height, 'joystick');
		this.demoJoystickLow.anchor.x = 0.5;
		this.demoJoystickLow.anchor.y = 0;
		this.demoJoystickLow.alpha = 0;

		this.demoPers = game.add.sprite(game.width*0.5, game.height*0.47, 'demoPers');
		this.demoPers.anchor.x = 0.5;
		this.demoPers.anchor.y = 0.5;
		this.demoPers.scale.setTo(this.scale, this.scale);
		this.demoPers.alpha = 0;		

		this.demoGroup = game.add.group();		
		
		//set labels

		this.demoArrows = game.add.group();		
		var arrowsVerticalPos = [0.825, 0.575, 0.325, 0.1];
		var arrowsHorizontalPos = [0.2, 0.8];
		for (var side in arrowsHorizontalPos) {
			var key = (arrowsHorizontalPos[side] === 0.2) ? "demoArrowLeft" : "demoArrowRight";
			for (var hPos in arrowsVerticalPos) {
				var arrow = this.demoArrows.create(arrowsHorizontalPos[side]*game.width, arrowsVerticalPos[hPos]*game.height, key);
				arrow.anchor.x = 0.5;
				arrow.anchor.y = 0.5;
				arrow.scale.setTo(0.7*this.scale, 0.7*this.scale);
			}
		}
		this.demoArrows.alpha = 0;

		this.demoLabel3 = game.add.sprite(game.width * 0.05, game.height * 0.98, 'demoLabel3');
		this.demoLabel3.anchor.x = 0;
		this.demoLabel3.anchor.y = 1;
		this.demoLabel3.scale.setTo(this.scale, this.scale);
		this.demoLabel3.alpha = 0;

		this.demoThirdArrowsNum = game.add.group();
		var arrowsVerticalPos = [0.825, 0.575, 0.325, 0.1];
		for (k in arrowsVerticalPos) {
			var arrow = this.demoThirdArrowsNum.create(0.8*game.width, arrowsVerticalPos[k]*game.height, 'demoArrowRight');
			arrow.anchor.x = 0.5;
			arrow.anchor.y = 0.5;
			arrow.scale.setTo(0.7*this.scale, 0.7*this.scale);
			arrow.alpha = 0;
		}

		this.demoMoveRArrow = game.add.sprite(game.width/2, game.height*0.5, 'demoMoveRArrow');
		this.demoMoveRArrow.anchor.x = 0.5;
		this.demoMoveRArrow.anchor.y = 0.5;
		this.demoMoveRArrow.scale.setTo(this.scale, this.scale);
		this.demoMoveRArrow.alpha = 0;

		this.demoMoveLArrow = game.add.sprite(game.width/2, game.height*0.5, 'demoMoveLArrow');
		this.demoMoveLArrow.anchor.x = 0.5;
		this.demoMoveLArrow.anchor.y = 0.5;
		this.demoMoveLArrow.scale.setTo(this.scale, this.scale);
		this.demoMoveLArrow.alpha = 0;
		this.demoMoveLArrow.fixedToCamera = true;

		this.demoLeftButton = game.add.sprite(game.width/2, game.height*0.8, 'leftButton', 'out');
		this.demoLeftButton.anchor.setTo(1, 0.5);
		this.demoLeftButton.scale.setTo(this.scale, this.scale);
		this.demoLeftButton.alpha = 0;
		this.demoLeftButton.fixedToCamera = true;

		this.demoRightButton = game.add.sprite(game.width/2, game.height*0.8, 'rightButton', 'out');
		this.demoRightButton.anchor.setTo(0, 0.5);
		this.demoRightButton.scale.setTo(this.scale, this.scale);
		this.demoRightButton.alpha = 0;
		this.demoRightButton.fixedToCamera = true;

		this.demoTutorialLabel = game.add.sprite(game.width/2, 10, 'tutorialLabel');
		this.demoTutorialLabel.anchor.setTo(0.5, 0);
		this.demoTutorialLabel.fixedToCamera = true;

		//demo specific signals
		this.ballOutSignal = new Phaser.Signal();
		this.ballKickSignal = new Phaser.Signal();
		this.ballKickSignal1 = new Phaser.Signal();
		this.ballOutSignal.add(this.relaunchBalls, this);
		this.ballKickSignal.add(this.showJoystick, this);
		this.ballKickSignal1.add(this.showJoystick1, this);

		//create first demo
		this.launchFirstDemo();

		//swipe tweens
		this.rightSwipeTween = game.add.tween(this.fingerSprite).to({x: this.rotBoundaries.x + this.rotBoundaries.width/2 - this.rotBall.width/2}, 1200, Phaser.Easing.Linear.None, false, 0, 0);
		this.leftSwipeTween = game.add.tween(this.fingerSprite).to({x: this.rotBoundaries.x - this.rotBoundaries.width/2 + this.rotBall.width/2+100}, 1200, Phaser.Easing.Linear.None, false, 0, 0);

		this.rightRotTween = game.add.tween(this.rotBall).to({x: this.rotBoundaries.x + this.rotBoundaries.width/2 - this.rotBall.width/2}, 1200, Phaser.Easing.Linear.None, false, 0, 0);
		this.leftRotTween = game.add.tween(this.rotBall).to({x: this.rotBoundaries.x - this.rotBoundaries.width/2 + this.rotBall.width/2+100}, 1200, Phaser.Easing.Linear.None, false, 0, 0);
		this.rightRotTween.onComplete.add(this.rotateRight, this);
		this.leftRotTween.onComplete.add(this.rotateLeft, this);
		

	},

	update: function(){
		switch (this.currentDemo) {
			case 1:
				if (this.ball.body.y - this.ball.height/2 <=10 && this.ball.alive) {
					this.ballOutSignal.dispatch();
					if (this.touchAnimation.alpha === 0) {
						this.touchAnimation.animations.play('main');
						this.touchAnimation.alpha = 1;
					}
				} else if (this.ball.body.y >=game.height*0.65) {
					if (!this.joystick.alive) {
						this.ballKickSignal.dispatch(this.ball.x, this.ball.y + this.ball.height*0.9);
					}					
				} else if(this.ball1.body.y >=game.height*0.25 && this.ball1.alive) {
					if (!this.joystick1.alive) {
						this.ballKickSignal1.dispatch(this.ball1.x, this.ball1.y + this.ball1.height*0.9+game.height*0.4);
					}
				}
				break;
			case 3:
				if (this.footHit) {
					if (this.kneeHit){
						if (this.shoulderHit) {
								if (this.ball.body.y+this.ball.height/2>0 && this.ball.body.velocity.y>0) {
									if (!this.joystick.alive) {
										this.ballKickSignal.dispatch(this.ball.x, this.ball.body.y + this.balancedOffset*this.scale);
									}								
								}
						} else {
							this.demoThirdArrowsNum.children[2].alpha = 0.5;
							if(this.ball.body.y+this.ball.height/2>game.height*0.2 && this.ball.body.velocity.y>0) {
								if (!this.joystick.alive) {
									this.ballKickSignal.dispatch(this.ball.x, this.ball.body.y + this.balancedOffset*this.scale);
									this.balancedOffset = 110;
								}
							}
						}
					} else {
						this.demoThirdArrowsNum.children[1].alpha = 0.5;
						if(this.ball.body.y+this.ball.height/2>game.height*0.45 && this.ball.body.velocity.y>0) {
							if (!this.joystick.alive) {
								this.ballKickSignal.dispatch(this.ball.x, this.ball.body.y + this.balancedOffset*this.scale);
								this.balancedOffset = 90;
							}
						}
					}

				} else {
					this.demoThirdArrowsNum.children[0].alpha = 0.5;
					if(this.ball.body.y+this.ball.height/2>game.height*0.7 && this.ball.body.velocity.y>0) {
						if (!this.joystick.alive) {
							this.ballKickSignal.dispatch(this.ball.x, this.ball.body.y + this.balancedOffset*this.scale);
							this.balancedOffset = 80;
						}
					}
				}
		}
		if (this.joystick.alive) {
			this.mouseBody.static = true;
		} else {
			this.mouseBody.staic = false;
		}
	},

	launchFirstDemo: function() {
		//set inform label
		this.currentDemo = 1;
		//set ball				
		this.ball.alpha = 1;
		this.ball.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball.body.collides([this.joystickCollisionGroup]);

		this.ball1.alpha = 1;
		this.ball1.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball1.body.collides([this.joystickCollisionGroup]);

		this.relaunchBalls();

		this.demoBallHigh.alpha = 0.5;
		this.demoGroup.add(this.demoBallHigh);
		this.demoBallHigh.scale.setTo(this.scale, this.scale);

		this.demoTrajectoryHigh.alpha = 0.5;
		this.demoGroup.add(this.demoTrajectoryHigh);

		this.demoJoystickHigh.alpha = 0.5;
		this.demoGroup.add(this.demoJoystickHigh);
		this.demoJoystickHigh.tint = 0xff6060;
		this.demoJoystickHigh.scale.setTo(this.scale, this.scale);

		this.demoBallLow.alpha = 0.5;
		this.demoGroup.add(this.demoBallLow);
		this.demoBallLow.scale.setTo(this.scale, this.scale);

		this.demoTrajectoryLow.alpha = 0.5;
		this.demoGroup.add(this.demoTrajectoryLow);

		this.demoJoystickLow.alpha = 0.5;
		this.demoGroup.add(this.demoJoystickLow);
		this.demoJoystickLow.scale.setTo(this.scale, this.scale);

		game.input.onUp.addOnce(this.transitionSecondDemo, this);
	},

	transitionSecondDemo: function () {
		this.currentDemo = 2;
		var groupFadeOut = game.add.tween(this.demoGroup).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
		groupFadeOut.onComplete.add(this.launchSecondDemo, this);
		this.touchAnimation.animations.stop('main', true);
		this.touchAnimation.alpha = 0;
		this.ball.kill();
		this.hideJoystick();
		this.ball1.kill();
		this.hideJoystick1();
		this.nextLimbSignal.dispatch('');
	},

	launchSecondDemo: function(){
		this.demoGroup = game.add.group();
		this.demoPers.alpha = 1;
		this.demoArrows.alpha =1;
		this.demoGroup.add(this.demoPers);
		game.input.onUp.addOnce(this.transitionThirdDemo, this);
		game.time.events.add(2000, function(){
			this.touchAnimation.alpha = 1;
			this.touchAnimation.animations.play('main');
		}, this);
	},	

	transitionThirdDemo: function(){
		this.currentDemo = 3;
		
		if (this.touchAnimation.alpha === 0) {
			game.time.events.removeAll();
		} else {
			this.touchAnimation.animations.stop('main', true);
			this.touchAnimation.alpha = 0;
		}		
		var arrowsFadeOut = game.add.tween(this.demoArrows).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
		arrowsFadeOut.onComplete.add(this.launchThirdDemo, this);
		var groupFadeOut = game.add.tween(this.demoGroup).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
		this.ball.kill();
		this.hideJoystick();
		this.ball1.kill();
		this.hideJoystick1();
		this.nextLimbSignal.dispatch('');
	},

	launchThirdDemo: function() {
		//set inform label
		this.demoLabel3.alpha = 0;
		//revive ball
		this.reviveBalls();
		for (var i=0; i<5; i++){
			this.addPerson();	
		}
		game.input.onUp.addOnce(this.transitionFourthDemo, this);
	},

	transitionFourthDemo: function() {
		var fadeOutTween = game.add.tween(this.demoLabel3).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
		fadeOutTween.onComplete.add(this.launchFourthDemo, this);
		game.add.tween(this.people).to({alpha:0}, 500, Phaser.Easing.Linear.None, true);
		this.demoThirdArrowsNum.alpha = 0;
		this.touchAnimation.animations.stop('main', true);
		this.touchAnimation.alpha = 0;
		this.ball.kill();
		this.hideJoystick();
		this.nextLimbSignal.dispatch('');		
	},

	launchFourthDemo: function() {
		this.joystick.alpha = 0;
		this.currentDemo = 4;
		this.fingerSprite.alpha = 1;
		this.fingerSprite.anchor.setTo(0.5, 0.5);
		this.fingerSprite.x = this.rotBoundaries.x;
		this.fingerSprite.y = this.rotBoundaries.y;
		if (game.device.desktop) {
			this.demoLeftButton.alpha = 1;
			this.demoRightButton.alpha = 1;	
		}		
		this.launchSwiping();
		game.input.onUp.addOnce(function(){
			game.scale.onOrientationChange.remove(this.orientChange, this);
			if (demoEnter === 'start') {
				game.state.start('play');
				localStorage.setItem('demoShown', 'true');
			} else {
				game.state.start('mainMenu');
				localStorage.setItem('demoShown', 'true');
			}
			this.mainIntroMusic.stop();
			this.touchAnimation.animations.stop('main', true);
			this.touchAnimation.alpha = 0;
		}, this);
	},

	relaunchBall: function() {
		this.ball.kill();
		this.hideJoystick();
		game.time.events.add(800, this.reviveBalls, this);		
	},

	relaunchBalls: function() {
		this.ball.kill();
		this.ball1.kill();
		this.hideJoystick();
		this.hideJoystick1();
		game.time.events.add(800, this.reviveBalls, this);		
	},

	reviveBalls: function() {
		if (!this.ball.alive && (this.currentDemo===1 || this.currentDemo===3)) {
			this.ball.revive();
			this.ball.body.reset(game.width*0.75, game.height*0.2);	
			this.ball.body.setZeroVelocity();
			this.ball.body.setZeroRotation();
		}
		if (!this.ball1.alive && this.currentDemo===1) {
			this.ball1.revive();
			this.ball1.body.reset(game.width*0.25, game.height*0.2);
			this.ball1.body.setZeroVelocity();
			this.ball1.body.setZeroRotation();
		}
	},

	showJoystick: function(xPos, yPos) {
		this.fingerSprite.x = xPos;
		this.fingerSprite.y = yPos;
		this.fingerSprite.alpha = 1;
		this.mouseBody.position[0] = game.physics.p2.pxmi(xPos);
		this.mouseBody.position[1] = game.physics.p2.pxmi(yPos);
		if (this.joystick.alpha=== 0)
		{
			this.joystick.alpha = 1;
		}
		if (!this.joystick.alive)
		{
			this.joystick.revive();
		}
		this.joystick.body.x = xPos;
		this.joystick.body.y = yPos;

		this.mouseConstraint = game.physics.p2.createLockConstraint(this.mouseBody, this.joystick, this.joystickMouseOffset);
		this.joystick.body.collides([this.ballCollisionGroup], this.defKickLimb, this);
		tweenTint(this.joystick, 0xff6060, 0xffffff, 400);
	},

	showJoystick1: function(xPos, yPos) {
		this.fingerSprite1.x = xPos;
		this.fingerSprite1.y = yPos;
		this.fingerSprite1.alpha = 1;
		this.mouseBody1.position[0] = game.physics.p2.pxmi(xPos);
		this.mouseBody1.position[1] = game.physics.p2.pxmi(yPos);
		if (this.joystick1.alpha=== 0)
		{
			this.joystick1.alpha = 1;
		}
		if (!this.joystick1.alive)
		{
			this.joystick1.revive();
		}
		this.joystick1.body.x = xPos;
		this.joystick1.body.y = yPos;

		this.mouseConstraint1 = game.physics.p2.createLockConstraint(this.mouseBody1, this.joystick1, this.joystickMouseOffset);
		this.joystick1.body.collides([this.ballCollisionGroup], this.defKickLimb, this);
		tweenTint(this.joystick1, 0xff6060, 0xffffff, 400);
	},

	hideJoystick: function() {
		if (this.joystick.alive)
		{
			this.fingerSprite.alpha = 0;
			this.joystick.body.removeCollisionGroup([this.ballCollisionGroup]);
			this.joystick.alpha = 0;
			game.physics.p2.removeConstraint(this.mouseConstraint);
			this.mouseConstraint = null;
			this.joystick.kill();
		}
	},

	hideJoystick1: function() {
		if (this.joystick1.alive)
		{
			this.fingerSprite1.alpha = 0;
			this.joystick1.body.removeCollisionGroup([this.ballCollisionGroup]);
			this.joystick1.alpha = 0;
			game.physics.p2.removeConstraint(this.mouseConstraint1);
			this.mouseConstraint1 = null;
			this.joystick1.kill();
		} 
	},

	drawHUD: function(){
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
			limbSprite.scaleLimb = scaleLimb;
			limbSprite.tintNextLimb = tintNextLimb;
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
		this.shineTweenAlpha1 = game.add.tween(this.stickerShine).to({alpha: 1, angle: '+45'}, 500, Phaser.Easing.Linear.None, false, 0, 0);
		this.shineTweenAlpha2 = game.add.tween(this.stickerShine).to({alpha: 0, angle: '+45'}, 250, Phaser.Easing.Linear.None, false, 0, 0);
		this.shineTweenAlpha1.chain(this.shineTweenAlpha2);
		//add sticker
		this.stickerSprite = game.add.sprite(this.stickerShine.x, this.stickerShine.y, 'sticker');
		this.stickerSprite.anchor.x = 0.5;
		this.stickerSprite.anchor.y = 0.5;
		this.stickerSprite.scale.setTo(this.scale, this.scale);
		this.stickerSprite.alpha = 0;
		this.stickerSprite.cScale = this.scale;
		this.stickerSprite.scaleTween = game.add.tween(this.stickerSprite.scale).to({x: 1.3, y: 1.3}, 500, Phaser.Easing.Linear.None, false).yoyo(true);
		this.stickerSprite.scaleTween.onComplete.add(function(){
			this.alpha = 0;
			this.scale.setTo(this.cScale, this.cScale);
		}, this.stickerSprite);
		this.stickerSprite.showSticker = showSticker;
		this.trickSignal.add(this.stickerSprite.showSticker, this.stickerSprite);
		this.trickSignal.add(this.launchShine, this);
	},

	measureScoreSpeed: function() {
		this.scoreSpeed = this.score - this.previousScore;
		this.previousScore = this.score;
	},

	launchSwiping: function(){
		/*this.fingerSprite.x = game.width*2/3;
		this.fingerSprite.y = game.height/3;
		this.fingerSprite.alpha = 1;*/
		this.demoMoveRArrow.alpha = 1;
		//this.rightSwipeTween.start();
		this.rightRotTween.start();
		this.rightSwipeTween.start();
		this.demoRightButton.frameName = 'down';

		this.rotBall.alpha = 1;
		this.rotBoundaries.alpha = 1;
	},

	rotateRight: function() {
		game.time.events.add(100, function(){
			this.demoRightButton.frameName = 'out';
			game.camera.x += 100;
			this.demoMoveRArrow.alpha = 0;
			this.demoMoveLArrow.alpha = 1;
			this.rotBoundaries.x = game.camera.x + game.width/2;
			this.rotBall.x = this.rotBoundaries.x;
			this.fingerSprite.x = this.rotBoundaries.x;
			this.fingerSprite.alpha = 0;
		}, this);
		game.time.events.add(1000, function(){
			//this.leftSwipeTween.start();
			this.leftRotTween.start();
			this.leftSwipeTween.start();
			this.fingerSprite.alpha = 1;
			this.demoLeftButton.frameName = 'down';
		}, this);
		
	},

	rotateLeft: function() {
		game.time.events.add(100, function(){
			this.demoLeftButton.frameName = 'out';
			game.camera.x -= 100;
			this.demoMoveLArrow.alpha = 0;
			this.demoMoveRArrow.alpha = 1;
			this.rotBoundaries.x = game.camera.x + game.width/2;
			this.rotBall.x = this.rotBoundaries.x;
			this.fingerSprite.alpha = 0;
			this.fingerSprite.x = this.rotBoundaries.x;
		}, this);
		game.time.events.add(1000, function(){
			//this.rightSwipeTween.start();
			this.demoRightButton.frameName = 'down';
			this.rightRotTween.start();
			this.rightSwipeTween.start();
			this.fingerSprite.alpha = 1;
			if (this.touchAnimation.alpha === 0) {
				this.touchAnimation.alpha = 1;				
				this.touchAnimation.animations.play('main');
				this.touchAnimation.x = 0.5*game.width;
				this.touchAnimation.y = 0.7*game.height;
			}
		}, this);
		
	},

	launchShine: function(){
		this.shineTweenAlpha1.start();
	},

	updateLastKickTime: function() {
		this.timeFromLastKick++;
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
		var newPersonXPosition = this.peoplePosArray[rawNumber].shift()*game.width;
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
		loaferSprite.playCheerAnimation = playCheerAnimation;
		loaferSprite.anchor.x = 0.5;
		loaferSprite.anchor.y = 1;
		loaferSprite.alpha = 0;
		loaferSprite.cScale = personScale;
		//add shadow for person
		var personShadow = game.make.sprite(newPersonXPosition, 
			newPersonYPosition-game.cache.getImage('personShadow').height/2 * personScale, 'personShadow');
		personShadow.anchor.x = 0.5;
		personShadow.cScale = personScale;
		this.people.add(personShadow);
		loaferSprite.scale.setTo(personScale * this.scale, personScale* this.scale);
		personShadow.scale.setTo(personScale* this.scale, personScale* this.scale);
		this.trickSignal.add(loaferSprite.playCheerAnimation, loaferSprite);
		this.people.sort('y', Phaser.Group.SORT_ASCENDING);
		game.add.tween(loaferSprite).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true);
	},

	defKickLimb: function(){
		var limb ='';
		if (this.limbArray.length === 0) {
			var prevLimb = '';
		} else {
			var prevLimb = this.limbArray[this.limbArray.length - 1];
		}
		this.lastPoints = 1;
		if (this.joystick.body.x > game.camera.x + this.width / 2)
		{
			if (this.joystick.body.y > 0.7 * this.height)
			{
				limb = 'rightLeg';
				if (prevLimb!='leftLeg') {
					this.inHalfMilkshake = true;
					this.inMilkshake = true;
				} else {
					this.inHalfMilkshake = false;
					this.inMilkshake = false;
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
				this.inHalfMilkshake = false;
			}
		} else
		{
			if (this.joystick.body.y > 0.7* this.height)
			{
				limb = 'leftLeg';
				if (prevLimb != 'rightLeg') {
					this.inHalfMilkshake = true;
					this.inMilkshake = true;
				} else {
					this.inHalfMilkshake = false;
					this.inMilkshake = false;
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
				this.inHalfMilkshake = false;
			}
		}
		this.kickSignal.dispatch(limb);
		
		this.limbArray.push(limb);

		if (this.limbArray.length > 7)
		{
			this.limbArray.shift();
		}
		
		this.defNextLimb(limb);

		this.explosionSignal.dispatch(this.ball.x, this.ball.y + this.ball.height/2, this.lastPoints);
		this.score += this.lastPoints;
		//demo specific
		if (this.currentDemo === 3) {
			if (this.joystick.alive)
			{
				this.hideJoystick();	
			}
			switch (limb) {
				case 'leftLeg':
				case 'rightLeg':
					this.footHit = true;
					this.demoThirdArrowsNum.children[0].alpha = 0;
					break;
				case 'leftKnee':
				case 'rightKnee':
					this.kneeHit = true;
					this.demoThirdArrowsNum.children[1].alpha = 0;
					break;
				case 'leftShoulder':
				case 'rightShoulder':
					this.shoulderHit = true;
					this.demoThirdArrowsNum.children[2].alpha = 0;
					this.demoThirdArrowsNum.children[3].alpha = 0.5;
					break;
				case 'leftHead':
				case 'rightHead':
					this.footHit = false;
					this.kneeHit = false;
					this.shoulderHit = false;
					this.demoThirdArrowsNum.children[3].alpha = 0;
					this.trickSignal.dispatch('halfmilkshake');
					this.touchAnimation.animations.play('main');
					this.touchAnimation.alpha = 1;
					this.touchAnimation.x = 0.8*game.width;
					game.time.events.add(500, this.relaunchBall, this);
					if (this.demoLabel3.alpha === 0) {
						game.time.events.add(1000, function(){
							this.demoLabel3.alpha = 1;	
						}, this);						
					}
					this.nextLimbSignal.dispatch('');					
					break;
			}
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
					} else if (this.currentTrick != 'header'){
						nextLimbs.push('leftHead');
						nextLimbs.push('rightHead');
						nextLimbs.push('rightLeg');
						nextLimbs.push('leftLeg');
					}
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

	soundsDecoded: function(){
		this.kickSignal.add(this.kickSoundLaunch, this);
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

	mainMusicThemeLaunch: function(){
		if (this.finalMusic.isPlaying)
		{
			this.finalMusic.stop();
		}
		this.mainIntroMusic.loopFull();
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

		this.ball.scale.setTo(this.scale, this.scale);
		this.ball.x *= scaleX;
		this.ball.y *= scaleY;
		this.ball.body.setCircle(this.ball.width/2);
		this.ball.body.shapeChanged();
		this.ball.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball.body.x = this.ball.x;
		this.ball.body.y = this.ball.y;
		
		this.ball1.scale.setTo(this.scale, this.scale);
		this.ball1.x *= scaleX;
		this.ball1.y *= scaleY;
		this.ball1.body.setCircle(this.ball1.width/2);
		this.ball1.body.shapeChanged();
		this.ball1.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball1.body.x = this.ball1.x;
		this.ball1.body.y = this.ball1.y;

		this.joystick.scale.setTo(this.scale, this.scale);
		this.joystick.x *= scaleX;
		this.joystick.y *= scaleY;
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
		this.joystick.body.shapeChanged();
		this.joystick.body.setCollisionGroup(this.joystickCollisionGroup);

		this.joystick1.scale.setTo(this.scale, this.scale);
		this.joystick1.x *= scaleX;
		this.joystick1.y *= scaleY;
		this.joystick1.body.clearShapes();
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
		this.joystick1.body.loadPolygon(null, polygonJSON['joystick']);
		this.joystick1.body.shapeChanged();
		this.joystick1.body.setCollisionGroup(this.joystickCollisionGroup);

		this.joystickMouseOffset = [0, 30 * this.scale];
		//scale explosion
		this.explosion.scale.setTo(this.scale, this.scale);
		//scale HUD
		this.stickerShine.scale.setTo(this.scale, this.scale);
		this.stickerShine.x = game.width*0.5;
		this.stickerShine.y = game.height*0.3;
		this.stickerSprite.scale.setTo(this.scale, this.scale);
		this.stickerSprite.x = this.stickerShine.x;
		this.stickerSprite.y = this.stickerShine.y;
		this.limbScaleSignal.dispatch(this.scale);
		//finger
		this.fingerSprite.x *= scaleX;
		this.fingerSprite.y *= scaleY;
		this.fingerSprite.scale.setTo(this.scale, this.scale);

		this.fingerSprite1.x *= scaleX;
		this.fingerSprite1.y *= scaleY;
		this.fingerSprite1.scale.setTo(this.scale, this.scale);

		this.demoBallHigh.x *= scaleX;
		this.demoBallHigh.y *= scaleY;
		this.demoBallHigh.scale.setTo(this.scale, this.scale);

		this.demoTrajectoryHigh.x = this.demoBallHigh.x;
		this.demoTrajectoryHigh.y = this.demoBallHigh.y;
		this.demoTrajectoryHigh.scale.setTo(game.width/640, game.height/960);

		this.demoJoystickHigh.x *= scaleX;
		this.demoJoystickHigh.y *= scaleY;
		this.demoJoystickHigh.scale.setTo(this.scale, this.scale);

		this.demoBallLow.x *= scaleX;
		this.demoBallLow.y *= scaleY;
		this.demoBallLow.scale.setTo(this.scale, this.scale);

		this.demoTrajectoryLow.x = this.demoBallLow.x;
		this.demoTrajectoryLow.y = this.demoBallLow.y;
		this.demoTrajectoryLow.scale.setTo(game.width/640, game.height/960);

		this.demoJoystickLow.x *= scaleX;
		this.demoJoystickLow.y *= scaleY;
		this.demoJoystickLow.scale.setTo(this.scale, this.scale);

		this.demoPers.x *= scaleX;
		this.demoPers.y *= scaleY;
		this.demoPers.scale.setTo(this.scale, this.scale);

		//this.touchAnimation.x = game.width/2;
		//this.touchAnimation.y = game.height*0.98;
		this.touchAnimation.x *= scaleX;
		this.touchAnimation.y *= scaleY;
		this.touchAnimation.scale.setTo(this.scale, this.scale);

		//arrows scale
		this.demoArrows.forEach(function(item){
			item.x *= scaleX;
			item.y *= scaleY;
			item.scale.setTo(this.scale, this.scale);
		}, this);

		this.demoLabel3.x *= scaleX;
		this.demoLabel3.y *= scaleY;
		this.demoLabel3.scale.setTo(this.scale, this.scale);
		
		this.demoThirdArrowsNum.forEach(function(item){
			item.x *= scaleX;
			item.y *= scaleY;
			item.scale.setTo(0.7*this.scale, 0.7*this.scale);
		}, this);

		this.demoMoveRArrow.x *= scaleX;
		this.demoMoveRArrow.y *= scaleY;
		this.demoMoveRArrow.scale.setTo(this.scale, this.scale);
		
		this.demoMoveLArrow.fixedToCamera = false;
		this.demoMoveLArrow.x *= scaleX;
		this.demoMoveLArrow.y *= scaleY;
		this.demoMoveLArrow.scale.setTo(this.scale, this.scale);
		this.demoMoveLArrow.fixedToCamera = true;

		this.demoLeftButton.fixedToCamera = false;
		this.demoLeftButton.x *= scaleX;
		this.demoLeftButton.y *= scaleY;
		this.demoLeftButton.scale.setTo(this.scale, this.scale);
		this.demoLeftButton.fixedToCamera = true;

		this.demoRightButton.fixedToCamera = false;
		this.demoRightButton.x *= scaleX;
		this.demoRightButton.y *= scaleY;
		this.demoRightButton.scale.setTo(this.scale, this.scale);
		this.demoRightButton.fixedToCamera = true;

		this.demoTutorialLabel.fixedToCamera = false;
		this.demoTutorialLabel.x *= scaleX;
		this.demoTutorialLabel.y *= scaleY;
		this.demoTutorialLabel.scale.setTo(this.scale, this.scale);
		this.demoTutorialLabel.fixedToCamera = true;

		this.rotBall.fixedToCamera = false;
		this.rotBall.x *= scaleX;
		this.rotBall.y *= scaleY;
		this.rotBall.scale.setTo(this.scale, this.scale);
		this.rotBall.fixedToCamera = true;

		this.rotBoundaries.fixedToCamera = false;
		this.rotBoundaries.x *= scaleX;
		this.rotBoundaries.y *= scaleY;
		this.rotBoundaries.scale.setTo(this.scale, this.scale);
		this.rotBoundaries.fixedToCamera = true;		

		this.rightSwipeTween = game.add.tween(this.fingerSprite).to({x: this.rotBoundaries.x + this.rotBoundaries.width/2 - this.rotBall.width/2}, 1200, Phaser.Easing.Linear.None, false, 0, 0);
		this.leftSwipeTween = game.add.tween(this.fingerSprite).to({x: this.rotBoundaries.x - this.rotBoundaries.width/2 + this.rotBall.width/2+100}, 1200, Phaser.Easing.Linear.None, false, 0, 0);

		this.rightRotTween = game.add.tween(this.rotBall).to({x: this.rotBoundaries.x + this.rotBoundaries.width/2 - this.rotBall.width/2}, 1200, Phaser.Easing.Linear.None, false, 0, 0);
		this.leftRotTween = game.add.tween(this.rotBall).to({x: this.rotBoundaries.x - this.rotBoundaries.width/2 + this.rotBall.width/2+100}, 1200, Phaser.Easing.Linear.None, false, 0, 0);
		this.rightRotTween.onComplete.add(this.rotateRight, this);
		this.leftRotTween.onComplete.add(this.rotateLeft, this);
	},

	handlePause: function(){		
		game.paused = true;
	},

	handleResume: function(){
		game.paused = false;
	},
}

document.addEventListener("pause", demoState.handlePause, false);

document.addEventListener("resume", demoState.handleResume, false);