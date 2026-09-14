/* ==========================================================================
   CYBERHUNT // ENTERPRISE SOC ACADEMY - ENGINE & DATA
   ========================================================================== */

let currentScore = 0;
let earnedBadges = [];
let activeCase = 0;
let activeLevel = 0;

// 5 CYBER INCIDENT CASES (INCLUDES PRE-LEARNING LESSONS, DECODING & QUIZZES)
const cases = [
  {
    title: "INCIDENT #01: SPEAR PHISHING & RECON",
    badge: "SPEAR-PHISH ANALYST BADGE",
    badgeIcon: "🕵️‍♂️",
    levels: [
      { 
        title: "L1: Base64 Email Header Analysis", 
        lessonTitle: "📖 PRE-LEARNING: Base64 Encoding Structure",
        lessonText: "Base64 encodes binary data into ASCII characters for mail protocols. Base64 strings end with '=' padding. To decode string evidence in your console, execute: <code>decode &lt;Base64Text&gt;</code>.",
        desc: "Decode the suspicious Base64 encoded sender verification string.", 
        evidence: "Header: Q3liZXJIdW50LVBocmlzaC1DZXJ0", 
        target: "CyberHunt-Phrish-Cert", 
        hint: "Run: decode Q3liZXJIdW50LVBocmlzaC1DZXJ0" 
      },
      { 
        title: "L2: Unmasking C2 Domains via ROT13", 
        lessonTitle: "📖 PRE-LEARNING: ROT13 Cipher Substitution",
        lessonText: "ROT13 rotates alphabet characters by 13 positions (A ➔ N). Malware authors use ROT13 to hide Command & Control (C2) domains from basic filters. Use: <code>rot13 &lt;Text&gt;</code>.",
        desc: "Unmask the obfuscated C2 domain address.", 
        evidence: "Domain: flevag-freire.lqf", 
        target: "srient-server.yds", 
        hint: "Run: rot13 flevag-freire.lqf" 
      },
      { 
        title: "L3: External IP Log Filtering", 
        lessonTitle: "📖 PRE-LEARNING: Public vs Private IP Traffic",
        lessonText: "Internal networks use reserved ranges (10.x.x.x, 192.168.x.x). External public traffic (e.g., TOR exit nodes like 185.x.x.x) highlights external command links.",
        desc: "Filter the connection log and identify the external malicious TOR IP address.", 
        evidence: "Log Data: 192.168.1.10, 10.0.2.15, 185.220.101.5", 
        target: "185.220.101.5", 
        hint: "Locate the external public IP address." 
      },
      { 
        title: "L4: Malware Hash Fingerprinting", 
        lessonTitle: "📖 PRE-LEARNING: MD5 Signature Prefixes",
        lessonText: "Files are fingerprinted using cryptographic hashes. Incident response teams match hash prefixes (such as 0xDEAD) to pinpoint infected files.",
        desc: "Identify the infected system executable matching target hash prefix 0xDEAD.", 
        evidence: "Hashes: app1:0xA91, dropper:0xDEADBEEF, service:0xCB9", 
        target: "dropper", 
        hint: "Submit the file name associated with 0xDEADBEEF." 
      },
      { 
        title: "L5: Caesar Shift Override", 
        lessonTitle: "📖 PRE-LEARNING: Caesar Shift Decryption",
        lessonText: "Caesar ciphers shift characters by a fixed value. If a string is shifted +3 positions down the alphabet, reverse it (-3 positions) to reveal the original password key.",
        desc: "Decrypt the shifted system password key string by shifting back 3 positions.", 
        evidence: "Encrypted Key: EDEF", 
        target: "BABC", 
        hint: "E-3 = B, D-3 = A, E-3 = B, F-3 = C." 
      }
    ],
    questions: [
      { q: "1. What padding character identifies Base64 strings?", opts: ["=", "#", "$"], correct: 0 },
      { q: "2. How many alphabet places does ROT13 substitute?", opts: ["5 positions", "13 positions", "26 positions"], correct: 1 },
      { q: "3. Which range represents a public external IP address?", opts: ["192.168.1.1", "10.0.0.1", "185.220.101.5"], correct: 2 }
    ]
  },
  {
    title: "INCIDENT #02: DRONE FIRMWARE HIJACK",
    badge: "DRONE FORENSICS BADGE",
    badgeIcon: "🛸",
    levels: [
      { 
        title: "L1: Base64 Telemetry Extraction", 
        lessonTitle: "📖 PRE-LEARNING: Telemetry Payload Analysis",
        lessonText: "Flight logs encode binary sensor coordinates in Base64 strings to reduce packet errors during transfer. Decode telemetry payloads with: <code>decode &lt;string&gt;</code>.",
        desc: "Decode the intercepted drone telemetry flight header.", 
        evidence: "Telemetry: RExPTkUtSElJQ0UtMjAyNg==", 
        target: "DRONE-HIJACK-2026", 
        hint: "Run: decode RExPTkUtSElJQ0UtMjAyNg==" 
      },
      { 
        title: "L2: RAM Dump Process ID Inspection", 
        lessonTitle: "📖 PRE-LEARNING: Memory Process Isolation",
        lessonText: "Process IDs (PIDs) isolate active execution threads in memory dumps. SOC analysts locate rogue backdoors by matching PID tags in RAM dumps.",
        desc: "Analyze the RAM dump snippet and submit the active backdoor PID.", 
        evidence: "RAM Dump: system=12, network=88, rogue_backdoor=9942", 
        target: "9942", 
        hint: "Enter the numerical PID linked to rogue_backdoor." 
      },
      { 
        title: "L3: Unmasking Firmware Passkeys", 
        lessonTitle: "📖 PRE-LEARNING: Obfuscated Firmware Keys",
        lessonText: "Attackers obfuscate root firmware strings using ROT13 ciphers to hinder live inspection. Run: <code>rot13 &lt;string&gt;</code> to reveal hidden passkeys.",
        desc: "Decrypt the drone's obfuscated firmware administrative key.", 
        evidence: "Encrypted Key: qebar-eebg-cnef", 
        target: "drone-root-pars", 
        hint: "Run: rot13 qebar-eebg-cnef" 
      },
      { 
        title: "L4: Hexadecimal Coordinate Conversion", 
        lessonTitle: "📖 PRE-LEARNING: Hexadecimal Notation",
        lessonText: "Hexadecimal (Base-16) represents data using 0-9 and A-F. Forensic logs present raw location registers in Hexadecimal format (e.g. 0x344E = 13390 Decimal).",
        desc: "Extract the decimal coordinate value matching Hex 0x344E.", 
        evidence: "Hex Log: 0x344E (Decimal Equivalent: 13390)", 
        target: "13390", 
        hint: "Submit the decimal integer value: 13390." 
      },
      { 
        title: "L5: Emergency Protocol Injection", 
        lessonTitle: "📖 PRE-LEARNING: Signal Neutralization",
        lessonText: "When airborne assets are compromised, injecting hardcoded fail-safe override strings forces automated safety landing routines.",
        desc: "Submit the emergency fail-safe override command string.", 
        evidence: "Override Token: SAFEMODE_ENABLE", 
        target: "SAFEMODE_ENABLE", 
        hint: "Submit the string: SAFEMODE_ENABLE" 
      }
    ],
    questions: [
      { q: "1. What is the decimal value of Hexadecimal 0x344E?", opts: ["10000", "13390", "9942"], correct: 1 },
      { q: "2. Why is telemetry data Base64 encoded before transmission?", opts: ["To prevent payload transmission errors", "To increase file size", "To encrypt text"], correct: 0 },
      { q: "3. What does PID stand for in RAM dump analysis?", opts: ["Private IP Domain", "Process Identifier", "Protocol ID"], correct: 1 }
    ]
  },
  {
    title: "INCIDENT #03: INSIDER VAULT EXFILTRATION",
    badge: "VAULT GUARDIAN BADGE",
    badgeIcon: "💎",
    levels: [
      { 
        title: "L1: Off-Hours Auth Log Inspection", 
        lessonTitle: "📖 PRE-LEARNING: Insider Threat Detection",
        lessonText: "Authentication servers track access timestamps. Midnight log entries outside of shift schedules flag potential insider threat activity.",
        desc: "Identify the rogue employee ID logged during off-hours access.", 
        evidence: "Auth Log: 00:04:12 AM - ACCESS GRANTED: USER: EMP_8832", 
        target: "EMP_8832", 
        hint: "Submit employee badge format EMP_8832." 
      },
      { 
        title: "L2: Decrypting Exfiltrated Strings", 
        lessonTitle: "📖 PRE-LEARNING: DLP Evasion Bypass",
        lessonText: "Data Loss Prevention (DLP) tools scan network borders. Insiders rotate sensitive payload strings via ROT13 to evade text filters.",
        desc: "Decrypt the exfiltrated database vault payload string.", 
        evidence: "Encrypted Payload: fleqx_iina_xrl", 
        target: "cldx_fina_key", 
        hint: "Run: rot13 fleqx_iina_xrl" 
      },
      { 
        title: "L3: Crypto Wallet Address Hash", 
        lessonTitle: "📖 PRE-LEARNING: Base64 Hash Unpacking",
        lessonText: "Exfiltrated ledger addresses are frequently wrapped in Base64 strings. Execute <code>decode &lt;hash&gt;</code> to expose payout wallet addresses.",
        desc: "Decode the destination cryptocurrency payout wallet hash.", 
        evidence: "Wallet Payload: MHhGNzg5QUJDRUZFRg==", 
        target: "0xF789ABCEFEF", 
        hint: "Run: decode MHhGNzg5QUJDRUZFRg==" 
      },
      { 
        title: "L4: Rogue Backdoor Port Scan", 
        lessonTitle: "📖 PRE-LEARNING: Network Port Analysis",
        lessonText: "Standard ports handle standard traffic (Port 80 = HTTP, Port 22 = SSH). High unassigned ports (e.g., Port 31337) indicate open backdoor trojans.",
        desc: "Identify the unauthorized backdoor network port.", 
        evidence: "Port Status: 22(Closed), 80(Open), 31337(BACKDOOR)", 
        target: "31337", 
        hint: "Submit the unauthorized high backdoor port." 
      },
      { 
        title: "L5: Enterprise Session Lockdown", 
        lessonTitle: "📖 PRE-LEARNING: Incident Containment Strategy",
        lessonText: "When exfiltration is detected, issuing a global system lockdown revokes all active corporate token credentials immediately.",
        desc: "Submit the emergency system lockdown command.", 
        evidence: "Lockdown Command: LOCKDOWN_SYSTEM_NOW", 
        target: "LOCKDOWN_SYSTEM_NOW", 
        hint: "Submit: LOCKDOWN_SYSTEM_NOW" 
      }
    ],
    questions: [
      { q: "1. Which port standard handles unencrypted HTTP web traffic?", opts: ["Port 80", "Port 22", "Port 31337"], correct: 0 },
      { q: "2. Why do threat actors obfuscate payloads prior to exfiltration?", opts: ["To speed transfer", "To bypass automated DLP scanners", "To delete local logs"], correct: 1 },
      { q: "3. What is the immediate goal of session containment?", opts: ["Delete hard drives", "Halt unauthorized access and data loss", "Change terminal colors"], correct: 1 }
    ]
  },
  {
    title: "INCIDENT #04: RANSOMWARE PRE-EXECUTION",
    badge: "RANSOMWARE RESPONSE BADGE",
    badgeIcon: "☣️",
    levels: [
      { 
        title: "L1: Suspicious Script Extension Filtering", 
        lessonTitle: "📖 PRE-LEARNING: Double File Extension Tricks",
        lessonText: "Ransomware droppers often use double extensions (e.g. invoice.pdf.exe) to trick users. Security filters flag the true trailing extension.",
        desc: "Locate the true malicious double-extension payload file in the directory dump.", 
        evidence: "Files: document.pdf, report.docx, invoice.pdf.exe", 
        target: "invoice.pdf.exe", 
        hint: "Submit the full executable file name." 
      },
      { 
        title: "L2: Decrypting Ransom Note Master Key", 
        lessonTitle: "📖 PRE-LEARNING: Ransom Note Decoding",
        lessonText: "Early ransomware variants store secondary decrypt keys directly in Base64 configuration strings inside note footers.",
        desc: "Decode the embedded master recovery key from the ransomware header.", 
        evidence: "Key Payload: Rk9SRU5TSUMtREVDUllBVC0yMDI2", 
        target: "FORENSIC-DECRYPT-2026", 
        hint: "Run: decode Rk9SRU5TSUMtREVDUllBVC0yMDI2" 
      },
      { 
        title: "L3: Identifying Shadow Copy Removal", 
        lessonTitle: "📖 PRE-LEARNING: Shadow Copy Deletion Logs",
        lessonText: "Ransomware scripts run <code>vssadmin delete shadows</code> to prevent system restores. SOC filters search command execution history for keywords.",
        desc: "Identify the critical administrative utility command targeted by the dropper script.", 
        evidence: "Command Execution: cmd.exe /c vssadmin delete shadows /all /quiet", 
        target: "vssadmin", 
        hint: "Submit the utility name: vssadmin" 
      },
      { 
        title: "L4: ROT13 Persistence Registry Keys", 
        lessonTitle: "📖 PRE-LEARNING: Registry Persistence Keys",
        lessonText: "Malware writes startup registry entries under Windows Run keys, using ROT13 strings to conceal application paths.",
        desc: "Decrypt the obfuscated Windows Registry startup key.", 
        evidence: "Registry Entry: ftsfgeXrl_Eha_Ebc", 
        target: "sysstrKey_Run_Epc", 
        hint: "Run: rot13 ftsfgeXrl_Eha_Ebc" 
      },
      { 
        title: "L5: Master Neutralization Key", 
        lessonTitle: "📖 PRE-LEARNING: Ransomware Kill-Switches",
        lessonText: "Some ransomware strains inspect hardcoded domain parameters before encrypting. Registering or submitting kill-switch strings halts execution.",
        desc: "Submit the verified kill-switch string to disarm the encryption routine.", 
        evidence: "Kill Switch: DISABLE_ENCRYPTION_ENGINE", 
        target: "DISABLE_ENCRYPTION_ENGINE", 
        hint: "Submit: DISABLE_ENCRYPTION_ENGINE" 
      }
    ],
    questions: [
      { q: "1. Why do malware droppers utilize double file extensions?", opts: ["To fool users into thinking executable files are documents", "To shrink files", "To improve execution speed"], correct: 0 },
      { q: "2. Why does ransomware attempt to delete Volume Shadow Copies?", opts: ["To speed up Windows", "To prevent users from restoring files for free", "To clear disk space"], correct: 1 },
      { q: "3. What is a malware kill-switch?", opts: ["A hardware power button", "A condition that halts malicious execution when triggered", "An antivirus update"], correct: 1 }
    ]
  },
  {
    title: "INCIDENT #05: SUPPLY CHAIN ZERO-DAY",
    badge: "SUPPLY CHAIN GUARDIAN BADGE",
    badgeIcon: "🛡️",
    levels: [
      { 
        title: "L1: Vendor Dependency Hash Verification", 
        lessonTitle: "📖 PRE-LEARNING: Software Bill of Materials (SBOM)",
        lessonText: "Supply chain attacks tamper with third-party software libraries. Security tools check MD5 hashes against trusted vendor manifest records.",
        desc: "Identify the tampered software library file with a hash matching 0xBAD.", 
        evidence: "Packages: lib_core:0xA1, lib_net:0xBAD000, lib_crypto:0xF9", 
        target: "lib_net", 
        hint: "Submit the package name associated with 0xBAD000." 
      },
      { 
        title: "L2: Base64 Certificate Decoding", 
        lessonTitle: "📖 PRE-LEARNING: Compromised Code Signing Certificates",
        lessonText: "Compromised code-signing certificates validate fake software updates. Decoding X.509 certificate headers reveals issuing authorities.",
        desc: "Decode the rogue code-signing certificate authority issuer.", 
        evidence: "Cert String: Uk9HVUUtQ0EtU1VQUExZLVpFUk8=", 
        target: "ROGUE-CA-SUPPLY-ZERO", 
        hint: "Run: decode Uk9HVUUtQ0EtU1VQUExZLVpFUk8=" 
      },
      { 
        title: "L3: Malicious DLL Injection Search", 
        lessonTitle: "📖 PRE-LEARNING: DLL Side-Loading",
        lessonText: "Attackers place rogue dynamic-link libraries (.dll) alongside legitimate binaries. Console tool <code>grep &lt;pattern&gt;</code> filters process loads.",
        desc: "Filter process load logs and submit the name of the rogue injected DLL.", 
        evidence: "Loaded Libraries: kernel32.dll, user32.dll, payload_hook.dll", 
        target: "payload_hook.dll", 
        hint: "Submit the suspicious non-standard DLL payload file name." 
      },
      { 
        title: "L4: ROT13 Supply Chain API Key", 
        lessonTitle: "📖 PRE-LEARNING: Hardcoded API Credentials",
        lessonText: "Hardcoded API keys inside update binaries can leak access to third-party build servers when decrypted.",
        desc: "Decrypt the ROT13 obfuscated build-server API key.", 
        evidence: "API Key: ohvyq_freire_vagrtengvba", 
        target: "build_server_integration", 
        hint: "Run: rot13 ohvyq_freire_vagrtengvba" 
      },
      { 
        title: "L5: Enterprise Pipeline Isolation", 
        lessonTitle: "📖 PRE-LEARNING: CI/CD Pipeline Isolation",
        lessonText: "Isolating compromised continuous integration (CI/CD) update pipelines stops poisoned software updates from deploying to clients.",
        desc: "Execute the global pipeline quarantine command string.", 
        evidence: "Quarantine Token: QUARANTINE_PIPELINE_NOW", 
        target: "QUARANTINE_PIPELINE_NOW", 
        hint: "Submit: QUARANTINE_PIPELINE_NOW" 
      }
    ],
    questions: [
      { q: "1. What is the primary focus of Software Bill of Materials (SBOM) audits?", opts: ["Tracking vendor software components and dependencies", "Designing app logos", "Speeding up internet connections"], correct: 0 },
      { q: "2. What is DLL side-loading?", opts: ["Tricking legitimate apps into loading malicious DLL files", "Deleting system files", "Encrypting database tables"], correct: 0 },
      { q: "3. What is the first step in containing a supply-chain breach?", opts: ["Quarantine affected build pipelines and updates", "Reinstall client operating systems", "Ignore alerting systems"], correct: 0 }
    ]
  }
];

