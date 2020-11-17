webpackJsonp([0],{

/***/ 117:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EITypeDict = __webpack_require__(18);

var Block = exports.Block = function (_Phaser$GameObjects$S) {
    _inherits(Block, _Phaser$GameObjects$S);

    function Block(scene, coordX, coordY, field) {
        _classCallCheck(this, Block);

        var _this = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, scene, coordX, coordY, 'block', 'out'));

        scene.add.existing(_this);

        _this.scene = scene;
        _this.field = field;
        _this.inPit = false;
        _this.inPast = false;
        _this.inWater = false;
        _this.currentWaterTile;
        _this.exploded = false;
        _this.movePriority = 1000;
        _this.movable;
        _this.mover;
        _this.currentDirection = _this.scene.actions.stay;
        _this.eIType = EITypeDict.block;

        _this.moveStory = {};
        _this.statusStory = {};
        _this.plannedCoord = new Phaser.Math.Vector2(coordX, coordY);

        _this.setDepth(2);
        return _this;
    }

    _createClass(Block, [{
        key: 'checkActiveStatus',
        value: function checkActiveStatus() {
            return !(this.inPit || this.inPast || this.exploded);
        }
    }, {
        key: 'move',
        value: function move(turnNum) {
            if (this.checkActiveStatus()) {
                switch (this.currentDirection) {
                    case this.scene.actions.left:
                        this.plannedCoord.x = this.x - this.field.cellWidth;
                        this.plannedCoord.y = this.y;
                        break;
                    case this.scene.actions.right:
                        this.plannedCoord.x = this.x + this.field.cellWidth;
                        this.plannedCoord.y = this.y;
                        break;
                    case this.scene.actions.up:
                        this.plannedCoord.x = this.x;
                        this.plannedCoord.y = this.y - this.field.cellHeight;
                        break;
                    case this.scene.actions.down:
                        this.plannedCoord.x = this.x;
                        this.plannedCoord.y = this.y + this.field.cellHeight;
                        break;
                    case this.scene.actions.stay:
                        this.plannedCoord.x = this.x;
                        this.plannedCoord.y = this.y;
                        break;
                }
            }
        }
    }, {
        key: 'constructMoveTween',
        value: function constructMoveTween() {
            this.moveStory[this.scene.turnNum] = this.currentDirection;

            var moveTween = this.scene.tweens.add({
                targets: this,
                props: {
                    x: { value: this.plannedCoord.x, ease: 'Linear' },
                    y: { value: this.plannedCoord.y, ease: 'Linear' }
                },
                duration: 200
            });

            if (this.currentDirection != this.scene.actions.stay && (this.eIType === EITypeDict.block || this.eIType === EITypeDict.phantomBlock)) {
                if (!this.scene.game.soundPaused && !this.inWater) {
                    this.scene.blockSound.play();
                }
            }
        }
    }, {
        key: 'constructBackTween',
        value: function constructBackTween(inBackTime, fast) {
            if (this.scene.turnNum in this.moveStory) {
                var undoMove = this.moveStory[this.scene.turnNum],
                    backPoint;

                switch (undoMove) {
                    case this.scene.actions.left:
                        backPoint = { x: this.x + this.field.cellWidth, y: this.y };
                        break;
                    case this.scene.actions.right:
                        backPoint = { x: this.x - this.field.cellWidth, y: this.y };
                        break;
                    case this.scene.actions.up:
                        backPoint = { x: this.x, y: this.y + this.field.cellHeight };
                        break;
                    case this.scene.actions.down:
                        backPoint = { x: this.x, y: this.y - this.field.cellHeight };
                        break;
                    case this.scene.actions.stay:
                        backPoint = { x: this.x, y: this.y };
                        break;
                }

                this.plannedCoord = new Phaser.Math.Vector2(backPoint.x, backPoint.y);

                var backTween = this.scene.tweens.add({
                    targets: this,
                    props: {
                        x: { value: this.plannedCoord.x, ease: 'Linear' },
                        y: { value: this.plannedCoord.y, ease: 'Linear' }
                    },
                    duration: fast ? 10 : 100
                });

                if (!inBackTime) delete this.moveStory[this.scene.turnNum];
            }
        }
    }, {
        key: 'undoStatusChange',
        value: function undoStatusChange(inBackTime) {
            if (this.scene.turnNum in this.statusStory) {
                var undoStatus = this.statusStory[this.scene.turnNum];

                switch (undoStatus) {
                    case this.scene.actions.putInPit:
                        this.getFromPit();
                        break;
                    case this.scene.actions.explode:
                        break;
                    case this.scene.actions.putInWater:
                        this.getFromWater();
                        break;
                    case this.scene.actions.sendToPast:
                        this.getFromPast();
                        if (inBackTime) this.producePhantom();
                        break;
                }

                if (!inBackTime) delete this.statusStory[this.scene.turnNum];
            }
        }
    }, {
        key: 'putInPit',
        value: function putInPit(turnNum) {
            this.inPit = true;
            this.setFrame('in');
            this.statusStory[turnNum] = this.scene.actions.putInPit;
        }
    }, {
        key: 'getFromPit',
        value: function getFromPit() {
            this.inPit = false;
            this.setFrame('out');
        }
    }, {
        key: 'putInWater',
        value: function putInWater(turnNum) {
            this.setFrame('in');
            if (!this.inWater) this.statusStory[turnNum] = this.scene.actions.putInWater;
            this.inWater = true;
        }
    }, {
        key: 'getFromWater',
        value: function getFromWater() {
            this.inWater = false;
            this.currentWaterTile.undoAction();
            this.currentWaterTile = undefined;
            this.setFrame('out');
        }
    }, {
        key: 'sendToPast',
        value: function sendToPast(turnNum) {
            this.inPast = true;
            this.alpha = 0;
            this.statusStory[turnNum] = this.scene.actions.sendToPast;
        }
    }, {
        key: 'getFromPast',
        value: function getFromPast() {
            this.inPast = false;
            this.alpha = 1;
        }
    }, {
        key: 'producePhantom',
        value: function producePhantom() {
            this.scene.producePhantom(this);
            this.moveStory = {};
            this.statusStory = {};
        }
    }, {
        key: 'demolish',
        value: function demolish() {
            this.exploded = true;
            this.setAlpha(0);
        }
    }, {
        key: 'reviveAfterDemolish',
        value: function reviveAfterDemolish() {
            this.exploded = false;
            this.setAlpha(1);
        }
    }, {
        key: 'shiftPosition',
        value: function shiftPosition(deltaX, deltaY) {
            this.x += deltaX;
            this.y += deltaY;
            this.plannedCoord.x += deltaX;
            this.plannedCoord.y += deltaY;
        }
    }, {
        key: 'defineAction',
        value: function defineAction(turnNum, moversList) {
            if (this.mover) {
                moversList.push(this.mover);
                if (this.mover.eIType === EITypeDict.phantom) {
                    return { action: this.mover.defineAction(turnNum), moversList: moversList,
                        priority: this.mover.movePriority };
                } else {
                    return this.mover.defineAction(turnNum, moversList);
                }
            }

            return false;
        }
    }]);

    return Block;
}(Phaser.GameObjects.Sprite);

module.exports = Block;

/***/ }),

/***/ 1434:
/***/ (function(module, exports) {

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
        }
    }, {
        key: 'create',
        value: function create() {
            var gameWidth = this.game.config.width,
                gameHeight = this.game.config.height;
        }
    }, {
        key: 'scaleAndPositionUI',
        value: function scaleAndPositionUI() {}
    }, {
        key: 'update',
        value: function update() {
            this.scene.start('PreloaderScene');
        }
    }]);

    return BootScene;
}(Phaser.Scene);

/***/ }),

/***/ 1435:
/***/ (function(module, exports) {

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
            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height,
                UIScale = Math.min(this.game.scale.width / 800, this.game.scale.height / 600);

            this.preloaderBack = this.add.image(gameWidth / 2 - 150, gameHeight * 0.8, 'preloaderBack').setOrigin(0, 0.5);

            this.preloaderBar = this.add.image(gameWidth / 2 - 150, gameHeight * 0.8, 'preloaderBar').setOrigin(0, 0.5);
            this.preloaderBar.setCrop(0, 0, 0, 40);

            this.load.on('progress', function (value) {
                this.preloaderBar.setCrop(0, 0, 300 * value, 40);
            }, this);

            this.cameras.main.setBackgroundColor('#101e28');

            // load assets

            this.load.atlas('startButton', 'assets/startButton.png', 'assets/startButton.json');
            this.load.atlas('block', 'assets/block.png', 'assets/block.json');
            this.load.atlas('bomb', 'assets/bomb.png', 'assets/bomb.json');
            this.load.atlas('spirit', 'assets/spirit.png', 'assets/spirit.json');
            this.load.atlas('executioner', 'assets/executioner.png', 'assets/executioner.json');
            this.load.atlas('pikes', 'assets/pikes.png', 'assets/pikes.json');
            this.load.atlas('pikesButton', 'assets/pikesButton.png', 'assets/pikesButton.json');
            this.load.atlas('wall', 'assets/wall.png', 'assets/wall.json');
            this.load.atlas('wallButton', 'assets/wallButton.png', 'assets/wallButton.json');
            this.load.atlas('plain', 'assets/plain.png', 'assets/plain.json');
            this.load.atlas('timePort', 'assets/timePort.png', 'assets/timePort.json');
            this.load.atlas('edge', 'assets/edge.png', 'assets/edge.json');
            this.load.atlas('water', 'assets/water.png', 'assets/water.json');
            this.load.atlas('phantomTile', 'assets/phantomTile.png', 'assets/phantomTile.json');
            this.load.atlas('phantom', 'assets/phantom.png', 'assets/phantom.json');
            this.load.atlas('phantomBlock', 'assets/phantomBlock.png', 'assets/phantomBlock.json');
            this.load.atlas('phantomSpirit', 'assets/phantomSpirit.png', 'assets/phantomSpirit.json');
            this.load.atlas('opening', 'assets/opening.png', 'assets/opening.json');
            this.load.atlas('closing', 'assets/closing.png', 'assets/closing.json');
            this.load.atlas('exclamationSign', 'assets/exclamationSign.png', 'assets/exclamationSign.json');

            // UI buttons
            this.load.atlas('downButton', 'assets/downButton.png', 'assets/downButton.json');
            this.load.atlas('leftButton', 'assets/leftButton.png', 'assets/leftButton.json');
            this.load.atlas('muteButton', 'assets/muteButton.png', 'assets/muteButton.json');
            this.load.atlas('replayButton', 'assets/replayButton.png', 'assets/replayButton.json');
            this.load.atlas('rightButton', 'assets/rightButton.png', 'assets/rightButton.json');
            this.load.atlas('stayButton', 'assets/stayButton.png', 'assets/stayButton.json');
            this.load.atlas('undoButton', 'assets/undoButton.png', 'assets/undoButton.json');
            this.load.atlas('upButton', 'assets/upButton.png', 'assets/upButton.json');
            this.load.atlas('startButton', 'assets/startButton.png', 'assets/startButton.json');
            this.load.atlas('levelButton', 'assets/levelButton.png', 'assets/levelButton.json');
            this.load.atlas('levelUpButton', 'assets/levelUpButton.png', 'assets/levelUpButton.json');
            this.load.atlas('levelDownButton', 'assets/levelDownButton.png', 'assets/levelDownButton.json');
            this.load.atlas('homeButton', 'assets/homeButton.png', 'assets/homeButton.json');
            this.load.atlas('speedUpButton', 'assets/speedUpButton.png', 'assets/speedUpButton.json');
            this.load.atlas('skipButton', 'assets/skipButton.png', 'assets/skipButton.json');

            this.load.image('rock', 'assets/rock.png');
            this.load.image('background', 'assets/background.png');
            this.load.image('pit', 'assets/pit.png');
            this.load.image('leaf', 'assets/leaf.png');
            this.load.image('turnClock', 'assets/turnClock.png');
            this.load.image('clockBack', 'assets/clockBack.png');
            this.load.image('noWay', 'assets/noWay.png');
            this.load.image('lock', 'assets/lock.png');
            this.load.image('openingFront', 'assets/openingFront.png');
            this.load.image('openingBack', 'assets/openingBack.png');
            this.load.image('mainMenuParticle', 'assets/mainMenuParticle.png');
            this.load.image('closingFront', 'assets/closingFront.png');
            this.load.image('closingFrontFlowers', 'assets/closingFrontFlowers.png');

            this.load.audio('blockMoveSound', 'assets/sound/blockMove.mp3');
            this.load.audio('breathInSound', 'assets/sound/breathIn.mp3');
            this.load.audio('breathOutSound', 'assets/sound/breathOut.mp3');
            this.load.audio('bumpSound', 'assets/sound/bump.mp3');
            this.load.audio('buttonSound', 'assets/sound/button.mp3');
            this.load.audio('strawDrink', 'assets/sound/strawDrink.mp3');
            this.load.audio('nightSound', 'assets/sound/night.mp3');
            this.load.audio('sandSound', 'assets/sound/sand.mp3');
            this.load.audio('violinSound', 'assets/sound/violin.mp3');
            this.load.audio('wallMoveSound', 'assets/sound/wallMove.mp3');
            this.load.audio('ghostSound', 'assets/sound/ghost.mp3');

            this.load.bitmapFont('basicFont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');
            this.load.bitmapFont('insomniaFont', 'assets/fonts/insomniaFont.png', 'assets/fonts/insomniaFont.fnt');

            for (var i = 1; i <= 48; i++) {
                this.load.json('level' + i, 'assets/levels/stLevel' + i + '.json');
            }
        }
    }, {
        key: 'create',
        value: function create() {

            this.scene.start('MainMenuScene');
        }
    }, {
        key: 'update',
        value: function update() {}
    }, {
        key: 'scaleAndPosition',
        value: function scaleAndPosition() {
            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height,
                scale = Math.min(gameWidth / 800, gameHeight / 600);

            this.preloaderBar.setPosition(gameWidth / 2 - 150 * scale, gameHeight * 0.8);
            this.preloaderBack.setPosition(gameWidth / 2 - 150 * scale, gameHeight * 0.8);
        }
    }]);

    return PreloaderScene;
}(Phaser.Scene);

/***/ }),

/***/ 1436:
/***/ (function(module, exports) {

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
        key: 'preload',
        value: function preload() {
            //this.customPipeline = this.game.renderer.addPipeline('Custom1', new CustomPipeline(this.game));
        }
    }, {
        key: 'create',
        value: function create() {

            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height;

            this.background = this.add.sprite(gameWidth * 0.5, gameHeight * 0.55, 'opening');
            this.background.setDepth(3);

            var openingFramesNames = this.anims.generateFrameNames('opening', { start: 1, end: 10 });
            this.backgroundAnimation = this.anims.create({ key: 'backgroundAnimation', frames: openingFramesNames,
                frameRate: 15, repeat: -1 });

            this.background.play('backgroundAnimation');

            this.backgroundFront = this.add.image(gameWidth * 0.5, gameHeight * 0.5, 'openingFront');
            this.backgroundFront.setDepth(2);

            this.backgroundBack = this.add.image(gameWidth * 0.5, gameHeight * 0.5, 'openingBack');
            this.backgroundBack.setDepth(0);

            this.logo = this.add.bitmapText(this.background.getBottomRight().x - 20, 10, 'insomniaFont', 'Gnome of Time\nGarden', 100, 2);
            this.logo.setOrigin(1, 0);
            this.logo.setDepth(4);

            // particle emitter
            if (this.game.device.os.desktop) {
                this.backParticles = this.add.particles('mainMenuParticle').setDepth(1).setScale(0.5);

                this.backEmitter = this.backParticles.createEmitter({
                    x: -10,
                    y: -10,
                    lifespan: 7000,
                    speed: { min: 100, max: 150 },
                    radial: true,
                    angle: { min: 0, max: 90 },
                    frequency: 400,
                    rotate: { min: 50, max: 180 }
                });
            }

            this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.spaceKey.once('down', function () {
                this.startGame();
            }, this);

            // sound and sfx

            this.game.buttonSound = this.sound.add('buttonSound', { volume: 0.5 });
            this.game.backgroundMusic = this.sound.add('nightSound', { volume: 0.1 });
            this.violinSound = this.sound.add('violinSound', { volume: 0.5 });

            this.game.backgroundMusic.play('', { loop: true });
            this.violinSound.play();

            this.game.soundPaused = false;

            // mobile buttons

            if (!this.game.device.os.desktop) {
                this.startButton = this.makeButton(gameWidth * 0.5, gameHeight * 0.97, 'startButton', '', this.startGame);
                this.startButton.setOrigin(0.5, 1);

                this.muteButton = this.makeMuteButton(gameWidth * 0.98, gameHeight * 0.97, 'muteButton');
                this.muteButton.setOrigin(1, 1);

                this.scaleAndPosition();
            } else {
                var spaceText = this.add.bitmapText(gameWidth * 0.5, gameHeight * 0.97, 'basicFont', 'Press SPACE to start', 30);
                spaceText.setOrigin(0.5, 1);
                spaceText.setDepth(4);
                this.tweens.add({
                    targets: spaceText,
                    props: {
                        alpha: { value: 0, ease: 'Linear' }
                    },
                    duration: 1000,
                    repeat: -1,
                    yoyo: true
                });
            }

            // get player progress
            if (localStorage.getItem('execInsomniaSaveData') === null) {
                // TODO change back to 1
                this.game.lastAvailLevel = 1;
                this.game.saveData = { lastLevel: this.game.lastAvailLevel };
                localStorage.setItem('execInsomniaSaveData', JSON.stringify(this.game.saveData));
            } else {
                this.game.saveData = JSON.parse(localStorage.getItem('execInsomniaSaveData'));
                this.game.lastAvailLevel = this.game.saveData.lastLevel;
            }
        }
    }, {
        key: 'makeButton',
        value: function makeButton(posX, posY, imageKey, text, callback) {
            var button = this.add.image(posX, posY, imageKey, 'out').setInteractive();
            button.setDepth(101);
            button.on('pointerdown', function () {
                callback.call(this);
                button.setFrame('down');
                if (!this.game.soundPaused) {
                    this.game.buttonSound.play();
                }
            }, this);
            button.on('pointerup', function () {
                button.setFrame('out');
            }, this);
            button.label = this.add.bitmapText(button.x, button.y, 'basicFont', text, 16);
            button.label.setDepth(102);
            button.label.setOrigin(0.5);
            return button;
        }
    }, {
        key: 'makeMuteButton',
        value: function makeMuteButton(posX, posY, imageKey) {

            if (this.game.soundPaused) {
                var startFrame = 'offOut';
            } else {
                var startFrame = 'onOut';
            }

            var button = this.add.image(posX, posY, imageKey, startFrame).setInteractive();
            button.setDepth(101);

            button.on('pointerdown', function () {
                if (this.game.soundPaused) {
                    button.setFrame('onDown');
                } else {
                    this.game.buttonSound.play();
                    button.setFrame('offDown');
                }
            }, this);

            button.on('pointerup', function () {
                if (this.game.soundPaused) {
                    this.game.soundPaused = false;
                    this.sound.resumeAll();
                    button.setFrame('onOut');
                } else {
                    this.game.soundPaused = true;
                    this.sound.pauseAll();
                    button.setFrame('offOut');
                }
            }, this);

            return button;
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            if (typeof parent.cmgGameEvent === 'function') parent.cmgGameEvent('start');
            if (this.game.lastAvailLevel > 1) this.scene.start('LevelChoiceScene');else {
                this.game.currentLevelNum = 1;
                this.game.totalLevels = 49;
                this.scene.start('PlayScene');
            }
        }
    }, {
        key: 'scaleAndPosition',
        value: function scaleAndPosition() {
            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height,
                scale = Math.min(gameWidth / 800, gameHeight / 600);

            this.background.setPosition(gameWidth * 0.5, gameHeight * 0.55);
            this.background.setScale(scale);

            this.backgroundFront.setPosition(gameWidth * 0.5, gameHeight * 0.5);
            this.backgroundFront.setScale(scale);

            this.backgroundBack.setPosition(gameWidth * 0.5, gameHeight * 0.5);
            this.backgroundBack.setScale(scale);

            if (this.backParticles) {
                this.backParticles.setScale(scale * 0.5);
                this.backEmitter.setPosition(this.backgroundBack.getTopLeft().x / (scale * 0.5), this.backgroundBack.getTopLeft().y / (scale * 0.5));
            }

            if (gameWidth <= gameHeight) {
                this.startButton.setPosition(gameWidth * 0.5, gameHeight * 0.97);
                this.startButton.setScale(scale);
            } else {
                this.startButton.setPosition(gameWidth - 100 * scale, gameHeight * 0.5 + 100 * scale);
                this.startButton.setScale(scale);
            }

            if (gameWidth <= gameHeight) {
                this.logo.setPosition(this.background.getBottomRight().x - 20 * scale, this.background.getTopLeft().y + 10 * scale);
                this.logo.setScale(scale);
            } else {

                if (this.background.getBottomRight().x - 20 * scale < this.startButton.getTopLeft().x) {
                    this.logo.setPosition(this.background.getBottomRight().x - 20 * scale, this.background.getTopLeft().y + 10 * scale);
                    this.logo.setScale(scale);
                } else {
                    this.logo.setPosition(this.startButton.getTopLeft().x - 10 * scale, this.background.getTopLeft().y + 10 * scale);
                    this.logo.setScale(scale);
                }
            }

            this.muteButton.setPosition(gameWidth * 0.98, gameHeight * 0.97);
            this.muteButton.setScale(scale);
        }
    }]);

    return MainMenuScene;
}(Phaser.Scene);

