/* ==========================================================================
   CYBERHUNT // FORENSIC ACADEMY & QUIZ PLATFORM - GAME ENGINE
   ========================================================================== */

// --- GLOBAL GAME STATE ---
let currentScore = 0;
let earnedBadges = [];
let activeCase = 0;
let activeLevel = 0;

// --- CASES, LESSONS, FORENSICS & QUIZ DATA ---
const cases = [
  {
    title: "CASE #01: PHANTOM WIRE",
    badge: "🥇 PHANTOM HUNTER BADGE",
    badgeIcon: "🕵️‍♂️",
    levels: [
      { 
        title: "L1: Base64 Header Decoding", 
        lessonTitle: "📖 FORENSIC LESSON: Base64 Encoding",
        lessonText: "Base64 represents binary data in ASCII text. It always ends with '=' padding. To decode Base64 in your CLI, run the command: <code>decode &lt;Base64String&gt;</code>",
        desc: "Inspect the raw email payload below and decode the sender's Base64 header.", 
        evidence: "Header: Q3liZXJIdW50LVBocmlzaC1DZXJ0", 
        target: "CyberHunt-Phrish-Cert", 
        hint: "Type: decode Q3liZXJIdW50LVBocmlzaC1DZXJ0" 
      },
      { 
        title: "L2: ROT13 C2 Tracing", 
        lessonTitle: "📖 FORENSIC LESSON: ROT13 Substitution Cipher",
        lessonText: "ROT13 replaces a letter with the 13th letter after it in the alphabet (e.g., A ➔ N). To unmask ROT13 text in your CLI, run: <code>rot13 &lt;Text&gt;</code>",
        desc: "The Command & Control (C2) server domain is obfuscated in ROT13. Unmask it.", 
        evidence: "Domain: flevag-freire.lqf", 
        target: "srient-server.yds", 
        hint: "Type: rot13 flevag-freire.lqf" 
      },
      { 
        title: "L3: Network IP Analysis", 
        lessonTitle: "📖 FORENSIC LESSON: IP Log Filtering",
        lessonText: "Attackers often route traffic through public TOR exit nodes (like 185.x.x.x) rather than local IP blocks (192.168.x.x or 10.x.x.x). To search logs, use: <code>grep &lt;pattern&gt;</code>",
        desc: "Examine the network log below and submit the malicious external TOR IP address.", 
        evidence: "Log: 192.168.1.1, 10.0.4.12, 185.220.101.5", 
        target: "185.220.101.5", 
        hint: "Identify the external public IP address." 
      },
      { 
        title: "L4: Malware MD5 Hash Filtering", 
        lessonTitle: "📖 FORENSIC LESSON: File Signatures & Hashes",
        lessonText: "File hashes act as unique digital fingerprints. Security teams filter logs by matching hash prefixes (e.g., 0xDEAD) to locate infected executables.",
        desc: "Identify the corrupted file that matches the target hash prefix 0xDEAD.", 
        evidence: "Files: file1:0xA12, file2:0xDEADBEEF, file3:0xCB9", 
        target: "file2", 
        hint: "Look for the filename associated with 0xDEADBEEF." 
      },
      { 
        title: "L5: Caesar Shift Override", 
        lessonTitle: "📖 FORENSIC LESSON: Caesar Cipher Shifts",
        lessonText: "A Caesar Cipher shifts each character by a set number of positions in the alphabet. If a passcode is shifted 3 characters down (+3), shift it backward (-3) to crack it (e.g., E ➔ B, D ➔ A).",
        desc: "Crack the root passcode string by shifting each letter backward by 3 positions.", 
        evidence: "Passcode String: EDEF", 
        target: "BABC", 
        hint: "E-3 = B, D-3 = A, E-3 = B, F-3 = C." 
      }
    ],
    questions: [
      { q: "1. What padding character is commonly seen at the end of Base64 strings?", opts: ["=", "#", "$"], correct: 0 },
      { q: "2. How many alphabet positions does ROT13 shift each character?", opts: ["5", "13", "26"], correct: 1 },
      { q: "3. What type of IP address is 192.168.1.1?", opts: ["Public TOR Node", "Internal / Private IP", "DNS Root Server"], correct: 1 }
    ]
  },
  {
    title: "CASE #02: DARK PAYLOAD",
    badge: "🛸 SKY FORENSICS BADGE",
    badgeIcon: "🛸",
    levels: [
      { 
        title: "L1: Telemetry Payload Decoding", 
        lessonTitle: "📖 FORENSIC LESSON: Flight Telemetry Analysis",
        lessonText: "Drone telemetry protocols often compress transmission logs using Base64 strings. Decode them using <code>decode &lt;Base64&gt;</code> to retrieve drone identification strings.",
        desc: "Decode the intercepted drone flight telemetry payload below.", 
        evidence: "Telemetry: RExPTkUtSElJQ0UtMjAyNg==", 
        target: "DRONE-HIJACK-2026", 
        hint: "Run: decode RExPTkUtSElJQ0UtMjAyNg==" 
      },
      { 
        title: "L2: Memory Process Analysis", 
        lessonTitle: "📖 FORENSIC LESSON: Memory Forensics & PIDs",
        lessonText: "Process IDs (PIDs) identify active system tasks. Security tools search memory dumps using <code>grep &lt;keyword&gt;</code> to pinpoint rogue processes.",
        desc: "Analyze the RAM dump snippet below and enter the PID of the malicious backdoor.", 
        evidence: "PID_LIST: sys=12, net=88, backdoor=9942", 
        target: "9942", 
        hint: "Find the numerical PID paired with 'backdoor'." 
      },
      { 
        title: "L3: Unmasking Drone Firmware", 
        lessonTitle: "📖 FORENSIC LESSON: Firmware Obfuscation",
        lessonText: "Malware creators use lightweight ROT13 ciphers to hide firmware access keys inside system memory. Decode it using <code>rot13 &lt;string&gt;</code>.",
        desc: "Unmask the encrypted drone firmware root passkey.", 
        evidence: "Firmware Key: qebar-eebg-cnef", 
        target: "drone-root-pars", 
        hint: "Run: rot13 qebar-eebg-cnef" 
      },
      { 
        title: "L4: Hexadecimal Coordinate Conversion", 
        lessonTitle: "📖 FORENSIC LESSON: Hexadecimal Data Representation",
        lessonText: "Hexadecimal (Base-16) uses 0-9 and A-F. Forensic logs often display coordinates in Hex (e.g., 0x344E = 13390 in decimal).",
        desc: "Extract the spoofed latitude decimal coordinate matching Hex 0x344E.", 
        evidence: "Hex Log: 0x344E (Decimal Value: 13390)", 
        target: "13390", 
        hint: "Enter the decimal value provided in the log: 13390" 
      },
      { 
        title: "L5: System Override Injection", 
        lessonTitle: "📖 FORENSIC LESSON: Emergency Protocol Keys",
        lessonText: "When drones are hijacked, injecting exact hardcoded system override strings halts malicious commands instantly.",
        desc: "Execute the emergency safety override string to neutralize the drone attack.", 
        evidence: "Override Token: SAFEMODE_ENABLE", 
        target: "SAFEMODE_ENABLE", 
        hint: "Copy and submit the exact string SAFEMODE_ENABLE." 
      }
    ],
    questions: [
      { q: "1. What is the decimal representation of Hex 0x344E?", opts: ["10000", "13390", "9942"], correct: 1 },
      { q: "2. Which CLI command filters specific terms in log outputs?", opts: ["grep", "ping", "ssh"], correct: 0 },
      { q: "3. What does PID stand for in memory analysis?", opts: ["Protocol ID", "Process Identifier", "Private IP Domain"], correct: 1 }
    ]
  },
  {
    title: "CASE #03: SYNDICATE HEIST",
    badge: "💎 VAULT GUARDIAN BADGE",
    badgeIcon: "💎",
    levels: [
      { 
        title: "L1: Authentication Log Inspection", 
        lessonTitle: "📖 FORENSIC LESSON: Insider Threat Detection",
        lessonText: "Security Operations Centers (SOC) look for unexpected off-hours logins (e.g., midnight access) to identify rogue employee activity.",
        desc: "Locate the rogue employee ID inside the midnight authentication access log.", 
        evidence: "LOG: 00:00:12 AM - ACCESS GRANTED: USER: EMP_8832", 
        target: "EMP_8832", 
        hint: "Submit the employee badge ID format EMP_8832." 
      },
      { 
        title: "L2: Exfiltration Payload Decryption", 
        lessonTitle: "📖 FORENSIC LESSON: Decrypting Exfiltrated Strings",
        lessonText: "Data thieves obscure exfiltrated strings with ROT13 ciphers to bypass simple DLP (Data Loss Prevention) scanners.",
        desc: "Decrypt the exfiltrated vault payload string using the ROT13 tool.", 
        evidence: "Encrypted Payload: fleqx_iina_xrl", 
        target: "cldx_fina_key", 
        hint: "Run: rot13 fleqx_iina_xrl" 
      },
      { 
        title: "L3: Crypto Wallet Address Hash", 
        lessonTitle: "📖 FORENSIC LESSON: Blockchain Address Encoding",
        lessonText: "Exfiltrated crypto wallet addresses are typically Base64 encoded before outbound transfer to obscure destination addresses.",
        desc: "Decode the exfiltrated cryptocurrency wallet hash address.", 
        evidence: "Wallet Hash: MHhGNzg5QUJDRUZFRg==", 
        target: "0xF789ABCEFEF", 
        hint: "Run: decode MHhGNzg5QUJDRUZFRg==" 
      },
      { 
        title: "L4: Rogue Port Scan Detection", 
        lessonTitle: "📖 FORENSIC LESSON: Identifying Open Backdoors",
        lessonText: "Standard ports include 22 (SSH) and 80 (HTTP). High-numbered ports (like 31337) are frequently opened by malware as illicit backdoors.",
        desc: "Identify the suspicious backdoor network port opened by the attack payload.", 
        evidence: "Open Ports: 22(Closed), 80(Open), 31337(BACKDOOR)", 
        target: "31337", 
        hint: "Submit the unauthorized high-numbered backdoor port." 
      },
      { 
        title: "L5: SOC System Lockdown", 
        lessonTitle: "📖 FORENSIC LESSON: Incident Containment",
        lessonText: "Once an insider breach is verified, analysts issue a global system lockdown token to freeze all active session keys.",
        desc: "Issue the global lockdown system command token.", 
        evidence: "Lockdown String: LOCKDOWN_SYSTEM_NOW", 
        target: "LOCKDOWN_SYSTEM_NOW", 
        hint: "Submit: LOCKDOWN_SYSTEM_NOW" 
      }
    ],
    questions: [
      { q: "1. Which port is typically associated with standard HTTP web traffic?", opts: ["80", "22", "31337"], correct: 0 },
      { q: "2. Why do attackers obscure exfiltrated strings with ciphers?", opts: ["To speed up network bandwidth", "To bypass automated security filters", "To shrink file sizes"], correct: 1 },
      { q: "3. What is the primary purpose of incident containment?", opts: ["To delete all server logs", "To prevent further unauthorized access or data loss", "To change user background wallpapers"], correct: 1 }
    ]
  }
];

