import React from "react";
import { useDraggable } from "@dnd-kit/core";

const questionTypes = [
  { id: "palette-short", type: "short-text", label: "Short Text Response" },
  { id: "palette-long", type: "long-text", label: "Long Text Response" },
  { id: "palette-multi", type: "multiple-choice", label: "Multiple Choice" },
  { id: "palette-checkbox", type: "multiple-checkbox", label: "Checkboxes" },
  { id: "palette-file", type: "file-upload", label: "File Upload" },
];

export default function QuestionPalette() {
  return (
    <div className="border p-4 rounded-lg w-1/3">
      <h3 className="font-semibold mb-4">Base Question Types</h3>
      {questionTypes.map((q) => (
        <DraggablePaletteItem key={q.id} item={q} />
      ))}
    </div>
  );
}

function DraggablePaletteItem({ item }: any) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: item.id,
    data: item,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="border rounded p-3 mb-2  hover:bg-gray-500 cursor-move"
    >
      {item.label}
    </div>
  );
}
