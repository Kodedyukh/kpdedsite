webpackJsonp([0],{

/***/ 1159:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlainCollider = __webpack_require__(223);
var wallGenerator = __webpack_require__(73);
var Wall = __webpack_require__(141);
var FreeDoor = __webpack_require__(1163);
var MetalBox = __webpack_require__(1164);
var WoodBox = __webpack_require__(471);
var Bouncy = __webpack_require__(472);
var Finish = __webpack_require__(1165);
var LavaWall = __webpack_require__(473);
var Floor = __webpack_require__(1166);
var FuelCan = __webpack_require__(1167);

var PlayScene = exports.PlayScene = function (_Phaser$Scene) {
    _inherits(PlayScene, _Phaser$Scene);

    function PlayScene() {
        _classCallCheck(this, PlayScene);

        return _possibleConstructorReturn(this, (PlayScene.__proto__ || Object.getPrototypeOf(PlayScene)).call(this, 'PlayScene'));
    }

    _createClass(PlayScene, [{
        key: 'create',
        value: function create() {

            CloudAPI.play();

            //console.log('play scene launched');
            var gameWidth = this.game.config.width,
                gameHeight = this.game.config.height;

            PlainCollider.initiate();

            this.staticWallsCollGroup = PlainCollider.registerNewCollGroup('staticWallsCollGroup');
            this.gravityWallsCollGroup = PlainCollider.registerNewCollGroup('gravityWallsCollGroup');
            this.bouncyCollGroup = PlainCollider.registerNewCollGroup('bouncyCollGroup');
            this.fuelCanCollGroup = PlainCollider.registerNewCollGroup('fuelCanCollGroup');

            this.playPortrait = this.add.image(gameWidth * 0.5 - 10000, gameHeight * 0.5 - 10000, 'playPortrait');
            this.playPortrait.setDepth(200);
            this.playPortrait.alpha = 0;

            this.maze = this.add.group();
            this.respawnFuelSpots = [];
            this.fuelSpawned = false;

            var levelName = 'level' + this.game.levelNumber;
            //console.log(levelName);
            this.level = this.cache.json.get(levelName);
            this.loadLevel(this.level);

            //console.log('level loaded');

            // camera
            var mainWall = this.maze.children.entries[0];
            this.cameras.main.startFollow(mainWall, true);
            var scale = Math.min(this.cameras.main.width / (mainWall.width + 80), this.cameras.main.height / (mainWall.height + 80));
            this.cameras.main.setZoom(scale);

            this.input.on('pointerdown', function (pointer) {
                //this.rotateMazeLeft();
                //console.log(this.bouncyVelocity);
                //Phaser.Actions.RotateAround(this.maze.getChildren(), {x: this.bouncy.x, y: this.bouncy.y}, Math.PI/2);

                /*this.bouncy.reporting = true;
                this.maze.children.each(function(entity){                
                    entity.reporting = true;
                }, this);*/
                //this.playing = !this.playing;

            }, this);

            this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
            this.nKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);

            this.playing = true;

            // fuel level indicator

            this.guiContainer = this.add.container(10000, 10000);

            // fuel level indicator        

            this.fuelLevelBack = this.add.image(10000 + gameWidth * 0.87, 10000 + gameHeight * 0.08, 'fuelIndicatorBack');
            this.fuelLevel = this.add.image(10000 + gameWidth * 0.87, 10000 + gameHeight * 0.08, 'fuelIndicatorLevel');
            this.fuelLevelLogo = this.add.image(10000 + gameWidth * 0.87, 10000 + gameHeight * 0.08, 'fuelIndicatorLogo');

            this.noFuelTween = this.tweens.add({
                targets: this.noFuelSignal,
                props: {
                    alpha: { value: 1, ease: 'Quad.easeOut' }
                },
                yoyo: true,
                duration: 300,
                paused: true
            });

            //this.guiContainer.add(this.fuelLevelBack);
            //this.guiContainer.add(this.fuelLevelLogo);

            this.fuelLevelBack.setDepth(20);
            this.fuelLevelLogo.setDepth(21);

            /*this.fuelGraphics = this.add.graphics({fillStyle: {color: 0xeeba6d}});
            this.fuelGraphics.setPosition(10000 + gameWidth * 0.87, 10000 + gameHeight * 0.08);
            this.fuelStartingAngle = -Math.PI/2;
            this.fuelGraphics.slice(0, 0, 40, this.fuelStartingAngle, Math.PI * 3 / 2);
            this.fuelGraphics.fillPath();*/

            /*this.fuelGraphics = this.add.arc(10000 + gameWidth * 0.87, 
                10000 + gameHeight * 0.08, 35, -90, 270, false, 0xffffff, 1);
            this.fuelGraphics.closePath = false;
            this.fuelGraphics.isFilled = false;
            this.fuelGraphics.isStroked = true;
            this.fuelGraphics.setStrokeStyle(10, 0xeeba6d, 1);
            this.fuelGraphics.setDepth(20)*/
            //this.fuelLevel.mask = new Phaser.Display.Masks.GeometryMask(this, this.fuelGraphics);

            // pause button
            this.pauseButton = this.makeButton('pauseButton', '', gameWidth * 0.13, gameHeight * 0.08, this.pauseGame);
            this.guiContainer.add(this.pauseButton);

            // level label
            this.levelLabelBack = this.add.image(this.game.config.width / 2, gameHeight * 0.03, 'levelLabelBack');
            this.levelLabel = this.add.bitmapText(this.levelLabelBack.x, this.levelLabelBack.y, 'peachFont', 'Level ' + this.game.levelNumber, 28);
            
            this.levelLabel.setOrigin(0.5);
            this.guiContainer.add(this.levelLabelBack);
            this.guiContainer.add(this.levelLabel);            
            this.levelLabel.setTintFill(0xeeba6d);

            if (!this.game.device.os.desktop) {
                this.rotateCClButton = this.makeButton('rotateCClButton', '', gameWidth * 0.85, gameHeight * 0.935, this.rotateMazeLeftTween);
                this.rotateClButton = this.makeButton('rotateClButton', '', gameWidth * 0.15, gameHeight * 0.935, this.rotateMazeRightTween);
                this.thrustButton = this.makePressButton('thrustButton', '', gameWidth * 0.5, gameHeight * 0.935, this.switchContinuousThrust);

                var buttonsFrameGraphics = this.make.graphics();
                buttonsFrameGraphics.fillStyle(0x4b4366);
                buttonsFrameGraphics.fillRect(0, 0, gameWidth, 
                    gameHeight - this.thrustButton.getTopLeft().y*0.98);
                buttonsFrameGraphics.generateTexture('buttonsFrame', gameWidth,
                    gameHeight - this.thrustButton.getTopLeft().y*0.98);

                this.buttonsFrame = this.add.image(0, this.thrustButton.getTopLeft().y*0.98,
                    'buttonsFrame');
                this.buttonsFrame.setOrigin(0);

                this.guiContainer.add(this.buttonsFrame);
                this.guiContainer.add(this.rotateCClButton);
                this.guiContainer.add(this.rotateClButton);
                this.guiContainer.add(this.thrustButton);

                var scale = Math.min(this.cameras.main.width / (mainWall.width + 120), this.cameras.main.height / (mainWall.height + this.buttonsFrame.displayHeight));
                this.cameras.main.setZoom(scale);
            }

            // tutorials

            if (this.game.levelNumber===1)
            {

                if (this.game.device.os.desktop)
                {
                    this.tutRotCCl = this.add.image(gameWidth*0.5, gameHeight*0.98, 'tutRotCCl');
                    this.tutRotCCl.setOrigin(0.5, 1);
                    this.tutRotCl = this.add.image(gameWidth*0.5, gameHeight*0.98, 'tutRotCl');
                    this.tutRotCl.setOrigin(0.5, 1);

                    this.guiContainer.add(this.tutRotCl);
                    this.guiContainer.add(this.tutRotCCl);

                    this.tutRotCl.alpha = 0;
                } else
                {
                    this.tutRotCCl = this.add.image(this.rotateCClButton.getBottomRight().x - 10, 
                        this.rotateCClButton.getTopLeft().y + 10, 'mobTutRotCCl');
                    this.tutRotCCl.setOrigin(1, 1);
                    this.tutRotCl = this.add.image(this.rotateClButton.getTopLeft().x + 10, 
                        this.rotateClButton.getTopLeft().y + 10, 'mobTutRotCl');
                    this.tutRotCl.setOrigin(0, 1);

                    this.guiContainer.add(this.tutRotCl);
                    this.guiContainer.add(this.tutRotCCl);

                    this.tutRotCl.alpha = 0;
                }
            } else if (this.game.levelNumber===2)
            {
                if (this.game.device.os.desktop)
                {                    
                    this.tutThrust = this.add.image(gameWidth*0.5, gameHeight*0.98, 'tutThrust');
                    this.tutThrust.setOrigin(0.5, 1);

                    this.guiContainer.add(this.tutThrust);
                } else
                {
                    this.tutThrust = this.add.image(gameWidth*0.5, this.thrustButton.getTopLeft().y + 10, 'mobTutThrust');
                    this.tutThrust.setOrigin(0.5, 1);

                    this.guiContainer.add(this.tutThrust);
                }
            }

            this.HUDCamera = this.cameras.add(0, 0, gameWidth, gameHeight);
            this.HUDCamera.setScroll(10000, 10000);

            this.bouncy.on('tankUp', this.tankUpBouncy, this);

            PlainCollider.refreshPairs();

            //this.debugGraphics = this.add.graphics({ lineStyle: { color: 0xff0000 } });

            // create separete popup camera
            // it shouold be affected by the game cenra zoom
            this.popupCamera = this.cameras.add(0, 0, gameWidth, gameHeight);
            this.popupCamera.setScroll(-10000, -10000);

            // win popup
            this.winPopup = this.add.container(-10000, -10000);
            this.winPopupBack = this.add.image(gameWidth * 0.5, gameHeight * 0.5, 'winPopupBack');
            this.winPopupImage = this.add.image(gameWidth * 0.5, gameHeight * 0.4, 'winPopupImage');
            this.nextLevelButton = this.makeButton('nextLevelButton', '', gameWidth * 0.5 + 80, gameHeight * 0.7, this.launchNextLevel);            
            this.replayButton = this.makeButton('replayButton', '', gameWidth * 0.5 - 80, gameHeight * 0.7, this.replayLevel);            

            this.winPopup.add(this.winPopupBack);
            this.winPopup.add(this.winPopupImage);
            this.winPopup.add(this.nextLevelButton);
            this.winPopup.add(this.replayButton);

            if (this.game.device.os.desktop)
            {
                this.winPressN = this.add.image(this.nextLevelButton.x,
                    this.nextLevelButton.getBottomRight().y, 'pressN');
                this.winPressN.setOrigin(0.5, 0);
                this.winPressR = this.add.image(this.replayButton.x,
                    this.replayButton.getBottomRight().y, 'pressR');
                this.winPressR.setOrigin(0.5, 0);
                this.winPopup.add(this.winPressR);
                this.winPopup.add(this.winPressN);
            }

            this.winPopup.setDepth(20);
            this.winPopup.alpha = 0;
            this.nextLevelButton.disableInteractive();
            this.replayButton.disableInteractive();

            // final popup
            this.finalPopup = this.add.container(-10000, -10000);
            this.finalPopupBack = this.add.image(gameWidth*0.5, gameHeight*0.5, 'winPopupBack');
            this.finalPopupImage = this.add.image(gameWidth*0.5, gameHeight*0.4, 'finalPopupImage');
            this.finalGoLevelChoiceButton = this.makeButton('goLevelChoiceButton', '', gameWidth*0.5 - 80, gameHeight*0.8, this.goLevelChoice);
            this.finalReplayButton = this.makeButton('replayButton', '', gameWidth*0.5 + 80, gameHeight*0.8, this.replayLevel);

            this.finalPopup.add(this.finalPopupBack);
            this.finalPopup.add(this.finalPopupImage);
            this.finalPopup.add(this.finalGoLevelChoiceButton);
            this.finalPopup.add(this.finalReplayButton);

            this.finalPopup.setDepth(20);
            this.finalPopup.alpha = 0;
            this.finalGoLevelChoiceButton.disableInteractive();
            this.finalReplayButton.disableInteractive();

            // lose popup
            this.losePopup = this.add.container(-10000, -10000);
            this.losePopupBack = this.add.image(gameWidth * 0.5, gameHeight * 0.5, 'losePopupBack');
            this.losePopupImage = this.add.image(gameWidth * 0.5, gameHeight * 0.4, 'losePopupImage');
            this.loseReplayButton = this.makeButton('replayButton', '', gameWidth * 0.5, gameHeight * 0.7, this.replayLevel);

            this.losePopup.add(this.losePopupBack);
            this.losePopup.add(this.losePopupImage);
            this.losePopup.add(this.loseReplayButton);

            if (this.game.device.os.desktop)
            {
                this.losePressR = this.add.image(this.loseReplayButton.x,
                    this.loseReplayButton.getBottomRight().y, 'pressR');
                this.losePressR.setOrigin(0.5, 0);
                this.losePopup.add(this.losePressR);
            }

            this.losePopup.setDepth(20);
            this.losePopup.alpha = 0;
            this.loseReplayButton.disableInteractive();

            // pause popup
            this.pausePopup = this.add.container(-10000, -10000);
            this.pausePopupBack = this.add.image(gameWidth * 0.5, gameHeight * 0.5, 'pausePopupBack');
            this.pausePopupImage = this.add.image(gameWidth * 0.5, gameHeight * 0.35, 'pausePopupImage');
            this.pauseReplayButton = this.makeButton('replayButton', '', gameWidth * 0.5 - 80, gameHeight * 0.67, this.replayLevel);
            this.pauseContinueButton = this.makeButton('nextLevelButton', '', gameWidth * 0.5 + 80, gameHeight * 0.67, this.continueGame);
            this.pauseMuteButton = this.makeMuteButton('muteButton', '', gameWidth*0.5 + 90, gameHeight*0.84);

            this.pausePopup.add(this.pausePopupBack);
            this.pausePopup.add(this.pausePopupImage);
            this.pausePopup.add(this.pauseReplayButton);
            this.pausePopup.add(this.pauseContinueButton);
            this.pausePopup.add(this.pauseMuteButton);

            if (this.game.device.os.desktop)
            {
                this.pausePressR = this.add.image(this.pauseReplayButton.x,
                    this.pauseReplayButton.getBottomRight().y, 'pressR');
                this.pausePressR.setOrigin(0.5, 0);
                this.pausePopup.add(this.pausePressR);
            }

            this.pausePopup.setDepth(20);
            this.pausePopup.alpha = 0;
            this.pauseReplayButton.disableInteractive();
            this.pauseContinueButton.disableInteractive();
            this.pauseMuteButton.disableInteractive();

            // rocket launch animation
            this.rocketLaunch = this.add.sprite(this.bouncy.x, this.bouncy.y, 'launch');
            this.rocketLaunch.alpha = 0;
            this.rocketLaunch.setOrigin(0.5, 1);
            var launchAnimFrames = this.anims.generateFrameNames('launch', { start: 1, end: 9 });
            /*{key: 'launch', frame: '1'},
            {key: 'launch', frame: '2'},
            {key: 'launch', frame: '3'},
            {key: 'launch', frame: '4'},
            {key: 'launch', frame: '5'},
            {key: 'launch', frame: '6'},
            {key: 'launch', frame: '7'},
            {key: 'launch', frame: '8'},
            {key: 'launch', frame: '9'}
            ];*/
            this.maze.add(this.rocketLaunch);
            this.rocketLaunchAnimation = this.anims.create({ key: 'rocketLaunch', frames: launchAnimFrames, repeat: 0, frameRate: 10 });
            this.rocketLaunch.on('animationcomplete', this.hideLaunch, this);
            this.rocketLaunch.setDepth(11);

            // check that the scene is not freezed
            if (this.freezed) {
                this.freezed = false;
            }

            this.pendingAction = false;
            this.continuousThrust = false;

            // game sounds

            this.buttonSound = this.sound.add('buttonSound');
            this.loseSound = this.sound.add('loseSound');
            this.winSound = this.sound.add('winSound');
            this.jetSound = this.sound.add('jetSound');
            this.fuelSound = this.sound.add('fuelSound');
            this.rotateSound = this.sound.add('rotateSound');
            this.shockSound = this.sound.add('shockSound');

            if (this.game.backgroundMusic.isPaused) this.game.backgroundMusic.resume();

            //console.log('end of create');
        }
    }, {
        key: 'showFinalPopup',
        value: function showFinalPopup() {
            if (this.finalPopup.alpha === 0)
            {
                this.winSound.play();
                this.finalPopup.alpha = 1;
                this.finalGoLevelChoiceButton.setInteractive();
                this.finalReplayButton.setInteractive();
                this.freezed = true;
                this.pauseButton.disableInteractive();
            }
        }
    }, {
        key: 'loadLevel',
        value: function loadLevel(level) {
            wallGenerator.clearBin();
            for (var wallI in level) {
                var wall = level[wallI];

                switch (wall.wallType) {
                    case 'start':
                        this.bouncy = new Bouncy(this, wall.edges[0][0], wall.edges[0][1]);

                        // set object to collider
                        PlainCollider.addObject(this.bouncy, this.bouncy.vertices);
                        PlainCollider.assignCollGroup(this.bouncy, 'bouncyCollGroup');
                        this.bouncy.collWith = [this.staticWallsCollGroup, this.gravityWallsCollGroup, this.fuelCanCollGroup];

                        this.bouncy.on('animationcomplete', this.showLosePopup, this);

                        break;
                    case 'finish':
                        this.finish = new Finish(this, wall.edges[0][0], wall.edges[0][1]);
                        this.maze.add(this.finish);
                        break;
                    case 'wall':
                        var wallSprite = new Wall(this, wall.edges, wallI);
                        this.maze.add(wallSprite);

                        //set wall to collider
                        PlainCollider.addObject(wallSprite, wallSprite.vertices);
                        PlainCollider.assignCollGroup(wallSprite, 'staticWallsCollGroup');
                        wallSprite.collWith = [this.bouncyCollGroup, this.gravityWallsCollGroup];

                        break;
                    case 'gWall':
                        var wallSprite = new Wall(this, wall.edges, wallI);
                        this.maze.add(wallSprite);

                        //set wall to collider
                        PlainCollider.addObject(wallSprite, wallSprite.vertices);
                        PlainCollider.assignCollGroup(wallSprite, 'gravityWallsCollGroup');
                        wallSprite.collWith = [this.bouncyCollGroup, this.gravityWallsCollGroup, this.staticWallsCollGroup];

                        break;
                    case 'freeDoor':
                        var wallSprite = new FreeDoor(this, wall.edges, wallI);
                        this.maze.add(wallSprite);

                        //set wall to collider
                        PlainCollider.addObject(wallSprite, wallSprite.vertices);
                        PlainCollider.assignCollGroup(wallSprite, 'gravityWallsCollGroup');
                        wallSprite.collWith = [this.bouncyCollGroup, this.gravityWallsCollGroup, this.staticWallsCollGroup];

                        break;
                    case 'metalBox':
                        var box = new MetalBox(this, wall.edges, wallI);
                        this.maze.add(box);

                        //set box to collider
                        PlainCollider.addObject(box, box.vertices);
                        PlainCollider.assignCollGroup(box, 'gravityWallsCollGroup');
                        box.collWith = [this.bouncyCollGroup, this.gravityWallsCollGroup, this.staticWallsCollGroup];

                        break;
                    case 'woodBox':
                        var box = new WoodBox(this, wall.edges, wallI);
                        this.maze.add(box);

                        //set box to collider
                        PlainCollider.addObject(box, box.vertices);
                        PlainCollider.assignCollGroup(box, 'gravityWallsCollGroup');
                        box.collWith = [this.bouncyCollGroup, this.gravityWallsCollGroup, this.staticWallsCollGroup];

                        break;
                    case 'lavaWall':
                        var wallSprite = new LavaWall(this, wall.edges, wallI);
                        this.maze.add(wallSprite);

                        //set wall to collider
                        PlainCollider.addObject(wallSprite, wallSprite.vertices);
                        PlainCollider.assignCollGroup(wallSprite, 'staticWallsCollGroup');
                        wallSprite.collWith = [this.bouncyCollGroup, this.gravityWallsCollGroup];

                        break;
                    case 'floor':
                        this.floor = new Floor(this, wall.edges, wallI);
                        this.maze.add(this.floor);

                        break;

                    case 'respawnFuel':
                        var spot = this.add.image(wall.edges[0][0], wall.edges[0][1], 'fuelCan');
                        spot.alpha = 0;
                        this.respawnFuelSpots.push(spot);
                        this.maze.add(spot);

                        break;
                }
            }
        }
    }, {
        key: 'rotateMazeRightTween',
        value: function rotateMazeRightTween() {
            if (!this.freezed)
            {
                if (this.tutRotCl && this.tutRotCl.alpha > 0)
                {
                    this.tutRotCl.alpha = 0;
                }
                
                this.freezeForRotation();
                this.maze.children.each(function (wall) {

                    //console.log(newCenter);

                    var rotTween = this.tweens.add({
                        targets: wall,
                        props: {
                            rotation: { value: wall.rotation + Math.PI / 2, ease: 'Linear' }
                            //x: {value: newCenter.x, ease: 'Linear'},
                            //y: {value: newCenter.y, ease: 'Linear'}
                        },
                        duration: 900
                    });

                    //console.log(rotTween.callbacks);

                    // move the center of the wall with rotation
                    var prevRotation = wall.rotation;
                    rotTween.callbacks.onUpdate = {
                        func: function func() {
                            var rotDelta = wall.rotation - prevRotation,
                                newCenter = new Phaser.Math.Vector2(wall.x - this.bouncy.x, wall.y - this.bouncy.y),
                                rotateMatrix = new Phaser.Math.Matrix3();
                            rotateMatrix.fromArray([Math.cos(rotDelta), Math.sin(rotDelta), 0, -Math.sin(rotDelta), Math.cos(rotDelta), 0, 0, 0]);
                            newCenter.transformMat3(rotateMatrix);
                            newCenter.add(new Phaser.Math.Vector2(this.bouncy.x, this.bouncy.y));
                            prevRotation = wall.rotation;
                            wall.x = newCenter.x;
                            wall.y = newCenter.y;
                            /*if(wall.__proto__.constructor === Floor) {
                                wall.rotateMask(this.bouncy.x, this.bouncy.y, rotDelta);
                            }*/
                        },
                        scope: this,
                        params: [rotTween]
                    };

                    // rotate collider only for thhose who has one

                    if (wall.collider) {

                        rotTween.callbacks.onComplete = {
                            func: function func() {
                                PlainCollider.rotateCollider(wall, Math.PI / 2, new Phaser.Math.Vector2(this.bouncy.x, this.bouncy.y));
                                if (wall.__proto__.constructor === LavaWall) {
                                    wall.endRotation();
                                }
                            },
                            scope: this,
                            params: [rotTween]
                        };
                    }

                    // rotate flash paths for lava walls

                    if (wall.__proto__.constructor === LavaWall) {
                        wall.startRotation(Math.PI / 2, new Phaser.Math.Vector2(this.bouncy.x, this.bouncy.y));
                    }
                }, this);

                // set zoom tween
                var mainWall = this.maze.children.entries[0];
                    
                if (this.game.device.os.desktop) var scale = Math.min(this.cameras.main.width / Math.abs((mainWall.width + 80) * Math.cos(mainWall.rotation + Math.PI / 2) + (mainWall.height + 80) * Math.sin(mainWall.rotation + Math.PI / 2)), this.cameras.main.height / Math.abs((mainWall.width + 80) * Math.sin(mainWall.rotation + Math.PI / 2) + (mainWall.height + 80) * Math.cos(mainWall.rotation + Math.PI / 2)));
                else var scale = Math.min(this.cameras.main.width / Math.abs((mainWall.width + 120) * Math.cos(mainWall.rotation + Math.PI / 2) + (mainWall.height + this.buttonsFrame.displayHeight+40) * Math.sin(mainWall.rotation + Math.PI / 2)), 
                    this.cameras.main.height / Math.abs((mainWall.width + 120) * Math.sin(mainWall.rotation + Math.PI / 2) + (mainWall.height + this.buttonsFrame.displayHeight+40) * Math.cos(mainWall.rotation + Math.PI / 2)));

                var zoomTween = this.tweens.add({
                    targets: this.cameras.main,
                    props: {
                        zoom: { value: scale, ease: 'Linear' }
                    },
                    duration: 900
                });

                //console.log(scale);

                this.time.delayedCall(1100, this.unfreezeAfterRotation, [], this);

                if (this.jetSound.isPlaying) this.jetSound.pause();

                this.rotateSound.play();
                this.stopBouncyThrust();
            } else
            {
                this.pendingAction = this.rotateMazeRightTween
            }
        }
    }, {
        key: 'rotateMazeLeftTween',
        value: function rotateMazeLeftTween() {
            if (!this.freezed)
            {

                if (this.tutRotCCl && this.tutRotCCl.alpha > 0)
                {
                    this.tutRotCCl.alpha = 0;
                    this.tutRotCl.alpha = 1;
                }

                this.freezeForRotation();
                this.maze.children.each(function (wall) {
                    //console.log(newCenter);

                    var rotTween = this.tweens.add({
                        targets: wall,
                        props: {
                            rotation: { value: wall.rotation - Math.PI / 2, ease: 'Linear' }
                            //x: {value: newCenter.x, ease: 'Linear'},
                            //y: {value: newCenter.y, ease: 'Linear'}
                        },
                        duration: 900
                    });

                    // move the center of the wall with rotation
                    var prevRotation = wall.rotation;
                    rotTween.callbacks.onUpdate = {
                        func: function func() {
                            var rotDelta = wall.rotation - prevRotation,
                                newCenter = new Phaser.Math.Vector2(wall.x - this.bouncy.x, wall.y - this.bouncy.y),
                                rotateMatrix = new Phaser.Math.Matrix3();
                            rotateMatrix.fromArray([Math.cos(rotDelta), Math.sin(rotDelta), 0, -Math.sin(rotDelta), Math.cos(rotDelta), 0, 0, 0]);
                            newCenter.transformMat3(rotateMatrix);
                            newCenter.add(new Phaser.Math.Vector2(this.bouncy.x, this.bouncy.y));
                            prevRotation = wall.rotation;
                            wall.x = newCenter.x;
                            wall.y = newCenter.y;
                            /*if(wall.__proto__.constructor === Floor) {
                                wall.rotateMask(this.bouncy.x, this.bouncy.y, rotDelta);
                            }*/
                        },
                        scope: this,
                        params: [rotTween]

                        //console.log(rotTween.callbacks);

                    };if (wall.collider) {

                        rotTween.callbacks.onComplete = {
                            func: function func() {
                                PlainCollider.rotateCollider(wall, -Math.PI / 2, new Phaser.Math.Vector2(this.bouncy.x, this.bouncy.y));
                                if (wall.__proto__.constructor === LavaWall) {
                                    wall.endRotation();
                                }
                            },
                            scope: this,
                            params: [rotTween]
                        };
                    }

                    // rotate flash paths for lava walls

                    if (wall.__proto__.constructor === LavaWall) {
                        wall.startRotation(-Math.PI / 2, new Phaser.Math.Vector2(this.bouncy.x, this.bouncy.y));
                    }
                }, this);

                // set zoom tween
                var mainWall = this.maze.children.entries[0];

                if (this.game.device.os.desktop) var scale = Math.min(this.cameras.main.width / Math.abs((mainWall.width + 80) * Math.cos(mainWall.rotation + Math.PI / 2) + (mainWall.height + 80) * Math.sin(mainWall.rotation + Math.PI / 2)), this.cameras.main.height / Math.abs((mainWall.width + 80) * Math.sin(mainWall.rotation + Math.PI / 2) + (mainWall.height + 80) * Math.cos(mainWall.rotation + Math.PI / 2)));
                else var scale = Math.min(this.cameras.main.width / Math.abs((mainWall.width + 120) * Math.cos(mainWall.rotation + Math.PI / 2) + (mainWall.height + this.buttonsFrame.displayHeight+40) * Math.sin(mainWall.rotation + Math.PI / 2)), 
                    this.cameras.main.height / Math.abs((mainWall.width + 120) * Math.sin(mainWall.rotation + Math.PI / 2) + (mainWall.height + this.buttonsFrame.displayHeight+40) * Math.cos(mainWall.rotation + Math.PI / 2)));

                var zoomTween = this.tweens.add({
                    targets: this.cameras.main,
                    props: {
                        zoom: { value: scale, ease: 'Linear' }
                    },
                    duration: 900
                });

                this.time.delayedCall(1100, this.unfreezeAfterRotation, [], this);

                if (this.jetSound.isPlaying) this.jetSound.pause();

                this.rotateSound.play();
                this.stopBouncyThrust();
            } else
            {
                this.pendingAction = this.rotateMazeLeftTween;
            }
        }
    }, {
        key: 'freezeForRotation',
        value: function freezeForRotation() {
            this.freezed = true;
        }
    }, {
        key: 'unfreezeAfterRotation',
        value: function unfreezeAfterRotation() {
            
            
            
            this.freezed = false;

            this.bouncy.vel = new Phaser.Math.Vector2();
            this.maze.children.each(function (entity) {
                entity.vel = new Phaser.Math.Vector2();
                if (entity.__proto__.constructor === FuelCan) {
                    entity.rotation = 0;
                }
            }, this);

            if (this.pendingAction) {
                //console.log('executing pending action');
                this.pendingAction.call(this);
                this.pendingAction = false;
            }

            //this.cameras.main.setZoom(scale);
        }
    }, {
        key: 'restartScene',
        value: function restartScene() {
            this.anims.remove('idle');
            this.anims.remove('fly');
            this.anims.remove('shock');
            this.anims.remove('rocketLaunch');
            this.anims.remove('dustSplash');
            this.anims.remove('flashMain');
            this.anims.remove('main');
            if (this.game.levelNumber > this.game.lastAvailLevel) {
                this.game.lastAvailLevel = this.game.levelNumber;
                localStorage.setItem('levelNumber', this.game.lastAvailLevel);
            }
            wallGenerator.clearTextures();
            this.scene.restart();
        }
    }, {
        key: 'switchContinuousThrust',
        value: function switchContinuousThrust() {
            this.continuousThrust = !this.continuousThrust;
        }
    }, {
        key: 'thrustBouncy',
        value: function thrustBouncy() {

            if (this.tutThrust && this.tutThrust.alpha > 0)
            {
                this.tutThrust.alpha = 0;
            }

            if (this.bouncy.currentFuel > 0) {
                if (this.bouncy.fromGroundLaunch) {
                    this.bouncy.vel.y -= 3;
                    //console.log('from ground');
                    this.rocketLaunch.setPosition(this.bouncy.x - this.bouncy.displayWidth * 0.3, this.bouncy.y + this.bouncy.displayHeight * 0.5);
                    this.rocketLaunch.rotation = 0;
                    this.rocketLaunch.alpha = 1;
                    this.rocketLaunch.play('rocketLaunch');
                } else {
                    this.bouncy.vel.y -= 0.6;
                }

                if (this.bouncy.thrustSprite)
                {
                    if (this.bouncy.thrustAnimation.paused)
                    {
                        //this.bouncy.thrustSprite.alpha = 1;
                        this.bouncy.thrustSprite.play('main');
                        this.bouncy.thrustAnimation.resume();
                    }

                } else
                {
                    if (!this.bouncy.engineEmitter.on)
                    {
                        this.bouncy.engineEmitter.setPosition(this.bouncy.x - this.bouncy.displayWidth * 0.25, 
                            this.bouncy.y + this.bouncy.displayHeight * 0.5);
                        this.bouncy.engineEmitter.start();
                    }               
                }
                
                this.bouncy.currentFuel = Math.max(0, this.bouncy.currentFuel - 0.5);
                // update fuel indicator
                //this.fuelStartingAngle = (1 - this.bouncy.currentFuel / this.bouncy.fuelCapacity) * Math.PI * 2 - Math.PI/2;
                /*this.fuelGraphics.clear();             
                this.fuelGraphics.slice(0, 0, 40, startingAngle, Math.PI * 3 / 2);
                this.fuelGraphics.fillPath();*/
                //this.fuelGraphics.setStartAngle(startingAngle);

                var fuelBarHeight = this.bouncy.currentFuel / this.bouncy.fuelCapacity * 80;
                this.fuelLevel.setCrop(0, 80 - fuelBarHeight, 80, fuelBarHeight);

                if (!this.jetSound.isPlaying) {
                    this.jetSound.play();
                }
            }

            if (this.bouncy.currentFuel <= 50 && !this.fuelSpawned) {
                this.spawnFuel();
                this.fuelSpawned = true;
            }
            if (this.bouncy.flyAnimation.paused) {
                //console.log('fly animation resumed on thrust');
                this.bouncy.idleAnimation.pause();
                this.bouncy.play('fly');
                this.bouncy.flyAnimation.resume();
            } /*else if (!this.bouncy.idleAnimation.paused)
              {
                console.log('idle animation paused');
                this.bouncy.idleAnimation.pause();
                this.bouncy.play('fly');
              }*/
        }
    }, {
        key: 'hideLaunch',
        value: function hideLaunch() {
            this.rocketLaunch.alpha = 0;
        }
    }, {
        key: 'tankUpBouncy',
        value: function tankUpBouncy() {
            // upadte fuel level indicator
            //this.fuelStartingAngle = (1 - this.bouncy.currentFuel / this.bouncy.fuelCapacity) * Math.PI * 2 - Math.PI/2;
            /*this.fuelGraphics.clear();
            this.fuelGraphics.slice(0, 0, 40, startingAngle, Math.PI * 3 / 2);
            this.fuelGraphics.fillPath();*/
            //this.fuelGraphics.setStartAngle(startingAngle);

            var fuelBarHeight = this.bouncy.currentFuel / this.bouncy.fuelCapacity * 80;
            this.fuelLevel.setCrop(0, 80 - fuelBarHeight, 80, fuelBarHeight);

            this.fuelSpawned = false;
            this.fuelSound.play();
        }
    }, {
        key: 'spawnFuel',
        value: function spawnFuel() {
            var bouncyPos = new Phaser.Math.Vector2(this.bouncy.x, this.bouncy.y);
            //console.log(this.respawnFuelSpots);
            var spawnSpot = this.respawnFuelSpots.reduce(function (curr, acc, arr) {
                //console.log(curr);
                //console.log(acc);
                if (bouncyPos.distance(curr) > bouncyPos.distance(acc)) return curr;
                return acc;
            }, this.respawnFuelSpots[0]);

            var fuelCan = new FuelCan(this, spawnSpot.x, spawnSpot.y);
            PlainCollider.addObject(fuelCan, fuelCan.vertices);
            PlainCollider.assignCollGroup(fuelCan, 'fuelCanCollGroup');
            fuelCan.collWith = [this.bouncyCollGroup];
            this.maze.add(fuelCan);

            PlainCollider.injectObjectInPairs(fuelCan);
        }
    }, {
        key: 'stopBouncyThrust',
        value: function stopBouncyThrust() {

            if (!this.game.device.os.desktop && (this.bouncy.thrustSprite? this.bouncy.thustSprite === 1:this.bouncy.engineEmitter.on) 
                && this.bouncy.vel.y > -0.1) {
                this.freezed = true;
                this.time.delayedCall(500, function () {
                    this.freezed = false;
                    if (this.pendingAction) {
                        //console.log('executing pending action');
                        this.pendingAction.call(this);
                        this.pendingAction = false;
                    }
                }, [], this);
            }

            if (this.bouncy.thrustSprite)
            {
                if (!this.bouncy.thrustAnimation.paused)
                {
                    this.bouncy.thrustSprite.alpha = 0;
                    this.bouncy.thrustAnimation.pause();
                }

            } else
            {
                if (this.bouncy.engineEmitter.on) {
                    this.bouncy.engineEmitter.stop();
                }    
            }

            
            if (this.bouncy.flyAnimation && !this.bouncy.flyAnimation.paused) {
                //console.log('fly animation paused');
                this.bouncy.flyAnimation.pause();
                this.bouncy.play('idle');
                this.bouncy.idleAnimation.resume();
                if (this.jetSound.isPlaying) {
                    this.jetSound.pause();
                }
            }
        }
    }, {
        key: 'makeButton',
        value: function makeButton(imageKey, text, posX, posY, callback) {
            var button = this.add.image(posX, posY, imageKey, 'out').setInteractive();
            button.setDepth(101);
            button.on('pointerdown', function () {
                this.buttonSound.play();
                button.setFrame('down');
                callback.call(this);
            }, this);
            button.on('pointerup', function () {
                button.setFrame('out');
            }, this);
            var buttonLabel = this.add.bitmapText(button.x, button.y, 'basicFont', text, 16);
            buttonLabel.setDepth(102);
            return button;
        }
    }, {
        key: 'makePressButton',
        value: function makePressButton(imageKey, text, posX, posY, callback) {
            var button = this.add.image(posX, posY, imageKey, 'out').setInteractive();

            button.setDepth(101);

            button.on('pointerdown', function () {
                this.buttonSound.play();
                //console.log('pointer DOWN');
                button.setFrame('down');
                callback.call(this);
            }, this);

            button.on('pointerup', function () {
                if (this.continuousThrust) {
                    //console.log('pointer UP');
                    button.setFrame('out');
                    callback.call(this);
                }
            }, this);

            /*button.on('pointerout', function(){
                console.log('pointer OUT');
                if (this.continuousThrust)
                {
                    console.log('pointer OUT');
                    button.setFrame('out');
                    callback.call(this);
                }
            }, this);*/

            /*button.on('pointermove', function(pointer){
                
                if (this.continuousThrust)
                {
                    console.log('pointer x');
                    console.log(pointer.x);
                    console.log('pointer y')
                    console.log(pointer.y);
                }
                 if (this.continuousThrust && !button.getBounds().contains(pointer.worldX, pointer.worldY))
                {
                    console.log('pointer OUT');
                    button.setFrame('out');
                    callback.call(this);
                }
            }, this);*/

            var buttonLabel = this.add.bitmapText(button.x, button.y, 'basicFont', text, 16);
            buttonLabel.setDepth(102);
            //console.log(button.getBounds());
            return button;
        }
    }, {
        key: 'makeMuteButton',
        value: function makeMuteButton(imageKey, text, posX, posY) {
            if (this.sound.mute) {
                var startFrame = 'muteOffOut';
            } else {
                var startFrame = 'muteOnOut';
            }
            var button = this.add.image(posX, posY, imageKey, startFrame).setInteractive();
            button.setDepth(101);
            button.on('pointerdown', function () {
                if (this.sound.mute) {
                    button.setFrame('muteOffDown');
                } else {
                    button.setFrame('muteOnDown');
                }
                this.buttonSound.play();
            }, this);
            button.on('pointerup', function () {
                if (this.sound.mute) {
                    this.sound.mute = false;
                    button.setFrame('muteOnOut');
                } else {
                    this.sound.mute = true;
                    button.setFrame('muteOffOut');
                }
            }, this);
            var buttonLabel = this.add.bitmapText(button.x, button.y, 'basicFont', text, 16);
            buttonLabel.setDepth(102);
            return button;
        }
    }, {
        key: 'showWinPopup',
        value: function showWinPopup() {
            if (this.winPopup.alpha === 0) {

                this.winSound.play();
                this.winPopup.alpha = 1;
                this.nextLevelButton.setInteractive();
                this.replayButton.setInteractive();
                this.freezed = true;
                this.pauseButton.disableInteractive();
            }
        }
    }, {
        key: 'showLosePopup',
        value: function showLosePopup(animation, frame) {
            if (animation.key === 'shock' && this.losePopup.alpha === 0) {
                this.loseSound.play();
                this.losePopup.alpha = 1;
                this.loseReplayButton.setInteractive();
                this.freezed = true;
                this.pauseButton.disableInteractive();
            }
        }
    }, {
        key: 'launchNextLevel',
        value: function launchNextLevel() {
            this.winPopup.alpha = 0;
            this.nextLevelButton.disableInteractive();
            this.replayButton.disableInteractive();

            this.game.levelNumber++;
            this.restartScene();
        }
    }, {
        key: 'replayLevel',
        value: function replayLevel() {
            this.winPopup.alpha = 0;
            this.losePopup.alpha = 0;
            this.pausePopup.alpha = 0;
            this.nextLevelButton.disableInteractive();
            this.replayButton.disableInteractive();
            this.loseReplayButton.disableInteractive();
            this.pauseReplayButton.disableInteractive();
            this.pauseContinueButton.disableInteractive();
            this.pauseMuteButton.disableInteractive();            
            CloudAPI.gameOver();

            this.restartScene();
        }
    }, {
        key: 'pauseGame',
        value: function pauseGame() {
            //if (this.game.backgroundMusic.isPlaying) this.game.backgroundMusic.pause();
            this.pausePopup.alpha = 1;
            this.pauseButton.disableInteractive();

            this.pauseReplayButton.setInteractive();
            this.pauseContinueButton.setInteractive();
            this.pauseMuteButton.setInteractive();
            this.freezed = true;
        }
    }, {
        key: 'continueGame',
        value: function continueGame() {
            this.pausePopup.alpha = 0;
            this.pauseButton.setInteractive();

            this.pauseReplayButton.disableInteractive();
            this.pauseContinueButton.disableInteractive();
            this.pauseMuteButton.disableInteractive();
            this.freezed = false;

            //if (this.game.backgroundMusic.isPaused) this.game.backgroundMusic.resume();
        }
    }, {
        key: 'respondLandscape',
        value: function respondLandscape() {
            this.playPortrait.alpha = 1;
        }
    }, {
        key: 'respondPortrait',
        value: function respondPortrait() {
            this.playPortrait.alpha = 0;
        }
    }, {
        key: 'goLevelChoice',
        value: function goLevelChoice() {
            this.anims.remove('idle');
            this.anims.remove('fly');
            this.anims.remove('shock');
            this.anims.remove('rocketLaunch');
            this.anims.remove('dustSplash');
            this.anims.remove('flashMain');
            this.anims.remove('main');

            wallGenerator.clearTextures();
            this.time.delayedCall(200, function(){
                this.scene.start('LevelChoiceScene');
            }, [], this);
        }
    },{
        key: 'update',
        value: function update(time, delta) {

            //console.log('in update');

            if (this.playing) {

                //PlainCollider.drawColliders(this.debugGraphics);

                if (!this.freezed) {

                    PlainCollider.checkCollisions();
                    PlainCollider.moveAll();

                    if (this.leftKey.isDown) {
                        this.rotateMazeRightTween();
                    } else if (this.rightKey.isDown) {
                        this.rotateMazeLeftTween();
                    } else if (this.upKey.isDown && this.game.device.os.desktop) {
                        this.thrustBouncy();
                    } /*else if (this.sKey.isDown) {
                        PlainCollider.reporting = true;
                      }*/

                    if (this.bouncy.thrustSprite)
                    {
                        if (!this.bouncy.thrustAnimation.paused)
                        {
                            if (this.bouncy.thrustSprite.alpha === 0) this.bouncy.thrustSprite.alpha = 1;
                            this.bouncy.thrustSprite.setPosition(this.bouncy.x - this.bouncy.displayWidth * 0.25, 
                                this.bouncy.y + this.bouncy.displayHeight * 0.5);
                        }

                    }
                    else
                    {
                        if (this.bouncy.engineEmitter.on)
                        {
                            //this.bouncy.engineEmitter.setPosition(this.bouncy.x + this.cameras.main.x - this.bouncy.displayWidth * 0.25, 
                            //    this.bouncy.y + this.cameras.main.y + this.bouncy.displayHeight * 0.5);
                            this.bouncy.engineEmitter.setPosition(this.bouncy.x - this.bouncy.displayWidth * 0.25, 
                                this.bouncy.y + this.bouncy.displayHeight * 0.5);
                            /*console.log(this.bouncy.engineEmitter);
                            console.log(this.bouncy.x);
                            console.log(this.bouncy.y);
                            console.log(this.cameras.main.scrollX);
                            console.log(this.cameras.main.scrollY);*/
                        }
                    }



                    if (!this.game.device.os.desktop) {

                        if (this.continuousThrust) {
                            this.thrustBouncy(delta);
                            var pointerPos = this.input.activePointer.positionToCamera(this.HUDCamera);
                            if (!this.thrustButton.getBounds().contains(pointerPos.x, pointerPos.y)) {
                                this.continuousThrust = false;
                                this.thrustButton.setFrame('out');
                                //console.log('pointer OUT');
                            }
                        } else {                            
                            this.stopBouncyThrust();
                        }
                    }

                    // stop emitting engine particles

                    if (!this.upKey.isDown && this.game.device.os.desktop) {
                        this.stopBouncyThrust();
                    }

                    //PlainCollider.sortPairsByPriority();

                    this.bouncy.update();
                    this.maze.children.each(function (entity) {
                        if (entity.__proto__.constructor != Floor) {
                            entity.update();
                        }
                    }, this);

                    var toFinishVec = new Phaser.Math.Vector2(this.bouncy.x - this.finish.x, this.bouncy.y - this.finish.y);

                    if (this.bouncy.inLava) {
                        this.bouncy.inLava = false;
                        if (!this.bouncy.inShock)
                        {
                            //console.log('bouncy shocked');
                            this.bouncy.play('shock');
                            this.shockSound.play();
                            this.bouncy.inShock = true;
                        }                
                    }

                    if (toFinishVec.length() < 40 && !this.bouncy.inShock) {
                        if (this.game.levelNumber < this.game.totalLevels && this.game.levelNumber > 0)
                        {
                            //console.log(toFinishVec);
                            //console.log(this.bouncy.x);
                            //console.log(this.bouncy.y);
                            this.showWinPopup();    
                        } else if (this.game.levelNumber === this.game.totalLevels)
                        {
                            this.showFinalPopup();
                        }                        
                    }
                    

                    PlainCollider.updateObjectsIds();
                }

                if (this.rKey.isDown)
                {
                    
                    if (this.losePopup.alpha == 1 || this.winPopup.alpha == 1 ||
                        this.pausePopup.alpha == 1)
                    {
                        this.replayLevel();
                    }
                }

                if (this.nKey.isDown)
                {
                    if (this.winPopup.alpha == 1)
                    {
                        this.launchNextLevel();
                    }
                }

                // need to update the floor every frames
                // even when freezed, to rotate its alpha mask
                this.floor.update();

                //this.fuelGraphics.clear();
                /*this.fuelGraphics.slice(0, 0, 40, this.fuelStartingAngle, Math.PI * 3 / 2);
                this.fuelGraphics.fillPath();*/

                //this.cameraCenter.x = (this.bouncy.x + this.finish.x)*0.5;
                //this.cameraCenter.y = (this.bouncy.y + this.finish.y)*0.5;  
            }
        }
    }]);

    return PlayScene;
}(Phaser.Scene);

//below code is taken from https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
// Warn if overriding existing method


if (Array.prototype.equals) console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array) return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length) return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i])) return false;
        } else if (typeof this[i] === "number" && typeof array[i] === "number") {
            if (Math.abs(this[i] - array[i]) > 0.01) {
                return false;
            }
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

/***/ }),

