import { Component, SystemJsNgModuleLoader } from '@angular/core';
// import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

declare var Phaser: any;
// declare var game;



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page extends Phaser.Scene {
  public game: any;
  public gameOptions: any;
  public gameConfig: any;
  public config: any;
  public score: number;

  constructor(public navCtrl: NavController) {
    super('Tab1Page');
    // this.buildPhaserRenderer();
    
    // this.game = new Phaser.Game(this.config);
    window.onload = function () {
      this.gameOptions = {
        bounceHeight: 300,
        ballGravity: 1200,
        ballPower: 1200,
        obstacleSpeed: 250,
        obstacleDistanceRange: [100, 250],
        localStorageName: 'bestballscore'
      }

      this.gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: '#87CEEB',
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          // parent: 'thegame',
          width: 750,
          height: 500
        },
        physics: {
          default: 'arcade'
        },
        scene: {
          preload: this.preload(),
          create: this.create(),
          update: this.update
        }
        // scene: Tab1Page
      }

      console.log("this1 = ", this);
      this.game = new Phaser.Game(this.gameConfig);
    }
  }
  /*
  buildPhaserRenderer() {
    this.config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload: this.preload,
        create: this.create,
        update: this.update
      }
    }
  }



  preload() {
    // this.load.image('sky', 'assets/sky.png');
    this.load.image('sky', '../assets/images/sky.png');
    this.load.image('ground', '../../assets/images/ground.png');
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0)
  }

  update() {
  }
  */


 preload() {
  // this.load.image('sky', '../../assets/images/sky.png');
  this.load.image('ground', '../../assets/images/groundOG.png');
  this.load.image('ball', '../../assets/images/ball.png');
  this.load.image('obstacle', '../../assets/images/obstacle.png');
}

create() {
  this.obstacleGroup = this.physics.add.group();
  this.firstBounce = 0;
  this.ground = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height / 4 * 3, 'ground');
  this.ground.setImmovable(true);
  console.log(`this2 = ${this}`);
  this.ball = this.physics.add.sprite(this.game.config.width / 10 * 2, this.game.config.height / 4 * 3 - this.gameOptions.bounceHeight, 'ball');
  this.ball.body.gravity.y = this.gameOptions.ballGravity;
  this.ball.setBounce(1);
  this.ball.setCircle(25);
  let obstacleX = this.game.config.width;
  for (let i = 0; i < 10; i++) {
    let obstacle = this.obstacleGroup.create(obstacleX, this.ground.getBounds().top, 'obstacle');
    obstacle.setOrigin(0.5, 1);
    obstacle.setImmovable(true);
    obstacleX += Phaser.Math.Between(this.gameOptions.obstacleDistanceRange[0], this.gameOptions.obstacleDistanceRange[1])
  }
  this.obstacleGroup.setVelocityX(-this.gameOptions.obstacleSpeed);
  this.input.on('pointerdown', this.boost, this);
  this.score = 0;
  // this.topScore = localStorage.getItem(this.gameOptions.localStorageName) == null ? 0 : localStorage.getItem(this.gameOptions.localStorageName);
  this.scoreText = this.add.text(10, 10, '');
  // this.updateScore(this.score);
}



  update() {
    this.physics.world.collide(this.ground, this.ball, function () {
      if (this.firstBounce == 0) {
        this.firstBounce = this.ball.body.velocity.y;
      }
      else {
        this.ball.body.velocity.y = this.firstBounce;
      }
    }, null, this);
    this.physics.world.collide(this.ball, this.obstacleGroup, function () {
      // localStorage.setItem(this.gameOptions.localStorageName, Math.max(this.score, this.topScore));
      this.scene.start('PlayGame');
    }, null, this);
    this.obstacleGroup.getChildren().forEach(function (obstacle) {
      if (obstacle.getBounds().right < 0) {
        this.updateScore(1);
        // obstacle.x = this.getRightmostObstacle() + Phaser.Math.Between(this.gameOptions.obstacleDistanceRange[0], this.gameOptions.obstacleDistanceRange[1]);
      }
    }, this)
  }

  // buildPhaserRenderer() {


  // var poly, graphics, game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: this.preload, create: this.create });

  // function preload() {
  //   this.load.image('sky', '../../assets/images/sky.png');
  // }

  // function create() {
  //   this.add.image(400, 300, 'sky');
  //   poly = new Phaser.Polygon();
  //   poly.setTo([new Phaser.Point(200, 100), new Phaser.Point(350, 100), new Phaser.Point(375, 200), new Phaser.Point(150, 200)]);
  //   graphics = game.add.graphics(0, 0);
  //   graphics.beginFill(0xFF33ff);
  //   graphics.drawPolygon(poly.points);
  //   graphics.endFill();

  //   console.log("test")
  // }

  // window.onload = function () {

  // this.game = new Phaser.Game(this.gameConfig);
  // this.game = new Phaser.Game(this.config);
  // window.focus();
  // }
  // console.log("this2 = ", this);
  // }

}
