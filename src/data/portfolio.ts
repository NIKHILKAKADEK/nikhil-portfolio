export interface PersonalInfo {
  name: string;
  shortName: string;
  role: string;
  location: string;
  email: string;
  phone: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  number: string;
  category: string;
  name: string;
  title: string;
  heroDescription?: string;
  subtitle?: string;
  description: string;
  technologies: string[];
  github: string | null;
  liveDemo: string | null;
  caseStudy: string;
  visualType: "lead-flow" | "sentinel-flow" | "hospital-flow" | "emergency-flow";
  visualNodes: string[];
  caseStudyDetails: {
    problem: string;
    idea: string;
    flowNote: string;
    flow: { title: string; detail: string }[];
    architectureNote: string;
    architecture: { title: string; detail: string }[];
    engineering: { title: string; detail: string }[];
  };
}

export interface Repository {
  name: string;
  github: string;
  language?: string;
}

export interface Education {
  qualification: string;
  institution?: string;
  period: string;
  result?: string;
  resultLabel?: string;
}

export interface JourneyStep {
  label: "Then" | "Now" | "Next";
  description: string;
  details?: string[];
}

export interface Skill {
  id: string;
  name: string;
  group: string;
}

export interface TechnicalFocusArea {
  number: string;
  title: string;
  description: string;
  flow: string[];
  skills: string[];
  emphasis?: boolean;
  supporting?: boolean;
  proof?: { title: string; subtitle: string; href: string; flow: string[] };
}

export interface Certification {
  title: string;
  issuer: string;
  skills: string[];
  description?: string;
  score?: string;
}

export interface Achievement {
  title: string;
  result: string;
}

export interface BuildLogData {
  eyebrow: string;
  heading: string;
  index: string;
  indexLabel: string;
  achievementLabel: string;
  github: {
    heading: string;
    introduction: string;
    profile: SocialLink;
    ctaLabel: string;
    selectedRepositories: Repository[];
    moreProjects: SocialLink;
  };
}

