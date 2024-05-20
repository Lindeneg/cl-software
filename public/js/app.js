(() => {
    const htmlEl = document.getElementsByTagName('html')[0];

    const learnMoreEl = document.getElementById('learn-more');
    const contactEl = document.getElementById('contact');

    const learnMoreBtn = document.getElementById('learn-more-btn');
    const submitBtn = document.getElementById('submit-btn');
    const contactBtns = document.querySelectorAll('#contact-btn');

    const switchThemeBtnEl = document.getElementById('switch-theme-btn');
    const heroDarkImgEl = document.getElementById('hero-img-dark');
    const heroLightImgEl = document.getElementById('hero-img-light');

    const THEME = {
        dark: {
            clsReplacer: ['dark', 'light'],
            imgReplacer: [heroDarkImgEl, heroLightImgEl],
            to: 'light',
        },
        light: {
            clsReplacer: ['light', 'dark'],
            imgReplacer: [heroLightImgEl, heroDarkImgEl],
            to: 'dark',
        },
    };

    const scrollIntoView = (el) => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const getSavedTheme = () => {
        try {
            return window.localStorage.getItem('theme') || 'dark';
        } catch (err) {
            // silent catch
        }
        return 'dark';
    };

    const setSavedTheme = (theme) => {
        try {
            window.localStorage.setItem('theme', theme);
        } catch (err) {
            // silent catch
        }
    };

    const setTheme = (key) => {
        const theme = THEME[key];
        htmlEl.classList.replace(...theme.clsReplacer);
        theme.imgReplacer[0].classList.add('hidden');
        theme.imgReplacer[1].classList.remove('hidden');
    };

    const onSwitchTheme = () => {
        const key = htmlEl.classList[0];
        setTheme(key);
        setSavedTheme(key);
    };

    const onContactSubmission = () => {
        console.log('submit message');
    };

    const initialize = () => {
        switchThemeBtnEl.addEventListener('click', onSwitchTheme);
        submitBtn.addEventListener('click', onContactSubmission);
        learnMoreBtn.addEventListener('click', () => scrollIntoView(learnMoreEl));
        contactBtns.forEach((b) => {
            b.addEventListener('click', () => scrollIntoView(contactEl));
        });
        setTheme(getSavedTheme());
    };

    initialize();
})();
