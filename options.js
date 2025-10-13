document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('words');
  const saveBtn = document.getElementById('save');
  const feedback = document.getElementById('feedback');

  chrome.storage.sync.get({ triggerWords: [] }, (res) => {
    textarea.value = (res.triggerWords || []).join('\n');
  });

  saveBtn.addEventListener('click', () => {
    const words = textarea.value.split(/\r?\n/).map(w => w.trim()).filter(Boolean);
    chrome.storage.sync.set({ triggerWords: words }, () => {
      feedback.textContent = `✓ Saved ${words.length} trigger word${words.length !== 1 ? 's' : ''}`;
      feedback.className = 'save-feedback success show';
      
      setTimeout(() => {
        feedback.classList.remove('show');
      }, 3000);
    });
  });
});
