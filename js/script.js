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
        
        // Remove ripple after animation
        setTimeout(() => {
            if (circle.parentNode === button) {
                circle.remove();
            }
        }, 600);
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
        this.smoothScroller = new SmoothScroller();
        this.init();
    }

    init() {
        this.setupNavbar();
        this.setupMenuFilter();
        this.setupForms();
        this.setupBackToTop();
        this.setupScrollAnimations();
        this.setupAddToCart();
        this.updateCartCountOnLoad();
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
                if (window.pageYOffset > 8700) {
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

    setupAddToCart() {
        document.querySelectorAll('.btn-add-cart').forEach(button => {
            // Hapus event listener lama jika ada
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const menuItem = newButton.closest('.menu-item');
                if (!menuItem) return;
                
                const serviceName = newButton.getAttribute('data-service') || menuItem.querySelector('h3').textContent;
                const priceOptions = newButton.getAttribute('data-price-options');
                
                // Jika ada price options, tampilkan modal pilihan ukuran
                if (priceOptions) {
                    this.showSizeSelectionModal(serviceName, priceOptions, newButton);
                } else {
                    // Untuk layanan tanpa pilihan ukuran (kg-based)
                    const priceText = menuItem.querySelector('.item-price').textContent;
                    const serviceCategory = menuItem.getAttribute('data-category');
                    const servicePrice = this.extractPrice(priceText);
                    
                    this.addToCart({
                        id: Date.now(),
                        name: serviceName,
                        price: servicePrice,
                        quantity: 1,
                        category: serviceCategory,
                        unit: 'kg'
                    });
                    
                    this.updateCartCount();
                    this.showCartNotification(serviceName);
                    this.hoverEffects.createRipple(e);
                }
            });
        });
    }

    showSizeSelectionModal(serviceName, priceOptionsString, button) {
    const priceOptions = JSON.parse(priceOptionsString);
    const minPrice = priceOptions.min;
    const maxPrice = priceOptions.max;
    const basePrice = priceOptions.harga || minPrice;
    
    // Simpan reference ke app instance
    const app = this;
    
    const modal = document.createElement('div');
    modal.className = 'size-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3 class="modal-title">${serviceName}</h3>
            
            <div class="price-range-info">
                <p><strong>Harga:</strong> Rp ${this.formatNumber(minPrice)} - Rp ${this.formatNumber(maxPrice)}</p>
                <p class="note">*Harga final akan ditentukan saat penjemputan berdasarkan ukuran & kondisi</p>
            </div>
            
            <div class="quantity-selector">
                <button class="qty-btn minus" type="button">-</button>
                <span class="qty-value">1</span>
                <button class="qty-btn plus" type="button">+</button>
                <span class="unit">${serviceName.includes('Jas') ? 'set' : 'biji'}</span>
            </div>
            
            <div class="estimated-price">
                <p>Estimasi harga: <strong>Rp ${this.formatNumber(basePrice)}</strong></p>
                <small>(Harga per ${serviceName.includes('Jas') ? 'set' : 'biji'})</small>
            </div>
            
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" id="cancelSizeBtn">Batal</button>
                <button type="button" class="btn btn-primary" id="confirmSizeBtn">Tambah ke Keranjang</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Quantity control
    let quantity = 1;
    
    modal.querySelector('.qty-btn.minus').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            modal.querySelector('.qty-value').textContent = quantity;
            updateEstimatedPrice();
        }
    });
    
    modal.querySelector('.qty-btn.plus').addEventListener('click', () => {
        quantity++;
        modal.querySelector('.qty-value').textContent = quantity;
        updateEstimatedPrice();
    });
    
    // Function to update estimated price
    function updateEstimatedPrice() {
        const estimatedPrice = basePrice * quantity;
        modal.querySelector('.estimated-price strong').textContent = `Rp ${app.formatNumber(estimatedPrice)}`;
    }
    
    // CONFIRM BUTTON - FIXED
    modal.querySelector('#confirmSizeBtn').addEventListener('click', function() {
        const menuItem = button.closest('.menu-item');
        const serviceCategory = menuItem.getAttribute('data-category');
        const unit = serviceName.includes('Jas') ? 'set' : 'biji';
        
        app.addToCart({
            id: Date.now(),
            name: serviceName,
            price: basePrice,
            quantity: quantity,
            category: serviceCategory,
            unit: unit,
            priceRange: `${minPrice}-${maxPrice}`,
            note: `Harga final: Rp ${minPrice} - ${maxPrice} per ${unit}`
        });
        
        app.updateCartCount();
        app.showCartNotification(`${serviceName} (${quantity} ${unit})`);
        
        // Close modal
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 300);
    });
    
    // CANCEL BUTTON - FIXED
    modal.querySelector('#cancelSizeBtn').addEventListener('click', function() {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 300);
    });
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 300);
        }
    });
}

    getSizeName(sizeKey) {
        const sizeNames = {
            'single_double': 'Single/Double',
            'queen_king': 'Queen/King',
            'standar': 'Standar',
            'premium': 'Premium'
        };
        return sizeNames[sizeKey] || sizeKey;
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    extractPrice(priceText) {
        // Hapus simbol mata uang, titik, dan karakter non-numerik
        const cleanText = priceText
            .replace('Rp', '')
            .replace(/\./g, '')
            .replace('/kg', '')
            .replace('/pcs', '')
            .replace('/bulan', '')
            .replace(/\s+/g, '')
            .trim();
        
        return parseInt(cleanText) || 0;
    }

    addToCart(item) {
        let cart = JSON.parse(localStorage.getItem('mojangLaundryCart') || '[]');
        
        // Cek apakah item sudah ada (bandingkan berdasarkan nama dan kategori dan size)
        const existingIndex = cart.findIndex(cartItem => 
            cartItem.name === item.name && 
            cartItem.category === item.category &&
            cartItem.size === item.size
        );
        
        if (existingIndex !== -1) {
            // Update kuantitas jika sudah ada
            cart[existingIndex].quantity += item.quantity;
        } else {
            // Tambah item baru
            cart.push(item);
        }
        
        // Simpan ke localStorage
        localStorage.setItem('mojangLaundryCart', JSON.stringify(cart));
        
        // Dispatch custom event untuk komponen lain
        this.dispatchCartUpdateEvent(cart);
    }

    dispatchCartUpdateEvent(cart) {
        const event = new CustomEvent('cartUpdated', { 
            detail: { cart: cart } 
        });
        window.dispatchEvent(event);
    }

    updateCartCountOnLoad() {
        // Update cart count saat pertama kali load
        this.updateCartCount();
        
        // Listen untuk cart updates dari komponen lain
        window.addEventListener('cartUpdated', () => {
            this.updateCartCount();
        });
        
        // Juga listen untuk storage changes (jika di tab lain)
        window.addEventListener('storage', (e) => {
            if (e.key === 'mojangLaundryCart') {
                this.updateCartCount();
            }
        });
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('mojangLaundryCart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update floating checkout button
        const checkoutBtn = document.getElementById('floatingCheckoutBtn');
        if (checkoutBtn) {
            // Buat elemen baru
            const icon = document.createElement('i');
            icon.className = 'fas fa-shopping-cart';
            
            const span = document.createElement('span');
            if (totalItems > 0) {
                span.textContent = totalItems;
            } else {
                span.textContent = 'Checkout';
            }
            
            // Style span
            span.style.cssText = `
                font-size: 11px;
                font-weight: 600;
                margin-top: 2px;
            `;
            
            // Clear dan rebuild button content
            checkoutBtn.innerHTML = '';
            checkoutBtn.appendChild(icon);
            checkoutBtn.appendChild(span);
        }
    }

    showCartNotification(serviceName) {
        // Hapus notifikasi yang sudah ada jika ada
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Buat notifikasi baru
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${serviceName} ditambahkan ke keranjang!</span>
        `;
        
        // Tambah styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            animation: slideInRight 0.3s ease forwards;
            font-size: 14px;
            max-width: 350px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        `;
        
        // Tambah animation styles
        if (!document.querySelector('#cart-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'cart-notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto hapus setelah 3 detik
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    
    // Setup checkout button event listener
    const checkoutBtn = document.getElementById('floatingCheckoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('mojangLaundryCart') || '[]');
            
            if (cart.length > 0) {
                // Redirect to checkout page
                window.location.href = 'checkout/index.html';
            } else {
                // Scroll to contact section if cart is empty
                const contactSection = document.getElementById('kontak');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    console.log("MOJANG LAUNDRY website loaded successfully!");
});