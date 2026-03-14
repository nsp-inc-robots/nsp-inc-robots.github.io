document.addEventListener('DOMContentLoaded', () => {
    const langBtns = document.querySelectorAll('.lang-btn');

    // Default language: Japanese (switch to EN via button)
    const savedLang = localStorage.getItem('nsp-lang');
    const defaultLang = 'jp';
    const currentLang = savedLang || defaultLang;

    updateLang(currentLang);

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            updateLang(lang);
        });
    });

    function updateLang(lang) {
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('nsp-lang', lang);

        document.querySelectorAll('.lang-btn').forEach(b => {
            if (b.getAttribute('data-lang') === lang) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
    }
});
