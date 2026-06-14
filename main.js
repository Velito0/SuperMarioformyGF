const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: "#5ec8ff",

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
let blocks;
let coins;
let spikes;

let score = 0;
let scoreText;

let spawnX = 100;
let spawnY = 300;

function preload() {
  // Картинки лежат рядом с main.js, поэтому БЕЗ assets/
  this.load.image("background", "background.png");
  this.load.image("coin", "coin.png");
  this.load.image("grassBlock", "grassBlock.png");
}

function create() {
  cursors = this.input.keyboard.createCursorKeys();

  // Фон
  const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
  bg.setDisplaySize(2000, 540);

  blocks = this.physics.add.staticGroup();
  coins = this.physics.add.staticGroup();
  spikes = this.physics.add.staticGroup();

  // ===== ЗЕМЛЯ =====
  for (let x = 0; x <= 900; x += 30) {
    createBlock(this, x, 510);
  }

  // ===== ПЛАТФОРМЫ =====
  createBlock(this, 300, 420);
  createBlock(this, 330, 420);
  createBlock(this, 360, 420);

  createBlock(this, 520, 350);
  createBlock(this, 550, 350);
  createBlock(this, 580, 350);

  createBlock(this, 760, 430);
  createBlock(this, 790, 430);
  createBlock(this, 820, 430);

  createBlock(this, 1030, 390);
  createBlock(this, 1060, 390);
  createBlock(this, 1090, 390);

  createBlock(this, 1280, 320);
  createBlock(this, 1310, 320);
  createBlock(this, 1340, 320);

  // ===== ИГРОК =====
  player = this.physics.add.rectangle(spawnX, spawnY, 26, 38, 0xffffff);
  player.setStrokeStyle(3, 0x000000);
  player.body.setSize(26, 38);
  player.body.setCollideWorldBounds(true);

  this.physics.add.collider(player, blocks);

  // ===== МОНЕТЫ =====
  createCoin(this, 300, 370);
  createCoin(this, 330, 370);
  createCoin(this, 360, 370);

  createCoin(this, 520, 300);
  createCoin(this, 550, 300);
  createCoin(this, 580, 300);

  createCoin(this, 1280, 270);
  createCoin(this, 1310, 270);
  createCoin(this, 1340, 270);

  this.physics.add.overlap(player, coins, collectCoin, null, this);

  // ===== ШИПЫ =====
  createSpike(this, 680, 480);
  createSpike(this, 710, 480);

  this.physics.add.overlap(player, spikes, hitSpike, null, this);

  // ===== ТЕКСТ =====
  scoreText = this.add.text(20, 20, "Монеты: 0", {
    fontSize: "24px",
    color: "#ffffff",
    fontFamily: "Arial"
  });

  scoreText.setScrollFactor(0);

  // ===== КАМЕРА И МИР =====
  this.physics.world.setBounds(0, 0, 2000, 540);
  this.cameras.main.setBounds(0, 0, 2000, 540);
  this.cameras.main.startFollow(player);
}

function update() {
  const speed = 240;
  const jumpPower = -560;

  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  } else {
    player.body.setVelocityX(0);
  }

  if (cursors.up.isDown && player.body.blocked.down) {
    player.body.setVelocityY(jumpPower);
  }

  // Если игрок упал вниз
  if (player.y > 600) {
    respawnPlayer();
  }
}

function createBlock(scene, x, y) {
  const block = scene.physics.add.staticImage(x, y, "grassBlock");

  block.setDisplaySize(30, 30);
  block.refreshBody();

  blocks.add(block);

  return block;
}

function createCoin(scene, x, y) {
  const coin = scene.physics.add.staticImage(x, y, "coin");

  coin.setDisplaySize(24, 24);
  coin.refreshBody();

  coins.add(coin);

  return coin;
}

function createSpike(scene, x, y) {
  const spike = scene.add.triangle(
    x,
    y,
    0,
    30,
    15,
    0,
    30,
    30,
    0xc0c0c0
  );

  spike.setStrokeStyle(2, 0x000000);

  scene.physics.add.existing(spike, true);
  spikes.add(spike);

  return spike;
}

function collectCoin(player, coin) {
  coin.destroy();

  score += 1;
  scoreText.setText("Монеты: " + score);
}

function hitSpike() {
  respawnPlayer();
}

function respawnPlayer() {
  player.body.setVelocity(0, 0);
  player.setPosition(spawnX, spawnY);
}
