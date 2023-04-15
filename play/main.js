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
    this.load.spritesheet("planks", "woodplank.jpg", {
        frameHeight: 8,
        frameWidth: 8
    })
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

    //draw background
    let bg = this.physics.add.sprite(0, 0, "background");
    bg.body.setMaxVelocityY(0);
    bg.body.setMaxVelocityX(0);
    bg.setScrollFactor(0);
    bg.scale = .03;
    bg.setOrigin(0, 0);
    /** @type {Phaser.GameObjects.Sprite} */
    player = this.physics.add.sprite(1*16, 16, "player");
    player.setOrigin(.5, 0);
    player.setSize(8, 16, true);

    let platforms = this.physics.add.staticGroup();
    platforms.setOrigin(0,0);
    tileswide = 511;
    //draw ground
    for (let i = 0; i < tileswide; i++) {
        platforms.create(8+16*i, 96, 'ground')
    }
    //co-oridinates of platform blocks to be placed in a loop.
    platCoords = [
        [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],
        [0,6],[0,7],[0,8],[0,9],[0,10],[0,11],
        [0,12],[5,2],[5,3],[9,2],[9,3],[9,4]        
    ];

    let convertPlatXY = function(coord, yflag) {
        let out = coord;
        if (yflag) {out = 12 - out;} //flip coords
        out *= 8; //for 16-pixel tiles
        out -= 4; //to center
        return out;
    }

    //draw platforms
    // for (let i = 0; i < platCoords.length; i++) {
    //     platforms.create(convertPlatXY(platCoords[i][0], false), convertPlatXY(platCoords[i][1], true), "planks");
    // }

    let star = this.physics.add.group();
    star.create(25,5,"star")
    star.create(50,5,"star")
    var starCount = 0;
    var scoreText;
    scoreText = this.add.text(2, 2, 'Score: ' + starCount, { fontSize: '12px', fill: '#fff' , fontFamily: 'Arial Black'});
    scoreText.setScrollFactor(0)

    //make floor solid to player
    this.physics.add.collider(player, platforms);
    
    //animation set for player
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1,
    });
    this.anims.create({
        key: 'crouch',
        frames: this.anims.generateFrameNumbers('player', { start: 2, end: 2}),
        frameRate: 2,
        repeat: -1,
    });
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('player', { start: 3, end: 4 }),
        frameRate: 2,
    });
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 6 }),
        frameRate: 2,
        repeat: -1,
    });
    this.anims.create({
        key: 'die',
        frames: this.anims.generateFrameNumbers('player', { start: 7, end: 11 }),
        frameRate: 2,
    });
    
    this.physics.add.collider(star, platforms)
    this.physics.add.overlap(star, player, (obj1, obj2) => {
        obj2.disableBody(true, true)
        starCount += 10
        scoreText.setText('Score: '+starCount)
    });

    //camera
    this.cameras.main.startFollow(player);
}

/** @this {Phaser.Scene} */
function update ()
{
    let speed = 16;
    
        //right
        if (arrowKey?.right.isDown) {
            player.body.velocity.x = speed;
            player.anims.play('walk', true);
            player.flipX = false;
        }
        //left
        else if (arrowKey?.left.isDown) {
            player.body.velocity.x = -speed;
            player.anims.play('walk', true);
            player.flipX = true;
        }
        //default
        else {
            player.body.velocity.x = 0
            player.anims.play('idle', true);
        }
        //fastfall
        if (arrowKey?.down.isDown && player.body.velocity.y < 0) {
            player.body.setMaxVelocityY(24);
            player.body.velocity.y += 2;
        }

        if (player.body.velocity.y == 0) {
            player.body.setMaxVelocityY(100000);
        }
        //crouch
        if (Phaser.Input.Keyboard.DownDuration(arrowKey?.down, Infinity)) {
            player.body.velocity.x = 0;
            player.anims.play('crouch', true);
        }
        //jump
        if ((Phaser.Input.Keyboard.JustDown(arrowKey?.up) || Phaser.Input.Keyboard.JustDown(space)) && player.body.touching.down) {
            player.body.velocity.y = -50;
            player.anims.play('jump', true);
        }

        //camera follows player
        this.cameras.main.setBounds(0, 0, (tileswide-1) * 16, 96);

}
