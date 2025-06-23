//kisiko ye smjha toh dekho.ya phir voh mapped table se kaise kaam krna hai voh find out kro :(

// 1. Example: Aggregated outputs from your APIs
const outputs = {
  video: { // from videoEngageModel
    emotion: "frustrated", // bored, confused, frustrated, focused
    attentive: false,
    engagement_score: 0.2
  },
  audio: { // from audio_engage
    emotion: "neutral" // engaged, distracted, neutral
  },
  screen: { // from screen-analyzer
    context: "programming", // e.g., video_lecture, programming, browsing
    chrome_title: "Introduction to Machine Learning with Python",
    chrome_url: "https://www.nrigroupindia.com/e-book/Introduction%20to%20Machine%20Learning%20with%20Python%20(%20PDFDrive.com%20)-min.pdf",
    sentiment: "neutral", // positive, neutral, negative
    idle_time: 30 // seconds
  }
};

const userPreference = "article"; //or "video", "summary", "chatbot", etc.

// 2. Recommendation engine (parsed from content.txt)
const recommendationsArray = [
  {
    Context: "programming",
    "Chrome Title": "Introduction to Machine Learning with Python",
    "Chrome URL": "https://www.nrigroupindia.com/e-book/Introduction%20to%20Machine%20Learning%20with%20Python%20(%20PDFDrive.com%20)-min.pdf",
    "Fun Fact": "Did you know that even the most complex machine learning models are ultimately just sophisticated mathematical recipes? ...",
    "Recommended Video Title": "Machine Learning for Beginners - Complete Tutorial",
    "Recommended Video URL": "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
    "Recommended Blog Title": "A Gentle Introduction to Machine Learning",
    "Recommended Blog URL": "https://towardsdatascience.com/a-gentle-introduction-to-machine-learning-fe583b6a4877"
  },
  // ...more entries
];

// 3. Main trigger logic
function getTriggerAction(outputs) {
  // Video model triggers
  if (outputs.video) {
    if (outputs.video.emotion === "frustrated") {
      return { type: "chatbot", message: "Feeling frustrated? Chat with our study assistant or try a quick break!" };
    }
    if (outputs.video.emotion === "bored") {
      return { type: "mini-game", message: "Bored? Try a quick mini-game or take a short break!" };
    }
    if (outputs.video.emotion === "confused") {
      return { type: "help", message: "Confused? Would you like a summary or a helpful article?" };
    }
    if (outputs.video.attentive === false || outputs.video.engagement_score < 0.3) {
      return { type: "break", message: "You seem inattentive. Take a short break or try a mini-game!" };
    }
  }

  // Audio model triggers
  if (outputs.audio) {
    if (outputs.audio.emotion === "distracted") {
      return { type: "break", message: "You sound distracted. Take a break or watch a motivational video!" };
    }
  }

  // Screen analyzer triggers
  if (outputs.screen) {
    if (outputs.screen.sentiment === "negative") {
      return { type: "motivation", message: "Screen content seems negative. Watch a motivational video or chat with our assistant!" };
    }
    if (outputs.screen.idle_time > 90) {
      return { type: "break", message: "You've been inactive for a while. Take a break or stretch!" };
    }
    if (outputs.screen.context !== "studying" && outputs.screen.context !== "programming" && outputs.screen.context !== "video_lecture") {
      return { type: "focus", message: "Let's get back to learning! Need a resource to help you refocus?" };
    }
  }

  // Default encouragement
  return { type: "encourage", message: "Great job staying focused! Keep it up!" };
}

// 4. Recommendation selection based on user preference and screen context
function getRecommendation(screen, preference, recommendations) {
  const rec = recommendations.find(r =>
    r.Context === screen.context &&
    r["Chrome Title"] === screen.chrome_title
  );
  if (!rec) return null;

  if (preference === "video") {
    return {
      type: "video",
      title: rec["Recommended Video Title"],
      url: rec["Recommended Video URL"],
      funFact: rec["Fun Fact"]
    };
  } else if (preference === "article") {
    return {
      type: "article",
      title: rec["Recommended Blog Title"],
      url: rec["Recommended Blog URL"],
      funFact: rec["Fun Fact"]
    };
  } else if (preference === "summary") {
    return {
      type: "summary",
      url: screen.chrome_url,
      funFact: rec["Fun Fact"]
    };
  }
  // Add more types as needed
  return null;
}

// 5. Show popup in UI (basic HTML/JS)
function showPopup(content) {
  let popup = document.getElementById('coach-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'coach-popup';
    popup.style = "display:block; position:fixed; bottom:20px; right:20px; background:#fff; border:1px solid #ccc; padding:20px; z-index:1000;";
    document.body.appendChild(popup);
  }
  popup.innerHTML = `
    <span id="coach-close" style="cursor:pointer; float:right;">&times;</span>
    <div>${content}</div>
  `;
  document.getElementById('coach-close').onclick = () => { popup.style.display = "none"; };
}

// 6. Main workflow
function runSentimentCoach(outputs, userPreference, recommendationsArray) {
  const action = getTriggerAction(outputs);

  // If action is help, break, motivation, etc., use rec engine for suggestion
  if (["help", "break", "motivation", "focus"].includes(action.type)) {
    const rec = getRecommendation(outputs.screen, userPreference, recommendationsArray);
    if (rec) {
      let html = `<b>Fun Fact:</b> ${rec.funFact}<br><br>`;
      if (rec.type === "video") {
        html += `<b>Recommended Video:</b> <a href="${rec.url}" target="_blank">${rec.title}</a>`;
      } else if (rec.type === "article") {
        html += `<b>Recommended Article:</b> <a href="${rec.url}" target="_blank">${rec.title}</a>`;
      } else if (rec.type === "summary") {
        html += `<b>Want a summary of this page?</b> <a href="${rec.url}" target="_blank">Click here</a>`;
      }
      showPopup(html);
      return;
    }
  }

  // For mini-game, chatbot, or encouragement
  if (action.type === "mini-game") {
    showPopup(`<b>${action.message}</b><br><a href="https://www.coolmathgames.com/" target="_blank">Play a mini-game</a>`);
    return;
  }
  if (action.type === "chatbot") {
    showPopup(`<b>${action.message}</b><br><a href="/chatbot" target="_blank">Open Chatbot</a>`);
    return;
  }
  if (action.type === "encourage") {
    showPopup(`<b>${action.message}</b>`);
    return;
  }
}

// 7. Example usage
runSentimentCoach(outputs, userPreference, recommendationsArray);