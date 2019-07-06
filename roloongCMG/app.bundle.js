webpackJsonp([0],{

/***/ 1420:
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
            this.load.image('coolMathSplash', 'assets/CoolMathSplash.png');
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

/***/ 1421:
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
                UIScale = Math.min(this.game.scale.width, this.game.scale.height) / 600;

            this.preloaderBack = this.add.image(gameWidth / 2 - 151, gameHeight * 0.8, 'preloaderBack').setOrigin(0, 0.5);

            this.preloaderBar = this.add.image(gameWidth / 2 - 150, gameHeight * 0.8, 'preloaderBar').setOrigin(0, 0.5);
            this.preloaderBar.setCrop(0, 0, 0, 29);

            this.preloaderBack.alpha = 0;
            this.preloaderBar.alpha = 0;

            this.load.on('progress', function (value) {
                this.preloaderBar.setCrop(0, 0, 300 * value, 29);
            }, this);

            this.splashScreen = this.add.image(gameWidth * 0.5, gameHeight * 0.5, 'coolMathSplash');
            this.splashScreen.setScale(UIScale);

            this.cameras.main.setBackgroundColor('#000000');

            this.time.delayedCall(1500, function () {
                this.splashScreen.alpha = 0;
                this.cameras.main.setBackgroundColor('#1b2337');
                this.preloaderBack.alpha = 1;
                this.preloaderBar.alpha = 1;
            }, [], this);

            this.load.atlas('startButton', 'assets/startButton.png', 'assets/startButton.json');
            this.load.atlas('okayButton', 'assets/okayButton.png', 'assets/okayButton.json');
            this.load.atlas('replayButton', 'assets/replayButton.png', 'assets/replayButton.json');
            this.load.atlas('undoButton', 'assets/undoButton.png', 'assets/undoButton.json');
            this.load.atlas('turnRightButton', 'assets/turnRightButton.png', 'assets/turnRightButton.json');
            this.load.atlas('turnLeftButton', 'assets/turnLeftButton.png', 'assets/turnLeftButton.json');
            this.load.atlas('levelButton', 'assets/levelButton.png', 'assets/levelButton.json');
            this.load.atlas('roloong', 'assets/roloong.png', 'assets/roloong.json');
            this.load.atlas('block', 'assets/block.png', 'assets/block.json');
            this.load.atlas('wallTile', 'assets/wallTile.png', 'assets/wallTile.json');
            this.load.atlas('wormBlock', 'assets/wormBlock.png', 'assets/wormBlock.json');
            this.load.atlas('blockShine', 'assets/blockShine.png', 'assets/blockShine.json');
            this.load.atlas('mainMenuFace', 'assets/mainMenuFace.png', 'assets/mainMenuFace.json');
            this.load.atlas('winPopupFace', 'assets/winPopupFace.png', 'assets/winPopupFace.json');
            this.load.atlas('lastPopupFace', 'assets/lastPopupFace.png', 'assets/lastPopupFace.json');
            this.load.atlas('creditsButton', 'assets/creditsButton.png', 'assets/creditsButton.json');
            this.load.atlas('muteButton', 'assets/muteButton.png', 'assets/muteButton.json');
            this.load.atlas('homeButton', 'assets/homeButton.png', 'assets/homeButton.json');
            //this.load.atlas('bouncy', 'assets/bouncy.png', 'assets/bouncy.json');
            this.load.image('background', 'assets/background.png');
            this.load.image('mainMenuBackground', 'assets/mainMenuBackground.png');
            this.load.image('mainMenuLogo', 'assets/mainMenuLogo.png');
            this.load.image('mainMenuParticle', 'assets/mainMenuParticle.png');
            this.load.image('lock', 'assets/lock.png');
            this.load.image('levelLabelUnderlay', 'assets/levelLabelUnderlay.png');
            this.load.image('winPopupBack', 'assets/winPopupBack.png');
            this.load.image('lastPopupBack', 'assets/lastPopupBack.png');
            this.load.image('tutorialPopupLvl1-1', 'assets/tutorialPopupLvl1-1.png');
            this.load.image('tutorialPopupLvl1-2', 'assets/tutorialPopupLvl1-2.png');
            this.load.image('tutorialPopupLvl2-1', 'assets/tutorialPopupLvl2-1.png');
            this.load.image('tutorialPopupLvl3-1', 'assets/tutorialPopupLvl3-1.png');
            this.load.image('tutorialPopupLvlMob1-1', 'assets/tutorialPopupLvlMob1-1.png');
            this.load.image('tutorialPopupLvlMob1-2', 'assets/tutorialPopupLvlMob1-2.png');
            this.load.image('tutorialPopupLvlMob2-1', 'assets/tutorialPopupLvlMob2-1.png');
            this.load.image('tutorialPopupLvlMob3-1', 'assets/tutorialPopupLvlMob3-1.png');
            this.load.image('winParticle', 'assets/winParticle.png');
            this.load.image('credits', 'assets/credits.png');
            this.load.image('eatParticle', 'assets/eatParticle.png');
            this.load.image('pressRightKey', 'assets/pressRightKey.png');
            this.load.image('pressRightKeyMob', 'assets/pressRightKeyMob.png');
            this.load.image('Utip', 'assets/Utip.png');
            this.load.image('Rtip', 'assets/Rtip.png');

            this.load.bitmapFont('basicFont', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

            this.load.audio('rotateSound', 'assets/music/rotate.mp3');
            this.load.audio('bumpSound', 'assets/music/bump.mp3');
            this.load.audio('buttonSound', 'assets/music/button.mp3');
            this.load.audio('chewSound', 'assets/music/chew.mp3');
            this.load.audio('mainMenuBack', 'assets/music/mainMenuBack.mp3');
            this.load.audio('playBack', 'assets/music/playBack.mp3');
            this.load.audio('successSound', 'assets/music/success.mp3');

            for (var i = 1; i <= 36; i++) {
                this.load.json('level' + i, 'assets/levels/level' + i + '.json');
            }
        }
    }, {
        key: 'scaleAndPositionUI',
        value: function scaleAndPositionUI() {
            //console.log('scale and position in preload scene');

            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height,
                UIScale = Math.min(this.game.scale.width, this.game.scale.height) / 600;

            this.preloaderBar.setPosition(gameWidth / 2 - 150, gameHeight * 0.8);
            this.preloaderBack.setPosition(gameWidth / 2 - 151, gameHeight * 0.8);
            this.splashScreen.setPosition(gameWidth * 0.5, gameHeight * 0.5);
            this.splashScreen.setScale(UIScale);
        }
    }, {
        key: 'create',
        value: function create() {}
    }, {
        key: 'update',
        value: function update() {
            if (this.splashScreen.alpha === 0) this.scene.start('MainMenuScene');
        }
    }]);

    return PreloaderScene;
}(Phaser.Scene);

/***/ }),

/***/ 1422:
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

            //console.log('main menu launched');
            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height;

            this.background = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'mainMenuBackground').setOrigin(0);

            this.credits = this.add.image(gameWidth * 0.5, gameHeight * 0.5, 'credits');
            this.credits.setAlpha(0);
            this.credits.setDepth(104);

            // particle emitter
            var backParticles = this.add.particles('mainMenuParticle');

            var backEmitter = backParticles.createEmitter({
                x: -10,
                y: -10,
                lifespan: 7000,
                speed: { min: 100, max: 150 },
                radial: true,
                angle: { min: 0, max: 90 },
                frequency: 400,
                rotate: { min: 50, max: 180 }
            });

            this.startButton = this.makeButton(gameWidth * 0.5, gameHeight * 0.82, 'startButton', '', this.startGame);
            this.logo = this.add.image(gameWidth * 0.5, gameHeight * 0.3, 'mainMenuLogo');
            this.face = this.add.sprite(gameWidth * 0.5, gameHeight * 0.5, 'mainMenuFace', 'mainMenuFace1');
            this.face.setDepth(103);

            this.creditsButton = this.makeButton(10, gameHeight - 10, 'creditsButton', '', function () {
                this.credits.setAlpha(1);
                this.startButton.disableInteractive();
                this.input.once('pointerdown', function () {
                    this.credits.setAlpha(0);
                    this.startButton.setInteractive();
                }, this);
                this.input.keyboard.once('keydown', function () {
                    this.credits.setAlpha(0);
                    this.startButton.setInteractive();
                }, this);
            });
            this.creditsButton.setOrigin(0, 1);

            this.muteButton = this.makeMuteButton(gameWidth - 10, gameHeight - 10, 'muteButton');
            this.muteButton.setOrigin(1, 1);

            var faceAnimationFrameNames = this.anims.generateFrameNames('mainMenuFace', { prefix: 'mainMenuFace', start: 1, end: 11 });
            this.faceAnimation = this.anims.create({ key: 'mainMenuFaceAnimation', frames: faceAnimationFrameNames, frameRate: 10 });

            this.faceUpDownTween = this.tweens.add({
                targets: this.face,
                props: { y: { value: this.face.y + 20, ease: 'Linear' }
                },
                yoyo: true,
                repeat: -1,
                duration: 2000
            });

            // get player progress
            if (isNaN(localStorage.getItem('roloongLastLevel')) || localStorage.getItem('roloongLastLevel') === null) {
                this.game.lastAvailLevel = 1;
                localStorage.setItem('roloongLastLevel', this.game.lastAvailLevel);
            } else {
                this.game.lastAvailLevel = Number(localStorage.getItem('roloongLastLevel'));
            }

            // set music ans sfx
            this.game.buttonSound = this.sound.add('buttonSound', { volume: 0.5 });
            this.game.introBackMusic = this.sound.add('mainMenuBack', { volume: 0.5 });

            this.game.introBackMusic.play('', { loop: true });

            // scale all ui for mobile
            if (!this.game.device.os.desktop) {
                this.scaleAndPositionUI();
            }
        }
    }, {
        key: 'scaleAndPositionUI',
        value: function scaleAndPositionUI() {

            //console.log('scale UI called');
            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height,
                UIScale = Math.min(this.game.scale.width, this.game.scale.height) / 600;

            this.credits.setScale(UIScale);
            this.creditsButton.setScale(UIScale);
            this.muteButton.setScale(UIScale);
            this.startButton.setScale(UIScale);
            this.logo.setScale(UIScale);
            this.face.setScale(UIScale);

            this.background.setSize(gameWidth, gameHeight);
            this.credits.setPosition(gameWidth * 0.5, gameHeight * 0.5);
            this.creditsButton.setPosition(10 * UIScale, gameHeight - 10 * UIScale);
            this.muteButton.setPosition(gameWidth - 10 * UIScale, gameHeight - 10 * UIScale);
            this.startButton.setPosition(gameWidth * 0.5, gameHeight * 0.82);
            this.logo.setPosition(gameWidth * 0.5, gameHeight * 0.3);
            this.face.setPosition(gameWidth * 0.5, gameHeight * 0.5);

            this.faceUpDownTween.stop();
            this.faceUpDownTween = this.tweens.add({
                targets: this.face,
                props: { y: { value: this.face.y + 20, ease: 'Linear' }
                },
                yoyo: true,
                repeat: -1,
                duration: 2000
            });

            this.cameras.resize(gameWidth, gameHeight);
        }
    }, {
        key: 'makeButton',
        value: function makeButton(posX, posY, imageKey, text, callback) {
            var button = this.add.image(posX, posY, imageKey, 'out').setInteractive().setScrollFactor(0);
            button.setDepth(101);
            button.on('pointerdown', function () {
                button.setFrame('down');
                this.game.buttonSound.play();
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
        value: function makeMuteButton(posX, posY, imageKey) {

            if (this.sound.mute) {
                var startFrame = 'outOn';
            } else {
                var startFrame = 'outOff';
            }

            var button = this.add.image(posX, posY, imageKey, startFrame).setInteractive();
            button.setDepth(101);

            button.on('pointerdown', function () {
                if (this.sound.mute) {
                    button.setFrame('downOn');
                } else {
                    button.setFrame('downOff');
                }
                this.game.buttonSound.play();
            }, this);

            button.on('pointerup', function () {
                if (this.sound.mute) {
                    this.sound.mute = false;
                    button.setFrame('outOff');
                } else {
                    this.sound.mute = true;
                    button.setFrame('outOn');
                }
            }, this);

            return button;
        }
    }, {
        key: 'startGame',
        value: function startGame() {
            this.faceUpDownTween.stop();
            this.face.play('mainMenuFaceAnimation');
            var faceFallTween = this.tweens.add({
                targets: this.face,
                props: { y: { value: this.startButton.y, ease: 'Cubic.easeIn' }
                },
                duration: 1000
            });

            this.input.removeAllListeners();

            if (typeof parent.cmgGameEvent === 'function') parent.cmgGameEvent('start');

            this.face.once('animationcomplete', function () {
                this.scene.start('LevelChoiceScene');
            }, this);
        }
    }]);

    return MainMenuScene;
}(Phaser.Scene);

/***/ }),