// --- AUDIO SYNTHESIS ENGINE ---
const ctx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(freq = 600, duration = 0.08) {
  if (ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine'; 
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain); 
  gain.connect(ctx.destination);
  osc.start(); 
  osc.stop(ctx.currentTime + duration);
}

// --- CINEMATIC INTRO TYPEWRITER EFFECT ---
const introText = "WELCOME TO CYBERHUNT ACADEMY // DIGITAL FORENSICS SOC. Master the fundamentals of cryptography, log analysis, and incident response. Learn core cybersecurity concepts, practice live terminal decoding, and solve real-world case quizzes...";
let introIdx = 0;

function typeIntro() {
  const element = document.getElementById('typewriter-body');
  if (element && introIdx < introText.length) {
    element.innerHTML += introText.charAt(introIdx);
    introIdx++; 
    setTimeout(typeIntro, 25);
  }
}

window.onload = () => { 
  init3D(); 
  typeIntro(); 
};

// --- NAVIGATION FUNCTIONS ---
function switchScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function initSOC() {
  playBeep(800);
  document.getElementById('hud').style.display = 'flex';
  switchScreen('screen-dashboard');
}

function startCase(idx) {
  playBeep(900);
  activeCase = idx;
  activeLevel = 0;
  document.getElementById('case-heading').innerText = cases[activeCase].title;
  loadLevel();
  loadQuestions();
  switchScreen('screen-case');
}

