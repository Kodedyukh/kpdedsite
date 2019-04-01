BasicGame.Game = function (game) {

    

    this.game;      
    this.add;       
    this.camera;    
    this.cache;     
    this.input;     
    this.load;      
    this.math;      
    this.sound;     
    this.stage;     
    this.time;      
    this.tweens;    
    this.state;     
    this.world;     
    this.particles; 
    this.physics;   
    this.rnd;       
    
};

BasicGame.Game.prototype = {

    create: function () {

        inGame = true;

        if (this.game.gameMode === 'single') {

            this.levelsBeaten = 0;

            var dimensions = this.game.currentDimensions.split("x");

            //this.field = new Field(this.game, Number(dimensions[0]), Number(dimensions[1]));

            this.hamSeqStorage = this.game.cache.getJSON(this.game.currentDimensions);        

            var sequenceNumber = Math.round(Math.random()*(this.hamSeqStorage.length-1));
            var semiHamSequence = this.hamSeqStorage[sequenceNumber];

            var mapAndPath = this.generateMapPlan(semiHamSequence, Number(dimensions[1]));    

            this.field = new Field(this.game, dimensions[0], dimensions[1], 1, 1);
            this.field.buildMap(mapAndPath[0], mapAndPath[1]);

            // calculate the number of empty cells
            var numberOfFullCells = mapAndPath[0].reduce(function(acc, currRow, index, arr){
                var sumOfRow = currRow.reduce(function(acc1, currentNum){
                    return acc1+currentNum;
                }, 0);
                return acc + sumOfRow;
            }, 0);
            this.numEmptyCells = this.field.rows*this.field.columns - numberOfFullCells;

            var mowerWires = this.add.group();

            this.mower = this.field.addMower(semiHamSequence[0][0], semiHamSequence[0][1]);
            this.mower.wires = mowerWires;

            this.mower.cableCutSignal.add(this.showCableCutPopup, this);

        } else {

            var level = this.game.cache.getJSON('level'+this.game.levelNumber);

            var mapPlan1 = level.map1,
                mapPlan2 = level.map2,
                path1 = level.path1,
                path2 = level.path2;

            this.field1 = new Field(this.game, mapPlan1[0].length, mapPlan1.length, 1, 2, 'real');
            this.field2 = new Field(this.game, mapPlan2[0].length, mapPlan2.length, 2, 2, 'underworld');
            this.field1.buildMap(mapPlan1, path1);
            this.field2.buildMap(mapPlan2, path2);
            
            var numberOfFullCells = mapPlan1.reduce(function(acc, currRow, index, arr){
                var sumOfRow = currRow.reduce(function(acc1, currentNum){
                    return acc1+currentNum;
                }, 0);
                return acc + sumOfRow;
            }, 0);

            numberOfFullCells += mapPlan2.reduce(function(acc, currRow, index, arr){
                var sumOfRow = currRow.reduce(function(acc1, currentNum){
                    return acc1+currentNum;
                }, 0);
                return acc + sumOfRow;
            }, 0);

            this.numEmptyCells = this.field1.rows*(this.field1.columns + this.field2.columns) - numberOfFullCells;

            var mower1Wires = this.add.group(),
                mower2Wires = this.add.group();

            this.mower1 = this.field1.addMower(level.start1[0], level.start1[1]);
            this.mower2 = this.field2.addMower(level.start2[0], level.start2[1]);

            this.mower1.wires = mower1Wires;
            this.mower2.wires = mower2Wires;

            this.mower1.cableCutSignal.add(this.showCableCutPopup, this);
            this.mower2.cableCutSignal.add(this.showCableCutPopup, this);

            //console.log(this.numEmptyCells);
        }
        // assign control keys
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);

        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);

        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        this.backKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);

        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.DOWN, Phaser.Keyboard.UP, Phaser.Keyboard.R]);

        this.stage.backgroundColor = 0x44d9bf;

        this.levelBeaten = false;

        this.processBackKey = true;

        var buttonsScale = Math.min(this.game.width*0.08/100, this.game.height*0.17/(this.game.cache.getImage('moveBackButton').height+10));

        /*console.log(buttonsScale);
        console.log(this.game.width*0.08/100);
        console.log(this.game.height*0.17);
        console.log(this.game.height*0.17/(this.game.cache.getImage('moveBackButton').height+10));*/

        if (this.game.device.desktop) {

            this.moveBackButton = this.add.button(this.game.width*0.005, this.game.height*0.805, 'moveBackButton', this.moveBackMowers, this, 'out', 'out', 'down', 'out');
            this.moveBackButton.anchor.setTo(0, 1);
            this.moveBackButton.scale.setTo(buttonsScale, buttonsScale);

            if (this.game.gameMode === 'single' && this.game.currentDimensions === '4x4')
            {
                this.pressRLabel = this.add.image(this.moveBackButton.centerX, this.moveBackButton.top - 5, 'orPressR');
                this.pressRLabel.anchor.setTo(0.5, 1);
                this.pressRLabel.scale.setTo(buttonsScale, buttonsScale);
            }            

            this.moveBeginButton = this.add.button(this.game.width*0.005, this.game.height*0.975, 'moveBeginButton', this.startFromBegining, this, 'out', 'out', 'down', 'out');
            this.moveBeginButton.anchor.setTo(0, 1);
            this.moveBeginButton.scale.setTo(buttonsScale, buttonsScale);

            this.muteButton = this.add.button(this.game.width*0.995, this.game.height*0.805, 'muteButton', this.muteMusic, this, 'onOut', 'onOut', 'onDown', 'onOut');
            this.muteButton.anchor.setTo(1, 1);
            this.muteButton.scale.setTo(buttonsScale, buttonsScale);

            this.hintButton = this.add.button(this.game.width*0.995, this.game.height*0.975, 'hintButton', this.showHint, this, 'out', 'out', 'down', 'out');
            this.hintButton.anchor.setTo(1, 1);
            this.hintButton.scale.setTo(buttonsScale, buttonsScale);

        } else {

            this.moveBackButton = this.add.button(this.game.width*0.005, this.game.height*0.195, 'moveBackButton', this.moveBackMowers, this, 'out', 'out', 'down', 'out');
            this.moveBackButton.anchor.setTo(0, 0);
            this.moveBackButton.scale.setTo(buttonsScale, buttonsScale);

            this.moveBeginButton = this.add.button(this.game.width*0.005, this.game.height*0.025, 'moveBeginButton', this.startFromBegining, this, 'out', 'out', 'down', 'out');
            this.moveBeginButton.anchor.setTo(0, 0);
            this.moveBeginButton.scale.setTo(buttonsScale, buttonsScale);

            this.muteButton = this.add.button(this.game.width*0.995, this.game.height*0.195, 'muteButton', this.muteMusic, this, 'onOut', 'onOut', 'onDown', 'onOut');
            this.muteButton.anchor.setTo(1, 0);
            this.muteButton.scale.setTo(buttonsScale, buttonsScale);

            this.hintButton = this.add.button(this.game.width*0.995, this.game.height*0.025, 'hintButton', this.showHint, this, 'out', 'out', 'down', 'out');
            this.hintButton.anchor.setTo(1, 0);
            this.hintButton.scale.setTo(buttonsScale, buttonsScale);

        }

        

        // set sfx
        this.game.mowerSound = this.add.audio('mower');
        this.shockSound = this.add.audio('electric');
        this.birdSound = this.add.audio('bird');

        // cable cut popup
        this.cableCutPopupGroup = this.add.group();

        this.cableCutPopup = this.cableCutPopupGroup.create(this.game.width/2, this.game.height/2, 'cableCutPopup');
        this.cableCutPopup.anchor.setTo(0.5, 0.5);
        this.cableCutPopup.scale.setTo(this.game.width*0.36 / this.game.cache.getImage('cableCutPopup').width, this.game.width*0.36 / this.game.cache.getImage('cableCutPopup').width);

        this.cableCutBackButton = this.make.button(this.game.width*0.5, this.cableCutPopup.bottom - 5, 'moveBackButton', this.reviveAfterCC, this, 'out', 'out', 'down', 'out');
        this.cableCutBackButton.anchor.setTo(0.5, 1);
        this.cableCutBackButton.scale.setTo(this.game.width*0.1 / 100, this.game.width*0.1 / 100);
        this.cableCutPopupGroup.add(this.cableCutBackButton);
        this.cableCutBackButton.inputEnabled = false;

        if (this.game.device.desktop)
        {
            this.ccOrPressR = this.cableCutPopupGroup.create(this.cableCutBackButton.x, this.cableCutBackButton.top - 4, 'orPressR');
            this.ccOrPressR.anchor.setTo(0.5, 1);
            this.ccOrPressR.scale.setTo(this.game.width*0.1 / 100, this.game.width*0.1 / 100);
        }

        this.cableCutPopupGroup.alpha = 0;
        this.processInput = true;

        if (this.game.gameMode==='single' && this.game.currentDimensions==='4x4') {
            if (this.game.device.desktop) {
                this.tipPopup = this.add.sprite(this.game.width/2, this.game.height/2, 'tipPopup');
            } else {
                this.tipPopup = this.add.sprite(this.game.width/2, this.game.height/2, 'tipPopupMob');
            }
            this.tipPopup.anchor.setTo(0.5, 0.5);
            this.tipPopup.scale.setTo(this.game.width*0.36/this.game.cache.getImage('tipPopup').width, this.game.width*0.36/this.game.cache.getImage('tipPopup').width);
            this.input.onDown.addOnce(function(){
                this.tipPopup.alpha = 0;
            }, this);
            this.input.keyboard.callbackContext = this;
            this.input.keyboard.onDownCallback = function(){
                if (this.tipPopup) this.tipPopup.alpha = 0;
                this.input.keyboard.onDownCallback = null;
            };
        }
        if (this.game.gameMode==='split' && this.game.levelNumber===1) {
            this.twinPopup = this.add.sprite(this.game.width/2, this.game.height/2, 'twinPopup');
            this.twinPopup.anchor.setTo(0.5, 0.5);
            this.twinPopup.scale.setTo(this.game.width*0.36/this.game.cache.getImage('twinPopup').width, this.game.width*0.36/this.game.cache.getImage('twinPopup').width);
            this.input.onDown.addOnce(function(){
                this.twinPopup.alpha = 0;
            }, this);
            this.input.keyboard.callbackContext = this;
            this.input.keyboard.onDownCallback = function(){
                if (this.twinPopup) this.twinPopup.alpha = 0;
                this.input.keyboard.onDownCallback = null;
            };
        }
        if (this.game.gameMode==='split' && this.game.levelNumber===6) {
            this.backtipPopup = this.add.sprite(this.game.width/2, this.game.height/2, 'backtipPopup');
            this.backtipPopup.anchor.setTo(0.5, 0.5);
            this.backtipPopup.scale.setTo(this.game.width*0.36/this.game.cache.getImage('twinPopup').width, this.game.width*0.36/this.game.cache.getImage('twinPopup').width);
            this.input.onDown.addOnce(function(){
                this.backtipPopup.alpha = 0;
            }, this);
            this.input.keyboard.callbackContext = this;
            this.input.keyboard.onDownCallback = function(){
                if (this.backtipPopup) this.backtipPopup.alpha = 0;
                this.input.keyboard.onDownCallback = null;
            };
        }

        // move buttons for mobile version
        //this.moveButtons = this.add.group();

        this.moveLeftInd = false;
        this.moveUpInd = false;
        this.moveRightInd = false;
        this.moveDownInd = false;

        // level label
        if (this.game.gameMode==='single') {
            switch (this.game.currentDimensions) {
                case '4x4':
                    this.nominalLevel = 1;
                    break;
                case '8x8':
                    this.nominalLevel = 2;
                    break;
                case '10x10':
                    this.nominalLevel = 3;
                    break;
            }
        } else {
            this.nominalLevel = this.game.levelNumber + 3;
        }
        this.levelLabel = this.game.add.bitmapText(this.game.width*0.99, this.game.height*(this.game.device.desktop? 0.01: 0.5), 
            'basicFont', 'lvl\n'+this.nominalLevel, 64);
        this.levelLabel.align = 'left';
        this.levelLabel.anchor.setTo(1, (this.game.device.desktop? 0: 0.5));
        this.levelLabel.scale.setTo(this.game.height/configuration.canvasHeight,this.game.height/configuration.canvasHeight);
        this.levelLabel.tint = 0x2f9a87;

        // admob suff
        this.adReady = false;
        this.adShown = false;
        //prepareAd(this.game);
        this.undoMovesNumber = 0;
        

        if (!this.game.device.desktop) {

            // up button

            this.moveUpButton = this.add.sprite(this.game.width*0.995, this.game.height*0.805, 'moveUpButton', 'out');
            this.moveUpButton.inputEnabled = true;

            this.moveUpButton.events.onInputDown.add(function(){
                this.moveUpInd = true;
                this.moveUpButton.frameName = 'down';
            }, this);
            this.moveUpButton.events.onInputUp.add(function(){
                this.moveUpInd = false;
                this.moveUpButton.frameName = 'out';
            }, this);
            this.moveUpButton.anchor.setTo(1, 1);
            this.moveUpButton.scale.setTo(buttonsScale, buttonsScale);

            // down button

            this.moveDownButton = this.add.sprite(this.game.width*0.995, this.game.height*0.975, 'moveDownButton', 'out');
            this.moveDownButton.inputEnabled = true;

            this.moveDownButton.events.onInputDown.add(function(){
                this.moveDownInd = true;
                this.moveDownButton.frameName = 'down';
            }, this);
            this.moveDownButton.events.onInputUp.add(function(){
                this.moveDownInd = false;
                this.moveDownButton.frameName = 'out';
            }, this);
            this.moveDownButton.anchor.setTo(1, 1);
            this.moveDownButton.scale.setTo(buttonsScale, buttonsScale);

            // right button

            this.moveRightButton = this.add.sprite(this.game.width*0.005, this.game.height*0.805, 'moveRightButton', 'out');
            this.moveRightButton.inputEnabled = true;

            this.moveRightButton.events.onInputDown.add(function(){
                this.moveRightInd = true;
                this.moveRightButton.frameName = 'down';
            }, this);
            this.moveRightButton.events.onInputUp.add(function(){
                this.moveRightInd = false;
                this.moveRightButton.frameName = 'out';
            }, this);
            this.moveRightButton.anchor.setTo(0, 1);
            this.moveRightButton.scale.setTo(buttonsScale, buttonsScale);

            // left button

            this.moveLeftButton = this.add.sprite(this.game.width*0.005, this.game.height*0.975, 'moveLeftButton', 'out');
            this.moveLeftButton.inputEnabled = true;

            this.moveLeftButton.events.onInputDown.add(function(){
                this.moveLeftInd = true;
                this.moveLeftButton.frameName = 'down';
            }, this);
            this.moveLeftButton.events.onInputUp.add(function(){
                this.moveLeftInd = false;
                this.moveLeftButton.frameName = 'out';
            }, this);
            this.moveLeftButton.anchor.setTo(0, 1);
            this.moveLeftButton.scale.setTo(buttonsScale, buttonsScale);

        }
    },

    reloadLevel: function() {

        //console.log('reload level called');

        if (this.game.gameMode === 'single') {

            //console.log('single map reloaded');

            var dimensions = this.game.currentDimensions.split("x");

            this.field.reset(Number(dimensions[0]), Number(dimensions[1]), 1, 1);

            this.hamSeqStorage = this.game.cache.getJSON(this.game.currentDimensions);

            var sequenceNumber = Math.round(Math.random()*(this.hamSeqStorage.length-1));
            var semiHamSequence = this.hamSeqStorage[sequenceNumber];

            var mapAndPath = this.generateMapPlan(semiHamSequence, Number(dimensions[1]));
            //console.log(mapPlan);
            this.field.buildMap(mapAndPath[0], mapAndPath[1]);

            this.mower.reset();

            this.field.placeMower(0, semiHamSequence[0][0], semiHamSequence[0][1]);

            this.mower.wires.removeAll();

            // calculate the number of empty cells
            var numberOfFullCells = mapAndPath[0].reduce(function(acc, currRow, index, arr){
                var sumOfRow = currRow.reduce(function(acc1, currentNum){
                    return acc1+currentNum;
                }, 0);
                return acc + sumOfRow;
            }, 0);
            this.numEmptyCells = this.field.rows*this.field.columns - numberOfFullCells;
            this.levelBeaten = false;
            this.levelsBeaten = 0;

        } else {

            if (!this.field1) {

                this.field.plugs.forEach(function(plug){
                    plug.destroy();
                }, this);

                this.field.destroy(true);
                this.mower.wires.destroy(true);
                this.mower.destroy(true);

                var level = this.game.cache.getJSON('level'+this.game.levelNumber);

                var mapPlan1 = level.map1,
                    mapPlan2 = level.map2,
                    path1 = level.path1,
                    path2 = level.path2;

                //console.log(mapPlan1[0].length);
                //console.log(mapPlan1.length);

                this.field1 = new Field(this.game, mapPlan1[0].length, mapPlan1.length, 1, 2, 'real');
                this.field2 = new Field(this.game, mapPlan2[0].length, mapPlan2.length, 2, 2, 'underworld');
                this.field1.buildMap(mapPlan1, path1);
                this.field2.buildMap(mapPlan2, path2);

                var mower1Wires = this.add.group(),
                    mower2Wires = this.add.group();

                this.mower1 = this.field1.addMower(level.start1[0], level.start1[1]);
                this.mower2 = this.field2.addMower(level.start2[0], level.start2[1]);

                this.mower1.wires = mower1Wires;
                this.mower2.wires = mower2Wires;

                this.mower1.cableCutSignal.add(this.showCableCutPopup, this);
                this.mower2.cableCutSignal.add(this.showCableCutPopup, this);

                this.world.bringToTop(this.cableCutPopupGroup);

            } else {

                var level = this.game.cache.getJSON('level'+this.game.levelNumber);

                var mapPlan1 = level.map1
                    mapPlan2 = level.map2,
                    path1 = level.path1,
                    path2 = level.path2;

                this.field1.reset(mapPlan1[0].length, mapPlan1.length, 1, 2);
                this.field2.reset(mapPlan2[0].length, mapPlan2.length, 2, 2);

                this.field1.buildMap(mapPlan1, path1);
                this.field2.buildMap(mapPlan2, path2);

                this.mower1.reset();
                this.mower2.reset();

                this.field1.placeMower(0, level.start1[0], level.start1[1]);
                this.field2.placeMower(0, level.start2[0], level.start2[1]);

                this.mower1.wires.removeAll();
                this.mower2.wires.removeAll();
            }

            var numberOfFullCells = mapPlan1.reduce(function(acc, currRow, index, arr){
                var sumOfRow = currRow.reduce(function(acc1, currentNum){
                    return acc1+currentNum;
                }, 0);
                return acc + sumOfRow;
            }, 0);

            numberOfFullCells += mapPlan2.reduce(function(acc, currRow, index, arr){
                var sumOfRow = currRow.reduce(function(acc1, currentNum){
                    return acc1+currentNum;
                }, 0);
                return acc + sumOfRow;
            }, 0);

            this.numEmptyCells = this.field1.rows*(this.field1.columns + this.field2.columns) - numberOfFullCells;
            this.levelBeaten = false;
            
            //console.log(this.numEmptyCells);
            /*this.moveButtons.alpha = 0;
            this.moveButtons.forEach(function(button){
                button.inputEnabled = false;
            }, this);

            this.world.bringToTop(this.moveButtons);*/

        }

        if (this.game.gameMode==='single' && this.game.currentDimensions==='4x4') {
            if (this.game.device.desktop) {
                this.tipPopup = this.add.sprite(this.game.width/2, this.game.height/2, 'tipPopup');
            } else {
                this.tipPopup = this.add.sprite(this.game.width/2, this.game.height/2, 'tipPopupMob');
            }
            this.tipPopup.anchor.setTo(0.5, 0.5);
            this.tipPopup.scale.setTo(this.game.width*0.36/this.game.cache.getImage('tipPopup').width, this.game.width*0.36/this.game.cache.getImage('tipPopup').width);
            this.input.onDown.addOnce(function(){
                this.tipPopup.alpha = 0;
            }, this);
            this.input.keyboard.callbackContext = this;
            this.input.keyboard.onDownCallback = function(){
                if (this.tipPopup) this.tipPopup.alpha = 0;
                this.input.keyboard.onDownCallback = null;
            };
        }
        if (this.game.gameMode==='split' && this.game.levelNumber===1) {
            this.twinPopup = this.add.sprite(this.game.width/2, this.game.height/2, 'twinPopup');
            this.twinPopup.anchor.setTo(0.5, 0.5);
            this.twinPopup.scale.setTo(this.game.width*0.36/this.game.cache.getImage('twinPopup').width, this.game.width*0.36/this.game.cache.getImage('twinPopup').width);
            this.input.onDown.addOnce(function(){
                this.twinPopup.alpha = 0;
            }, this);
            this.input.keyboard.callbackContext = this;
            this.input.keyboard.onDownCallback = function(){
                if (this.twinPopup) this.twinPopup.alpha = 0;
                this.input.keyboard.onDownCallback = null;
            };
        }
        if (this.game.gameMode==='split' && this.game.levelNumber===6) {
            this.backtipPopup = this.add.sprite(this.game.width/2, this.game.height/2, 'backtipPopup');
            this.backtipPopup.anchor.setTo(0.5, 0.5);
            this.backtipPopup.scale.setTo(this.game.width*0.36/this.game.cache.getImage('twinPopup').width, this.game.width*0.36/this.game.cache.getImage('twinPopup').width);
            this.input.onDown.addOnce(function(){
                this.backtipPopup.alpha = 0;
            }, this);
            this.input.keyboard.callbackContext = this;
            this.input.keyboard.onDownCallback = function(){
                if (this.backtipPopup) this.backtipPopup.alpha = 0;
                this.input.keyboard.onDownCallback = null;
            };
        }

        // level label
        if (this.game.gameMode==='single') {
            switch (this.game.currentDimensions) {
                case '4x4':
                    this.nominalLevel = 1;
                    break;
                case '8x8':
                    this.nominalLevel = 2;
                    break;
                case '10x10':
                    this.nominalLevel = 3;
                    break;
            }
        } else {
            this.nominalLevel = this.game.levelNumber + 3;
        }
        if (this.pressRLabel) this.pressRLabel.alpha = 0;
        this.levelLabel.text = 'lvl\n'+this.nominalLevel;        

    },

    launchNextLevel: function() {

        this.levelsBeaten ++;

        if (this.game.currentDimensions==='10x10' && this.game.gameMode==='single') {

            this.game.gameMode = 'split';

        } else if (this.game.gameMode==='split'){

            this.game.levelNumber++;

        } else {
            this.game.currentDimensions = this.game.fieldRanges[this.game.fieldRanges.indexOf(this.game.currentDimensions) + 1];    
        }        

        if (this.game.gameMode==='split' && this.game.levelNumber===24) {
            var gamebeatenPopup = this.add.sprite(this.game.width/2, this.game.height/2, 'gamebeatenPopup');
            gamebeatenPopup.scale.setTo(this.game.width*0.36/this.game.cache.getImage('gamebeatenPopup').width, this.game.width*0.36/this.game.cache.getImage('gamebeatenPopup').width);
            gamebeatenPopup.anchor.setTo(0.5, 0.5);
            /*this.game.currentDimensions = this.game.fieldRanges[0];
            this.game.gameMode = 'single';
            this.game.levelNumber = 1;
            localStorage.setItem('currentDimensions', this.game.currentDimensions);
            localStorage.setItem('gameMode', this.game.gameMode);
            localStorage.setItem('levelNumber', this.game.levelNumber);
            this.processInput = false;*/

        } else {
            localStorage.setItem('mowItCurrentDimensions', this.game.currentDimensions);
            if (localStorage.getItem('mowItGameMode') != 'split')
                localStorage.setItem('mowItGameMode', this.game.gameMode);
            if (localStorage.getItem('mowItLevelNumber') < this.game.levelNumber)
                localStorage.setItem('mowItLevelNumber', this.game.levelNumber);
            this.reloadLevel();
        }                

    },

    startFromBegining: function() {

        if (typeof parent.cmgGameEvent === 'function') parent.cmgGameEvent('replay', ''+this.nominalLevel);

        if (this.processInput) {

            if (this.game.gameMode === 'single') {

                this.field.mowedSquares[0].forEach(function(square){
                    square.unmowe();
                }, this);
                this.field.placeMower(0, this.field.startCoord[0][0], this.field.startCoord[0][1]);
                
                this.field.mowedSquares[0] = [];
                this.mower.wires.removeAll();

                this.mower.moves = [];
            } else {

                this.field1.mowedSquares[0].forEach(function(square){
                    square.unmowe();
                }, this);
                this.field1.placeMower(0, this.field1.startCoord[0][0], this.field1.startCoord[0][1]);
                
                this.field1.mowedSquares[0] = [];
                this.mower1.wires.removeAll();

                this.mower1.moves = [];

                this.field2.mowedSquares[0].forEach(function(square){
                    square.unmowe();
                }, this);
                this.field2.placeMower(0, this.field2.startCoord[0][0], this.field2.startCoord[0][1]);
                
                this.field2.mowedSquares[0] = [];
                this.mower2.wires.removeAll();

                this.mower2.moves = [];

            }
            /*this.undoMovesNumber += 5;            
            updateTimePlayed(this.game);
            if (this.undoMovesNumber>=20 && this.game.timePlayed >= 10*60) {
                this.undoMovesNumber = 0;
                showAd(this.game);
                //console.log('ad shown');
                prepareAd(this.game);
            }*/
        }
    },

    moveBackMowers: function() {
        if (this.processInput) {
            if (this.game.gameMode==='split') {
                this.mower1.moveBack();
                this.mower2.moveBack();    
            } else {
                this.mower.moveBack();
            }
            /*this.undoMovesNumber++;            
            updateTimePlayed(this.game);
            if (this.undoMovesNumber>=20 && this.game.timePlayed >= 10*60) {
                this.undoMovesNumber = 0;
                showAd(this.game);
                //console.log('ad shown');
                prepareAd(this.game);
            }*/
        }
        
    },

    showCableCutPopup: function() {
        //console.log('show cc popup called');
        this.processInput = false;
        this.cableCutPopupGroup.alpha = 1;
        this.cableCutBackButton.inputEnabled = true;
        if (this.shockSound.isDecoded) {
            this.shockSound.play();
        }
        /*this.moveButtons.alpha = 0;
        this.moveButtons.forEach(function(button){
            button.inputEnabled = false;
        }, this);*/
    },

    reviveAfterCC: function() {
        if (this.game.gameMode === 'single') {
            var lastSquare = this.field.mowedSquares[0][this.field.mowedSquares[0].length - 1];
            this.mower.position.set(lastSquare.position.x, lastSquare.position.y - 0.02*this.field.squareSide);
            if (this.mower.halfWire) {
                this.mower.wires.removeChild(this.mower.halfWire);
                this.mower.halfWire.destroy();
                this.mower.halfWire = null;
            }

        } else {

            if (this.field1.mowedSquares[0].length > 0) {

                var lastSquare1 = this.field1.mowedSquares[0][this.field1.mowedSquares[0].length - 1];
                this.mower1.position.set(lastSquare1.position.x, lastSquare1.position.y - 0.02*this.field1.squareSide);

                if (this.mower1.halfWire) {
                    this.mower1.wires.removeChild(this.mower1.halfWire);
                    this.mower1.halfWire.destroy();
                    this.mower1.halfWire = null;
                }
            }

            if (this.field2.mowedSquares[0].length > 0) {

                var lastSquare2 = this.field2.mowedSquares[0][this.field2.mowedSquares[0].length - 1];
                this.mower2.position.set(lastSquare2.position.x, lastSquare2.position.y - 0.02*this.field2.squareSide);
                
                if (this.mower2.halfWire) {
                    this.mower2.wires.removeChild(this.mower2.halfWire);
                    this.mower2.halfWire.destroy();
                    this.mower2.halfWire = null;
                }
            }
        }

        this.processInput = true;
        this.cableCutPopupGroup.alpha = 0;
        this.cableCutBackButton.inputEnabled = false;
    },

    updateScale: function()
    {

        if (this.field) this.field.updateScale();
        if (this.field1) this.field1.updateScale();
        if (this.field2) this.field2.updateScale();        

        var buttonsScale = Math.min(this.game.width*0.08/100, this.game.height*0.17/(this.game.cache.getImage('moveBackButton').height+10));

        if (this.game.device.desktop) {

            this.moveBackButton.position.set(this.game.width*0.005, this.game.height*0.805);
            this.moveBackButton.scale.setTo(buttonsScale, buttonsScale);

            if (this.pressRLabel)
            {
                this.pressRLabel.position.set(this.moveBackButton.centerX, this.moveBackButton.top - 5);
                this.pressRLabel.scale.setTo(buttonsScale, buttonsScale);
            }            

            this.moveBeginButton.position.set(this.game.width*0.005, this.game.height*0.975);
            this.moveBeginButton.scale.setTo(buttonsScale, buttonsScale);

            this.muteButton.position.set(this.game.width*0.995, this.game.height*0.805);
            this.muteButton.scale.setTo(buttonsScale, buttonsScale);

            this.hintButton.position.set(this.game.width*0.995, this.game.height*0.975);
            this.hintButton.scale.setTo(buttonsScale, buttonsScale);

        } else {

            this.moveBackButton.position.set(this.game.width*0.005, this.game.height*0.195);
            this.moveBackButton.scale.setTo(buttonsScale, buttonsScale);

            this.moveBeginButton.position.set(this.game.width*0.005, this.game.height*0.025);
            this.moveBeginButton.scale.setTo(buttonsScale, buttonsScale);

            this.muteButton.position.set(this.game.width*0.995, this.game.height*0.195);
            this.muteButton.scale.setTo(buttonsScale, buttonsScale);

            this.hintButton.position.set(this.game.width*0.995, this.game.height*0.025);
            this.hintButton.scale.setTo(buttonsScale, buttonsScale);

            this.moveUpButton.position.set(this.game.width*0.995, this.game.height*0.805);
            this.moveUpButton.scale.setTo(buttonsScale, buttonsScale);

            // down button

            this.moveDownButton.position.set(this.game.width*0.995, this.game.height*0.975);
            this.moveDownButton.scale.setTo(buttonsScale, buttonsScale);

            // right button

            this.moveRightButton.position.set(this.game.width*0.005, this.game.height*0.805);
            this.moveRightButton.scale.setTo(buttonsScale, buttonsScale);

            // left button

            this.moveLeftButton.position.set(this.game.width*0.005, this.game.height*0.975);
            this.moveLeftButton.scale.setTo(buttonsScale, buttonsScale);

        }

        this.levelLabel.position.set(this.game.width*0.99, this.game.height*(this.game.device.desktop? 0.01: 0.5));
        this.levelLabel.scale.setTo(this.game.height/configuration.canvasHeight,this.game.height/configuration.canvasHeight);

        if (this.tipPopup)
        {
            this.tipPopup.position.set(this.game.width/2, this.game.height/2);
            if (this.game.height < this.tipPopup.height + 20) 
                this.tipPopup.scale.setTo(this.game.height/(this.tipPopup.height +20), this.game.height/(this.tipPopup.height +20));
        }

        if (this.twinPopup)
        {
            this.twinPopup.position.set(this.game.width/2, this.game.height/2);
            if (this.game.height < this.twinPopup.height +20)
                this.twinPopup.scale.setTo(this.game.height/(this.twinPopup.height + 20), this.game.height/(this.twinPopup.height + 20)); 
        }

        if (this.backtipPopup)
        {
            this.backtipPopup.position.set(this.game.width/2, this.game.height/2);
            if (this.game.height < this.backtipPopup.height +20)
                this.backtipPopup.scale.setTo(this.game.height/(this.backtipPopup.height + 20), this.game.height/(this.backtipPopup.height + 20)); 
        }


        this.cableCutPopup.position.set(this.game.width/2, this.game.height/2);
        this.cableCutPopup.scale.setTo(this.game.width*0.36 / this.game.cache.getImage('cableCutPopup').width, this.game.width*0.36 / this.game.cache.getImage('cableCutPopup').width);

        this.cableCutBackButton.position.set(this.game.width*0.5, this.cableCutPopup.bottom - 5);
        this.cableCutBackButton.scale.setTo(this.game.width*0.1 / 100, this.game.width*0.1 / 100);

        if (this.ccOrPressR)
        {
            this.ccOrPressR.position.set(this.cableCutBackButton.x, this.cableCutBackButton.top - 4);
            this.ccOrPressR.scale.setTo(this.game.width*0.1 / 100, this.game.width*0.1 / 100);
        }
    },

    update: function() {

        this.checkForLevelAccomplished();

        if (this.processInput && !this.levelBeaten) {

            if (this.game.gameMode==='split') {                

                if ((this.upKey.isDown || this.moveUpInd) && this.mower1.ready && this.mower2.ready) {
                    if (this.field1.checkMoveOnNonMowed(0, 'up') && this.field2.checkMoveOnNonMowed(0, 'up')) {
                        this.mower1.move('up');
                        this.mower2.move('up');    
                    } else {
                        if (!this.field1.checkMoveOnNonMowed(0, 'up') && this.mower1.cableCut.alpha === 0 && !this.mower1.moveTween.isRunning) {
                            this.mower1.cableCut.position.set(this.mower1.x, this.mower1.y - 1.48*this.field1.squareSide);                    
                            this.mower1.cableCutAnim.play();    
                            this.mower1.cableCut.alpha = 1;
                            this.mower1.halfMove('up');
                        }
                        if (!this.field2.checkMoveOnNonMowed(0, 'up') && this.mower2.cableCut.alpha === 0 && !this.mower2.moveTween.isRunning) {
                            this.mower2.cableCut.position.set(this.mower2.x, this.mower2.y - 1.48*this.field2.squareSide);
                            this.mower2.cableCutAnim.play();                    
                            this.mower2.cableCut.alpha = 1;
                            this.mower2.halfMove('up');
                        }
                    }
                    
                } else if ((this.downKey.isDown || this.moveDownInd) && this.mower1.ready && this.mower2.ready) {
                    if (this.field1.checkMoveOnNonMowed(0, 'down') && this.field2.checkMoveOnNonMowed(0, 'down')) {
                        this.mower1.move('down');
                        this.mower2.move('down');    
                    } else {
                        if (!this.field1.checkMoveOnNonMowed(0, 'down') && this.mower1.cableCut.alpha === 0 && !this.mower1.moveTween.isRunning) {
                            this.mower1.cableCut.position.set(this.mower1.x, this.mower1.y + 0.52*this.field1.squareSide);
                            this.mower1.cableCutAnim.play();    
                            this.mower1.cableCut.alpha = 1;
                            this.mower1.halfMove('down');
                        }
                        if (!this.field2.checkMoveOnNonMowed(0, 'down') && this.mower2.cableCut.alpha === 0 && !this.mower2.moveTween.isRunning) {
                            this.mower2.cableCut.position.set(this.mower2.x, this.mower2.y + 0.52*this.field2.squareSide);
                            this.mower2.cableCutAnim.play();                    
                            this.mower2.cableCut.alpha = 1;
                            this.mower2.halfMove('down');
                        }
                    }
                } else if ((this.leftKey.isDown || this.moveLeftInd) && this.mower1.ready && this.mower2.ready) {
                    if (this.field1.checkMoveOnNonMowed(0, 'left') && this.field2.checkMoveOnNonMowed(0, 'left')) {
                        this.mower1.move('left');
                        this.mower2.move('left');    
                    } else {
                        if (!this.field1.checkMoveOnNonMowed(0, 'left') && this.mower1.cableCut.alpha === 0 && !this.mower1.moveTween.isRunning) {
                            this.mower1.cableCut.position.set(this.mower1.x - this.field1.squareSide, this.mower1.y - 0.48*this.field1.squareSide);
                            this.mower1.cableCutAnim.play();    
                            this.mower1.cableCut.alpha = 1;
                            this.mower1.halfMove('left');
                        }
                        if (!this.field2.checkMoveOnNonMowed(0, 'left') && this.mower2.cableCut.alpha === 0 && !this.mower2.moveTween.isRunning) {
                            this.mower2.cableCut.position.set(this.mower2.x - this.field2.squareSide, this.mower2.y - 0.48*this.field2.squareSide);
                            this.mower2.cableCutAnim.play();                    
                            this.mower2.cableCut.alpha = 1;
                            this.mower2.halfMove('left');
                        }
                    }
                } else if ((this.rightKey.isDown || this.moveRightInd) && this.mower1.ready && this.mower2.ready) {
                    if (this.field1.checkMoveOnNonMowed(0, 'right') && this.field2.checkMoveOnNonMowed(0, 'right')) {
                        this.mower1.move('right');
                        this.mower2.move('right');    
                    } else {
                        if (!this.field1.checkMoveOnNonMowed(0, 'right') && this.mower1.cableCut.alpha === 0 && !this.mower1.moveTween.isRunning) {
                            this.mower1.cableCut.position.set(this.mower1.x + this.field1.squareSide, this.mower1.y - 0.48*this.field1.squareSide);
                            this.mower1.cableCutAnim.play();    
                            this.mower1.cableCut.alpha = 1;
                            this.mower1.halfMove('right');
                        }
                        if (!this.field2.checkMoveOnNonMowed(0, 'right') && this.mower2.cableCut.alpha === 0 && !this.mower2.moveTween.isRunning) {
                            this.mower2.cableCut.position.set(this.mower2.x + this.field2.squareSide, this.mower2.y - 0.48*this.field2.squareSide);
                            this.mower2.cableCutAnim.play();                    
                            this.mower2.cableCut.alpha = 1;
                            this.mower2.halfMove('right');
                        }
                    }
                } else if (this.backKey.isDown && this.mower1.ready && this.mower2.ready && this.processBackKey) {
                    this.mower1.moveBack();
                    this.mower2.moveBack();
                }

                
            } else {
                

                if (this.upKey.isDown || this.moveUpInd) {

                    //console.log('up key is down');

                    if (!this.field.checkMoveOnNonMowed(0, 'up') && this.mower.cableCut.alpha === 0 && !this.mower.moveTween.isRunning) {
                        //console.log('going on cable up');
                        this.mower.cableCut.position.set(this.mower.x, this.mower.y - 1.48*this.field.squareSide);
                        this.mower.cableCutAnim.play();
                        this.mower.cableCut.alpha = 1;
                        this.mower.halfMove('up');
                    } else {
                        this.mower.move('up');    
                    }                

                    
                } else if (this.downKey.isDown || this.moveDownInd) {

                    if (!this.field.checkMoveOnNonMowed(0, 'down') && this.mower.cableCut.alpha === 0 && !this.mower.moveTween.isRunning) {
                        this.mower.cableCut.position.set(this.mower.x, this.mower.y + 0.52*this.field.squareSide);
                        this.mower.cableCutAnim.play();
                        this.mower.cableCut.alpha = 1;
                        this.mower.halfMove('down');
                    } else {
                        this.mower.move('down');    
                    }

                } else if (this.leftKey.isDown || this.moveLeftInd) {

                    if (!this.field.checkMoveOnNonMowed(0, 'left') && this.mower.cableCut.alpha === 0 && !this.mower.moveTween.isRunning) {
                        this.mower.cableCut.position.set(this.mower.x - this.field.squareSide, this.mower.y - 0.48*this.field.squareSide);
                        this.mower.cableCutAnim.play();
                        this.mower.cableCut.alpha = 1;
                        this.mower.halfMove('left');
                    } else {
                        this.mower.move('left');    
                    }               
                    

                } else if (this.rightKey.isDown || this.moveRightInd) {

                    if (!this.field.checkMoveOnNonMowed(0, 'right') && this.mower.cableCut.alpha === 0 && !this.mower.moveTween.isRunning) {
                        this.mower.cableCut.position.set(this.mower.x + this.field.squareSide, this.mower.y - 0.48*this.field.squareSide);
                        this.mower.cableCutAnim.play();
                        this.mower.cableCut.alpha = 1;
                        this.mower.halfMove('right');
                    } else {
                        this.mower.move('right');    
                    }                

                } else if (this.backKey.isDown && this.processBackKey) {
                    
                    this.mower.moveBack();

                }

                
            }
        } else {
            if (this.cableCutPopupGroup.alpha === 1 && this.backKey.isDown && this.processBackKey)
            {
                this.reviveAfterCC();
                this.processBackKey = false;
                this.time.events.add(400, function(){
                    this.processBackKey = true;
                }, this);
            }
        }
    },

    checkForLevelAccomplished: function() {
        if (this.game.gameMode==='split') {
            if (this.field1.mowedSquares[0].length + this.field2.mowedSquares[0].length + 2 === this.numEmptyCells && !this.levelBeaten) {
                this.levelBeaten = true;
                this.time.events.add(400, function(){
                    this.launchNextLevel();    
                }, this);
            }
        } else {

            if (this.field.mowedSquares[0].length + 1 === this.numEmptyCells && !this.levelBeaten) {
                this.levelBeaten = true;
                this.time.events.add(400, function(){
                    this.launchNextLevel();    
                }, this);
            }

        }
    },

    addMobileButtons: function(pointer) {
        if (pointer.x > 0.09*this.game.width && pointer.x < 0.91*this.game.width && pointer.y>this.game.height*0.025 && pointer.y<this.game.height*0.975){            
            if ((!this.moveLeftButton.input.checkPixel(null, null, pointer) && !this.moveUpButton.input.checkPixel(null, null, pointer) && 
                            !this.moveRightButton.input.checkPixel(null, null, pointer) && !this.moveDownButton.input.checkPixel(null, null, pointer) &&
                            this.cableCutPopupGroup.alpha === 0) || this.moveButtons.alpha === 0) {

                //if (this.moveButtons.alpha === 0) {
                //console.log(this.moveLeftInd);
                //console.log(this.moveUpInd);
                //console.log(this.moveRightInd);
                //console.log(this.moveDownInd);
                this.placeMobileButtons(pointer.x, pointer.y);    
                //}                

            }
        }
    },

    placeMobileButtons: function(xPos, yPos) {

        // apply x and y borders
        var x = Math.min(Math.max(this.game.width*0.09+100, xPos), this.game.width*0.91 - 100),
            y = Math.min(Math.max(this.game.height*0.025+100, yPos), this.game.height*0.975 - 100);

        this.moveButtons.alpha = 0.7;
        this.moveButtons.forEach(function(button){
            button.x = x;
            button.y = y;
            button.inputEnabled = true;
        }, this);

    },

    generateMapPlan: function(semiHamSeq, totalRows) {
        var path = semiHamSeq.slice(),
            obstacleSquares = [];

        // place 2 square obstalces

        currIndex = 0;

        while(currIndex+3<path.length){
            if (this.checkAdjacentCells(path[currIndex], path[currIndex+3])) {
                if (Math.random()>0.3) {
                    var currentObstacles = path.splice(currIndex+1, 2);
                    obstacleSquares = obstacleSquares.concat(currentObstacles);
                    //console.log('place 2 loop');
                    //console.log(currentObstacles);
                }
            }
            currIndex++;
        }

        // place 4 square obstacle
        var currIndex = 0
        while(currIndex+5<path.length){
            if (this.checkAdjacentCells(path[currIndex], path[currIndex+5])) {
                if (Math.random()>0.3) {
                    var currentObstacles = path.splice(currIndex+1, 4);
                    obstacleSquares = obstacleSquares.concat(currentObstacles);                
                    //console.log('place 4 loop');
                    //console.log(currentObstacles);
                }
            }
            currIndex++;
        }

        // place 3 square obstalces

        currIndex = 0;

        while(currIndex+4<path.length){
            if (this.checkAdjacentCells(path[currIndex], path[currIndex+4])) {
                if (Math.random()>0.3) {
                    var currentObstacles = path.splice(currIndex+1, 3);
                    obstacleSquares = obstacleSquares.concat(currentObstacles);
                    //console.log('place 3 loop');
                    //console.log(currentObstacles);
                }
            }
            currIndex++;
        }

        

        // create plan out of path
        //console.log(obstacleSquares);

        var mapPlan = [];

        for (var i = 0; i<totalRows; i++) {

            mapPlan[i] = [];

        }

        path.forEach(function(coord){
            //console.log(coord);
            mapPlan[coord[1]][coord[0]] = 0;
        }, this);

        obstacleSquares.forEach(function(coord){
            mapPlan[coord[1]][coord[0]] = 1;
        }, this);

        return [mapPlan, path];

    },

    checkAdjacentCells: function(coord1, coord2) {
        /*console.log('adjacent check called');*/
        //console.log(coord1);
        //console.log(coord2);
        if (coord1[0]===coord2[0]) {
            if (Math.abs(coord1[1] - coord2[1]) === 1) {
                return true;
            }
        } else if (coord1[1]===coord2[1]) {
            if (Math.abs(coord1[0] - coord2[0]) === 1) {
                return true;
            }
        }

        return false;
    },

    muteMusic: function() {
        if (this.muteButton.frameName==='onOut' || this.muteButton.frameName==='onDown') {
            this.muteButton.setFrames('offOut', 'offOut', 'offDown', 'offOut');
            this.sound.mute = true;
        } else {
            this.muteButton.setFrames('onOut', 'onOut', 'onDown', 'onOut');
            this.sound.mute = false;
        }
    },

    showHint: function() {
        if (this.game.gameMode==='single') {
            this.field.showHint();
        } else {
            this.field1.showHint();
            this.field2.showHint();
        }
    }

};