/***/ 1423:
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

            this.background = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'mainMenuBackground').setOrigin(0);

            this.game.totalLevels = 36;

            this.buttonsGroup = this.add.group();
            this.buttonsSignesGroup = this.add.group();

            if (this.game.device.os.desktop) {

                var numOfButtonsInRow = 6,
                    numOfButtonsInColumn = 6,
                    betweenButtonsDistanceH = gameWidth / (numOfButtonsInRow + 0.5),
                    betweenButtonsDistanceV = gameWidth / (numOfButtonsInColumn + 1);

                for (var i = 1; i <= this.game.totalLevels; i++) {
                    var posX = ((i - 1) % numOfButtonsInRow + 0.75) * betweenButtonsDistanceH,
                        posY = (Math.floor((i - 1) / numOfButtonsInColumn) + 0.5) * betweenButtonsDistanceV + gameHeight * 0.05;

                    var button = this.makeButton(posX, posY, 'levelButton', i, this.launchLevel);
                    this.buttonsGroup.add(button);

                    if (i > this.game.lastAvailLevel) {
                        button.disableInteractive();
                        var lockImage = this.add.image(posX, posY, 'lock');
                        lockImage.setDepth(103);
                        this.buttonsSignesGroup.add(lockImage);
                    }
                }
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
            }

            this.background.setSize(gameWidth, gameHeight);
            this.cameras.resize(gameWidth, gameHeight);
        }
    }, {
        key: 'makeButton',
        value: function makeButton(posX, posY, imageKey, text, callback) {

            var button = this.add.image(posX, posY, imageKey, 'out').setInteractive();
            button.setDepth(101);
            button.levelNumber = text;
            button.on('pointerdown', function () {
                button.setFrame('down');
                this.game.buttonSound.play();
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
        key: 'scaleAndPositionUI',
        value: function scaleAndPositionUI() {

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

            this.background.setSize(gameWidth, gameHeight);
            this.cameras.resize(gameWidth, gameHeight);
        }
    }, {
        key: 'launchLevel',
        value: function launchLevel(levelNumber) {
            this.game.levelNumber = levelNumber;
            this.game.introBackMusic.stop();

            if (typeof parent.cmgGameEvent === 'function') parent.cmgGameEvent('start', '' + levelNumber);

            this.scene.start('PlayScene');
        }
    }]);

    return LevelChoiceScene;
}(Phaser.Scene);

/***/ }),

/***/ 1424:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlainCollider = __webpack_require__(252);
var RoloongTypeDict = __webpack_require__(79);
var Worm = __webpack_require__(1427);
var ColoredBlock = __webpack_require__(1429);
var GreyBlock = __webpack_require__(1430);
var Wall = __webpack_require__(1431);

