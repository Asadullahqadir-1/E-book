/**
 * ============================================
 * PROCRASTINATION EBOOK LANDING PAGE
 * Production-Ready JavaScript
 * ============================================
 */

// ============================================
// CONFIGURATION
// ============================================
// Replace this with your Google Apps Script webhook URL
// See README for instructions on creating the Google Apps Script
const GOOGLE_SCRIPT_URL = "PASTE_WEBHOOK_URL_HERE";

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================
// DOM ELEMENTS
// ============================================
const form = document.getElementById('captureForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const honeypotInput = document.getElementById('honeypot');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitLoader = document.getElementById('submitLoader');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Validates the full contact name
 * @param {string} name - The name to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
function validateName(name) {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
        return { isValid: false, error: 'Name is required' };
    }
    
    if (trimmedName.length < 2) {
        return { isValid: false, error: 'Name must be at least 2 characters' };
    }
    
    if (trimmedName.length > 100) {
        return { isValid: false, error: 'Name must be less than 100 characters' };
    }
    
    return { isValid: true, error: '' };
}

/**
 * Validates email address
 * @param {string} email - The email to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
function validateEmail(email) {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
        return { isValid: false, error: 'Email is required' };
    }
    
    if (!EMAIL_REGEX.test(trimmedEmail)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    if (trimmedEmail.length > 254) {
        return { isValid: false, error: 'Email is too long' };
    }
    
    return { isValid: true, error: '' };
}

/**
 * Checks if honeypot field has been filled (spam indicator)
 * @returns {boolean} - true if honeypot is filled (spam), false if empty (legitimate)
 */
function isSpam() {
    return honeypotInput.value.length > 0;
}

/**
 * Display inline validation error for a field
 * @param {element} errorElement - The error span element
 * @param {string} message - The error message
 */