/***/ 1160:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SAT = __webpack_require__(1161);

var Pair = exports.Pair = function () {
	function Pair(object1, object2, plainCollider) {
		_classCallCheck(this, Pair);

		//console.log(object1);
        //console.log(object2);

        this.object1 = object1;
        this.object2 = object2;

        // listen to destroy events
        this.object1.on('destroy', this.remove, this);
        this.object2.on('destroy', this.remove, this);

        // give a pair array to the pair to manage pair remove
        this.plainCollider = plainCollider;
        this.collisionChecked = false;
        this.previouslyCollided = false;
        this.nowCollided = false;
        this.checksInIteration = 0;
        //this.collisionPoints = [];
        //console.log(this.pairArray);
        /*if (this.object2.movability===2 && this.object1.wallNumber==='2') {
            this.reporting = true;
        }*/
        /*if (this.object1.wallNumber==='4' && this.object2.wallNumber==='2') {
            this.reporting = true;  
        }*/
	}

	_createClass(Pair, [{
		key: 'checkPairCollision',
		value: function checkPairCollision() {
			this.collisionChecked = true;    
            this.checksInIteration ++;

            if (this.object1.collWith.indexOf(this.object2.collGroup) >= 0 && this.object2.collWith.indexOf(this.object1.collGroup)>=0)
            {
                    
                for (var b1 = 0; b1 < this.object1.collider.length; b1++) {
                    for (var b2 = 0; b2 < this.object2.collider.length; b2++) {

                        var collision = {collided: false};

                        var body1 = this.object1.collider[b1],
                            body2 = this.object2.collider[b2];

                        var bounds1 = this.getBoundsOfBody(body1),
                            bounds2 = this.getBoundsOfBody(body2);

                        bounds1.x += (this.object1.vel.x + this.object1.lastCorrection.x);
                        bounds2.x += (this.object2.vel.x + this.object2.lastCorrection.x);
                        bounds1.y += (this.object1.vel.y + this.object1.lastCorrection.y);
                        bounds2.y += (this.object2.vel.y + this.object2.lastCorrection.y);                  
                            
                        if (Phaser.Geom.Rectangle.Overlaps(bounds1, bounds2))
                        {
                            
                            var intentCollider1 = body1.map(function(segment){
                                return {point: segment.point.clone(), direction: segment.direction.clone(), normal: segment.normal.clone()}
                            }, this);
                            intentCollider1.forEach(function(segment){
                                segment.point.add(this.object1.vel);
                                segment.point.add(this.object1.lastCorrection);
                            }, this);

                            var intentCollider2 = body2.map(function(segment){
                                return {point: segment.point.clone(), direction: segment.direction.clone(), normal: segment.normal.clone()}
                            }, this);
                            intentCollider2.forEach(function(segment){
                                segment.point.add(this.object2.vel);
                                segment.point.add(this.object2.lastCorrection);
                            }, this);
                            
                            collision = SAT.findIntersection(intentCollider1, intentCollider2);

                        }

                        if (collision.collided && this.checksInIteration < 10)
                        {
                            if (collision.point1.length === 2 && collision.point2.length === 2)
                            {
                                this.nowCollided = true;
                                // define collision points for coliision particles
                                var length1 = collision.point1[0].distance(collision.point1[1]),
                                    length2 = collision.point2[0].distance(collision.point2[1]);

                                if (length1 < length2) 
                                {
                                    var colPoint1 = collision.point1[0],
                                        colPoint2 = collision.point1[1];
                                } else
                                {
                                    var colPoint1 = collision.point2[0],
                                        colPoint2 = collision.point2[1];
                                }

                                var spreadVec1 = colPoint1.clone().subtract(colPoint2).normalize(),
                                    spreadVec2 = colPoint2.clone().subtract(colPoint1).normalize();

                                /*spreadVec1.scale(3);
                                spreadVec2.scale(3);

                                spreadVec1.subtract(collision.normal);
                                spreadVec2.subtract(collision.normal);*/

                                //this.collisionPoints = [{point: colPoint1, spreadVec: spreadVec1},
                                //{point: colPoint2, spreadVec: spreadVec2}];
                            }


                            // define objects response

                            if (this.object1.movability > this.object2.movability)
                            {
                                if (this.reporting) {
                                    console.log('case 1');
                                }
                                var correctionVec = collision.pushOutVec;
                                var resCorrection = this.object1.velCorrection(correctionVec, collision.point1, collision.normal, this.object2, this);
                                if (resCorrection.vector.length()>0) 
                                {
                                    resCorrection.vector.scale(-1);
                                    this.object2.velCorrection(resCorrection.vector, collision.point2, collision.normal.clone().scale(-1), 
                                        this.object1, this, resCorrection.ultimate);
                                }
                            } else if (this.object1.movability < this.object2.movability) {
                                // here penetration vector goes to correction with negative sign, to show the direction of penetration
                                //console.log('second typ');
                                if (this.reporting) {
                                    console.log('case 2');
                                }
                                var correctionVec = collision.pushOutVec.scale(-1);
                                var resCorrection = this.object2.velCorrection(correctionVec, collision.point2, collision.normal, this.object1, this);
                                if (resCorrection.vector.length() > 0)
                                {
                                    resCorrection.vector.scale(-1);
                                    this.object1.velCorrection(resCorrection.vector, collision.point1, collision.normal, 
                                        this.object2, this, resCorrection.ultimate);
                                }
                                if (this.reporting) {
                                    console.log('collision object')
                                    console.log(collision);
                                    console.log(intentCollider1);
                                    console.log(intentCollider2);
                                    /*console.log('residual correction');
                                    console.log(resCorrection);
                                    console.log('correction vector');
                                    console.log(correctionVec);*/
                                }
                            } else {
                                if (this.reporting) {
                                    console.log('########equal movability###########');
                                }
                                    
                                if (this.object1.lastCorrPriority > this.object2.lastCorrPriority)
                                {
                                    //console.log('no push back case');
                                    var correctionVec = collision.pushOutVec;
                                    var resCorrection = this.object1.velCorrection(correctionVec, collision.point1, collision.normal, this.object2, this);                                  
                                    if (resCorrection.vector.length()>0) 
                                    {
                                        resCorrection.vector.scale(-1);
                                        this.object2.velCorrection(resCorrection.vector, collision.point2, collision.normal, 
                                            this.object1, this, resCorrection.ultimate);
                                    }
                                    if (this.reporting) {
                                        console.log('object 1');
                                        console.log(this.object1.vel);
                                        console.log(this.object1.lastCorrection);
                                        console.log('object 2');
                                        console.log(this.object2.vel);
                                        console.log(this.object2.lastCorrection);
                                    }
                                } else {
                                    //console.log('no push back case');
                                    var correctionVec = collision.pushOutVec.scale(-1);
                                    var resCorrection = this.object2.velCorrection(correctionVec, collision.point2, collision.normal, this.object1, this);
                                    //console.log(resCorrection);
                                    if (resCorrection.vector.length() > 0)
                                    {
                                        resCorrection.vector.scale(-1);
                                        this.object1.velCorrection(resCorrection.vector, collision.point1, collision.normal, 
                                            this.object2, this, resCorrection.ultimate);
                                    }
                                    if (this.reporting) {
                                        console.log('_________start from pair');
                                        console.log('no corr prioroty');
                                        console.log(correctionVec);
                                        console.log(resCorrection);
                                        console.log('object 1');
                                        console.log(this.object1.vel);
                                        console.log(this.object1.lastCorrection);
                                        console.log(this.object1.constraints);
                                        console.log('object 2');
                                        console.log(this.object2.vel);
                                        console.log(this.object2.lastCorrection);
                                        console.log(this.object1.constraints);
                                        console.log('_________end from pair');
                                    }
                                }
                            }
                            /*if (this.object1.movability === 2)
                            {
                                this.object1.collidedWith(this.object2);
                            } else if (this.object2.movability === 2){
                                this.object2.collidedWith(this.object1);
                            }*/
                            return true;
                        } else if (this.checksInIteration >= 10)
                        {
                            this.object1.vel = new Phaser.Math.Vector2();
                            this.object2.vel = new Phaser.Math.Vector2();
                        }

                        
                    }
                    //if (collision.collided) break;
                }
            }
        return false;
		}
	}, {
		key: 'remove',
		value: function remove(destroyedObject) {

			//console.log('remove called');
            //console.log(destroyedObject);

            this.plainCollider.removeObject(destroyedObject);
            this.object1 = undefined;
            this.object2 = undefined;
		}
	}, {
        key: 'updateCollisionStatus',
        value: function updateCollisionStatus() {
            this.previouslyCollided = this.nowCollided;
            this.nowCollided = false;
            this.collisionChecked = false;
            this.checksInIteration = 0;
        }
    },{
		key: 'getBoundsOfBody',
		value: function getBoundsOfBody(body) {
			var leftMostX = body.reduce(function (acc, curr, arr) {
				if (acc > curr.point.x) {
					return curr.point.x;
				}
				return acc;
			}, body[0].point.x),
			    rightMostX = body.reduce(function (acc, curr, arr) {
				if (acc < curr.point.x) {
					return curr.point.x;
				}
				return acc;
			}, body[0].point.x),
			    topMostY = body.reduce(function (acc, curr, arr) {
				if (acc > curr.point.y) {
					return curr.point.y;
				}
				return acc;
			}, body[0].point.y),
			    bottomMostY = body.reduce(function (acc, curr, arr) {
				if (acc < curr.point.y) {
					return curr.point.y;
				}
				return acc;
			}, body[0].point.y);

			return new Phaser.Geom.Rectangle(leftMostX, topMostY, rightMostX - leftMostX, bottomMostY - topMostY);
		}
	}]);

	return Pair;
}();

