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
  if (!enabled || triggerWords.length === 0) return;

  const words = text.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (triggerWords.includes(word)) {
      console.log("🚨 Trigger word detected:", word);
      chrome.runtime.sendMessage({ action: "triggerWord", word });
      break;
    }
  }
}

function attachListenersToInputs() {
  const selector = 'input[type="text"], textarea, [contenteditable="true"]';
  document.querySelectorAll(selector).forEach((el) => {
    if (!el.dataset.f1racerAttached) {
      el.addEventListener('input', (e) => {
        checkForTriggerWords(e.target.value);
      });
      el.dataset.f1racerAttached = "true";
    }
  });
}

attachListenersToInputs();

const observer = new MutationObserver(() => attachListenersToInputs());
observer.observe(document.body, { childList: true, subtree: true });