Square = function(game, posX, posY, sideLength, univ) {
    /*var squareGraphics = game.make.graphics(0, 0);
    squareGraphics.beginFill(0x005734);
    squareGraphics.drawRect(0, 0, sideLength, sideLength);
    squareGraphics.endFill();    */

    if (!univ) univ='real';

    if (univ==='real') {
        var squareTypes = ['nonmowed1', 'nonmowed2'];
        
    } else {
        var squareTypes = ['nonmowed1U', 'nonmowed2U'];
    }
    this.squareKey = squareTypes[Math.round(Math.random()*(squareTypes.length - 1))];

    Phaser.Sprite.call(this, game, posX, posY + sideLength/2, 'squareTypes', this.squareKey);
    //Phaser.Sprite.call(this, game, posX, posY + sideLength/2, 'grassTile');
    game.add.existing(this);
    this.anchor.setTo(0.5, 1);

    var scale = sideLength/100;
    this.scale.setTo(scale, scale);

    this.mowed = false;
    this.obstacle = false;

    this.univ = univ;

    // create idle animation
    /*var animationArray = ['1', '2', '3', '4', '3', '2'],
        shuffleNumber = Math.round(Math.random()*8);

    for (var i=0; i<shuffleNumber; i++) {
        var x = animationArray.shift();
        animationArray.push(x);
    }

    this.mainAnimation = this.animations.add('main', animationArray, 6, true);
    this.mainAnimation.play();*/
}

