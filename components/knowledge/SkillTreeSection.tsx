"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SkillTree, Skill, SkillPriority } from "@/lib/knowledge";

interface SkillTreeSectionProps {
  tree: SkillTree;
  treeIndex: number;
}

function priorityStyle(priority: SkillPriority): React.CSSProperties {
  if (priority === "get-first") {
    return {
      background: "rgba(201,162,39,0.15)",
      border: "1px solid rgba(201,162,39,0.4)",
      color: "#C9A227",
    };
  }
  if (priority === "must-have") {
    return {
      background: "rgba(180,50,50,0.15)",
      border: "1px solid rgba(180,50,50,0.4)",
      color: "#D96060",
    };
  }
  // good-vs
  return {
    background: "rgba(74,122,106,0.15)",
    border: "1px solid rgba(74,122,106,0.4)",
    color: "#5A9A8A",
  };
}

function priorityLabel(skill: Skill): string {
  if (skill.priority === "get-first") return "Get First";
  if (skill.priority === "must-have") return "Must-Have";
  return `Good vs: ${skill.goodVsLabel ?? ""}`;
}

interface SkillRowProps {
  skill: Skill;
  index: number;
  treeIndex: number;
}

function SkillRow({ skill, index, treeIndex }: SkillRowProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.2, delay: (treeIndex * 0.05) + (index * 0.04) }}
      style={{
        padding: "0.75rem 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Name + priority tag row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "0.35rem",
        }}
      >
        <span
          style={{
            color: "#E8E2D4",
            fontSize: "0.85rem",
            fontWeight: 500,
            fontFamily: "var(--font-sans, sans-serif)",
            lineHeight: 1.4,
          }}
        >
          {skill.name}
        </span>
        <span
          style={{
            fontSize: "0.65rem",
            fontFamily: "var(--font-sans, sans-serif)",
            letterSpacing: "0.04em",
            padding: "1px 6px",
            borderRadius: "3px",
            lineHeight: "1.6",
            flexShrink: 0,
            alignSelf: "center",
            ...priorityStyle(skill.priority),
          }}
        >
          {priorityLabel(skill)}
        </span>
      </div>

      {/* Note */}
      <div
        style={{
          color: "#9B9488",
          fontSize: "0.78rem",
          lineHeight: 1.6,
          fontFamily: "var(--font-sans, sans-serif)",
        }}
      >
        {skill.note}
      </div>

      {/* Prerequisite */}
      {skill.prerequisite && (
        <div
          style={{
            color: "#6B6560",
            fontSize: "0.72rem",
            lineHeight: 1.5,
            fontStyle: "italic",
            fontFamily: "var(--font-sans, sans-serif)",
            marginTop: "0.25rem",
          }}
        >
          {skill.prerequisite}
        </div>
      )}
    </motion.div>
  );
}

export default function SkillTreeSection({ tree, treeIndex }: SkillTreeSectionProps) {
  return (
    <div
      style={{
        borderBottom: "1px solid #2A2724",
        paddingBottom: "0.5rem",
        marginBottom: "0.5rem",
      }}
    >
      {/* Tree header */}
      <div
        style={{
          padding: "1rem 1.25rem 0.25rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-serif, serif)",
            fontSize: "1rem",
            fontWeight: 500,
            color: "#C9A227",
            letterSpacing: "0.06em",
            margin: 0,
          }}
        >
          {tree.name}
        </h3>
      </div>

      {/* Skills */}
      <div style={{ padding: "0 1.25rem" }}>
        {tree.skills.map((skill, i) => (
          <SkillRow key={skill.id} skill={skill} index={i} treeIndex={treeIndex} />
        ))}
      </div>
    </div>
  );
}
