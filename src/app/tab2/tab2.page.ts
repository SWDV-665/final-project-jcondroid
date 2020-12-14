import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight - (window.innerHeight / 4);
var score = 0;

// This class uses Phaser and controlls the scene object
class GameScene extends Phaser.Scene {
  obstacleGroup: Phaser.Physics.Arcade.Group;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  player: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  coins: Phaser.Physics.Arcade.Group;
  scoreText: Phaser.GameObjects.Text;
  gameOverText: Phaser.GameObjects.Text;
  spikes: Phaser.Physics.Arcade.Group;

  constructor(config) {
    super(config);
  }

  // Load all of the assets for the game
  preload() {
    this.load.image('sky', '../../assets/images/sky.png');
    this.load.image('background', '../../assets/images/background.png');
    this.load.image('ground', '../../assets/images/ground.png');
    this.load.image('spike', '../../assets/images/Spike.png');
    this.load.image('coin', '../../assets/images/Coin.png');
    this.load.spritesheet('dude', '../../assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });
    // console.log('innerWidth: ', WIDTH)
    // console.log('innerHeight: ', HEIGHT)
  }

  // Create and display all objects on the screen
  create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0)
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    this.platforms = this.physics.add.staticGroup();
    for (let i = 0; i < WIDTH / 128; i++) {
      this.platforms.create(i * 128, HEIGHT, 'ground')
    }

    this.player = this.physics.add.sprite(100, HEIGHT - 200, 'dude');
    this.physics.add.collider(this.player, this.platforms)
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Create the player movements from the player image
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.spikes = this.physics.add.group({
      key: 'spike',
      repeat: 0,
      setXY: { x: 12, y: 0, stepX: 70 }
    });
    this.coins = this.physics.add.group({
      key: 'coin',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });


    this.coins.children.iterate(c => {
      const child = c as Phaser.Physics.Arcade.Image
      child.setScale(0.25).refreshBody();
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    })
    this.spikes.children.iterate(c => {
      const child = c as Phaser.Physics.Arcade.Image
      child.setScale(0.25).refreshBody();
      child.setBounce(1);
      child.setVelocity(Phaser.Math.Between(-200, 200), 20);
      child.setCollideWorldBounds(true);
    })

    this.physics.add.collider(this.coins, this.platforms)
    this.physics.add.collider(this.spikes, this.platforms);
    this.physics.add.overlap(this.player, this.coins, collectCoin, null, this);
    this.physics.add.collider(this.player, this.spikes, hitSpike, null, this);

    // Whenever the player collects a coin update their score
    function collectCoin(player, coin) {
      coin.disableBody(true, true);
      score += 10;
      this.scoreText.setText('Score: ' + score);


      if (this.coins.countActive(true) === 0) {
        this.coins.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
        });

        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var spike = this.spikes.create(x, 16, 'spike').setScale(0.25).refreshBody();
        spike.setBounce(1);
        spike.setCollideWorldBounds(true);
        spike.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }

    // If the player hits a spike then the game ends
    function hitSpike() {
      // Pause the game
      this.physics.pause();

      // Update player sprite to red to indicate they died and then display text indicating Game Over
      this.player.setTint(0xff0000);
      this.player.anims.play('turn');
      this.scoreText.setText('Score: ' + score);
      this.gameOverText = this.add.text(WIDTH / 4, HEIGHT / 2, 'GAME OVER\nRefresh to play again\nTotal Score: ' + score, { fontWeight: 600, fontSize: '32px', fill: '#FF0000 ' });

      // Add the user's score to local storage
      localStorage.setItem('score', score.toString());
    }
  }

  // Updates the player's position
  update() {
    this.cursors = this.input.keyboard.createCursorKeys();
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn', true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-220);
    }
  }
}

// This is the normal Iconic component. In the constructor I added the config for the phaser game
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      width: WIDTH,
      height: HEIGHT,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      },
      parent: 'game',
      scene: GameScene
    }
  }
  // Here we pass the config into our Phaser game object
  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }
}

(window as any)['global'] = window;