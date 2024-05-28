class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {

        //set path for rest of assets
        this.load.setPath("./assets/");

        //load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        //load tilemap information
        //make sure names are appropriate
        this.load.image("general_tiles", "tilemap_packed.png");
        this.load.image("farm_tiles", "tilemap-farm_packed.png");
        this.load.image("character_tiles", "tilemap-characters_packed01.png");
        this.load.tilemapTiledJSON("level", "Level.tmj");//level tilemap in JSON
        this.load.tilemapTiledJSON("winScreen", "WinScreen.tmj"); //win screen tilemap in JSON
        this.load.tilemapTiledJSON("loseScreen", "LoseScreen.tmj"); //lose screen tilemap in JSON

        // Load the tilemaps as a spritesheet
        this.load.spritesheet("general_sheet", "tilemap_packed.png", {
            //px width/height
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("farm_sheet", "tilemap-farm_packed.png", {
            //px width/height
            frameWidth: 18,
            frameHeight: 18
        });

        //multiatlas ripped from improved platformer
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        //load the rotates particles
        this.load.image("trace1", "trace_06_rotated.png");
        this.load.image("trace2", "trace_07_rotated.png");

        //load health bar
        this.load.image("heartEmpty", "heart_empty.png");
        this.load.image("heartFull", "heart_full.png");

        //load background
        this.load.image("background", "background.png");

        //load font
        this.load.bitmapFont("thick", "thick_8x8.png", "thick_8x8.xml");

        //load audio
        this.load.audio("soundJump", "laserSmall_002.ogg"); //sound for jumping
        this.load.audio("soundLand", "footstep_grass_001.ogg"); //sound for landing after a jump/fall
        this.load.audio("soundWalk1", "footstep_grass_003.ogg"); //sound for walking
        this.load.audio("soundWalk2", "footstep_grass_002.ogg"); //sound for walking
        this.load.audio("soundCollect", "jingles_NES09.ogg"); //sound for accquiring collectibles
        this.load.audio("soundDrown", "jingles_NES11.ogg"); //sound for drowning/losing health
        this.load.audio("soundCheckpoint", "jingles_NES03.ogg"); //sound for setting a new checkpoint
        this.load.audio("soundWin", "jingles_NES12.ogg"); //sound for transitioning to win screen
        this.load.audio("soundLose", "jingles_NES00.ogg"); //sound for transitioning to lose screen
    

    }

    create() {
        //create animations

        /////player animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 6,
                end: 7,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0006.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0007.png" }
            ],
        });

        this.anims.create({
            key: 'sillyJump',
            defaultTextureKey: "platformer_characters",
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 6,
                end: 7,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 2,
            repeat: -1
        });


        ////object animations
        this.anims.create({
            key: 'flagWave',
            frames: [
                { key: 'general_sheet', frame: 111 },
                { key: 'general_sheet', frame: 112 }
            ],
            frameRate: 4, 
            repeat: -1 // Repeat indefinitely
        });

        this.anims.create({
            key: 'radishPeep',
            frames: [
                { key: 'farm_sheet', frame: 42 },
                { key: 'farm_sheet', frame: 43 }
            ],
            frameRate: 1, 
            repeat: -1 // Repeat indefinitely
        });

        this.anims.create({
            key: 'carrotPeep',
            frames: [
                { key: 'farm_sheet', frame: 56 },
                { key: 'farm_sheet', frame: 72 }
            ],
            frameRate: 2, 
            repeat: -1 // Repeat indefinitely
        });



        //then pass to the next scene
        this.scene.start("somethingFresh");
    }



    //never reached
    update() {
    }
}