Square.prototype = Object.create(Phaser.Sprite.prototype);
Square.prototype.constructor = Square;

Square.prototype.moweDown = function() {

    //this.mainAnimation.paused = true;

    if (this.univ === 'real') {
        this.loadTexture('squareTypes', 'mowed');    
    } else {
        this.loadTexture('squareTypes', 'mowedU');
    }
    
    this.mowed = true;
}

Square.prototype.unmowe = function() {

    this.loadTexture('squareTypes', this.squareKey);
    //this.loadTexture('grassTile');
    //this.mainAnimation.restart();
    this.mowed = false;
}

Obstacle = function(game, posX, posY, sideLength, horSegments, verSegments, univ) {

    // choose obstacle type
    if (!univ) univ='real';

    if (univ==='real') {
        if (verSegments===1) {
            if (horSegments===1) {
                var obstacleTypes = ['barrel', 'rock', 'stump', 'bush'];   
            } else if (horSegments===2) {
                var obstacleTypes = ['garden'];
            } else if (horSegments===3) {
                var obstacleTypes = ['pond'];
            }
        } else if (verSegments===2) {
            if (horSegments===2) {
                var obstacleTypes = ['house', 'flowers', 'greenhouse'];
            } else if (horSegments===1) {
                var obstacleTypes = ['gardenVer'];
            }
        } else if (verSegments===3) {
            if (horSegments===1) {
                var obstacleTypes = ['bed'];
            }
        }
    } else {

        if (verSegments===1) {
            if (horSegments===1) {
                var obstacleTypes = ['claudroneU', 'tombU', 'rockU', 'treeU'];   
            } else if (horSegments===2) {
                var obstacleTypes = ['gardenU'];
            } else if (horSegments===3) {
                var obstacleTypes = ['lavaU'];
            }
        } else if (verSegments===2) {
            if (horSegments===2) {
                var obstacleTypes = ['houseU', 'mushroomsU', 'greenhouseU'];
            } else if (horSegments===1) {
                var obstacleTypes = ['gardenVerU'];
            }
        } else if (verSegments===3) {
            if (horSegments===1) {
                var obstacleTypes = ['bedU'];
            }
        }

    }
    
    var obstacleKey = obstacleTypes[Math.round(Math.random()*(obstacleTypes.length - 1))];

    Phaser.Sprite.call(this, game, posX, posY, 'squareTypes', obstacleKey);
    game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);

    var scale = sideLength/100;
    this.scale.setTo(scale, scale);

    this.obstacle = true;
}

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Mower = function(game, posX, posY, field, step, index, univ) {

    var mowerKey = univ==='real' ? 'mowerGuy' : 'mowerGuyU';

    Phaser.Sprite.call(this, game, posX, posY+field.squareSide*0.48, mowerKey);
    game.add.existing(this);
    this.anchor.setTo(0.5, 1);
    this.spriteScale = step/100;
    this.scale.setTo(this.spriteScale, this.spriteScale);

    this.moveLeftAnimation = this.animations.add('moveLeft', ['left0', 'left1', 'left2', 'left0'], 13, false);
    this.moveLeftBackAnimation = this.animations.add('moveLeftBack', ['left0', 'left2', 'left1', 'left0'], 13, false);

    this.moveRightAnimation = this.animations.add('moveRight', ['right0', 'right1', 'right2', 'right0'], 13, false);
    this.moveRightBackAnimation = this.animations.add('moveRightBack', ['right0', 'right2', 'right1', 'right0'], 13, false);

    this.moveUpAnimation = this.animations.add('moveUp', ['up0', 'up1', 'up2', 'up0'], 13, false);
    this.moveUpBackAnimation = this.animations.add('moveUpBack', ['up0', 'up1', 'up2', 'up0'], 13, false);

    this.moveDownAnimation = this.animations.add('moveDown', ['down0', 'down1', 'down1', 'down0'], 13, false);
    this.moveDownBackAnimation = this.animations.add('moveDownBack', ['down0', 'down1', 'down1', 'down0'], 13, false);

    this.idleRightAnimation = this.animations.add('idleRight', ['right0', 'rightIdle0', 'rightIdle1', 'rightIdle0'], 6, true);
    this.idleLeftAnimation = this.animations.add('idleLeft', ['left0', 'leftIdle0', 'leftIdle1', 'leftIdle0'], 6, true);
    this.idleDownAnimation = this.animations.add('idleDown', ['down0', 'downIdle0', 'downIdle1', 'downIdle0'], 6, true);
    this.idleUpAnimation = this.animations.add('idleUp', ['up0', 'upIdle0', 'upIdle1', 'upIdle0'], 6, true);

    this.game = game;
    this.field = field;
    this.stepLength = step;

    this.moves = [];
    this.ready = true;

    var explosionKey = (univ==='real') ? 'explosion': 'explosionU';

    this.mowingExplosion = this.game.add.sprite(0, 0, explosionKey);
    this.mowingExplosion.scale.setTo(this.spriteScale, this.spriteScale);
    this.mowingExplosion.anchor.setTo(0.5, 0.5);
    this.mowingExplosion.alpha = 0;

    this.expAnim = this.mowingExplosion.animations.add('forward', null, 20, false);
    this.expAnimBack = this.mowingExplosion.animations.add('backward', [5, 4, 3, 2, 1, 0], 20, false);

    this.expAnim.onComplete.add(function(){
        this.mowingExplosion.alpha = 0;
    }, this);

    this.expAnimBack.onComplete.add(function(){
        this.mowingExplosion.alpha = 0;
    }, this);

    this.cableCut = this.game.add.sprite(0, 0, 'cableCut');
    this.cableCut.scale.setTo(this.spriteScale, this.spriteScale);
    this.cableCut.anchor.setTo(0.5, 0.5);
    this.cableCut.alpha= 0 ;

    this.cableCutAnim = this.cableCut.animations.add('main', null, 10, false);
    this.cableCutAnim.onComplete.add(function(){
        this.cableCut.alpha = 0;
    }, this);

    this.index = index;

    this.cableCutSignal = new Phaser.Signal();

    this.idleAnimation = this.idleRightAnimation;

    this.idleAnimation.play();
}

