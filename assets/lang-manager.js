document.addEventListener('DOMContentLoaded', () => {
    const langBtns = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('nsp-lang') || 'en';

    // 初期言語の設定
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

        // ボタンのactive表示を更新
        document.querySelectorAll('.lang-btn').forEach(b => {
            if (b.getAttribute('data-lang') === lang) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
    }
});