module.exports = Pair;

/***/ }),

/***/ 1161:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SAT = {
    findIntersection: function(collider1, collider2, report)
    {

        var collision = {collided: false, point1: undefined, point2: undefined, pushOutVec: undefined, normal: undefined};
        
        // find minimal overlap by each axis
        var overlapByAxes = this.findMinOverlap(collider1, collider2);
        // if axis with no overlap found return non collided collision
        if (overlapByAxes.magnitude < 0.0001) return collision;
        else
        {
            collision.collided = true;          

            //var pushOutPoint1 = overlapByAxes.pushPoint1.clone();
            //pushOutPoint1.add(overlapByAxes.pushOutVec);
            collision.point1 = overlapByAxes.pushPoint1.slice();

            //var pushOutPoint2 = overlapByAxes.pushPoint2.clone();
            //pushOutPoint2.subtract(overlapByAxes.pushOutVec);
            collision.point2 = overlapByAxes.pushPoint2.slice();

            collision.pushOutVec = overlapByAxes.pushOutVec;

            collision.normal = overlapByAxes.axis;          
        }

        return collision;
    },

    findMinOverlapOld: function(colliderAxes, collider, axes)
    {
        // here colliderAxes is collider from wich normals treated as axes
        // i.e. a candidate to be collider penetrated
        var minOverlap = {magnitude: this.projectOnAxis(colliderAxes, axes[0]).magnitude, axis: axes[0], pushOutVec: new Phaser.Math.Vector2(), pushPoint1: new Phaser.Math.Vector2(), pushPoint2: new Phaser.Math.Vector2()};
        for (var a=0; a<axes.length; a++) {
            var projectionOfColliderAxes = this.projectOnAxis(colliderAxes, axes[a]),
                projectionOfCollider = this.projectOnAxis(collider, axes[a]);

            var currentOverlap = this.findOverlap(projectionOfColliderAxes, projectionOfCollider);
            //console.log(axes[a]);
            //console.log(currentOverlap);
            if (currentOverlap===0) 
            {
                return {magnitude: 0, axis: axes[a], penetrationPoint: undefined};
            } else
            {
                if (currentOverlap < minOverlap.magnitude) {
                    // find penetration point as if collider, providing axes, is penetrated collider
                    //var penetrationPoint = this.findPenetrationPoint(projectionOfColliderAxes, projectionOfCollider);

                    // find push out vector for collider providing axis and points penetrating for both
                    var pushOut = this.findPushOutVec(projectionOfColliderAxes, projectionOfCollider, axes[a]),
                        minOverlap = {magnitude: currentOverlap, axis: axes[a], pushOutVec: pushOut.pushOutVec, pushPoint1: pushOut.point1, pushPoint2: pushOut.point2};
                }
            }
        }

        return minOverlap;
    },

    findMinOverlap: function(collider1, collider2)
    {
        var axes = [new Phaser.Math.Vector2(1, 0), 
            new Phaser.Math.Vector2(0, 1)],
            southEast = false,
            northEast = false;

        for (var s = 0; s < collider1.length; s++)
        {
            var dir = collider1[s].direction.clone();
            if (dir.x != 0 && dir.y != 0)
            {
                if (dir.x * dir.y > 0 && !northEast)
                {
                    axes.push(new Phaser.Math.Vector2(1/Math.sqrt(2), - 1/Math.sqrt(2)));
                    northEast = true;
                } else if (!southEast)
                {
                    axes.push(new Phaser.Math.Vector2(1/Math.sqrt(2), 1/Math.sqrt(2)));
                    southEast = true;
                }
            }
        }

        if (!northEast || !southEast)
        {
            for (var s = 0; s < collider2.length; s++)
            {
                var dir = collider2[s].direction.clone();
                if (dir.x != 0 && dir.y != 0)
                {
                    if (dir.x * dir.y > 0 && !northEast)
                    {
                        axes.push(new Phaser.Math.Vector2(1/Math.sqrt(2), - 1/Math.sqrt(2)));
                        northEast = true;
                    } else if (!southEast)
                    {
                        axes.push(new Phaser.Math.Vector2(1/Math.sqrt(2), 1/Math.sqrt(2)));
                        southEast = true;
                    }
                }
            }
        }
            

        var minOverlap = {magnitude: this.projectOnAxis(collider1, axes[0]).magnitude, 
            axis: axes[0], pushOutVec: new Phaser.Math.Vector2(), 
            pushPoint1: [], 
            pushPoint2: []};

        for (var a=0; a<axes.length; a++) {
            var projectionOfCollider1 = this.projectOnAxis(collider1, axes[a]),
                projectionOfCollider2 = this.projectOnAxis(collider2, axes[a]);

            var currentOverlap = this.findOverlap(projectionOfCollider1, projectionOfCollider2);
            //console.log(axes[a]);
            //console.log(currentOverlap);
            if (currentOverlap===0) 
            {
                return {magnitude: 0, axis: axes[a], penetrationPoint: undefined};
            } else
            {
                var pushOut = this.findPushOutVec(projectionOfCollider1, projectionOfCollider2, axes[a]);

                if (currentOverlap < minOverlap.magnitude) {

                        minOverlap.magnitude = currentOverlap;
                        minOverlap.axis = axes[a];
                        minOverlap.pushPoint1 = pushOut.point1;
                        minOverlap.pushPoint2 = pushOut.point2;
                }

                if (axes[a].y === 0)
                {
                    minOverlap.pushOutVec.x = pushOut.pushOutVec.x;
                } else if (axes[a].x === 0)
                {
                    minOverlap.pushOutVec.y = pushOut.pushOutVec.y;
                }

                
            }
        }

        return minOverlap;
    },

    projectOnAxis: function(collider, axis)
    {
        var minProj = collider[0].point.dot(axis),
            maxProj = collider[0].point.dot(axis),
            minPoint = [collider[0].point],
            maxPoint = [collider[0].point];


        for (var s = 1; s<collider.length; s++)
        {
            var currentProj = collider[s].point.dot(axis);
            if (currentProj > maxProj)
            {
                maxProj = currentProj;
                maxPoint[0] = collider[s].point;
            } else if (Math.abs(currentProj - maxProj) < 1)
            {
                maxPoint[1] = collider[s].point;
            }
            if (currentProj < minProj)
            {
                minProj = currentProj;
                minPoint[0] = collider[s].point
            } else if (Math.abs(currentProj - minProj) < 1)
            {
                minPoint[1] = collider[s].point;
            }
        }

        return {min: minProj, max: maxProj, minPoint: minPoint, maxPoint: maxPoint, magnitude: maxProj - minProj};

    },

    findPushOutVec: function(proj1, proj2, axis)
    {
        var pushOutVec = axis.clone();
        if (proj1.max > proj2.max)
        {
            if (proj1.min > proj2.min)
            {               
                pushOutVec.scale(proj2.max - proj1.min);
                return {pushOutVec: pushOutVec, point1: proj1.minPoint, point2: proj2.maxPoint};
            } else 
            {
                pushOutVec.scale(proj2.min - proj1.max);
                return {pushOutVec: pushOutVec, point1: proj1.maxPoint, point2: proj2.minPoint};
            }
        } else
        {
            if (proj1.min > proj2.min)
            {
                pushOutVec.scale(proj2.max - proj1.min);
                return {pushOutVec: pushOutVec, point1: proj1.minPoint, point2: proj2.maxPoint};
            } else
            {
                pushOutVec.scale(proj2.min - proj1.max);
                return {pushOutVec: pushOutVec, point1: proj1.maxPoint, point2: proj2.minPoint};
            }
        }
    },

    findOverlap: function(projection1, projection2)
    {
        /*if (projection1.min > projection2.max || projection2.min > projection1.max) 
        {
            return 0;
        } else if (projection1.max > projection2.max && projection1.min <= projection2.min)
        {
            return projection2.max - projection2.min;
        } else if (projection2.max > projection1.max && projection2.min <= projection1.min)
        {
            return projection1.max - projection1.min;
        } else
        {
            return Math.min(projection2.max - projection1.min, projection1.max - projection2.min); 
        }*/

        if (projection1.min <= projection2.max && projection1.max>projection2.min) {
            return Math.min(projection2.max - projection1.min, projection1.max - projection2.min, projection1.max - projection1.min, projection2.max - projection1.min);
        } else {
            return 0;
        }
    }
};