Mower.prototype = Object.create(Phaser.Sprite.prototype);
Mower.prototype.constructor = Mower;

Mower.prototype.reset = function() {
    this.spriteScale = this.field.squareSide/100;
    this.scale.setTo(this.spriteScale, this.spriteScale);
    this.mowingExplosion.scale.setTo(this.spriteScale, this.spriteScale);
    this.cableCut.scale.setTo(this.spriteScale, this.spriteScale);
    this.stepLength = this.field.squareSide;
    this.moves = [];
    this.ready = true;
}

Mower.prototype.halfMove = function(direction) {

    if (this.moves.length>0) {
        var lastMove = this.moves[this.moves.length - 1];    
    } else {
         var lastMove = '';
    }

    this.idleAnimation.paused = true;

    var wirePos = new Phaser.Point(this.x, this.y - this.field.squareSide*0.48);
        
    switch (direction) {
        case 'left':
            switch (lastMove) {
                case 'down':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.rotation = Math.PI/2;
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
                case 'up':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
                case 'left':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'straight');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
            }
            this.moveTween = this.game.add.tween(this).to({x: this.x - this.stepLength*0.8}, 300, Phaser.Easing.Linear.None, true);
            this.moveAnimation = this.moveLeftAnimation;
            this.idleAnimation = this.idleLeftAnimation;
            break;
        case 'right':
            switch (lastMove) {
                case 'down':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.rotation = Math.PI;
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
                case 'up':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.rotation = - Math.PI/2;
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
                case 'right':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'straight');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
            }        
            this.moveTween = this.game.add.tween(this).to({x: this.x + this.stepLength*0.8}, 300, Phaser.Easing.Linear.None, true);
            //this.frameName = 'right';
            this.moveAnimation = this.moveRightAnimation;
            this.idleAnimation = this.idleRightAnimation;
            //this.x += this.stepLength;
            break;
        case 'up':
            switch (lastMove) {                    
                case 'up':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'straight');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.rotation = Math.PI/2;
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
                case 'left':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.rotation = Math.PI;
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
                case 'right':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.rotation = Math.PI/2;
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
            } 
            this.moveTween = this.game.add.tween(this).to({y: this.y - this.stepLength*0.8}, 300, Phaser.Easing.Linear.None, true);
            //this.frameName = 'up';
            this.moveAnimation = this.moveUpAnimation;
            this.idleAnimation = this.idleUpAnimation;
            //this.y -= this.stepLength;
            break;
        case 'down':
            switch (lastMove) {                    
                case 'down':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'straight');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.rotation = Math.PI/2;
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
                case 'left':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.rotation = -Math.PI/2;
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
                case 'right':
                    this.halfWire = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                    this.halfWire.anchor.setTo(0.5, 0.5);
                    this.halfWire.scale.setTo(this.spriteScale, this.spriteScale);
                    break;
            } 
            this.moveTween = this.game.add.tween(this).to({y: this.y + this.stepLength*0.8}, 300, Phaser.Easing.Linear.None, true);
            //this.frameName = 'down';
            this.moveAnimation = this.moveDownAnimation;
            this.idleAnimation = this.idleDownAnimation;
            //this.y += this.stepLength;
            break;
    }
    this.ready = false;
    this.moveAnimation.play();
    this.moveAnimation.onComplete.add(function(){
        if (this.idleAnimation.paused) {
            this.idleAnimation.restart();    
        } else {
            this.idleAnimation.play();
        }
        
    }, this);
    this.moveTween.onComplete.add(function(){
        //console.log('cable cut dispatched');
        this.cableCutSignal.dispatch();
        this.ready = true;
    }, this);
}