/***/ }),

/***/ 1437:
/***/ (function(module, exports) {

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

            var gameWidth = this.scale.width,
                gameHeight = this.scale.height;

            this.game.totalLevels = 48;

            this.buttonsGroup = this.add.group();
            this.buttonsSignesGroup = this.add.group();

            this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

            this.cameras.main.setBackgroundColor('#101e28');

            if (this.game.device.os.desktop) {

                var numOfButtonsInRow = 8,
                    numOfButtonsInColumn = 8,
                    betweenButtonsDistanceH = gameWidth / (numOfButtonsInRow + 0.5),
                    betweenButtonsDistanceV = gameWidth / (numOfButtonsInColumn + 1);

                for (var i = 1; i <= this.game.totalLevels; i++) {
                    var posX = ((i - 1) % numOfButtonsInRow + 0.75) * betweenButtonsDistanceH,
                        posY = (Math.floor((i - 1) / numOfButtonsInRow) + 0.5) * betweenButtonsDistanceV + gameHeight * 0.05;

                    var button = this.makeButton(posX, posY, 'levelButton', i, this.launchLevel);
                    this.buttonsGroup.add(button);

                    if (i > this.game.lastAvailLevel) {
                        button.disableInteractive();
                        var lockImage = this.add.image(posX, posY, 'lock');
                        lockImage.setDepth(103);
                        this.buttonsSignesGroup.add(lockImage);
                    }
                }

                this.topButtonPos = 0.5 * betweenButtonsDistanceV + gameHeight * 0.05;
                this.bottomButtonPos = (Math.floor(47 / numOfButtonsInRow) + 0.5) * betweenButtonsDistanceV + gameHeight * 0.05;

                // scroll to last availiable level
                var distanceToLast = this.bottomButtonPos - (Math.floor((this.game.lastAvailLevel - 1) / numOfButtonsInRow) + 0.5) * betweenButtonsDistanceV - gameHeight * 0.05;
                if (distanceToLast < 0) this.scrollLevelsList(distanceToLast);
            } else {

                var numOfButtonsInRow, numOfButtonsInColumn;

                if (gameHeight > gameWidth) {

                    numOfButtonsInRow = 4;
                    numOfButtonsInColumn = 9;
                } else {

                    numOfButtonsInRow = 9;
                    numOfButtonsInColumn = 4;
                }

                var betweenButtonsDistanceH = gameWidth / numOfButtonsInRow,
                    betweenButtonsDistanceV = gameHeight / numOfButtonsInColumn,
                    outerSide = Math.min(betweenButtonsDistanceH, betweenButtonsDistanceV),
                    innerSide = outerSide - 10,
                    scale = innerSide / 70;

                for (var i = 1; i <= this.game.totalLevels; i++) {
                    var posX = ((i - 1) % numOfButtonsInRow + 0.5) * betweenButtonsDistanceH,
                        posY = (Math.floor((i - 1) / numOfButtonsInRow) + 0.5) * betweenButtonsDistanceV;

                    var button = this.makeButton(posX, posY, 'levelButton', i, this.launchLevel);
                    button.setScale(scale);
                    button.buttonLabel.setScale(scale);

                    this.buttonsGroup.add(button);

                    if (i > this.game.lastAvailLevel) {
                        button.disableInteractive();
                        var lockImage = this.add.image(posX, posY, 'lock');
                        lockImage.setDepth(103);
                        lockImage.setScale(scale);
                        button.lockImage = lockImage;
                        this.buttonsSignesGroup.add(lockImage);
                    }
                }
                this.topButtonPos = 0.5 * betweenButtonsDistanceH;
                this.bottomButtonPos = (Math.floor(35 / numOfButtonsInRow) + 0.5) * betweenButtonsDistanceV;

                // scroll to last availiable level
                var distanceToLast = this.bottomButtonPos - (Math.floor((this.game.lastAvailLevel - 1) / numOfButtonsInRow) + 0.5) * betweenButtonsDistanceV;
                if (distanceToLast < 0) this.scrollLevelsList(distanceToLast);
            }

            this.cameras.resize(gameWidth, gameHeight);

            // scroll for mobile devices
            if (!this.game.device.os.desktop) {
                var scroll,
                    lastY,
                    inScroll = false;

                this.input.on('pointerdown', function (pointer) {
                    inScroll = true;
                    lastY = pointer.y;
                }, this);

                this.input.on('pointerup', function (pointer) {
                    inScroll = false;
                }, this);

                this.input.on('pointermove', function (pointer) {
                    if (inScroll) {
                        var movementY = pointer.y - lastY;
                        lastY = pointer.y;
                        this.scrollLevelsList(movementY);
                    }
                }, this);
            }

            // manage sound paused
            if (this.game.soundPaused) {
                this.sound.pauseAll();
            }
        }
    }, {
        key: 'makeButton',
        value: function makeButton(posX, posY, imageKey, text, callback) {

            var button = this.add.image(posX, posY, imageKey, 'out').setInteractive();
            button.setDepth(101);
            button.levelNumber = text;
            button.on('pointerdown', function () {
                button.setFrame('down');
                if (!this.game.soundPaused) {
                    this.game.buttonSound.play();
                }
                this.time.delayedCall(200, function () {
                    callback.call(this, button.levelNumber);
                }, [], this);
            }, this);
            button.on('pointerup', function () {
                button.setFrame('out');
            }, this);
            button.buttonLabel = this.add.bitmapText(button.x, button.y, 'basicFont', '' + text, 32);
            button.buttonLabel.setDepth(102);
            button.buttonLabel.setOrigin(0.5, 0.5);
            return button;
        }
    }, {
        key: 'scaleAndPosition',
        value: function scaleAndPosition() {

            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height;

            var numOfButtonsInRow, numOfButtonsInColumn;

            if (gameHeight > gameWidth) {

                numOfButtonsInRow = 4;
                numOfButtonsInColumn = 9;
            } else {

                numOfButtonsInRow = 9;
                numOfButtonsInColumn = 4;
            }

            var betweenButtonsDistanceH = gameWidth / numOfButtonsInRow,
                betweenButtonsDistanceV = gameHeight / numOfButtonsInColumn,
                outerSide = Math.min(betweenButtonsDistanceH, betweenButtonsDistanceV),
                innerSide = outerSide - 10,
                scale = innerSide / 70;

            for (var i = 1; i <= this.game.totalLevels; i++) {
                var posX = ((i - 1) % numOfButtonsInRow + 0.5) * betweenButtonsDistanceH,
                    posY = (Math.floor((i - 1) / numOfButtonsInRow) + 0.5) * betweenButtonsDistanceV;

                var button = this.buttonsGroup.getChildren()[i - 1];

                button.setPosition(posX, posY);
                button.setScale(scale);

                button.buttonLabel.setPosition(posX, posY);
                button.buttonLabel.setScale(scale);

                if (button.lockImage) {
                    button.lockImage.setPosition(posX, posY);
                    button.lockImage.setScale(scale);
                }
            }
            this.topButtonPos = 0.5 * betweenButtonsDistanceH;
            this.bottomButtonPos = (Math.floor(35 / numOfButtonsInRow) + 0.5) * betweenButtonsDistanceV;
            // scroll to last availiable level
            var distanceToLast = this.bottomButtonPos - (Math.floor((this.game.lastAvailLevel - 1) / numOfButtonsInRow) + 0.5) * betweenButtonsDistanceV;
            if (distanceToLast < 0) this.scrollLevelsList(distanceToLast);

            this.cameras.resize(gameWidth, gameHeight);
        }
    }, {
        key: 'scrollLevelsList',
        value: function scrollLevelsList(delta) {

            var availableDelta = delta > 0 ? Math.min(this.topButtonPos - this.buttonsGroup.getChildren()[0].y, delta) : Math.max(this.bottomButtonPos - this.buttonsGroup.getChildren()[this.game.totalLevels - 1].y, delta);

            if (availableDelta != 0) {
                this.buttonsGroup.children.iterate(function (button) {
                    button.y += availableDelta;
                    button.buttonLabel.y += availableDelta;
                }, this);

                this.buttonsSignesGroup.children.iterate(function (sign) {
                    sign.y += availableDelta;
                }, this);
            }
        }
    }, {
        key: 'launchLevel',
        value: function launchLevel(levelNumber) {
            this.game.currentLevelNum = levelNumber;

            this.scene.start('PlayScene');
        }
    }, {
        key: 'update',
        value: function update(time, delta) {
            if (this.downKey.isDown && !this.upKey.isDown) {
                this.scrollLevelsList(-2);
            } else if (!this.downKey.isDown && this.upKey.isDown) {
                this.scrollLevelsList(2);
            }
        }
    }]);

    return LevelChoiceScene;
}(Phaser.Scene);

/***/ }),

/***/ 1438:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Block = __webpack_require__(117);
var Bomb = __webpack_require__(254);
var Executioner = __webpack_require__(255);
var Field = __webpack_require__(1439);
var Phantom = __webpack_require__(533);
var PhantomBlock = __webpack_require__(534);
var PhantomBomb = __webpack_require__(535);
var PhantomSpirit = __webpack_require__(536);
var Pikes = __webpack_require__(537);
var PikesButton = __webpack_require__(538);
var Pit = __webpack_require__(539);
var Rock = __webpack_require__(540);
var Spirit = __webpack_require__(256);
var Tile = __webpack_require__(40);
var TimePort = __webpack_require__(541);
var Wall = __webpack_require__(542);
var WallButton = __webpack_require__(543);
var LeafFactory = __webpack_require__(1442);
var EITypeDict = __webpack_require__(18);