// Audio Feedback System
const ctx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(freq = 600, duration = 0.08) {
  if (ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine'; 
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain); 
  gain.connect(ctx.destination);
  osc.start(); 
  osc.stop(ctx.currentTime + duration);
}

// Intro Typewriter
const introText = "WELCOME TO CYBERHUNT ACADEMY. Master digital forensics, investigate active cyber incident vectors, decode evidence payloads in the interactive CLI, and test your skills with official case assessments...";
let introIdx = 0;

function typeIntro() {
  const element = document.getElementById('typewriter-body');
  if (element && introIdx < introText.length) {
    element.innerHTML += introText.charAt(introIdx);
    introIdx++; 
    setTimeout(typeIntro, 20);
  }
}

window.onload = () => { 
  init3D(); 
  typeIntro(); 
};

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

function loadLevel() {
  const caseData = cases[activeCase];
  const levelData = caseData.levels[activeLevel];

  for (let i = 1; i <= 5; i++) {
    const step = document.querySelector(`.step-${i}`);
    if (step) {
      if (i <= activeLevel + 1) step.classList.add('active');
      else step.classList.remove('active');
    }
  }

  document.getElementById('lesson-title').innerText = levelData.lessonTitle;
  document.getElementById('lesson-text').innerHTML = levelData.lessonText;

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
    playBeep(1200, 0.15);
    currentScore += 100;
    document.getElementById('score').innerText = currentScore;
    
    if (activeLevel < 4) {
      activeLevel++;
      alert("LEVEL CLEAR (+100 PTS)\nAdvancing to next stage...");
      loadLevel();
    } else {
      checkCaseCompletion();
    }
  } else {
    playBeep(200, 0.25);
    alert("INCORRECT SOLUTION: Target string mismatch. Check the pre-learning lesson or use terminal decode tools.");
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
          btn.style.background = 'rgba(16, 185, 129, 0.2)';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#ffffff';
          btn.innerText = "✓ " + opt + " (+50 PTS)";
          currentScore += 50;
          document.getElementById('score').innerText = currentScore;
        } else {
          playBeep(200);
          btn.style.background = 'rgba(225, 29, 72, 0.2)';
          btn.style.borderColor = '#e11d48';
          btn.innerText = "✗ " + opt;
        }

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
    document.getElementById('badges-count').innerText = `${earnedBadges.length}/5`;
  }
  document.getElementById('badge-graphic').innerText = cases[activeCase].badgeIcon;
  document.getElementById('badge-name').innerText = cases[activeCase].badge;
  document.getElementById('badge-desc').innerText = `You completed all 5 forensic stages, decoded all target payloads, and passed the official case assessment for ${cases[activeCase].title}!`;
  document.getElementById('modal-badge').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal-badge').style.display = 'none';
  switchScreen('screen-dashboard');
}