Mower.prototype.move = function(direction) {
    if (this.ready && this.field.checkMovePossiblity(this.index, direction)) {
        if (this.moves.length>0) {
            var lastMove = this.moves[this.moves.length - 1];    
        } else {
            var lastMove = '';
        }

        this.idleAnimation.paused = true;

        var wirePos = new Phaser.Point(this.x, this.y - this.field.squareSide*0.48);
        
        switch (direction) {
            case 'left':
                switch (lastMove) {
                    case 'down':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.rotation = Math.PI/2;
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                    case 'up':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                    case 'left':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'straight');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                }
                this.moveTween = this.game.add.tween(this).to({x: this.x - this.stepLength}, 300, Phaser.Easing.Linear.None, true);
                //this.frameName = 'left';
                this.moveAnimation = this.moveLeftAnimation;
                this.idleAnimation = this.idleLeftAnimation;
                this.mowingExplosion.position.set(this.x - this.stepLength, this.y - 0.48*this.field.squareSide);
                this.mowingExplosion.alpha = 1;
                this.mowingExplosion.rotation = Math.PI;
                this.expAnim.play();
                //this.x -= this.stepLength;
                break;
            case 'right':
                switch (lastMove) {
                    case 'down':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.rotation = Math.PI;
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                    case 'up':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.rotation = - Math.PI/2;
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                    case 'right':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'straight');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                }        
                this.moveTween = this.game.add.tween(this).to({x: this.x + this.stepLength}, 300, Phaser.Easing.Linear.None, true);
                //this.frameName = 'right';
                this.moveAnimation = this.moveRightAnimation; 
                this.idleAnimation = this.idleRightAnimation;
                this.mowingExplosion.position.set(this.x + this.stepLength, this.y- 0.48*this.field.squareSide);
                this.mowingExplosion.rotation = 0;
                this.mowingExplosion.alpha = 1;
                this.expAnim.play();       
                //this.x += this.stepLength;
                break;
            case 'up':
                switch (lastMove) {                    
                    case 'up':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'straight');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.rotation = Math.PI/2;
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                    case 'left':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.rotation = Math.PI;
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                    case 'right':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.rotation = Math.PI/2;
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                } 
                this.moveTween = this.game.add.tween(this).to({y: this.y - this.stepLength}, 300, Phaser.Easing.Linear.None, true);
                //this.frameName = 'up';
                this.moveAnimation = this.moveUpAnimation;
                this.idleAnimation = this.idleUpAnimation;
                this.mowingExplosion.position.set(this.x, this.y - this.stepLength - 0.48*this.field.squareSide);
                this.mowingExplosion.alpha = 1;
                this.mowingExplosion.rotation = -Math.PI/2;
                this.expAnim.play();
                //this.y -= this.stepLength;
                break;
            case 'down':
                switch (lastMove) {                    
                    case 'down':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'straight');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.rotation = Math.PI/2;
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                    case 'left':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.rotation = -Math.PI/2;
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                    case 'right':
                        var wireSprite = this.wires.create(wirePos.x, wirePos.y, 'wire', 'bend');
                        wireSprite.anchor.setTo(0.5, 0.5);
                        wireSprite.scale.setTo(this.spriteScale, this.spriteScale);
                        break;
                } 
                this.moveTween = this.game.add.tween(this).to({y: this.y + this.stepLength}, 300, Phaser.Easing.Linear.None, true);
                //this.frameName = 'down';
                this.moveAnimation = this.moveDownAnimation;
                this.idleAnimation = this.idleDownAnimation;
                this.mowingExplosion.position.set(this.x, this.y + this.stepLength - 0.48*this.field.squareSide);
                this.mowingExplosion.alpha = 1;
                this.mowingExplosion.rotation =  Math.PI/2;
                this.expAnim.play();
                //this.y += this.stepLength;
                break;
        }
        this.ready = false;
        this.moveAnimation.play();
        this.moveAnimation.onComplete.add(function(){
            if (this.idleAnimation.paused) {
                this.idleAnimation.restart();    
            } else {
                this.idleAnimation.play();
            }
            
        }, this);
        this.moveTween.onComplete.add(function(){
            this.ready = true;
        }, this);
        this.field.moweNewSquare(this.index, direction);
        this.moves.push(direction);
        if (this.game.mowerSound.isDecoded) {
            this.game.mowerSound.play();
        }
    }
}