module.exports = SAT;

/***/ }),

/***/ 1162:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defineOuterVertices = function defineOuterVertices(wallEdges) {
    var outerSegments = defineOuterSegments(wallEdges);

    // get all non duplicated vertes of segments in correct order
    var vertexArray = [],
        idleRun = 0;
    vertexArray = vertexArray.concat([outerSegments[0][0], outerSegments[0][1]]);
    outerSegments.splice(0, 1);

    while (outerSegments.length > 0 && idleRun < 3) {
        var lastVertex = vertexArray[vertexArray.length - 1],
            nextSegment = [],
            nextSegmentIndex = -1,
            nextVertexIndex = -1;

        outerSegments.forEach(function (segment, index, arr) {

            if (lastVertex.equals(segment[0])) {
                nextSegment = segment;
                nextSegmentIndex = index;
                nextVertexIndex = 1;
            } else if (lastVertex.equals(segment[1])) {
                nextSegment = segment;
                nextSegmentIndex = index;
                nextVertexIndex = 0;
            }
        }, this);

        if (nextSegmentIndex >= 0) {
            vertexArray.push(nextSegment[nextVertexIndex]);
            outerSegments.splice(nextSegmentIndex, 1);
        } else {
            idleRun++;
        }
    }

    return vertexArray;
};

var defineOuterSegments = function defineOuterSegments(edges) {
    var segments = [];

    for (var e in edges) {
        for (var v in edges[e]) {
            if (Number(v) < 4) {

                var nextV = Number(v) < 3 ? Number(v) + 1 : 0;
                segments.push([edges[e][v], edges[e][nextV]]);
            }
        }
    }

    var innerSegments = [];
    segments.forEach(function (seg1, index1, segArr1) {
        segArr1.forEach(function (seg2, index2, segArr2) {

            if (index2 > index1) {
                if (seg1[0].equals(seg2[0]) && seg1[1].equals(seg2[1]) || seg1[0].equals(seg2[1]) && seg1[1].equals(seg2[0])) {
                    innerSegments.push(seg1);
                }
            }
        }, this);
    }, this);

    var candidateOuterSegments = segments.filter(function (segment) {
        var inner = false;
        innerSegments.forEach(function (innerSegment) {
            if (!inner) {
                if (innerSegment[0].equals(segment[0]) && innerSegment[1].equals(segment[1]) || innerSegment[1].equals(segment[0]) && innerSegment[0].equals(segment[1])) {
                    inner = true;
                }
            }
        }, this);
        return !inner;
    }, this);

    // crate points array
    var points = [];
    candidateOuterSegments.forEach(function (segment) {
        points = points.concat(segment);
    }, this);

    // find points that appears 4 times

    var points4T = [];

    points.forEach(function (point1, index1, pointsArr1) {
        var occurance = 0;
        pointsArr1.forEach(function (point2, index2, pointsArr2) {
            if (index2 >= index1) {
                if (point1.equals(point2)) occurance++;
            }
        }, this);
        if (occurance >= 4) points4T.push(point1);
    }, this);

    // find segments starting and finishing in point appering 4 times
    // mark them for deletion if they are shorter than certain amount -32 pixels, walls width in maze and lab levels

    var innerSegments = [];

    points4T.forEach(function (point) {
        candidateOuterSegments.forEach(function (segment) {
            if (segment[0].equals(point)) {
                points4T.forEach(function (otherPoint) {
                    if (segment[1].equals(otherPoint) && Math.sqrt(Math.pow(segment[1][0] - segment[0][0], 2) + Math.pow(segment[1][1] - segment[0][1], 2)) < 32) {
                        innerSegments.push(segment);
                    }
                }, this);
            }
        }, this);
    }, this);

    //console.log(innerSegments);

    var outerSegmentsArray = candidateOuterSegments.filter(function (segment) {
        for (var iSeg in innerSegments) {
            if (innerSegments[iSeg].equals(segment)) return false;
        }
        return true;
    }, this);

    return outerSegmentsArray;
};

module.exports = defineOuterVertices;

/***/ }),

/***/ 1163:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GWall = __webpack_require__(470);
var wallGenerator = __webpack_require__(73);

var FreeDoor = exports.FreeDoor = function (_GWall) {
	_inherits(FreeDoor, _GWall);

	function FreeDoor() {
		_classCallCheck(this, FreeDoor);

		return _possibleConstructorReturn(this, (FreeDoor.__proto__ || Object.getPrototypeOf(FreeDoor)).apply(this, arguments));
	}

	_createClass(FreeDoor, [{
		key: 'drawTexture',
		value: function drawTexture(scene, edgeVertices, wallWidth, wallHeight) {
			return wallGenerator.generateFreeDoor(scene, edgeVertices, wallWidth, wallHeight);
		}
	}]);

	return FreeDoor;
}(GWall);

module.exports = FreeDoor;

/***/ }),

/***/ 1164:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WoodBox = __webpack_require__(471);
var wallGenerator = __webpack_require__(73);

var MetalBox = exports.MetalBox = function (_WoodBox) {
	_inherits(MetalBox, _WoodBox);

	function MetalBox(scene, edges, wallNumber) {
		_classCallCheck(this, MetalBox);

		var _this = _possibleConstructorReturn(this, (MetalBox.__proto__ || Object.getPrototypeOf(MetalBox)).call(this, scene, edges, wallNumber));

		_this.movability = 1;
		_this.lastCorrPriority = _this.movability;
		return _this;
	}

	_createClass(MetalBox, [{
		key: 'prepareTexture',
		value: function prepareTexture() {
			return 'metalBox';
		}
	}]);

	return MetalBox;
}(WoodBox);

module.exports = MetalBox;

/***/ }),

/***/ 1165:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Finish = exports.Finish = function (_Phaser$GameObjects$S) {
	_inherits(Finish, _Phaser$GameObjects$S);

	function Finish(scene, posX, posY) {
		_classCallCheck(this, Finish);

		var _this = _possibleConstructorReturn(this, (Finish.__proto__ || Object.getPrototypeOf(Finish)).call(this, scene, posX, posY, 'finish'));

		scene.add.existing(_this);

		_this.setDepth(9);
		return _this;
	}

	return Finish;
}(Phaser.GameObjects.Sprite);

module.exports = Finish;

/***/ }),

/***/ 1166:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Floor = exports.Floor = function (_Phaser$GameObjects$I) {
    _inherits(Floor, _Phaser$GameObjects$I);

    function Floor(scene, vertices, wallNumber) {
        _classCallCheck(this, Floor);

        var tint = 0xe6e5e0;

        var leftBorder = vertices.reduce(function (acc, currentVer) {
            if (acc > currentVer[0]) {
                return currentVer[0];
            }
            return acc;
        }, vertices[0][0]),
            rightBorder = vertices.reduce(function (acc, currentVer) {
            if (acc < currentVer[0]) {
                return currentVer[0];
            }
            return acc;
        }, vertices[0][0]),
            topBorder = vertices.reduce(function (acc, currentVer) {
            if (acc > currentVer[1]) {
                return currentVer[1];
            }
            return acc;
        }, vertices[0][1]),
            bottomBorder = vertices.reduce(function (acc, currentVer) {
            if (acc < currentVer[1]) {
                return currentVer[1];
            }
            return acc;
        }, vertices[0][1]),
            floorWidth = rightBorder - leftBorder,
            floorHeight = bottomBorder - topBorder;

        //console.log(floorWidth);
        //console.log(floorHeight);   

        if (scene.game.renderer.type === 1)     
        {
            // for canvas renderer
            var floorGraphics = scene.make.graphics({ fillStyle: { color: 0x8d86ad } });

            var alignedVertices = vertices.map(function (vertex) {
                return [vertex[0] - leftBorder, vertex[1] - topBorder];
            });

            floorGraphics.clear();
            floorGraphics.save();
            floorGraphics.beginPath();
            floorGraphics.moveTo(alignedVertices[0][0], alignedVertices[0][1]);

            for (var v = 1; v < alignedVertices.length; v++) {
                floorGraphics.lineTo(alignedVertices[v][0], alignedVertices[v][1]);
            }

            floorGraphics.closePath();
            floorGraphics.fillPath();
            floorGraphics.restore();

            if (scene.textures.exists('floorGraphics')) {
                scene.textures.remove('floorGraphics');
            }

            floorGraphics.generateTexture('floorGraphics', floorWidth, floorHeight);      

            var _this = _possibleConstructorReturn(this, (Floor.__proto__ || Object.getPrototypeOf(Floor)).call(this, scene, leftBorder, topBorder, 'floorGraphics'));

            scene.add.existing(_this);
        } else {
            // for webgl renderer

            var _this = _possibleConstructorReturn(this, (Floor.__proto__ || Object.getPrototypeOf(Floor)).call(this, scene, leftBorder, topBorder, 'levelFloor'));

            _this.floorGraphics = scene.make.graphics({ fillStyle: { color: 0x8d86ad } });

            var alignedVertices = vertices.map(function (vertex) {
                return [vertex[0] - leftBorder, vertex[1] - topBorder];
            });

            _this.floorGraphics.clear();
            _this.floorGraphics.save();
            _this.floorGraphics.beginPath();
            _this.floorGraphics.moveTo(alignedVertices[0][0], alignedVertices[0][1]);

            for (var v = 1; v < alignedVertices.length; v++) {
                _this.floorGraphics.lineTo(alignedVertices[v][0], alignedVertices[v][1]);
            }

            _this.floorGraphics.closePath();
            _this.floorGraphics.fillPath();
            _this.floorGraphics.restore();            

            _this.mask = new Phaser.Display.Masks.GeometryMask(scene, _this.floorGraphics);            

            scene.add.existing(_this);

        }

        

        //_this.maskImage = scene.add.image(leftBorder, topBorder, 'floorGraphics').setVisible(false);
        //_this.maskImage.setOrigin(0);

        //
        _this.setOrigin(0);

        _this.setDepth(0);
        return _this;
    }

    _createClass(Floor, [{
        key: 'update',
        value: function update() {

            if (this.floorGraphics)
            {
                this.floorGraphics.x = this.x;
                this.floorGraphics.y = this.y;
                this.floorGraphics.rotation = this.rotation;
            }
        }
    },{
        key: 'drawMask',
        value: function drawMask() {
            this.floorGraphics.clear();
            this.floorGraphics.save();
            this.floorGraphics.beginPath();
            this.floorGraphics.moveTo(this.alignedVertices[0][0], this.alignedVertices[0][1]);

            for (var v = 1; v < this.alignedVertices.length; v++) {
                this.floorGraphics.lineTo(this.alignedVertices[v][0], this.alignedVertices[v][1]);
            }

            this.floorGraphics.closePath();
            this.floorGraphics.fillPath();
            this.floorGraphics.restore();
        }
    },{
        key: 'rotateVertices',
        value: function rotateVertices(pointX, pointY, angle) {
            this.vertices.forEach(function(vertex){
                var oldX = vertex[0] - pointX,
                    oldY = vertex[1] - pointY;

                var newX = oldX * Math.cos(angle) - oldY * Math.sin(angle) + pointX,
                    newY = oldX * Math.sin(angle) + oldY * Math.cos(angle) + pointY;

                vertex = [newX, newY];
            }, this);
        }
    }, {
        key: 'rotateMask',
        value: function rotateMask(pointX, pointY, angle) {
            //console.log('rotate mask called');
            this.rotateVertices(pointX, pointY, angle);
            this.drawMask();
        }
    }]);

    return Floor;
}(Phaser.GameObjects.Image);

module.exports = Floor;

/***/ }),

/***/ 1167:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bouncy = __webpack_require__(472);

var FuelCan = exports.FuelCan = function (_Phaser$GameObjects$S) {
	_inherits(FuelCan, _Phaser$GameObjects$S);

	function FuelCan(scene, xPos, yPos) {
		_classCallCheck(this, FuelCan);

		var _this = _possibleConstructorReturn(this, (FuelCan.__proto__ || Object.getPrototypeOf(FuelCan)).call(this, scene, xPos, yPos, 'fuelCan'));

		scene.add.existing(_this);

		var topLeft = _this.getTopLeft(),
		    bottomRight = _this.getBottomRight();

		_this.vertices = [[[topLeft.x, topLeft.y], [bottomRight.x, topLeft.y], [bottomRight.x, bottomRight.y], [topLeft.x, bottomRight.y]]];

		_this.vel = new Phaser.Math.Vector2();
		_this.movability = 2;
		_this.velCorrected = false;
		_this.lastCorrection = new Phaser.Math.Vector2();
		_this.lastCorrPriority = _this.movability;
		_this.resolvedPairs = [];
		_this.unresolvedPairs = [];
		_this.inLava = false;

		_this.setDepth(10);

		_this.capacity = 50;
		_this.toDestroy = false;
		return _this;
	}

	_createClass(FuelCan, [{
		key: 'velCorrection',
		value: function velCorrection(correction, point, normal, otherObject, pair) {
			var ultimatePushBack = {x: false, y: false};

            if (otherObject.__proto__.constructor === Bouncy)
            {
                otherObject.tankUp(this.capacity);
                this.toDestroy = true;
            }
            this.lastCorrection = correction;

            return {vector: new Phaser.Math.Vector2(), ultimate: ultimatePushBack};
		}
	}, {
		key: 'updateVel',
		value: function updateVel() {
			this.vel.add(this.lastCorrection);
		}
	}, {
		key: 'update',
		value: function update() {
			if (this.toDestroy) this.destroy();
		}
	}]);

	return FuelCan;
}(Phaser.GameObjects.Sprite);

module.exports = FuelCan;

/***/ }),

/***/ 1168:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PreloaderScene = exports.PreloaderScene = function (_Phaser$Scene) {
    _inherits(PreloaderScene, _Phaser$Scene);

    function PreloaderScene() {
        _classCallCheck(this, PreloaderScene);

        return _possibleConstructorReturn(this, (PreloaderScene.__proto__ || Object.getPrototypeOf(PreloaderScene)).call(this, 'PreloaderScene'));
    }

    _createClass(PreloaderScene, [{
        key: 'preload',
        value: function preload() {
            var gameWidth = this.game.config.width,
                gameHeight = this.game.config.height;

            this.add.image(150, 480, 'preloaderBack').setOrigin(0, 0.5);

            this.playPortrait = this.add.image(gameWidth * 0.5, gameHeight * 0.5, 'playPortrait');
            this.playPortrait.setDepth(200);
            this.playPortrait.alpha = 0;

            this.preloaderBar = this.add.image(155, 480, 'preloaderBar').setOrigin(0, 0.5);
            this.preloaderBar.setCrop(0, 0, 0, 39);

            this.load.on('progress', function (value) {
                this.preloaderBar.setCrop(0, 0, 287 * value, 39);
            }, this);

            this.load.atlas('bouncy', 'assets/bouncy.png', 'assets/bouncy.json');
            this.load.atlas('dustSplash', 'assets/dustSplash.png', 'assets/dustSplash.json');
            this.load.atlas('startButton', 'assets/startButton.png', 'assets/startButton.json');
            this.load.atlas('levelButton', 'assets/levelButton.png', 'assets/levelButton.json');
            this.load.atlas('flash', 'assets/flash.png', 'assets/flash.json');
            this.load.atlas('replayButton', 'assets/replayButton.png', 'assets/replayButton.json');
            this.load.atlas('nextLevelButton', 'assets/nextLevelButton.png', 'assets/nextLevelButton.json');
            this.load.atlas('pauseButton', 'assets/pauseButton.png', 'assets/pauseButton.json');
            this.load.atlas('launch', 'assets/launch.png', 'assets/launch.json');
            this.load.atlas('rotateCClButton', 'assets/rotateCClButton.png', 'assets/rotateCClButton.json');
            this.load.atlas('rotateClButton', 'assets/rotateClButton.png', 'assets/rotateClButton.json');
            this.load.atlas('thrustButton', 'assets/thrustButton.png', 'assets/thrustButton.json');
            this.load.atlas('creditsButton', 'assets/creditsButton.png', 'assets/creditsButton.json');
            this.load.atlas('muteButton', 'assets/muteButton.png', 'assets/muteButton.json');
            this.load.atlas('goLevelChoiceButton', 'assets/goLevelChoiceButton.png', 'assets/goLevelChoiceButton.json');
            this.load.atlas('thrustAnim', 'assets/thrustAnim.png', 'assets/thrustAnim.json');
            this.load.image('woodBox', 'assets/woodBox.png');
            this.load.image('finish', 'assets/finish.png');
            this.load.image('levelFloor', 'assets/levelFloor.png');
            this.load.image('mainMenuBack', 'assets/mainMenuBack.png');
            this.load.image('lockImage', 'assets/lock.png');
            this.load.image('winPopupBack', 'assets/winPopupBack.png');
            this.load.image('winPopupImage', 'assets/winPopupImage.png');
            this.load.image('losePopupBack', 'assets/losePopupBack.png');
            this.load.image('losePopupImage', 'assets/losePopupImage.png');
            this.load.image('fuelIndicatorBack', 'assets/fuelIndicatorBack.png');
            this.load.image('fuelIndicatorLevel', 'assets/fuelIndicatorLevel.png');
            this.load.image('fuelIndicatorLogo', 'assets/fuelIndicatorLogo.png');
            this.load.image('mainMenuImage', 'assets/mainMenuImage.png');
            this.load.image('mainMenuLabel', 'assets/mainMenuLabel.png');
            this.load.image('pausePopupBack', 'assets/pausePopupBack.png');
            this.load.image('pausePopupImage', 'assets/pausePopupImage.png');
            this.load.image('finalPopupImage', 'assets/finalPopupImage.png');
            this.load.image('levelLabelBack', 'assets/levelLabelBack.png');
            this.load.image('credits', 'assets/credits.png');
            this.load.image('tutRotCCl', 'assets/tutRotCCl.png');
            this.load.image('tutRotCl', 'assets/tutRotCl.png');
            this.load.image('tutThrust', 'assets/tutThrust.png');
            this.load.image('mobTutRotCCl', 'assets/mobTutRotCCl.png');
            this.load.image('mobTutRotCl', 'assets/mobTutRotCl.png');
            this.load.image('mobTutThrust', 'assets/mobTutThrust.png');
            //this.load.json('level', 'assets/rbLevel28.json');
            this.load.image('engineParticle', 'assets/engineTrail.png');
            this.load.image('fuelCan', 'assets/fuelCan.png');
            //this.load.image('buttonsFrame', 'assets/buttonsFrame.png');
            this.load.image('pressR', 'assets/pressR.png');
            this.load.image('pressN', 'assets/pressN.png');

            if (CloudAPI.links.active()) {
                var logosList = CloudAPI.logos.list();
                this.load.image('CGLogo', 'https:' + logosList.vertical);
            }

            this.load.bitmapFont('basicFont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
            this.load.bitmapFont('peachFont', 'assets/fonts/fontPeach.png', 'assets/fonts/fontPeach.fnt');

            this.load.audio('backgroundMusic', 'assets/music/background.mp3');
            this.load.audio('bumpSound', 'assets/music/bump.mp3');
            this.load.audio('buttonSound', 'assets/music/button.mp3');
            this.load.audio('jetSound', 'assets/music/jet.mp3');
            this.load.audio('loseSound', 'assets/music/lose.mp3');
            this.load.audio('winSound', 'assets/music/win.mp3');
            this.load.audio('fuelSound', 'assets/music/fuel.mp3');
            this.load.audio('rotateSound', ['assets/music/rotate.wav', 'assets/music/rotate.mp3']);
            this.load.audio('shockSound', 'assets/music/shock.mp3');

            for (var i = 1; i <= 34; i++) {
                var levelName = 'level' + i,
                    fileName = 'assets/levels/rbLevel' + i + '.json';

                this.load.json(levelName, fileName);
            }
        }
    }, {
        key: 'respondLandscape',
        value: function respondLandscape() {
            //console.log('respond lanscape in preloader');
            this.playPortrait.alpha = 1;
        }
    }, {
        key: 'respondPortrait',
        value: function respondPortrait() {
            var gameWidth = this.game.config.width,
                gameHeight = this.game.config.height;

            //console.log('respond portrait in preloader');
            this.playPortrait.alpha = 0;
            this.splashScreen.setPosition(gameWidth*0.5, gameHeight*0.5);
        }
    }, {
        key: 'update',
        value: function update() {
            this.scene.start('MainMenuScene');
            //this.game.levelNumber = 32;
            //this.scene.start('PlayScene');
        }
    }]);

    return PreloaderScene;
}(Phaser.Scene);

/***/ }),

