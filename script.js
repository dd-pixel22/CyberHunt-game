/* ==========================================================================
   CYBERHUNT // DIGITAL FORENSICS SOC - GAME ENGINE & SCRIPT
   ========================================================================== */

// --- GLOBAL GAME STATE ---
let currentScore = 0;
let earnedBadges = [];
let activeCase = 0;
let activeLevel = 0;

// --- CASE STUDIES & LEVEL DATA ---
const cases = [
  {
    title: "CASE #01: PHANTOM WIRE",
    badge: "🥇 PHANTOM HUNTER BADGE",
    badgeIcon: "🕵️‍♂️",
    levels: [
      { 
        title: "L1: Suspicious Header", 
        desc: "Inspect raw email payload for encoded Base64 sender.", 
        evidence: "Header: Q3liZXJIdW50LVBocmlzaC1DZXJ0", 
        target: "CyberHunt-Phrish-Cert", 
        hint: "Use CLI tool: decode <Base64String>" 
      },
      { 
        title: "L2: ROT13 C2 Trace", 
        desc: "The C2 domain is masked in ROT13.", 
        evidence: "Domain: flevag-freire.lqf", 
        target: "srient-server.yds", 
        hint: "Use CLI tool: rot13 <Text>" 
      },
      { 
        title: "L3: IP Location Search", 
        desc: "Search raw logs for malicious IP.", 
        evidence: "Log: 192.168.1.1, 10.0.4.12, 185.220.101.5", 
        target: "185.220.101.5", 
        hint: "Identify the external TOR exit node IP." 
      },
      { 
        title: "L4: Malware Hash Check", 
        desc: "Find corrupted file matching target hash MD5 prefix 0xDEAD.", 
        evidence: "Files: file1:0xA12, file2:0xDEADBEEF, file3:0xCB9", 
        target: "file2", 
        hint: "Look for file starting with 0xDEAD." 
      },
      { 
        title: "L5: Root Shell Access", 
        desc: "Crack root passcode string shift (3 characters down).", 
        evidence: "Pass: EDEF", 
        target: "BABC", 
        hint: "Shift characters backwards by 3." 
      }
    ],
    questions: [
      { q: "1. What protocol was compromised in L1?", opts: ["SMTP / Email", "FTP", "DNS"], correct: 0 },
      { q: "2. What cipher was used on C2 domain?", opts: ["Base64", "ROT13", "AES"], correct: 1 },
      { q: "3. What type of node was IP 185.220.101.5?", opts: ["Internal Gateway", "TOR Exit Node", "DNS Server"], correct: 1 }
    ]
  },
  {
    title: "CASE #02: DARK PAYLOAD",
    badge: "🛸 SKY FORENSICS BADGE",
    badgeIcon: "🛸",
    levels: [
      { 
        title: "L1: Drone Telemetry", 
        desc: "Decode intercepted drone flight Base64 telemetry.", 
        evidence: "Telemetry: RExPTkUtSElJQ0UtMjAyNg==", 
        target: "DRONE-HIJACK-2026", 
        hint: "Decode the Base64 string." 
      },
      { 
        title: "L2: Memory Dump Grep", 
        desc: "Find root process PID in memory dump.", 
        evidence: "PID_LIST: sys=12, net=88, backdoor=9942", 
        target: "9942", 
        hint: "Find PID associated with backdoor." 
      },
      { 
        title: "L3: Firmware Cipher", 
        desc: "Unmask drone firmware passkey using ROT13.", 
        evidence: "Firmware: qebar-eebg-cnef", 
        target: "drone-root-pars", 
        hint: "Apply ROT13 cipher to string." 
      },
      { 
        title: "L4: GPS Spoofing Coordinates", 
        desc: "Locate spoofed latitude coordinates in Hex.", 
        evidence: "Hex: 0x344E (Decimal 13390)", 
        target: "13390", 
        hint: "Convert Hex 0x344E to decimal or enter directly." 
      },
      { 
        title: "L5: Emergency Override", 
        desc: "Override drone self-destruct key.", 
        evidence: "Key: SAFEMODE_ENABLE", 
        target: "SAFEMODE_ENABLE", 
        hint: "Type exact key into Target Answer." 
      }
    ],
    questions: [
      { q: "1. What asset was targeted in Case 2?", opts: ["Hospital Grid", "Delivery Drone", "Crypto Vault"], correct: 1 },
      { q: "2. What PID was malicious?", opts: ["12", "88", "9942"], correct: 2 },
      { q: "3. How was telemetry recovered?", opts: ["Base64 Decode", "Port Scan", "SQL Injection"], correct: 0 }
    ]
  },
  {
    title: "CASE #03: SYNDICATE HEIST",
    badge: "💎 VAULT GUARDIAN BADGE",
    badgeIcon: "💎",
    levels: [
      { 
        title: "L1: Vault Access Log", 
        desc: "Find rogue employee ID in midnight login logs.", 
        evidence: "LOG: 00:00 - USER: EMP_8832_BADGE", 
        target: "EMP_8832", 
        hint: "Extract employee ID format EMP_XXXX." 
      },
      { 
        title: "L2: Decrypt Master Key", 
        desc: "Decrypt exfiltration payload using ROT13.", 
        evidence: "Payload: fleqx_iina_xrl", 
        target: "cldx_fina_key", 
        hint: "Run ROT13 on string." 
      },
      { 
        title: "L3: Crypto Wallet Trace", 
        desc: "Decode exfiltrated wallet hash Base64.", 
        evidence: "Hash: MHhGNzg5QUJDRUZFRg==", 
        target: "0xF789ABCEFEF", 
        hint: "Decode Base64 string." 
      },
      { 
        title: "L4: Port Scanner", 
        desc: "Identify open exfiltration backdoor port.", 
        evidence: "Ports: 22(Closed), 80(Open), 31337(BACKDOOR)", 
        target: "31337", 
        hint: "Select the unauthorized high port." 
      },
      { 
        title: "L5: Lockdown Command", 
        desc: "Execute system lockdown protocol.", 
        evidence: "Command: LOCKDOWN_SYSTEM_NOW", 
        target: "LOCKDOWN_SYSTEM_NOW", 
        hint: "Enter lockdown command string." 
      }
    ],
    questions: [
      { q: "1. What was the insider's Employee ID?", opts: ["EMP_8832", "EMP_1001", "EMP_9999"], correct: 0 },
      { q: "2. Which port hosted the backdoor?", opts: ["22", "80", "31337"], correct: 2 },
      { q: "3. What type of incident was Case 3?", opts: ["Insider Threat", "Phishing", "DDoS"], correct: 0 }
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
const introText = "Year 2026. Global neural networks are falling under silent attack. System breaches, ransomware threats, and encrypted insider leaks threaten critical infrastructure. As a CyberHunt Detective, your job is to inspect raw logs, decode threat payloads, and trace rogue agents before total system blackout...";
let introIdx = 0;

function typeIntro() {
  const element = document.getElementById('typewriter-body');
  if (element && introIdx < introText.length) {
    element.innerHTML += introText.charAt(introIdx);
    introIdx++; 
    setTimeout(typeIntro, 30);
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

// --- LEVEL MECHANICS ENGINE ---
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
      alert("LEVEL CLEARED! Advancing forensic investigation...");
      loadLevel();
    } else {
      checkCaseCompletion();
    }
  } else {
    playBeep(200, 0.3);
    alert("ACCESS DENIED: Incorrect forensic answer.");
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

// --- QUESTIONS ENGINE ---
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
        playBeep(700);
        if (oIdx === qObj.correct) {
          btn.classList.add('correct');
          currentScore += 50;
          document.getElementById('score').innerText = currentScore;
        } else {
          playBeep(200);
          btn.style.borderColor = 'red';
        }
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
  document.getElementById('badge-desc').innerText = `You successfully completed all 5 forensic levels and solved ${cases[activeCase].title}!`;
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
      resp = "DECODED: " + atob(arg); 
    } catch(e) { 
      resp = "ERROR: Invalid Base64 string."; 
    }
  } else if (action === 'rot13') {
    resp = "ROT13: " + arg.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));
  } else if (action === 'grep') {
    resp = "GREP MATCH FOUND: " + arg;
  } else if (action === 'help') {
    resp = "AVAILABLE TOOLS: decode <base64>, rot13 <text>, grep <pattern>";
  } else {
    resp = "UNKNOWN COMMAND. Type 'help' for tools.";
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

  // Rotating Wireframe Core
  const geo = new THREE.IcosahedronGeometry(4, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0xff003c, wireframe: true, transparent: true, opacity: 0.35 });
  const core = new THREE.Mesh(geo, mat);
  scene.add(core);

  // Starfield / Particle Nodes
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
