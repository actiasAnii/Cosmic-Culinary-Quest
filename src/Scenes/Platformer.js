class Platformer extends Phaser.Scene {
    constructor() {
        super("somethingFresh");
    }

    init() 
    {
        //variables and settings
        //mess around with them
        this.physics.world.gravity.y = 1500;
        this.physics.world.bounds.width = 3240;
        this.physics.world.bounds.height = 540;
        this.SCALE = 2;
    }

    create() 
    {
        
        ////////set up map
        this.map = this.add.tilemap("level", 18, 18, 180, 30);

        //add tilesets to map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.general_tileset = this.map.addTilesetImage("tilemap_packed", "general_tiles");
        this.farm_tileset = this.map.addTilesetImage("tilemap-farm_packed", "farm_tiles");

        //create layers
        this.placementsLayer = this.map.createLayer("Objects-Placement", [this.general_tileset, this.farm_tileset], 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", [this.general_tileset, this.farm_tileset], 0, 0);
        this.decorationLayer = this.map.createLayer("Decoration", [this.general_tileset, this.farm_tileset], 0, 0);

        //make ground layer collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });


        //set up background


        /////////create objects and group them


        //set spawn point


        /////////set up player
        //change to player class in a sec
        my.sprite.player = new Player(this, 114, 100, "platformer_characters", "tile_0006.png");

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);


        //enable arcade physics


        //all collision handling


        //create camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
         //add an offset here if i want to make camera move a bit ahead of player
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY]) //add an offset here if i want to make camera move a bit ahead of player
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);


        //set up display text



        //debug listener
        this.input.keyboard.on('keydown-O', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

    }

    update() 
    {
        //call update on player to handle player behavior
        my.sprite.player.update();

        //handle respawning

        //end condition

    }

}