// Apply Custom Theme on Load
(function() {
    const customBg = localStorage.getItem('ambient_theme_background');
    if (customBg) {
        // Create style element to override background
        const style = document.createElement('style');
        style.innerText = `
            body, .container {
                background: url('${customBg}') no-repeat center center fixed !important;
                background-size: cover !important;
            }
            .rays {
                display: none !important; 
            }
        `;
        document.head.appendChild(style);
    }

    // Apply Tab Cloaking
    const cloakTitle = localStorage.getItem('ambient_cloak_title');
    const cloakIcon = localStorage.getItem('ambient_cloak_icon');

    if (cloakTitle) {
        document.title = cloakTitle;
    }

    if (cloakIcon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = cloakIcon;
    }
})();

// Mutex to prevent race conditions
let isRegistering = false;

async function launch(val) {
  // Prevent multiple simultaneous launches
  if (isRegistering) {
    console.log('Launch already in progress, waiting...');
    await new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (!isRegistering) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }
  
  isRegistering = true;
  
  try {
    if (localStorage.getItem("proxy") === "rammerhead") {
      try {
        const encodedUrl = await RammerheadEncode(val);
        sessionStorage.setItem("encodedUrl", encodedUrl);

        const browseSetting = localStorage.getItem("browse");
        const browseUrls = {
          go: "/search",
          norm: encodedUrl,
        };
        const urlToNavigate = browseUrls[browseSetting] || "/search";
        location.href = urlToNavigate;
      } catch (error) {
        console.error('Rammerhead error:', error);
        await clearServiceWorkerCache();
        location.href = "/error";
      }
    } else {
      if ("serviceWorker" in navigator) {
        // Unregister any existing service workers first to prevent conflicts
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log("Unregistered old service worker");
        }

      let proxySetting = localStorage.getItem("proxy") || "uv";
      let swConfig = {
        uv: { file: "/search/sw.js", config: __uv$config }
      };

      // Use the selected proxy setting or default to 'uv'
      let { file: swFile, config: swConfigSettings } = swConfig[proxySetting];

      navigator.serviceWorker
        .register(swFile, { scope: swConfigSettings.prefix })
        .then((registration) => {
          console.log("ServiceWorker registration successful with scope: ", registration.scope);
          
          let url = val.trim();
          
          // Validate input
          if (!url || url.length < 2) {
            console.error('Invalid URL: too short');
            isRegistering = false;
            return;
          }
          
          if (typeof ifUrl === "function" && !ifUrl(url)) {
            url = search(url);
          } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
            url = "https://" + url;
          }
          
          // Additional URL validation
          try {
            new URL(url); // Validate URL format
          } catch (e) {
            console.error('Invalid URL format:', e);
            url = search(val.trim());
          }
          
          try {
            let encodedUrl = swConfigSettings.prefix + crypts.encode(url);
            sessionStorage.setItem("encodedUrl", encodedUrl);
            const browseSetting = localStorage.getItem("browse");
            const browseUrls = {
              go: "/search",
              norm: encodedUrl,
            };
            const urlToNavigate = browseUrls[browseSetting] || "/search";
            location.href = urlToNavigate;
          } catch (error) {
            console.error('Encoding error:', error);
            clearServiceWorkerCache().then(() => {
              location.href = "/error";
            });
          }
        })
        .catch((error) => {
          console.error("ServiceWorker registration failed:", error);
          clearServiceWorkerCache().then(() => {
            // Fallback: try to navigate directly
            try {
              let url = val.trim();
              if (!(url.startsWith("https://") || url.startsWith("http://"))) {
                url = "https://" + url;
              }
              location.href = "/search?direct=" + encodeURIComponent(url);
            } catch (fallbackError) {
              console.error("Fallback navigation failed:", fallbackError);
              location.href = "/error";
            }
          });
        });
      } else {
        // Fallback for browsers without service worker support
        console.warn("Service workers not supported, using direct navigation");
        try {
          let url = val.trim();
          if (!(url.startsWith("https://") || url.startsWith("http://"))) {
            url = "https://" + url;
          }
          location.href = "/search?direct=" + encodeURIComponent(url);
        } catch (error) {
          console.error("Direct navigation failed:", error);
          location.href = "/error";
        }
      }
    }
  } catch (error) {
    console.error('Launch error:', error);
    clearServiceWorkerCache().then(() => {
      location.href = "/error";
    });
  } finally {
    isRegistering = false;
  }
}

