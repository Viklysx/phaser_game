let config = {
    type: Phaser.AUTO, // преимущественно будет использоваться webgl
    width: 1280,
    height: 720,
    rows: 2,
    cols: 5,
    cards: [1,2,3,4,5],// id для карточек
    timeout: 30,
    scene: new GameScene() // игровая сцена
}
let game = new Phaser.Game(config);