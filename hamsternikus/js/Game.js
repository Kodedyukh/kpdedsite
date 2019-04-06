
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

    render: function() {

        //this.game.debug.text(this.time.fps || '--', 2, 20, "#ff0000");
    },

    create: function () {

        

        //draw background
        /*var graphics = this.add.graphics(0, 0);
        graphics.beginFill(0x323e43);
        graphics.drawRect(0, 0, this.game.width, this.game.height);
        graphics.endFill();

        //draw support lines
        //vertical lines
        graphics.moveTo(0, 0);
        graphics.lineStyle(1, 0x353535, 0.5);
        for (var i=0; i<16; i++){
            var x = i*this.game.width/16;
            graphics.lineTo(x, this.game.height);
            graphics.moveTo((i+1)*this.game.width/16, 0);
        }
        //horizontal lines
        graphics.moveTo(0, 0);
        for (var i=0; i<12; i++){
            var y = i*this.game.height/12;
            graphics.lineTo(this.game.width, y);
            graphics.moveTo(0, (i+1)*this.game.height/12);
        }*/

        //console.log(this.game.height);
        //console.log(this.game.width);

        this.game.canvas.oncontextmenu = function(e) { e.preventDefault(); }

        this.world.setBounds(0, 0, this.game.width, this.game.height);
        switch (this.game.gameWorld) {
            case 'maze':
                var backgroundKey = 'backgroundMaze';
                break;
            case 'lab':
                var backgroundKey = 'backgroundLab';                
                break;
            case 'brain':
                var backgroundKey = 'backgroundSpace';
                break;
        }
        this.drawingCanvas = this.add.sprite(0, 0, backgroundKey);
        this.drawingCanvas.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);


        textureStorage.prepareObstacleTextureCanvas(this.game);

        this.triesNumber = 0;
        this.adReady = false;
        this.adShown = false;

        //enemies groups and shdows
        this.tipsSpriteGroup = this.add.group();
        this.portalsSG = this.add.group();
        

        this.game.bottomShadowGroup = this.add.group();
        this.triggers = this.add.group();  
        this.wormHoles = this.add.group();
        this.finishGroup = this.add.group();
        this.game.topShadowGroup = this.add.group();
        //this.map = this.cache.getJSON('tempLevel');
        this.game.wallsSG = this.add.group();
        //this.game.walls = [];
        this.beesSwarm = this.add.group();
        
        this.electrodes = [];
        this.electricArcsGroups = this.add.group();        
        this.portals = {};
        this.game.effectsSprtites = [];

        this.game.debugGraphics = this.game.add.graphics(0, 0);

        this.ball = new Ball(this.game, 0, 0);//this.start.x/this.game.width, this.start.y/this.game.height);
        //this.ballGroup = this.add.group();
        //this.ballGroup.add(this.ball);
        this.octopuses = this.add.group();
        this.worms = this.add.group();
        this.fans = this.add.group();
        this.game.fanCurles = this.add.group();

        // cretae teleport overlay
        this.teleportScreen = this.game.add.sprite(0, 0, 'teleportScreen');
        this.teleportScreenAnimation = this.teleportScreen.animations.add('main', null, 24, false);
        this.teleportScreen.alpha = 0;
        //this.teleportScreenAnimation.play();
        this.teleportScreenAlphaTweenUp = this.game.add.tween(this.teleportScreen).to({alpha: 1}, 1500, Phaser.Easing.Linear.None, false);
        this.teleportScreenAlphaTweenDown = this.game.add.tween(this.teleportScreen).to({alpha: 0}, 500, Phaser.Easing.Linear.None, false);
        //this.teleportScreenAlphaTweenUp.start();

        // create win popups
        this.winPopup = this.add.group()
        this.winBack = this.game.make.sprite(this.game.width/2, this.game.height/2, 'winBack');
        this.winBack.anchor.setTo(0.5, 0.5);
        this.winPopup.add(this.winBack);

        this.winRestartButton = this.game.make.button(this.game.width*0.37, this.game.height*0.75, 'replayButtonMenu', this.replayLevel, this, 'out', 'out', 'down', 'out');
        this.winRestartButton.anchor.setTo(0.5, 0.5);
        this.winPopup.add(this.winRestartButton);
        this.winRestartButton.inputEnabled = false;

        this.winNextLevelButton = this.game.make.button(this.game.width*0.63, this.game.height*0.75, 'playInGameButton', this.goNextLevel, this, 'out', 'out', 'down', 'out');
        this.winNextLevelButton.anchor.setTo(0.5, 0.5);
        this.winPopup.add(this.winNextLevelButton);
        this.winNextLevelButton.inputEnabled = false;

        //emitters
        this.winEmitterTL = this.add.emitter(this.winBack.left, this.winBack.top, 100);
        this.winEmitterTL.makeParticles('winParticles', [0, 1, 2, 3], 20);
        this.winEmitterTL.maxParticleSpeed.setTo(-300, -300);
        this.winEmitterTL.minParticleSpeed.setTo(0, 0);
        this.winEmitterTL.angularDrag = 30;

        this.winEmitterTR = this.add.emitter(this.winBack.right, this.winBack.top, 100);
        this.winEmitterTR.makeParticles('winParticles', [0, 1, 2, 3], 20);
        this.winEmitterTR.maxParticleSpeed.setTo(300, -300);
        this.winEmitterTR.minParticleSpeed.setTo(0, 0);
        this.winEmitterTR.angularDrag = 30;

        this.winEmitterBL = this.add.emitter(this.winBack.left, this.winBack.bottom, 100);
        this.winEmitterBL.makeParticles('winParticles', [0, 1, 2, 3], 20);
        this.winEmitterBL.maxParticleSpeed.setTo(-300, -300);
        this.winEmitterBL.minParticleSpeed.setTo(0, 0);
        this.winEmitterBL.angularDrag = 30;

        this.winEmitterBR = this.add.emitter(this.winBack.right, this.winBack.bottom, 100);
        this.winEmitterBR.makeParticles('winParticles', [0, 1, 2, 3], 20);
        this.winEmitterBR.maxParticleSpeed.setTo(300, -300);
        this.winEmitterBR.minParticleSpeed.setTo(0, 0);
        this.winEmitterBR.angularDrag = 30;

        /*this.winEmitterTLRightTween = this.add.tween(this.winEmitterTL).to({x: this.winBack.right*1.1}, 500, Phaser.Easing.Linear.None, false);
        this.winEmitterTLDownTween = this.add.tween(this.winEmitterTL).to({y: this.winBack.bottom*1.1}, 500, Phaser.Easing.Linear.None, false);
        this.winEmitterTLRightTween.chain(this.winEmitterTLDownTween);
        this.winEmitterTLRightTween.onComplete.add(function(){
            this.winEmitterTL.maxParticleSpeed.setTo(150, 100);
            this.winEmitterTL.minParticleSpeed.setTo(250, -100);
        }, this);
        this.winEmitterTLDownTween.onComplete.add(function(){
            this.winEmitterTL.x = this.winBack.left;
            this.winEmitterTL.y = this.winBack.top;
            this.winEmitterTL.minParticleSpeed.setTo(-100, -150);
            this.winEmitterTL.maxParticleSpeed.setTo(100, -250);
            //this.winEmitterTL.kill();
        }, this);*/
        //this.winPopup.add(this.winEmitterTL);        

        this.winPopup.alpha = 0;

        // create lost popup
        this.lostPopup = this.add.group();
        this.lostBack = this.game.make.sprite(this.game.width/2, this.game.height/2, 'lostBack');
        this.lostBack.anchor.setTo(0.5, 0.5);
        this.lostPopup.add(this.lostBack);

        this.lostRestartButton = this.game.make.button(this.game.width*0.5, this.game.height*0.75, 'replayButtonMenu', this.replayLevel, this, 'out', 'out', 'down', 'out');
        this.lostRestartButton.anchor.setTo(0.5, 0.5);
        this.lostPopup.add(this.lostRestartButton);
        this.lostRestartButton.inputEnabled = false;

        // button with a link to google play

        this.getOnGPButton = this.game.add.button(this.game.width*0.99, this.game.height*0.99, 'getOnGPButton', this.getOnGP, this, 'out', 'out', 'down', 'out');
        this.getOnGPButton.anchor.setTo(1, 1);
        this.getOnGPButton.inputEnabled = false;
        this.getOnGPButton.alpha = 0;

        this.lostPopup.alpha = 0;

        this.levelN = this.game.levelNum;
        this.game.lockedLevel = localStorage.getItem('lockedLevel') || 2;
        //this.levelN = 0;
        this.game.gameOnPause = false;
        this.inReversion = false;


        /*this.borderWalls = {
            '0':
                {
                    'type': 'immovableSk',
                    'edges': [ [[-5, 0], [0, 0], [0, configuration.canvasHeight], [-5, configuration.canvasHeight]],
                                [[0, 0], [0, -5], [configuration.canvasWidth, -5], [configuration.canvasWidth, 0]],
                                [[configuration.canvasWidth, 0], [configuration.canvasWidth+5, 0], [configuration.canvasWidth+5, configuration.canvasHeight], 
                                [configuration.canvasWidth, configuration.canvasHeight]],
                                [[0, configuration.canvasHeight], [configuration.canvasWidth, configuration.canvasHeight], 
                                [configuration.canvasWidth, configuration.canvasHeight+5], [0, configuration.canvasHeight+5]]
                            ]
                }
        };*/

        this.game.borderWalls = {
            '-3':
                {
                    'type': 'immovableSk',
                    'edges': [[[-5, 0], [0, 0], [0, configuration.canvasHeight], [-5, configuration.canvasHeight]]]
                },

            '-2':
                {
                    'type': 'immovableSk',
                    'edges': [[[0, 0], [0, -5], [configuration.canvasWidth, -5], [configuration.canvasWidth, 0]]]
                },

            '-1':
                {
                    'type': 'immovableSk',
                    'edges': [[[configuration.canvasWidth, 0], [configuration.canvasWidth+5, 0], [configuration.canvasWidth+5, configuration.canvasHeight], 
                                [configuration.canvasWidth, configuration.canvasHeight]]]
                },

            '0':
                {
                    'type': 'immovableSk',
                    'edges': [[[0, configuration.canvasHeight], [configuration.canvasWidth, configuration.canvasHeight], 
                                [configuration.canvasWidth, configuration.canvasHeight+5], [0, configuration.canvasHeight+5]]]
                }

        };

        
        

        this.game.lightSources = [new Phaser.Point(2100, -7000)];//, 
            //new Phaser.Point(-1100, -7000)];

        /*this.start = new Start(this.game, 50/configuration.canvasWidth, 590/configuration.canvasHeight);
        this.start.alpha = 0;
        this.finish = new Finish(this.game, 910/configuration.canvasWidth, 50/configuration.canvasHeight);*/



        //this.camera.follow(this.ball);

        //this.ball.moveSignal.add(this.finish.checkPlayerIntersection, this.finish);
        this.ball.moveSignal.add(this.updateBallCurrentCoord, this);
        /*this.finish.signal.add(function(status){
            if (status==='in') {
                this.goNextLevel();    
            }            
        }, this);*/

        //wall pushed signal
        this.game.pushSignal = new Phaser.Signal();
        /*this.game.pushSignal.add(function(){
            if (!this.targetFound) {
                this.findTargetWall();
            }
        }, this.ball);*/
        this.game.pushSignal.add(audioPlayer.playOneTime, audioPlayer);

        this.game.currentBallCoord = [this.ball.position, this.ball.width/2]; 
       
        this.replayKey = this.input.keyboard.addKey(Phaser.Keyboard.R);
        this.replayKey.onUp.add(this.replayLevel, this);  

        /*var startLightX = this.game.width;
        var rangeLightX = this.game.width/3;

        for (var i = 0; i<20; i++) {
            var lightSource = {
                height: 400+i*20,
                position: new Phaser.Point(startLightX - rangeLightX*i/20, -700)
            };

            lightSources.push(lightSource);
        }*/

        //shadowProcessor.setLightSources(this.game.lightSources);

        //create puase overlay and pause menu
        this.UIGroup = this.add.group();
        this.pauseMenu = this.add.group();

        var overlayGraphics = this.make.graphics(0, 0);
        overlayGraphics.beginFill(0x323e43);
        overlayGraphics.drawRect(0, 0, this.game.width, this.game.height);
        overlayGraphics.endFill();

        this.pauseOverlay = this.make.sprite(0, 0, overlayGraphics.generateTexture());
        this.pauseOverlay.alpha = 0.66;
        this.pauseMenu.add(this.pauseOverlay);

        if (!this.game.device.cordova) {

            this.continueButton = this.make.button(this.game.width*0.66, this.game.height/2, 'playInGameButton', this.continueGame, this, 'out', 'out', 'down', 'out');
            this.continueButton.anchor.setTo(0.5, 0.5);        
            this.pauseMenu.add(this.continueButton);        
            this.continueButton.inputEnabled = false;

            this.goMenuButton = this.make.button(this.game.width*0.33, this.game.height/2, 'mainMenuButton', this.goChoiceMenu, this, 'out', 'out', 'down', 'out');
            this.goMenuButton.anchor.setTo(0.5, 0.5);
            this.pauseMenu.add(this.goMenuButton);
            this.goMenuButton.inputEnabled = false;

        } else {
            this.continueButton = this.make.button(this.game.width*0.5, this.game.height/2, 'playInGameButton', this.continueGame, this, 'out', 'out', 'down', 'out');
            this.continueButton.anchor.setTo(0.5, 0.5);        
            this.pauseMenu.add(this.continueButton);        
            this.continueButton.inputEnabled = false;

            this.goMenuButton = this.make.button(this.game.width*0.2, this.game.height/2, 'mainMenuButton', this.goChoiceMenu, this, 'out', 'out', 'down', 'out');
            this.goMenuButton.anchor.setTo(0.5, 0.5);
            this.pauseMenu.add(this.goMenuButton);
            this.goMenuButton.inputEnabled = false;

            this.exitButton = this.make.button(this.game.width*0.8, this.game.height/2, 'exitButton', this.exitGame, this, 'out', 'out', 'down', 'out');
            this.exitButton.anchor.setTo(0.5, 0.5);
            this.pauseMenu.add(this.exitButton);
            this.exitButton.inputEnabled = false;
        }

        this.pauseMenu.alpha = 0;

        //level label

        this.levelLabelBack = this.add.sprite(this.game.width/2, 0, 'levelLabelBack');
        this.levelLabelBack.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
        this.levelLabelBack.anchor.setTo(0.5, 1);
        this.levelLabelBack.hideTween = this.game.add.tween(this.levelLabelBack).to({y: 0}, 500, "Linear", false);
        this.levelLabelBack.showTween = this.game.add.tween(this.levelLabelBack).to({y: this.game.height*0.07}, 500, "Linear", false);
        this.UIGroup.add(this.levelLabelBack);

        this.levelLabel = this.add.bitmapText(this.game.width/2, 0, 'basicFont', 'Level '+this.levelN, 28);
        this.levelLabel.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
        this.levelLabel.anchor.setTo(0.5, 1);
        this.levelLabel.tint = 0xef3f2b;
        this.levelLabel.hideTween = this.game.add.tween(this.levelLabel).to({y: 0}, 500, "Linear", false);
        this.levelLabel.showTween = this.game.add.tween(this.levelLabel).to({y: this.game.height*0.07}, 500, "Linear", false);
        this.UIGroup.add(this.levelLabel);

        //restart and pause buttons
        this.restartButton = this.add.button(-this.game.cache.getImage('replayButton').width, this.game.height*0.01, 'replayButton', this.replayLevel, this, 'out', 'out', 'down', 'out');
        this.restartButton.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
        //this.restartButton.alpha = 0;
        this.restartButton.hideTween = this.game.add.tween(this.restartButton).to({x: -this.restartButton.width}, 500, 'Linear', false);
        this.restartButton.showTween = this.game.add.tween(this.restartButton).to({x: this.game.width*0.01}, 500, 'Linear', false);
        this.UIGroup.add(this.restartButton);

        this.pauseButton = this.add.button(-this.game.cache.getImage('pauseButton').width, this.game.height*0.01 + this.restartButton.bottom, 'pauseButton', this.pauseGame, this, 'out', 'out', 'down', 'out');
        this.pauseButton.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
        //this.pauseButton.alpha = 0;
        this.pauseButton.hideTween = this.game.add.tween(this.pauseButton).to({x: -this.pauseButton.width}, 500, 'Linear', false);
        this.pauseButton.showTween = this.game.add.tween(this.pauseButton).to({x: this.game.width*0.01}, 500, 'Linear', false);
        this.UIGroup.add(this.pauseButton);

        this.muteButton = this.game.add.button(-this.game.cache.getImage('pauseButton').width, this.game.height*0.01 + this.pauseButton.bottom, 'muteButGame', this.muteMusic, this, 'onOut', 'onOut', 'onDown', 'onOut');
        this.muteButton.hideTween = this.game.add.tween(this.muteButton).to({x: -this.muteButton.width}, 500, 'Linear', false);
        this.muteButton.showTween = this.game.add.tween(this.muteButton).to({x: this.game.width*0.01}, 500, 'Linear', false);
        this.UIGroup.add(this.muteButton);
        if (this.sound.mute) {
            this.muteButton.setFrames('offOut', 'offOut', 'offDown', 'offOut');
        }
        
        this.game.input.onDown.add(this.hideUI, this);
        this.game.input.onUp.add(function(){
            this.showUICall = this.time.events.add(3000, this.showUI, this);
        }, this);
        this.UIshown = false;

        this.loadLevel();

        //this.topGroup = this.add.group();

        //this.topGroup.add(this.ball);
        //this.topGroup.add(this.ball.ballWallCollision);

        //this.input.mouse.mouseWheelCallback = this.manageZoom;

        /*var controlVertices = [new Phaser.Point(1, 1), new Phaser.Point(50, 1), new Phaser.Point(50, 10), new Phaser.Point(1, 10)];
        var shadowEdge = shadowProcessor.prepareShadowEdge(controlVertices);

        var lightSource = {position: new Phaser.Point(400, -600)};

        shadowProcessor.defineLightedSides(lightSource, shadowEdge);

        console.log(shadowEdge);*/

        //this.checkMoveTimer = this.time.events.add(30, this.setCheckTimer, this);
        
    },

    setCheckTimer: function() {
        moveProcessor.checkNeeded = true;
        this.checkMoveTimer = this.time.events.add(30, this.setCheckTimer, this);
    },

    update: function () {
        //this.ball.moveVel();
        this.ball.targetFound = false;
        
        if (!this.game.gameOnPause) {
            moveProcessor.checkMovePossibility();    
        }
        //console.log(this.game.bottomShadowGroup);
        /*if (audioPlayer.soundSources.length>0) {
            audioPlayer.updateSourcesVolume(this.game.currentBallCoord[0]);    
        }*/

        //this.game.debugGraphics.clear();
        
    },

    levelWin: function () {   
        if (this.winPopup.alpha === 0 && !this.ball.dead) {
            this.winPopup.alpha = 1;
            this.winRestartButton.inputEnabled = true;
            this.winNextLevelButton.inputEnabled = true;

            this.getOnGPButton.inputEnabled = true;
            this.getOnGPButton.alpha = 1;
            
            //if (this.winEmitterTL.exists) {
            this.winEmitterTL.start(false, 1000, 10, 20);    
            this.winEmitterTR.start(false, 1000, 10, 20); 
            this.winEmitterBL.start(false, 1000, 10, 20); 
            this.winEmitterBR.start(false, 1000, 10, 20); 
            /*} else {
                this.winEmitterTL.revive();
                this.winEmitterTL.x = this.winBack.left;
                this.winEmitterTL.y = this.winBack.top;
                this.winEmitterTL.makeParticles('winParticles', [0, 1, 2, 3], 50);
                this.winEmitterTL.minParticleSpeed.setTo(-200, -300);
                this.winEmitterTL.maxParticleSpeed.setTo(200, -500);
                this.winEmitterTL.angularDrag = 30;
                this.winEmitterTL.start(false, 800, 2, 50);    
            }*/
            //this.winEmitterTLRightTween.start();
            
            //this.gamePaused = true;
            this.beesSwarm.forEach(function(bee){
                moveProcessor.deleteObject(bee);
            }, this);                                                                                                                                                                                                                                                                                                                                                                                                                                         
            this.octopuses.children.forEach(function(octopus){
                moveProcessor.deleteObject(octopus);
            }, this);
            this.ball.inTeleport = true;
            this.ball.joystick.required = false;
            //make ball rolling to the portal center
            //console.log(currentPortal);
            this.ball.vel = new Phaser.Point((this.finish.x - this.ball.x)*0.3, (this.finish.y - this.ball.y)*0.3);
            audioPlayer.playOneTime('win');
        }        
    },

    levelLost: function() {
        if (this.lostPopup.alpha === 0) {
            this.lostPopup.alpha = 1;
            this.lostRestartButton.inputEnabled = true;
            this.getOnGPButton.alpha = 1;
            this.getOnGPButton.inputEnabled = true;
            //this.gamePaused = true;
            this.beesSwarm.forEach(function(bee){
                moveProcessor.deleteObject(bee);
            }, this);
            this.octopuses.children.forEach(function(octopus){
                moveProcessor.deleteObject(octopus);
            }, this);
            this.ball.inTeleport = true;
            this.triesNumber++;
            updateTimePlayed(this.game);
        }
    },

    getOnGP: function() {
        window.open("https://play.google.com/store/apps/details?id=com.kpded.hamsternikus", "_blank");
    },

    buildMap: function(map, mapId) {

        //console.log('start build map');
        var soundedObjects = [];
        
        this.game.gameWorld = map[0].world;

        switch (this.game.gameWorld) {
            case 'maze':
                var backgroundKey = 'backgroundMaze';
                break;
            case 'lab':
                var backgroundKey = 'backgroundLab';
                break;
            case 'brain':
                var backgroundKey = 'backgroundSpace';
                break;
        }
        
        this.drawingCanvas.loadTexture(backgroundKey);
        /*if (this.game.gameWorld==='lab') {
            this.darkOverlay = this.add.sprite(0, 0, 'labDark');
            this.darkOverlay.alpha = 0;
            this.setDarkOnTimer();
        }*/

        for (var i = -3; i<=0; i++) {
            var border = new WallSk(this.game, this.game.borderWalls[i].edges, i, this.game.gameWorld);
            border.build('noFill');
            //this.game.walls.push(border);
            this.game.wallsSG.add(border);    
        }        
        

        if (this.portals[mapId]) {
            //console.log('portal added');
            this.portals[mapId].forEach(function(portal){
                this.portalsSG.add(portal);
                this.ball.moveSignal.add(portal.checkPlayerInPortal, portal);
            }, this);            
        }

        //console.log(map);

        for (k in map) {

            if (map[k].type === 'movableSk') {

                //console.log('build movable');

                var wall = new MovableWallSk(this.game, map[k].edges, k, this.game.gameWorld);
                if (map[k].wallColor) {
                    wall.build(map[k].wallColor);    
                } else {
                    wall.build();
                }
                
                //this.game.walls.push(wall);    
                this.game.wallsSG.add(wall);

            } else if (map[k].type === 'immovableSk') {

                //console.log('build immovable');

                var wall = new WallSk(this.game, map[k].edges, k, this.game.gameWorld);
                if (map[k].wallColor) {
                    wall.build(map[k].wallColor);
                } else {
                    wall.build();
                }
                //this.game.walls.push(wall);            
                this.game.wallsSG.add(wall);

            } else if (map[k].type === 'interdimSk') {

                this.pasteInterdimWall(map[k].edges, k, this.game.gameWorld);

            } else if (map[k].type === 'start') {

                this.start = new Start(this.game, map[k].edges[0][0]/configuration.canvasWidth, map[k].edges[0][1]/configuration.canvasHeight);
                this.start.alpha = 0;

            } else if (map[k].type === 'finish') {

                //console.log('have finish in map');

                this.finish = new Finish(this.game, map[k].edges[0][0]/configuration.canvasWidth, map[k].edges[0][1]/configuration.canvasHeight);
                this.finishGroup.add(this.finish);
                this.ball.moveSignal.add(this.finish.checkPlayerIntersection, this.finish);
                this.finish.signal.add(function(status){
                    if (status==='in') {
                        this.levelWin(); 

                    }            
                }, this);

            } else if (map[k].type === 'bee') {

                var beesPos = map[k].edges;
                for (var p in beesPos) {
                    if (this.game.gameWorld != 'brain') {
                        var bee = new Bee(this.game, beesPos[p][0], beesPos[p][1], true);
                        soundedObjects.push(bee);
                    } else {
                        var bee = new Bee(this.game, beesPos[p][0], beesPos[p][1], false);    
                        soundedObjects.push(bee);
                    }
                    
                    this.beesSwarm.add(bee);
                    this.game.pushSignal.add(bee.updateTargetWalls, bee);

                    this.fans.children.forEach(function(fan){
                        //console.log('bee move signal added in bee');
                        bee.moveSignal.add(fan.checkFanZone, fan);
                    }, this);

                }

            } else if (map[k].type === 'worm') {

                //console.log('build worm');

                var holesPos = map[k].edges;
                var currentHoles = [];

                for (var p in holesPos) {
                    var hole = new WormHole(this.game, holesPos[p][0]/configuration.canvasWidth, holesPos[p][1]/configuration.canvasHeight);
                    this.wormHoles.add(hole);
                    currentHoles.push(hole);
                }

                var worm = new Worm(this.game, 1800);
                worm.assingHoles(currentHoles);
                //worm.defineTrajectories();
                worm.defineTweenDurations();
                worm.eatBallSignal.add(this.ballWormEaten, this);
                this.worms.add(worm);
                if (map[k].trigger) {

                    var trigger = new Trigger(this.game, map[k].trigger[0]/configuration.canvasWidth, map[k].trigger[1]/configuration.canvasHeight, 'wormTrigger');
                    this.ball.moveSignal.add(trigger.checkPlayerIntersection, trigger);
                    trigger.signal.add(worm.switch, worm);
                    worm.trigger = trigger;
                    this.triggers.add(trigger);
                }
                if (map[k].status === 'on') {
                    worm.switch('in');
                    if (trigger) {
                        trigger.frameName = 'down';
                    }                    
                }               

                //this.wormHoles = this.wormHoles.concat(currentHoles);

            } else if (map[k].type==='electrode') {

                var elecPos = map[k].edges;

                var electricArcsGroup = new ElectricArcsGroup(this.game, elecPos, 1);
                this.electricArcsGroups.add(electricArcsGroup);
                electricArcsGroup.shockSignal.add(this.ballShocked, this);
                this.ball.moveSignal.add(electricArcsGroup.shockPlayer, electricArcsGroup);
                this.game.pushSignal.add(electricArcsGroup.checkConnection, electricArcsGroup);
                electricArcsGroup.checkConnection();
                soundedObjects.push(electricArcsGroup);

                if (map[k].trigger) {

                    var trigger = new Trigger(this.game, map[k].trigger[0]/configuration.canvasWidth, map[k].trigger[1]/configuration.canvasHeight, 'electroButton');
                    this.ball.moveSignal.add(trigger.checkPlayerIntersection, trigger);
                    trigger.signal.add(electricArcsGroup.switch, electricArcsGroup);
                    electricArcsGroup.trigger = trigger;
                    this.triggers.add(trigger);
                }

                if (map[k].status === 'on') {
                    electricArcsGroup.switch('initial');
                    if (map[k].trigger) {
                        trigger.frameName = 'down';    
                    }                    
                }

                electricArcsGroup.electrodes.forEach(function(electrode){
                    this.electrodes.push(electrode);
                }, this);                
            
            } else if (map[k].type === 'octopus') {

                var ocpousPos = map[k].edges;

                var octopus = new Octopus(this.game, ocpousPos[0][0]/configuration.canvasWidth, ocpousPos[0][1]/configuration.canvasHeight);
                octopus.killPlayerSignal.add(this.octopusEaten, this);

                this.octopuses.add(octopus);
                //console.log('octopus added');
            
            } else if (map[k].type === 'fan') {

                var  fanPos = map[k].edges;
                if (map[k].angle) {
                    var fanAngle = map[k].angle;
                } else {
                    var fanAngle = 0;
                }

                var fan = new Fan(this.game, new Phaser.Point(fanPos[0][0]/configuration.canvasWidth*this.game.width, fanPos[0][1]/configuration.canvasHeight*this.game.height), fanAngle);
                this.ball.moveSignal.add(fan.checkFanZone, fan);
                //fan.signal.add(this.ball.applyAddSpeed, this.ball);
                this.fans.add(fan);
                soundedObjects.push(fan);

                if (map[k].trigger) {

                    //console.log('have trigger');

                    var trigger = new Trigger(this.game, map[k].trigger[0]/configuration.canvasWidth, map[k].trigger[1]/configuration.canvasHeight, 'fanTrigger');
                    this.ball.moveSignal.add(trigger.checkPlayerIntersection, trigger);
                    trigger.signal.add(fan.switch, fan);
                    fan.trigger = trigger;
                    this.triggers.add(trigger);
                }

                if (map[k].status == 'on') {
                    fan.switch('initial');
                    if (trigger) {
                        trigger.frameName = 'down';
                    }                    
                }

                this.beesSwarm.forEach(function(bee){
                    //console.log('bee move signal assigned');
                    bee.moveSignal.add(fan.checkFanZone, fan);
                    //fan.signal.add(bee.applyAddSpeed, bee);
                }, this);

            } else if (map[k].type === 'reverseTrigger') {

                var trigger = new Trigger(this.game, map[k].edges[0][0]/configuration.canvasWidth, map[k].edges[0][1]/configuration.canvasHeight, 'reverseTrigger');
                this.ball.moveSignal.add(trigger.checkPlayerIntersection, trigger);
                trigger.signal.add(this.reverseWalls, this);
                this.triggers.add(trigger);
            }
            
        }
        
        this.electricArcsGroups.children.forEach(function(electricArcGroup){
            electricArcGroup.checkConnection();
        }, this);

        this.drawTips(mapId);

        audioPlayer.switchBackground(this.game.gameWorld);
        audioPlayer.setSoundSources(soundedObjects);

        /*this.world.bringToTop(this.ball.blow);
        this.world.bringToTop(this.ball.ballWallCollision);        
        this.world.bringToTop(this.beesSwarm);
        this.world.bringToTop(this.game.topShadowGroup);
        this.world.bringToTop(this.UIGroup);

        this.world.bringToTop(this.winPopup);
        this.world.bringToTop(this.lostPopup);

        this.world.bringToTop(this.pauseMenu);*/

        this.showUI();
    },

    drawTips: function(mapId) {
        var levelMap = ''+this.levelN+mapId;
        switch (levelMap) {
            case '10':
                if (this.game.device.desktop) {
                    var tip = this.tipsSpriteGroup.create(this.game.width/2, this.game.height*2/3, 'tipLevel1');    
                } else {
                    var tip = this.tipsSpriteGroup.create(this.game.width/2, this.game.height*2/3, 'tipLevel1Finger');
                }
                
                tip.anchor.setTo(0.5, 0.3);
                tip.tint = '0xff2c8d';
                var arrowSpriteData = tipArrowGenerator.generateArrow(this.game, [new Phaser.Point(this.game.width*0.2, this.game.height*0.48), 
                    new Phaser.Point(this.game.width*0.8, this.game.height*0.48)], false);

                var arrowSprite = this.tipsSpriteGroup.create(arrowSpriteData.left, arrowSpriteData.top, arrowSpriteData.name);
                break;
            case '30':
                if (this.game.device.desktop) {
                    var tip = this.tipsSpriteGroup.create(this.game.width*0.6, this.game.height*0.7, 'tipLevel3');    
                } else {
                    var tip = this.tipsSpriteGroup.create(this.game.width*0.6, this.game.height*0.6, 'tipLevel3Finger');
                }
                
                tip.anchor.setTo(0.5, 0.5);
                tip.tint = '0xff2c8d';

                var arrowSpriteData1 = tipArrowGenerator.generateArrow(this.game, [new Phaser.Point(0.1*this.game.width, 0.625*this.game.height),
                    new Phaser.Point(0.34*this.game.width, 0.94*this.game.height), new Phaser.Point(0.48*this.game.width, 0.94*this.game.height),
                    new Phaser.Point(0.48*this.game.width, 0.7*this.game.height)], false);
                var arrowSprite1 = this.tipsSpriteGroup.create(arrowSpriteData1.left, arrowSpriteData1.top, arrowSpriteData1.name);

                var arrowSpriteData2 = tipArrowGenerator.generateArrow(this.game, [new Phaser.Point(0.48*this.game.width, 0.58*this.game.height), 
                    new Phaser.Point(0.48*this.game.width, 0.2*this.game.height)], true);
                var arrowSprite2 = this.tipsSpriteGroup.create(arrowSpriteData2.left, arrowSpriteData2.top, arrowSpriteData2.name);
                break;
            case '331':
                var tip = this.tipsSpriteGroup.create(this.game.width*0.5, this.game.height*0.08, 'tipLevel31');
                tip.anchor.setTo(0.5, 0);
                tip.tint = '0xff2c8d';

                var arrowSpriteData = tipArrowGenerator.generateArrow(this.game, [new Phaser.Point(this.game.width*0.2, this.game.height*0.48), 
                    new Phaser.Point(this.game.width*0.8, this.game.height*0.48)], false);

                var arrowSprite = this.tipsSpriteGroup.create(arrowSpriteData.left, arrowSpriteData.top, arrowSpriteData.name);
                break;
            case '431':
                var tip = this.tipsSpriteGroup.create(this.game.width*0.1, this.game.height*0.1, 'tipLevel39');
                //tip.anchor.setTo(0.5, 0.5);
                tip.tint = '0xff2c8d';

                var arrowSpriteData1 = tipArrowGenerator.generateArrow(this.game, [new Phaser.Point(0.51*this.game.width, 0.53*this.game.height),
                    new Phaser.Point(0.58*this.game.width, 0.08*this.game.height)], true);
                var arrowSprite1 = this.tipsSpriteGroup.create(arrowSpriteData1.left, arrowSpriteData1.top, arrowSpriteData1.name);

                var arrowSpriteData2 = tipArrowGenerator.generateArrow(this.game, [new Phaser.Point(0.67*this.game.width, 0.11*this.game.height), 
                    new Phaser.Point(0.78*this.game.width, 0.42*this.game.height), new Phaser.Point(0.78*this.game.width, 0.7*this.game.height),
                    new Phaser.Point(0.55*this.game.width, 0.89*this.game.height), new Phaser.Point(0.17*this.game.width, 0.9*this.game.height)], false);
                var arrowSprite2 = this.tipsSpriteGroup.create(arrowSpriteData2.left, arrowSpriteData2.top, arrowSpriteData2.name);
                break;
            case '531':
                var tip = this.tipsSpriteGroup.create(this.game.width*0.2, this.game.height*0.05, 'tipLevel50');
                //tip.anchor.setTo(0.5, 0.5);
                tip.tint = '0xff2c8d';

                var arrowSpriteData1 = tipArrowGenerator.generateArrow(this.game, [new Phaser.Point(0.08*this.game.width, 0.58*this.game.height),
                    new Phaser.Point(0.16*this.game.width, 0.67*this.game.height), new Phaser.Point(0.21*this.game.width, 0.69*this.game.height)], false);
                var arrowSprite1 = this.tipsSpriteGroup.create(arrowSpriteData1.left, arrowSpriteData1.top, arrowSpriteData1.name);

                var arrowSpriteData2 = tipArrowGenerator.generateArrow(this.game, [new Phaser.Point(0.47*this.game.width, 0.53*this.game.height), 
                    new Phaser.Point(0.47*this.game.width, 0.19*this.game.height)], true);
                var arrowSprite2 = this.tipsSpriteGroup.create(arrowSpriteData2.left, arrowSpriteData2.top, arrowSpriteData2.name);

                var arrowSpriteData3 = tipArrowGenerator.generateArrow(this.game, [new Phaser.Point(0.45*this.game.width, 0.46*this.game.height), 
                    new Phaser.Point(0.4*this.game.width, 0.52*this.game.height), new Phaser.Point(0.35*this.game.width, 0.63*this.game.height)], false);
                var arrowSprite3 = this.tipsSpriteGroup.create(arrowSpriteData3.left, arrowSpriteData3.top, arrowSpriteData3.name);

                var arrowSpriteData4 = tipArrowGenerator.generateArrow(this.game, [new Phaser.Point(0.58*this.game.width, 0.8*this.game.height), 
                    new Phaser.Point(0.84*this.game.width, 0.8*this.game.height)], true);
                var arrowSprite4 = this.tipsSpriteGroup.create(arrowSpriteData4.left, arrowSpriteData4.top, arrowSpriteData4.name);
                break;
        };
    },

    clearMap: function() {

        //console.log('clear map called');

        audioPlayer.clearSoundSources();

        this.game.effectsSprtites.forEach(function(sprite){
            sprite.destroy();
        }, this);
        this.game.effectsSprtites = [];

        this.beesSwarm.forEach(function(bee){
            this.ball.moveSignal.remove(bee.sting, bee);
            this.game.pushSignal.remove(bee.updateTargetWalls, bee);
            bee.moveSignal.removeAll();
            bee.shadows.forEach(function(shadow){
                shadow.destroy();
            }, this);
            bee.shadows = [];
        }, this);   
        this.beesSwarm.removeAll(true);

        /*this.wormHoles.children.forEach(function(hole){
            hole.destroy();
        }, this);*/
        this.wormHoles.removeAll(true);

        this.worms.children.slice().forEach(function(worm) {
            this.time.events.remove(worm.wormCall);
            worm.eatBallSignal.removeAll();
            worm.sections.forEach(function(section){
                /*section.shadows.forEach(function(shadow){
                    shadow.destroy();
                }, this);
                section.shadows = [];*/                
            }, this);
            worm.destroy();
        }, this);        
        this.worms.removeAll(true);       

        this.electricArcsGroups.children.slice().forEach(function(arcGroup){
            arcGroup.disposeTimedEvents();
            this.ball.moveSignal.remove(arcGroup.shockPlayer, arcGroup);
            this.game.pushSignal.remove(arcGroup.checkConnection, arcGroup);
            arcGroup.shockSignal.removeAll();
            arcGroup.destroy();
        }, this);
        this.electricArcsGroups.removeAll(true);

        this.electrodes.slice().forEach(function(electrode){
            electrode.shadows.forEach(function(shadow){
                shadow.destroy();
            }, this);
            electrode.shadows = [];
            electrode.discharge.destroy();
            electrode.destroy();
        }, this);
        
        this.electrodes=[];

        this.triggers.forEach(function(trigger){
            if (trigger.shadows) {
                trigger.shadows.forEach(function(shadow){
                    shadow.destroy();
                }, this);
                trigger.shadows = [];
            }
            this.ball.moveSignal.remove(trigger.checkPlayerIntersection, trigger);
            trigger.signal.removeAll();
        }, this);
        this.triggers.removeAll();

        this.octopuses.forEach(function(octopus){
            octopus.killPlayerSignal.remove(this.octopusEaten, this);
            octopus.destroy();
        }, this);
        this.octopuses.removeAll(true);

        this.fans.children.slice().forEach(function(fan){
            this.ball.moveSignal.remove(fan.checkFanZone, fan);
            fan.signal.removeAll();
            fan.shadows.forEach(function(shadow){
                shadow.destroy();                
            }, this);
            fan.shadows = [];
            fan.destroy();
        }, this);
        this.fans.removeAll(true);

        if (this.start) {
            this.start.destroy();
            this.start = null;
        };

        if (this.finish) {
            this.ball.moveSignal.remove(this.finish.checkPlayerIntersection, this.finish);
            this.finish.signal.removeAll();
            this.finish.destroy();
            this.finish = null;
            this.finishGroup.removeAll();
        };
        
        //var wallsCopy = this.game.wallsSG.children.slice();
        for (var w in this.game.wallsSG.children){

            for (var e in this.game.wallsSG.children[w].edges) {

                var edge = this.game.wallsSG.children[w].edges[e];

                edge.shadows.forEach(function(shadow){
                    shadow.destroy();
                }, this);

                /*if (edge.stroke) {
                    edge.stroke.destroy();    
                }

                if (edge.emitter) {
                    edge.emitter.destroy();    
                }*/
                
            }

            if (this.game.wallsSG.children[w].moveAnimationSprite) {
                this.game.wallsSG.children[w].moveAnimationSprite.destroy();
            }
            if (this.game.wallsSG.children[w].touchAnimation) {
                this.game.wallsSG.children[w].touchAnimation.destroy();
            }
            if (this.game.wallsSG.children[w].__proto__.constructor === InterdimWallSk) {
                this.game.wallsSG.children[w].edges.forEach(function(edge){
                    this.game.time.events.remove(edge.blinkCall);
                }, this);                
            }          

            //wallsCopy[w].destroy();
        }
        this.game.wallsSG.removeAll(true);
        //this.game.walls = [];

        /*if (this.portals[this.currentMapId]) {
            console.log('portal deleted');
            this.world.remove(this.portals[this.currentMapId]);
            this.ball.moveSignal.remove(this.portals[this.currentMapId].checkPlayerInPortal, this.portals[this.currentMapId]);
        }*/
        if (this.portalsSG.children.length > 0) {
            //console.log('portal removed');
            this.portalsSG.forEach(function(portal){
                this.ball.moveSignal.remove(portal.checkPlayerInPortal, portal);
            }, this);
            this.portalsSG.removeAll();    
        }

        //clear all shadows
        this.game.bottomShadowGroup.removeAll();
        if (this.game.topShadowGroup) {
            this.game.topShadowGroup.removeAll();    
        }        
        //clear tips
        this.tipsSpriteGroup.removeAll();
        
    },

    saveMap: function() {

        var mapToSave = {};
        mapToSave[0] = {'type': 'background', 'world': this.game.gameWorld};
        var wallNumber = 1;

        //console.log(this.game.walls);

        this.game.wallsSG.children.forEach(function(wall){

            if (wall.__proto__.constructor === MovableWallSk) {
                mapToSave[wallNumber] = {'type': 'movableSk', 'edges': [], 'wallColor': wall.fillColor};
                //console.log('movable');
            } else if (wall.__proto__.constructor === WallSk){
                mapToSave[wallNumber] = {'type': 'immovableSk', 'edges': [], 'wallColor': wall.fillColor};
                //console.log('immovable');
                //console.log((wall.__proto__.constructor === WallSk));
                //console.log(wall);
            }

            if (mapToSave[wallNumber]) {

                var wallVertices = []

                for (var e in wall.edges) {
                    var edgeVertices = [];
                    wall.edges[e].vertices.forEach(function(vertex){
                        edgeVertices.push([vertex.x/this.game.width*configuration.canvasWidth, vertex.y/this.game.height*configuration.canvasHeight]);
                    }, this);
                    wallVertices.push(edgeVertices);
                }

                if (wallVertices.equals(this.game.borderWalls[0].edges) || wallVertices.equals(this.game.borderWalls[-1].edges) || wallVertices.equals(this.game.borderWalls[-2].edges) ||
                    wallVertices.equals(this.game.borderWalls[-3].edges)) {

                    delete mapToSave[wallNumber];

                } else {
                    //console.log(wallVertices);
                    //console.log(this.borderWalls[0].edges);
                    mapToSave[wallNumber].edges = wallVertices;                        

                    //console.log('save wall');

                    //console.log(mapToSave[wallNumber]);

                    //console.log(wall);

                    //console.log((wall.__proto__.constructor === WallSk));

                    wallNumber++;
                }                  
            }            
            
        }, this);

        if (this.beesSwarm.length>0) {

            mapToSave[wallNumber] = {"type": 'bee', "edges": []};
            this.beesSwarm.forEach(function(bee){
                mapToSave[wallNumber].edges.push([bee.position.x/this.game.width*configuration.canvasWidth, 
                    bee.position.y/this.game.height*configuration.canvasHeight]);
            }, this);
            wallNumber++;
        }        

        if (this.wormHoles.children.length>0) {

            /*var wormHolesCopy = this.wormHoles.slice();

            while (wormHolesCopy.length>0) {
                mapToSave[wallNumber] = {"type": 'worm', "edges": [], "status": 'on'};
                var firstHole = wormHolesCopy.pop();
                mapToSave[wallNumber].edges.push([firstHole.position.x*configuration.canvasWidth/this.game.width, 
                    firstHole.position.y*configuration.canvasHeight/this.game.height]);
                var secondHole = wormHolesCopy.pop();
                mapToSave[wallNumber].edges.push([secondHole.position.x*configuration.canvasWidth/this.game.width, 
                    secondHole.position.y*configuration.canvasHeight/this.game.height]);

                if (!firstHole.worm.turnedOn) {
                    mapToSave[wallNumber].status = 'off';
                }

                if (firstHole.worm.trigger) {

                    var triggerPos = firstHole.worm.trigger.position.clone();
                    mapToSave[wallNumber]['trigger'] = [triggerPos.x*configuration.canvasWidth/this.game.width, 
                        triggerPos.y*configuration.canvasHeight/this.game.height];
                }                               

                wallNumber++;
            }*/

            for (var w in this.worms.children) {
                mapToSave[wallNumber] = {"type": 'worm', 'edges': [], "status": 'on'};
                this.worms.children[w].holes.forEach(function(hole){
                    mapToSave[wallNumber].edges.push([hole.x*configuration.canvasWidth/this.game.width,
                        hole.y*configuration.canvasHeight/this.game.height]);
                }, this);
                wallNumber++;
            }
        }

        if (this.electrodes.length>0) {

            this.electricArcsGroups.children.forEach(function(arcGroup){
                mapToSave[wallNumber] = {"type": 'electrode', 'edges': [], 'status': 'on'};
                mapToSave[wallNumber].edges = mapToSave[wallNumber].edges.concat(arcGroup.electrodesPos);

                if (!arcGroup.turnedOn) {
                    mapToSave[wallNumber].status = 'off';
                }

                if (arcGroup.trigger) {

                    mapToSave[wallNumber]['trigger'] = [arcGroup.trigger.position.x/this.game.width*configuration.canvasWidth, 
                    arcGroup.trigger.position.y/this.game.height*configuration.canvasHeight];
                }

                wallNumber++;

            }, this);
        }                

        this.octopuses.children.forEach(function(octopus){

            mapToSave[wallNumber] = {"type": 'octopus', 'edges': []};

            mapToSave[wallNumber].edges.push([octopus.position.x/this.game.width*configuration.canvasWidth, 
                octopus.position.y/this.game.height*configuration.canvasHeight]);

            wallNumber++;

        }, this);

        this.fans.children.forEach(function(fan){
            mapToSave[wallNumber] = {"type": 'fan', 'edges': [], 'status': 'on', 'angle': fan.rotation+Math.PI/2};

            mapToSave[wallNumber].edges.push([fan.position.x/this.game.width*configuration.canvasWidth,
                 fan.position.y/this.game.height*configuration.canvasHeight]);

            if (!fan.turnedOn) {
                mapToSave[wallNumber].status = 'off';
            }

            if (fan.trigger) {
                mapToSave[wallNumber].trigger = [fan.trigger.position.x/this.game.width*configuration.canvasWidth, 
                    fan.trigger.position.y/this.game.height*configuration.canvasHeight];
            }

            wallNumber++;

        }, this);

        this.triggers.forEach(function(trigger){
            if (trigger.key === 'reverseTrigger') {
                mapToSave[wallNumber] = {"type": "reverseTrigger", 'edges': []};

                mapToSave[wallNumber].edges.push([trigger.position.x/this.game.width*configuration.canvasWidth,
                 trigger.position.y/this.game.height*configuration.canvasHeight]);

                wallNumber++;

            }
        }, this);

        if (this.start) {

            mapToSave[wallNumber] = {"type": 'start', 'edges': []};

            mapToSave[wallNumber].edges.push([this.start.position.x/this.game.width*configuration.canvasWidth, 
                this.start.position.y/this.game.height*configuration.canvasHeight]);

            wallNumber++;

        };

        if (this.finish) {

            //console.log('finish saved');

            mapToSave[wallNumber] = {"type": 'finish', 'edges': []};

            mapToSave[wallNumber].edges.push([this.finish.position.x/this.game.width*configuration.canvasWidth, 
                this.finish.position.y/this.game.height*configuration.canvasHeight]);

            wallNumber++;

        };

        return mapToSave;
    },

    loadLevel: function() {

        
        this.clearMap();

        //clear up current level
        moveProcessor.cleanObjects();
        wallsPicker.reset();
        portalSystem.clearPortals();     
        lightningAnimation.clearCanvasArray();
        shadowGenerator.clearShadows();
        wallMoveGenerator.clearAnimations();
        wallTextures.clearTextures();
        tipArrowGenerator.clearTextures();
        movableLabGenerator.clearBitmapDataArray(this.game);

        var portalsCopy = Object.assign(this.portals);

        for (var m in portalsCopy) {
            portalsCopy[m].forEach(function(portal){
                this.ball.moveSignal.remove(portal.checkPlayerInPortal, portal);
                portal.destroy();
            }, this);            
        }
        this.portals = {};
        
        //place new

        this.levelName = 'level'+this.levelN;
        this.maps = this.cache.getJSON(this.levelName).slice();
        //Object.assign(this.maps, this.cache.getJSON(this.levelName));

        //find and gather all the portals for portal system and determine background
        for (var m in this.maps) {
            for (var w in this.maps[m]) {
                //console.log(this.maps[m][w].type);
                if (this.maps[m][w].type === "portal") {
                    //in case of no portals in this map
                    if (!this.portals[m]) {
                        this.portals[m] = [];
                    }
                    var portal = new Portal(this.game, this.maps[m][w].edges[0][0]/configuration.canvasWidth, this.maps[m][w].edges[0][1]/configuration.canvasHeight, 
                        this.maps[m][w].color, m);
                    portal.inPortalSignal.add(this.ball.runOnTeleport, this.ball);
                    portal.outPortalSignal.add(this.ball.runOutTeleport, this.ball);
                    this.ball.teleportTimer.teleportSignal.add(portalSystem.teleportPlayer, portalSystem);
                    portalSystem.addPortal(portal, this.maps[m][w].color, m);

                    portalSystem.teleportSignal.add(this.teleportPlayer, this);
                    this.portals[m].push(portal);
                }

            }            
        }

        this.currentMapId = 0;

        this.buildMap(this.maps[0], this.currentMapId);
        // console.log(this.maps[0]);
        // console.log(this.cache.getJSON(this.levelName));
        
        this.ball.position.setTo(this.start.x, this.start.y);
        this.ball.resurrect();
        this.assingBeesSignals();
        // assign shadows to the ball
        this.addShadowsToBall();

        this.addAllToMoveProcessor();        

        /*this.world.bringToTop(this.ball.ballWallCollision);
        this.world.bringToTop(this.ball.blow);
        this.world.bringToTop(this.beesSwarm);
        this.world.bringToTop(this.game.topShadowGroup);
        this.world.bringToTop(this.UIGroup);

        this.world.bringToTop(this.winPopup);
        this.world.bringToTop(this.lostPopup);

        this.world.bringToTop(this.pauseMenu);*/

        if (this.levelLabel) {

            this.levelLabel.text = 'Level '+this.levelN;              

        }
    },

    showUI: function() {
        //console.log('show ui called');
        if (!this.UIshown) {

            this.pauseButton.showTween.start();
            this.restartButton.showTween.start();
            this.levelLabel.showTween.start();
            this.levelLabelBack.showTween.start();
            this.muteButton.showTween.start();
            this.UIshown = true;
        }
        
        
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

    hideUI: function() {
        //console.log('hide ui called');
        if (this.UIshown) {

            this.pauseButton.hideTween.start();
            this.restartButton.hideTween.start();
            this.levelLabel.hideTween.start();
            this.levelLabelBack.hideTween.start();
            this.muteButton.hideTween.start();
            this.UIshown = false;
        }
        
        if (this.showUICall) {
            this.time.events.remove(this.showUICall);
        }
    },

    addShadowsToBall: function() {
        var shadowImageName1 = shadowGenerator.generateSphereShadow(this.game, new Phaser.Point(configuration.canvasWidth/2, configuration.canvasHeight/2), 
            this.ball.interactionRadius/configuration.scaleRatio, this.game.lightSources[0]);
        /*var shadowImageName2 = shadowGenerator.generateSphereShadow(this.game, new Phaser.Point(configuration.canvasWidth/2, configuration.canvasHeight/2), 
            this.ball.interactionRadius/configuration.scaleRatio, this.game.lightSources[1]);    */

        /*console.log(this.game.cache.getImage(shadowImageName1).width);
        console.log(this.game.cache.getImage(shadowImageName2).width);*/

        var shadow1 = this.game.add.sprite(this.ball.centerX, this.ball.centerY, shadowImageName1);
        shadow1.anchor.setTo(0.5, 0.5);
        this.ball.assignShadow(shadow1);

        /*var shadow2 = this.game.add.sprite(this.ball.centerX, this.ball.centerY, shadowImageName2);
        shadow2.anchor.setTo(0.5, 0.5);
        this.ball.assignShadow(shadow2);*/
    },

    readInterdimWall: function() {
        var interdimEdges = [];

        for (var w in this.game.wallsSG.children) {
            var wall = this.game.wallsSG.children[w];

            if (wall.__proto__.constructor===InterdimWallSk) {

                var wallVertices = [];

                for (var e in wall.edges) {
                    var edgeVertices = [];
                    wall.edges[e].vertices.forEach(function(vertex){
                        edgeVertices.push([vertex.x/this.game.width*configuration.canvasWidth, vertex.y/this.game.height*configuration.canvasHeight]);
                    }, this);
                    wallVertices.push(edgeVertices);
                }

                interdimEdges.push(wallVertices);
            }            
        }

        return interdimEdges;
    },

    pasteInterdimWall: function(edges, wallId, gameWorld) {
        //console.log('build interdim');
        var wall = new InterdimWallSk(this.game, edges, wallId, gameWorld);
        wall.build();
                
        //this.game.walls.push(wall);
        this.game.wallsSG.add(wall);
    },

    reverseWalls: function(status) {
        if (status === 'in' && !this.inReversion ) {
            this.inReversion = true;
            var wallsCopy = this.game.wallsSG.children.slice();
            var wallsDescription = {};

            // assign tint tweens

            for (var w in wallsCopy) {
                var wall = wallsCopy[w];                
                if (wall.id != 0 && wall.__proto__.constructor!=InterdimWallSk) {
                    for (var e in wall.edges) {
                        tweenTint(this.game, wall.edges[e], 0xffffff, 0x000000, 200);
                    }    
                }
                
            }

            // create timed delete all walls but border routine

            this.game.time.events.add(190, function() {


                for (var w in wallsCopy){

                    //put wall in description

                    var wall = wallsCopy[w];
                    var wallNumber = wall.id;

                    //we desribe all but the border

                    if (wallNumber > 0 ) {

                        if (wall.__proto__.constructor === MovableWallSk) {
                            wallsDescription[wallNumber] = {'type': 'movableSk', 'edges': []};
                        } else  if (wall.__proto__.constructor === WallSk){
                            wallsDescription[wallNumber] = {'type': 'immovableSk', 'edges': []};
                        } else if (wall.__proto__.constructor === InterdimWallSk){
                            wallsDescription[wallNumber] = {'type': 'interdimSk', 'edges': []};
                        }
                            
                        var wallVertices = [];

                        for (var e in wall.edges) {
                            var edgeVertices = [];
                            wall.edges[e].vertices.forEach(function(vertex){
                                edgeVertices.push([vertex.x/this.game.width*configuration.canvasWidth, vertex.y/this.game.height*configuration.canvasHeight]);
                            }, this);
                            wallVertices.push(edgeVertices);
                        }

                        wallsDescription[wallNumber].edges = wallVertices;

                        //delete the wall's edges and wall   

                        for (var e in wall.edges) {

                            var edge = wall.edges[e];

                            edge.shadows.forEach(function(shadow){
                                shadow.destroy();
                            }, this);
                        }

                        this.game.effectsSprtites.forEach(function(sprite){
                            sprite.destroy();
                        }, this);
                        this.game.effectsSprtites = [];

                        if (wall.moveAnimationSprite) {
                            wall.moveAnimationSprite.destroy();
                        }       
                        if (wallsCopy[w].__proto__.constructor === InterdimWallSk) {
                            wallsCopy[w].edges.forEach(function(edge){
                                this.game.time.events.remove(edge.blinkCall);
                            }, this);                
                        }              
                        wall.destroy();

                        }         
                    }

                //delete all but border

                //this.game.walls = this.game.walls.slice(0, 1);
                this.game.wallsSG.removeBetween(4, null, true);

                //var reverseDescription = {};

                for (var w in wallsDescription) {

                    switch (wallsDescription[w].type) {
                        case 'immovableSk':
                            //reverseDescription[w] = {"type": "movableSk", "edges": wallsDescription[w].edges};
                            var wall = new MovableWallSk(this.game, wallsDescription[w].edges, w, this.game.gameWorld);
                            wall.build();
                                
                            //this.game.walls.push(wall);
                            this.game.wallsSG.add(wall);
                            break;
                        case 'movableSk':
                            //reverseDescription[w] = {"type": "immovableSk", "edges": wallsDescription[w].edges};
                            var wall = new WallSk(this.game, wallsDescription[w].edges, w, this.game.gameWorld);
                            wall.build();
                                
                            //this.game.walls.push(wall);
                            this.game.wallsSG.add(wall);
                            break;
                        case 'interdimSk':
                            //reverseDescription[w] = {"type": "interdimSk", "edges": wallsDescription[w].edges};
                            this.pasteInterdimWall(wallsDescription[w].edges, w, this.game.gameWorld);
                            break;
                        }
                }

                /*for (var w in this.game.walls) {
                    var wall = this.game.walls[w];
                    if (wall.id != 0) {
                        for (var e in wall.edges) {                            
                            var backTween = tweenTint(this.game, wall.edges[e], 0x000000, 0xffffff, 200);
                            backTween.onComplete.add(function(){
                                //wall.edges[e].tint = 0xffffff;
                                if (this.inReverseTween) this.inReverseTween = false;
                            }, this);
                        }    
                    }
                    
                }*/

                moveProcessor.cleanObjects();
                this.addAllToMoveProcessor();

                var ballTarget = this.ball.findTargetWall();
                this.ball.rightTarget = ballTarget[0];
                this.ball.leftTarget = ballTarget[1];
                this.ball.centerTarget = ballTarget[2];

                /*this.world.bringToTop(this.ball);
                this.world.bringToTop(this.ball.ballWallCollision);
                this.world.bringToTop(this.ball.blow);
                this.world.bringToTop(this.beesSwarm);
                this.world.bringToTop(this.game.topShadowGroup);
                this.world.bringToTop(this.UIGroup);

                this.world.bringToTop(this.winPopup);
                this.world.bringToTop(this.lostPopup);

                this.world.bringToTop(this.pauseMenu);*/

                
            }, this);

        } else if (status==='out') {

            this.inReversion = false;

        }
            
    },

    assingBeesSignals: function() {      
        this.beesSwarm.forEach(function(bee){
            //this.ball.moveSignal.add(bee.sting, bee);
            bee.killPlayerSignal.add(this.ballSting, this);
        }, this);
    },

    teleportPlayer: function(mapId, ballPos, currentPortal, color) {

        if (!this.ball.dead) {

            audioPlayer.playOneTime('teleport');
            this.ball.alpha = 0;
            this.ball.shadows.forEach(function(shadow){
                shadow.alpha = 0;
            }, this);
            this.ball.inTeleport = true; 
            this.ball.attractionPoint = null;              
            this.ball.teleportHam.position.set(this.ball.x, this.ball.y);
            this.ball.teleportHam.alpha = 1;
            this.ball.teleportHam.teleAnim.play(20, false);
            //make ball rolling to the portal center
            //console.log(currentPortal);
            this.ball.vel = new Phaser.Point((currentPortal.x - this.ball.x)*0.5, (currentPortal.y - this.ball.y)*0.5);
            this.ball.teleportHam.rotation = Math.atan2(this.ball.vel.y, this.ball.vel.x);
            this.ball.teleportHam.teleAnim.onComplete.addOnce(function(){

                if (!this.ball.dead) {

                    this.game.effectsSprtites.forEach(function(sprite){
                        sprite.destroy();
                    }, this);
                    this.game.effectsSprtites = [];

                    this.game.fanCurles.removeAll(true);

                    switch (color) {
                        case 'orange':                        
                            this.teleportScreen.tint = 0xff8c1d;            
                            break;
                        case 'yellow':                        
                            this.teleportScreen.tint = 0xfff40c;
                            break;
                        case 'blue':
                            this.teleportScreen.tint = 0x2f81ff;
                            break;
                        case 'green':
                            this.teleportScreen.tint = 0x53ff2c;
                            break;
                        case 'red':
                            this.teleportScreen.tint = 0xf53131;
                            break;
                        case 'purple':
                            this.teleportScreen.tint = 0xff17fb;
                            break;
                    }

                    this.teleportScreenAlphaTweenUp.start();
                    this.world.bringToTop(this.teleportScreen);
                    this.teleportScreenAnimation.play();
                    this.teleportScreenAnimation.onComplete.addOnce(function(){
                        //console.log(this.teleportScreen.alpha);
                        this.teleportScreenAlphaTweenDown.start();

                        moveProcessor.cleanObjects();
                        wallsPicker.reset();

                        this.maps[this.currentMapId] = this.saveMap();
                        var interdimEdges = this.readInterdimWall();
                        this.clearMap();
                        this.currentMapId = mapId;
                        this.buildMap(this.maps[this.currentMapId], this.currentMapId);
                        this.ball.position.set(ballPos.x, ballPos.y);
                        interdimEdges.forEach(function(edges){
                            this.pasteInterdimWall(edges, this.game.wallsSG.children.length, this.game.gameWorld);
                        }, this);

                        this.assingBeesSignals();

                        this.addAllToMoveProcessor();

                        //check connection of electric arcs after interdim walls were added

                        this.electricArcsGroups.children.forEach(function(electricArcGroup){
                            electricArcGroup.checkConnection();
                        }, this);
                        
                        this.ball.shadows = [];

                        this.addShadowsToBall();
                        //console.log(this.ball.shadows.length);

                        /*this.world.bringToTop(this.ball);
                        this.world.bringToTop(this.ball.ballWallCollision);
                        this.world.bringToTop(this.ball.blow);
                        this.world.bringToTop(this.beesSwarm);
                        this.world.bringToTop(this.game.topShadowGroup);
                        this.world.bringToTop(this.UIGroup);

                        this.world.bringToTop(this.winPopup);
                        this.world.bringToTop(this.lostPopup);

                        this.world.bringToTop(this.pauseMenu);*/
                        this.ball.teleportHam.alpha = 0;
                        this.ball.alpha = 1;
                        this.ball.inTeleport = false;
                    }, this);

                }
                
            }, this);    
        }    
    },

    addAllToMoveProcessor: function() {
        var immovableWalls = [];
        if (this.ball) {
            moveProcessor.addObject(this.ball);
        }

        this.octopuses.children.forEach(function(octopus) {
            moveProcessor.addObject(octopus);
            //console.log(moveProcessor.objects);
        }, this);

        if (this.beesSwarm.length > 0) {
            for (var bee in this.beesSwarm.children) {
                moveProcessor.addObject(this.beesSwarm.children[bee]);
                //console.log(moveProcessor.objects);
            }    
        }

        for (var wall in this.game.wallsSG.children) {
            if (this.game.wallsSG.children[wall].pushable) {
                moveProcessor.addObject(this.game.wallsSG.children[wall]);    
            } else {
                immovableWalls.push(this.game.wallsSG.children[wall]);
            }            
        }
        //moveProcessor.objects = moveProcessor.objects.concat(immovableWalls);

         this.wormHoles.children.forEach(function(hole){
            moveProcessor.addObject(hole);
        }, this);

        this.electrodes.forEach(function(electrode){
            moveProcessor.addObject(electrode);
        }, this);

        for (var imWall in immovableWalls) {
            moveProcessor.addObject(immovableWalls[imWall]);
        }
        
        
        //console.log(moveProcessor.objects);
    },

    goNextLevel: function() {
        if (this.levelN<=100) { 
        //console.log(moveProcessor.objects);
            this.levelN ++;
            this.game.levelNum ++;
            //console.log(this.levelN);
            //console.log(this.game.lockedLevel);
            if (this.levelN === Number(this.game.lockedLevel) && this.levelN<101) {
                this.game.lockedLevel = Number(this.game.lockedLevel) + 1;
                localStorage.setItem('lockedLevel', this.game.lockedLevel);       
                //console.log(this.game.lockedLevel);
            }            
            if (this.game.levelNum === 12) {
                this.detachMouseEvents();
                this.state.start('StoryScenes');
            } else if (this.game.levelNum === 57) {
                this.detachMouseEvents();
                this.state.start('StoryScenes');
            } else if (this.game.levelNum === 101) {
                this.detachMouseEvents();
                this.state.start('StoryScenes');
            }
            if (this.levelN<101) {
                this.loadLevel();
                this.game.gameOnPause = false;
                this.winPopup.alpha = 0;
                this.winRestartButton.inputEnabled = false;
                this.winNextLevelButton.inputEnabled = false;
                this.getOnGPButton.alpha = 0;
                this.getOnGPButton.inputEnabled = false;
            }
        } else {
            if (!this.finLabel) {
                this.finLabel = this.add.sprite(this.game.width/2, this.game.height/2, 'finLabel');
                this.finLabel.anchor.setTo(0.5, 0.5);
            }
        }
    },

    replayLevel: function() {
        this.loadLevel();
        this.game.gameOnPause = false;
        if (this.lostPopup.alpha > 0) {
            this.lostPopup.alpha = 0;
            this.lostRestartButton.inputEnabled = false;            
        }
        if (this.winPopup.alpha > 0) {
            this.winPopup.alpha = 0;
            this.winRestartButton.inputEnabled = false;
            this.winNextLevelButton.inputEnabled = false;
        }
        this.getOnGPButton.alpha = 0;
        this.getOnGPButton.inputEnabled = false;
        if (!this.ball.dead) {
            this.triesNumber++;
            updateTimePlayed(this.game);
        }
    },

    ballSting: function() {
        //console.log('ball sting');
        if (!this.ball.dead) {
            this.ball.death();
            this.time.events.add(1000, this.levelLost, this);    
            moveProcessor.deleteObject(this.ball);
        }        
    },

    ballWormEaten: function() {
        //console.log('ball eaten');
        if (!this.ball.dead) {
            this.ball.death();
            this.time.events.add(1000, this.levelLost, this);    
        }
    },

    ballShocked: function() {
        //console.log('player shocked');
        if (!this.ball.dead) {
            this.ball.death('shock');
            this.time.events.add(1000, this.levelLost, this);    
        }
    },

    octopusEaten: function() {
        //console.log('eaten by octopus');
        if (!this.ball.dead) {
            this.ball.death();
            this.time.events.add(1000, this.levelLost, this);   
            moveProcessor.deleteObject(this.ball);
        }
    },

    updateBallCurrentCoord: function(ballX, ballY, ballR) {
        this.game.currentBallCoord = [new Phaser.Point(ballX, ballY), ballR];
    },

    pauseGame: function() {
        this.game.gameOnPause = true;

        this.pauseMenu.alpha = 1;
        this.continueButton.inputEnabled = true;
        this.goMenuButton.inputEnabled = true;
        if (this.exitButton) {
            this.exitButton.inputEnabled = true;    
        }        
        this.ball.joystick.required = false;
    },

    continueGame: function() {
        this.game.gameOnPause = false;

        this.pauseMenu.alpha = 0;
        this.continueButton.inputEnabled = false;
        this.goMenuButton.inputEnabled = false;
        if (this.exitButton) {
            this.exitButton.inputEnabled = false;    
        }        
        this.ball.joystick.required = true;
    },

    goChoiceMenu: function() {

        this.detachMouseEvents(); 
        //console.log(this.game.lockedLevel);
        this.state.start('LevelChoiceMenu');
        audioPlayer.clearSoundSources();
        audioPlayer.switchBackground('menu');
    },

    exitGame: function() {
        updateTimePlayed(this.game);
        navigator.app.exitApp();
    },

    detachMouseEvents: function() {
        if (this.game.device.touch) {
            this.game.input.onDown.removeAll();
            this.game.input.onUp.removeAll();            
        } else {
            this.game.input.activePointer.leftButton.onDown.removeAll();
            this.game.input.activePointer.leftButton.onUp.removeAll();
            this.game.input.activePointer.rightButton.onDown.removeAll();
            this.game.input.activePointer.rightButton.onUp.removeAll();
        }
    },

    setDarkOnTimer: function() {
        this.darkOnEvent = this.time.events.add(5000, function(){
            this.darkOverlay.alpha = 1;
            this.setDarkOffTimer();
        }, this);
    },

    setDarkOffTimer: function() {
        this.darkOffEvent = this.time.events.add(500, function(){
            this.darkOverlay.alpha = 0;
            this.setDarkOnTimer();
        }, this);
    }

    /*manageZoom: function() {
        var currentZoom = this.world.scale;

        if (this.input.mouse.wheelDelta > 0) {
            currentZoom -= 0.25;
            
        } else if (this.input.mouse.wheelDelta < 0) {
            currentZoom += 0.25;
        }

        currentZoom = Phaser.Math.clamp(currentZoom, 0.25, 2);
        this.world.scale.set(currentZoom);
    }*/

};

