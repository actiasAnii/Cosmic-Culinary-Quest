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
        this.load.image("general-tiles", "tilemap_packed.png"); // Packed tilemap
        this.load.image("farm-tiles", "tilemap-farm_packed.png"); // Packed tilemap
        this.load.tilemapTiledJSON("level", "Level.tmj");// Tilemap in JSON

        // Load the tilemaps as a spritesheet
        this.load.spritesheet("general-sheet", "tilemap_packed.png", {
            //px width/height
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("farm-sheet", "tilemap-farm_packed.png", {
            //px width/height
            frameWidth: 18,
            frameHeight: 18
        });

        //multiatlas ripped from improved platformer
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        //load any unique assets
        //load background
        this.load.image("background", "background.png");

        //load font

        //load audio


    }

    create() {
        //create animations

        //then pass to the next scene
        this.scene.start("somethingFresh");
    }

    //never reached
    update() {
    }
}