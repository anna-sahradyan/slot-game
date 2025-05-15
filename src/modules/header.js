
export function createHeader() {
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
             <div class="header__inner">
             <div class="header__top">
            <div class="header__logo">
        <a href="/">
            <img src="https://slotcatalog.com/img/logo-lang/slotcatalog-en-logo.webp" alt="Slot Catalog Logo">
        </a>
    </div>
      <form class="header__search" role="search">

        <input
                id="header-search"
                type="text"
                placeholder="Search for a Casino, Game or Developer"
                class="header__input"
        >
        <button class="header__button" type="submit" aria-label="Search">
            <img src="/src/assets/images/search.svg" alt="Search Icon" width="24" height="24">
        </button>
    </form>
     <div class="header__lang">
        <div class="header__lang-icon" role="button" aria-label="Compare">
            <img src="/src/assets/images/compare.png" alt="Compare" class="icon">
            <span class="header__spanCom" aria-live="polite">0</span>
        </div>
        <div class="header__lang-icon" role="button" aria-label="Language selection">
            <img src="/src/assets/images/flag.svg" alt="Language">
            <span class="icon__lan">[en]</span>
        </div>
        <div class="header__lang-icon" role="button" aria-label="Login">
            <img src="/src/assets/images/lock.svg" alt="Login">
        </div>
    </div>
</div>
             <div class="header__bottom"><nav>
             <ul class="header__list" id="list">
             <li class="header__list-item"><a href="#">games</a></li>
             <li class="header__list-item"><a href="#">bonuses</a></li>
             <li class="header__list-item"><a href="#">providers</a></li>
             <li class="header__list-item"><a href="#">casino</a></li>
             <li class="header__list-item"><a href="#">casino apps</a></li>
             <li class="header__list-item"><a href="#">read</a></li>
             <li class="header__list-item"><a href="#">payments</a></li>
             <li class="header__list-item"><a href="#">🔥hot/cold slots</a></li>
             <li class="header__list-item"><a href="#">🎁promo</a></li>
</ul>
</nav></div>
                   </div>
  `;
    return header;
}
document.addEventListener('DOMContentLoaded', () => {
    const listItems = document.querySelectorAll('.header__list-item');

    listItems.forEach(item => {
        item.addEventListener('click', () => {
            listItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
});