function showFieldError(errorElement, message) {
    if (message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    } else {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Display form-level error message
 * @param {string} message - The error message
 */
function showErrorMessage(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}

/**
 * Display form-level success message
 */
function showSuccessMessage() {
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

/**
 * Hide all form messages
 */
function hideMessages() {
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

// ============================================
// REAL-TIME VALIDATION (on blur events)
// ============================================

nameInput.addEventListener('blur', function() {
    const validation = validateName(this.value);
    showFieldError(nameError, validation.error);
});

emailInput.addEventListener('blur', function() {
    const validation = validateEmail(this.value);
    showFieldError(emailError, validation.error);
});

// ============================================
// FORM SUBMISSION
// ============================================

/**
 * Download the ebook PDF
 * Simulates a download by creating a temporary link
 */
function downloadEbook() {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = '/ebook.pdf';
    link.download = 'Overcome_Procrastination_Guide.pdf';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Submits form data to Google Sheets via webhook
 * @param {object} data - The data to submit { name, email, timestamp }
 * @returns {promise} - Promise that resolves with response
 */
async function submitToGoogleSheets(data) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script requires no-cors mode
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        // Note: With no-cors mode, we can't read the response
        // We assume success if the fetch completes without throwing
        return { success: true };
        
    } catch (error) {
        console.error('Submission error:', error);
        return { 
            success: false, 
            error: 'Failed to process your request. Please try again.' 
        };
    }
}

/**
 * Handle form submission
 * Validates inputs, sends to Google Sheets, triggers download
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Hide previous messages
    hideMessages();
    
    // Check for spam (honeypot)
    if (isSpam()) {
        console.warn('Honeypot field was filled - likely spam');
        // Silently fail to avoid revealing spam detection
        showSuccessMessage();
        resetForm();
        return;
    }
    
    // Validate name
    const nameValidation = validateName(nameInput.value);
    if (!nameValidation.isValid) {
        showFieldError(nameError, nameValidation.error);
        return;
    }
    
    // Validate email
    const emailValidation = validateEmail(emailInput.value);
    if (!emailValidation.isValid) {
        showFieldError(emailError, emailValidation.error);
        return;
    }
    
    // Clear field-level errors
    showFieldError(nameError, '');
    showFieldError(emailError, '');
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoader.style.display = 'inline';
    
    // Prepare data for submission
    const submissionData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim().toLowerCase(),
        timestamp: new Date().toISOString()
    };
    
    // Submit to Google Sheets
    const result = await submitToGoogleSheets(submissionData);
    
    if (result.success) {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        resetForm();
        
        // Trigger PDF download after short delay
        setTimeout(() => {
            downloadEbook();
        }, 500);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    } else {
        // Show error message
        showErrorMessage(result.error);
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoader.style.display = 'none';
    }
}

/**
 * Reset form to initial state
 */
function resetForm() {
    form.reset();
    nameInput.value = '';
    emailInput.value = '';
    honeypotInput.value = '';
    
    // Re-enable button after delay
    setTimeout(() => {
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoader.style.display = 'none';
    }, 2000);
}
// ============================================
// EVENT LISTENERS
// ============================================
form.addEventListener('submit', handleFormSubmit);

// ============================================
// INITIALIZATION
// ============================================

/**
 * Check if Google Script URL is configured
 */
function checkConfiguration() {
    if (GOOGLE_SCRIPT_URL === "PASTE_WEBHOOK_URL_HERE") {
        console.warn(
            '%cWarning: Google Apps Script URL not configured!',
            'color: orange; font-weight: bold;'
        );
        console.warn(
            'Please replace GOOGLE_SCRIPT_URL in script.js with your webhook URL.\n' +
            'See README.md for setup instructions.'
        );
    } else {
        console.log(
            '%cGoogle Apps Script configured ✓',
            'color: green; font-weight: bold;'
        );
    }
}

// Run checks when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    checkConfiguration();
    
    // Focus management for accessibility
    nameInput.focus();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize parallax effects
    initParallaxEffect();
    
    // Setup smooth scroll for anchor links
    smoothScrollToAnchor();
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Analytics placeholder - extend as needed
 * Logs form interactions for monitoring
 */
function trackEvent(eventName, eventData = {}) {
    // Replace with your analytics service (Google Analytics, Plausible, etc.)
    console.log('Event:', eventName, eventData);
}

// Track form focus
form.addEventListener('focusin', function() {
    trackEvent('form_focused');
});

// Track form submission attempts
form.addEventListener('submit', function() {
    trackEvent('form_submitted');
});

// ============================================
// SCROLL ANIMATION SYSTEM
// ============================================

/**
 * Intersection Observer for scroll-triggered animations
 * Elements fade in and slide up as they become visible
 */
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Element is visible in viewport
            entry.target.classList.add('is-visible');
            
            // Optional: unobserve after animation completes
            animationObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: '50px' // Start animation 50px before element is visible
});

/**
 * Apply scroll animations to sections and key elements
 */
function initScrollAnimations() {
    // Animate all benefit blocks
    document.querySelectorAll('.benefit-block').forEach((block, index) => {
        block.classList.add('reveal');
        block.style.transitionDelay = `${Math.min(index * 0.08, 0.32)}s`;
        animationObserver.observe(block);
    });
    
    // Animate form wrapper
    const formWrapper = document.querySelector('.form-wrapper');
    if (formWrapper) {
        formWrapper.classList.add('reveal');
        animationObserver.observe(formWrapper);
    }
    
    // Animate section titles
    document.querySelectorAll('.section-title').forEach(title => {
        title.classList.add('reveal');
        animationObserver.observe(title);
    });
    
    // Animate section subtitles
    document.querySelectorAll('.section-subtitle').forEach(subtitle => {
        subtitle.classList.add('reveal');
        animationObserver.observe(subtitle);
    });

    // Animate final CTA
    document.querySelectorAll('.cta-headline, .cta-subtitle').forEach((cta, index) => {
        cta.classList.add('reveal');
        cta.style.transitionDelay = `${Math.min(index * 0.12, 0.24)}s`;
        animationObserver.observe(cta);
    });
}

/**
 * Add parallax effect to background decorative elements
 */
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-orb');
        
        parallaxElements.forEach((elem) => {
            elem.style.transform = `translateY(${scrolled * 0.08}px)`;
        });
    }, { passive: true });
}

/**
 * Smooth scroll with offset for anchor links
 */
function smoothScrollToAnchor() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                trackEvent('scroll_to_section', { section: href });
            }
        });
    });
}
