import { CarsList } from "catalog/carsList";
import { createSlider, swiper } from "nfs/js/sliderjs";

// Создаем функцию preloader
function preloader() {
    // Так как это прелоадер мы не должны позволять пользователю скролить сайт
    document.body.style.overflow = "hidden";
    // Доставем нужные дивы
    const overlay = document.getElementById( "overlay" );
    const progstat = document.getElementById( "progstat" );
    const progress = document.getElementById( "progress" );
    // Получаем все картинки из HTML
    const images = document.images;

    // Создаем переменную count при помощи которой высчитываем процент загрузки
    let count = 0;
    // В переменную помещаем количество всех кортинок на сайте
    let total = images.length;
    // Говорим если картинок нет то убирай прелоадер, так как сайт уже весь загрузился
    if ( total == 0 ) return doneLoading();

    // Создаем функцию itemLoaded в которой происходят следующие действия
    function itemLoaded() {
        // Увеличиваем текущее число на один
        count++;
        // Высчитываем проценты
        let percent = (100 / total * count).toFixed( 1 ) + "%";
        // Задаем ширину полоски в процентах которые только, что высчитали
        progress.style.width = percent;
        // Указываем текущий процент на экран
        progstat.innerHTML = "Loading " + percent;
        // Если текущее число равно общему количеству то убираем прелоадер вызвав функцию doneLoading
        if ( count === total ) return doneLoading();
    }

    // Создаем функцию doneLoading
    function doneLoading() {
        // Делаем прелоадер невидимым и разрешаем скролить
        overlay.style.transform = `scale(0)`;
        document.body.style.overflow = "visible";
        setTimeout( function () {
            // Через 1.2 секнды убираем его вовсе сделали мы это для плавной анимации
            overlay.style.display = "none";
        }, 1200 );
    }

    // Преобразовываем картинки в массив
    Array.from( images ).forEach( ( image ) => {
        // Создаем новую картинку через new Image
        let tImg = new Image();
        // При успешной загрузке или ошибке вызываем itemLoaded
        tImg.addEventListener( "load", itemLoaded );
        tImg.addEventListener( "error", itemLoaded );
        // И указываем путь для текущей картинки
        tImg.src = image.src;
    } );
}

// Используем событие DOMContentLoaded
// DomContentLoaded это когда - браузер полностью загрузил HTML, было построено DOM-дерево, но внешние ресурсы, могут
// быть ещё не загружены.
document.addEventListener( 'DOMContentLoaded', preloader );

// Создаем массив ASSETS в который помещаем картинки и основные цвета игры
const ASSETS = {
    COLOR: {
        TAR: ["#9c9a9d", "#9c9a9d"],
        RUMBLE: ["red", "#f5f2f6"],
        GRASS: ["#eedccd", "#e6d4c5"],
    },

    // Размеры картинок подбирались вручную
    IMAGE: {
        TREE: {
            src: "/mini-games/nfs/img/tree.png",
            width: 132,
            height: 192,
        },

        HERO: {
            src: "/mini-games/nfs/img/M5CS.png",
            width: 110,
            height: 103,
        },

        CAR: {
            src: "/mini-games/nfs/img/base-car.png",
            width: 50,
            height: 36,
        },

        FINISH: {
            src: "/mini-games/nfs/img/finish.png",
            width: 339,
            height: 180,
            offset: -0.5,
        },

        SKY: {
            src: "/mini-games/nfs/img/cloud.jpg",
        },
    },

    AUDIO: {
        theme:
            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/theme.mp3",
        engine:
            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/engine.wav",
        honk: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/honk.wav",
        beep: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/beep.wav",
    },
};

// Функция которая высчитывает проценты
const calculatingPercentages = ( value, maxValue ) => value / maxValue * 100;

