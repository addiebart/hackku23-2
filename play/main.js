var config = {
    type: Phaser.AUTO,
	width: 96,
	height: 96,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 48 }
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

/** @this {Phaser.Game} */
function preload ()
{
    canvas = document.querySelectorAll("canvas")[0];
    canvas.className = "main";
    this.load.setBaseURL("../assets")
    this.load.image('background', 'background.png');
    this.load.image('star', 'star.png')
    this.load.spritesheet('ground', 'ground.png', {
        frameWidth: 16,
        frameHeight: 16});
    this.load.spritesheet("player", "player.png", {
        frameWidth: 16,
        frameHeight: 16});
    this.load.spritesheet("enemy1", "enemy1.png", {
        frameWidth: 16,
        frameHeight: 16});
}

/** @this {Phaser.Scene} */
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
    /** @type {Phaser.GameObjects.Sprite} */
    player = this.physics.add.sprite(1*16, 16, "player");
    player.setOrigin(.5, 0);

    let platforms = this.physics.add.staticGroup();
    platforms.setOrigin(0,0);
    for (let i = 0; i < 255; i++) {
        platforms.create(8+16*i, 96-8, 'ground')
    }

    //make floor solid to player
    this.physics.add.collider(player, platforms);

}   

/** @this {Phaser.Scene} */
function update ()
{
    let speed = 16;

        //right
        if (arrowKey?.right.isDown) {
            player.body.velocity.x = speed;
            player.flipX = false;
        }
        //left
        else if (arrowKey?.left.isDown) {
            player.body.velocity.x = -speed;
            player.flipX = true;
        }
        //default
        else {player.body.velocity.x = 0}
        //fastfall
        if (arrowKey?.down.isDown && player.body.velocity.y < 0) {
            player.body.setMaxVelocityY(24);
            player.body.velocity.y += 2;
        }

        if (player.body.velocity.y == 0) {
            player.body.setMaxVelocityY(100000);
        }

        //jump
        if ((Phaser.Input.Keyboard.JustDown(arrowKey?.up) || Phaser.Input.Keyboard.JustDown(space)) && player.body.touching.down) {
            player.body.velocity.y = -50;
        }

        //camera follows player
        this.cameras.main.centerOnX(player.x);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

}