EdgeSk = function(game, vertices, wallInstance, fillColor) {
    this.game = game;
    this.wall = wallInstance;
    this.vertices = vertices.slice();

    if (this.wall.pushable && this.game.gameWorld==='maze' && fillColor!='interdim') {

        var textureData = wallTextures.generateMovableMaze(this.game, vertices, fillColor);

        posX = textureData.left + textureData.width/2;
        posY = textureData.top + textureData.height/2;

        Phaser.Sprite.call(this, game, posX, posY, textureData.name);

        this.anchor.setTo(0.5, 0.5);

    } else if (!this.wall.pushable && this.game.gameWorld==='maze' && fillColor != 'noFill') {

        var textureData = wallTextures.generateImmovableMaze(this.game, vertices);

        posX = (textureData.left + textureData.width/2);
        posY = (textureData.top + textureData.height/2);

        Phaser.Sprite.call(this, game, posX, posY, textureData.name);

        this.anchor.setTo(0.5, 0.5);

    } else if (fillColor==='interdim') {

        var textureData = wallTextures.generateInterdim(this.game, vertices);

        posX = textureData.left + textureData.width/2;
        posY = textureData.top + textureData.height/2;

        Phaser.Sprite.call(this, game, posX, posY, textureData.name);

        this.anchor.setTo(0.5, 0.5);

        this.blinkAnimation = this.animations.add('main', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
        this.blinkAnimation.play(15, false);
        this.blinkAnimation.onComplete.add(function(sprite, animation){            
            if (this) {
                this.blinkCall = this.game.time.events.add(3000, function(){
                    if (this) {
                        //console.log(this);
                        this.blinkAnimation.play(15, false);
                    }                    
                }, this);
            }
        }, this);

    } else if (this.wall.pushable && this.game.gameWorld==='brain' && fillColor !='interdim') {


        var textureData = wallTextures.generateMovableBrain(this.game, vertices, fillColor);

        posX = textureData.left + textureData.width/2;
        posY = textureData.top + textureData.height/2;

        Phaser.Sprite.call(this, game, posX, posY, textureData.name);

        this.anchor.setTo(0.5, 0.5);

    } else if (!this.wall.pushable && this.game.gameWorld==='brain' && fillColor != 'noFill') {

        var textureData = wallTextures.generateImmovableBrain(this.game, vertices);

        posX = textureData.left + textureData.width/2;
        posY = textureData.top + textureData.height/2;

        Phaser.Sprite.call(this, game, posX, posY, textureData.name);

        this.anchor.setTo(0.5, 0.5);

    } else if (fillColor != 'noFill'){
        var edgeGraphics = movableLabGenerator.prepareObstacleSprite(this.game, vertices, fillColor);

        Phaser.Sprite.call(this, game, edgeGraphics.x, edgeGraphics.y, edgeGraphics.bitmapData);

        //console.log(edgeGraphics.bitmapData);

        if (edgeGraphics.bottomStick) {
            this.anchor.setTo(0, 1); 
        }

        this.rotation = edgeGraphics.rot;
        //this.smoothed = false;
    } else if (fillColor = 'noFill') {
        var graphicsWall = this.game.make.graphics(0, 0);
        graphicsWall.beginFill(0x000000);
        graphicsWall.moveTo(vertices[0].x, vertices[0].y);
        graphicsWall.lineTo(vertices[1].x, vertices[1].y);
        graphicsWall.lineTo(vertices[2].x, vertices[2].y);
        graphicsWall.lineTo(vertices[3].x, vertices[3].y);
        graphicsWall.lineTo(vertices[0].x, vertices[0].y);
        graphicsWall.endFill();

        Phaser.Sprite.call(this, game, vertices[0].x, vertices[0].y, graphicsWall.generateTexture());
        this.alpha = 0;
    }
    
    game.add.existing(this);
    //this.anchor.setTo(0, 0.5);

    /*var angle = Phaser.Point.angle(vertices[1], vertices[0]);
    var newWidth = Phaser.Point.distance(vertices[1], vertices[0]);
    var newHeight = Phaser.Point.distance(vertices[3], vertices[0]);
    this.rotation = angle;
    this.width = newWidth;
    this.height = newHeight;*/

    this.colliderType = 'rectangle';
    this.holder = 'neutral';
    this.vel = wallInstance.vel;
    this.pushable = this.wall.pushable;    

    this.shadows = [];

    //var shadowOffset = 5;

    /*shadow = this.game.add.sprite(edgeGraphics.x+shadowOffset, edgeGraphics.y+shadowOffset, edgeGraphics.bitmapData);

    if (edgeGraphics.bottomStick) {
        shadow.anchor.setTo(0, 1); 
    }

    shadow.rotation = edgeGraphics.rot;
    shadow.tint = 0x000000;*/

    //ganarate and place shadows

    if (this.game.gameWorld!='brain') {
        var shadowImageName1 = shadowGenerator.generatePolygonShadow(this.game, this.vertices, this.game.lightSources[0], false);    
    } else {
        var shadowImageName1 = shadowGenerator.generatePolygonShadow(this.game, this.vertices, this.game.lightSources[0], true);    
    }

    
    //var shadowImageName2 = shadowGenerator.generatePolygonShadow(this.game, this.vertices, this.game.lightSources[1]);

    var verticesCopy = vertices.slice();

    verticesCopy.sort(function(a,b){
        if (a.x < b.x) {
            return -1
        } else {
            return 1;
        }
    }, this);

    var leftBorder = verticesCopy[0].x ,
        rightBorder = verticesCopy[vertices.length - 1].x;

    verticesCopy.sort(function(a, b){
        if (a.y < b.y) {
            return -1;
        } else {
            return 1;
        }
    }, this);

    var topBorder = verticesCopy[0].y,
        bottomBorder = verticesCopy[vertices.length - 1].y;

    var shadowCenterX = (leftBorder + rightBorder)/2;
    var shadowCenterY = (topBorder + bottomBorder)/2;

    //console.log(typeof this.game.cache.getImage(shadowImageName1));

    var shadow1 = this.game.add.sprite(shadowCenterX, shadowCenterY, shadowImageName1);
    shadow1.anchor.setTo(0.5, 0.5);
    this.assignShadow(shadow1);

    /*var shadow2 = this.game.add.sprite(shadowCenterX, shadowCenterY, shadowImageName2);
    shadow2.anchor.setTo(0.5, 0.5);
    this.assignShadow(shadow2);*/

    /*if (this.pushable) {
        //filter container
        var graphics = this.game.make.graphics(0, 0);

        graphics.lineStyle(3, 0xffffe3, 1);

        graphics.moveTo(this.vertices[0].x, this.vertices[0].y);
        graphics.lineTo(this.vertices[1].x, this.vertices[1].y);
        graphics.lineTo(this.vertices[2].x, this.vertices[2].y);
        graphics.lineTo(this.vertices[3].x, this.vertices[3].y);
        graphics.lineTo(this.vertices[0].x, this.vertices[0].y);

        var leftBorder = Math.min(this.vertices[0].x, this.vertices[1].x, this.vertices[2].x, this.vertices[3].x);
        var topBorder = Math.min(this.vertices[0].y, this.vertices[1].y, this.vertices[2].y, this.vertices[3].y);

        this.stroke = this.game.add.sprite(leftBorder, topBorder, graphics.generateTexture());
        graphics.destroy();

        var glowFilter = new Phaser.Filter(this.game, null, this.game.cache.getShader('glow'));
        glowFilter.setResolution(this.width, this.height);
        this.stroke.filters = [glowFilter];

        this.stroke.alpha = 0;
    }*/

    
};

EdgeSk.prototype = Object.create(Phaser.Sprite.prototype);
EdgeSk.prototype.constructor = EdgeSk;

EdgeSk.prototype.updateVertices = function() {
    this.vertices.forEach(function(vertex){
        vertex.add(this.vel.x, this.vel.y);
    }, this);

    this.shadows.forEach(function(shadow){
        shadow.position.add(this.vel.x, this.vel.y);
    }, this);

    /*if (this.pushable) {
        this.stroke.position.add(this.vel.x, this.vel.y);

        if (this.vel.getMagnitude() > 0) {

            this.stroke.alpha = 0.8;

        } else if (this.stroke.alpha>0) {
            this.stroke.alpha = 0;
        }
    }*/    
};

EdgeSk.prototype.setVelocity = function(newVel) {
    this.vel.copyFrom(newVel);
};

EdgeSk.prototype.assignShadow = function(/*topShadow,*/ bottomShadow) {    

    /*topShadow.alphaTween = this.game.add.tween(topShadow).to({alpha: 0.2}, 500, Phaser.Easing.Quadratic.Out, false).yoyo(true);
    bottomShadow.alphaTween = this.game.add.tween(bottomShadow).to({alpha: 0.2}, 500, Phaser.Easing.Quadratic.Out, false).yoyo(true);*/

    /*if (this.shadows.length === 0) {
        topShadow.alphaTweenDown = this.game.add.tween(topShadow).to({alpha: 0}, 125, Phaser.Easing.Linear.None, false);
        bottomShadow.alphaTweenDown = this.game.add.tween(bottomShadow).to({alpha: 0}, 125, Phaser.Easing.Linear.None, false);

        topShadow.alphaTweenDown.onComplete.add(function(){
            topShadow.alpha = 0;
        }, topShadow);

        bottomShadow.alphaTweenDown.onComplete.add(function(){
            bottomShadow.alpha = 0;
        }, bottomShadow);

        topShadow.alpha = 0.4;
        bottomShadow.alpha = 0.4;
    }*/    

    /*this.game.time.events.add(this.shadows.length/2*500, function(){

        this.game.time.events.loop(10000, function(){
            topShadow.alphaTween.start();
            /*topShadow.alpha = 0.4;

            this.game.time.events.add(1000, function(){
                topShadow.alpha = 0;
            }, topShadow);*/

        //}, topShadow);

        //this.game.time.events.loop(10000, function(){
        //    bottomShadow.alphaTween.start();
            /*bottomShadow.alpha = 0.4;

            this.game.time.events.add(1000, function(){
                topShadow.alpha = 0;
            }, bottomShadow);*/

        //}, bottomShadow);

        /*if (this.shadows.length === 0) {

            topShadow.alphaTweenDown.start();
            bottomShadow.alphaTweenDown.start();

        } else {*/

            //topShadow.alphaTween.start();
            //bottomShadow.alphaTween.start();    
            //topShadow.alpha = 0.5;
            //bottomShadow.alpha = 0.5;
            this.game.bottomShadowGroup.add(bottomShadow);

            /*this.game.time.events.add(1000, function(){
                topShadow.alpha = 0;
            }, topShadow);

            this.game.time.events.add(1000, function(){
                bottomShadow.alpha = 0;
            }, bottomShadow);*/

        //}       

    //}, this);

    //this.shadows.push(topShadow);
    this.shadows.push(bottomShadow);    
};

EdgeSk.prototype.findTangent = function(point) {
    //console.log('start tangent check');
    //console.log(point);
    for (var i = 0; i<this.vertices.length; i++) {
        var nextIndex = (i+1)%this.vertices.length;

        var intersectResults = intersectSegCircle(this.vertices[i], Phaser.Point.subtract(this.vertices[nextIndex], this.vertices[i]), point, 2);
        //console.log(this.vertices[i]);
        //console.log(this.vertices[nextIndex]);

        if (intersectResults.result) {
            var tangentDirection = Phaser.Point.subtract(this.vertices[nextIndex], this.vertices[i]);
            //console.log('tangent in edge found');
            return tangentDirection;
        }
        
    }
    return false;
};

WallSk = function(game, plan, id, gameWorld) {
    Phaser.Group.call(this, game);
    this.game = game;
    this.plan = plan;
    this.pushable = false;
    this.vertices = [];
    this.edges = [];
    this.id = id;
    game.add.existing(this);
    //move processor parameters
    this.moveDone = true;
    this.colliderType = 'multiRectangle';
    this.intent = new Phaser.Point();
    this.vel = new Phaser.Point();
    this.moving = false;
    this.holder = 'neutral';
    this.pushing = false;
    this.gameWorld = gameWorld;
    //console.log(this.gameWorld);
    this.defineOuterSegments();
};

WallSk.prototype = Object.create(Phaser.Group.prototype);
WallSk.prototype.constructor = WallSk;

WallSk.prototype.build = function(fillColor) {

    //console.log(this.id);

    if (!fillColor) {
        if (!this.pushable) {
            var fillColor = wallsPicker.giveWall(this.game, this.gameWorld, 'immovable');        
        } else {
            var fillColor = wallsPicker.giveWall(this.game, this.gameWorld, 'movable');//(['red', 'orange', 'green', 'blue'])
        }
    }
    this.fillColor = fillColor;

    /*if (this.pushable && this.gameWorld === 'brain') {
        var colorArray = [{high: '#65cfff', middle: '#ff2525', back: '#c0fb09'},
            {high: '#fde2ff', middle: '#fe2626', back: '#fb6b09'},
            {high: '#12f2d7', middle: '#f3008c', back: '#b66bfb'},
            {high: '#ffb42b', middle: '#cf45ff', back: '#aeff93'}];
            
        var colorSet = colorArray[Math.round(Math.random()*(colorArray.length - 1))];
    }*/
    for (var e=0; e<this.plan.length; e++) {
        var vertex1 = new Phaser.Point(this.plan[e][0][0]/configuration.canvasWidth*this.game.width, 
            this.plan[e][0][1]/configuration.canvasHeight*this.game.height);
        var vertex2 = new Phaser.Point(this.plan[e][1][0]/configuration.canvasWidth*this.game.width, 
            this.plan[e][1][1]/configuration.canvasHeight*this.game.height);
        var vertex3 = new Phaser.Point(this.plan[e][2][0]/configuration.canvasWidth*this.game.width,
            this.plan[e][2][1]/configuration.canvasHeight*this.game.height);
        var vertex4 = new Phaser.Point(this.plan[e][3][0]/configuration.canvasWidth*this.game.width,
            this.plan[e][3][1]/configuration.canvasHeight*this.game.height);
        var vertices = [vertex1, vertex2, vertex3, vertex4];        
        //console.log(fillColor);
        if (this.gameWorld ==='brain' && this.pushable){
            //console.log(colorSet);
            var edge = new EdgeSk(this.game, vertices, this, fillColor);    
        } else {
            var edge = new EdgeSk(this.game, vertices, this, fillColor);    
        }      
        this.edges.push(edge);
        this.add(edge);
        this.vertices.push(vertices);
    }

    

    if (this.pushable) {
        /*var glowFilter = new Phaser.Filter(this.game, null, this.game.cache.getShader('glow'));
        glowFilter.setResolution(this.width, this.height);
        this.filters = [glowFilter];*/
    }

    //console.log(this.getLocalBounds());
};

WallSk.prototype.update = function() {    
    /*this.game.debugGraphics.lineStyle(2, 0x00ff60, 1);

    for (var seg in this.outerSegments) {
        this.game.debugGraphics.moveTo(this.outerSegments[seg][0].x, this.outerSegments[seg][0].y);
        this.game.debugGraphics.lineTo(this.outerSegments[seg][1].x+this.outerSegments[seg][0].x, this.outerSegments[seg][1].y+this.outerSegments[seg][0].y);
    }*/
};

WallSk.prototype.setVelocity = function(newVel) {
    this.vel.copyFrom(newVel);
    for (var e in this.edges) {
        this.edges[e].setVelocity(newVel);
    }
};

WallSk.prototype.calculateVel = function() {
    if (moveProcessor.checkNeeded) {
        this.vel = new Phaser.Point();
        for (var e in this.edges) {
            this.edges[e].setVelocity(new Phaser.Point());
        }    
    }
    
};

WallSk.prototype.move = function() {
    
};

WallSk.prototype.findTangent = function(point) {
    var tangentDirection = false;
    this.edges.forEach(function(edge){
        var edgeTang = edge.findTangent(point);

        if (edgeTang) tangentDirection = edgeTang;
    }, this);

    return tangentDirection;
};

WallSk.prototype.giveBoundingRectangle = function() {
    return new Phaser.Rectangle(this.left+this.vel.x, this.top+this.vel.y, this.width, this.height);
};

WallSk.prototype.defineOuterSegments = function() {
    var segments = [];

    for (var e in this.plan) {
        for (var v in this.plan[e]) {
            if (Number(v)<4) {

                var nextV = Number(v)<3? Number(v)+1 : 0;
                segments.push([this.plan[e][v], this.plan[e][nextV]]);

            }
        }
    }

    var innerSegments = [];
    segments.forEach(function(seg1, index1, segArr1){
        segArr1.forEach(function(seg2, index2, segArr2){

            if (index2>index1) {
                if((seg1[0].equals(seg2[0]) && seg1[1].equals(seg2[1])) || (seg1[0].equals(seg2[1]) && seg1[1].equals(seg2[0]))) {
                    innerSegments.push(seg1);
                }
            }

        }, this);
    }, this);

    var candidateOuterSegments = segments.filter(function(segment){
        var inner = false;
        innerSegments.forEach(function(innerSegment){
            if (!inner) {
                if ((innerSegment[0].equals(segment[0]) && innerSegment[1].equals(segment[1])) || (innerSegment[1].equals(segment[0]) && innerSegment[0].equals(segment[1]))){
                    inner = true;
                }
            }
        }, this);
        return !inner;
    }, this);
    /*console.log(segments);
    console.log(innerSegments);*/
    //console.log(candidateOuterSegments);

    //var firstPoint = candidateOuterSegments[0][0],
    //    currentPoint = candidateOuterSegments[0][1];

    

    // crate points array
    var points = [];
    candidateOuterSegments.forEach(function(segment){
        points = points.concat(segment);        
    }, this);

    //console.log(points);

    // find points that appears 4 times

    var points4T = [];

    points.forEach(function(point1, index1, pointsArr1){
        var occurance = 0;
        pointsArr1.forEach(function(point2, index2, pointsArr2){
            if (index2>=index1) {
                if (point1.equals(point2)) occurance++;    
            }            
        }, this);
        if (occurance>=4) points4T.push(point1);
    }, this);

    //console.log(points4T);

    // find segments starting and finishing in point appering 4 times
    // mark them for deletion if they are shorter than certain amount -32 pixels, walls width in maze and lab levels

    var innerSegments = [];

    points4T.forEach(function(point){
        candidateOuterSegments.forEach(function(segment){
            if (segment[0].equals(point)) {
                points4T.forEach(function(otherPoint){
                    if (segment[1].equals(otherPoint) && Math.sqrt(Math.pow(segment[1][0]-segment[0][0], 2) + Math.pow(segment[1][1]-segment[0][1], 2))<32) {
                        innerSegments.push(segment);
                    }
                }, this);
            }
        }, this);
    }, this);

    //console.log(innerSegments);

    var outerSegmentsArray = candidateOuterSegments.filter(function(segment){        
        for (var iSeg in innerSegments) {
            if (innerSegments[iSeg].equals(segment)) return false;
        }
        return true;
    }, this);

    // prepare segments that can be processed by collider

    this.outerSegments = outerSegmentsArray.map(function(segment){
        return [new Phaser.Point(segment[0][0], segment[0][1]), new Phaser.Point(segment[1][0]-segment[0][0], segment[1][1]-segment[0][1])];
    }, this);

    //console.log(outerSegments);    

    /*outerSegments.push(candidateOuterSegments.shift());

    while (!currentPoint.equals(firstPoint)) {

        // choose segments with current point

        var segmentsWCP = candidateOuterSegments.filter(function(segment){
            if (segment[0].equals(currentPoint) || segment[1].equals(currentPoint)) {
                return true;
            }

            return false;

        }, this);

        // choose segment with currentpoint and biggest angle

        segmentsWCP.sort(function(a, b){
            if (a[0].equals(currentPoint)) {
                var aAngle = Math.atan2(a[1][1]-a[0][1], a[1][0] - a[0][0]);
            } else {
                var aAngle = Math.atan2(a[0][1] - a[1][1], a[0][0] - a[1][0]);
            }

            if (b[0].equals(currentPoint)) {
                var bAngle = Math.atan2(b[1][1]-b[0][1], b[1][0] - b[0][0]);
            } else {
                var bAngle = Math.atan2(b[0][1] - b[1][1], b[0][0] - b[1][0]);
            }

            if (aAngle<0) aAngle+=2*Math.PI;
            if (bAngle<0) bAngle+=2*Math.PI;

            if (aAngle>bAngle) {
                return -1;
            } else {
                return 1;
            }

        });

        var currentSegment = segmentsWCP[0];

        outerSegments.push(currentSegment);

        if (currentSegment[0].equals(currentPoint)) {
            currentPoint = currentSegment[1];
        } else {
            currentPoint = currentSegment[0];
        }

        var currentIndex = -1
        candidateOuterSegments.forEach(function(segment, index){
            if ((segment[0].equals(currentSegment[0]) && segment[1].equals(currentSegment[1])) || 
                (segment[1].equals(currentSegment[0]) && segment[0].equals(currentSegment[1]))) {
                currentIndex = index;
            }
        }, this);

        candidateOuterSegments.splice(currentIndex, 1);

    }*/

    //console.log(outerSegments);

};

MovableWallSk = function(game, plan, id, gameWorld) {
    WallSk.call(this, game, plan, id, gameWorld);
    this.pushable = true;
    this.moveDone = false;
    this.tangentMoveIteration = 0;
    /*this.emitter = this.game.add.emitter(0, 0, 50);
    this.emitter.gravity = 0;
    this.emitter.minParticleSpeed.setTo(-200, -200);
    this.emitter.maxParticleSpeed.setTo(200, 200);
    this.gravity = 0;*/
    this.freezFrames = 0;

    //touching animation
    this.touchSprite = this.game.add.sprite(this.x, this.y, 'touchAnim');
    this.touchSprite.anchor.setTo(0.5, 0.5);
    this.touchAnimation = this.touchSprite.animations.add('main', null, 30);
    this.touchSprite.alpha = 0;
    this.touchAnimation.onComplete.add(function(){
        this.touchSprite.alpha = 0;
        //console.log('on complete called');
    }, this);

    this.emitCalled = false;
    this.ignoreEmit = false;

    //moving animation
    var scaledPlan = this.plan.map(function(edgeVertex){
        return edgeVertex.map(function(vertex){
            return [vertex[0]/configuration.canvasWidth*this.game.width, vertex[1]/configuration.canvasHeight*this.game.height];
        }, this);
    }, this);

    var spriteSheetData = wallMoveGenerator.generateAnimation(this.game, scaledPlan),
        posX = spriteSheetData.left + spriteSheetData.width/2;
        posY = spriteSheetData.top + spriteSheetData.height/2;

    //console.log(spriteSheetData.left);
    //console.log(spriteSheetData.top);

    this.moveAnimationSprite = this.game.add.sprite(posX, posY, spriteSheetData.name);
    this.moveAnimationSprite.anchor.setTo(0.5, 0.5);
    this.moveAnimationSprite.alpha = 0;
    //this.moveAnimation = this.moveAnimationSprite.animations.add('main', null, 10, false);
};

MovableWallSk.prototype = Object.create(WallSk.prototype);
MovableWallSk.prototype.constructor = MovableWallSk;

MovableWallSk.prototype.checkMovePossibility = function(movement) {
    var movePossible = true;
    this.forEach(function(edge){
        movePossible = edge.checkMovePossibility(movement) && movePossible;
        //console.log(movePossible);
    }, this);

    return movePossible;
};

MovableWallSk.prototype.move = function() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.forEach(function(edge){
        edge.updateVertices();
    }, this);
    this.outerSegments.forEach(function(segment){
        segment[0].add(this.vel.x, this.vel.y);
    }, this);

    if (this.vel.getMagnitude() > 0) {
        this.game.pushSignal.dispatch('pushWall');
        /*if (!this.moveAnimation.isPlaying || this.moveAnimationSprite.alpha === 0) {
            this.moveAnimationSprite.alpha = 1;
            if (this.moveAnimation.paused) {
                this.moveAnimation.restart();
            } else {
                this.moveAnimation.play();    
            }
        }
        this.freezFrames = 0;*/
        this.moveAnimationSprite.alpha = 1;
    } else {
        /*this.freezFrames ++;
        if (this.freezFrames>5) {
            this.moveAnimationSprite.alpha = 0;
            this.moveAnimation.paused = true;    
        }*/
        this.moveAnimationSprite.alpha = 0;        
    }
    this.moveAnimationSprite.position.add(this.vel.x, this.vel.y);
    this.tangentMoveIteration = 0;
    // to stop endless call of emit for interdimWalls
    if (!this.emitCalled && this.ignoreEmit) {
        this.ignoreEmit = false;
    }
    this.emitCalled = false;
};

