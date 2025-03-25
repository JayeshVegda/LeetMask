
// content.js

function setDifficultyVisibility(hide) {
  const difficultyClasses = [
    'text-difficulty-easy',
    'text-difficulty-medium',
    'text-difficulty-hard'
  ];

  difficultyClasses.forEach((difficultyClass) => {
    const elements = document.getElementsByClassName(difficultyClass);
    Array.from(elements).forEach((el) => {
      el.style.display = hide ? 'none' : '';
    });
  });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.hideDifficulty !== undefined) {
    setDifficultyVisibility(request.hideDifficulty);
  }
});

// Apply the user's preference on page load
chrome.storage.sync.get(['hideDifficulty'], (result) => {
  setDifficultyVisibility(result.hideDifficulty || false);
});
