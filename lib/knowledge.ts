import rawKnowledge from "@/data/sekiro-knowledge.json";

export type GourdSeed = {
  id: string;
  order: number;
  location: string;
  tip: string;
};

export type SkillPriority = "get-first" | "must-have" | "good-vs";

export type Skill = {
  id: string;
  name: string;
  priority: SkillPriority;
  goodVsLabel?: string;
  note: string;
  prerequisite?: string;
};

export type SkillTree = {
  id: string;
  name: string;
  order: number;
  skills: Skill[];
};

export type KnowledgeContent = {
  gourdSeeds: GourdSeed[];
  skillTrees: SkillTree[];
};

const knowledge = rawKnowledge as KnowledgeContent;
export default knowledge;

export const gourdSeeds: GourdSeed[] = [...knowledge.gourdSeeds].sort((a, b) => a.order - b.order);
export const skillTrees: SkillTree[] = [...knowledge.skillTrees].sort((a, b) => a.order - b.order);
