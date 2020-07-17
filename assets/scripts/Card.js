class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, value) {
        super(scene, 0, 0, 'card');
        this.scene = scene; //установим ссылку на сцену
        this.value = value;
        this.scene.add.existing(this);//вывод спрайта на экран
        this.setInteractive();//указываем, что данный игоровой объект будет являться интерактивным
        this.opened = false;// флаг для карты  
    }

    init(position) {
        this.position = position;
        this.close();
        this.setPosition(-this.width, -this.height);// стандартный метод phaser
    }

    move(params) {
        this.scene.tweens.add({
            targets: this,//объект анимации
            x: params.x, // значение, до которого будем изменять свойство
            y: params.y,
            delay: params.delay,// задержка
            ease: 'Linear', // тип анимации
            duration: 250,// за какое время необходимо изменить
            onComplete: () => {
                if (params.callback) {
                    params.callback();
                }
            } // выполнится по завершению анимации
        });// создаем анимацию
    }

    flip(callback) {
        this.scene.tweens.add({
            targets: this,//объект анимации
            scaleX: 0, // значение, до которого будем изменять свойство
            ease: 'Linear', // тип анимации
            duration: 150,// за какое время необходимо изменить
            onComplete: () => {
                this.show(callback);
            } // выполнится по завершению анимации
        });// создаем анимацию
    }

    show(callback) {
        let texture = this.opened ? 'card' + this.value : 'card';
        this.setTexture(texture);
        this.scene.tweens.add({
            targets: this,//объект анимации
            scaleX: 1, // значение, до которого будем изменять свойство
            ease: 'Linear', // тип анимации
            duration: 150,// за какое время необходимо изменить
            onComplete: () => {
               if(callback) {
                   callback();
               }
            }
        });
    }

    open(callback) {
        this.opened =true;
        this.flip(callback);
    }

    close() {
        if (this.opened) {
            this.opened = false;
            this.flip();
        }
    }
}