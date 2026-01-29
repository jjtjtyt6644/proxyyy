async function launch(val) {
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

          // Listen for controller change (when new SW takes over)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service worker updated, reloading page...');
            window.location.reload();
          });

          // Check for updates and force refresh if needed
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available, skip waiting
                  newWorker.postMessage({ action: 'skipWaiting' });
                }
              });
            }
          });

          // Force update check
          registration.update();

          let url = val.trim();
          if (typeof ifUrl === "function" && !ifUrl(url)) {
            url = search(url);
          } else if (!(url.startsWith("https://") || url.startsWith("http://"))) {
            url = "https://" + url;
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
            location.href = "/error";
          }
        })
        .catch((error) => {
          console.error("ServiceWorker registration failed:", error);
          // Fallback: try to navigate directly
          try {
            let url = val.trim();
            if (!(url.startsWith("https://") || url.startsWith("http://"))) {
              url = "https://" + url;
            }
            location.href = "/search?direct=" + encodeURIComponent(url);
          } catch (fallbackError) {
            console.error("Fallback navigation failed:", fallbackError);
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
      }
    }
  }
}

// Function to clear service worker cache and force refresh
async function clearServiceWorkerCache() {
  if ('serviceWorker' in navigator) {
    // Unregister all service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('Service worker unregistered');
    }

    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('Cache cleared:', cacheName);
      }
    }

    // Clear localStorage and sessionStorage related to proxy
    localStorage.removeItem('proxy');
    localStorage.removeItem('browse');
    sessionStorage.removeItem('encodedUrl');

    console.log('All proxy caches and data cleared');
    return true;
  }
  return false;
}

// Make functions globally available
window.clearServiceWorkerCache = clearServiceWorkerCache;