var PlayScene = exports.PlayScene = function (_Phaser$Scene) {
    _inherits(PlayScene, _Phaser$Scene);

    function PlayScene() {
        _classCallCheck(this, PlayScene);

        return _possibleConstructorReturn(this, (PlayScene.__proto__ || Object.getPrototypeOf(PlayScene)).call(this, 'PlayScene'));
    }

    _createClass(PlayScene, [{
        key: 'create',
        value: function create() {
            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height;

            this.modes = { playerTurn: 1, moveCalc: 2, moving: 3, pause: 4, backCalc: 5, movingBack: 6, tilesActions: 7,
                moveTweenConstruction: 8, nextTurnTransition: 9, backTurnTransition: 10, backTilesActions: 11,
                moveBackTweenConstruction: 12, undoMove: 13, timedActions: 14, undoTimedActions: 15, finalAnimation: 16,
                startingAnimation: 17 };
            this.currentMode = this.modes.startingAnimation;

            this.actions = { stay: 1, left: 2, right: 3, up: 4, down: 5, putInPit: 6, sendToPast: 7, explode: 8,
                fillPit: 9, getOut: 10, push: 11, putInWater: 12, getDown: 13, unPush: 14, pike: 15 };

            this.playing = true;
            this.turnNum = 1;
            // cameras
            this.cameras.main.setScroll(-10000, -10000);
            this.fieldCamera = this.cameras.add(0, 0, gameWidth, gameHeight);
            this.fieldCamera.setScroll(0, 0);
            this.HUDCamera = this.cameras.add(0, 0, gameWidth, gameHeight);
            this.HUDCamera.setScroll(10000, 10000);

            // setting background
            this.background = this.add.image(gameWidth * 0.5 - 10000, -10000, 'background');
            this.background.setOrigin(0.5, 0);

            // generate field of current level        
            this.currentLevelName = 'level' + this.game.currentLevelNum;
            this.currentLevel = this.cache.json.get(this.currentLevelName);

            var rows = Object.keys(this.currentLevel).length,
                columns = Object.keys(this.currentLevel[0]).length;

            this.field = new Field(this, columns, rows, 40, 40, this.currentLevel);

            // set controls
            this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
            this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.uKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
            this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
            this.mKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

            this.leftKey.on('down', function () {
                this.moveExecutioner(this.actions.left);
            }, this);
            this.aKey.on('down', function () {
                this.moveExecutioner(this.actions.left);
            }, this);

            this.rightKey.on('down', function () {
                this.moveExecutioner(this.actions.right);
            }, this);
            this.dKey.on('down', function () {
                this.moveExecutioner(this.actions.right);
            }, this);

            this.upKey.on('down', function () {
                this.moveExecutioner(this.actions.up);
            }, this);
            this.wKey.on('down', function () {
                this.moveExecutioner(this.actions.up);
            }, this);

            this.downKey.on('down', function () {
                this.moveExecutioner(this.actions.down);
            }, this);
            this.sKey.on('down', function () {
                this.moveExecutioner(this.actions.down);
            }, this);

            this.spaceKey.on('down', function () {
                if (!this.game.spacePushed && this.currentMode === this.modes.playerTurn) this.game.spacePushed = true;
                if (this.currentMode === this.modes.movingBack || this.currentMode === this.modes.backTurnTransition || this.currentMode === this.modes.backTilesActions || this.currentMode === this.modes.moveBackTweenConstruction || this.currentMode === this.modes.undoTimedActions) {
                    // constrol fast rewind
                    this.fastRewind = true;
                    this.anims.globalTimeScale = 10;
                    this.fastRewindText.alpha = 0;
                    this.fastRewindTextTween.stop();
                }
                this.moveExecutioner(this.actions.stay);
            }, this);

            this.uKey.on('down', function () {
                if (!this.game.uPushed && this.currentMode === this.modes.playerTurn) this.game.uPushed = true;
                this.undoLastMove();
            }, this);

            this.rKey.on('down', function () {
                if (!this.game.rPushed) this.game.rPushed = true;
                this.relaunchState(false);
            }, this);

            this.mKey.on('down', function () {

                if (!this.game.mPushed) this.game.mPushed = true;

                if (this.game.soundPaused) {
                    this.game.soundPaused = false;
                    this.sound.resumeAll();
                } else {
                    this.game.soundPaused = true;
                    this.sound.pauseAll();
                }
            }, this);

            this.deferredActions = [];

            // rewind speed up
            this.fastRewind = false;
            if (this.game.device.os.desktop) {
                this.fastRewindText = this.add.bitmapText(gameWidth * 0.5 + 10000, gameHeight - 60 + 10000, 'basicFont', 'Press SPACE to speed up rewind', 30);
                this.fastRewindText.alpha = 0;
                this.fastRewindText.setOrigin(0.5);
                this.fastRewindTextTween;
            } else {
                this.fastRewindButton = this.makeButton(gameWidth * 0.5 + 10000, gameHeight - 60 + 10000, 'speedUpButton', '', function () {
                    this.fastRewind = true;
                    this.anims.globalTimeScale = 10;
                    this.fastRewindButton.alpha = 0;
                    this.fastRewindButton.disableInteractive();
                    this.fastRewindButtonTween.stop();
                });

                this.fastRewindButton.alpha = 0;
                this.fastRewindButton.align = 1;
                this.fastRewindButton.disableInteractive();
                this.fastRewindButtonTween;
            }

            // initialize skip starting text button to scale it later
            if (this.game.device.os.desktop) {

                this.skipStartingTextLabel = this.add.bitmapText(gameWidth * 0.5 + 10000, gameHeight - 60 + 10000, 'basicFont', 'Press SPACE to skip', 30);
                this.skipStartingTextLabel.alpha = 0;
                this.skipStartingTextLabel.setOrigin(0.5);
                this.skipStartingTextLabel.setDepth(11);
                this.skipStartingTextLabelTween;
            } else {
                this.skipStartingTextButton = this.makeButton(gameWidth * 0.5 + 10000, gameHeight - 60 + 10000, 'skipButton', '', undefined);
                this.skipStartingTextButton.setAlpha(0);
                this.skipStartingTextButton.disableInteractive();
                this.skipStartingTextButtonTween;
            }

            // setting turn clock
            this.turnClock = this.add.image(gameWidth * 0.5 - 20 + 10000, 40 + 10000, 'turnClock');
            this.turnClock.setDepth(2);
            this.turnClock.setAlpha(0.3);
            this.turnLabel = this.add.bitmapText(gameWidth * 0.5 + 10 + 10000, 50 + 10000, 'basicFont', this.turnNum, 50);
            this.turnLabel.setOrigin(0, 0.5);
            this.turnLabel.setDepth(2);
            this.turnLabel.setAlpha(0.3);

            // level label
            this.levelLabel = this.add.bitmapText(gameWidth * 0.5 + 10000, gameHeight - 20 + 10000, 'basicFont', 'level ' + this.game.currentLevelNum, 30);
            this.levelLabel.setOrigin(0.5, 1);
            this.levelLabel.setAlpha(0.3);

            // win and loosed condiditons checked on player's turn mode
            this.winConditionChecked = false;

            // setting leaf factory
            this.leafFactory = new LeafFactory(this, -10000, -10000, 0, 75);

            // splash screen for starting and final animations
            if (!this.textures.exists('splashTexture')) {
                var splashGraphics = this.make.graphics().fillStyle(0x101e28).fillRect(0, 0, 800, 600);
                splashGraphics.generateTexture('splashTexture', 800, 600);
                splashGraphics.destroy();
            }
            this.splashScreen = this.add.image(gameWidth * 0.5 + 10000, gameHeight * 0.5 + 10000, 'splashTexture');
            this.splashScreen.setDepth(10);

            this.finalAnimationStarted = false;
            this.startingAnimationStarted = false;
            this.stateRelaunched = false;

            // staring text
            this.texts = { 1: "I'm a garden gnome.\nI need to plant a flower into that hole",
                2: "In this magic Time Garden\nI can use that tile in the bottom right\ncorner to travel back in time",
                3: "I can control walls by standing on the\nbuttons of the same color",
                4: "Flowers can push buttons too",
                20: "I need to plant flowers into all holes,\nand can use flowers sent from the future",
                22: "When short on boxes I can use a box from the future",
                28: "Wood boxes sink into water,\nand I can step on top of them.\nFlowers float on top of water",
                33: "At present time there are ways\nI can only walk on once",
                42: "I must to let my past\nself do all work" };

            if (this.game.currentLevelNum in this.texts) {
                var text = this.texts[this.game.currentLevelNum];
                this.startingText = this.add.bitmapText(gameWidth / 2 + 10000, gameHeight / 2 + 10000, 'basicFont', text, 40, 1);
                this.startingText.setOrigin(0.5);
                this.startingText.setDepth(11);

                // tween to wanish starting text
                this.startingTextTween = this.tweens.add({
                    targets: this.startingText,
                    props: {
                        alpha: { value: 0, ease: 'Quad.easeIn' }
                    },
                    duration: 7000
                });
            }

            // instructions
            if (this.game.device.os.desktop) {

                if (this.game.currentLevelNum === 1) {
                    var arrowsInstructions = this.add.bitmapText(10, gameHeight * 0.85, 'basicFont', 'Move - arrows/WASD', 30);
                    arrowsInstructions.setOrigin(0, 0.5);
                    this.game.spacePushed = false;
                    this.game.uPushed = false;
                    this.game.rPushed = false;
                    this.game.mPushed = false;
                }
                if (this.game.currentLevelNum <= 4) {
                    var spaceInstructions = this.add.bitmapText(10, gameHeight * 0.95, 'basicFont', 'Wait turn - SPACE', 30);
                    spaceInstructions.setOrigin(0, 0.5);
                }

                if (this.game.currentLevelNum <= 4) {
                    if (!this.game.uPushed) {
                        var undoInstructions = this.add.bitmapText(gameWidth - 10, gameHeight * 0.75, 'basicFont', 'Undo last move - U', 30);
                        undoInstructions.setOrigin(1, 0.5);
                    }
                    if (!this.game.rPushed) {
                        var replayInstructions = this.add.bitmapText(gameWidth - 10, gameHeight * 0.85, 'basicFont', 'Restart level - R', 30);
                        replayInstructions.setOrigin(1, 0.5);
                    }
                    if (!this.game.mPushed) {
                        var muteInstructions = this.add.bitmapText(gameWidth - 10, gameHeight * 0.95, 'basicFont', 'Mute sound - M', 30);
                        muteInstructions.setOrigin(1, 0.5);
                    }
                }
            }

            this.noWaySign = this.add.image(0, 0, 'noWay').setAlpha(0).setDepth(5);

            this.homeButton = this.makeButton(55 + 10000, 55 + 10000, 'homeButton', '', function () {
                this.leftKey.destroy();
                this.aKey.destroy();
                this.rightKey.destroy();
                this.dKey.destroy();
                this.upKey.destroy();
                this.wKey.destroy();
                this.downKey.destroy();
                this.sKey.destroy();
                this.spaceKey.destroy();
                this.uKey.destroy();
                this.rKey.destroy();
                this.mKey.destroy();
                this.scene.start('LevelChoiceScene');
            });
            this.homeButton.setAlpha(0.5);
            if (this.game.device.os.desktop) {
                this.homeButton.setScale(0.7);
                this.homeButton.setOrigin(0);
                this.homeButton.setPosition(5 + 10000, 5 + 10000);
            }

            // mobile buttons

            if (!this.game.device.os.desktop) {
                this.moveLeftButton = this.makeButton(gameWidth - 255 + 10000, gameHeight - 155 + 10000, 'leftButton', '', function () {
                    this.moveExecutioner(this.actions.left);
                });
                this.moveLeftButton.setAlpha(0.5);
                this.moveUpButton = this.makeButton(gameWidth - 155 + 10000, gameHeight - 255 + 10000, 'upButton', '', function () {
                    this.moveExecutioner(this.actions.up);
                });
                this.moveUpButton.setAlpha(0.5);
                this.moveRightButton = this.makeButton(gameWidth - 55 + 10000, gameHeight - 155 + 10000, 'rightButton', '', function () {
                    this.moveExecutioner(this.actions.right);
                });
                this.moveRightButton.setAlpha(0.5);
                this.moveDownButton = this.makeButton(gameWidth - 155 + 10000, gameHeight - 55 + 10000, 'downButton', '', function () {
                    this.moveExecutioner(this.actions.down);
                });
                this.moveDownButton.setAlpha(0.5);
                this.moveStayButton = this.makeButton(gameWidth - 155 + 10000, gameHeight - 155 + 10000, 'stayButton', '', function () {
                    this.moveExecutioner(this.actions.stay);
                });
                this.moveStayButton.setAlpha(0.5);

                this.undoButton = this.makeButton(55 + 10000, gameHeight - 255 + 10000, 'undoButton', '', function () {
                    this.undoLastMove();
                });
                this.undoButton.setAlpha(0.5);
                this.replayButton = this.makeButton(55 + 10000, gameHeight - 155 + 10000, 'replayButton', '', function () {
                    this.relaunchState(false);
                });
                this.replayButton.setAlpha(0.5);

                this.muteButton = this.makeMuteButton(55 + 10000, gameHeight - 55 + 10000, 'muteButton');
                this.muteButton.setAlpha(0.5);

                this.scaleAndPosition();
            }

            // sound and sfx
            this.bumpSound = this.sound.add('bumpSound');
            this.breathInSound = this.sound.add('breathInSound');
            this.breathOutSound = this.sound.add('breathOutSound', { volume: 0.5 });
            this.sandSound = this.sound.add('sandSound', { volume: 0.5 });
            this.blockSound = this.sound.add('blockMoveSound', { volume: 0.3 });
            this.wallMoveSound = this.sound.add('wallMoveSound', { volume: 0.5 });
            this.ghostSound = this.sound.add('ghostSound', { volume: 0.5 });
            // manage sound paused
            if (this.game.soundPaused) {
                this.sound.pauseAll();
            }

            // clear starting and final animations
            if (this.textures.exists('startingAnimation')) {
                this.textures.remove('startingAnimation');
            }

            if (this.textures.exists('finalAnimation')) {
                this.textures.remove('finalAnimation');
            }
        }
    }, {
        key: 'scaleAndPosition',
        value: function scaleAndPosition() {
            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height,
                scale = Math.min(gameWidth / 800, gameHeight / 600),
                buttonScale = Math.min(0.8, scale);

            this.cameras.resize(gameWidth, gameHeight);

            // main camera zoom
            var fieldScale = Math.max(Math.min(gameHeight / (this.field.height + 150), gameWidth / (this.field.width + 100)), scale);
            this.fieldCamera.setZoom(fieldScale);
            this.field.putInCenter(gameWidth, gameHeight);

            // background and leafs scaling
            var backgroundScale = gameHeight / 600;
            this.background.setPosition(gameWidth * 0.5 - 10000, -10000);
            this.background.setScale(backgroundScale);

            // HUD scaling
            this.turnClock.setPosition(gameWidth * 0.5 - 20 * scale + 10000, 40 * scale + 10000);
            this.turnClock.setScale(scale);
            this.turnLabel.setPosition(gameWidth * 0.5 + 10 * scale + 10000, 40 * scale + 10000);
            this.turnLabel.setScale(scale);
            this.levelLabel.setPosition(gameWidth * 0.5 + 10000, gameHeight - 20 * scale + 10000);
            this.levelLabel.setScale(scale);
            if (this.startingText) {
                this.startingText.setPosition(gameWidth * 0.5 + 10000, gameHeight * 0.5 + 10000);
                this.startingText.setScale(scale);
            }
            if (this.skipStartingTextLabel) {
                this.skipStartingTextLabel.setPosition(gameWidth * 0.5 + 10000, gameHeight - 60 * scale + 10000);
                this.skipStartingTextLabel.setScale(scale);
            }
            if (this.fastRewindText) {
                this.fastRewindText.setPosition(gameWidth * 0.5 + 10000, gameHeight - 60 * scale + 10000);
                this.fastRewindText.setScale(scale);
            }
            if (this.fastRewindButton) {
                this.fastRewindButton.setPosition(gameWidth * 0.5 + 10000, gameHeight - 60 * buttonScale + 10000);
                this.fastRewindButton.setScale(buttonScale);
            }
            if (this.skipStartingTextButton) {
                this.skipStartingTextButton.setPosition(gameWidth * 0.5 + 10000, gameHeight - 60 * buttonScale + 10000);
                this.skipStartingTextButton.setScale(buttonScale);
            }

            // resize and scale mobile buttons
            this.moveLeftButton.setPosition(gameWidth - 255 * buttonScale + 10000, gameHeight - 155 * buttonScale + 10000);
            this.moveLeftButton.setScale(buttonScale);
            this.moveUpButton.setPosition(gameWidth - 155 * buttonScale + 10000, gameHeight - 255 * buttonScale + 10000);
            this.moveUpButton.setScale(buttonScale);
            this.moveRightButton.setPosition(gameWidth - 55 * buttonScale + 10000, gameHeight - 155 * buttonScale + 10000);
            this.moveRightButton.setScale(buttonScale);
            this.moveDownButton.setPosition(gameWidth - 155 * buttonScale + 10000, gameHeight - 55 * buttonScale + 10000);
            this.moveDownButton.setScale(buttonScale);
            this.moveStayButton.setPosition(gameWidth - 155 * buttonScale + 10000, gameHeight - 155 * buttonScale + 10000);
            this.moveStayButton.setScale(buttonScale);
            this.undoButton.setPosition(55 * buttonScale + 10000, gameHeight - 255 * buttonScale + 10000);
            this.undoButton.setScale(buttonScale);
            this.replayButton.setPosition(55 * buttonScale + 10000, gameHeight - 155 * buttonScale + 10000);
            this.replayButton.setScale(buttonScale);
            this.muteButton.setPosition(55 * buttonScale + 10000, gameHeight - 55 * buttonScale + 10000);
            this.muteButton.setScale(buttonScale);
            this.homeButton.setPosition(55 * buttonScale + 10000, 55 * buttonScale + 10000);
            this.homeButton.setScale(buttonScale);

            // scale and position splash screen
            this.splashScreen.setScale(gameWidth / 800, gameHeight / 600);
            this.splashScreen.setPosition(gameWidth * 0.5 + 10000, gameHeight * 0.5 + 10000);

            // scale leaf factory
            var scaleX = gameWidth / 800,
                scaleY = gameHeight / 600;

            this.leafFactory.scaleAndPosition(scaleX, scaleY, scale);
        }
    }, {
        key: 'moveExecutioner',
        value: function moveExecutioner(direction) {
            if (!this.executioner.inWater) {
                if (this.currentMode === this.modes.playerTurn) {
                    // need to check twice if there were changes due to first check in movements
                    if (this.executioner.currentDirection != direction && direction === this.actions.stay) direction = this.executioner.currentDirection;
                    var movePossibility = this.checkObjectMove(this.executioner, direction, this.executioner.movePriority);
                    var laterMovePossibility = this.checkObjectMove(this.executioner, direction, this.executioner.movePriority);

                    if (movePossibility && laterMovePossibility) {
                        this.currentMode = this.modes.moveTweenConstruction;
                        // second phantom cast
                        this.field.castPhantomsMoves(true);
                    } else {
                        // launch no way sign
                        var checkCoordX, checkCoordY;

                        switch (direction) {
                            case this.actions.left:
                                checkCoordX = this.executioner.x - this.field.cellWidth;
                                checkCoordY = this.executioner.y;
                                break;
                            case this.actions.right:
                                checkCoordX = this.executioner.x + this.field.cellWidth;
                                checkCoordY = this.executioner.y;
                                break;
                            case this.actions.up:
                                checkCoordX = this.executioner.x;
                                checkCoordY = this.executioner.y - this.field.cellHeight;
                                break;
                            case this.actions.down:
                                checkCoordX = this.executioner.x;
                                checkCoordY = this.executioner.y + this.field.cellHeight;
                                break;
                            case this.actions.stay:
                                checkCoordX = this.executioner.x;
                                checkCoordY = this.executioner.y;
                                break;
                        }

                        this.noWaySign.x = checkCoordX;
                        this.noWaySign.y = checkCoordY;

                        this.noWaySign.setAlpha(0.7);
                        var noWayAlphaTween = this.tweens.add({
                            targets: this.noWaySign,
                            props: {
                                alpha: { value: 1, ease: 'Linear' }
                            },
                            duration: 500,
                            yoyo: true
                        });
                        noWayAlphaTween.setCallback('onComplete', function () {
                            this.noWaySign.setAlpha(0);
                        }, [], this);
                    }
                } else {
                    if (this.currentMode != this.modes.startingAnimation && this.currentMode != this.modes.movingBack && this.currentMode != this.modes.backTurnTransition && this.currentMode != this.modes.backTilesActions && this.currentMode != this.modes.moveBackTweenConstruction && this.currentMode != this.modes.undoTimedActions) this.deferredActions.push(direction);
                }
            }
        }
    }, {
        key: 'undoLastMove',
        value: function undoLastMove() {
            if (this.turnNum > 1 && this.currentMode === this.modes.playerTurn) {
                this.currentMode = this.modes.undoMove;
            }
        }
    }, {
        key: 'checkObjectMove',
        value: function checkObjectMove(object, direction, priority) {
            if (object.checkActiveStatus()) {
                switch (direction) {
                    case this.actions.left:
                        var checkCoordX = object.x - this.field.cellWidth,
                            checkCoordY = object.y;
                        break;
                    case this.actions.right:
                        var checkCoordX = object.x + this.field.cellWidth,
                            checkCoordY = object.y;
                        break;
                    case this.actions.up:
                        var checkCoordX = object.x,
                            checkCoordY = object.y - this.field.cellHeight;
                        break;
                    case this.actions.down:
                        var checkCoordX = object.x,
                            checkCoordY = object.y + this.field.cellHeight;
                        break;
                    case this.actions.stay:
                        var checkCoordX = object.x,
                            checkCoordY = object.y;
                        break;
                }

                if (direction != this.actions.stay) {
                    if (this.field.checkTileAvailable(checkCoordX, checkCoordY, object)) {
                        var obstacle = this.field.getObstaclePlanned(checkCoordX, checkCoordY, object);
                        if (obstacle) {
                            if (obstacle.currentDirection != this.actions.stay) {
                                if (obstacle.movePriority < priority) {
                                    return false;
                                } else {

                                    // recursively check that less priority object can stay
                                    var obstacleMovePossible = this.checkObjectMove(obstacle, this.actions.stay, priority);
                                    if (obstacleMovePossible) {
                                        // for executioner check if therre are movables and movers
                                        // and change thier move if current direction is not direction
                                        if (object.eIType === EITypeDict.executioner && object.currentDirection != direction) {
                                            if (object.movable) {
                                                var movableMove = this.checkObjectMove(object.movable, this.actions.stay, priority);
                                                if (movableMove) object.movable = undefined;
                                            }
                                            /*if (object.mover)
                                            {
                                                var previousAction = object.mover.defineAction(this.turnNum, [object.mover])
                                                if (previousAction)
                                                {
                                                    var moverMove = true;
                                                     for (var m in previousAction.moverList)
                                                    {
                                                        var currentMover = previousAction.moverList[m];
                                                        moverMove = moverMove && this.checkObjectMove(currentMover,
                                                            previousAction.action, previousAction.priority)
                                                    }
                                                     if (moverMove)
                                                        object.mover = undefined;
                                                }
                                            }*/
                                        }
                                        object.currentDirection = direction;
                                        object.movePriority = priority;
                                        object.move(this.turnNum);
                                        object.movable = obstacle;
                                        obstacle.mover = object;

                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            } else {

                                // recursively check move posssiblity of this particular move
                                var obstacleMovePossible = this.checkObjectMove(obstacle, direction, priority);

                                if (obstacleMovePossible) {
                                    // for executioner check if therre are movables
                                    // and change thier move if current direction is not direction
                                    if (object.eIType === EITypeDict.executioner && object.currentDirection != direction) {
                                        if (object.movable) {
                                            var movableMove = this.checkObjectMove(object.movable, this.actions.stay, priority);
                                            if (movableMove) object.movable = undefined;
                                        }
                                        /*if (object.mover)
                                        {
                                            // need also to check all the mover's mover
                                            var previousAction = object.mover.defineAction(this.turnNum, [object.mover])
                                            if (previousAction)
                                            {
                                                var moverMove = true;
                                                 for (var m in previousAction.moverList)
                                                {
                                                    var currentMover = previousAction.moverList[m];
                                                    moverMove = moverMove && this.checkObjectMove(currentMover,
                                                        previousAction.action, previousAction.priority)
                                                }
                                                 if (moverMove)
                                                    object.mover = undefined;
                                            }
                                        }*/
                                    }
                                    object.currentDirection = direction;
                                    object.movePriority = priority;
                                    object.move(this.turnNum);
                                    object.movable = obstacle;
                                    obstacle.mover = object;

                                    return true;
                                } else {

                                    return false;
                                }
                            }
                        } else {
                            // for executioner check if therre are movables
                            // and change thier move if current direction is not direction
                            if (object.eIType === EITypeDict.executioner && object.currentDirection != direction) {
                                if (object.movable) {
                                    var movableMove = this.checkObjectMove(object.movable, this.actions.stay, priority);
                                    if (movableMove) object.movable = undefined;
                                }
                                /*if (object.mover)
                                {
                                    // need also to check all the mover's mover
                                    console.log('have mover');
                                    var previousAction = object.mover.defineAction(this.turnNum, [object.mover])
                                    if (previousAction)
                                    {
                                        var moverMove = true;
                                         for (var m in previousAction.moverList)
                                        {
                                            var currentMover = previousAction.moverList[m];
                                            moverMove = moverMove && this.checkObjectMove(currentMover,
                                                previousAction.action, previousAction.priority)
                                        }
                                         if (moverMove)
                                            object.mover = undefined;
                                    }
                                }*/
                            }
                            object.currentDirection = direction;
                            object.movePriority = priority;
                            object.move(this.turnNum);
                            return true;
                        }
                    }

                    return false;
                } else {
                    var obstacle = this.field.getObstaclePlanned(checkCoordX, checkCoordY, object);
                    if (obstacle) {
                        if (obstacle.movePriority < priority) {
                            var newMovePossibility = this.checkObjectMove(object, obstacle.currentDirection, priority);
                            if (newMovePossibility) {
                                return true;
                            } else {
                                var obstacleMovePossible = this.checkObjectMove(obstacle, this.actions.stay, -1);
                                return false;
                            }
                        } else {
                            var obstacleMovePossible = this.checkObjectMove(obstacle, this.actions.stay, priority);
                            if (obstacleMovePossible) {

                                object.currentDirection = direction;
                                object.movePriority = priority;
                                object.move(this.turnNum);
                                if (object.movable) {
                                    var movableMove = this.checkObjectMove(object.movable, direction, priority);
                                    if (movableMove) object.movable = undefined;
                                }
                                return true;
                            }
                        }
                    } else {
                        object.currentDirection = direction;
                        object.movePriority = priority;
                        object.move(this.turnNum);
                        if (object.movable) {
                            var movableMove = this.checkObjectMove(object.movable, direction, priority);
                            if (movableMove) object.movable = undefined;
                        }
                        return true;
                    }
                }
            }

            return false;
        }
    }, {
        key: 'sendBackInTime',
        value: function sendBackInTime(traveller) {
            if (!this.game.soundPaused) this.sandSound.play();

            if (traveller.eIType === EITypeDict.executioner) {
                var phantom = new Phantom(this, this.executioner.x, this.executioner.y, this.executioner, this.field.movers.length, this.field);
                this.field.movers.push(phantom);
                this.currentMode = this.modes.backTilesActions;
            } else if (traveller.eIType === EITypeDict.block || traveller.eIType === EITypeDict.phantomBlock) {
                traveller.sendToPast(this.turnNum);
            } else if (traveller.eIType === EITypeDict.bomb) {

                var phantomBomb = new PhantomBomb(this, traveller.x, traveller.y, traveller.totalTime, traveller, this.field);
                traveller.sendToPast(this.turnNum);
                phantomBomb.sendToPast(this.turnNum);
                this.field.movables.push(phantomBomb);
            } else if (traveller.eIType === EITypeDict.spirit || traveller.eIType === EITypeDict.phantomSpirit) {
                traveller.sendToPast(this.turnNum);
            } else if (traveller.eIType === EITypeDict.phantom) {
                /*var phantom = new Phantom(this, traveller.x, traveller.y, traveller, this.field);
                traveller.moveStory = {};
                traveller.statusStory = {};
                traveller.sendToPast(1);
                traveller.shortenActionList(this.turnNum);
                phantom.sendToPast(this.turnNum);
                this.field.movers.push(phantom);*/
                traveller.sendToPast(this.turnNum);
            }
        }
    }, {
        key: 'producePhantom',
        value: function producePhantom(origin) {
            switch (origin.eIType) {
                case EITypeDict.block:
                case EITypeDict.phantomBlock:
                    var phantomBlock = new PhantomBlock(this, origin.x, origin.y, origin, this.field);
                    this.field.movables.push(phantomBlock);
                    break;

                case EITypeDict.spirit:
                case EITypeDict.phantomSpirit:
                    var phantomSpirit = new PhantomSpirit(this, origin.x, origin.y, origin, this.field);
                    this.field.movables.push(phantomSpirit);
                    break;

                case EITypeDict.phantom:
                    var phantom = new Phantom(this, origin.x, origin.y, origin, this.field.movers.length, this.field);
                    this.field.movers.push(phantom);
                    break;
            }
        }
    }, {
        key: 'checkWinCondition',
        value: function checkWinCondition() {
            this.winConditionChecked = true;
            if (this.field.checkWinCondition()) {
                this.game.currentLevelNum++;
                this.currentMode = this.modes.finalAnimation;
            }
        }
    }, {
        key: 'relaunchState',
        value: function relaunchState(win) {
            this.leftKey.destroy();
            this.aKey.destroy();
            this.rightKey.destroy();
            this.dKey.destroy();
            this.upKey.destroy();
            this.wKey.destroy();
            this.downKey.destroy();
            this.sKey.destroy();
            this.spaceKey.destroy();
            this.uKey.destroy();
            this.rKey.destroy();
            this.mKey.destroy();

            this.anims.remove('idlePort');

            this.anims.remove('idleExec');
            this.anims.remove('goRightExec');
            this.anims.remove('goUpExec');
            this.anims.remove('goDownExec');
            this.anims.remove('backIdleExec');
            this.anims.remove('backGoRightExec');
            this.anims.remove('backGoUpExec');
            this.anims.remove('backGoDownExec');

            this.anims.remove('idlePhantom');
            this.anims.remove('goRightPhantom');
            this.anims.remove('goUpPhantom');
            this.anims.remove('goDownPhantom');
            this.anims.remove('backIdlePhantom');
            this.anims.remove('backGoRightPhantom');
            this.anims.remove('backGoUpPhantom');
            this.anims.remove('backGoDownPhantom');

            this.anims.remove('idleSpirit');
            this.anims.remove('idlePhantomSpirit');

            this.anims.remove('waterFlow');
            this.anims.remove('waterStill');

            if (this.startingText) this.startingText.destroy();

            this.stateRelaunched = true;
            this.game.lastAvailLevel = Math.max(this.game.lastAvailLevel, this.game.currentLevelNum);
            this.game.saveData.lastLevel = Math.max(this.game.saveData.lastLevel, this.game.currentLevelNum);
            localStorage.setItem('execInsomniaSaveData', JSON.stringify(this.game.saveData));

            if (this.game.currentLevelNum <= this.game.totalLevels) this.scene.restart();else this.scene.start('CloseScene');
        }
    }, {
        key: 'startStartingAnimation',
        value: function startStartingAnimation() {
            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height,
                scale = Math.min(gameWidth / 800, gameHeight / 600);

            // start tweens for points of the final animation
            var timeToStartAnimation;
            if (this.startingText && this.startingText.alpha > 0) {
                timeToStartAnimation = 4000;
            } else {
                timeToStartAnimation = 0;
            }

            if (timeToStartAnimation > 0) {
                var spaceEventEmitter;
            }

            var fadeOutCall, _hideStartTextAndSplash;

            _hideStartTextAndSplash = function hideStartTextAndSplash() {
                fadeOutCall.destroy();

                // tween to wanish starting text
                this.startingTextTween.stop();
                if (this.skipStartingTextLabelTween) this.skipStartingTextLabelTween.stop();
                this.tweens.add({
                    targets: [this.startingText, this.skipStartingTextLabel],
                    props: {
                        alpha: { value: 0, ease: 'Quad.easeIn' }
                    },
                    duration: 700
                });

                if (!this.game.soundPaused) this.breathInSound.play();

                var alphaTween = this.tweens.add({
                    targets: this.splashScreen,
                    props: {
                        alpha: { value: 0, ease: 'Linear' }
                    },
                    duration: 700
                });

                alphaTween.setCallback('onComplete', function () {
                    this.currentMode = this.modes.tilesActions;
                }, [], this);

                if (this.game.device.os.desktop) {
                    this.spaceKey.removeListener('down', _hideStartTextAndSplash, this, true);
                } else {
                    this.skipStartingTextButton.alpha = 0;
                    this.skipStartingTextButton.disableInteractive();
                    this.skipStartingTextButtonTween.stop();
                }
            };

            fadeOutCall = this.time.delayedCall(timeToStartAnimation, function () {

                if (!this.game.soundPaused) this.breathInSound.play();

                var alphaTween = this.tweens.add({
                    targets: this.splashScreen,
                    props: {
                        alpha: { value: 0, ease: 'Linear' }
                    },
                    duration: 1200
                });

                this.tweens.add({
                    targets: this.skipStartingTextLabel,
                    props: {
                        alpha: { value: 0, ease: 'Linear' }
                    },
                    duration: 500
                });

                if (this.skipStartingTextLabelTween) this.skipStartingTextLabelTween.stop();

                alphaTween.setCallback('onComplete', function () {
                    this.currentMode = this.modes.tilesActions;
                }, [], this);

                if (timeToStartAnimation > 0) {
                    if (this.game.device.os.desktop) {
                        this.spaceKey.removeListener('down', _hideStartTextAndSplash, this, true);
                    } else {
                        this.skipStartingTextButton.alpha = 0;
                        this.skipStartingTextButton.disableInteractive();
                        this.skipStartingTextButtonTween.stop();
                    }
                }
            }, [], this);

            // if player pushes space splash screen and starting text vanishes rapidly
            if (timeToStartAnimation > 0) {
                if (this.game.device.os.desktop) {
                    this.spaceKey.once('down', _hideStartTextAndSplash, this);
                    this.skipStartingTextLabel.alpha = 0.5;
                    this.skipStartingTextLabelTween = this.tweens.add({
                        targets: this.skipStartingTextLabel,
                        props: {
                            alpha: { value: 0.1, ease: 'Linear' }
                        },
                        duration: 1000,
                        yoyo: true,
                        repeat: -1
                    });
                } else {
                    this.skipStartingTextButton.setAlpha(0.5);
                    this.skipStartingTextButton.setInteractive();
                    this.skipStartingTextButton.callback = _hideStartTextAndSplash;
                    this.skipStartingTextButtonTween = this.tweens.add({
                        targets: this.skipStartingTextButton,
                        props: {
                            alpha: { value: 0.1, ease: 'Linear' }
                        },
                        duration: 1000,
                        yoyo: true,
                        repeat: -1
                    });
                }
            }
        }
    }, {
        key: 'startFinalAnimation',
        value: function startFinalAnimation() {
            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height,
                scale = Math.min(gameWidth / 800, gameHeight / 600);

            if (!this.game.soundPaused) this.breathOutSound.play();

            var alphaTween = this.tweens.add({
                targets: this.splashScreen,
                props: {
                    alpha: { value: 1, ease: 'Linear' }
                },
                duration: 2000
            });

            alphaTween.setCallback('onComplete', function () {
                this.relaunchState(true);
            }, [], this);
        }
    }, {
        key: 'update',
        value: function update(time, delta) {

            //PlainCollider.drawColliders(this.debugGraphics);


            if (this.playing) {

                switch (this.currentMode) {
                    case this.modes.tilesActions:
                        if (this.winConditionChecked) this.winConditionChecked = false;

                        // first swithc the mode because it can be changed on timeport action
                        this.currentMode = this.modes.timedActions;
                        this.field.performTilesActions();
                        break;

                    case this.modes.timedActions:
                        this.field.performTimedActions();
                        this.currentMode = this.modes.moveCalc;
                        break;

                    case this.modes.moveCalc:
                        this.field.castPhantomsMoves(false);
                        this.field.castWaterMoves();
                        this.currentMode = this.modes.playerTurn;
                        break;

                    case this.modes.playerTurn:

                        if (!this.winConditionChecked) this.checkWinCondition();

                        if (this.deferredActions.length > 0) {
                            var nextAction = this.deferredActions.shift();
                            this.moveExecutioner(nextAction);
                            // second phantom cast
                            this.field.castPhantomsMoves(true);
                        }

                        break;

                    case this.modes.moveTweenConstruction:
                        this.field.movers.forEach(function (mover) {
                            if (mover.eIType === EITypeDict.phantom && !mover.inPast) {
                                var action = mover.defineAction(this.turnNum).action;
                                if (action && action != mover.currentDirection) {
                                    mover.launchExclamationSign();
                                }
                            }
                        }, this);
                        this.field.constructMoveTweens();
                        this.field.waterTiles.forEach(function (waterTile) {
                            waterTile.launchAnimation();
                        }, this);
                        this.field.launchPhantomTilesAnimation();

                        this.currentMode = this.modes.moving;
                        // rotate the turn clock
                        this.turnClock.setRotation(0);
                        var turnClockTween = this.tweens.add({
                            targets: this.turnClock,
                            props: {
                                rotation: { value: Math.PI, ease: 'Linear' }
                            },
                            duration: 250
                        });
                        // set timer to transition
                        this.time.delayedCall(250, function () {
                            this.currentMode = this.modes.nextTurnTransition;
                        }, [], this);
                        break;

                    case this.modes.moving:
                        this.leafFactory.update(time, delta, true);

                        break;

                    case this.modes.nextTurnTransition:
                        this.field.sendNonActivePhantomsToPast();
                        this.field.resetDirections();
                        this.turnNum++;
                        this.turnLabel.text = this.turnNum;
                        this.currentMode = this.modes.tilesActions;
                        break;

                    case this.modes.backTilesActions:
                        this.field.undoTilesActions(true);
                        this.currentMode = this.modes.moveBackTweenConstruction;

                        // add rewind spped up label or button
                        if (this.game.device.os.desktop) {
                            if (this.fastRewindText.alpha === 0 && !this.fastRewind) {
                                this.fastRewindText.alpha = 1;
                                this.fastRewindTextTween = this.tweens.add({
                                    targets: this.fastRewindText,
                                    props: {
                                        alpha: { value: 0.1, ease: 'Linear' }
                                    },
                                    duration: 1000,
                                    yoyo: true,
                                    repeat: -1
                                });
                            }
                        } else {
                            if (this.fastRewindButton.alpha === 0 && !this.fastRewind) {
                                this.fastRewindButton.alpha = 0.5;
                                this.fastRewindButton.setInteractive();
                                this.fastRewindButtonTween = this.tweens.add({
                                    targets: this.fastRewindButton,
                                    props: {
                                        alpha: { value: 0.1, ease: 'Linear' }
                                    },
                                    duration: 1000,
                                    yoyo: true,
                                    repeat: -1
                                });
                            }
                        }
                        break;

                    case this.modes.undoTimedActions:
                        this.field.undoTimedActions(true);
                        this.currentMode = this.modes.backTilesActions;
                        break;

                    case this.modes.moveBackTweenConstruction:
                        this.field.constructBackTweens(true, this.fastRewind);
                        this.field.undoStatusChange(true);
                        this.currentMode = this.modes.movingBack;
                        // rotate the turn clock
                        this.turnClock.setRotation(0);
                        var turnClockTween = this.tweens.add({
                            targets: this.turnClock,
                            props: {
                                rotation: { value: -Math.PI, ease: 'Linear' }
                            },
                            duration: this.fastRewind ? 15 : 150
                        });
                        // set a timer to back transition
                        this.time.delayedCall(this.fastRewind ? 15 : 150, function () {
                            this.currentMode = this.modes.backTurnTransition;
                        }, [], this);
                        break;

                    case this.modes.movingBack:
                        this.leafFactory.update(time, delta, false);

                        break;

                    case this.modes.backTurnTransition:
                        this.field.resetDirections();
                        if (this.turnNum > 1) {
                            this.turnNum--;
                            this.currentMode = this.modes.undoTimedActions;
                        } else {
                            this.turnNum = 1;
                            this.field.clearStory();
                            this.currentMode = this.modes.tilesActions;
                            this.fastRewind = false;
                            this.anims.globalTimeScale = 1;
                            if (this.game.device.os.desktop) {
                                if (this.fastRewindText.alpha > 0) {
                                    this.fastRewindText.alpha = 0;
                                    this.fastRewindTextTween.stop();
                                }
                            } else {
                                if (this.fastRewindButton.alpha > 0) {
                                    this.fastRewindButton.alpha = 0;
                                    this.fastRewindButton.disableInteractive();
                                    this.fastRewindButtonTween.stop();
                                }
                            }
                        }
                        this.turnLabel.text = this.turnNum;
                        break;

                    case this.modes.undoMove:

                        if (this.winConditionChecked) this.winConditionChecked = false;

                        this.field.undoTilesActions(false);
                        this.field.undoTimedActions(false);
                        // two times construct back tween: 
                        // for those who got in timed or tile action in this turn
                        // and moved in previous
                        this.field.undoStatusChange(false);
                        this.turnNum--;
                        this.field.undoTimedActions(false);
                        this.field.constructBackTweens(false);
                        this.currentMode = this.modes.movingBack;
                        // rotate the turn clock
                        this.turnClock.setRotation(0);
                        var turnClockTween = this.tweens.add({
                            targets: this.turnClock,
                            props: {
                                rotation: { value: -Math.PI, ease: 'Linear' }
                            },
                            duration: 150
                        });
                        // set a timer to normal mode
                        this.time.delayedCall(150, function () {
                            this.field.resetDirections();
                            this.currentMode = this.modes.tilesActions;
                            this.turnLabel.text = this.turnNum;
                            if (this.fastRewind) {
                                this.fastRewind = false;
                                this.anims.globalTimeScale = 1;
                            }
                        }, [], this);
                        break;

                    case this.modes.finalAnimation:
                        if (!this.finalAnimationStarted) {
                            this.finalAnimationStarted = true;
                            this.startFinalAnimation();
                        }

                        break;

                    case this.modes.startingAnimation:
                        if (!this.startingAnimationStarted) {
                            this.startingAnimationStarted = true;
                            this.startStartingAnimation();
                        }
                        break;
                }
            }
        }
    }, {
        key: 'makeButton',
        value: function makeButton(posX, posY, imageKey, text, callback) {
            var button = this.add.image(posX, posY, imageKey, 'out').setInteractive();
            button.setDepth(101);
            button.callback = callback;

            button.on('pointerdown', function () {
                if (!this.game.soundPaused) {
                    this.game.buttonSound.play();
                }
                button.callback.call(this);
                button.setFrame('down');
            }, this);

            button.on('pointerup', function () {
                button.setFrame('out');
            }, this);
            button.label = this.add.bitmapText(button.x, button.y, 'basicFont', text, 16, 1);
            button.label.setDepth(102);
            button.label.setOrigin(0.5);
            return button;
        }
    }, {
        key: 'makeMuteButton',
        value: function makeMuteButton(posX, posY, imageKey) {

            if (this.game.soundPaused) {
                var startFrame = 'offOut';
            } else {
                var startFrame = 'onOut';
            }

            var button = this.add.image(posX, posY, imageKey, startFrame).setInteractive();
            button.setDepth(101);

            button.on('pointerdown', function () {
                if (this.game.soundPaused) {
                    button.setFrame('onDown');
                } else {
                    this.game.buttonSound.play();
                    button.setFrame('offDown');
                }
            }, this);

            button.on('pointerup', function () {
                if (this.game.soundPaused) {
                    this.game.soundPaused = false;
                    this.sound.resumeAll();
                    button.setFrame('onOut');
                } else {
                    this.game.soundPaused = true;
                    this.sound.pauseAll();
                    button.setFrame('offOut');
                }
            }, this);

            return button;
        }
    }]);

    return PlayScene;
}(Phaser.Scene);

/***/ }),