function exitToDashboard() {
  playBeep(400);
  switchScreen('screen-dashboard');
}

// --- LEVEL & LESSON ENGINE ---
function loadLevel() {
  const caseData = cases[activeCase];
  const levelData = caseData.levels[activeLevel];

  // Update Stepper Progress Bar
  for (let i = 1; i <= 5; i++) {
    const step = document.querySelector(`.step-${i}`);
    if (step) {
      if (i <= activeLevel + 1) step.classList.add('active');
      else step.classList.remove('active');
    }
  }

  // Load Lesson & Practice Data
  document.getElementById('lesson-title').innerText = levelData.lessonTitle;
  document.getElementById('lesson-text').innerHTML = levelData.lessonText;

  // Load Forensic Challenge Data
  document.getElementById('level-title').innerText = levelData.title;
  document.getElementById('level-desc').innerText = levelData.desc;
  document.getElementById('raw-evidence').innerText = levelData.evidence;
  document.getElementById('hint-display').style.display = 'none';
  document.getElementById('target-input').value = '';
}

function submitLevelAnswer() {
  const input = document.getElementById('target-input').value.trim();
  const levelData = cases[activeCase].levels[activeLevel];

  if (input.toLowerCase() === levelData.target.toLowerCase()) {
    playBeep(1200, 0.2);
    currentScore += 100;
    document.getElementById('score').innerText = currentScore;
    
    if (activeLevel < 4) {
      activeLevel++;
      alert("LEVEL CLEARED! +100 PTS\nAdvancing to next forensic module...");
      loadLevel();
    } else {
      checkCaseCompletion();
    }
  } else {
    playBeep(200, 0.3);
    alert("ACCESS DENIED: Answer does not match target output. Review the lesson or use CLI tool.");
  }
}

