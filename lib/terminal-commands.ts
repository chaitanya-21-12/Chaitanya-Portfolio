import { personalInfo, projects, skills, experiences } from "./data";

export interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "ascii";
  content: string;
}

const ASCII_ART = `   ██████╗ █████╗ 
  ██╔════╝██╔══██╗
  ██║     ███████║
  ██║     ██╔══██║
  ╚██████╗██║  ██║
   ╚═════╝╚═╝  ╚═╝`;

export const WELCOME_LINES: TerminalLine[] = [
  { type: "ascii", content: ASCII_ART },
  { type: "output", content: "  Chaitanya Aggarwal — Full-Stack Developer & Creative Technologist" },
  { type: "output", content: "" },
  { type: "output", content: "  Type `help` to see available commands." },
  { type: "output", content: "" },
];

function formatTable(rows: [string, string][]): string {
  const maxKey = Math.max(...rows.map(([k]) => k.length));
  return rows.map(([k, v]) => `  ${k.padEnd(maxKey + 2)}${v}`).join("\n");
}

export function executeCommand(input: string): TerminalLine[] {
  const cmd = input.trim().toLowerCase();
  const command = cmd.split(" ")[0];

  switch (command) {
    case "help":
      return [
        { type: "success", content: "Available commands:" },
        {
          type: "output",
          content: formatTable([
            ["about", "Who am I"],
            ["skills", "My tech stack"],
            ["projects", "My projects"],
            ["experience", "Work history"],
            ["contact", "Get in touch"],
            ["socials", "My social links"],
            ["whoami", "Quick intro"],
            ["clear", "Clear terminal"],
            ["exit", "Close terminal"],
          ]),
        },
        { type: "output", content: "" },
      ];

    case "whoami":
      return [
        { type: "success", content: personalInfo.name },
        { type: "output", content: `  Role     : ${personalInfo.title}` },
        { type: "output", content: `  Location : ${personalInfo.location}` },
        { type: "output", content: `  Status   : ${personalInfo.availability}` },
        { type: "output", content: `  Degree   : ${personalInfo.degree}` },
        { type: "output", content: "" },
      ];

    case "about":
      return [
        { type: "success", content: "About Me" },
        { type: "output", content: `  ${personalInfo.tagline}` },
        { type: "output", content: "" },
        { type: "output", content: `  ${personalInfo.degree}` },
        { type: "output", content: `  ${personalInfo.university} (${personalInfo.gradYear})` },
        { type: "output", content: "" },
        { type: "output", content: `  Email    : ${personalInfo.email}` },
        { type: "output", content: `  GitHub   : ${personalInfo.socials.github}` },
        { type: "output", content: `  LinkedIn : ${personalInfo.socials.linkedin}` },
        { type: "output", content: "" },
      ];

    case "skills":
      return [
        { type: "success", content: "Tech Stack" },
        { type: "output", content: `  Languages  : ${skills.programming.join(", ")}` },
        { type: "output", content: `  Frameworks : ${skills.frameworks.join(", ")}` },
        { type: "output", content: `  Backend    : ${skills.backend.join(", ")}` },
        { type: "output", content: "" },
      ];

    case "projects":
      return [
        { type: "success", content: "Projects" },
        ...projects.map((p) => ({
          type: "output" as const,
          content: `  [${p.year}] ${p.title} — ${p.subtitle}\n          Stack: ${p.technologies.slice(0, 4).join(", ")}${p.url ? `\n          URL: ${p.url}` : ""}`,
        })),
        { type: "output", content: "" },
      ];

    case "experience":
      return [
        { type: "success", content: "Work Experience" },
        ...experiences.map((e) => ({
          type: "output" as const,
          content: `  [${e.period}] ${e.role} @ ${e.company}  (${e.type})`,
        })),
        { type: "output", content: "" },
      ];

    case "contact":
      return [
        { type: "success", content: "Contact" },
        { type: "output", content: `  Email    : ${personalInfo.email}` },
        { type: "output", content: `  Phone    : ${personalInfo.phone}` },
        { type: "output", content: `  Location : ${personalInfo.location}` },
        { type: "output", content: "" },
      ];

    case "socials":
      return [
        { type: "success", content: "Social Links" },
        { type: "output", content: `  GitHub    : ${personalInfo.socials.github}` },
        { type: "output", content: `  LinkedIn  : ${personalInfo.socials.linkedin}` },
        { type: "output", content: `  Instagram : ${personalInfo.socials.instagram}` },
        { type: "output", content: "" },
      ];

    case "clear":
      return [{ type: "output", content: "__CLEAR__" }];

    case "exit":
      return [{ type: "output", content: "__EXIT__" }];

    case "":
      return [];

    default:
      return [
        {
          type: "error",
          content: `Command not found: '${command}'. Type \`help\` for available commands.`,
        },
      ];
  }
}
