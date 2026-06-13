const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1200 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let platforms;
let coins;
let gems;
let spikes;
let score = 0;
let scoreText;
let checkpoint = { x: 100, y: 500 };

function preload() {
  this.load.image("sky", "assets/background.png");

  this.load.spritesheet("player", "assets/player.png", {
    frameWidth: 96,
    frameHeight: 96
  });

  this.load.image("ground", "assets/ground.png");
  this.load.image("coin", "assets/coin.png");
  this.load.image("gem", "assets/gem.png");
  this.load.image("spike", "assets/spike.png");
  this.load.image("box", "assets/box.png");
  this.load.image("spring", "assets/spring.png");
}

function create() {
  this.add.image(640, 360, "sky").setScrollFactor(0.4);

  platforms = this.physics.add.staticGroup();

  // Временная тестовая земля
  platforms.create(400, 680, "ground").setScale(4, 1).refreshBody();
  platforms.create(900, 520, "ground").setScale(2, 1).refreshBody();
  platforms.create(1300, 400, "ground").setScale(2, 1).refreshBody();

  player = this.physics.add.sprite(100, 500, "player");
  player.setCollideWorldBounds(false);
  player.setSize(38, 70);
  player.setOffset(28, 18);

  this.physics.add.collider(player, platforms);

  cursors = this.input.keyboard.createCursorKeys();

  createPlayerAnimations(this);

  coins = this.physics.add.staticGroup();
  coins.create(400, 600, "coin");
  coins.create(450, 600, "coin");
  coins.create(500, 600, "coin");

  gems = this.physics.add.staticGroup();
  gems.create(900, 450, "gem");

  spikes = this.physics.add.staticGroup();
  spikes.create(700, 640, "spike");

  this.physics.add.overlap(player, coins, collectCoin, null, this);
  this.physics.add.overlap(player, gems, collectGem, null, this);
  this.physics.add.overlap(player, spikes, hitSpike, null, this);

  scoreText = this.add.text(20, 20, "Score: 0", {
    fontSize: "28px",
    fill: "#ffffff"
  }).setScrollFactor(0);

  this.cameras.main.startFollow(player);
  this.cameras.main.setBounds(0, 0, 3000, 720);
  this.physics.world.setBounds(0, 0, 3000, 720);
}

function update() {
  const speed = 280;
  const jumpPower = -620;

  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
    player.flipX = true;

    if (player.body.blocked.down) {
      player.anims.play("run", true);
    }
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
    player.flipX = false;

    if (player.body.blocked.down) {
      player.anims.play("run", true);
    }
  } else {
    player.setVelocityX(0);

    if (player.body.blocked.down) {
      player.anims.play("idle", true);
    }
  }

  if (cursors.up.isDown && player.body.blocked.down) {
    player.setVelocityY(jumpPower);
    player.anims.play("jump", true);
  }

  if (!player.body.blocked.down && player.body.velocity.y > 0) {
    player.anims.play("fall", true);
  }

  if (player.y > 900) {
    respawnPlayer();
  }
}
