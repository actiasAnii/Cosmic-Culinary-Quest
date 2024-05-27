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
        this.PARTICLE_VELOCITY;

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
            scale: {start: 0.05, end: 0.01, random: true},
            lifespan: 450,
            blendMode: 'ADD',
            alpha: {start: 0.1, end: 0.01},
            quantity: 15
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

        //tween manager for squash and stretch
        this.tweenManager = scene.tweens;
        //was airborne?
        this.wasAirborne = false;

    }

    //additional helper functions
    squashAndStretch()
    {
        this.tweenManager.add({
            targets: this,
            scaleX: 0.5,
            scaleY: 1.2,
            duration: 50, 
            ease: 'Sine',
            yoyo: true,
            onComplete: ()=> {
                this.setScale(0.9, 0.9);
            }
        });

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
            }
        
         else if (this.dKey.isDown)
            {
                this.setAccelerationX(this.ACCELERATION);
                this.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);
                this.walk.startFollow(this, -10, 0);
                this.walk.start();
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
        if(this.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.wKey)) 
            {
                this.body.setVelocityY(this.JUMP_VELOCITY);
                this.wasAirborne = true;
            }
        if(this.wasAirborne && this.body.blocked.down)
            {
                this.jump.stop();
                this.squashAndStretch();
                this.wasAirborne = false;
            }

        //handle health


    }
}