// Function to clear service worker cache and force refresh
async function clearServiceWorkerCache() {
  try {
    if ('serviceWorker' in navigator) {
      // Unregister all service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`Found ${registrations.length} service workers to unregister`);

      for (const registration of registrations) {
        const success = await registration.unregister();
        console.log('Service worker unregistered:', registration.scope, success ? 'SUCCESS' : 'FAILED');

        // Wait a bit for unregistration to complete
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Clear all caches, including UV-specific ones
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log(`Found ${cacheNames.length} caches to clear:`, cacheNames);

        for (const cacheName of cacheNames) {
          const success = await caches.delete(cacheName);
          console.log('Cache cleared:', cacheName, success ? 'SUCCESS' : 'FAILED');
        }
      }

      // Clear all localStorage and sessionStorage
      // Be more aggressive - clear everything proxy-related
      const keysToRemove = ['proxy', 'browse', 'engine'];
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      // Also clear the encodedUrl
      sessionStorage.removeItem('encodedUrl');

      console.log('All proxy caches and data cleared successfully');
      return true;
    }

    console.warn('Service Worker API not available');
    return false;
  } catch (error) {
    console.error('Error clearing service worker cache:', error);
    return false;
  }
}

// Make functions globally available
window.clearServiceWorkerCache = clearServiceWorkerCache;

// Global error handler for syntax errors
window.addEventListener('error', async (event) => {
  if (event.message && (event.message.includes('syntax') || 
      event.message.includes('Unexpected token') ||
      event.message.includes('Unexpected identifier') ||
      event.message.includes('Unexpected end of input'))) {
    console.warn('Syntax error detected, clearing service worker cache...');
    event.preventDefault();
    
    try {
      await clearServiceWorkerCache();
      console.log('Cache cleared, reloading in 1 second...');
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (err) {
      console.error('Failed to clear cache:', err);
      location.href = '/';
    }
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', async (event) => {
  if (event.reason && event.reason.message && 
      (event.reason.message.includes('syntax') || 
       event.reason.message.includes('Failed to fetch'))) {
    console.warn('Unhandled rejection detected:', event.reason);
    event.preventDefault();
    
    try {
      await clearServiceWorkerCache();
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (err) {
      console.error('Failed to handle rejection:', err);
    }
  }
});

// Terms of Service & Legal Disclaimer Overlay
(function() {
  function initCompliance() {
    // Check if user has already agreed
    if (localStorage.getItem('ambient_tou_agreed') === 'true') {
      return;
    }

    // Create the blocking overlay
    const overlay = document.createElement('div');
    overlay.id = 'ambient-compliance-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.98);
      backdrop-filter: blur(15px);
      z-index: 2147483647;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: linear-gradient(145deg, rgba(30, 41, 59, 1), rgba(15, 23, 42, 1));
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 32px;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 50px -10px rgba(0, 0, 0, 0.7);
      color: #e2e8f0;
      transform: scale(0.95);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    content.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        <h2 style="margin: 0; color: #fff; font-size: 20px; font-weight: 600;">Terms of Service</h2>
      </div>
      
      <div style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
        <p style="margin: 0 0 12px 0;"><strong>Usage Agreement:</strong></p>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
          <li style="display: flex; gap: 10px; align-items: start;">
            <span style="color: #60a5fa;">•</span>
            <span>You acknowledge that the operators of Ambient Proxy assume <strong>no legal liability</strong> for your actions, searches, or any content accessed through this service.</span>
          </li>
          <li style="display: flex; gap: 10px; align-items: start;">
            <span style="color: #60a5fa;">•</span>
            <span>We utilize a unique <strong>Device ID</strong> to authorize your browser session and ensure compliance with our usage policies.</span>
          </li>
        </ul>
      </div>

      <p style="font-size: 12px; color: #64748b; margin-bottom: 24px; text-align: center;">
        By clicking "I Agree", you consent to these terms and the generating of your unique device identifier.
      </p>

      <button id="accept-tou-btn" style="
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        border: none;
        border-radius: 10px;
        color: white;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      " onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 16px rgba(37, 99, 235, 0.4)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(37, 99, 235, 0.3)'">I AGREE & CONTINUE</button>
    `;

    overlay.appendChild(content);
    document.body.appendChild(overlay);

     // Prevent scrolling interactions
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      content.style.transform = 'scale(1)';
    });

    const btn = document.getElementById('accept-tou-btn');
    btn.addEventListener('click', () => {
      // Generate Device ID
      let deviceId = localStorage.getItem('ambient_device_id');
      if (!deviceId) {
        // Fallback for older browsers if crypto.randomUUID is not available
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            deviceId = crypto.randomUUID();
        } else {
            deviceId = 'dev_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        localStorage.setItem('ambient_device_id', deviceId);
      }
      
      // Save Agreement
      localStorage.setItem('ambient_tou_agreed', 'true');
      localStorage.setItem('ambient_tou_date', new Date().toISOString());

      // Animate out
      overlay.style.opacity = '0';
      content.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = originalOverflow;
      }, 300);
    });
  }

  // Run as early as possible on DOM content
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompliance);
  } else {
    initCompliance();
  }
})();