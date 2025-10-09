
console.log('F1 Word Racer background service worker started');

chrome.runtime.onMessage.addListener((message, sender) => {
  if (!message || !message.action) return;

  if (message.action === 'triggerWord') {
    console.log('background received triggerWord:', message.word, 'from', sender.tab && sender.tab.id);

    const tabId = sender.tab && sender.tab.id;
    if (typeof tabId !== 'number') return;

    chrome.tabs.sendMessage(tabId, { action: 'runAnimation'}, (resp) => {
        console.log('runAnimation message sent to tab', tabId);
    });
  }
});
