import Phaser from "phaser";

var config = {
    type: Phaser.AUTO,
	width: 96,
	height: 96,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 32 }
		}
	},
	pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    canvas = document.querySelectorAll("canvas")[0];
    canvas.className = "main";
    this.load.setBaseURL("assets")
    this.load.image('background', 'brickwall.jpg');
    this.load.image('ground', 'woodplank.jpg');
    this.load.spritesheet("player", "player.png", {
        frameWidth: 16,
        frameHeight: 16
    })
}

function create ()
{
    //enable physics
    this.physics.resume()

    //make map
    map = this.make.tilemap({key: 'map'});

    //controls
    arrowKey = this.input.keyboard?.createCursorKeys();
    space = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    let bg = this.add.image(0, 0, "background");
    bg.scale = .25;
    bg.setOrigin(0, 0);
    player = this.physics.add.sprite(1*16, 16, "player");
    player.setOrigin(.5, 0);
    player.body.collideWorldBounds = true;

    let platforms = this.physics.add.staticGroup();
    platforms.setOrigin(0,0);
    for (let i = 0; i < 255; i++) {
        platforms.create(8+16*i, 96-8, 'ground')
    }
}

function update ()
{
}