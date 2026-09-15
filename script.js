/* =========================================================
   CYBERHUNT — CYBERSECURITY STUDY PLATFORM
   Complete JavaScript
   ========================================================= */

const STORAGE_KEY = "cyberhuntStudyStateV4";
const SESSION_KEY = "cyberhuntLoggedIn";

const defaultState = {
    user: {
        name: "",
        email: ""
    },
    xp: 0,
    completedCases: [],
    completedLabs: [],
    quizBest: 0,
    quizAttemptAwarded: false,
    badges: [],
    aiHistory: [],
    streak: 1,
    currentSection: "dashboard"
};

let state = loadState();
let currentMaterial = null;
let currentCase = null;
let currentLab = null;

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (saved) {
            return {
                ...defaultState,
                ...saved,
                user: {
                    ...defaultState.user,
                    ...(saved.user || {})
                },
                completedCases: saved.completedCases || [],
                completedLabs: saved.completedLabs || [],
                badges: saved.badges || [],
                aiHistory: saved.aiHistory || []
            };
        }
    } catch (error) {
        console.log("Could not load saved state.");
    }

    return JSON.parse(JSON.stringify(defaultState));
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function $(id) {
    return document.getElementById(id);
}

function escapeHTML(text) {
    if (text === undefined || text === null) return "";

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showToast(message) {
    const toast = $("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* =========================================================
   MATERIALS
   ========================================================= */

const materials = [

{
    id: 1,
    level: "Foundation",
    title: "Cybersecurity Foundations",
    short: "Understand what cybersecurity protects and how defenders think.",
    detail: "Cybersecurity is the practice of protecting systems, networks, applications, devices and information from unauthorized access, misuse, disruption or destruction.",
    why: "Every security decision starts with understanding what needs protection and what could go wrong.",
    keys: [
        "Identify valuable assets",
        "Understand threats and vulnerabilities",
        "Apply security controls",
        "Monitor and respond to incidents"
    ],
    example: "A college protects its student database using authentication, access controls, backups and monitoring.",
    scenario: "A student receives an unexpected email asking for their university password. A security-aware student verifies the sender before clicking anything.",
    remember: "Protect assets → understand threats → reduce risk → monitor → respond.",
    tags: ["cybersecurity", "security", "basics", "foundation"]
},

{
    id: 2,
    level: "Foundation",
    title: "CIA Triad",
    short: "Learn Confidentiality, Integrity and Availability.",
    detail: "The CIA Triad is one of the most important foundations of information security. Confidentiality protects information from unauthorized access. Integrity protects information from unauthorized modification. Availability ensures authorized users can access systems and information when needed.",
    why: "Most security incidents can be understood by asking which part of CIA was affected.",
    keys: [
        "Confidentiality = secrecy",
        "Integrity = correctness",
        "Availability = accessibility"
    ],
    example: "Encryption helps confidentiality. Hashes can help detect integrity changes. Backups improve availability.",
    scenario: "An attacker changes marks stored in a university database. The primary security property affected is Integrity.",
    remember: "C = Can't see. I = Information isn't changed. A = Access when needed.",
    tags: ["cia", "confidentiality", "integrity", "availability"]
},

{
    id: 3,
    level: "Foundation",
    title: "Threats, Vulnerabilities & Risk",
    short: "Understand the difference between threat, vulnerability and risk.",
    detail: "A threat is something that can cause harm. A vulnerability is a weakness that can be exploited. Risk represents the possibility and impact of a threat exploiting a vulnerability.",
    why: "Security teams need to identify weaknesses and decide which risks deserve attention first.",
    keys: [
        "Threat = potential danger",
        "Vulnerability = weakness",
        "Risk = likelihood and impact"
    ],
    example: "An outdated server has a known vulnerability. An attacker represents a threat. The possibility of compromise creates risk.",
    scenario: "A company discovers that an internet-facing server is running outdated software with a known security weakness. The weakness is the vulnerability.",
    remember: "Threat uses a weakness. Weakness + threat creates risk.",
    tags: ["threat", "vulnerability", "risk"]
},

{
    id: 4,
    level: "Foundation",
    title: "Assets & Security Controls",
    short: "Learn what assets are and how controls protect them.",
    detail: "Assets include information, hardware, software, people and services that have value to an organization. Security controls are safeguards used to reduce security risk.",
    why: "You cannot protect something effectively unless you know what it is and why it matters.",
    keys: [
        "Assets have value",
        "Controls reduce risk",
        "Controls may be preventive, detective or corrective"
    ],
    example: "A database is an asset. Access control is a preventive control. Logging can be detective.",
    scenario: "A company installs MFA to reduce unauthorized account access. MFA is a security control.",
    remember: "Asset = what you protect. Control = how you protect it.",
    tags: ["assets", "controls", "security controls"]
},

{
    id: 5,
    level: "Foundation",
    title: "Authentication & Authorization",
    short: "Understand identity verification versus permission.",
    detail: "Authentication verifies who a user is. Authorization determines what an authenticated user is allowed to do.",
    why: "Confusing these concepts can lead to incorrect access-control designs.",
    keys: [
        "Authentication = Who are you?",
        "Authorization = What can you access?"
    ],
    example: "Logging in with a password is authentication. Being allowed to edit a file is authorization.",
    scenario: "A student successfully signs in but cannot access an administrator dashboard. Authentication succeeded while authorization denied access.",
    remember: "AUTHENTICATION = identity. AUTHORIZATION = permissions.",
    tags: ["authentication", "authorization", "access control"]
},

{
    id: 6,
    level: "Foundation",
    title: "Password Security & MFA",
    short: "Learn how strong authentication reduces account compromise.",
    detail: "Password security includes using long unique passwords, password managers and protection against credential attacks. Multi-factor authentication adds another verification factor beyond the password.",
    why: "Passwords can be stolen, guessed or reused. MFA reduces the impact of a stolen password.",
    keys: [
        "Use unique passwords",
        "Prefer long passwords",
        "Enable MFA",
        "Never share authentication codes"
    ],
    example: "A user enters a password and then approves a login using an authenticator app.",
    scenario: "An attacker obtains a user's password but cannot enter the account because MFA is enabled.",
    remember: "MFA = more than one type of proof.",
    tags: ["password", "mfa", "authentication"]
},

{
    id: 7,
    level: "Foundation",
    title: "Social Engineering & Phishing",
    short: "Recognize manipulation techniques used against people.",
    detail: "Social engineering attacks manipulate people into revealing information, clicking malicious links, transferring money or performing unsafe actions. Phishing is a common form of social engineering delivered through messages.",
    why: "Technical security controls cannot eliminate every human-targeted attack.",
    keys: [
        "Urgency is a warning sign",
        "Verify unexpected requests",
        "Inspect links carefully",
        "Never share passwords or OTPs"
    ],
    example: "An email claims your account will be deleted unless you immediately click a link.",
    scenario: "The message creates fear and urgency while asking for login information. This is a phishing attempt.",
    remember: "STOP → CHECK → VERIFY → THEN ACT.",
    tags: ["phishing", "social engineering", "email"]
},

{
    id: 8,
    level: "Foundation",
    title: "Malware Fundamentals",
    short: "Understand common malicious software categories.",
    detail: "Malware is software designed to perform unauthorized or harmful actions. Examples include viruses, worms, trojans, spyware and ransomware.",
    why: "Understanding malware behavior helps defenders recognize and contain incidents.",
    keys: [
        "Virus",
        "Worm",
        "Trojan",
        "Spyware",
        "Ransomware"
    ],
    example: "Ransomware encrypts files and demands payment from victims.",
    scenario: "Employees suddenly cannot open business files and see a ransom message. Ransomware is suspected.",
    remember: "Malware = malicious software.",
    tags: ["malware", "ransomware", "virus", "trojan"]
},

{
    id: 9,
    level: "Foundation",
    title: "Network Security Basics",
    short: "Learn how networks are protected.",
    detail: "Network security protects communication, devices and services from unauthorized activity. Important concepts include segmentation, secure protocols, firewalls, monitoring and access controls.",
    why: "Networks connect systems together, making them important security boundaries.",
    keys: [
        "Network segmentation",
        "Secure communication",
        "Firewalls",
        "Monitoring"
    ],
    example: "A company separates guest Wi-Fi from internal systems using network segmentation.",
    scenario: "Visitors should not be able to reach internal company servers. Network segmentation can reduce this risk.",
    remember: "Separate sensitive systems from untrusted networks.",
    tags: ["network", "network security", "segmentation"]
},

{
    id: 10,
    level: "Foundation",
    title: "Firewalls, IDS & IPS",
    short: "Understand three important defensive network technologies.",
    detail: "A firewall controls network traffic based on security rules. IDS detects suspicious activity and alerts defenders. IPS detects and can actively block suspicious traffic.",
    why: "These technologies help organizations control and monitor network activity.",
    keys: [
        "Firewall = traffic control",
        "IDS = detect and alert",
        "IPS = detect and block"
    ],
    example: "An IDS identifies suspicious traffic and sends an alert to the security team.",
    scenario: "A security tool detects an attack pattern and automatically blocks the traffic. This behavior is associated with an IPS.",
    remember: "IDS sees. IPS sees + stops.",
    tags: ["firewall", "ids", "ips", "network"]
},

{
    id: 11,
    level: "Intermediate",
    title: "Cryptography Basics",
    short: "Understand encryption and secure communication.",
    detail: "Cryptography uses mathematical techniques to protect information. Encryption transforms readable plaintext into ciphertext so unauthorized parties cannot easily understand it.",
    why: "Sensitive information often needs protection while stored or transmitted.",
    keys: [
        "Plaintext",
        "Ciphertext",
        "Encryption",
        "Decryption",
        "Keys"
    ],
    example: "HTTPS uses cryptographic mechanisms to protect web communication.",
    scenario: "A banking application protects data while it travels between the customer and server.",
    remember: "Encryption protects confidentiality.",
    tags: ["cryptography", "encryption", "decryption"]
},

{
    id: 12,
    level: "Intermediate",
    title: "Hashing & SHA-256",
    short: "Learn one-way hashing and integrity verification.",
    detail: "A cryptographic hash function converts input into a fixed-length digest. SHA-256 produces a 256-bit hash. Good cryptographic hashes are designed so that changing the input changes the digest significantly.",
    why: "Hashes are useful for integrity verification, password-storage systems and digital forensics.",
    keys: [
        "Hashing is not encryption",
        "SHA-256 outputs 256 bits",
        "Small input changes create different hashes"
    ],
    example: "A downloaded file's SHA-256 hash can be compared with a trusted published hash.",
    scenario: "An investigator calculates a file hash before and after transferring a forensic copy. Matching hashes support integrity verification.",
    remember: "Hash = fingerprint of data.",
    tags: ["hashing", "sha256", "sha-256", "integrity"]
},

{
    id: 13,
    level: "Intermediate",
    title: "Digital Signatures & PKI",
    short: "Understand signatures, certificates and public-key infrastructure.",
    detail: "Digital signatures provide authenticity and integrity using asymmetric cryptography. Public Key Infrastructure, or PKI, supports certificates and trusted identities.",
    why: "Digital signatures help users verify who created or signed information and whether it was modified.",
    keys: [
        "Private key signs",
        "Public key verifies",
        "Certificates bind identities to public keys"
    ],
    example: "A signed software update can be checked to verify its publisher and integrity.",
    scenario: "A user verifies a software package using the vendor's digital signature.",
    remember: "Private key signs. Public key verifies.",
    tags: ["digital signatures", "pki", "certificates"]
},

{
    id: 14,
    level: "Intermediate",
    title: "Web Security Fundamentals",
    short: "Understand the basic security model of web applications.",
    detail: "Web security protects browsers, servers, APIs, sessions and data from attacks. Secure web development includes validation, authentication, authorization, secure session handling and safe error handling.",
    why: "Web applications are common targets because they are directly exposed to users and networks.",
    keys: [
        "Validate input",
        "Enforce authorization",
        "Protect sessions",
        "Use secure communication"
    ],
    example: "An application verifies that a user is allowed to view a requested document before returning it.",
    scenario: "Changing a URL ID should not allow a user to access another user's private file.",
    remember: "Never trust client input or client-side permissions.",
    tags: ["web", "web security", "application security"]
},

{
    id: 15,
    level: "Intermediate",
    title: "Injection & XSS Concepts",
    short: "Understand common web application attack concepts.",
    detail: "Injection occurs when untrusted input is interpreted as commands or queries. Cross-Site Scripting, or XSS, occurs when malicious script content is executed in another user's browser.",
    why: "Poor input handling can allow attackers to manipulate application behavior.",
    keys: [
        "Use parameterized queries",
        "Validate input",
        "Encode output",
        "Apply browser security controls"
    ],
    example: "Parameterized SQL queries help prevent SQL injection.",
    scenario: "A developer builds SQL queries by directly joining user input into the query string. Parameterized queries are the safer approach.",
    remember: "Treat user input as untrusted.",
    tags: ["sql injection", "xss", "injection", "owasp"]
},

{
    id: 16,
    level: "Intermediate",
    title: "Incident Response",
    short: "Learn how organizations respond to security incidents.",
    detail: "Incident response is a structured process for preparing for, detecting, analyzing, containing, eradicating and recovering from security incidents.",
    why: "Fast and organized response can reduce damage and restore normal operations.",
    keys: [
        "Preparation",
        "Detection",
        "Analysis",
        "Containment",
        "Eradication",
        "Recovery",
        "Lessons learned"
    ],
    example: "A ransomware incident is detected, affected systems are isolated, evidence is preserved and recovery begins after containment.",
    scenario: "Security analysts isolate a compromised endpoint from the network to prevent further spread.",
    remember: "Contain first when necessary, investigate carefully, recover safely.",
    tags: ["incident response", "ir", "response"]
},

{
    id: 17,
    level: "Intermediate",
    title: "Logging & SIEM",
    short: "Learn how security teams use logs for detection and investigation.",
    detail: "Logs record events such as logins, network connections, application actions and system changes. SIEM platforms collect and correlate security events to help analysts detect suspicious behavior.",
    why: "Without useful logs, investigating an incident becomes much harder.",
    keys: [
        "Centralized logging",
        "Time synchronization",
        "Alert correlation",
        "Retention"
    ],
    example: "A SIEM correlates many failed login attempts with a successful login from an unusual location.",
    scenario: "Analysts use authentication logs to identify repeated failed logins followed by an unusual successful login.",
    remember: "Logs tell the story of what happened.",
    tags: ["logging", "siem", "monitoring"]
},

{
    id: 18,
    level: "Intermediate",
    title: "Risk Management",
    short: "Learn how organizations identify and prioritize security risks.",
    detail: "Risk management involves identifying risks, assessing likelihood and impact, selecting treatments and monitoring the remaining risk.",
    why: "Organizations have limited resources and need to prioritize the most important security problems.",
    keys: [
        "Identify",
        "Assess",
        "Treat",
        "Monitor"
    ],
    example: "A critical internet-facing vulnerability may receive faster remediation than a low-impact internal issue.",
    scenario: "A security manager prioritizes vulnerabilities based on exploitability and business impact.",
    remember: "Not every risk deserves the same priority.",
    tags: ["risk management", "risk", "security"]
},

{
    id: 19,
    level: "Advanced",
    title: "Zero Trust",
    short: "Learn the principle of continuous verification.",
    detail: "Zero Trust is a security approach that avoids automatically trusting users or devices simply because they are inside a network boundary. Access should be continuously evaluated based on identity, device, context and policy.",
    why: "Modern environments include cloud services, remote users and distributed systems.",
    keys: [
        "Verify explicitly",
        "Use least privilege",
        "Assume breach",
        "Continuously evaluate"
    ],
    example: "A remote employee must authenticate and meet device-security requirements before accessing a sensitive application.",
    scenario: "An organization requires authentication and device checks for every sensitive application request.",
    remember: "Never trust automatically. Verify explicitly.",
    tags: ["zero trust", "least privilege", "architecture"]
},

{
    id: 20,
    level: "Advanced",
    title: "Threat Modeling",
    short: "Learn how defenders anticipate security problems during design.",
    detail: "Threat modeling identifies assets, trust boundaries, potential threats and mitigations before or during system development.",
    why: "Finding security problems during design is often cheaper than fixing them after deployment.",
    keys: [
        "Identify assets",
        "Map data flows",
        "Identify threats",
        "Choose mitigations"
    ],
    example: "A development team maps how payment data travels through an application and identifies trust boundaries.",
    scenario: "Before building a banking feature, the team identifies what could happen if an attacker controls a user account.",
    remember: "Think like an attacker before attackers do.",
    tags: ["threat modeling", "design", "security"]
},

{
    id: 21,
    level: "Advanced",
    title: "Digital Forensics",
    short: "Learn how digital evidence is collected and analyzed.",
    detail: "Digital forensics is the process of collecting, preserving, examining and reporting digital evidence in a reliable manner.",
    why: "Investigators need evidence that can be analyzed without accidentally changing or contaminating it.",
    keys: [
        "Preserve evidence",
        "Maintain chain of custody",
        "Use forensic copies",
        "Verify integrity"
    ],
    example: "Investigators create a forensic image of a storage device and calculate a hash to verify integrity.",
    scenario: "An investigator records who handled evidence and when. This supports the chain of custody.",
    remember: "Preserve first. Analyze carefully. Document everything.",
    tags: ["forensics", "digital evidence", "chain of custody"]
},

{
    id: 22,
    level: "Advanced",
    title: "Cloud Security",
    short: "Understand important cloud security responsibilities.",
    detail: "Cloud security protects cloud-hosted applications, data, identities and infrastructure. Security responsibilities are shared between the cloud provider and customer.",
    why: "Misconfigured cloud resources can expose sensitive information.",
    keys: [
        "Identity security",
        "Configuration management",
        "Data protection",
        "Monitoring"
    ],
    example: "A company restricts access to cloud storage and enables logging.",
    scenario: "A storage bucket containing sensitive data is accidentally configured for public access. Access controls and configuration reviews can prevent this.",
    remember: "Cloud does not remove the customer's security responsibilities.",
    tags: ["cloud", "cloud security", "iam"]
},

{
    id: 23,
    level: "Advanced",
    title: "Secure SDLC",
    short: "Learn how security is integrated into software development.",
    detail: "A Secure Software Development Life Cycle integrates security activities throughout planning, design, coding, testing, deployment and maintenance.",
    why: "Security should not be added only after software is completed.",
    keys: [
        "Secure design",
        "Code review",
        "Security testing",
        "Dependency management"
    ],
    example: "Developers run security testing before deploying an application.",
    scenario: "A team performs code review and dependency scanning before releasing a new application version.",
    remember: "Build security in from the beginning.",
    tags: ["secure sdlc", "software", "development"]
},

{
    id: 24,
    level: "Advanced",
    title: "Security Governance & Compliance",
    short: "Understand policies, responsibilities and regulatory requirements.",
    detail: "Security governance defines how an organization directs and oversees cybersecurity. Compliance involves meeting applicable laws, regulations, standards or contractual requirements.",
    why: "Technical controls alone are not enough. Organizations need policies, accountability and oversight.",
    keys: [
        "Policies",
        "Roles",
        "Risk oversight",
        "Compliance"
    ],
    example: "An organization establishes a security policy defining responsibilities for handling sensitive information.",
    scenario: "Management establishes rules for data classification and access responsibilities.",
    remember: "Governance gives security direction and accountability.",
    tags: ["governance", "compliance", "policy"]
},

{
    id: 25,
    level: "Advanced",
    title: "Software Supply Chain Security",
    short: "Understand risks from third-party software and dependencies.",
    detail: "Software supply chain security protects applications from risks introduced through libraries, packages, build systems, vendors and deployment pipelines.",
    why: "Modern applications often depend on large numbers of third-party components.",
    keys: [
        "Track dependencies",
        "Verify sources",
        "Patch vulnerabilities",
        "Protect build pipelines"
    ],
    example: "A development team scans open-source dependencies for known vulnerabilities.",
    scenario: "A vulnerable third-party library is discovered inside an application. The team identifies affected versions and updates safely.",
    remember: "Your code can be secure while a dependency is vulnerable.",
    tags: ["supply chain", "dependencies", "software security"]
},

{
    id: 26,
    level: "Advanced",
    title: "NIST Cybersecurity Framework 2.0",
    short: "Learn the major functions of the NIST CSF 2.0.",
    detail: "NIST Cybersecurity Framework 2.0 organizes cybersecurity outcomes around Govern, Identify, Protect, Detect, Respond and Recover.",
    why: "The framework provides a structured way to manage cybersecurity risk.",
    keys: [
        "Govern",
        "Identify",
        "Protect",
        "Detect",
        "Respond",
        "Recover"
    ],
    example: "An organization identifies important assets, protects them with controls, detects incidents and maintains recovery plans.",
    scenario: "Management defines cybersecurity responsibilities and risk strategy. This relates strongly to Govern.",
    remember: "G I P D R R — Govern, Identify, Protect, Detect, Respond, Recover.",
    tags: ["nist", "csf", "framework", "govern"]
},

{
    id: 27,
    level: "Advanced",
    title: "OWASP Top 10: 2025",
    short: "Explore major web application security risks.",
    detail: "The OWASP Top 10 is an awareness resource for common and important web application security risks. It helps developers and security professionals understand recurring application security problems.",
    why: "Web applications are widely used and often exposed to untrusted users.",
    keys: [
        "Broken access control",
        "Injection",
        "Security misconfiguration",
        "Authentication failures",
        "Cryptographic failures"
    ],
    example: "An application that lets one user access another user's records due to missing authorization has a broken access-control problem.",
    scenario: "A user changes an object identifier in a request and accesses another user's information. Strong server-side authorization is required.",
    remember: "OWASP helps developers think about application security risks.",
    tags: ["owasp", "web", "application security"]
}

];

/* =========================================================
   CASE STUDIES
   ========================================================= */

const tracks = [
    {
        id: "phishing",
        title: "Phishing Files",
        icon: "✉",
        description: "Investigate social engineering and suspicious messages."
    },
    {
        id: "ransomware",
        title: "Ransomware Response",
        icon: "▣",
        description: "Practice defensive incident response."
    },
    {
        id: "insider",
        title: "Insider Mystery",
        icon: "◉",
        description: "Analyze access, identity and insider-risk scenarios."
    },
    {
        id: "web",
        title: "Web Shield",
        icon: "⌘",
        description: "Apply secure web application concepts."
    },
    {
        id: "forensics",
        title: "Digital Forensics Hunt",
        icon: "⌕",
        description: "Learn evidence preservation and investigation."
    }
];

const caseBank = {

phishing: [
    ["Urgent Invoice", "An employee receives an unexpected invoice email containing a login link. The sender address looks slightly different from the real company domain.", ["Click the link immediately", "Verify the sender and link before acting", "Forward it to every employee", "Reply with your password"], "B", "Unexpected urgency plus a suspicious domain are strong phishing indicators."],
    ["Suspicious Destination", "A message displays a familiar company name, but the link points to an unrelated domain.", ["Trust the visible text", "Open it using a work account", "Inspect the actual destination", "Disable antivirus"], "C", "The destination URL is more important than the visible link text."],
    ["Attachment Review", "A finance employee receives an unexpected document attachment from an unknown sender.", ["Open it immediately", "Verify the request through another channel", "Disable security software", "Upload it publicly"], "B", "Unexpected attachments should be verified before opening."],
    ["MFA Request", "A user receives an unexpected MFA approval request even though they did not attempt to log in.", ["Approve it", "Ignore and report the suspicious login", "Share the code", "Turn off MFA"], "B", "Unexpected MFA prompts can indicate an attempted account takeover."],
    ["Smishing", "A text message says a delivery failed and asks the recipient to enter card details through a link.", ["Use the link", "Verify through the official delivery service", "Send the card number by SMS", "Install the attached app"], "B", "Smishing uses SMS-based social engineering."],
    ["Authority Pressure", "A caller claims to be from IT and demands a password because of an emergency.", ["Give the password", "Verify the caller through an official channel", "Write the password on paper", "Disable account security"], "B", "Attackers often use authority and urgency to manipulate victims."],
    ["Report", "An employee identifies a phishing email and wants to help the organization.", ["Delete evidence immediately", "Report the message through the approved security process", "Reply to the attacker", "Post it publicly"], "B", "Reporting allows defenders to investigate and protect others."],
    ["Evidence", "A phishing investigation needs useful evidence.", ["Delete the original message", "Preserve the message and relevant headers according to policy", "Edit the email", "Forward it to random contacts"], "B", "Preserving evidence supports investigation."],
    ["Prevention", "A company wants to reduce successful phishing attacks.", ["Disable all email", "Use awareness training and technical email protections", "Give everyone administrator rights", "Remove MFA"], "B", "Layered controls combine user awareness and technical defenses."],
    ["Response", "An employee entered credentials into a suspected phishing page.", ["Do nothing", "Report immediately and follow account-security procedures", "Share the password with coworkers", "Delete all logs"], "B", "Fast reporting helps defenders contain account compromise."]
],

ransomware: [
    ["Strange Extensions", "Several computers suddenly show unfamiliar file extensions and users cannot open documents.", ["Ignore it", "Report and isolate affected systems according to the response plan", "Restart every computer", "Delete backups"], "B", "Rapid reporting and containment can reduce ransomware spread."],
    ["Isolation", "A workstation is confirmed to be infected with ransomware.", ["Connect it to more systems", "Isolate it from the network", "Share files from it", "Disable all monitoring"], "B", "Isolation can prevent further spread."],
    ["Backups", "The organization is assessing recovery options after a ransomware incident.", ["Use only the infected system", "Check protected backups and their integrity", "Delete all backups", "Pay immediately without investigation"], "B", "Reliable backups can support recovery."],
    ["Evidence", "Security staff are preparing to investigate a ransomware incident.", ["Destroy affected systems immediately", "Preserve relevant evidence according to the incident plan", "Erase all logs", "Publish internal data"], "B", "Evidence can help determine the cause and scope."],
    ["Scope", "One server is compromised and the team needs to know whether others are affected.", ["Assume it is isolated", "Review logs, alerts and affected systems", "Delete monitoring data", "Disconnect the entire internet forever"], "B", "Scope assessment helps determine the extent of the incident."],
    ["Recovery", "The organization has contained ransomware and verified clean backups.", ["Restore without verification", "Recover systems using approved procedures", "Ignore the root cause", "Disable security controls"], "B", "Recovery should follow controlled and verified procedures."],
    ["Root Cause", "The team wants to understand how ransomware entered the environment.", ["Guess randomly", "Review logs, vulnerabilities, email and endpoint evidence", "Delete the evidence", "Ask the attacker for a report"], "B", "Root-cause analysis combines multiple evidence sources."],
    ["Communication", "A serious incident affects business operations.", ["Hide the incident from everyone", "Follow the organization's incident communication plan", "Post confidential information", "Send passwords by email"], "B", "Incident communication should be controlled and follow policy."],
    ["Lessons Learned", "The incident has been resolved.", ["Forget it", "Document lessons learned and improve controls", "Delete the incident report", "Remove backups"], "B", "Post-incident improvement strengthens future resilience."],
    ["Resilience", "A company wants to reduce the impact of future ransomware attacks.", ["Remove backups", "Use tested backups, segmentation, MFA and monitoring", "Give all users admin access", "Disable patching"], "B", "Defense in depth reduces ransomware risk."]
],

insider: [
    ["Least Privilege", "An employee only needs access to one department's records.", ["Give access to every department", "Grant only the required permissions", "Give administrator rights", "Share another employee's account"], "B", "Least privilege limits unnecessary access."],
    ["Access Review", "A company discovers that former employees still have active accounts.", ["Ignore them", "Disable unnecessary accounts and review access", "Share the accounts", "Increase their privileges"], "B", "Account lifecycle management reduces unauthorized access."],
    ["Log Anomaly", "A user's account downloads an unusually large amount of sensitive data at midnight.", ["Ignore it", "Investigate the unusual activity using appropriate evidence", "Delete the logs", "Immediately accuse the user publicly"], "B", "Unusual behavior should be investigated objectively."],
    ["DLP", "An organization wants to detect sensitive files being transferred outside approved channels.", ["Remove monitoring", "Use appropriate data-loss prevention controls", "Give everyone unrestricted access", "Disable file security"], "B", "DLP controls can help identify and prevent unauthorized data movement."],
    ["Separation of Duties", "A sensitive financial process requires one person to request a transaction and another to approve it.", ["Combine all roles", "Maintain separation of duties", "Give one person all privileges", "Remove approvals"], "B", "Separation of duties reduces abuse of a single privileged role."],
    ["Privileged Access", "An administrator has permanent high-level access even when not needed.", ["Keep it permanently", "Use controlled privileged access with least privilege", "Share the account", "Publish credentials"], "B", "Privileged access should be tightly controlled."],
    ["Due Care", "Management knows about a major security weakness but takes no action.", ["This is good security", "Reasonable security action should be taken", "Delete the risk record", "Hide it"], "B", "Due care involves taking reasonable protective action."],
    ["Fair Investigation", "An employee is suspected of inappropriate access.", ["Immediately declare guilt", "Investigate using evidence and appropriate procedures", "Destroy logs", "Post accusations online"], "B", "Security investigations should be evidence-based and properly handled."],
    ["Account Review", "A role changes and the employee no longer needs access to a sensitive system.", ["Keep all access forever", "Review and adjust permissions", "Give more privileges", "Share the account"], "B", "Permissions should match current job requirements."],
    ["Reporting", "A security analyst sees suspicious insider activity.", ["Ignore it", "Escalate through the organization's incident process", "Delete evidence", "Confront publicly"], "B", "Suspicious activity should be handled through approved procedures."]
],

web: [
    ["Record Ownership", "A web application allows users to change a record ID in the URL and view another user's private record.", ["Trust the client", "Enforce authorization on the server", "Hide the URL", "Disable logging"], "B", "Authorization must be enforced server-side."],
    ["SQL Safety", "A developer constructs database queries by concatenating user input.", ["Use parameterized queries", "Disable backups", "Give database admin rights", "Trust all input"], "A", "Parameterized queries reduce SQL injection risk."],
    ["XSS Defense", "A web application displays user-generated content without appropriate output handling.", ["Render it without protection", "Use appropriate output encoding and validation", "Disable authentication", "Share admin credentials"], "B", "Safe output handling reduces XSS risk."],
    ["Session Security", "A website stores authentication session identifiers insecurely.", ["Protect session cookies and session handling", "Expose them in URLs", "Share them publicly", "Disable HTTPS"], "A", "Secure session management protects authenticated users."],
    ["CSRF", "A sensitive action can be triggered from another website while a user is authenticated.", ["Use appropriate CSRF protections", "Disable all access controls", "Trust every request", "Expose session tokens"], "A", "CSRF protections help ensure sensitive requests originate from trusted contexts."],
    ["Input Validation", "An application accepts unexpected input values.", ["Trust everything", "Validate input according to expected format", "Disable logs", "Give users database access"], "B", "Input validation helps reduce malformed and malicious input."],
    ["Secure Design", "A development team is planning a new payment feature.", ["Think about security during design", "Wait until after deployment", "Skip threat modeling", "Remove authentication"], "A", "Security should be integrated into design."],
    ["Logging", "A web application has no useful audit records.", ["Improve security logging", "Delete more logs", "Disable monitoring", "Expose internal data"], "A", "Useful logs support detection and investigation."],
    ["Patching", "A web server is running vulnerable software.", ["Ignore it", "Apply tested security updates", "Disable all security controls", "Publish the vulnerability details internally"], "B", "Patching reduces exposure to known vulnerabilities."],
    ["Defense in Depth", "A company wants multiple layers protecting a web application.", ["Use several complementary controls", "Use only one password", "Remove monitoring", "Trust every request"], "A", "Defense in depth uses multiple security layers."]
],

forensics: [
    ["File Hash", "An investigator needs to verify that a digital file has not changed.", ["Use a cryptographic hash", "Rename the file", "Print it", "Delete metadata"], "A", "Hashes can support integrity verification."],
    ["Metadata", "An investigator is examining a suspicious document.", ["Review relevant metadata as part of the investigation", "Delete metadata immediately", "Publish it online", "Ignore evidence"], "A", "Metadata can provide useful investigative context."],
    ["DNS Logs", "Investigators need to understand which domains a compromised machine contacted.", ["Review DNS logs", "Delete DNS logs", "Disable networking evidence", "Ignore timestamps"], "A", "DNS logs can help reconstruct network activity."],
    ["Firewall Event", "A firewall recorded an unusual connection from an internal system.", ["Review the event with other evidence", "Delete it", "Assume guilt", "Disable the firewall"], "A", "A single event should be analyzed with surrounding evidence."],
    ["Timeline", "An investigator needs to determine the sequence of events.", ["Build a timeline from synchronized evidence", "Guess the order", "Delete timestamps", "Ignore logs"], "A", "Timelines help connect events chronologically."],
    ["Chain of Custody", "Evidence changes hands during an investigation.", ["Document who handled it and when", "Leave it undocumented", "Share it publicly", "Modify it without records"], "A", "Chain of custody records evidence handling."],
    ["Evidence Copy", "Investigators need to examine a storage device while preserving the original.", ["Use an appropriate forensic copy", "Modify the original repeatedly", "Delete the original", "Upload it publicly"], "A", "Forensic copies help preserve original evidence."],
    ["Integrity Check", "An investigator wants to verify a forensic copy matches the source.", ["Compare appropriate hashes", "Rename both files", "Print both files", "Delete the source"], "A", "Hash comparison can support integrity verification."],
    ["Facts vs Assumptions", "A report must distinguish confirmed evidence from speculation.", ["Clearly separate facts from assumptions", "Present guesses as facts", "Delete evidence", "Hide uncertainty"], "A", "Professional reports distinguish evidence from interpretation."],
    ["Final Report", "The investigation is complete.", ["Document methods, evidence, findings and limitations", "Delete all notes", "Publish private evidence", "Hide contradictory evidence"], "A", "A good report explains what was done and what was found."]
]

};

/* =========================================================
   QUIZ
   ========================================================= */

const quizQuestions = [
    {
        q: "A student notices that someone changed a stored exam mark without permission. Which CIA property was affected?",
        options: ["Confidentiality", "Integrity", "Availability", "Authentication"],
        answer: 1,
        explanation: "Integrity protects information from unauthorized modification."
    },
    {
        q: "A password is stolen but the attacker cannot log in because a second factor is required. Which control helped?",
        options: ["MFA", "Firewall", "Hashing", "Backup"],
        answer: 0,
        explanation: "Multi-factor authentication adds another verification factor."
    },
    {
        q: "A user can change a URL ID and view another user's private record. What is the main issue?",
        options: ["Broken access control", "Availability", "Backup failure", "Hash collision"],
        answer: 0,
        explanation: "The application failed to enforce authorization."
    },
    {
        q: "A security device detects suspicious network traffic and sends an alert but does not block it. What is it?",
        options: ["IPS", "IDS", "Firewall rule", "Password manager"],
        answer: 1,
        explanation: "IDS detects and alerts. IPS can detect and block."
    },
    {
        q: "Which technique is primarily used to create a fixed-length fingerprint of data?",
        options: ["Hashing", "Encryption", "Authentication", "Authorization"],
        answer: 0,
        explanation: "Cryptographic hashing produces a digest."
    },
    {
        q: "An email pressures a user to urgently click a login link. What is the strongest first response?",
        options: ["Click quickly", "Verify the request independently", "Send your password", "Disable MFA"],
        answer: 1,
        explanation: "Independent verification is an important phishing defense."
    },
    {
        q: "During a ransomware incident, what is an important containment action?",
        options: ["Connect infected systems together", "Isolate affected systems", "Delete all evidence", "Disable backups"],
        answer: 1,
        explanation: "Isolation can reduce further spread."
    },
    {
        q: "A user should receive only the permissions necessary for their role. What principle is this?",
        options: ["Least privilege", "Availability", "Encryption", "Redundancy"],
        answer: 0,
        explanation: "Least privilege limits unnecessary permissions."
    },
    {
        q: "In NIST CSF 2.0, which function focuses strongly on organizational cybersecurity strategy, responsibilities and risk governance?",
        options: ["Govern", "Recover", "Detect", "Protect"],
        answer: 0,
        explanation: "Govern addresses cybersecurity strategy, expectations and oversight."
    },
    {
        q: "What is a strong defense against SQL injection?",
        options: ["Parameterized queries", "More browser tabs", "Longer URLs", "Disabling backups"],
        answer: 0,
        explanation: "Parameterized queries separate SQL code from user-supplied values."
    }
];

/* =========================================================
   PRACTICE LABS
   ========================================================= */

const labs = [
    {
        id: "base64",
        title: "Base64 Encode / Decode",
        short: "Practice converting text into Base64 and back.",
        theory: "Base64 is an encoding scheme that represents binary data using a limited set of characters. It is encoding, not encryption.",
        why: "Base64 appears in web data, email formats, APIs and security investigations.",
        steps: [
            "Enter text.",
            "Choose Encode or Decode.",
            "Review the result.",
            "Remember that Base64 does not provide secrecy."
        ],
        example: "The word 'Cyber' can be represented as a Base64 string.",
        remember: "Encoding ≠ encryption."
    },
    {
        id: "url",
        title: "URL Encode / Decode",
        short: "Learn how special characters are represented safely in URLs.",
        theory: "URL encoding converts characters that have special meanings in URLs into percent-encoded representations.",
        why: "It is commonly encountered in web requests and application testing.",
        steps: [
            "Enter text.",
            "Choose Encode or Decode.",
            "Review the URL-safe representation."
        ],
        example: "A space may be represented as %20 in URL encoding.",
        remember: "URL encoding makes characters safe for URL contexts."
    },
    {
        id: "hex",
        title: "Hex Encode / Decode",
        short: "Convert text to hexadecimal and back.",
        theory: "Hexadecimal represents binary data using digits 0–9 and letters A–F.",
        why: "Hex is frequently used in debugging, networking, memory analysis and digital forensics.",
        steps: [
            "Enter text.",
            "Encode it into hexadecimal.",
            "Decode the hexadecimal back into text."
        ],
        example: "The byte value for the letter A is commonly represented as 41 in hexadecimal.",
        remember: "Hex is a representation, not encryption."
    },
    {
        id: "rot13",
        title: "ROT13",
        short: "Practice a simple substitution transformation.",
        theory: "ROT13 replaces each Latin letter with the letter 13 positions away in the alphabet.",
        why: "ROT13 is useful for understanding simple transformations, although it is not secure encryption.",
        steps: [
            "Enter text.",
            "Apply ROT13.",
            "Apply it again to return to the original."
        ],
        example: "Applying ROT13 twice returns the original text.",
        remember: "ROT13 is reversible and not secure."
    },
    {
        id: "sha256",
        title: "SHA-256 Hashing",
        short: "Generate a SHA-256 hash in your browser.",
        theory: "SHA-256 is a cryptographic hash function that produces a 256-bit digest.",
        why: "Hashes are useful for integrity verification and security analysis.",
        steps: [
            "Enter text.",
            "Generate its SHA-256 hash.",
            "Change one character.",
            "Generate the hash again and compare."
        ],
        example: "Changing one input character produces a significantly different hash.",
        remember: "Hashing is designed to be one-way."
    }
];

/* =========================================================
   LOGIN
   ========================================================= */

function validateLogin() {

    const email = $("email").value.trim();
    const username = $("username").value.trim();
    const password = $("password").value;

    const error = $("loginError");

    if (!email) {
        error.textContent = "Please enter your email.";
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error.textContent = "Please enter a valid email address.";
        return false;
    }

    if (!username) {
        error.textContent = "Please enter a username.";
        return false;
    }

    if (!/^[A-Za-z0-9]+$/.test(username)) {
        error.textContent = "Username can contain only letters and numbers.";
        return false;
    }

    if (password.length < 8) {
        error.textContent = "Password must contain at least 8 characters.";
        return false;
    }

    error.textContent = "";
    return true;
}

function login(event) {

    event.preventDefault();

    if (!validateLogin()) {
        return;
    }

    const username = $("username").value.trim();
    const email = $("email").value.trim();

    state.user.name = username;
    state.user.email = email;

    saveState();

    sessionStorage.setItem(SESSION_KEY, "true");

    $("loginPage").classList.add("hidden");
    $("app").classList.remove("hidden");

    $("welcomeName").textContent = username;
    $("profileTop").textContent = username.charAt(0).toUpperCase();

    updateDashboard();

    showSection(state.currentSection || "dashboard");

    showToast("Welcome to CyberHunt, " + username + "!");

    window.scrollTo(0, 0);
}

/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    sessionStorage.removeItem(SESSION_KEY);

    $("app").classList.add("hidden");
    $("loginPage").classList.remove("hidden");

    $("password").value = "";

    showToast("Logged out successfully.");
}

/* =========================================================
   XP / LEVEL
   ========================================================= */

function getLevel() {
    return Math.floor(state.xp / 250) + 1;
}

function addXP(amount) {

    state.xp += amount;

    saveState();

    updateDashboard();

    showToast("+" + amount + " XP earned!");
}

function updateDashboard() {

    const level = getLevel();

    if ($("xpTop")) $("xpTop").textContent = state.xp;
    if ($("levelTop")) $("levelTop").textContent = level;

    if ($("dashXP")) $("dashXP").textContent = state.xp;

    if ($("casesDone")) {
        $("casesDone").textContent = state.completedCases.length;
    }

    if ($("labsDone")) {
        $("labsDone").textContent = state.completedLabs.length;
    }

    if ($("quizBest")) {
        $("quizBest").textContent = state.quizBest;
    }

    if ($("welcomeName")) {
        $("welcomeName").textContent = state.user.name || "Detective";
    }

    if ($("profileTop")) {
        $("profileTop").textContent =
            (state.user.name || "D").charAt(0).toUpperCase();
    }

    const progress =
        Math.round(
            (
                state.completedCases.length / 50
            ) * 100
        );

    if ($("overallProgress")) {
        $("overallProgress").style.width = progress + "%";
    }

    if ($("progressPill")) {
        $("progressPill").textContent = progress + "%";
    }

    updateNextMission();
}

function updateNextMission() {

    const nextTitle = $("nextTitle");
    const nextDesc = $("nextDesc");

    if (!nextTitle || !nextDesc) return;

    if (state.completedCases.length === 0) {
        nextTitle.textContent = "Start with Cybersecurity Foundations";
        nextDesc.textContent =
            "Open a material, learn the concept, then test yourself with a case.";
    } else if (state.completedCases.length < 10) {
        nextTitle.textContent = "Continue Phishing Files";
        nextDesc.textContent =
            "Practice recognizing social engineering signals.";
    } else if (state.completedCases.length < 20) {
        nextTitle.textContent = "Study Ransomware Response";
        nextDesc.textContent =
            "Learn containment, evidence preservation and recovery.";
    } else {
        nextTitle.textContent = "Explore Advanced Security";
        nextDesc.textContent =
            "Continue through web security, forensics and advanced topics.";
    }
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function showSection(section) {

    const sections = document.querySelectorAll(".page-section");
    const navItems = document.querySelectorAll(".nav-item");

    sections.forEach(item => {
        item.classList.remove("active-section");
    });

    navItems.forEach(item => {
        item.classList.remove("active");
    });

    const selected = $(section);

    if (!selected) return;

    selected.classList.add("active-section");

    const nav = document.querySelector(
        '.nav-item[data-section="' + section + '"]'
    );

    if (nav) nav.classList.add("active");

    const crumb = $("crumb");

    if (crumb) {
        const names = {
            dashboard: "Dashboard",
            ai: "AI Study Studio",
            materials: "Materials",
            cases: "Case Studies",
            quizzes: "Mini Quizzes",
            labs: "Practice Labs",
            badges: "Badges"
        };

        crumb.textContent = names[section] || "CyberHunt";
    }

    state.currentSection = section;
    saveState();

    if (section === "materials") renderMaterials();
    if (section === "cases") renderCases();
    if (section === "quizzes") renderQuiz();
    if (section === "labs") renderLabs();
    if (section === "badges") renderBadges();

    const sidebar = $("sidebar");

    if (sidebar) {
        sidebar.classList.remove("mobile-open");
    }
}

/* =========================================================
   MATERIALS
   ========================================================= */

function renderMaterials() {

    const grid = $("materialsGrid");

    if (!grid) return;

    const search =
        ($("materialSearch")?.value || "")
            .toLowerCase()
            .trim();

    const filtered = materials.filter(material => {

        const text = (
            material.title +
            " " +
            material.short +
            " " +
            material.detail +
            " " +
            material.tags.join(" ")
        ).toLowerCase();

        return text.includes(search);
    });

    grid.innerHTML = filtered.map(material => {

        return `
        <article class="study-card material-card" data-material="${material.id}">
            <div class="card-number">${String(material.id).padStart(2, "0")}</div>
            <span class="level-tag">${escapeHTML(material.level)}</span>
            <h3>${escapeHTML(material.title)}</h3>
            <p>${escapeHTML(material.short)}</p>

            <div class="card-footer">
                <span>Open detailed notes</span>
                <b>→</b>
            </div>
        </article>
        `;

    }).join("");

    if (!filtered.length) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>No materials found</h3>
                <p>Try another cybersecurity topic.</p>
            </div>
        `;
    }
}

function openMaterial(id) {

    const material = materials.find(x => x.id === Number(id));
