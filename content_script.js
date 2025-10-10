console.log("F1 Word Racer: content script running on", location.hostname);

let triggerWords = [];
let enabled = false;
let vroomAudio = null;

try {
  vroomAudio = new Audio(chrome.runtime.getURL('sounds/vroom.mp3'));
  vroomAudio.volume = 0.5;
  vroomAudio.load();
  console.log("Audio preloaded");
} catch (err) {
  console.log("Audio preload failed:", err);
}

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
    console.log("Trigger word detected:", lowerWord);
    chrome.runtime.sendMessage({ action: "triggerWord", word: lowerWord });
  }
}


document.addEventListener('input', (e) => {
  const target = e.target;
  if (target.matches('input[type="text"], input[type="search"], input:not([type]), textarea, [contenteditable="true"]')) {
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




function triggerRace(opts = {}) {
//   if (document.getElementById('f1-racer-overlay')) return;
  
  if (vroomAudio) {
    vroomAudio.currentTime = 0;
    vroomAudio.play().catch(err => console.log('Audio play failed:', err));
  }
  
  const STYLE_ID = 'f1-racer-styles';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes f1-move {
        0% { transform: translateX(-30vw) rotate(0deg); }
        100% { transform: translateX(150vw) rotate(0deg); }
      }
      @keyframes finish-line-fade {
        0% { opacity: 0; }
        15% { opacity: 0.9; }
        70% { opacity: 0.9; }
        100% { opacity: 0; }
      }
      .f1-overlay {
        pointer-events: none;
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2147483647;
        overflow: hidden;
      }
      .f1-car {
        position: absolute;
        height: clamp(40px, 8vh, 100px);
        left: -40vw;
        will-change: transform, opacity;
        filter: drop-shadow(0 6px 10px rgba(0,0,0,0.45));
      }
      .f1-finish-line {
        position: absolute;
        right: calc(-12vh / 2);
        top: 50%;
        transform: translateY(-50%) rotate(90deg);
        height: 12vh;
        width: 80vh;
        opacity: 0;
        z-index: 0;
        animation: finish-line-fade 3500ms ease-in-out forwards;
      }
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.id = 'f1-racer-overlay';
  overlay.className = 'f1-overlay';

  const finishLine = document.createElement('img');
  finishLine.className = 'f1-finish-line';
  finishLine.src = chrome.runtime.getURL('images/finishing-line.png');
  overlay.appendChild(finishLine);

  const carCount = opts.count || 5;
  const images = opts.images || [
    chrome.runtime.getURL('images/car-1.png'),
    chrome.runtime.getURL('images/car-2.png'),
    chrome.runtime.getURL('images/car-3.png'),
    chrome.runtime.getURL('images/car-4.png')
  ];

  for (let i = 0; i < carCount; i++) {
    const img = document.createElement('img');
    img.className = 'f1-car';
    img.src = images[i % images.length];
    const pct = Math.min(12 + i * 13, 75);
    img.style.top = `${pct}%`;
    const duration = 1800 + (i * 100);
    const delay = i * 80;
    img.style.animation = `f1-move ${duration}ms linear ${delay}ms forwards`;
    overlay.appendChild(img);
  }

  document.body.appendChild(overlay);
  const maxDuration = 5000 + (carCount * 300);
  setTimeout(() => {
    const el = document.getElementById('f1-racer-overlay');
    if (el) el.remove();
  }, maxDuration);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.action) return;
  if (message.action === 'runAnimation') {
    console.log('runAnimation message received with word:', message.word);
    try {
      triggerRace({ count: 5 });
      sendResponse({ ok: true });
    } catch (err) {
      console.error('Animation error', err);
      sendResponse({ ok: false, error: String(err) });
    }
    return true;
  }
});