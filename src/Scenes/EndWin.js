class EndWin extends Phaser.Scene {
    constructor() 
    {
        super("endWin");
    }

    preload()
    {
        //load the plugin for animation
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create()
    {
        ////////set up map

        //create background
        this.skyBackground = this.add.tileSprite(-440, -60, game.config.width, game.config.height, 'background');
        this.skyBackground.setOrigin(0, 0).setDepth(-100).setScale(5);

        this.map = this.add.tilemap("winScreen", 18, 18, 60, 35);

        //create camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(1.3);

        //add tilesets to map
        this.general_tileset = this.map.addTilesetImage("tilemap_packed", "general_tiles");
        this.farm_tileset = this.map.addTilesetImage("tilemap-farm_packed", "farm_tiles");
        this.character_tileset = this.map.addTilesetImage("tilemap-characters_packed01", "character_tiles");

        //create layers
        this.objectsLayer = this.map.createLayer("Decoration", [this.general_tileset, this.farm_tileset], 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", [this.general_tileset, this.farm_tileset], 0, 0);

        //make player sprite
        this.player = this.map.createFromObjects("Player", { //create
            name: "player",
            key: "platformer_characters",
            frame: "tile_0006.png"
        });

        //play silly jump animation
        this.player.forEach(player => {
            player.setScale(1.1);
            player.anims.play('sillyJump');
            });

        //create restart key
        this.restart = this.input.keyboard.addKey("R");

        //update high score if necessary
        if (myScore > highScore){
            highScore = myScore;
        }

        //display text
        my.text.won = this.add.bitmapText(game.config.width/2, game.config.height/2 - 240, "thick", "YOU WON!").setOrigin(0.5).setScale(4.2);
        my.text.reportScoreW = this.add.bitmapText(game.config.width/2, game.config.height/2 - 155, "thick", "YOUR SCORE: " + ("00000" + myScore).slice(-5)).setOrigin(0.5).setScale(2.5);
        my.text.reportHighScoreW = this.add.bitmapText(game.config.width/2, game.config.height/2 + 50, "thick", "HIGH SCORE: " + ("00000" + highScore).slice(-5)).setOrigin(0.5).setScale(2.5);
        my.text.playAgainW = this.add.bitmapText(game.config.width/2, game.config.height/2 + 180, "thick", "press R to play again!").setOrigin(0.5).setScale(2.5);

        //start animated tiles
        this.animatedTiles.init(this.map);

    }

    update()
    {
        //if restart key is pressed, return to gameplay scene
        if (Phaser.Input.Keyboard.JustDown(this.restart)) {
            this.scene.start("somethingFresh");
        }

    }
}