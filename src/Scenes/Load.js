class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        //load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        //load tilemap information
        //make sure names are appropriate
        this.load.image("general_tiles", "tilemap_packed.png"); // Packed tilemap
        this.load.image("farm_tiles", "tilemap-farm_packed.png"); // Packed tilemap
        this.load.tilemapTiledJSON("level", "Level.tmj");// Tilemap in JSON

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

        //load any unique assets
        //load background
        this.load.image("background", "background.png");

        //load font

        //load audio


    }

    create() {
        //create animations

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

        //then pass to the next scene
        this.scene.start("somethingFresh");
    }

    //never reached
    update() {
    }
}