/***/ 1439:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Block = __webpack_require__(117);
var Bomb = __webpack_require__(254);
var Executioner = __webpack_require__(255);
var Phantom = __webpack_require__(533);
var PhantomBlock = __webpack_require__(534);
var PhantomBomb = __webpack_require__(535);
var PhantomSpirit = __webpack_require__(536);
var Pikes = __webpack_require__(537);
var PikesButton = __webpack_require__(538);
var Pit = __webpack_require__(539);
var Rock = __webpack_require__(540);
var Spirit = __webpack_require__(256);
var Tile = __webpack_require__(40);
var TimePort = __webpack_require__(541);
var Wall = __webpack_require__(542);
var WallButton = __webpack_require__(543);
var Water = __webpack_require__(1440);
var PhantomTile = __webpack_require__(1441);
var EITypeDict = __webpack_require__(18);

var Field = exports.Field = function () {
    function Field(scene, columns, rows, cellWidth, cellHeight, map) {
        _classCallCheck(this, Field);

        this.scene = scene;
        this.columns = columns;
        this.rows = rows;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;

        // define the place of the field
        this.width = columns * this.cellWidth;
        this.height = rows * this.cellHeight;

        var gameWidth = this.scene.game.scale.width,
            gameHeight = this.scene.game.scale.height;

        this.startX = (gameWidth - this.width) * 0.5;
        this.startY = (gameHeight - this.height) * 0.5;

        // create map
        // generate empty tiles, blocks, shamans
        this.tiles = {};
        for (var j = 0; j < this.rows; j++) {
            this.tiles[j] = {};
        }this.movables = [];
        this.movers = [];
        this.buttons = [];
        this.waterTiles = [];
        this.flowHeads = [];
        this.phantomTiles = [];

        this.loadMap(map);

        // create edges along map
        // left and right edges
        /*for (var j = 0; j < this.rows; j++)
        {
            var leftEdge = this.scene.add.image(this.startX, this.startY + (j + 0.5) * this.cellHeight, 'edge', 'left');
            leftEdge.setOrigin(1, 0.5);
             var rightEdge = this.scene.add.image(this.startX + this.width, this.startY + (j + 0.5) * this.cellHeight,
                 'edge', 'right');
            rightEdge.setOrigin(0, 0.5);
        }*/
        // top and bottom edges
        /*for (var i = 0; i < this.columns; i++)
        {
            var bottomEdge = this.scene.add.image(this.startX + (i + 0.5) * this.cellWidth, this.startY + this.height,
                'edge', 'bottom');
            bottomEdge.setOrigin(0.5, 0);
             var topEdge = this.scene.add.image(this.startX + (i + 0.5) * this.cellWidth, this.startY,
                'edge', 'top');
            topEdge.setOrigin(0.5, 1);
        }*/
    }

    _createClass(Field, [{
        key: 'loadMap',
        value: function loadMap(map) {

            for (var j = 0; j < this.rows; j++) {
                for (var i = 0; i < this.columns; i++) {
                    var tileCoord = this.posToCoord(i, j),
                        tile;

                    switch (map[j][i].tileType) {
                        case 'plain':
                            tile = new Tile(this.scene, tileCoord.x, tileCoord.y, this);

                            var frame = (i + j) % 2 ? '1' : '0';
                            tile.setFrame(frame);
                            break;
                        case 'rock':
                            tile = new Rock(this.scene, tileCoord.x, tileCoord.y, this);
                            break;
                        case 'pit':
                            tile = new Pit(this.scene, tileCoord.x, tileCoord.y, this);
                            break;
                        case 'timePort':
                            tile = new TimePort(this.scene, tileCoord.x, tileCoord.y, this);
                            break;
                        case 'pikes':
                            tile = new Pikes(this.scene, tileCoord.x, tileCoord.y, map[j][i].tileColor, this);
                            break;
                        case 'pikesButton':
                            tile = new PikesButton(this.scene, tileCoord.x, tileCoord.y, map[j][i].tileColor, this);
                            this.buttons.push(tile);
                            break;
                        case 'wall':
                            tile = new Wall(this.scene, tileCoord.x, tileCoord.y, map[j][i].tileColor, this);
                            break;
                        case 'wallButton':
                            tile = new WallButton(this.scene, tileCoord.x, tileCoord.y, map[j][i].tileColor, this);
                            this.buttons.push(tile);
                            break;
                        case 'water':
                            tile = new Water(this.scene, tileCoord.x, tileCoord.y, Number(map[j][i].tileDirection), this);
                            break;
                        case 'phantomTile':
                            tile = new PhantomTile(this.scene, tileCoord.x, tileCoord.y, j, i, this);
                            this.phantomTiles.push(tile);
                            break;
                    }

                    this.tiles[j][i] = tile;

                    switch (map[j][i].objType) {
                        case 'block':
                            var block = new Block(this.scene, tileCoord.x, tileCoord.y, this);
                            this.movables.push(block);
                            break;

                        case 'bomb':
                            var bomb = new Bomb(this.scene, tileCoord.x, tileCoord.y, 10, this);
                            this.movables.push(bomb);
                            break;

                        case 'executioner':
                            var executioner = new Executioner(this.scene, tileCoord.x, tileCoord.y, this);
                            this.movers.push(executioner);
                            this.scene.executioner = executioner;
                            break;

                        case 'spirit':
                            var spirit = new Spirit(this.scene, tileCoord.x, tileCoord.y, map[j][i].objColor, this);
                            this.movables.push(spirit);
                            break;
                    }
                }
            }

            this.buttons.forEach(function (button) {
                if (button.eIType === EITypeDict.pikesButton) {
                    button.linkPikes();
                } else if (button.eIType === EITypeDict.wallButton) {
                    button.linkWalls();
                }
            }, this);

            this.linkWaterTiles();
        }
    }, {
        key: 'linkWaterTiles',
        value: function linkWaterTiles() {

            for (var j = 0; j < this.rows; j++) {
                for (var i = 0; i < this.columns; i++) {
                    var tile = this.getTile(j, i);

                    if (tile.eIType === EITypeDict.water) {
                        this.linkWater(i, j, tile);
                        this.waterTiles.push(tile);
                    }
                }
            }

            this.flowHeads = this.waterTiles.filter(function (waterTile) {
                return typeof waterTile.nextTile === 'undefined';
            }, this);
        }
    }, {
        key: 'linkWater',
        value: function linkWater(col, row, tile) {
            // link previous tiles
            if (row > 0) {
                var upperTile = this.getTile(row - 1, col);
                if (upperTile.eIType === EITypeDict.water && upperTile.direction === this.scene.actions.down) {
                    tile.prevTiles.push(upperTile);
                }
            }

            if (row < this.rows - 1) {
                var bottomTile = this.getTile(row + 1, col);
                if (bottomTile.eIType === EITypeDict.water && bottomTile.direction === this.scene.actions.up) {
                    tile.prevTiles.push(bottomTile);
                }
            }

            if (col > 0) {
                var leftTile = this.getTile(row, col - 1);
                if (leftTile.eIType === EITypeDict.water && leftTile.direction === this.scene.actions.right) {
                    tile.prevTiles.push(leftTile);
                }
            }

            if (col < this.columns - 1) {
                var rightTile = this.getTile(row, col + 1);
                if (rightTile.eIType === EITypeDict.water && rightTile.direction === this.scene.actions.left) {
                    tile.prevTiles.push(rightTile);
                }
            }

            // link next tile
            switch (tile.direction) {
                case this.scene.actions.right:
                    var nextTile = this.getTile(row, col + 1);
                    if (nextTile && nextTile.eIType === EITypeDict.water) {
                        tile.nextTile = nextTile;
                    }
                    break;

                case this.scene.actions.down:
                    var nextTile = this.getTile(row + 1, col);
                    if (nextTile && nextTile.eIType === EITypeDict.water) {
                        tile.nextTile = nextTile;
                    }
                    break;

                case this.scene.actions.left:
                    var nextTile = this.getTile(row, col - 1);
                    if (nextTile && nextTile.eIType === EITypeDict.water) {
                        tile.nextTile = nextTile;
                    }
                    break;

                case this.scene.actions.up:
                    var nextTile = this.getTile(row - 1, col);
                    if (nextTile && nextTile.eIType === EITypeDict.water) {
                        tile.nextTile = nextTile;
                    }
                    break;
            }
        }
    }, {
        key: 'getTile',
        value: function getTile(row, col) {
            if (row < this.rows && row >= 0 && col < this.columns && col >= 0) return this.tiles[row][col];else return false;
        }
    }, {
        key: 'checkTileAvailable',
        value: function checkTileAvailable(x, y, object) {

            var objEIType = object.eIType,
                present;

            if (objEIType === EITypeDict.executioner || objEIType === EITypeDict.block || objEIType === EITypeDict.bomb) {
                present = true;
            } else {
                present = false;
            }

            var cellPos = this.coordToPos(x, y);

            if (cellPos.x >= 0 && cellPos.x < this.columns && cellPos.y >= 0 && cellPos.y < this.rows) {
                var tile = this.getTile(cellPos.y, cellPos.x);
                if (present) {
                    if (tile.obstacle && !tile.exploded || tile.presentObstacle) return false;
                } else {
                    if (tile.obstacle && !tile.exploded) return false;
                }

                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'getObstaclePlanned',
        value: function getObstaclePlanned(x, y, object) {
            var obstacle = false,
                checkPos = this.coordToPos(x, y);

            this.movables.forEach(function (block) {
                var plannedPos = this.coordToPos(block.plannedCoord.x, block.plannedCoord.y);

                if (plannedPos.x === checkPos.x && plannedPos.y === checkPos.y && !block.inPit && !block.exploded && !block.inPast && !block.inWater && block != object) obstacle = block;
            }, this);

            this.movers.forEach(function (mover) {
                var plannedPos = this.coordToPos(mover.plannedCoord.x, mover.plannedCoord.y);

                if (plannedPos.x === checkPos.x && plannedPos.y === checkPos.y && !mover.inPit && !mover.exploded && !mover.inPast && !mover.inWater && mover != object) obstacle = mover;
            }, this);

            return obstacle;
        }
    }, {
        key: 'getObstacleCurrent',
        value: function getObstacleCurrent(x, y) {
            var obstacle = false,
                checkPos = this.coordToPos(x, y);

            this.movables.forEach(function (block) {
                var plannedPos = this.coordToPos(block.x, block.y);

                if (plannedPos.x === checkPos.x && plannedPos.y === checkPos.y && !block.inPit && !block.exploded && !block.inPast) obstacle = block;
            }, this);

            this.movers.forEach(function (mover) {
                var plannedPos = this.coordToPos(mover.x, mover.y);

                if (plannedPos.x === checkPos.x && plannedPos.y === checkPos.y && !mover.inPit && !mover.exploded && !mover.inPast) obstacle = mover;
            }, this);

            return obstacle;
        }
    }, {
        key: 'castPhantomsMoves',
        value: function castPhantomsMoves(resetMovePriorities) {
            this.movers.forEach(function (phantom, index) {
                if (phantom.eIType === EITypeDict.phantom && !phantom.inPast && !phantom.inWater) {
                    /*var action = phantom.defineAction(this.scene.turnNum),
                        inheritAction = phantom.currentDirection;
                    if (action)
                    {
                        var actionSuccess = this.scene.checkObjectMove(phantom, action);
                        if (!actionSuccess)
                            this.scene.checkObjectMove(phantom, inheritAction);
                    }*/
                    if (resetMovePriorities) phantom.movePriority = index;
                    var action = phantom.defineAction(this.scene.turnNum).action,
                        actionSuccess = this.scene.checkObjectMove(phantom, action, phantom.movePriority);

                    /*console.log('phantom action actionSuccess ' + actionSuccess);
                    console.log(this.castPhantomsMoves.caller);*/

                    if (!actionSuccess) {
                        /*if (phantom.currentDirection === this.scene.actions.stay)
                            phantom.moveStory[this.scene.turnNum] = this.scene.actions.stay;*/
                        phantom.currentDirection = this.scene.actions.stay;
                        phantom.move(this.scene.turnNum);
                    }
                }
            }, this);
        }
    }, {
        key: 'castWaterMoves',
        value: function castWaterMoves() {

            this.flowHeads.forEach(function (water) {
                water.checkFloating();
            }, this);
        }
    }, {
        key: 'sendNonActivePhantomsToPast',
        value: function sendNonActivePhantomsToPast() {
            this.movers.forEach(function (phantom) {
                if (phantom.eIType === EITypeDict.phantom && !phantom.inPast) {
                    var action = phantom.defineAction(this.scene.turnNum + 1).action;
                    if (!action) phantom.sendToPast(this.scene.turnNum + 1);
                }
            }, this);
        }
    }, {
        key: 'performTimedActions',
        value: function performTimedActions() {
            this.movables.forEach(function (movable) {
                if (movable.eIType === EITypeDict.bomb || movable.eIType === EITypeDict.phantomBomb) {
                    if (!movable.exploded && !movable.inPast) movable.tickTimer(this.scene.turnNum);
                }
            }, this);
        }
    }, {
        key: 'performTilesActions',
        value: function performTilesActions() {
            var buttonsToPush = [],
                buttonsToUnPush = [];

            this.buttons.forEach(function (button) {
                button.objectAbove = false;
            }, this);

            // update pikes object above status
            for (var j = 0; j < this.rows; j++) {
                for (var i = 0; i < this.columns; i++) {
                    var tile = this.getTile(j, i);
                    if (tile.eIType === EITypeDict.pikes) {
                        // obligatore push buttons whose pikes were under object
                        if (tile.objectAbove) buttonsToPush.push(tile.button);
                        tile.objectAbove = false;
                    }

                    if (tile.eIType === EITypeDict.wall) {
                        // obligatore push buttons whose walls were under object
                        if (tile.objectAbove) buttonsToUnPush.push(tile.button);
                        tile.objectAbove = false;
                    }
                }
            }

            // update water tiles status on just stuff that is floating alreay
            this.waterTiles.forEach(function (waterTile) {
                var obstacle = this.getObstacleCurrent(waterTile.x, waterTile.y);

                if (obstacle.eIType != EITypeDict.phantom || obstacle.eIType != EITypeDict.phantomSpirit) {
                    if (!waterTile.filled && obstacle && obstacle.inWater) {
                        waterTile.performAction(this.scene.turnNum, obstacle);
                    } else if (waterTile.filled && (!obstacle || !obstacle.inWater)) {
                        waterTile.undoAction();
                    } else if (waterTile.filled && waterTile.floatingBlock != obstacle) {
                        // this is special case when one block floats after the other
                        waterTile.performAction(this.scene.turnNum, obstacle);
                    }
                }
            }, this);

            this.movables.forEach(function (block) {
                var blockPos = this.coordToPos(block.x, block.y),
                    tileBelow = this.getTile(blockPos.y, blockPos.x);

                if (tileBelow.eIType === EITypeDict.pit && !tileBelow.filled) {
                    tileBelow.performAction(this.scene.turnNum, block);
                    block.putInPit(this.scene.turnNum);
                }

                if (tileBelow.eIType === EITypeDict.timePort && tileBelow.charged) {
                    tileBelow.performAction(this.scene.turnNum, block);
                }

                if (tileBelow.eIType === EITypeDict.pikesButton || tileBelow.eIType === EITypeDict.wallButton) {
                    tileBelow.objectAbove = true;
                    if (!tileBelow.pushed) buttonsToPush.push(tileBelow);
                }

                // pikes should not go out if block is above

                if (tileBelow.eIType === EITypeDict.pikes && (block.eIType === EITypeDict.block || block.eIType === EITypeDict.phantomBlock)) {
                    tileBelow.objectAbove = true;
                }

                // wall should not go out if any mvable above
                if (tileBelow.eIType === EITypeDict.wall) {
                    tileBelow.objectAbove = true;
                }

                if (tileBelow.eIType === EITypeDict.water && block.eIType != EITypeDict.spirit && block.eIType != EITypeDict.phantomSpirit && !tileBelow.filled) {
                    tileBelow.performAction(this.scene.turnNum, block);
                    if (!block.inWater) block.putInWater(this.scene.turnNum);
                }

                if ((block.eIType === EITypeDict.block || block.eIType === EITypeDict.bomb) && tileBelow.eIType === EITypeDict.phantomTile && !tileBelow.presentObstacle) {
                    tileBelow.performAction(this.scene.turnNum);
                }
            }, this);

            this.movers.forEach(function (mover) {
                var moverPos = this.coordToPos(mover.x, mover.y),
                    tileBelow = this.getTile(moverPos.y, moverPos.x);

                if (tileBelow.eIType === EITypeDict.pit && !tileBelow.filled) {
                    tileBelow.performAction(this.scene.turnNum, mover);
                    mover.putInPit(this.scene.turnNum);
                }

                if (tileBelow.eIType === EITypeDict.timePort && tileBelow.charged) {
                    tileBelow.performAction(this.scene.turnNum, mover);
                }

                if (tileBelow.eIType === EITypeDict.pikesButton || tileBelow.eIType === EITypeDict.wallButton) {
                    tileBelow.objectAbove = true;
                    if (!tileBelow.pushed) buttonsToPush.push(tileBelow);
                }

                // wall should not go out if any mover above
                if (tileBelow.eIType === EITypeDict.wall) {
                    tileBelow.objectAbove = true;
                }

                if (tileBelow.eIType === EITypeDict.water && !tileBelow.filled) {
                    tileBelow.performAction(this.scene.turnNum, mover);
                    if (!mover.inWater) mover.putInWater(this.scene.turnNum);
                }

                if (mover.eIType === EITypeDict.executioner && tileBelow.eIType === EITypeDict.phantomTile && !tileBelow.presentObstacle) {
                    tileBelow.performAction(this.scene.turnNum);
                }
            }, this);

            buttonsToPush.forEach(function (button) {
                button.performAction(this.scene.turnNum, false, false);
            }, this);

            buttonsToUnPush.forEach(function (button) {
                if (!button.objectAbove) button.undoAction(this.scene.turnNum, false, false);
            }, this);

            this.buttons.forEach(function (button) {
                if (button.pushed && !button.objectAbove) {
                    button.undoAction(this.scene.turnNum, false, false);
                }
            }, this);

            // additional check to pike movers
            this.movers.forEach(function (mover) {

                var moverPos = this.coordToPos(mover.x, mover.y),
                    tileBelow = this.getTile(moverPos.y, moverPos.x);

                if (tileBelow.eIType === EITypeDict.pikes && tileBelow.out) {
                    mover.pike(this.scene.turnNum);
                }
            }, this);
        }
    }, {
        key: 'constructMoveTweens',
        value: function constructMoveTweens() {
            this.movables.forEach(function (movable) {
                movable.constructMoveTween();
            }, this);

            this.movers.forEach(function (mover) {
                mover.constructMoveTween();
            }, this);
        }
    }, {
        key: 'undoTimedActions',
        value: function undoTimedActions(inBackTime) {
            this.movables.forEach(function (movable) {
                if (movable.eIType === EITypeDict.bomb || movable.eIType === EITypeDict.phantomBomb) {
                    if (this.scene.turnNum in movable.statusStory && movable.statusStory[this.scene.turnNum] === this.scene.actions.explode) {
                        movable.undoExplosion();

                        if (!inBackTime) delete movable.statusStory[this.scene.turnNum];
                    } else {
                        // condition is used to keep with the gap between tiles and timed actions
                        if (movable.lastUpdateTurnNum === this.scene.turnNum) movable.untickTimer();
                    }
                }
            }, this);
        }
    }, {
        key: 'undoTilesActions',
        value: function undoTilesActions(inBackTime) {
            for (var j = 0; j < this.rows; j++) {
                for (var i = 0; i < this.columns; i++) {
                    var tile = this.getTile(j, i);
                    if (tile.eIType === EITypeDict.pit) {
                        if (tile.story[this.scene.turnNum] === this.scene.actions.fillPit) {
                            tile.undoAction();
                            if (!inBackTime) delete tile.story[this.scene.turnNum];
                        }
                    }

                    /*if (tile.eIType === EITypeDict.pikesButton || tile.eIType === EITypeDict.wallButton)
                    {
                        if (tile.story[this.scene.turnNum] === this.scene.actions.push)
                        {
                            tile.undoAction(this.scene.turnNum, inBackTime);
                            if (!inBackTime)
                                delete tile.story[this.scene.turnNum];
                        }
                    }*/

                    if (tile.eIType === EITypeDict.phantomTile) {
                        if (tile.story[this.scene.turnNum] === this.scene.actions.sendToPast) {
                            tile.undoAction();
                            if (!inBackTime) delete tile.story[this.scene.turnNum];
                        }
                    }

                    if (tile.eIType === EITypeDict.wallButton || tile.eIType === EITypeDict.pikesButton) {
                        if (tile.story[this.scene.turnNum] === this.scene.actions.unPush) {
                            tile.performAction(this.scene.turnNum, inBackTime, true);
                            if (!inBackTime) delete tile.story[this.scene.turnNum];
                        } else if (tile.story[this.scene.turnNum] === this.scene.actions.push) {
                            tile.undoAction(this.scene.turnNum, inBackTime, true);
                            if (!inBackTime) delete tile.story[this.scene.turnNum];
                        }
                    }

                    if (tile.eIType === EITypeDict.wall) {
                        if (tile.story[this.scene.turnNum] === this.scene.actions.getOut) {
                            tile.performAction(this.scene.turnNum, inBackTime);
                            if (!inBackTime) delete tile.story[this.scene.turnNum];
                        } else if (tile.story[this.scene.turnNum] === this.scene.actions.getDown) {
                            tile.undoAction(this.scene.turnNum, inBackTime);
                            if (!inBackTime) delete tile.story[this.scene.turnNum];
                        }
                    }

                    if (tile.eIType === EITypeDict.pikes) {
                        if (tile.story[this.scene.turnNum] === this.scene.actions.getDown) {
                            tile.performAction(this.scene.turnNum, inBackTime);
                            if (!inBackTime) delete tile.story[this.scene.turnNum];
                        } else if (tile.story[this.scene.turnNum] === this.scene.actions.getOut) {
                            tile.undoAction(this.scene.turnNum, inBackTime);
                            if (!inBackTime) delete tile.story[this.scene.turnNum];
                        }
                    }

                    if (tile.eIType === EITypeDict.timePort && !inBackTime) {
                        if (tile.story[this.scene.turnNum] === this.scene.actions.sendToPast) {
                            tile.undoAction(this.scene.turnNum);
                        }
                    }
                }
            }
        }
    }, {
        key: 'constructBackTweens',
        value: function constructBackTweens(inBackTime, fast) {
            this.movers.forEach(function (mover) {
                if (!inBackTime || mover.eIType === EITypeDict.phantom) {
                    mover.constructBackTween(inBackTime, fast);
                }
            }, this);

            this.movables.forEach(function (movable) {
                if (!movable.inPast) movable.constructBackTween(inBackTime, fast);
            }, this);
        }
    }, {
        key: 'undoStatusChange',
        value: function undoStatusChange(inBackTime) {
            this.movers.forEach(function (mover) {
                if (!inBackTime || mover.eIType === EITypeDict.phantom) {
                    mover.undoStatusChange(inBackTime);
                }
            }, this);

            this.movables.forEach(function (movable) {
                movable.undoStatusChange(inBackTime);
            }, this);
        }
    }, {
        key: 'resetDirections',
        value: function resetDirections() {
            this.movables.forEach(function (movable) {
                movable.currentDirection = this.scene.actions.stay;
                movable.plannedCoord.x = movable.x;
                movable.plannedCoord.y = movable.y;
                movable.movable = undefined;
                movable.mover = undefined;
                movable.movePriority = 1000;
            }, this);

            this.movers.forEach(function (mover, index) {
                mover.currentDirection = this.scene.actions.stay;
                mover.plannedCoord.x = mover.x;
                mover.plannedCoord.y = mover.y;
                mover.movePriority = index;
                mover.movable = undefined;
                mover.mover = undefined;
            }, this);
        }
    }, {
        key: 'clearStory',
        value: function clearStory() {
            this.movables.forEach(function (movable) {
                // here we bring from the past those movables who have phantoms
                if (movable.inPast) movable.getFromPast();
                movable.moveStory = {};
                movable.statusStory = {};
            }, this);
            this.movers.forEach(function (mover) {
                mover.moveStory = {};
                mover.statusStory = {};
            }, this);
            for (var j = 0; j < this.rows; j++) {
                for (var i = 0; i < this.columns; i++) {
                    var tile = this.getTile(j, i);
                    tile.story = {};
                }
            }
        }
    }, {
        key: 'checkWinCondition',
        value: function checkWinCondition() {
            var winCondition = true;

            // go through the all tiles

            for (var j = 0; j < this.rows; j++) {
                for (var i = 0; i < this.columns; i++) {
                    var tile = this.getTile(j, i);

                    // if tile is pit and not filled with spirit winCondition is false
                    if (tile.eIType === EITypeDict.pit) {
                        winCondition = winCondition && tile.filled && (tile.hiddenBlock.eIType === EITypeDict.spirit || tile.hiddenBlock.eIType === EITypeDict.phantomSpirit);
                    }
                }
            }

            return winCondition;
        }
    }, {
        key: 'launchPhantomTilesAnimation',
        value: function launchPhantomTilesAnimation() {
            this.phantomTiles.forEach(function (phantomTile) {
                if (phantomTile.needAnimation) phantomTile.launchAnimation();
            }, this);
        }
    }, {
        key: 'getTilesInSquare',
        value: function getTilesInSquare(posX, posY, columns, rows) {
            var tileArray = [];

            for (var j = posY; j < posY + rows; j++) {
                for (var i = posX; i < posX + columns; i++) {
                    if (i >= 0 && i < this.columns && j >= 0 && j < this.rows) {
                        var tile = this.getTile(j, i);

                        if (!tile.exploded && tile.eIType != EITypeDict.tile && tile.eIType != EITypeDict.pit) tileArray.push(tile);
                    }
                }
            }

            return tileArray;
        }
    }, {
        key: 'getObjectsInSquare',
        value: function getObjectsInSquare(posX, posY, columns, rows) {
            var objectArray = [];

            for (var j = posY; j < posY + rows; j++) {
                for (var i = posX; i < posX + columns; i++) {
                    if (i >= 0 && i < this.columns && j >= 0 && j < this.rows) {
                        var tileCoord = this.posToCoord(i, j),
                            obj = this.getObstacleCurrent(tileCoord.x, tileCoord.y);

                        if (obj) objectArray.push(obj);
                    }
                }
            }

            return objectArray;
        }
    }, {
        key: 'coordToPos',
        value: function coordToPos(x, y) {
            var posX = Math.floor((x - this.startX) / this.cellWidth),
                posY = Math.floor((y - this.startY) / this.cellHeight);

            return { x: posX, y: posY };
        }
    }, {
        key: 'posToCoord',
        value: function posToCoord(posX, posY) {
            var x = posX * this.cellWidth + this.cellWidth * 0.5 + this.startX,
                y = posY * this.cellHeight + this.cellHeight * 0.5 + this.startY;

            return new Phaser.Math.Vector2(x, y);
        }
    }, {
        key: 'putInCenter',
        value: function putInCenter(gameWidth, gameHeight) {
            var newStartX = (gameWidth - this.width) * 0.5,
                newStartY = (gameHeight - this.height) * 0.5,
                deltaX = newStartX - this.startX,
                deltaY = newStartY - this.startY;

            this.startX = newStartX;
            this.startY = newStartY;

            this.movers.forEach(function (mover) {
                mover.shiftPosition(deltaX, deltaY);
            }, this);

            this.movables.forEach(function (movable) {
                movable.shiftPosition(deltaX, deltaY);
            }, this);

            for (var j = 0; j < this.rows; j++) {
                for (var i = 0; i < this.columns; i++) {
                    var tile = this.getTile(j, i);
                    tile.shiftPosition(deltaX, deltaY);
                }
            }
        }
    }]);

    return Field;
}();

module.exports = Field;

/***/ }),

