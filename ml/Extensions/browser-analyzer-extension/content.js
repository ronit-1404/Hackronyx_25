function getContext(text) {
  const CONTEXT_RULES = {
    programming: ["function", "class", "import", "{", "const", "def", "code"],
    video_lecture: ["lecture", "slide", "chapter", "youtube", "channel"],
    article: ["abstract", "introduction", "references", "read more"],
    document: ["pdf", "chapter", "download", "section"]
  };

  const lowerText = text.toLowerCase();

  for (const [label, keywords] of Object.entries(CONTEXT_RULES)) {
    for (let keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return label;
      }
    }
  }
  return "unknown";
}

function analyzePage() {
  const title = document.title || "Untitled";
  const url = window.location.href;
  const text = document.body.innerText || "";
  const lines = text.split("\n").filter(Boolean).slice(0, 3);
  const snippet = lines.join(" ").slice(0, 150).trim() + "...";
  const context = getContext(text);
  const timestamp = new Date().toISOString();

  const result = `[${timestamp}] Active App: Chrome | Context: ${context} | Text Sample: "${snippet}"`;

  // Store it for popup
  localStorage.setItem("lastLog", result);
}

setTimeout(analyzePage, 3000);
