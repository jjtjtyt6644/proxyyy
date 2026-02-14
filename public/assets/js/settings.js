document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject the overlay HTML if it doesn't exist
    if (!document.getElementById('settings-overlay')) {
        const overlayHTML = `
        <div id="settings-overlay" class="overlay" style="display: none;">
            <div class="overlay-content settings-panel">
                <!-- Header -->
                <div class="settings-header">
                    <div class="settings-title-group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="settings-icon-title">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        <h2>Settings</h2>
                    </div>
                    <button id="close-settings" class="close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <!-- Settings Content -->
                <div class="settings-content">
                    <!-- Privacy & Browsing Section -->
                    <div class="settings-section">
                        <h3 class="section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            Privacy & Browsing
                        </h3>
                        
                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                                    </svg>
                                    Statistics Overlay
                                </div>
                                <p class="setting-desc">Display real-time performance metrics and statistics on your screen</p>
                            </div>
                            <button id="toggle-stats-btn" class="toggle-btn">Disable</button>
                        </div>

                        <div class="setting-item">
                            <div class="setting-info">
                                <div class="setting-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                                    </svg>
                                    Ad Blocker
                                    <span id="adblock-stats" class="badge">0 blocked</span>
                                </div>
                                <p class="setting-desc">Block advertisements, popups, and tracking scripts on proxied pages</p>
                            </div>
                            <button id="toggle-adblock-btn" class="toggle-btn">Disable</button>
                        </div>

                        <div class="setting-item privacy-shield-item">
                            <div class="setting-info">
                                <div class="setting-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                        <path d="m9 12 2 2 4-4"/>
                                    </svg>
                                    Privacy Shield
                                    <span class="beta-badge">BETA</span>
                                    <button id="shield-learn-more" class="learn-more-link">Learn More</button>
                                    <span id="privacy-stats" class="badge">0 blocked</span>
                                </div>
                                <p class="setting-desc">Block tracking scripts, fingerprinting, cookies & strip URL trackers</p>
                                <div class="shield-level-selector">
                                    <label class="shield-level-label">Protection Level:</label>
                                    <select id="shield-level" class="shield-dropdown">
                                        <option value="basic">🟢 Basic - Recommended</option>
                                        <option value="advanced">🟡 Advanced - Stronger</option>
                                        <option value="paranoid">🔴 Paranoid - Maximum</option>
                                    </select>
                                </div>
                                <div class="shield-whitelist-section">
                                    <label class="shield-level-label" style="display:block;margin-bottom:8px">Whitelisted Domains:</label>
                                    <div class="whitelist-input-group">
                                        <input type="text" id="whitelist-input" placeholder="e.g. poki.com" class="whitelist-input">
                                        <button id="add-whitelist-btn" class="whitelist-add-btn">Add</button>
                                    </div>
                                    <div id="whitelist-container" class="whitelist-container"></div>
                                </div>
                            </div>
                            <button id="toggle-privacy-btn" class="toggle-btn">Disable</button>
                        </div>
                    </div>

                    <!-- System Information Section -->
                    <div class="settings-section">
                        <h3 class="section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                <line x1="8" y1="21" x2="16" y2="21"/>
                                <line x1="12" y1="17" x2="12" y2="21"/>
                            </svg>
                            System Information
                        </h3>
                        
                        <div class="system-info-grid">
                            <div class="info-card">
                                <div class="info-label">User Agent</div>
                                <div class="info-value" id="arch-ua">Loading...</div>
                            </div>
                            <div class="info-card">
                                <div class="info-label">Platform</div>
                                <div class="info-value" id="arch-platform">Loading...</div>
                            </div>
                            <div class="info-card">
                                <div class="info-label">CPU Cores</div>
                                <div class="info-value" id="arch-cores">Loading...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Beta Info Modal -->
        <div id="beta-modal" class="overlay" style="display: none; z-index: 10001; align-items: center; justify-content: center;">
            <div class="overlay-content beta-modal-content">
                <div class="beta-header" style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="margin:0; color:#f59e0b; display:flex; align-items:center; gap:10px; font-size:18px">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        Privacy Shield Beta
                    </h3>
                    <button id="close-beta-modal" class="close-btn" style="width:32px;height:32px">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="beta-body" style="color:rgba(255,255,255,0.9); font-size:14px; line-height:1.5">
                    <p>The Privacy Shield is a new feature designed to protect your browsing by blocking trackers. However, because it works by intercepting scripts, it is <strong>experimental</strong> and may behave unpredictably.</p>
                    <div style="background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.2); border-radius:8px; padding:12px; margin:15px 0">
                        <strong style="color:#f59e0b; display:block; margin-bottom:5px">Known Issues:</strong>
                        <ul style="margin:0; padding-left:20px; color:rgba(255,255,255,0.8)">
                            <li>Some games (e.g., Poki) may fail to load</li>
                            <li>Interactive elements might break</li>
                            <li>Legitimate scripts might be blocked</li>
                        </ul>
                    </div>
                    <p style="font-size:13px; opacity:0.7">We are actively working to improve accuracy. If a site breaks, add it to the <strong>Whitelist</strong> or disable the shield.</p>
                    <button class="toggle-btn" style="width:100%; margin-top:10px" onclick="document.getElementById('beta-modal').style.display='none'">I Understand</button>
                </div>
            </div>
        </div>

        <style>
            .settings-panel {
                max-width: 650px !important;
                width: 95% !important;
                max-height: 85vh;
                overflow-y: auto;
                text-align: left !important;
                padding: 0 !important;
                scrollbar-width: thin;
                scrollbar-color: rgba(78, 205, 196, 0.3) rgba(0,0,0,0.2);
            }

            .settings-panel::-webkit-scrollbar {
                width: 8px;
            }

            .settings-panel::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.2);
                border-radius: 4px;
            }

            .settings-panel::-webkit-scrollbar-thumb {
                background: rgba(78, 205, 196, 0.3);
                border-radius: 4px;
            }

            .settings-panel::-webkit-scrollbar-thumb:hover {
                background: rgba(78, 205, 196, 0.5);
            }

            .settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 28px 32px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                background: linear-gradient(135deg, rgba(78, 205, 196, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
                position: sticky;
                top: 0;
                z-index: 10;
                backdrop-filter: blur(10px);
            }

            .settings-title-group {
                display: flex;
                align-items: center;
                gap: 14px;
            }

            .settings-icon-title {
                color: #4ecdc4;
                animation: rotateSettingsIcon 20s linear infinite;
            }

            @keyframes rotateSettingsIcon {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .settings-header h2 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
                background: linear-gradient(135deg, #4ecdc4 0%, #10b981 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .close-btn {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                color: white;
            }

            .close-btn:hover {
                background: rgba(239, 68, 68, 0.15);
                border-color: rgba(239, 68, 68, 0.3);
                transform: rotate(90deg);
            }

            .close-btn svg {
                transition: all 0.3s ease;
            }

            .settings-content {
                padding: 32px;
                display: flex;
                flex-direction: column;
                gap: 32px;
            }

            .settings-section {
                background: rgba(255,255,255,0.02);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 16px;
                padding: 24px;
                transition: all 0.3s ease;
            }

            .settings-section:hover {
                background: rgba(255,255,255,0.04);
                border-color: rgba(78, 205, 196, 0.2);
                box-shadow: 0 8px 24px rgba(78, 205, 196, 0.1);
            }

            .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #4ecdc4;
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .section-title svg {
                filter: drop-shadow(0 0 8px rgba(78, 205, 196, 0.4));
            }

            .setting-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: rgba(0,0,0,0.2);
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: 12px;
                margin-bottom: 16px;
                transition: all 0.3s ease;
                gap: 20px;
            }

            .setting-item:last-child {
                margin-bottom: 0;
            }

            .setting-item:hover {
                background: rgba(255,255,255,0.03);
                border-color: rgba(78, 205, 196, 0.15);
                transform: translateX(4px);
            }

            .setting-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .setting-label {
                font-size: 16px;
                font-weight: 600;
                color: white;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .setting-label svg {
                color: #4ecdc4;
            }

            .badge {
                display: inline-block;
                padding: 4px 10px;
                background: rgba(78, 205, 196, 0.15);
                border: 1px solid rgba(78, 205, 196, 0.3);
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                color: #4ecdc4;
                margin-left: 8px;
            }

            .shield-level-selector {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-top: 12px;
                padding: 12px;
                background: rgba(0,0,0,0.3);
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.05);
            }

            .shield-level-label {
                font-size: 13px;
                color: rgba(255,255,255,0.7);
                font-weight: 500;
            }

            .shield-dropdown {
                flex: 1;
                padding: 8px 12px;
                background: rgba(0,0,0,0.4);
                border: 1px solid rgba(78, 205, 196, 0.3);
                border-radius: 8px;
                color: white;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                outline: none;
            }

            .shield-dropdown:hover {
                background: rgba(78, 205, 196, 0.1);
                border-color: rgba(78, 205, 196, 0.5);
            }

            .shield-dropdown:focus {
                border-color: #4ecdc4;
                box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
            }

            .shield-dropdown option {
                background: #1a1a2e;
                color: white;
                padding: 8px;
            }

            .shield-whitelist-section {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .whitelist-input-group {
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
            }

            .whitelist-input {
                flex: 1;
                background: rgba(0,0,0,0.4);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 6px;
                padding: 8px 12px;
                color: white;
                font-family: inherit;
                font-size: 13px;
                outline: none;
                transition: all 0.2s;
            }

            .whitelist-input:focus {
                border-color: #4ecdc4;
                box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
            }

            .whitelist-add-btn {
                padding: 6px 12px;
                background: rgba(78, 205, 196, 0.15);
                color: #4ecdc4;
                border: 1px solid rgba(78, 205, 196, 0.3);
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.2s;
            }

            .whitelist-add-btn:hover {
                background: rgba(78, 205, 196, 0.25);
                transform: translateY(-1px);
            }

            .whitelist-container {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                max-height: 100px;
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: rgba(78, 205, 196, 0.3) transparent;
            }

            .whitelist-tag {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 4px 8px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 4px;
                font-size: 11px;
                color: rgba(255,255,255,0.8);
            }

            .whitelist-remove {
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.2s;
                display: flex;
                align-items: center;
            }

            .whitelist-remove:hover {
                opacity: 1;
                color: #ef4444;
            }

            .privacy-shield-item {
                border-left: 3px solid #4ecdc4;
            }

            .setting-desc {
                font-size: 13px;
                color: rgba(255,255,255,0.6);
                margin: 0;
                line-height: 1.5;
            }

            .toggle-btn {
                padding: 10px 24px;
                border-radius: 10px;
                border: 1.5px solid rgba(255,255,255,0.2);
                background: rgba(255,255,255,0.08);
                color: white;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
                min-width: 100px;
            }

            .toggle-btn:hover {
                background: rgba(78, 205, 196, 0.15);
                border-color: rgba(78, 205, 196, 0.4);
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(78, 205, 196, 0.2);
            }

            .toggle-btn:active {
                transform: scale(0.98);
            }

            .toggle-btn.enabled {
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.2) 100%);
                border-color: rgba(34, 197, 94, 0.4);
                color: #22c55e;
            }

            .toggle-btn.disabled {
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%);
                border-color: rgba(239, 68, 68, 0.4);
                color: #ef4444;
            }

            .system-info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
            }

            .info-card {
                background: rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.05);
                border-radius: 12px;
                padding: 16px;
                transition: all 0.3s ease;
            }

            .info-card:hover {
                background: rgba(255,255,255,0.03);
                border-color: rgba(78, 205, 196, 0.2);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }

            .info-label {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                color: rgba(255,255,255,0.5);
                margin-bottom: 8px;
                font-weight: 600;
            }

            .info-value {
                font-family: 'Courier New', monospace;
                font-size: 13px;
                color: white;
                word-break: break-word;
                line-height: 1.4;
            }

            .beta-badge {
                background: #f59e0b20;
                color: #f59e0b;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 4px;
                border: 1px solid #f59e0b40;
                letter-spacing: 0.5px;
                font-weight: 700;
                vertical-align: middle;
            }

            .learn-more-link {
                background: none;
                border: none;
                color: #f59e0b;
                text-decoration: underline;
                cursor: pointer;
                font-size: 12px;
                padding: 0;
                margin-left: 8px;
                opacity: 0.8;
                transition: opacity 0.2s;
            }

            .learn-more-link:hover {
                opacity: 1;
            }

            .beta-modal-content {
                background: #1a1b1e;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
                padding: 24px;
                max-width: 450px;
                width: 90%;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                position: relative;
                color: #e0e0e0;
            }

            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(5px);
                z-index: 9999;
                display: flex;
            }

            @media (max-width: 768px) {
                .settings-panel {
                    max-width: 95% !important;
                    max-height: 90vh;
                }

                .settings-header {
                    padding: 20px 20px;
                }

                .settings-header h2 {
                    font-size: 24px;
                }

                .settings-content {
                    padding: 20px;
                    gap: 24px;
                }

                .settings-section {
                    padding: 18px;
                }

                .setting-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 16px;
                }

                .toggle-btn {
                    width: 100%;
                }

                .system-info-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>`;
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
    }

    // 2. Attach event listeners
    // Try to find the button by ID first, then by selector
    let btn = document.getElementById('settings-btn');
    
    // If not found by ID, look for the settings icon in a nav
    if (!btn) {
        const icons = document.querySelectorAll('nav i[data-lucide="settings"]');
        if (icons.length > 0) {
            btn = icons[0];
            btn.style.cursor = 'pointer'; // Ensure it looks clickable
        }
    }

    if (btn) {
        const settingsOverlay = document.getElementById('settings-overlay');
        const closeSettingsBtn = document.getElementById('close-settings');
        const toggleStatsBtn = document.getElementById('toggle-stats-btn');
        const toggleAdblockBtn = document.getElementById('toggle-adblock-btn');
        const togglePrivacyBtn = document.getElementById('toggle-privacy-btn');
        const shieldLevelSelect = document.getElementById('shield-level');
        
        // Open Settings
        btn.addEventListener('click', () => {
            settingsOverlay.style.display = 'flex';
            
            // Update Stats Button State
            const statsDisabled = localStorage.getItem('ambient_overlay_disabled') === 'true';
            toggleStatsBtn.innerText = statsDisabled ? 'Enable' : 'Disable';
            toggleStatsBtn.className = statsDisabled ? 'toggle-btn enabled' : 'toggle-btn disabled';

            // Update Adblock Button State
            const adblockEnabled = localStorage.getItem('ambient_adblock_enabled') !== 'false';
            toggleAdblockBtn.innerText = adblockEnabled ? 'Disable' : 'Enable';
            toggleAdblockBtn.className = adblockEnabled ? 'toggle-btn disabled' : 'toggle-btn enabled';
            
            // Show Adblock Statistics Badge
            const adStats = document.getElementById('adblock-stats');
            if (adStats) {
                const count = parseInt(localStorage.getItem('ambient_adblock_count') || '0');
                adStats.innerText = `${count.toLocaleString()} blocked`;
                adStats.style.display = adblockEnabled ? 'inline-block' : 'none';
            }

            // Update Privacy Shield Button State
            const privacyEnabled = localStorage.getItem('ambient_privacy_shield_enabled') !== 'false';
            togglePrivacyBtn.innerText = privacyEnabled ? 'Disable' : 'Enable';
            togglePrivacyBtn.className = privacyEnabled ? 'toggle-btn disabled' : 'toggle-btn enabled';
            
            // Show Privacy Shield Statistics Badge
            const privacyStats = document.getElementById('privacy-stats');
            if (privacyStats) {
                const count = parseInt(localStorage.getItem('ambient_privacy_shield_blocked') || '0');
                privacyStats.innerText = `${count.toLocaleString()} blocked`;
                privacyStats.style.display = privacyEnabled ? 'inline-block' : 'none';
            }

            // Set Shield Level Dropdown
            if (shieldLevelSelect) {
                const level = localStorage.getItem('ambient_privacy_shield_level') || 'basic';
                shieldLevelSelect.value = level;
                shieldLevelSelect.disabled = !privacyEnabled;
            }

            // --- Whitelist Logic ---
            const wContainer = document.getElementById('whitelist-container');
            const wAddBtn = document.getElementById('add-whitelist-btn');
            const wInput = document.getElementById('whitelist-input');

            // Function to render the list
            const updateWhitelistUI = () => {
                const list = JSON.parse(localStorage.getItem('ambient_privacy_shield_whitelist') || '[]');
                wContainer.innerHTML = '';
                list.forEach(domain => {
                    const tag = document.createElement('div');
                    tag.className = 'whitelist-tag';
                    tag.innerHTML = `
                        ${domain}
                        <span class="whitelist-remove">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </span>
                    `;
                    tag.querySelector('.whitelist-remove').onclick = () => {
                        const currentList = JSON.parse(localStorage.getItem('ambient_privacy_shield_whitelist') || '[]');
                        const newList = currentList.filter(d => d !== domain);
                        localStorage.setItem('ambient_privacy_shield_whitelist', JSON.stringify(newList));
                        updateWhitelistUI();
                    };
                    wContainer.appendChild(tag);
                });
            };

            // Add Domain Logic
            const handleAdd = () => {
                let val = wInput.value.trim().toLowerCase();
                if (!val) return;
                val = val.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
                
                const list = JSON.parse(localStorage.getItem('ambient_privacy_shield_whitelist') || '[]');
                if (!list.includes(val)) {
                    list.push(val);
                    localStorage.setItem('ambient_privacy_shield_whitelist', JSON.stringify(list));
                    updateWhitelistUI();
                }
                wInput.value = '';
            };

            // Clean event listeners to prevent duplicates on re-open
            const newAddBtn = wAddBtn.cloneNode(true);
            wAddBtn.parentNode.replaceChild(newAddBtn, wAddBtn);
            newAddBtn.onclick = handleAdd;

            const newInput = wInput.cloneNode(true);
            wInput.parentNode.replaceChild(newInput, wInput);
            newInput.onkeypress = (e) => { if (e.key === 'Enter') handleAdd(); };

            updateWhitelistUI();
            // -----------------------
            
            // Populate Architecture Info
            if(document.getElementById('arch-ua')) document.getElementById('arch-ua').innerText = navigator.userAgent;
            if(document.getElementById('arch-platform')) document.getElementById('arch-platform').innerText = navigator.platform;
            if(document.getElementById('arch-cores')) document.getElementById('arch-cores').innerText = navigator.hardwareConcurrency || 'Unknown';

            // --- Beta Modal Logic ---
            const shieldLearnMore = document.getElementById('shield-learn-more');
            const betaModal = document.getElementById('beta-modal');
            const closeBetaModal = document.getElementById('close-beta-modal');

            if (shieldLearnMore && betaModal) {
                shieldLearnMore.onclick = (e) => {
                    e.preventDefault();
                    betaModal.style.display = 'flex';
                };
            }

            if (closeBetaModal && betaModal) {
                closeBetaModal.onclick = () => {
                    betaModal.style.display = 'none';
                };
            }
            
            // Close when clicking outside content
            if (betaModal) {
                betaModal.onclick = (e) => {
                    if (e.target === betaModal) {
                        betaModal.style.display = 'none';
                    }
                };
            }
            // ------------------------
        });
        
        // Close Settings
        closeSettingsBtn.addEventListener('click', () => {
            settingsOverlay.style.display = 'none';
        });

        // Toggle Stats
        toggleStatsBtn.addEventListener('click', () => {
            const disabled = localStorage.getItem('ambient_overlay_disabled') === 'true';
            const newState = !disabled;
            localStorage.setItem('ambient_overlay_disabled', newState.toString());
            
            toggleStatsBtn.innerText = newState ? 'Enable' : 'Disable';
            toggleStatsBtn.className = newState ? 'toggle-btn enabled' : 'toggle-btn disabled';
            
            if (newState) {
                // Now Disabled - Hide Overlay
                const overlay = document.getElementById('ambient-proxy-overlay');
                if(overlay) overlay.style.display = 'none';
            } else {
                // Now Enabled - Reload to show
                location.reload();
            }
        });

        // Toggle Adblock
        toggleAdblockBtn.addEventListener('click', () => {
            const adblockEnabled = localStorage.getItem('ambient_adblock_enabled') !== 'false';
            const newState = !adblockEnabled;
            localStorage.setItem('ambient_adblock_enabled', newState.toString());
            
            toggleAdblockBtn.innerText = newState ? 'Disable' : 'Enable';
            toggleAdblockBtn.className = newState ? 'toggle-btn disabled' : 'toggle-btn enabled';
            
            // Reload to apply changes
            location.reload();
        });

        // Toggle Privacy Shield
        togglePrivacyBtn.addEventListener('click', () => {
            const privacyEnabled = localStorage.getItem('ambient_privacy_shield_enabled') !== 'false';
            const newState = !privacyEnabled;
            localStorage.setItem('ambient_privacy_shield_enabled', newState.toString());
            
            togglePrivacyBtn.innerText = newState ? 'Disable' : 'Enable';
            togglePrivacyBtn.className = newState ? 'toggle-btn disabled' : 'toggle-btn enabled';
            
            // Enable/disable the shield level dropdown
            if (shieldLevelSelect) {
                shieldLevelSelect.disabled = !newState;
            }
            
            // Reload to apply changes
            location.reload();
        });

        // Privacy Shield Level Change
        if (shieldLevelSelect) {
            shieldLevelSelect.addEventListener('change', (e) => {
                localStorage.setItem('ambient_privacy_shield_level', e.target.value);
                // Reload to apply new level
                location.reload();
            });
        }

        // Listen for changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === 'ambient_overlay_disabled') {
               const disabled = e.newValue === 'true';
               toggleStatsBtn.innerText = disabled ? 'Enable' : 'Disable';
               toggleStatsBtn.className = disabled ? 'toggle-btn enabled' : 'toggle-btn disabled';
            }
            if (e.key === 'ambient_adblock_enabled') {
               const enabled = e.newValue !== 'false';
               toggleAdblockBtn.innerText = enabled ? 'Disable' : 'Enable';
               toggleAdblockBtn.className = enabled ? 'toggle-btn disabled' : 'toggle-btn enabled';
            }
        });
        
        // Ensure overlay can be closed by clicking outside
        settingsOverlay.addEventListener('click', (e) => {
            if (e.target === settingsOverlay) {
                settingsOverlay.style.display = 'none';
            }
        });
    }
});