/***/ 1440:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tile = __webpack_require__(40);
var EITypeDict = __webpack_require__(18);

var Water = exports.Water = function (_Tile) {
    _inherits(Water, _Tile);

    function Water(scene, coordX, coordY, direction, field) {
        _classCallCheck(this, Water);

        var _this = _possibleConstructorReturn(this, (Water.__proto__ || Object.getPrototypeOf(Water)).call(this, scene, coordX, coordY, field));

        _this.setTexture('water');
        _this.eIType = EITypeDict.water;

        switch (direction) {
            case _this.scene.actions.up:
                _this.setFrame('flow1');
                _this.setAngle(-90);
                _this.animationName = 'waterFlow';
                break;

            case _this.scene.actions.right:
                _this.setFrame('flow1');
                _this.animationName = 'waterFlow';
                break;

            case _this.scene.actions.down:
                _this.setFrame('flow1');
                _this.setAngle(90);
                _this.animationName = 'waterFlow';
                break;

            case _this.scene.actions.left:
                _this.setFrame('flow1');
                _this.setFlipX(true);
                _this.animationName = 'waterFlow';
                break;

            case _this.scene.actions.stay:
                _this.setFrame('still1');
                _this.animationName = 'waterStill';
                break;
        }

        _this.filled = false;
        _this.direction = direction;
        _this.floatingBlock;
        _this.nextTile;
        _this.prevTiles = [];

        // animations

        var stillAnimationsNames = scene.anims.generateFrameNames('water', { prefix: 'still', frames: [1, 2, 3, 4, 3, 2, 1] });
        _this.stillAnimation = scene.anims.create({ key: 'waterStill', frames: stillAnimationsNames, frameRate: 21 });

        var flowAnimationsNames = scene.anims.generateFrameNames('water', { prefix: 'flow', start: 1, end: 10 });
        _this.flowAnimation = scene.anims.create({ key: 'waterFlow', frames: flowAnimationsNames, frameRate: 30 });

        return _this;
    }

    _createClass(Water, [{
        key: 'launchAnimation',
        value: function launchAnimation() {
            this.play(this.animationName);
        }
    }, {
        key: 'checkFloating',
        value: function checkFloating() {
            if (this.floatingBlock) {
                if (this.nextTile && (this.nextTile.floatingBlock && this.nextTile.floatingBlock.currentDirection != this.scene.actions.stay || !this.nextTile.floatingBlock)) {
                    this.floatingBlock.currentDirection = this.direction;
                    this.floatingBlock.move(this.scene.turnNum);
                } else {
                    this.floatingBlock.currentDirection = this.scene.actions.stay;
                    this.floatingBlock.move(this.scene.turnNum);
                }
            }

            this.prevTiles.forEach(function (waterTile) {
                waterTile.checkFloating();
            }, this);
        }
    }, {
        key: 'performAction',
        value: function performAction(turnNum, block) {
            this.filled = true;
            this.story[turnNum] = this.scene.actions.fillPit;
            this.floatingBlock = block;
            this.floatingBlock.currentWaterTile = this;
        }
    }, {
        key: 'undoAction',
        value: function undoAction() {
            this.filled = false;
            this.floatingBlock = undefined;
        }
    }]);

    return Water;
}(Tile);

