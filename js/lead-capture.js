/**
 * Lead Capture for Datasheet Downloads
 * Elixir Electronics
 */
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        storageKey: 'elixir_lead_captured',
        formEndpoint: 'https://formspree.io/f/elixirin2008@gmail.com', // Can be replaced with actual endpoint
        skipDuration: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    };

    // Check if lead was already captured or user skipped
    function shouldShowForm() {
        const stored = localStorage.getItem(CONFIG.storageKey);
        if (stored) {
            const data = JSON.parse(stored);
            if (data.captured || (data.skipped && Date.now() < data.skipExpiry)) {
                return false;
            }
        }
        return true;
    }

    // Save lead data or skip status
    function saveLead(data) {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
    }

    // Create and show the popup form
    function showLeadForm(downloadUrl, downloadName) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'lead-capture-overlay';
        overlay.innerHTML = `
            <div class="lead-capture-modal">
                <div class="lead-capture-header">
                    <h3>Download Datasheet</h3>
                    <p>Please share your details to download <strong>${downloadName}</strong></p>
                </div>
                <form id="lead-capture-form">
                    <div class="form-group">
                        <label for="lead-name">Name *</label>
                        <input type="text" id="lead-name" name="name" required placeholder="Your full name">
                    </div>
                    <div class="form-group">
                        <label for="lead-email">Email *</label>
                        <input type="email" id="lead-email" name="email" required placeholder="your@email.com">
                    </div>
                    <div class="form-group">
                        <label for="lead-mobile">Mobile</label>
                        <input type="tel" id="lead-mobile" name="mobile" placeholder="+91 98765 43210" pattern="[0-9+\\s-]{10,15}">
                    </div>
                    <div class="form-group">
                        <label for="lead-company">Company</label>
                        <input type="text" id="lead-company" name="company" placeholder="Your company name">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Download Now</button>
                        <button type="button" class="btn btn-skip" id="skip-lead-form">Skip for now</button>
                    </div>
                </form>
                <p class="privacy-note">Your information is secure and will only be used to send you relevant product information. <a href="privacy.html">Privacy Policy</a></p>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            #lead-capture-overlay {
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
                animation: fadeIn 0.3s ease;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .lead-capture-modal {
                background: #fff;
                border-radius: 16px;
                max-width: 450px;
                width: 100%;
                padding: 32px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .lead-capture-header {
                text-align: center;
                margin-bottom: 24px;
            }
            .lead-capture-header h3 {
                font-family: 'Playfair Display', Georgia, serif;
                font-size: 1.75rem;
                color: #0a3d62;
                margin: 0 0 8px;
            }
            .lead-capture-header p {
                color: #545b62;
                font-size: 14px;
                margin: 0;
            }
            .lead-capture-header strong {
                color: #0a3d62;
            }
            #lead-capture-form .form-group {
                margin-bottom: 16px;
            }
            #lead-capture-form label {
                display: block;
                font-size: 13px;
                font-weight: 600;
                color: #1a1a2e;
                margin-bottom: 6px;
            }
            #lead-capture-form input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 15px;
                font-family: inherit;
                transition: border-color 0.3s, box-shadow 0.3s;
            }
            #lead-capture-form input:focus {
                outline: none;
                border-color: #0a3d62;
                box-shadow: 0 0 0 3px rgba(10, 61, 98, 0.1);
            }
            #lead-capture-form input::placeholder {
                color: #adb5bd;
            }
            .form-actions {
                display: flex;
                gap: 12px;
                margin-top: 24px;
            }
            .form-actions .btn {
                flex: 1;
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
            .form-actions .btn-skip {
                background: #e9ecef;
                color: #545b62;
            }
            .form-actions .btn-skip:hover {
                background: #dee2e6;
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
            @media (max-width: 480px) {
                .lead-capture-modal {
                    padding: 24px;
                }
                .form-actions {
                    flex-direction: column;
                }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(overlay);

        // Handle form submission
        const form = document.getElementById('lead-capture-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const leadData = {
                name: document.getElementById('lead-name').value,
                email: document.getElementById('lead-email').value,
                mobile: document.getElementById('lead-mobile').value,
                company: document.getElementById('lead-company').value,
                downloadedFile: downloadName,
                timestamp: new Date().toISOString(),
                captured: true
            };

            // Send to backend (you can implement actual API call)
            sendLeadData(leadData);

            // Save to localStorage
            saveLead({ captured: true, data: leadData });

            // Close modal and proceed with download
            closeModal(overlay, styles);
            proceedWithDownload(downloadUrl);
        });

        // Handle skip
        document.getElementById('skip-lead-form').addEventListener('click', function() {
            saveLead({
                skipped: true,
                skipExpiry: Date.now() + CONFIG.skipDuration
            });
            closeModal(overlay, styles);
            proceedWithDownload(downloadUrl);
        });

        // Close on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal(overlay, styles);
            }
        });

        // Focus first input
        setTimeout(() => document.getElementById('lead-name').focus(), 100);
    }

    function closeModal(overlay, styles) {
        overlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            overlay.remove();
            styles.remove();
        }, 300);

        // Add fadeOut animation
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.textContent = '@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }';
        document.head.appendChild(fadeOutStyle);
        setTimeout(() => fadeOutStyle.remove(), 300);
    }

    function proceedWithDownload(url) {
        // Open in new tab or download
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function sendLeadData(data) {
        // Send to console for debugging
        console.log('Lead captured:', data);

        // You can implement actual API call here
        // For now, we'll store in localStorage for later retrieval
        const leads = JSON.parse(localStorage.getItem('elixir_leads') || '[]');
        leads.push(data);
        localStorage.setItem('elixir_leads', JSON.stringify(leads));

        // Example: Send to email via formspree or similar service
        // fetch(CONFIG.formEndpoint, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
    }

    // Get filename from URL
    function getFilenameFromUrl(url) {
        const path = url.split('/').pop();
        return decodeURIComponent(path.replace(/\.pdf$/i, '').replace(/%26/g, '&').replace(/%20/g, ' '));
    }

    // Initialize - intercept datasheet download links
    function init() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href*=".pdf"]');
            if (link && link.href.toLowerCase().includes('datasheet') ||
                (link && (link.href.includes('/datasheets/') || link.textContent.toLowerCase().includes('download')))) {

                // Check if we should show the form
                if (shouldShowForm()) {
                    e.preventDefault();
                    const downloadName = getFilenameFromUrl(link.href);
                    showLeadForm(link.href, downloadName);
                }
                // If form not needed, let the default action proceed
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
