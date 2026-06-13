"use client";

import { Region } from "@/lib/content";
import ChecklistRow from "./ChecklistRow";
import NavCueRow from "./NavCueRow";

interface ChecklistProps {
  region: Region;
  completedIds: Set<string>;
  spoilersOn: boolean;
  onToggle: (id: string, checked: boolean) => void;
}

export default function Checklist({ region, completedIds, spoilersOn, onToggle }: ChecklistProps) {
  return (
    <div>
      <h3
        style={{
          color: "#9B9488",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
          fontFamily: "var(--font-sans, sans-serif)",
        }}
      >
        Checklist
      </h3>

      <div>
        {region.checklist.map((item, i) => {
          if (item.isNavCue) {
            return (
              <NavCueRow
                key={item.id}
                item={item}
                ticked={completedIds.has(item.id)}
                onTick={onToggle}
                index={i}
              />
            );
          }

          return (
            <ChecklistRow
              key={item.id}
              item={item}
              checked={completedIds.has(item.id)}
              spoilersOn={spoilersOn}
              onToggle={onToggle}
              index={i}
            />
          );
        })}
      </div>
    </div>
  );
}