export interface PortfolioData {
  personal: PersonalInfo;
  about: {
    heading: string;
    introduction: string;
  };
  journey: JourneyStep[];
  socialLinks: SocialLink[];
  projects: Project[];
  projectShowcase: {
    eyebrow: string;
    heading: string;
    introduction: string;
    moreHeading: string;
    repositories: Repository[];
  };
  technicalFocus: {
    eyebrow: string;
    heading: string;
    introduction: string;
    index: string;
    indexLabel: string;
    primaryLabel: string;
    supportingLabel: string;
    areas: TechnicalFocusArea[];
  };
  credentials: {
    eyebrow: string;
    heading: string;
    introduction: string;
    index: string;
    indexLabel: string;
    scoreLabel: string;
  };
  skills: string[];
  skillCatalog: Skill[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  buildLog: BuildLogData;
  contact: {
    eyebrow: string;
    index: string;
    indexLabel: string;
    heading: string;
    introduction: string;
    email: SocialLink;
    phone: SocialLink;
    socialLinks: SocialLink[];
    locationLabel: string;
    phoneLabel: string;
  };
  resume: {
    available: boolean;
    href: string;
    downloadName: string;
    navLabel: string;
    heroLabel: string;
    downloadLabel: string;
    pendingLabel: string;
  };
  navigation: SocialLink[];
  footer: {
    discipline: string;
    navigationLabel: string;
    navigation: SocialLink[];
  };
}

const contactEmail = "kakden19@gmail.com";
const contactPhone = "+91 9673217349";
const linkedinProfile: SocialLink = {
  label: "LinkedIn",
  href: "https://www.linkedin.com/in/nikhilkakade28/",
};

const githubProfile: SocialLink = {
  label: "Nikhil Kakade on GitHub",
  href: "https://github.com/NIKHILKAKADEK",
};

const leadSutraRepository: Repository = {
  name: "LeadSutra-AI",
  github: "https://github.com/NIKHILKAKADEK/LeadSutra-AI",
};

export const portfolio: PortfolioData = {
  personal: {
    name: "Nikhil Ajay Kakade",
    shortName: "Nikhil",
    role: "AI & Data Science Student",
    location: "Nashik, Maharashtra, India",
    email: contactEmail,
    phone: contactPhone,
  },
  about: {
    heading: "Building with curiosity. Learning by shipping.",
    introduction: "Nikhil Ajay Kakade is an AI & Data Science student focused on machine learning and full-stack development, with an interest in building real-time, user-focused solutions.",
  },
  journey: [
    {
      label: "Then",
      description: "Programming, web development and building foundational projects.",
    },
    {
      label: "Now",
      description: "B.Tech in AI & Data Science at K.K. Wagh Institute of Engineering Education and Research.",
      details: ["AI / ML", "Full-stack development", "Databases", "Automation"],
    },
    {
      label: "Next",
      description: "Exploring what comes next in AI, intelligent automation and software engineering.",
    },
  ],
  socialLinks: [
    { label: "GitHub", href: githubProfile.href },
    linkedinProfile,
    { label: "Email", href: `mailto:${contactEmail}` },
  ],
  projects: [
    {
      id: "leadsutra-ai", number: "01", category: "AI Sales Automation", name: "LeadSutra AI", title: "LeadSutra AI", heroDescription: "AI Sales Automation Platform",
      description: "AI-powered platform for business lead generation, proposal creation and email workflows, combining lead discovery, AI research, CRM capabilities and automation.",
      technologies: ["Next.js", "FastAPI", "Gemini API", "LangChain", "PostgreSQL"],
      github: leadSutraRepository.github, liveDemo: null, caseStudy: "/projects/leadsutra-ai", visualType: "lead-flow",
      visualNodes: ["Lead Discovery", "Enrichment", "Contact Extraction", "Qualification", "CRM", "Outreach / Automation"],
      caseStudyDetails: {
        problem: "Business lead generation can involve discovering businesses, collecting useful information, enriching contact details, qualifying prospects and organizing them for outreach. Repeating those steps by hand creates avoidable operational work.",
        idea: "LeadSutra’s inspected discovery backend turns a search request into a configurable lead-processing workflow. It can return discovered records through an API or persist processed leads and business profiles.",
        flowNote: "The stages are optional processing steps after discovery. Foursquare is used only when the primary provider raises a provider-level error; an empty successful Google result does not trigger fallback.",
        flow: [
          { title: "Search request", detail: "FastAPI accepts query and location inputs with options for deduplication, enrichment, extraction, scoring and persistence." },
          { title: "Business discovery", detail: "Google Places is the primary provider; Foursquare is a fallback for provider-level failures." },
          { title: "Normalize and deduplicate", detail: "Provider results are normalized as business leads, with optional duplicate removal." },
          { title: "Enrich and extract", detail: "Optional website enrichment and contact extraction add information when available." },
          { title: "Qualify and profile", detail: "Optional lead scoring and business-profile extraction prepare structured results." },
          { title: "Return or persist", detail: "The API returns results, or the persistence path stores leads and profiles." },
        ],
        architectureNote: "This describes the LeadSutra discovery backend source inspected for this case study. The portfolio’s listed stack remains visible separately; unverified modules are not assigned implementation details here.",
        architecture: [
          { title: "FastAPI routes", detail: "Search, lead listing and lead detail endpoints expose the service to callers." },
          { title: "Discovery service", detail: "Coordinates Google Places and Foursquare providers and handles provider fallback." },
          { title: "Processing services", detail: "Separate services handle scraping, contact extraction, scoring and profile extraction." },
          { title: "Persistence", detail: "MongoDB repositories store leads and profiles; an in-memory async collection is used when MongoDB is unavailable." },
        ],
        engineering: [
          { title: "Provider failure handling", detail: "Fallback is tied to provider-level errors, while successful empty results remain valid responses." },
          { title: "Composable processing", detail: "Deduplication, enrichment, extraction, scoring and persistence are controlled as separate workflow options." },
          { title: "Non-destructive extraction", detail: "Extracted contact data fills gaps without replacing an existing provider-supplied phone value." },
        ],
      },
    },
    {
      id: "sentinel-ai", number: "02", category: "Machine Learning", name: "SentinelAI", title: "SentinelAI", subtitle: "AI-Powered Malware Detection Platform",
      description: "AI-powered malware detection platform for Windows PE files using machine learning, with authentication, file upload, scan history, admin dashboard and prediction analytics.",
      technologies: ["Next.js", "FastAPI", "Python", "Random Forest", "XGBoost", "Better Auth", "Prisma", "Neon PostgreSQL", "Docker"],
      github: null, liveDemo: null, caseStudy: "/projects/sentinel-ai", visualType: "sentinel-flow",
      visualNodes: ["PE File", "File Upload", "Analysis", "ML Model", "Prediction", "Scan History / Analytics"],
      caseStudyDetails: {
        problem: "Windows PE files need to be examined before a useful malware-risk prediction can be presented. A product flow also needs to connect scans with authenticated access and a reviewable history.",
        idea: "SentinelAI is described as a machine-learning malware detection platform that accepts PE files and presents predictions alongside scan history and analytics.",
        flowNote: "Conceptual flow based on the supplied project description and stack. The precise feature extraction pipeline, API contract and model evaluation are not specified in the available project source.",
        flow: [
          { title: "PE file", detail: "A Windows Portable Executable is the input described for scanning." },
          { title: "Upload and analysis", detail: "The application accepts a file and analyzes it; exact extracted features are not specified." },
          { title: "ML prediction", detail: "Random Forest and XGBoost are the listed model technologies." },
          { title: "Application record", detail: "The prediction is presented with scan history and prediction analytics." },
        ],
        architectureNote: "Conceptual responsibilities derived from the listed technologies; exact service boundaries and data contracts were not available for verification.",
        architecture: [
          { title: "Next.js + Better Auth", detail: "Listed application and authentication technologies for the user-facing product." },
          { title: "FastAPI + Python", detail: "Listed backend technologies associated with file analysis and model access." },
          { title: "Random Forest + XGBoost", detail: "Listed machine-learning models for the prediction step." },
          { title: "Prisma + Neon PostgreSQL", detail: "Listed persistence technologies for application data; exact schema is not specified." },
        ],
        engineering: [
          { title: "Keep analysis behind an API", detail: "A backend API provides a boundary between file handling, model inference and the product interface." },
          { title: "Make predictions reviewable", detail: "Scan history and analytics place model output in an application context." },
          { title: "No unsupported performance claims", detail: "No model accuracy, throughput or benchmark figures are included because none were provided." },
        ],
      },
    },
    {
      id: "hospital-management", number: "03", category: "Full-stack", name: "Hospital Management System", title: "Hospital Management System",
      description: "Full-stack Django-based web application for managing patient records, appointments and hospital operations through REST APIs and a responsive interface.",
      technologies: ["Django", "REST APIs"],
      github: null, liveDemo: null, caseStudy: "/projects/hospital-management", visualType: "hospital-flow",
      visualNodes: ["Patients", "Appointments", "Operations", "Web App", "REST APIs"],
      caseStudyDetails: {
        problem: "Patient records, appointments and hospital operations are related workflows. A single web application can bring those management tasks into a consistent interface.",
        idea: "The project is described as a Django full-stack application that manages patient records, appointments and hospital operations through REST APIs and a responsive interface.",
        flowNote: "Conceptual system view based only on the supplied project description. Storage choices, API resources and user roles are not specified.",
        flow: [
          { title: "Hospital workflows", detail: "Patient records, appointments and operational tasks form the project’s stated scope." },
          { title: "Responsive interface", detail: "A responsive UI provides the described web application entry point." },
          { title: "Django application", detail: "Django is the listed full-stack application framework." },
          { title: "REST APIs", detail: "REST APIs are part of the stated implementation; endpoint details are not available." },
        ],
        architectureNote: "The diagram stays at the verified framework and API level. No database, authentication model or deployment topology is assumed.",
        architecture: [
          { title: "Responsive UI", detail: "The supplied description identifies a responsive user interface." },
          { title: "Django", detail: "The application is described as Django-based." },
          { title: "REST API layer", detail: "REST APIs support the application; their specific resources are not documented here." },
          { title: "Management workflows", detail: "Patient records, appointments and hospital operations are the stated product areas." },
        ],
        engineering: [
          { title: "Keep workflows connected", detail: "The described scope brings patient, appointment and operational management into one application." },
          { title: "Responsive access", detail: "The responsive interface is a stated part of the project, without an assumed device-specific feature set." },
        ],
      },
    },
    {
      id: "emergency-navigation", number: "04", category: "Algorithms + ML", name: "Emergency Navigation System", title: "Emergency Navigation System",
      description: "Django application using the A* algorithm and machine learning for real-time traffic-based route optimization with interactive maps.",
      technologies: ["Django", "A* Algorithm", "Machine Learning", "Interactive Maps"],
      github: "https://github.com/NIKHILKAKADEK/Emergency-Route-Navigator", liveDemo: null, caseStudy: "/projects/emergency-navigation", visualType: "emergency-flow",
      visualNodes: ["Start", "Road Network", "A* Routing", "Traffic / ML", "Optimized Route", "Destination"],
      caseStudyDetails: {
        problem: "Emergency navigation needs to identify a route between locations while accounting for changing traffic conditions, then make the result understandable on a map.",
        idea: "The project is described as a Django application combining A* routing, machine learning, real-time traffic-based route optimization and interactive maps.",
        flowNote: "Conceptual flow from the supplied description. The traffic source, map provider, route-cost formula and precise relationship between ML and A* are not specified.",
        flow: [
          { title: "Start and destination", detail: "The route request defines the endpoints to connect." },
          { title: "Road and map context", detail: "The project uses interactive maps; the underlying map and road-data providers are unspecified." },
          { title: "Route search", detail: "A* is the stated route-search algorithm, used to find a path through the route network." },
          { title: "Traffic and ML", detail: "The project describes real-time traffic-based optimization using machine learning; exact inputs and weighting are unspecified." },
          { title: "Route presentation", detail: "An optimized route is shown through the interactive map experience." },
        ],
        architectureNote: "Conceptual system view based on the project description; data providers, model design and runtime sequence require source verification.",
        architecture: [
          { title: "Django application", detail: "The listed web application framework for the project." },
          { title: "A* route search", detail: "Searches for a path between locations within the route problem." },
          { title: "Traffic + ML", detail: "Listed as part of the route optimization approach; implementation details are not specified." },
          { title: "Interactive maps", detail: "The project’s stated map interface for presenting navigation." },
        ],
        engineering: [
          { title: "Route search in context", detail: "A* is presented only as the route-search component of this navigation project." },
          { title: "Keep the data boundary explicit", detail: "Traffic feeds, map providers and the ML model are not named in the available description." },
        ],
      },
    },
  ],
  projectShowcase: {
    eyebrow: "Selected Work",
    heading: "Things I've built.",
    introduction: "From AI-powered automation to machine-learning systems and full-stack applications, these projects are where I turn ideas into working software.",
    moreHeading: "More Experiments",
    repositories: [
      { name: "HABITX_APP", github: "https://github.com/NIKHILKAKADEK/HABITX_APP" },
      { name: "swasthya_hospital_website", github: "https://github.com/NIKHILKAKADEK/swasthya_hospital_website" },
      { name: "Emergency-Route-Navigator", github: "https://github.com/NIKHILKAKADEK/Emergency-Route-Navigator" },
      { name: "work_zone", github: "https://github.com/NIKHILKAKADEK/work_zone" },
      { name: "amazon-prime-clone", github: "https://github.com/NIKHILKAKADEK/amazon-prime-clone" },
      { name: "Python-Programming-Concepts-Programs-Practice", github: "https://github.com/NIKHILKAKADEK/Python-Programming-Concepts-Programs-Practice" },
    ],
  },
  technicalFocus: {
    eyebrow: "Technical Focus",
    heading: "What I build with.",
    introduction: "AI systems, security-focused applications and full-stack products.",
    index: "05",
    indexLabel: "Practice",
    primaryLabel: "Primary focus",
    supportingLabel: "Supporting tools",
    areas: [
      {
        number: "01",
        title: "AI / Machine Learning",
        description: "Building practical machine-learning and AI applications that turn data and models into usable software.",
        flow: ["Model", "Data", "Prediction", "Application"],
        skills: ["python", "machine-learning", "random-forest", "xgboost", "scikit-learn", "gemini-api", "langchain"],
      },
      {
        number: "02",
        title: "Cybersecurity & AI Security",
        description: "Exploring security-focused software and machine-learning systems, including AI-powered malware detection.",
        flow: ["Windows PE files", "Analysis", "Machine learning", "Prediction", "Security analytics"],
        skills: ["python", "random-forest", "xgboost", "fastapi", "nextjs", "better-auth", "prisma", "neon-postgresql", "docker"],
        emphasis: true,
        proof: {
          title: "SentinelAI",
          subtitle: "AI-Powered Malware Detection",
          href: "/projects/sentinel-ai",
          flow: ["Windows PE files", "Analysis", "Machine Learning", "Prediction", "Security Analytics"],
        },
      },
      {
        number: "03",
        title: "Full-Stack Engineering",
        description: "Building responsive interfaces and backend systems that connect product experiences with real application logic.",
        flow: ["Frontend", "API", "Business logic", "Database"],
        skills: ["nextjs", "react", "tailwind-css", "html", "css", "fastapi", "nodejs", "rest-apis", "prisma", "javascript", "typescript"],
      },
      {
        number: "04",
        title: "Data & Infrastructure",
        supporting: true,
        description: "Working with data stores and development tools that support application workflows.",
        flow: ["Data", "Persistence", "Tooling", "Application"],
        skills: ["postgresql", "neon-postgresql", "sqlite", "mongodb", "docker", "git", "github", "postman", "vscode", "figma", "sql"],
      },
    ],
  },
  credentials: {
    eyebrow: "Credentials",
    heading: "Credentials",
    introduction: "Selected certifications and training.",
    index: "06",
    indexLabel: "Learning",
    scoreLabel: "Score",
  },
  skills: ["AI / ML", "Full Stack", "Data"],
  skillCatalog: [
    { id: "python", name: "Python", group: "Languages & AI" },
    { id: "javascript", name: "JavaScript", group: "Languages & AI" },
    { id: "typescript", name: "TypeScript", group: "Languages & AI" },
    { id: "sql", name: "SQL", group: "Languages & AI" },
    { id: "cpp", name: "C++", group: "Languages & AI" },
    { id: "machine-learning", name: "Machine Learning", group: "Languages & AI" },
    { id: "random-forest", name: "Random Forest", group: "Languages & AI" },
    { id: "xgboost", name: "XGBoost", group: "Languages & AI" },
    { id: "scikit-learn", name: "Scikit-learn", group: "Languages & AI" },
    { id: "gemini-api", name: "Gemini API", group: "Languages & AI" },
    { id: "langchain", name: "LangChain", group: "Languages & AI" },
    { id: "nextjs", name: "Next.js", group: "Product Engineering" },
    { id: "react", name: "React", group: "Product Engineering" },
    { id: "tailwind-css", name: "Tailwind CSS", group: "Product Engineering" },
    { id: "html", name: "HTML", group: "Product Engineering" },
    { id: "css", name: "CSS", group: "Product Engineering" },
    { id: "fastapi", name: "FastAPI", group: "Product Engineering" },
    { id: "nodejs", name: "Node.js", group: "Product Engineering" },
    { id: "rest-apis", name: "REST APIs", group: "Product Engineering" },
    { id: "prisma", name: "Prisma", group: "Product Engineering" },
    { id: "better-auth", name: "Better Auth", group: "Product Engineering" },
    { id: "postgresql", name: "PostgreSQL", group: "Data & Tools" },
    { id: "neon-postgresql", name: "Neon PostgreSQL", group: "Data & Tools" },
    { id: "sqlite", name: "SQLite", group: "Data & Tools" },
    { id: "mongodb", name: "MongoDB", group: "Data & Tools" },
    { id: "docker", name: "Docker", group: "Data & Tools" },
    { id: "git", name: "Git", group: "Data & Tools" },
    { id: "github", name: "GitHub", group: "Data & Tools" },
    { id: "postman", name: "Postman", group: "Data & Tools" },
    { id: "vscode", name: "VS Code", group: "Data & Tools" },
    { id: "figma", name: "Figma", group: "Data & Tools" },
  ],
  education: [
    {
      qualification: "B.Tech in AI & Data Science",
      institution: "K.K. Wagh Institute of Engineering Education and Research",
      period: "2023–2027",
      result: "7.23",
      resultLabel: "CGPA",
    },
    {
      qualification: "HSC",
      period: "2023",
      result: "79.00%",
    },
    {
      qualification: "SSC",
      period: "2021",
      result: "80.20%",
    },
  ],
  certifications: [
    {
      title: "Oracle Cloud Infrastructure 2025 Certified Data Science Professional",
      issuer: "Oracle",
      skills: ["Data Science", "Cloud Computing", "OCI"],
    },
    {
      title: "RDBMS PostgreSQL Training",
      issuer: "EduPyramids · SINE IIT Bombay",
      skills: ["PostgreSQL", "Database Management", "SQL"],
      score: "75%",
    },
    {
      title: "Solidity and Blockchain Workshop",
      issuer: "Debuggers' Club · KKWIEER",
      skills: [],
      description: "Smart contracts and blockchain fundamentals",
    },
  ],
  achievements: [
    {
      title: "Smart India Hackathon 2025",
      result: "Internal College Round Qualified",
    },
  ],
  buildLog: {
    eyebrow: "Build Log",
    heading: "Building. Learning. Continuing.",
    index: "07",
    indexLabel: "Progress",
    achievementLabel: "Achievement",
    github: {
      heading: "On GitHub",
      introduction: "Selected project repositories.",
      profile: githubProfile,
      ctaLabel: "Explore GitHub",
      selectedRepositories: [
        leadSutraRepository,
        {
          name: "SentinelAI-AI-Powered-Malware-Detection-Platform",
          github: "https://github.com/NIKHILKAKADEK/SentinelAI-AI-Powered-Malware-Detection-Platform",
        },
      ],
      moreProjects: { label: "More experiments", href: "#more-projects" },
    },
  },
  contact: {
    eyebrow: "Contact",
    index: "08",
    indexLabel: "Connect",
    heading: "Have a problem worth building?",
    introduction: "Whether it is an AI system, full-stack product or something experimental, I’m always interested in building and learning.",
    email: { label: contactEmail, href: `mailto:${contactEmail}` },
    phone: { label: contactPhone, href: `tel:${contactPhone.replace(/\s/g, "")}` },
    socialLinks: [linkedinProfile, { label: "GitHub", href: githubProfile.href }],
    locationLabel: "Based in",
    phoneLabel: "Phone",
  },
  resume: {
    available: true,
    href: "/resume.pdf",
    downloadName: "Nikhil-Ajay-Kakade-Resume.pdf",
    navLabel: "Resume",
    heroLabel: "View Resume",
    downloadLabel: "Download Résumé",
    pendingLabel: "Résumé coming soon",
  },
  navigation: [
    { label: "Home", href: "#top" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#work" },
    { label: "Skills", href: "#skills" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
  ],
  footer: {
    discipline: "AI & Data Science",
    navigationLabel: "Footer navigation",
    navigation: [
      { label: "Home", href: "/#top" },
      { label: "About", href: "/#about" },
      { label: "Education", href: "/#education" },
      { label: "Work", href: "/#work" },
      { label: "Skills", href: "/#skills" },
      { label: "Credentials", href: "/#credentials" },
      { label: "Build Log", href: "/#build-log" },
      { label: "Contact", href: "/#contact" },
    ],
  },
};