MovableWallSk.prototype.emitOnCollision = function(posX, posY) {    
    /*if (!this.emitter.on) {
        this.emitter.x = posX;
        this.emitter.y = posY;
        this.emitter.makeParticles('star');
        //this.emitter.start(true, 500, null, 2);
        this.emitter.flow(500, 250, 4, 20);
    }*/
    //console.log('emit called');
    //console.log(this.touchAnimation.isPlaying);
    this.emitCalled = true;
    if (!this.touchAnimation.isPlaying && !this.ignoreEmit) {
        //console.log('animation called');
        this.touchSprite.rotation = Math.random()*Math.PI*2;
        this.touchSprite.position.set(posX, posY);
        this.touchSprite.alpha = 1;
        this.touchAnimation.play();
        audioPlayer.playOneTime('wallCollision');
    } else {
        this.ignoreEmit = true;
    }
};

InterdimWallSk = function(game, plan, id, gameWorld) {
    MovableWallSk.call(this, game, plan, id, gameWorld);
};

InterdimWallSk.prototype = Object.create(MovableWallSk.prototype);
InterdimWallSk.prototype.constructor = InterdimWallSk;

InterdimWallSk.prototype.build = function() {

    for (var e=0; e<this.plan.length; e++) {
        var vertex1 = new Phaser.Point(this.plan[e][0][0]/configuration.canvasWidth*this.game.width, 
            this.plan[e][0][1]/configuration.canvasHeight*this.game.height);
        var vertex2 = new Phaser.Point(this.plan[e][1][0]/configuration.canvasWidth*this.game.width, 
            this.plan[e][1][1]/configuration.canvasHeight*this.game.height);
        var vertex3 = new Phaser.Point(this.plan[e][2][0]/configuration.canvasWidth*this.game.width,
            this.plan[e][2][1]/configuration.canvasHeight*this.game.height);
        var vertex4 = new Phaser.Point(this.plan[e][3][0]/configuration.canvasWidth*this.game.width,
            this.plan[e][3][1]/configuration.canvasHeight*this.game.height);
        var vertices = [vertex1, vertex2, vertex3, vertex4];        
        //console.log(fillColor);
        var edge = new EdgeSk(this.game, vertices, this, 'interdim');
        this.edges.push(edge);
        this.add(edge);
        this.vertices.push(vertices);
    }
};