/***/ 1169:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainMenuScene = exports.MainMenuScene = function (_Phaser$Scene) {
    _inherits(MainMenuScene, _Phaser$Scene);

    function MainMenuScene() {
        _classCallCheck(this, MainMenuScene);

        return _possibleConstructorReturn(this, (MainMenuScene.__proto__ || Object.getPrototypeOf(MainMenuScene)).call(this, 'MainMenuScene'));
    }

    _createClass(MainMenuScene, [{
        key: 'create',
        value: function create() {
            //console.log('main menu launched');
            var gameWidth = this.game.config.width,
                gameHeight = this.game.config.height;

            this.backgroundImage = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'mainMenuBack');
            this.backgroundImage.setOrigin(0);

            this.startButton = this.makeButton('startButton', '', gameWidth*0.5, gameHeight*0.67, this.startGame);

            this.titleLabel = this.add.image(gameWidth*0.5, gameHeight*0.45, 'mainMenuLabel');
            this.titleImage = this.add.sprite(gameWidth*0.5, gameHeight*0.25, 'mainMenuImage');

            this.creditsButton = this.makeButton('creditsButton', '', gameWidth*0.13, gameHeight*0.9, this.showCredits);

            this.credits = this.add.image(gameWidth*0.5, gameHeight*0.45, 'credits');
            this.credits.alpha = 0;
            this.credits.setDepth(110);

            this.muteButton = this.makeMuteButton('muteButton', '', gameWidth*0.87, gameHeight*0.9);

            this.playPortrait = this.add.image(gameWidth * 0.5, gameHeight * 0.5, 'playPortrait');
            this.playPortrait.setDepth(200);
            this.playPortrait.alpha = 0;            

            if (isNaN(localStorage.getItem('levelNumber')) || localStorage.getItem('levelNumber') === null) {
                this.game.lastAvailLevel = 1;
                localStorage.setItem('levelNumber', this.game.lastAvailLevel);
            } else {
                this.game.lastAvailLevel = Number(localStorage.getItem('levelNumber'));
            }

            this.buttonSound = this.sound.add('buttonSound');
            this.game.backgroundMusic = this.sound.add('backgroundMusic');

            this.game.backgroundMusic.play('', { loop: true });

            this.input.on('pointerup', function (pointer, gameObjects) {

                if (gameObjects.length > 0) {
                    for (var i = 0; i < gameObjects.length; i++) {
                        if (gameObjects[i].texture.key === 'credits') {
                            this.credits.alpha = 0;
                            this.credits.disableInteractive();
                            this.startButton.setInteractive();
                            this.creditsButton.setInteractive();
                        }
                    }
                } else {
                    this.credits.alpha = 0;
                    this.credits.disableInteractive();
                    this.startButton.setInteractive();
                    this.creditsButton.setInteractive();
                }
            }, this);

            if (CloudAPI.links.active()) {          
                this.CGLogoButton = this.makeButton('CGLogo', '', 0, 0, this.callCloudLogo);
                this.CGLogoButton.setScale(0.2, 0.2);
                this.CGLogoButton.setOrigin(0);
            }
        }
    },{
        key: 'callCloudLogo',
        value: function callCloudLogo() {
            if(CloudAPI.links.active()) {
                window.open(CloudAPI.links.list()['logo']);
            }
        }
    },{
        key: 'makeButton',
        value: function makeButton(imageKey, text, posX, posY, callback) {
            var button = this.add.image(posX, posY, imageKey, 'out').setInteractive().setScrollFactor(0);
            button.setDepth(101);
            button.on('pointerdown', function () {

                button.setFrame('down');
                this.buttonSound.play();
            }, this);
            button.on('pointerup', function () {
                callback.call(this);
                button.setFrame('out');
            }, this);
            var buttonLabel = this.add.bitmapText(button.x, button.y, 'basicFont', text, 16).setScrollFactor(0);
            buttonLabel.setDepth(102);
            return button;
        }
    }, {
        key: 'makeMuteButton',
        value: function makeMuteButton(imageKey, text, posX, posY) {
            if (this.sound.mute) {
                var startFrame = 'muteOffOut';
            } else {
                var startFrame = 'muteOnOut';
            }
            var button = this.add.image(posX, posY, imageKey, startFrame).setInteractive().setScrollFactor(0);
            button.setDepth(101);
            button.on('pointerdown', function () {
                if (this.sound.mute) {
                    button.setFrame('muteOffDown');
                } else {
                    button.setFrame('muteOnDown');
                }
                this.buttonSound.play();
            }, this);
            button.on('pointerup', function () {
                if (this.sound.mute) {
                    this.sound.mute = false;
                    button.setFrame('muteOnOut');
                } else {
                    this.sound.mute = true;
                    button.setFrame('muteOffOut');
                }
            }, this);
            var buttonLabel = this.add.bitmapText(button.x, button.y, 'basicFont', text, 16).setScrollFactor(0);
            buttonLabel.setDepth(102);
            return button;
        }
    }, {
        key: 'showCredits',
        value: function showCredits() {
            if (this.credits.alpha === 0) {
                this.credits.alpha = 1;
                this.credits.setInteractive();
                this.startButton.disableInteractive();
                this.creditsButton.disableInteractive();
            }
        }
    }, {
        key: 'respondLandscape',
        value: function respondLandscape() {
            this.playPortrait.alpha = 1;
        }
    }, {
        key: 'respondPortrait',
        value: function respondPortrait() {
            //console.log(this);
            var gameWidth = this.game.config.width,
                gameHeight = this.game.config.height;

            this.playPortrait.alpha = 0;
            this.backgroundImage.setPosition(0, 0);

            this.startButton.setPosition(gameWidth*0.5, gameHeight*0.67);

            this.titleLabel.setPosition(gameWidth*0.5, gameHeight*0.45);
            this.titleImage.setPosition(gameWidth*0.5, gameHeight*0.25);

            this.creditsButton.setPosition(gameWidth*0.13, gameHeight*0.9);

            this.credits.setPosition(gameWidth*0.5, gameHeight*0.45);

            this.muteButton.setPosition(gameWidth*0.87, gameHeight*0.9);

            this.playPortrait.setPosition(gameWidth * 0.5, gameHeight * 0.5);

            if (this.CGLogoButton) this.CGLogoButton.setPosition(0, 0);
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            //console.log(this);
            this.scene.start('LevelChoiceScene');
        }
    }]);

    return MainMenuScene;
}(Phaser.Scene);

/***/ }),

/***/ 1170:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LevelChoiceScene = exports.LevelChoiceScene = function (_Phaser$Scene) {
    _inherits(LevelChoiceScene, _Phaser$Scene);

    function LevelChoiceScene() {
        _classCallCheck(this, LevelChoiceScene);

        return _possibleConstructorReturn(this, (LevelChoiceScene.__proto__ || Object.getPrototypeOf(LevelChoiceScene)).call(this, 'LevelChoiceScene'));
    }

    _createClass(LevelChoiceScene, [{
        key: 'create',
        value: function create() {
            var gameWidth = this.game.config.width,
                gameHeight = this.game.config.height;

            this.backgroundImage = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'mainMenuBack');
            this.backgroundImage.setOrigin(0);

            this.playPortrait = this.add.image(gameWidth * 0.5, gameHeight * 0.5, 'playPortrait');
            this.playPortrait.setDepth(200);
            this.playPortrait.alpha = 0;

            this.game.totalLevels = 34;
            // here get from local storage
            //this.game.lastAvailLevel = 28;

            this.buttonsGroup = this.add.group();
            //console.log(this.game.config.width);

            var numOfButtonsInRow = 4,
                betweenButtonsDistanceH = this.game.config.width / (numOfButtonsInRow + 0.5),
                betweenButtonsDistanceV = gameHeight*0.1; //this.game.config.width/(numOfButtonsInRow + 1);

            for (var i = 1; i <= this.game.totalLevels; i++) {
                var posX = ((i - 1) % 4 + 0.75) * betweenButtonsDistanceH,
                    posY = (Math.floor((i - 1) / 4) + 0.5) * betweenButtonsDistanceV;

                var button = this.makeButton('levelButton', i, posX, posY, this.launchLevel);

                if (betweenButtonsDistanceV < button.height*1.1)
                {
                    button.setScale(betweenButtonsDistanceV/(button.height * 1.1));
                }

                if (i > this.game.lastAvailLevel) {
                    button.disableInteractive();
                    var lockImage = this.add.image(posX, posY, 'lockImage');
                    lockImage.setDepth(103);
                    if (betweenButtonsDistanceV < button.height*1.1)
                    {
                        lockImage.setScale(betweenButtonsDistanceV/(button.height * 1.1));
                    }
                }

                this.buttonsGroup.add(button);
            }

            this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

            this.buttonSound = this.sound.add('buttonSound');
        }
    }, {
        key: 'makeButton',
        value: function makeButton(imageKey, text, posX, posY, callback) {
            var button = this.add.image(posX, posY, imageKey, 'out').setInteractive().setScrollFactor(0);
            button.setDepth(101);
            button.levelNumber = text;
            button.on('pointerdown', function () {

                button.setFrame('down');
                this.buttonSound.play();
                //console.log('pointer down');
            }, this);
            button.on('pointerup', function () {
                button.setFrame('out');
                callback.call(this, button.levelNumber);
            }, this);
            button.buttonLabel = this.add.bitmapText(button.x, button.y, 'basicFont', '' + text, 32).setScrollFactor(0);
            button.buttonLabel.setDepth(102);
            button.buttonLabel.setOrigin(0.5, 0.5);
            button.buttonLabel.tint = 0xf5ecdf;
            return button;
        }
    }, {
        key: 'launchLevel',
        value: function launchLevel(levelNumber) {
            //console.log('launch level called');
            this.game.levelNumber = levelNumber;
            this.scene.start('PlayScene');
        }
    }, {
        key: 'respondLandscape',
        value: function respondLandscape() {
            this.playPortrait.alpha = 1;
        }
    }, {
        key: 'respondPortrait',
        value: function respondPortrait() {
            this.playPortrait.alpha = 0;
        }
    }]);

    return LevelChoiceScene;
}(Phaser.Scene);

/***/ }),

/***/ 1171:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BootScene = exports.BootScene = function (_Phaser$Scene) {
    _inherits(BootScene, _Phaser$Scene);

    function BootScene() {
        _classCallCheck(this, BootScene);

        return _possibleConstructorReturn(this, (BootScene.__proto__ || Object.getPrototypeOf(BootScene)).call(this, 'BootScene'));
    }

    _createClass(BootScene, [{
        key: 'preload',
        value: function preload() {

            this.load.image('preloaderBack', 'assets/preloaderBack.png');
            this.load.image('preloaderBar', 'assets/preloaderBar.png');
            this.load.image('playPortrait', 'assets/playInPortrait.png');
        }
    }, {
        key: 'create',
        value: function create() {
            var gameWidth = this.game.config.width,
                gameHeight = this.game.config.height;

            this.playPortrait = this.add.image(gameWidth*0.5, gameHeight*0.5, 'playPortrait');
            this.playPortrait.setDepth(200);

            if (document.documentElement.clientWidth < document.documentElement.clientHeight || this.game.device.os.desktop) this.playPortrait.alpha = 0;
        }
    }, {
        key: 'respondLandscape',
        value: function respondLandscape() {
            //console.log('respond lanscape in boot');
            this.playPortrait.alpha = 1;
        }
    }, {
        key: 'respondPortrait',
        value: function respondPortrait() {
            this.playPortrait.alpha = 0;
        }

    }, {
        key: 'update',
        value: function update() {
            if (this.playPortrait.alpha === 0)
            {
                this.scene.start('PreloaderScene');
            }
        }
    }]);

    return BootScene;
}(Phaser.Scene);

/***/ }),

/***/ 141:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//var Bouncy = require('./Bouncy.js');
//var WoodBox = require('./WoodBox.js');
var PlainCollider = __webpack_require__(223);
var defineOuterVertices = __webpack_require__(1162);
var wallGenerator = __webpack_require__(73);

var Wall = exports.Wall = function (_Phaser$GameObjects$S) {
    _inherits(Wall, _Phaser$GameObjects$S);

    function Wall(scene, edges, wallNumber) {
        _classCallCheck(this, Wall);

        var _this = _possibleConstructorReturn(this, (Wall.__proto__ || Object.getPrototypeOf(Wall)).call(this, scene));

        _this.definePosition(edges);
        _this.setPosition(_this.leftPointWall + _this.wallWidth / 2, _this.topPointWall + _this.wallHeight / 2);

        var textureName = _this.prepareTexture(edges);
        _this.setTexture(textureName);

        scene.add.existing(_this);

        _this.vel = new Phaser.Math.Vector2();
        _this.movability = 0;
        _this.velCorrected = false;
        _this.lastCorrection = new Phaser.Math.Vector2();
        _this.correctionDirection = new Phaser.Math.Vector2();
        _this.lastCorrPriority = _this.movability;
        _this.constraints = {x : {'1': _this.movability, '-1': _this.movability}, y: {'1': _this.movability, '-1': _this.movability}};
        _this.wallNumber = wallNumber;
        _this.reporting = false;

        _this.setDepth(10);
        _this.vertices = edges;

        return _this;
    }

    _createClass(Wall, [{
        key: 'definePosition',
        value: function definePosition(edges) {
            // left, right most and top, bottom points of the wall
            this.leftPointWall = edges.reduce(function (leftWall, currEdge) {
                var currEdgeLeft = currEdge.reduce(function (leftEdge, currVer) {
                    if (leftEdge > currVer[0]) {
                        return currVer[0];
                    }
                    return leftEdge;
                }, currEdge[0][0]);
                if (leftWall > currEdgeLeft) {
                    return currEdgeLeft;
                }
                return leftWall;
            }, edges[0][0][0]);

            this.topPointWall = edges.reduce(function (topWall, currEdge) {
                var currEdgeTop = currEdge.reduce(function (topEdge, currVer) {
                    if (topEdge > currVer[1]) {
                        return currVer[1];
                    }
                    return topEdge;
                }, currEdge[0][1]);
                if (topWall > currEdgeTop) {
                    return currEdgeTop;
                }
                return topWall;
            }, edges[0][0][1]);

            this.rightPointWall = edges.reduce(function (rightWall, currEdge) {
                var currEdgeRight = currEdge.reduce(function (rightEdge, currVer) {
                    if (rightEdge < currVer[0]) {
                        return currVer[0];
                    }
                    return rightEdge;
                }, currEdge[0][0]);
                if (rightWall < currEdgeRight) {
                    return currEdgeRight;
                }
                return rightWall;
            }, edges[0][0][0]);

            this.bottomPointWall = edges.reduce(function (bottomWall, currEdge) {
                var currEdgeBottom = currEdge.reduce(function (bottomEdge, currVer) {
                    if (bottomEdge < currVer[1]) {
                        return currVer[1];
                    }
                    return bottomEdge;
                }, currEdge[0][1]);
                if (bottomWall < currEdgeBottom) {
                    return currEdgeBottom;
                }
                return bottomWall;
            }, edges[0][0][1]);

            this.wallWidth = this.rightPointWall - this.leftPointWall, this.wallHeight = this.bottomPointWall - this.topPointWall;
        }
    }, {
        key: 'prepareTexture',
        value: function prepareTexture(edges) {
            var leftOffset = this.leftPointWall,
                topOffset = this.topPointWall;

            var alignedEdges = edges.map(function (edge) {
                return edge.map(function (vertex) {
                    return [vertex[0] - leftOffset, vertex[1] - topOffset];
                });
            });

            // define vertices for texture
            var edgeVertices = defineOuterVertices(alignedEdges);
            //console.log(edgeVertices);

            // generate texture for sprite
            return this.drawTexture(this.scene, edgeVertices, this.wallWidth, this.wallHeight);
        }
    }, {
        key: 'drawTexture',
        value: function drawTexture(scene, edgeVertices, wallWidth, wallHeight) {
            return wallGenerator.generateWall(scene, edgeVertices, wallWidth, wallHeight);
        }
    }, {
        key: 'velCorrection',
        value: function velCorrection(origCorrection, point, normal, otherObject, pair, ultimate) {
            if (!ultimate) var ultimate = {x: false, y: false};

            var priority = otherObject.constraints,
                pushBack = new Phaser.Math.Vector2(),
                ultimatePushBack = {x: false, y: false};

            if (!this.velCorrected) this.velCorrected = true;

            /*if (this.wallNumber === '25' && otherObject.wallNumber === '4')
            {

                //console.log(otherObject);
                console.log(origCorrection);
                //console.log(normal);
                /*console.log(priority);
                console.log('object collider');
                console.log(this.collider[0][0].point.x);
                console.log(this.collider[0][0].point.y);
                console.log(this.collider[0][1].point.x);
                console.log(this.collider[0][1].point.y);
                console.log('other obj collider');
                console.log(otherObject.collider);
            }*/

            var correction = origCorrection.clone();
            correction.multiply(normal);

            for (var axis in this.constraints)
            {

                if (correction[axis] != 0)
                {

                    var corrSign = correction[axis]/Math.abs(correction[axis]),
                        cSign = -corrSign;

                    if (this.constraints[axis][cSign]!=0 || this.constraints[axis][corrSign]!=0)

                    {

                        if (this.constraints[axis][cSign] > priority[axis][corrSign] || ultimate[axis])
                        {

                            this.lastCorrection[axis] += correction[axis];                    

                        } else if (this.constraints[axis][cSign] < priority[axis][corrSign])
                        {
                            pushBack[axis] = correction[axis];

                        } else if (this.constraints[axis][cSign] == priority[axis][corrSign] )
                        {
                            // get share of correction this object is responsible
                            if (Math.abs(otherObject.vel[axis] + otherObject.lastCorrection[axis]) +
                                Math.abs(this.vel[axis]+this.lastCorrection[axis]) > 0)
                            {
                                var objectShare = Math.abs(this.vel[axis]+this.lastCorrection[axis])/
                                    (Math.abs(otherObject.vel[axis] + otherObject.lastCorrection[axis]) +
                                    Math.abs(this.vel[axis]+this.lastCorrection[axis]));                        

                                this.lastCorrection[axis] += correction[axis]*objectShare;
                                pushBack[axis] = correction[axis]*(1 - objectShare);

                                ultimatePushBack[axis] = true;
                            } else {
                                this.lastCorrection[axis] += correction[axis]
                            }
                        }

                    } else
                    {
                        var currentVel = new Phaser.Math.Vector2();
                        currentVel.add(this.vel);
                        currentVel.add(this.lastCorrection);

                        /*if (this.wallNumber === '21')
                        {
                            console.log('for free door');
                            console.log(currentVel);
                            console.log(currentVel.dot(correction));
                        }*/

                        if (Math.abs(currentVel.dot(correction)) < 0.001 && currentVel.length() > 0.001)
                        {
                            /*if (this.wallNumber === '21')
                            {
                                console.log('alt normal from free door');
                            }*/
                            /*if (this.wallNumber === '1')
                            {   
                                console.log('___________alt normal from box __________');
                                console.log('current Vel');
                                console.log(currentVel);
                                console.log(this.lastCorrection);

                                console.log(this);
                                console.log(this.constraints);
                                console.log(correction);
                                console.log(otherObject);
                                console.log(otherObject.constraints);
                            }*/

                            
                            var altNormal = new Phaser.Math.Vector2(1, 1);
                            altNormal.subtract(normal);

                            this.velCorrection(origCorrection, point, altNormal, otherObject, pair, ultimate);
                        } else
                        {
                            pushBack[axis] = correction[axis];
                        }
                    }

                    this.constraints[axis][corrSign] = Math.min(priority[axis][corrSign], this.constraints[axis][corrSign]);

                }

            }

            /*if (this.wallNumber === '15' && otherObject.wallNumber === '7')
            {
                console.log(this.constraints);
                console.log(this.lastCorrection);
                console.log(this.vel);
                console.log(pushBack);
            }*/

            return {vector: pushBack, ultimate: ultimatePushBack};            
        }
    }, {
        key: 'updateVel',
        value: function updateVel() {
            /*if (this.reporting) {
                if (this.wallNumber === '4')
                {
                    console.log('update vel box');                
                    console.log(this.lastCorrection);
                    console.log(this.vel);
                }
                if (this.wallNumber === '6')
                {
                    console.log('update vel door');
                    console.log(this.lastCorrection);
                    console.log(this.vel);
                }
                
            }*/
            this.vel.add(this.lastCorrection);
        }
    }, {
        key: 'update',
        value: function update(time, delta) {

            //console.log(this.wallNumber);
            this.vel = new Phaser.Math.Vector2();
            this.velCorrected = false;
            this.lastCorrection = new Phaser.Math.Vector2();
            this.lastCorrPriority = this.movability;
            this.constraints = {x : {'1': this.movability, '-1': this.movability}, y: {'1': this.movability, '-1': this.movability}};
            this.resolvedPairs = [];
            this.unresolvedPairs = [];
        }
    }]);

    return Wall;
}(Phaser.GameObjects.Sprite);

