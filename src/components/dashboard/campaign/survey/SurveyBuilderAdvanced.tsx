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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CSS } from "@dnd-kit/utilities";
import QuestionPalette from "./QuestionPalette";
import QuestionEditor from "./QuestionEditor";
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../project/PageContainer";

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
  const navigate = useNavigate();
  const { projectId, campaignId } = useParams();
  const handleBack = () => {
    navigate(
      `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/survey`
    );
  };

  const handleContinue = () => {
    navigate(
      `/dashboard/projects/${projectId}/campaigns/new/${campaignId}/survey`
    );
  };

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
    <PageContainer>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full h-full flex gap-4 p-4">
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
        <div className="flex justify-between mb-4 mt-7">
          <Button
            variant="contained"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </DndContext>
    </PageContainer>
  );
}

function BuilderArea({ questions, activeId, onChange, onDelete }: any) {
  const { setNodeRef, isOver } = useDroppable({ id: "builder-zone" });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 p-4 pb-32 rounded-lg border-2 border-dashed transition 
    min-h-[600px] h-[calc(100vh-120px)] overflow-y-auto 
    ${isOver ? "bg-green-50" : ""}`}
    >
      <h2 className="font-semibold mb-3">
        Drag and drop questions to build your survey:
      </h2>

      <SortableContext
        items={questions.map((q: any) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        {questions.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            Kéo thả câu hỏi từ danh sách bên trái vào đây
          </p>
        )}
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
      className="p-3 mb-3 rounded shadow-sm border cursor-default"
      {...attributes}
    >
      {/* Nội dung form - không bị ảnh hưởng bởi drag */}
      <QuestionEditor
        question={question}
        onChange={(updated: any) => onChange(id, updated)}
        onDelete={() => onDelete(id)}
      />
    </div>
  );
}
