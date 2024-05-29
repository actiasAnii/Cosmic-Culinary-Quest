class EndLose extends Phaser.Scene {
    constructor() 
    {
        super("endLose");
    }

    preload()
    {
        //load the plugin for animation
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create()
    {
        ////////set up map

        //simple background
        this.skyBackground = this.add.tileSprite(-440, -40, game.config.width, game.config.height, 'background');
        this.skyBackground.setOrigin(0, 0).setDepth(-100).setScale(5);


        this.map = this.add.tilemap("loseScreen", 18, 18, 60, 35);

        //create camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(1.2).setPosition(0, 0);

        //add tilesets to map
        this.general_tileset = this.map.addTilesetImage("tilemap_packed", "general_tiles");
        this.farm_tileset = this.map.addTilesetImage("tilemap-farm_packed", "farm_tiles");

        //create layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", [this.general_tileset, this.farm_tileset], 0, 0);

        //create restart key
        this.restart = this.input.keyboard.addKey("R");

        //update high score if necessary
        if (myScore > highScore){
            highScore = myScore;
        }

        //display text
        my.text.lost = this.add.bitmapText(game.config.width/2, game.config.height/2 - 240, "thick", "YOU LOST!").setOrigin(0.5).setScale(4.2);
        my.text.reportScoreL = this.add.bitmapText(game.config.width/2, game.config.height/2 - 120, "thick", "YOUR SCORE: " + ("00000" + myScore).slice(-5)).setOrigin(0.5).setScale(2.5);
        my.text.reportHighScoreL = this.add.bitmapText(game.config.width/2, game.config.height/2 + 10, "thick", "HIGH SCORE: " + ("00000" + highScore).slice(-5)).setOrigin(0.5).setScale(2.5);
        my.text.playAgainL = this.add.bitmapText(game.config.width/2, game.config.height/2 + 160, "thick", "press R to play again!").setOrigin(0.5).setScale(2.5);

        //start tile animations
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