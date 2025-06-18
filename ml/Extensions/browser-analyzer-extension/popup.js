document.addEventListener('DOMContentLoaded', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        return {
          url: window.location.href,
          title: document.title,
          text: document.body.innerText.slice(0, 1000)
        };
      }
    },
    (results) => {
      if (!results || !results[0]) return;

      const data = results[0].result;
      const contextType = detectContext(data.text);
      const timestamp = new Date().toISOString();

      document.getElementById('timestamp').textContent = timestamp;
      document.getElementById('url').textContent = data.url;
      document.getElementById('title').textContent = data.title || "(No title found)";
      document.getElementById('context').textContent = contextType;

      const shortSample = data.text.slice(0, 150) + '...';
      document.getElementById('text-short').textContent = shortSample;
      document.getElementById('text-full').textContent = data.text;

      const toggleBtn = document.getElementById('toggle-btn');
      toggleBtn.addEventListener('click', () => {
        const short = document.getElementById('text-short');
        const full = document.getElementById('text-full');
        const isExpanded = full.style.display === 'block';
        short.style.display = isExpanded ? 'block' : 'none';
        full.style.display = isExpanded ? 'none' : 'block';
        toggleBtn.textContent = isExpanded ? 'Expand' : 'Collapse';
      });
    }
  );
});

function detectContext(text) {
  const lowerText = text.toLowerCase();

  const rules = {
    programming: ['function', 'console.log', 'import ', 'def ', 'return', '{', '=>', 'class '],
    video: ['youtube', 'watch', 'subscribe', 'like and share', 'live stream'],
    reading: ['chapter', 'section', 'paragraph', 'introduction', 'content'],
    document: ['pdf', 'paper', 'abstract', 'appendix', 'doi'],
    productivity: ['todo', 'calendar', 'schedule', 'notion', 'task', 'deadline'],
    social: ['whatsapp', 'instagram', 'facebook', 'twitter', 'chat', 'stories'],
    unknown: []
  };

  for (const [context, keywords] of Object.entries(rules)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return context;
      }
    }
  }

  return 'unknown';
}