module.exports = Water;

/***/ }),

/***/ 1441:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tile = __webpack_require__(40);
var EITypeDict = __webpack_require__(18);

var PhantomTile = exports.PhantomTile = function (_Tile) {
	_inherits(PhantomTile, _Tile);

	function PhantomTile(scene, coordX, coordY, row, col, field) {
		_classCallCheck(this, PhantomTile);

		var _this = _possibleConstructorReturn(this, (PhantomTile.__proto__ || Object.getPrototypeOf(PhantomTile)).call(this, scene, coordX, coordY, field));

		_this.presentObstacle = false;
		_this.needAnimation = false;
		_this.eIType = EITypeDict.phantomTile;

		_this.setTexture('phantomTile');
		_this.tileType = (row + col) % 2 ? '1' : '0';
		_this.setFrame(_this.tileType + '1');

		var mainAnimationFramesNames = scene.anims.generateFrameNames('phantomTile', { prefix: _this.tileType, start: 1, end: 7 });
		_this.mainAnimation = scene.anims.create({ key: 'phantomTileAnimation' + _this.tileType, frames: mainAnimationFramesNames,
			frameRate: 14 });
		return _this;
	}

	_createClass(PhantomTile, [{
		key: 'performAction',
		value: function performAction(turnNum) {
			this.presentObstacle = true;
			this.needAnimation = true;
			this.story[turnNum] = this.scene.actions.sendToPast;

			this.once('animationcomplete', function () {
				this.needAnimation = false;
				this.leftEdge.setAlpha(0);
				this.topEdge.setAlpha(0);
				this.rightEdge.setAlpha(0);
				this.bottomEdge.setAlpha(0);
			}, this);
		}
	}, {
		key: 'undoAction',
		value: function undoAction() {
			this.presentObstacle = false;
			this.needAnimation = false;
			this.setFrame(this.tileType + '1');

			this.leftEdge.setAlpha(1);
			this.topEdge.setAlpha(1);
			this.rightEdge.setAlpha(1);
			this.bottomEdge.setAlpha(1);
		}
	}, {
		key: 'launchAnimation',
		value: function launchAnimation() {
			this.play('phantomTileAnimation' + this.tileType);
		}
	}]);

	return PhantomTile;
}(Tile);

module.exports = PhantomTile;

/***/ }),

/***/ 1442:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Leaf = __webpack_require__(1443);

var LeafFactory = exports.LeafFactory = function () {
	function LeafFactory(scene, xShift, yShift, top, bottom) {
		_classCallCheck(this, LeafFactory);

		this.scene = scene;
		this.top = top;
		this.bottom = bottom;
		this.xShift = xShift;
		this.yShift = yShift;

		this.launchList = [];
		this.leafs = this.scene.add.group({
			maxSize: 30
		});
		this.forwardTime = true;

		this.currentTime = 0;
		this.launchTime = 5;

		for (var i = 0; i < 30; i++) {
			var leaf = new Leaf(scene, this);
			this.leafs.add(leaf);

			// lunch initial leafs
			var xPos = xShift + Math.random() * scene.game.scale.width,
			    yPos = yShift + this.top + (this.bottom - this.top) * Math.random(),
			    xVel = 0.3 * Math.random(),
			    yVel = 0.3;

			leaf.launch(xPos, yPos, xVel, yVel, true);
		}
	}

	_createClass(LeafFactory, [{
		key: 'launchLeaf',
		value: function launchLeaf() {
			var leaf = this.leafs.get();
			if (leaf) {
				var xPos = this.xShift + Math.random() * this.scene.game.scale.width,
				    yPos = this.yShift + (this.forwardTime ? this.top : this.bottom),
				    xVel = 0.3 * Math.random(),
				    yVel = 0.3;

				leaf.launch(xPos, yPos, xVel, yVel, this.forwardTime);
			}
		}
	}, {
		key: 'update',
		value: function update(time, delta, forwardTime) {
			if (this.forwardTime != forwardTime) this.forwardTime = forwardTime;

			this.leafs.children.iterate(function (leaf) {
				leaf.update(forwardTime);
			}, this);

			if (this.currentTime <= this.launchTime) {
				this.currentTime++;
			} else {
				this.currentTime = 0;
				this.launchLeaf();
			}
		}
	}, {
		key: 'scaleAndPosition',
		value: function scaleAndPosition(scaleX, scaleY, scale) {
			this.top = 0 * scaleY;
			this.bottom = 75 * scaleY;

			this.leafs.children.iterate(function (leaf) {
				leaf.scaleAndPosition();
			}, this);
		}
	}]);

	return LeafFactory;
}();

module.exports = LeafFactory;

/***/ }),

/***/ 1443:
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Leaf = exports.Leaf = function (_Phaser$GameObjects$I) {
	_inherits(Leaf, _Phaser$GameObjects$I);

	function Leaf(scene, factory) {
		_classCallCheck(this, Leaf);

		var _this = _possibleConstructorReturn(this, (Leaf.__proto__ || Object.getPrototypeOf(Leaf)).call(this, scene, 0, 0, 'leaf'));

		scene.add.existing(_this);

		_this.setActive(false);
		_this.setVisible(false);

		_this.xVel = 0;
		_this.yVel = 0;

		_this.initialScale = 0;
		_this.finalScale = 0;
		_this.scaleStep = 0;

		_this.factory = factory;
		_this.scene = scene;
		_this.lastGameWidth = _this.scene.game.scale.width;
		_this.lastGameHeight = _this.scene.game.scale.height;

		return _this;
	}

	_createClass(Leaf, [{
		key: 'launch',
		value: function launch(xPos, yPos, xVel, yVel, forwardTime) {
			this.setActive(true);
			this.setVisible(true);

			this.x = xPos;
			this.y = yPos;

			this.yVel = yVel;
			this.xVel = xVel;

			// tatal scale used for mobile device, on desktop is always 1
			var totalScale = Math.min(this.scene.game.scale.width / 800, this.scene.game.scale.height / 600);
			this.initialScale = 0.2 * Math.random() * totalScale;
			this.finalScale = (0.5 + 0.5 * Math.random()) * totalScale;
			this.scaleStep = (this.finalScale - this.initialScale) / (this.factory.bottom / this.yVel);

			if (forwardTime) this.setScale(this.initialScale);else this.setScale(this.finalScale);
		}
	}, {
		key: 'update',
		value: function update(forwardTime) {
			if (this.active) {
				var moveSign = forwardTime ? 1 : -3;

				this.setScale(this.scale + moveSign * this.scaleStep);
				this.x += moveSign * this.xVel;
				this.y += moveSign * this.yVel;

				this.xVel += 0.1 * Math.random() - 0.05;

				if (forwardTime) {
					if (this.y >= this.factory.bottom + this.factory.yShift) {
						this.setActive(false);
						this.setVisible(false);
					}
				} else {
					if (this.y <= this.factory.top + this.factory.yShift) {
						this.setActive(false);
						this.setVisible(false);
					}
				}
			}
		}
	}, {
		key: 'scaleAndPosition',
		value: function scaleAndPosition() {
			this.x = this.factory.xShift + (this.x - this.factory.xShift) / this.lastGameWidth * this.scene.game.scale.width;
			this.y = this.factory.yShift + (this.y - this.factory.yShift) / this.lastGameHeight * this.scene.game.scale.height;

			this.lastGameWidth = this.scene.game.scale.width;
			this.lastGameHeight = this.scene.game.scale.height;
		}
	}]);

	return Leaf;
}(Phaser.GameObjects.Image);

module.exports = Leaf;

/***/ }),

/***/ 1444:
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CloseScene = exports.CloseScene = function (_Phaser$Scene) {
    _inherits(CloseScene, _Phaser$Scene);

    function CloseScene() {
        _classCallCheck(this, CloseScene);

        return _possibleConstructorReturn(this, (CloseScene.__proto__ || Object.getPrototypeOf(CloseScene)).call(this, 'CloseScene'));
    }

    _createClass(CloseScene, [{
        key: 'preload',
        value: function preload() {
            //this.customPipeline = this.game.renderer.addPipeline('Custom1', new CustomPipeline(this.game));
        }
    }, {
        key: 'create',
        value: function create() {

            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height;

            this.background = this.add.sprite(gameWidth * 0.5, gameHeight * 0.5, 'openingBack');
            this.background.setDepth(0);

            this.credText = this.add.bitmapText(this.background.getBottomRight().x - 10, this.background.getTopLeft().y + 10, 'insomniaFont', 'Developed by\nKonstantin Dediukhin', 50, 2);
            this.credText.setOrigin(1, 0);
            this.credText.setAlpha(0);

            this.time.delayedCall(4000, function () {
                var textAlphaTween = this.tweens.add({
                    targets: this.credText,
                    props: {
                        alpha: { value: 1, ease: 'Linear' }
                    },
                    duration: 1500
                });
            }, [], this);

            var closingFramesNames = this.anims.generateFrameNames('closing', { start: 1, end: 12 });
            this.closing = this.add.sprite(gameWidth * 0.5, gameHeight * 0.5, 'closing', '1');
            this.closing.setDepth(3);
            this.closingAnimation = this.anims.create({ key: 'closingAnimation', frames: closingFramesNames, frameRate: 6, repeat: -1 });
            this.closing.play('closingAnimation');

            this.closingFront = this.add.sprite(gameWidth * 0.5, gameHeight * 0.5, 'closingFront');
            this.closingFront.setDepth(2);
            this.closingFrontFlowers = this.add.sprite(gameWidth * 0.5, gameHeight * 0.5, 'closingFrontFlowers');
            this.closingFrontFlowers.setDepth(4);

            if (this.game.device.os.desktop) {
                this.backParticles = this.add.particles('mainMenuParticle').setDepth(1).setScale(0.5);

                this.backEmitter = this.backParticles.createEmitter({
                    x: -10,
                    y: -10,
                    lifespan: 7000,
                    speed: { min: 100, max: 150 },
                    radial: true,
                    angle: { min: 0, max: 90 },
                    frequency: 400,
                    rotate: { min: 50, max: 180 }
                });
            }

            if (!this.game.device.os.desktop) {
                this.scaleAndPosition();
            }

            // music and sfx
            this.closingBackSound = this.sound.add('strawDrink', { volume: 0.1 });
            this.closingBackSound.play('', { loop: true });

            if (this.game.soundPaused) {
                this.sound.pauseAll();
            }
        }
    }, {
        key: 'scaleAndPosition',
        value: function scaleAndPosition() {
            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height,
                scale = Math.min(gameWidth / 800, gameHeight / 600);

            this.background.setPosition(gameWidth * 0.5, gameHeight * 0.5);
            this.background.setScale(scale);

            this.closing.setPosition(gameWidth * 0.5, gameHeight * 0.5);
            this.closing.setScale(scale);

            this.closingFront.setPosition(gameWidth * 0.5, gameHeight * 0.5);
            this.closingFront.setScale(scale);

            this.closingFrontFlowers.setPosition(gameWidth * 0.5, gameHeight * 0.5);
            this.closingFrontFlowers.setScale(scale);

            this.credText.setPosition(this.background.getBottomRight().x - 10 * scale, this.background.getTopLeft().y + 10 * scale);
            this.credText.setScale(scale);

            if (this.backParticles) {
                this.backParticles.setScale(scale * 0.5);
                this.backEmitter.setPosition(this.background.getTopLeft().x / (scale * 0.5), this.background.getTopLeft().y / (scale * 0.5));
            }
        }
    }]);

    return CloseScene;
}(Phaser.Scene);

/***/ }),

/***/ 18:
/***/ (function(module, exports) {

var EITypeDict = Object.freeze({
	block: 1,
	bomb: 2,
	executioner: 3,
	phantom: 4,
	phantomBlock: 5,
	phantomBomb: 6,
	phantomSpirit: 7,
	phantomTile: 8,
	pikes: 9,
	pikesButton: 10,
	pit: 11,
	rock: 12,
	spirit: 13,
	tile: 14,
	timePort: 15,
	wall: 16,
	wallButton: 17,
	water: 18

});

module.exports = EITypeDict;

/***/ }),

/***/ 254:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Block = __webpack_require__(117);
var EITypeDict = __webpack_require__(18);

var Bomb = exports.Bomb = function (_Block) {
    _inherits(Bomb, _Block);

    function Bomb(scene, coordX, coordY, timer, field) {
        _classCallCheck(this, Bomb);

        var _this = _possibleConstructorReturn(this, (Bomb.__proto__ || Object.getPrototypeOf(Bomb)).call(this, scene, coordX, coordY, field));

        _this.setTexture('bomb');
        _this.setFrame('out');
        _this.totalTime = Number(timer);
        _this.timeLeft = Number(timer);
        _this.lastUpdateTurnNum = _this.scene.turnNum;
        _this.explodedObjects = [];
        _this.eIType = EITypeDict.bomb;

        _this.timeLeftLabel = _this.scene.add.bitmapText(_this.x, _this.y, 'basicFont', '' + _this.timeLeft, 24);
        _this.timeLeftLabel.setOrigin(0.5);
        _this.timeLeftLabel.setDepth(3);
        return _this;
    }

    _createClass(Bomb, [{
        key: 'tickTimer',
        value: function tickTimer(turnNum) {
            if (!this.exploded && !this.inPast) {
                this.timeLeft--;
                this.timeLeftLabel.setPosition(this.x, this.y);
                this.timeLeftLabel.text = '' + this.timeLeft;
                if (this.timeLeft === 0) {
                    this.explode();
                    this.statusStory[turnNum] = this.scene.actions.explode;
                }
            }
            this.lastUpdateTurnNum = turnNum;
        }
    }, {
        key: 'untickTimer',
        value: function untickTimer() {

            if (!this.exploded && !this.inPast) {
                this.timeLeft++;
                this.timeLeftLabel.setPosition(this.x, this.y);
                this.timeLeftLabel.text = '' + this.timeLeft;
                this.lastUpdateTurnNum--;
            }
        }
    }, {
        key: 'undoExplosion',
        value: function undoExplosion() {
            this.timeLeft++;
            this.lastUpdateTurnNum--;
            this.setAlpha(1);
            this.exploded = false;
            this.explodedObjects.forEach(function (obj) {
                obj.reviveAfterDemolish();
            }, this);
            this.explodedObjects = [];
        }
    }, {
        key: 'explode',
        value: function explode() {
            if (this.checkActiveStatus()) {
                // first eploded status to true to ensure to endless chain explosions from other bombs
                this.exploded = true;
                this.setAlpha(0);

                var bombPos = this.field.coordToPos(this.x, this.y);

                this.explodedObjects = this.explodedObjects.concat(this.field.getTilesInSquare(bombPos.x - 1, bombPos.y - 1, 3, 3));
                this.explodedObjects = this.explodedObjects.concat(this.field.getObjectsInSquare(bombPos.x - 1, bombPos.y - 1, 3, 3));

                this.explodedObjects.forEach(function (obj) {
                    if (obj != this) {
                        if (obj.__proto__.constructor === Bomb) //|| obj.__proto__.constructor === PhantomBomb)
                            {
                                obj.explode();
                            } else {
                            obj.demolish();
                        }
                    }
                }, this);
            }
        }
    }, {
        key: 'sendToPast',
        value: function sendToPast(turnNum) {
            _get(Bomb.prototype.__proto__ || Object.getPrototypeOf(Bomb.prototype), 'sendToPast', this).call(this, turnNum);
            this.timeLeftLabel.setAlpha(0);
        }
    }, {
        key: 'getFromPast',
        value: function getFromPast() {
            _get(Bomb.prototype.__proto__ || Object.getPrototypeOf(Bomb.prototype), 'getFromPast', this).call(this);
            this.timeLeftLabel.setAlpha(1);
        }
    }]);

    return Bomb;
}(Block);

module.exports = Bomb;

/***/ }),

/***/ 255:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EITypeDict = __webpack_require__(18);

