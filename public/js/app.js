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

    const contactFormEl = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const heroEl = document.getElementById('hero-section');
    const headerEl = document.getElementById('header');
    const upArrowEl = document.getElementById('up-arrow-container');
    const upArrowPaths = document.querySelectorAll('#up-arrow-path');

    const THEME = {
        dark: {
            clsReplacer: ['dark', 'light'],
            imgReplacer: [heroDarkImgEl, heroLightImgEl],
            stroke: '#200E32',
            to: 'light',
        },
        light: {
            clsReplacer: ['light', 'dark'],
            imgReplacer: [heroLightImgEl, heroDarkImgEl],
            stroke: '#FFFFFF',
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
        upArrowPaths.forEach((e) => {
            e.setAttribute('stroke', theme.stroke);
        });
    };

    const onSwitchTheme = () => {
        const key = htmlEl.classList[0];
        setTheme(key);
        setSavedTheme(key);
    };

    const onContactSubmission = async (e) => {
        e.preventDefault();
        const valid = contactFormEl.checkValidity();
        if (valid) {
            const ctx = {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value,
                utc: Date.now(),
            };
            // start button spinner
            await fetch('https://christian.lindeneg.org/api/cl-software', {
                method: 'POST',
                body: JSON.stringify(ctx),
            });
            // end button spinner
        } else {
            contactFormEl.reportValidity();
        }
    };

    const onScrollToTopIntersect = (ctx) => {
        if (ctx.length <= 0) return;
        if (ctx[0].isIntersecting) {
            upArrowEl.classList.add('hide');
        } else {
            upArrowEl.classList.remove('hide');
        }
    };

    const setupScrollIntersect = () => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.7,
        };
        const observer = new IntersectionObserver(onScrollToTopIntersect, options);
        observer.observe(heroEl);
    };

    const setupListeners = () => {
        upArrowEl.addEventListener('click', () => scrollIntoView(headerEl));
        switchThemeBtnEl.addEventListener('click', onSwitchTheme);
        submitBtn.addEventListener('click', onContactSubmission);
        learnMoreBtn.addEventListener('click', () => scrollIntoView(learnMoreEl));
        contactBtns.forEach((b) => {
            b.addEventListener('click', () => scrollIntoView(contactEl));
        });
    };

    const initialize = () => {
        setTheme(getSavedTheme());
        setupListeners();
        setupScrollIntersect();
    };

    initialize();
})();
