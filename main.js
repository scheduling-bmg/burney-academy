// Burney Academy - Main JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeForms();
    initializeModals();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isVisible = mobileMenu.style.display !== 'none';
            mobileMenu.style.display = isVisible ? 'none' : 'block';
            
            // Toggle hamburger icon
            const icon = mobileMenuBtn.querySelector('svg');
            if (icon) {
                icon.innerHTML = isVisible 
                    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />'
                    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
            }
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mobileMenu && mobileMenu.style.display !== 'none') {
                    mobileMenu.style.display = 'none';
                    const icon = mobileMenuBtn.querySelector('svg');
                    if (icon) {
                        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
                    }
                }
            }
        });
    });

    // Active nav link highlighting
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Animation initialization
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Form handling
function initializeForms() {
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                // Simulate form submission
                showLoading(contactForm);
                
                setTimeout(() => {
                    hideLoading(contactForm);
                    showSuccessModal('Thank you for your message! We\'ll get back to you within 24 hours.');
                    contactForm.reset();
                }, 2000);
            }
        });
    }

    // Newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletter-email').value;
            
            if (validateEmail(email)) {
                showLoading(newsletterForm);
                
                setTimeout(() => {
                    hideLoading(newsletterForm);
                    showSuccessModal('Welcome to our newsletter! You\'ll receive our latest updates and business tips.');
                    newsletterForm.reset();
                }, 1500);
            } else {
                showError('Please enter a valid email address.');
            }
        });
    }

    // Real-time form validation
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Form validation functions
function validateContactForm(data) {
    let isValid = true;
    
    if (!data['first-name'] || data['first-name'].trim().length < 2) {
        showFieldError('first-name', 'First name must be at least 2 characters');
        isValid = false;
    }
    
    if (!data['last-name'] || data['last-name'].trim().length < 2) {
        showFieldError('last-name', 'Last name must be at least 2 characters');
        isValid = false;
    }
    
    if (!validateEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    clearFieldError(field);
    
    switch (fieldName) {
        case 'first-name':
        case 'last-name':
            if (value.length < 2) {
                showFieldError(field.id, 'This field must be at least 2 characters');
                return false;
            }
            break;
            
        case 'email':
        case 'newsletter-email':
            if (!validateEmail(value)) {
                showFieldError(field.id, 'Please enter a valid email address');
                return false;
            }
            break;
    }
    
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('border-red-500');
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('border-red-500');
}

function showError(message) {
    // Create temporary error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Modal functionality
function initializeModals() {
    const enrollmentModal = document.getElementById('enrollment-modal');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const closeSuccessBtn = document.getElementById('close-success-modal');
    const contactUsBtn = document.getElementById('contact-us');
    const enrollBtns = document.querySelectorAll('.enroll-btn');

    // Open enrollment modal
    enrollBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            openModal(enrollmentModal);
        });
    });

    // Close modal handlers
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => closeModal(enrollmentModal));
    }
    
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => closeModal(successModal));
    }

    // Contact us button
    if (contactUsBtn) {
        contactUsBtn.addEventListener('click', function() {
            closeModal(enrollmentModal);
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Plan selection in modal
    const planBtns = document.querySelectorAll('.modal-plan-btn');
    planBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            planBtns.forEach(b => b.classList.remove('border-bmg-blue', 'bg-blue-50'));
            
            // Add active class to selected button
            this.classList.add('border-bmg-blue', 'bg-blue-50');
            
            const plan = this.getAttribute('data-plan');
            console.log(`Selected plan: ${plan}`);
        });
    });

    // Close modal when clicking outside
    [enrollmentModal, successModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal(enrollmentModal);
            closeModal(successModal);
        }
    });
}

function openModal(modal) {
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstInput = modal.querySelector('button, input, select, textarea');
        if (firstInput) {
            firstInput.focus();
        }
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function showSuccessModal(message) {
    const successModal = document.getElementById('success-modal');
    const messageElement = document.getElementById('success-message');
    
    if (messageElement) {
        messageElement.textContent = message;
    }
    
    openModal(successModal);
}

// Loading states
function showLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    }
}

function hideLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        
        // Restore original button text
        const formId = form.getAttribute('id');
        if (formId === 'contact-form') {
            submitBtn.textContent = 'Send Message';
        } else if (formId === 'newsletter-form') {
            submitBtn.textContent = 'Subscribe to Newsletter';
        }
    }
}

// Scroll effects
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const nav = document.querySelector('nav');
        
        // Add/remove shadow to navigation based on scroll
        if (nav) {
            if (scrolled > 50) {
                nav.classList.add('shadow-lg');
            } else {
                nav.classList.remove('shadow-lg');
            }
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intersection Observer for performance
function createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

// Performance monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        });
    }
}

// Initialize performance monitoring
logPerformance();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error reporting service
});

// Service worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}