module.exports = Wall;

/***/ }),

/***/ 223:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Pair = __webpack_require__(1160);

var PlainCollider = {

	initiate: function(scene)
    {
        this.objects = [];
        this.currentCollGroupId = 0;
        this.collGroups = {};
        this.pairs = [];
        this.bouncyIndex = undefined;
        this.reporting = false;
        this.objectRemoved = false;
        this.scene = scene;
    },

    addObject: function(object, vertices)
    {
        object.collider = [];
        // create an array of segments and assign it to the object
        vertices.forEach(function(body){
            var clockWiseVertices = this.arrangeVerticesClockwise(body),
                segments = clockWiseVertices.map(function(vertex, index, vertArray){
                    var point = new Phaser.Math.Vector2(vertex[0], vertex[1]),
                        nextIndex = (index < vertArray.length - 1)? index+1: 0,
                        dirV = new Phaser.Math.Vector2(vertArray[nextIndex][0] - vertex[0], vertArray[nextIndex][1] - vertex[1]),
                        normalVec = dirV.clone();

                    normalVec.normalizeRightHand();
                    normalVec.normalize();
                    normalVec.scale(-1);

                    return {point: point, direction: dirV, normal: normalVec}
                }, this);

            object.collider.push(segments);
        }, this);

        object.colliderId = this.objects.length;
        this.objects.push(object);

        object.on('destroy', function(obj){
            var objIndex = this.objects.indexOf(obj);
            this.objects.splice(objIndex, 1);
        }, this);
    },

    updateCollider: function(object, vertices)
    {
        object.collider = [];
        // create an array of segments and assign it to the object
        vertices.forEach(function(body){
            var clockWiseVertices = this.arrangeVerticesClockwise(body),
                segments = clockWiseVertices.map(function(vertex, index, vertArray){
                    var point = new Phaser.Math.Vector2(vertex[0], vertex[1]),
                        nextIndex = (index < vertArray.length - 1)? index+1: 0,
                        dirV = new Phaser.Math.Vector2(vertArray[nextIndex][0] - vertex[0], vertArray[nextIndex][1] - vertex[1]),
                        normalVec = dirV.clone();

                    normalVec.normalizeRightHand();
                    normalVec.normalize();
                    normalVec.scale(-1);

                    return {point: point, direction: dirV, normal: normalVec}
                }, this);

            object.collider.push(segments);
        }, this);
    },

    refreshPairs: function()
    {
        this.findAllPairs();
        /*this.pairs.sort(function(a, b){
            var aMovabilityIndex = a.object1.movability * a.object2.movability,
                bMovabilityIndex = b.object1.movability * b.object2.movability;

            if (aMovabilityIndex<bMovabilityIndex) return -1;
            return 1;
        })*/
        
        //console.log(this.objects);
        //console.log(this.objects[6].constraints);
        //console.log(this.pairs);
        
    },

    sortPairsByPriority: function()
    {
        this.pairs.sort(function(a, b){
            var aCorrectionIndex = a.object1.lastCorrPriority * a.object2.lastCorrPriority,
                bCorrectionIndex = b.object1.lastCorrPriority * b.object2.lastCorrPriority;

            if (aCorrectionIndex<bCorrectionIndex) return -1;
            return 1;
        })
    },

    findAllPairs: function()
    {
        /*objectArray = objectArray || this.objects;
        var objectArrayCopy = objectArray.slice(),
            firstObject = objectArrayCopy.shift();

        if (objectArrayCopy.length > 1)
        {
            for (var i = 0; i<objectArrayCopy.length; i++)
            {
                var pair = new Pair(firstObject, objectArrayCopy[i], this.pairs);
                this.pairs.push(pair);
            }
            this.findAllPairs(objectArrayCopy);
        } else {
            var pair = new Pair(firstObject, objectArrayCopy[0], this.pairs);
            this.pairs.push(pair);
        }*/
        /*var bouncyIndex = this.objects.findIndex(function(obj){
            return obj.movability === 2;
        }, this);
        var bouncy = this.objects.splice(bouncyIndex, 1);
        this.objects.splice(0, 0, bouncy[0]);
        console.log(this.objects);*/

        this.objects.sort(function(a, b){
            if (a.movability > b.movability) return 1;
            return -1;
        });

        this.pairs = [];
        for (var r = 0; r<this.objects.length; r++)
        {
            this.pairs[r] = []
            for (var c = 0; c<this.objects.length; c++)
            {
                if (c>r)
                {
                    if (this.objects[r].collWith.indexOf(this.objects[c].collGroup) >= 0 && 
                        this.objects[c].collWith.indexOf(this.objects[r].collGroup)>=0)
                    this.pairs[r][c] = new Pair(this.objects[r], this.objects[c], this);
                    else this.pairs[r][c] = false
                } else if (c===r) {
                    this.pairs[r][c] = false;
                } else {
                    this.pairs[r][c] = this.pairs[c][r];
                }

            }
        }
    },

    injectObjectInPairs: function(newObject)
    {
        /*this.objects.forEach(function(object, index, arr){
            if (index < arr.length - 1)
            {
                var pair = new Pair(object, newObject, this.pairs);
                this.pairs.push(pair)
            }
        }, this);

        this.pairs.sort(function(a, b){
            var aMovabilityIndex = a.object1.movability * a.object2.movability,
                bMovabilityIndex = b.object1.movability * b.object2.movability;

            if (aMovabilityIndex<bMovabilityIndex) return -1;
            return 1;
        })*/
        //console.log('inject object called');
        //console.log(this.objects);
        this.pairs[this.objects.length -1] = [];
        for (var c = 0; c<this.objects.length -1; c++)
        {
            this.pairs[c][this.objects.length - 1] = new Pair(this.objects[c], newObject, this);
            this.pairs[this.objects.length - 1][c] = this.pairs[c][this.objects.length - 1];
        }
        this.pairs[this.objects.length -1][this.objects.length -1] = false;
    },

    removeObject: function(obj)
    {
        //console.log(obj.colliderId);
        /*var objIndex = this.objects.findIndex(function(entity){           
            return entity.colliderId === obj.colliderId;
        }, this);
        if (objIndex >= 0)
        {
            this.objects.splice(objIndex, 1);
            this.pairs.splice(objIndex, 1);
            this.pairs.forEach(function(pairRow){
                pairRow.splice(objIndex, 1);
            }, this);
            this.objectRemoved = true;  
        }*/
        if (!this.objectRemoved)
        {
            //console.log('object remove called');
            this.pairs.splice(obj.colliderId, 1);
            this.pairs.forEach(function(pairRow){
                pairRow.splice(obj.colliderId, 1);
            }, this);
            this.objectRemoved = true;      
        }
    },

    arrangeVerticesClockwise: function(vertices) 
    {
        // create array of vector out of vertices with start and direction vectors
        /*var segmentArray = vertices.map(function(vertex, index, vertArray){
            var startPoint = new Phaser.Math.Vector2(vertex[0], vertex[1]),
                nextIndex = (index < vertArray.length - 1)? index+1: 0,
                dirV = new Phaser.Math.Vector2(vertArray[nextIndex][0] - vertex[0], vertArray[nextIndex][1] - vertex[1]);

            return [startPoint, dirV]

        }, this);

        // find non intersecting normal in initial circut
        for (var v=0; v<vertices.length; v++)
        {
            var currentV = vertices[v],
                nextIndex = (v<vertices.length - 1)? v+1: 0,
                nextV = vertices[nextIndex],
                dirV = new Phaser.Math.Vector2(nextV[0] - currentV[0], nextV[1] - currentV[1]),
                normV = dirV.clone();

            normV.normalizeRightHand();
            normV.scale(1000);

            var centerVec = new Phaser.Math.Vector2((nextV[0] + currentV[0])*0.5, (nextV[1] + currentV[1])*0.5),
                haveIntersection = false;

            segmentArray.forEach(function(segment, index){
                if (index != v) {
                    haveIntersection = haveIntersection || intersectSegSeg(centerVec, normV, segment[0], segment[1]);   
                }               
            }, this);

            if (!haveIntersection) break;
        }

        if (v === vertices.length) {
            return vertices.slice();
        } else {
            return vertices.slice().reverse();
        }*/

        // find point inside vertices
        if (vertices.length > 3) {
            var innerPoint = new Phaser.Math.Vector2((vertices[0][0] + vertices[2][0])*0.5, (vertices[0][1] + vertices[2][1])*0.5);
        } else {
            var innerPoint = new Phaser.Math.Vector2((vertices[0][0] + vertices[1][0])*0.5, (vertices[0][1] + vertices[1][1])*0.5);
        }

        var vertCopy = vertices.slice();
        vertCopy.sort(function(a, b){
            var aVec = new Phaser.Math.Vector2(a[0] - innerPoint.x, a[1] - innerPoint.y),
                bVec = new Phaser.Math.Vector2(b[0] - innerPoint.x, b[1] - innerPoint.y);

            if (aVec.angle() > bVec.angle()) {
                return 1;
            }
            return -1;
        }, this);

        return vertCopy;
    },

    rotateCollider: function(object, angle, rotPoint)
    {   

        var rotateMatrix = new Phaser.Math.Matrix3();

        rotateMatrix.fromArray([Math.cos(angle), Math.sin(angle), 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0]);

        object.collider.forEach(function(body){
            body.forEach(function(segment){
                segment.normal.add(segment.point);
                segment.normal.subtract(rotPoint);
                segment.normal.transformMat3(rotateMatrix);
                segment.normal.add(rotPoint);

                segment.direction.add(segment.point);
                segment.direction.subtract(rotPoint);
                segment.direction.transformMat3(rotateMatrix);
                segment.direction.add(rotPoint);            
                
                segment.point.subtract(rotPoint);
                segment.point.transformMat3(rotateMatrix);
                segment.point.add(rotPoint);

                segment.direction.subtract(segment.point);
                segment.normal.subtract(segment.point);
            }, this);
        }, this);
    },

    registerNewCollGroup: function(name) 
    {
        this.collGroups[name] = this.currentCollGroupId;

        this.currentCollGroupId++;

        return this.collGroups[name];

    },

    assignCollGroup: function(object, name)
    {
        object.collGroup = this.collGroups[name];
    },

    getPairsWithObject: function(object)
    {
        var pairsWithObject = this.pairs.filter(function(pair){
            if (pair.object1.colliderId === object.colliderId || pair.object2.colliderId === object.colliderId)
            {
                return true;
            }
            return false;
        }, this);

        return pairsWithObject;
    },

    checkCollisionsWithObject: function(object)
    {
        var pairs = this.getPairsWithObject(object);

        pairs.forEach(function(pair){
            pair.checkPairCollision(false);
        }, this);
    },

    checkCollisions: function(objArray)
    {
        /*this.pairs.forEach(function(pair){
            pair.checkPairCollision(true);
        }, this);*/
        if (this.objectRemoved)
        {
            //console.log('check collision called and object removed');
        }
        
        var currentPairCell = [0, 1],
            queueStop = 0,
            rowsToCheck = [],
            totalCalledRows = [],
            iterationCounter = 0;

        while (queueStop < this.objects.length && iterationCounter < 1000)
        {   
            //if (this.reporting) console.log(this.pairs[currentPairCell[0]][currentPairCell[1]]);
            //console.log(nonCheckedPairs);
            var pair = this.pairs[currentPairCell[0]][currentPairCell[1]];
            /*if (iterationCounter > 900)
            {
                console.log('current cell '+currentPairCell);
            }*/
            if (pair)
            {
                var pairCollided = pair.checkPairCollision();
                /*if (iterationCounter > 900)
                {
                    console.log('pair collided '+pairCollided);
                }*/
                if (pairCollided)
                {
                    totalCalledRows.push(currentPairCell);
                    if (rowsToCheck.indexOf(currentPairCell[1])< 0) 
                    {
                        rowsToCheck.push(currentPairCell[1]);                       
                    }
                    /*if (iterationCounter > 900)
                    {
                        console.log('rows needed check '+rowsToCheck);
                    }*/
                }               
                
            } else {
                //if (iterationCounter > 900) console.log('no pair');
            }
            
            if (currentPairCell[1] === this.objects.length - 1)
            {
                if (rowsToCheck.length === 0)
                {
                    queueStop ++;
                    currentPairCell = [queueStop, 0];
                } else {
                    currentPairCell = [rowsToCheck.shift(), 0];
                }                               
            } else {

                currentPairCell = [currentPairCell[0], currentPairCell[1]+1];
            }
            if (pair) iterationCounter++;
        }
        /*if (iterationCounter>=1000) 
        {
            console.log('out of while with iterations_____________________');   

        }*/
        //else console.log(iterationCounter);
        //if (this.reporting) console.log('end of collision check');

        // gather information for collision particles

        //this.scene.collisionPoints = [];

        for (var i = 0; i<this.objects.length; i++)
        {
            for (var j = 0; j<i; j++)
            {               

                var pair = this.pairs[j][i];

                if (pair)
                {
                    if (pair.nowCollided && !pair.previouslyCollided)
                    {
                        //console.log('putting col point');
                        //this.scene.collisionPoints.push(pair.collisionPoints[0]);
                        //this.scene.collisionPoints.push(pair.collisionPoints[1]);
                    }
                    pair.updateCollisionStatus();
                }

            }
        }

    },

    updateObjectsIds: function()
    {
        if (this.objectRemoved)
        {
            //console.log('object collID update called');
            //console.log(this.objects);
            // update collider ids
            this.objects.forEach(function(entity, index){
                entity.colliderId = Number(index);
            }, this);
            this.objectRemoved = false;
        }
    },

    drawColliders: function(graphics) 
    {
        graphics.clear();

        this.objects.forEach(function(object){
            graphics.beginPath();
            object.collider.forEach(function(body){
                body.forEach(function(segment, index, arr){
                    if (index===0) 
                    {
                        graphics.moveTo(segment.point.x, segment.point.y);
                    } else
                    {
                        graphics.lineTo(segment.point.x, segment.point.y);
                        if (index===arr.length - 1) {
                            graphics.closePath();
                            graphics.strokePath();
                        }
                    }
                }, this);
            }, this);
        }, this);
    },

    moveAll: function(delta)
    {
        this.objects.forEach(function(object){
            object.updateVel(delta);
            object.x += object.vel.x;
            object.y += object.vel.y;
            object.collider.forEach(function(body){
                body.forEach(function(segment){
                    segment.point.x += object.vel.x;
                    segment.point.y += object.vel.y;
                }, this);
            }, this);
        }, this);

        /*this.pairs.forEach(function(pairRow){
            pairRow.forEach(function(pair){
                if (pair.collisionChecked) pair.collisionChecked = false;
            }, this);           
        }, this);*/
    }

};

module.exports = PlainCollider;

/***/ }),

/***/ 470:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Wall = __webpack_require__(141);
var wallGenerator = __webpack_require__(73);

var GWall = exports.GWall = function (_Wall) {
	_inherits(GWall, _Wall);

	function GWall(scene, edges, wallNumber) {
		_classCallCheck(this, GWall);

		var _this = _possibleConstructorReturn(this, (GWall.__proto__ || Object.getPrototypeOf(GWall)).call(this, scene, edges, wallNumber));

		_this.movability = 3;
		_this.lastCorrPriority = _this.movability;
        _this.constraints = {x : {'1': _this.movability, '-1': _this.movability}, y: {'1': _this.movability, '-1': _this.movability}};
		return _this;
	}

	_createClass(GWall, [{
		key: 'drawTexture',
		value: function drawTexture(scene, edgeVertices, wallWidth, wallHeight) {
			return wallGenerator.generateGWall(scene, edgeVertices, wallWidth, wallHeight);
		}
	}, {
		key: 'update',
		value: function update(time, delta) {
			/*if (this.wallNumber === '4') {
             //console.log(this.lastCorrection);
             console.log('update______________');
         }*/
			this.vel.x = 0;
			this.vel.y = Math.min(5, this.vel.y + 0.5);
			this.velCorrected = false;
			this.lastCorrection = new Phaser.Math.Vector2();
			this.lastCorrPriority = this.movability;
            this.constraints = {x : {'1': this.movability, '-1': this.movability}, y: {'1': this.movability, '-1': this.movability}};
			this.resolvedPairs = [];
			this.unresolvedPairs = [];
		}
	}]);

	return GWall;
}(Wall);

module.exports = GWall;

/***/ }),

/***/ 471:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GWall = __webpack_require__(470);
var wallGenerator = __webpack_require__(73);

var WoodBox = exports.WoodBox = function (_GWall) {
	_inherits(WoodBox, _GWall);

	function WoodBox(scene, edges, wallNumber) {
		_classCallCheck(this, WoodBox);

		var _this = _possibleConstructorReturn(this, (WoodBox.__proto__ || Object.getPrototypeOf(WoodBox)).call(this, scene, edges, wallNumber));

		var topLeft = _this.getTopLeft(),
		    bottomRight = _this.getBottomRight();

		_this.vertices = [[[topLeft.x, topLeft.y], [bottomRight.x, topLeft.y], [bottomRight.x, bottomRight.y], [topLeft.x, bottomRight.y]]];
		//this.movability = 0;
		return _this;
	}

	_createClass(WoodBox, [{
		key: 'definePosition',
		value: function definePosition(edges) {
			this.wallWidth = 70;
			this.wallHeight = 70;
			this.leftPointWall = edges[0][0] - this.wallWidth / 2;
			this.topPointWall = edges[0][1] - this.wallHeight / 2;
		}
	}, {
		key: 'prepareTexture',
		value: function prepareTexture() {
			return 'woodBox';
		}
	}]);

	return WoodBox;
}(GWall);

module.exports = WoodBox;

/***/ }),

/***/ 472:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlainCollider = __webpack_require__(223);
var Wall = __webpack_require__(141);
var LavaWall = __webpack_require__(473);

