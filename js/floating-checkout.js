// Floating Checkout Button
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('floatingCheckoutBtn');
    const scrollThreshold = 300;
    
    // Function untuk menampilkan/menyembunyikan button
    function toggleCheckoutButton() {
        if (!checkoutBtn) return;
        
        if (window.scrollY > scrollThreshold) {
            checkoutBtn.classList.add('show');
        } else {
            checkoutBtn.classList.remove('show');
        }
    }
    
    // Update cart count
    function updateCartCount() {
        if (!checkoutBtn) return;
        
        const cart = JSON.parse(localStorage.getItem('mojangLaundryCart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-shopping-cart';
        
        const span = document.createElement('span');
        span.textContent = totalItems > 0 ? totalItems : '';
        span.style.cssText = `
            font-size: 11px;
            font-weight: 600;
            margin-top: 2px;
        `;
        
        // Clear dan rebuild
        checkoutBtn.innerHTML = '';
        checkoutBtn.appendChild(icon);
        checkoutBtn.appendChild(span);
    }
    
    // Initial update
    updateCartCount();
    
    // Event listener untuk scroll
    window.addEventListener('scroll', toggleCheckoutButton);
    
    // Panggil sekali saat halaman load
    toggleCheckoutButton();
    
    // Listen for cart updates dari script.js
    window.addEventListener('cartUpdated', function() {
        updateCartCount();
    });
    
    // Juga listen untuk storage changes (jika di tab lain)
    window.addEventListener('storage', function(e) {
        if (e.key === 'mojangLaundryCart') {
            updateCartCount();
        }
    });
    
    // Aksi saat tombol diklik
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('mojangLaundryCart') || '[]');
            
            if (cart.length > 0) {
                // Redirect to checkout page
                window.location.href = 'checkout/index.html';
            } else {
                // Scroll to contact section if cart is empty
                const contactSection = document.getElementById('layanan');
                if (contactSection) {
                    contactSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
});