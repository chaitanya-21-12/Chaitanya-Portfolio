// Portfolio content — all information is resume-accurate
// Do NOT add fake achievements, metrics, or invented content

export const personalInfo = {
  name: "Chaitanya Aggarwal",
  firstName: "Chaitanya",
  lastName: "Aggarwal",
  monogram: "CA",
  title: "Full-Stack Developer & Creative Technologist",
  tagline: "Engineering fast, immersive, and motion-driven digital products.",
  eyebrow: "SHIPPING IDEAS INTO REALITY.",
  heroCopy: "CRAFTING INTERFACES THAT PEOPLE REMEMBER.",
  email: "chaitanyaaggarwal21@gmail.com",
  phone: "+91-7340637567",
  location: "Jaipur, India",
  availability: "Open to opportunities",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
  },
};

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  technologies: string[];
  url?: string;
  image: string;
  role?: string;
  featured: boolean;
  type: "web" | "game" | "research";
}

export const projects: Project[] = [
  {
    id: "rivelle",
    title: "Rivelle Boutique Stays",
    subtitle: "Luxury hotel booking platform",
    category: "Hospitality / Web",
    year: "2025",
    description:
      "A premium booking website for Rivelle Boutique Stays, a boutique hotel in Jaipur. Designed and developed end-to-end with a focus on immersive user experience, seamless booking flow, and visual storytelling that reflects the heritage character of the property.",
    technologies: ["Next.js", "React", "Node.js", "MongoDB"],
    url: "https://rivellestays.com",
    image: "/projects/rivelle.jpg",
    role: "Full-Stack Developer",
    featured: true,
    type: "web",
  },
  {
    id: "skyza",
    title: "Skyza Car Rental",
    subtitle: "Self-drive rental platform",
    category: "Mobility / Web",
    year: "2025",
    description:
      "A comprehensive self-drive car rental platform featuring fleet browsing, a complete booking flow, and a dealer management console. Built to serve both end customers and the dealer network with a clean, high-performance interface.",
    technologies: ["React", "Node.js", "Express.js", "MongoDB"],
    url: "https://skyzacarrental.com",
    image: "/projects/skyza.jpg",
    role: "Full-Stack Developer",
    featured: true,
    type: "web",
  },
  {
    id: "rajvilla",
    title: "Raj Villa Stays",
    subtitle: "Heritage homestay website",
    category: "Hospitality / Web",
    year: "2025",
    description:
      "A booking website for Raj Villa Stays, a private boutique homestay in Jaipur. Crafted to reflect the intimate, heritage atmosphere of the property through immersive design and a streamlined booking experience.",
    technologies: ["Next.js", "React", "Supabase"],
    url: "https://rajvillastays.com",
    image: "/projects/rajvilla.jpg",
    role: "Full-Stack Developer",
    featured: true,
    type: "web",
  },
  {
    id: "cafesetu",
    title: "CafeSetu",
    subtitle: "Cafe management platform",
    category: "SaaS / Management",
    year: "2025",
    description:
      "An all-in-one cafe management platform built to streamline daily operations. Covers order management, table overview, menu management, and real-time performance dashboards for cafe owners and staff.",
    technologies: ["React", "Node.js", "Express.js", "PostgreSQL"],
    url: "https://cafe-setu.vercel.app",
    image: "/projects/cafesetu.jpg",
    role: "Full-Stack Developer",
    featured: true,
    type: "web",
  },
  {
    id: "artisty",
    title: "ARtisTry",
    subtitle: "AR/VR virtual simulation game",
    category: "Game Dev / UE5",
    year: "2024",
    description:
      "An immersive third-person AR/VR virtual simulation game built in Unreal Engine 5. Features dynamic sound design, minimap navigation, cinematic cutscenes, and a rich interactive environment. Developed as part of a 3-member team.",
    technologies: ["Unreal Engine 5", "Blueprints", "AR/VR"],
    image: "/projects/artisty.jpg",
    role: "Game Developer (3-member team)",
    featured: false,
    type: "game",
  },
  {
    id: "forecasting",
    title: "Time-Series Forecasting Validation",
    subtitle: "Research & model validation",
    category: "Research / Data Science",
    year: "2024",
    description:
      "A rigorous academic research project validating time-series forecasting models. Implemented and compared ARIMA and SARIMA models using RMSE, MAPE, and Ljung-Box test metrics. Applied cross-validation and systematic parameter tuning to evaluate predictive accuracy.",
    technologies: ["Python", "ARIMA", "SARIMA", "Data Analysis"],
    image: "/projects/forecasting.jpg",
    role: "Researcher",
    featured: false,
    type: "research",
  },
];

export interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  type: string;
  description: string;
}

export const experiences: Experience[] = [
  {
    id: "janki",
    period: "2026 – Present",
    role: "Full Stack Developer",
    company: "The Janki",
    type: "FULL-TIME / ONGOING",
    description:
      "Working as a full stack developer, contributing across front-end and back-end development on production systems.",
  },
  {
    id: "meda",
    period: "2026 – Present",
    role: "Web Development Freelancer",
    company: "Meda Studio",
    type: "FREELANCE",
    description:
      "Developing a client website end-to-end as an ongoing freelance engagement, managing the full development lifecycle.",
  },
  {
    id: "independent",
    period: "2025 – Present",
    role: "Freelance Web Developer",
    company: "Independent",
    type: "REMOTE / FREELANCE",
    description:
      "Designed, built and deployed production websites for independent clients across hospitality and mobility verticals.",
  },
  {
    id: "webspot",
    period: "Jan '26 – Mar '26",
    role: "Web Development Intern",
    company: "Digital Webspot",
    type: "REMOTE / INTERNSHIP",
    description:
      "Built and deployed websites for real clients that are currently live in production.",
  },
];

export const skills = {
  programming: ["Java", "JavaScript", "HTML", "CSS", "C", "C++", "Python"],
  frameworks: ["React", "Next.js", "Flutter", "Arduino"],
  backend: ["Node.js", "Express.js", "MongoDB"],
  databases: ["MySQL", "PostgreSQL", "Supabase"],
  soft: [
    "Quick Learning & Flexibility",
    "Leadership",
    "Communication",
    "Project Management",
    "Analytical Thinking",
    "Problem-Solving",
  ],
};

export const education = [
  {
    degree: "Bachelor of Technology",
    field: "Computer Science & Engineering",
    institution: "JK Lakshmipat University",
    location: "Jaipur, India",
    period: "2022 – 2026",
  },
  {
    degree: "Higher Secondary",
    field: "",
    institution: "Jayshree Periwal High School",
    location: "Jaipur, India",
    period: "2021 – 2022",
    grades: "11th: 86%  ·  12th: 78%",
  },
];

export const leadership = [
  {
    role: "Transportation Committee Core",
    event: "Sabrang '24",
    description: "Managed logistics and transportation for 500+ attendees.",
  },
  {
    role: "Discipline Committee Coordinator",
    event: "Sabrang '23",
    description: "",
  },
  {
    role: "Organiser",
    event: "Tech Fest 2023",
    description: "Organised BGMI Tournament.",
  },
  {
    role: "Promotions Committee Volunteer",
    event: "Sabrang '22",
    description: "",
  },
  {
    role: "Event Assistance",
    event: "JKLU Robotics & Automation Team",
    description: "",
  },
  {
    role: "Volunteer",
    event: "Smart India Hackathon",
    description: "",
  },
];
