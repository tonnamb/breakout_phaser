var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
    preload: preload, create: create, update: update
});

var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;

function preload() {
    // Scale to all screen sizes
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.stage.backgroundColor = "#eee";

    game.load.image('ball', 'img/ball.png');
    game.load.image('paddle', 'img/paddle.png');
    game.load.image('brick', 'img/brick.png');

    game.load.spritesheet('ball', 'img/wobble.png', 20, 20);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball');
    ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.velocity.set(150, -150);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    // ball.body.gravity.y = 100;

    paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    // allow losing
    game.physics.arcade.checkCollision.down = false;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);

    initBricks();

    var textStyle = { font: '18px Arial', fill: '#0095DD' };

    scoreText = game.add.text(5, 5, 'Points: 0', textStyle);

    // lives text
    livesText = game.add.text(game.world.width - 5, 5, 'Lives: '+lives, textStyle);
    livesText.anchor.set(1, 0); // right align by anchor
    lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'Life lost, click to continue', textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;
}

function update() {
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    paddle.x = game.input.x || game.world.width*0.5;
}

function initBricks() {
    brickInfo = {
        width: 50,
        height: 20,
        count: {
            row: 7,
            col: 3
        },
        offset: {
            top: 50,
            left: 60
        },
        padding: 10
    };

    bricks = game.add.group();
    
    for (var c = 0; c < brickInfo.count.col; c += 1) {
        for (var r = 0; r < brickInfo.count.row; r += 1) {
            var brickX = (r*(brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
            var brickY = (c*(brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
            newBrick = game.add.sprite(brickX, brickY, 'brick');
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
}

function ballHitBrick(ball, brick) {
    var killTween = game.add.tween(brick.scale);
    killTween.to({ x: 0, y: 0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function () {
        brick.kill();
    }, this);
    killTween.start();

    score += 10;
    scoreText.setText('Points: '+score);

    var count_alive = 0;
    for (var i = 0; i < bricks.children.length; i += 1) {
        if (bricks.children[i].alive === true) {
            count_alive += 1;
        }
    }
    if (count_alive === 0) {
        alert('You won the game, congratulations!');
        location.reload();
    }

    ball.animations.play('wobble');
}

function ballLeaveScreen() {
    lives -= 1;
    if (lives) {
        livesText.setText('Lives: '+lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width * 0.5, game.world.height - 25);
        paddle.reset(game.world.width * 0.5, game.world.height - 5);
        game.input.onDown.addOnce(function () {
            lifeLostText.visible = false;
            ball.body.velocity.set(150, -150);
        }, this);
    } else {
        alert('You lost, game over!');
        location.reload();
    }
}

function ballHitPaddle(ball, paddle) {
    ball.animations.play('wobble');
}