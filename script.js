/* ==========================================================================
   CYBERHUNT ENTERPRISE // APPLICATION & AI ENGINE LOGIC
   ========================================================================== */

// BADGE SYSTEM DATA
const badges = [
  { id: 1, icon: '🔍', name: 'Forensics' },
  { id: 2, icon: '🔐', name: 'Crypto' },
  { id: 3, icon: '🛡️', name: 'Defense' },
  { id: 4, icon: '⚡', name: 'Incident' }
];

document.addEventListener('DOMContentLoaded', () => {
  renderBadges();
  loadQuizQuestion();
});

function renderBadges() {
  const container = document.getElementById('sidebar-badges');
  container.innerHTML = '';
  badges.forEach(b => {
    const el = document.createElement('div');
    el.className = `badge-pill ${b.id === 1 ? 'unlocked' : ''}`;
    el.innerText = b.icon;
    el.title = b.name;
    container.appendChild(el);
  });
}

// TAB SWITCHING
function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

  event.currentTarget.classList.add('active');
  document.getElementById(`tab-${tabId}`).classList.add('active');
}

// MODULE ANSWER CHECK
function checkModuleAnswer() {
  const input = document.getElementById('module-answer').value.trim();
  const feedback = document.getElementById('module-feedback');

  if (input === 'CYBER-ADMIN-2026') {
    feedback.style.color = 'var(--green)';
    feedback.innerText = '✓ Correct payload decoded! Credentials secured.';
  } else {
    feedback.style.color = 'var(--crimson)';
    feedback.innerText = '✗ Invalid solution. Try decoding using Base64.';
  }
}

function toggleHint() {
  document.getElementById('hint-box').classList.toggle('hidden');
}

// QUIZ ENGINE
const quizData = [
  {
    q: "Which port does unencrypted HTTP traffic use by default?",
    opts: ["Port 22", "Port 80", "Port 443", "Port 8080"],
    correct: 1
  }
];

function loadQuizQuestion() {
  const q = quizData[0];
  document.getElementById('quiz-question').innerText = q.q;
  const container = document.getElementById('quiz-options');
  container.innerHTML = '';

  q.opts.forEach((opt, idx) => {
    const btn = document.createElement('div');
    btn.className = 'quiz-opt';
    btn.innerText = opt;
    btn.onclick = () => {
      const feedback = document.getElementById('quiz-feedback');
      if (idx === q.correct) {
        feedback.style.color = 'var(--green)';
        feedback.innerText = '✓ Correct! HTTP defaults to TCP Port 80.';
      } else {
        feedback.style.color = 'var(--crimson)';
        feedback.innerText = '✗ Incorrect. Think of standard web ports.';
      }
    };
    container.appendChild(btn);
  });
}

// CONVERTER / CIPHER TOOLS
function convertText(mode) {
  const input = document.getElementById('converter-input').value;
  const output = document.getElementById('converter-output');

  try {
    if (mode === 'b64-encode') {
      output.innerText = btoa(input);
    } else if (mode === 'b64-decode') {
      output.innerText = atob(input);
    } else if (mode === 'hex-encode') {
      output.innerText = Array.from(input).map(c => c.charCodeAt(0).toString(16)).join(' ');
    } else if (mode === 'rot13') {
      output.innerText = input.replace(/[a-zA-Z]/g, c => 
        String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
      );
    }
  } catch (err) {
    output.innerText = "Error processing input conversion.";
  }
}

// PERSISTENT AI CHATBOT ENGINE (JENNI / CHATGPT STYLE)
function sendAiMessage() {
  const input = document.getElementById('ai-user-input');
  const text = input.value.trim();
  if (!text) return;

  const chat = document.getElementById('ai-chat');

  // Add User Message
  const userMsg = document.createElement('div');
  userMsg.className = 'ai-msg user';
  userMsg.innerText = text;
  chat.appendChild(userMsg);

  input.value = '';
  chat.scrollTop = chat.scrollHeight;

  // Generate Smart Assistant Reply
  setTimeout(() => {
    const assistantMsg = document.createElement('div');
    assistantMsg.className = 'ai-msg assistant';
    assistantMsg.innerText = generateAiResponse(text);
    chat.appendChild(assistantMsg);
    chat.scrollTop = chat.scrollHeight;
  }, 600);
}

function handleAiKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendAiMessage();
  }
}

function generateAiResponse(prompt) {
  const p = prompt.toLowerCase();

  if (p.includes('base64') || p.includes('decode')) {
    return "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. To decode it in JavaScript, use 'atob(encodedString)'.";
  } else if (p.includes('port') || p.includes('http')) {
    return "Common ports: Port 80 (HTTP), Port 443 (HTTPS), Port 22 (SSH), Port 21 (FTP), Port 53 (DNS).";
  } else if (p.includes('phishing') || p.includes('email')) {
    return "Phishing involves spoofed communications designed to trick users into revealing sensitive data. Look for domain misspellings, urgent demands, and unverified links.";
  } else {
    return `Regarding "${prompt}": As your CYBERHUNT AI Assistant, I recommend breaking this down by analyzing log files, identifying threat vectors, and testing payloads in our Cryptographic Workbench.`;
  }
}
