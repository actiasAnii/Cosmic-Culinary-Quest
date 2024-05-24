class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        //load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        //EDITS: 
        //load both packed tiles
        //make sure names are appropriate
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            //px width/height
            frameWidth: 18,
            frameHeight: 18
        });

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        //asset key values are filenames of pngs
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        //create animations

         // then pass to the next scene
         this.scene.start("somethingFresh");
    }

    //never reach
    update() {
    }
}