var Bouncy = exports.Bouncy = function (_Phaser$GameObjects$S) {
	_inherits(Bouncy, _Phaser$GameObjects$S);

	function Bouncy(scene, xPos, yPos) {
		_classCallCheck(this, Bouncy);

		var _this = _possibleConstructorReturn(this, (Bouncy.__proto__ || Object.getPrototypeOf(Bouncy)).call(this, scene, xPos, yPos, 'bouncy', 'idle0'));

		scene.add.existing(_this);
		var frameNamesIdle = [{ key: 'bouncy', frame: 'idle0' }, { key: 'bouncy', frame: 'idle1' }, { key: 'bouncy', frame: 'idle2' }, { key: 'bouncy', frame: 'idle1' }];
		var frameNamesFly = [{ key: 'bouncy', frame: 'fly0' }, { key: 'bouncy', frame: 'fly1' }];

		var frameNamesShock = scene.anims.generateFrameNames('bouncy', { prefix: 'shock', start: 0, end: 3 });
		//console.log(frameNamesShock);
		_this.idleAnimation = scene.anims.create({ key: 'idle', frames: frameNamesIdle, repeat: -1, frameRate: 4 });
		_this.flyAnimation = scene.anims.create({ key: 'fly', frames: frameNamesFly, repeat: -1, frameRate: 6 });
		_this.shockAnimation = scene.anims.create({ key: 'shock', frames: frameNamesShock, repeat: 1, frameRate: 12 });
		_this.play('idle');

		var topLeft = _this.getTopLeft(),
		    bottomRight = _this.getBottomRight();

		_this.vertices = [[[topLeft.x, topLeft.y], [bottomRight.x, topLeft.y], [bottomRight.x, bottomRight.y], [topLeft.x, bottomRight.y]]];

		_this.vel = new Phaser.Math.Vector2();
		_this.movability = 2;
		_this.velCorrected = false;
		_this.lastCorrection = new Phaser.Math.Vector2();
		_this.correctionDirection = new Phaser.Math.Vector2();
		_this.lastCorrPriority = _this.movability;
		_this.inLava = false;
        _this.constraints = {x : {'1': _this.movability, '-1': _this.movability}, y: {'1': _this.movability, '-1': _this.movability}};

		_this.setDepth(10);

        if (scene.game.renderer.gl)
        {
    		_this.engineParticles = scene.add.particles('engineParticle');
    		_this.engineParticles.setDepth(10);

    		_this.engineEmitter = _this.engineParticles.createEmitter({
    			x: _this.x,
    			y: _this.y,
    			lifespan: 300,
    			frequency: 30,
    			speed: 10,
    			angle: 90,
    			scale: { start: 0.5, end: 0.2 },
    			alpha: { start: 0.6, end: 0 }
    		});
    		_this.engineEmitter.stop();
    		
        } else
        {
            _this.thrustSprite = scene.add.sprite(_this.x, _this.y, 'thrustAnim');
            var thrustAnimationNames = scene.anims.generateFrameNames('thrustAnim', {start: 1, end: 3});
            _this.thrustAnimation = scene.anims.create({key: 'main', frames: thrustAnimationNames,
                repeat: -1, frameRate: 12});
            _this.thrustSprite.alpha = 0;
            _this.thrustSprite.setOrigin(0.5, 0);
            _this.thrustSprite.setDepth(10);
        }
        _this.fuelCapacity = 100;
        _this.currentFuel = 100;
        //_this.engineEmitter.startFollow(_this);
        //_this.engineEmitter.setScrollFactor(0);
        //console.log(_this.engineEmitter.scrollFactorX);
        //console.log(_this.engineEmitter.scrollFactorY);

		_this.fromGroundLaunch = false;

		_this.dustSplashRight = scene.add.sprite(bottomRight.x, bottomRight.y, 'dustSplash');
		_this.dustSplashRight.alpha = 0;
		_this.dustSplashRight.setOrigin(0, 1);
		_this.dustSplashRight.setDepth(10);

		_this.dustSplashLeft = scene.add.sprite(topLeft.x, bottomRight.y, 'dustSplash');
		_this.dustSplashLeft.alpha = 0;
		_this.dustSplashLeft.setOrigin(1, 1);
		_this.dustSplashLeft.setDepth(10);
		_this.dustSplashLeft.setFlipX(true);

		//console.log(scene.anims.generateFrameNames('dustSplash', {start: 1, end: 16}));
		var dustFrames = [{ key: 'dustSplash', frame: '1' }, { key: 'dustSplash', frame: '2' }, { key: 'dustSplash', frame: '3' }, { key: 'dustSplash', frame: '4' }, { key: 'dustSplash', frame: '5' }, { key: 'dustSplash', frame: '6' }, { key: 'dustSplash', frame: '7' }, { key: 'dustSplash', frame: '8' }, { key: 'dustSplash', frame: '9' }, { key: 'dustSplash', frame: '10' }, { key: 'dustSplash', frame: '11' }, { key: 'dustSplash', frame: '12' }, { key: 'dustSplash', frame: '13' }, { key: 'dustSplash', frame: '14' }, { key: 'dustSplash', frame: '15' }, { key: 'dustSplash', frame: '16' }];

		_this.dustSplashAnimation = scene.anims.create({ key: 'dustSplash', frames: dustFrames, repeat: 0, frameRate: 32 });
		_this.dustSplashRight.on('animationcomplete', _this.hideDust, _this);
		//console.log(scene.anims.generateFrameNames('dustSplash', {start: 1, end: 16}));

		_this.inGroundContact = false;
		_this.inShock = false;

		// sounds 
		_this.bumpSound = scene.sound.add('bumpSound');

		return _this;
	}

	_createClass(Bouncy, [{
		key: 'velCorrection',
		value: function velCorrection(origCorrection, point, normal, otherObject, pair, ultimate) {

			if (!ultimate) var ultimate = {x: false, y: false};

            var priority = otherObject.constraints,
                pushBack = new Phaser.Math.Vector2(),
                ultimatePushBack = {x: false, y: false};

            if (!this.velCorrected) this.velCorrected = true;

            var correction = origCorrection.clone();
            correction.multiply(normal);

            /*console.log('correction in bouncy');
            console.log(correction);
            console.log('comes from');
            console.log(otherObject);*/


            for (var axis in this.constraints)
            {

                if (correction[axis] != 0)
                {

                    var corrSign = correction[axis]/Math.abs(correction[axis]),
                        cSign = -corrSign;

                    if (this.constraints[axis][cSign]!=0 || this.constraints[axis][corrSign]!=0)

                    {

                        if (this.constraints[axis][cSign] > priority[axis][corrSign] || ultimate[axis])
                        {

                            this.lastCorrection[axis] += correction[axis];                    

                        } else if (this.constraints[axis][cSign] < priority[axis][corrSign])
                        {
                            pushBack[axis] = correction[axis];

                        } else if (this.constraints[axis][cSign] == priority[axis][corrSign] )
                        {
                            // get share of correction this object is responsible
                            if (Math.abs(otherObject.vel[axis] + otherObject.lastCorrection[axis]) +
                                Math.abs(this.vel[axis]+this.lastCorrection[axis]) > 0)
                            {
                                var objectShare = Math.abs(this.vel[axis]+this.lastCorrection[axis])/
                                    (Math.abs(otherObject.vel[axis] + otherObject.lastCorrection[axis]) +
                                    Math.abs(this.vel[axis]+this.lastCorrection[axis]));                        

                                this.lastCorrection[axis] += correction[axis]*objectShare;
                                pushBack[axis] = correction[axis]*(1 - objectShare);

                                ultimatePushBack[axis] = true;
                            } else {
                                this.lastCorrection[axis] += correction[axis]
                            }
                        }

                    } else
                    {
                        //console.log('alt in bouncy');

                        var currentVel = new Phaser.Math.Vector2();
                        currentVel.add(this.vel);
                        currentVel.add(this.lastCorrection);

                        if (Math.abs(currentVel.dot(correction)) < 0.001 && currentVel.length() > 0.001)
                        {
                            var altNormal = new Phaser.Math.Vector2(1, 1);
                            altNormal.subtract(normal);

                            this.velCorrection(origCorrection, point, altNormal, otherObject, pair, ultimate);
                        } else
                        {
                            pushBack[axis] = correction[axis];
                        }
                    }


                    this.constraints[axis][corrSign] = Math.min(priority[axis][corrSign], this.constraints[axis][corrSign]);

                }

            }

			if (otherObject.__proto__.constructor === LavaWall && !this.inLava) {
				this.inLava = true;
			}
			
            if (!this.fromGroundLaunch && (Math.abs(normal.y) - 1 < 0.1) && point[0].y > this.y) {
				//console.log('from ground conditions');
				//console.log(point.y);
				//console.log(this.y);
				this.fromGroundLaunch = true;
			}

            return {vector: pushBack, ultimate: ultimatePushBack};		
			
		}
	}, {
		key: 'updateVel',
		value: function updateVel() {
			/*if (this.reporting)
   {
   	console.log('updtae vel bopuncy');
   	console.log(this.lastCorrection);
   	console.log(this.vel);
   }*/
			this.vel.add(this.lastCorrection);
		}
	}, {
		key: 'update',
		value: function update(time, delta) {
			this.vel.x = 0;
			this.vel.y = Math.min(5, this.vel.y + 0.5);
			this.velCorrected = false;
			this.lastCorrection = new Phaser.Math.Vector2();
			this.lastCorrPriority = this.movability;
            this.constraints = {x : {'1': this.movability, '-1': this.movability}, y: {'1': this.movability, '-1': this.movability}};
			this.resolvedPairs = [];
			this.unresolvedPairs = [];
			if (this.fromGroundLaunch && !this.inGroundContact) {
				this.launchDust();
				this.inGroundContact = true;
			} else if (!this.fromGroundLaunch) {
				this.inGroundContact = false;
			}
			this.fromGroundLaunch = false;
		}
	}, {
		key: 'tankUp',
		value: function tankUp(fuelAmount) {
			this.currentFuel = Math.min(this.fuelCapacity, this.currentFuel + fuelAmount);
			this.emit('tankUp');
		}
	}, {
		key: 'launchDust',
		value: function launchDust() {
			//console.log('launch dust called');
			var bottomRight = this.getBottomRight(),
			    topLeft = this.getTopLeft();

			this.dustSplashRight.x = bottomRight.x;
			this.dustSplashRight.y = bottomRight.y;

			this.dustSplashLeft.x = topLeft.x;
			this.dustSplashLeft.y = bottomRight.y;

			this.dustSplashRight.alpha = 1;
			this.dustSplashLeft.alpha = 1;

			this.dustSplashAnimation.resume();

			this.dustSplashRight.play('dustSplash');
			this.dustSplashLeft.play('dustSplash');

			this.bumpSound.play();
		}
	}, {
		key: 'hideDust',
		value: function hideDust() {
			this.dustSplashRight.alpha = 0;
			this.dustSplashLeft.alpha = 0;
		}
	}]);

	return Bouncy;
}(Phaser.GameObjects.Sprite);

module.exports = Bouncy;

/***/ }),

/***/ 473:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Wall = __webpack_require__(141);
var wallGenerator = __webpack_require__(73);

var LavaWall = exports.LavaWall = function (_Wall) {
	_inherits(LavaWall, _Wall);

	function LavaWall() {
		_classCallCheck(this, LavaWall);

		return _possibleConstructorReturn(this, (LavaWall.__proto__ || Object.getPrototypeOf(LavaWall)).apply(this, arguments));
	}

	_createClass(LavaWall, [{
		key: 'drawTexture',
		value: function drawTexture(scene, edgeVertices, wallWidth, wallHeight) {
			var wallTextureData = wallGenerator.generateLavaWall(scene, edgeVertices, wallWidth, wallHeight),
			    alignedFramePoints = wallTextureData.framePoints;

			// at graphics factory points are built aligned to (0, 0)
			// so need to add top left corner back
			this.framePoints = alignedFramePoints.map(function (point) {
				return new Phaser.Math.Vector2(point.x + this.leftPointWall, point.y + this.topPointWall);
			}, this);

			this.scene = scene;

			this.updatePaths();

			this.follower = { t: 0, vec: new Phaser.Math.Vector2(), angleVec: new Phaser.Math.Vector2() };

			this.flashTween = scene.tweens.add({
				targets: this.follower,
				t: 1,
				ease: 'Linear',
				duration: this.distance * 3,
				yoyo: true,
				repeat: -1
			});

			this.flashSprite = scene.add.sprite(this.framePoints[0].x, this.framePoints[0].y, 'flash');
			this.flashSprite.setDepth(11);
			this.flashSprite.setScale(0.7);

			if (!scene.anims.get('flashMain')) {
				this.mainAnim = scene.anims.create({ key: 'flashMain', frames: scene.anims.generateFrameNames('flash', { start: 1, end: 8 }),
					repeat: -1, frameRate: 12 });
			} else {
				this.mainAnim = scene.anims.get('flashMain');
			}

			this.flashSprite.play('flashMain');

			this.inRotation = false;

			this.alphaEvent = scene.time.delayedCall(100 + 400 * Math.random(), this.changeDischargeAlpha, [], this);

			return wallTextureData.textureName;
		}
	}, {
		key: 'updatePaths',
		value: function updatePaths() {
			var currentDistance = 0;

			if (this.flashPath) {
				this.flashPath.destroy();
			}

			this.flashPath = this.scene.add.path();

			if (this.anglePath) {
				this.anglePath.destroy();
			}

			this.anglePath = this.scene.add.path();

			for (var p = 0; p < this.framePoints.length - 1; p++) {
				var line = new Phaser.Curves.Line([this.framePoints[p].x, this.framePoints[p].y, this.framePoints[p + 1].x, this.framePoints[p + 1].y]);
				this.flashPath.add(line);

				var toNextVec = new Phaser.Math.Vector2(this.framePoints[p + 1].x - this.framePoints[p].x, this.framePoints[p + 1].y - this.framePoints[p].y),
				    toNextAngle = toNextVec.angle(),
				    toNextDistance = toNextVec.length();

				var angleLine = new Phaser.Curves.Line([currentDistance, toNextAngle, currentDistance + toNextDistance, toNextAngle]);
				this.anglePath.add(angleLine);

				currentDistance += toNextDistance;
			}

			this.distance = currentDistance;
		}
	}, {
		key: 'rotateFramePoints',
		value: function rotateFramePoints(angle, center) {
			this.framePoints.forEach(function (point) {
				var newPoint = new Phaser.Math.Vector2(point.x - center.x, point.y - center.y),
				    rotateMatrix = new Phaser.Math.Matrix3();

				rotateMatrix.fromArray([Math.cos(angle), Math.sin(angle), 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0]);
				newPoint.transformMat3(rotateMatrix);
				newPoint.add(new Phaser.Math.Vector2(center.x, center.y));

				point.copy(newPoint);
			}, this);
		}
	}, {
		key: 'rotateFlash',
		value: function rotateFlash(angle, center) {
			this.flashSprite.setRotation(this.flashSprite.rotation + angle);

			var newPoint = new Phaser.Math.Vector2(this.flashSprite.x - center.x, this.flashSprite.y - center.y),
			    rotateMatrix = new Phaser.Math.Matrix3();

			rotateMatrix.fromArray([Math.cos(angle), Math.sin(angle), 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0]);
			newPoint.transformMat3(rotateMatrix);
			newPoint.add(new Phaser.Math.Vector2(center.x, center.y));

			this.flashSprite.setPosition(newPoint.x, newPoint.y);
		}
	}, {
		key: 'startRotation',
		value: function startRotation(angle, center) {
			this.flashSprite.alpha = 0;
			this.rotateFramePoints(angle, center);
			this.rotateFlash(angle, center);
			this.flashTween.pause();
			this.inRotation = true;
			this.alphaEvent.destroy();
		}
	}, {
		key: 'endRotation',
		value: function endRotation() {
			this.flashSprite.alpha = 1;
			this.flashTween.resume();
			this.updatePaths();
			this.inRotation = false;
			this.alphaEvent = this.scene.time.delayedCall(100 + 400 * Math.random(), this.changeDischargeAlpha, [], this);
		}
	}, {
		key: 'changeDischargeAlpha',
		value: function changeDischargeAlpha() {
			if (this) {
				if (this.flashSprite.alpha === 0) {
					this.flashSprite.alpha = 1;
				} else {
					this.flashSprite.alpha = 0;
				}
				this.alphaEvent = this.scene.time.delayedCall(100 + 200 * Math.random(), this.changeDischargeAlpha, [], this);
			}
		}
	}, {
		key: 'update',
		value: function update(time, delta) {
			_get(LavaWall.prototype.__proto__ || Object.getPrototypeOf(LavaWall.prototype), 'update', this).call(this, time, delta);

			if (!this.inRotation) {

				this.flashPath.getPoint(this.follower.t, this.follower.vec);
				this.flashSprite.setPosition(this.follower.vec.x, this.follower.vec.y);

				this.anglePath.getPoint(this.follower.t, this.follower.angleVec);
				//console.log(this.follower.angleVec.x);
				this.flashSprite.setRotation(this.follower.angleVec.y);
			}
		}
	}]);

	return LavaWall;
}(Wall);

module.exports = LavaWall;

/***/ }),

/***/ 474:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(224);

__webpack_require__(222);

var _PlayScene = __webpack_require__(1159);

var _PreloaderScene = __webpack_require__(1168);

var _MainMenuScene = __webpack_require__(1169);

var _LevelChoiceScene = __webpack_require__(1170);

var _BootScene = __webpack_require__(1171);

var defaultWidth = 600;
var defaultHeight = 600;

var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

var config = {
    type: iOSSafari? Phaser.CANVAS: Phaser.AUTO,
    width: defaultWidth,
    height: defaultHeight,
    backgroundColor: '#3d3752',
    parent: 'gameContainer',
    scene: [_BootScene.BootScene, _PreloaderScene.PreloaderScene, _MainMenuScene.MainMenuScene, _LevelChoiceScene.LevelChoiceScene, _PlayScene.PlayScene]
};

//console.log(window.location.hostname);

var game = new Phaser.Game(config);


window.addEventListener('resize', windowResized);

//if (game.isBooted) windowResized();else game.events.once('ready', windowResized);

CloudAPI.mute = function () {
    //Call function which will mute ALL sounds of the game, return true if succeed.
    game.sound.mute = true;
    return true;
};

CloudAPI.unmute = function () {
    //Call function which will unmute sounds of the game, return true if succeed.
    game.sound.mute = false;
    return true;
};

window.onload = function() 
{
    windowResized();
}

function windowResized() {
    //console.log(game.device);
    if (game.device.os.desktop) {
        //console.log('window resized');
        var w = window.innerWidth,
            h = window.innerHeight;

        var scaleW = Math.min(w / defaultWidth, 1),
            scaleH = Math.min(h / defaultHeight, 1),
            scale = Math.min(scaleW, scaleH);

        game.canvas.setAttribute('style', ' -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1);' + ' -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');' + ' transform-origin: center center;');

        if (scale < 1) {

            if (scaleH < 1) {
                var gameHeight = h / scaleH;
            } else {
                var gameHeight = defaultHeight;
            }

            if (scaleW < 1) {
                var gameWidth = w / scaleW;
            } else {
                var gameWidth = defaultWidth;
            }

            game.resize(gameWidth, gameHeight);

            /*game.scene.scenes.forEach(function(scene){
    if (scene.cameras.main) scene.cameras.main.setViewport(0, 0, gameWidth, gameHeight);
   }, this);*/
        }
    } else {
        //console.log('resize on non desktop device');
        if (document.documentElement.clientWidth < document.documentElement.clientHeight) {
            //console.log('on portrait resize');

            //var portraitDiv = document.getElementById('wrapper');
            //portraitDiv.setAttribute('style', 'z-index: 0; opacity: 0;');

            //window.setTimeout(function () {
                var w = document.documentElement.clientWidth,
                    h = document.documentElement.clientHeight;

                var scaleW = w / defaultWidth,
                    scaleH = h / defaultHeight,
                    scale = Math.min(scaleW, scaleH);

                //game.canvas.setAttribute('style', ' -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1);' + ' -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');' + ' transform-origin: center center;');

                var gameWidth = w,// scale,
                    gameHeight = h;// scale;

                game.resize(gameWidth, gameHeight);

                /*console.log(window.screen.availWidth);
                console.log(window.screen.availHeight);
                console.log(gameWidth);
                console.log(gameHeight);*/

                game.scene.scenes.forEach(function (scene) {
                    if (scene.cameras.main) scene.cameras.main.setViewport(0, 0, gameWidth, gameHeight);
                    if (scene.playPortrait && scene.sys.isActive()){
                        scene.respondPortrait();  
                    } 
                }, this);
            //}, 200);
        } else {
            //console.log('on landscape resize');
            //var portraitDiv = document.getElementById('wrapper');
            //portraitDiv.setAttribute('style', 'z-index: 2; opacity: 1;');
            game.scene.scenes.forEach(function (scene) {

                /*console.log(scene);
                console.log(scene.sys.isActive());*/

                if (scene.playPortrait && scene.sys.isActive()) {
                    //console.log(scene);
                    scene.respondLandscape();
                }
            }, this);
        }
    }
}

/***/ }),

/***/ 73:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var paper = __webpack_require__(222);

