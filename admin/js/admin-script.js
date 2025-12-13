document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    // Update date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Initialize navigation
    initNavigation();
    
    // Add event listeners
    addEventListeners();
}

function updateDateTime() {
    const now = new Date();
    const optionsDate = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    document.getElementById('currentDate').textContent = 
        now.toLocaleDateString('id-ID', optionsDate);
    
    document.getElementById('currentTime').textContent = 
        now.toLocaleTimeString('id-ID');
}

function initNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    const pages = document.querySelectorAll('.page');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target page
            const targetPage = this.getAttribute('data-page');
            
            // Hide all pages
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            // Show target page
            document.getElementById(`${targetPage}-page`).classList.add('active');
        });
    });
}

function addEventListeners() {
    // Search functionality placeholder
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            // Placeholder untuk fitur pencarian
            showNotification('Fitur pencarian siap dihubungkan ke database');
        }
    });
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Dashboard siap digunakan. Hubungkan ke database untuk mulai mengelola data.');
    }, 1000);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--light);
        color: var(--dark);
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        border-left: 4px solid var(--info);
        max-width: 400px;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Penambahan CSS

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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

// EXPORT DEBUG LE

window.adminDashboard = {
    initDashboard,
    updateDateTime
};

console.log('Admin Dashboard (Tampilan Saja) loaded successfully!');