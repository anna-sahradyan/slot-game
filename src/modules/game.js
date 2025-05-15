import {Application, Container, Graphics, Text, TextStyle} from 'pixi.js';

export async function initSlotGame(container) {
    const app = new Application();
    await app.init({
        background: '#222',
        width: 800,
        height: 350,
        backgroundAlpha: 0,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
        resizeTo: null
    });
    container.appendChild(app.view);
    app.view.classList.add('slot-canvas');
    container.classList.add('slot-game-container');

    const items = ["7️⃣", "❌", "🍓", "🍋", "🍉", "🍒", "💵", "🍊", "🍎"];
    function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    const shuffled = shuffle(items);
    const SYMBOL_SIZE = 100;
    const REEL_WIDTH = 100;
    const NUM_REELS = 5;
    const NUM_ROWS = 3;
    let isSpinning = false;

    const reelContainer = new Container();
    app.stage.addChild(reelContainer);
    const reels = [];

    for (let i = 0; i < NUM_REELS; i++) {
        const rc = new Container();
        rc.x = i * REEL_WIDTH;

        const reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
        };

        for (let j = 0; j < NUM_ROWS + 1; j++) {
            const symbol = new Text(shuffled[j % shuffled.length], new TextStyle({
                fontSize: 72,
                fill: 'white',
                align: 'center',
            }));
            symbol.y = j * SYMBOL_SIZE;
            symbol.x = (REEL_WIDTH - symbol.width) / 2;
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }

        reels.push(reel);
        reelContainer.addChild(rc);
    }

    reelContainer.x = (app.screen.width - REEL_WIDTH * NUM_REELS) / 2;
    reelContainer.y = (app.screen.height - SYMBOL_SIZE * NUM_ROWS) / 2;

    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(
        reelContainer.x,
        reelContainer.y,
        REEL_WIDTH * NUM_REELS,
        SYMBOL_SIZE * NUM_ROWS
    );
    mask.endFill();
    app.stage.addChild(mask);
    reelContainer.mask = mask;

    const spinBtn = document.createElement('button');
    spinBtn.style.position = 'absolute';
    spinBtn.style.bottom = '10px';
    spinBtn.style.left = '50%';
    spinBtn.style.transform = 'translateX(-50%)';
    container.appendChild(spinBtn);
    spinBtn.className = 'slot-spin-btn';
    spinBtn.innerHTML = `
        <span class="spinner-icon">
            <img src="/src/assets/images/spinner.svg" alt="spinner">
        </span>
    `;

    spinBtn.addEventListener('click', async () => {
        if (isSpinning) return;

        isSpinning = true;
        disableScroll();

        const spinnerIcon = spinBtn.querySelector('.spinner-icon');
        spinnerIcon.classList.add('spinning');

        spinBtn.textContent = 'Ждите... крутится...';

        try {
            startSpin();

            const delay = await fetchDelay();
            console.log(`Сервер "думал" ${delay} сек`);
            const effectiveDelay = Math.max(delay, 0.5);

            await new Promise(resolve => setTimeout(resolve, effectiveDelay * 1000));

            await stopReelsWithBounce();

            showFloatingMessage(`Сервер думал: ${delay.toFixed(1)} сек`);

        } catch (e) {
            console.error('Ошибка в процессе спина:', e);
        } finally {
            spinnerIcon.classList.remove('spinning');
            enableScroll();
            isSpinning = false;
            spinBtn.textContent = '';
            spinBtn.innerHTML = `
        <span class="spinner-icon">
            <img src="/src/assets/images/spinner.svg" alt="spinner">
        </span>
        `;
        }
    });




    async function stopReelsWithBounce() {
        const stopPromises = reels.map((r, i) => {
            return new Promise(resolve => {
                const current = r.position;
                const target = current + 10 + i * 5;
                const time = 2000 + i * 300;

                tweenTo(r, 'position', target, time, backout(0.5), null, () => {
                    r.position = Math.round(r.position);
                    if (i === reels.length - 1) {
                        reelsComplete();
                    }
                    resolve();
                });
            });
        });

        await Promise.all(stopPromises);
    }




    async function startSpin() {
        const spinPromises = reels.map((r, i) => {
            return new Promise(resolve => {
                const extra = Math.floor(Math.random() * 3);
                const target = r.position + 10 + i * 5 + extra;
                const time = 2500 + i * 500;

                tweenTo(r, 'position', target, time, backout(0.5), null, () => {

                    r.position = Math.round(r.position);
                    if (i === reels.length - 1) {
                        reelsComplete();
                    }
                    resolve();
                });
            });
        });

        await Promise.all(spinPromises);
    }


    function reelsComplete() {
        isSpinning = false;
        console.log('Spin complete');
        if (checkWins()) {
            console.log('Winner!');
            animateWinningSymbols();
        }
    }

    function animateWinningSymbols() {
        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];
            const symbolIndex = Math.floor(reel.position) % reel.symbols.length;
            const symbol = reel.symbols[(symbolIndex + 1) % reel.symbols.length];

            const startTime = Date.now();
            const duration = 1000;
            const originalScale = symbol.scale.x;

            const tickerFn = () => {
                const elapsed = Date.now() - startTime;
                if (elapsed > duration) {
                    symbol.scale.set(originalScale);
                    app.ticker.remove(tickerFn);
                    return;
                }

                const progress = elapsed / duration;
                const scale = originalScale + Math.sin(progress * Math.PI) * 0.3;
                symbol.scale.set(scale);
            };

            app.ticker.add(tickerFn);
        }
    }

    function randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function updateReels() {
        for (const reel of reels) {
            reel.previousPosition = reel.position;

            if (reel.spinningSpeed) {
                reel.position += reel.spinningSpeed;
            }

            for (let j = 0; j < reel.symbols.length; j++) {
                const s = reel.symbols[j];
                const prevY = s.y;
                s.y = ((reel.position + j) % reel.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;

                if (s.y < 0 && prevY > SYMBOL_SIZE) {
                    s.text = randomItem(items);
                }
            }
        }
    }

    app.ticker.add(() => {
        updateReels();

        const now = Date.now();
        const remove = [];

        for (const t of tweening) {
            const phase = Math.min(1, (now - t.start) / t.time);
            t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }

        for (const t of remove) {
            tweening.splice(tweening.indexOf(t), 1);
        }
    });

    const tweening = [];

    function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
        const tween = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onchange,
            complete: oncomplete,
            start: Date.now()
        };

        tweening.push(tween);
        return tween;
    }

    function lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }

    function backout(amount) {
        return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
    }

    function checkWins() {
        const middleRow = 1;
        const symbols = [];

        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];
            const symbolIndex = Math.floor(reel.position) % reel.symbols.length;
            const symbol = reel.symbols[(symbolIndex + middleRow) % reel.symbols.length];
            symbols.push(symbol.text);
        }

        const allEqual = symbols.every(val => val === symbols[0]);

        if (allEqual) {
            createFireworks();
        }

        return allEqual;
    }

    function createFireworks() {
        const fireworksContainer = new Container();
        app.stage.addChild(fireworksContainer);
        const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
        const particleCount = 150;

        // Центр игрового поля
        const centerX = reelContainer.x + (REEL_WIDTH * NUM_REELS) / 2;
        const centerY = reelContainer.y + (SYMBOL_SIZE * NUM_ROWS) / 2;

        for (let i = 0; i < particleCount; i++) {
            const particle = new Graphics();
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.beginFill(color);
            particle.drawCircle(0, 0, Math.random() * 6 + 4); // больше радиус частиц
            particle.endFill();

            particle.x = centerX;
            particle.y = centerY;

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 10 + 6; // больше разлет
            const lifetime = Math.random() * 1000 + 1000;

            fireworksContainer.addChild(particle);

            const startTime = Date.now();

            const tickerFn = () => {
                const elapsed = Date.now() - startTime;
                if (elapsed > lifetime) {
                    fireworksContainer.removeChild(particle);
                    app.ticker.remove(tickerFn);
                    return;
                }

                const progress = elapsed / lifetime;
                particle.x += Math.cos(angle) * speed * (1 - progress);
                particle.y += Math.sin(angle) * speed * (1 - progress);
                particle.alpha = 1 - progress;
            };

            app.ticker.add(tickerFn);
        }

        setTimeout(() => {
            app.stage.removeChild(fireworksContainer);
        }, 2000);
    }



    function disableScroll() {
        document.body.style.overflow = 'hidden';
    }

    function enableScroll() {
        document.body.style.overflow = '';
    }

    async function fetchDelay() {
        try {
            const response = await fetch('http://slot-game/server/delay.php');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Delay from server:', data);
            return data.delay ?? 0;
        } catch (error) {
            console.error('Error fetching delay from server:', error);
            return 0;
        }
    }
    function showFloatingMessage(text, duration = 3000) {
        const message = new Text(text, new TextStyle({
            fontSize: 28,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            fontWeight: 'bold',
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowDistance: 2
        }));

        message.anchor.set(0.5);
        message.x = app.screen.width / 2;
        message.y = 60;
        message.alpha = 0;
        app.stage.addChild(message);

        const fadeInDuration = 500;
        const fadeOutDuration = 500;
        const visibleDuration = duration - fadeInDuration - fadeOutDuration;

        const startTime = Date.now();

        const tickerFn = () => {
            const elapsed = Date.now() - startTime;

            if (elapsed < fadeInDuration) {
                message.alpha = elapsed / fadeInDuration;
            } else if (elapsed < fadeInDuration + visibleDuration) {
                message.alpha = 1;
            } else if (elapsed < duration) {
                message.alpha = 1 - (elapsed - fadeInDuration - visibleDuration) / fadeOutDuration;
            } else {
                app.ticker.remove(tickerFn);
                app.stage.removeChild(message);
            }

            message.y -= 0.3;
        };

        app.ticker.add(tickerFn);
    }


}