// Функция которая рисует карточку
const renderCarCard = ( car, targetContainer ) => {
    const { id, poster, carName, maxSpeed, manageability, braking, dynamics } = car;

    const calculatingSpeed = calculatingPercentages( maxSpeed, 331 );
    const calculatingManageability = calculatingPercentages( manageability, 100 );
    const calculatingBraking = calculatingPercentages( braking, 100 );
    const calculatingDynamics = calculatingPercentages( dynamics, 100 );

    targetContainer.insertAdjacentHTML( "beforeend",
        `
            <article class="choice-car__card" data-id="${ id }">
                <div class="choice-car__image _ibg">
                    <img src="${ poster }" alt="">
                </div>
                <div class="choice-car__title">${ carName }</div>
                <ul class="choice-car__rating rating">
                    <li class="rating__item"><span>скорость:</span>
                        <div data-value="${ calculatingSpeed }" class="rating__progress"></div>
                    </li>
                    <li class="rating__item"><span>маневренность:</span>
                        <div data-value="${ calculatingManageability }" class="rating__progress"></div>
                    </li>
                    <li class="rating__item"><span>тормоза:</span>
                        <div data-value="${ calculatingBraking }" class="rating__progress"></div>
                    </li>
                    <li class="rating__item"><span>ускорение:</span>
                        <div data-value="${ calculatingDynamics }" class="rating__progress"></div>
                    </li>
                </ul>
                <button class="choice-car__button">Выбрать</button>
            </article>
        ` );
};

// Функция которая рисует список карточек
const renderChoiceCarsList = ( carsList ) => {
    document.body.insertAdjacentHTML( "beforeend",
        `
        <div class="choice-car">
            <div class="choice-car__container">
                <h2 class="choice-car__subtitle">Выберите авто</h2>
                <div class="choice-car__row _swiper">
                    </div>
                    <div class="slider-cars__arrows slider-arrows">
                    <button type="button"
                        class="slider-arrow slider-arrow_prev"></button>
                    <button type="button"
                        class="slider-arrow slider-arrow_next"></button>
                </div>
                <div class="controls-slider-main__dotts"></div>
            </div>
        </div>
        `
    );

    const carsContainerHTML = document.querySelector( '.choice-car__row' );

    carsList.forEach( ( car ) => renderCarCard( car, carsContainerHTML ) );

    const progressList = document.querySelectorAll( '.rating__progress' );

    if ( progressList.length ) {
        Array.from( progressList ).forEach( ( progress ) => {
            progress.style.setProperty( "--w", progress.dataset.value + "%" );
        } );
    }
};

// Отрисовываем карточки, чтобы пользователь мог выбрать автомобиль
renderChoiceCarsList( CarsList );

const choiceCarSection = document.querySelector( '.choice-car' );
const carCardsContainer = document.querySelector( '.choice-car__row' );

if ( carCardsContainer ) {
    swiper();
    createSlider();
}

carCardsContainer.addEventListener( "click", ( event ) => {
    const isCardBtn = event.target.closest( ".choice-car__button" );

    if ( isCardBtn ) {
        const cardId = event.target.closest( ".choice-car__card" )?.dataset?.id;

        choiceCarSection.classList.add( "hide" );
        setTimeout( () => choiceCarSection.remove(), 3000 );

        if ( cardId ) {
            const cardNumber = CarsList.findIndex( ( card ) => Number( card.id ) === Number( cardId ) );
            const { src, width, height, maxSpeed, accelInGame, breakingInGame, decelInGame } = CarsList[cardNumber];

            ASSETS.IMAGE.HERO = {
                src,
                width,
                height,
                maxSpeed,
                accelInGame,
                breakingInGame,
                decelInGame,
            };
            startGame( ASSETS );
        }
    }
} );

//========================================================================================================================================================
// // Вспомогательные функции для дальнейшей работы
// =========================================================================================================================================================

Number.prototype.pad = function ( numberZeros, char = 0 ) {
    // В переменную number возвращаем абсолютное значение числа
    let number = Math.abs( this );
    // В переменную zeros помещаем количество нулей в числе
    let zeros = Math.max( 0, numberZeros - Math.floor( number ).toString().length );
    // В переменную zeroString помещаем готовое число преврощаем в строку и заменяем нули на char
    let zeroString = Math.pow( 10, zeros )
        .toString()
        .substring( 1 )
        .replace( 0, char );

    // и возвращаем zeroString вместе с number
    return zeroString + number;
}

Number.prototype.clamp = function ( min, max ) {
    // Возвращаем максимальное число
    return Math.max( min, Math.min( this, max ) );
}

// Функция которая возвращает текущее значение
const timestamp = () => Date.now();
// Функция которая высчитывает
const accelerate = ( v, accel, dt ) => v + accel * dt;
// Функция которая Которая возвращает позицию столкновения
const isCollide = ( x1, w1, x2, w2 ) => (x1 - x2) ** 2 <= (w2 + w1) ** 2;

