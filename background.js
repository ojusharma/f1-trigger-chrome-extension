chrome.runtime.onMessage.addListener((message, sender) => {
  if (!message || !message.action) return;

  if (message.action === 'triggerWord') {
    const tabId = sender.tab && sender.tab.id;
    if (typeof tabId !== 'number') return;

    chrome.tabs.sendMessage(tabId, { action: 'runAnimation', word: message.word });
  }
});
