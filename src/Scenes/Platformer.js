//global variables holding current score and high score, displayed on end/win screens
highScore = 0;
myScore = 0;

//main gameplay scene
class Platformer extends Phaser.Scene {
    constructor() {
        super("somethingFresh");
    }

    init() 
    {
        //basic settings
        this.physics.world.gravity.y = 1500;
        this.physics.world.bounds.width = 3240;
        this.physics.world.bounds.height = 540;
        this.SCALE = 2;

        //for health bar
        my.sprite.fullHearts = [];
        my.sprite.emptyHearts = [];
    }

    preload()
    {
        //load the plugin for animation
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() 
    {
        //set html description
        document.getElementById('description').innerHTML = '<h2>Intergalactics & Gastronomy: Cosmic Culinary Quest</h2><br>A: left // D: right // W: jump //SHIFT: crouch'

        /////////set up map
        this.map = this.add.tilemap("level", 18, 18, 180, 30);

        //add tilesets to map
        //first parameter: name we gave the tileset in Tiled
        //second parameter: key for the tilesheet
        this.general_tileset = this.map.addTilesetImage("tilemap_packed", "general_tiles");
        this.farm_tileset = this.map.addTilesetImage("tilemap-farm_packed", "farm_tiles");

        //create layers
        this.placementsLayer = this.map.createLayer("Objects-Placement", [this.general_tileset, this.farm_tileset], 0, 0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", [this.general_tileset, this.farm_tileset], 0, 0);
        this.decorationLayer = this.map.createLayer("Decoration", [this.general_tileset, this.farm_tileset], 0, 0);
        this.water = this.map.createLayer("Water", [this.general_tileset, this.farm_tileset], 0, 0);

        //make ground layer collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        //make water collidable
        this.water.setCollisionByProperty({
            water: true
        });

        //set up background
        this.skyBackground = this.add.tileSprite(0, -50, this.map.widthInPixels, this.map.heightInPixels, 'background');
        this.skyBackground.setOrigin(0, 0).setDepth(-100).setScale(4).setScrollFactor(0.1, 1);

        //create health bar
        for (let i = 0; i < 3; i++) {
            //new sprite for both empty and full arrays
            let fullHeart = this.add.sprite(0, 222, 'heartFull').setOrigin(0).setScale(1.2);
            let emptyHeart = this.add.sprite(0, 222, 'heartEmpty').setOrigin(0).setScale(1.2);

            fullHeart.visible = true; //start with full hearts visible
            emptyHeart.visible = false;

            //push sprites to corresponding arrays
            my.sprite.fullHearts.push(fullHeart);
            my.sprite.emptyHearts.push(emptyHeart);

            //position the hearts horizontally
            const offsetX = i * (fullHeart.displayWidth + 1) + 280; //setting x val here
            fullHeart.x = offsetX;
            emptyHeart.x = offsetX;

             // Set scroll factor to zero
            fullHeart.setScrollFactor(0);
            emptyHeart.setScrollFactor(0);
        }


        /////////create objects and group them
        my.collectibles = this.add.group(); //initialize phaser group of all the collectibles

        //flowers
        this.flowers = this.map.createFromObjects("Objects", { //create
            name: "flower",
            key: "farm_sheet",
            frame: 20
        });

        this.physics.world.enable(this.flowers, Phaser.Physics.Arcade.STATIC_BODY); //enable physics
        
        //flower animation
        this.flowers.forEach(flower => {
            this.tweens.add({
                targets: flower,
                scaleY: 1.1, //stretch vertically just a tiny bit to look like blooming
                angle: 1.5, //change angle, like blowing a bit in the wind
                duration: 1000, 
                ease: 'Sine.EaseInOut',
                yoyo: true,
                repeat: -1,
                onComplete: ()=> {
                    flower.setScale(1, 1); //reset scale to original size after animation
                }
            });

        });

        my.flowerGroup = this.add.group(this.flowers); //add to a group

        //wheat
        this.wheats = this.map.createFromObjects("Objects", { //create
            name: "wheat",
            key: "farm_sheet",
            frame: 58
        });
        this.physics.world.enable(this.wheats, Phaser.Physics.Arcade.STATIC_BODY); //enable physics
        
        //wheat animation
        this.wheats.forEach(wheat => {
            this.tweens.add({
                targets: wheat,
                scaleY: 1.2, //stretch for blowing in wind effect
                angle: 3, //angle for blowing in wind effect
                duration: 600, 
                ease: 'Sine.EaseInOut',
                yoyo: true,
                repeat: -1,
                onComplete: ()=> {
                    wheat.setScale(1, 1); //reset scale to original size after animation
                }
            });

        });
        my.wheatGroup = this.add.group(this.wheats); //add to a group

        //radishes
        this.radishes = this.map.createFromObjects("Objects", { //create
            name: "radish",
            key: "farm_sheet",
            frame: 42
        });
        this.physics.world.enable(this.radishes, Phaser.Physics.Arcade.STATIC_BODY); //enable physics

        //radish animation
        this.radishes.forEach(radish => {
            radish.anims.play('radishPeep');
        });
        my.radishGroup = this.add.group(this.radishes); //add to a group

        //carrots
        this.carrots = this.map.createFromObjects("Objects", { //create
            name: "carrot",
            key: "farm_sheet",
            frame: 56
        });
        this.physics.world.enable(this.carrots, Phaser.Physics.Arcade.STATIC_BODY); //enable physics

        //carrot animation
        this.carrots.forEach(carrot => {
            carrot.anims.play('carrotPeep');
        });
        my.carrotGroup = this.add.group(this.carrots); //add to a group

        //tomatoes
        this.tomatoes = this.map.createFromObjects("Objects", { //create
            name: "tomato",
            key: "farm_sheet",
            frame: 57
        });
        this.physics.world.enable(this.tomatoes, Phaser.Physics.Arcade.STATIC_BODY); //enable physics

        //tomato animation
        this.tomatoes.forEach(tomato => {
            this.tweens.add({
                targets: tomato,
                scaleX: 1.2,
                scaleY: 0.9, //squash a bit to look bouncy
                duration: 650, 
                ease: 'Sine.EaseInOut',
                yoyo: true,
                repeat: -1,
                onComplete: ()=> {
                    tomato.setScale(1, 1); //reset scale to original size after animation
                }
            });

        });
        my.tomatoGroup = this.add.group(this.tomatoes); //add to a group

        //corn
        this.corn = this.map.createFromObjects("Objects", { //create
            name: "corn",
            key: "farm_sheet",
            frame: 59
        });
        this.physics.world.enable(this.corn, Phaser.Physics.Arcade.STATIC_BODY); //enable physics

        //corn animation
        this.corn.forEach(corn => {
            this.tweens.add({
                targets: corn,
                scaleX: 1.25, //expand to look like growing
                scaleY: 1.2,
                duration: 1200, 
                ease: 'Sine.EaseInOut',
                yoyo: true,
                repeat: -1,
                onComplete: ()=> {
                    corn.setScale(1, 1); //reset scale to original size after animation
                }
            });

        });
        my.cornGroup = this.add.group(this.corn); //add to a group

        //add all score objects to collectible group
        my.collectibles.addMultiple([my.wheatGroup, my.flowerGroup, my.tomatoGroup, my.cornGroup, my.carrotGroup, my.radishGroup]);
        //dictionary to hold point value of each collectible type
        my.pointVals = {
            "wheat": 5,
            "flower": 10,
            "tomato": 15,
            "corn": 20,
            "carrot": 25,
            "radish": 30
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
        //variables to hold current x and y spawns, update based on checkpoints reached
        this.currRespawnX = this.spawnPoint.x;
        this.currRespawnY = this.spawnPoint.y;

        //create group of all checkpoints
        this.respawns = this.map.createFromObjects("Respawns", {
            name: "respawn",
            key: "general_sheet",
            frame: 111
        });

        //play flag wave animation on checkpoints
        this.respawns.forEach(respawn => {
            respawn.anims.play('flagWave');
            });
        this.physics.world.enable(this.respawns, Phaser.Physics.Arcade.STATIC_BODY); //checkpoints are collidable

        ////create camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        /////////set up player
        my.sprite.player = new Player(this, this.currRespawnX, this.currRespawnY - 150, "platformer_characters", "tile_0006.png"); 


        //adjust camera settings
        this.cameras.main.startFollow(my.sprite.player, true, 0.1, 0.08); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);


        //set up display text
        my.scoreDisplay = this.add.bitmapText(390, 230, "thick", ("00000" + myScore)
        .slice(-5)).setOrigin(1).setScale(2.5).setLetterSpacing(1);
        my.scoreDisplay.setScrollFactor(0);


        ///////collision handling

        //handle collision with the ground
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        //handle collision with water
        this.physics.add.collider(my.sprite.player, this.water, this.DEATH());

         ///handle collision with respawn points
         this.physics.add.overlap(my.sprite.player, this.respawns, (player, respawnPoint) => {
            //set the current respawn point to the position of this checkpoint
            this.currRespawnX = respawnPoint.x;
            this.currRespawnY = respawnPoint.y;
            this.sound.play("soundCheckpoint", {volume: 0.08});
            this.physics.world.disable(respawnPoint, Phaser.Physics.Arcade.STATIC_BODY); //disable physics so sound doesnt play again
        });


        //handle collision with collectibles
        for (let collectibleGroup of my.collectibles.getChildren()) 
            {
                this.physics.add.overlap(my.sprite.player, collectibleGroup, (player, collectible) => {

                    myScore += my.pointVals[collectible.name]; //handle varying point vals
                    my.scoreDisplay.setText(("00000" + myScore).slice(-5));  //update score text
                    collectible.destroy(); //remove collectivle on overlap
                    this.sound.play("soundCollect", {volume: 0.05});
                });
            }

        //handle collision with pumpkin -> end of game scenario
        this.physics.add.overlap(my.sprite.player, this.pumpkin, (player, pumpkin) => {
            myScore += 500;
            this.sound.play("soundWin", {volume: 0.08});
            this.scene.start("endWin");
        });

        //debug listener
        this.input.keyboard.on('keydown-O', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
        this.physics.world.drawDebug = false;

        //start game
        this.init_game();
        //start tile animations
        this.animatedTiles.init(this.map);
    }

    DEATH()
    { 
        return (player) => {
            //move player to last respawn point
            player.body.x = this.currRespawnX;
            player.body.y = this.currRespawnY - 100;
            //make player stop moving
            player.body.setVelocity(0, 0);
            //reduce player health
            player.HEALTH--;
            this.sound.play("soundDrown", {volume: 0.08});

            if (player.HEALTH <= 0) //if player has no more health -> game lose scenario
                {
                    this.sound.play("soundLose", {volume: 0.08});
                    this.scene.start("endLose");      
                }
            
            //update health bar
            for (let i = 0; i < 3; i++) 
                {

                    my.sprite.fullHearts[i].visible = i < player.HEALTH; //if i is less than current player health, full heart is visible
                    my.sprite.emptyHearts[i].visible = i >= player.HEALTH; //if i is greater than current player health, empty heart is visible
                }

        };
    }

    update() 
    {
        //call update on player to handle player movement
        my.sprite.player.update();

        //collision and such all handled with overlaps and colliders

    }

    //for resetting the level
    init_game()
    {
        //reset score
        myScore = 0; 
        my.scoreDisplay.setText(("00000" + myScore).slice(-5));


    }

}