// Функция которая возвращает рандомное число. | - это бинарное или
function getRandom( min, max ) {
    return (Math.random() * (max - min) + min) | 0;
}

// Функция которая возвращает рандомное значение из объекта
function randomProperty( obj ) {
    let keys = Object.keys( obj );
    return obj[keys[(keys.length * Math.random()) << 0]] // Оператор left shift (<<) сдвигает первый операнд на
                                                         // указанное число битов по модулю 32 влево
}

// Функция которая отрисовывает нужные нам элементы
function drawQuad( element, layer, color, x1, y1, w1, x2, y2, w2 ) {
    element.style.zIndex = layer;
    element.style.background = color;
    element.style.top = y2 + `px`;
    element.style.left = x1 - w1 / 2 - w1 + `px`;
    element.style.width = w1 * 3 + `px`;
    element.style.height = y1 - y2 + `px`;

    let leftOffset = w1 + x2 - x1 + Math.abs( w2 / 2 - w1 / 2 );
    element.style.clipPath = `polygon(${ leftOffset }px 0, ${ leftOffset + w2 }px 0, 66.66% 100%, 33.33% 100%)`;
}

const KEYS = {};
// Функция которая длбавляет в объект KEYS нажатые клавиши и их текущее состояние true/false
const keyUpdate = ( e ) => {
    KEYS[e.code] = e.type === `keydown`;
    e.preventDefault();
};
// Как только кнопка нажимается или отпускается вызываем функцию keyUpdate
document.addEventListener( `keydown`, keyUpdate );
document.addEventListener( `keyup`, keyUpdate );

function sleep( ms ) {
    return new Promise( function ( resolve, reject ) {
        setTimeout( () => resolve(), ms );
    } );
}

