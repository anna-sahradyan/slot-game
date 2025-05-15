import {initSlotGame} from "./game.js";

export function mainContainer() {
    "use strict";
    const main = document.createElement('div');
    main.className = ('main')
    main.innerHTML = `
    <section class="section__top">
    <nav class="main__nav">
    <ul class="main__list">
    <li class="main__list-item"><a href="#">home &nbsp;/</a></li>
    <li class="main__list-item"><a href="#">PG Soft &nbsp;/</a></li>
    <li class="main__list-item"><a href="#">fortune tiger (PG Soft) </a></li>
</ul>
</nav>
<h1 class="main__title">Home/PG Soft/Fortune Tiger (PG Soft)
Fortune Tiger Slot Review & Free Demo</h1>
<p class="main__text">Fortune Tiger slot is a medium volatile Asian game from PG Soft, and it plays out on a mobile-friendly 3x3 grid with 5 paylines. All full grid wins are boosted by an x10 win multiplier, and you get a random Fortune Tiger Streak Respins feature as well. This can eventually lead to a boosted full screen win that tops out at 500x your stake, and the overall max win is 2,500x your stake. You can check our full review below the free Fortune Tiger demo game.</p>
</section>  
<section class="main_center">
<div class="main__game__box">
<div class="main__game"></div>
<button class="slot-spin-btn-custom">
      <span class="spinner-icon">
      </span>
    </button>
</div>
</section>
<section class="main__bottom">
 <div class="main__star">
        ${Array(5).fill().map(() => `
        <span class="star">
                    <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path class="star-path" d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-6.91-.61L12 2 9.91 8.63 3 9.24l5.46 4.73L5.82 21z" fill="white"/>
                    </svg>
                </span>
        `).join('')}
         <span class="main__rating">User Rating: 8.4/10 (16 votes)</span>
    </div>
   
    <button class="main__btn"><img src="/images/message.svg" alt="message" width="16" height="16">write a comment</button>
</section>
 
    `;
    const stars = main.querySelectorAll('.star-icon');
    let currentRating = parseInt(localStorage.getItem('TigerRating')) || 0;
    stars.forEach((star, i) => {
        const path = star.querySelector('.star-path');
        path.setAttribute('fill', i < currentRating ? 'gold' : 'white');
    });

    stars.forEach((star, index) => {
        const path = star.querySelector('.star-path');

        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
                const p = s.querySelector('.star-path');
                p.setAttribute('fill', i <= index ? 'gold' : 'white');
            });
        });

        star.addEventListener('mouseleave', () => {
            stars.forEach((s, i) => {
                const p = s.querySelector('.star-path');
                p.setAttribute('fill', i < currentRating ? 'gold' : 'white');
            });
        });

        star.addEventListener('click', () => {
            if (currentRating === index + 1) {
                currentRating = 0;
                localStorage.removeItem('TigerRating');
            } else {
                currentRating = index + 1;
                localStorage.setItem('TigerRating', currentRating);
            }

            stars.forEach((s, i) => {
                const p = s.querySelector('.star-path');
                p.setAttribute('fill', i < currentRating ? 'gold' : 'white');
            });
        });
    });

    requestAnimationFrame(() => {
        const gameContainer = main.querySelector('.main__game');
        const spinButton = main.querySelector('.slot-spin-btn-custom');
        if (gameContainer && spinButton) {
            initSlotGame(gameContainer, spinButton);
        }
    });
    return main;
}

