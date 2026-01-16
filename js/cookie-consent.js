/**
 * GDPR Cookie Consent Banner
 * Elixir Electronics
 */
(function() {
    'use strict';

    const CONFIG = {
        storageKey: 'elixir_cookie_consent',
        consentDuration: 365 * 24 * 60 * 60 * 1000 // 1 year
    };

    // Check if consent was already given
    function hasConsent() {
        const stored = localStorage.getItem(CONFIG.storageKey);
        if (stored) {
            const data = JSON.parse(stored);
            if (data.consented && Date.now() < data.expiry) {
                return true;
            }
        }
        return false;
    }

    // Save consent
    function saveConsent(preferences) {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify({
            consented: true,
            preferences: preferences,
            timestamp: new Date().toISOString(),
            expiry: Date.now() + CONFIG.consentDuration
        }));
    }

    // Get saved preferences
    function getPreferences() {
        const stored = localStorage.getItem(CONFIG.storageKey);
        if (stored) {
            return JSON.parse(stored).preferences || {};
        }
        return {};
    }

    // Create and show cookie banner
    function showCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="8" cy="9" r="1" fill="currentColor"></circle>
                        <circle cx="15" cy="8" r="1" fill="currentColor"></circle>
                        <circle cx="10" cy="14" r="1" fill="currentColor"></circle>
                        <circle cx="16" cy="13" r="1" fill="currentColor"></circle>
                        <circle cx="12" cy="17" r="1" fill="currentColor"></circle>
                    </svg>
                </div>
                <div class="cookie-text">
                    <h4>We value your privacy</h4>
                    <p>We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our <a href="privacy.html">Privacy Policy</a> for more information.</p>
                </div>
                <div class="cookie-actions">
                    <button type="button" class="btn btn-settings" id="cookie-settings-btn">Customize</button>
                    <button type="button" class="btn btn-reject" id="cookie-reject-btn">Reject All</button>
                    <button type="button" class="btn btn-accept" id="cookie-accept-btn">Accept All</button>
                </div>
            </div>
            <div class="cookie-settings" id="cookie-settings-panel" style="display: none;">
                <div class="cookie-settings-header">
                    <h4>Cookie Preferences</h4>
                    <button type="button" class="close-settings" id="close-settings">&times;</button>
                </div>
                <div class="cookie-options">
                    <div class="cookie-option">
                        <div class="cookie-option-header">
                            <label>
                                <input type="checkbox" id="cookie-essential" checked disabled>
                                <span>Essential Cookies</span>
                            </label>
                            <span class="always-on">Always On</span>
                        </div>
                        <p>Required for the website to function properly. Cannot be disabled.</p>
                    </div>
                    <div class="cookie-option">
                        <div class="cookie-option-header">
                            <label>
                                <input type="checkbox" id="cookie-analytics">
                                <span>Analytics Cookies</span>
                            </label>
                        </div>
                        <p>Help us understand how visitors interact with our website.</p>
                    </div>
                    <div class="cookie-option">
                        <div class="cookie-option-header">
                            <label>
                                <input type="checkbox" id="cookie-marketing">
                                <span>Marketing Cookies</span>
                            </label>
                        </div>
                        <p>Used to track visitors across websites to display relevant ads.</p>
                    </div>
                </div>
                <div class="cookie-settings-actions">
                    <button type="button" class="btn btn-save" id="cookie-save-btn">Save Preferences</button>
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.id = 'cookie-consent-styles';
        styles.textContent = `
            #cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #fff;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                animation: slideUp 0.4s ease;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            .cookie-content {
                max-width: 1280px;
                margin: 0 auto;
                padding: 20px 24px;
                display: flex;
                align-items: center;
                gap: 20px;
                flex-wrap: wrap;
            }
            .cookie-icon {
                flex-shrink: 0;
            }
            .cookie-icon svg {
                width: 48px;
                height: 48px;
                color: #e67e22;
            }
            .cookie-text {
                flex: 1;
                min-width: 280px;
            }
            .cookie-text h4 {
                font-family: 'Playfair Display', Georgia, serif;
                font-size: 1.125rem;
                color: #0a3d62;
                margin: 0 0 6px;
            }
            .cookie-text p {
                font-size: 13px;
                color: #545b62;
                margin: 0;
                line-height: 1.5;
            }
            .cookie-text a {
                color: #0a3d62;
                text-decoration: underline;
            }
            .cookie-actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            .cookie-actions .btn {
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                font-family: inherit;
                transition: all 0.3s;
                white-space: nowrap;
            }
            .cookie-actions .btn-accept {
                background: #e67e22;
                color: #000;
            }
            .cookie-actions .btn-accept:hover {
                background: #d35400;
                transform: translateY(-1px);
            }
            .cookie-actions .btn-reject {
                background: #e9ecef;
                color: #545b62;
            }
            .cookie-actions .btn-reject:hover {
                background: #dee2e6;
            }
            .cookie-actions .btn-settings {
                background: transparent;
                color: #0a3d62;
                border: 2px solid #0a3d62;
            }
            .cookie-actions .btn-settings:hover {
                background: #0a3d62;
                color: #fff;
            }

            /* Settings Panel */
            .cookie-settings {
                border-top: 1px solid #e9ecef;
                padding: 20px 24px;
                max-width: 1280px;
                margin: 0 auto;
            }
            .cookie-settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
            }
            .cookie-settings-header h4 {
                font-family: 'Playfair Display', Georgia, serif;
                font-size: 1rem;
                color: #0a3d62;
                margin: 0;
            }
            .close-settings {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #545b62;
                line-height: 1;
            }
            .cookie-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 16px;
            }
            .cookie-option {
                background: #f8f9fa;
                padding: 16px;
                border-radius: 8px;
            }
            .cookie-option-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            .cookie-option-header label {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                color: #1a1a2e;
            }
            .cookie-option-header input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: #0a3d62;
            }
            .always-on {
                font-size: 11px;
                background: #0a3d62;
                color: #fff;
                padding: 2px 8px;
                border-radius: 4px;
            }
            .cookie-option p {
                font-size: 12px;
                color: #6c757d;
                margin: 0;
                line-height: 1.4;
            }
            .cookie-settings-actions {
                margin-top: 16px;
                text-align: right;
            }
            .cookie-settings-actions .btn-save {
                background: #0a3d62;
                color: #fff;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }
            .cookie-settings-actions .btn-save:hover {
                background: #1e5f8a;
            }

            @media (max-width: 768px) {
                .cookie-content {
                    flex-direction: column;
                    text-align: center;
                }
                .cookie-actions {
                    width: 100%;
                    justify-content: center;
                }
                .cookie-actions .btn {
                    flex: 1;
                    min-width: 100px;
                }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(banner);

        // Event handlers
        document.getElementById('cookie-accept-btn').addEventListener('click', function() {
            saveConsent({ essential: true, analytics: true, marketing: true });
            closeBanner(banner, styles);
            enableAllCookies();
        });

        document.getElementById('cookie-reject-btn').addEventListener('click', function() {
            saveConsent({ essential: true, analytics: false, marketing: false });
            closeBanner(banner, styles);
        });

        document.getElementById('cookie-settings-btn').addEventListener('click', function() {
            document.getElementById('cookie-settings-panel').style.display = 'block';
        });

        document.getElementById('close-settings').addEventListener('click', function() {
            document.getElementById('cookie-settings-panel').style.display = 'none';
        });

        document.getElementById('cookie-save-btn').addEventListener('click', function() {
            const preferences = {
                essential: true,
                analytics: document.getElementById('cookie-analytics').checked,
                marketing: document.getElementById('cookie-marketing').checked
            };
            saveConsent(preferences);
            closeBanner(banner, styles);
            applyPreferences(preferences);
        });
    }

    function closeBanner(banner, styles) {
        banner.style.animation = 'slideDown 0.4s ease forwards';
        const slideDownStyle = document.createElement('style');
        slideDownStyle.textContent = '@keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }';
        document.head.appendChild(slideDownStyle);

        setTimeout(() => {
            banner.remove();
            styles.remove();
            slideDownStyle.remove();
        }, 400);
    }

    function enableAllCookies() {
        // Enable analytics (e.g., Google Analytics)
        console.log('Analytics cookies enabled');
        // Enable marketing cookies
        console.log('Marketing cookies enabled');
    }

    function applyPreferences(preferences) {
        if (preferences.analytics) {
            console.log('Analytics cookies enabled');
            // Initialize analytics
        }
        if (preferences.marketing) {
            console.log('Marketing cookies enabled');
            // Initialize marketing scripts
        }
    }

    // Initialize
    function init() {
        if (!hasConsent()) {
            // Delay until after LCP measurement (3 seconds)
            setTimeout(showCookieBanner, 3000);
        } else {
            // Apply saved preferences
            applyPreferences(getPreferences());
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
