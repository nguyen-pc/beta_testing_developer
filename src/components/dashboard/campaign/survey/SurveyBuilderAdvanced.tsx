import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import QuestionPalette from "./QuestionPalette";
import QuestionEditor from "./QuestionEditor";

// // 👉 Tạo sẵn component QuestionEditor ngay trong file này
// function QuestionEditor({ question, onChange, onDelete }: any) {
//   const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onChange({ label: e.target.value });
//   };

//   const handleOptionChange = (index: number, value: string) => {
//     const updatedOptions = [...(question.options || [])];
//     updatedOptions[index] = value;
//     onChange({ options: updatedOptions });
//   };

//   const addOption = () => {
//     onChange({ options: [...(question.options || []), "New Option"] });
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-2">
//         <h4 className="font-semibold">{question.label || "Untitled Question"}</h4>
//         <button
//           onClick={onDelete}
//           className="text-red-500 hover:text-red-700 text-sm"
//         >
//           ✕ Delete
//         </button>
//       </div>

//       {/* Câu hỏi ngắn */}
//       {question.type === "short-text" && (
//         <>
//           <input
//             type="text"
//             className="border p-2 w-full rounded"
//             placeholder="Enter your question"
//             value={question.label}
//             onChange={handleLabelChange}
//           />
//           <input
//             type="text"
//             className="border mt-2 p-2 w-full rounded bg-gray-50"
//             placeholder="User short answer..."
//             disabled
//           />
//         </>
//       )}

//       {/* Câu hỏi dài */}
//       {question.type === "long-text" && (
//         <>
//           <input
//             type="text"
//             className="border p-2 w-full rounded"
//             placeholder="Enter your question"
//             value={question.label}
//             onChange={handleLabelChange}
//           />
//           <textarea
//             className="border mt-2 p-2 w-full rounded bg-gray-50"
//             placeholder="User long answer..."
//             disabled
//           ></textarea>
//         </>
//       )}

//       {/* Trắc nghiệm */}
//       {question.type === "multiple-choice" && (
//         <>
//           <input
//             type="text"
//             className="border p-2 w-full rounded"
//             placeholder="Enter your question"
//             value={question.label}
//             onChange={handleLabelChange}
//           />
//           <div className="mt-2">
//             {(question.options || []).map((opt: string, index: number) => (
//               <input
//                 key={index}
//                 type="text"
//                 className="border p-2 w-full rounded mb-1"
//                 value={opt}
//                 onChange={(e) => handleOptionChange(index, e.target.value)}
//               />
//             ))}
//             <button
//               onClick={addOption}
//               className="text-blue-500 text-sm mt-1 hover:underline"
//             >
//               + Add Option
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

interface Question {
  id: string;
  type: string;
  label: string;
  options?: string[];
}

export default function SurveyBuilderAdvanced() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    // Thả từ palette vào builder
    if (active.id.startsWith("palette") && over.id === "builder-zone") {
      const newQuestion: Question = {
        id: `q-${Date.now()}`,
        type: active.data.current.type,
        label: "",
        options:
          active.data.current.type === "multiple-choice" ? ["Option 1"] : [],
      };
      setQuestions((prev) => [...prev, newQuestion]);
    }
    // Sắp xếp lại trong builder
    else if (active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setQuestions((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }

    setActiveId(null);
  };

  const handleChangeQuestion = (id: string, updated: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
    );
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4">
        {/* Bảng câu hỏi gốc */}
        <QuestionPalette />

        {/* Khu vực builder */}
        <BuilderArea
          questions={questions}
          activeId={activeId}
          onChange={handleChangeQuestion}
          onDelete={handleDelete}
        />
      </div>
    </DndContext>
  );
}

function BuilderArea({ questions, activeId, onChange, onDelete }: any) {
  const { setNodeRef, isOver } = useDroppable({ id: "builder-zone" });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 p-4 rounded-lg min-h-[600px] border transition ${
        isOver ? "bg-green-50" : "bg-gray-50"
      }`}
    >
      <h2 className="font-semibold mb-3">
        Drag and drop questions to build your survey:
      </h2>

      <SortableContext
        items={questions.map((q: any) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        {questions.map((q: any) => (
          <SortableQuestionItem
            key={q.id}
            id={q.id}
            question={q}
            onChange={onChange}
            onDelete={onDelete}
          />
        ))}
      </SortableContext>

      <DragOverlay>
        {activeId && (
          <div className="p-3 bg-white shadow rounded">Dragging...</div>
        )}
      </DragOverlay>
    </div>
  );
}

function SortableQuestionItem({ id, question, onChange, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-3 mb-3 rounded shadow-sm border cursor-default"
      {...attributes}
    >
      {/* Thanh header chứa handle để kéo */}
      <div
        {...listeners}
        className="flex justify-between items-center mb-2 cursor-grab"
      >
        {/* <h4 className="font-semibold text-gray-700 flex items-center gap-1">
          <span className="text-gray-400 select-none">⋮⋮</span>
          {question.label || "Untitled Question"}
        </h4> */}
        {/* <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          ✕ Delete
        </button> */}
      </div>

      {/* Nội dung form - không bị ảnh hưởng bởi drag */}
      <QuestionEditor
        question={question}
        onChange={(updated: any) => onChange(id, updated)}
        onDelete={() => onDelete(id)}
      />
    </div>
  );
}
