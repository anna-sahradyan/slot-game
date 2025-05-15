export function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <div class="footer__inner">
                     <div class="footer__nav"><nav>
             <ul class="footer__list" id="list">
             <li class="footer__list-item"><a href="#">games</a></li>
             <li class="footer__list-item"><a href="#">bonuses</a></li>
             <li class="footer__list-item"><a href="#">providers</a></li>
             <li class="footer__list-item"><a href="#">casino</a></li>
             <li class="footer__list-item"><a href="#">casino apps</a></li>
             <li class="footer__list-item"><a href="#">read</a></li>
             <li class="footer__list-item"><a href="#">payments</a></li>
             <li class="footer__list-item"><a href="#">🔥hot/cold slots</a></li>
             <li class="footer__list-item"><a href="#">🎁promo</a></li>
</ul>
</nav></div>
</div>  
      
    
    `;
    return footer
}
