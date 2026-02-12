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
            await clearServiceWorkerCache();
            location.href = "/error";
          }
        })
        .catch(async (error) => {
          console.error("ServiceWorker registration failed:", error);
          await clearServiceWorkerCache();
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
    await clearServiceWorkerCache();
    location.href = "/error";
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