var Executioner = exports.Executioner = function (_Phaser$GameObjects$S) {
    _inherits(Executioner, _Phaser$GameObjects$S);

    function Executioner(scene, coordX, coordY, field) {
        _classCallCheck(this, Executioner);

        var _this = _possibleConstructorReturn(this, (Executioner.__proto__ || Object.getPrototypeOf(Executioner)).call(this, scene, coordX, coordY, 'executioner', 'idleRight1'));

        scene.add.existing(_this);

        _this.scene = scene;
        _this.field = field;
        _this.inPit = false;
        _this.inPast = false;
        _this.isPiked = false;
        _this.inWater = false;
        _this.currentWaterTile;
        _this.exploded = false;
        _this.movePriority = 0;
        _this.movable;
        _this.mover;
        _this.currentDirection = _this.scene.actions.stay;
        _this.eIType = EITypeDict.executioner;

        _this.moveStory = {};
        _this.statusStory = {};
        _this.plannedCoord = new Phaser.Math.Vector2(coordX, coordY);

        _this.setDepth(3);

        // animations

        var idleFramesNames = [{ key: 'executioner', frame: 'idleRight2' }, { key: 'executioner', frame: 'idleRight3' }, { key: 'executioner', frame: 'idleRight1' }];

        _this.idleAnimationName = 'idleExec';
        _this.idleAnimation = scene.anims.create({ key: _this.idleAnimationName, frames: idleFramesNames, frameRate: 13 });

        var rightFramesNames = [{ key: 'executioner', frame: 'goRight1' }, { key: 'executioner', frame: 'goRight2' }, { key: 'executioner', frame: 'goRight3' }, { key: 'executioner', frame: 'idleRight1' }];

        _this.goRightAnimationName = 'goRightExec';
        _this.rightAnimation = scene.anims.create({ key: _this.goRightAnimationName, frames: rightFramesNames, frameRate: 13 });

        var upFramesNames = [{ key: 'executioner', frame: 'goUp1' }, { key: 'executioner', frame: 'goUp2' }, { key: 'executioner', frame: 'goUp3' }, { key: 'executioner', frame: 'idleUp' }];

        _this.goUpAnimationName = 'goUpExec';
        _this.upAnimation = scene.anims.create({ key: _this.goUpAnimationName, frames: upFramesNames, frameRate: 13 });

        var downFramesNames = [{ key: 'executioner', frame: 'goDown1' }, { key: 'executioner', frame: 'goDown2' }, { key: 'executioner', frame: 'goDown3' }, { key: 'executioner', frame: 'idleDown' }];

        _this.goDownAnimationName = 'goDownExec';
        _this.downAnimation = scene.anims.create({ key: _this.goDownAnimationName, frames: downFramesNames, frameRate: 13 });

        // in back time animations

        var backIdleFramesNames = [{ key: 'executioner', frame: 'idleRight1' }, { key: 'executioner', frame: 'idleRight3' }, { key: 'executioner', frame: 'idleRight2' }];

        _this.backIdleAnimationName = 'backIdleExec';
        _this.backIdleAnimation = scene.anims.create({ key: _this.backIdleAnimationName, frames: backIdleFramesNames, frameRate: 20 });

        var backRightFramesNames = [{ key: 'executioner', frame: 'goRight3' }, { key: 'executioner', frame: 'goRight2' }, { key: 'executioner', frame: 'goRight1' }, { key: 'executioner', frame: 'idleRight1' }];

        _this.backGoRightAnimationName = 'backGoRightExec';
        _this.backRightAnimation = scene.anims.create({ key: _this.backGoRightAnimationName, frames: backRightFramesNames, frameRate: 20 });

        var backUpFramesNames = [{ key: 'executioner', frame: 'goUp3' }, { key: 'executioner', frame: 'goUp2' }, { key: 'executioner', frame: 'goUp1' }, { key: 'executioner', frame: 'idleUp' }];

        _this.backGoUpAnimationName = 'bakcGoUpExec';
        _this.backUpAnimation = scene.anims.create({ key: _this.backGoUpAnimationName, frames: backUpFramesNames, frameRate: 20 });

        var backDownFramesNames = [{ key: 'executioner', frame: 'goDown3' }, { key: 'executioner', frame: 'goDown2' }, { key: 'executioner', frame: 'goDown1' }, { key: 'executioner', frame: 'idleDown' }];

        _this.backGoDownAnimationName = 'backGoDownExec';
        _this.backDownAnimation = scene.anims.create({ key: _this.backGoDownAnimationName, frames: backDownFramesNames, frameRate: 20 });

        _this.currentAnimation;
        return _this;
    }

    _createClass(Executioner, [{
        key: 'checkActiveStatus',
        value: function checkActiveStatus() {
            return !(this.inPit || this.inPast || this.exploded || this.isPiked);
        }
    }, {
        key: 'move',
        value: function move(turnNum) {
            if (this.checkActiveStatus()) {
                switch (this.currentDirection) {
                    case this.scene.actions.left:
                        this.plannedCoord.x = this.x - this.field.cellWidth;
                        this.plannedCoord.y = this.y;
                        break;
                    case this.scene.actions.right:
                        this.plannedCoord.x = this.x + this.field.cellWidth;
                        this.plannedCoord.y = this.y;
                        break;
                    case this.scene.actions.up:
                        this.plannedCoord.x = this.x;
                        this.plannedCoord.y = this.y - this.field.cellHeight;
                        break;
                    case this.scene.actions.down:
                        this.plannedCoord.x = this.x;
                        this.plannedCoord.y = this.y + this.field.cellHeight;
                        break;
                    case this.scene.actions.stay:
                        this.plannedCoord.x = this.x;
                        this.plannedCoord.y = this.y;
                        break;
                }
            }
        }
    }, {
        key: 'constructMoveTween',
        value: function constructMoveTween() {
            if (this.checkActiveStatus()) {

                this.moveStory[this.scene.turnNum] = this.currentDirection;

                var moveTween = this.scene.tweens.add({
                    targets: this,
                    props: {
                        x: { value: this.plannedCoord.x, ease: 'Quad.easeInOut' },
                        y: { value: this.plannedCoord.y, ease: 'Quad.easeInOut' }
                    },
                    duration: 200
                });

                switch (this.currentDirection) {
                    case this.scene.actions.left:
                        this.setFlipX(true);
                        this.play(this.goRightAnimationName);
                        this.currentAnimation = this.rightAnimation;
                        break;
                    case this.scene.actions.right:
                        this.setFlipX(false);
                        this.play(this.goRightAnimationName);
                        this.currentAnimation = this.rightAnimation;
                        break;
                    case this.scene.actions.up:
                        this.play(this.goUpAnimationName);
                        this.currentAnimation = this.upAnimation;
                        break;
                    case this.scene.actions.down:
                        this.play(this.goDownAnimationName);
                        this.currentAnimation = this.downAnimation;
                        break;
                    case this.scene.actions.stay:
                        if (this.checkActiveStatus()) {
                            this.play(this.idleAnimationName);
                            this.currentAnimation = this.idleAnimation;
                        }
                        break;
                }

                if (this.currentDirection != this.scene.actions.stay && this.eIType === EITypeDict.executioner && !this.scene.game.soundPaused) {
                    this.scene.time.delayedCall(200, function () {
                        if (this.scene) {
                            this.scene.bumpSound.play();
                        }
                    }, [], this);
                }
            }

            if (this.exclamationSign && this.exclamationSign.alpha > 0) {
                var exclamationSignTween = this.scene.tweens.add({
                    targets: this.exclamationSign,
                    props: {
                        x: { value: this.plannedCoord.x, ease: 'Quad.easeInOut' },
                        y: { value: this.plannedCoord.y - this.height * 0.5, ease: 'Quad.easeInOut' }
                    },
                    duration: 200
                });
            }
        }
    }, {
        key: 'constructBackTween',
        value: function constructBackTween(inBackTime, fast) {
            if (this.scene.turnNum in this.moveStory) {
                var undoMove = this.moveStory[this.scene.turnNum],
                    backPoint;

                switch (undoMove) {
                    case this.scene.actions.left:
                        backPoint = { x: this.x + this.field.cellWidth, y: this.y };
                        this.setFlipX(true);
                        this.play(this.backGoRightAnimationName);
                        this.currentAnimation = this.backRightAnimation;
                        break;
                    case this.scene.actions.right:
                        backPoint = { x: this.x - this.field.cellWidth, y: this.y };
                        this.setFlipX(false);
                        this.play(this.backGoRightAnimationName);
                        this.currentAnimation = this.backRightAnimation;
                        break;
                    case this.scene.actions.up:
                        backPoint = { x: this.x, y: this.y + this.field.cellHeight };
                        this.play(this.backGoUpAnimationName);
                        this.currentAnimation = this.backUpAnimation;
                        break;
                    case this.scene.actions.down:
                        backPoint = { x: this.x, y: this.y - this.field.cellHeight };
                        this.play(this.backGoDownAnimationName);
                        this.currentAnimation = this.backDownAnimation;
                        break;
                    case this.scene.actions.stay:
                        backPoint = { x: this.x, y: this.y };
                        this.play(this.backIdleAnimationName);
                        this.currentAnimation = this.backIdleAnimation;
                        break;
                }

                this.plannedCoord = new Phaser.Math.Vector2(backPoint.x, backPoint.y);

                var backTween = this.scene.tweens.add({
                    targets: this,
                    props: {
                        x: { value: this.plannedCoord.x, ease: 'Linear' },
                        y: { value: this.plannedCoord.y, ease: 'Linear' }
                    },
                    duration: fast ? 10 : 100
                });

                if (!inBackTime) delete this.moveStory[this.scene.turnNum];
            }
        }
    }, {
        key: 'undoStatusChange',
        value: function undoStatusChange(inBackTime) {
            if (this.scene.turnNum in this.statusStory) {
                var undoStatus = this.statusStory[this.scene.turnNum];

                switch (undoStatus) {
                    case this.scene.actions.putInPit:
                        this.getFromPit();
                        break;

                    case this.scene.actions.putInWater:
                        this.getFromWater();
                        break;

                    case this.scene.actions.sendToPast:
                        this.getFromPast();
                        if (inBackTime && Object.keys(this.actionList).length > this.scene.turnNum) {
                            this.producePhantom();
                        }
                        break;

                    case this.scene.actions.pike:
                        this.unPike();
                        break;
                }

                if (!inBackTime) delete this.statusStory[this.scene.turnNum];
            }
        }
    }, {
        key: 'putInPit',
        value: function putInPit(turnNum) {
            this.inPit = true;
            if (this.anims.isPlaying) {
                this.once('animationcomplete', function () {
                    this.setFrame('in');
                }, this);
            } else {
                this.setFrame('in');
            }

            this.statusStory[turnNum] = this.scene.actions.putInPit;
        }
    }, {
        key: 'getFromPit',
        value: function getFromPit() {
            this.inPit = false;
            this.setFrame('idleRight1');
        }
    }, {
        key: 'putInWater',
        value: function putInWater(turnNum) {
            this.inWater = true;
            if (this.anims.isPlaying) {
                this.once('animationcomplete', function () {
                    this.setFrame('in');
                }, this);
            } else {
                this.setFrame('in');
            }
            this.statusStory[turnNum] = this.scene.actions.putInWater;
        }
    }, {
        key: 'getFromWater',
        value: function getFromWater() {
            this.inWater = false;
            this.currentWaterTile.undoAction();
            this.currentWaterTile = undefined;
            this.setFrame('idleRight1');
        }
    }, {
        key: 'demolish',
        value: function demolish() {
            this.exploded = true;
            this.setAlpha(0);
        }
    }, {
        key: 'reviveAfterDemolish',
        value: function reviveAfterDemolish() {
            this.exploded = false;
            this.setAlpha(1);
        }
    }, {
        key: 'pike',
        value: function pike(turnNum) {
            this.isPiked = true;
            this.once('animationcomplete', function () {
                this.setFrame('piked');
            }, this);
            this.statusStory[turnNum] = this.scene.actions.pike;
        }
    }, {
        key: 'unPike',
        value: function unPike() {
            this.isPiked = false;
            this.setFrame('idleRight1');
        }
    }, {
        key: 'shiftPosition',
        value: function shiftPosition(deltaX, deltaY) {
            this.x += deltaX;
            this.y += deltaY;
            this.plannedCoord.x += deltaX;
            this.plannedCoord.y += deltaY;
        }
    }, {
        key: 'producePhantom',
        value: function producePhantom() {
            this.scene.producePhantom(this);
            this.moveStory = {};
            this.statusStory = {};
            this.shortenActionList(this.scene.turnNum);
        }
    }]);

    return Executioner;
}(Phaser.GameObjects.Sprite);

module.exports = Executioner;

/***/ }),

/***/ 256:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Block = __webpack_require__(117);
var EITypeDict = __webpack_require__(18);

var Spirit = exports.Spirit = function (_Block) {
    _inherits(Spirit, _Block);

    function Spirit(scene, coordX, coordY, color, field) {
        _classCallCheck(this, Spirit);

        var _this = _possibleConstructorReturn(this, (Spirit.__proto__ || Object.getPrototypeOf(Spirit)).call(this, scene, coordX, coordY, field));

        _this.setTexture('spirit');
        _this.setFrame('idle1');
        _this.setDepth(3);
        _this.eIType = EITypeDict.spirit;

        var idleFramesNames = [{ key: 'spirit', frame: 'idle1' }, { key: 'spirit', frame: 'idle2' }, { key: 'spirit', frame: 'idle1' }, { key: 'spirit', frame: 'idle3' }, { key: 'spirit', frame: 'idle1' }];

        _this.idleAnimationName = 'idleSpirit';
        _this.idleAnimation = scene.anims.create({ key: _this.idleAnimationName, frames: idleFramesNames, frameRate: 9 });
        return _this;
    }

    _createClass(Spirit, [{
        key: 'putInPit',
        value: function putInPit(turnNum) {
            this.inPit = true;
            this.once('animationcomplete', function () {
                this.setFrame('in');
            }, this);
            //this.setAlpha(0.7);
            this.setDepth(1);
            this.statusStory[turnNum] = this.scene.actions.putInPit;

            if (!this.scene.game.soundPaused) {
                this.scene.ghostSound.play();
            }
        }
    }, {
        key: 'getFromPit',
        value: function getFromPit() {
            this.inPit = false;
            this.setDepth(3);
            //this.setAlpha(1);
            this.setFrame('idle1');
        }
    }, {
        key: 'constructMoveTween',
        value: function constructMoveTween() {
            _get(Spirit.prototype.__proto__ || Object.getPrototypeOf(Spirit.prototype), 'constructMoveTween', this).call(this);

            if (!this.inPit) {
                this.play(this.idleAnimationName);
            }
        }
    }]);

    return Spirit;
}(Block);

module.exports = Spirit;

/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EITypeDict = __webpack_require__(18);

var Tile = exports.Tile = function (_Phaser$GameObjects$S) {
        _inherits(Tile, _Phaser$GameObjects$S);

        function Tile(scene, coordX, coordY, field) {
                _classCallCheck(this, Tile);

                var _this = _possibleConstructorReturn(this, (Tile.__proto__ || Object.getPrototypeOf(Tile)).call(this, scene, coordX, coordY, 'plain', '0'));

                scene.add.existing(_this);

                _this.scene = scene;
                _this.field = field;
                _this.obstacle = false;
                _this.exploded = false;
                _this.eIType = EITypeDict.tile;

                _this.story = {};

                _this.setDepth(1);

                // edges

                _this.leftEdge = _this.scene.add.image(_this.x - _this.width / 2, _this.y, 'edge', 'left');
                _this.leftEdge.setOrigin(1, 0.5);
                _this.leftEdge.setDepth(0);

                _this.rightEdge = _this.scene.add.image(_this.x + _this.width / 2, _this.y, 'edge', 'right');
                _this.rightEdge.setOrigin(0, 0.5);
                _this.rightEdge.setDepth(0);

                _this.topEdge = _this.scene.add.image(_this.x, _this.y - _this.height / 2, 'edge', 'top');
                _this.topEdge.setOrigin(0.5, 1);
                _this.topEdge.setDepth(0);

                _this.bottomEdge = _this.scene.add.image(_this.x, _this.y + _this.height / 2, 'edge', 'bottom');
                _this.bottomEdge.setOrigin(0.5, 0);
                _this.bottomEdge.setDepth(0);

                return _this;
        }

        _createClass(Tile, [{
                key: 'shiftPosition',
                value: function shiftPosition(deltaX, deltaY) {
                        this.x += deltaX;
                        this.y += deltaY;

                        this.leftEdge.x += deltaX;
                        this.leftEdge.y += deltaY;
                        this.rightEdge.x += deltaX;
                        this.rightEdge.y += deltaY;
                        this.topEdge.x += deltaX;
                        this.topEdge.y += deltaY;
                        this.bottomEdge.x += deltaX;
                        this.bottomEdge.y += deltaY;
                }
        }]);

        return Tile;
}(Phaser.GameObjects.Sprite);

module.exports = Tile;

/***/ }),

/***/ 533:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Executioner = __webpack_require__(255);
var EITypeDict = __webpack_require__(18);

var Phantom = exports.Phantom = function (_Executioner) {
    _inherits(Phantom, _Executioner);

    function Phantom(scene, coordX, coordY, origin, priority, field) {
        _classCallCheck(this, Phantom);

        var _this = _possibleConstructorReturn(this, (Phantom.__proto__ || Object.getPrototypeOf(Phantom)).call(this, scene, coordX, coordY, field));

        _this.actionList = {};
        _this.movePriority = priority;
        _this.eIType = EITypeDict.phantom;

        Object.assign(_this.actionList, origin.moveStory);
        Object.assign(_this.moveStory, origin.moveStory);
        Object.assign(_this.statusStory, origin.statusStory);
        _this.currentDirection = _this.scene.actions.stay;

        _this.setTexture('phantom');
        _this.setFrame('idleRight1');

        // animations

        var idleFramesNames = [{ key: 'phantom', frame: 'idleRight2' }, { key: 'phantom', frame: 'idleRight3' }, { key: 'phantom', frame: 'idleRight1' }];

        _this.idleAnimationName = 'idlePhantom';
        _this.idleAnimation = scene.anims.create({ key: _this.idleAnimationName, frames: idleFramesNames, frameRate: 13 });

        var rightFramesNames = [{ key: 'phantom', frame: 'goRight1' }, { key: 'phantom', frame: 'goRight2' }, { key: 'phantom', frame: 'goRight3' }, { key: 'phantom', frame: 'idleRight1' }];

        _this.goRightAnimationName = 'goRightPhantom';
        _this.rightAnimation = scene.anims.create({ key: _this.goRightAnimationName, frames: rightFramesNames, frameRate: 13 });

        var upFramesNames = [{ key: 'phantom', frame: 'goUp1' }, { key: 'phantom', frame: 'goUp2' }, { key: 'phantom', frame: 'goUp3' }, { key: 'phantom', frame: 'idleUp' }];

        _this.goUpAnimationName = 'goUpPhantom';
        _this.upAnimation = scene.anims.create({ key: _this.goUpAnimationName, frames: upFramesNames, frameRate: 13 });

        var downFramesNames = [{ key: 'phantom', frame: 'goDown1' }, { key: 'phantom', frame: 'goDown2' }, { key: 'phantom', frame: 'goDown3' }, { key: 'phantom', frame: 'idleDown' }];

        _this.goDownAnimationName = 'goDownPhantom';
        _this.downAnimation = scene.anims.create({ key: _this.goDownAnimationName, frames: downFramesNames, frameRate: 13 });

        // in back time animations

        var backIdleFramesNames = [{ key: 'phantom', frame: 'idleRight1' }, { key: 'phantom', frame: 'idleRight3' }, { key: 'phantom', frame: 'idleRight2' }];

        _this.backIdleAnimationName = 'backIdlePhantom';
        _this.backIdleAnimation = scene.anims.create({ key: _this.backIdleAnimationName, frames: backIdleFramesNames, frameRate: 20 });

        var backRightFramesNames = [{ key: 'phantom', frame: 'goRight3' }, { key: 'phantom', frame: 'goRight2' }, { key: 'phantom', frame: 'goRight1' }, { key: 'phantom', frame: 'idleRight1' }];

        _this.backGoRightAnimationName = 'backGoRightPhantom';
        _this.backRightAnimation = scene.anims.create({ key: _this.backGoRightAnimationName, frames: backRightFramesNames, frameRate: 20 });

        var backUpFramesNames = [{ key: 'phantom', frame: 'goUp3' }, { key: 'phantom', frame: 'goUp2' }, { key: 'phantom', frame: 'goUp1' }, { key: 'phantom', frame: 'idleUp' }];

        _this.backGoUpAnimationName = 'bakcGoUpPhantom';
        _this.backUpAnimation = scene.anims.create({ key: _this.backGoUpAnimationName, frames: backUpFramesNames, frameRate: 20 });

        var backDownFramesNames = [{ key: 'phantom', frame: 'goDown3' }, { key: 'phantom', frame: 'goDown2' }, { key: 'phantom', frame: 'goDown1' }, { key: 'phantom', frame: 'idleDown' }];

        _this.backGoDownAnimationName = 'backGoDownPhantom';
        _this.backDownAnimation = scene.anims.create({ key: _this.backGoDownAnimationName, frames: backDownFramesNames, frameRate: 20 });

        _this.currentAnimation;

        // adding exclamation sign when phantom cant move
        _this.exclamationSign = _this.scene.add.sprite(_this.x, _this.getTopLeft().y, 'exclamationSign', '1').setOrigin(0.5, 0.9);
        var exclamationSignFramesNames = _this.scene.anims.generateFrameNames('exclamationSign', { start: 1, end: 4 });
        _this.exclamationSignAnimation = _this.scene.anims.create({ key: 'exclamationSignAnimation',
            frames: exclamationSignFramesNames, frameRate: 13 });
        _this.exclamationSign.setAlpha(0);
        _this.exclamationSign.setDepth(4);
        return _this;
    }

    _createClass(Phantom, [{
        key: 'defineAction',
        value: function defineAction(turnNum) {
            if (turnNum in this.actionList) {
                return { action: this.actionList[turnNum], moversList: [this], priority: this.movePriority };
            } else {
                return false;
            }
        }
    }, {
        key: 'reviveAfterDemolish',
        value: function reviveAfterDemolish() {
            _get(Phantom.prototype.__proto__ || Object.getPrototypeOf(Phantom.prototype), 'reviveAfterDemolish', this).call(this);
            this.setAlpha(1);
        }
    }, {
        key: 'sendToPast',
        value: function sendToPast(turnNum) {
            this.inPast = true;
            this.setAlpha(0);
            this.statusStory[turnNum] = this.scene.actions.sendToPast;
        }
    }, {
        key: 'getFromPast',
        value: function getFromPast() {
            this.inPast = false;
            this.setAlpha(1);
        }
    }, {
        key: 'shortenActionList',
        value: function shortenActionList(turnNum) {
            var newActionList = {},
                actionListLength = Object.keys(this.actionList).length;

            for (var iNum in this.actionList) {

                if (Number(iNum) - turnNum >= 0) {
                    newActionList[Number(iNum) - turnNum + 1] = this.actionList[iNum];
                }
            }

            this.actionList = {};

            Object.assign(this.actionList, newActionList);
        }
    }, {
        key: 'launchExclamationSign',
        value: function launchExclamationSign() {
            this.exclamationSign.x = this.x;
            this.exclamationSign.y = this.getTopLeft().y;

            this.exclamationSign.setAlpha(1);
            this.exclamationSign.play('exclamationSignAnimation');

            this.exclamationSign.once('animationcomplete', function () {
                this.exclamationSign.setAlpha(0);
            }, this);
        }
    }]);

    return Phantom;
}(Executioner);

module.exports = Phantom;

/***/ }),

/***/ 534:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Block = __webpack_require__(117);
var EITypeDict = __webpack_require__(18);

