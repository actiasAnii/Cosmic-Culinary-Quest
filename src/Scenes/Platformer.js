highScore = 0;
myScore = 0;
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

        //filter water tiles
        this.water = this.map.createLayer("Water", [this.general_tileset, this.farm_tileset], 0, 0);

        //make ground layer collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.water.setCollisionByProperty({
            water: true
        });

        //set up background
        this.skyBackground = this.add.tileSprite(0, -85, this.map.widthInPixels, this.map.heightInPixels, 'background');
        this.skyBackground.setOrigin(0, 0).setDepth(-100).setScale(4).setScrollFactor(0.1, 1);


        /////////create objects and group them
        my.collectibles = this.add.group(); //initialize phaser group of all collectibles

        //flowers
        this.flowers = this.map.createFromObjects("Objects", { //create
            name: "flower",
            key: "farm_sheet",
            frame: 20
        });
        this.physics.world.enable(this.flowers, Phaser.Physics.Arcade.STATIC_BODY); //enable physics
        my.flowerGroup = this.add.group(this.flowers); //add to a group

        //wheat
        this.wheats = this.map.createFromObjects("Objects", { //create
            name: "wheat",
            key: "farm_sheet",
            frame: 58
        });
        this.physics.world.enable(this.wheats, Phaser.Physics.Arcade.STATIC_BODY); //enable physics
        my.wheatGroup = this.add.group(this.wheats); //add to a group

        //radishes
        this.radishes = this.map.createFromObjects("Objects", { //create
            name: "radish",
            key: "farm_sheet",
            frame: 42
        });
        this.physics.world.enable(this.radishes, Phaser.Physics.Arcade.STATIC_BODY); //enable physics
        my.radishGroup = this.add.group(this.radishes); //add to a group

        //carrots
        this.carrots = this.map.createFromObjects("Objects", { //create
            name: "carrot",
            key: "farm_sheet",
            frame: 56
        });
        this.physics.world.enable(this.carrots, Phaser.Physics.Arcade.STATIC_BODY); //enable physics
        my.carrotGroup = this.add.group(this.carrots); //add to a group

        //tomatoes
        this.tomatoes = this.map.createFromObjects("Objects", { //create
            name: "tomato",
            key: "farm_sheet",
            frame: 57
        });
        this.physics.world.enable(this.tomatoes, Phaser.Physics.Arcade.STATIC_BODY); //enable physics
        my.tomatoGroup = this.add.group(this.tomatoes); //add to a group

        //corn
        this.corn = this.map.createFromObjects("Objects", { //create
            name: "corn",
            key: "farm_sheet",
            frame: 59
        });
        this.physics.world.enable(this.corn, Phaser.Physics.Arcade.STATIC_BODY); //enable physics
        my.cornGroup = this.add.group(this.corn); //add to a group

        //add all score objects to collectible group
        my.collectibles.addMultiple([my.wheatGroup, my.flowerGroup, my.tomatoGroup, my.cornGroup, my.radishGroup, my.carrotGroup]);
        my.pointVals = {
            "wheat": 10,
            "flower": 15,
            "tomato": 20,
            "corn": 25,
            "radish": 30,
            "carrot": 35
          };

        //create pumpkin
        this.pumpkin = this.map.createFromObjects("Objects", { //create
            name: "pumpkin",
            key: "farm_sheet",
            frame: 4
        });
        this.physics.world.enable(this.pumpkin, Phaser.Physics.Arcade.STATIC_BODY);

        //set starting spawn point
        this.spawnPoint = this.map.findObject("Respawns", obj => obj.name === "spawn");
        this.currRespawnX = this.spawnPoint.x;
        this.currRespawnY = this.spawnPoint.y;
        //create group of all respawn points
        this.respawns = this.map.createFromObjects("Respawns", {
            name: "respawn",
            key: "general_sheet",
            frame: 111
        });
        this.physics.world.enable(this.respawns, Phaser.Physics.Arcade.STATIC_BODY); //enable physics

        //create camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        /////////set up player
        //change to player class in a sec
        my.sprite.player = new Player(this, this.currRespawnX, this.currRespawnY - 150, "platformer_characters", "tile_0006.png");


        //adjust camera settings
        this.cameras.main.startFollow(my.sprite.player, true, 0.1, 0.08); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        //ground collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        //water collision handling
        this.physics.add.collider(my.sprite.player, this.water, this.DEATH());


        //set up display text
        my.scoreDisplay = this.add.bitmapText(390, 230, "thick", ("00000" + myScore)
        .slice(-5)).setOrigin(1).setScale(2.5).setLetterSpacing(1);
        my.scoreDisplay.setScrollFactor(0);

         //handle collision for respawn points
         this.physics.add.overlap(my.sprite.player, this.respawns, (player, respawnPoint) => {
            // Play a sound effect

            //debug
            console.log("Checkpoint reached!");
            console.log("Respawn point coordinates:", respawnPoint.x, respawnPoint.y);
            this.currRespawnX = respawnPoint.x;
            this.currRespawnY = respawnPoint.y;
        });


        //handle collision for collectibles
        for (let collectibleGroup of my.collectibles.getChildren()) 
            {
                this.physics.add.overlap(my.sprite.player, collectibleGroup, (player, collectible) => {

                    myScore += my.pointVals[collectible.name]; //handle varying point vals
                    my.scoreDisplay.setText(("00000" + myScore).slice(-5));  //update score text
                    collectible.destroy(); //remove collectivle on overlap
                });
            }

        //handle end of game scenario
        this.physics.add.overlap(my.sprite.player, this.pumpkin, (player, pumpkin) => {
            console.log("end scene started!")
            this.scene.start("endWin");
        });


        //debug listener
        this.input.keyboard.on('keydown-O', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        //start game
        this.init_game();
    }

    DEATH()
    { 
        return (player) => {
            player.body.x = this.currRespawnX;
            player.body.y = this.currRespawnY - 150;
            player.body.setVelocity(0, 0);
        };
    }

    update() 
    {
        //call update on player to handle player behavior
        my.sprite.player.update();

        //debug

        //handle respawning

        //end condition



    }

    //for resetting the level
    init_game()
    {
        myScore = 0;
        my.scoreDisplay.setText(("00000" + myScore).slice(-5));


    }

}