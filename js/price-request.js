/**
 * Price Request Form Handler
 * Elixir Electronics
 * Captures customer details and sends price inquiry to sales team
 */
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        salesEmail: 'sales@elixirpasystem.in',
        formspreeEndpoint: 'https://formspree.io/f/xdkozpqv', // Replace with actual Formspree form ID
    };

    // Create and show the price request form
    function showPriceRequestForm(productName) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'price-request-overlay';
        overlay.innerHTML = `
            <div class="price-request-modal">
                <button class="modal-close" id="close-price-modal">&times;</button>
                <div class="price-request-header">
                    <div class="price-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <h3>Request Price Quote</h3>
                    <p>Get pricing for <strong>${productName}</strong></p>
                </div>
                <form id="price-request-form">
                    <input type="hidden" name="product" value="${productName}">
                    <input type="hidden" name="_subject" value="Price Request: ${productName}">
                    <div class="form-group">
                        <label for="price-name">Name *</label>
                        <input type="text" id="price-name" name="name" required placeholder="Your full name">
                    </div>
                    <div class="form-group">
                        <label for="price-email">Email *</label>
                        <input type="email" id="price-email" name="email" required placeholder="your@email.com">
                    </div>
                    <div class="form-group">
                        <label for="price-mobile">Mobile Number *</label>
                        <input type="tel" id="price-mobile" name="mobile" required placeholder="+91 98765 43210" pattern="[0-9+\\s-]{10,15}">
                    </div>
                    <div class="form-group">
                        <label for="price-company">Company</label>
                        <input type="text" id="price-company" name="company" placeholder="Your company name">
                    </div>
                    <div class="form-group">
                        <label for="price-quantity">Quantity Required</label>
                        <input type="number" id="price-quantity" name="quantity" placeholder="e.g., 10" min="1">
                    </div>
                    <div class="form-group">
                        <label for="price-message">Additional Requirements</label>
                        <textarea id="price-message" name="message" rows="3" placeholder="Any specific requirements or questions..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" id="submit-price-btn">
                            <span class="btn-text">Submit Request</span>
                            <span class="btn-loading" style="display:none;">Sending...</span>
                        </button>
                    </div>
                </form>
                <p class="privacy-note">Our sales team will contact you within 24 hours with pricing details. <a href="privacy.html">Privacy Policy</a></p>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.id = 'price-request-styles';
        styles.textContent = `
            #price-request-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 20px;
                animation: prFadeIn 0.3s ease;
                overflow-y: auto;
            }
            @keyframes prFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .price-request-modal {
                background: #fff;
                border-radius: 16px;
                max-width: 480px;
                width: 100%;
                padding: 32px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: prSlideUp 0.3s ease;
                position: relative;
                max-height: 90vh;
                overflow-y: auto;
            }
            @keyframes prSlideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .modal-close {
                position: absolute;
                top: 16px;
                right: 16px;
                background: none;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: #6c757d;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s;
            }
            .modal-close:hover {
                background: #f8f9fa;
                color: #1a1a2e;
            }
            .price-request-header {
                text-align: center;
                margin-bottom: 24px;
            }
            .price-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 16px;
            }
            .price-icon svg {
                width: 28px;
                height: 28px;
                stroke: white;
            }
            .price-request-header h3 {
                font-family: 'Playfair Display', Georgia, serif;
                font-size: 1.5rem;
                color: #0a3d62;
                margin: 0 0 8px;
            }
            .price-request-header p {
                color: #545b62;
                font-size: 14px;
                margin: 0;
            }
            .price-request-header strong {
                color: #0a3d62;
            }
            #price-request-form .form-group {
                margin-bottom: 16px;
            }
            #price-request-form label {
                display: block;
                font-size: 13px;
                font-weight: 600;
                color: #1a1a2e;
                margin-bottom: 6px;
            }
            #price-request-form input,
            #price-request-form textarea {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 15px;
                font-family: inherit;
                transition: border-color 0.3s, box-shadow 0.3s;
            }
            #price-request-form input:focus,
            #price-request-form textarea:focus {
                outline: none;
                border-color: #0a3d62;
                box-shadow: 0 0 0 3px rgba(10, 61, 98, 0.1);
            }
            #price-request-form input::placeholder,
            #price-request-form textarea::placeholder {
                color: #adb5bd;
            }
            #price-request-form textarea {
                resize: vertical;
                min-height: 80px;
            }
            .form-actions {
                margin-top: 24px;
            }
            .form-actions .btn {
                width: 100%;
                padding: 14px 24px;
                border: none;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                font-family: inherit;
                transition: all 0.3s;
            }
            .form-actions .btn-primary {
                background: #e67e22;
                color: #000;
            }
            .form-actions .btn-primary:hover {
                background: #d35400;
                transform: translateY(-2px);
            }
            .form-actions .btn-primary:disabled {
                background: #ccc;
                cursor: not-allowed;
                transform: none;
            }
            .privacy-note {
                font-size: 11px;
                color: #6c757d;
                text-align: center;
                margin: 16px 0 0;
                line-height: 1.5;
            }
            .privacy-note a {
                color: #0a3d62;
            }
            .success-message {
                text-align: center;
                padding: 40px 20px;
            }
            .success-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
            }
            .success-icon svg {
                width: 40px;
                height: 40px;
                stroke: white;
            }
            .success-message h3 {
                color: #27ae60;
                margin-bottom: 12px;
            }
            .success-message p {
                color: #545b62;
                margin-bottom: 20px;
            }
            @media (max-width: 480px) {
                .price-request-modal {
                    padding: 24px;
                    margin: 10px;
                }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Handle form submission
        const form = document.getElementById('price-request-form');
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-price-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';

            const formData = {
                product: productName,
                name: document.getElementById('price-name').value,
                email: document.getElementById('price-email').value,
                mobile: document.getElementById('price-mobile').value,
                company: document.getElementById('price-company').value || 'Not specified',
                quantity: document.getElementById('price-quantity').value || 'Not specified',
                message: document.getElementById('price-message').value || 'No additional requirements',
                timestamp: new Date().toISOString()
            };

            try {
                // Send to Formspree (or your backend)
                const response = await fetch(CONFIG.formspreeEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    showSuccessMessage(overlay, formData.name, productName);
                } else {
                    // Fallback to mailto if Formspree fails
                    sendViaMailto(formData);
                    showSuccessMessage(overlay, formData.name, productName);
                }
            } catch (error) {
                console.error('Form submission error:', error);
                // Fallback to mailto
                sendViaMailto(formData);
                showSuccessMessage(overlay, formData.name, productName);
            }
        });

        // Close handlers
        document.getElementById('close-price-modal').addEventListener('click', () => closeModal(overlay, styles));
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal(overlay, styles);
            }
        });

        // Focus first input
        setTimeout(() => document.getElementById('price-name').focus(), 100);
    }

    function showSuccessMessage(overlay, customerName, productName) {
        const modal = overlay.querySelector('.price-request-modal');
        modal.innerHTML = `
            <button class="modal-close" id="close-success-modal">&times;</button>
            <div class="success-message">
                <div class="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3>Request Submitted!</h3>
                <p>Thank you, <strong>${customerName}</strong>! Your price request for <strong>${productName}</strong> has been received. Our sales team will contact you within 24 hours.</p>
                <button class="btn btn-primary" id="close-success-btn" style="padding: 12px 32px; border: none; border-radius: 8px; background: #0a3d62; color: white; font-weight: 600; cursor: pointer;">Close</button>
            </div>
        `;

        const styles = document.getElementById('price-request-styles');
        document.getElementById('close-success-modal').addEventListener('click', () => closeModal(overlay, styles));
        document.getElementById('close-success-btn').addEventListener('click', () => closeModal(overlay, styles));
    }

    function sendViaMailto(data) {
        const subject = encodeURIComponent(`Price Request: ${data.product}`);
        const body = encodeURIComponent(
            `Price Request Details\n` +
            `=====================\n\n` +
            `Product: ${data.product}\n` +
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Mobile: ${data.mobile}\n` +
            `Company: ${data.company}\n` +
            `Quantity: ${data.quantity}\n\n` +
            `Additional Requirements:\n${data.message}\n\n` +
            `Submitted: ${new Date().toLocaleString()}`
        );

        // Open mailto link
        window.location.href = `mailto:${CONFIG.salesEmail}?subject=${subject}&body=${body}&cc=${data.email}`;
    }

    function closeModal(overlay, styles) {
        overlay.style.animation = 'prFadeOut 0.3s ease forwards';
        document.body.style.overflow = '';

        // Add fadeOut animation
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.textContent = '@keyframes prFadeOut { from { opacity: 1; } to { opacity: 0; } }';
        document.head.appendChild(fadeOutStyle);

        setTimeout(() => {
            overlay.remove();
            if (styles) styles.remove();
            fadeOutStyle.remove();
        }, 300);
    }

    // Initialize - attach click handlers to all "Ask for Price" buttons
    function init() {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.ask-price-btn');
            if (btn) {
                e.preventDefault();
                const productName = btn.getAttribute('data-product');
                if (productName) {
                    showPriceRequestForm(productName);
                }
            }
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
