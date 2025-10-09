console.log("F1 Word Racer: content script running on", location.hostname);

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

function checkForTriggerWords(word) {
  if (!enabled || triggerWords.length === 0 || !word) return;

  const lowerWord = word.toLowerCase();
  if (triggerWords.includes(lowerWord)) {
    console.log("🚨 Trigger word detected:", lowerWord);
    chrome.runtime.sendMessage({ action: "triggerWord", word: lowerWord });
  }
}


document.addEventListener('input', (e) => {
  const target = e.target;
  if (target.matches('input[type="text"], textarea, [contenteditable="true"]')) {
    const text = target.value || target.textContent || '';
    if (text.slice(-1) === " ") {
      const trimmed = text.trimEnd();
      const lastSpaceIndex = trimmed.lastIndexOf(' ');
      const previousWord = lastSpaceIndex>= 0 ? trimmed.slice(lastSpaceIndex+1) : trimmed;
      if (previousWord) {
        checkForTriggerWords(previousWord);
        console.log("Cur:", previousWord);
      }
    }
  }
}, true);