BasicGame.StoryScenes = function(game) {

};

BasicGame.StoryScenes.prototype = {

	/*preload: function() {

		this.currentFramesNames = [];

		if (this.game.levelNum===1) {
			for (var i=1; i<8; i++) {
				var panelName = "Frame_"+i;
				var fileName = panelName + ".png";

				this.load.image(panelName, "/assets/storyPanels/"+fileName);
				this.currentFramesNames.push(panelName);
			}
		} else if(this.game.levelNum === 12){

			for (var i=8; i<13; i++) {
				var panelName = "Frame_"+i;
				var fileName = panelName + ".png";

				this.load.image(panelName, "/assets/storyPanels/"+fileName);
				this.currentFramesNames.push(panelName);
			}

		} else if(this.game.levelNum === 57){

			for (var i=13; i<14; i++) {
				var panelName = "Frame_"+i;
				var fileName = panelName + ".png";

				this.load.image(panelName, "/assets/storyPanels/"+fileName);
				this.currentFramesNames.push(panelName);
			}

		} else if (this.game.levelNum === 101) {

			for (var i=14; i<24; i++) {
				var panelName = "Frame_"+i;
				var fileName = panelName + ".png";

				this.load.image(panelName, "/assets/storyPanels/"+fileName);
				this.currentFramesNames.push(panelName);
			}

		}
	},*/

	create: function() {

		if (this.game.levelNum===1) {

			this.panelsRange = [1, 7];

		} else if(this.game.levelNum === 12){

			this.panelsRange = [8, 12];

		} else if(this.game.levelNum === 57){

			this.panelsRange = [13, 13];

		} else if (this.game.levelNum === 101) {

			this.panelsRange = [14, 23];

		}

		this.currentFrameNumber = this.panelsRange[0];

		this.frameSprite = this.game.add.sprite(0, 0, this.game.storyPanelsNames[this.currentFrameNumber-1]);

		this.time.events.add(1000, function(){

			this.input.onDown.add(this.showNextFrame, this);	

		}, this);

		

		audioPlayer.switchBackground('story');

	},

	showNextFrame: function() {

		if (this.currentFrameNumber<this.panelsRange[1]) {

			this.currentFrameNumber ++;
			this.frameSprite.loadTexture(this.game.storyPanelsNames[this.currentFrameNumber-1]);	

		} else if (this.game.levelNum<101){

			this.input.onDown.removeAll();
			this.state.start('Game');

		} else {
			
			this.input.onDown.removeAll();
			this.state.start('LevelChoiceMenu');

		}
	},
};