function startGame( ASSETS ) {
    // =========================================================================================================================================================
    // ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
    // =========================================================================================================================================================

    // Я думаю с переменными все понятно и нет смысла расписывть

    const highscores = [];

    const width = 1000;
    const halfWidth = width / 2;
    const height = 600;
    const roadW = 4000;
    const segL = 200;
    const camD = 0.2;
    const H = 1500;
    const N = 80;

    const maxSpeed = ASSETS.IMAGE.HERO.maxSpeed;
    const accel = ASSETS.IMAGE.HERO.accelInGame;
    const breaking = ASSETS.IMAGE.HERO.breakingInGame;
    const decel = ASSETS.IMAGE.HERO.decelInGame;
    const maxOffSpeed = 60;
    const offDecel = -170;
    const enemy_speed = 20;
    const hitSpeed = 20;

    const LANE = {
        A: -2.3,
        B: -0.5,
        C: 1.2,
    };

    const mapLength = 15000;

    // Повтор/воспроизведение
    let then = timestamp();
    const targetFrameRate = 1000 / 60; // in ms

    let audio;

    // Игра
    let inGame,
        start,
        playerX,
        speed,
        scoreVal,
        pos,
        cloudOffset,
        sectionProg,
        mapIndex,
        countDown;
    let lines = [];
    let cars = [];

    //========================================================================================================================================================
    // Дальше используем классы и делаем игру через ООП
    // =========================================================================================================================================================

    class Line {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.z = 0;

            this.X = 0;
            this.Y = 0;
            this.W = 0;

            this.curve = 0;
            this.scale = 0;

            this.elements = [];
            this.special = null;
        }

        project( camX, camY, camZ ) {
            this.scale = camD / (this.z - camZ);
            this.X = (1 + this.scale * (this.x - camX)) * halfWidth;
            this.Y = Math.ceil( ((1 - this.scale * (this.y - camY)) * height) / 2 );
            this.W = this.scale * roadW * halfWidth;
        }

        // Метод clearSprites нужен для удаления спратов(авто на дороге)
        clearSprites() {
            this.elements.forEach( ( e ) => e.style.background = "transparent" );
        }

        // Метод drawSprite нужен для отрисовки спрайтов
        drawSprite( depth, layer, sprite, offset ) {
            // Высчитываем разные математические действия и помещаем значение в переменные
            let destX = this.X + this.scale * halfWidth * offset;
            let destY = this.Y + 4;
            let destW = (sprite.width * this.W) / 265;
            let destH = (sprite.height * this.W) / 265;

            destX += destW * offset;
            destY += destH * -1;

            let obj = layer instanceof Element ? layer : this.elements[layer + 6];
            // Приминяем стили к элементу, ну по сути просто отрисовываем
            obj.style.background = `url('${ sprite.src }') no-repeat`;
            obj.style.backgroundSize = `${ destW }px ${ destH }px`;
            obj.style.left = destX + `px`;
            obj.style.top = destY + `px`;
            obj.style.width = destW + `px`;
            obj.style.height = destH + `px`;
            obj.style.zIndex = depth;
        }
    }

    // Класс Car отвечает за наше авто(главный герой)
    class Car {
        constructor( pos, type, lane ) {
            // Инициализируем привязки для this
            this.pos = pos;
            this.type = type;
            this.lane = lane;

            // Добавляем элемент в DOM дерево(Добавляем авто на дорогу)
            let element = document.createElement( "div" );
            document.getElementById( "road" ).appendChild( element );
            this.element = element;
        }
    }

    // Класс Audio отвечает за звук в игре
    class Audio {
        constructor() {
            // Привязка this.audioCtx будет создавать новый Аудио контекст
            this.audioCtx = new AudioContext();

            // volume(звук)
            this.destination = this.audioCtx.createGain();
            this.volume = 1;
            this.destination.connect( this.audioCtx.destination );

            this.files = {};

            let _self = this;
            // this.load - функция которая включает звук
            this.load( ASSETS.AUDIO.theme, "theme", function ( key ) {
                // Думаю, что тут все понятно
                let source = _self.audioCtx.createBufferSource();
                source.buffer = _self.files[key];

                let gainNode = _self.audioCtx.createGain();
                gainNode.gain.value = 0.6;
                source.connect( gainNode );
                gainNode.connect( _self.destination );

                source.loop = true;
                source.start( 0 );
            } );
        }

        // Создаем геттер для this.destination.gain.value
        get volume() {
            return this.destination.gain.value;
        }

        // Создаем сеттер для this.destination.gain.value
        set volume( level ) {
            this.destination.gain.value = level;
        }

        // Метод play нужен для воспроизведения звука
        play( key, pitch ) {
            if ( this.files[key] ) {
                let source = this.audioCtx.createBufferSource();
                source.buffer = this.files[key];
                source.connect( this.destination );
                if ( pitch ) source.detune.value = pitch;
                source.start( 0 );
            } else {
                const sound = this.load( key, () => this.play( key ) );
            }
        }

        // Асинхронный метод load служит для запроса на сервер, где мы получаем аудио
        async load( src, key, callback ) {
            let _self = this;

            // Делаем запрос на сервер с нашим src
            const response = await fetch( src );
            // Получаем ответ
            const volume = await response.arrayBuffer();

            return _self.audioCtx.decodeAudioData(
                volume,
                function ( beatportBuffer ) {
                    _self.files[key] = beatportBuffer;
                    callback( key );
                },
                function () {
                }
            );
        }
    }

    // =========================================================================================================================================================
    // Карта
    // =========================================================================================================================================================

    // Функция genMap генерирует/отрисовывает карту
    function genMap() {
        let map = [];

        for ( let i = 0; i < mapLength; i += getRandom( 0, 10 ) ) {
            let section = {
                from: i,
                to: (i = i + getRandom( 300, 600 )),
            };

            let randHeight = getRandom( -5, 20 );
            let randCurve = getRandom( 5, 10 ) * (Math.random() >= 0.5 ? 1 : -1);
            let randInterval = getRandom( 20, 40 );

            if ( Math.random() > 0.9 )
                Object.assign( section, {
                    curve: () => randCurve,
                    height: () => randHeight,
                } );
            else if ( Math.random() > 0.8 )
                Object.assign( section, {
                    curve: () => 0,
                    height: ( i ) => Math.sin( i / randInterval ) * 100,
                } );
            else if ( Math.random() > 0.8 )
                Object.assign( section, {
                    curve: () => 0,
                    height: () => randHeight,
                } );
            else
                Object.assign( section, {
                    curve: () => randCurve,
                    height: () => 0,
                } );

            map.push( section );

            if ( i >= mapLength ) {
                map.push( {
                    from: i,
                    to: i + N,
                    curve: () => 0,
                    height: () => 0,
                    special: ASSETS.IMAGE.FINISH,
                } );
            }
        }

        map.push( { from: Infinity } );
        return map;
    }

    // Создаем карту
    let map = genMap();

    // =========================================================================================================================================================
    // дополнительные элементы управления
    // =========================================================================================================================================================

    document.addEventListener( `keyup`, function ( e ) {
        // При нажатии на кнопку M включаем лили выключаем звук в игре
        if ( e.code === "KeyM" ) {
            e.preventDefault();

            audio.volume = audio.volume === 0 ? 1 : 0;
            return;
        }

        // При нажатии на клавишу C запускаем игру
        if ( e.code === "KeyC" ) {
            e.preventDefault();

            // Если мы начали игру то ничиго не делаем
            if ( inGame ) return;

            const text = document.getElementById( "text" );

            sleep( 0 )
                .then( () => {
                    text.classList.remove( "blink" );
                    text.innerText = "3";
                    audio.play( "beep" );
                    return sleep( 1000 );
                } )
                .then( () => {
                    text.innerText = "2";
                    audio.play( "beep" );
                    return sleep( 1000 );
                } )
                .then( () => {
                    text.innerText = "1";
                    audio.play( "beep" );
                    return sleep( 1000 );
                } )
                .then( () => {
                    reset();

                    document.getElementById( "home" ).style.display = "none";

                    document.getElementById( "road" ).style.opacity = "1";
                    document.getElementById( "hero" ).style.display = "block";
                    document.getElementById( "hud" ).style.display = "block";

                    audio.play( "beep", 500 );

                    inGame = true;
                } );

            return;
        }

        // Если нажмем на esc или r то игра начнется сначала
        if ( e.code === "KeyR" ) {
            e.preventDefault();
            reset();
        } else if ( e.code === "Escape" ) {
            e.preventDefault();

            window.location.reload();
        }
    } );

    // =========================================================================================================================================================
    // Зацикленность(game loop)
    // =========================================================================================================================================================

    // Функция которая обновляет состояние(игру)
    function update( step ) {
        pos += speed;
        while ( pos >= N * segL ) pos -= N * segL;
        while ( pos < 0 ) pos += N * segL;

        const startPos = (pos / segL) | 0;
        const endPos = (startPos + N - 1) % N;

        scoreVal += speed * step;
        countDown -= step;

        // left / right позиция
        playerX -= (lines[startPos].curve / 5000) * step * speed;

        const hero = document.getElementById( "hero" );

        if ( KEYS.ArrowRight || KEYS.KeyD ) {
            hero.style.backgroundPosition = `-${ (ASSETS?.IMAGE?.HERO?.width) * 2 }px 0`;
            playerX += 0.007 * step * speed;
        } else if ( KEYS.ArrowLeft || KEYS.KeyA ) {
            hero.style.backgroundPosition = "0 0";
            playerX -= 0.007 * step * speed
        } else hero.style.backgroundPosition = `-${ ASSETS?.IMAGE?.HERO?.width }px 0`;

        playerX = playerX.clamp( -3, 3 );

        // Скорость

        if ( inGame && KEYS.ArrowUp || inGame && KEYS.KeyW ) speed = accelerate( speed, accel, step );
        else if ( KEYS.ArrowDown || KEYS.KeyS ) speed = accelerate( speed, breaking, step );
        else speed = accelerate( speed, decel, step );

        if ( Math.abs( playerX ) > 0.55 && speed >= maxOffSpeed ) {
            speed = accelerate( speed, offDecel, step );
        }

        speed = speed.clamp( 0, maxSpeed );

        // обновление карты/дороги
        let current = map[mapIndex];
        let use = current.from < scoreVal && current.to > scoreVal;
        if ( use ) sectionProg += speed * step;
        lines[endPos].curve = use ? current.curve( sectionProg ) : 0;
        lines[endPos].y = use ? current.height( sectionProg ) : 0;
        lines[endPos].special = null;

        if ( current.to <= scoreVal ) {
            mapIndex++;
            sectionProg = 0;

            lines[endPos].special = map[mapIndex].special;
        }

        // победа / проигрыш + ui

        if ( !inGame ) {
            speed = accelerate( speed, breaking, step );
            speed = speed.clamp( 0, maxSpeed );
        } else if ( countDown <= 0 || lines[startPos].special ) {
            document.getElementById( "tacho" ).style.display = "none";

            document.getElementById( "home" ).style.display = "block";
            document.getElementById( "road" ).style.opacity = 0.4;
            document.getElementById( "text" ).innerText = "Сможешь быстрее ?";

            highscores.push( document.getElementById( "lap" ).innerText );
            highscores.sort();
            updateHighscore();

            inGame = false;
        } else {
            document.getElementById( "time" ).innerText = (countDown | 0).pad( 3 );
            document.getElementById( "score" ).innerText = (scoreVal | 0).pad( 8 );
            document.getElementById( "tacho" ).innerText = speed | 0;

            let cT = new Date( timestamp() - start );
            document.getElementById( "lap" ).innerText = `${ cT.getMinutes() }'${ cT.getSeconds().pad( 2 ) }"${ cT
                .getMilliseconds()
                .pad( 3 ) }`;
        }

        // возпроизводим звук двигателя
        if ( speed > 0 ) audio.play( "engine", speed * 4 );

        // Рисуем облака
        document.getElementById( "cloud" ).style.backgroundPosition = `${ (cloudOffset -= lines[startPos].curve * step * speed * 0.13) | 0 }px 0`;

        // другие автомобили/авто из трафика
        cars.forEach( ( car ) => {
            car.pos = (car.pos + enemy_speed * step) % N;

            // перерендорование(respawn)
            if ( (car.pos | 0) === endPos ) {
                if ( speed < 30 ) car.pos = startPos;
                else car.pos = endPos - 2;
                car.lane = randomProperty( LANE );
            }

            // столкновение
            const offsetRatio = 5;
            if (
                (car.pos | 0) === startPos &&
                isCollide( playerX * offsetRatio + LANE.B, 0.5, car.lane, 0.5 )
            ) {
                speed = Math.min( hitSpeed, speed );
                // Воспроизводим звук столкновения
                if ( inGame ) audio.play( "honk" );
            }
        } );

        // Рисуем дорогу/трассу
        let maxY = height;
        let camH = H + lines[startPos].y;
        let x = 0;
        let dx = 0;

        for ( let n = startPos; n < startPos + N; n++ ) {
            let l = lines[n % N];
            let level = N * 2 - n;

            // обновляем вид
            l.project(
                playerX * roadW - x,
                camH,
                startPos * segL - (n >= N ? N * segL : 0)
            );
            x += dx;
            dx += l.curve;

            // удаляем спрайты
            l.clearSprites();

            // Рисуем спрайты
            if ( n % 10 === 0 ) l.drawSprite( level, 0, ASSETS.IMAGE.TREE, -2 );
            if ( (n + 5) % 10 === 0 )
                l.drawSprite( level, 0, ASSETS.IMAGE.TREE, 1.3 );

            if ( l.special )
                l.drawSprite( level, 0, l.special, l.special.offset || 0 );

            cars.forEach( ( car ) => {
                if ( (car.pos | 0) === n % N )
                    l.drawSprite( level, car.element, car.type, car.lane );
            } );

            // Обновляем дорогу/трассу

            if ( l.Y >= maxY ) continue;
            maxY = l.Y;

            let even = ((n / 2) | 0) % 2;
            let grass = ASSETS.COLOR.GRASS[even * 1];
            let rumble = ASSETS.COLOR.RUMBLE[even * 1];
            let tar = ASSETS.COLOR.TAR[even * 1];

            let p = lines[(n - 1) % N];

            drawQuad(
                l.elements[0],
                level,
                grass,
                width / 4,
                p.Y,
                halfWidth + 2,
                width / 4,
                l.Y,
                halfWidth
            );
            drawQuad(
                l.elements[1],
                level,
                grass,
                (width / 4) * 3,
                p.Y,
                halfWidth + 2,
                (width / 4) * 3,
                l.Y,
                halfWidth
            );

            drawQuad(
                l.elements[2],
                level,
                rumble,
                p.X,
                p.Y,
                p.W * 1.15,
                l.X,
                l.Y,
                l.W * 1.15
            );
            drawQuad( l.elements[3], level, tar, p.X, p.Y, p.W, l.X, l.Y, l.W );

            if ( !even ) {
                drawQuad(
                    l.elements[4],
                    level,
                    ASSETS.COLOR.RUMBLE[1],
                    p.X,
                    p.Y,
                    p.W * 0.4,
                    l.X,
                    l.Y,
                    l.W * 0.4
                );
                drawQuad(
                    l.elements[5],
                    level,
                    tar,
                    p.X,
                    p.Y,
                    p.W * 0.35,
                    l.X,
                    l.Y,
                    l.W * 0.35
                );
            }
        }
    }

    // =========================================================================================================================================================
    // Инициализируем игру
    // =========================================================================================================================================================

    // Функция reset нужна для восстановления авто(новой попытки)
    function reset() {
        inGame = false;

        start = timestamp();
        countDown = map[map.length - 2].to / 130 + 10;

        playerX = 0;
        speed = 0;
        scoreVal = 0;

        pos = 0;
        cloudOffset = 0;
        sectionProg = 0;
        mapIndex = 0;

        lines.forEach( ( line ) => line.curve = line.y = 0 );

        const text = document.getElementById( "text" );

        text.innerText = "Успей доехать";
        text.classList.add( "blink" );

        document.getElementById( "road" ).style.opacity = "0.4";
        document.getElementById( "hud" ).style.display = "none";
        document.getElementById( "home" ).style.display = "block";
        document.getElementById( "tacho" ).style.display = "block";
    }

    // Функция updateHighscore нужна для обновления рекордов
    function updateHighscore() {
        let hN = Math.min( 12, highscores.length );
        // Решил тут не использовать forEach
        for ( let i = 0; i < hN; i++ ) {
            document.getElementById( "highscore" ).children[i].innerHTML = `${ (i + 1).pad( 2, "&nbsp;" ) }. ${ highscores[i] }`;
        }
    }

    // Функция init нужна для инициализации/начало игры
    function init() {
        const game = document.querySelector( '#game' );
        const hero = document.querySelector( '#hero' );
        const cloud = document.querySelector( '#cloud' );

        game.style.width = width + "px";
        game.style.height = height + "px";

        hero.style.top = height - (ASSETS?.IMAGE?.HERO?.height + 24) + "px";
        hero.style.left = halfWidth - ASSETS.IMAGE.HERO.width / 2 + "px";
        hero.style.background = `url(${ ASSETS.IMAGE.HERO.src })`;
        hero.style.width = `${ ASSETS.IMAGE.HERO.width }px`;
        hero.style.height = `${ ASSETS.IMAGE.HERO.height }px`;

        cloud.style.backgroundImage = `url(${ ASSETS.IMAGE.SKY.src })`;

        audio = new Audio();
        Object.keys( ASSETS.AUDIO ).forEach( ( key ) =>
            audio.load( ASSETS.AUDIO[key], key, () => 0 )
        );

        cars.push( new Car( 0, ASSETS.IMAGE.CAR, LANE.C ) );
        cars.push( new Car( 10, ASSETS.IMAGE.CAR, LANE.B ) );
        cars.push( new Car( 20, ASSETS.IMAGE.CAR, LANE.C ) );
        cars.push( new Car( 35, ASSETS.IMAGE.CAR, LANE.C ) );
        cars.push( new Car( 50, ASSETS.IMAGE.CAR, LANE.A ) );
        cars.push( new Car( 60, ASSETS.IMAGE.CAR, LANE.B ) );
        cars.push( new Car( 70, ASSETS.IMAGE.CAR, LANE.A ) );

        for ( let i = 0; i < N; i++ ) {
            const line = new Line();
            line.z = i * segL + 270;

            for ( let j = 0; j < 6 + 2; j++ ) {
                const element = document.createElement( "div" );
                document.getElementById( "road" ).appendChild( element );
                line.elements.push( element );
            }

            lines.push( line );
        }

        for ( let i = 0; i < 12; i++ ) {
            const element = document.createElement( "p" );
            document.getElementById( "highscore" ).appendChild( element );
        }
        updateHighscore();

        reset();

        // ЗАПУСК ИГРОВОГО ЦИКЛА
        (function loop() {
            requestAnimationFrame( loop );

            let now = timestamp();
            let delta = now - then;

            if ( delta > targetFrameRate ) {
                then = now - (delta % targetFrameRate);
                update( delta / 1000 );
            }
        })();
    }

    init();
}
