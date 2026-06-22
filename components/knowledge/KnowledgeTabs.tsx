"use client";

type Tab = "seeds" | "skills";

interface KnowledgeTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function KnowledgeTabs({ activeTab, onTabChange }: KnowledgeTabsProps) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "seeds", label: "Gourd Seeds" },
    { id: "skills", label: "Skill Trees" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "0.25rem",
        padding: "0.5rem 1.25rem",
        borderBottom: "1px solid #2A2724",
        background: "rgba(14,13,11,0.6)",
        position: "sticky",
        top: "57px",
        zIndex: 50,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: "0.4rem 1rem",
              border: "none",
              borderRadius: "4px",
              background: isActive ? "rgba(201,162,39,0.15)" : "transparent",
              color: isActive ? "#C9A227" : "#9B9488",
              fontSize: "0.8rem",
              fontFamily: "var(--font-sans, sans-serif)",
              fontWeight: isActive ? 500 : 400,
              cursor: "pointer",
              letterSpacing: "0.04em",
              borderBottom: isActive ? "2px solid #C9A227" : "2px solid transparent",
              transition: "all 0.15s",
              minHeight: "36px",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
