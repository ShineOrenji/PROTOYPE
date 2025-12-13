// Enhanced Hover Effects Manager
class HoverEffectsManager {
    constructor() {
        this.init();
    }

    init() {
        this.addButtonHoverEffects();
        this.addCardHoverEffects();
    }

    addButtonHoverEffects() {
        const buttons = document.querySelectorAll('.btn, .btn-add-cart, .category-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createRipple(e);
            });
        });
    }

    addCardHoverEffects() {
        const cards = document.querySelectorAll('.menu-item, .testimonial-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.tiltCard(card, 3);
            });
            
            card.addEventListener('mouseleave', () => {
                this.tiltCard(card, 0);
            });
        });
    }

    createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    tiltCard(card, degree) {
        card.style.transform = `perspective(1000px) rotateX(${degree}deg) rotateY(${degree}deg) translateY(-12px) scale(1.02)`;
    }
}

// Counter Animation dengan tanda +
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => this.observer.observe(counter));
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                counter.textContent = target + '+';
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }
}

// Testimonials Carousel tanpa pause
class TestimonialsCarousel {
    constructor() {
        this.track = document.getElementById('testimonialsTrack');
        this.init();
    }

    init() {
        this.duplicateTestimonials();
        this.track.style.animationPlayState = 'running';
    }

    duplicateTestimonials() {
        const testimonials = this.track.innerHTML;
        this.track.innerHTML += testimonials;
    }
}

// Smooth Scrolling
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Main Application
class App {
    constructor() {
        this.hoverEffects = new HoverEffectsManager();
        this.counterAnimation = new CounterAnimation();
        this.testimonialsCarousel = new TestimonialsCarousel();
        this.smoothScroller = new SmoothScroller();
        this.init();
    }

    init() {
        this.setupNavbar();
        this.setupMenuFilter();
        this.setupForms();
        this.setupBackToTop();
        this.setupScrollAnimations();
        console.log('App initialized successfully');
    }

    setupNavbar() {
        const navbarToggle = document.querySelector(".navbar-toggle");
        const navbarMenu = document.querySelector(".navbar-menu");

        if (navbarToggle && navbarMenu) {
            navbarToggle.addEventListener("click", () => {
                navbarToggle.classList.toggle("active");
                navbarMenu.classList.toggle("active");
            });

            const navbarLinks = document.querySelectorAll(".navbar-menu a");
            navbarLinks.forEach(link => {
                link.addEventListener("click", () => {
                    navbarToggle.classList.remove("active");
                    navbarMenu.classList.remove("active");
                });
            });
        }

        window.addEventListener("scroll", () => {
            const navbar = document.querySelector(".navbar");
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add("scrolled");
                } else {
                    navbar.classList.remove("scrolled");
                }
            }
        });
    }

    setupMenuFilter() {
        const categoryBtns = document.querySelectorAll(".category-btn");
        const menuItems = document.querySelectorAll(".menu-item");

        categoryBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                categoryBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                const category = btn.getAttribute("data-category");
                
                menuItems.forEach(item => {
                    if (category === "all" || item.getAttribute("data-category") === category) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });
    }

    setupForms() {
        const messageForm = document.getElementById("messageForm");
        if (messageForm) {
            messageForm.addEventListener("submit", (e) => {
                e.preventDefault();
                alert("Terima kasih! Pesan Anda telah berhasil dikirim.");
                messageForm.reset();
            });
        }

        const newsletterForm = document.querySelector(".newsletter-form");
        if (newsletterForm) {
            newsletterForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector("input[type='email']");
                alert(`Terima kasih! Email ${emailInput.value} telah berhasil didaftarkan untuk newsletter.`);
                newsletterForm.reset();
            });
        }
    }

    setupBackToTop() {
        const backToTopButton = document.querySelector(".back-to-top");

        if (backToTopButton) {
            window.addEventListener("scroll", () => {
                if (window.pageYOffset > 300) {
                    backToTopButton.classList.add("visible");
                } else {
                    backToTopButton.classList.remove("visible");
                }
            });

            backToTopButton.addEventListener("click", () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll(".hero-content, .about-content, .menu-item, .testimonial-card, .contact-content > div");
        animatedElements.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(20px)";
            el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            observer.observe(el);
        });
    }
}

// Initialize the application when DOM is loaded

document.addEventListener('DOMContentLoaded', () => {
    new App();
    console.log("MOJANG LAUNDRY website loaded successfully!");
});