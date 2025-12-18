// Checkout Page Functionality - COMPLETE FIX
document.addEventListener('DOMContentLoaded', function() {
    // Initialize checkout
    initCheckout();
});

function initCheckout() {
    // Get cart items from localStorage or URL parameters
    loadCartItems();
    
    // Setup form validation
    setupFormValidation();
    
    // Setup event listeners with improved selection
    setupEventListenersImproved();
    
    // Update order summary
    updateOrderSummary();
}

function loadCartItems() {
    // Try to get items from localStorage
    const savedItems = localStorage.getItem('mojangLaundryCart');
    let cartItems = [];
    
    if (savedItems) {
        cartItems = JSON.parse(savedItems);
    } else {
        // Try to get from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const service = urlParams.get('service');
        const price = urlParams.get('price');
        
        if (service && price) {
            cartItems = [{
                id: Date.now(),
                name: service,
                price: parseInt(price),
                quantity: 1,
                category: urlParams.get('category') || 'general'
            }];
        }
    }
    
    // If no items, show empty state
    if (cartItems.length === 0) {
        showEmptyState();
        return;
    }
    
    // Display items in summary
    displayCartItems(cartItems);
    
    // Save to localStorage for persistence
    localStorage.setItem('mojangLaundryCart', JSON.stringify(cartItems));
}

function displayCartItems(items) {
    const summaryItems = document.getElementById('summaryItems');
    summaryItems.innerHTML = '';
    
    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'summary-item';
        itemElement.innerHTML = `
            <div class="item-name">
                <h4>${item.name}</h4>
                <p>${getCategoryName(item.category)}</p>
                <div class="item-qty">
                    <button class="qty-btn minus" data-index="${index}">-</button>
                    <span class="qty-value">${item.quantity} kg</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <div class="item-price">Rp ${formatNumber(item.price * item.quantity)}</div>
        `;
        summaryItems.appendChild(itemElement);
    });
    
    // Add quantity button listeners
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });
}

function handleQuantityChange(e) {
    const index = parseInt(e.target.dataset.index);
    const isPlus = e.target.classList.contains('plus');
    const savedItems = JSON.parse(localStorage.getItem('mojangLaundryCart') || '[]');
    
    if (savedItems[index]) {
        if (isPlus) {
            savedItems[index].quantity += 1;
        } else {
            if (savedItems[index].quantity > 1) {
                savedItems[index].quantity -= 1;
            } else {
                // Remove item if quantity becomes 0
                savedItems.splice(index, 1);
            }
        }
        
        localStorage.setItem('mojangLaundryCart', JSON.stringify(savedItems));
        loadCartItems(); // Reload items
        updateOrderSummary();
    }
}

