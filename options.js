document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('words');
  const saveBtn = document.getElementById('save');

  chrome.storage.sync.get({ triggerWords: [] }, (res) => {
    textarea.value = (res.triggerWords || []).join('\n');
  });

  saveBtn.addEventListener('click', () => {
    const words = textarea.value.split(/\r?\n/).map(w => w.trim()).filter(Boolean);
    chrome.storage.sync.set({ triggerWords: words }, () => {
      saveBtn.textContent = 'Saved ✓';
      setTimeout(() => saveBtn.textContent = 'Save', 900);
    });
  });
});
