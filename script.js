var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
    preload: preload, create: create, update: update
});

var ball;
var paddle;

function preload() {
    // Scale to all screen sizes
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.stage.backgroundColor = "#eee";

    game.load.image('ball', 'img/ball.png');
    game.load.image('paddle', 'img/paddle.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    ball = game.add.sprite(50, 50, 'ball');
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.velocity.set(150, 150);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    // ball.body.gravity.y = 100;

    paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;
}

function update() {
    game.physics.arcade.collide(ball, paddle);
}