function showEmptyState() {
    const summaryItems = document.getElementById('summaryItems');
    summaryItems.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-shopping-cart"></i>
            <h4>Keranjang Kosong</h4>
            <p>Silakan pilih layanan terlebih dahulu</p>
            <a href="../index.html#layanan" class="btn btn-primary">
                <i class="fas fa-arrow-left"></i> Pilih Layanan
            </a>
        </div>
    `;
}

function setupFormValidation() {
    const form = document.getElementById('checkoutForm');
    const phoneInput = document.getElementById('telepon');
    
    // Phone number validation
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
            }
            e.target.value = value;
        });
    }
    
    // Date input - set minimum to today
    const pickupDate = document.getElementById('pickupDate');
    if (pickupDate) {
        const today = new Date().toISOString().split('T')[0];
        pickupDate.min = today;
        
        // Set default to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        pickupDate.value = tomorrow.toISOString().split('T')[0];
        
        // Style improvement
        pickupDate.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = '0 0 0 3px rgba(30, 144, 255, 0.2)';
        });
        
        pickupDate.addEventListener('blur', function() {
            this.style.borderColor = '#e0e0e0';
            this.style.boxShadow = 'none';
        });
    }
}

function setupEventListenersImproved() {
    // Delivery option selection - FIXED
    document.querySelectorAll('.delivery-option').forEach(option => {
        option.addEventListener('click', function(e) {
            // Jangan trigger jika klik di dalam input
            if (e.target.type === 'radio') return;
            
            const radio = this.querySelector('input[type="radio"]');
            const allOptions = document.querySelectorAll('.delivery-option');
            
            // Jika sudah selected, tidak melakukan apa-apa (one-way)
            if (this.classList.contains('selected')) {
                return; // Tidak bisa diselect lagi
            }
            
            // Hapus selected dari semua option
            allOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected ke option yang diklik
            this.classList.add('selected');
            
            // Check radio button
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
            
            // Add visual feedback
            addClickFeedback(this);
            
            // UPDATE ORDER SUMMARY ketika delivery berubah
            updateOrderSummary();
        });
        
        // Juga listen untuk radio button change
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    document.querySelectorAll('.delivery-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    option.classList.add('selected');
                    
                    // UPDATE ORDER SUMMARY ketika delivery berubah via radio
                    updateOrderSummary();
                }
            });
        }
    });
    
    // Payment option selection - FIXED
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function(e) {
            // Jangan trigger jika klik di dalam input
            if (e.target.type === 'radio') return;
            
            const radio = this.querySelector('input[type="radio"]');
            const allOptions = document.querySelectorAll('.payment-option');
            
            // Jika sudah selected, tidak melakukan apa-apa (one-way)
            if (this.classList.contains('selected')) {
                return; // Tidak bisa diselect lagi
            }
            
            // Hapus selected dari semua option
            allOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected ke option yang diklik
            this.classList.add('selected');
            
            // Check radio button
            if (radio) {
                radio.checked = true;
            }
            
            // Add visual feedback
            addClickFeedback(this);
        });
        
        // Juga listen untuk radio button change
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    document.querySelectorAll('.payment-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    option.classList.add('selected');
                }
            });
        }
    });
    
    // EXTRA: Listen for all delivery radio changes (double protection)
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                updateOrderSummary();
            }, 50);
        });
    });
    
    // Set initial selections
    setInitialSelections();
    
    // Back to home button
    const backToHomeBtn = document.getElementById('backToHome');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
    
    // Form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleOrderSubmission);
    }
}

function setInitialSelections() {
    // Set delivery option 1 as default selected
    const deliveryOption1 = document.querySelector('.delivery-option:nth-child(1)');
    if (deliveryOption1) {
        deliveryOption1.classList.add('selected');
        const radio1 = deliveryOption1.querySelector('input[type="radio"]');
        if (radio1) {
            radio1.checked = true;
        }
    }
    
    // Set payment option 1 as default selected
    const paymentOption1 = document.querySelector('.payment-option:nth-child(1)');
    if (paymentOption1) {
        paymentOption1.classList.add('selected');
        const radio1 = paymentOption1.querySelector('input[type="radio"]');
        if (radio1) {
            radio1.checked = true;
        }
    }
}

function addClickFeedback(element) {
    // Add ripple effect
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = 0;
    const y = 0;
    
    ripple.style.cssText = `
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        width: ${size}px;
        height: ${size}px;
        background: rgba(30, 144, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease;
        pointer-events: none;
    `;
    
    // Add animation if not exists
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode === element) {
            ripple.remove();
        }
    }, 600);
}

function updateOrderSummary() {
    const savedItems = JSON.parse(localStorage.getItem('mojangLaundryCart') || '[]');
    
    // Calculate subtotal
    let subtotal = 0;
    savedItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // Calculate delivery fee - FIXED LOGIC
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
    let isDelivery = false;
    let deliveryFee = 0;
    
    if (selectedDelivery) {
        isDelivery = selectedDelivery.value === 'delivery';
        deliveryFee = isDelivery ? 10000 : 0;
    }
    
    // Calculate total
    const total = subtotal + deliveryFee;
    
    // Update display
    const subtotalEl = document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('deliveryFee');
    const totalAmountEl = document.getElementById('totalAmount');
    
    if (subtotalEl) subtotalEl.textContent = `Rp ${formatNumber(subtotal)}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `Rp ${formatNumber(deliveryFee)}`;
    if (totalAmountEl) totalAmountEl.textContent = `Rp ${formatNumber(total)}`;
    
    // Update estimate time
    updateEstimateTime(savedItems, isDelivery);
}

function updateEstimateTime(items, isDelivery) {
    let estimate = '1-2 hari';
    
    // Simple logic for estimate based on items
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalQuantity <= 2) {
        estimate = isDelivery ? '24 jam' : '12-24 jam';
    } else if (totalQuantity <= 5) {
        estimate = isDelivery ? '2-3 hari' : '1-2 hari';
    } else {
        estimate = isDelivery ? '3-4 hari' : '2-3 hari';
    }
    
    const estimateTimeEl = document.getElementById('estimateTime');
    if (estimateTimeEl) estimateTimeEl.textContent = estimate;
}

