//implementation of a player class
//handles movement and player-associated animations
class Player extends Phaser.Physics.Arcade.Sprite 
{
constructor(scene, x, y, texture, frame)
    {
        super(scene, x, y, texture, frame);

        //add sprite to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(0.90); //make them a little smaller than normal

        this.scene = scene;

        this.setPipeline('Pixel');


        ///////set initial vars
        //(mostly) constants
        this.ACCELERATION = 200;
        this.MAX_SPEED_X = 500;
        this.MAX_SPEED_Y = 700;
        this.DRAG = 700;
        this.JUMP_VELOCITY = -570;
        this.HEALTH = 3;

        //start not moving
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);

        //cap on moving/falling speeds
        this.body.setMaxVelocity(this.MAX_SPEED_X, this.MAX_SPEED_Y);

        //dont go offscreen
        this.setCollideWorldBounds(true);


        //create keys for input
        this.aKey = scene.input.keyboard.addKey('A');
        this.dKey = scene.input.keyboard.addKey('D');
        this.wKey = scene.input.keyboard.addKey('W');
        this.crouchKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);


        /////vfxs and animation setup

        //create walking vfx
        this.walk = scene.add.particles(0, 0, "trace1", { 
            scale: {start: 0.04, end: 0.01, random: true},
            lifespan: 450,
            blendMode: 'ADD',
            alpha: {start: 0.1, end: 0.01},
            quantity: 20
        });
        this.walk.setDepth(-10);
        this.walk.startFollow(this);
        this.walk.stop();

        //create jumping vfx
        this.jump = scene.add.particles(0, 0, "kenny-particles", {
            frame: "trace_07.png",
            scale: {start: 0.05, end: 0.01, random: true},
            lifespan: 200,
            blendMode: 'ADD',
            alpha: {start: 0.1, end: 0.01},
            quantity: 40
        });
        this.jump.setDepth(-10);
        this.jump.startFollow(this);
        this.jump.stop();

        //tween manager for squashing and stretching anims
        this.tweenManager = scene.tweens;
        //check if previously was airborne
        this.wasAirborne = true; //used to make sure landing animation only places once when landing

        //walking sound managers 
        this.lastWalkSoundTime = 0; //holds last time this sound was played
        this.walkSoundDelay = 300; //delay between sound being played
        this.currentWalkSound = "soundWalk2"; //last sound played. used for alternating between two sounds

        //check if was crouching
        this.crouched = false;

    }

    ///////additional helper functions

    //stretch and squash jumping animation
    stretchAndSquash()
    {
        this.tweenManager.add({
            targets: this,
            scaleX: 0.5, //get narrower to exaggerate stretch
            scaleY: 1.6, //stretch vertically when jumping
            duration: 80, 
            ease: 'Sine.easeInOut',
            yoyo: true,
            onComplete: ()=> {
                this.setScale(0.9, 0.9); //reset scale to original size after animation
            }
        });

    }  

    //squash and stretch landing animation
    squashAndStretch() {
        this.tweenManager.add({
            targets: this,
            scaleX: 1.25, //squash horizontally when landing
            scaleY: 0.6, //get flatter to exaggerate squash
            duration: 80, 
            ease: 'Sine.easeInOut',
            yoyo: true,
            onComplete: () => {
                this.setScale(0.9, 0.9); //reset scale to original size after animation
            }
        });
    }

    //helper function to allow for delay and alternating walking sounds
    playWalkSound() {
        const currentTime = this.scene.time.now;
    
        //check if enough time has passed since the last walking sound
        if (currentTime - this.lastWalkSoundTime > this.walkSoundDelay && this.body.blocked.down) {
            //play the walking sound based on the sound last played
            if (this.currentWalkSound === "soundWalk2") {
                this.scene.sound.play("soundWalk1", { volume: 0.05 });
                this.currentWalkSound = "soundWalk1";
            } else {
                this.scene.sound.play("soundWalk2", { volume: 0.05 });
                this.currentWalkSound = "soundWalk2";
            }
    
            //update the last walk sound time to the current time
            this.lastWalkSoundTime = currentTime;
        }
    }

    update()
    {
        //handle crouching
        if (this.crouchKey.isDown) {
            this.setScale(1.05, 0.65); //squish em
            this.crouched = true; 
            this.JUMP_VELOCITY = -520; //reduce jump height a bit
        } else if (!this.crouchKey.isDown && this.crouched == true) //only if player was previously crouching
        {
            this.setScale(0.9, 0.9); //reset player to original size
            this.crouched = false;
            this.JUMP_VELOCITY = -570; //reset jump height to original height
        }

        //handle player walking
        if (this.aKey.isDown)
            {
                this.setAccelerationX(-this.ACCELERATION);
                this.resetFlip();
                my.sprite.player.anims.play('walk', true);
                this.walk.startFollow(this, 10, 0);
                this.walk.start();
                this.playWalkSound();
            }
        
         else if (this.dKey.isDown)
            {
                this.setAccelerationX(this.ACCELERATION);
                this.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);
                this.walk.startFollow(this, -10, 0);
                this.walk.start();
                this.playWalkSound();
            }
        else  
            {
                //set acceleration to 0 and have DRAG take over
                this.setAccelerationX(0);
                this.setDragX(this.DRAG);
                my.sprite.player.anims.play('idle');
                this.walk.stop();
            }

        //handle player jumping
        if(!this.body.blocked.down) //if in the air
            {
            my.sprite.player.anims.play('jump');
            this.walk.stop();
            this.jump.start();
            } 

        if(this.wasAirborne && this.body.blocked.down) //if just landed
            {
                this.jump.stop();
                this.squashAndStretch();
                this.scene.sound.play("soundLand", {volume: 0.1});
                this.wasAirborne = false;
            }

        if(this.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.wKey)) //initiate another jump
            {
                this.body.setVelocityY(this.JUMP_VELOCITY);
                this.stretchAndSquash();
                this.scene.sound.play("soundJump", {volume: 0.05});
                this.wasAirborne = true;
            }


    }
}