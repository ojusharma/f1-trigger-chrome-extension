console.log("🏁 F1 Word Racer: content script running on", location.hostname);

let triggerWords = [];
let enabled = false;

chrome.storage.sync.get({ triggerWords: []}, (res) => {
  triggerWords = (res.triggerWords || []).map(w => w.toLowerCase());
  console.log("Loaded trigger words:", triggerWords);
});

chrome.storage.local.get( { enabled: false }, (res) =>  {
      enabled = !!res.enabled;
      console.log("Enabled:", enabled);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.triggerWords) {
    triggerWords = (changes.triggerWords.newValue || []).map(w => w.toLowerCase());
  }
  if (changes.enabled) {
    enabled = !!changes.enabled.newValue;
  }
});

function checkForTriggerWords(text) {
  if (!enabled || triggerWords.length === 0 || !text) return;

  const words = text.trim().toLowerCase().split(/\s+/);
  for (const word of words) {
    if (triggerWords.includes(word)) {
      console.log("🚨 Trigger word detected:", word);
      chrome.runtime.sendMessage({ action: "triggerWord", word });
      break;
    }
  }
}

// Listen to input events on the active element only
document.addEventListener('input', (e) => {
  const target = e.target;
  
  // Check if the target is an input element we care about
  if (target.matches('input[type="text"], textarea, [contenteditable="true"]')) {
    const text = target.value || target.textContent || '';
    const match = text.match(/(\S+)\s*$/);
    const previousWord = match ? match[1] : '';
    checkForTriggerWords(previousWord);
    console.log("Cur:", previousWord);
    }
}, true);