var PhantomBlock = exports.PhantomBlock = function (_Block) {
	_inherits(PhantomBlock, _Block);

	function PhantomBlock(scene, coordX, coordY, origin, field) {
		_classCallCheck(this, PhantomBlock);

		var _this = _possibleConstructorReturn(this, (PhantomBlock.__proto__ || Object.getPrototypeOf(PhantomBlock)).call(this, scene, coordX, coordY, field));

		_this.setTexture('phantomBlock');
		_this.setFrame('out');
		_this.eIType = EITypeDict.phantomBlock;

		Object.assign(_this.moveStory, origin.moveStory);
		Object.assign(_this.statusStory, origin.statusStory);

		_this.origin = origin;
		return _this;
	}

	_createClass(PhantomBlock, [{
		key: 'getFromPast',
		value: function getFromPast() {
			this.inPast = false;
			this.setAlpha(1);
		}
	}, {
		key: 'reviveAfterDemolish',
		value: function reviveAfterDemolish() {
			_get(PhantomBlock.prototype.__proto__ || Object.getPrototypeOf(PhantomBlock.prototype), 'reviveAfterDemolish', this).call(this);
			this.setAlpha(0.7);
		}
	}]);

	return PhantomBlock;
}(Block);

module.exports = PhantomBlock;

/***/ }),

/***/ 535:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bomb = __webpack_require__(254);
var EITypeDict = __webpack_require__(18);

var PhantomBomb = exports.PhantomBomb = function (_Bomb) {
	_inherits(PhantomBomb, _Bomb);

	function PhantomBomb(scene, coordX, coordY, timer, origin, field) {
		_classCallCheck(this, PhantomBomb);

		var _this = _possibleConstructorReturn(this, (PhantomBomb.__proto__ || Object.getPrototypeOf(PhantomBomb)).call(this, scene, coordX, coordY, timer, field));

		_this.origin = origin;
		_this.setAlpha(0.7);
		_this.eIType = EITypeDict.phantomBomb;

		Object.assign(_this.moveStory, origin.moveStory);
		Object.assign(_this.statusStory, origin.statusStory);
		return _this;
	}

	_createClass(PhantomBomb, [{
		key: 'reviveAfterDemolish',
		value: function reviveAfterDemolish() {
			_get(PhantomBomb.prototype.__proto__ || Object.getPrototypeOf(PhantomBomb.prototype), 'reviveAfterDemolish', this).call(this);
			this.setAlpha(0.7);
		}
	}, {
		key: 'getFromPast',
		value: function getFromPast() {
			_get(PhantomBomb.prototype.__proto__ || Object.getPrototypeOf(PhantomBomb.prototype), 'getFromPast', this).call(this);
			this.setAlpha(0.7);
			this.timeLeftLabel.setAlpha(0.7);
		}
	}]);

	return PhantomBomb;
}(Bomb);

module.exports = PhantomBomb;

/***/ }),

/***/ 536:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Spirit = __webpack_require__(256);
var EITypeDict = __webpack_require__(18);

var PhantomSpirit = exports.PhantomSpirit = function (_Spirit) {
	_inherits(PhantomSpirit, _Spirit);

	function PhantomSpirit(scene, coordX, coordY, origin, field) {
		_classCallCheck(this, PhantomSpirit);

		var _this = _possibleConstructorReturn(this, (PhantomSpirit.__proto__ || Object.getPrototypeOf(PhantomSpirit)).call(this, scene, coordX, coordY, origin.color, field));

		_this.setTexture('phantomSpirit');
		_this.setFrame('idle1');
		_this.eIType = EITypeDict.phantomSpirit;

		Object.assign(_this.moveStory, origin.moveStory);
		Object.assign(_this.statusStory, origin.statusStory);

		_this.origin = origin;

		var idleFramesNames = [{ key: 'phantomSpirit', frame: 'idle1' }, { key: 'phantomSpirit', frame: 'idle2' }, { key: 'phantomSpirit', frame: 'idle1' }, { key: 'phantomSpirit', frame: 'idle3' }];

		_this.idleAnimationName = 'idlePhantomSpirit';
		_this.idleAnimation = scene.anims.create({ key: _this.idleAnimationName, frames: idleFramesNames, frameRate: 9 });
		return _this;
	}

	_createClass(PhantomSpirit, [{
		key: 'reviveAfterDemolish',
		value: function reviveAfterDemolish() {
			_get(PhantomSpirit.prototype.__proto__ || Object.getPrototypeOf(PhantomSpirit.prototype), 'reviveAfterDemolish', this).call(this);
			this.setAlpha(1);
		}
	}]);

	return PhantomSpirit;
}(Spirit);

module.exports = PhantomSpirit;

/***/ }),

/***/ 537:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tile = __webpack_require__(40);
var EITypeDict = __webpack_require__(18);

var Pikes = exports.Pikes = function (_Tile) {
    _inherits(Pikes, _Tile);

    function Pikes(scene, coordX, coordY, color, field) {
        _classCallCheck(this, Pikes);

        var _this = _possibleConstructorReturn(this, (Pikes.__proto__ || Object.getPrototypeOf(Pikes)).call(this, scene, coordX, coordY, field));

        _this.setTexture('pikes');
        _this.setFrame(color + 'Down');
        _this.eIType = EITypeDict.pikes;
        _this.out = false;
        _this.obstacle = false;
        _this.color = color;
        _this.objectAbove = false;
        return _this;
    }

    _createClass(Pikes, [{
        key: 'performAction',
        value: function performAction(turnNum, inBackTime) {
            if (inBackTime || !this.objectAbove) {
                this.out = true;
                this.obstacle = true;
                this.setFrame(this.color + 'Out');
                if (!inBackTime) this.story[turnNum] = this.scene.actions.getOut;
            }
        }
    }, {
        key: 'undoAction',
        value: function undoAction(turnNum, inBackTime) {
            this.out = false;
            this.obstacle = false;
            this.setFrame(this.color + 'Down');
            if (!inBackTime) this.story[turnNum] = this.scene.actions.getDown;
        }
    }, {
        key: 'demolish',
        value: function demolish() {
            this.exploded = true;
            this.setTexture('plain');
        }
    }, {
        key: 'reviveAfterDemolish',
        value: function reviveAfterDemolish() {
            this.exploded = false;
            this.setTexture('pikes');
            if (this.obstacle) {
                this.setFrame(this.color + 'Out');
            } else {
                this.setFrame(this.color + 'Down');
            }
        }
    }]);

    return Pikes;
}(Tile);

module.exports = Pikes;

/***/ }),

/***/ 538:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tile = __webpack_require__(40);
var EITypeDict = __webpack_require__(18);

var PikesButton = exports.PikesButton = function (_Tile) {
    _inherits(PikesButton, _Tile);

    function PikesButton(scene, coordX, coordY, color, field) {
        _classCallCheck(this, PikesButton);

        var _this = _possibleConstructorReturn(this, (PikesButton.__proto__ || Object.getPrototypeOf(PikesButton)).call(this, scene, coordX, coordY, field));

        _this.setTexture('pikesButton');
        _this.setFrame(color + 'Out');
        _this.pushed = false;
        _this.color = color;
        _this.objectAbove = false;
        _this.pikesArray = [];
        _this.eIType = EITypeDict.pikesButton;
        return _this;
    }

    _createClass(PikesButton, [{
        key: 'linkPikes',
        value: function linkPikes() {
            for (var j = 0; j < this.field.rows; j++) {
                for (var i = 0; i < this.field.columns; i++) {
                    var tile = this.field.getTile(j, i);

                    if (tile.eIType === EITypeDict.pikes && tile.color === this.color) {
                        this.pikesArray.push(tile);
                        tile.button = this;
                    }
                }
            }
        }
    }, {
        key: 'performAction',
        value: function performAction(turnNum, inBackTime, inUndo) {
            if (this.frame.name != this.color + 'Down') {
                if (!this.scene.game.soundPaused) this.scene.wallMoveSound.play();
            }
            this.pushed = true;
            this.setFrame(this.color + 'Down');

            if (!(inBackTime || inUndo)) {
                this.pikesArray.forEach(function (pikes) {
                    pikes.performAction(turnNum, inBackTime);
                }, this);

                this.story[turnNum] = this.scene.actions.push;
            }
        }
    }, {
        key: 'undoAction',
        value: function undoAction(turnNum, inBackTime, inUndo) {
            this.pushed = false;
            this.setFrame(this.color + 'Out');

            if (!(inBackTime || inUndo)) {
                this.pikesArray.forEach(function (pikes) {
                    pikes.undoAction(turnNum, inBackTime);
                }, this);

                this.story[turnNum] = this.scene.actions.unPush;
            }
        }
    }, {
        key: 'removePikes',
        value: function removePikes(pikes) {
            var deleteIndex;

            deleteIndex = this.pikesArray.indexOf(pikes);

            if (deleteIndex >= 0) {
                this.pikesArray.splice(deleteIndex, 1);
            }
        }
    }, {
        key: 'demolish',
        value: function demolish() {
            this.exploded = true;
            this.setTexture('plain');
        }
    }, {
        key: 'reviveAfterDemolish',
        value: function reviveAfterDemolish() {
            this.exploded = false;
            this.setTexture('pikesButton');
            this.setFrame(this.color + 'Out');
        }
    }]);

    return PikesButton;
}(Tile);

module.exports = PikesButton;

/***/ }),

/***/ 539:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tile = __webpack_require__(40);
var EITypeDict = __webpack_require__(18);

var Pit = exports.Pit = function (_Tile) {
    _inherits(Pit, _Tile);

    function Pit(scene, coordX, coordY, field) {
        _classCallCheck(this, Pit);

        var _this = _possibleConstructorReturn(this, (Pit.__proto__ || Object.getPrototypeOf(Pit)).call(this, scene, coordX, coordY, field));

        _this.setTexture('pit');
        _this.filled = false;
        _this.hiddenBlock;
        _this.eIType = EITypeDict.pit;
        return _this;
    }

    _createClass(Pit, [{
        key: 'performAction',
        value: function performAction(turnNum, block) {
            this.filled = true;
            this.story[turnNum] = this.scene.actions.fillPit;
            this.hiddenBlock = block;
        }
    }, {
        key: 'undoAction',
        value: function undoAction() {
            this.filled = false;
            this.hiddenBlock = undefined;
        }
    }]);

    return Pit;
}(Tile);

module.exports = Pit;

/***/ }),

/***/ 540:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tile = __webpack_require__(40);
var EITypeDict = __webpack_require__(18);

var Rock = exports.Rock = function (_Tile) {
    _inherits(Rock, _Tile);

    function Rock(scene, coordX, coordY, field) {
        _classCallCheck(this, Rock);

        var _this = _possibleConstructorReturn(this, (Rock.__proto__ || Object.getPrototypeOf(Rock)).call(this, scene, coordX, coordY, field));

        _this.setTexture('rock');
        _this.obstacle = true;
        _this.eIType = EITypeDict.rock;
        return _this;
    }

    _createClass(Rock, [{
        key: 'demolish',
        value: function demolish() {
            this.exploded = true;
            this.setTexture('plain');
        }
    }, {
        key: 'reviveAfterDemolish',
        value: function reviveAfterDemolish() {
            this.exploded = false;
            this.setTexture('rock');
        }
    }]);

    return Rock;
}(Tile);

module.exports = Rock;

/***/ }),

/***/ 541:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tile = __webpack_require__(40);
var EITypeDict = __webpack_require__(18);

var TimePort = exports.TimePort = function (_Tile) {
    _inherits(TimePort, _Tile);

    function TimePort(scene, coordX, coordY, field) {
        _classCallCheck(this, TimePort);

        var _this = _possibleConstructorReturn(this, (TimePort.__proto__ || Object.getPrototypeOf(TimePort)).call(this, scene, coordX, coordY, field));

        _this.setTexture('timePort');
        _this.eIType = EITypeDict.timePort;

        var animFrameNames = [{ key: 'timePort', frame: '1' }, { key: 'timePort', frame: '2' }, { key: 'timePort', frame: '3' }, { key: 'timePort', frame: '4' }, { key: 'timePort', frame: '5' }, { key: 'timePort', frame: '6' }];
        _this.idleAnimation = scene.anims.create({ key: 'idlePort', frames: animFrameNames, frameRate: 13, repeat: -1 });
        _this.charged = true;
        _this.play('idlePort');
        return _this;
    }

    _createClass(TimePort, [{
        key: 'performAction',
        value: function performAction(turnNum, object) {
            this.scene.sendBackInTime(object);
            this.charged = false;
            this.anims.pause();
            this.setFrame('uncharged');
            this.story[turnNum] = this.scene.actions.sendToPast;
        }
    }, {
        key: 'undoAction',
        value: function undoAction(turnNum) {
            this.charged = true;
            this.anims.play('idlePort');
            delete this.story[turnNum];
        }
    }, {
        key: 'demolish',
        value: function demolish() {
            this.exploded = true;
            this.setTexture('plain');
        }
    }, {
        key: 'reviveAfterDemolish',
        value: function reviveAfterDemolish() {
            this.exploded = false;
            this.setTexture('timePort');
        }
    }]);

    return TimePort;
}(Tile);

module.exports = TimePort;

/***/ }),

/***/ 542:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tile = __webpack_require__(40);
var EITypeDict = __webpack_require__(18);

var Wall = exports.Wall = function (_Tile) {
    _inherits(Wall, _Tile);

    function Wall(scene, coordX, coordY, color, field) {
        _classCallCheck(this, Wall);

        var _this = _possibleConstructorReturn(this, (Wall.__proto__ || Object.getPrototypeOf(Wall)).call(this, scene, coordX, coordY, field));

        _this.setTexture('wall');
        _this.setFrame(color + 'Out');
        _this.eIType = EITypeDict.wall;
        _this.out = true;
        _this.obstacle = true;
        _this.color = color;
        _this.objectAbove = false;
        return _this;
    }

    _createClass(Wall, [{
        key: 'performAction',
        value: function performAction(turnNum, inBackTime) {
            this.out = false;
            this.obstacle = false;
            this.setFrame(this.color + 'Down');
            if (!inBackTime) this.story[turnNum] = this.scene.actions.getDown;
        }
    }, {
        key: 'undoAction',
        value: function undoAction(turnNum, inBackTime) {
            if (inBackTime || !this.objectAbove) {
                this.out = true;
                this.obstacle = true;
                this.setFrame(this.color + 'Out');
                if (!inBackTime) this.story[turnNum] = this.scene.actions.getOut;
            }
        }
    }, {
        key: 'demolish',
        value: function demolish() {
            this.exploded = true;
            this.setTexture('plain');
        }
    }, {
        key: 'reviveAfterDemolish',
        value: function reviveAfterDemolish() {
            this.exploded = false;
            this.setTexture('wall');
            if (this.obstacle) {
                this.setFrame(this.color + 'Out');
            } else {
                this.setFrame(this.color + 'Down');
            }
        }
    }]);

    return Wall;
}(Tile);

module.exports = Wall;

/***/ }),

/***/ 543:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tile = __webpack_require__(40);
var EITypeDict = __webpack_require__(18);

var WallButton = exports.WallButton = function (_Tile) {
    _inherits(WallButton, _Tile);

    function WallButton(scene, coordX, coordY, color, field) {
        _classCallCheck(this, WallButton);

        var _this = _possibleConstructorReturn(this, (WallButton.__proto__ || Object.getPrototypeOf(WallButton)).call(this, scene, coordX, coordY, field));

        _this.setTexture('wallButton');
        _this.setFrame(color + 'Out');
        _this.eIType = EITypeDict.wallButton;
        _this.pushed = false;
        _this.color = color;
        _this.objectAbove = false;
        _this.wallsArray = [];
        return _this;
    }

    _createClass(WallButton, [{
        key: 'linkWalls',
        value: function linkWalls() {
            for (var j = 0; j < this.field.rows; j++) {
                for (var i = 0; i < this.field.columns; i++) {
                    var tile = this.field.getTile(j, i);

                    if (tile.eIType === EITypeDict.wall && tile.color === this.color) {
                        this.wallsArray.push(tile);
                        tile.button = this;
                    }
                }
            }
        }
    }, {
        key: 'performAction',
        value: function performAction(turnNum, inBackTime, inUndo) {
            if (this.frame.name != this.color + 'Down') {
                if (!this.scene.game.soundPaused) this.scene.wallMoveSound.play();
            }
            this.pushed = true;
            this.setFrame(this.color + 'Down');

            if (!(inBackTime || inUndo)) {
                this.wallsArray.forEach(function (wall) {
                    if (!wall.exploded) wall.performAction(turnNum, inBackTime);
                }, this);

                this.story[turnNum] = this.scene.actions.push;
            }
        }
    }, {
        key: 'undoAction',
        value: function undoAction(turnNum, inBackTime, inUndo) {
            this.pushed = false;
            this.setFrame(this.color + 'Out');

            if (!(inBackTime || inUndo)) {
                this.wallsArray.forEach(function (wall) {
                    wall.undoAction(turnNum, inBackTime);
                }, this);

                this.story[turnNum] = this.scene.actions.unPush;
            }
        }
    }, {
        key: 'demolish',
        value: function demolish() {
            this.exploded = true;
            this.setTexture('plain');
        }
    }, {
        key: 'reviveAfterDemolish',
        value: function reviveAfterDemolish() {
            this.exploded = false;
            this.setTexture('wallButton');
            this.setFrame(this.color + 'Out');
        }
    }]);

    return WallButton;
}(Tile);

module.exports = WallButton;

/***/ }),

/***/ 544:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(257);

var _BootScene = __webpack_require__(1434);

var _PreloaderScene = __webpack_require__(1435);

var _MainMenuScene = __webpack_require__(1436);

var _LevelChoiceScene = __webpack_require__(1437);

var _PlayScene = __webpack_require__(1438);

var _CloseScene = __webpack_require__(1444);

function detectMob() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    } else {
        return false;
    }
}

// detect mobile

var isMobile = detectMob();

// detect mobile safari

var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

var defaultWidth;
var defaultHeight;

if (isMobile) {
    //console.log('is mobile');
    defaultWidth = document.documentElement.clientWidth;
    defaultHeight = document.documentElement.clientHeight;
    var gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.RESIZE,
            parent: 'gameContainer',
            width: defaultWidth,
            height: defaultHeight,
            autoCenter: Phaser.Scale.CENTER_BOTH
            //zoom: 1 / window.devicePixelRatio
        },
        backgroundColor: '#101e28',
        scene: [_BootScene.BootScene, _PreloaderScene.PreloaderScene, _MainMenuScene.MainMenuScene, _LevelChoiceScene.LevelChoiceScene, _PlayScene.PlayScene, _CloseScene.CloseScene]
    };
} else {
    //console.log('is desktop');
    defaultWidth = 800;
    defaultHeight = 600;
    var gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.NONE,
            parent: 'gameContainer',
            width: defaultWidth,
            height: defaultHeight
        },
        backgroundColor: '#101e28',
        scene: [_BootScene.BootScene, _PreloaderScene.PreloaderScene, _MainMenuScene.MainMenuScene, _LevelChoiceScene.LevelChoiceScene, _PlayScene.PlayScene, _CloseScene.CloseScene]
    };
}

var game = new Phaser.Game(gameConfig);

// workaround for ie not supporting object assign
if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
        'use strict';

        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

document.addEventListener("pause", handlePause, false);

document.addEventListener("resume", handleResume, false);

function handlePause() {
    game.paused = true;
}

function handleResume() {
    game.paused = false;
}

window.addEventListener('resize', windowResized);

window.onload = function () {
    window.windowResized();
};

function windowResized() {
    //console.log('resized called');
    if (game.device.os.desktop) {
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

            game.scale.resize(gameWidth, gameHeight);
        }
    } else {
        //console.log('resize on non desktop device');

        //if (window.innerWidth < window.innerHeight) {

        window.setTimeout(function () {
            /*var w = document.documentElement.clientWidth,
                h = document.documentElement.clientHeight;
             /*var w = window.innerWidth,
                h = window.innerHeight;
             /*var scaleW = w / defaultWidth,
                scaleH = h / defaultHeight,*/

            //var scale = 1 / window.devicePixelRatio;

            //game.scale.setZoom(scale);

            /*game.canvas.setAttribute('style', ' -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1);' +
                ' -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');' +
                ' transform-origin: center center;');*/

            /*var gameWidth = w,
                gameHeight = h;
             game.scale.resize(gameWidth, gameHeight);
             console.log(gameWidth);
            console.log(gameHeight);
            /*console.log(document.documentElement.clientWidth * window.devicePixelRatio);
            console.log(document.documentElement.clientHeight * window.devicePixelRatio);*/
            /*console.log(game.scale.gameSize);
            console.log(game.scale.baseSize);
            console.log(game.scale.displaySize);
            console.log(game.scale.parentSize);*/
            //console.log(game.canvas.getAttribute('style'));


            game.scene.scenes.forEach(function (scene) {
                //if (scene.cameras.main) scene.cameras.main.setViewport(0, 0, gameWidth, gameHeight);
                if (scene.sys.isActive()) {
                    //console.log(scene);
                    scene.scaleAndPosition();
                }
            }, this);
        }, 600);
        //} else {
        /*game.scene.scenes.forEach(function (scene) {
             if (scene.playPortrait && scene.sys.isActive()) {
                scene.respondLandscape();
            }
        }, this);*/
        //}
    }
}

window.windowResized = windowResized;

/***/ })

},[544]);