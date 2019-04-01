BasicGame.LevelChoiceMenu = function(game) {

}

BasicGame.LevelChoiceMenu.prototype = {

	create: function() {
		//console.log('create in level choice');
		inGame = true;
		this.game.currentDimensions = localStorage.getItem('mowItCurrentDimensions');
		this.game.gameMode = localStorage.getItem('mowItGameMode');
		this.game.levelNumber = Number(localStorage.getItem('mowItLevelNumber'));
		this.underlay = this.add.sprite(this.game.width/2, this.game.height/2, 'mainMenuUnderlay');
		this.underlay.anchor.setTo(0.5, 0.5);
		this.underlay.scale.setTo(this.game.width/960, this.game.width/960);

		this.totalLevels = 23+3;
		// define last locked level
		if (this.game.gameMode==='single') {
			switch (this.game.currentDimensions) {
				case '4x4':
					this.lastAvailNomLevel = 1;
					break;
				case '8x8':
					this.lastAvailNomLevel = 2;
					break;
				case '10x10':
					this.lastAvailNomLevel = 3;
					break;
			}
		} else {
			this.lastAvailNomLevel = this.game.levelNumber + 3;
		}

		this.buttonsGroup = this.game.add.group();
		var betweenButtonsDistanceH = this.game.width/8,
			betweenButtonsDistanceV = this.game.height/5;	

		var buttonScale = Math.min(betweenButtonsDistanceH/(this.game.cache.getImage('levelButton').height+5), 
			betweenButtonsDistanceV/(this.game.cache.getImage('levelButton').height+5));

		//if (betweenButtonsDistanceH < this.cache.getImage('levelButton').height+2) buttonScale = betweenButtonsDistanceH/this.cache.getImage('levelButton').height+2;
		//if (betweenButtonsDistanceV < this.cache.getImage('levelButton').height+2) buttonScale = betweenButtonsDistanceV/this.cache.getImage('levelButton').height+2;

		//console.log(buttonScale);

		for (var i = 1; i<=this.totalLevels; i++) {
			var xPos = ((i - 1)%7 + 0.5) * betweenButtonsDistanceH,
				yPos = (Math.floor((i - 1) / 7) + 0.5) * betweenButtonsDistanceV;

			var button = this.game.make.button(xPos, yPos, 'levelButton', this.launchLevel, this, 'out', 'out', 'down', 'out');
			//button.scale.setTo(Math.min(this.game.width/configuration.canvasWidth, buttonScale), 
			//	Math.min(this.game.width/configuration.canvasWidth, buttonScale));
			button.scale.setTo(buttonScale, buttonScale);

			var	levelTextLabel = this.game.add.bitmapText(button.centerX, button.centerY, 'basicFont', ''+i, 60);

			levelTextLabel.anchor.setTo(0.5, 0.4);
			levelTextLabel.tint = 0xe77f5a;			
			levelTextLabel.scale.setTo(buttonScale, buttonScale);

			this.buttonsGroup.add(button);
			button.textLabel = levelTextLabel;
			//this.buttonsGroup.add(levelTextLabel);
			button.nominalLevel = i;
			if (i > this.lastAvailNomLevel) {
				button.inputEnabled = false;
				var lockImage = this.add.sprite(button.centerX, button.centerY, 'lockImage');
				lockImage.anchor.setTo(0.5, 0.5);
				lockImage.scale.setTo(buttonScale, buttonScale);
				//this.buttonsGroup.add(lockImage);
				levelTextLabel.alpha = 0.5;
				button.lockImage = lockImage;
			}
		}
	},

	launchLevel: function(button) {
		if (button.nominalLevel<4) {
			if (button.nominalLevel===1) {
				this.game.gameMode = 'single';
				this.game.currentDimensions = '4x4';
				this.game.levelNumber = 1;
			} else if (button.nominalLevel===2) {
				this.game.gameMode = 'single';
				this.game.currentDimensions = '8x8';
				this.game.levelNumber = 1;
			} else if (button.nominalLevel===3) {
				this.game.gameMode = 'single';
				this.game.currentDimensions = '10x10';
				this.game.levelNumber = 1;
			}
		} else {
			this.game.levelNumber = button.nominalLevel - 3;
		}
		if (typeof parent.cmgGameEvent === 'function') parent.cmgGameEvent('start', '' + button.nominalLevel);
		this.state.start('Game');
	},

	updateScale: function() {
		this.underlay.position.set(this.game.width/2, this.game.height/2);
		this.underlay.scale.setTo(this.game.width/960, this.game.width/960);

		var betweenButtonsDistanceH = this.game.width/8,
			betweenButtonsDistanceV = this.game.height/5;

    	var buttonScale = Math.min(betweenButtonsDistanceH/(this.game.cache.getImage('levelButton').height+5), 
			betweenButtonsDistanceV/(this.game.cache.getImage('levelButton').height+5));

    	for (var i = 1; i<=this.totalLevels; i++) {
			var xPos = ((i - 1)%7 + 0.5) * betweenButtonsDistanceH,
				yPos = (Math.floor((i - 1) / 7) + 0.5) * betweenButtonsDistanceV;

			var button = this.buttonsGroup.getChildAt(i-1);
			button.position.set(xPos, yPos);
			button.scale.setTo(buttonScale, buttonScale);

			button.textLabel.position.set(button.centerX, button.centerY);
			button.textLabel.scale.setTo(buttonScale, buttonScale);

			if (button.lockImage) {
				button.lockImage.position.set(button.centerX, button.centerY);
				button.lockImage.scale.setTo(buttonScale, buttonScale);
			}
		}
    }

}