var wallGenerator = {

	textureNameArray: [],
	textureArray: [],
	texturesBin: [],

	generateWall: function generateWall(state, vertices, width, height) {
		this.state = state;
		var maxOffset = 10;

		var textureCanvas = document.createElement('canvas');

		textureCanvas.width = (width + 2 * maxOffset)/ window.devicePixelRatio;;
		textureCanvas.height = (height + 2 * maxOffset)/ window.devicePixelRatio;;

		var textureName = 'wallTexture' + this.textureNameArray.length;

		//var textureCanvas = this.state.textures.createCanvas(textureName, width, height);

		paper.setup(textureCanvas);

		var segments = vertices.map(function (vertex) {
			return new paper.Point(vertex[0] + maxOffset, vertex[1] + maxOffset);
		}, this);

		segments.pop();

		var outerPath = new paper.Path(segments);
		outerPath.closed = true;
		outerPath.fillColor = '#563eb2';
		outerPath.strokeColor = 'black';
		outerPath.strokeWidth = 2;

		var middlePath = outerPath.clone();
		extrude(middlePath, 5);
		middlePath.fillColor = '#433475';
		middlePath.strokeWidth = 0;

		placeEndSquares(outerPath, 16);

		putShines(outerPath);

		function drawShine(point, direction, width) {

			if (direction.equals(new paper.Point(1, 0))) {
				var aboveVec = direction.rotate(45).multiply(5 * Math.pow(2, 0.5)),
				    middleVec = direction.rotate(45).multiply(6 * Math.pow(2, 0.5)),
				    shiftVec = direction.rotate(90).multiply(width);
			} else if (direction.equals(new paper.Point(-1, 0))) {

				var aboveVec = direction.rotate(45).multiply(5 * Math.pow(2, 0.5)),
				    middleVec = direction.rotate(45).multiply(6 * Math.pow(2, 0.5)),
				    shiftVec = direction.rotate(-90).multiply(width);
			} else if (direction.equals(new paper.Point(-1, 0))) {
				var aboveVec = direction.rotate(-45).multiply(5 * Math.pow(2, 0.5)),
				    middleVec = direction.rotate(-45).multiply(6 * Math.pow(2, 0.5)),
				    shiftVec = direction.rotate(-90).multiply(width);
			} else {
				var aboveVec = direction.rotate(-45).multiply(5 * Math.pow(2, 0.5)),
				    middleVec = direction.rotate(-45).multiply(6 * Math.pow(2, 0.5)),
				    shiftVec = direction.rotate(90).multiply(width);
			}

			var point1 = point.add(aboveVec),
			    point2 = point1.add(shiftVec.multiply(0.4)),
			    point3 = point2.add(middleVec),
			    point4 = point3.add(shiftVec.multiply(-0.4)),
			    point5 = point4.add(aboveVec),
			    point6 = point5.add(shiftVec),
			    point7 = point6.add(aboveVec.multiply(-1)),
			    point8 = point7.add(shiftVec.multiply(0.4)),
			    point9 = point8.add(middleVec.multiply(-1)),
			    point10 = point9.add(shiftVec.multiply(-0.4)),
			    point11 = point10.add(aboveVec.multiply(-1));

			var shinePath = new paper.Path([point, point1, point2, point3, point4, point5, point6, point7, point8, point9, point10, point11]);

			shinePath.closed = true;
			shinePath.fillColor = 'white';
			shinePath.opacity = 0.2;
		}

		function putShines(path) {
			var startRivets = false;

			path.segments.forEach(function (segment) {
				var toNextVec = segment.next.point.subtract(segment.point),
				    currentDistance = 0;
				if (startRivets) {
					var distance = Math.round(Math.random() * 50) + 100;
					currentDistance += distance;
					while (currentDistance + 20 < toNextVec.length) {

						var localNormal = segment.curve.getNormalAt(currentDistance / toNextVec.length);

						var tangentPos = segment.point.add(toNextVec.multiply(currentDistance / toNextVec.length));

						var shineWidth = Math.round(Math.random() * 20) + 10;

						drawShine(tangentPos, localNormal, shineWidth);

						distance = Math.round(Math.random() * 50) + 100;
						currentDistance += distance + shineWidth;
					}
					/*var numberOfRivets = Math.floor(toNextVec.length/distance);
     for (var r = 1; r<numberOfRivets; r++)
     {
         var localNormal = segment.curve.getNormalAt(r/numberOfRivets);
         
         var tangentPos = segment.point.add(toNextVec.multiply(r/numberOfRivets));
         
         drawShine(tangentPos, localNormal);
     }*/
				}

				if (toNextVec.length <= 17) {
					//console.log('change start rivet');
					startRivets = !startRivets;
				}
			}, this);
		}

		function putRivets(path) {
			var startRivets = false,
			    distance = 70;

			path.segments.forEach(function (segment) {
				var toNextVec = segment.next.point.subtract(segment.point);
				if (startRivets) {
					var numberOfRivets = Math.floor(toNextVec.length / distance);
					for (var r = 1; r < numberOfRivets; r++) {
						var localNormal = segment.curve.getNormalAt(r / numberOfRivets);

						var tangentPos = segment.point.add(toNextVec.multiply(r / numberOfRivets)),
						    rivetPos = tangentPos.add(localNormal.multiply(8));

						drawRivet(rivetPos);
					}
				}

				if (toNextVec.length <= 17) {
					startRivets = !startRivets;
				}
			}, this);
		}

		function drawRivet(point) {
			var outerRivet = new paper.Path.Circle(point, 8);
			outerRivet.fillColor = '#3f706b';

			var fromPoint = point.add(new paper.Point(0, -8)),
			    toPoint = point.add(new paper.Point(-8, 0)),
			    throughPoint = point.add(new paper.Point(-8 * Math.cos(Math.PI / 4)), new paper.Point(-8 * Math.sin(Math.PI / 4))),
			    shine = new paper.Path.Arc(fromPoint, throughPoint, toPoint);

			shine.fillColor = '#ffffff';
			shine.opacity = 0.7;

			var middleRivet = new paper.Path.Circle(point, 5);
			middleRivet.fillColor = '#273833';
		}

		function extrude(path, depth) {
			var bisecs = [];
			path.segments.forEach(function (segment) {
				var toNextVec = segment.next.point.subtract(segment.point),
				    toPrevVec = segment.previous.point.subtract(segment.point);

				if (toNextVec.length <= 17) {
					var bisec = toNextVec.normalize(depth);
				} else if (toPrevVec.length <= 17) {
					var bisec = toPrevVec.normalize(depth);
				} else {
					toNextVec = toNextVec.normalize(depth);
					toPrevVec = toPrevVec.normalize(depth);
					var bisec = toNextVec.add(toPrevVec);
				}

				bisecs.push(bisec);
			}, this);

			for (var s in path.segments) {
				var newPoint = path.segments[s].point.add(bisecs[s]);
				if (path.contains(newPoint)) {
					path.segments[s].point = path.segments[s].point.add(bisecs[s]);
				} else {
					path.segments[s].point = path.segments[s].point.subtract(bisecs[s]);
				}
			}
		}

		function placeEndSquares(path, squareSide) {

			path.segments.forEach(function (segment) {
				var toNextVec = segment.next.point.subtract(segment.point),
				    toPrevVec = segment.previous.point.subtract(segment.point);

				if (toNextVec.length <= 17) {

					toNextVec = toNextVec.normalize(squareSide);
					toPrevVec = toPrevVec.normalize(squareSide);

					var toVec = segment.point.add(toNextVec).add(toPrevVec);

					var squarePath = new paper.Path.Rectangle(segment.point, toVec);
					squarePath.fillColor = '#406ed0';
					squarePath.strokeColor = 'black';
					squarePath.strokeWidth = 2;

					var smallSquarePath = new paper.Path.Rectangle(segment.point, toVec);
					smallSquarePath.scale(0.8);
					smallSquarePath.fillColor = '#5e8cf0';

					// add triangle

					var trianglePath = new paper.Path([segment.point.add(toPrevVec), segment.point, segment.point.add(toNextVec)]);
					trianglePath.closed = true;
					trianglePath.fillColor = '#ffffff';
					trianglePath.opacity = 0.3;
				}
			}, this);
		}

        paper.view.scale(1 / window.devicePixelRatio, new paper.Point(0, 0));

		paper.view.draw();

		this.state.textures.addCanvas(textureName, textureCanvas);

		//var spriteSheetName = 'wallTexture'+this.textureNameArray.length;

		this.textureArray.push(textureCanvas);
		this.textureNameArray.push(textureName);

		paper.project.remove();

		return textureName;
	},

	generateLavaWall: function generateLavaWall(state, vertices, width, height) {
		this.state = state;

		var maxOffset = 10;

		var textureCanvas = document.createElement('canvas');

		textureCanvas.width = (width + 2 * maxOffset)/ window.devicePixelRatio;;
		textureCanvas.height = (height + 2 * maxOffset)/ window.devicePixelRatio;;

		var textureName = 'wallTexture' + this.textureNameArray.length;

		//var textureCanvas = this.state.textures.createCanvas(textureName, width, height);

		paper.setup(textureCanvas);

		var segments = vertices.map(function (vertex) {
			return new paper.Point(vertex[0] + maxOffset, vertex[1] + maxOffset);
		}, this);

		segments.pop();

		var outerPath = new paper.Path(segments);
		outerPath.closed = true;
		outerPath.fillColor = '#5e8cf0';

		var leftPath = outerPath.clone();
		extrude(leftPath, 2, 9);
		leftPath.fillColor = '#b5dbf8';

		var rightPath = outerPath.clone();
		extrude(rightPath, 10, 2);
		rightPath.fillColor = '#b5dbf8';

		outerPath.strokeColor = 'black';
		outerPath.strokeWidth = 2;
		placeEndBolts(outerPath, 16);

		function extrude(path, otherSideDepth, thisSideDepth) {
			var bisecs = [],
			    otherSide = false;
			path.segments.forEach(function (segment) {
				var toNextVec = segment.next.point.subtract(segment.point),
				    toPrevVec = segment.previous.point.subtract(segment.point);

				var localDepth = otherSide ? otherSideDepth : thisSideDepth;

				if (toNextVec.length <= 17) {
					var bisec = toNextVec.normalize(localDepth);
					otherSide = !otherSide;
				} else if (toPrevVec.length <= 17) {
					var bisec = toPrevVec.normalize(localDepth);
				} else {
					toNextVec = toNextVec.normalize(localDepth);
					toPrevVec = toPrevVec.normalize(localDepth);
					var bisec = toNextVec.add(toPrevVec);
				}

				bisecs.push(bisec);
			}, this);

			for (var s in path.segments) {
				var newPoint = path.segments[s].point.add(bisecs[s]);
				if (path.contains(newPoint)) {
					path.segments[s].point = path.segments[s].point.add(bisecs[s]);
				} else {
					path.segments[s].point = path.segments[s].point.subtract(bisecs[s]);
				}
			}
		}

		function placeEndBolts(path, squareSide) {

			path.segments.forEach(function (segment) {
				var toNextVec = segment.next.point.subtract(segment.point),
				    toPrevVec = segment.previous.point.subtract(segment.point);

				if (toNextVec.length <= 17) {

					toNextVec = toNextVec.normalize(squareSide);
					toPrevVec = toPrevVec.normalize(squareSide);

					var toVec = segment.point.add(toNextVec).add(toPrevVec);

					var squarePath = new paper.Path.Rectangle(segment.point, toVec);
					squarePath.fillColor = '#30487e';
					squarePath.strokeColor = 'black';
					squarePath.strokeWidth = 2;

					drawFlash(squarePath.position, 14, 16);
				}
			}, this);
		}

		function drawFlash(center, width, height) {
			var point1 = new paper.Point(center.x - width / 3, center.y + height / 2),
			    point2 = new paper.Point(center.x + width / 2, center.y - height / 6),
			    point3 = new paper.Point(center.x + width / 12, center.y - height / 6),
			    point4 = new paper.Point(center.x + width / 3, center.y - height / 2),
			    point5 = new paper.Point(center.x - width / 6, center.y - height / 2),
			    point6 = new paper.Point(center.x - width / 2, center.y + height / 12),
			    point7 = new paper.Point(center.x - width / 6, center.y + height / 12);

			var pointArray = [point1, point2, point3, point4, point5, point6, point7];

			var flashPath = new paper.Path(pointArray);
			flashPath.closed = true;
			flashPath.fillColor = '#b5dbf8';
		}

		function findFramePoints(path) {
			var framePoints = [],
			    bisecs = [],
			    startIndex = undefined,
			    endIndex = undefined,
			    localDepth = 8;

			path.segments.forEach(function (segment, index) {
				var toNextVec = segment.next.point.subtract(segment.point),
				    toPrevVec = segment.previous.point.subtract(segment.point);

				if (toNextVec.length <= 17) {
					var bisec = toNextVec.normalize(localDepth);
					if (!startIndex) {
						startIndex = index;
					} else if (!endIndex) {
						endIndex = index;
					}
				} else if (toPrevVec.length <= 17) {
					var bisec = toPrevVec.normalize(localDepth);
				} else {
					toNextVec = toNextVec.normalize(localDepth);
					toPrevVec = toPrevVec.normalize(localDepth);
					var bisec = toNextVec.add(toPrevVec);
				}

				bisecs.push(bisec);
			}, this);

			for (var s in path.segments) {
				var newPoint = path.segments[s].point.add(bisecs[s]);
				if (Number(s) >= startIndex && Number(s) <= endIndex) {
					if (path.contains(newPoint)) {
						framePoints.push(newPoint);
					} else {
						framePoints.push(path.segments[s].point.subtract(bisecs[s]));
					}
				}
			}

			return framePoints;
		}

		var alignedFramePoints = findFramePoints(outerPath),
		    noOffsetFramePoints = alignedFramePoints.map(function (point) {
			return point.add(new paper.Point(-maxOffset, -maxOffset));
		}, this);

        paper.view.scale(1 / window.devicePixelRatio, new paper.Point(0, 0));

		paper.view.draw();

		this.state.textures.addCanvas(textureName, textureCanvas);

		//var spriteSheetName = 'wallTexture'+this.textureNameArray.length;

		this.textureArray.push(textureCanvas);
		this.textureNameArray.push(textureName);

		paper.project.remove();

		return { textureName: textureName, framePoints: noOffsetFramePoints };
	},

	generateGWall: function generateGWall(state, vertices, width, height) {
		this.state = state;

		var textureCanvas = document.createElement('canvas');

		textureCanvas.width = width/ window.devicePixelRatio;;
		textureCanvas.height = height/ window.devicePixelRatio;;

		var textureName = 'wallTexture' + this.textureNameArray.length;

		//var textureCanvas = this.state.textures.createCanvas(textureName, width, height);

		paper.setup(textureCanvas);

		var segments = vertices.map(function (vertex) {
			return new paper.Point(vertex[0], vertex[1]);
		}, this);

		segments.pop();

		var outerPath = new paper.Path(segments);
		outerPath.closed = true;
		outerPath.fillColor = 'red';

		var middlePath = outerPath.clone();
		extrude(middlePath, 5);
		middlePath.fillColor = '#97b4c3';

		insetEnds(outerPath, 7);

		var subtractedPath = outerPath.subtract(middlePath);
		subtractedPath.fillColor = '#623e2a';

		middlePath.opacity = 0.7;
		outerPath.opacity = 0;

		insetEnds(outerPath, 10);

		function insetEnds(path, depth) {
			var moves = [];

			path.segments.forEach(function (segment) {
				var toNextVec = segment.next.point.subtract(segment.point),
				    toPrevVec = segment.previous.point.subtract(segment.point);

				if (toNextVec.length <= 17) {
					var move = toPrevVec.normalize(depth);
				} else if (toPrevVec.length <= 17) {
					var move = toNextVec.normalize(depth);
				} else {
					var move = new paper.Point(0, 0);
				}
				moves.push(move);
			}, this);

			for (var s in path.segments) {
				path.segments[s].point = path.segments[s].point.add(moves[s]);
			}
		}

		function extrude(path, depth) {
			var bisecs = [];
			path.segments.forEach(function (segment) {
				var toNextVec = segment.next.point.subtract(segment.point),
				    toPrevVec = segment.previous.point.subtract(segment.point);

				if (toNextVec.length <= 17) {
					var bisec = toNextVec.normalize(depth);
				} else if (toPrevVec.length <= 17) {
					var bisec = toPrevVec.normalize(depth);
				} else {
					toNextVec = toNextVec.normalize(depth);
					toPrevVec = toPrevVec.normalize(depth);
					var bisec = toNextVec.add(toPrevVec);
				}

				bisecs.push(bisec);
			}, this);

			for (var s in path.segments) {
				var newPoint = path.segments[s].point.add(bisecs[s]);
				if (path.contains(newPoint)) {
					path.segments[s].point = path.segments[s].point.add(bisecs[s]);
				} else {
					path.segments[s].point = path.segments[s].point.subtract(bisecs[s]);
				}
			}
		}

		paper.view.draw();

        paper.view.scale(1 / window.devicePixelRatio, new paper.Point(0, 0));

		this.state.textures.addCanvas(textureName, textureCanvas);

		//var spriteSheetName = 'wallTexture'+this.textureNameArray.length;

		this.textureArray.push(textureCanvas);
		this.textureNameArray.push(textureName);

		paper.project.remove();

		return textureName;
	},

	generateFreeDoor: function generateFreeDoor(state, vertices, width, height) {
		this.state = state;

		var textureCanvas = document.createElement('canvas'),
		    offset = 5;

		textureCanvas.width = (width + 2 * offset)/ window.devicePixelRatio;;
		textureCanvas.height = (height + 2 * offset)/ window.devicePixelRatio;;

		var textureName = 'wallTexture' + this.textureNameArray.length;

		//var textureCanvas = this.state.textures.createCanvas(textureName, width, height);

		paper.setup(textureCanvas);

		/*var segments = vertices.map(function(vertex){
      return new paper.Point(vertex[0] + offset, vertex[1] + offset);
  }, this);
  	segments.pop();
  	var roundSegments = []
  	segments.forEach(function(segment, index, arr){
  	var nextPoint = (index < arr.length - 1) ? arr[Number(index) + 1]:arr[0],
  		prevPoint = (index > 0)? arr[Number(index) - 1]: arr[arr.length - 1];
  		var toNextVec = nextPoint.subtract(segment),
  		toPrevVec = prevPoint.subtract(segment);
  		toNextVec = toNextVec.normalize(6);
  	toPrevVec = toPrevVec.normalize(6);
  		roundSegments.push(segment.add(toPrevVec));
  	roundSegments.push(segment.add(toNextVec));
  }, this);
  	var wallPath = new paper.Path(roundSegments);
  wallPath.closed = true;
  	wallPath.segments.forEach(function(segment){
  	segment.handleIn = segment.previous.point.subtract(segment.point);
  	segment.handleOut = segment.next.point.subtract(segment.point);
  }, this);
  	wallPath.fillColor = '#ffcc5c';
  wallPath.strokeColor = '#b8974f';
  wallPath.strokeWidth = 2;*/

		var segments = vertices.map(function (vertex) {
			return new paper.Point(vertex[0] + offset, vertex[1] + offset);
		}, this);

		segments.pop();

		var outerPath = new paper.Path(segments);
		outerPath.closed = true;
		outerPath.fillColor = '#ffbd5c';
		outerPath.strokeColor = 'black';
		outerPath.strokeWidth = 2;

		var middlePath = outerPath.clone();
		extrude(middlePath, 5);
		middlePath.fillColor = '#cc8f5d';
		middlePath.strokeWidth = 0;

        paper.view.scale(1 / window.devicePixelRatio, new paper.Point(0, 0));

		paper.view.draw();

		this.state.textures.addCanvas(textureName, textureCanvas);

		//var spriteSheetName = 'wallTexture'+this.textureNameArray.length;

		this.textureArray.push(textureCanvas);
		this.textureNameArray.push(textureName);

		paper.project.remove();

		return textureName;

		function extrude(path, depth) {
			var bisecs = [];
			path.segments.forEach(function (segment) {
				var toNextVec = segment.next.point.subtract(segment.point),
				    toPrevVec = segment.previous.point.subtract(segment.point);

				/*if (toNextVec.length <= 17) {
        var bisec = toNextVec.normalize(depth);
    } else if (toPrevVec.length <= 17) {
        var bisec = toPrevVec.normalize(depth);
    } else {*/
				toNextVec = toNextVec.normalize(depth);
				toPrevVec = toPrevVec.normalize(depth);
				var bisec = toNextVec.add(toPrevVec);
				//}

				bisecs.push(bisec);
			}, this);

			for (var s in path.segments) {
				var newPoint = path.segments[s].point.add(bisecs[s]);
				if (path.contains(newPoint)) {
					path.segments[s].point = path.segments[s].point.add(bisecs[s]);
				} else {
					path.segments[s].point = path.segments[s].point.subtract(bisecs[s]);
				}
			}
		}
	},

	generateButtonDoor: function generateButtonDoor(state, vertices, width, height) {
		this.state = state;

		var textureCanvas = document.createElement('canvas');

		textureCanvas.width = width;
		textureCanvas.height = height;

		var textureName = 'wallTexture' + this.textureNameArray.length;

		//var textureCanvas = this.state.textures.createCanvas(textureName, width, height);

		paper.setup(textureCanvas);

		var segments = vertices.map(function (vertex) {
			return new paper.Point(vertex[0], vertex[1]);
		}, this);

		segments.pop();

		var outerPath = new paper.Path(segments);
		outerPath.closed = true;
		outerPath.fillColor = 'red';

		var middlePath = outerPath.clone();
		extrude(middlePath, 5);
		middlePath.fillColor = '#97b4c3';

		insetEnds(outerPath, 7);

		var subtractedPath = outerPath.subtract(middlePath);
		subtractedPath.fillColor = '#ff3163';

		middlePath.opacity = 0.7;
		outerPath.opacity = 0;

		insetEnds(outerPath, 10);

		function insetEnds(path, depth) {
			var moves = [];

			path.segments.forEach(function (segment) {
				var toNextVec = segment.next.point.subtract(segment.point),
				    toPrevVec = segment.previous.point.subtract(segment.point);

				if (toNextVec.length <= 17) {
					var move = toPrevVec.normalize(depth);
				} else if (toPrevVec.length <= 17) {
					var move = toNextVec.normalize(depth);
				} else {
					var move = new paper.Point(0, 0);
				}
				moves.push(move);
			}, this);

			for (var s in path.segments) {
				path.segments[s].point = path.segments[s].point.add(moves[s]);
			}
		}

		function extrude(path, depth) {
			var bisecs = [];
			path.segments.forEach(function (segment) {
				var toNextVec = segment.next.point.subtract(segment.point),
				    toPrevVec = segment.previous.point.subtract(segment.point);

				if (toNextVec.length <= 17) {
					var bisec = toNextVec.normalize(depth);
				} else if (toPrevVec.length <= 17) {
					var bisec = toPrevVec.normalize(depth);
				} else {
					toNextVec = toNextVec.normalize(depth);
					toPrevVec = toPrevVec.normalize(depth);
					var bisec = toNextVec.add(toPrevVec);
				}

				bisecs.push(bisec);
			}, this);

			for (var s in path.segments) {
				var newPoint = path.segments[s].point.add(bisecs[s]);
				if (path.contains(newPoint)) {
					path.segments[s].point = path.segments[s].point.add(bisecs[s]);
				} else {
					path.segments[s].point = path.segments[s].point.subtract(bisecs[s]);
				}
			}
		}

        paper.view.scale(1 / window.devicePixelRatio, new paper.Point(0, 0));

		paper.view.draw();

		this.state.textures.addCanvas(textureName, textureCanvas);

		//var spriteSheetName = 'wallTexture'+this.textureNameArray.length;

		this.textureArray.push(textureCanvas);
		this.textureNameArray.push(textureName);

		paper.project.remove();

		return textureName;
	},

	clearTextures: function clearTextures() {
		//console.log('clear textures called');
		this.texturesBin = this.textureNameArray.slice();
		this.textureArray = [];
		this.textureNameArray = [];
	},

	clearBin: function clearBin() {
		//console.log('clear bin called');
		//console.log(this.texturesBin);
		this.texturesBin.forEach(function (textureName) {
			//console.log(textureName);
			this.state.textures.remove(textureName);
		}, this);
		this.texturesBin = [];
	}

};

module.exports = wallGenerator;

/***/ })

},[474]);