function handleOrderSubmission(e) {
    e.preventDefault();
    
    // Validate terms agreement
    const termsCheckbox = document.getElementById('terms');
    const termsAgreed = termsCheckbox ? termsCheckbox.checked : false;
    if (!termsAgreed) {
        alert('Anda harus menyetujui Syarat & Ketentuan untuk melanjutkan.');
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const orderData = {
        customer: {
            name: formData.get('nama'),
            phone: formData.get('telepon'),
            email: formData.get('email'),
            address: formData.get('alamat'),
            notes: formData.get('catatan')
        },
        delivery: {
            method: formData.get('delivery'),
            date: formData.get('pickupDate')
        },
        payment: formData.get('payment'),
        items: JSON.parse(localStorage.getItem('mojangLaundryCart') || '[]'),
        orderDate: new Date().toISOString(),
        orderId: 'ML' + Date.now().toString().slice(-8)
    };
    
    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = orderData.delivery.method === 'delivery' ? 10000 : 0;
    const total = subtotal + deliveryFee;
    
    // Show loading state
    const submitBtn = document.getElementById('submitOrder');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Save order to localStorage
        const existingOrders = JSON.parse(localStorage.getItem('mojangLaundryOrders') || '[]');
        existingOrders.push(orderData);
        localStorage.setItem('mojangLaundryOrders', JSON.stringify(existingOrders));
        
        // Clear cart
        localStorage.removeItem('mojangLaundryCart');
        
        // Show success modal
        showSuccessModal(orderData, total);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function showSuccessModal(orderData, total) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">
                <i class="fas fa-check"></i>
            </div>
            <h3>Pesanan Berhasil!</h3>
            <p>Terima kasih telah memesan layanan Mojang Laundry. Pesanan Anda sedang diproses.</p>
            
            <div class="order-details">
                <h4>Detail Pesanan:</h4>
                <p><strong>ID Pesanan:</strong> ${orderData.orderId}</p>
                <p><strong>Nama:</strong> ${orderData.customer.name}</p>
                <p><strong>Telepon:</strong> ${orderData.customer.phone}</p>
                <p><strong>Total:</strong> Rp ${formatNumber(total)}</p>
                <p><strong>Metode:</strong> ${orderData.delivery.method === 'delivery' ? 'Antar Jemput' : 'Ambil Sendiri'}</p>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" id="printReceipt">
                    <i class="fas fa-print"></i> Cetak Nota
                </button>
                <button class="btn btn-primary" id="backToHomeModal">
                    <i class="fas fa-home"></i> Kembali ke Beranda
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal event listeners
    modal.querySelector('#printReceipt').addEventListener('click', function() {
        printReceipt(orderData, total);
    });
    
    modal.querySelector('#backToHomeModal').addEventListener('click', function() {
        window.location.href = '../index.html';
    });
    
    // Close modal on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            window.location.href = '../index.html';
        }
    });
}

function printReceipt(orderData, total) {
    const receiptWindow = window.open('', '_blank');
    const receiptContent = `
        <html>
        <head>
            <title>Nota Mojang Laundry</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #1E90FF; margin: 0; }
                .details { margin: 20px 0; }
                .items { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; }
                .footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Mojang Laundry</h1>
                <p>Kp. Sindang RT.10 / RW.03 Desa. Cijantung Kec. Sukatani Kab.Purwakarta</p>
                <p>Telp: (+62) 877-7649-8864</p>
            </div>
            
            <div class="details">
                <p><strong>ID Pesanan:</strong> ${orderData.orderId}</p>
                <p><strong>Tanggal:</strong> ${new Date(orderData.orderDate).toLocaleString('id-ID')}</p>
                <p><strong>Nama:</strong> ${orderData.customer.name}</p>
                <p><strong>Telepon:</strong> ${orderData.customer.phone}</p>
                <p><strong>Alamat:</strong> ${orderData.customer.address}</p>
            </div>
            
            <table class="items">
                <thead>
                    <tr>
                        <th>Layanan</th>
                        <th>Qty</th>
                        <th>Harga</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderData.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity} kg</td>
                            <td>Rp ${formatNumber(item.price)}</td>
                            <td>Rp ${formatNumber(item.price * item.quantity)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="total">
                <p>Total: Rp ${formatNumber(total)}</p>
                <p>Status: MENUNGGU KONFIRMASI</p>
            </div>
            
            <div class="footer">
                <p>Terima kasih telah menggunakan layanan Mojang Laundry</p>
                <p>* Simpan nota ini sebagai bukti transaksi</p>
            </div>
        </body>
        </html>
    `;
    
    receiptWindow.document.write(receiptContent);
    receiptWindow.document.close();
    receiptWindow.print();
}

// Helper functions
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getCategoryName(category) {
    const categories = {
        'cuci': 'Paket Express',
        'kering': 'Paket Reguler',
        'spesial': 'Paket Satuan',
        'general': 'Layanan Laundry'
    };
    return categories[category] || 'Layanan Laundry';
}