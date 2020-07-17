class GameScene extends Phaser.Scene {
    constructor () {
        super("Game");// аналогично вызову new Phaser.Scene("Game");
    }

    preload() {
        this.load.image('bg', 'assets/sprites/background.png');// предзагрузили изображение
        this.load.image('card', 'assets/sprites/card.png');
        this.load.image('card1', 'assets/sprites/card1.png');
        this.load.image('card2', 'assets/sprites/card2.png');
        this.load.image('card3', 'assets/sprites/card3.png');
        this.load.image('card4', 'assets/sprites/card4.png');
        this.load.image('card5', 'assets/sprites/card5.png');

        this.load.audio('theme', 'assets/sounds/theme.mp3');
        this.load.audio('card', 'assets/sounds/card.mp3');
        this.load.audio('complete', 'assets/sounds/complete.mp3');
        this.load.audio('success', 'assets/sounds/success.mp3');
        this.load.audio('timeout', 'assets/sounds/timeout.mp3');
    }

    createText() {
        this.timeoutText =  this.add.text(10,330, "", {
            font: '36px CurseCasual',
            fill: '#fff'
        });
    }

    onTimerTick() {
        this.timeoutText.setText("Time: " + this.timeout);

        if (this.timeout <= 0) {
            this.timer.paused = true;
            this.sounds.timeout.play({volume: 0.1});
            this.restart();
        } else {
            --this.timeout;
        }
    }
    createTimer() {
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        });
    }

    createSounds(){
        this.sounds = {
            card: this.sound.add('card'),
            complete: this.sound.add('complete'),
            success: this.sound.add('success'),
            timeout: this.sound.add('timeout'),
            theme: this.sound.add('theme')
        };
        this.sounds.theme.play({volume: 0.1});       
    }

    create() {
        this.timeout = config.timeout;
        this.createSounds();
        this.createTimer();
        this.createBackground();
        this.createText();
        this.createCards();
        this.start();
    }

    restart() {
        // когда все карты улетели
        let count = 0;
        let onCardMoveComplete = () => {// будет выполняться по факту улета каждой карты
            ++count;
            if (count >= this.cards.length){// все карты улетели
                this.start();
            }
        };
        this.cards.forEach(card => {
            card.move({
                x: this.sys.game.config.width + card.width,
                y: this.sys.game.config.height + card.height,
                delay: card.position.delay,
                callback: onCardMoveComplete
            });
        });
        
    }

    start() {
        this.initCardsPositions();
        this.timeout = config.timeout;
        this.openedCard = null;
        this.openedCardsCounts = 0;// счетчик для каждой новой открытой пары 
        this.timer.paused = false;
        this.initСards();// для перетасовки карт
        this.showCards();
    }

    showCards() {
        this.cards.forEach(card => {
            card.depth = card.position.delay;// установить уровень слоя
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay
            });
        });
    }

    initСards() {
        let positions = Phaser.Utils.Array.Shuffle(this.positions);// получаем позиции элемента + перемешивание
        this.cards.forEach(card => {
            card.init(positions.pop());
            
        });
    }

    createBackground() {
        this.add.sprite(0,0,'bg').setOrigin(0,0);//установили координаты и сделали вывод изображения относительно его левого верхнего угла    
    }

    createCards() {
        this.cards = [];
        for (let value of config.cards){
            for (let i = 0; i < 2; i++){
                this.cards.push(new Card(this, value));
            }
        }
        this.input.on('gameobjectdown', this.onCardClicked, this);//gameobjectdown - вызывается для всеъ интерактивныъ элементов на сцене
    }

    onCardClicked(pointer, card) {// card - тот игровой объект, на который нажали; pointer - сам объект события
        if (card.opened) {//если клик по уже открытой карте
            return false;
        }
        this.sounds.card.play();
        if (this.openedCard) {// уже есть открытая карта
            if (this.openedCard.value === card.value){
                //картинки равны - запомнить
                this.sounds.success.play();
                this.openedCard = null;
                ++this.openedCardsCounts;
            }
            else {
                //картинки не равны - скрыть прошлую
                this.openedCard.close();
                this.openedCard = card;
            }
        }
        else {// еще нет открытой карты
            this.openedCard = card;//записали текущую карту
        }
        card.open(() => {
            if (this.openedCardsCounts === this.cards.length/2) {// если открыты все пары карточек
                this.sounds.complete.play({volume: 0.1});
                this.restart();// заново запускаем игру
            }
        });       
    }

    initCardsPositions() {
        let positions = [];
        let cardTexture = this.textures.get('card').getSourceImage();// получили текстуру карточки
        let cardWidth = cardTexture.width +4;
        let cardHeigth = cardTexture.height + 4;
        
        //делаем отступы, чтобы карточки были посередине
    
        let offsetX = (this.sys.game.config.width - cardWidth*config.cols)/2 + cardWidth/2; // вся ширина экрана
        let offsetY = (this.sys.game.config.height - cardHeigth*config.rows)/2 + cardHeigth/2;
        let id = 0;
        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                positions.push({
                    delay: ++id * 100,
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeigth,
                })
            }
        }
        this.positions = positions;
    }

}
