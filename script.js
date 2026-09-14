// DATA MODEL: 10 CASE STUDY LEVELS
const caseStudies = [
  {
    level: 1,
    title: "Diagnostic AI in Clinical Triaging",
    domain: "Healthcare AI",
    difficulty: "Beginner",
    scenario: "Hospital X deployed an AI-driven triage system to rank emergency room arrivals. After three months, clinical staff noticed that elderly patients with non-standard symptoms of myocardial infarction were consistently assigned lower urgency scores than younger demographics displaying textbook symptoms.",
    hints: [
      "Examine how the training data defines 'ground truth' for cardiac events.",
      "Consider demographic representation biases in historical clinical trial data."
    ],
    explanation: "The algorithm was trained on historical EHR data where atypical cardiac presentations in elderly patients were frequently miscoded or delayed in diagnosis. The model learned historical diagnostic delays as actual lower clinical urgency.",
    studies: [
      { title: "Dissecting Bias in Clinical Algorithms", authors: "Obermeyer et al. (2019)", summary: "Demonstrated how algorithmic reliance on health cost proxies introduced racial bias in medical access." }
    ]
  },
  {
    level: 2,
    title: "Automated Supply Chain Route Optimization",
    domain: "Logistics",
    difficulty: "Beginner",
    scenario: "A global logistics provider automated its dynamic routing. During peak weather events, the algorithm diverted 80% of freight through a single regional hub, creating a severe bottleneck that halted shipments nationwide.",
    hints: [
      "Check the optimization objective function—did it account for hub capacity limits?",
      "Analyze whether local path optimization considered global network load."
    ],
    explanation: "The routing model optimized strictly for minimal distance and toll costs without incorporating real-time dynamic queue capacity limits at transfer nodes.",
    studies: [
      { title: "Resilience in Autonomous Supply Chains", authors: "Ivanov & Dolgui (2020)", summary: "Analyzes systemic vulnerabilities when logistics algorithms optimize cost over redundancy." }
    ]
  },
  {
    level: 3,
    title: "Zero-Day Exploit Mitigation in Cloud Systems",
    domain: "Cybersecurity",
    difficulty: "Intermediate",
    scenario: "An enterprise platform detected anomalous outbound traffic from its containerized microservices. The intrusion detection system failed to flag the activity because payload signatures matched valid database backup commands.",
    hints: [
      "Distinguish between signature-based detection and behavioral anomaly detection.",
      "Review access controls and privilege escalation vectors within container networks."
    ],
    explanation: "The attackers executed a living-off-the-land (LotL) attack using standard administrative tools, bypassing traditional signature checks that only scan for malicious code binary profiles.",
    studies: [
      { title: "Detecting Living-off-the-Land Tactics", authors: "Hassan et al. (2020)", summary: "Explores behavioral graph analysis to detect malicious execution of legitimate software binaries." }
    ]
  },
  {
    level: 4,
    title: "Microservice Cascading Failures",
    domain: "Distributed Systems",
    difficulty: "Intermediate",
    scenario: "A minor network latency spike in an authentication service led to a full outage across an entire fintech infrastructure, causing API gateways to time out globally.",
    hints: [
      "Look into retry policies, exponential backoff, and circuit breaker patterns.",
      "Identify thread pool exhaustion points in downstream dependencies."
    ],
    explanation: "Without circuit breakers or bounded retries, upstream services bombarded the lagging auth service with exponential retries, completely exhausting thread pools across the application stack.",
    studies: [
      { title: "Patterns for Resilient Distributed Architectures", authors: "Nygard (2018)", summary: "Formalizes circuit breakers, bulkheads, and timeout boundaries in cloud computing." }
    ]
  },
  {
    level: 5,
    title: "Behavioral Dark Patterns in Fintech Micro-Lending",
    domain: "Behavioral Economics",
    difficulty: "Intermediate",
    scenario: "A lending app introduced automated balance top-ups. User default rates doubled over six months, primarily among low-income users who claimed they never explicitly requested loans.",
    hints: [
      "Analyze default options, interface architecture, and opt-out friction.",
      "Evaluate cognitive load during financial transaction confirmation flows."
    ],
    explanation: "Interface dark patterns—specifically pre-checked opt-in boxes and high-friction opt-out steps—exploited user status-quo bias, leading to unintentional debt accumulation.",
    studies: [
      { title: "Dark Patterns in Consumer Choice Architecture", authors: "Mathur et al. (2019)", summary: "Empirical study on how deceptive UX design manipulates consumer decision-making." }
    ]
  },
  {
    level: 6,
    title: "Climate Risk Underwriting Model Drift",
    domain: "Fintech & Insurtech",
    difficulty: "Advanced",
    scenario: "A property insurer's machine learning model approved long-term policies in coastal regions that suffered catastrophic flooding within two years, failing to predict historical anomalies.",
    hints: [
      "Evaluate non-stationary data distribution assumptions in climate models.",
      "Distinguish between stationary statistical modeling and climate projection shifts."
    ],
    explanation: "The model assumed statistical stationarity—that historical flood frequency accurately predicted future probability—ignoring non-linear climate acceleration trends.",
    studies: [
      { title: "Stationarity is Dead in Water Management", authors: "Milos et al. (2008)", summary: "Demonstrates why historical probability distributions fail under shifting environmental regimes." }
    ]
  },
  {
    level: 7,
    title: "Quantum Key Distribution Infrastructure Vulnerabilities",
    domain: "Quantum Computing",
    difficulty: "Advanced",
    scenario: "A secure communication link using Quantum Key Distribution (QKD) was compromised without triggering alarm thresholds for photon state disruption.",
    hints: [
      "Investigate physical layer side-channel attacks on QKD equipment.",
      "Consider detector blinding or optical pulse injection strategies."
    ],
    explanation: "Attackers executed a detector-blinding attack using high-power laser light, forcing the single-photon detectors into a classical linear mode without altering quantum error rates.",
    studies: [
      { title: "Eavesdropping on Commercial Quantum Cryptography", authors: "Lydersen et al. (2010)", summary: "Demonstrated complete vulnerability in production QKD hardware via detector control." }
    ]
  },
  {
    level: 8,
    title: "Algorithmic Bias in Resume Screening",
    domain: "HR & AI Ethics",
    difficulty: "Advanced",
    scenario: "A corporate resume screening tool consistently downgraded applicants from women's colleges, even when gender explicit markers were removed from profiles.",
    hints: [
      "Examine proxy variables that correlate strongly with protected attributes.",
      "Audit feature importance in deep learning embedders."
    ],
    explanation: "The model identified implicit proxy variables (e.g., specific sports, wording choices, and extra-curriculars) strongly correlated with demographic features in its historical training set.",
    studies: [
      { title: "Proxy Discrimination in Machine Learning", authors: "Datta et al. (2016)", summary: "Analyzes how indirect correlations perpetuate bias in automated decision systems." }
    ]
  },
  {
    level: 9,
    title: "Autonomous Vehicle Edge Case Liability",
    domain: "Autonomous Systems",
    difficulty: "Expert",
    scenario: "An autonomous vehicle swerved to avoid a fallen tree limb, moving into an oncoming lane and colliding with another vehicle. Sensors correctly identified all objects in real time.",
    hints: [
      "Review the utility function weighting for collision severity vs. lane discipline.",
      "Analyze multi-agent trajectory prediction under emergency constraints."
    ],
    explanation: "The motion planner prioritized immediate obstacle avoidance over spatial lane safety, weighting stationary object collision higher than potential oncoming traffic risk.",
    studies: [
      { title: "Ethical Trajectory Planning for Autonomous Vehicles", authors: "Goodall (2014)", summary: "Examines ethical algorithms and risk trade-off parameters during unavoidable crashes." }
    ]
  },
  {
    level: 10,
    title: "Neural Network Interpretability in High-Stakes Credit",
    domain: "Deep Learning & Finance",
    difficulty: "Expert",
    scenario: "A bank was penalized by regulators because its neural network credit approval system could not generate compliant adverse action explanations for denied loan applicants.",
    hints: [
      "Distinguish between global model explainability and local instance explanation (e.g., SHAP, LIME).",
      "Evaluate trade-offs between deep model capacity and legal explainability requirements."
    ],
    explanation: "Post-hoc explainability methods yielded inconsistent feature attribution scores across similar applicant profiles, violating regulatory requirements for clear, reproducible adverse action reasons.",
    studies: [
      { title: "The Mythos of Model Interpretability", authors: "Lipton (2018)", summary: "Critiques interpretability definitions and limitations in complex neural systems." }
    ]
  }
];

