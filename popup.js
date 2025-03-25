document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    
    // Function to update the button's appearance and text
    function updateButton(hide) {
      if (hide) {
        toggleButton.textContent = 'Show Difficulty Levels';
        toggleButton.classList.add('hidden');
      } else {
        toggleButton.textContent = 'Hide Difficulty Levels';
        toggleButton.classList.remove('hidden');
      }
    }
  
    // Retrieve and set the button state from storage with error handling
    try {
      chrome.storage.sync.get(['hideDifficulty'], (result) => {
        if (chrome.runtime.lastError) {
          console.error('Error accessing storage:', chrome.runtime.lastError);
          return;
        }
        const hideDifficulty = result.hideDifficulty || false;
        updateButton(hideDifficulty);
      });
    } catch (error) {
      console.error('Error in storage access:', error);
    }
  
    // Listen for button clicks with error handling
    toggleButton.addEventListener('click', () => {
      try {
        chrome.storage.sync.get(['hideDifficulty'], (result) => {
          if (chrome.runtime.lastError) {
            console.error('Error accessing storage:', chrome.runtime.lastError);
            return;
          }
          const hideDifficulty = !(result.hideDifficulty || false);
          
          // Save the user's preference
          chrome.storage.sync.set({ hideDifficulty }, () => {
            if (chrome.runtime.lastError) {
              console.error('Error saving to storage:', chrome.runtime.lastError);
              return;
            }
            
            // Update the button appearance
            updateButton(hideDifficulty);
            
            // Send a message to the content script with error handling
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (chrome.runtime.lastError) {
                console.error('Error querying tabs:', chrome.runtime.lastError);
                return;
              }
              
              if (tabs && tabs[0] && tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { hideDifficulty }, (response) => {
                  if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError);
                  }
                });
              } else {
                console.error('No active tab found');
              }
            });
          });
        });
      } catch (error) {
        console.error('Error handling button click:', error);
      }
    });
  });