Ball = function(game, posX, posY) {
    this.game = game;
    Phaser.Sprite.call(this, game, posX*this.game.width, posY*this.game.height, 'ball', '1');
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.moveSignal = new Phaser.Signal();
    //this.pushSignal = new Phaser.Signal();
    this.vel = new Phaser.Point(0.1, -0.1);
    this.pushing = false;
    this.targetVel = this.vel.clone();
    this.dead = false;
    this.additionalSpeed = new Phaser.Point();
    this.shadows = [];
    this.inTeleport = false;
    this.attractionPoint = null;

    /*var lineGraphics = this.game.add.graphics(0, 0);
    lineGraphics.lineStyle(1, 0Xff0000, 1);
    lineGraphics.moveTo(0, 0);
    lineGraphics.lineTo(10, 0);*/

    this.rotation = -Math.PI/4;    

    game.add.existing(this);

    this.mainAnim = this.animations.add('main', ['1', '2', '3', '4', '5', '4', '3', '2', '1'], 18, true);    
    this.deathAnim = this.animations.add('death', ['5', 'death1', 'death2', 'death3', 'death4', 'death5'], 18, false);
    this.shockAnim = this.animations.add('shock', ['shock1', 'shock2', 'shock3', 'shock4', 'shock1', 'shock2', 'shock3', 'shock4', 'shock1', 'shock2', 'shock3', 'shock4'], 18, false);
    this.animations.play('main');
    this.afterDeathAnim = this.animations.add('afterDeath', ['death6', 'death5'], 18, true);

    this.deathAnim.onComplete.add(function(){
        this.animations.play('afterDeath');
    }, this);

    this.shockAnim.onComplete.add(function(){
        this.animations.play('afterDeath');
    }, this);

    //ball wall collision animation
    this.ballWallCollision = game.add.sprite(this.x, this.y, 'ballWallCollision');
    this.ballWallCollAnimation = this.ballWallCollision.animations.add('main', [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0], 40, false);
    this.ballWallCollision.anchor.setTo(0.5, 0.5);
    this.ballWallCollision.alpha = 0;
    this.ballWallCollAnimation.onComplete.add(function(){
        this.ballWallCollision.alpha =0;
    }, this);    

    //add parameters for move processor
    this.moveDone = false;
    this.colliderType = 'circle';
    this.intent = new Phaser.Point();
    this.pushable = true;
    this.moving = true;
    this.interactionRadius = this.width/2;
    this.bounceIteraion = 0;
    this.holder = 'player';
    this.pushing = false;
    this.inContact = false;
    this.rightTarget = null;
    this.leftTarget = null;
    this.centerTarget = null;
    this.targetFound = false;
    //this.target = null;

    //set a joystick
    this.joystick = new Joystick(this.game, this.position, this);
    if (this.game.device.touch) {
        this.game.input.onDown.add(this.joystick.placeJoystick, this.joystick);
        this.game.input.onUp.add(this.joystick.hideJoystick, this.joystick);
        this.game.input.addMoveCallback(this.joystick.moveInner, this.joystick);
    } else {
        this.game.input.activePointer.leftButton.onDown.add(this.joystick.placeJoystick, this.joystick);
        this.game.input.activePointer.leftButton.onUp.add(this.joystick.hideJoystick, this.joystick);
        this.game.input.activePointer.rightButton.onDown.add(this.joystick.placeJoystick, this.joystick);
        this.game.input.activePointer.rightButton.onUp.add(this.joystick.hideJoystick, this.joystick);
        this.game.input.activePointer.rightButton.onDown.add(this.activatePush, this);
        this.game.input.activePointer.rightButton.onUp.add(this.disactivatePush, this);
        this.game.input.addMoveCallback(this.joystick.moveInner, this.joystick);    
    }
    
    this.joystick.signal.add(this.defineTargetVel, this);

    this.teleportHam = this.game.add.sprite(0, 0, 'teleportHam');
    this.teleportHam.teleAnim = this.teleportHam.animations.add('main');
    this.teleportHam.alpha = 0;
    this.teleportHam.anchor.setTo(0.5, 0.5);

    this.teleportTimer = new TeleportTimer(this.game, this.position.x, this.position.y, this);
    this.addChild(this.teleportTimer);

    // blow on haster
    this.blow = this.game.add.sprite(this.right, this.y, 'blowHamster');
    this.blow.anchor.setTo(1, 0.5);
    this.blowAnimation = this.blow.animations.add('main', [0, 1, 2, 3, 4, 3, 2, 1, 0], 20, true);
    this.blow.alpha = 0;


    //pushing button   

    /*this.spaceKey.onDown.add(this.activatePush, this);
    this.spaceKey.onUp.add(this.disactivatePush, this);*/

};

Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.activatePush = function() {
    this.pushing = true;
    this.joystick.showPushCircle();
};

Ball.prototype.disactivatePush = function() {
    this.pushing = false;
    this.joystick.hidePushCircle();
};

Ball.prototype.calculateVel = function(intPoint, restitution) {
    if (!restitution) {
        restitution = 0;
    }
    if (!this.inTeleport) {
        if (intPoint) {

            var radialVec = Phaser.Point.subtract(intPoint, new Phaser.Point(this.x, this.y));
            var bounceNormal = Phaser.Point.normalRightHand(radialVec).normalize();
            
            this.targetVel = calculateBounceVel(this.vel, bounceNormal, restitution).clone();
            this.vel.copyFrom(this.targetVel);
            //play music and animation
            audioPlayer.playOneTime('wallBallCollision');
            this.ballWallCollision.alpha = 1;
            //var collisionPos = radialVec.clone().rotate(-this.targetVel.angle(new Phaser.Point()), new Phaser.Point());
            /*this.ballWallCollision.position.copyFrom(intPoint.clone());
            this.ballWallCollision.rotation = radialVec.angle(new Phaser.Point()) - Math.PI/2;*/
            this.ballWallCollision.position.copyFrom(this.position);
            this.ballWallCollision.rotation = radialVec.angle(new Phaser.Point()) - Math.PI;
            this.ballWallCollAnimation.play();
        } else {
            this.correctVel();        
        }
    } else {

        this.vel.set(this.vel.x*0.7, this.vel.y*0.7);

    }    

    this.joystick.setPosition(this.position);
    var velocityAngle = this.vel.angle(new Phaser.Point());
    this.joystick.dirArrow.rotation = velocityAngle + Math.PI;
    this.joystick.dirArrow.x = this.joystick.runRadius.x + this.joystick.runRadius.width/2*Math.cos(velocityAngle+Math.PI);
    this.joystick.dirArrow.y = this.joystick.runRadius.y + this.joystick.runRadius.width/2*Math.sin(velocityAngle+Math.PI);
    this.teleportHam.position.set(this.x, this.y);
    this.shadows.forEach(function(shadow){
        //console.log(shadow);
        shadow.x = this.position.x;
        shadow.y = this.position.y;
    }, this);

    //this.inContact = false;
};

Ball.prototype.setVelocity = function(newVel) {
    this.vel.copyFrom(newVel);
    this.targetVel.copyFrom(newVel);
};

Ball.prototype.impulseStepBack = function(intPoint) {
    //console.log('impulse step back called');
    var radialVec = Phaser.Point.subtract(intPoint, this.position);
    radialVec.normalize();

    this.x -= radialVec.x;
    this.y -= radialVec.y;
};

Ball.prototype.applyAddSpeed = function(addSpeed, reason) {
    this.additionalSpeed = addSpeed.clone();
    if (reason==='fan') {
        if (this.blow.alpha === 0) {
            this.blowAnimation.play();
            this.blow.alpha = 0.7;    
        }        
        var toBlowVec = addSpeed.clone().setMagnitude(-this.interactionRadius);
        this.blow.position.set(this.x+toBlowVec.x, this.y+toBlowVec.y);
        this.blow.rotation = toBlowVec.angle(new Phaser.Point())+Math.PI;
    }
};

Ball.prototype.defineTargetVel = function(startPos, endPos){
    //console.log('define target velocity');
    if (!this.dead && !this.inTeleport) {
        var targetVel = Phaser.Point.subtract(endPos, startPos);
        var distance = targetVel.getMagnitude();
        //distance = Math.max(distance, 30);
        //targetVel.setMagnitude(Math.exp(distance)/Math.exp(40)/800*this.game.width);
        /*if (pushingAct) {
            targetVel.setMagnitude(8/configuration.canvasWidth*this.game.width * (1 - Math.exp(-distance/50)));    
        } else {
            targetVel.setMagnitude(8/configuration.canvasWidth*this.game.width * (1 - Math.exp(-distance/50)));    
        }*/     
        targetVel.setMagnitude(6 * (1 - Math.exp(-distance/5)));   
        this.targetVel = targetVel.clone();

        /*if (this.pushing && !pushingAct) {
            //console.log('hide push circle');
            this.joystick.hidePushCircle();
            this.inContact = false;
        }*/

        //this.pushing = pushingAct;        
    }
    //console.log('target velocity '+ this.targetVel);
    //console.log('this velocity '+ this.vel);
};

Ball.prototype.correctVel = function(){
    //console.log('correct velocity');
    var velCorrection = Phaser.Point.subtract(this.targetVel, this.vel);
    if (velCorrection.getMagnitude() > 0.8) {
        //console.log('correct velocity ' + velCorrection);
        velCorrection.setMagnitude(0.8);
    }
    this.vel.add(velCorrection.x, velCorrection.y);
    this.vel.add(this.additionalSpeed.x, this.additionalSpeed.y);
    if (this.attractionPoint) {
        var attractionSpeed = Phaser.Point.subtract(this.attractionPoint, this.position);
        attractionSpeed.multiply(0.02, 0.02);
        this.vel.add(attractionSpeed.x, attractionSpeed.y);
    }
    // hide blow animation
    if (this.additionalSpeed.getMagnitude()===0) {
        this.blow.alpha = 0;
        if (this.blowAnimation.isPlaying) {
            this.blowAnimation.stop();    
        }        
    }
    this.additionalSpeed = new Phaser.Point();
};

Ball.prototype.move = function() {
    var prevRotation = this.rotation;

    this.position.add(this.vel.x*this.game.time.physicsElapsed*60, this.vel.y*this.game.time.physicsElapsed*60);

    //if (this.vel.getMagnitude()>0.5) {
        this.rotation = Math.atan2(this.vel.y, this.vel.x);
    //}
    this.ballWallCollision.position.add(this.vel.x, this.vel.y);

    this.moveSignal.dispatch(this.x, this.y, this.width/2, this);

    if (Math.abs(prevRotation-this.rotation)>Math.PI/180*0.1 || this.pushing) {
        /*if (this.pushing) {
            console.log('on pushing define');
        }*/
        var target = this.findTargetWall();
        this.rightTarget = target[0];
        this.leftTarget = target[1];
        this.centerTarget = target[2];
    }
};

Ball.prototype.death = function(reason) {
    //console.log('ball death function called');
    if (reason==='shock') {
        this.shockAnim.play();
        this.dead = true;
        this.joystick.alpha = 0;
        this.joystick.required = false;
    } else {
        this.animations.play('death');
        this.dead = true;
        this.joystick.alpha = 0;        
        this.joystick.required = false;
    }
    audioPlayer.playOneTime('lose');
    
};

Ball.prototype.resurrect = function() {
    this.animations.play('main');
    this.inTeleport = false;
    this.dead = false;
    this.setVelocity(new Phaser.Point());
    //clear old shadows
    this.shadows = [];
    this.joystick.required = true;
    //console.log('resurrection called');
    //if (!this.targetFound) {
        var target = this.findTargetWall();
        this.rightTarget = target[0];
        this.leftTarget = target[1];
        this.centerTarget = target[2];    
    //}
    if (this.alpha===0) {
        this.alpha = 1;
    }
};

Ball.prototype.managePushing = function(inCollision) {
    if (inCollision) {
        //console.log('manage pushing called with true');
        //console.log('in contact is '+this.inContact);
    }    
    if (!this.inContact && inCollision) {
        this.joystick.showPushCircle();
        this.inContact = true;
    } else if (this.inContact && this.joystick.pushRadius.width === 0) {
        this.inContact = false;
    }
};

Ball.prototype.assignShadow = function(bottomShadow) {

    this.game.bottomShadowGroup.add(bottomShadow);
    this.shadows.push(bottomShadow);
};

Ball.prototype.runOnTeleport = function(color, mapId, portal) {

    this.teleportTimer.startTimer(color, mapId);
    this.attractionPoint = portal.position.clone();

}

Ball.prototype.runOutTeleport = function() {

    this.teleportTimer.resetTimer();
    this.attractionPoint = null;

}

Ball.prototype.findTargetWall = function() {
    // find marginal points on the ball's circle
    //console.log('find target wall called');
    var rightPoint = Phaser.Point.normalRightHand(this.vel),
        leftPoint = Phaser.Point.negative(rightPoint),
        rightTarget = null,
        leftTarget = null,
        centerTarget = null,
        walls = this.game.wallsSG.children;

    rightPoint.setMagnitude(this.interactionRadius);
    leftPoint.setMagnitude(this.interactionRadius);

    rightPoint.add(this.position.x, this.position.y);
    leftPoint.add(this.position.x, this.position.y);

    // set velocity ray
    var maxDistance = Math.sqrt(Math.pow(this.game.height, 2)+Math.pow(this.game.width, 2)),
        velRay = new Phaser.Point(maxDistance*Math.cos(this.rotation), maxDistance*Math.sin(this.rotation)),
        rightCurrentDistance = maxDistance,
        leftCurrentDistance = maxDistance,
        centerCurrentDistance = maxDistance,
        currentDistance = maxDistance;

    //console.log(velRay);

    // check all the walls on intersection with the vel ray
    for (var wall in walls) {

        for (var seg in walls[wall].outerSegments) {
            var wallSegment = walls[wall].outerSegments[seg],
                intersectionResultRight = intersectSegSeg(rightPoint, velRay, wallSegment[0], wallSegment[1]),
                intersectionResultLeft = intersectSegSeg(leftPoint, velRay, wallSegment[0], wallSegment[1]);
                //intersectionResultCenter = intersectSegRectSkwp([this.position, velRay], walls[wall].edges.vertices);

            //console.log(intersectionResultRight);
            //console.log(intersectionResultLeft);

            if (intersectionResultRight.result) {
                if (intersectionResultRight.intPoint.distance(rightPoint)<rightCurrentDistance) {
                    rightCurrentDistance = intersectionResultRight.intPoint.distance(rightPoint);
                    /*if (rightTarget) {
                        if (notInnerWallsIDs.indexOf(rightTarget.id)<0){
                            notInnerWallsIDs.push(rightTarget.id);
                        }
                    }*/
                    rightTarget = walls[wall];
                }
            }

            if (intersectionResultLeft.result) {
                if (intersectionResultLeft.intPoint.distance(leftPoint)<leftCurrentDistance) {
                    leftCurrentDistance = intersectionResultLeft.intPoint.distance(leftPoint);
                    /*if (leftTarget) {
                        if (notInnerWallsIDs.indexOf(leftTarget.id)<0){
                            notInnerWallsIDs.push(leftTarget.id);
                        }
                    }*/
                    leftTarget = walls[wall];
                }
            }

            /*if (intersectionResultCenter.result) {
                if (intersectionResultCenter.intPoint.distance(this.position)<centerCurrentDistance) {
                    centerCurrentDistance = intersectionResultCenter.intPoint.distance(this.position);
                    if (centerTarget) {
                        if (notInnerWalls.indexOf(centerTarget)<0){
                            notInnerWalls.push(centerTarget);
                        }
                    }
                    centerTarget = walls[wall];
                }
            }*/
        }
    }
    
    var polygonHeightVec = Phaser.Point.subtract(leftPoint, rightPoint),
        polygonRightWidthVec = velRay.clone().setMagnitude(rightCurrentDistance),
        polygonLeftWidthVec = velRay.clone().setMagnitude(leftCurrentDistance),
        ver1 = leftPoint,
        ver2 = rightPoint,
        ver3 = Phaser.Point.add(rightPoint, polygonRightWidthVec),
        ver4 = Phaser.Point.add(leftPoint, polygonLeftWidthVec);
        visionPolygon = new Phaser.Polygon([ver1, ver2, ver3, ver4]);

    /*this.game.debugGraphics.clear();
    this.game.debugGraphics.beginFill(0x0034ff, 0.5);
    this.game.debugGraphics.drawPolygon(visionPolygon.points);
    this.game.debugGraphics.endFill();*/

    // check whether any of vertices of the walls goes to vision ploygon

    currentDistance = Math.max(leftCurrentDistance, rightCurrentDistance);

    for (var wall in walls) {
        if (walls[wall].id>0 && (!leftTarget || walls[wall].id!=leftTarget.id) && (!rightTarget || walls[wall]!=rightTarget.id)) { //&& notInnerWallsIDs.indexOf(walls[wall].id)<0) {
            for (var seg in walls[wall].outerSegments) {
                var vertex1 = walls[wall].outerSegments[seg][0],
                    vertex2 = Phaser.Point.add(walls[wall].outerSegments[seg][1], walls[wall].outerSegments[seg][0]);
                
                if (visionPolygon.contains(vertex1.x, vertex1.y)) {

                    if (this.position.distance(vertex1)<currentDistance) {
                        currentDistance = this.position.distance(vertex1);
                        centerTarget = walls[wall];
                        //console.log(visionPolygon);
                        break;
                    }

                } else if (visionPolygon.contains(vertex2.x, vertex2.y)) {

                    if (this.position.distance(vertex2)<currentDistance) {
                        currentDistance = this.position.distance(vertex2);
                        centerTarget = walls[wall];
                        //console.log(visionPolygon);
                        break;
                    }
                }
                
            }
        }
    }

    //this.targetFound = true;    
    /*this.game.debugGraphics.lineStyle(2, 0x00ff60, 1);
    this.game.debugGraphics.beginFill(0x00ff00);
    rightTarget.outerSegments.forEach(function(segment){
        this.game.debugGraphics.moveTo(segment[0].x, segment[0].y);
        this.game.debugGraphics.lineTo(segment[1].x+segment[0].x, segment[1].y+segment[0].y);
        this.game.debugGraphics.drawCircle(segment[0].x, segment[0].y, 8);
    }, this);
    leftTarget.outerSegments.forEach(function(segment){
        this.game.debugGraphics.moveTo(segment[0].x, segment[0].y);
        this.game.debugGraphics.lineTo(segment[1].x+segment[0].x, segment[1].y+segment[0].y);
        this.game.debugGraphics.drawCircle(segment[0].x, segment[0].y, 8);
    }, this);
    if (centerTarget) {
        centerTarget.outerSegments.forEach(function(segment){
            this.game.debugGraphics.moveTo(segment[0].x, segment[0].y);
            this.game.debugGraphics.lineTo(segment[1].x+segment[0].x, segment[1].y+segment[0].y);
            this.game.debugGraphics.drawCircle(segment[0].x, segment[0].y, 8);
        }, this);
    }
    this.game.debugGraphics.endFill();*/


    return [rightTarget, leftTarget, centerTarget];
};

TeleportTimer = function(game, posX, posY, ball) {
    this.game = game;
    Phaser.Sprite.call(this, game, posX, posY, 'teleportTimer');
    game.add.existing(this);
    this.ball = ball;
    this.teleportSignal = new Phaser.Signal();
    this.anchor.setTo(0.5, 0.5);

    this.alpha = 0;

    this.countAnimation = this.animations.add('main', null, 8, false);
    this.countAnimation.onComplete.add(function(){
        this.alpha = 0;
        this.teleportSignal.dispatch(this.game, this.teleportColor, this.teleportMapId);
    }, this);
};

TeleportTimer.prototype = Object.create(Phaser.Sprite.prototype);
TeleportTimer.prototype.constructor = TeleportTimer;

TeleportTimer.prototype.startTimer = function(color, mapId) {
    this.teleportColor = color;
    this.teleportMapId = mapId;

    this.alpha = 1;

    this.countAnimation.play();
    
};

TeleportTimer.prototype.resetTimer = function() {
    this.alpha = 0;
    this.countAnimation.stop(true);
};

Trigger=function(game, posX, posY, purpose) {
    this.purpose = purpose;
    this.game = game;
    this.playerIn = false;
    this.signal = new Phaser.Signal();
    Phaser.Sprite.call(this, game, posX*this.game.width, posY*this.game.height, purpose);
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    game.add.existing(this);
    
    this.interactionRadius = this.width/2;

    if (purpose!='start' && purpose!='finish') {

        this.frameName = 'out';

        this.shadows = [];    

        var shadowImageName1 = shadowGenerator.generateCylinderShadow(this.game, this.position, 
            this.interactionRadius, this.game.lightSources[0]);
        /*var shadowImageName2 = shadowGenerator.generateCylinderShadow(this.game, this.position, 
            this.interactionRadius, this.game.lightSources[1]);        */

        var shadow1 = this.game.add.sprite(this.x, this.y, shadowImageName1);
        shadow1.anchor.setTo(0.5, 0.5);
        this.assignBottomShadow(shadow1);

        /*var shadow2 = this.game.add.sprite(this.x, this.y, shadowImageName2);
        shadow2.anchor.setTo(0.5, 0.5);
        this.assignBottomShadow(shadow2);*/

    } /*else if (purpose==='finish') {

        this.shadows = [];    

        var shadowImageName1 = shadowGenerator.generateSpotBottomShadow(this.game, this.position, 
            this.interactionRadius, this.game.lightSources[0]);
        var shadowImageName2 = shadowGenerator.generateSpotBottomShadow(this.game, this.position, 
            this.interactionRadius, this.game.lightSources[1]);        

        var shadow1 = this.game.add.sprite(this.x, this.y, shadowImageName1);
        shadow1.anchor.setTo(0.5, 0.5);
        this.assignBottomShadow(shadow1);

        var shadow2 = this.game.add.sprite(this.x, this.y, shadowImageName2);
        shadow2.anchor.setTo(0.5, 0.5);
        this.assignBottomShadow(shadow2);

        var shadowImageName3 = shadowGenerator.generateSpotTopShadow(this.game, this.position, 
            this.interactionRadius, this.game.lightSources[0]);
        var shadowImageName4 = shadowGenerator.generateSpotTopShadow(this.game, this.position, 
            this.interactionRadius, this.game.lightSources[1]);        

        var shadow3 = this.game.add.sprite(this.x, this.y, shadowImageName3);
        shadow3.anchor.setTo(0.5, 0.5);
        this.assignTopShadow(shadow3);

        var shadow4 = this.game.add.sprite(this.x, this.y, shadowImageName4);
        shadow4.anchor.setTo(0.5, 0.5);
        this.assignTopShadow(shadow4);
    }*/
    
};

Trigger.prototype = Object.create(Phaser.Sprite.prototype);
Trigger.prototype.constructor = Trigger;