Mower.prototype.moveBack = function() {
    if (this.moves.length > 0 && this.ready) {
        var lastMove = this.moves.pop(),
            prelastMove = this.moves[this.moves.length-1];

        this.idleAnimation.paused = true;

        switch (lastMove) {
            case 'left':
                this.moveBackTween = this.game.add.tween(this).to({x: this.x + this.stepLength}, 300, Phaser.Easing.Linear.None, true);
                this.moveBackAnimation = this.moveLeftBackAnimation;                
                this.mowingExplosion.position.set(this.x, this.y- 0.48*this.field.squareSide);
                this.mowingExplosion.alpha = 1;
                this.mowingExplosion.rotation =  Math.PI;
                this.expAnimBack.play();
                //this.x += this.stepLength;
                break;
            case 'right':                
                this.moveBackTween = this.game.add.tween(this).to({x: this.x - this.stepLength}, 300, Phaser.Easing.Linear.None, true);
                this.moveBackAnimation = this.moveRightBackAnimation;
                this.mowingExplosion.position.set(this.x, this.y- 0.48*this.field.squareSide);
                this.mowingExplosion.rotation = 0;
                this.mowingExplosion.alpha = 1;
                this.expAnimBack.play();
                //this.x -= this.stepLength;
                break;
            case 'up':
                this.moveBackTween = this.game.add.tween(this).to({y: this.y + this.stepLength}, 300, Phaser.Easing.Linear.None, true);
                this.moveBackAnimation = this.moveUpBackAnimation;
                this.mowingExplosion.position.set(this.x, this.y- 0.48*this.field.squareSide);
                this.mowingExplosion.alpha = 1;
                this.mowingExplosion.rotation =  - Math.PI/2;
                this.expAnimBack.play();
                //this.y += this.stepLength;
                break;
            case 'down':
                this.moveBackTween = this.game.add.tween(this).to({y: this.y - this.stepLength}, 300, Phaser.Easing.Linear.None, true);
                this.moveBackAnimation = this.moveDownBackAnimation;
                this.mowingExplosion.position.set(this.x, this.y- 0.48*this.field.squareSide);
                this.mowingExplosion.alpha = 1;
                this.mowingExplosion.rotation =  Math.PI/2;
                this.expAnimBack.play();
                //this.y -= this.stepLength;
                break;
        }
        switch (prelastMove) {
            case 'left':
                this.idleAnimation = this.idleLeftAnimation;
                break;
            case 'right':
                this.idleAnimation = this.idleRightAnimation;
                break;
            case 'down':
                this.idleAnimation = this.idleDownAnimation;
                break;
            case 'up':
                this.idleAnimation = this.idleUpAnimation;
                break;
        }
        this.ready = false;
        this.moveBackAnimation.play();
        this.moveBackAnimation.onComplete.add(function(){
            if (this.idleAnimation.paused) {
                this.idleAnimation.restart();    
            } else {
                this.idleAnimation.play();
            }
        }, this);
        this.moveBackTween.onComplete.add(function(){
            this.ready = true;
        }, this);

        this.field.unmoweLastSquare(this.index);
        if (this.wires.length>0) {
            this.wires.removeChildAt(this.wires.length - 1);    
        }     
        if (this.game.mowerSound.isDecoded) {
            this.game.mowerSound.play();
        }   
    }   
}

