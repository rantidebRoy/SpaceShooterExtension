

chrome.webNavigation.onErrorOccurred.addListener((details) => {
  // frameId === 0 means it's the main browser tab, not an iframe or ad failing to load
  if (details.frameId === 0) {
    
    // Check if the error is specifically a network disconnection
    if (
      details.error === "net::ERR_INTERNET_DISCONNECTED" || 
      details.error === "net::ERR_NAME_NOT_RESOLVED" ||
      details.error === "net::ERR_CONNECTION_TIMED_OUT"
    ) {
      
      // Pass the original URL so we can restore it later
      const originalUrl = encodeURIComponent(details.url);
      
      // Instantly redirect the broken tab to our local Space Shooter game!
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL(`game/game.html?url=${originalUrl}`)
      });
      
    }
  }
});
