class Player extends Phaser.Physics.Arcade.Sprite 
{
constructor(scene, x, y, texture, frame)
    {
        super(scene, x, y, texture, frame);

        //add sprite to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(0.90);

        this.scene = scene;

        this.setPipeline('Pixel');


        ///////set initial vars
        //for movement
        this.ACCELERATION = 200;
        this.MAX_SPEED_X = 500;
        this.MAX_SPEED_Y = 700;
        this.DRAG = 700;
        this.JUMP_VELOCITY = -600;
        //for particles
        this.HEALTH = 3;

        this.body.setVelocityX(0);
        this.body.setVelocityY(0);

        this.body.setMaxVelocity(this.MAX_SPEED_X, this.MAX_SPEED_Y);

        this.setCollideWorldBounds(true);


        //create keys for input
        this.aKey = scene.input.keyboard.addKey('A');
        this.dKey = scene.input.keyboard.addKey('D');
        this.wKey = scene.input.keyboard.addKey('W');


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

        //tween manager for squash and stretch anims
        this.tweenManager = scene.tweens;
        //was airborne?
        this.wasAirborne = true;

        //sound delay for walking
        this.lastWalkSoundTime = 0;
        this.walkSoundDelay = 300;
        this.currentWalkSound = "soundWalk2";

    }

    //additional helper functions
    stretchAndSquash()
    {
        this.tweenManager.add({
            targets: this,
            scaleX: 0.5, //get narrower
            scaleY: 1.5, //stretch vertically when jumping
            duration: 50, 
            ease: 'Sine.EaseInOut',
            yoyo: true,
            onComplete: ()=> {
                this.setScale(0.9, 0.9); //reset scale to original size after animation
            }
        });

    }  

    squashAndStretch() {
        this.tweenManager.add({
            targets: this,
            scaleX: 1.4, //stretch horizontally when landing
            scaleY: 0.5, //get flatter
            duration: 50, 
            ease: 'Sine.EaseInOut',
            yoyo: true,
            onComplete: () => {
                this.setScale(0.9, 0.9); //reset scale to original size after animation
            }
        });
    }

    DEATH(spawnX, spawnY)
    {
        console.log("water collided!")
        this.setPosition(spawnX, spawnY);
        this.body.setVelocity(0);

    }

    /*playWalkSound()
    {
        const currentTime = this.scene.time.now;
        if (currentTime - this.lastWalkSoundTime > this.walkSoundDelay && this.body.blocked.down) 
            {
                this.scene.sound.play("soundWalk1", {volume: 0.05});
                this.lastWalkSoundTime = currentTime;
            }
    }*/

    playWalkSound() {
        const currentTime = this.scene.time.now;
    
        // Check if enough time has passed since the last walking sound
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
                // Set acceleration to 0 and have DRAG take over
                this.setAccelerationX(0);
                this.setDragX(this.DRAG);
                my.sprite.player.anims.play('idle');
                this.walk.stop();
            }

        //handle player jumping
        if(!this.body.blocked.down)
            {
            my.sprite.player.anims.play('jump');
            this.walk.stop();
            this.jump.start();
            } 

        if(this.wasAirborne && this.body.blocked.down)
            {
                this.jump.stop();
                this.squashAndStretch();
                this.scene.sound.play("soundLand", {volume: 0.1});
                this.wasAirborne = false;
            }

        if(this.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.wKey)) 
            {
                this.body.setVelocityY(this.JUMP_VELOCITY);
                this.stretchAndSquash();
                this.scene.sound.play("soundJump", {volume: 0.1});
                this.wasAirborne = true;
            }


    }
}