Trigger.prototype.checkPlayerIntersection = function(ballX, ballY, ballR) {    
    if (intersectCircleCircle(this.x, this.y, this.width/2, ballX, ballY, ballR).result) {
        this.signal.dispatch('in');
        if (!this.playerIn) {
            this.playerIn = true;
            if (this.purpose!='start' && this.purpose!='finish') {
                if (this.frameName === 'out') {
                    this.frameName = 'down';
                } else {
                    this.frameName = 'out';
                }
            }
            //console.log('in dispatched');
        }        
    } else {
        
        if (this.playerIn) {
            //console.log('out dispatched');
            this.playerIn = false;
            this.signal.dispatch('out');
        }
    }
};

Trigger.prototype.assignBottomShadow = function(bottomShadow) {

    this.game.bottomShadowGroup.add(bottomShadow);
    this.shadows.push(bottomShadow);
};

Trigger.prototype.assignTopShadow = function(topShadow) {

    this.game.topShadowGroup.add(topShadow);
    this.shadows.push(topShadow);
};

Start = function(game, posX, posY) {
    Trigger.call(this, game, posX, posY, 'start');
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
};

Start.prototype = Object.create(Trigger.prototype);
Start.prototype.constructor = Start;

Finish = function(game, posX, posY) {
    Trigger.call(this, game, posX, posY, 'finish');
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.animations.add('main');
    this.animations.play('main', 10, true);
    switch (this.game.gameWorld) {
        case 'maze':
            this.tint = '0xfb0fc8';
            break;
        case 'lab':
            this.tint = '0xfbf30f';
            break;
        case 'brain':
            this.tint = '0x0ffbc6';
            break;
    }
};

Finish.prototype = Object.create(Trigger.prototype);
Finish.prototype.constructor = Finish;

Portal = function(game, posX, posY, color, mapId) {
    this.game = game;
    this.playerIn = false;
    this.inPortalSignal = new Phaser.Signal();
    this.outPortalSignal = new Phaser.Signal();
    Phaser.Sprite.call(this, game, posX*this.game.width, posY*this.game.height, 'portal');
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.rotation = - Math.PI/4;
    var animation = this.animations.add('main');
    animation.play(20, true);
    this.interactionRadius = this.width/2/1.4;
    //game.make.existing(this);

    switch (color) {
        case 'orange':                        
            tint = 0xff8c1d;            
            break;
        case 'yellow':                        
            tint = 0xfff40c;
            break;
        case 'blue':
            tint = 0x2f81ff;
            break;
        case 'green':
            tint = 0x53ff2c;
            break;
        case 'red':
            tint = 0xf53131;
            break;
        case 'purple':
            tint = 0xff17fb;
            break;
    }

    this.color = color;
    this.tint = tint;
    this.mapId = mapId;
};

Portal.prototype = Object.create(Phaser.Sprite.prototype);
Portal.prototype.constructor = Portal;

Portal.prototype.checkPlayerInPortal = function(ballX, ballY, ballR) {
    if (intersectCircleCircle(this.x, this.y, this.interactionRadius, ballX, ballY, ballR).result) {
        //console.log('intersection signal');
        //console.log(this.playerIn);
        if (!this.playerIn) {
            this.playerIn = true;
            //console.log('in portal signal dispatched');
            this.inPortalSignal.dispatch(this.color, this.mapId, this);
            // set timer that helps player to use portal when out signal is overdue
            /*this.overdueTimer = this.game.time.events.add(10000, function(){
                console.log('timer fired');
                this.playerIn = false;
                this.outPortalSignal.dispatch();
            }, this);*/
            //console.log(this);
        }        
    } else {
        if (this.playerIn) {
            //console.log('no intersection and player in');
            this.playerIn = false;
            this.outPortalSignal.dispatch();
            if (this.overdueTimer) this.game.time.events.remove(this.overdueTimer);
        }
    }
};

Bee = function(game, posX, posY, normal) {
    this.game = game;
    this.vel = new Phaser.Point();
    //console.log(this.vel);
    if (normal) {
        var key = 'bee';
    } else {
        var key = 'alienBee'
    }
    Phaser.Sprite.call(this, game, posX/configuration.canvasWidth*this.game.width, posY/configuration.canvasHeight*this.game.height, key);
    game.add.existing(this);
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.anchor.setTo(0.5, 0.5);
    this.vertices = [];
    this.vertices.push(new Phaser.Point(this.world.x -8*configuration.scaleRatio, this.world.y - 5*configuration.scaleRatio));
    this.vertices.push(new Phaser.Point(this.world.x -8*configuration.scaleRatio, this.world.y + 2*configuration.scaleRatio));
    this.vertices.push(new Phaser.Point(this.world.x +8*configuration.scaleRatio, this.world.y + 2*configuration.scaleRatio));
    this.vertices.push(new Phaser.Point(this.world.x +8*configuration.scaleRatio, this.world.y - 5*configuration.scaleRatio));
    
    this.stingRadius = Math.hypot(8*configuration.scaleRatio, 5*configuration.scaleRatio);
    this.killPlayerSignal = new Phaser.Signal();
    this.moveSignal = new Phaser.Signal();
    this.inBounce = false;
    this.additionalSpeed = new Phaser.Point();

    this.animations.add('main', ['1', '2'], 30, true);
    this.animations.play('main');
    // parameters for move processor
    this.moveDone = false;
    this.colliderType = 'circle';
    this.intent = new Phaser.Point();
    this.pushable = true;
    this.moving = true;
    this.interactionRadius = this.stingRadius;
    this.bounceIteraion = 0;
    this.holder = 'enemy';
    this.pushing = false;
    this.leftTarget = null;
    this.rightTarget = null;
    this.visionPolygon = null;

    this.shadowOffset = 20;
    this.shadows =[];    

    this.dispatchMove = true;

    var shadow1 = this.game.add.sprite(this.x + Math.cos(this.game.lightSources[0].angle(new Phaser.Point(1, 0)))*this.shadowOffset, 
        this.y + Math.sin(this.game.lightSources[0].angle(new Phaser.Point(1, 0)))*this.shadowOffset, 'beeShadow');
    shadow1.anchor.setTo(this.anchor.x, this.anchor.y);
    //shadow1.animations.add('main', ['1', '2'], 30, true);
    //shadow1.animations.play('main');
    //shadow1.tint = '0x000000';
    shadow1.alpha = 0.2;
    shadow1.scale.setTo(this.scale.x, this.scale.y);
    this.assignShadow(shadow1);

    /*var shadow2 = this.game.add.sprite(this.x + Math.cos(this.game.lightSources[1].angle(new Phaser.Point(1, 0)))*this.shadowOffset, 
        this.y + Math.sin(this.game.lightSources[1].angle(new Phaser.Point(1, 0)))*this.shadowOffset, this.key);
    shadow2.anchor.setTo(this.anchor.x, this.anchor.y);
    shadow2.animations.add('main', ['1', '2'], 30, true);
    shadow2.animations.play('main');
    shadow2.tint = '0x000000';
    shadow2.alpha = 0.2;
    shadow2.scale.setTo(this.scale.x, this.scale.y);
    this.assignShadow(shadow2);*/
};

Bee.prototype = Object.create(Phaser.Sprite.prototype);
Bee.prototype.constructor = Bee;

Bee.prototype.update = function() {
    /*this.game.debugGraphics.lineStyle(2, 0x00ff60, 1);
    this.game.debugGraphics.beginFill(0x00ff00);
    this.rightTarget.outerSegments.forEach(function(segment){
        this.game.debugGraphics.moveTo(segment[0].x, segment[0].y);
        this.game.debugGraphics.lineTo(segment[1].x+segment[0].x, segment[1].y+segment[0].y);
        this.game.debugGraphics.drawCircle(segment[0].x, segment[0].y, 8);
    }, this);
    this.leftTarget.outerSegments.forEach(function(segment){
        this.game.debugGraphics.moveTo(segment[0].x, segment[0].y);
        this.game.debugGraphics.lineTo(segment[1].x+segment[0].x, segment[1].y+segment[0].y);
        this.game.debugGraphics.drawCircle(segment[0].x, segment[0].y, 8);
    }, this);
    this.game.debugGraphics.endFill();

    if (this.visionPolygon) {
        this.game.debugGraphics.beginFill(0x0029ff, 0.5);
        this.game.debugGraphics.drawPolygon(this.visionPolygon.points);
        this.game.debugGraphics.endFill();
    }*/
};

Bee.prototype.calculateVel = function(intPoint) {
    //console.log('bees calc vel called');
    
    if (intPoint) {

        var radialVec = Phaser.Point.subtract(intPoint, new Phaser.Point(this.x, this.y));
        var bounceNormal = Phaser.Point.normalRightHand(radialVec).normalize();
        
        this.vel = calculateBounceVel(this.vel, bounceNormal, 0.5).clone();
        this.vel.add(this.additionalSpeed.x, this.additionalSpeed.y);

    } else {
        if (this.vel.getMagnitude()===0) {
            var velAngle = -10;//this.game.rnd.angle();
            var velMag = 2.0/configuration.canvasWidth*this.game.width;
            velAngle = velAngle*Math.PI/180;
            this.rotation = velAngle;
            this.vel = new Phaser.Point(velMag*Math.cos(velAngle), velMag*Math.sin(velAngle));            
            for (var v in this.vertices) {
                this.vertices[v].rotate(this.x, this.y, velAngle);
            }
            this.updateTargetWalls();
        }
        this.vel.add(this.additionalSpeed.x, this.additionalSpeed.y);
        this.additionalSpeed = new Phaser.Point();

        if (this.vel.getMagnitude()<2.0/configuration.canvasWidth*this.game.width) {

            this.vel.multiply(1.1, 1.1);

        } else if (this.vel.getMagnitude()>2.1/configuration.canvasWidth*this.game.width){

            this.vel.setMagnitude(2.0/configuration.canvasWidth*this.game.width);

        }        
    }

    this.shadows.forEach(function(shadow, index){
        shadow.position.set(this.x + Math.cos(this.game.lightSources[index].angle(new Phaser.Point(1, 0)))*this.shadowOffset, 
        this.y + Math.sin(this.game.lightSources[index].angle(new Phaser.Point(1, 0)))*this.shadowOffset);
        shadow.rotation = this.rotation;
    }, this);

    
};

Bee.prototype.impulseStepBack = function(intPoint) {
    //console.log('impulse step back called');
    var radialVec = Phaser.Point.subtract(intPoint, this.position);
    radialVec.normalize();

    this.x -= radialVec.x;
    this.y -= radialVec.y;
};

Bee.prototype.applyAddSpeed = function(addSpeed) {
    this.additionalSpeed = addSpeed.clone();
};

Bee.prototype.setVelocity = function(newVel) {
    this.vel.copyFrom(newVel);
};

Bee.prototype.move = function(){
    var prevRotation = this.rotation;
    this.position.add(this.vel.x*this.game.time.physicsElapsed*60, this.vel.y*this.game.time.physicsElapsed*60);  

    //if (this.vel.getMagnitude()>0.5) {
        var newRot = Math.atan2(this.vel.y, this.vel.x);
        this.vertices.forEach(function(item){
            item.x += this.vel.x;
            item.y += this.vel.y;
            item.rotate(this.x, this.y, newRot - this.rotation);
        }, this); 
        this.rotation = newRot;       
    //}

    this.dispatchMove = (!this.dispatchMove);

    if (this.dispatchMove) {
        this.moveSignal.dispatch(this.x, this.y, this.stingRadius, this);    
    }    

    if (Math.abs(this.rotation-prevRotation)>0.1*Math.PI/180) {
        this.updateTargetWalls();
    }

};

Bee.prototype.sting = function(ballX, ballY, ballR) {
    var ballPos = new Phaser.Point(ballX, ballY);
    var distance = Phaser.Point.distance(this.position, ballPos);
    if (distance < this.stingRadius + ballR) {
        //console.log('bee close distance');
        if (intersectRectCircleSk(this.vertices, ballX, ballY, ballR).result) {
            this.stingSignal.dispatch();
            //console.log('bee signal dispatched');
        }
    }
};

Bee.prototype.crush = function() {
    this.destroy();
};

Bee.prototype.assignShadow = function(bottomShadow) {

    this.game.bottomShadowGroup.add(bottomShadow);
    this.shadows.push(bottomShadow);
};

Bee.prototype.updateTargetWalls = function() {
    var target = this.findTargetWall();
    this.rightTarget = target[0];
    this.leftTarget = target[1];
}

Bee.prototype.findTargetWall = function() {
    // find marginal points on the ball's circle
    //console.log('find target wall called');
    var rightPoint = Phaser.Point.normalRightHand(this.vel),
        leftPoint = Phaser.Point.negative(rightPoint),
        rightTarget = null,
        leftTarget = null,
        walls = this.game.wallsSG.children;

    rightPoint.setMagnitude(this.interactionRadius);
    leftPoint.setMagnitude(this.interactionRadius);

    rightPoint.add(this.position.x, this.position.y);
    leftPoint.add(this.position.x, this.position.y);

    // set velocity ray
    var maxDistance = Math.sqrt(Math.pow(this.game.height, 2)+Math.pow(this.game.width, 2)),
        velRay = new Phaser.Point(maxDistance*Math.cos(this.rotation), maxDistance*Math.sin(this.rotation)),
        rightCurrentDistance = maxDistance,
        leftCurrentDistance = maxDistance;

    //console.log(velRay);

    // check all the walls on intersection with the vel ray
    for (var wall in walls) {

        for (var seg in walls[wall].outerSegments) {
            var wallSegment = walls[wall].outerSegments[seg],
                intersectionResultRight = intersectSegSeg(rightPoint, velRay, wallSegment[0], wallSegment[1]),
                intersectionResultLeft = intersectSegSeg(leftPoint, velRay, wallSegment[0], wallSegment[1]);
                //intersectionResultCenter = intersectSegRectSkwp([this.position, velRay], walls[wall].edges.vertices);

            //console.log(intersectionResultRight);
            //console.log(intersectionResultLeft);

            if (intersectionResultRight.result) {
                if (intersectionResultRight.intPoint.distance(rightPoint)<rightCurrentDistance) {
                    rightCurrentDistance = intersectionResultRight.intPoint.distance(rightPoint);
                    /*if (rightTarget) {
                        if (notInnerWallsIDs.indexOf(rightTarget.id)<0){
                            notInnerWallsIDs.push(rightTarget.id);
                        }
                    }*/
                    rightTarget = walls[wall];
                }
            }

            if (intersectionResultLeft.result) {
                if (intersectionResultLeft.intPoint.distance(leftPoint)<leftCurrentDistance) {
                    leftCurrentDistance = intersectionResultLeft.intPoint.distance(leftPoint);
                    /*if (leftTarget) {
                        if (notInnerWallsIDs.indexOf(leftTarget.id)<0){
                            notInnerWallsIDs.push(leftTarget.id);
                        }
                    }*/
                    leftTarget = walls[wall];
                }
            }

            /*if (intersectionResultCenter.result) {
                if (intersectionResultCenter.intPoint.distance(this.position)<centerCurrentDistance) {
                    centerCurrentDistance = intersectionResultCenter.intPoint.distance(this.position);
                    if (centerTarget) {
                        if (notInnerWalls.indexOf(centerTarget)<0){
                            notInnerWalls.push(centerTarget);
                        }
                    }
                    centerTarget = walls[wall];
                }
            }*/
        }
    }

    /*var polygonHeightVec = Phaser.Point.subtract(leftPoint, rightPoint),
        polygonWidthLeftVec = velRay.clone().setMagnitude(leftCurrentDistance),
        polygonWidthRightVec = velRay.clone().setMagnitude(rightCurrentDistance),
        ver1 = leftPoint,
        ver2 = rightPoint,
        ver3 = Phaser.Point.add(rightPoint, polygonWidthRightVec),
        ver4 = Phaser.Point.add(leftPoint, polygonWidthLeftVec);
    this.visionPolygon = new Phaser.Polygon([ver1, ver2, ver3, ver4]);*/

    //this.game.debugGraphics.clear();
    /*this.game.debugGraphics.beginFill(0x0034ff, 0.5);
    this.game.debugGraphics.drawPolygon(visionPolygon.points);
    this.game.debugGraphics.endFill();*/
    
    //this.targetFound = true;       


    return [rightTarget, leftTarget];
};

WormHole = function(game, posX, posY) {
    this.game = game;
    /*var graphics = game.make.graphics(0, 0);
    graphics.beginFill(0xffffff);
    graphics.drawCircle(20, 20, 40);
    graphics.endFill();   */

    Phaser.Sprite.call(this, game, posX*this.game.width, posY*this.game.height, 'wormHole', 'empty');
    game.add.existing(this);
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.anchor.setTo(0.5, 0.5);

    //move processor parameters
    this.interactionRadius = this.width/2;
    this.moveDone = false;
    this.colliderType = 'circle';
    this.pushable = false;
    this.pushing = false;
    this.moving = false;
    this.vel = new Phaser.Point();

    this.shadows = [];    

    var shadowImageName1 = shadowGenerator.generateSpotBottomShadow(this.game, this.position, 
        this.interactionRadius, this.game.lightSources[0]);
    /*var shadowImageName2 = shadowGenerator.generateSpotBottomShadow(this.game, this.position, 
        this.interactionRadius, this.game.lightSources[1]);        */

    var shadow1 = this.game.add.sprite(this.x, this.y, shadowImageName1);
    shadow1.anchor.setTo(0.5, 0.5);
    this.assignBottomShadow(shadow1);

    /*var shadow2 = this.game.add.sprite(this.x, this.y, shadowImageName2);
    shadow2.anchor.setTo(0.5, 0.5);
    this.assignBottomShadow(shadow2);*/

    var shadowImageName3 = shadowGenerator.generateSpotTopShadow(this.game, this.position, 
        this.interactionRadius, this.game.lightSources[0]);
    /*var shadowImageName4 = shadowGenerator.generateSpotTopShadow(this.game, this.position, 
        this.interactionRadius, this.game.lightSources[1]);        */

    var shadow3 = this.game.add.sprite(this.x, this.y, shadowImageName3);
    shadow3.anchor.setTo(0.5, 0.5);
    this.assignTopShadow(shadow3);

    /*var shadow4 = this.game.add.sprite(this.x, this.y, shadowImageName4);
    shadow4.anchor.setTo(0.5, 0.5);
    this.assignTopShadow(shadow4);*/

};

WormHole.prototype = Object.create(Phaser.Sprite.prototype);
WormHole.prototype.constructor = WormHole;

WormHole.prototype.calculateVel = function() {

};

WormHole.prototype.setVelocity = function() {

};

WormHole.prototype.assignBottomShadow = function(bottomShadow) {

    this.game.bottomShadowGroup.add(bottomShadow);
    this.shadows.push(bottomShadow);
};

WormHole.prototype.assignTopShadow = function(topShadow) {

    this.game.topShadowGroup.add(topShadow);
    this.shadows.push(topShadow);
};

Worm = function(game, timeInterval) {
    this.game = game;
    this.holes = [];
    this.targets = {};
    this.currentHoleNum = 0;
    this.launched = false;
    this.iter = 0;
    this.iterArray = [];
    this.eatBallSignal = new Phaser.Signal();
    this.playerOnTrigger = false;
    this.turnedOn = false;
    this.timeInterval = timeInterval;
    this.sections = [];

    this.tweenDurations = [];
    // speed in pixels per ms
    this.flySpeed = 10*60/1000;
    this.directions = [];

    Phaser.Group.call(this, game);
    game.add.existing(this);

    

};

Worm.prototype = Object.create(Phaser.Group.prototype);
Worm.prototype.constructor = Worm;

Worm.prototype.assingHoles = function(holes) {
    this.holes = holes.slice();

    for (var h in this.holes) {
        this.holes[h].worm = this;
    }

    this.holes[this.currentHoleNum].frameName = 'full';

    for (var s=0; s<5; s++) {
        if (s === 0) {
            var section = new WormSectionHead(this.game, this.holes[0].x, this.holes[0].y);    
        } else if (s===14) {
            var section = new WormSectionTail(this.game, this.holes[0].x, this.holes[0].y);    
        } else {
            var section = new WormSection(this.game, this.holes[0].x, this.holes[0].y);    
        }
        this.sections.push(section);
        this.add(section);
    }
    // assing next section
    this.sections.forEach(function(section, index, arr){
        if (index<arr.length-1) {
            section.nextSection = arr[index+1];
        } else {
            section.nextSection = null;
        }
    }, this);
    this.bringToTop(this.sections[0]);
    //create vertex retangle for collions
    this.updateVertices(0);

};

Worm.prototype.defineTrajectories = function() {
    var stepMag = 13;
    for (var h in this.holes) {
        var cHolePos = new Phaser.Point(this.holes[h].x, this.holes[h].y);

        if (Number(h)<this.holes.length-1) {
            var nHolePos = new Phaser.Point(this.holes[Number(h)+1].x, this.holes[Number(h)+1].y);
        } else {
            var nHolePos = new Phaser.Point(this.holes[0].x, this.holes[0].y);
        }

        var angle = cHolePos.angle(nHolePos);

        var length = cHolePos.distance(nHolePos);

        var tangStep = Phaser.Point.subtract(nHolePos, cHolePos);
        tangStep.setMagnitude(stepMag);

        var cPoint = new Phaser.Point(cHolePos.x, cHolePos.y);
        this.targets[h] = [];

        var iterNum = 0;

        while (cPoint.distance(nHolePos)>=stepMag) {
            //var scale = 0.4 + Math.sin(cPoint.distance(nHolePos)/length*Math.PI)*0.6;            
            var scale = 0.3 + 0.7*Math.exp(-Math.pow((cPoint.distance(nHolePos) - length/2.0), 2)/(length*length/9));
            //console.log(Math.exp(-Math.pow((cPoint.distance(nHolePos) - length/2.0), 2)/(length*length)));
            this.targets[h].push([cPoint.clone(), angle, scale]);            
            cPoint.add(tangStep.x, tangStep.y);
            //console.log('c point ' + cPoint);
            iterNum ++;
        }
        this.targets[h].push([nHolePos.clone(), angle, 0.4]);
        iterNum++;

        this.iterArray.push(iterNum);
    }
    //console.log(this.targets);
};

Worm.prototype.defineTweenDurations = function() {
    for (h in this.holes) {
        var nextHole = (Number(h)<this.holes.length-1) ? this.holes[Number(h)+1] : this.holes[0],
            distanceToNext = this.holes[h].position.distance(nextHole.position),
            timeToNext = distanceToNext/this.flySpeed
            angle = this.holes[h].position.angle(nextHole.position);

        this.tweenDurations[h] = timeToNext;
        this.directions[h] = angle;
    }
};

Worm.prototype.launch = function() {
    if (this.turnedOn && !this.launched && this.game) {
        this.wormCall = this.game.time.events.add(this.timeInterval, function(){
            this.launched = true;
            if (this.game) {
                this.wormIntersectionCall = this.game.time.events.add(150, this.intersectionCheck, this);    
            }            
        }, this);
    }
};

Worm.prototype.intersectionCheck = function() {
    if (this.launched && this.game) {
        if (intersectRectCircleSk(this.vertices, this.game.currentBallCoord[0].x, this.game.currentBallCoord[0].y, this.game.currentBallCoord[1]).result) {
            this.eatBallSignal.dispatch();
        } else {
            this.wormIntersectionCall = this.game.time.events.add(150, this.intersectionCheck, this);
        }
    }
};

Worm.prototype.switch = function(status){
    if (status==='in') {
        if (!this.playerOnTrigger) {
            if (this.turnedOn) {
                this.turnedOn = false;
            } else {
                this.turnedOn = true;
                this.launch();
            }
            this.playerOnTrigger = true
        }
    } else {
        this.playerOnTrigger = false;
    }    
};

Worm.prototype.update = function(){
    if (this.launched && !this.game.gameOnPause) {
        if (this.iter === 0) {
            audioPlayer.playOneTime('worm');
            this.holes.forEach(function(hole){
                hole.frameName = 'empty';
            }, this);
            var nextPos = (this.currentHoleNum<this.holes.length-1)? this.holes[this.currentHoleNum+1].position.clone(): this.holes[0].position.clone(),
                angle = this.directions[this.currentHoleNum],
                duration = this.tweenDurations[this.currentHoleNum];

            this.sections[0].launchSection(nextPos, angle, duration, this);
        }                
        
        this.iter++;
        this.updateVertices(this.directions[this.currentHoleNum]);
        
    }
};

Worm.prototype.updateVertices = function(angle) {
    var lastSec = this.sections[this.sections.length-1];
    var firstSec = this.sections[0];
    var lastSecPos = lastSec.position.clone();
    var firstSecPos = firstSec.position.clone();

    var vertex1 = Phaser.Point.add(lastSecPos, new Phaser.Point(-lastSec.width/2, -lastSec.height/2));
    var vertex2 = Phaser.Point.add(lastSecPos, new Phaser.Point(-lastSec.width/2, lastSec.height/2));
    var vertex3 = Phaser.Point.add(firstSecPos, new Phaser.Point(firstSec.width/2, -firstSec.height/2));
    var vertex4 = Phaser.Point.add(firstSecPos, new Phaser.Point(firstSec.width/2, firstSec.height/2));

    vertex1.rotate(lastSecPos.x, lastSecPos.y, angle);
    vertex2.rotate(lastSecPos.x, lastSecPos.y, angle);
    vertex3.rotate(firstSecPos.x, firstSecPos.y, angle);
    vertex4.rotate(firstSecPos.x, firstSecPos.y, angle);

    this.vertices = [vertex1, vertex2, vertex3, vertex4];

    /*if (!this.auxSpritesGroup) {
        this.auxSpritesGroup = this.game.add.group();

        var graphics = this.game.make.graphics(0, 0);
        graphics.beginFill(0x00ff00);
        graphics.drawCircle(5, 5, 10);
        graphics.endFill();

        for (var v in this.vertices) {
            var auxSprite = this.auxSpritesGroup.create(this.vertices[v].x, this.vertices[v].y, graphics.generateTexture());
            auxSprite.anchor.setTo(0.5, 0.5);
        }
    } else {
        for (var i = 0; i<this.auxSpritesGroup.children.length; i++) {
            this.auxSpritesGroup.children[i].position.set(this.vertices[i].x, this.vertices[i].y);
        }
    }*/
};

WormSection = function(game, posX, posY, manualShadowAssingment) {
    manualShadowAssingment = manualShadowAssingment || false;
    this.game = game;
    Phaser.Sprite.call(this, game, posX, posY, 'wormSection');
    game.add.existing(this);

    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.alpha = 0;

    this.nextSection = null;

    /*if (!manualShadowAssingment) {
        this.createShadows();
    }*/    
};

WormSection.prototype = Object.create(Phaser.Sprite.prototype);
WormSection.prototype.constructor = WormSection;

WormSection.prototype.createShadows = function() {
    this.shadowOffset = 20;
    this.shadows =[];    

    var shadow1 = this.game.add.sprite(this.x + Math.cos(this.game.lightSources[0].angle(new Phaser.Point(1, 0)))*this.shadowOffset, 
        this.y + Math.sin(this.game.lightSources[0].angle(new Phaser.Point(1, 0)))*this.shadowOffset, this.key);
    shadow1.anchor.setTo(this.anchor.x, this.anchor.y);
    shadow1.tint = '0x000000';
    shadow1.alpha = 0;
    shadow1.scale.setTo(this.scale.x, this.scale.y);
    this.assignShadow(shadow1);

    /*var shadow2 = this.game.add.sprite(this.x + Math.cos(this.game.lightSources[1].angle(new Phaser.Point(1, 0)))*this.shadowOffset, 
        this.y + Math.sin(this.game.lightSources[1].angle(new Phaser.Point(1, 0)))*this.shadowOffset, this.key);
    shadow2.anchor.setTo(this.anchor.x, this.anchor.y);
    shadow2.tint = '0x000000';
    shadow2.alpha = 0;
    shadow2.scale.setTo(this.scale.x, this.scale.y);
    this.assignShadow(shadow2);*/
};

WormSection.prototype.assignShadow = function(bottomShadow) {

    this.game.bottomShadowGroup.add(bottomShadow);
    this.shadows.push(bottomShadow);
};

WormSection.prototype.moveAndScaleShadows = function() {
    this.shadows.forEach(function(shadow, index){

        shadow.position.set(this.position.x + Math.cos(this.game.lightSources[index].angle(new Phaser.Point(1, 0)))*this.shadowOffset,
            this.position.y + Math.sin(this.game.lightSources[index].angle(new Phaser.Point(1, 0)))*this.shadowOffset);

        shadow.rotation = this.rotation;
        shadow.width = this.width;
        shadow.height = this.height;

        if (this.alpha === 0) shadow.alpha = 0;
        else shadow.alpha = 0.2;

    }, this);
};

WormSection.prototype.launchSection = function(target, angle, duration, worm) {

    if (this.game) {
    
        this.rotation = angle;
        //launchingSection.position = this.holes[this.currentHoleNum].position.clone();
        this.alpha = 1;
        this.scale.setTo(0.5, 0.5);    
        this.posTween = this.game.add.tween(this).to({x: target.x, y:target.y}, duration, Phaser.Easing.Linear.None, true);
        this.scaleTween = this.game.add.tween(this.scale).to({x: 1.5, y: 1.5}, duration/2, Phaser.Easing.Linear.None, true).yoyo(true);
        this.posTween.onComplete.add(function(){
            this.alpha = 0;
        }, this);
        if (this.nextSection) {
            this.game.time.events.add(40, this.nextSection.launchSection, this.nextSection, target, angle, duration, worm);
        } else {
            this.posTween.onComplete.add(function(){
                this.iter = 0;
                if (this.currentHoleNum<this.holes.length-1) {
                    this.currentHoleNum++;
                } else {
                    this.currentHoleNum = 0;
                }
                this.holes[this.currentHoleNum].frameName = 'full';
                this.launched = false;
                this.launch();
            }, worm);
        }
    }

};

