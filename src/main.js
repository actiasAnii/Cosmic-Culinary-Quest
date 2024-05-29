// Anais Montes
// Created: 05/2024
// Phaser: 3.70.0
//
//
//
//Intergalactics and Gastronomy: Cosmic Culinary Quest
//
//
//Credits: 

//art:
//- Kenny Pixel Platformer (https://kenney.nl/assets/pixel-platformer)
//- Kenny Pixel Platformer Farm Expansion (https://kenney.nl/assets/pixel-platformer-farm-expansion)
//- + use of Phaser Animated Tiles plugin (https://github.com/nkholski/phaser-animated-tiles)
//
//audio:
//- Kenny Sci Fi Sounds (https://kenney.nl/assets/sci-fi-sounds)
//- Kenny Music Jingles (https://kenney.nl/assets/music-jingles)
//- Kenny Impact Sounds (https://kenney.nl/assets/impact-sounds)
//
//font:
//FrostyFreeze Public Domain Bitmap Thick 8x8 (https://frostyfreeze.itch.io/pixel-bitmap-fonts-png-xml)

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true,  // prevent pixel art from getting blurred when scaled
        antialias: false, //prevent that weird jitter when player moves fast
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            },
            fixedStep: false
        }
    },
    width: 1080,
    height: 750,
    scene: [Load, Platformer, EndWin, EndLose]
}

const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);