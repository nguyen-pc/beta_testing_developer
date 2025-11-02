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
    <div
      className="w-1/3 rounded-xl border border-gray-600 bg-gradient-to-br from-white to-gray-50 
                 shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-5 transition-all duration-300 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
    >
      <h3 className="font-semibold text-gray-800 mb-4 text-lg border-b border-gray-200 pb-2">
        Base Question Types
      </h3>
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
      className="border border-gray-300 rounded p-3 mb-2  cursor-move hover:bg-indigo-50 hover:border-indigo-400  
                 transition-all duration-200 shadow-sm hover:shadow-md select-none hover:text-black"
    >
      {item.label}
    </div>
  );
}