WormSectionHead = function(game, posX, posY) {
    this.game = game;
    WormSection.call(this, game, posX, posY, true);
    game.add.existing(this);

    this.anchor.setTo(0.2, 0.5);
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.loadTexture('wormHead');
    this.alpha = 0;
    //this.createShadows();
};

WormSectionHead.prototype = Object.create(WormSection.prototype);
WormSectionHead.prototype.constructor = WormSectionHead;

WormSectionTail = function(game, posX, posY) {
    this.game = game;
    WormSection.call(this, game, posX, posY, true);
    game.add.existing(this);

    this.anchor.setTo(1, 0.5);
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.loadTexture('wormTail');
    this.alpha = 0;
    //this.createShadows();
};

WormSectionTail.prototype = Object.create(WormSection.prototype);
WormSectionTail.prototype.constructor = WormSectionTail;

ElectricArcSection = function(game, point1, point2, nextSection) {
    this.game = game;
    this.nextSection = nextSection;
    Phaser.Sprite.call(this, game, point1.x, point1.y, 'electricSection');
    game.add.existing(this);
    this.anchor.setTo(0.1, 0.5);

    this.updateSecondPoint(point2);
};

ElectricArcSection.prototype = Object.create(Phaser.Sprite.prototype);
ElectricArcSection.prototype.constructor = ElectricArcSection;

ElectricArcSection.prototype.updateSecondPoint = function(point2) {
    //console.log(point2);
    this.rotation = Phaser.Point.angle(point2, this.position);
    this.width = this.position.distance(point2)/0.8;
    //console.log(this.rotation);
    this.point2 = point2.clone();
    if (this.nextSection) {
        this.nextSection.updateFirstPoint(this.point2);    
    }    
};

ElectricArcSection.prototype.updateFirstPoint = function(point1) {
    this.position.set(point1.x, point1.y);
    //console.log(this.point2);
    this.updateSecondPoint(this.point2);
};

ElectricArc = function(game, electrode1Pos, electrode2Pos) {
    this.game = game;

    var tangVec = Phaser.Point.subtract(electrode2Pos, electrode1Pos);
    tangVec.setMagnitude(this.game.cache.getImage('electrode').width/8*configuration.scaleRatio);
    this.firstPos = Phaser.Point.add(electrode1Pos, tangVec);

    tangVec.setMagnitude(-this.game.cache.getImage('electrode').width/8*configuration.scaleRatio);
    this.secondPos = Phaser.Point.add(electrode2Pos, tangVec);

    this.length = this.firstPos.distance(this.secondPos);
    /*this.tangVec = Phaser.Point.subtract(electrode2Pos, electrode1Pos);
    this.nSections = Math.floor(this.tangVec.getMagnitude()/40);
    this.tangStepVec = this.tangVec.clone().multiply(1/this.nSections, 1/this.nSections);
    this.unitNormVec = Phaser.Point.normalRightHand(this.tangStepVec).normalize();*/

    this.turnedOn = false;
    this.connected = true;
    this.playerOnTrigger = false;
    this.vertices = [];
    //define vertices for collider
    this.vertices.push(new Phaser.Point(0, -10*configuration.scaleRatio));
    this.vertices.push(new Phaser.Point(0, 10*configuration.scaleRatio));
    this.vertices.push(new Phaser.Point(this.firstPos.distance(this.secondPos), 10*configuration.scaleRatio));
    this.vertices.push(new Phaser.Point(this.firstPos.distance(this.secondPos), -10*configuration.scaleRatio));

    var angle = Phaser.Point.angle(this.secondPos, this.firstPos);
    this.vertices.forEach(function(item){
        item.rotate(0, 0, angle);
        item.add(this.firstPos.x, this.firstPos.y);
    }, this);

    /*var spriteSheetName = lightningAnimation.generateAnimation(this.game, 20*configuration.scaleRatio, this.firstPos.distance(this.secondPos));

    Phaser.Sprite.call(this, game, this.firstPos.x, this.firstPos.y, spriteSheetName);*/
    Phaser.Sprite.call(this, game, this.firstPos.x, this.firstPos.y, 'lightning');
    game.add.existing(this);
    this.crop(new Phaser.Rectangle(0, 0, 35, this.firstPos.distance(this.secondPos)));
    this.updateCrop();
    this.anchor.setTo(0.5, 0);
    this.rotation = angle-Math.PI/2;
    this.alpha = 0;
    this.animations.add('main');
    this.animations.play('main', 24, true);
    
    
};

ElectricArc.prototype = Object.create(Phaser.Sprite.prototype);
ElectricArc.prototype.constructor = ElectricArc;

ElectricArc.prototype.switch = function(status){
    if (status==='in') {
        if (!this.playerOnTrigger) {
            if (this.turnedOn) {
                this.turnedOn = false;
            } else {
                this.turnedOn = true;
            }
            this.playerOnTrigger = true
        }
    } else {
        this.playerOnTrigger = false;
    }    
};

ElectricArc.prototype.shiver = function() {
    //console.log('shiver called');
    //old shiver version
    /*if (this.turnedOn && this.connected) {
        var pointsCopy = [];
        this.points.forEach(function(item){
            pointsCopy.push(item.clone());
        }, this);
        for (var p=1; p<this.nSections; p++){
            var shiver = this.game.rnd.normal()*3;
            pointsCopy[p].add(this.unitNormVec.x*shiver, this.unitNormVec.y*shiver);
        }
        for (var sec=0; sec<this.children.length-1; sec++) {
            //previousle sections were added in reverse order
            this.children[this.children.length-1 - sec].updateSecondPoint(pointsCopy[sec+1]);
            //console.log(sec);
        }
    }*/

    this.bmd.cls();

    var sectionWidth = Math.floor(this.textureSprite.width) - 2;
    var randomPhase = this.game.rnd.realInRange(0, Math.PI);

    for (var x = 0; x<this.bmd.width - sectionWidth; x+=sectionWidth) {

        //var outset = this.game.rnd.between(-Math.round((this.bmd.height - this.textureSprite.height)/2), Math.round((this.bmd.height - this.textureSprite.height)/2));
        var outset = Math.sin(x/this.bmd.width*Math.PI*4 + randomPhase) * 3 * configuration.scaleRatio;
        //add a little random shift
        //outset += this.game.rnd.between(-Math.round((this.bmd.height - this.textureSprite.height)/8), Math.round((this.bmd.height - this.textureSprite.height)/8));
        //outset += this.game.rnd.normal()*(this.bmd.height - this.textureSprite.height)/8;

        this.bmd.draw(this.textureSprite, x, this.bmd.height/2 + outset, this.textureSprite.width, this.textureSprite.height);
    }

    var lastWidth = this.bmd.width - x;

    //this.bmd.copyRect(this.textureSprite, new Phaser.Rectangle(0, 0, lastWidth, this.textureSprite.height), x, this.bmd.height/2);
    this.bmd.draw(this.textureSprite, x, this.bmd.height/2, this.textureSprite.width, this.textureSprite.height);

    this.bmd.render();

};

ElectricArc.prototype.redefinePoints = function(){
    if (this.turnedOn && this.connected) {
        this.points = [];
        this.points.push(this.firstPos);
        //var cPoint = this.firstPoint.clone();
        for (var p = 1; p<this.nSections; p++) {
            var cPoint = Phaser.Point.add(this.firstPos, this.tangStepVec.clone().multiply(p, p));
            var offset = this.game.rnd.normal() * 7;
            cPoint.add(this.unitNormVec.x*offset, this.unitNormVec.y*offset);
            this.points.push(cPoint);
        }
        this.points.push(this.secondPos);    
    }    
};

// ElectricArcsGroup = function(game, electrode1Pos, electrode2Pos, N) {
ElectricArcsGroup = function(game, electrodesPos, N) {
    this.game = game;
    this.electrodesPos = electrodesPos;
    //this.firstPos = electrode1Pos;
    //this.secondPos = electrode2Pos;
    Phaser.Group.call(this, game);
    game.add.existing(this);    

    this.electrodes = [];
    var electrodesColor = wallsPicker.giveWall(this.game, 'lab', 'electrode');

    electrodesPos.forEach(function(elecPos){
        var electrode = new Electrode(this.game, elecPos[0]/configuration.canvasWidth*this.game.width, elecPos[1]/configuration.canvasHeight*this.game.height, electrodesColor);
        this.add(electrode);
        this.add(electrode.discharge);
        this.electrodes.push(electrode);
    }, this);
    this.electrodesArcsArray = [];

    this.electrodesArcsArray = this.createElecrodesArcsArray(this.electrodes);
    this.electrodesArcsArray.sort(function(a, b){
        if (a[1].length<b[1].length) {
            return -1;
        } else {
            return 1;
        }
    });

    this.shockSignal = new Phaser.Signal();
    this.statusSignal = new Phaser.Signal();

    this.turnedOn = false;
    this.connected = true;
    this.playerOnTrigger = false;
    this.activePairIndex = 0;    
    this.vertices = [];

   

    /*this.vertices.forEach(function(vertex){
        var graph = this.game.make.graphics(0, 0);
        graph.beginFill(0x00ff00);
        graph.drawCircle(3, 3, 6);
        graph.endFill();

        var cir = this.create(vertex.x, vertex.y, graph.generateTexture());
        cir.anchor.setTo(0.5, 0.5);
        cir.switch = function() {};
    }, this);*/
};

ElectricArcsGroup.prototype = Object.create(Phaser.Group.prototype);
ElectricArcsGroup.prototype.constructor = ElectricArcsGroup;

ElectricArcsGroup.prototype.createElecrodesArcsArray = function(electrodes) {

    var electrodesPairs = this.findAllPairs(electrodes),
        electrodesArcsArray = [];

    electrodesPairs.forEach(function(pair){       

        var electricArc = new ElectricArc(this.game, pair[0].position, pair[1].position);
        this.add(electricArc);

        electrodesArcsArray.push([pair, electricArc]);
    }, this);

    return electrodesArcsArray;
    
};

ElectricArcsGroup.prototype.findAllPairs = function(array) {
    //console.log('findAllPairs');
    var allPairs = [],
        arrayCopy = array.slice();

    var firstElem = arrayCopy.shift();
    for (var i = 0; i<arrayCopy.length; i++) {
        allPairs.push([firstElem, arrayCopy[i]])
    }

    if (array.length>2) {
        allPairs = allPairs.concat(this.findAllPairs(arrayCopy));
    }  

    //console.log(allPairs);

    return allPairs;
};

ElectricArcsGroup.prototype.switch = function(status) {
    /*this.turnedOn = true;
    this.forEach(function(item){
        item.switch(status);
        if (item.__proto__.constructor === ElectricArc) {
            this.turnedOn = this.turnedOn && item.turnedOn;
        }
    }, this);*/
    if (status==='in' || status==='initial') {
        if (!this.playerOnTrigger) {
            if (this.turnedOn) {
                this.turnedOn = false;
                //this.discharge.alpha = 0;
            } else {
                this.turnedOn = true;
                //this.discharge.alpha = 1;
            }
            if (status==='in') this.playerOnTrigger = true;
        }
    } else if(status==='out'){
        this.playerOnTrigger = false;
    }
    this.checkWorkingConditions();
};

ElectricArcsGroup.prototype.checkWorkingConditions = function() {  
    //console.log('check working conditions called');
    if (this.turnedOn && this.connected) {        

        for (var i in this.electrodesArcsArray) {
            if (i != this.activePairIndex && this.electrodesArcsArray[i][1].alpha > 0) {
                this.electrodesArcsArray[i][0][0].discharge.animations.stop('main');
                this.electrodesArcsArray[i][0][0].discharge.alpha = 0;
                this.electrodesArcsArray[i][0][1].discharge.animations.stop('main');
                this.electrodesArcsArray[i][0][1].discharge.alpha = 0;

                this.electrodesArcsArray[i][1].alpha = 0;                
            }
        }

        if (this.electrodesArcsArray[this.activePairIndex][1].alpha==0) {
            var activeElectrode1 = this.electrodesArcsArray[this.activePairIndex][0][0],
                activeElectrode2 = this.electrodesArcsArray[this.activePairIndex][0][1],
                activeArc = this.electrodesArcsArray[this.activePairIndex][1];

            activeElectrode1.orientDischarge(activeElectrode2.position);
            activeElectrode2.orientDischarge(activeElectrode1.position);
            activeArc.alpha = 1;

            activeElectrode1.turnedOn = true;
            activeElectrode2.turnedOn = true;
            this.vertices = activeArc.vertices;
            this.statusSignal.dispatch('on');
            //console.log('on electric sound dispatched');
        }

    } else {
        this.forEach(function(item){
            if (item.__proto__.constructor === ElectricArc) {
                item.alpha = 0;
                //console.log('arc to transperat');
            } else if (item.__proto__.constructor === Electrode){
                //item.turnedOn = false;
                //console.log('all discharge to transperat');
                if (item.discharge.alpha >0) {
                    item.discharge.alpha = 0;
                    item.discharge.animations.stop('main');
                }
                
            }
        }, this);
        this.statusSignal.dispatch('off');
    }
};

ElectricArcsGroup.prototype.shockPlayer = function(ballX, ballY, ballR) {
    //console.log(this.vertices);
    if (intersectRectCircleSk(this.vertices, ballX, ballY, ballR).result && this.turnedOn && this.connected) {
        this.shockSignal.dispatch();
    }
};

ElectricArcsGroup.prototype.checkConnection = function() {
    //console.log('check connection called');
    if (this.game) {
        var walls = this.game.wallsSG.children.slice();  
        for (var i in this.electrodesArcsArray) {          
            var connected = true;
            var arc = this.electrodesArcsArray[i][1];
            var connectionSeg = [arc.firstPos, Phaser.Point.subtract(arc.secondPos, arc.firstPos)];
            for (var w in walls) {
                for (e in walls[w].edges) {
                    var edge = walls[w].edges[e];
                    var intersectionRes = intersectSegRectSk(connectionSeg, edge.vertices).result;
                    connected = connected && (!intersectionRes);
                }
            }

            if (connected) {
                this.activePairIndex = Number(i);
                //console.log(this.activePairIndex);
                break;
            }

        }
        if (this.connected != connected) {
            this.connected = connected;
            //this.manageConnection();
        }
        this.checkWorkingConditions();
    }
};

ElectricArcsGroup.prototype.manageConnection = function() {
    this.forEach(function(arc){
        arc.connected = this.connected;
    }, this);
};

ElectricArcsGroup.prototype.disposeTimedEvents = function() {
    this.forEach(function(arc){
        if (arc.__proto__.constructor===ElectricArc) {
            this.game.time.events.remove(arc.shiverEvent);
            this.game.time.events.remove(arc.pointsEvent);
        }
    }, this);
};

Electrode = function(game, posX, posY, electrodeColor) {
    this.game = game;
    Phaser.Sprite.call(this, game, posX, posY, 'electrode', electrodeColor);
    game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.playerOnTrigger = false;
    this.turnedOn = false;
    //set discharge center
    this.discharge = this.game.add.sprite(this.right, this.y, 'electricDischarge');
    this.discharge.anchor.setTo(1, 0.5);
    this.discharge.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.discharge.alpha = 0;
    this.discharge.animations.add('main', ['1', '2'], 12, true);
    //this.tint = 0xffaaaa;
    //this.alpha = 0.7;
    //move processor parameters
    this.interactionRadius = this.width/2;
    this.moveDone = false;
    this.colliderType = 'circle';
    this.pushable = false;
    this.pushing = false;
    this.moving = false;
    this.vel = new Phaser.Point();
    this.shadows = [];

    /*var shadowOffset = 5;
    this.shadow = this.game.add.sprite(posX+shadowOffset, posY+shadowOffset, 'electrode');
    this.shadow.anchor.setTo(0.5, 0.5);
    this.shadow.tint = '0x000000';
    this.shadow.alpha = 0.5;
    this.game.bottomShadowGroup.add(this.shadow);*/

    var shadowImageName1 = shadowGenerator.generateSphereShadow(this.game, this.position, 
        this.interactionRadius, this.game.lightSources[0]);
    /*var shadowImageName2 = shadowGenerator.generateSphereShadow(this.game, this.position, 
        this.interactionRadius, this.game.lightSources[1]);        */

    var shadow1 = this.game.add.sprite(this.x, this.y, shadowImageName1);
    shadow1.anchor.setTo(0.5, 0.5);
    this.assignShadow(shadow1);

    /*var shadow2 = this.game.add.sprite(this.x, this.y, shadowImageName2);
    shadow2.anchor.setTo(0.5, 0.5);
    this.assignShadow(shadow2);*/
};

Electrode.prototype = Object.create(Phaser.Sprite.prototype);
Electrode.prototype.constructor = Electrode;

Electrode.prototype.switch = function(status){
    /*console.log('switch in electrode');
    if (status==='in') {
        if (!this.playerOnTrigger) {
            if (this.turnedOn) {
                this.turnedOn = false;
                this.discharge.alpha = 0;
            } else {
                this.turnedOn = true;
                this.discharge.alpha = 1;
            }
            this.playerOnTrigger = true;
        }
    } else {
        this.playerOnTrigger = false;
    }*/
};

Electrode.prototype.orientDischarge = function(point) {
    var toPointVec = Phaser.Point.subtract(point, this.position);
    toPointVec.setMagnitude(this.width/2);

    var dischargePos = Phaser.Point.add(toPointVec, this.position);
    this.discharge.position.set(dischargePos.x, dischargePos.y);
    this.discharge.rotation = toPointVec.angle(new Phaser.Point()) - Math.PI;
    this.discharge.animations.play('main');
    this.discharge.alpha = 1;
};

Electrode.prototype.assignShadow = function(bottomShadow) {
    
    this.game.bottomShadowGroup.add(bottomShadow);
    this.shadows.push(bottomShadow);    
};

Electrode.prototype.setVelocity = function() {

};

Fan = function(game, position, angle) {
    this.game = game;

    Phaser.Sprite.call(this, game, position.x, position.y, 'fan');
    game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.rotation = angle - Math.PI/2;

    this.pos1 = new Phaser.Point(this.height/2*0.8, 0);
    this.pos2 = new Phaser.Point(-this.height/2*0.8, 0);

    this.pos1.rotate(0, 0, angle);
    this.pos2.rotate(0, 0, angle);

    this.pos1.add(position.x, position.y);
    this.pos2.add(position.x, position.y);

    this.flowNorm = Phaser.Point.subtract(this.pos2, this.pos1);
    this.flowTang = Phaser.Point.normalRightHand(this.flowNorm).normalize();
    this.flowAcc = 1;
    this.signal = new Phaser.Signal();

    this.animations.add('main', ['1', '2', '3', '4', '5', '6'], 18, true);

    this.turnedOn = false;
    this.playerOnTrigger = false;
    this.statusSignal = new Phaser.Signal();

    this.shadowOffset = 20;
    this.shadows =[];    

    var shadow1 = this.game.add.sprite(this.x + Math.cos(this.game.lightSources[0].angle(new Phaser.Point(1, 0)))*this.shadowOffset, 
        this.y + Math.sin(this.game.lightSources[0].angle(new Phaser.Point(1, 0)))*this.shadowOffset, this.key, 1);
    shadow1.anchor.setTo(this.anchor.x, this.anchor.y);
    //shadow1.animations.add('main', ['1', '2', '3', '4', '5', '6'], 18, true);    
    shadow1.tint = '0x000000';
    shadow1.alpha = 0.2;
    shadow1.scale.setTo(this.scale.x, this.scale.y);
    shadow1.rotation = this.rotation;
    this.assignShadow(shadow1);

    /*var shadow2 = this.game.add.sprite(this.x + Math.cos(this.game.lightSources[1].angle(new Phaser.Point(1, 0)))*this.shadowOffset, 
        this.y + Math.sin(this.game.lightSources[1].angle(new Phaser.Point(1, 0)))*this.shadowOffset, this.key);
    shadow2.anchor.setTo(this.anchor.x, this.anchor.y);
    shadow2.animations.add('main', ['1', '2', '3', '4', '5', '6'], 18, true);
    shadow2.tint = '0x000000';
    shadow2.alpha = 0.2;
    shadow2.scale.setTo(this.scale.x, this.scale.y);
    shadow2.rotation = this.rotation;
    this.assignShadow(shadow2);*/

    this.streamingInterval = 6;
    this.streamingCounter = 0;

    // calculate max distance to borders
    // first define borders to look at
    // deal with negative angles

    var dirAngle = this.rotation;

    if (dirAngle<0) dirAngle+=Math.PI*2;

    if (dirAngle>=0 && dirAngle<Math.PI/2) {
        var border1Start = new Phaser.Point(this.game.width, 0),
            border1End = new Phaser.Point(0, 1),
            border2Start = new Phaser.Point(this.game.width, this.game.height),
            border2End = new Phaser.Point(-1, 0);
    } else if (dirAngle>=Math.PI/2 && dirAngle<Math.PI) {
        var border1Start = new Phaser.Point(this.game.width, this.game.height),
            border1End = new Phaser.Point(-1, 0),
            border2Start = new Phaser.Point(0, this.game.height),
            border2End = new Phaser.Point(0, -1);
    } else if (dirAngle>=Math.PI && dirAngle<1.5*Math.PI) {
        var border1Start = new Phaser.Point(0, this.game.height),
            border1End = new Phaser.Point(0, -1),
            border2Start = new Phaser.Point(0, 0),
            border2End = new Phaser.Point(1, 0);
    } else if (dirAngle>=1.5*Math.PI && dirAngle<2*Math.PI) {
        var border1Start = new Phaser.Point(0, 0),
            border1End = new Phaser.Point(1, 0),
            border2Start = new Phaser.Point(this.game.width, 0),
            border2End = new Phaser.Point(0, 1);
    }

    /*console.log(dirAngle/Math.PI*180);
    console.log(border1Start);
    console.log(border1End);
    console.log(border2Start);
    console.log(border2End);*/

    var intersectPoint1 = intersectVecVec(border1Start, border1End, this.position, this.flowTang),
        intersectPoint2 = intersectVecVec(border2Start, border2End, this.position, this.flowTang),
    
        distance1 = Phaser.Point.distance(this.position, (intersectPoint1.intPoint || new Phaser.Point(10000, 10000))),
        distance2 = Phaser.Point.distance(this.position, (intersectPoint2.intPoint || new Phaser.Point(10000, 10000)));

    this.maxDistance = Math.min(distance1, distance2);
        

    //console.log(this.maxDistance);

    //for (var i = 0; i<2; i++) {
    //    this.game.time.events.add(100, this.emitCurl, this);
    //}
};

Fan.prototype = Object.create(Phaser.Sprite.prototype);
Fan.prototype.constructor = Fan;

Fan.prototype.switch = function(status){
    //console.log('fan switch');
    if (status==='in' || status==='initial') {
        if (!this.playerOnTrigger) {
            if (this.turnedOn) {
                this.turnedOn = false;
                //console.log('turn off');
                this.animations.stop();
                this.frameName = 'idle';
                this.shadows.forEach(function(shadow){
                    shadow.animations.stop();
                    shadow.frameName = 'idle';
                }, this);
                this.statusSignal.dispatch('off');
            } else {
                this.turnedOn = true;
                //console.log('turn on');
                this.animations.play('main');
                this.shadows.forEach(function(shadow){
                    shadow.animations.play('main');                    
                }, this);
                this.statusSignal.dispatch('on');
                for (var i = 0; i<3; i++) {
                    this.game.time.events.add(100+300*i, this.emitCurl, this);
                }
            }
            if (status==='in') this.playerOnTrigger = true;
        }
    } else if(status==='out') {

        this.playerOnTrigger = false;

    }
};

Fan.prototype.update = function() {
    /*if (this.turnedOn) {
        this.streamingCounter ++;
        if (this.streamingCounter == this.streamingInterval) {
            this.emitStream();
            this.streamingCounter = 0;    
        }
        
    }*/
}

Fan.prototype.checkFanZone = function(ballX, ballY, ballR, object) {
    if (this.turnedOn) {
        //check in zone
        var underFan = this.checkPointUnderFan(ballX, ballY, ballR);

        if (object && underFan) {
            //this.signal.dispatch(Phaser.Point.multiply(this.flowTang, new Phaser.Point(this.flowAcc, this.flowAcc)));
            object.applyAddSpeed(Phaser.Point.multiply(this.flowTang, new Phaser.Point(this.flowAcc, this.flowAcc)), 'fan');
            //this.tint = 0x00ff00;
        }
    }
};

Fan.prototype.checkPointUnderFan = function(posX, posY, interactionRad) {

    var inZone = false,
        ballVec = new Phaser.Point(posX, posY),
        toBallVec = Phaser.Point.subtract(ballVec, this.pos1),
        tangToBallVec = Phaser.Point.project(toBallVec, this.flowTang),
        normToBallVec = Phaser.Point.subtract(toBallVec, tangToBallVec),
        globalToBallNormVec = Phaser.Point.add(this.pos1, normToBallVec),
        dotProduct = normToBallVec.dot(this.flowNorm);

    if (dotProduct>=0 && dotProduct<=this.flowNorm.getMagnitude()*this.flowNorm.getMagnitude()) {
        inZone = true;
    }
    //check that toBallVec do not intersect segments
    var wallIntersect = false,
        walls = this.game.wallsSG.children.slice();
    for (wall in walls) {
        for (e in walls[wall].edges) {
            var edge = walls[wall].edges[e];
            var intSR = intersectSegRectSk([globalToBallNormVec, tangToBallVec], edge.vertices);
            if (intSR.result) {
                wallIntersect = true;
            }
        }
    }

    return (inZone && !wallIntersect)

};

Fan.prototype.assignShadow = function(bottomShadow) {

    this.game.bottomShadowGroup.add(bottomShadow);
    this.shadows.push(bottomShadow);
};

Fan.prototype.emitStream = function() {
    //console.log('emit called');
    var offsetTime = 0.9*(Math.random() - 0.5),
        offset = new Phaser.Point(this.flowNorm.x*offsetTime, this.flowNorm.y * offsetTime),
        emitPos = Phaser.Point.add(this.position, offset);

    emitPos.add(this.flowTang.x*this.width*0.2, this.flowTang.y*this.width*0.2);

    var streamline = new FanStreamline(this.game, emitPos.x, emitPos.y, this.flowTang);
    moveProcessor.addObject(streamline);
    this.game.effectsSprtites.push(streamline);
};

Fan.prototype.emitCurl = function() {
    if (this.turnedOn && this.game) {

        var tangVector = this.flowTang.clone(),
            randomMultTang = Math.random();
        tangVector.multiply((randomMultTang*0.9+0.1)*this.maxDistance, (randomMultTang*0.9+0.1)*this.maxDistance);

        var normVector = this.flowNorm.clone(),
            randomMultNorm = Math.random();
        normVector.multiply((randomMultNorm-0.5), (randomMultNorm-0.5));

        var pointCand = Phaser.Point.add(tangVector, normVector).add(this.x, this.y);

        while (!this.checkPointUnderFan(pointCand.x, pointCand.y, 1)) {
            tangVector = this.flowTang.clone(),
            randomMultTang = Math.random();
            tangVector.multiply((randomMultTang*0.9+0.1)*this.maxDistance, (randomMultTang*0.9+0.1)*this.maxDistance);

            normVector = this.flowNorm.clone();
            randomMultNorm = Math.random();
            normVector.multiply((randomMultNorm-0.5), (randomMultNorm-0.5));

            pointCand = Phaser.Point.add(tangVector, normVector).add(this.x, this.y);
        }

        //console.log(randomMultTang);
        //console.log(randomMultNorm);

        var curlSprite = this.game.add.sprite(pointCand.x, pointCand.y, 'fanWave');
        curlSprite.anchor.setTo(0.5, 0.5);
        curlSprite.rotation = this.rotation + Math.PI/2;
        var framesArray = Math.random()>0.5? [0, 1, 2, 3, 4, 5] : [6, 7, 8, 9, 10, 11];
        curlSprite.animations.add('main', framesArray);
        curlSprite.vel = this.flowTang.clone().multiply(0.5, 0.5);
        var curlAnimation = curlSprite.animations.play('main', 12, false, true);  
        curlSprite.update = function()  {
            this.position.add(this.vel.x, this.vel.y);
        }

        curlAnimation.onComplete.add(function(sprite){
            this.emitCurl();
        }, this);

        this.game.fanCurles.add(curlSprite);

    }
};

FanStreamline = function(game, posX, posY, directVec) {
    this.game = game;
    Phaser.Sprite.call(this, game, posX, posY, 'fanStream');
    game.add.existing(this);

    this.anchor.setTo(0.5, 1);
    this.rotation = Math.atan2(directVec.y, directVec.x) - Math.PI/2;
    this.velMagnitude = 4;
    this.vel = new Phaser.Point(this.velMagnitude*directVec.x, this.velMagnitude*directVec.y);

    this.animations.add('main');
    this.animations.play('main', 30, true);

    this.alpha = 0.5;

    // collider processor parameters
    this.moveDone = false;
    this.colliderType = 'circle';
    this.intent = new Phaser.Point();
    this.pushable = false;
    this.moving = true;
    this.bounceIteraion = 0;
    this.holder = 'neutral';
    this.pushing = false;
    this.interactionRadius = this.width*0.3;
};

FanStreamline.prototype = Object.create(Phaser.Sprite.prototype);
FanStreamline.prototype.constructor = FanStreamline;

FanStreamline.prototype.move = function() {
    this.position.add(this.vel.x, this.vel.y);
};

