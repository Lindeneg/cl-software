(() => {
    const htmlEl = document.getElementsByTagName("html")[0];

    const learnMoreEl = document.getElementById("learn-more");
    const contactEl = document.getElementById("contact");

    const learnMoreBtn = document.getElementById("learn-more-btn");
    const submitBtn = document.getElementById("submit-btn");
    const contactBtns = document.querySelectorAll("#contact-btn");

    const switchThemeBtnEl = document.getElementById("switch-theme-btn");
    const heroDarkImgEl = document.getElementById("hero-img-dark");
    const heroLightImgEl = document.getElementById("hero-img-light");

    const contactFormEl = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    const heroEl = document.getElementById("hero-section");
    const headerEl = document.getElementById("header");
    const upArrowEl = document.getElementById("up-arrow-container");
    const upArrowPaths = document.querySelectorAll("#up-arrow-path");

    const spinnerSvg = document.getElementById("spinner");
    const contactBtnText = document.getElementById("contact-text");
    const submitFeedbackEl = document.getElementById("submit-feedback");

    const THEME = {
        light: {
            clsReplacer: ["dark", "light"],
            imgReplacer: [heroDarkImgEl, heroLightImgEl],
            stroke: "#200E32",
        },
        dark: {
            clsReplacer: ["light", "dark"],
            imgReplacer: [heroLightImgEl, heroDarkImgEl],
            stroke: "#FFFFFF",
        },
    };

    const scrollIntoView = (el) => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const getSavedTheme = () => {
        try {
            return window.localStorage.getItem("theme") || "dark";
        } catch (err) {
            // silent catch
        }
        return "dark";
    };

    const setSavedTheme = (theme) => {
        try {
            window.localStorage.setItem("theme", theme);
        } catch (err) {
            // silent catch
        }
    };

    const setTheme = (key) => {
        const theme = THEME[key];
        htmlEl.classList.replace(...theme.clsReplacer);
        theme.imgReplacer[0].classList.add("hidden");
        theme.imgReplacer[1].classList.remove("hidden");
        upArrowPaths.forEach((e) => {
            e.setAttribute("stroke", theme.stroke);
        });
    };

    const onSwitchTheme = () => {
        const key = htmlEl.classList[0];
        let t = key === "light" ? "dark" : "light";
        setTheme(t);
        setSavedTheme(t);
    };

    const disableContactButton = () => {
        submitBtn.classList.replace("cursor-pointer", "cursor-not-allowed");
        submitBtn.setAttribute("disabled", true);
        spinnerSvg.classList.remove("hidden");
        contactBtnText.innerText = "Sending...";
    };

    const enableContactButton = () => {
        submitBtn.classList.replace("cursor-not-allowed", "cursor-pointer");
        submitBtn.removeAttribute("disabled");
        spinnerSvg.classList.add("hidden");
        contactBtnText.innerText = "Send Message";
    };

    const onContactSubmission = async (e) => {
        e.preventDefault();
        const valid = contactFormEl.checkValidity();
        if (valid) {
            disableContactButton();
            let success = true;
            try {
                await fetch("https://christian.lindeneg.org/api/cl-software", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: nameInput.value,
                        email: emailInput.value,
                        message: messageInput.value,
                    }),
                });
            } catch (err) {
                success = false;
            }
            submitBtn.classList.add("hidden");
            if (success) {
                submitFeedbackEl.innerText =
                    "Message received! I'll return ASAP.";
                submitFeedbackEl.classList.remove("text-red-500");
                submitFeedbackEl.classList.add("text-green-500");
            } else {
                submitFeedbackEl.innerText =
                    "An error occurred. Please try again later.";
                submitFeedbackEl.classList.remove("text-green-500");
                submitFeedbackEl.classList.add("text-red-500");
            }
            submitFeedbackEl.classList.remove("hidden");
            setTimeout(() => {
                submitFeedbackEl.classList.add("hidden");
                enableContactButton();
                submitBtn.classList.remove("hidden");
            }, 5000);
        } else {
            contactFormEl.reportValidity();
        }
    };

    const onScrollToTopIntersect = (ctx) => {
        if (ctx.length <= 0) return;
        if (ctx[0].isIntersecting) {
            upArrowEl.classList.add("hide");
        } else {
            upArrowEl.classList.remove("hide");
        }
    };

    const setupScrollIntersect = () => {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.7,
        };
        const observer = new IntersectionObserver(
            onScrollToTopIntersect,
            options
        );
        observer.observe(heroEl);
    };

    const setupListeners = () => {
        upArrowEl.addEventListener("click", () => scrollIntoView(headerEl));
        switchThemeBtnEl.addEventListener("click", onSwitchTheme);
        submitBtn.addEventListener("click", onContactSubmission);
        learnMoreBtn.addEventListener("click", () =>
            scrollIntoView(learnMoreEl)
        );
        contactBtns.forEach((b) => {
            b.addEventListener("click", () => scrollIntoView(contactEl));
        });
    };

    const initialize = () => {
        setTheme(getSavedTheme());
        setupListeners();
        setupScrollIntersect();
    };

    initialize();
})();
