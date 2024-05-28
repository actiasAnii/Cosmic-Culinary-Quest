class EndWin extends Phaser.Scene {
    constructor() 
    {
        super("endWin");
    }

    create()
    {
        //switch these assets aroundd

        //simple background
        this.skyBackground = this.add.tileSprite(0, -100, game.config.width, game.config.height, 'background');
        this.skyBackground.setOrigin(0, 0).setDepth(-100).setScale(4).setScrollFactor(0.1, 1);

        //create restart key
        this.restart = this.input.keyboard.addKey("R");

        //update high score if necessary
        if (myScore > highScore){
            highScore = myScore;
        }

        //display text
        my.text.won = this.add.bitmapText(game.config.width/2, game.config.height/2 - 250, "thick", "YOU WON!").setOrigin(0.5).setScale(4);
        my.text.reportScoreW = this.add.bitmapText(game.config.width/2, game.config.height/2 - 50, "thick", "YOUR SCORE: " + ("00000" + myScore).slice(-5)).setOrigin(0.5).setScale(2.5);
        my.text.reportHighScoreW = this.add.bitmapText(game.config.width/2, game.config.height/2 + 50, "thick", "HIGH SCORE: " + ("00000" + highScore).slice(-5)).setOrigin(0.5).setScale(2.5);
        my.text.playAgainW = this.add.bitmapText(game.config.width/2, game.config.height/2 + 200, "thick", "press N to play again!").setOrigin(0.5).setScale(2.5);

    }

    update()
    {
        //if restart key is pressed, go back to gameplay scene
        if (Phaser.Input.Keyboard.JustDown(this.restart)) {
            this.scene.start("somethingFresh");
        }

    }
}