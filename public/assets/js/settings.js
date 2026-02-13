document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject the overlay HTML if it doesn't exist
    if (!document.getElementById('settings-overlay')) {
        const overlayHTML = `
        <div id="settings-overlay" class="overlay" style="display: none;">
            <div class="overlay-content" style="max-width: 400px; text-align: left;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h2 style="margin:0; font-size: 24px;">Settings</h2>
                    <button id="close-settings" style="background:none; border:none; color:white; font-size:24px; cursor:pointer;">&times;</button>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-size: 16px;">Statistics Overlay</span>
                        <button id="toggle-stats-btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; cursor: pointer;">Disable</button>
                    </div>
                    <p style="font-size: 12px; opacity: 0.7; margin:0;">Toggle the real-time statistics overlay visible on the screen.</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <div style="display:flex; flex-direction:column;">
                            <span style="font-size: 16px;">Ad Blocker</span>
                            <span id="adblock-stats" style="font-size: 10px; color: #4ecdc4; margin-top:2px; display:none;">0 ads blocked lifetime</span>
                        </div>
                        <button id="toggle-adblock-btn" style="padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; cursor: pointer;">Disable</button>
                    </div>
                    <p style="font-size: 12px; opacity: 0.7; margin:0;">Blocks advertisements and popups on proxied pages.</p>
                </div>

                <hr style="border:none; border-top:1px solid rgba(255,255,255,0.1); margin: 20px 0;">

                <div style="margin-bottom: 20px;">
                    <h3 style="font-size: 16px; margin-bottom: 10px; color: #4ecdc4;">System Architecture</h3>
                    <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px;">
                        <div style="margin-bottom: 6px;"><span style="opacity:0.6">UA:</span> <span id="arch-ua">Thinking...</span></div>
                        <div style="margin-bottom: 6px;"><span style="opacity:0.6">Platform:</span> <span id="arch-platform">Thinking...</span></div>
                        <div><span style="opacity:0.6">Cores:</span> <span id="arch-cores">Thinking...</span></div>
                    </div>
                </div>
            </div>
        </div>`;
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
        
        // Open Settings
        btn.addEventListener('click', () => {
            settingsOverlay.style.display = 'flex';
            
            // Update Stats Button State
            const disabled = localStorage.getItem('ambient_overlay_disabled') === 'true';
            toggleStatsBtn.innerText = disabled ? 'Enable' : 'Disable';
            toggleStatsBtn.style.background = disabled ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255,255,255,0.1)';

            // Update Adblock Button State
            const adblockEnabled = localStorage.getItem('ambient_adblock_enabled') !== 'false';
            toggleAdblockBtn.innerText = adblockEnabled ? 'Disable' : 'Enable';
            toggleAdblockBtn.style.background = adblockEnabled ? 'rgba(255,255,255,0.1)' : 'rgba(78, 205, 196, 0.2)';
            
            // Show Adblock Statistics
            const adStats = document.getElementById('adblock-stats');
            if (adStats && adblockEnabled) {
                const count = localStorage.getItem('ambient_adblock_count') || '0';
                adStats.innerText = `${count} ads blocked lifetime`;
                adStats.style.display = 'block';
            } else if (adStats) {
                adStats.style.display = 'none';
            }
            
            // Populate Architecture Info
            if(document.getElementById('arch-ua')) document.getElementById('arch-ua').innerText = navigator.userAgent;
            if(document.getElementById('arch-platform')) document.getElementById('arch-platform').innerText = navigator.platform;
            if(document.getElementById('arch-cores')) document.getElementById('arch-cores').innerText = navigator.hardwareConcurrency || 'Unknown';
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
            toggleStatsBtn.style.background = newState ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255,255,255,0.1)';
            
            if (newState) {
                // Now Disabled - Hide Overlay
                // The overlay ID 'ambient-proxy-overlay' is assumed to be the one used in index.html or elsewhere
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
            toggleAdblockBtn.style.background = newState ? 'rgba(255,255,255,0.1)' : 'rgba(78, 205, 196, 0.2)';
            
            // Reload to apply changes
            location.reload();
        });

        // Listen for changes from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === 'ambient_overlay_disabled') {
               const disabled = e.newValue === 'true';
               toggleStatsBtn.innerText = disabled ? 'Enable' : 'Disable';
               toggleStatsBtn.style.background = disabled ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255,255,255,0.1)';
            }
            if (e.key === 'ambient_adblock_enabled') {
               const enabled = e.newValue !== 'false';
               toggleAdblockBtn.innerText = enabled ? 'Disable' : 'Enable';
               toggleAdblockBtn.style.background = enabled ? 'rgba(255,255,255,0.1)' : 'rgba(78, 205, 196, 0.2)';
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