Octopus = function(game, posX, posY) {
    this.game = game;
    /*Phaser.Group.call(this, game);
    game.add.existing(this);

    this.position.set(posX*this.game.width, posY*this.game.height);

    this.octBody = this.game.add.sprite(0, 0, 'octopusBody');
    this.octBody.anchor.setTo(0.5, 0.5);
    this.octBody.alpha = 0.1;
    this.octBody.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.add(this.octBody);

    this.divingBell = this.game.add.sprite(0, 0, 'divingBell');
    this.divingBell.anchor.setTo(0.5, 0.5);
    this.divingBell.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);
    this.add(this.divingBell);*/

    this.seePlayer = false;
    this.pushing = false;
    this.vel = new Phaser.Point();
    //this.world = this.octBody.world;

    Phaser.Sprite.call(this, game, posX*this.game.width, posY*this.game.height, 'octopus');
    game.add.existing(this);

    this.anchor.setTo(0.5, 0.5);
    this.alpha = 0.4;
    this.scale.setTo(configuration.scaleRatio * 0.8, configuration.scaleRatio*0.8);
    this.animations.add('idle', ['idle1', 'idle1', 'idle1', 'idle1', 'idle2', 'idle3', 'idle4', 'idle4', 'idle4', 'idle4'], 12, true);
    this.animations.add('chasing', ['chasing1', 'chasing1', 'chasing2', 'chasing3', 'chasing4', 'chasing4', 'chasing4'], 18, true);
    this.animations.play('idle');
    /*this.idleAnimation = this.animations.add('idle', ['still_1', 'still_2', 'still_3', 'still_2'], 12, true);
    this.startChaseAnimation = this.animations.add('startChase', ['chase_1', 'chase_2', 'chase_3', 'chase_4', 'chase_5', 'chase_6'], 12, false);
    this.startChaseAnimation.onComplete.add(function(){
        this.chasingAnimation.play();
    }, this);
    this.chasingAnimation = this.animations.add('chasing', ['chase_7', 'chase_6'], 12, true);
    this.animations.play('idle');*/

    this.interactionRadius = this.width/2*0.8;

    this.killPlayerSignal = new Phaser.Signal();
    //this.pushSignal = new Phaser.Signal();
    //move processor parameters
    this.moveDone = false;
    this.colliderType = 'circle';
    this.intent = new Phaser.Point();
    this.pushable = true;
    this.moving = true;
    this.bounceIteraion = 0;
    this.holder = 'enemy';
    this.pushing = true;
    this.leftTarget = null;
    this.rightTarget = null;
    this.centerTarget = null;

    this.shadows = [];    

    var shadowImageName1 = shadowGenerator.generateCylinderShadow(this.game, this.position, 
        this.interactionRadius*0.75, this.game.lightSources[0]);
    /*var shadowImageName2 = shadowGenerator.generateCylinderShadow(this.game, this.position, 
        this.interactionRadius*0.75, this.game.lightSources[1]);        */

    var shadow1 = this.game.add.sprite(this.x, this.y, shadowImageName1);
    shadow1.anchor.setTo(0.5, 0.5);
    this.assignBottomShadow(shadow1);

    /*var shadow2 = this.game.add.sprite(this.x, this.y, shadowImageName2);
    shadow2.anchor.setTo(0.5, 0.5);
    this.assignBottomShadow(shadow2);*/

    this.lookCall = this.game.time.events.add(50, this.setLookCall, this);
};

Octopus.prototype = Object.create(Phaser.Sprite.prototype);
Octopus.prototype.constructor = Octopus;

Octopus.prototype.setLookCall = function() {

    if (this.game) {
        this.lookForPlayer(this.game.currentBallCoord[0].x, this.game.currentBallCoord[0].y, this.game.currentBallCoord[1]);
        this.lookCall = this.game.time.events.add(50, this.setLookCall, this);
    }

};

Octopus.prototype.calculateVel = function(intPoint) {
    if (intPoint) {
        
        var radialVec = Phaser.Point.subtract(intPoint, new Phaser.Point(this.x, this.y));
        var bounceNormal = Phaser.Point.normalRightHand(radialVec).normalize();
        
        this.vel = calculateBounceVel(this.vel, bounceNormal, 0).clone();

    } /*else {
        if (this.game) {
            this.lookForPlayer(this.game.currentBallCoord[0].x, this.game.currentBallCoord[0].y, this.game.currentBallCoord[1]);    
        }        
    }*/
    this.shadows.forEach(function(shadow){
        shadow.position.set(this.x, this.y);
    }, this);
};

Octopus.prototype.setVelocity = function(newVel) {
    this.vel.copyFrom(newVel);
};

Octopus.prototype.defineVel = function(seenPos, ballR) {    
    this.vel = Phaser.Point.subtract(seenPos, this.position);
    if(this.vel.getMagnitude()>5/configuration.canvasWidth*this.game.width) {
        this.vel.setMagnitude(5/configuration.canvasWidth*this.game.width);
    }
};

Octopus.prototype.move = function() {

    var prevRotation = this.rotation;

    this.position.add(this.vel.x*this.game.time.physicsElapsed*60, this.vel.y*this.game.time.physicsElapsed*60);

    //if (this.vel.getMagnitude()>0.5) {
        this.rotation = Math.atan2(this.vel.y, this.vel.x);//+Math.PI/2;
    //}
    if (Math.abs(prevRotation - this.rotation)>0.1*Math.PI/180) {
        this.updateTargetWalls();
    }
};

Octopus.prototype.impulseStepBack = function(intPoint) {
    var radialVec = Phaser.Point.subtract(intPoint, this.position);
    radialVec.normalize();

    this.x -= radialVec.x;
    this.y -= radialVec.y;
};

Octopus.prototype.lookForPlayer = function(ballX, ballY, ballR) {
    //check whther player is close enough to eat
    /*if (intersectCircleCircle(ballX, ballY, ballR, this.x, this.y, this.interactionRadius)[0]) {
        this.eatSignal.dispatch();*/
    //} else {
        var ballVec = new Phaser.Point(ballX, ballY);
        var toBallVec = Phaser.Point.subtract(ballVec, this.position);        
        //define leftest point
        var rightNormal = Phaser.Point.normalRightHand(toBallVec).normalize();
        rightNormal.multiply(ballR, ballR);
        var rightPoint = Phaser.Point.add(toBallVec, rightNormal);
        //define rightest point
        var leftNormal = rightNormal.clone().multiply(-1, -1);
        var leftPoint = Phaser.Point.add(toBallVec, leftNormal);
        //check whether they are seen
        var leftNotSeen = false;
        var rightNotSeen = false;    
        var walls = this.game.wallsSG.children.slice();
        for (wall in walls) {
            for (e in walls[wall].edges) {
                var edge = walls[wall].edges[e];
                leftNotSeen = leftNotSeen || intersectSegRectSk([this.position, leftPoint], edge.vertices).result;
                rightNotSeen = rightNotSeen || intersectSegRectSk([this.position, rightPoint], edge.vertices).result;
            }
        }
        if (!leftNotSeen) {
            this.defineVel(Phaser.Point.add(leftPoint, this.position), ballR);
            this.seePlayer = true;
            this.alpha = 1;

            if (this.animations.name === 'idle') {
                this.animations.stop();
                this.animations.play('chasing');
                audioPlayer.playOneTime('octopusScream');
                //console.log('chasing animation');
            }
            
        } else if (!rightNotSeen) {
            this.defineVel(Phaser.Point.add(rightPoint, this.position), ballR);
            this.seePlayer = true;
            this.alpha = 1;

            if (this.animations.name === 'idle') {
                this.animations.stop();
                this.animations.play('chasing');
                audioPlayer.playOneTime('octopusScream');
                //console.log('chasing animation');
            }

        } else {
            this.vel.set(0, 0);
            this.seePlayer = false;
            this.alpha = 1;

            if (this.animations.name === 'chasing' || this.animations.name === 'startChase') {
                this.animations.stop();
                this.animations.play('idle');
                //console.log('idle animation');
            }
        }    
    //}    
};

Octopus.prototype.assignBottomShadow = function(bottomShadow) {

    this.game.bottomShadowGroup.add(bottomShadow);
    this.shadows.push(bottomShadow);
};

Octopus.prototype.updateTargetWalls = function() {
    var target = this.findTargetWall();
    this.rightTarget = target[0];
    this.leftTarget = target[1];
    this.centerTarget = target[2];
};

Octopus.prototype.findTargetWall = function() {
    // find marginal points on the ball's circle
    //console.log('find target wall called');
    var rightPoint = Phaser.Point.normalRightHand(this.vel),
        leftPoint = Phaser.Point.negative(rightPoint),
        rightTarget = null,
        leftTarget = null,
        centerTarget = null,
        walls = this.game.wallsSG.children;

    rightPoint.setMagnitude(this.interactionRadius);
    leftPoint.setMagnitude(this.interactionRadius);

    rightPoint.add(this.position.x, this.position.y);
    leftPoint.add(this.position.x, this.position.y);

    // set velocity ray
    var maxDistance = Math.sqrt(Math.pow(this.game.height, 2)+Math.pow(this.game.width, 2)),
        velRay = new Phaser.Point(maxDistance*Math.cos(this.rotation), maxDistance*Math.sin(this.rotation)),
        rightCurrentDistance = maxDistance,
        leftCurrentDistance = maxDistance,
        centerCurrentDistance = maxDistance,
        currentDistance = maxDistance;

    //console.log(velRay);

    // check all the walls on intersection with the vel ray
    for (var wall in walls) {

        for (var seg in walls[wall].outerSegments) {
            var wallSegment = walls[wall].outerSegments[seg],
                intersectionResultRight = intersectSegSeg(rightPoint, velRay, wallSegment[0], wallSegment[1]),
                intersectionResultLeft = intersectSegSeg(leftPoint, velRay, wallSegment[0], wallSegment[1]);
                //intersectionResultCenter = intersectSegRectSkwp([this.position, velRay], walls[wall].edges.vertices);

            //console.log(intersectionResultRight);
            //console.log(intersectionResultLeft);

            if (intersectionResultRight.result) {
                if (intersectionResultRight.intPoint.distance(rightPoint)<rightCurrentDistance) {
                    rightCurrentDistance = intersectionResultRight.intPoint.distance(rightPoint);
                    /*if (rightTarget) {
                        if (notInnerWallsIDs.indexOf(rightTarget.id)<0){
                            notInnerWallsIDs.push(rightTarget.id);
                        }
                    }*/
                    rightTarget = walls[wall];
                }
            }

            if (intersectionResultLeft.result) {
                if (intersectionResultLeft.intPoint.distance(leftPoint)<leftCurrentDistance) {
                    leftCurrentDistance = intersectionResultLeft.intPoint.distance(leftPoint);
                    /*if (leftTarget) {
                        if (notInnerWallsIDs.indexOf(leftTarget.id)<0){
                            notInnerWallsIDs.push(leftTarget.id);
                        }
                    }*/
                    leftTarget = walls[wall];
                }
            }

            /*if (intersectionResultCenter.result) {
                if (intersectionResultCenter.intPoint.distance(this.position)<centerCurrentDistance) {
                    centerCurrentDistance = intersectionResultCenter.intPoint.distance(this.position);
                    if (centerTarget) {
                        if (notInnerWalls.indexOf(centerTarget)<0){
                            notInnerWalls.push(centerTarget);
                        }
                    }
                    centerTarget = walls[wall];
                }
            }*/
        }
    }    
    
    var polygonHeightVec = Phaser.Point.subtract(leftPoint, rightPoint),
        polygonRightWidthVec = velRay.clone().setMagnitude(rightCurrentDistance),
        polygonLeftWidthVec = velRay.clone().setMagnitude(leftCurrentDistance),
        ver1 = leftPoint,
        ver2 = rightPoint,
        ver3 = Phaser.Point.add(rightPoint, polygonRightWidthVec),
        ver4 = Phaser.Point.add(leftPoint, polygonLeftWidthVec);
        visionPolygon = new Phaser.Polygon([ver1, ver2, ver3, ver4]);

    /*this.game.debugGraphics.clear();
    this.game.debugGraphics.beginFill(0x0034ff, 0.5);
    this.game.debugGraphics.drawPolygon(visionPolygon.points);
    this.game.debugGraphics.endFill();*/

    // check whether any of vertices of the walls goes to vision ploygon

    currentDistance = Math.max(leftCurrentDistance, rightCurrentDistance);

    for (var wall in walls) {
        if (walls[wall].id>0 && (!leftTarget || walls[wall].id!=leftTarget.id) && (!rightTarget || walls[wall]!=rightTarget.id)) { //&& notInnerWallsIDs.indexOf(walls[wall].id)<0) {
            for (var seg in walls[wall].outerSegments) {
                var vertex1 = walls[wall].outerSegments[seg][0],
                    vertex2 = Phaser.Point.add(walls[wall].outerSegments[seg][1], walls[wall].outerSegments[seg][0]);
                
                if (visionPolygon.contains(vertex1.x, vertex1.y)) {

                    if (this.position.distance(vertex1)<currentDistance) {
                        currentDistance = this.position.distance(vertex1);
                        centerTarget = walls[wall];
                        //console.log(visionPolygon);
                        break;
                    }

                } else if (visionPolygon.contains(vertex2.x, vertex2.y)) {

                    if (this.position.distance(vertex2)<currentDistance) {
                        currentDistance = this.position.distance(vertex2);
                        centerTarget = walls[wall];
                        //console.log(visionPolygon);
                        break;
                    }
                }
                
            }
        }
    }

    //this.targetFound = true;    
    /*this.game.debugGraphics.lineStyle(2, 0x00ff60, 1);
    this.game.debugGraphics.beginFill(0x00ff00);
    rightTarget.outerSegments.forEach(function(segment){
        this.game.debugGraphics.moveTo(segment[0].x, segment[0].y);
        this.game.debugGraphics.lineTo(segment[1].x+segment[0].x, segment[1].y+segment[0].y);
        this.game.debugGraphics.drawCircle(segment[0].x, segment[0].y, 8);
    }, this);
    leftTarget.outerSegments.forEach(function(segment){
        this.game.debugGraphics.moveTo(segment[0].x, segment[0].y);
        this.game.debugGraphics.lineTo(segment[1].x+segment[0].x, segment[1].y+segment[0].y);
        this.game.debugGraphics.drawCircle(segment[0].x, segment[0].y, 8);
    }, this);
    if (centerTarget) {
        centerTarget.outerSegments.forEach(function(segment){
            this.game.debugGraphics.moveTo(segment[0].x, segment[0].y);
            this.game.debugGraphics.lineTo(segment[1].x+segment[0].x, segment[1].y+segment[0].y);
            this.game.debugGraphics.drawCircle(segment[0].x, segment[0].y, 8);
        }, this);
    }
    this.game.debugGraphics.endFill();*/


    return [rightTarget, leftTarget, centerTarget];
};

Joystick = function(game, pos, ball) {
    this.game = game;
    this.ball = ball;
    Phaser.Group.call(this, game);
    game.add.existing(this);
    this.currentCenter = pos.clone();
    this.active = false;
    this.required = true;
    this.signal = new Phaser.Signal();  

    
    // just run radius
    this.runRadius = this.game.add.sprite(pos.x, pos.y, 'outerRadius0');
    this.runRadius.anchor.setTo(0.5, 0.5);
    this.add(this.runRadius);
    this.runRadius.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);

    // direction arrow
    this.dirArrow = this.game.add.sprite(pos.x, pos.y, 'hamDir');
    this.dirArrow.anchor.setTo(0, 0.5);
    this.add(this.dirArrow);
    this.dirArrow.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);

    // push radius
    this.pushRadius = this.game.add.sprite(pos.x, pos.y, 'outerRadius1');
    this.pushRadius.anchor.setTo(0.5, 0.5);
    this.add(this.pushRadius);
    this.pushRadius.scale.setTo(0, 0);
    this.pushShowTween = this.game.add.tween(this.pushRadius.scale).to({x: configuration.scaleRatio, y: configuration.scaleRatio}, 500, Phaser.Easing.Elastic.Out, false);
    this.pushHideTween = this.game.add.tween(this.pushRadius.scale).to({x: 0, y: 0}, 500, Phaser.Easing.Elastic.In, false);


    // inner radius
    /*this.innerRadius = this.game.add.sprite(pos.x, pos.y, 'innerRadius');
    this.innerRadius.anchor.setTo(0.5, 0.5);
    this.add(this.innerRadius);
    this.innerRadius.scale.setTo(configuration.scaleRatio, configuration.scaleRatio);*/

    this.alpha = 0;
};

Joystick.prototype = Object.create(Phaser.Group.prototype);
Joystick.prototype.constructor = Joystick;

Joystick.prototype.placeJoystick = function(pointer){
    //console.log(pointer);
    if (this.required) {
        this.ball.attractionPoint = null;
        if ((this.game.device.touch && pointer.id === 1) || !this.game.device.touch) {
                
            if (!this.game.device.touch) {
                var pointerPos = new Phaser.Point(this.game.input.activePointer.position.x, this.game.input.activePointer.position.y);
                    //console.log(pointerPos);
            } else {
                var pointerPos = new Phaser.Point(this.game.input.pointer1.position.x, this.game.input.pointer1.position.y);                
            }
            if (this.firstPointerIndicator) {
                this.firstPointerIndicator.position.set(pointerPos.x, pointerPos.y);
                this.firstPointerIndicator.alpha = 0.7;
                this.directionIndicator.position.set(pointerPos.x, pointerPos.y-this.firstPointerIndicator.width/2);
                this.directionIndicator.alpha = 0.7;
            } else {
                this.firstPointerIndicator = this.game.add.sprite(pointerPos.x, pointerPos.y, 'firstFingerIndicator');
                this.firstPointerIndicator.anchor.setTo(0.5, 0.5);
                this.firstPointerIndicator.alpha = 0.7;
                if (!this.game.device.touch) {
                    this.firstPointerIndicator.alpha = 0.5;
                    this.firstPointerIndicator.scale.setTo(0.7, 0.7);
                }
                this.directionIndicator = this.game.add.sprite(pointerPos.x, pointerPos.y-this.firstPointerIndicator.width/2, 'innerRadius');
                this.directionIndicator.anchor.setTo(0.5, 0.5);
                this.directionIndicator.alpha = 0.7;                
                if (!this.game.device.touch) {
                    this.directionIndicator.alpha = 0.5;
                    this.directionIndicator.scale.setTo(0.7, 0.7);
                }
            }
            this.currentCenter.set(pointerPos.x, pointerPos.y);
                
            this.alpha = 1;
            this.runRadius.alpha = 0.7;
            this.dirArrow.alpha = 0.7;
            this.pushRadius.alpha = 0.7;
            this.active = true;
            this.pushActive = false;
                //this.pushShowTween.start();    
        }

        if (this.game.device.touch && pointer.id === 2) {
            this.ball.activatePush();
            if (this.secondPointerIndicator) {
                this.secondPointerIndicator.position.set(this.game.input.pointer2.position.x, this.game.input.pointer2.position.y);
                this.secondPointerIndicator.alpha = 0.7;
            } else {
                this.secondPointerIndicator = this.game.add.sprite(this.game.input.pointer2.position.x, this.game.input.pointer2.position.y, 'secondFingerIndicator');
                this.secondPointerIndicator.anchor.setTo(0.5, 0.5);
                this.secondPointerIndicator.alpha = 0.7;
            }
        }
    }

    /*if (pointer.rightButton.isDown) {
        this.ball.activatePush();
        this.showPushCircle();
    }*/
    
};

Joystick.prototype.setPosition = function(pos) {
    //this.currentCenter.add(movement.x, movement.y);
    //all radiai are moved via incremental step to save distance between inner radius and run center and direction
    var prevCenter = this.runRadius.position.clone();
    var move = Phaser.Point.subtract(pos, prevCenter);
    this.runRadius.position.add(move.x, move.y);
    this.pushRadius.position.add(move.x, move.y);
    //this.innerRadius.position.add(move.x, move.y);
    this.dirArrow.position.add(move.x, move.y);
};

Joystick.prototype.hideJoystick = function(pointer) {

    //console.log(pointer);

    //if ((this.game.device.touch && pointer.id === 1) || !this.game.device.touch) {
        this.alpha = 0;
        this.active = false;
        //this.hidePushCircle();    
        //console.log('left button up');
        //if (this.game.device.touch && pointer.id === 1) {
            this.firstPointerIndicator.alpha = 0;
            this.directionIndicator.alpha =0;
        //}
    //}

    if (this.game.device.touch && pointer.id === 2) {
        this.ball.disactivatePush();
        this.secondPointerIndicator.alpha = 0;
    }

    /*if (pointer.rightButton.isUp) {
        this.ball.disactivatePush();
        this.hidePushCircle();
    }*/
    
};

Joystick.prototype.moveInner = function(pointer, posX, posY){
    if (this.active && (!this.game.device.touch || pointer.id===1)) {
        var mousePos = new Phaser.Point(posX, posY);
        var toMouseVec = Phaser.Point.subtract(mousePos, this.currentCenter);
        var distance = toMouseVec.getMagnitude();
        if (distance > this.runRadius.width/2) {
            toMouseVec.setMagnitude(this.runRadius.width/2);
        }

        var newDirectionCenter = Phaser.Point.add(toMouseVec, this.runRadius.position);
        
        if (/*this.game.device.touch && pointer.id===1 && */this.directionIndicator) {
            var toInnerVec = toMouseVec.clone().setMagnitude(this.firstPointerIndicator.width/2),
                innerNewCenter = Phaser.Point.add(toInnerVec, this.currentCenter);
            this.directionIndicator.position.set(innerNewCenter.x, innerNewCenter.y);
            //console.log('move inner center');
        }
        //this.innerRadius.position.set(innerNewCenter.x, innerNewCenter.y);

        /*if (Phaser.Point.distance(this.runRadius.position, this.innerRadius.position)<=this.runRadius.width/2+0.1) {
            
            this.runRadius.alpha = 1;
            this.pushRadius.alpha = 0.7;
            //this.pushActive = false;

        } else if (Phaser.Point.distance(this.runRadius.position, this.innerRadius.position)>this.runRadius.width/2+0.1) {

            this.runRadius.alpha = 0.7;
            this.pushRadius.alpha = 1;
            //this.pushActive = true;
            //this.game.time.events.remove(this.hidePushCircleEvent);
            //console.log(Phaser.Point.distance(this.runRadius.position, this.innerRadius.position));
            //console.log(this.runRadius.width/2);
        }*/

        this.signal.dispatch(this.runRadius.position, newDirectionCenter);//, this.pushActive);
    }

    if (this.active && this.game.device.touch && pointer.id===2) {
        if (this.secondPointerIndicator) {
            this.secondPointerIndicator.position.set(posX, posY);
        }
    }
};

Joystick.prototype.showPushCircle = function() {
    if (!this.pushShowTween.isRunning) {
        if (!this.pushHideTween.isRunning) {
            this.pushHideTween.pause();
            this.pushRadius.scale.setTo(0, 0);
        }
        this.pushShowTween.start();    
    }
    //this.hidePushCircleEvent = this.game.time.events.add(3000, this.hidePushCircle, this);
};

Joystick.prototype.hidePushCircle = function() {
    /*if (this.pushShowTween.isRunning) {
        this.pushShowTween.pause();
    }*/
    if (!this.pushHideTween.isRunning && this.pushRadius.scale.x > 0) {
        if (this.pushHideTween.isPaused) {
            this.pushHideTween.resume();
        }
        this.pushHideTween.start();
    }
    //this.hidePushCircleEvent = null;
};

portalSystem = {

    portals: {},
    teleportSignal: new Phaser.Signal(),

    addPortal: function(portal, color, mapId) {
        if (!this.portals[color]) {
            this.portals[color] = {};    
        }        
        this.portals[color][mapId] = portal;
    },

    clearPortals: function() {
        this.portals = {};
    },

    findTargetPortal: function(game, color, mapId) {

        /*console.log(this.portals);
        console.log(color);
        console.log(mapId);*/

        for (var cId in this.portals[color]) {
            if (cId != mapId) {
                this.portals[color][cId].playerIn = true;
                // set overduetimer
                this.portals[color][cId].overdueTimer = game.time.events.add(10000, function(){
                    this.portals[color][cId].playerIn = false;
                    this.portals[color][cId].outPortalSignal.dispatch();
                }, this);
                return {portal: this.portals[color][cId], map: cId};
            }
        }
    },

    teleportPlayer: function(game, color, mapId) {
        //console.log(color);
        var portalTarget = this.findTargetPortal(game, color, mapId);

        var targetPosition = portalTarget.portal.position.clone();
        this.teleportSignal.dispatch(portalTarget.map, targetPosition, this.portals[color][mapId], color);
    },
};