// STATE MANAGEMENT
let state = {
  currentLevel: 1,
  unlockedLevel: 1,
  completedLevels: new Set()
};

// DOM ELEMENTS
const loginOverlay = document.getElementById("loginOverlay");
const loginForm = document.getElementById("loginForm");
const appContainer = document.getElementById("appContainer");
const levelListNav = document.getElementById("levelListNav");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

// WORKSPACE ELEMENTS
const levelBreadcrumb = document.getElementById("levelBreadcrumb");
const difficultyBadge = document.getElementById("difficultyBadge");
const caseTitle = document.getElementById("caseTitle");
const caseDomain = document.getElementById("caseDomain");
const scenarioText = document.getElementById("scenarioText");
const hintsContainer = document.getElementById("hintsContainer");
const explanationText = document.getElementById("explanationText");
const studiesContainer = document.getElementById("studiesContainer");

// BUTTONS
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const completeBtn = document.getElementById("completeBtn");
const logoutBtn = document.getElementById("logoutBtn");

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});

function setupEventListeners() {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginOverlay.classList.add("hidden");
    appContainer.classList.remove("hidden");
    renderSidebar();
    loadLevel(state.currentLevel);
  });

  logoutBtn.addEventListener("click", () => {
    appContainer.classList.add("hidden");
    loginOverlay.classList.remove("hidden");
  });

  // Tab Switching Logic
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".pane").forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });

  prevBtn.addEventListener("click", () => {
    if (state.currentLevel > 1) {
      loadLevel(state.currentLevel - 1);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (state.currentLevel < state.unlockedLevel && state.currentLevel < 10) {
      loadLevel(state.currentLevel + 1);
    }
  });

  completeBtn.addEventListener("click", () => {
    state.completedLevels.add(state.currentLevel);
    if (state.currentLevel === state.unlockedLevel && state.unlockedLevel < 10) {
      state.unlockedLevel++;
    }
    updateProgress();
    renderSidebar();
    if (state.currentLevel < 10) {
      loadLevel(state.currentLevel + 1);
    }
  });
}