var PlayScene = exports.PlayScene = function (_Phaser$Scene) {
    _inherits(PlayScene, _Phaser$Scene);

    function PlayScene() {
        _classCallCheck(this, PlayScene);

        return _possibleConstructorReturn(this, (PlayScene.__proto__ || Object.getPrototypeOf(PlayScene)).call(this, 'PlayScene'));
    }

    _createClass(PlayScene, [{
        key: 'create',
        value: function create() {

            this.modes = { standing: 1, rotating: 2, falling: 3, movingBack: 4, eatAnimation: 5, rotatingBack: 6, popupShown: 7 };
            this.currentMode = this.modes.standing;

            PlainCollider.initiate(this);

            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height,
                scale = Math.min(gameWidth, gameHeight) / 600;

            this.background = this.add.image(gameWidth * 0.5, gameHeight * 0.5, 'background');

            // collider groups

            this.wallsCollGroup = PlainCollider.registerNewCollGroup('wallsCollGroup');
            this.blocksCollGroup = PlainCollider.registerNewCollGroup('blocksCollGroup');

            // groups
            // graups intersects, falling is to check whether all blocks fallen

            this.maze = this.add.group();
            this.falling = this.add.group();

            // load level

            this.leftMostPoint = undefined;
            this.rightMostPoint = undefined;
            this.topMostPoint = undefined;
            this.bottomMostPoint = undefined;

            this.loadLevel();

            PlainCollider.refreshPairs();

            // set scene camera
            this.rotationCenter = new Phaser.Math.Vector2((this.leftMostPoint + this.rightMostPoint) * 0.5, (this.topMostPoint + this.bottomMostPoint) * 0.5);

            this.cameras.main.startFollow(this.rotationCenter, true);

            this.background.setPosition(this.rotationCenter.x, this.rotationCenter.y);

            // var to track falling process
            this.numberOfFalling = this.falling.getLength() + 1;

            this.acceptInputGraphics = this.add.graphics({ fillStyle: { color: 0xff0000 } });
            this.acceptInputGraphics.fillRect(0, 0, 50, 50);

            this.acceptInputGraphics.alpha = 0;

            // eating process
            this.eatChecked = false;
            this.checkAllEaten = false;

            // level label
            this.levelLabelUnderlay = this.add.image(10000 + gameWidth * 0.5, 10000 + gameHeight * 0.02, 'levelLabelUnderlay');
            this.levelLabelUnderlay.setOrigin(0.5, 0);

            this.levelLabel = this.add.bitmapText(10000 + gameWidth * 0.5, this.levelLabelUnderlay.y + 25, 'basicFont', 'level ' + this.game.levelNumber, 38);
            this.levelLabel.setOrigin(0.5, 0.5);

            // win popup
            this.winPopupBack = this.add.image(gameWidth * 0.5 - 10000, gameHeight * 0.5 - 10000, 'winPopupBack');

            this.facePath = new Phaser.Curves.Path(gameWidth * 0.5 - 10000 + 50, gameHeight * 0.4 - 10000);
            this.facePath.circleTo(50, true);

            this.winPopupFace = this.add.follower(this.facePath, gameWidth * 0.5 - 10000 + 50, gameHeight * 0.4 - 10000, 'winPopupFace');
            var facialAnimation = this.anims.create({ key: 'faceAnim', frames: this.anims.generateFrameNames('winPopupFace', { start: 1, end: 10 }),
                frameRate: 20, repeat: -1 });
            this.winPopupFace.setDepth(21);

            var pressRightKeyImage = this.game.device.os.desktop ? 'pressRightKey' : 'pressRightKeyMob';

            this.winPressRightKey = this.add.image(this.winPopupBack.x, this.winPopupBack.getBottomRight().y - 20, pressRightKeyImage);
            this.winPressRightKey.setDepth(21);
            this.winPressRightKey.setOrigin(0.5, 1);
            this.winPressRightKey.setTint(0xdf285f);
            this.disableWinPopup();

            this.winParticles = this.add.particles('winParticle');
            this.winParticles.setDepth(20);

            this.winEmitterRed = this.winParticles.createEmitter({
                follow: this.winPopupFace,
                lifespan: 1500,
                followOffset: new Phaser.Math.Vector2(-30 * scale, 60 * scale),
                frequency: 60,
                rotate: { min: 50, max: 180 },
                scale: { start: 0.8, end: 0.1 },
                alpha: { start: 1, end: 0.3 },
                speedY: 100,
                speedX: 0,
                tint: 0xdf285f
            });
            this.winEmitterRed.stop();

            this.winEmitterGreen = this.winParticles.createEmitter({
                follow: this.winPopupFace,
                lifespan: 1500,
                followOffset: new Phaser.Math.Vector2(-15 * scale, 70 * scale),
                frequency: 60,
                rotate: { min: 50, max: 180 },
                scale: { start: 0.8, end: 0.1 },
                alpha: { start: 1, end: 0.3 },
                speedY: 100,
                speedX: 0,
                tint: 0x1dba8c
            });
            this.winEmitterGreen.stop();

            this.winEmitterYellow = this.winParticles.createEmitter({
                follow: this.winPopupFace,
                lifespan: 1500,
                followOffset: new Phaser.Math.Vector2(15 * scale, 70 * scale),
                frequency: 60,
                rotate: { min: 50, max: 180 },
                scale: { start: 0.8, end: 0.1 },
                alpha: { start: 1, end: 0.3 },
                speedY: 100,
                speedX: 0,
                tint: 0xeae95d
            });
            this.winEmitterYellow.stop();

            this.winEmitterOrange = this.winParticles.createEmitter({
                follow: this.winPopupFace,
                lifespan: 1500,
                followOffset: new Phaser.Math.Vector2(30 * scale, 60 * scale),
                frequency: 60,
                rotate: { min: 50, max: 180 },
                scale: { start: 0.8, end: 0.1 },
                alpha: { start: 1, end: 0.3 },
                speedY: 100,
                speedX: 0,
                tint: 0xe88d29
            });
            this.winEmitterOrange.stop();

            // last popup
            this.lastPopupBack = this.add.image(gameWidth * 0.5 - 10000, gameHeight * 0.5 - 10000, 'lastPopupBack');

            this.lastFacePath = new Phaser.Curves.Path(gameWidth * 0.5 - 10000 - 50, gameHeight * 0.35 - 10000);
            var lastPoint = new Phaser.Math.Vector2(gameWidth * 0.5 - 10000 - 50, gameHeight * 0.35 - 10000);

            for (var i = 0; i < 9; i++) {
                var xDir = 10,
                    ySing = i % 2 === 0 ? 1 : -1,
                    yDir = ySing * 20;

                lastPoint.x += xDir;
                lastPoint.y += yDir;

                this.lastFacePath.lineTo(lastPoint.x, lastPoint.y);
            }

            this.lastPopupFace = this.add.follower(this.lastFacePath, gameWidth * 0.5 - 10000 - 50, gameHeight * 0.35 - 10000, 'lastPopupFace');
            var lastFacialAnimation = this.anims.create({ key: 'lastFaceAnim', frames: this.anims.generateFrameNames('lastPopupFace', { frames: [1, 2, 3, 4, 3, 2, 1] }), frameRate: 20, repeat: -1 });
            this.lastPopupFace.setDepth(21);

            this.lastOkayButton = this.makeButton(this.lastPopupBack.x, this.lastPopupBack.getBottomRight().y - 10, 'okayButton', '', function () {
                this.game.backgroundMusic.stop();
                this.scene.start('MainMenuScene');
            });
            this.lastOkayButton.setOrigin(0.5, 1);
            this.disableLastPopup();

            // buttons
            this.replayButton = this.makeButton(gameWidth * 0.5 + 50 + 10000, gameHeight - 20 + 10000, 'replayButton', '', this.restartLevel);
            this.replayButton.setOrigin(0.5, 1);

            this.undoButton = this.makeButton(gameWidth * 0.5 - 50 + 10000, gameHeight - 20 + 10000, 'undoButton', '', this.undoLastMove);
            this.undoButton.setOrigin(0.5, 1);

            this.homeButton = this.makeButton(gameWidth + 10000 - 10, 10000 + 10, 'homeButton', '', function () {
                this.uKey.destroy();
                this.leftKey.destroy();
                this.rightKey.destroy();
                this.rKey.destroy();
                this.scene.start('LevelChoiceScene');
            });
            this.homeButton.setOrigin(1, 0);

            // tips for desktop version
            if (this.game.device.os.desktop && this.game.levelNumber === 1) {
                this.uTip = this.add.image(this.undoButton.getTopLeft().x - 8, this.undoButton.getTopLeft().y, 'Utip');
                this.uTip.setOrigin(1, 0);

                this.rTip = this.add.image(this.replayButton.getBottomRight().x + 8, this.replayButton.getTopLeft().y, 'Rtip');
                this.rTip.setOrigin(0);
            }

            // mobile buttons
            if (!this.game.device.os.desktop) {
                this.turnLeftButton = this.makeButton(10 + 10000, gameHeight - 10 + 10000, 'turnLeftButton', '', function () {
                    if (this.playing && this.currentMode != this.modes.movingBack && this.currentMode != this.modes.rotatingBack) this.rotateMaze('left');
                });
                this.turnLeftButton.setOrigin(0, 1);

                this.turnRightButton = this.makeButton(gameWidth - 10 + 10000, gameHeight - 10 + 10000, 'turnRightButton', '', function () {
                    if (this.playing && this.currentMode != this.modes.movingBack && this.currentMode != this.modes.rotatingBack) this.rotateMaze('right');
                });
                this.turnRightButton.setOrigin(1, 1);
            }

            // set auxilllary cameras
            this.HUDCamera = this.cameras.add(0, 0, gameWidth, gameHeight);
            this.HUDCamera.setScroll(10000, 10000);

            this.popupCamera = this.cameras.add(0, 0, gameWidth, gameHeight);
            this.popupCamera.setScroll(-10000, -10000);

            // controls
            this.nKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
            this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
            this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            this.uKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
            this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

            this.rKey.on('down', function () {
                this.restartLevel();
            }, this);

            this.uKey.on('down', function () {
                if (this.playing && this.currentMode != this.modes.movingBack && this.currentMode != this.modes.rotatingBack) this.undoLastMove();
            }, this);

            this.leftKey.on('down', function () {
                if (this.playing && this.currentMode != this.modes.movingBack && this.currentMode != this.modes.rotatingBack) this.rotateMaze('left');
            }, this);

            this.rightKey.on('down', function () {
                if (this.playing && this.currentMode != this.modes.movingBack && this.currentMode != this.modes.rotatingBack) this.rotateMaze('right');
            }, this);

            // pending action - if action was called during rotation
            this.pendingAction = undefined;
            this.pendingDirection = undefined;
            this.pendingMoveBack = false;

            // undo actions stuff
            this.turnsArray = [];
            this.eatenBlocks = [];
            this.eatenBlocks[0] = [];
            this.numberMovingBackObjects = 0;
            this.backTurns = [];

            // eating emitter
            this.eatParticle = this.add.particles('eatParticle');
            this.eatParticle.setDepth(20);

            this.eatEmitter1 = this.eatParticle.createEmitter({
                x: 0,
                y: 0,
                speed: { min: 0, max: 120 },
                angle: { min: 180, max: 360 },
                scale: { start: 1, end: 0 },
                frequency: -1,
                lifespan: 600
            });

            this.eatEmitter2 = this.eatParticle.createEmitter({
                x: 0,
                y: 0,
                speed: { min: 0, max: 120 },
                angle: { min: 180, max: 360 },
                scale: { start: 1, end: 0 },
                frequency: -1,
                lifespan: 600
            });

            // tutorials
            this.currentTutorial = undefined;
            this.tutorialPressRightKey = undefined;
            this.pressRightKeyTween = undefined;
            this.pendingTutMode = undefined;

            this.showTutorial();

            // music and sfx
            if (!this.game.backgroundMusic || this.game.backgroundMusic && !this.game.backgroundMusic.isPlaying) {
                this.game.backgroundMusic = this.sound.add('playBack', { volume: 0.5 });
                this.game.backgroundMusic.play('', { loop: true });
            }

            this.fallSound = this.sound.add('bumpSound', { volume: 0.3 });
            this.rotateSound = this.sound.add('rotateSound', { volume: 0.3 });
            this.chewSound = this.sound.add('chewSound');
            this.winSound = this.sound.add('successSound');

            // mobile scaling
            if (!this.game.device.os.desktop) {
                this.scaleAndPositionUI();
            }

            //debug stuff
            this.debugGraphics = this.add.graphics({ lineStyle: { color: 0xff0000 } });

            this.playing = true;
            /*this.input.on('pointerdown', function(){
                this.playing = !this.playing
            }, this);*/
        }
    }, {
        key: 'loadLevel',
        value: function loadLevel() {
            this.level = this.cache.json.get('level' + this.game.levelNumber);

            for (var p in this.level) {
                var platform = this.level[p];

                switch (platform.wallType) {
                    case 'wall':
                        var wall = new Wall(this, platform.pos[0], platform.pos[1], p);
                        PlainCollider.addObject(wall, wall.vertices);
                        PlainCollider.assignCollGroup(wall, 'wallsCollGroup');
                        wall.collWith = [this.blocksCollGroup];
                        this.maze.add(wall);
                        this.findLevelBorders(wall);

                        break;

                    case 'worm':
                        this.worm = new Worm(this, platform.pos, platform.color, p);
                        PlainCollider.addObject(this.worm, this.worm.vertices);
                        PlainCollider.assignCollGroup(this.worm, 'blocksCollGroup');
                        this.worm.collWith = [this.wallsCollGroup, this.blocksCollGroup];
                        //this.falling.add(this.worm);

                        break;

                    case 'block':
                        var block = new ColoredBlock(this, platform.pos[0], platform.pos[1], platform.color1, platform.color2, p);
                        PlainCollider.addObject(block, block.vertices);
                        PlainCollider.assignCollGroup(block, 'blocksCollGroup');
                        block.collWith = [this.wallsCollGroup, this.blocksCollGroup];
                        this.maze.add(block);
                        this.falling.add(block);

                        break;

                    case 'greyBlock':
                        var block = new GreyBlock(this, platform.pos[0], platform.pos[1], p);
                        PlainCollider.addObject(block, block.vertices);
                        PlainCollider.assignCollGroup(block, 'blocksCollGroup');
                        block.collWith = [this.wallsCollGroup, this.blocksCollGroup];
                        this.maze.add(block);
                        this.falling.add(block);

                        break;

                }
            }
        }
    }, {
        key: 'showTutorial',
        value: function showTutorial(number) {
            if (!number) {
                number = 1;
            }

            var imageKey;

            if (this.game.device.os.desktop) imageKey = 'tutorialPopupLvl' + this.game.levelNumber + '-' + number;else imageKey = 'tutorialPopupLvlMob' + this.game.levelNumber + '-' + number;

            /*console.log(imageKey);
            console.log(this.cache.binary.has(imageKey));*/

            if (this.textures.exists(imageKey)) {
                // scaling for mobile
                var scale = Math.min(this.game.scale.width, this.game.scale.height) / 600;

                this.currentTutorial = this.add.image(this.game.scale.width * 0.5 - 10000, this.game.scale.height * 0.5 - 400 - 10000, imageKey);
                this.currentTutorial.setScale(scale);

                var pressRightKeyImage = this.game.device.os.desktop ? 'pressRightKey' : 'pressRightKeyMob';

                this.tutorialPressRightKey = this.add.image(this.game.scale.width * 0.5 - 10000, this.game.scale.height * 0.5 - 10000 + this.currentTutorial.displayHeight * 0.5 - 10 * scale, pressRightKeyImage);
                this.tutorialPressRightKey.setTint(0x1b2337);
                this.tutorialPressRightKey.setAlpha(0);
                this.tutorialPressRightKey.setScale(scale);
                this.tutorialPressRightKey.setOrigin(0.5, 1);

                this.pressRightKeyTween = this.tweens.add({
                    targets: this.tutorialPressRightKey,
                    props: { alpha: { value: 1, ease: 'Linear' } },
                    duration: 700,
                    yoyo: true,
                    repeat: -1,
                    delay: 1200
                });

                this.pendingTutMode = this.currentMode;
                this.currentMode = this.modes.popupShown;

                var showUpTweenTutorial = this.tweens.add({
                    targets: this.currentTutorial,
                    props: { y: { value: this.game.scale.height * 0.5 - 10000, ease: 'Bounce.easeOut' }
                    },
                    duration: 1000
                });

                if (this.game.levelNumber === 1 && number === 1) {
                    this.pendingAction = this.showTutorial;
                    this.pendingDirection = 2;
                }

                if (this.game.device.os.desktop) this.rightKey.once('down', this.hideTutorial, this);else this.input.once('pointerup', this.hideTutorial, this);
            }
        }
    }, {
        key: 'hideTutorial',
        value: function hideTutorial() {
            //console.log('hideTutorial called');
            this.currentTutorial.alpha = 0;
            //this.tutorialOkayButton.alpha = 0;
            this.tutorialPressRightKey.alpha = 0;
            this.pressRightKeyTween.stop();
            //this.tutorialOkayButton.disableInteractive();
            this.currentMode = this.pendingTutMode;
        }
    }, {
        key: 'restartLevel',
        value: function restartLevel() {
            if (typeof parent.cmgGameEvent === 'function') parent.cmgGameEvent('replay', '' + this.game.levelNumber);

            this.scene.restart();
            this.uKey.destroy();
            this.leftKey.destroy();
            this.rightKey.destroy();
            this.rKey.destroy();
        }
    }, {
        key: 'findLevelBorders',
        value: function findLevelBorders(platform) {

            // function finds borders of the current level

            if (typeof this.leftMostPoint !== 'undefined') {
                if (this.leftMostPoint > platform.leftPointWall) this.leftMostPoint = platform.leftPointWall;
            } else {
                this.leftMostPoint = platform.leftPointWall;
            }

            if (typeof this.rightMostPoint !== 'undefined') {
                if (this.rightMostPoint < platform.rightPointWall) this.rightMostPoint = platform.rightPointWall;
            } else {
                this.rightMostPoint = platform.rightPointWall;
            }

            if (typeof this.topMostPoint !== 'undefined') {
                if (this.topMostPoint > platform.topPointWall) this.topMostPoint = platform.topPointWall;
            } else {
                this.topMostPoint = platform.topPointWall;
            }

            if (typeof this.bottomMostPoint !== 'undefined') {
                if (this.bottomMostPoint < platform.bottomPointWall) this.bottomMostPoint = platform.bottomPointWall;
            } else {
                this.bottomMostPoint = platform.bottomPointWall;
            }
        }
    }, {
        key: 'rotateMaze',
        value: function rotateMaze(direction, inPending) {
            if (this.currentMode === this.modes.standing || this.currentMode === this.modes.rotatingBack) {

                this.rotateSound.play();

                this.freezeForRotation();

                var rotAngle;

                if (direction === 'right') {
                    rotAngle = Math.PI / 2;
                } else {
                    rotAngle = -Math.PI / 2;
                }

                if (this.currentMode !== this.modes.rotatingBack) {
                    if (!inPending) {
                        this.turnsArray.push(direction);
                        this.eatenBlocks[this.eatenBlocks.length] = [];
                    } else {
                        this.turnsArray[this.turnsArray.length - 1] = this.turnsArray[this.turnsArray.length - 1].concat(',', direction);
                    }
                }

                this.maze.children.each(function (rawWall) {

                    //console.log(newCenter);    
                    rawWall.fallen = false;
                    var wall;
                    // if we are dealing with colored or grey block we dont want them to rotate oover their center
                    if (rawWall.roloongType === RoloongTypeDict.coloredBlock || rawWall.roloongType === RoloongTypeDict.greyBlock) {
                        wall = { rotation: 0 };
                        if (rawWall.originY === 1) {
                            // check whether there is a scele bounce tween
                            if (this.tweens.isTweening(rawWall)) {
                                this.tweens.getTweensOf(rawWall).forEach(function (tween) {
                                    tween.stop();
                                }, this);
                            }

                            //console.log('stop scale tween on block');
                            rawWall.y = rawWall.getBottomRight().y - 15;
                            rawWall.setOrigin(0.5, 0.5);
                            rawWall.setScale(1, 1);
                        }
                    } else {
                        wall = rawWall;
                    }

                    var rotTween = this.tweens.add({
                        targets: wall,
                        props: {
                            rotation: { value: wall.rotation + rotAngle, ease: 'Sine.easeInOut' }
                        },
                        duration: 500
                    });

                    var prevRotation = wall.rotation;

                    rotTween.setCallback('onUpdate', function () {
                        var rotDelta = wall.rotation - prevRotation,
                            newCenter = new Phaser.Math.Vector2(rawWall.x - this.rotationCenter.x, rawWall.y - this.rotationCenter.y),
                            rotateMatrix = new Phaser.Math.Matrix3();
                        rotateMatrix.fromArray([Math.cos(rotDelta), Math.sin(rotDelta), 0, -Math.sin(rotDelta), Math.cos(rotDelta), 0, 0, 0]);
                        newCenter.transformMat3(rotateMatrix);
                        newCenter.add(new Phaser.Math.Vector2(this.rotationCenter.x, this.rotationCenter.y));
                        prevRotation = wall.rotation;
                        rawWall.x = newCenter.x;
                        rawWall.y = newCenter.y;
                    }, [], this);

                    // rotate collider only for thhose who has one
                    rotTween.setCallback('onComplete', function () {
                        if (rawWall.collider) {
                            PlainCollider.rotateCollider(rawWall, rotAngle, new Phaser.Math.Vector2(this.rotationCenter.x, this.rotationCenter.y));
                        }
                        if ((rawWall.roloongType === RoloongTypeDict.coloredBlock || rawWall.roloongType === RoloongTypeDict.greyBlock) && !rawWall.eaten && this.currentMode !== this.modes.rotatingBack) {
                            if (!inPending) {
                                rawWall.posArray.push([rawWall.x, rawWall.y]);
                            } else {
                                rawWall.posArray[rawWall.posArray.length - 1] = [rawWall.x, rawWall.y];
                            }
                        }
                    }, [], this);
                }, this);

                if (this.worm) {
                    this.worm.fallen = false;

                    if (this.currentMode !== this.modes.rotatingBack) this.worm.colorArray.push(this.worm.color);

                    this.worm.children.each(function (wormBlock) {

                        var falseWorm = { rotation: 0 };

                        var rotTween = this.tweens.add({
                            targets: falseWorm,
                            props: {
                                rotation: { value: falseWorm.rotation + rotAngle, ease: 'Sine.easeInOut' }
                            },
                            duration: 500
                        });

                        var prevRotation = falseWorm.rotation;

                        rotTween.setCallback('onUpdate', function () {
                            var rotDelta = falseWorm.rotation - prevRotation,
                                newCenter = new Phaser.Math.Vector2(wormBlock.x - this.rotationCenter.x, wormBlock.y - this.rotationCenter.y),
                                rotateMatrix = new Phaser.Math.Matrix3();
                            rotateMatrix.fromArray([Math.cos(rotDelta), Math.sin(rotDelta), 0, -Math.sin(rotDelta), Math.cos(rotDelta), 0, 0, 0]);
                            newCenter.transformMat3(rotateMatrix);
                            newCenter.add(new Phaser.Math.Vector2(this.rotationCenter.x, this.rotationCenter.y));
                            prevRotation = falseWorm.rotation;
                            wormBlock.x = newCenter.x;
                            wormBlock.y = newCenter.y;
                        }, [], this);

                        // rotate worm collider when head is done rotation
                        rotTween.setCallback('onComplete', function () {
                            if (this.worm.collider && wormBlock.wallNum === this.worm.wallNum + '.0') {
                                PlainCollider.rotateCollider(this.worm, rotAngle, new Phaser.Math.Vector2(this.rotationCenter.x, this.rotationCenter.y));
                                //this.worm.colorArray.push(this.worm.color);
                                //console.log(this.worm.colorArray);
                            }
                            if (this.currentMode !== this.modes.rotatingBack) {
                                //console.log('putting pos array in worm');
                                if (!inPending) {
                                    wormBlock.posArray.push([wormBlock.x, wormBlock.y]);
                                } else {
                                    wormBlock.posArray[wormBlock.posArray.length - 1] = [wormBlock.x, wormBlock.y];
                                }
                            }
                        }, [], this);
                    }, this);
                }

                this.time.delayedCall(600, this.unfreezeAfterRotation, [], this);
            } else if (this.currentMode === this.modes.rotating || this.currentMode === this.modes.falling) {
                //console.log('adding pending action');
                this.pendingAction = this.rotateMaze;
                this.pendingDirection = direction;
            }
        }
    }, {
        key: 'undoLastMove',
        value: function undoLastMove() {
            if (this.currentMode === this.modes.standing && this.turnsArray.length > 0) {

                // revive eaten blocks
                var lastEatenBlocks = this.eatenBlocks.pop();
                lastEatenBlocks.forEach(function (block) {
                    block.resurrect();
                }, this);

                // worm change color
                var lastWormColor = this.worm.colorArray.pop();
                this.worm.changeColor(lastWormColor);

                // shorten worm
                this.worm.shortenWorm(lastEatenBlocks.length);

                // start moving back
                this.currentMode = this.modes.movingBack;
                this.numberMovingBackObjects = this.falling.getChildren().reduce(function (acc, curr, index, arr) {
                    if (!curr.eaten) return acc + 1;
                    return acc;
                }, 0) + this.worm.getLength();
                //console.log(this.numberMovingBackObjects);

                this.falling.children.iterate(function (block) {
                    if (!block.eaten) block.movedBack = false;
                }, this);

                this.worm.children.iterate(function (block) {
                    block.movedBack = false;
                }, this);

                // rotate back
                var lastDirections = this.turnsArray.pop(),
                    reverseBackTurns = lastDirections.split(',');

                //console.log('constructing back turns');
                //console.log(reverseBackTurns);

                this.backTurns = reverseBackTurns.map(function (dir) {
                    if (dir === 'right') return 'left';
                    return 'right';
                }, this);

                this.pendingAction = this.rotateMaze;
                this.pendingDirection = this.backTurns.pop();
            }
        }
    }, {
        key: 'freezeForRotation',
        value: function freezeForRotation() {
            if (this.currentMode === this.modes.standing) this.currentMode = this.modes.rotating;
        }
    }, {
        key: 'unfreezeAfterRotation',
        value: function unfreezeAfterRotation() {
            //console.log('unfreeze called');

            // set zero velocity for all blocks and worm

            this.maze.children.each(function (entity) {
                entity.vel = new Phaser.Math.Vector2();
            }, this);
            if (this.worm) this.worm.vel = new Phaser.Math.Vector2();

            // if we are in undo actions and there are back turns left
            // extract one

            var backRotation = false;

            if (this.backTurns.length > 0) {
                //console.log('back turns');
                //console.log(this.backTurns);
                this.pendingAction = this.rotateMaze;
                this.pendingDirection = this.backTurns.pop();
                backRotation = true;
            }

            if (this.pendingAction) {
                if (backRotation) this.currentMode = this.modes.rotatingBack;else {
                    this.currentMode = this.modes.standing;
                    this.eatChecked = false;
                }

                this.pendingAction.call(this, this.pendingDirection, true);
                this.pendingAction = undefined;
                this.pendingDirection = undefined;

                //console.log('execute pending action in unfreeze');
            } else {
                this.numberOfFalling = this.falling.getChildren().reduce(function (acc, curr, index, arr) {
                    if (!curr.eaten) return acc + 1;
                    return acc;
                }, 0) + 1;
                if (this.currentMode === this.modes.rotatingBack) {
                    this.currentMode = this.modes.standing;
                } else if (this.currentMode === this.modes.rotating) {
                    this.currentMode = this.modes.falling;
                }
            }

            //console.log(this.turnsArray.slice());
            //console.log(this.worm.head.posArray.slice());
        }
    }, {
        key: 'minusFallingObject',
        value: function minusFallingObject() {
            this.numberOfFalling--;
            this.fallSound.play();
        }
    }, {
        key: 'minusMovingBackObject',
        value: function minusMovingBackObject() {
            this.numberMovingBackObjects--;
        }
    }, {
        key: 'checkEatOpportunity',
        value: function checkEatOpportunity() {
            var blockToEat;
            this.eatChecked = true;
            // check whether there is a block that can be eaten
            this.falling.children.iterate(function (block) {
                if (!block.eaten) {
                    if (Math.abs(this.worm.head.x - block.x) < 3 && block.getTopLeft().y - this.worm.head.y > 0 && block.getTopLeft().y - this.worm.head.y < this.worm.head.width * 0.5 + 5 && (this.worm.color === block.color1 || this.worm.color === block.color2)) {
                        blockToEat = block;
                    }
                }
            }, this);

            return blockToEat;
        }
    }, {
        key: 'checkLevelAccomplished',
        value: function checkLevelAccomplished() {
            //console.log('check level called');

            var numOfColoredNotEaten = 0;

            this.falling.children.iterate(function (block) {
                if (!block.eaten && block.roloongType === RoloongTypeDict.coloredBlock) {
                    numOfColoredNotEaten++;
                }
            }, this);

            if (numOfColoredNotEaten === 0) {
                this.currentMode = this.modes.popupShown;
                if (this.game.levelNumber < 36) {
                    this.enableWinPopup();
                } else {
                    this.enableLastPopup();
                }
            }
        }
    }, {
        key: 'launchNextLevel',
        value: function launchNextLevel() {
            this.game.levelNumber++;

            // put record to local storage
            if (this.game.levelNumber > this.game.lastAvailLevel) {
                this.game.lastAvailLevel = this.game.levelNumber;
                localStorage.setItem('roloongLastLevel', this.game.lastAvailLevel);
            }

            if (typeof parent.cmgGameEvent === 'function') parent.cmgGameEvent('start', '' + this.game.levelNumber);

            this.scene.restart();
            this.uKey.destroy();
            this.leftKey.destroy();
            this.rightKey.destroy();
            this.rKey.destroy();
        }
    }, {
        key: 'disableWinPopup',
        value: function disableWinPopup() {
            this.winPopupBack.alpha = 0;
            //this.winOkayButton.alpha = 0;
            this.winPressRightKey.alpha = 0;
            this.winPopupFace.alpha = 0;
            //this.winOkayButton.disableInteractive();        
        }
    }, {
        key: 'enableWinPopup',
        value: function enableWinPopup() {
            this.winPopupBack.alpha = 1;
            //this.winOkayButton.alpha = 1;
            //this.winOkayButton.setInteractive();
            var winPressTween = this.tweens.add({
                targets: this.winPressRightKey,
                props: { alpha: { value: 1, ease: 'Linear' } },
                duration: 700,
                yoyo: true,
                repeat: -1
            });

            if (this.game.device.os.desktop) this.rightKey.once('down', this.launchNextLevel, this);else this.input.once('pointerup', this.launchNextLevel, this);

            this.winPopupFace.alpha = 1;
            this.winPopupFace.startFollow({
                duration: 3000,
                repeat: -1
            });
            this.winPopupFace.play('faceAnim');

            this.winEmitterRed.start();
            this.winEmitterGreen.start();
            this.winEmitterOrange.start();
            this.winEmitterYellow.start();

            this.winSound.play();
        }
    }, {
        key: 'disableLastPopup',
        value: function disableLastPopup() {
            this.lastPopupBack.alpha = 0;
            this.lastOkayButton.alpha = 0;
            this.lastPopupFace.alpha = 0;
            this.lastOkayButton.disableInteractive();
        }
    }, {
        key: 'enableLastPopup',
        value: function enableLastPopup() {
            var scale = Math.min(this.game.scale.width, this.game.scale.height) / 600;

            this.lastPopupBack.alpha = 1;
            this.lastOkayButton.alpha = 1;
            this.lastOkayButton.setInteractive();

            this.lastPopupFace.alpha = 1;
            this.lastPopupFace.startFollow({
                duration: 3000,
                yoyo: true,
                repeat: -1
            });
            this.lastPopupFace.play('lastFaceAnim');

            this.winEmitterRed.startFollow(this.lastPopupFace, -50 * scale, 0);
            this.winEmitterRed.setSpeedY(150);
            this.winEmitterRed.setScale({ start: 1, end: 0.3 });
            this.winEmitterRed.start();

            this.winEmitterGreen.startFollow(this.lastPopupFace, -15 * scale, 70 * scale);
            this.winEmitterGreen.setSpeedY(150);
            this.winEmitterGreen.setScale({ start: 1, end: 0.3 });
            this.winEmitterGreen.start();

            this.winEmitterYellow.startFollow(this.lastPopupFace, 15 * scale, 70 * scale);
            this.winEmitterYellow.setSpeedY(150);
            this.winEmitterYellow.setScale({ start: 1, end: 0.3 });
            this.winEmitterYellow.start();

            this.winEmitterOrange.startFollow(this.lastPopupFace, 50 * scale, 0);
            this.winEmitterOrange.setSpeedY(150);
            this.winEmitterOrange.setScale({ start: 1, end: 0.3 });
            this.winEmitterOrange.start();

            this.winSound.play();
        }
    }, {
        key: 'startEatAnimation',
        value: function startEatAnimation() {
            //console.log('start eat animation');
            this.currentMode = this.modes.eatAnimation;
        }
    }, {
        key: 'endEatAnimation',
        value: function endEatAnimation() {
            //console.log('end eat animation');
            this.currentMode = this.modes.standing;
            this.eatChecked = false;
        }
    }, {
        key: 'makeButton',
        value: function makeButton(posX, posY, imageKey, text, callback, args) {
            var button = this.add.image(posX, posY, imageKey, 'out').setInteractive();
            button.setDepth(101);
            button.levelNumber = text;
            button.on('pointerdown', function () {
                button.setFrame('down');
                this.game.buttonSound.play();
                callback.call(this, args);
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
        key: 'scaleAndPositionUI',
        value: function scaleAndPositionUI() {
            var gameWidth = this.game.scale.width,
                gameHeight = this.game.scale.height,
                scale = Math.min(gameWidth, gameHeight) / 600;

            this.cameras.resize(gameWidth, gameHeight);

            // scale all of UI

            this.levelLabelUnderlay.setPosition(10000 + gameWidth * 0.5, 10000 + gameHeight * 0.02);
            this.levelLabelUnderlay.setScale(scale);

            this.levelLabel.setPosition(10000 + gameWidth * 0.5, this.levelLabelUnderlay.y + 25 * scale);
            this.levelLabel.setScale(scale);

            this.replayButton.setPosition(gameWidth * 0.5 + 50 * scale + 10000, gameHeight - 20 * scale + 10000);
            this.replayButton.setScale(scale);

            this.undoButton.setPosition(gameWidth * 0.5 - 50 * scale + 10000, gameHeight - 20 * scale + 10000);
            this.undoButton.setScale(scale);

            this.homeButton.setPosition(gameWidth + 10000 - 10 * scale, 10000 + 10 * scale);
            this.homeButton.setScale(scale);

            this.turnLeftButton.setPosition(10 * scale + 10000, gameHeight - 10 * scale + 10000);
            this.turnLeftButton.setScale(scale);

            this.turnRightButton.setPosition(gameWidth - 10 * scale + 10000, gameHeight - 10 * scale + 10000);
            this.turnRightButton.setScale(scale);

            if (this.uTip && this.rTip) {
                this.uTip.setPosition(this.undoButton.getTopLeft().x - 8 * scale, this.undoButton.getTopLeft().y);
                this.rTip.setPosition(this.replayButton.getBottomRight().x + 8, this.replayButton.getTopLeft().y);
            }

            // scale all popups
            this.winPopupBack.setPosition(gameWidth * 0.5 - 10000, gameHeight * 0.5 - 10000);
            this.winPopupBack.setScale(scale);

            this.facePath = new Phaser.Curves.Path(gameWidth * 0.5 - 10000 + 50 * scale, gameHeight * 0.4 - 10000);
            this.facePath.circleTo(50 * scale, true);

            this.winPopupFace.setPosition(gameWidth * 0.5 - 10000 + 50 * scale, gameHeight * 0.4 - 10000);
            this.winPopupFace.setScale(scale);
            this.winPopupFace.setPath(this.facePath);

            this.winPressRightKey.setPosition(this.winPopupBack.x, this.winPopupBack.getBottomRight().y - 20 * scale);
            this.winPressRightKey.setScale(scale);

            //this.winParticles.setScale(scale);

            this.lastPopupBack.setPosition(gameWidth * 0.5 - 10000, gameHeight * 0.5 - 10000);
            this.lastPopupBack.setScale(scale);

            this.lastFacePath = new Phaser.Curves.Path(gameWidth * 0.5 - 10000 - 50 * scale, gameHeight * 0.35 - 10000);
            var lastPoint = new Phaser.Math.Vector2(gameWidth * 0.5 - 10000 - 50 * scale, gameHeight * 0.35 - 10000);

            for (var i = 0; i < 9; i++) {
                var xDir = 10 * scale,
                    ySing = i % 2 === 0 ? 1 : -1,
                    yDir = ySing * 20 * scale;

                lastPoint.x += xDir;
                lastPoint.y += yDir;

                this.lastFacePath.lineTo(lastPoint.x, lastPoint.y);
            }

            this.lastPopupFace.setPosition(gameWidth * 0.5 - 10000 - 50 * scale, gameHeight * 0.35 - 10000);
            this.lastPopupFace.setScale(scale);

            this.lastOkayButton.setPosition(this.lastPopupBack.x, this.lastPopupBack.getBottomRight().y - 10 * scale);
            this.lastOkayButton.setScale(scale);

            if (this.currentTutorial) {
                this.currentTutorial.setPosition(gameWidth * 0.5 - 10000, gameHeight * 0.5 - 10000);
                this.currentTutorial.setScale(scale);

                this.tutorialPressRightKey.setPosition(gameWidth * 0.5 - 10000, gameHeight * 0.5 - 10000 + this.currentTutorial.displayHeight * 0.5 - 10 * scale);
                this.tutorialPressRightKey.setScale(scale);
            }

            //this.eatParticle.setScale(scale);

            // main camera zoom
            this.cameras.main.setZoom(scale);
        }
    }, {
        key: 'update',
        value: function update(time, delta) {

            //PlainCollider.drawColliders(this.debugGraphics);


            if (this.playing) {
                //console.log('#############____________global update');


                switch (this.currentMode) {
                    case this.modes.standing:

                        //console.log('_________________update in standing');

                        if (this.pendingAction) {
                            //console.log('pending action in update');
                            this.pendingAction.call(this, this.pendingDirection, true);
                            this.pendingAction = undefined;
                            this.pendingDirection = undefined;
                        } else {

                            PlainCollider.checkCollisions();
                            PlainCollider.moveAll();

                            this.maze.children.each(function (platform) {
                                platform.update(time, delta);
                            }, this);

                            if (this.worm) this.worm.update();

                            if (this.checkAllEaten) {
                                this.checkLevelAccomplished();
                                this.checkAllEaten = false;
                            }

                            if (!this.eatChecked) {
                                var blockToEat = this.checkEatOpportunity();
                                if (blockToEat) {
                                    //console.log('have block to eat');
                                    this.startEatAnimation();
                                    this.worm.eatBlock(blockToEat);
                                    this.checkAllEaten = true;
                                    this.chewSound.play();
                                    //console.log('setting check all eaten to true');
                                }
                            }
                        }
                        break;

                    case this.modes.falling:

                        PlainCollider.checkCollisions();
                        PlainCollider.moveAll();

                        if (this.numberOfFalling === 0) {
                            // to avoid double call to eat after starting eat once
                            if (this.currentMode !== this.modes.eatAnimation) {
                                this.currentMode = this.modes.standing;
                                this.eatChecked = false;
                                //this.acceptInputGraphics.alpha = 0;                                                
                            }
                        } else {
                                //this.acceptInputGraphics.alpha = 1;
                            }

                        this.maze.children.each(function (platform) {
                            platform.update(time, delta);
                        }, this);

                        if (this.worm) this.worm.update();

                        // when fall is over check for eat opportunity
                        if (this.currentMode === this.modes.standing && !this.eatChecked) {
                            var blockToEat = this.checkEatOpportunity();
                            if (blockToEat) {
                                //console.log('have block to eat');
                                this.startEatAnimation();
                                this.worm.eatBlock(blockToEat);
                                this.checkAllEaten = true;
                                //console.log('setting check all eaten to true');
                            }
                        }

                        break;

                    case this.modes.movingBack:

                        //console.log('######_________________update in moving back');
                        //console.log('number of moving back ' + this.numberMovingBackObjects);

                        if (this.numberMovingBackObjects > 0) {
                            this.maze.children.each(function (platform) {
                                if (platform.roloongType === RoloongTypeDict.coloredBlock || platform.roloongType === RoloongTypeDict.greyBlock) platform.moveBackUpdate(time, delta);
                            }, this);

                            if (this.worm) this.worm.moveBackUpdate();
                        } else {
                            this.currentMode = this.modes.rotatingBack;
                        }
                        break;

                    case this.modes.rotatingBack:
                        if (this.pendingAction) {
                            //console.log('pending action in rotate back update');
                            this.pendingAction.call(this, this.pendingDirection, true);
                            this.pendingAction = undefined;
                            this.pendingDirection = undefined;
                        } else {

                            /*PlainCollider.checkCollisions();
                            PlainCollider.moveAll();
                             this.maze.children.each(function(platform){
                                platform.update(time, delta);
                            }, this);
                             if (this.worm)
                                this.worm.update();*/
                        }
                        break;
                    case this.modes.eatAnimation:
                        //console.log('############ update in eat animation');
                        break;
                }
            }
        }
    }]);

    return PlayScene;
}(Phaser.Scene);

/***/ }),

/***/ 1425:
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SAT = __webpack_require__(1426);

var Pair = exports.Pair = function () {
	function Pair(object1, object2, plainCollider) {
		_classCallCheck(this, Pair);

		this.object1 = object1;
		this.object2 = object2;

		// listen to destroy events
		if (object1.children) {
			object1.getChildren()[0].on('destroy', this.remove, this);
		} else {
			this.object1.on('destroy', this.remove, this);
		}

		if (object2.children) {
			object2.getChildren()[0].on('destroy', this.remove, this);
		} else {
			this.object2.on('destroy', this.remove, this);
		}

		// give a pair array to the pair to manage pair remove
		this.plainCollider = plainCollider;
		this.collisionChecked = false;
		this.previouslyCollided = false;
		this.nowCollided = false;
		this.checksInIteration = 0;
		this.collisionPoints = [];
	}

	_createClass(Pair, [{
		key: 'checkPairCollision',
		value: function checkPairCollision() {
			this.collisionChecked = true;
			this.checksInIteration++;

			//console.log(this.object1);
			//console.log(this.object2);

			if (this.object1.activeCollider && this.object2.activeCollider && this.object1.collWith.indexOf(this.object2.collGroup) >= 0 && this.object2.collWith.indexOf(this.object1.collGroup) >= 0) {

				for (var b1 = 0; b1 < this.object1.collider.length; b1++) {
					for (var b2 = 0; b2 < this.object2.collider.length; b2++) {

						var collision = { collided: false };

						var body1 = this.object1.collider[b1],
						    body2 = this.object2.collider[b2];

						var bounds1 = this.getBoundsOfBody(body1),
						    bounds2 = this.getBoundsOfBody(body2);

						bounds1.x += this.object1.vel.x + this.object1.lastCorrection.x;
						bounds2.x += this.object2.vel.x + this.object2.lastCorrection.x;
						bounds1.y += this.object1.vel.y + this.object1.lastCorrection.y;
						bounds2.y += this.object2.vel.y + this.object2.lastCorrection.y;

						if (Phaser.Geom.Rectangle.Overlaps(bounds1, bounds2)) {

							var intentCollider1 = body1.map(function (segment) {
								return { point: segment.point.clone(), direction: segment.direction.clone(), normal: segment.normal.clone() };
							}, this);
							intentCollider1.forEach(function (segment) {
								segment.point.add(this.object1.vel);
								segment.point.add(this.object1.lastCorrection);
							}, this);

							var intentCollider2 = body2.map(function (segment) {
								return { point: segment.point.clone(), direction: segment.direction.clone(), normal: segment.normal.clone() };
							}, this);
							intentCollider2.forEach(function (segment) {
								segment.point.add(this.object2.vel);
								segment.point.add(this.object2.lastCorrection);
							}, this);

							collision = SAT.findIntersection(intentCollider1, intentCollider2);
						}

						if (collision.collided && this.checksInIteration < 10) {

							// define objects response

							this.defineResponse(collision);

							return true;
						} else if (this.checksInIteration >= 10) {
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
		key: 'defineResponse',
		value: function defineResponse(collision) {

			for (var axis in this.object1.constraints) {

				if (collision.normal[axis] != 0) {

					this.defineAxisResponse(collision.pushOutVec[axis], axis);
				} else {

					var frictionCoef = 0.0,
					    correction = this.object2.vel[axis] + this.object2.lastCorrection[axis] - (this.object1.vel[axis] + this.object1.lastCorrection[axis]);

					if (correction * frictionCoef != 0) this.defineAxisResponse(correction * frictionCoef, axis);
				}
			}

			// for everything
			this.object1.collidedWith(this.object2, collision.pushOutVec, collision);
			this.object2.collidedWith(this.object1, collision.pushOutVec.clone().scale(-1), collision);
		}
	}, {
		key: 'defineAxisResponse',
		value: function defineAxisResponse(correction, axis) {

			if (correction != 0) {
				// determine direction of correction for each object

				var corrSign1 = correction / Math.abs(correction),
				    corrSign2 = -corrSign1,
				    cVel1 = this.object1.vel[axis] + this.object1.lastCorrection[axis],
				    cVel2 = this.object2.vel[axis] + this.object2.lastCorrection[axis];

				if (this.object1.constraints[axis][corrSign1] > this.object2.constraints[axis][corrSign2]) {
					this.object1.velCorrection(correction, axis);
					// update constraint in direction opposite to correction
					this.object1.constraints[axis][corrSign2] = this.object2.constraints[axis][corrSign2];
				} else if (this.object1.constraints[axis][corrSign1] < this.object2.constraints[axis][corrSign2]) {

					this.object2.velCorrection(-correction, axis);
					this.object2.constraints[axis][corrSign1] = this.object1.constraints[axis][corrSign1];
				} else {

					// if constraints are equal
					this.object1.velCorrection(correction * 0.5, axis);
					this.object2.velCorrection(correction * -0.5, axis);
				}
			}
		}
	}, {
		key: 'remove',
		value: function remove(destroyedObject) {
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
	}, {
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

/***/ 1426:
/***/ (function(module, exports) {

var SAT = {
	findIntersection: function findIntersection(collider1, collider2, report) {

		var collision = { collided: false, point1: undefined, point2: undefined, pushOutVec: undefined, normal: undefined };

		// find minimal overlap by each axis
		var overlapByAxes = this.findMinOverlap(collider1, collider2);
		// if axis with no overlap found return non collided collision
		if (overlapByAxes.magnitude < 0.0001) return collision;else {
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

	findMinOverlapOld: function findMinOverlapOld(colliderAxes, collider, axes) {
		// here colliderAxes is collider from wich normals treated as axes
		// i.e. a candidate to be collider penetrated
		var minOverlap = { magnitude: this.projectOnAxis(colliderAxes, axes[0]).magnitude, axis: axes[0], pushOutVec: new Phaser.Math.Vector2(), pushPoint1: new Phaser.Math.Vector2(), pushPoint2: new Phaser.Math.Vector2() };
		for (var a = 0; a < axes.length; a++) {
			var projectionOfColliderAxes = this.projectOnAxis(colliderAxes, axes[a]),
			    projectionOfCollider = this.projectOnAxis(collider, axes[a]);

			var currentOverlap = this.findOverlap(projectionOfColliderAxes, projectionOfCollider);
			//console.log(axes[a]);
			//console.log(currentOverlap);
			if (currentOverlap === 0) {
				return { magnitude: 0, axis: axes[a], penetrationPoint: undefined };
			} else {
				if (currentOverlap < minOverlap.magnitude) {
					// find penetration point as if collider, providing axes, is penetrated collider
					//var penetrationPoint = this.findPenetrationPoint(projectionOfColliderAxes, projectionOfCollider);

					// find push out vector for collider providing axis and points penetrating for both
					var pushOut = this.findPushOutVec(projectionOfColliderAxes, projectionOfCollider, axes[a]),
					    minOverlap = { magnitude: currentOverlap, axis: axes[a], pushOutVec: pushOut.pushOutVec, pushPoint1: pushOut.point1, pushPoint2: pushOut.point2 };
				}
			}
		}

		return minOverlap;
	},

	findMinOverlap: function findMinOverlap(collider1, collider2) {
		var axes = [new Phaser.Math.Vector2(1, 0), new Phaser.Math.Vector2(0, 1)],
		    southEast = false,
		    northEast = false;

		for (var s = 0; s < collider1.length; s++) {
			var dir = collider1[s].direction.clone();
			if (dir.x != 0 && dir.y != 0) {
				if (dir.x * dir.y > 0 && !northEast) {
					axes.push(new Phaser.Math.Vector2(1 / Math.sqrt(2), -1 / Math.sqrt(2)));
					northEast = true;
				} else if (!southEast) {
					axes.push(new Phaser.Math.Vector2(1 / Math.sqrt(2), 1 / Math.sqrt(2)));
					southEast = true;
				}
			}
		}

		if (!northEast || !southEast) {
			for (var s = 0; s < collider2.length; s++) {
				var dir = collider2[s].direction.clone();
				if (dir.x != 0 && dir.y != 0) {
					if (dir.x * dir.y > 0 && !northEast) {
						axes.push(new Phaser.Math.Vector2(1 / Math.sqrt(2), -1 / Math.sqrt(2)));
						northEast = true;
					} else if (!southEast) {
						axes.push(new Phaser.Math.Vector2(1 / Math.sqrt(2), 1 / Math.sqrt(2)));
						southEast = true;
					}
				}
			}
		}

		var minOverlap = { magnitude: this.projectOnAxis(collider1, axes[0]).magnitude,
			axis: axes[0], pushOutVec: new Phaser.Math.Vector2(),
			pushPoint1: [],
			pushPoint2: [] };

		for (var a = 0; a < axes.length; a++) {
			var projectionOfCollider1 = this.projectOnAxis(collider1, axes[a]),
			    projectionOfCollider2 = this.projectOnAxis(collider2, axes[a]);

			var currentOverlap = this.findOverlap(projectionOfCollider1, projectionOfCollider2);
			//console.log(axes[a]);
			//console.log(currentOverlap);
			if (currentOverlap === 0) {
				return { magnitude: 0, axis: axes[a], penetrationPoint: undefined };
			} else {
				var pushOut = this.findPushOutVec(projectionOfCollider1, projectionOfCollider2, axes[a]);

				if (currentOverlap < minOverlap.magnitude) {

					minOverlap.magnitude = currentOverlap;
					minOverlap.axis = axes[a];
					minOverlap.pushPoint1 = pushOut.point1;
					minOverlap.pushPoint2 = pushOut.point2;
				}

				if (axes[a].y === 0) {
					minOverlap.pushOutVec.x = pushOut.pushOutVec.x;
				} else if (axes[a].x === 0) {
					minOverlap.pushOutVec.y = pushOut.pushOutVec.y;
				}
			}
		}

		return minOverlap;
	},

	projectOnAxis: function projectOnAxis(collider, axis) {
		var minProj = collider[0].point.dot(axis),
		    maxProj = collider[0].point.dot(axis),
		    minPoint = [collider[0].point],
		    maxPoint = [collider[0].point];

		for (var s = 1; s < collider.length; s++) {
			var currentProj = collider[s].point.dot(axis);
			if (currentProj > maxProj) {
				maxProj = currentProj;
				maxPoint[0] = collider[s].point;
			} else if (Math.abs(currentProj - maxProj) < 1) {
				maxPoint[1] = collider[s].point;
			}
			if (currentProj < minProj) {
				minProj = currentProj;
				minPoint[0] = collider[s].point;
			} else if (Math.abs(currentProj - minProj) < 1) {
				minPoint[1] = collider[s].point;
			}
		}

		return { min: minProj, max: maxProj, minPoint: minPoint, maxPoint: maxPoint, magnitude: maxProj - minProj };
	},

	findPushOutVec: function findPushOutVec(proj1, proj2, axis) {
		var pushOutVec = axis.clone();
		if (proj1.max > proj2.max) {
			if (proj1.min > proj2.min) {
				pushOutVec.scale(proj2.max - proj1.min);
				return { pushOutVec: pushOutVec, point1: proj1.minPoint, point2: proj2.maxPoint };
			} else {
				pushOutVec.scale(proj2.min - proj1.max);
				return { pushOutVec: pushOutVec, point1: proj1.maxPoint, point2: proj2.minPoint };
			}
		} else {
			if (proj1.min > proj2.min) {
				pushOutVec.scale(proj2.max - proj1.min);
				return { pushOutVec: pushOutVec, point1: proj1.minPoint, point2: proj2.maxPoint };
			} else {
				pushOutVec.scale(proj2.min - proj1.max);
				return { pushOutVec: pushOutVec, point1: proj1.maxPoint, point2: proj2.minPoint };
			}
		}
	},

	findOverlap: function findOverlap(projection1, projection2) {
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

		if (projection1.min <= projection2.max && projection1.max > projection2.min) {
			return Math.min(projection2.max - projection1.min, projection1.max - projection2.min, projection1.max - projection1.min, projection2.max - projection1.min);
		} else {
			return 0;
		}
	}
};

module.exports = SAT;

/***/ }),

/***/ 1427:
/***/ (function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoloongTypeDict = __webpack_require__(79);
var WormBlock = __webpack_require__(1428);
var PlainCollider = __webpack_require__(252);

var Worm = function (_Phaser$GameObjects$G) {
    _inherits(Worm, _Phaser$GameObjects$G);

    function Worm(scene, blocksPos, color, wallNum) {
        _classCallCheck(this, Worm);

        var _this = _possibleConstructorReturn(this, (Worm.__proto__ || Object.getPrototypeOf(Worm)).call(this, scene));
        // worm is group of worm blocks


        _this.length = blocksPos.length;
        _this.vertices = [];
        _this.wallNum = wallNum;
        _this.color = color;
        _this.eating = false;

        // animations
        var redEatAnimationNames = scene.anims.generateFrameNames('roloong', { prefix: 'redEat', start: 1, end: 7 }),
            orangeEatAnimationNames = scene.anims.generateFrameNames('roloong', { prefix: 'orangeEat', start: 1, end: 7 }),
            yellowEatAnimationNames = scene.anims.generateFrameNames('roloong', { prefix: 'yellowEat', start: 1, end: 7 }),
            greenEatAnimationNames = scene.anims.generateFrameNames('roloong', { prefix: 'greenEat', start: 1, end: 7 }),
            redIdleAnimationNames = scene.anims.generateFrameNames('roloong', { prefix: 'redIdle', frames: [0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 0] }),
            orangeIdleAnimationNames = scene.anims.generateFrameNames('roloong', { prefix: 'orangeIdle', frames: [0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 0] }),
            yellowIdleAnimationNames = scene.anims.generateFrameNames('roloong', { prefix: 'yellowIdle', frames: [0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 0] }),
            greenIdleAnimationNames = scene.anims.generateFrameNames('roloong', { prefix: 'greenIdle', frames: [0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 0] });

        _this.redEatAnimation = scene.anims.create({ key: 'redEat', frames: redEatAnimationNames, frameRate: 10 });
        _this.orangeEatAnimation = scene.anims.create({ key: 'orangeEat', frames: orangeEatAnimationNames, frameRate: 10 });
        _this.yellowEatAnimation = scene.anims.create({ key: 'yellowEat', frames: yellowEatAnimationNames, frameRate: 10 });
        _this.greenEatAnimation = scene.anims.create({ key: 'greenEat', frames: greenEatAnimationNames, frameRate: 10 });

        _this.redIdleAnimation = scene.anims.create({ key: 'redIdle', frames: redIdleAnimationNames, frameRate: 8, repeat: -1, repeatDelay: 6000 });
        _this.orangeIdleAnimation = scene.anims.create({ key: 'orangeIdle', frames: orangeIdleAnimationNames, frameRate: 8, repeat: -1, repeatDelay: 6000 });
        _this.yellowIdleAnimation = scene.anims.create({ key: 'yellowIdle', frames: yellowIdleAnimationNames, frameRate: 8, repeat: -1, repeatDelay: 6000 });
        _this.greenIdleAnimation = scene.anims.create({ key: 'greenIdle', frames: greenIdleAnimationNames, frameRate: 8, repeat: -1, repeatDelay: 6000 });

        // create head and vertices for collider

        _this.head = new WormBlock(_this.scene, blocksPos[0][0], blocksPos[0][1], color, true, wallNum + '.0', _this);
        _this.add(_this.head);
        _this.vertices.push(_this.head.vertices[0]);

        _this.head.play(_this.color + 'Idle');

        // flip head along x on idle animation repeat
        _this.head.on('animationrepeat-redIdle', function () {
            var currentFlip = this.head.flipX;
            this.head.setFlipX(!currentFlip);
        }, _this);
        _this.head.on('animationrepeat-orangeIdle', function () {
            var currentFlip = this.head.flipX;
            this.head.setFlipX(!currentFlip);
        }, _this);
        _this.head.on('animationrepeat-yellowIdle', function () {
            var currentFlip = this.head.flipX;
            this.head.setFlipX(!currentFlip);
        }, _this);
        _this.head.on('animationrepeat-greenIdle', function () {
            var currentFlip = this.head.flipX;
            this.head.setFlipX(!currentFlip);
        }, _this);

        // all the other blocks
        for (var b = 1; b < blocksPos.length; b++) {
            var blockPos = blocksPos[b];
            var subWallNum = b + 1;
            var wormBlock = new WormBlock(_this.scene, blockPos[0], blockPos[1], color, false, wallNum + '.' + subWallNum, _this);
            _this.add(wormBlock);
            _this.vertices.push(wormBlock.vertices[0]);
        }

        scene.add.existing(_this);

        // variables for plain collider

        _this.vel = new Phaser.Math.Vector2();
        _this.movability = 1;
        _this.lastCorrection = new Phaser.Math.Vector2();
        _this.activeCollider = true;
        _this.constraints = { x: { '1': _this.movability, '-1': _this.movability }, y: { '1': _this.movability, '-1': _this.movability } };
        _this.fallen = false;

        _this.colorArray = [];

        _this.roloongType = RoloongTypeDict.worm;
        return _this;
    }

    _createClass(Worm, [{
        key: 'velCorrection',
        value: function velCorrection(correction, axis, otherObject) {

            this.velCorrected = true;
            this.lastCorrection[axis] += correction;
            if (axis == 'y' && correction < 0 && !this.fallen) {
                this.scene.minusFallingObject();
                this.fallen = true;
            }
        }
    }, {
        key: 'eatBlock',
        value: function eatBlock(block) {
            this.head.turnToBlock();
            this.length++;
            this.head.wallNum = this.wallNum + '.' + this.length;

            var prevHeadY = this.head.y,
                prevHeadX = this.head.x;

            // head is added

            this.head = new WormBlock(this.scene, prevHeadX, prevHeadY, this.color, true, this.wallNum + '.0', this);
            this.add(this.head);

            this.head.play(this.color + 'Eat');

            // tween to move head 30 px below

            var eatTween = this.scene.tweens.add({
                targets: this.head,
                props: {
                    y: { value: (block.getTopLeft().y + block.getBottomRight().y) * 0.5, ease: 'Linear' }
                },
                duration: 700
            });

            this.head.once('animationcomplete-' + this.color + 'Eat', function () {

                if (this.head.anims.getCurrentKey() === this.color + 'Eat') {

                    this.head.y = block.getBottomRight().y - 15;
                    this.head.play(this.color + 'Idle');

                    // flip head along x on idle animation repeat
                    this.head.on('animationrepeat-redIdle', function () {
                        var currentFlip = this.head.flipX;
                        this.head.setFlipX(!currentFlip);
                    }, this);
                    this.head.on('animationrepeat-orangeIdle', function () {
                        var currentFlip = this.head.flipX;
                        this.head.setFlipX(!currentFlip);
                    }, this);
                    this.head.on('animationrepeat-yellowIdle', function () {
                        var currentFlip = this.head.flipX;
                        this.head.setFlipX(!currentFlip);
                    }, this);
                    this.head.on('animationrepeat-greenIdle', function () {
                        var currentFlip = this.head.flipX;
                        this.head.setFlipX(!currentFlip);
                    }, this);

                    this.updateVertices();

                    // other object deactivated

                    block.planForHide();

                    // change color
                    if (block.color1 === this.color) {
                        this.changeColor(block.color2);
                    } else {
                        this.changeColor(block.color1);
                    }

                    PlainCollider.updateCollider(this, this.vertices);

                    // launch eat emitter

                    var tint1 = 0xffffff,
                        tint2 = 0xffffff;

                    switch (block.color1) {
                        case 'red':
                            tint1 = 0xdf285f;
                            break;
                        case 'orange':
                            tint1 = 0xe88d29;
                            break;
                        case 'yellow':
                            tint1 = 0xeae95d;
                            break;
                        case 'green':
                            tint1 = 0x1dba8c;
                            break;
                    }

                    switch (block.color2) {
                        case 'red':
                            tint2 = 0xdf285f;
                            break;
                        case 'orange':
                            tint2 = 0xe88d29;
                            break;
                        case 'yellow':
                            tint2 = 0xeae95d;
                            break;
                        case 'green':
                            tint2 = 0x1dba8c;
                            break;
                    }

                    this.scene.eatEmitter1.setPosition(block.x, block.getBottomRight().y);
                    this.scene.eatEmitter1.tint.propertyValue = tint1;
                    this.scene.eatEmitter1.explode(10);

                    this.scene.eatEmitter2.setPosition(block.x, block.getBottomRight().y);
                    this.scene.eatEmitter2.tint.propertyValue = tint2;
                    this.scene.eatEmitter2.explode(10);

                    this.scene.endEatAnimation();
                }
            }, this);
        }
    }, {
        key: 'collidedWith',
        value: function collidedWith(otherObject, correction, collision) {

            /*if (otherObject.roloongType === RoloongTypeDict.coloredBlock && !this.eating)
            {
             	// if block that worm collided with is below the worm head
            	// and color is corresponding - eat the block
                 if (Math.abs(this.head.x - otherObject.x) < 1 && otherObject.y - this.head.y > 0
                    && otherObject.y - this.head.y < this.head.width + 5 && 
                    (this.color === otherObject.color1 || this.color === otherObject.color2))        
                 {
                    this.eating = true;
                    this.head.turnToBlock();
                    this.length ++;
                    this.head.wallNum = this.wallNum + '.' + this.length;
                     var prevHeadY = this.head.y,
                        prevHeadX = this.head.x;
                     // head is added
                     this.head = new WormBlock(this.scene, prevHeadX, prevHeadY, this.color, true, this.wallNum + '.0', this);
                    this.add(this.head);
                     this.head.play(this.color + 'Eat');
                     // tween to move head 30 px below
                     var eatTween = this.scene.tweens.add({
                        targets: this.head,
                        props: {
                            y: {value: otherObject.y, ease: 'Linear'}
                        },
                        duration: 400
                    });
                     this.scene.startEatAnimation();
                     this.head.on('animationcomplete', function(){
                         this.head.y = otherObject.y;
                         this.updateVertices();
                         // other object deactivated
                         otherObject.planForHide();
                         // change color
                         if (otherObject.color1 === this.color)
                        {
                            this.changeColor(otherObject.color2);
                        } else
                        {
                            this.changeColor(otherObject.color1);
                        }
                         PlainCollider.updateCollider(this, this.vertices);
                         this.scene.endEatAnimation();
                         this.eating = false;
                     }, this);
                     
                }
            }*/
        }
    }, {
        key: 'changeColor',
        value: function changeColor(newColor) {

            this.children.each(function (child) {
                if (child.head) {
                    child.anims.remove(this.color + 'Idle');
                    child.setFrame(newColor + 'Idle0');
                    child.play(newColor + 'Idle');
                } else child.setFrame(newColor);
            }, this);

            this.color = newColor;
        }
    }, {
        key: 'shortenWorm',
        value: function shortenWorm(dropSections) {
            // find sprites to remove

            this.children.each(function (wormBlock, index) {
                if (index > this.length - dropSections - 1) {
                    this.remove(wormBlock, true, true);
                } else if (index === this.length - dropSections - 1) {
                    wormBlock.turnToHead();
                    this.head = wormBlock;

                    this.head.play(this.color + 'Idle');

                    // flip head along x on idle animation repeat
                    this.head.on('animationrepeat-redIdle', function () {
                        var currentFlip = this.head.flipX;
                        this.head.setFlipX(!currentFlip);
                    }, this);
                    this.head.on('animationrepeat-orangeIdle', function () {
                        var currentFlip = this.head.flipX;
                        this.head.setFlipX(!currentFlip);
                    }, this);
                    this.head.on('animationrepeat-yellowIdle', function () {
                        var currentFlip = this.head.flipX;
                        this.head.setFlipX(!currentFlip);
                    }, this);
                    this.head.on('animationrepeat-greenIdle', function () {
                        var currentFlip = this.head.flipX;
                        this.head.setFlipX(!currentFlip);
                    }, this);
                }
            }, this);

            this.length -= dropSections;

            // update collider
            this.updateVertices();
            PlainCollider.updateCollider(this, this.vertices);
        }
    }, {
        key: 'updateVertices',
        value: function updateVertices() {
            this.vertices = [];
            this.children.each(function (block, index) {
                block.updateVertices();
                this.vertices.push(block.vertices[0]);
            }, this);
        }
    }, {
        key: 'applyVel',
        value: function applyVel() {
            this.children.each(function (wBlock) {
                wBlock.x += this.vel.x;
                wBlock.y += this.vel.y;
            }, this);

            this.collider.forEach(function (body) {
                body.forEach(function (segment) {
                    segment.point.x += this.vel.x;
                    segment.point.y += this.vel.y;
                }, this);
            }, this);
        }
    }, {
        key: 'updateVel',
        value: function updateVel() {

            this.vel.add(this.lastCorrection);
        }
    }, {
        key: 'update',
        value: function update(time, delta, timeCount) {

            this.vel.y = Math.min(24, this.vel.y + 1);
            this.vel.x = 0;

            this.velCorrected = false;
            this.lastCorrection = new Phaser.Math.Vector2();
            this.constraints = { x: { '1': this.movability, '-1': this.movability },
                y: { '1': this.movability, '-1': this.movability } };
        }
    }, {
        key: 'moveBackUpdate',
        value: function moveBackUpdate() {
            //console.log('move back update in worm');
            this.children.iterate(function (block, index) {
                block.moveBackUpdate();
            }, this);

            if (this.getChildren()[0].backPoint === undefined) {
                //console.log('update collider of worm');
                this.updateVertices();
                PlainCollider.updateCollider(this, this.vertices);
            }
        }
    }]);

    return Worm;
}(Phaser.GameObjects.Group);

module.exports = Worm;

/***/ }),

/***/ 1428:
/***/ (function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoloongTypeDict = __webpack_require__(79);
var Block = __webpack_require__(253);

var WormBlock = function (_Block) {
	_inherits(WormBlock, _Block);

	function WormBlock(scene, posX, posY, color, head, wallNum, worm) {
		_classCallCheck(this, WormBlock);

		var _this = _possibleConstructorReturn(this, (WormBlock.__proto__ || Object.getPrototypeOf(WormBlock)).call(this, scene, posX, posY, color, color, wallNum));

		_this.worm = worm;
		_this.head = head;

		// set texture

		_this.defineTexture();

		_this.setVertices();

		_this.roloongType = RoloongTypeDict.wormBlock;
		return _this;
	}

	_createClass(WormBlock, [{
		key: 'defineTexture',
		value: function defineTexture() {
			if (this.head) {
				this.setTexture('roloong');
				var frameName = this.color1 + 'Idle0';
				this.setFrame(frameName);
			} else {
				this.setTexture('wormBlock');
				this.setFrame(this.color1);
			}
		}
	}, {
		key: 'turnToBlock',
		value: function turnToBlock() {
			this.head = false;
			this.anims.remove(this.worm.color + 'Idle');
			this.removeAllListeners();

			this.setTexture('wormBlock');
			this.setFrame(this.worm.color);
		}
	}, {
		key: 'turnToHead',
		value: function turnToHead() {
			this.head = true;
			this.setTexture('roloong');
			var frameName = this.color1 + 'Idle0';
			this.setFrame(frameName);
			this.wallNum = this.worm.wallNum + '.0';
		}
	}]);

	return WormBlock;
}(Block);

module.exports = WormBlock;

/***/ }),

/***/ 1429:
/***/ (function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoloongTypeDict = __webpack_require__(79);
var Block = __webpack_require__(253);

var ColoredBlock = function (_Block) {
    _inherits(ColoredBlock, _Block);

    function ColoredBlock(scene, posX, posY, color1, color2, wallNum) {
        _classCallCheck(this, ColoredBlock);

        // set texture

        var _this = _possibleConstructorReturn(this, (ColoredBlock.__proto__ || Object.getPrototypeOf(ColoredBlock)).call(this, scene, posX, posY, color1, color2, wallNum));

        _this.defineTexture();

        _this.setVertices();

        _this.roloongType = RoloongTypeDict.coloredBlock;

        // add block shine
        _this.shine = scene.add.sprite(_this.x, _this.y, 'blockShine');

        _this.shine.visible = false;

        // add shine animation
        if (!scene.anims.get('blockShineAnim')) {
            var blockShineAnimFrameNames = scene.anims.generateFrameNames('blockShine', { start: 1, end: 7 });
            _this.blockShineAnim = scene.anims.create({ key: 'blockShineAnim', frames: blockShineAnimFrameNames,
                frameRate: 20, showOnStart: true, hideOnComplete: true });
        } else {
            _this.blockShineAnim = scene.anims.get('blockShineAnim');
        }

        scene.time.delayedCall(7000 + 3000 * Math.random(), function () {
            if (this) {
                this.launchShine();
            }
        }, [], _this);

        return _this;
    }

    _createClass(ColoredBlock, [{
        key: 'launchShine',
        value: function launchShine() {
            if (this) {
                // shine when no scale tween and in stanfin or fallinf mode
                if (this.scaleX === 1 && !this.eaten && (this.scene.currentMode === this.scene.modes.standing || this.scene.currentMode === this.scene.modes.falling)) {
                    this.shine.play('blockShineAnim');
                }
                this.scene.time.delayedCall(7000 + 3000 * Math.random(), function () {
                    this.launchShine();
                }, [], this);
            }
        }
    }, {
        key: 'defineTexture',
        value: function defineTexture() {
            this.setTexture('block');

            var frame;

            switch (this.color1) {
                case 'red':
                    switch (this.color2) {
                        case 'red':
                            frame = 'redRed';
                            break;
                        case 'orange':
                            frame = 'orangeRed';
                            break;
                        case 'yellow':
                            frame = 'yellowRed';
                            break;
                        case 'green':
                            frame = 'greenRed';
                            break;
                    }
                    break;
                case 'orange':
                    switch (this.color2) {
                        case 'red':
                            frame = 'orangeRed';
                            break;
                        case 'orange':
                            frame = 'orangeOrange';
                            break;
                        case 'yellow':
                            frame = 'yellowOrange';
                            break;
                        case 'green':
                            frame = 'greenOrange';
                            break;
                    }
                    break;
                case 'yellow':
                    switch (this.color2) {
                        case 'red':
                            frame = 'yellowRed';
                            break;
                        case 'orange':
                            frame = 'yellowOrange';
                            break;
                        case 'yellow':
                            frame = 'yellowYellow';
                            break;
                        case 'green':
                            frame = 'greenYellow';
                            break;
                    }
                    break;
                case 'green':
                    switch (this.color2) {
                        case 'red':
                            frame = 'greenRed';
                            break;
                        case 'orange':
                            frame = 'greenOrange';
                            break;
                        case 'yellow':
                            frame = 'greenYellow';
                            break;
                        case 'green':
                            frame = 'greenGreen';
                            break;
                    }
                    break;
            }

            this.setFrame(frame);
        }
    }, {
        key: 'update',
        value: function update(time, delta) {
            _get(ColoredBlock.prototype.__proto__ || Object.getPrototypeOf(ColoredBlock.prototype), 'update', this).call(this, time, delta);

            if (this.shine) {
                this.shine.setPosition(this.x, this.y);
            }
        }
    }]);

    return ColoredBlock;
}(Block);

module.exports = ColoredBlock;

/***/ }),

/***/ 1430:
/***/ (function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoloongTypeDict = __webpack_require__(79);
var Block = __webpack_require__(253);

var GreyBlock = function (_Block) {
    _inherits(GreyBlock, _Block);

    function GreyBlock(scene, posX, posY, wallNum) {
        _classCallCheck(this, GreyBlock);

        // set texture

        var _this = _possibleConstructorReturn(this, (GreyBlock.__proto__ || Object.getPrototypeOf(GreyBlock)).call(this, scene, posX, posY, 'grey', 'grey', wallNum));

        _this.defineTexture();

        _this.setVertices();

        _this.roloongType = RoloongTypeDict.greyBlock;
        return _this;
    }

    _createClass(GreyBlock, [{
        key: 'defineTexture',
        value: function defineTexture() {
            this.setTexture('block');
            this.setFrame('grey');
        }
    }]);

    return GreyBlock;
}(Block);

module.exports = GreyBlock;

/***/ }),

/***/ 1431:
/***/ (function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoloongTypeDict = __webpack_require__(79);

var Wall = function (_Phaser$GameObjects$S) {
    _inherits(Wall, _Phaser$GameObjects$S);

    function Wall(scene, posX, posY, wallNum) {
        _classCallCheck(this, Wall);

        var _this = _possibleConstructorReturn(this, (Wall.__proto__ || Object.getPrototypeOf(Wall)).call(this, scene, posX, posY, 'wallTile'));

        var frameArray = ['1', '2', '3'],
            frameNumber = Math.round(Math.random() * 2);

        _this.setFrame(frameArray[frameNumber]);

        _this.scene = scene;
        _this.wallNum = Number(wallNum);

        // variables for plain collider

        _this.vel = new Phaser.Math.Vector2();
        _this.movability = 0;
        _this.lastCorrection = new Phaser.Math.Vector2();
        _this.constraints = { x: { '1': _this.movability, '-1': _this.movability }, y: { '1': _this.movability, '-1': _this.movability } };
        _this.activeCollider = true;

        _this.leftPointWall = _this.getTopLeft().x;
        _this.topPointWall = _this.getTopLeft().y;
        _this.rightPointWall = _this.getBottomRight().x;
        _this.bottomPointWall = _this.getBottomRight().y;

        //console.log(this.width);

        // vertices for collider

        _this.vertices = [[[_this.leftPointWall, _this.topPointWall], [_this.rightPointWall, _this.topPointWall], [_this.rightPointWall, _this.bottomPointWall], [_this.leftPointWall, _this.bottomPointWall]]];

        scene.add.existing(_this);

        _this.roloongType = RoloongTypeDict.wall;
        return _this;
    }

    _createClass(Wall, [{
        key: 'velCorrection',
        value: function velCorrection(correction, axis) {

            this.lastCorrection[axis] += correction;
            this.velCorrected = true;
        }
    }, {
        key: 'applyVel',
        value: function applyVel() {
            this.x += this.vel.x;
            this.y += this.vel.y;
            this.collider.forEach(function (body) {
                body.forEach(function (segment) {
                    segment.point.x += this.vel.x;
                    segment.point.y += this.vel.y;
                }, this);
            }, this);
        }
    }, {
        key: 'collidedWith',
        value: function collidedWith(otherObject, collision) {}
    }, {
        key: 'updateVel',
        value: function updateVel() {
            this.vel.add(this.lastCorrection);
        }
    }, {
        key: 'update',
        value: function update(time, delta) {
            this.vel = new Phaser.Math.Vector2();
            this.velCorrected = false;
            this.lastCorrection = new Phaser.Math.Vector2();
            this.constraints = { x: { '1': this.movability, '-1': this.movability }, y: { '1': this.movability, '-1': this.movability } };
        }
    }, {
        key: 'getBackInTime',
        value: function getBackInTime() {}
    }, {
        key: 'rewindUpdate',
        value: function rewindUpdate() {}
    }]);

    return Wall;
}(Phaser.GameObjects.Sprite);

module.exports = Wall;

/***/ }),

/***/ 252:
/***/ (function(module, exports, __webpack_require__) {

var Pair = __webpack_require__(1425);

var PlainCollider = {

	initiate: function initiate(scene) {
		this.objects = [];
		this.currentCollGroupId = 0;
		this.collGroups = {};
		this.pairs = [];
		this.bouncyIndex = undefined;
		this.reporting = false;
		this.objectRemoved = false;
		this.scene = scene;
	},

	addObject: function addObject(object, vertices) {
		object.collider = [];
		// create an array of segments and assign it to the object
		vertices.forEach(function (body) {
			var clockWiseVertices = this.arrangeVerticesClockwise(body),
			    segments = clockWiseVertices.map(function (vertex, index, vertArray) {
				var point = new Phaser.Math.Vector2(vertex[0], vertex[1]),
				    nextIndex = index < vertArray.length - 1 ? index + 1 : 0,
				    dirV = new Phaser.Math.Vector2(vertArray[nextIndex][0] - vertex[0], vertArray[nextIndex][1] - vertex[1]),
				    normalVec = dirV.clone();

				normalVec.normalizeRightHand();
				normalVec.normalize();
				normalVec.scale(-1);

				return { point: point, direction: dirV, normal: normalVec };
			}, this);

			object.collider.push(segments);
		}, this);

		if (this.objects.length > 1) {
			object.colliderId = 1 + this.objects.reduce(function (maxId, curr, index, arr) {
				if (curr.colliderId > maxId) return curr.colliderId;
				return maxId;
			}, this.objects[0].colliderId);
		} else {
			object.colliderId = 1;
		}
		this.objects.push(object);

		if (object.children) {
			object.getChildren()[0].on('destroy', function (obj) {
				var objIndex = this.objects.indexOf(obj);
				this.objects.splice(objIndex, 1);
			}, this);
		} else {
			object.on('destroy', function (obj) {
				var objIndex = this.objects.indexOf(obj);
				this.objects.splice(objIndex, 1);
			}, this);
		}
	},

	updateCollider: function updateCollider(object, vertices) {
		object.collider = [];
		// create an array of segments and assign it to the object
		vertices.forEach(function (body) {
			var clockWiseVertices = this.arrangeVerticesClockwise(body),
			    segments = clockWiseVertices.map(function (vertex, index, vertArray) {
				var point = new Phaser.Math.Vector2(vertex[0], vertex[1]),
				    nextIndex = index < vertArray.length - 1 ? index + 1 : 0,
				    dirV = new Phaser.Math.Vector2(vertArray[nextIndex][0] - vertex[0], vertArray[nextIndex][1] - vertex[1]),
				    normalVec = dirV.clone();

				normalVec.normalizeRightHand();
				normalVec.normalize();
				normalVec.scale(-1);

				return { point: point, direction: dirV, normal: normalVec };
			}, this);

			object.collider.push(segments);
		}, this);
	},

	refreshPairs: function refreshPairs() {
		this.findAllPairs();
	},

	sortPairsByPriority: function sortPairsByPriority() {
		this.pairs.sort(function (a, b) {
			var aCorrectionIndex = a.object1.lastCorrPriority * a.object2.lastCorrPriority,
			    bCorrectionIndex = b.object1.lastCorrPriority * b.object2.lastCorrPriority;

			if (aCorrectionIndex < bCorrectionIndex) return -1;
			return 1;
		});
	},

	findAllPairs: function findAllPairs() {

		this.objects.sort(function (a, b) {
			if (a.movability > b.movability) return 1;
			return -1;
		});

		this.pairs = [];
		for (var r = 0; r < this.objects.length; r++) {
			this.pairs[r] = [];
			for (var c = 0; c < this.objects.length; c++) {
				if (c > r) {
					if (this.objects[r].collWith.indexOf(this.objects[c].collGroup) >= 0 && this.objects[c].collWith.indexOf(this.objects[r].collGroup) >= 0) this.pairs[r][c] = new Pair(this.objects[r], this.objects[c], this);else this.pairs[r][c] = false;
				} else if (c === r) {
					this.pairs[r][c] = false;
				} else {
					this.pairs[r][c] = this.pairs[c][r];
				}
			}
		}
	},

	injectObjectInPairs: function injectObjectInPairs(newObject) {
		this.pairs[this.objects.length - 1] = [];
		for (var c = 0; c < this.objects.length - 1; c++) {
			this.pairs[c][this.objects.length - 1] = new Pair(this.objects[c], newObject, this);
			this.pairs[this.objects.length - 1][c] = this.pairs[c][this.objects.length - 1];
		}
		this.pairs[this.objects.length - 1][this.objects.length - 1] = false;
	},

	removeObject: function removeObject(obj) {
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
		if (!this.objectRemoved) {
			//console.log('object remove called');
			this.pairs.splice(obj.colliderId, 1);
			this.pairs.forEach(function (pairRow) {
				pairRow.splice(obj.colliderId, 1);
			}, this);
			this.objectRemoved = true;
		}
	},

	arrangeVerticesClockwise: function arrangeVerticesClockwise(vertices) {
		// create array of vector out of vertices with start and direction vectors
		// find point inside vertices
		if (vertices.length > 3) {
			var innerPoint = new Phaser.Math.Vector2((vertices[0][0] + vertices[2][0]) * 0.5, (vertices[0][1] + vertices[2][1]) * 0.5);
		} else {
			var innerPoint = new Phaser.Math.Vector2((vertices[0][0] + vertices[1][0]) * 0.5, (vertices[0][1] + vertices[1][1]) * 0.5);
		}

		var vertCopy = vertices.slice();
		vertCopy.sort(function (a, b) {
			var aVec = new Phaser.Math.Vector2(a[0] - innerPoint.x, a[1] - innerPoint.y),
			    bVec = new Phaser.Math.Vector2(b[0] - innerPoint.x, b[1] - innerPoint.y);

			if (aVec.angle() > bVec.angle()) {
				return 1;
			}
			return -1;
		}, this);

		return vertCopy;
	},

	rotateCollider: function rotateCollider(object, angle, rotPoint) {

		var rotateMatrix = new Phaser.Math.Matrix3();

		rotateMatrix.fromArray([Math.cos(angle), Math.sin(angle), 0, -Math.sin(angle), Math.cos(angle), 0, 0, 0]);

		object.collider.forEach(function (body) {
			body.forEach(function (segment) {
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

	registerNewCollGroup: function registerNewCollGroup(name) {
		this.collGroups[name] = this.currentCollGroupId;

		this.currentCollGroupId++;

		return this.collGroups[name];
	},

	assignCollGroup: function assignCollGroup(object, name) {
		object.collGroup = this.collGroups[name];
	},

	getPairsWithObject: function getPairsWithObject(object) {
		var pairsWithObject = this.pairs.filter(function (pair) {
			if (pair.object1.colliderId === object.colliderId || pair.object2.colliderId === object.colliderId) {
				return true;
			}
			return false;
		}, this);

		return pairsWithObject;
	},

	checkCollisionsWithObject: function checkCollisionsWithObject(object) {
		var pairs = this.getPairsWithObject(object);

		pairs.forEach(function (pair) {
			pair.checkPairCollision(false);
		}, this);
	},

	checkCollisions: function checkCollisions(objArray) {
		var currentPairCell = [0, 1],
		    queueStop = 0,
		    rowsToCheck = [],
		    totalCalledRows = [],
		    iterationCounter = 0;

		while (queueStop < this.objects.length && iterationCounter < 100000) {
			//if (this.reporting) console.log(this.pairs[currentPairCell[0]][currentPairCell[1]]);
			//console.log(nonCheckedPairs);
			var pair = this.pairs[currentPairCell[0]][currentPairCell[1]];
			/*if (iterationCounter > 900)
   {
   	console.log('current cell '+currentPairCell);
   }*/
			if (pair) {
				var pairCollided = pair.checkPairCollision();
				/*if (iterationCounter > 900)
    {
    	console.log('pair collided '+pairCollided);
    }*/
				if (pairCollided) {
					totalCalledRows.push(currentPairCell);
					if (rowsToCheck.indexOf(currentPairCell[1]) < 0) {
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

			if (currentPairCell[1] === this.objects.length - 1) {
				if (rowsToCheck.length === 0) {
					queueStop++;
					currentPairCell = [queueStop, 0];
				} else {
					currentPairCell = [rowsToCheck.shift(), 0];
				}
			} else {

				currentPairCell = [currentPairCell[0], currentPairCell[1] + 1];
			}
			if (pair) iterationCounter++;
		}
		if (iterationCounter >= 100000) {
			//console.log('out of while with iterations_____________________');

		}

		for (var i = 0; i < this.objects.length; i++) {
			for (var j = 0; j < i; j++) {

				var pair = this.pairs[j][i];

				if (pair) {
					if (pair.nowCollided && !pair.previouslyCollided) {
						//this.scene.collisionPoints.push(pair.collisionPoints[0]);
						//this.scene.collisionPoints.push(pair.collisionPoints[1]);
					}
					pair.updateCollisionStatus();
				}
			}
		}
	},

	updateObjectsIds: function updateObjectsIds() {
		if (this.objectRemoved) {
			//console.log('object collID update called');
			//console.log(this.objects);
			// update collider ids
			this.objects.forEach(function (entity, index) {
				entity.colliderId = Number(index);
			}, this);
			this.objectRemoved = false;
		}
	},


	drawColliders: function drawColliders(graphics) {
		graphics.clear();

		this.objects.forEach(function (object) {
			graphics.beginPath();
			object.collider.forEach(function (body) {
				body.forEach(function (segment, index, arr) {
					if (index === 0) {
						graphics.moveTo(segment.point.x, segment.point.y);
					} else {
						graphics.lineTo(segment.point.x, segment.point.y);
						if (index === arr.length - 1) {
							graphics.closePath();
							graphics.strokePath();
						}
					}
				}, this);
			}, this);
		}, this);
	},

	moveAll: function moveAll(delta) {
		this.objects.forEach(function (object) {

			object.updateVel(delta);
			object.applyVel();
		}, this);
	}

};

module.exports = PlainCollider;

/***/ }),

/***/ 253:
/***/ (function(module, exports, __webpack_require__) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoloongTypeDict = __webpack_require__(79);
var PlainCollider = __webpack_require__(252);

var Block = function (_Phaser$GameObjects$S) {
    _inherits(Block, _Phaser$GameObjects$S);

    function Block(scene, posX, posY, color1, color2, wallNum) {
        _classCallCheck(this, Block);

        var _this = _possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).call(this, scene, posX, posY));

        _this.scene = scene;
        _this.wallNum = wallNum;
        _this.color1 = color1;
        _this.color2 = color2;
        _this.posArray = [];

        // variables for plain collider

        _this.vel = new Phaser.Math.Vector2();
        _this.movability = 1;
        _this.lastCorrection = new Phaser.Math.Vector2();
        _this.activeCollider = true;
        _this.toDestroy = false;
        _this.constraints = { x: { '1': _this.movability, '-1': _this.movability },
            y: { '1': _this.movability, '-1': _this.movability } };

        _this.fallen = false;
        _this.eaten = false;
        _this.backPoint = undefined;
        _this.movedBack = true;

        scene.add.existing(_this);

        _this.roloongType = RoloongTypeDict.block;
        return _this;
    }

    _createClass(Block, [{
        key: 'defineTexture',
        value: function defineTexture() {
            // function for subclasses to define
            // texture and frame
        }
    }, {
        key: 'setVertices',
        value: function setVertices() {

            // vertices for collider

            var topLeft = this.getTopLeft(),
                bottomRight = this.getBottomRight();

            this.vertices = [[[topLeft.x, topLeft.y], [bottomRight.x, topLeft.y], [bottomRight.x, bottomRight.y], [topLeft.x, bottomRight.y]]];
        }
    }, {
        key: 'planForHide',
        value: function planForHide() {
            this.alpha = 0;
            this.activeCollider = false;
            this.scene.eatenBlocks[this.scene.eatenBlocks.length - 1].push(this);
            this.eaten = true;
        }
    }, {
        key: 'resurrect',
        value: function resurrect() {
            this.alpha = 1;
            this.activeCollider = true;
            this.eaten = false;
        }
    }, {
        key: 'updateVertices',
        value: function updateVertices() {
            var topLeft = this.getTopLeft(),
                bottomRight = this.getBottomRight();

            this.vertices = [[[topLeft.x, topLeft.y], [bottomRight.x, topLeft.y], [bottomRight.x, bottomRight.y], [topLeft.x, bottomRight.y]]];
        }
    }, {
        key: 'velCorrection',
        value: function velCorrection(correction, axis) {

            this.velCorrected = true;
            this.lastCorrection[axis] += correction;

            if (axis == 'y' && correction < 0 && !this.fallen) {
                this.scene.minusFallingObject();
                this.fallen = true;
                //this.launchBounceTween();
            }
        }
    }, {
        key: 'launchBounceTween',
        value: function launchBounceTween() {

            this.setOrigin(0.5, 1);
            this.y += this.width / 2;

            var bounceTween = this.scene.tweens.add({
                targets: this,
                props: { scaleX: { value: 1.1, ease: 'Sine.easeInOut' },
                    scaleY: { value: 0.9, ease: 'Sine.easeInOut' }
                },
                duration: 100,
                yoyo: true
            });

            bounceTween.setCallback('onComplete', function () {
                this.setOrigin(0.5, 0.5);
                this.y -= this.width / 2;
            }, [], this);
        }
    }, {
        key: 'collidedWith',
        value: function collidedWith(otherObject, correction, collision) {}
    }, {
        key: 'applyVel',
        value: function applyVel() {
            if (this.activeCollider) {
                this.x += this.vel.x;
                this.y += this.vel.y;
                this.collider.forEach(function (body) {
                    body.forEach(function (segment) {
                        segment.point.x += this.vel.x;
                        segment.point.y += this.vel.y;
                    }, this);
                }, this);
            }
        }
    }, {
        key: 'updateVel',
        value: function updateVel() {

            this.vel.add(this.lastCorrection);
        }
    }, {
        key: 'update',
        value: function update(time, delta, timeCount) {

            if (this.toDestroy) {
                this.destroy();
            } else {

                this.vel.y = Math.min(24, this.vel.y + 1);
                this.vel.x = 0;

                this.lastCorrection = new Phaser.Math.Vector2();
                this.constraints = { x: { '1': this.movability, '-1': this.movability },
                    y: { '1': this.movability, '-1': this.movability } };
            }
        }
    }, {
        key: 'moveBackUpdate',
        value: function moveBackUpdate() {
            //console.log('call for block update');
            if (!this.movedBack) {
                //console.log('move back in block update');
                if (this.backPoint) {
                    //console.log('has back point');
                    var xDistance = this.backPoint[0] - this.x,
                        yDistance = this.backPoint[1] - this.y,
                        xDir,
                        yDir,
                        xMove,
                        yMove;

                    if (xDistance != 0) {
                        xDir = xDistance / Math.abs(xDistance);
                        xMove = xDir * Math.min(8, xDir * xDistance);
                    } else {
                        xMove = 0;
                    }

                    if (yDistance != 0) {
                        yDir = yDistance / Math.abs(yDistance);
                        yMove = yDir * Math.min(8, yDir * yDistance);
                    } else {
                        yMove = 0;
                    }

                    this.x += xMove;
                    this.y += yMove;

                    if (xMove === 0 && yMove === 0) {
                        this.scene.minusMovingBackObject();
                        this.backPoint = undefined;
                        this.movedBack = true;
                        this.updateVertices();
                        PlainCollider.updateCollider(this, this.vertices);
                    }
                } else {
                    this.backPoint = this.posArray.pop();
                }
            }
        }
    }]);

    return Block;
}(Phaser.GameObjects.Sprite);

module.exports = Block;

/***/ }),

/***/ 530:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(254);

var _BootScene = __webpack_require__(1420);

var _PreloaderScene = __webpack_require__(1421);

var _MainMenuScene = __webpack_require__(1422);

var _LevelChoiceScene = __webpack_require__(1423);

var _PlayScene = __webpack_require__(1424);

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
        backgroundColor: '#1b2337',
        scene: [_BootScene.BootScene, _PreloaderScene.PreloaderScene, _MainMenuScene.MainMenuScene, _LevelChoiceScene.LevelChoiceScene, _PlayScene.PlayScene]
    };
} else {
    //console.log('is desktop');
    defaultWidth = 600;
    defaultHeight = 600;
    var gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.NONE,
            parent: 'gameContainer',
            width: defaultWidth,
            height: defaultHeight
        },
        backgroundColor: '#1b2337',
        scene: [_BootScene.BootScene, _PreloaderScene.PreloaderScene, _MainMenuScene.MainMenuScene, _LevelChoiceScene.LevelChoiceScene, _PlayScene.PlayScene]
    };
}

var allowedDomains = ['coolmath-games.com', 'https://www.coolmath-games.com', 'edit.coolmath-games.com', 'stage.coolmath-games.com', 'edit-stage.coolmath-games.com', 'dev.coolmath-games.com', 'm.coolmath-games.com', 'coolmathgames.com', 'edit.coolmathgames.com', 'stage.coolmathgames.com', 'edit-stage.coolmathgames.com', 'dev.coolmathgames.com', 'm.coolmathgames.com', 'coolmathgames.com', 'www.coolmath-games.com', 'www.coolmath-games.com', 'www.edit.coolmath-games.com', 'www.stage.coolmath-games.com', 'www.edit-stage.coolmath-games.com', 'www.dev.coolmath-games.com', 'www.m.coolmath-games.com', 'www.coolmathgames.com', 'www.edit.coolmathgames.com', 'www.stage.coolmathgames.com', 'www.edit-stage.coolmathgames.com', 'www.dev.coolmathgames.com', 'www.m.coolmathgames.com', 'www.coolmathgames.com', 'https://www.coolmathgames.com', 'localhost', '192.168.1.73', 'kpded.com'];

//console.log(window.location.hostname);

if (allowedDomains.indexOf(window.location.hostname) >= 0) var game = new Phaser.Game(gameConfig);else console.log('not allowed domain ' + window.location.hostname);

window.init = function () {
    Security.allowDomain("*");
    Security.allowDomain("coolmath-games.com");

    if (ExternalInterface.available) {
        ExternalInterface.addCallback("unlockAllLevels", unlockAllLevels);
    }
};

window.unlockAllLevels = function () {

    game.lastAvailLevel = 36;
    localStorage.setItem('roloongLastLevel', 36);

    if (game.scene.isActive('LevelChoiceScene')) game.scene.getScene('LevelChoiceScene').scene.restart();
};

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
                    scene.scaleAndPositionUI();
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

/***/ }),

/***/ 79:
/***/ (function(module, exports) {

var RoloongTypeDict = Object.freeze({
	wall: 1,
	block: 2,
	coloredBlock: 3,
	greyBlock: 4,
	wormBlock: 5,
	worm: 6
});

module.exports = RoloongTypeDict;

/***/ })

},[530]);