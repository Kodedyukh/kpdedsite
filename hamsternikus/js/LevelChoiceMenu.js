BasicGame.LevelChoiceMenu = function (game) {	

};

BasicGame.LevelChoiceMenu.prototype = {

	create: function () {

		if (isNaN(localStorage.getItem('lockedLevel')) || localStorage.getItem('lockedLevel')===null)
		{
			//console.log('setting lockedLevel');
			localStorage.setItem('lockedLevel', 2);
		}

		this.game.lockedLevel = Number(localStorage.getItem('lockedLevel'));

		this.background = this.add.sprite(0, 0, 'titlepage');
		this.background.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);

		this.scrollBackground = this.add.sprite(this.game.width*0.05, this.game.height*0.08, 'scrollBackground');
		//this.scrollBackground.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
		//this.scrollBackground.anchor.setTo(0.5, 0);

		this.buttonsScroll = this.add.group();
		//console.log(this.buttonsScroll.y);
		//console.log(this.buttonsScroll.x);
		this.buttonsScroll.y = this.game.height;

		this.scrollUpBut = this.add.button(this.scrollBackground.right+10, this.scrollBackground.y, 'scrollUpBut', this.scrollUp, this, 'out', 'out', 'down', 'out');

		this.scrollDownBut = this.add.button(this.scrollBackground.right+10, this.scrollBackground.bottom, 'scrollDownBut', this.scrollDown, this, 'out', 'out', 'down', 'out');
		this.scrollDownBut.anchor.setTo(0, 1);		


		var numberOfLevels = 100;

		this.levelButtons = [];		

		for (var b = 1; b<numberOfLevels+1; b++) {
			var xPos = this.scrollBackground.x + (b - 1/2 - 7 * Math.floor((b-1)/7))*this.scrollBackground.width/7;
			var yPos = this.scrollBackground.y + (1/2+Math.floor((b-1)/7))*this.scrollBackground.height/5;
			if (b < this.game.lockedLevel) {
				var button = this.game.make.button(xPos, yPos, 'levelButton', this.launchLevel, this, 'out', 'out', 'down', 'out');	
			} else {
				var button = this.game.make.button(xPos, yPos, 'levelButton', null, this, 'locked', 'locked', 'locked', 'locked');	
			}
			
			button.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
			button.anchor.setTo(0.5, 0.5);
			button.levelNum = b;
			this.buttonsScroll.add(button);
			this.levelButtons.push(button);

			var levelNumText = this.game.make.bitmapText(button.centerX, button.y, 'basicFont', ''+b, 34);
			levelNumText.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
			levelNumText.anchor.setTo(0.5, 0.5);
			//levelNumText.tint = 0x84001a;
			this.buttonsScroll.add(levelNumText);
		}

		this.scrollDistance = this.buttonsScroll.height/5;

		this.viewPortMask = this.add.graphics(0, 0);

		this.viewPortMask.beginFill(0xffffff);
		this.viewPortMask.drawRect(this.game.width*0.05, this.game.height*0.08, this.game.width*0.8, this.game.height*0.82);

		this.buttonsScroll.mask = this.viewPortMask;

		this.mousePressPoint = null;

		this.game.input.onDown.add(this.startScroll, this);
    	this.game.input.onUp.add(this.stopScroll, this);
		this.game.input.addMoveCallback(this.moveScroll, this);

		this.game.input.mouse.mouseWheelCallback = this.wheelScroll;
		this.game.input.mouse.callbackContext = this;

		/*console.log(this.levelButtons[this.game.lockedLevel-1]);
		console.log(this.game.lockedLevel-1);*/

		if (this.levelButtons[this.game.lockedLevel-1]) {
			var lastActiveLevelBottom = this.levelButtons[this.game.lockedLevel-1].bottom;
		} else {
			var lastActiveLevelBottom = this.levelButtons[this.game.lockedLevel-2].bottom;
		}
		var levelsOffset = Math.max(0, lastActiveLevelBottom - this.game.height*0.9);

		this.buttonsScrollTweenUp = this.game.add.tween(this.buttonsScroll).to({y: -levelsOffset}, 1500, Phaser.Easing.Elastic.Out, true);
		this.buttonsScrollTweenDown = this.game.add.tween(this.buttonsScroll).to({y: this.game.height*0.9}, 500, Phaser.Easing.Linear.None, false);
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function () {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	},

	launchLevel: function(button) {
		audioPlayer.playOneTime('buttonPush');
		this.game.levelNum = button.levelNum;
		//this.game.levelNum = 0;
		this.buttonsScrollTweenDown.onComplete.add(function(){
			if (button.levelNum<5) {
				this.game.gameWorld = 'maze';
			} else if (button.levelNum<9) {
				this.game.gameWorld = 'lab';
			} else if (button.levelNum<11) {
				this.game.gameWorld = 'brain';
			}
			this.startGame();
		}, this);

		this.buttonsScrollTweenDown.start();
		
	},

	wheelScroll: function(wheelEvent) {

		//console.log(this.levelButtons[0].world.y - this.levelButtons[0].height/2 + this.scrollDistance);
		//console.log(this.buttonsScroll.y);
		
		if (this.game.input.activePointer.worldX > this.game.width*0.05 && this.game.input.activePointer.worldX < this.game.width*0.85 &&
			this.game.input.activePointer.worldY > this.game.height*0.08 && this.game.input.activePointer.worldY < this.game.height*0.9) {

			if (wheelEvent.wheelDelta > 0 && this.buttonsScroll.y + this.scrollDistance<0) {
				var upTween = this.add.tween(this.buttonsScroll).to({y: '+'+this.scrollDistance}, 500, Phaser.Easing.Linear.None, true);				
			} else if (wheelEvent.wheelDelta > 0 && this.buttonsScroll.y<0 && this.buttonsScroll.y+this.scrollDistance>0) {
				var upTween = this.add.tween(this.buttonsScroll).to({y: 0}, 500, Phaser.Easing.Linear.None, true);				
			}

			if (wheelEvent.wheelDelta < 0 && this.buttonsScroll.bottom - this.scrollDistance>this.game.height*0.9) {
				var downTween = this.add.tween(this.buttonsScroll).to({y: '-'+this.scrollDistance}, 500, Phaser.Easing.Linear.None, true);
			} else if (wheelEvent.wheelDelta < 0 && this.buttonsScroll.bottom>this.game.height*0.9 && this.buttonsScroll.bottom-this.scrollDistance<this.game.height*0.9) {
				var downTween = this.add.tween(this.buttonsScroll).to({bottom: this.game.height*0.9}, 500, Phaser.Easing.Linear.None, true);
			}
		};
	},

	scrollUp: function() {
		if (this.buttonsScroll.y + this.scrollDistance<=0) {
			var upTween = this.add.tween(this.buttonsScroll).to({y: '+'+this.scrollDistance}, 500, Phaser.Easing.Linear.None, true);				
		} else if (this.buttonsScroll.y<0 && this.buttonsScroll.y+this.scrollDistance>0) {
			var upTween = this.add.tween(this.buttonsScroll).to({y: 0}, 500, Phaser.Easing.Linear.None, true);				
		}
	},

	scrollDown: function() {
		if (this.buttonsScroll.bottom - this.scrollDistance>=this.game.height*0.9) {
			var downTween = this.add.tween(this.buttonsScroll).to({y: '-'+this.scrollDistance}, 500, Phaser.Easing.Linear.None, true);
		} else if (this.buttonsScroll.bottom>this.game.height*0.9 && this.buttonsScroll.bottom-this.scrollDistance<this.game.height*0.9) {
			var downTween = this.add.tween(this.buttonsScroll).to({bottom: this.game.height*0.9}, 500, Phaser.Easing.Linear.None, true);
		}
	},

	startScroll: function(pointer) {
		//console.log('start scroll');

		if (!this.mousePressPoint) {
			if (pointer.worldX > this.game.width/10 && pointer.worldX < this.game.width*0.9 &&
				pointer.worldY > this.game.height/10 && pointer.worldY < this.game.height*0.9) {

				this.mousePressPoint = new Phaser.Point(pointer.worldX, pointer.worldY);
			}
		}
	},

	stopScroll: function(pointer) {
		//console.log('stop scroll');

		if (this.mousePressPoint) {
			this.mousePressPoint = null;
		}

	},

	moveScroll: function(pointer) {

		if (this.mousePressPoint) {

			var newMousePos = new Phaser.Point(pointer.worldX, pointer.worldY);

			var distance = newMousePos.y - this.mousePressPoint.y;
			if (distance > 0) {

				if (this.scrollBackground.world.y + distance<this.game.height*0.1) {
					this.buttonsScroll.y = this.buttonsScroll.y + distance;	
				}
				
			} else {

				if (this.scrollBackground.world.y + distance > this.game.height*0.9 - this.scrollBackground.height) {
					this.buttonsScroll.y = this.buttonsScroll.y + distance;		
				}

			}

			//console.log(distance);


			this.mousePressPoint.copyFrom(newMousePos);
		}
	}

};