Field = function(game, totalColumns, totalRows, fieldIndex, fieldsNumber, univ) {
    if (!univ) univ='real';

    this.game = game;

    Phaser.Group.call(this, game);
    game.add.existing(this);

    this.map = [];

    if (game.width*0.82 > totalColumns*fieldsNumber / totalRows * (game.height*0.95)) {
        this.squareSide = Math.ceil(game.height*0.95/totalRows);
        if (fieldIndex===1 && (fieldsNumber===2 || fieldsNumber===1)) {
            this.xStart = (game.width - totalColumns*fieldsNumber*this.squareSide)/2;    
        } else if (fieldIndex===2 && fieldsNumber===2){
            this.xStart = game.width/2;    
        }
        this.yStart = game.height*0.025;
    } else {
        this.squareSide = Math.ceil(game.width*0.82/totalColumns/fieldsNumber);
        if (fieldIndex===1 && (fieldsNumber===2 || fieldsNumber===1)) {
            this.xStart = game.width*0.09;
        } else if (fieldIndex===2 && fieldsNumber===2){
            this.xStart = game.width/2;    
        }        
        this.yStart = (game.height - totalRows*this.squareSide)/2;
    }

    for (var r = 0; r<totalRows; r++) {
        this.map[r] = [];
    }

    this.columns = totalColumns;
    this.rows = totalRows;
    this.fieldIndex = fieldIndex;
    this.fieldsNumber = fieldsNumber;

    this.mowedSquares = [];

    this.startCoord = [];
    this.mowers = [];
    this.plugs = [];

    this.univ = univ;

}

Field.prototype = Object.create(Phaser.Group.prototype);
Field.prototype.constructor = Field;

Field.prototype.buildMap = function(mapPlan, path) {

    for (var rowS in mapPlan) {
        for (var colS in mapPlan[rowS]) {

            var row = Number(rowS),
                col = Number(colS);

            if (mapPlan[row][col]===0) {

                this.addSquare(col, row);

            } else if (mapPlan[row][col]===1 && !this.checkObstacle(col, row)){

                if (row>=0 && row<this.rows - 1 && col>=0 && col<this.columns - 1 && mapPlan[row+1][col]===1 && !this.checkObstacle(col, row+1) && mapPlan[row][col+1]===1 && !this.checkObstacle(col+1, row) && 
                    mapPlan[row+1][col+1]===1 && !this.checkObstacle(col+1, row+1)) {

                    this.addObstacle(col, row, 2, 2);
                } else if (col>=0 && col<this.columns - 2 && mapPlan[row][col+1]===1 && !this.checkObstacle(col+1, row) && mapPlan[row][col+2]===1 && !this.checkObstacle(col+2, row)){
                    this.addObstacle(col, row, 3, 1);
                } else if (col>=0 && col<this.columns - 1 && mapPlan[row][col+1]===1 && !this.checkObstacle(col+1, row)){
                    this.addObstacle(col, row, 2, 1);
                } else if (row>=0 && row<this.rows - 1 && mapPlan[row+1][col]===1 && !this.checkObstacle(col, row+1)) {
                    this.addObstacle(col, row, 1, 2);
                } else if (row>=0 && row<this.rows - 2 && mapPlan[row+1][col]===1 && !this.checkObstacle(col, row+1) && mapPlan[row+2][col] && !this.checkObstacle(col, row+2)) {
                    this.addObstacle(col, row, 1, 3);
                } else {
                    this.addObstacle(col, row, 1, 1);    
                } 

            }

        }
    }

    this.path = path;

    // create hint
    var hintGraphics = this.game.make.graphics(0 , 0);
    hintGraphics.lineStyle(3, 0xffffff, 1);
    var squareSprite = this.map[path[0][1]][path[0][0]];
    hintGraphics.moveTo(squareSprite.centerX, squareSprite.centerY);

    var leftMostX = squareSprite.centerX,
        topMostY = squareSprite.centerY;

    for (var i = 1; i<path.length; i++) {
        squareSprite = this.map[path[i][1]][path[i][0]];
        hintGraphics.lineTo(squareSprite.centerX, squareSprite.centerY);
        leftMostX = Math.min(leftMostX, squareSprite.centerX);
        topMostY = Math.min(topMostY, squareSprite.centerY);
    }

    if (this.hintSprite) this.hintSprite.destroy();

    this.hintSprite = this.game.add.sprite(leftMostX, topMostY, hintGraphics.generateTexture());
    this.hintSprite.alpha = 0;
}

Field.prototype.addObstacle = function(column, row, horSegments, verSegments) {
    var xOffset = horSegments/2,
        yOffset = verSegments/2,
        xPos = (Number(column) + xOffset)*this.squareSide + this.xStart,
        yPos = (Number(row) + yOffset)*this.squareSide + this.yStart;

    var obstacle = new Obstacle(this.game, xPos, yPos, this.squareSide, horSegments, verSegments, this.univ);
    this.add(obstacle);

    for (var y = 0; y<verSegments; y++) {
        for (var x = 0; x<horSegments; x++) {
            this.map[row+y][column+x] = obstacle;
        }
    }
}

Field.prototype.addSquare = function(column, row) {

    var xPos = (Number(column) + 0.5)*this.squareSide + this.xStart,
        yPos = (Number(row) + 0.5)*this.squareSide + this.yStart;

    var square = new Square(this.game, xPos, yPos, this.squareSide, this.univ);

    this.map[row][column] = square;

    this.add(square);
}

Field.prototype.addMower = function(column, row) {

    var xPos = (Number(column) + 0.5)*this.squareSide + this.xStart,
        yPos = (Number(row) + 0.5)*this.squareSide + this.yStart;

    var plug = this.game.add.sprite(xPos, yPos, 'plugTile', 'down');
    plug.anchor.setTo(0.5, 0.5);

    this.mowedSquares[this.mowers.length] = [];

    var mower = new Mower(this.game, xPos, yPos, this, this.squareSide, this.mowers.length, this.univ);

    this.mowers.push(mower);
    plug.scale.setTo(mower.spriteScale, mower.spriteScale);

    this.plugs.push(plug);


    if (this.checkLawnNonMowed(column, row)) {

        this.map[row][column].moweDown();
    }

    this.startCoord.push([column, row]);

    return mower;
}

