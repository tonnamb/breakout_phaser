var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
    preload: preload, create: create, update: update
});

var ball;

function preload() {
    // Scale to all screen sizes
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    game.stage.backgroundColor = "#eee";

    game.load.image('ball', 'img/ball.png')
}

function create() {
    ball = game.add.sprite(50, 50, 'ball');
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.velocity.set(150, 150);
}

function update() {
}