moveProcessor = {
    objects: [],
    allMoved: false,
    checkNeeded: true,
    colResults: [],
    iterator: 0,

    addObject: function(obj) {
        this.objects.push(obj);
        //this.colResults.push({result: true, obstacle: null, intPoint: null});
        //console.log(obj);
        //console.log(this.colResults);
    },

    deleteObject: function(obj) {
        var objectIndex = this.objects.indexOf(obj);
        if (objectIndex>=0) {
            this.objects.splice(objectIndex, 1);
            //this.colResults.splice(objectIndex, 1);
        }
    },

    cleanObjects: function() {
        //console.log('clear level called');
        this.objects = [];
        //this.colResults = [];
    },

    checkMovePossibility: function() {
        for (var o in this.objects) {
            //console.log(this.objects[o]);
            if (typeof this.objects[o].calculateVel === "function") {
                this.objects[o].calculateVel();    
            }            
        }

        //this.checkManyVManyCollision();

        if (this.checkNeeded){
            while (!this.allMoved) {
                //this.iterator++;
                for (var o in this.objects) {
                    //check for movable walls with zero velocity
                    //as they go in the end of the list as all pushers moved
                    if (this.objects[o].vel.getMagnitude()===0) {
                        this.objects[o].moveDone = true;
                    }
                    if (!this.objects[o].moveDone) {                    
                        var currentObject = this.objects[o];
                        var colRes = this.checkCollision(o);                    
                        //var colRes = this.colResults[o];                    
                        
                        /*if (currentObject.holder === 'player' && colRes.result) {
                            console.log('player vel '+currentObject.vel);   
                        }*/

                        if (colRes.result) {

                            if ((currentObject.holder==='player' &&  colRes.obstacle.holder==='enemy') || 
                                (colRes.obstacle.holder==='player' &&  currentObject.holder==='enemy')) {
                                //console.log('get to enemy intersection');
                                if (colRes.obstacle.holder==='enemy') colRes.obstacle.killPlayerSignal.dispatch();
                                if (currentObject.holder==='enemy') currentObject.killPlayerSignal.dispatch();
                                currentObject.moveDone = true;
                                colRes.obstacle.moveDone = true;

                            } else {

                                if (colRes.obstacle.moveDone) {                                

                                    if (currentObject.moving) {

                                        if (currentObject.bounceIteraion > 2) {

                                            currentObject.setVelocity(new Phaser.Point());
                                            currentObject.moveDone = true;
                                            currentObject.bounceIteraion = 0;
                                            currentObject.impulseStepBack(colRes.intPoint);
                                            //console.log('impulse step back');

                                        } else if (currentObject.bounceIteraion > 1) {

                                            currentObject.calculateVel(colRes.intPoint, 0.5);
                                            currentObject.bounceIteraion++;
                                            /*var objectsArray = this.objects.slice();
                                            objectsArray.splice(Number(o), 1);
                                            this.colResults[o] = {result: false, obstacle: null, intPoint: null};
                                            this.colResults[this.objects.indexOf(colRes.obstacle)] = {result: false, obstacle: null, intPoint: null};
                                            this.checkOneVManyCollision(currentObject, objectsArray);*/
                                            //console.log('bounce iteration 2');

                                        } else {

                                            currentObject.calculateVel(colRes.intPoint);
                                            currentObject.bounceIteraion++;                                            
                                            /*var objectsArray = this.objects.slice();
                                            objectsArray.splice(Number(o), 1);
                                            this.colResults[o] = {result: false, obstacle: null, intPoint: null};
                                            this.colResults[this.objects.indexOf(colRes.obstacle)] = {result: false, obstacle: null, intPoint: null};
                                            this.checkOneVManyCollision(currentObject, objectsArray);*/
                                            //console.log('bounce iteration 1');

                                        }

                                    } else {

                                        if (colRes.segment) {
                                            var tangentDirection = colRes.segment[1].clone();

                                            if (tangentDirection) {
                                                if (currentObject.tangentMoveIteration<4)
                                                {
                                                    var correctedVel = Phaser.Point.project(currentObject.vel, tangentDirection.normalize());
                                                    currentObject.setVelocity(correctedVel);
                                                    //console.log('tangent case');
                                                    currentObject.tangentMoveIteration ++;
                                                    /*var objectsArray = this.objects.slice();
                                                    objectsArray.splice(Number(o), 1);
                                                    this.colResults[o] = {result: false, obstacle: null, intPoint: null};
                                                    this.colResults[this.objects.indexOf(colRes.obstacle)] = {result: false, obstacle: null, intPoint: null};
                                                    this.checkOneVManyCollision(currentObject, objectsArray);*/
                                                } else {
                                                    //console.log('tangent iteration more than 3');
                                                    //delete the following line
                                                    //var correctedVel = Phaser.Point.project(tangentDirection.normalize(), currentObject.vel);
                                                    //console.log(correctedVel);
                                                    currentObject.setVelocity(new Phaser.Point());                                        
                                                    currentObject.moveDone = true;
                                                    currentObject.tangentMoveIteration = 0;                                                
                                                }
                                                

                                            } else {
                                                currentObject.setVelocity(new Phaser.Point());                                        
                                                currentObject.moveDone = true;
                                            }
                                        } else {
                                            currentObject.setVelocity(new Phaser.Point());                                        
                                            currentObject.moveDone = true;
                                        }

                                        //currentObject.setVelocity(new Phaser.Point());                                                                                                                
                                        //currentObject.moveDone = true;

                                        if ((this.objects[o].__proto__.constructor === MovableWallSk || this.objects[o].__proto__.constructor === InterdimWallSk) &&
                                            (colRes.obstacle.__proto__.constructor === MovableWallSk || colRes.obstacle.__proto__.constructor === InterdimWallSk ||
                                                colRes.obstacle.__proto__.constructor === WallSk || colRes.obstacle.__proto__.constructor === Electrode ||
                                                colRes.obstacle.__proto__.constructor === WormHole)) {
                                            this.objects[o].emitOnCollision(colRes.intPoint.x, colRes.intPoint.y);
                                            //console.log(colRes.obstacle.__proto__.constructor);
                                        }

                                    }

                                } else {                                

                                    if (currentObject.moving) {

                                        if (colRes.obstacle.pushable) {

                                            if (currentObject.pushing) {

                                                if (colRes.obstacle.tangentMoveIteration===0) {
                                                    //console.log('move wall');
                                                    colRes.obstacle.setVelocity(currentObject.vel.clone().multiply(1.05, 1.05));
                                                    /*var objectsArray = this.objects.slice(),
                                                        obstacleIndex = this.objects.indexOf(colRes.obstacle);                                                     

                                                    objectsArray.splice(Number(o), 1);                                                    
                                                    
                                                    this.colResults[o] = {result: false, obstacle: null, intPoint: null};
                                                    this.colResults[Number(obstacleIndex)] = {result: false, obstacle: null, intPoint: null};
                                                    this.checkOneVManyCollision(currentObject, objectsArray);
                                                    objectsArray.splice(Number(obstacleIndex)-1, 1);
                                                    this.checkOneVManyCollision(colRes.obstacle, objectsArray);*/
                                                    //console.log(this.colResults);
                                                    var secondCollision = this.collide(currentObject, colRes.obstacle);
                                                    //console.log(secondCollision);
                                                    //console.log(colRes.obstacle.moveDone);
                                                    if (secondCollision.result) {
                                                        currentObject.setVelocity(currentObject.vel.clone().multiply(0.95, 0.95));
                                                        currentObject.impulseStepBack(colRes.intPoint);
                                                    }
                                                    /*this.colResults[o] = {result: false, obstacle: null, intPoint: null};
                                                    this.colResults[this.objects.indexOf(colRes.obstacle)] = {result: false, obstacle: null, intPoint: null};*/
                                                } else {
                                                    //console.log('ball in tangent move');
                                                    currentObject.setVelocity(colRes.obstacle.vel.clone());
                                                } 

                                            } else {

                                                //console.log('bee v bee');
                                                /*if (currentObject.__proto__.constructor===Bee && colRes.obstacle.__proto__.constructor===MovableWallSk &&
                                                    colRes.obstacle.vel.getMagnitude()>0) {
                                                    console.log('bee v moving wall');    
                                                }*/                                                
                                                if (currentObject.bounceIteraion > 2) {

                                                    currentObject.setVelocity(new Phaser.Point());
                                                    currentObject.bounceIteraion = 0;
                                                    currentObject.impulseStepBack(colRes.intPoint);
                                                    currentObject.applyAddSpeed(colRes.obstacle.vel);
                                                    //console.log('impulse step back');

                                                } else if (currentObject.bounceIteraion > 1) {

                                                    currentObject.calculateVel(colRes.intPoint, 0.5);
                                                    currentObject.bounceIteraion++;
                                                    currentObject.applyAddSpeed(colRes.obstacle.vel);
                                                    /*var objectsArray = this.objects.slice();
                                                    objectsArray.splice(Number(o), 1);
                                                    this.colResults[o] = {result: false, obstacle: null, intPoint: null};
                                                    this.colResults[this.objects.indexOf(colRes.obstacle)] = {result: false, obstacle: null, intPoint: null};
                                                    this.checkOneVManyCollision(currentObject, objectsArray);*/
                                                    //console.log('bounce iteration 2');

                                                } else {

                                                    currentObject.calculateVel(colRes.intPoint);
                                                    currentObject.bounceIteraion++;
                                                    currentObject.applyAddSpeed(colRes.obstacle.vel); 
                                                    /*var objectsArray = this.objects.slice();
                                                    objectsArray.splice(Number(o), 1);
                                                    this.colResults[o] = {result: false, obstacle: null, intPoint: null};
                                                    this.colResults[this.objects.indexOf(colRes.obstacle)] = {result: false, obstacle: null, intPoint: null};
                                                    this.checkOneVManyCollision(currentObject, objectsArray);*/

                                                    
                                                    //console.log('bounce iteration 1');

                                                }

                                            }

                                        } else {

                                            if (currentObject.bounceIteraion > 2) {

                                                currentObject.setVelocity(new Phaser.Point());
                                                currentObject.bounceIteraion = 0;
                                                currentObject.impulseStepBack(colRes.intPoint);
                                                //console.log('impulse step back');

                                            } else if (currentObject.bounceIteraion > 1) {

                                                currentObject.calculateVel(colRes.intPoint, 0.5);
                                                currentObject.bounceIteraion++;
                                                //console.log('bounce iteration 2');
                                                /*var objectsArray = this.objects.slice();
                                                objectsArray.splice(Number(o), 1);
                                                this.colResults[o] = {result: false, obstacle: null, intPoint: null};
                                                this.colResults[this.objects.indexOf(colRes.obstacle)] = {result: false, obstacle: null, intPoint: null};
                                                this.checkOneVManyCollision(currentObject, objectsArray);*/

                                            } else {

                                                currentObject.calculateVel(colRes.intPoint);
                                                currentObject.bounceIteraion++;
                                                /*var objectsArray = this.objects.slice();
                                                objectsArray.splice(Number(o), 1);
                                                this.colResults[o] = {result: false, obstacle: null, intPoint: null};
                                                this.colResults[this.objects.indexOf(colRes.obstacle)] = {result: false, obstacle: null, intPoint: null};
                                                this.checkOneVManyCollision(currentObject, objectsArray);*/
                                                //console.log('bounce iteration 1');

                                            }
                                        }
                                    } else {

                                        
                                        if (colRes.segment) {
                                            var tangentDirection = colRes.segment[1].clone();

                                            if (tangentDirection) {
                                                if (currentObject.tangentMoveIteration<4)
                                                {
                                                    var correctedVel = Phaser.Point.project(currentObject.vel, tangentDirection.normalize());
                                                    currentObject.setVelocity(correctedVel);
                                                    //console.log('tangent case');
                                                    currentObject.tangentMoveIteration ++;
                                                    /*var objectsArray = this.objects.slice();
                                                    objectsArray.splice(Number(o), 1);
                                                    this.colResults[o] = {result: false, obstacle: null, intPoint: null};
                                                    this.colResults[this.objects.indexOf(colRes.obstacle)] = {result: false, obstacle: null, intPoint: null};
                                                    this.checkOneVManyCollision(currentObject, objectsArray);*/
                                                } else {
                                                    //console.log('tangent iteration more than 3');
                                                    //delete the following line
                                                    //var correctedVel = Phaser.Point.project(tangentDirection.normalize(), currentObject.vel);
                                                    //console.log(correctedVel);
                                                    currentObject.setVelocity(new Phaser.Point());                                        
                                                    currentObject.moveDone = true;
                                                    currentObject.tangentMoveIteration = 0;                                                
                                                }
                                                

                                            } else {
                                                currentObject.setVelocity(new Phaser.Point());                                        
                                                currentObject.moveDone = true;
                                            }
                                        } else {
                                            currentObject.setVelocity(new Phaser.Point());                                        
                                            currentObject.moveDone = true;
                                        }

                                        //currentObject.setVelocity(new Phaser.Point());                                                                                                                
                                        //currentObject.moveDone = true;

                                        if ((this.objects[o].__proto__.constructor === MovableWallSk || this.objects[o].__proto__.constructor === InterdimWallSk) &&
                                            (colRes.obstacle.__proto__.constructor === MovableWallSk || colRes.obstacle.__proto__.constructor === InterdimWallSk ||
                                                colRes.obstacle.__proto__.constructor === WallSk || colRes.obstacle.__proto__.constructor === Electrode ||
                                                colRes.obstacle.__proto__.constructor === WormHole)) {
                                            this.objects[o].emitOnCollision(colRes.intPoint.x, colRes.intPoint.y);
                                            //console.log(colRes.obstacle.__proto__.constructor);
                                        }
                                        

                                    }
                                } 
                            }
                        } else {                        
                            currentObject.moveDone = true;
                            currentObject.bounceIteraion = 0;
                        }
                    }                
                }
                this.checkAllMoved();
            }
            //this.checkNeeded = false;
        }

        //this.checkNeeded = (!this.checkNeeded);
        this.moveAll();
    },

    checkAllMoved: function() {
        var allMoved = true;
        for (var o in this.objects) {
            allMoved = allMoved && this.objects[o].moveDone;
        }
        this.allMoved = allMoved;
        //console.log('check all moved');
    },

    moveAll: function() {
        for (var o in this.objects) {    
            if (this.objects[o] && this.objects[o]!=undefined) {
                if (typeof this.objects[o].move === "function") {
                    this.objects[o].move();    
                }
                if (this.objects[o].__proto__.constructor != WallSk) {
                    this.objects[o].moveDone = false;                     
                }
            }            
        }
        this.allMoved = false;
        //console.log(this.iterator);
        //this.iterator = 0;
        //console.log(this.colResults);
    },

    checkCollision: function(objIndex) {
        var currentObject = this.objects[objIndex];
        var collRes = {};
        for (var s in this.objects) {
            if (Number(s)!=Number(objIndex)) {
                if (currentObject.__proto__.constructor===Bee) {
                    if (this.objects[s].__proto__.constructor!=Bee && 
                            (this.objects[s].__proto__.constructor===Ball || this.objects[s]===currentObject.rightTarget || this.objects[s]===currentObject.leftTarget ||
                                this.objects[s].vel.getMagnitude()>0)) {
                        collRes = this.collide(currentObject, this.objects[s]);
                        //if (this.objects[s].__proto__.constructor===MovableWallSk && this.objects[s].vel.getMagnitude()>0) console.log('check moving wall');
                        if (collRes.result) {
                            //if (this.objects[s].__proto__.constructor===MovableWallSk && this.objects[s].vel.getMagnitude()>0) console.log('have moving wall collision');
                            return collRes;
                        }
                    }
                } else if(currentObject.__proto__.constructor===Ball) {
                    //console.log(currentObject.target);
                    if (this.objects[s]===currentObject.rightTarget || this.objects[s]===currentObject.leftTarget || this.objects[s]===currentObject.centerTarget ||
                                this.objects[s].vel.getMagnitude()>0 || (this.objects[s].__proto__.constructor!=WallSk && this.objects[s].__proto__.constructor!=MovableWallSk && this.objects[s].__proto__.constructor!=InterdimWallSk)) {
                        collRes = this.collide(currentObject, this.objects[s]);
                        if (collRes.result) {
                            return collRes;
                        }
                    }
                /*} else if(currentObject.__proto__.constructor===MovableWallSk || currentObject.__proto__.constructor===InterdimWallSk) {
                    if (this.objects[s].__proto__.constructor===MovableWallSk || this.objects[s].__proto__.constructor===InterdimWallSk || 
                        this.objects[s].__proto__.constructor===WallSk || this.objects[s].__proto__.constructor===WormHole || 
                        this.objects[s].__proto__.constructor===Electrode || this.objects[s].__proto__.constructor===Octopus) {
                        collRes = this.collide(currentObject, this.objects[s]);
                        if (collRes.result) {
                            return collRes;
                        }
                    }*/
                } else if(currentObject.__proto__.constructor===Octopus) {
                    //console.log(currentObject.target);
                    if (this.objects[s]===currentObject.rightTarget || this.objects[s]===currentObject.leftTarget || this.objects[s]===currentObject.centerTarget ||
                                this.objects[s].vel.getMagnitude()>0 || (this.objects[s].__proto__.constructor!=WallSk && this.objects[s].__proto__.constructor!=MovableWallSk && this.objects[s].__proto__.constructor!=InterdimWallSk)) {
                        collRes = this.collide(currentObject, this.objects[s]);
                        if (collRes.result) {
                            return collRes;
                        }
                    }
                } else {
                    collRes = this.collide(currentObject, this.objects[s]);
                    if (collRes.result) {
                        return collRes;
                    }
                }
            }
        }
        return {result: false, obstacle: null, intPoint: null};
    },

    checkManyVManyCollision: function(objectsArray) {
        //console.log(this.colResults);
        if (!objectsArray) {
            var objectsArray = this.objects.slice();
            this.colResults.fill({result: false, obstacle: null, intPoint: null});
            //console.log('new many vs many');
            console.log(this.iterator);
            this.iterator = 0;
        }

        if (objectsArray.length>2) {
            var checkObject = objectsArray.shift(),
                checkIndex = this.objects.indexOf(checkObject);
            if (!checkObject.moveDone) {
                if (checkObject.vel.getMagnitude()===0 && !this.colResults[checkIndex].result) {
                    checkObject.moveDone = true;
                } else {
                    this.checkOneVManyCollision(checkObject, objectsArray);    
                }            
            }
            this.checkManyVManyCollision(objectsArray);
        } else if (objectsArray.length === 2) {
            this.checkOneVOneCollision(objectsArray[0], objectsArray[1]);
            // set the last two objects move done to true if they have zero velocity
            /*if (!objectsArray[0].moveDone && objectsArray[0].vel.getMagnitude()===0) {
                objectsArray[0].moveDone = true;
            }
            if (!objectsArray[1].moveDone && objectsArray[1].vel.getMagnitude()===0) {
                objectsArray[1].moveDone = true;
            }*/
        }
    },

    checkOneVManyCollision: function(checkObject, objectsArray) {
        var index = this.objects.indexOf(checkObject);
        // do not check if
        // object is already found to collide with something
        // object's move done
        // object's velocity is geter than 0 - this needed because moving objects comes to this.objects first
        //console.log(this.colResults);
        if (this.colResults[index]) {
            if (!this.colResults[index].result) {

                objectsArray.forEach(function(obj){
                    this.checkOneVOneCollision(checkObject, obj);
                }, this);
            }
        }
    },

    checkOneVOneCollision: function(object1, object2) {
        var colResult = this.collide(object1, object2),
            index1 = this.objects.indexOf(object1),
            index2 = this.objects.indexOf(object2);

        if (colResult.result) {            

            this.colResults[index1] = colResult;
            this.colResults[index2] = {result: colResult.result, obstacle: object1, intPoint: colResult.intPoint};
            //console.log(object1);
            //console.log(object2);

        }
        
    },

    collide: function(object1, object2, report, boundsChecked) {
        //var collisionResult = [];
        //console.log(object1);
        //console.log(object2);
        if (!report) {
            report = false;
        }

        if (!boundsChecked) {
            boundsChecked = false;
        }

        /*var bounds1 = object1.getLocalBounds(),
            bounds2 = object2.getLocalBounds();*/

        var boundsRectangle1 = new Phaser.Rectangle(object1.left+object1.vel.x, object1.top+object1.vel.y, object1.width, object1.height),
            boundsRectangle2 = new Phaser.Rectangle(object2.left+object2.vel.x, object2.top+object2.vel.y, object2.width, object2.height);

        //console.log(boundsRectangle1.intersects(boundsRectangle2));
        //console.log(boundsRectangle2);

        //this.iterator ++;

        if (boundsChecked || boundsRectangle1.intersects(boundsRectangle2)) {

            //this.iterator ++;
        
            if (object1.colliderType === 'circle') {

                var intentPos = new Phaser.Point(object1.x + object1.vel.x, object1.y + object1.vel.y);
                var interactionRadius = object1.interactionRadius;

                /*if (report) {
                    console.log(intentPos);
                }*/

                if (object2.colliderType === 'circle') {

                    var intentPos2 = new Phaser.Point(object2.x + object2.vel.x, object2.y + object2.vel.y);
                    var interactionRadius2 = object2.interactionRadius;

                    var collisionResult = intersectCircleCircle(intentPos.x, intentPos.y, interactionRadius, intentPos2.x, intentPos2.y, interactionRadius2);
                    return {result: collisionResult.result, obstacle: object2, intPoint: collisionResult.intPoint};

                } else if (object2.colliderType === 'rectangle') {                

                    var intentVertices2 = [];

                    for (var v in object2.vertices) {

                        intentVertices2.push(Phaser.Point.add(object2.vertices[v], object2.vel));
                    }

                    var collisionResult = intersectRectCircleSk(intentVertices2, intentPos.x, intentPos.y, interactionRadius, report);

                    if (report) {
                        console.log('object2 vel '+object2.vel);
                        console.log('object2 vertices');
                        console.log(object2.vertices);
                        console.log('intent vertices');
                        console.log(intentVertices2);
                        console.log('intent pos');
                        console.log(intentPos);
                        console.log('interactionRadius '+interactionRadius);
                    }
                    
                    /*if (object1.holder==='player' && collisionResult[0]) {
                        console.log('player and rectangle');
                        console.log('intent vertices '+intentVertices2);
                        //console.log('circle pos x '+intentPos.x+ ' pos y '+intentPos.y + ' interaction radius '+interactionRadius);
                        console.log(collisionResult);
                    }*/

                    return {result: collisionResult.result, obstacle: object2, intPoint: collisionResult.intPoint, edge: object2};

                } else if (object2.colliderType === 'multiRectangle') {

                    /*if (object1.holder==='player') {
                        console.log('player and wall');
                    }*/

                    //console.log('collide multi rectangle');

                    for (var seg in object2.outerSegments){

                        var segment = object2.outerSegments[seg];
                        
                        var intentSegment2 = [Phaser.Point.add(segment[0], object2.vel), segment[1]];                        

                        var collisionResult = intersectSegCircle(intentSegment2[0], intentSegment2[1], intentPos, interactionRadius);

                        if (collisionResult.result) {
                            return {result: collisionResult.result, obstacle: object2, intPoint: collisionResult.intPoint, segment: segment};
                        }
                    }
                }

            } else if (object1.colliderType === 'rectangle') {
                var intentVertices = [];

                for (var v in object1.vertices) {

                    intentVertices.push(Phaser.Point.add(object1.vertices[v], object1.vel));

                }
                if (object2.colliderType === 'circle') {

                    var intentPos2 = new Phaser.Point(object2.x + object2.vel.x, object2.y + object2.vel.y);
                    var interactionRadius2 = object2.interactionRadius;

                    var collisionResult = intersectRectCircleSk(intentVertices, intentPos2.x, intentPos2.y, interactionRadius2);
                    
                    return {result: collisionResult.result, obstacle: object2, intPoint: collisionResult.intPoint};

                } else if (object2.colliderType === 'rectangle') {

                    var intentVertices2 = [];

                    for (var v in object2.vertices) {
                        intentVertices2.push(Phaser.Point.add(object2.vertices[v], object2.vel));
                    }

                    var collisionResult = intersectRectRectSk(intentVertices, intentVertices2);
                    return {result: collisionResult.result, obstacle: object2, intPoint: collisionResult.intPoint, edge: object2};

                } else if (object2.colliderType === 'multiRectangle') {                    

                    for (var seg in object2.outerSegments){

                        var segment = object2.outerSegments[seg];
                        
                        var intentSegment2 = [Phaser.Point.add(segment[0], object2.vel), segment[1]];

                        var collisionResult = intersectSegRectSkwp(intentSegment2, intentVertices);

                        if (collisionResult.result) {
                            return {result: collisionResult.result, obstacle: object2, intPoint: collisionResult.intPoint, segment: segment};
                        }
                    }

                }

            } else if (object1.colliderType === 'multiRectangle') {

                if (object2.colliderType==='multiRectangle') {
                    for (var seg1 in object1.outerSegments) {

                        var segment1 = object1.outerSegments[seg1],
                            intentSegment1 = [Phaser.Point.add(segment1[0], object1.vel), segment1[1]];
                        
                        for (var seg2 in object2.outerSegments) {

                            var segment2 = object2.outerSegments[seg2],
                                intentSegment2 = [Phaser.Point.add(segment2[0], object2.vel), segment2[1]];                            

                            var collisionResult = intersectSegSeg(intentSegment1[0], intentSegment1[1], intentSegment2[0], intentSegment2[1]);

                            if (collisionResult.result) {
                                return {result: collisionResult.result, obstacle: object2, intPoint: collisionResult.intPoint, segment: segment2};
                            }

                        }
                    }
                } else if (object2.colliderType==='rectangle') {

                    for (var e in object1.edges) {

                        var edge = object1.edges[e],
                            intentVertices = edge.vertices.map(function(vertex){
                                return Phaser.Point.add(vertex, object1.vel);
                            }, this);

                        var intentVertices2 = object2.vertices.map(function(vertex){
                            return Phaser.Point.add(vertex, object2.vel);
                        }, this);

                        var collisionResult = intersectRectRectSk(intentVertices, intentVertices2);

                        if (collisionResult.result) {
                            return {result: collisionResult.result, obstacle: object2, intPoin: collisionResult.intPoint, edge: object2};
                        }
                    }
                } else if (object2.colliderType==='circle') {

                    //console.log('multirectangle - circle collision');

                    for (var seg in object1.outerSegments) {

                        var segment = object1.outerSegments[seg],
                            intentSegment = [Phaser.Point.add(segment[0], object1.vel), segment[1]];

                        var intentPos2 = Phaser.Point.add(object2.world, object2.vel),
                            interactionRadius2 = object2.interactionRadius;

                        var collisionResult = intersectSegCircle(intentSegment[0], intentSegment[1], intentPos2, interactionRadius2);

                        if (collisionResult.result) {
                            return {result: collisionResult.result, obstacle: object2, intPoint: collisionResult.intPoint, segment: segment};
                        }
                    }
                }
            }
            
        }

        return {result: false, obstacle: null, intPoint: null};
    },

};

wallsPicker = {
    //colors: [{used: 0, color: 0x0abbff}, {used:0, color: 0x2effc9}, {used: 0, color: 0xff7f11}, {used:0, color: 0xff254b}, {used:0, color: 0xffbe0c}],
    //colors: [{used: 0, color: 'blue'}, {used:0, color: 'red'}, {used: 0, color: 'green'}, {used:0, color: 'orange'}, {used:0, color: 'yellow'}],
    immovableWalls: {'maze': [{used:0, color: 'grey'}],
            'lab': [{used: 0, color: 'metalPipe'}],
            'brain': [{used:0, color: 'rock'}]},

    movableWalls: {'maze': [{used:0, color: 'paperBlue'}, {used:0, color:'paperGreen'}, {used:0, color:'paperYellow'}, {used:0, color: 'paperPink'}, {used:0, color: 'paperPurple'}],
            'lab': [{used: 0, color: 'glassTube'}, {used: 0, color: 'electricStrings'}, {used: 0, color: 'plasticTube'}, {used: 0, color: 'wire'}],
            'brain': [{used:0, color:'green'}, {used:0, color:'orange'}, {used:0 , color:'purple'}, {used:0, color: 'lightGreen'}]},

    electrodes: {'lab': [{used: 0, color: 'green'}, {used:0, color: 'blue'}, {used: 0, color: 'red'}, {used: 0, color: 'purple'}]},

    reset: function() {
        for (var c in this.movableWalls) {

            for (var w in this.movableWalls[c]) {
                this.movableWalls[c][w].used = 0;   
            }
        }

        for (var c in this.immovableWalls) {

            for (var w in this.immovableWalls[c]) {
                this.immovableWalls[c][w].used = 0;   
            }
        }

        for (var c in this.electrodes) {

            for (var w in this.electrodes[c]) {
                this.electrodes[c][w].used = 0;   
            }
        }
    },

    giveWall: function(game, world, movability) {

        var wallsArray = [];
        //console.log(this.immovableWalls[world]);
        //console.log(world);

        if (movability === 'immovable') {
            wallsArray = this.immovableWalls[world];
            //console.log('wallsArray imm');
        } else if (movability === 'movable'){
            wallsArray = this.movableWalls[world];
            //console.log('wallsArray m');
        } else if (movability === 'electrode') {
            wallsArray = this.electrodes[world];
        }

        //console.log(wallsArray);

        var candidates = [];

        wallsArray.sort(function(a, b){
            if (a.used<b.used) {
                return -1;
            }
            return 1;
        });

        wallsArray.forEach(function(wallType){

            if (wallType.used === wallsArray[0].used) {

                candidates.push(wallType.color);

            }

        }, this);

        var chosenColor = game.rnd.pick(candidates);

        wallsArray.forEach(function(wallType){

            if (wallType.color === chosenColor) {
                wallType.used++;
            }
        }, this);

        return chosenColor;


    }

}

audioPlayer = {
    soundsNamesArray: [],
    sounds: {},
    soundsDecoded: false,
    soundSources: [],

    initiate: function(game) {
        this.game = game;
    },

    decode: function(namesArray) {

        var soundsArray = [];

        this.soundsNamesArray = namesArray;
        this.soundsNamesArray.forEach(function(soundName){
            var sound = this.game.add.audio(soundName);
            this.sounds[soundName] = sound;
            soundsArray.push(sound);
        }, this);

        this.game.sound.setDecodedCallback(soundsArray, this.soundsDecoded, this);
    },

    soundsDecoded: function() {
        this.soundsDecoded = true;
        this.switchBackground((this.game.gameWorld || 'menu'));
        this.sounds['menuBg'].volume = 0.5;
        this.sounds['mazeBg'].volume = 0.5;
        this.sounds['labBg'].volume = 0.5;
        this.sounds['brainBg'].volume = 0.5;
        this.sounds['storyBg'].volume = 0.5;
        this.sounds['win'].volume = 0.5;
        this.sounds['lose'].volume = 0.5;
    },

    switchBackground: function(newWorld) {
        var newBgMusic = null;

        switch(newWorld) {
            case 'menu':
                newBgMusic = this.sounds['menuBg'];
                break;
            case 'maze':
                newBgMusic = this.sounds['mazeBg'];
                //console.log('get into maze');
                break;
            case 'lab':
                newBgMusic = this.sounds['labBg'];
                break;
            case 'brain':
                newBgMusic = this.sounds['brainBg'];
                break;
            case 'story':
                newBgMusic = this.sounds['storyBg'];
                break;
        }

        if (!this.currentBgMusic || this.currentBgMusic.key != newBgMusic.key) {
            if (this.currentBgMusic) {
                this.currentBgMusic.stop();    
            }            
            this.currentBgMusic = newBgMusic;
            this.currentBgMusic.loopFull();
        }
    },

    playOneTime: function(reason) {
        switch (reason) {
            case 'pushWall':
                if (!this.sounds['pushWall'].isPlaying) {
                    this.sounds['pushWall'].play();
                }
                break;
            case 'buttonPush':
                if (!this.sounds['buttonPush'].isPlaying) {
                    this.sounds['buttonPush'].play();
                }
                break;
            case 'octopusScream':
                if (!this.sounds['octopusScream'].isPlaying) {
                    this.sounds['octopusScream'].play();
                }
                break;
            case 'worm':
                if (!this.sounds['worm'].isPlaying) {
                    this.sounds['worm'].play();
                }
                break;
            case 'teleport':
                if (!this.sounds['teleport'].isPlaying) {
                    this.sounds['teleport'].play();
                }
                break;
            case 'wallCollision':
                if (!this.sounds['wallCollision'].isPlaying) {
                    this.sounds['wallCollision'].play();
                }
                break;
            case 'wallBallCollision':
                if (!this.sounds['wallBallCollision'].isPlaying) {
                    this.sounds['wallBallCollision'].play();
                }
                break;
            case 'win':
                if (!this.sounds['win'].isPlaying) {
                    this.sounds['win'].play();
                }
                break;
            case 'lose':
                if (!this.sounds['lose'].isPlaying) {
                    this.sounds['lose'].play();
                }
                break;
        }
    },

    setSoundSources: function(objectArray) {
        this.soundSources = objectArray.map(function(object){
            var sourceSound = null;
            if (object.__proto__.constructor === Bee) {
                sourceSound = this.sounds['bee'];
                var source = {object: object, sound: sourceSound};
                sourceSound.loopFull();
                sourceSound.volume = 0.1;
            } else if (object.__proto__.constructor === ElectricArcsGroup) {
                sourceSound = this.sounds['electric'];
                //console.log('have electrode');
                var source = {object: object, sound: sourceSound};  
                if (object.turnedOn && object.connected) {
                    sourceSound.loopFull();
                    sourceSound.volume = 0.1;
                }
                object.statusSignal.add(function(status){
                    if (status==='on') {
                        sourceSound.loopFull();
                        sourceSound.volume = 0.1;
                    } else if (status==='off') {
                        sourceSound.stop();
                    }
                }, this);
                
            } else if (object.__proto__.constructor === Fan) {
                sourceSound = this.sounds['fan'];
                //console.log('have electrode');
                var source = {object: object, sound: sourceSound};  
                if (object.turnedOn) {
                    sourceSound.loopFull();
                    sourceSound.volume = 0.8;
                }
                object.statusSignal.add(function(status){
                    if (status==='on') {
                        sourceSound.loopFull();
                        sourceSound.volume = 0.8;
                    } else if (status==='off') {
                        sourceSound.stop();
                    }
                }, this);
                
            }

            return source;
        }, this);
        //console.log(this.soundSources);
        //console.log(objectArray);
    },

    updateSourcesVolume: function(ballPos) {
        this.soundSources.forEach(function(source){
            var distance = ballPos.distance(source.object.position),
                volume = Math.max((200*configuration.scaleRatio - distance)/(200*configuration.scaleRatio), 0);
                //f (volume>0) console.log(source.sound);

            //source.sound.fadeTo(100, volume);
            //source.sound.volume = volume;

        }, this);
    },

    clearSoundSources: function() {
        if (this.soundSources) {
                this.soundSources.forEach(function(source){
                source.sound.stop();
            }, this);
            this.soundSources = null;    
        }
        
    }
}

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
        else if (typeof this[i]==="number" && typeof array[i]==="number") {
            if (Math.abs(this[i]-array[i])>0.01) {
                return false;
            }            
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