Field.prototype.placeMower = function(index, column, row) {

    var xPos = (Number(column) + 0.5)*this.squareSide + this.xStart,
        yPos = (Number(row) + 0.5)*this.squareSide + this.yStart;

    this.plugs[index].position.set(xPos, yPos);
    this.plugs[index].scale.setTo(this.mowers[index].spriteScale, this.mowers[index].spriteScale);

    this.mowedSquares[index]= [];

    this.mowers[index].position.set(xPos, yPos + 0.48*this.squareSide);

    if (this.checkLawnNonMowed(column, row)) {

        this.map[row][column].moweDown();
    }

    this.startCoord[index] = [column, row];
}

Field.prototype.checkLawnNonMowed = function(column, row) {

    //console.log(column);
    //console.log(row);

    if (column < this.columns && row < this.rows) {

        if (this.map[row][column] && !this.map[row][column].obstacle && !this.map[row][column].mowed) {

            //console.log('non mowed and lawn');

            return true;
        }
    }

    return false;
}

Field.prototype.checkMoveOnNonMowed = function(index, direction) {
    var mowerCoord = this.getMowerCoord(index);

    switch (direction) {
        case 'left':
            var coordToCheck = [mowerCoord[0]-1, mowerCoord[1]];
            break;
        case 'right':
            var coordToCheck = [mowerCoord[0]+1, mowerCoord[1]];
            break;
        case 'up':
            var coordToCheck = [mowerCoord[0], mowerCoord[1] - 1];
            break;
        case 'down':
            var coordToCheck = [mowerCoord[0], mowerCoord[1] + 1];
            break;
    }

    /*console.log(direction);
    console.log(coordToCheck);
    console.log(this.checkNonMowed(...coordToCheck));*/

    if (this.checkNonMowed(coordToCheck[0], coordToCheck[1])) {
        return true;
    }

    return false;
}

Field.prototype.checkNonMowed = function(column, row) {

    if (column < this.columns && row < this.rows && column>=0 && row>=0) {

        if (this.map[row][column] && this.map[row][column].mowed) {

            return false;
        }
    }

    return true;

}

Field.prototype.checkObstacle = function(column, row) {

    if (column< this.columns && row < this.rows) {

        if (this.map[row][column] && this.map[row][column].obstacle) {

            return true;
        }
    }

    return false;
}

Field.prototype.getMowerCoord = function(index) {

    var xCoord = Math.round((this.mowers[index].x - this.xStart)/this.squareSide - 0.5),
        yCoord = Math.round((this.mowers[index].y - this.yStart)/this.squareSide - 0.5);

    return [xCoord, yCoord];
}

Field.prototype.checkMovePossiblity = function(index, direction) {

    var mowerCoord = this.getMowerCoord(index);

    switch (direction) {
        case 'left':
            var coordToCheck = [mowerCoord[0]-1, mowerCoord[1]];
            break;
        case 'right':
            var coordToCheck = [mowerCoord[0]+1, mowerCoord[1]];
            break;
        case 'up':
            var coordToCheck = [mowerCoord[0], mowerCoord[1] - 1];
            break;
        case 'down':
            var coordToCheck = [mowerCoord[0], mowerCoord[1] + 1];
            break;
    }

    if (coordToCheck[0] >=0 && coordToCheck[1] >= 0 && this.checkLawnNonMowed(coordToCheck[0], coordToCheck[1])) {
        return true;
    }

    return false;
}

Field.prototype.moweNewSquare = function(index, direction) {

    var currentMowerCoord = this.getMowerCoord(index);

    switch (direction) {

        case 'left':
            var newMowerCoord = [currentMowerCoord[0] - 1, currentMowerCoord[1]];
            if (this.mowedSquares[index].length===0) this.plugs[index].frameName = 'left';
            break;
        case 'right':
            var newMowerCoord = [currentMowerCoord[0] + 1, currentMowerCoord[1]];
            if (this.mowedSquares[index].length===0) this.plugs[index].frameName = 'right';
            break;
        case 'up':
            var newMowerCoord = [currentMowerCoord[0], currentMowerCoord[1] - 1];
            if (this.mowedSquares[index].length===0) this.plugs[index].frameName = 'up';
            break;
        case 'down':
            var newMowerCoord = [currentMowerCoord[0], currentMowerCoord[1] + 1];
            if (this.mowedSquares[index].length===0) this.plugs[index].frameName = 'down';
            break;
    }

    this.map[newMowerCoord[1]][newMowerCoord[0]].moweDown();

    this.mowedSquares[index].push(this.map[newMowerCoord[1]][newMowerCoord[0]]);

    //console.log(this.mowedSquares[0].length);
}

Field.prototype.unmoweLastSquare = function(index) {

    var lastMowedSquare = this.mowedSquares[index].pop();

    lastMowedSquare.unmowe();
}

Field.prototype.reset = function(totalColumns, totalRows, fieldIndex, fieldsNumber) {
    this.removeAll();

    this.map = [];

    if (this.game.width*0.82 > totalColumns*fieldsNumber / totalRows * (this.game.height*0.95)) {
        this.squareSide = Math.ceil(this.game.height*0.95/totalRows);
        if (fieldIndex===1 && (fieldsNumber===2 || fieldsNumber===1)) {
            this.xStart = (this.game.width - totalColumns*fieldsNumber*this.squareSide)/2;    
        } else if (fieldIndex===2 && fieldsNumber===2){
            this.xStart = this.game.width/2;    
        }
        this.yStart = this.game.height*0.025;
    } else {
        this.squareSide = Math.ceil(this.game.width*0.82/totalColumns/fieldsNumber);
        if (fieldIndex===1 && (fieldsNumber===2 || fieldsNumber===1)) {
            this.xStart = this.game.width*0.09;
        } else if (fieldIndex===2 && fieldsNumber===2){
            this.xStart = this.game.width/2;    
        }        
        this.yStart = (this.game.height - totalRows*this.squareSide)/2;
    }

    for (var r = 0; r<totalRows; r++) {
        this.map[r] = [];
    }

    this.columns = totalColumns;
    this.rows = totalRows;

    this.mowedSquares = [];
}

Field.prototype.showHint = function() {
    this.hintSprite.alpha = 1;
    var hintTween = this.game.add.tween(this.hintSprite).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);    
}

Field.prototype.updateScale = function() {

    if (this.game)
    {
        var previousXStart = this.xStart,
            previousYStart = this.yStart,
            previousSquareSide = this.squareSide;

        if (this.game.width*0.82 > this.columns*this.fieldsNumber / this.rows * (this.game.height*0.95)) {
            this.squareSide = Math.ceil(this.game.height*0.95/this.rows);
            if (this.fieldIndex===1 && (this.fieldsNumber===2 || this.fieldsNumber===1)) {
                this.xStart = (this.game.width - this.columns*this.fieldsNumber*this.squareSide)/2;    
            } else if (this.fieldIndex===2 && this.fieldsNumber===2){
                this.xStart = this.game.width/2;
            }
            this.yStart = this.game.height*0.025;
        } else {
            this.squareSide = Math.ceil(this.game.width*0.82/this.columns/this.fieldsNumber);
            if (this.fieldIndex===1 && (this.fieldsNumber===2 || this.fieldsNumber===1)) {
                this.xStart = this.game.width*0.09;
            } else if (this.fieldIndex===2 && this.fieldsNumber===2){
                this.xStart = this.game.width/2;    
            }        
            this.yStart = (this.game.height - this.rows*this.squareSide)/2;
        }

        var newScale = this.squareSide/previousSquareSide,
            xShift = this.xStart - previousXStart,
            yShift = this.yStart - previousYStart;

        this.children.forEach(function(square){
            square.x = (square.x - previousXStart)*newScale + this.xStart;
            square.y = (square.y - previousYStart)*newScale + this.yStart;
            square.scale.x *= newScale;
            square.scale.y *= newScale;
        }, this);

        this.plugs.forEach(function(plug){
            plug.x = (plug.x - previousXStart)*newScale + this.xStart;
            plug.y = (plug.y - previousYStart)*newScale + this.yStart;
            plug.scale.x *= newScale;
            plug.scale.y *= newScale;
        }, this);

        this.mowers.forEach(function(mower){
            mower.x = (mower.x - previousXStart)*newScale + this.xStart;
            mower.y = (mower.y - previousYStart)*newScale + this.yStart;
            mower.scale.x *= newScale;
            mower.scale.y *= newScale;

            mower.wires.forEach(function(wire){
                wire.x = (wire.x - previousXStart)*newScale + this.xStart;
                wire.y = (wire.y - previousYStart)*newScale + this.yStart;
                wire.scale.y *= newScale;
                wire.scale.x *= newScale;
            }, this);

            mower.cableCut.scale.x *= newScale;
            mower.cableCut.scale.y *= newScale;
            mower.mowingExplosion.scale.x *= newScale;
            mower.mowingExplosion.scale.y *= newScale;

            mower.stepLength *= newScale;
            mower.spriteScale *= newScale;
        }, this);

        var hintGraphics = this.game.make.graphics(0 , 0);
        hintGraphics.lineStyle(3, 0xffffff, 1);
        var squareSprite = this.map[this.path[0][1]][this.path[0][0]];
        hintGraphics.moveTo(squareSprite.centerX, squareSprite.centerY);

        var leftMostX = squareSprite.centerX,
            topMostY = squareSprite.centerY;

        for (var i = 1; i<this.path.length; i++) {
            squareSprite = this.map[this.path[i][1]][this.path[i][0]];
            hintGraphics.lineTo(squareSprite.centerX, squareSprite.centerY);
            leftMostX = Math.min(leftMostX, squareSprite.centerX);
            topMostY = Math.min(topMostY, squareSprite.centerY);
        }

        if (this.hintSprite) this.hintSprite.destroy();

        this.hintSprite = this.game.add.sprite(leftMostX, topMostY, hintGraphics.generateTexture());
        this.hintSprite.alpha = 0;    
    }

    //return {shift: {x: xShift, y: yShift}, scale: newScale};
}

/*document.addEventListener('onAdLoaded', function(data){
    if (data.adType =='interstitial') {
        BasicGame.Game.adReady = true;
    }
});*/