/* ==========================================================================
   CYBERHUNT // DIGITAL FORENSICS CONSOLE SCRIPT
   ========================================================================== */

// 15 LEVELS x 3 CASE STUDIES DATA STRUCTURE
const levelsData = Array.from({ length: 15 }, (_, lIdx) => ({
  levelNumber: lIdx + 1,
  title: `LEVEL ${lIdx + 1}: ${['Digital Footprints', 'Network Intrusions', 'Phishing Vectors', 'Malware Triage', 'Memory Forensics', 'Log Analysis', 'Encryption Breaking', 'Ransomware Tracing', 'Insider Threats', 'Cloud Espionage', 'Mobile Exploits', 'IoT Vulnerabilities', 'Identity Theft', 'Darknet Tracking', 'Incident Response'][lIdx]}`,
  badgeIcon: ['🔍', '📡', '✉️', '🦠', '🧠', '📜', '🔐', '☣️', '👤', '☁️', '📱', '📟', '🆔', '🌐', '🛡️'][lIdx],
  cases: [
    {
      title: `Case Study ${lIdx + 1}-A: Initial Vector`,
      preLearning: "Pre-Learning: Cyber investigators analyze metadata and header fields to identify suspicious origins before proceeding to deep payload analysis.",
      situation: "Situation: Intercepted payload header contains an encoded Base64 string. Decode the string to reveal the attacker's server key.",
      hint: "Hint: Use standard Base64 decoding logic on the string 'Q1lCRVIyMDI2'.",
      solution: "CYBER2026"
    },
    {
      title: `Case Study ${lIdx + 1}-B: Anomaly Scan`,
      preLearning: "Pre-Learning: Port scanning logs reveal unauthorized Reconnaissance activity across internal subnet ranges.",
      situation: "Situation: Inspect the access log. Identify the suspicious port number associated with unencrypted FTP intrusions.",
      hint: "Hint: Standard FTP control connections run on Port 21.",
      solution: "21"
    },
    {
      title: `Case Study ${lIdx + 1}-C: Threat Mitigation`,
      preLearning: "Pre-Learning: Threat containment requires revoking compromised session tokens immediately upon detection.",
      situation: "Situation: Input the command to terminate suspicious PID 8942.",
      hint: "Hint: Type 'kill 8942' to terminate the malicious process.",
      solution: "kill 8942"
    }
  ]
}));

let currentLevel = 0;
let currentCase = 0;
let unlockedBadges = new Set();

// VIEW SCREEN SWITCHER
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// LOGIN SYSTEM
function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('username').value;
  document.getElementById('user-display').innerText = `AGENT: ${user.toUpperCase()}`;
  showScreen('dashboard-screen');
  initDashboard();
}

// DASHBOARD INITIALIZATION
function initDashboard() {
  const levelList = document.getElementById('level-list');
  levelList.innerHTML = '';

  levelsData.forEach((lvl, idx) => {
    const item = document.createElement('div');
    item.className = `level-item ${idx === 0 ? 'active' : ''}`;
    item.innerText = lvl.title;
    item.onclick = () => loadLevel(idx);
    levelList.appendChild(item);
  });

  initBadges();
  loadLevel(0);
}

// BADGE GRID GENERATOR
function initBadges() {
  const grid = document.getElementById('badge-grid');
  grid.innerHTML = '';
  levelsData.forEach((lvl, idx) => {
    const badge = document.createElement('div');
    badge.id = `badge-${idx}`;
    badge.className = 'badge-icon';
    badge.innerText = lvl.badgeIcon;
    badge.title = lvl.title;
    grid.appendChild(badge);
  });
}

// LOAD SELECTED LEVEL AND CASE
function loadLevel(idx) {
  currentLevel = idx;
  currentCase = 0;

  const items = document.querySelectorAll('.level-item');
  items.forEach((item, i) => item.classList.toggle('active', i === idx));

  updateCaseView();
}

function selectCase(caseIdx) {
  currentCase = caseIdx;
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach((tab, i) => tab.classList.toggle('active', i === caseIdx));
  updateCaseView();
}

function updateCaseView() {
  const caseData = levelsData[currentLevel].cases[currentCase];
  document.getElementById('case-title').innerText = caseData.title;
  document.getElementById('pre-learning-text').innerText = caseData.preLearning;
  document.getElementById('situation-text').innerText = caseData.situation;
  document.getElementById('hint-text').innerText = caseData.hint;
  
  const termOut = document.getElementById('term-output');
  termOut.innerHTML = `CYBERHUNT Forensic Shell v2.4 initialized.<br>Awaiting input for ${caseData.title}...`;
}

// TERMINAL INPUT HANDLER
function handleTerminalSubmit(e) {
  if (e.key === 'Enter') {
    const input = document.getElementById('term-input');
    const val = input.value.trim();
    const caseData = levelsData[currentLevel].cases[currentCase];
    const termOut = document.getElementById('term-output');

    if (val.toLowerCase() === caseData.solution.toLowerCase()) {
      termOut.innerHTML += `<br><span style="color: var(--green);">[SUCCESS] Threat resolved! Passcode matched.</span>`;
      unlockedBadges.add(currentLevel);
      document.getElementById(`badge-${currentLevel}`).classList.add('unlocked');
    } else {
      termOut.innerHTML += `<br><span style="color: var(--red);">[ERROR] Solution incorrect. Check clues dossier.</span>`;
    }
    input.value = '';
  }
}

// TOGGLE CLUE DRAWER
function toggleClues() {
  document.getElementById('clue-drawer').classList.toggle('open');
}