// RENDER SIDEBAR NAV
function renderSidebar() {
  levelListNav.innerHTML = "";

  caseStudies.forEach((cs) => {
    const item = document.createElement("div");
    const isLocked = cs.level > state.unlockedLevel;
    const isCompleted = state.completedLevels.has(cs.level);

    item.className = `level-item ${cs.level === state.currentLevel ? "active" : ""} ${isLocked ? "locked" : ""}`;

    item.innerHTML = `
      <span>Lvl ${cs.level}: ${cs.title.substring(0, 18)}...</span>
      ${isCompleted ? '<i class="fa-solid fa-circle-check" style="color: var(--accent-green)"></i>' : ""}
      ${isLocked ? '<i class="fa-solid fa-lock"></i>' : ""}
    `;

    if (!isLocked) {
      item.addEventListener("click", () => loadLevel(cs.level));
    }

    levelListNav.appendChild(item);
  });
}

// LOAD LEVEL CONTENT
function loadLevel(levelNum) {
  state.currentLevel = levelNum;
  const data = caseStudies.find((c) => c.level === levelNum);

  // Update Breadcrumbs & Badges
  levelBreadcrumb.textContent = `Level ${data.level} of 10`;
  difficultyBadge.textContent = data.difficulty;
  caseTitle.textContent = data.title;
  caseDomain.textContent = `Domain: ${data.domain}`;

  // Populate Tab 1: Scenario
  scenarioText.innerHTML = `<p>${data.scenario}</p>`;

  // Populate Tab 2: Hints
  hintsContainer.innerHTML = data.hints
    .map((h, i) => `<div class="hint-card"><strong>Hint ${i + 1}:</strong> ${h}</div>`)
    .join("");

  // Populate Tab 3: Explanation
  explanationText.innerHTML = `<p>${data.explanation}</p>`;

  // Populate Tab 4: Studies
  studiesContainer.innerHTML = data.studies
    .map(
      (s) => `
    <div class="study-card">
      <h4>${s.title}</h4>
      <div class="study-authors">${s.authors}</div>
      <p>${s.summary}</p>
    </div>
  `
    )
    .join("");

  // Navigation button states
  prevBtn.disabled = levelNum === 1;
  nextBtn.disabled = levelNum >= state.unlockedLevel || levelNum === 10;

  renderSidebar();
}

// UPDATE PROGRESS BAR
function updateProgress() {
  const percent = Math.round((state.completedLevels.size / 10) * 100);
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
}