// Terminal CLI Logic
function handleTermKey(e) { 
  if (e.key === 'Enter') runCommand(); 
}

function runCommand() {
  playBeep(900, 0.04);
  const inputEl = document.getElementById('term-input');
  const cmd = inputEl.value.trim();
  const termOut = document.getElementById('term-out');
  if (!cmd) return;

  const line = document.createElement('div');
  line.innerHTML = `<span style="color:var(--accent-red);">> ${cmd}</span>`;
  termOut.appendChild(line);

  const parts = cmd.split(' ');
  const action = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ');

  let resp = "";
  if (action === 'decode') {
    try { 
      resp = "DECODED OUTPUT: " + atob(arg); 
    } catch(e) { 
      resp = "ERROR: Invalid Base64 payload string."; 
    }
  } else if (action === 'rot13') {
    resp = "ROT13 DECODED: " + arg.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));
  } else if (action === 'grep') {
    resp = "GREP SEARCH FOUND: " + arg;
  } else if (action === 'help') {
    resp = "CLI TOOLS: decode <base64>, rot13 <text>, grep <pattern>";
  } else {
    resp = "UNKNOWN COMMAND. Type 'help' for tool syntax.";
  }

  const respLine = document.createElement('div');
  respLine.innerText = resp;
  termOut.appendChild(respLine);
  termOut.scrollTop = termOut.scrollHeight;
  inputEl.value = '';
}

// Three.js Background Component
function init3D() {
  const container = document.getElementById('canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const geo = new THREE.IcosahedronGeometry(4, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0xe11d48, wireframe: true, transparent: true, opacity: 0.3 });
  const core = new THREE.Mesh(geo, mat);
  scene.add(core);

  const pGeo = new THREE.BufferGeometry();
  const pCount = 250;
  const posArray = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 30;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.05, color: 0xe11d48 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  camera.position.z = 8;

  function animate() {
    requestAnimationFrame(animate);
    core.rotation.x += 0.002;
    core.rotation.y += 0.003;
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
