document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const openOptions = document.getElementById('open-options');

  chrome.storage.local.get({ enabled: false }, (res) => {
    toggle.checked = !!res.enabled;
  });

  toggle.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: toggle.checked });
  });

  openOptions.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('options.html');
    }
  });
});
