import { join, sep } from "node:path";

import { getProjectRoot } from "./helpers";

export type SkillSummary = {
  id: string;
  name: string;
  description: string;
  path: string;
};

const parseSkillFrontmatterValue = (content: string, key: string) => {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  const frontmatter = frontmatterMatch[1];
  const keyMatch = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!keyMatch) return null;
  return keyMatch[1].trim().replace(/^['"]|['"]$/g, "");
};

export const listSkillSummaries = async (): Promise<SkillSummary[]> => {
  const skillsDir = join(getProjectRoot(), ".agent", "skills");
  const glob = new Bun.Glob("*/SKILL.md");
  const skills: SkillSummary[] = [];

  for await (const file of glob.scan({ cwd: skillsDir })) {
    const fullPath = join(skillsDir, file);
    const content = await Bun.file(fullPath).text();
    const id = file.split(sep)[0];
    const name = parseSkillFrontmatterValue(content, "name") ?? id;
    const description =
      parseSkillFrontmatterValue(content, "description") ??
      "No description provided.";

    skills.push({
      id,
      name,
      description,
      path: `.agent/skills/${id}/SKILL.md`,
    });
  }

  return skills.sort((a, b) => a.id.localeCompare(b.id));
};

// Registration call sites live in the server entry point and the
// scripts/mcp/ modules; scan all of them so the parsed capability list
// matches what the running server registers.
const readRegistrationSource = async (): Promise<string> => {
  const root = getProjectRoot();
  const sources: string[] = [];

  sources.push(
    await Bun.file(join(root, "scripts", "mcp-server.ts"))
      .text()
      .catch(() => ""),
  );

  const glob = new Bun.Glob("*.ts");
  const moduleFiles: string[] = [];
  for await (const file of glob.scan({ cwd: join(root, "scripts", "mcp") })) {
    moduleFiles.push(file);
  }

  for (const file of moduleFiles.sort()) {
    sources.push(
      await Bun.file(join(root, "scripts", "mcp", file))
        .text()
        .catch(() => ""),
    );
  }

  return sources.join("\n");
};

export const parseMcpCapabilitiesFromSource = async () => {
  const source = await readRegistrationSource();

  const toolMatches = [
    ...source.matchAll(/server\.tool\(\s*"([^"]+)"\s*,\s*"([^"]+)"/g),
    ...source.matchAll(/registerTool\(\s*"([^"]+)"\s*,\s*"([^"]+)"/g),
  ];
  const tools = Array.from(
    new Map(
      toolMatches.map((match) => [
        match[1],
        { name: match[1], description: match[2] },
      ]),
    ).values(),
  );

  const resourceMatches = [
    ...source.matchAll(/server\.resource\(\s*"([^"]+)"\s*,\s*"([^"]+)"/g),
    ...source.matchAll(/registerResource\(\s*"([^"]+)"\s*,\s*"([^"]+)"/g),
  ];
  const resources = Array.from(
    new Map(
      resourceMatches.map((match) => [
        match[1],
        { name: match[1], uri: match[2] },
      ]),
    ).values(),
  );

  return {
    tools,
    resources,
  };
};

export const getAgentInterfaceContract = async () => {
  const [{ tools, resources }, skills] = await Promise.all([
    parseMcpCapabilitiesFromSource(),
    listSkillSummaries(),
  ]);

  return {
    protocol: "Model Context Protocol (MCP)",
    server: {
      name: "etorg-mcp-server",
      entrypoint: "bun run mcp",
      transport: "stdio",
    },
    capabilities: {
      tools,
      resources,
      prompts: ["design-engineer", "code-review"],
    },
    skills,
    recommendedClientFlow: [
      "Read agent://contract for machine-readable server and skill metadata.",
      "Call list_mcp_capabilities to verify runtime-registered tools/resources.",
      "Call list_workflows to discover skill IDs and then read_workflow for execution details.",
      "Use validate_changed_files and summarize_checks for check planning and reporting.",
    ],
  };
};
