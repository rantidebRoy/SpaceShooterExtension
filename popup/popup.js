/**
 * =============================================
 *  POPUP SCRIPT — popup.js
 * =============================================
 * 
 * PURPOSE:
 * This script handles two things:
 *   1. Display the saved high score from Chrome's storage
 *   2. Open the game in a new tab when "LAUNCH GAME" is clicked
 * 
 * KEY JAVASCRIPT CONCEPTS:
 *   - DOM manipulation (getElementById, addEventListener)
 *   - Chrome Extension APIs (chrome.tabs, chrome.storage)
 *   - Callback functions & arrow functions
 *   - Event-driven programming
 */

// ======================
//  DOM REFERENCES
// ======================
// document.getElementById finds an HTML element by its "id" attribute.
// We store references in variables so we don't search the DOM repeatedly.
const playBtn = document.getElementById('playBtn');
const highScoreDisplay = document.getElementById('highScore');


// ======================
//  LOAD HIGH SCORE
// ======================
/**
 * chrome.storage.local — a key-value store provided by Chrome for extensions.
 * Unlike localStorage, it works across different extension pages (popup, background, etc.)
 * 
 * .get(keys, callback):
 *   - keys: what data to retrieve (string or array of strings)
 *   - callback: a function that runs AFTER the data is retrieved
 *     This is ASYNCHRONOUS — the code below it runs before the callback fires.
 */
try {
  chrome.storage.local.get('highScore', (result) => {
    const score = result.highScore || 0;
    highScoreDisplay.textContent = score;
  });
} catch (e) {
  highScoreDisplay.textContent = "0"; // Local fallback
}

playBtn.addEventListener('click', () => {
  try {
    chrome.tabs.create({
      url: chrome.runtime.getURL('game/game.html')
    });
  } catch (e) {
    // If not running as an extension, just open game.html in same folder
    window.location.href = '../game/game.html';
  }
});
