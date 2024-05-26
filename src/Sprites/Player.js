class Player extends Phaser.Physics.Arcade.Sprite 
{
constructor(scene, x, y, texture, frame)
    {
        super(scene, x, y, texture, frame);

        //add sprite to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(0.90);

        this.setPipeline('Pixel');


        //set initial vars
        this.ACCELERATION = 200;
        this.DRAG = 700;
        this.JUMP_VELOCITY = -620;
        this.PARTICLE_VELOCITY;

        this.body.setVelocityX(0);
        this.body.setVelocityY(0);

        this.setCollideWorldBounds(true);


        //create keys for input
        this.aKey = scene.input.keyboard.addKey('A');
        this.dKey = scene.input.keyboard.addKey('D');
        this.wKey = scene.input.keyboard.addKey('W');

        //create walking vfx

        //create jumping vfx


    }

    //additional helper functions

    update()
    {
        //handle player walking
        if (this.aKey.isDown)
            {
                this.setAccelerationX(-this.ACCELERATION);
                this.resetFlip();
                my.sprite.player.anims.play('walk', true);
                // TODO: add particle following code here
                //my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-5, my.sprite.player.displayHeight/2-10, false);
                //my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                //only play walking vfx if on the ground
                //if (my.sprite.player.body.blocked.down) {

                    //my.vfx.walking.start();
    
                //}
            }
        
         else if (this.dKey.isDown)
            {
                this.setAccelerationX(this.ACCELERATION);
                this.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);
                // TODO: add particle following code here
                //my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-30, my.sprite.player.displayHeight/2-10, false);
                //my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                // Only play smoke effect if touching the ground
                //if (my.sprite.player.body.blocked.down) 
                //{
                //my.vfx.walking.start();
                //}
            }
        else 
            {
                // Set acceleration to 0 and have DRAG take over
                this.setAccelerationX(0);
                this.setDragX(this.DRAG);
                my.sprite.player.anims.play('idle');
                //my.vfx.walking.stop();
            }

        //handle player jumping

        if(!my.sprite.player.body.blocked.down)
            {
            my.sprite.player.anims.play('jump');
            }
        if(this.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.wKey)) 
            {
                this.body.setVelocityY(this.JUMP_VELOCITY);
            }

        //handle health

    }
}