function revealHint() {
  playBeep(500);
  currentScore = Math.max(0, currentScore - 50);
  document.getElementById('score').innerText = currentScore;
  const hintBox = document.getElementById('hint-display');
  hintBox.innerText = "HINT: " + cases[activeCase].levels[activeLevel].hint;
  hintBox.style.display = 'block';
}

// --- QUIZ PLATFORM ENGINE ---
function loadQuestions() {
  const qContainer = document.getElementById('questions-container');
  qContainer.innerHTML = '';
  const qList = cases[activeCase].questions;

  qList.forEach((qObj) => {
    const qCard = document.createElement('div');
    qCard.className = 'quiz-card';
    qCard.innerHTML = `<div class="quiz-q">${qObj.q}</div>`;
    
    qObj.opts.forEach((opt, oIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.innerText = opt;
      btn.onclick = () => {
        if (btn.disabled) return;
        
        if (oIdx === qObj.correct) {
          playBeep(1000);
          btn.style.background = 'rgba(0, 255, 65, 0.2)';
          btn.style.borderColor = '#00ff41';
          btn.innerText = "✓ " + opt + " (+50 PTS)";
          currentScore += 50;
          document.getElementById('score').innerText = currentScore;
        } else {
          playBeep(200);
          btn.style.background = 'rgba(255, 0, 60, 0.2)';
          btn.style.borderColor = 'red';
          btn.innerText = "✗ " + opt;
        }

        // Disable options in this card after selection
        qCard.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);
      };
      qCard.appendChild(btn);
    });
    qContainer.appendChild(qCard);
  });
}

function checkCaseCompletion() {
  if (!earnedBadges.includes(activeCase)) {
    earnedBadges.push(activeCase);
    document.getElementById('badges-count').innerText = `${earnedBadges.length}/3`;
  }
  document.getElementById('badge-graphic').innerText = cases[activeCase].badgeIcon;
  document.getElementById('badge-name').innerText = cases[activeCase].badge;
  document.getElementById('badge-desc').innerText = `You mastered all training modules, decoded all 5 forensic levels, and passed the quiz assessment for ${cases[activeCase].title}!`;
  document.getElementById('modal-badge').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal-badge').style.display = 'none';
  switchScreen('screen-dashboard');
}

// --- INTERACTIVE CLI TERMINAL ENGINE ---
function handleTermKey(e) { 
  if (e.key === 'Enter') runCommand(); 
}

function runCommand() {
  playBeep(900, 0.05);
  const inputEl = document.getElementById('term-input');
  const cmd = inputEl.value.trim();
  const termOut = document.getElementById('term-out');
  if (!cmd) return;

  const line = document.createElement('div');
  line.innerHTML = `<span style="color:var(--red-primary);">> ${cmd}</span>`;
  termOut.appendChild(line);

  const parts = cmd.split(' ');
  const action = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ');

  let resp = "";
  if (action === 'decode') {
    try { 
      resp = "DECODED OUTPUT: " + atob(arg); 
    } catch(e) { 
      resp = "ERROR: Invalid Base64 string formatting."; 
    }
  } else if (action === 'rot13') {
    resp = "ROT13 OUTPUT: " + arg.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));
  } else if (action === 'grep') {
    resp = "GREP SEARCH FOUND: " + arg;
  } else if (action === 'help') {
    resp = "CLI TOOLS: decode <base64>, rot13 <text>, grep <pattern>";
  } else {
    resp = "UNKNOWN COMMAND. Type 'help' for CLI tool commands.";
  }

  const respLine = document.createElement('div');
  respLine.innerText = resp;
  termOut.appendChild(respLine);
  termOut.scrollTop = termOut.scrollHeight;
  inputEl.value = '';
}

// --- THREE.JS WEBGL BACKGROUND ---
function init3D() {
  const container = document.getElementById('canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Wireframe Core
  const geo = new THREE.IcosahedronGeometry(4, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0xff003c, wireframe: true, transparent: true, opacity: 0.35 });
  const core = new THREE.Mesh(geo, mat);
  scene.add(core);

  // Particles
  const pGeo = new THREE.BufferGeometry();
  const pCount = 300;
  const posArray = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 30;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.05, color: 0xff003c });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  camera.position.z = 8;

  function animate() {
    requestAnimationFrame(animate);
    core.rotation.x += 0.003;
    core.rotation.y += 0.005;
    particles.rotation.y -= 0.001;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
