document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    navLinks.forEach(link => link.addEventListener("click", () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    }));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') {
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const scrollElements = document.querySelectorAll(".animate-on-scroll");

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const elementOutOfView = (el) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop > (window.innerHeight || document.documentElement.clientHeight)
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add("visible");
    };


    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    handleScrollAnimation();
    window.addEventListener("scroll", handleScrollAnimation);

    const sections = document.querySelectorAll("main section[id]");
    function navHighlighter() {
        if (!sections.length) {
            return;
        }

        let scrollY = window.pageYOffset;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navbarHeight - 50;
            let sectionId = current.getAttribute("id");

            let navLinkForSection = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove("active"));
                if (navLinkForSection) {
                    navLinkForSection.classList.add("active");
                }
            } else {
                if (navLinkForSection) {
                    navLinkForSection.classList.remove("active");
                }
            }
        });
        if (scrollY < sections[0].offsetTop - navbarHeight - 50) {
            navLinks.forEach(link => link.classList.remove("active"));
            let homeLink = document.querySelector('.nav-menu a[href="#hero"]');
            if (homeLink) homeLink.classList.add("active");
        }
    }
    window.addEventListener("scroll", navHighlighter);
    navHighlighter();

});

document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('contextmenu', (e) => e.preventDefault());
    img.addEventListener('dragstart', (e) => e.preventDefault());
});

